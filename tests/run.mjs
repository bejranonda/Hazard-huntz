// Unit tests for the game rules (no browser needed): node tests/run.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHouse, playableRooms, MIN_HIT } from '../public/js/house.js';
import { Round, STATUS, waterY, rankTier } from '../public/js/round.js';
import { makeRng, isValidHouseKey } from '../public/js/rng.js';
import { bangkokDateKey, formatHouseDate, daysBetween, setKeepTogether, keptSpans } from '../public/js/util.js';
import { challengeUrl, parseChallenge } from '../public/js/share.js';
import { Run } from '../public/js/run.js';
import { guessLang, langPath, pathLang, isBot } from '../public/js/content.js';
import { setModes, setGuides, propFor, modeList, codeOf, idOfCode, seasonalMode, mk, switchOn, recommend, modeLink, activeAlert } from '../public/js/modes.js';
import { bookPool, correctIds, mergeLearned, topicProgress, completedTopics } from '../public/js/collection.js';
import { kitPlan, kitScore, kitMissing, fridgePlan, fridgeFoods, medDays, airLevel, airAdvice, maskAdvice, hotAdvice, waterDays, tankDose, bagList, safeMessage } from '../public/js/kitplan.js';
import { wrapText } from '../public/js/cards.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content', `${f}.json`), 'utf8'));
const items = load('items');
const C = {
  config: load('config'),
  items: items.items,
  decoys: items.decoys,
  rooms: load('rooms').rooms,
};

setModes(C.config.modes);

let passed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failures.push(`✗ ${name}\n  ${e.message}`);
  }
}

const days = Array.from({ length: 366 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 9, 1) + i * 86400000);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
});

test('rng is deterministic per seed', () => {
  const a = makeRng('x'), b = makeRng('x'), c = makeRng('y');
  const sa = [a.next(), a.next(), a.next()];
  assert.deepEqual(sa, [b.next(), b.next(), b.next()]);
  assert.notDeepEqual(sa, [c.next(), c.next(), c.next()]);
});

test('same daily key builds the same house; different keys differ', () => {
  const h1 = generateHouse(C, 'prepare', '20261007');
  const h2 = generateHouse(C, 'prepare', '20261007');
  const h3 = generateHouse(C, 'prepare', '20261008');
  const sig = (h) => h.targets.concat(h.decoys).map((p) => `${p.pid}@${p.slot}`).join(',');
  assert.equal(sig(h1), sig(h2));
  assert.notEqual(sig(h1), sig(h3));
});

for (const mode of C.config.modes.map((m) => m.id)) {
  test(`${mode}: a year of daily houses all follow the round rules`, () => {
    const seen = new Set();
    const roomIds = playableRooms(C).map((r) => r.id);
    for (const day of days) {
      const h = generateHouse(C, mode, day);
      const n = h.targets.length;
      assert.ok(n >= C.config.round.targetsMin && n <= C.config.round.targetsMax, `${day}: ${n} targets`);
      assert.ok(h.decoys.length >= C.config.round.decoysMin - 1 && h.decoys.length <= C.config.round.decoysMax, `${day}: ${h.decoys.length} decoys`);
      for (const r of roomIds) assert.ok(h.targets.some((p) => p.room === r), `${day}: no target in ${r}`);
      if (mode === 'prepare') assert.ok(h.targets.some((p) => p.ref.critical), `${day}: no critical item`);
      if (modeList().find((m) => m.id === mode)?.threat === 'dark') assert.ok(h.targets.some((p) => p.ref.lostAfter != null), `${day}: nothing goes bad in the power cut`);
      const slots = new Set();
      for (const p of [...h.targets, ...h.decoys]) {
        assert.ok(!slots.has(p.slot), `${day}: slot ${p.slot} used twice`);
        slots.add(p.slot);
        assert.ok(p.hit.w >= MIN_HIT && p.hit.h >= MIN_HIT, `${day}: ${p.pid} tap area too small`);
        assert.equal(p.ref.mode, mode);
        seen.add(p.ref.id);
      }
      for (const p of h.targets) {
        assert.equal(p.choices.filter((c) => c.correct).length, 1);
      }
    }
    const playable = C.items.filter((i) => i.mode === mode && roomIds.includes(i.room));
    for (const it of playable) assert.ok(seen.has(it.id), `${it.id} never appears in a year of daily houses`);
  });
}

function fakeClock() {
  let now = 0;
  return { now: () => now, advance: (ms) => { now += ms; } };
}

test('prepare: water rises, low items flood first, floor gets wet', () => {
  const clock = fakeClock();
  const house = generateHouse(C, 'prepare', '20261007');
  const floods = [];
  let wet = false;
  const r = new Round({ house, config: C.config, clock: clock.now, on: { flood: (p) => floods.push(p), wet: () => { wet = true; } } });
  r.start();
  assert.equal(r.waterLevel, C.config.round.prepare.water[0][1]);
  for (let i = 0; i < 61; i++) {
    clock.advance(1000);
    r.tick();
  }
  assert.ok(r.ended);
  assert.ok(wet, 'floor never got wet');
  for (let i = 1; i < floods.length; i++) assert.ok(floods[i - 1].cy >= floods[i].cy - 0.01, 'a higher item flooded before a lower one');
  const res = r.result();
  assert.equal(res.correct, 0);
  assert.equal(res.score10, 0);
  assert.ok(res.records.every((x) => x.status === STATUS.FLOODED || x.status === STATUS.MISSED));
});

test('power cut: fridge food goes bad at 4 story hours, the freezer never does in 12', () => {
  const stock = modeList().find((m) => m.threat === 'dark');
  assert.ok(stock, 'a power-cut mode exists');
  const cfg = C.config.round[stock.id];
  const fridge = C.items.find((i) => i.mode === stock.id && i.lostAfter != null);
  const freezer = C.items.find((i) => i.mode === stock.id && i.id === 's-freezer');
  assert.equal(fridge.lostAfter, 4, 'CDC: a closed fridge keeps food safe about 4 hours');
  assert.equal(freezer.lostAfter, undefined, 'CDC: a full freezer holds about 48 hours, longer than the 12-hour round');
  // Find a house with the fridge in it and run the clock.
  const day = days.find((d) => generateHouse(C, stock.id, d).targets.some((p) => p.ref.id === fridge.id));
  const h = generateHouse(C, stock.id, day);
  const clock = fakeClock();
  const lost = [];
  const r = new Round({ house: h, config: C.config, clock: clock.now, on: { flood: (p) => lost.push([p.ref.id, r.hoursOut]) } });
  r.start();
  const hourMs = (cfg.seconds * 1000) / cfg.hours;
  clock.advance(hourMs * 3.9); r.tick();
  assert.equal(lost.length, 0, 'nothing lost before 4 hours');
  assert.ok(r.darkLevel > 0 && r.darkLevel < 1);
  clock.advance(hourMs * 0.2); r.tick();
  assert.deepEqual(lost.map((x) => x[0]), [fridge.id], 'the fridge is lost at 4 hours');
  assert.equal(r.records.get(`t-${fridge.id}`).status, STATUS.FLOODED);
  clock.advance(hourMs * 7.8); r.tick();
  assert.equal(lost.length, 1, 'nothing else goes bad');
  assert.ok(!r.ended || r.endReason === 'time');
});

test('water keyframes are monotonic and end above the counter', () => {
  const kf = C.config.round.prepare.water;
  for (let i = 1; i < kf.length; i++) assert.ok(kf[i][1] < kf[i - 1][1] && kf[i][0] > kf[i - 1][0]);
  assert.equal(waterY(0, kf), kf[0][1]);
  assert.equal(waterY(1, kf), kf[kf.length - 1][1]);
});

test('scoring: all correct with priority bonus is 10/10; wrong answers cost time', () => {
  const clock = fakeClock();
  const house = generateHouse(C, 'prepare', '20261009');
  const r = new Round({ house, config: C.config, clock: clock.now });
  r.start();
  const first = house.targets[0];
  const wrong = first.choices.find((c) => !c.correct);
  const before = r.elapsed;
  const res = r.choose(first, wrong);
  assert.equal(res.correct, false);
  assert.equal(r.elapsed - before, C.config.round.wrongPenaltySec * 1000);
  assert.equal(r.records.get(first.pid).status, STATUS.LEARNED);

  const clock2 = fakeClock();
  const r2 = new Round({ house, config: C.config, clock: clock2.now });
  r2.start();
  for (const p of house.targets) r2.choose(p, r2.choicesFor(p).find((c) => c.correct));
  r2.tick();
  const out = r2.result();
  assert.equal(out.score10, 10);
  assert.equal(out.tier, 2);
  assert.equal(out.bonusHits, house.targets.filter((p) => p.ref.critical).length);
});

test('breaker switches to the "wet" answer once water is inside', () => {
  let house = null;
  for (const day of days) {
    const h = generateHouse(C, 'prepare', day);
    if (h.targets.some((p) => p.ref.id === 'p-breaker')) { house = h; break; }
  }
  assert.ok(house, 'no house with the breaker');
  const clock = fakeClock();
  const r = new Round({ house, config: C.config, clock: clock.now });
  r.start();
  const breaker = house.targets.find((p) => p.ref.id === 'p-breaker');
  assert.equal(r.variantFor(breaker), 'normal');
  while (!r.floorWet) {
    clock.advance(500);
    r.tick();
  }
  assert.equal(r.variantFor(breaker), 'wet');
  const right = r.choicesFor(breaker).find((c) => c.correct);
  assert.match(right.label.th, /1130/);
  const res = r.choose(breaker, right);
  assert.equal(res.correct, true);
  assert.equal(res.bonus, 0, 'no priority bonus once water is inside');
});

test('rank tiers follow the thresholds', () => {
  assert.equal(rankTier(0), 0);
  assert.equal(rankTier(4), 0);
  assert.equal(rankTier(5), 1);
  assert.equal(rankTier(7), 1);
  assert.equal(rankTier(8), 2);
  assert.equal(rankTier(10), 2);
});

test('challenge links round-trip', () => {
  const url = challengeUrl('https://example.org', 'return', 9, '20261007');
  assert.equal(url, 'https://example.org/c/r9?h=20261007');
  const u = new URL(url);
  assert.deepEqual(parseChallenge(u), { mode: 'return', score: 9, houseKey: '20261007' });
  assert.equal(parseChallenge(new URL('https://example.org/c/p11?h=1')), null);
  assert.equal(parseChallenge(new URL('https://example.org/')), null);
  assert.ok(isValidHouseKey('20261007') && isValidHouseKey('rab23cd') && !isValidHouseKey('../x'));
});

test('international: /en links, language guess and path switching', () => {
  assert.equal(challengeUrl('https://example.org', 'prepare', 8, '20261007', 'en'), 'https://example.org/en/c/p8?h=20261007');
  assert.deepEqual(parseChallenge(new URL('https://example.org/en/c/p8?h=20261007')), { mode: 'prepare', score: 8, houseKey: '20261007' });
  assert.equal(parseChallenge(new URL('https://example.org/en/x/c/p8')), null);
  assert.equal(pathLang('/en/'), 'en');
  assert.equal(pathLang('/en/c/r3'), 'en');
  assert.equal(pathLang('/english'), null);
  assert.equal(pathLang('/'), null);
  // Thai browser, or a Thai on English phone settings in Thailand: Thai.
  assert.equal(guessLang(['th-TH'], 'Europe/Berlin'), 'th');
  assert.equal(guessLang(['en-US', 'th'], 'America/New_York'), 'th');
  assert.equal(guessLang(['en-US'], 'Asia/Bangkok'), 'th');
  // Everyone else: English.
  assert.equal(guessLang(['en-GB'], 'Europe/London'), 'en');
  assert.equal(guessLang(['de-DE', 'en'], 'Europe/Berlin'), 'en');
  for (const [th, en] of [['/', '/en/'], ['/c/p8', '/en/c/p8'], ['/checklist/return', '/en/checklist/return']]) {
    assert.equal(langPath(th, 'en'), en);
    assert.equal(langPath(en, 'th'), th);
    assert.equal(langPath(en, 'en'), en);
  }
  assert.equal(langPath('/learn', 'en'), '/learn');
});

test('bots stay on the Thai page, people do not', () => {
  assert.ok(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'));
  assert.ok(isBot('Mozilla/5.0 (compatible; bingbot/2.0)'));
  assert.ok(isBot('facebookexternalhit/1.1'));
  assert.ok(!isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 Version/17.6 Mobile/15E148 Safari/604.1'));
  assert.ok(!isBot('Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 Chrome/129.0.0.0 Mobile Safari/537.36'));
});

test('mode registry: unique codes, links round-trip, season picks a mode', () => {
  const modes = modeList();
  assert.equal(new Set(modes.map((m) => m.code)).size, modes.length);
  for (const m of modes) {
    assert.equal(idOfCode(codeOf(m.id)), m.id);
    for (const s of [0, 7, 10]) {
      const u = new URL(challengeUrl('https://x.test', m.id, s, '20261007'));
      assert.deepEqual(parseChallenge(u), { mode: m.id, score: s, houseKey: '20261007' });
    }
    assert.ok(C.config.round[m.id]?.seconds > 0, `round.${m.id}`);
  }
  // Old links keep their letters.
  assert.equal(codeOf('prepare'), 'p');
  assert.equal(codeOf('return'), 'r');
  assert.equal(mk('rank', 'return'), 'rankReturn');
  assert.equal(seasonalMode(10, true), 'prepare');
  for (let month = 1; month <= 12; month++) assert.ok(modes.some((m) => m.id === seasonalMode(month, false)));
});

test('hand-set switches end by themselves on their end date (Bangkok, inclusive)', () => {
  assert.equal(switchOn(true, '2026-11-30', '20261130'), true);
  assert.equal(switchOn(true, '2026-11-30', '20261201'), false);
  assert.equal(switchOn(true, null, '20991231'), true);
  assert.equal(switchOn('health', '2026-11-15', '20261115'), true);
  assert.equal(switchOn(false, '2026-11-30', '20261001'), false);
  assert.equal(switchOn(null, null, '20261001'), false);
});

test('the start screen recommends a mode, a topic and says why', () => {
  // A fixed config, so the test never depends on today's date or on config.json.
  const cfg = {
    rainWarningActive: true, rainWarningUntil: '2026-11-30',
    featuredTopic: 'health', featuredTopicUntil: '2026-11-15',
    forecastAppUrl: 'https://flood.example/',
  };
  const r = (day, opt) => recommend(cfg, day, opt);
  assert.deepEqual(r('20261018'), { mode: 'prepare', topic: 'health', why: 'warning' });
  assert.deepEqual(r('20261116'), { mode: 'prepare', topic: null, why: 'warning' });
  assert.deepEqual(r('20261201'), { mode: 'dust', topic: 'air', why: 'season' });
  assert.deepEqual(r('20270410'), { mode: 'fire', topic: 'fire', why: 'season' });
  assert.deepEqual(r('20270615'), { mode: 'return', topic: null, why: 'season' });
  // The forecast app's answer beats the manual switch, both ways.
  assert.deepEqual(r('20261201', { live: true }), { mode: 'prepare', topic: null, why: 'live' });
  assert.deepEqual(r('20261018', { live: false }), { mode: 'return', topic: 'health', why: 'season' });
  // A ?mode= link wins and brings its own topic first; unknown ids are ignored.
  assert.deepEqual(r('20261018', { want: 'Dust' }), { mode: 'dust', topic: 'air', why: 'link' });
  assert.deepEqual(r('20261018', { want: 'return' }), { mode: 'return', topic: 'health', why: 'link' });
  assert.deepEqual(r('20261018', { want: 'heat' }), r('20261018'));
  // "Check before you go": dust → Air4Thai, flood modes → the forecast app, fire → none.
  assert.match(modeLink(cfg, 'dust'), /air4thai/);
  assert.equal(modeLink(cfg, 'prepare'), 'https://flood.example/');
  assert.equal(modeLink(cfg, 'return'), 'https://flood.example/');
  assert.equal(modeLink(cfg, 'fire'), '');
  // Every day of a year gives a mode in the registry.
  for (const day of days) assert.ok(modeList().some((m) => m.id === recommend(C.config, day).mode));
});

test('home check: amounts follow the household, special items follow the answers', () => {
  const kit = load('kit');
  const byId = (p, id) => p.items.find((x) => x.id === id);
  // Water: 3 L per person per day for 3 days (PRD); food 3 days; a flashlight each.
  for (const [n, litres] of [[1, 9], [3, 27], [10, 90]]) {
    const p = kitPlan(kit, { people: n });
    assert.equal(byId(p, 'water').total, litres, `${n} people`);
    assert.equal(byId(p, 'torch').total, n);
    assert.equal(byId(p, 'food').days, 3);
    assert.ok(!p.items.some((x) => x.item.for), 'no special items without answers');
  }
  // Out-of-range answers are clamped to 1–10 people.
  assert.equal(kitPlan(kit, { people: 0 }).people, 1);
  assert.equal(kitPlan(kit, { people: 99 }).people, 10);
  // Each answer adds its own items, and only those.
  const all = kitPlan(kit, { people: 4, flags: ['baby', 'elder', 'meds', 'pet'] });
  for (const id of ['baby', 'device', 'glasses', 'meds', 'medcold', 'pet']) assert.ok(byId(all, id), id);
  const meds = kitPlan(kit, { people: 2, flags: ['meds'] });
  assert.equal(byId(meds, 'meds').days, 7, 'daily medicine for at least 7 days (MOPH)');
  assert.ok(!byId(meds, 'baby') && !byId(meds, 'pet'));
  // Score and the card's "still missing": everyday items before the household's own.
  const plain = kitPlan(kit, { people: 3 });
  assert.deepEqual(kitScore(plain, []), { have: 0, total: plain.items.length, pct: 0 });
  assert.equal(kitScore(plain, plain.items.map((x) => x.id)).pct, 100);
  assert.ok(kitMissing(all, []).every((x) => !x.item.for), 'the shared card lists everyday items first');
  assert.equal(kitMissing(plain, plain.items.map((x) => x.id)).length, 0);
});

test('daily house resets at midnight Bangkok time', () => {
  assert.equal(bangkokDateKey(Date.UTC(2026, 9, 6, 16, 59)), '20261006');
  assert.equal(bangkokDateKey(Date.UTC(2026, 9, 6, 17, 0)), '20261007');
  assert.equal(formatHouseDate('20261007', 'th'), '7 ต.ค. 69');
  assert.equal(formatHouseDate('20261007', 'en'), '7 Oct 2026');
  assert.equal(daysBetween('20261231', '20270101'), 1);
});

test('version 2 combo run carries Prepare outcomes into Return', () => {
  const run = new Run('combo', '20261007', 'daily');
  assert.equal(run.mode, 'prepare');
  run.record({ records: [{ id: 'p-tv', status: 'correct' }, { id: 'p-car', status: 'flooded' }] });
  const opts = run.nextHouseOptions(C);
  assert.ok(opts.exclude.has('r-tv'));
  assert.ok(opts.include.has('r-carmud'));
  const h = generateHouse(C, 'return', '20261007', opts);
  assert.ok(!h.targets.some((p) => p.ref.id === 'r-tv'));
  assert.ok(h.targets.some((p) => p.ref.id === 'r-carmud'));
});

test('safety book: only playable lessons, each counted once', () => {
  const pool = bookPool(C);
  const rooms = new Set(playableRooms(C).map((r) => r.id));
  for (const mode of C.config.modes.map((m) => m.id)) {
    assert.ok(pool[mode].length > 0);
    assert.ok(pool[mode].every((it) => it.mode === mode && rooms.has(it.room) && !it.disabled));
  }
  // Items in rooms that aren't drawn yet (bathroom, garage) don't count.
  assert.ok(!pool.prepare.some((it) => it.id === 'p-toilet' || it.id === 'p-fuel'));
  const valid = new Set(Object.values(pool).flat().map((it) => it.id));
  const h = generateHouse(C, 'prepare', '20261007');
  const recs = h.targets.map((p, i) => ({ pid: p.pid, status: i % 2 ? 'learned' : 'correct' }));
  const ids = correctIds(h.targets, recs);
  assert.equal(ids.length, Math.ceil(h.targets.length / 2));
  const first = mergeLearned([], ids, valid);
  assert.deepEqual(first.added, ids);
  const again = mergeLearned(first.ids, ids, valid);
  assert.equal(again.added.length, 0);
  assert.equal(again.ids.length, ids.length);
  assert.equal(mergeLearned(null, ['not-an-item'], valid).added.length, 0);
});

test('topics: every lesson has one, and a full set is reported once', () => {
  const topics = C.config.topics;
  assert.ok(Array.isArray(topics) && topics.length >= 4);
  for (const it of C.items) assert.ok(topics.includes(it.topic), `${it.id} has topic ${it.topic}`);
  assert.ok(C.config.featuredTopic === null || topics.includes(C.config.featuredTopic));
  const pool = bookPool(C);
  const none = topicProgress(pool, new Set(), topics);
  assert.equal(none.reduce((a, tp) => a + tp.total, 0), Object.values(pool).reduce((a, list) => a + list.length, 0));
  const food = none.find((tp) => tp.id === 'food');
  const all = topicProgress(pool, new Set(food.items.map((it) => it.id)), topics);
  assert.deepEqual(completedTopics(none, all), ['food']);
  assert.deepEqual(completedTopics(all, all), []);
});

test('every mode answers "will the house survive?" at each score level, in both languages', () => {
  const strings = load('strings');
  for (const m of C.config.modes) {
    const M = m.id[0].toUpperCase() + m.id.slice(1);
    for (const base of ['cheerPerfect', 'cheerHigh', 'cheerMid', 'cheerLow']) {
      for (const l of ['th', 'en']) {
        const v = strings[l][`${base}${M}`];
        assert.ok(Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' && x.length > 0 && x.length <= 60), `${l}.${base}${M}`);
        // The ending is printed on the shared card too, where there is no list "below".
        assert.ok(v.every((x) => !/ด้านล่าง|below/i.test(x)), `${l}.${base}${M} points at the screen`);
      }
    }
  }
});

test('share texts fill every placeholder in both languages', () => {
  const strings = load('strings');
  const vars = {
    ...Object.fromEntries(C.config.modes.map((m) => [`shareText${m.id[0].toUpperCase()}${m.id.slice(1)}`, ['score', 'rank', 'grid', 'url', 'house', 'streak']])),
    challengeText: ['score', 'emoji', 'url'],
    challengeBackText: ['me', 'them', 'emoji', 'url', 'tail'],
    cardVersus: ['me', 'them'],
    bookChip: ['n', 'total'],
    bookNew: ['n', 'have', 'total'],
    shareTextChecklist: ['title', 'url'],
  };
  for (const lang of ['th', 'en']) {
    for (const [key, allowed] of Object.entries(vars)) {
      const used = [...strings[lang][key].matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      for (const u of used) assert.ok(allowed.includes(u), `${lang}.${key} uses {${u}}`);
      assert.ok(used.includes('url') || !allowed.includes('url'), `${lang}.${key} has no {url}`);
    }
  }
});

test('card text: a wrapped line never starts with closing punctuation (every ending, both languages)', () => {
  const strings = load('strings');
  const ctx = { measureText: (s) => ({ width: [...s].length * 10 }) };
  // At 155 "The house copes" fits and "!" doesn't: the "!" must go down with its word.
  assert.deepEqual(wrapText(ctx, 'The house copes! Nearly everything is ready', 155).slice(0, 2), ['The house', 'copes! Nearly']);
  for (const l of ['th', 'en']) {
    for (const [key, v] of Object.entries(strings[l])) {
      if (!key.startsWith('cheer') || !Array.isArray(v)) continue;
      for (const text of v) {
        for (let w = 60; w <= 300; w += 5) {
          const bad = wrapText(ctx, text, w).slice(1).find((line) => /^[!?,.:;)\]}%…”’ๆฯ]/.test(line));
          assert.ok(!bad, `${l}.${key} at ${w}: "${bad}"`);
        }
      }
    }
  }
});

test('the alert switch: one guide on top until its end date, never without one', () => {
  const at = (alert, day) => activeAlert({ alert }, day);
  assert.equal(at({ guide: 'quake', until: '2026-10-25' }, '20261018'), 'quake');
  assert.equal(at({ guide: 'quake', until: '2026-10-25' }, '20261025'), 'quake'); // the end date counts
  assert.equal(at({ guide: 'quake', until: '2026-10-25' }, '20261026'), null);
  assert.equal(at({ guide: 'quake', until: null }, '20261018'), null); // no end date, no alert
  assert.equal(at({ guide: null, until: '2026-10-25' }, '20261018'), null);
  assert.equal(at(undefined, '20261018'), null);
  // and the shipped config names a real guide with an end date
  const cfg = load('config');
  const lists = load('checklists');
  for (const g of cfg.guides) assert.ok(lists[g.id], `guide ${g.id} has a checklist`);
  if (cfg.alert?.guide) assert.ok(cfg.guides.some((g) => g.id === cfg.alert.guide) && /^\d{4}-\d{2}-\d{2}$/.test(cfg.alert.until));
});

test('guides with no game: 10 lines, before → during → after, a source on every line', () => {
  const cfg = load('config');
  const lists = load('checklists');
  const srcs = load('sources').sources;
  const modes = new Set(cfg.modes.map((m) => m.id));
  const order = ['before', 'during', 'after'];
  for (const g of cfg.guides.filter((x) => !modes.has(x.id))) {
    const items = lists[g.id].items;
    assert.equal(items.length, 10, g.id);
    assert.deepEqual(items.map((x) => order.indexOf(x.phase)), items.map((x) => order.indexOf(x.phase)).slice().sort(), `${g.id} phases in order`);
    for (const x of items) {
      assert.ok(x.sources?.length && x.sources.every((s) => srcs[s]), `${g.id}: "${x.th}" has real sources`);
      assert.ok(x.verify === 'verified' || (x.verify === 'partial' && x.verifyNote), `${g.id}: "${x.th}" verify`);
    }
  }
});

test('flood pace: no target goes under in the first 20 s, and never all of them before 30 s', () => {
  // v1.9.0's curve flooded every target of the 18 Oct house by 26.8 s, the first
  // at 13.6 s, so a round could end before a careful player reached room two.
  const curve = C.config.round.prepare.water;
  const T = C.config.round.prepare.seconds;
  const at = (y) => { for (let t = 0; t <= T * 10; t++) if (waterY(t / (T * 10), curve) <= y) return t / 10; return Infinity; };
  for (const d of days.slice(0, 120)) {
    const ts = generateHouse(C, 'prepare', d).targets.map((p) => at(p.cy));
    assert.ok(Math.min(...ts) >= 20, `${d}: a target floods at ${Math.min(...ts)} s`);
    assert.ok(Math.max(...ts) >= 30, `${d}: every target is under by ${Math.max(...ts)} s`);
  }
});

test('Thai words in keepTogether never break across lines on the cards', () => {
  setKeepTogether(C.config.keepTogether);
  const ctx = { measureText: (s) => ({ width: [...s].length * 10 }) };
  const lists = load('checklists');
  const texts = Object.entries(lists).filter(([k]) => !k.startsWith('_')).flatMap(([, l]) => l.items.map((x) => x.th));
  let checked = 0;
  for (const text of texts) {
    const spans = keptSpans(text);
    for (let w = 80; w <= 300; w += 10) {
      const lines = wrapText(ctx, text, w);
      // every kept word is whole on one line
      for (const [a, b] of spans) {
        const word = text.slice(a, b);
        assert.ok(lines.some((line) => line.includes(word)), `"${word}" split at ${w} in "${text}"`);
        checked++;
      }
    }
  }
  assert.ok(checked > 1000, `checked ${checked} placements`);
  setKeepTogether([]);
});

test('config: every keepTogether word is short Thai, listed once', () => {
  const words = C.config.keepTogether;
  assert.ok(Array.isArray(words) && words.length > 50);
  assert.equal(new Set(words).size, words.length);
  for (const w of words) assert.ok(/^[\u0E00-\u0E7F]{2,14}$/.test(w), w);
});

test('every guide picture has a gecko accessory, games and guides alike (v1.9.2)', () => {
  setGuides(C.config.guides);
  for (const g of C.config.guides) assert.ok(['hood', 'torch', 'mask', 'firehat', 'helmet', 'sunhat'].includes(propFor(g.id)), `${g.id}: ${propFor(g.id)}`);
  assert.equal(propFor('quake'), 'helmet');
  assert.equal(propFor('prepare'), 'hood'); // a mode keeps its own
});

test('security headers: no framing by other sites, no plugins, no foreign base or form target', () => {
  const h = fs.readFileSync(path.join(ROOT, 'public/_headers'), 'utf8');
  const all = h.split(/\n(?=\S)/).find((b) => b.startsWith('/*'));
  for (const d of ["frame-ancestors 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) assert.ok(all.includes(d), d);
  assert.ok(/X-Frame-Options: SAMEORIGIN/.test(all));
  assert.ok(!/script-src/.test(all), 'script-src would block the scripts Cloudflare injects (Web Analytics, bot detection)');
});

test('power cut: the fridge keeps 4 h, a full freezer 48 h, a half one 24 h, cold medicine a day (v1.10.0)', () => {
  const F = load('kit').fridge;
  const at = (hours, o = {}) => Object.fromEntries(fridgePlan(F, { hours, ...o }).map((x) => [x.id, x]));
  let p = at(0);
  assert.deepEqual(Object.keys(p), ['fridge', 'freezer'], 'no medicine or milk rows unless they are at home');
  assert.equal(p.fridge.left, 4);
  assert.equal(p.freezer.left, 24, 'v1.11.0: unanswered, the freezer counts as half full (the shorter, safer time)');
  assert.equal(at(0, { freezer: 'full' }).freezer.left, 48);
  p = at(3.5);
  assert.equal(p.fridge.status, 'soon');
  assert.equal(p.fridge.left, 0.5);
  p = at(4);
  assert.equal(p.fridge.status, 'over', 'at 4 hours the fridge food is out');
  assert.equal(p.freezer.status, 'ok');
  p = at(30, { freezer: 'half', med: true });
  assert.equal(p.freezer.status, 'over');
  assert.equal(p.med.status, 'check', 'v1.11.0: medicine past a day says "check the label", never "throw it out"');
  assert.equal(p.insulin.status, 'ok', 'insulin keeps out of the fridge for up to 28 days (US FDA, Siriraj)');
  assert.equal(at(30, { freezer: 'full' }).freezer.left, 18);
  assert.equal(at(23, { med: true }).med.status, 'soon');
  assert.equal(at(-5).fridge.left, 4, 'a time in the future counts as just now');
  assert.equal(at(0, { freezer: 'nonsense' }).freezer.limit, 24, 'an unknown freezer answer falls back to the first option (half)');
  p = at(5, { milk: true, freezer: 'full' });
  assert.equal(p.milk.status, 'over', 'breast milk in the fridge: the fridge\'s 4 hours');
  assert.equal(p.milkFrozen.status, 'ok');
  assert.equal(at(48, { milk: true, freezer: 'full' }).milkFrozen.status, 'over');
  // Every figure is in its source's own words (the build checks it too).
  const sources = load('sources').sources || load('sources');
  for (const part of F.parts) {
    const said = part.sources.map((id) => `${sources[id].title} ${sources[id].note}`).join(' ');
    for (const v of [part.hours, ...Object.values(part.hoursBy || {})].filter(Boolean)) assert.ok(new RegExp(`\\b${v} hours`).test(said), `${part.id}: ${v} hours`);
    assert.equal(part.verify, 'partial', `${part.id}: international guidance stays partial`);
  }
  const ins = F.parts.find((x) => x.id === 'insulin');
  const insSaid = ins.sources.map((id) => `${sources[id].title} ${sources[id].note}`).join(' ');
  assert.ok(/up to 28 days/.test(insSaid) && /86°F/.test(insSaid) && /15–30/.test(insSaid), 'insulin: 28 days at 15–30°C (59–86°F) in the FDA\'s words');
  assert.ok(!F.parts.some((x) => /^(med|insulin)$/.test(x.id) && /ทิ้ง/.test(x.say.check?.th || x.say.over.th)), 'no medicine status word says throw it out');
});

test('power cut, food by food: the fridge\'s 4 hours decide when, each food\'s chart row decides what (v1.11.0)', () => {
  const F = load('kit').fridge;
  const foods = (hours, o = {}) => fridgeFoods(F, fridgePlan(F, { hours, ...o }));
  let f = foods(3.9);
  assert.equal(f.over, false, 'before 4 hours nothing in the fridge has to go (door shut)');
  f = foods(4);
  assert.equal(f.over, true);
  const toss = f.toss.map((x) => x.id);
  const keep = f.keep.map((x) => x.id);
  for (const id of ['meat', 'balls', 'dishes', 'rice', 'eggs', 'milk', 'formula', 'cut', 'cream']) assert.ok(toss.includes(id), `${id} is thrown out after 4 hours (FoodSafety.gov, USDA FSIS, CDC)`);
  for (const id of ['whole', 'bread', 'butter', 'sauces']) assert.ok(keep.includes(id), `${id} keeps (the charts' "Keep" / "Safe")`);
  assert.equal(toss.length + keep.length, F.foods.length);
  assert.equal(foods(23).frozenOver, false, 'a half-full freezer holds 24 hours');
  assert.equal(foods(24).frozenOver, true);
  assert.equal(foods(24, { freezer: 'full' }).frozenOver, false);
  const z = Object.fromEntries(F.frozen.map((x) => [x.id, x]));
  assert.deepEqual([z.meat.crystals, z.meat.thawed], ['refreeze', 'discard']);
  assert.deepEqual([z.icecream.crystals, z.icecream.thawed], ['discard', 'discard'], 'ice cream: thrown out even with ice crystals (FoodSafety.gov)');
  assert.deepEqual([z.bread.crystals, z.bread.thawed], ['refreeze', 'refreeze']);
  // Left out on purpose: fish sauce (a cupboard condiment in Thailand; the US row says "fish sauces"),
  // opened fruit juice and coconut (the US sources disagree), mayonnaise (its rule needs a thermometer).
  const all = JSON.stringify([F.foods, F.frozen]);
  for (const w of ['น้ำปลา', 'น้ำผลไม้', 'มะพร้าว', 'มายองเนส']) assert.ok(!all.includes(w), `${w} is left out`);
  for (const x of [...F.foods, ...F.frozen]) {
    assert.ok(x.sources.length && x.sources.every((id) => load('sources').sources[id]), `${x.id}: sourced`);
    assert.equal(x.verify, 'partial', `${x.id}: US guidance stays partial`);
    assert.ok(x.label.th && x.label.en, `${x.id}: both languages`);
  }
});

test('medicine: days the pills last and how many more make the home check\'s target (v1.10.0)', () => {
  const target = load('kit').items.find((x) => x.id === 'meds').qty.days;
  assert.equal(target, 7);
  assert.deepEqual(medDays({ left: 10, perDay: 2, target }), { days: 5, need: 4, enough: false });
  assert.deepEqual(medDays({ left: 14, perDay: 2, target }), { days: 7, need: 0, enough: true });
  assert.deepEqual(medDays({ left: '3', perDay: '0.5', target }), { days: 6, need: 1, enough: false }, 'half a pill a day; a part pill counts as one');
  assert.equal(medDays({ left: 5, perDay: 0, target }), null);
  assert.equal(medDays({ left: -1, perDay: 1, target }), null);
  assert.equal(medDays({ left: 'abc', perDay: 1, target }), null);
});

test('dust today: the PCD bands to the decimal, AQI too, and who gets which lines (v1.10.0)', () => {
  const A = load('kit').air;
  const lv = (unit, value) => airLevel(A, { unit, value })?.id ?? null;
  // The Royal Gazette notice: 0–15.0, 15.1–25.0, 25.1–37.5, 37.6–75.0, 75.1+ µg/m³ (24-hour average, one decimal).
  for (const [v, id] of [[0, 'blue'], [15, 'blue'], [15.04, 'blue'], [15.05, 'green'], [15.1, 'green'], [25, 'green'], [25.1, 'yellow'], [37.5, 'yellow'], [37.6, 'orange'], [75, 'orange'], [75.1, 'red'], [500, 'red'], ['82,4', 'red']]) assert.equal(lv('pm', v), id, `${v} µg/m³`);
  for (const [v, id] of [[25, 'blue'], [26, 'green'], [50, 'green'], [51, 'yellow'], [100, 'yellow'], [101, 'orange'], [200, 'orange'], [201, 'red']]) assert.equal(lv('aqi', v), id, `AQI ${v}`);
  for (const bad of [-1, 'abc', '', null, 1000]) assert.equal(lv('pm', bad), null, `nothing for ${bad}`);
  assert.equal(airLevel(A, { colour: 'orange', value: 3 }).id, 'orange', 'a picked colour wins over a number');
  // v1.11.0: the at-risk and long-term-illness lines are always shown (the reader
  // is often the one at risk), and never repeat a line given for everyone.
  const orange = airAdvice(A, { unit: 'pm', value: 50 });
  assert.ok(orange.all.length && orange.risk.length && orange.chronic.length, 'orange: everyone, the people at risk and long-term illness, without ticking anyone');
  for (const l of A.levels) {
    const r = airAdvice(A, { colour: l.id });
    const lines = [...r.all, ...r.risk, ...r.chronic].map((x) => x.th);
    assert.equal(new Set(lines).size, lines.length, `${l.id}: no line twice`);
    assert.equal(r.riskSame, l.risk.length > 0 && l.risk.every((x) => l.all.some((a) => a.th === x.th)), `${l.id}: "the same as everyone" only when every at-risk line is already given`);
  }
  const ill = airAdvice(A, { unit: 'pm', value: 90 }, ['chronic']);
  assert.ok(ill.chronic.length && ill.who[0].id === 'chronic', 'red: the long-term illness lines; who is named for the share text');
  // Every line has a source; a line from the DOH says so (the PCD notice is the rest).
  const sources = load('sources').sources;
  for (const l of A.levels) for (const x of [...l.all, ...l.risk, ...l.chronic]) assert.ok(x.sources.length && x.sources.every((id) => sources[id]), `${l.id}: ${x.th}`);
  assert.deepEqual(A.groups.filter((g) => g.from).map((g) => g.from).sort(), ['baby', 'elder', 'meds'], 'who is at home starts from the home check');
  // v1.11.1: every level that says "wear a mask" also says children under 2 wear none
  // (the at-risk group "up to 5" would otherwise put a mask on a baby).
  for (const l of A.levels) {
    const r = airAdvice(A, { colour: l.id });
    const says = [...r.all, ...r.risk, ...r.chronic].some((x) => /หน้ากาก/.test(x.th));
    assert.equal(!!r.baby, says, `${l.id}: the under-2 line ${says ? 'follows the mask line' : 'stays away without one'}`);
  }
  assert.match(A.baby.th, /2 ขวบ/);
  assert.equal(A.baby.verify, 'partial', 'one Thai news report, which contradicts itself once: a paediatrician confirms');
});

test('which mask: the PCD\'s colours decide who, the DOH the kind; never a mask for a baby or in a house fire (v1.12.0)', () => {
  const K = load('kit');
  const M = K.mask;
  const A = K.air;
  const sources = load('sources').sources;
  // One question at a time.
  assert.deepEqual(maskAdvice(M, A, {}), { ask: 'why' });
  assert.deepEqual(maskAdvice(M, A, { why: 'dust' }), { ask: 'colour' });
  assert.deepEqual(maskAdvice(M, A, { why: 'dust', colour: 'orange' }), { ask: 'who' });
  assert.deepEqual(maskAdvice(M, A, { why: 'clean' }), { ask: 'what' });
  // When: everyone from orange, the people at risk from yellow (the notice's at-risk: over 60, up to 5, pregnant, heart or lung).
  const st = (colour, who) => maskAdvice(M, A, { why: 'dust', colour, who }).status.id;
  for (const who of ['adult', 'kid', 'elder', 'pregnant', 'heart']) {
    const risk = M.who.find((x) => x.id === who).risk;
    assert.equal(st('blue', who), 'none', `blue ${who}`);
    assert.equal(st('green', who), 'none', `green ${who}`);
    assert.equal(st('yellow', who), risk ? 'wear' : 'none', `yellow ${who}`);
    assert.equal(st('orange', who), 'wear', `orange ${who}`);
    assert.equal(st('red', who), 'stay', `red ${who}`);
  }
  for (const colour of A.levels.map((l) => l.id)) {
    const r = maskAdvice(M, A, { why: 'dust', colour, who: 'baby' });
    assert.equal(r.status.id, 'baby', `${colour}: a child under 2 wears no mask`);
    assert.ok(!r.card && r.lines[0] === A.baby, `${colour}: only the under-2 line, no how-to-wear card`);
  }
  // Which kind: adults an N95 first; the people at risk may use a surgical mask; children 2–5 a surgical mask; heart or lung: the doctor's advice.
  const kind = (who) => maskAdvice(M, A, { why: 'dust', colour: 'orange', who }).lines.map((x) => x.th);
  assert.ok(kind('adult').includes(M.dust.type.adult.th) && kind('elder').includes(M.dust.type.risk.th) && kind('kid').includes(M.dust.type.kid.th));
  assert.ok(kind('heart').includes(M.dust.doctor.th) && !kind('elder').includes(M.dust.doctor.th));
  // Not yet: says from which colour, for this person.
  const yellowAdult = maskAdvice(M, A, { why: 'dust', colour: 'yellow', who: 'adult' });
  assert.equal(yellowAdult.lines[0].level.id, 'orange');
  assert.equal(maskAdvice(M, A, { why: 'dust', colour: 'green', who: 'elder' }).lines[0].level.id, 'yellow');
  // A house fire is "get out", a chemical fire "get away": no mask, no card.
  assert.equal(maskAdvice(M, A, { why: 'fire' }).status.id, 'out');
  assert.equal(maskAdvice(M, A, { why: 'chem' }).status.id, 'leave');
  assert.ok(!maskAdvice(M, A, { why: 'fire' }).card && !maskAdvice(M, A, { why: 'chem' }).card);
  assert.equal(maskAdvice(M, A, { why: 'fire' }).guide, 'fire');
  // Clean-up: mould and broken boards an N95, dried mud a surgical mask (the DDC's manual); keep children out.
  assert.equal(maskAdvice(M, A, { why: 'clean', what: 'mould' }).status.id, 'n95');
  assert.equal(maskAdvice(M, A, { why: 'clean', what: 'board' }).status.id, 'n95');
  assert.equal(maskAdvice(M, A, { why: 'clean', what: 'mud' }).status.id, 'surgical');
  assert.ok(maskAdvice(M, A, { why: 'sick' }).lines.includes(M.baby), 'illness: the under-2 line too, without the dust words');
  assert.ok(!/ฝุ่น/.test(M.baby.th) && M.baby.sources.includes('ddc-mask-2568'));
  // Every line in every answer has a source.
  const all = [...Object.values(M.dust.type), M.dust.next, M.dust.doctor, ...M.dust.always, ...M.what.flatMap((w) => M.clean[w.id].lines), ...M.clean.always, ...M.sick.lines, ...M.chem.lines, ...M.fire.lines, ...Object.values(M.card).flat()];
  for (const x of all) assert.ok(x.sources.length && x.sources.every((id) => sources[id]), x.th);
  assert.ok(!JSON.stringify(M).match(/ชิ้นต่อ|ชิ้น\/|per day/), 'no count of masks: no source gives one');
});

test('all tools: one list in config, two seasonal tiles per mode, government links that are https and deep (v1.12.0)', () => {
  const C = load('config');
  const K = load('kit');
  const ids = C.tools.map((x) => x.id);
  for (const m of C.modes) {
    const two = C.hub.season[m.id];
    assert.equal(two.length, 2, `${m.id}: two tiles`);
    for (const id of two) assert.ok(ids.includes(id) && !C.hub.always.includes(id), `${m.id}: ${id}`);
  }
  assert.deepEqual(C.hub.season.dust, ['air', 'mask'], 'dust season: dust today and the mask tool');
  for (const x of K.links.list) {
    assert.match(x.url, /^https:\/\//, x.id);
    if (x.kind === 'line') assert.match(x.url, /^https:\/\/line\.me\/R\/ti\/p\/@[a-z0-9_.-]+$/, x.id);
    const u = new URL(x.url);
    assert.ok(!(u.pathname === '/' && ['www.tmd.go.th', 'tmd.go.th', 'www.rid.go.th', 'www.oic.or.th', 'anamai.moph.go.th'].includes(u.hostname)), `${x.id}: not a home page that opens with a special page`);
    for (const g of x.guides) assert.ok(C.guides.some((y) => y.id === g), `${x.id}: guide ${g}`);
  }
  assert.ok(K.links.list.some((x) => x.id === 'linealert') && K.links.list.some((x) => x.id === 'ddpm1784'), 'LINE ALERT and DDPM 1784 are on the list');
});

test('heat today, water, the tank, the bag and "I am safe": the sources\' numbers, never a ration, no location (v1.13.0)', () => {
  const K = load('kit');
  const sources = load('sources').sources;
  // Heat: the four bands as the BMA and the DOH publish them, rising, the top one open.
  assert.deepEqual(K.hot.levels.map((l) => [l.lo, l.hi]), [['27.0', '32.9'], ['33.0', '41.9'], ['42.0', '51.9'], ['52.0', null]]);
  assert.equal(hotAdvice(K.hot, 'nope'), null);
  assert.ok(hotAdvice(K.hot, 'extreme').all.some((x) => /งดกิจกรรมกลางแจ้ง/.test(x.th)), 'extreme: stop outdoor activity');
  assert.ok(K.hot.aid[0].th.includes('1669'), 'first aid starts with 1669');
  assert.ok(!/11\.00|13\.00|60 ปี|65 ปี|40\.5/.test(JSON.stringify(K.hot)), 'the hours, ages and temperatures the sources disagree on are left out');
  // Water: the home check's 3 L × people × 3 days, counted the other way round.
  const rule = K.items.find((x) => x.id === 'water').qty;
  const w = (counts, people, other = 0) => waterDays(K.water, { counts, people, other, per: rule.perPersonPerDay, target: rule.days });
  assert.deepEqual(w({ b1500: 6, g6: 2 }, 3), { litres: 21, people: 3, perDay: 9, days: 2, need: 6, enough: false, target: 3 });
  assert.equal(w({ t19: 2 }, 4).enough, true);
  assert.equal(w({}, 2, '4,5').litres, 4.5, 'a comma reads as a decimal point');
  assert.equal(w({ b600: 1 }, 1).days, 0, 'less than a day reads 0 (the sheet says "less than a day")');
  assert.ok(!/ลดน้ำดื่มลง|ดื่มวันละ\s*\d|ration to/i.test(JSON.stringify(K.water)), 'never advice to drink less');
  // Tank: the MWA's and the DDC's dose per 1,000 litres.
  assert.equal(tankDose(K.tank, { litres: 1000, type: 'l5' }).amount, 100);
  assert.equal(tankDose(K.tank, { litres: 1000, type: 'l10' }).amount, 50);
  assert.equal(tankDose(K.tank, { litres: 1000, type: 'p60' }).amount, 8);
  assert.equal(tankDose(K.tank, { litres: 2000, type: 'l5' }).amount, 200);
  assert.equal(tankDose(K.tank, { litres: 700, type: 'l10' }).amount, 35);
  assert.equal(tankDose(K.tank, { litres: 0, type: 'l5' }), null);
  assert.ok(K.tank.steps.some((x) => /อย่าลงไปในถัง/.test(x.th)) && K.tank.safety.some((x) => x.sources.includes('fda-bleach')), 'never climb in; never mix with toilet cleaner');
  // Bag: every bag, plus what the household's answers add; never candles.
  assert.deepEqual(bagList(K.bag, ['baby', 'pet']).extra.map((x) => x.id), ['baby', 'pet']);
  assert.equal(bagList(K.bag, []).extra.length, 0);
  assert.ok(!/เทียน|candle/i.test(JSON.stringify([K.bag.every, K.bag.extra])));
  // "I'm safe": the message only, with no place unless typed, and the numbers first when help is needed.
  assert.equal(safeMessage(K.safe, { status: 'ok', time: 't' }), '✅ ปลอดภัยดี อยู่บ้าน\nt');
  assert.equal(safeMessage(K.safe, { status: 'help', where: 'สะพาน', lang: 'en' }), '🆘 I need help\nI’m at สะพาน');
  assert.equal(safeMessage(K.safe, { status: 'nope' }), '');
  assert.deepEqual(K.safe.status.find((x) => x.id === 'help').calls, ['1784', '1669']);
  // Every line of the six tools has a source.
  const walk = (o, out = []) => { if (Array.isArray(o)) o.forEach((x) => walk(x, out)); else if (o && typeof o === 'object') { if (o.sources) out.push(o); Object.values(o).forEach((x) => walk(x, out)); } return out; };
  for (const x of walk([K.hot, K.water, K.tank, K.info, K.safe, K.bag])) assert.ok(x.sources.length && x.sources.every((id) => sources[id]), JSON.stringify(x).slice(0, 80));
  // The emergency card asks for no ID number.
  assert.ok(!K.info.fields.some((f) => /บัตรประชาชน|id card|passport/i.test(`${f.label.th} ${f.label.en}`)));
});

test('emoji in the content are Unicode 11 or older (newer ones are empty boxes on older phones, rule 64)', () => {
  // Emoji added in Unicode 12 and later, by code point (12.0 to 15.1).
  const newer = [[0x1F6D5, 0x1F6DF], [0x1F6FA, 0x1F6FC], [0x1F7E0, 0x1F7F0], [0x1F90C, 0x1F90F], [0x1F971, 0x1F972], [0x1F977, 0x1F979], [0x1F97B, 0x1F97B], [0x1F9A3, 0x1F9AF], [0x1F9BA, 0x1F9BF], [0x1F9C3, 0x1F9CF], [0x1FA70, 0x1FAFF]];
  const bad = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'public/content')).filter((x) => x.endsWith('.json'))) {
    const text = fs.readFileSync(path.join(ROOT, 'public/content', f), 'utf8');
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (newer.some(([a, b]) => cp >= a && cp <= b)) bad.push(`${f}: ${ch} U+${cp.toString(16).toUpperCase()}`);
    }
  }
  assert.deepEqual(bad, [], bad.join(', '));
});

test('structured data: one publisher, and each start page describes the app in its own language', () => {
  for (const [file, lang] of [['public/index.html', ''], ['public/en/index.html', '/en']]) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const byId = (s) => graph.find((n) => n['@id']?.endsWith(s));
    const org = byId('/#org');
    const game = byId('/#game');
    assert.equal(org?.['@type'], 'Organization', file);
    assert.ok(!org.description && !org.subjectOf, `${file}: the publisher carries the game's details`);
    assert.ok(game.url.endsWith(`${lang}/`) && game.subjectOf.url.endsWith(`${lang}/learn`), `${file}: ${game.url}`);
    assert.equal(byId('/#website').publisher['@id'], org['@id']);
  }
});

test('the right answer is not given away by its length (KNOWN_ISSUES #66)', () => {
  // Before v1.9.2 it was the longest in 71 of 82 choice sets (Thai). Now the wrong answers say
  // the reason a real person would give, so length tells nothing either way:
  // the right one is the longest now and then, never by a wide margin.
  const len = { th: (s) => [...s].length, en: (s) => s.length };
  for (const lang of ['th', 'en']) {
    let sets = 0;
    let longest = 0;
    for (const it of items.items.filter((i) => !i.disabled)) {
      for (const cs of [it.choices, it.wet?.choices].filter(Boolean)) {
        sets++;
        const c = len[lang](cs.find((x) => x.correct).label[lang]);
        const wrong = cs.filter((x) => !x.correct).map((x) => len[lang](x.label[lang]));
        if (wrong.every((w) => w < c)) {
          longest++;
          assert.ok(Math.max(...wrong) / c >= 0.75, `${it.id} ${lang}: the right answer stands out by length`);
        }
        for (const x of cs) if (!x.correct) assert.ok(len[lang](x.label[lang]) <= (lang === 'th' ? 60 : 80), `${it.id} ${lang}: wrong label too long for a phone`);
      }
    }
    assert.ok(longest / sets <= 0.33 && longest / sets >= 0.1, `${lang}: the right answer is the longest in ${longest} of ${sets}`);
  }
});

console.log(`${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exit(1);
}

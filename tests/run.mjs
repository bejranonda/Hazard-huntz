// Unit tests for the game rules (no browser needed): node tests/run.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHouse, playableRooms, MIN_HIT } from '../public/js/house.js';
import { Round, STATUS, waterY, rankTier } from '../public/js/round.js';
import { makeRng, isValidHouseKey } from '../public/js/rng.js';
import { bangkokDateKey, formatHouseDate, daysBetween } from '../public/js/util.js';
import { challengeUrl, parseChallenge } from '../public/js/share.js';
import { Run } from '../public/js/run.js';
import { guessLang, langPath, pathLang, isBot } from '../public/js/content.js';
import { setModes, modeList, codeOf, idOfCode, seasonalMode, mk, switchOn, recommend, modeLink } from '../public/js/modes.js';
import { bookPool, correctIds, mergeLearned, topicProgress, completedTopics } from '../public/js/collection.js';

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
  assert.equal(r.waterLevel, 612);
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

console.log(`${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exit(1);
}

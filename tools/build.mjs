#!/usr/bin/env node
// Build step for Cloudflare Pages (no npm dependencies, Node 18+):
//   1. validate every content JSON file (fails the build on mistakes)
//   2. write the link-preview pages: /c/p0..p10, /c/r0..r10, /checklist/*
//   3. stamp the site URL into index.html's Open Graph tags, canonical and JSON-LD
//   3b. write the SEO / AI-search files: /learn, robots.txt, sitemap.xml, llms.txt
//   4. generate public/sw.js with a content-hash version and precache list
//   5. check the initial-load budget (< 500 KB)
// Usage: node tools/build.mjs [--docs]   (SITE_URL=https://example.org)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { setModes, recommend, modeLink } from '../public/js/modes.js';
import { carouselSets, carouselHash } from './carousel.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const readJSON = (rel) => {
  const file = path.join(PUB, rel);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    err(`${rel}: invalid JSON (${e.message})`);
    return null;
  }
};

// ---------------------------------------------------------------- content
const config = readJSON('content/config.json');
const pkgVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const strings = readJSON('content/strings.json');
const itemsFile = readJSON('content/items.json');
// The mode registry (config.json → modes); every per-mode file, page and
// string below is derived from it.
const MODES = config.modes || [];
const MODE_IDS = MODES.map((m) => m.id);
setModes(MODES);
const capM = (id) => id.charAt(0).toUpperCase() + id.slice(1);
const roomsFile = readJSON('content/rooms.json');
const sourcesFile = readJSON('content/sources.json');
const checklists = readJSON('content/checklists.json');
const helplines = readJSON('content/helplines.json');
// Text for the carousel images and /posts only; the game never loads it.
const carousel = readJSON('content/carousel.json');
// The home check and family plan card (/?open=kit, /?open=plan), loaded on open.
const kitFile = readJSON('content/kit.json');
if (errors.length) finish();

const spritesSvg = fs.readFileSync(path.join(PUB, 'art/sprites.svg'), 'utf8');
const spriteIds = new Set([...spritesSvg.matchAll(/<symbol id="s-([\w-]+)"/g)].map((m) => m[1]));
const sources = sourcesFile.sources;
const rooms = roomsFile.rooms;
const roomById = new Map(rooms.map((r) => [r.id, r]));
const enabledRooms = rooms.filter((r) => r.enabled);
const LANGS = ['th', 'en'];
const TIP_MAX = 80;

for (const r of enabledRooms) {
  if (!r.art || !fs.existsSync(path.join(PUB, r.art))) err(`rooms.json: room "${r.id}" is enabled but art "${r.art}" is missing`);
  const ids = new Set();
  for (const s of r.slots) {
    if (ids.has(s.id)) err(`rooms.json: duplicate slot id ${s.id}`);
    ids.add(s.id);
    if (!(s.x >= 0 && s.x <= 360 && s.y >= 0 && s.y <= 600)) err(`rooms.json: slot ${s.id} is outside the 360x600 scene`);
  }
}

const text = (obj, where) => {
  for (const l of LANGS) if (!obj || typeof obj[l] !== 'string' || !obj[l].trim()) err(`${where}: missing ${l} text`);
};

const checkChoices = (choices, where) => {
  if (!Array.isArray(choices) || choices.length < 2 || choices.length > 3) err(`${where}: needs 2–3 choices`);
  const correct = (choices || []).filter((c) => c.correct).length;
  if (correct !== 1) err(`${where}: exactly one choice must have "correct": true (found ${correct})`);
  (choices || []).forEach((c, i) => {
    text(c.label, `${where} choice ${i + 1} label`);
    if (!c.correct) text(c.feedback, `${where} choice ${i + 1} feedback`);
  });
};

const ids = new Set();
const thing = (it, where, kind) => {
  if (ids.has(it.id)) err(`${where}: duplicate id`);
  ids.add(it.id);
  if (!MODE_IDS.includes(it.mode)) err(`${where}: mode must be one of ${MODE_IDS.join(', ')}`);
  const room = roomById.get(it.room);
  if (!room) return err(`${where}: unknown room "${it.room}"`);
  text(it.name, `${where} name`);
  if (!room.enabled) return; // future rooms only need text for now
  if (!spriteIds.has(it.sprite)) err(`${where}: sprite "s-${it.sprite}" not found in art/sprites.svg`);
  if (it.doneSprite && !spriteIds.has(it.doneSprite)) err(`${where}: doneSprite "s-${it.doneSprite}" not found`);
  if (!Array.isArray(it.size) || it.size.length !== 2) err(`${where}: size must be [width, height]`);
  const fits = room.slots.some((s) => it.slots?.some((t) => s.tags.includes(t)));
  if (!fits) err(`${where}: no slot in room "${it.room}" has any of the tags ${JSON.stringify(it.slots)}`);
};

for (const it of itemsFile.items) {
  const where = `items.json ${it.id}`;
  thing(it, where, 'item');
  text(it.context, `${where} context`);
  checkChoices(it.choices, where);
  for (const variant of [it, it.wet].filter(Boolean)) {
    const w = variant === it ? where : `${where} (wet)`;
    text(variant.tip, `${w} tip`);
    text(variant.why, `${w} why`);
    for (const l of LANGS) {
      const len = [...(variant.tip?.[l] || '')].length;
      if (len > TIP_MAX) err(`${w}: ${l} tip is ${len} characters (max ${TIP_MAX})`);
    }
  }
  if (it.wet) {
    text(it.wet.context, `${where} wet context`);
    checkChoices(it.wet.choices, `${where} wet`);
  }
  for (const s of [...(it.sources || []), ...(it.wet?.sources || [])]) if (!sources[s]) err(`${where}: unknown source "${s}"`);
  if (!['verified', 'partial', 'unverified'].includes(it.verify)) err(`${where}: verify must be verified/partial/unverified`);
  if (it.verify === 'unverified') warn(`${where}: marked unverified — confirm with an agency before launch`);
  if (it.pair && !itemsFile.items.some((x) => x.id === it.pair)) err(`${where}: pair "${it.pair}" not found`);
  if (!(config.topics || []).includes(it.topic)) err(`${where}: topic "${it.topic}" must be one of config.json topics (${(config.topics || []).join(', ')})`);
}
// Topics group the lessons in the safety book, the tip card and /learn.
for (const tp of config.topics || []) {
  for (const l of LANGS) if (!strings[l]?.[`topic_${tp}`]) err(`strings.json: ${l}.topic_${tp} is missing`);
  if (!itemsFile.items.some((it) => it.topic === tp)) warn(`config.json: topic "${tp}" has no items`);
}
if (config.featuredTopic != null && !(config.topics || []).includes(config.featuredTopic)) err(`config.json: featuredTopic "${config.featuredTopic}" must be null or one of the topics`);
// Hand-set switches end by themselves on their end date (modes.js → switchOn),
// so a forgotten one can't keep a flood warning on the start screen in December.
const realDay = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const TODAY = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10); // Bangkok
for (const [flag, until] of [['rainWarningActive', 'rainWarningUntil'], ['featuredTopic', 'featuredTopicUntil']]) {
  const u = config[until];
  if (u != null && !realDay(u)) err(`config.json: ${until} must be a real date YYYY-MM-DD (found ${JSON.stringify(u)})`);
  else if (config[flag] && u == null) warn(`config.json: ${flag} is on with no ${until}, so it stays on until someone turns it off`);
  else if (config[flag] && u < TODAY) warn(`config.json: ${until} (${u}) has passed, so ${flag} is off; turn it off or give a new end date`);
}
for (const d of itemsFile.decoys) {
  thing(d, `items.json decoy ${d.id}`, 'decoy');
  text(d.note, `items.json decoy ${d.id} note`);
}

// Every mode needs its registry fields, round settings, strings and a checklist.
const PER_MODE_STRINGS = ['mode', 'hero', 'challenge', 'howto', 'howtoTitle', 'geckoStart', 'result', 'shareText', 'checklistTab', 'rank'];
const PER_MODE_OG = ['challengeTitle', 'challengeDesc', 'challengeLine', 'checklistTitle'];
if (MODES.length < 2) err('config.json: modes must list the playable modes');
if (new Set(MODES.map((m) => m.code)).size !== MODES.length) err('config.json: every mode needs its own one-letter code');
for (const m of MODES) {
  if (!/^[a-z]{3,12}$/.test(m.id || '') || !/^[a-z]$/.test(m.code || '')) err(`config.json: mode ${JSON.stringify(m.id)} needs an id (a–z) and a one-letter code`);
  if (!config.round?.[m.id]?.seconds) err(`config.json: round.${m.id}.seconds is missing`);
  if (m.threat && !config.round?.[m.id]?.[m.threat]) err(`config.json: round.${m.id}.${m.threat} keyframes are missing`);
  // A power cut counts story hours over the round; items go bad after lostAfter hours.
  if (m.threat === 'dark' && !(config.round?.[m.id]?.hours > 0)) err(`config.json: round.${m.id}.hours (the power cut's length in story hours) is missing`);
  for (const it of itemsFile.items.filter((x) => x.mode === m.id && x.lostAfter != null)) {
    if (m.threat !== 'dark') err(`items.json ${it.id}: lostAfter only works in a power-cut mode (threat "dark")`);
    else if (!(it.lostAfter > 0 && it.lostAfter < config.round[m.id].hours)) err(`items.json ${it.id}: lostAfter must be between 0 and round.${m.id}.hours (${config.round[m.id].hours})`);
  }
  if (m.threat === 'dark' && !itemsFile.items.some((x) => x.mode === m.id && x.lostAfter != null)) warn(`config.json: mode ${m.id} has a power cut but no item with lostAfter`);
  for (const l of LANGS) for (const k of PER_MODE_STRINGS) if (strings[l]?.[`${k}${capM(m.id)}`] == null) err(`strings.json: ${l}.${k}${capM(m.id)} is missing`);
  for (const l of LANGS) if (strings[l]?.[`mode${capM(m.id)}Desc`] == null) err(`strings.json: ${l}.mode${capM(m.id)}Desc is missing`);
  for (const [name, tbl] of [['og', strings.og], ['ogEn', strings.ogEn]]) for (const k of PER_MODE_OG) if (!tbl?.[`${k}${capM(m.id)}`]) err(`strings.json: ${name}.${k}${capM(m.id)} is missing`);
  for (const l of LANGS) if (!strings.seo?.[l]?.[`section${capM(m.id)}`]) err(`strings.json: seo.${l}.section${capM(m.id)} is missing`);
  if (!(m.months || []).every((n) => Number.isInteger(n) && n >= 1 && n <= 12)) err(`config.json: mode ${m.id} months must be 1–12`);
  if (m.topic && !(config.topics || []).includes(m.topic)) err(`config.json: mode ${m.id} topic "${m.topic}" is not in topics`);
  if (m.link && !/^https:\/\//.test(m.link)) err(`config.json: mode ${m.id} link must start with https://`);
  // The start screen's static buttons (first paint) must match the registry.
  if (!fs.readFileSync(path.join(PUB, 'index.html'), 'utf8').includes(`data-mode="${m.id}"`)) err(`index.html: no start button for mode "${m.id}"`);
}

// Every hazard has a page at /<slug> (+ /en/<slug>). Slugs end up in shared
// links and search results, so they never change once published.
const HAZARDS = config.hazards || {};
const carouselPartial = [];
const RESERVED = new Set(['c', 'checklist', 'en', 'learn', 'api', 'js', 'css', 'content', 'art', 'fonts', 'icons', 'og', 'share', 'index', 'sw', 'robots', 'sitemap', 'llms', 'manifest', 'posts', 'kit', 'plan']);
// "What to do" guides (config.json → guides), in the order the app shows them.
const GUIDES = config.guides || [];
const GUIDE_IDS = GUIDES.map((g) => g.id);
const slugSeen = new Set();
for (const h of new Set(MODES.map((m) => m.hazard))) if (!HAZARDS[h]) err(`config.json: hazards.${h} is missing (every hazard needs a page slug)`);
for (const [h, v] of Object.entries(HAZARDS)) {
  const slug = v?.slug || '';
  if (!MODES.some((m) => m.hazard === h) && !GUIDES.some((g) => g.hazard === h)) err(`config.json: hazards.${h} has no mode and no guide`);
  if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(slug)) err(`config.json: hazards.${h}.slug must be lowercase letters, digits or "-"`);
  else if (slugSeen.has(slug)) err(`config.json: hazards slug "${slug}" is used twice`);
  else if (RESERVED.has(slug) || fs.existsSync(path.join(PUB, slug))) err(`config.json: hazards slug "${slug}" clashes with a site path`);
  slugSeen.add(slug);
  for (const l of LANGS) for (const k of ['Nav', 'Title', 'Desc', 'H1', 'Intro']) if (!strings.seo?.[l]?.[`hazard${capM(h)}${k}`]) err(`strings.json: seo.${l}.hazard${capM(h)}${k} is missing`);
  // Links on the hazard page to the home check (/?open=kit) and the plan card (/?open=plan).
  for (const tool of v?.tools || []) {
    if (!['kit', 'plan'].includes(tool)) err(`config.json: hazards.${h}.tools: "${tool}" is not kit or plan`);
    for (const l of LANGS) if (!strings.seo?.[l]?.[`tool${capM(tool)}`]) err(`strings.json: seo.${l}.tool${capM(tool)} is missing`);
  }
  // The lessons in the hazard's carousel post (carousel.json → sets; share/carousel/<slug>/NN.jpg).
  const car = carousel?.sets?.[h] || [];
  if (car.length > 8) err(`carousel.json: sets.${h} has ${car.length} lessons (at most 8, so a post stays short)`);
  for (const id of car) {
    const it = itemsFile.items.find((x) => x.id === id);
    if (!it) err(`carousel.json: sets.${h}: no item "${id}"`);
    else if (MODES.find((m) => m.id === it.mode)?.hazard !== h) err(`carousel.json: sets.${h}: "${id}" belongs to another hazard`);
    else if (!roomById.get(it.room)?.enabled || it.enabled === false) err(`carousel.json: sets.${h}: "${id}" is not playable`);
  }
  // Not a warning (it stays until a Thai review): the build's posts line lists them.
  const unverified = car.filter((id) => itemsFile.items.find((x) => x.id === id)?.verify !== 'verified');
  if (unverified.length) carouselPartial.push(`${h} ${unverified.length} ⚠️`);
  if (car.length) for (const l of LANGS) for (const k of [`cover${capM(h)}Title`, `cover${capM(h)}Sub`, `caption${capM(h)}`]) if (!carousel?.[l]?.[k]) err(`carousel.json: ${l}.${k} is missing`);
}
for (const h of Object.keys(carousel?.sets || {})) if (!HAZARDS[h]) err(`carousel.json: sets.${h} is not a hazard in config.json`);
for (const l of LANGS) for (const k of ['swipe', 'doLabel', 'whyLabel', 'sourceLabel', 'ctaTitle', 'ctaSub', 'helpLabel', 'postsTitle', 'postsIntro', 'postsCopy', 'postsCopied', 'postsImages']) if (!carousel?.[l]?.[k]) err(`carousel.json: ${l}.${k} is missing`);

// A game mode's checklist sums up its sourced lessons. A guide with no game yet
// (quake, heat, storm, landslide) has no lessons behind it, so every line
// carries its own sources and verify flag, and a phase (before, during, after).
const guideSeen = new Set();
for (const g of GUIDES) {
  const where = `config.json: guides "${g.id}"`;
  if (guideSeen.has(g.id)) err(`${where} is listed twice`);
  guideSeen.add(g.id);
  if (!HAZARDS[g.hazard]) err(`${where}: hazard "${g.hazard}" is not in hazards`);
  if (!g.icon) err(`${where}: no icon`);
  const mode = MODES.find((m) => m.id === g.id);
  if (mode && mode.hazard !== g.hazard) err(`${where}: the mode's hazard is "${mode.hazard}"`);
  for (const l of LANGS) if (!strings[l]?.[`guide${capM(g.id)}`]) err(`strings.json: ${l}.guide${capM(g.id)} is missing`);
  if (!strings.og?.[`checklistTitle${capM(g.id)}`] || !strings.ogEn?.[`checklistTitle${capM(g.id)}`]) err(`strings.json: og/ogEn.checklistTitle${capM(g.id)} is missing`);
  const list = checklists[g.id];
  if (!list) { err(`checklists.json: "${g.id}" is missing (it is in config.json → guides)`); continue; }
  for (const [p, nm] of Object.entries(list.phaseNames || {})) {
    if (!list.items.some((x) => x.phase === p)) err(`checklists.json ${g.id}: phaseNames.${p} names a phase no line has`);
    for (const l of LANGS) if (!nm?.[l]) err(`checklists.json ${g.id}: phaseNames.${p}.${l} is missing`);
  }
  if (mode) continue; // checked with the modes below
  if (list.items.length !== 10) err(`checklists.json: "${g.id}" must have exactly 10 items`);
  let last = 0;
  list.items.forEach((x, i) => {
    const w = `checklists.json ${g.id} #${i + 1}`;
    text(x, w);
    if (x.sprite && !spriteIds.has(x.sprite)) err(`${w}: sprite "${x.sprite}" not found`);
    const ph = ['before', 'during', 'after'].indexOf(x.phase);
    if (ph < 0) err(`${w}: phase must be before, during or after`);
    else if (ph < last) err(`${w}: phases go before → during → after`);
    else last = ph;
    if (!x.sources?.length) err(`${w}: a guide with no game needs a source on every line`);
    for (const s of x.sources || []) if (!sources[s]) err(`${w}: unknown source "${s}"`);
    if (!['verified', 'partial'].includes(x.verify)) err(`${w}: verify must be verified or partial`);
    else if (x.verify === 'partial' && !x.verifyNote) err(`${w}: partial needs a verifyNote`);
    if ([...(x.th || '')].length > 48) warn(`${w}: the Thai line is ${[...x.th].length} characters (about 45 fit two lines on the picture)`);
  });
}
for (const id of Object.keys(checklists).filter((k) => !k.startsWith('_'))) if (!GUIDES.some((g) => g.id === id)) err(`checklists.json: "${id}" is not in config.json → guides`);
// The owner's alert: a guide to the top of the start screen, always with an end date.
const ALERT = config.alert || {};
if (ALERT.guide != null) {
  if (!GUIDE_IDS.includes(ALERT.guide)) err(`config.json: alert.guide "${ALERT.guide}" is not a guide`);
  if (!realDay(ALERT.until)) err('config.json: alert.until must be a real date YYYY-MM-DD (an alert always ends by itself)');
  else if (ALERT.until < TODAY) warn(`config.json: alert.until (${ALERT.until}) has passed, so the alert is off; clear it or give a new end date`);
}
// Thai words that never break across lines (util.js → keepWords). Short, Thai
// only: a long glued run could stop a narrow line from breaking at all.
{
  const KEEP = config.keepTogether || [];
  if (!Array.isArray(KEEP)) err('config.json: keepTogether must be a list of Thai words');
  else {
    const allTh = JSON.stringify([strings.th, itemsFile, checklists, readJSON('content/kit.json')]);
    const seen = new Set();
    for (const w of KEEP) {
      if (typeof w !== 'string' || !/^[฀-๿]{2,14}$/.test(w)) err(`config.json: keepTogether "${w}" must be 2–14 Thai letters`);
      else if (seen.has(w)) err(`config.json: keepTogether "${w}" is listed twice`);
      else if (!allTh.includes(w)) warn(`config.json: keepTogether "${w}" appears in no Thai text; remove it`);
      seen.add(w);
    }
  }
}

for (const mode of MODE_IDS) {
  const n = itemsFile.items.filter((i) => i.mode === mode && roomById.get(i.room)?.enabled).length;
  if (n < config.round.targetsMax) warn(`only ${n} playable ${mode} items for up to ${config.round.targetsMax} targets per round`);
  const list = checklists[mode];
  if (!list || list.items.length !== 10) err(`checklists.json: "${mode}" must have exactly 10 items`);
  else list.items.forEach((x, i) => {
    text(x, `checklists.json ${mode} #${i + 1}`);
    if (x.sprite && !spriteIds.has(x.sprite)) err(`checklists.json ${mode} #${i + 1}: sprite "${x.sprite}" not found`);
  });
}
for (const h of helplines.helplines) {
  if (!/^\d{3,5}$/.test(h.number)) err(`helplines.json: bad number "${h.number}"`);
  if (h.source && !sources[h.source]) err(`helplines.json ${h.number}: unknown source "${h.source}"`);
}
for (const [id, s] of Object.entries(sources)) {
  if (!/^https?:\/\//.test(s.url || '')) err(`sources.json ${id}: url must start with http(s)://`);
}
const keysTh = Object.keys(strings.th || {});
const keysEn = new Set(Object.keys(strings.en || {}));
for (const k of keysTh) if (!keysEn.has(k)) warn(`strings.json: "${k}" has no English text`);

const isPlaceholder = (u) => !u || /\[[A-Z_]+\]/.test(u);
if (isPlaceholder(config.forecastAppUrl)) warn('config.json: forecastAppUrl is still a placeholder (the forecast button stays hidden)');

// The home check: every item and plan field is sourced; every number in a
// quantity appears in one of its sources' title or note, so a count can't be
// made up; both languages everywhere.
{
  const flagIds = new Set((kitFile.flags || []).map((f) => f.id));
  const seenKit = new Set();
  for (const f of kitFile.flags || []) text(f.label, `kit.json flag ${f.id}`);
  for (const it of kitFile.items || []) {
    const where = `kit.json item ${it.id}`;
    if (seenKit.has(it.id)) err(`${where}: duplicate id`);
    seenKit.add(it.id);
    text(it.label, where);
    if (it.for && !flagIds.has(it.for)) err(`${where}: "for" must be one of ${[...flagIds].join(', ')}`);
    if (!['verified', 'partial'].includes(it.verify)) err(`${where}: verify must be verified or partial`);
    if (!(it.sources || []).length) err(`${where}: needs sources`);
    for (const sid of it.sources || []) if (!sources[sid]) err(`${where}: unknown source "${sid}"`);
    const said = (it.sources || []).map((sid) => `${sources[sid]?.title || ''} ${sources[sid]?.note || ''}`).join(' ');
    for (const k of ['perPersonPerDay', 'perPerson', 'days']) {
      const v = it.qty?.[k];
      if (v == null) continue;
      if (!(Number.isInteger(v) && v > 0)) err(`${where}: qty.${k} must be a whole number`);
      else if (v > 1 && !new RegExp(`(^|[^0-9])${v}([^0-9]|$)`).test(said)) err(`${where}: qty.${k} = ${v} is not in any of its sources' title or note`);
    }
    // English may leave a unit out ("3 (one each)"), Thai always counts with one ("3 อัน").
    if (it.qty?.unit && !it.qty.unit.th) err(`${where}: qty.unit needs Thai`);
  }
  for (const f of kitFile.plan || []) {
    const where = `kit.json plan field ${f.id}`;
    text(f.label, where);
    text(f.placeholder, `${where} placeholder`);
    if (!(f.max > 0 && f.max <= 80)) err(`${where}: max must be 1–80 characters`);
    if (f.hint) {
      text(f.hint, `${where} hint`);
      if (!(f.sources || []).length) err(`${where}: a hint needs sources`);
      for (const sid of f.sources || []) if (!sources[sid]) err(`${where}: unknown source "${sid}"`);
    }
  }
  const uiTh = Object.keys(kitFile.ui?.th || {});
  for (const k of uiTh) if (!kitFile.ui?.en?.[k]) err(`kit.json: ui.en.${k} is missing`);
}

// Stop here on content errors: the pages below assume the content is complete.
if (errors.length) finish();

// ---------------------------------------------------------------- site URL
const SITE = (process.env.SITE_URL
  || (!isPlaceholder(config.siteUrl) ? config.siteUrl : '')
  || process.env.CF_PAGES_URL
  || 'https://[DOMAIN]').replace(/\/$/, '');
if (SITE.includes('[DOMAIN]')) warn('No SITE_URL: link previews need an absolute address. Set SITE_URL in the Pages project or config.siteUrl.');

// ---------------------------------------------------------------- OG pages
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const og = strings.og;
const ogEn = strings.ogEn;
if (!ogEn) err('strings.json: "ogEn" (English link previews) is missing');
for (const k of Object.keys(og)) if (k !== '_readme' && ogEn && !(k in ogEn)) err(`strings.json: ogEn.${k} is missing (every "og" key needs an English version)`);
// English pages live under /en/. x-default (people whose language is neither
// Thai nor English) goes to English.
const EN = '/en';
const alt = (thPath, enPath) => [['th', `${SITE}${thPath}`], ['en', `${SITE}${enPath}`], ['x-default', `${SITE}${enPath}`]];
// canonical: where search engines should index this page. The share pages
// (/c/*, /checklist/*) are copies of the app shell, so they point at "/".
// ld: optional JSON-LD object (index.html only).
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const ogBlock = ({ title, desc, image, alt: imgAlt, url, canonical = `${SITE}/`, ld, lang = 'th', alternates = [] }) => [
  '<!--OG:START-->',
  `<link rel="canonical" href="${canonical}">`,
  ...alternates.map(([hl, href]) => `<link rel="alternate" hreflang="${hl}" href="${href}">`),
  '<meta property="og:type" content="website">',
  `<meta property="og:site_name" content="${esc((lang === 'en' ? ogEn : og).siteName)}">`,
  `<meta property="og:title" content="${esc(title)}">`,
  `<meta property="og:description" content="${esc(desc)}">`,
  `<meta property="og:image" content="${SITE}${image}">`,
  '<meta property="og:image:type" content="image/png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  `<meta property="og:image:alt" content="${esc(imgAlt)}">`,
  `<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'th_TH'}">`,
  `<meta property="og:locale:alternate" content="${lang === 'en' ? 'th_TH' : 'en_US'}">`,
  url ? `<meta property="og:url" content="${url}">` : '',
  '<meta name="twitter:card" content="summary_large_image">',
  `<meta name="twitter:image:alt" content="${esc(imgAlt)}">`,
  ld ? jsonLd(ld) : '',
  '<!--OG:END-->',
].filter(Boolean).join('\n');

const indexPath = path.join(PUB, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
// The Thai meta description is generated from og.defaultDesc, like the title (rule 59).
indexHtml = indexHtml.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(og.defaultDesc)}">`);
const OG_RE = /<!--OG:START-->[\s\S]*?<!--OG:END-->/;
if (!OG_RE.test(indexHtml)) err('index.html: OG markers <!--OG:START--> / <!--OG:END--> missing');

const page = (html, block, title) => html
  .replace(OG_RE, block)
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(block.match(/og:description" content="([^"]*)"/)[1])}">`);

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const written = [];
const write = (rel, html) => {
  const file = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(rel);
};

// index.html keeps its own title; only its OG block is refreshed
const seo = strings.seo;
const seoUpdated = seo.updated;
const gameDesc = indexHtml.match(/<meta name="description" content="([^"]*)">/)?.[1] || og.defaultDesc;
// Structured data: lets search engines and AI assistants recognise the game as
// one entity (Thai + English names, free, web-based, about floods).
const indexLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`,
      name: og.siteName, alternateName: ['Baan Rod Mai?', 'บ้านรอดไหม'], inLanguage: 'th',
    },
    {
      '@type': ['VideoGame', 'WebApplication'], '@id': `${SITE}/#game`, url: `${SITE}/`,
      name: og.siteName, alternateName: 'Baan Rod Mai?', description: gameDesc,
      isPartOf: { '@id': `${SITE}/#website` },
      inLanguage: ['th', 'en'], image: `${SITE}/og/default.png`,
      genre: ['Educational game', 'Serious game'], gamePlatform: 'Web browser',
      applicationCategory: 'GameApplication', operatingSystem: 'Any',
      playMode: 'SinglePlayer', timeRequired: 'PT1M', isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' },
      about: ['น้ำท่วม', 'Flood safety', 'ฝุ่น PM2.5', 'PM2.5 air pollution', 'ไฟไหม้', 'Home fire safety', 'ไฟดับ', 'Power cut preparedness', 'น้ำป่า ดินถล่ม', 'Flash floods and landslides', 'พายุ ฟ้าผ่า', 'Storms and lightning', 'แผ่นดินไหว', 'Earthquakes', 'อากาศร้อนจัด', 'Extreme heat'].map((name) => ({ '@type': 'Thing', name })),
      subjectOf: { '@type': 'WebPage', url: `${SITE}/learn` },
      dateModified: seoUpdated,
    },
  ],
};
// One version number: package.json. config.json must match it (the game reads
// it for the About sheet) and the start screen is stamped with it, so the
// version shows even before the script runs.
if (config.version !== pkgVersion) err(`config.json version "${config.version}" must equal package.json version "${pkgVersion}"`);
indexHtml = indexHtml.replace(/(<div class="app-version" id="app-version">)[^<]*(<\/div>)/, `$1v${pkgVersion}$2`);
// The owner's alert is written into the page, so the hub doesn't jump down when
// the script adds it on a slow connection (79 px at 2.75 s on slow 4G). The
// script still hides it after its end date and under a friend's challenge.
const ALERT_RE = /<div class="alert-card" id="alert-card"[^>]*>(?:<button[\s\S]*?<\/button>)?<\/div>/;
const alertHtml = (S) => {
  if (!(ALERT.guide && GUIDE_IDS.includes(ALERT.guide) && ALERT.until >= TODAY)) return '<div class="alert-card" id="alert-card" hidden></div>';
  const g = GUIDES.find((x) => x.id === ALERT.guide);
  const text = fill(S.alertCard, { name: S[`guide${capM(ALERT.guide)}`] });
  return `<div class="alert-card" id="alert-card"><button class="alert-btn" type="button" id="alert-open"><span aria-hidden="true">${esc(g.icon || '📢')}</span><span>${esc(text)}</span><span aria-hidden="true">›</span></button></div>`;
};
if (!ALERT_RE.test(indexHtml)) err('index.html: the #alert-card element is missing');
indexHtml = indexHtml.replace(ALERT_RE, alertHtml(strings.th));
// The start screen's static Thai text comes from strings.json, as the English
// page's does: text edited there can't go stale in index.html (rule 59).
indexHtml = indexHtml.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="(\w+)"[^>]*>)([^<]*)(<\/\2>)/g,
  (m, open, tag, key, text, close) => (typeof strings.th[key] === 'string' && !/\{\w+\}/.test(strings.th[key]) ? `${open}${esc(strings.th[key])}${close}` : m));
// The Thai <title> is generated too, so it names every hazard the game covers.
indexHtml = indexHtml.replace(/<title>[^<]*<\/title>/, `<title>${esc(og.defaultTitle)}</title>`);
indexHtml = indexHtml.replace(OG_RE, ogBlock({
  title: og.defaultTitle, desc: og.defaultDesc, image: '/og/default.png', alt: og.defaultAlt, url: `${SITE}/`, ld: indexLd,
  alternates: alt('/', `${EN}/`),
}));
fs.writeFileSync(indexPath, indexHtml);

// English app shell for /en/: same game, but the HTML that crawlers and link
// previews see is English (lang, title, description, the start-screen text),
// so search engines can index it and shares from English players preview in
// English. The script switches the language from the /en path.
const enText = strings.en;
const localize = (html) => html
  .replace('<html lang="th">', '<html lang="en">')
  .replace('<body class="lang-th">', '<body class="lang-en">')
  .replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="(\w+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (m, open, tag, key, text, close) => (typeof enText[key] === 'string' ? `${open}${esc(enText[key])}${close}` : m))
  .replace(/(<[^>]*\bdata-i18n-aria="(\w+)"[^>]*>)/g,
    (tag, _, key) => (typeof enText[key] === 'string' ? tag.replace(/aria-label="[^"]*"/, `aria-label="${esc(enText[key])}"`) : tag))
  .replace(ALERT_RE, alertHtml(enText))
  .replace(/href="\/learn"/g, `href="${EN}/learn"`)
  .replace(/(<button class="chip" id="btn-lang"[^>]*>)EN(<\/button>)/, '$1ไทย$2');
const enIndexLd = JSON.parse(JSON.stringify(indexLd));
enIndexLd['@graph'][0] = { ...enIndexLd['@graph'][0], '@id': `${SITE}${EN}/#website`, url: `${SITE}${EN}/`, name: ogEn.siteName, alternateName: ['Baan Rod Mai?', og.siteName], inLanguage: 'en' };
enIndexLd['@graph'][1] = { ...enIndexLd['@graph'][1], url: `${SITE}${EN}/`, description: ogEn.defaultDesc, isPartOf: { '@id': `${SITE}${EN}/#website` }, subjectOf: { '@type': 'WebPage', url: `${SITE}${EN}/learn` } };
const enIndexHtml = page(localize(indexHtml), ogBlock({
  title: ogEn.defaultTitle, desc: ogEn.defaultDesc, image: '/og/en/default.png', alt: ogEn.defaultAlt,
  url: `${SITE}${EN}/`, canonical: `${SITE}${EN}/`, ld: enIndexLd, lang: 'en', alternates: alt('/', `${EN}/`),
}), ogEn.defaultTitle);
write('en/index.html', enIndexHtml);

for (const { code: m, id: mode } of MODES) {
  const cap = capM(mode);
  for (let s = 0; s <= 10; s++) {
    const title = fill(og[`challengeTitle${cap}`], { score: s });
    // No og:url here: the shared link must keep its ?h= house key.
    write(`c/${m}${s}.html`, page(indexHtml, ogBlock({
      title, desc: og[`challengeDesc${cap}`], image: `/og/${m}${s}.png`, alt: title,
    }), `${title} · บ้านรอดไหม?`));
  }

  for (let s = 0; s <= 10; s++) {
    const title = fill(ogEn[`challengeTitle${cap}`], { score: s });
    write(`en/c/${m}${s}.html`, page(enIndexHtml, ogBlock({
      title, desc: ogEn[`challengeDesc${cap}`], image: `/og/en/${m}${s}.png`, alt: title,
      canonical: `${SITE}${EN}/`, lang: 'en',
    }), `${title} · Baan Rod Mai?`));
  }
}
// One shareable "what to do" page per guide (/checklist/<id>), game or not:
// the app opens on that guide, and the link preview is its picture. Search
// engines are pointed at the hazard's own page, which has the same list as
// text (the canonical used to be the start screen, so neither was indexed).
for (const id of GUIDE_IDS) {
  const cap = capM(id);
  const slug = config.hazards[GUIDES.find((g) => g.id === id).hazard]?.slug;
  const ct = og[`checklistTitle${cap}`];
  write(`checklist/${id}.html`, page(indexHtml, ogBlock({
    title: ct, desc: og.checklistDesc, image: `/og/checklist-${id}.png`, alt: ct, url: `${SITE}/checklist/${id}`,
    canonical: slug ? `${SITE}/${slug}` : `${SITE}/`,
  }), `${ct} · บ้านรอดไหม?`));
  const cte = ogEn[`checklistTitle${cap}`];
  write(`en/checklist/${id}.html`, page(enIndexHtml, ogBlock({
    title: cte, desc: ogEn.checklistDesc, image: `/og/en/checklist-${id}.png`, alt: cte, url: `${SITE}${EN}/checklist/${id}`,
    canonical: slug ? `${SITE}${EN}/${slug}` : `${SITE}${EN}/`, lang: 'en',
  }), `${cte} · Baan Rod Mai?`));
}

// ---------------------------------------------------------------- SEO / AI search
// The game renders with JavaScript, which most AI crawlers (and link previews)
// never run. /learn is a plain, script-free page with every lesson, its reason
// and its sources, generated from the same JSON the game uses, so search
// engines and AI assistants can read and cite exactly what the game teaches.
if (!seo?.th || !seo?.en || !/^\d{4}-\d{2}-\d{2}$/.test(seo?.updated || '')) err('strings.json: "seo" block (th, en, updated YYYY-MM-DD) is missing or incomplete');
const S = seo.th, E = seo.en;
const seoFiles = [];
const writeSeo = (rel, body) => { fs.writeFileSync(path.join(PUB, rel), body); seoFiles.push(rel); };
const T = (o) => esc(o?.th ?? '');
const En = (o) => (o?.en ? `<span class="en" lang="en">${esc(o.en)}</span>` : '');
const L2 = (o, lang) => (lang === 'en' ? o?.en : o?.th) ?? '';
const LEARN_URL = `${SITE}/learn`;
const roomOrder = roomsFile.rooms.map((r) => r.id);
const lessons = (mode) => itemsFile.items
  .filter((it) => it.mode === mode && it.enabled !== false)
  .sort((a, b) => roomOrder.indexOf(a.room) - roomOrder.indexOf(b.room));
const srcLinks = (ids, lang = 'th') => (ids || []).filter((id) => sources[id])
  .map((id) => {
    const ag = sources[id].agency;
    const name = lang === 'en' ? (seo.en.agencies?.[ag] || ag) : ag;
    return `<a href="${esc(sources[id].url)}">${esc(name)}${sources[id].date ? ` (${esc(sources[id].date.slice(0, 4))})` : ''}</a>`;
  }).join(' · ');
const lessonHtml = (it) => {
  const right = it.choices.find((c) => c.correct);
  const wet = it.wet ? it.wet.choices.find((c) => c.correct) : null;
  return `<article id="${esc(it.id)}">
<h3>${T(it.name)} ${En(it.name)}</h3>
<p class="room">${T(roomById.get(it.room)?.name)} · ${esc(strings.th[`topic_${it.topic}`] || '')}</p>
<p><b>${esc(S.doThis)}:</b> ${T(right.label)} ${En(right.label)}</p>
<p class="tip">${T(it.tip)} ${En(it.tip)}</p>
${it.why ? `<p><b>${esc(S.why)}:</b> ${T(it.why)}</p>` : ''}
${wet ? `<p><b>${esc(S.ifWet)}:</b> ${T(wet.label)} ${En(wet.label)}${it.wet.tip ? ` · ${T(it.wet.tip)}` : ''}</p>` : ''}
<p class="src">${esc(S.sources)}: ${srcLinks([...(it.sources || []), ...(it.wet?.sources || [])])}${it.verify === 'partial' ? ` · <span class="flag">⚠️ ${esc(S.partialNote)}</span>` : ''}</p>
</article>`;
};
const lessonsBy = Object.fromEntries(MODE_IDS.map((id) => [id, lessons(id)]));
const allLessons = MODE_IDS.flatMap((id) => lessonsBy[id]);
// An index by topic, so a link such as /learn#t-health can be shared when a
// topic is in the news. Each entry jumps to the lesson's article.
const topicIndex = (lang) => `<h2 id="topics">${esc((lang === 'en' ? E : S).topicsTitle)}</h2>
${(config.topics || []).map((tp) => {
  const its = allLessons.filter((it) => it.topic === tp);
  return `<div class="tix" id="t-${tp}"><p><b>${esc(strings[lang][`topic_${tp}`])}</b> (${its.length})</p><ul>${its.map((it) => `<li><a href="#${esc(it.id)}">${esc(it.name[lang])}</a></li>`).join('')}</ul></div>`;
}).join('\n')}`;
const nLessons = allLessons.length;
const learnTitle = fill(S.learnTitle, { n: nLessons });
const usedSources = [...new Set(itemsFile.items.flatMap((it) => [...(it.sources || []), ...(it.wet?.sources || [])]))].filter((id) => sources[id]);
const learnLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${LEARN_URL}#article`, url: LEARN_URL, mainEntityOfPage: LEARN_URL,
  headline: S.learnH1, name: learnTitle, description: S.learnDesc,
  inLanguage: 'th', dateModified: seoUpdated, image: `${SITE}/og/default.png`,
  isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#game` },
  isAccessibleForFree: true,
  citation: usedSources.map((id) => sources[id].url),
};
// One template for every plain page (/learn, the hazard pages, both languages).
const SEO_CSS = `body{margin:0;background:#FFF4E3;color:#2b2118;font:17px/1.65 Kanit,"Noto Sans Thai",Tahoma,sans-serif}
main{max-width:720px;margin:0 auto;padding:20px 16px 48px}
.nw{white-space:nowrap}p,li,h1,h2,h3{text-wrap:pretty}
h1{font-size:1.6em;line-height:1.3;margin:.3em 0}h2{margin-top:2em;border-bottom:3px solid #f2c48d}
h3{margin:0 0 .2em;font-size:1.1em}article{background:#fff;border-radius:14px;padding:14px 16px;margin:14px 0}
article p{margin:.35em 0}.en{display:block;color:#6b5a4a;font-size:.86em}h3 .en{display:inline;margin-left:.3em}
.room{color:#8a6d4f;font-size:.85em;margin:0}.tip{background:#fff4e3;border-radius:10px;padding:6px 10px}
.src{font-size:.85em;color:#6b5a4a}.flag{white-space:nowrap}a{color:#9a4a00}
.cta{display:inline-block;background:#FFC83D;color:#3E2A1E;box-shadow:0 4px 0 rgba(62,42,30,.22);font-weight:600;text-decoration:none;border-radius:999px;padding:12px 24px;min-height:44px;box-sizing:border-box}
.src a,.help a{display:inline-block;min-height:44px;line-height:44px}
.src a,.help a{min-width:44px;text-align:center}
.tix{background:#fff;border-radius:14px;padding:8px 14px;margin:10px 0}.tix p{margin:.2em 0}.tix ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.tix li{margin:0}.tix a{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;border:2px solid #f2c48d;border-radius:999px;text-decoration:none;font-size:.92em;box-sizing:border-box}li{margin:.3em 0}footer{margin-top:2em;font-size:.9em;color:#6b5a4a}
.top a,.check a{display:inline-flex;align-items:center;min-height:44px}.play{display:flex;flex-wrap:wrap;gap:10px}.tix a[aria-current]{background:#f2c48d;color:#3E2A1E}
.jump{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.jump a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:2px solid #f2c48d;border-radius:999px;background:#fff;text-decoration:none;font-size:.92em;box-sizing:border-box}
.tel{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0}.tel a{display:inline-grid;place-items:center;min-width:64px;min-height:44px;padding:0 12px;border-radius:999px;background:#FDE3DA;color:#8A2E12;font-weight:600;text-decoration:none;box-sizing:border-box}
h2,h3{scroll-margin-top:8px}.top{font-size:.9em;margin:0}
h2 .en{display:inline;margin-left:.4em;font-size:.7em}
@media (max-width:380px){.tel .lbl{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}h1{font-size:1.3em;line-height:1.25;margin:.2em 0}h2{font-size:1.2em;margin-top:.9em}.tel a{min-width:56px}.jump,.tel{margin:4px 0}main{padding-top:8px}.top{font-size:.85em}}`;
// Thai words in config.json → keepTogether never break across lines (the
// same <span class="nw"> the app adds, util.js → keepWordsIn): text only,
// never inside a tag or an attribute.
const KEEP_RE = (config.keepTogether || []).length ? new RegExp([...config.keepTogether].sort((a, b) => b.length - a.length).join('|'), 'g') : null;
const keepHtml = (html) => (KEEP_RE ? html.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : part.replace(KEEP_RE, '<span class="nw">$&</span>'))).join('') : html);
const seoPage = ({ lang, title, desc, url, thPath, enPath, image, ld, main }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#FFF4E3">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${alt(thPath, enPath).map(([hl, href]) => `<link rel="alternate" hreflang="${hl}" href="${href}">`).join('\n')}
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc((lang === 'en' ? ogEn : og).siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'th_TH'}">
<meta property="og:locale:alternate" content="${lang === 'en' ? 'th_TH' : 'en_US'}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
${ld ? jsonLd(ld) : ''}
<style>
${SEO_CSS}
</style>
</head>
<body>
${lang === 'th' ? keepHtml(main) : main}
</body>
</html>
`;
// English pages must not show Thai outside Thai-tagged spans (link addresses
// and the JSON-LD excepted).
const thaiLeak = (html) => /[฀-๿]/.test(html.replace(/lang="th"[^>]*>[^<]*</g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/href="[^"]*"/g, ''));

// Shared blocks: lessons by mode, the modes' checklists and the helplines.
const sectionsTh = (ids) => ids.map((id) => `<h2 id="${id}">${esc(S[`section${capM(id)}`])} <span class="en" lang="en">${esc(E[`section${capM(id)}`])}</span></h2>
${lessonsBy[id].map(lessonHtml).join('\n')}`).join('\n');
// A checklist, grouped by phase (before, during, after) when it has them. The
// guides with no game carry a source on every line, shown under the line.
const phaseGroups = (list) => {
  const ph = ['before', 'during', 'after'].filter((p) => list.items.some((x) => x.phase === p));
  return ph.length ? ph.map((p) => ({ p, items: list.items.filter((x) => x.phase === p) })) : [{ p: null, items: list.items }];
};
// A guide can name its phases (heat: "if someone is ill from the heat", not "after").
const phaseName = (list, p, lang) => list.phaseNames?.[p]?.[lang] || strings[lang][`phase${capM(p)}`];
const clSrc = (c, lang) => (c.sources?.length ? `<br><span class="src">${esc((lang === 'en' ? E : S).sources)}: ${srcLinks(c.sources, lang)}${c.verify === 'partial' ? ` · <span class="flag">⚠️ ${esc((lang === 'en' ? E : S).partialNote)}</span>` : ''}</span>` : '');
// title = false (a hazard page that is its guide): the H1 says it, so the phases are the headings.
const checklistsTh = (ids, level = 3, title = true) => ids.filter((m) => checklists[m]).map((m) => {
  let n = 0;
  const hp = title ? level + 1 : level;
  return `${title ? `<h${level} id="cl-${m}">${T(checklists[m].title)} ${En(checklists[m].title)}</h${level}>\n` : ''}${phaseGroups(checklists[m]).map((g) => `${g.p ? `<h${hp} id="${m}-${g.p}">${esc(phaseName(checklists[m], g.p, 'th'))} <span class="en" lang="en">${esc(phaseName(checklists[m], g.p, 'en'))}</span></h${hp}>\n` : ''}<ol start="${n + 1}">${g.items.map((c) => (n++, `<li>${esc(c.th)} ${c.en ? `<span class="en" lang="en">${esc(c.en)}</span>` : ''}${clSrc(c, 'th')}</li>`)).join('')}</ol>`).join('\n')}`;
}).join('\n');
const helplineHtml = `<ul class="help">${helplines.helplines.map((h) => `<li><a href="tel:${h.number}"><b>${h.number}</b></a> ${T(h.who)}: ${T(h.what)}</li>`).join('')}</ul>`;

// Hazard pages (/flood, /pm25, /fire and /en/…): one page per hazard with only
// its lessons, so a search such as "ป้องกันฝุ่น PM2.5 ในบ้าน" lands on the answer,
// next to a button that opens that mode (/?mode=dust). Slugs: config.json → hazards.
const hazardList = Object.entries(HAZARDS)
  .map(([id, v]) => ({ id, slug: v.slug, tools: v.tools || [], modes: MODES.filter((m) => m.hazard === id).map((m) => m.id), guides: GUIDES.filter((g) => g.hazard === id).map((g) => g.id) }))
  .filter((h) => h.modes.length || h.guides.length);
const hazardChips = (lang, current) => `<div class="tix" id="hazards"><p><b>${esc((lang === 'en' ? E : S).byHazard)}</b></p><ul>${hazardList.map((h) => `<li><a href="${lang === 'en' ? EN : ''}/${h.slug}"${h.id === current ? ' aria-current="page"' : ''}>${esc((lang === 'en' ? E : S)[`hazard${capM(h.id)}Nav`])}</a></li>`).join('')}</ul></div>`;
const playLinks = (lang, ids) => !ids.length ? '' : `<p class="play">${ids.map((id) => `<a class="cta" href="${lang === 'en' ? EN : ''}/?mode=${id}">${esc(fill((lang === 'en' ? E : S).playMode, { mode: strings[lang][`mode${capM(id)}`], s: config.round[id].seconds }))}</a>`).join(' ')}</p>`;
// Every tool any hazard offers (/?open=kit, /?open=plan), for /learn and llms.txt.
const allTools = { tools: [...new Set(hazardList.flatMap((h) => h.tools))] };
const toolLinks = (lang, h) => h.tools.map((tool) => `<p class="check"><a href="${lang === 'en' ? EN : ''}/?open=${tool}">${esc((lang === 'en' ? E : S)[`tool${capM(tool)}`])}</a></p>`).join('\n');
// "Check before you go" (FloodWatch, Air4Thai), once per address.
const checkLinks = (lang, ids) => {
  const seen = new Set();
  const str = (base, id) => strings[lang][`${base}${capM(id)}`] ?? strings[lang][base];
  return ids.map((id) => [id, modeLink(config, id)])
    .filter(([, u]) => u && !isPlaceholder(u) && !seen.has(u) && seen.add(u))
    .map(([id, u]) => `<p class="check"><a href="${esc(u)}">${esc(str('forecastIcon', id))} ${esc(str('forecastLong', id))}</a></p>`).join('\n');
};

// The top of a hazard page, for someone reading it while it happens: a jump to
// each list (or each phase of a guide) and the three main helplines.
const telRow = (lang) => `<p class="tel"><span>☎️ <span class="lbl">${esc(strings[lang].telFree)}</span></span>${helplines.helplines.filter((x) => x.main).slice(0, 3).map((x) => `<a href="tel:${x.number}">${x.number}</a>`).join('')}</p>`;
const jumpRow = (lang, h, lists) => {
  const guideOnly = !h.modes.length;
  const links = guideOnly
    ? lists.flatMap((g) => phaseGroups(checklists[g]).filter((x) => x.p).map((x) => [`${g}-${x.p}`, phaseName(checklists[g], x.p, lang)]))
    : lists.length > 1 ? lists.map((g) => [`cl-${g}`, strings[lang][`mode${capM(g)}`] || L2(checklists[g].title, lang)]) : [];
  if (!links.length) return '';
  return `<nav class="jump" aria-label="${esc(strings[lang].guideJump)}">${links.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</nav>`;
};

writeSeo('learn.html', seoPage({
  lang: 'th', title: learnTitle, desc: S.learnDesc, url: LEARN_URL, thPath: '/learn', enPath: `${EN}/learn`,
  image: '/og/default.png', ld: learnLd,
  main: `<main>
<p class="top"><a href="/">${esc(og.siteName)}</a> · <a href="${EN}/learn" lang="en" hreflang="en">English</a></p>
<h1>${esc(S.learnH1)}</h1>
<p>${esc(S.learnIntro)}</p>
<p class="en" lang="en">${esc(E.learnIntro)}</p>
<p><a class="cta" href="/">${esc(S.playCta)}</a></p>
<p class="src">${esc(S.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>
${hazardChips('th')}
${topicIndex('th')}
${sectionsTh(MODE_IDS)}
<h2 id="checklists">${esc(S.checklists)}</h2>
${checklistsTh(GUIDE_IDS)}
${toolLinks('th', allTools)}
<h2 id="helplines">${esc(S.helplines)}</h2>
${helplineHtml}
<p><a class="cta" href="/">${esc(S.back)}</a></p>
<footer><p>${esc(strings.th.disclaimer)}</p></footer>
</main>`,
}));

// /en/learn: the same lessons, English first, for international search and
// AI assistants. It says plainly that the advice and hotlines are Thai.
const LEARN_EN = `${SITE}${EN}/learn`;
for (const ag of new Set(Object.values(sources).map((x) => x.agency))) if (!seo.en.agencies?.[ag]) err(`strings.json: seo.en.agencies has no English name for "${ag}"`);
const enLesson = (it) => {
  const right = it.choices.find((c) => c.correct);
  const wet = it.wet ? it.wet.choices.find((c) => c.correct) : null;
  return `<article id="${esc(it.id)}">
<h3>${esc(it.name.en)} <span class="en" lang="th">${esc(it.name.th)}</span></h3>
<p class="room">${esc(roomById.get(it.room)?.name?.en || '')} · ${esc(strings.en[`topic_${it.topic}`] || '')}</p>
<p><b>${esc(E.doThis)}:</b> ${esc(right.label.en)}</p>
<p class="tip">${esc(it.tip.en)}</p>
${it.why?.en ? `<p><b>${esc(E.why)}:</b> ${esc(it.why.en)}</p>` : ''}
${wet ? `<p><b>${esc(E.ifWet)}:</b> ${esc(wet.label.en)}${it.wet.tip?.en ? ` · ${esc(it.wet.tip.en)}` : ''}</p>` : ''}
<p class="src">${esc(E.sources)}: ${srcLinks([...(it.sources || []), ...(it.wet?.sources || [])], 'en')}${it.verify === 'partial' ? ` · <span class="flag">⚠️ ${esc(E.partialNote)}</span>` : ''}</p>
</article>`;
};
const sectionsEn = (ids) => ids.map((id) => `<h2 id="${id}">${esc(E[`section${capM(id)}`])}</h2>
${lessonsBy[id].map(enLesson).join('\n')}`).join('\n');
const checklistsEn = (ids, level = 3, title = true) => ids.filter((m) => checklists[m]).map((m) => {
  let n = 0;
  const hp = title ? level + 1 : level;
  return `${title ? `<h${level} id="cl-${m}">${esc(checklists[m].title.en)}</h${level}>\n` : ''}${phaseGroups(checklists[m]).map((g) => `${g.p ? `<h${hp} id="${m}-${g.p}">${esc(phaseName(checklists[m], g.p, 'en'))}</h${hp}>\n` : ''}<ol start="${n + 1}">${g.items.map((c) => (n++, `<li>${esc(c.en)}${clSrc(c, 'en')}</li>`)).join('')}</ol>`).join('\n')}`;
}).join('\n');
const helplineEn = `<ul class="help">${helplines.helplines.map((h) => `<li><a href="tel:${h.number}"><b>${h.number}</b></a> ${esc(h.who.en)}: ${esc(h.what.en)}</li>`).join('')}</ul>`;
const learnTitleEn = fill(E.learnTitle, { n: nLessons });
const learnEnHtml = seoPage({
  lang: 'en', title: learnTitleEn, desc: E.learnDesc, url: LEARN_EN, thPath: '/learn', enPath: `${EN}/learn`,
  image: '/og/en/default.png',
  ld: { ...learnLd, '@id': `${LEARN_EN}#article`, url: LEARN_EN, mainEntityOfPage: LEARN_EN, headline: E.learnH1, name: learnTitleEn, description: E.learnDesc, inLanguage: 'en', image: `${SITE}/og/en/default.png` },
  main: `<main>
<p class="top"><a href="${EN}/">${esc(ogEn.siteName)}</a> · <a href="/learn" lang="th" hreflang="th">ภาษาไทย</a></p>
<h1>${esc(E.learnH1)}</h1>
<p>${esc(E.learnIntro)}</p>
<p class="tip">${esc(E.intlNote)}</p>
<p><a class="cta" href="${EN}/">${esc(E.playCta)}</a></p>
<p class="src">${esc(E.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>
${hazardChips('en')}
${topicIndex('en')}
${sectionsEn(MODE_IDS)}
<h2 id="checklists">${esc(E.checklists)}</h2>
${checklistsEn(GUIDE_IDS)}
${toolLinks('en', allTools)}
<h2 id="helplines">${esc(E.helplines)}</h2>
${helplineEn}
<p>${esc(E.intlNote)}</p>
<p><a class="cta" href="${EN}/">${esc(E.back)}</a></p>
<footer><p>${esc(strings.en.disclaimer)}</p></footer>
</main>`,
});
fs.mkdirSync(path.join(PUB, 'en'), { recursive: true });
writeSeo('en/learn.html', learnEnHtml);
if (thaiLeak(learnEnHtml)) warn('en/learn.html contains Thai text outside Thai-tagged spans (link addresses excepted)');

for (const h of hazardList) {
  const H = capM(h.id);
  const its = h.modes.flatMap((id) => lessonsBy[id]);
  // A hazard with no game yet (quake, heat…) is its guide: n counts its lines.
  const guideOnly = h.guides.filter((g) => !h.modes.includes(g));
  const n = its.length || guideOnly.reduce((a, g) => a + checklists[g].items.length, 0);
  const cites = [...new Set([...its.flatMap((it) => [...(it.sources || []), ...(it.wet?.sources || [])]), ...guideOnly.flatMap((g) => checklists[g].items.flatMap((x) => x.sources || []))])].filter((id) => sources[id]).map((id) => sources[id].url);
  const lists = [...h.modes, ...guideOnly];
  const picture = (lang) => lists.map((g) => `<p class="check"><a href="${lang === 'en' ? EN : ''}/checklist/${g}">${esc(fill((lang === 'en' ? E : S).guidePicture, { title: L2(checklists[g].title, lang) }))}</a></p>`).join('\n');
  const ld = (lang, url, title) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`, url, mainEntityOfPage: url,
    headline: (lang === 'en' ? E : S)[`hazard${H}H1`], name: title, description: (lang === 'en' ? E : S)[`hazard${H}Desc`],
    inLanguage: lang, dateModified: seoUpdated, image: `${SITE}/og/${lang === 'en' ? 'en/' : ''}checklist-${h.modes[0] || h.guides[0]}.png`,
    isPartOf: { '@id': `${SITE}${lang === 'en' ? EN : ''}/#website` }, about: { '@id': `${SITE}/#game` },
    isAccessibleForFree: true,
    citation: cites,
  });
  const thUrl = `${SITE}/${h.slug}`;
  const titleTh = fill(S[`hazard${H}Title`], { n });
  writeSeo(`${h.slug}.html`, seoPage({
    lang: 'th', title: titleTh, desc: S[`hazard${H}Desc`], url: thUrl, thPath: `/${h.slug}`, enPath: `${EN}/${h.slug}`,
    image: `/og/checklist-${h.modes[0] || h.guides[0]}.png`, ld: ld('th', thUrl, titleTh),
    main: `<main>
<p class="top"><a href="/">${esc(og.siteName)}</a> · <a href="/learn">${esc(fill(S.allLessons, { n: nLessons }))}</a> · <a href="${EN}/${h.slug}" lang="en" hreflang="en">English</a></p>
<h1>${esc(S[`hazard${H}H1`])}</h1>
${jumpRow('th', h, lists)}
${telRow('th')}
${h.modes.length ? `${checklistsTh(lists, 2)}
${picture('th')}
<p>${esc(S[`hazard${H}Intro`])}</p>
${playLinks('th', h.modes)}
${checkLinks('th', h.modes)}
${toolLinks('th', h)}
<p class="src">${esc(S.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>
${sectionsTh(h.modes)}` : `${checklistsTh(lists, 2, false)}
${picture('th')}
<p>${esc(S[`hazard${H}Intro`])}</p>
${toolLinks('th', h)}
<p class="src">${esc(S.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>`}
<h2 id="helplines">${esc(S.helplines)}</h2>
${helplineHtml}
${playLinks('th', h.modes)}
${hazardChips('th', h.id)}
<footer><p>${esc(strings.th.disclaimer)}</p></footer>
</main>`,
  }));
  const enUrl = `${SITE}${EN}/${h.slug}`;
  const titleEn = fill(E[`hazard${H}Title`], { n });
  const enHtml = seoPage({
    lang: 'en', title: titleEn, desc: E[`hazard${H}Desc`], url: enUrl, thPath: `/${h.slug}`, enPath: `${EN}/${h.slug}`,
    image: `/og/en/checklist-${h.modes[0] || h.guides[0]}.png`, ld: ld('en', enUrl, titleEn),
    main: `<main>
<p class="top"><a href="${EN}/">${esc(ogEn.siteName)}</a> · <a href="${EN}/learn">${esc(fill(E.allLessons, { n: nLessons }))}</a> · <a href="/${h.slug}" lang="th" hreflang="th">ภาษาไทย</a></p>
<h1>${esc(E[`hazard${H}H1`])}</h1>
${jumpRow('en', h, lists)}
${telRow('en')}
${h.modes.length ? `${checklistsEn(lists, 2)}
${picture('en')}
<p>${esc(E[`hazard${H}Intro`])}</p>
<p class="tip">${esc(E.intlNote)}</p>
${playLinks('en', h.modes)}
${checkLinks('en', h.modes)}
${toolLinks('en', h)}
<p class="src">${esc(E.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>
${sectionsEn(h.modes)}` : `${checklistsEn(lists, 2, false)}
${picture('en')}
<p>${esc(E[`hazard${H}Intro`])}</p>
<p class="tip">${esc(E.intlNote)}</p>
${toolLinks('en', h)}
<p class="src">${esc(E.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>`}
<h2 id="helplines">${esc(E.helplines)}</h2>
${helplineEn}
${playLinks('en', h.modes)}
${hazardChips('en', h.id)}
<footer><p>${esc(strings.en.disclaimer)}</p></footer>
</main>`,
  });
  writeSeo(`en/${h.slug}.html`, enHtml);
  if (thaiLeak(enHtml)) warn(`en/${h.slug}.html contains Thai text outside Thai-tagged spans`);
}

// /kit and /plan: plain pages for the home check and the plan card, with their
// own link preview (a sample card), every line and its sources for search, and
// a button that opens the tool in the app. Shared cards link here (v1.9.0).
{
  const flagLabel = (id, lang) => L2(kitFile.flags.find((f) => f.id === id)?.label, lang);
  const rule = (x, lang) => {
    const X = lang === 'en' ? E : S;
    const q = x.qty || {};
    const unit = L2(q.unit, lang);
    const r = q.perPersonPerDay != null ? fill(X.kitPerPersonDay, { per: q.perPersonPerDay, unit, days: q.days })
      : q.perPerson != null ? fill(X.kitPerPerson, { per: q.perPerson, unit })
      : q.days != null && q.people ? fill(X.kitDaysPeople, { days: q.days })
      : q.days != null ? fill(X.kitDays, { days: q.days }) : '';
    return [r, x.for ? fill(X.kitIf, { who: flagLabel(x.for, lang) }) : ''].filter(Boolean).join(' · ');
  };
  const src = (x, lang) => `<span class="src">${esc((lang === 'en' ? E : S).sources)}: ${srcLinks(x.sources, lang)}${x.verify !== 'verified' ? ` · <span class="flag">⚠️ ${esc((lang === 'en' ? E : S).partialNote)}</span>` : ''}</span>`;
  const tools = { kit: kitFile.items, plan: kitFile.plan };
  for (const tool of ['kit', 'plan']) {
    for (const lang of LANGS) {
      const X = lang === 'en' ? E : S;
      const pre = lang === 'en' ? EN : '';
      const url = `${SITE}${pre}/${tool}`;
      const rows = tools[tool].map((x) => `<li><b>${esc(x.icon)} ${esc(L2(x.label, lang))}</b>${tool === 'kit' && rule(x, lang) ? ` · ${esc(rule(x, lang))}` : ''}${tool === 'plan' && x.hint ? `<br>${esc(L2(x.hint, lang))}` : ''}<br>${src(x, lang)}</li>`).join('\n');
      const title = X[`${tool}PageTitle`];
      const html = seoPage({
        lang, title, desc: X[`${tool}PageDesc`], url, thPath: `/${tool}`, enPath: `${EN}/${tool}`,
        image: `/og/${lang === 'en' ? 'en/' : ''}${tool}.png`,
        ld: { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#page`, url, name: title, description: X[`${tool}PageDesc`], inLanguage: lang, dateModified: seoUpdated, isPartOf: { '@id': `${SITE}${pre}/#website` }, isAccessibleForFree: true },
        main: `<main>
<p class="top"><a href="${pre}/">${esc((lang === 'en' ? ogEn : og).siteName)}</a> · <a href="${pre}/learn">${esc(fill(X.allLessons, { n: nLessons }))}</a> · ${lang === 'en' ? `<a href="/${tool}" lang="th" hreflang="th">ภาษาไทย</a>` : `<a href="${EN}/${tool}" lang="en" hreflang="en">English</a>`}</p>
<h1>${esc(X[`${tool}PageH1`])}</h1>
<p class="play"><a class="cta" href="${pre}/?open=${tool}">${esc(X[`${tool}PageCta`])}</a></p>
<p>${esc(X[`${tool}PageIntro`])}</p>
<p class="tip">🔒 ${esc(L2({ th: kitFile.ui.th[tool === 'kit' ? 'privacy' : 'planPrivacy'], en: kitFile.ui.en[tool === 'kit' ? 'privacy' : 'planPrivacy'] }, lang))}</p>
<h2>${esc(X[`${tool}PageList`])}</h2>
<ol>
${rows}
</ol>
<p class="play"><a class="cta" href="${pre}/?open=${tool}">${esc(X[`${tool}PageCta`])}</a></p>
<p class="check"><a href="${pre}/${tool === 'kit' ? 'plan' : 'kit'}">${esc(X[`${tool === 'kit' ? 'plan' : 'kit'}PageTitle`])}</a></p>
<p class="src">${esc(X.updated)}: <time datetime="${seoUpdated}">${seoUpdated}</time></p>
<h2 id="helplines">${esc(X.helplines)}</h2>
${lang === 'en' ? helplineEn : helplineHtml}
${hazardChips(lang)}
<footer><p>${esc(strings[lang].disclaimer)}</p></footer>
</main>`,
      });
      writeSeo(`${lang === 'en' ? 'en/' : ''}${tool}.html`, html);
      if (lang === 'en' && thaiLeak(html)) warn(`en/${tool}.html contains Thai text outside Thai-tagged spans`);
    }
  }
}

let postsInfo = '';
// /posts: the carousel images and their post text, for whoever posts on the
// game's pages. Not for search (noindex, not in the sitemap). Images come from
// `npm run images`; a missing one is a warning, the page still lists it.
{
  const C = { config, strings, carousel, items: itemsFile.items, sources, checklists, helplines: helplines.helplines };
  const K = carousel.th;
  const sets = carouselSets(C, SITE, 'th');
  const missing = sets.flatMap((x) => x.pages.map((p) => `${x.dir}/${p.file}`)).filter((f) => !fs.existsSync(path.join(PUB, f)));
  if (missing.length) warn(`${missing.length} carousel image(s) missing, e.g. ${missing[0]}: run npm run images -- --only share/carousel`);
  else {
    let seen = null;
    try { seen = JSON.parse(fs.readFileSync(path.join(PUB, 'share/carousel/manifest.json'), 'utf8')).hash; } catch { /* none yet */ }
    if (seen !== await carouselHash(C, SITE, 'th')) warn('the carousel images are older than the lesson text or the site address: run npm run images -- --only share/carousel');
  }
  const postsHtml = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FFF4E3">
<title>${esc(K.postsTitle)}</title>
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
<style>
${SEO_CSS}
.imgs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:10px 0}.imgs img{display:block;width:100%;height:auto;border-radius:10px;background:#fff}
textarea{display:block;width:100%;min-height:220px;box-sizing:border-box;font:inherit;font-size:.95em;padding:10px;border:2px solid #f2c48d;border-radius:12px;background:#fff;color:inherit}
button.cta{border:0;font:inherit;font-weight:600;cursor:pointer;margin-top:10px}
</style>
</head>
<body>
<main>
<p class="top"><a href="/">${esc(og.siteName)}</a> · <a href="/learn">${esc(fill(S.allLessons, { n: nLessons }))}</a></p>
<h1>${esc(K.postsTitle)}</h1>
<p>${esc(K.postsIntro)}</p>
${sets.map((x) => `<section id="${x.slug}">
<h2>${esc(S[`hazard${capM(x.hazard)}Nav`])}</h2>
<p class="src">${esc(fill(K.postsImages, { n: x.pages.length }))} · <a href="/${x.slug}">${esc(SITE.replace(/^https?:\/\//, ''))}/${x.slug}</a></p>
<div class="imgs">${x.pages.map((p) => `<img src="/${x.dir}/${p.file}" width="1080" height="1350" loading="lazy" alt="${esc(`${p.page}/${p.pages}`)}">`).join('')}</div>
<textarea readonly id="cap-${x.slug}" aria-label="${esc(K.postsCopy)}">${esc(x.caption)}</textarea>
<button class="cta" type="button" data-copy="cap-${x.slug}">${esc(K.postsCopy)}</button>
</section>`).join('\n')}
<section id="guides">
<h2>${esc(K.guidesTitle)}</h2>
<p>${esc(K.guidesIntro)}</p>
${GUIDES.map((g) => `<h3>${esc(g.icon)} ${esc(strings.th[`guide${capM(g.id)}`])}</h3>
<div class="imgs"><img src="/share/checklist-${g.id}.png" width="1080" height="1920" loading="lazy" alt="${esc(checklists[g.id].title.th)}"></div>
<textarea readonly id="cap-guide-${g.id}" aria-label="${esc(K.postsCopy)}">${esc(fill(K.guideCaption, { title: checklists[g.id].title.th, url: `${SITE}/checklist/${g.id}` }))}</textarea>
<button class="cta" type="button" data-copy="cap-guide-${g.id}">${esc(K.postsCopy)}</button>`).join('\n')}
</section>
<footer><p>${esc(strings.th.disclaimer)}</p></footer>
</main>
<script>
for (const b of document.querySelectorAll('[data-copy]')) b.addEventListener('click', async () => {
  const t = document.getElementById(b.dataset.copy);
  try { await navigator.clipboard.writeText(t.value); } catch { t.select(); document.execCommand('copy'); }
  b.textContent = ${JSON.stringify(K.postsCopied)};
});
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(PUB, 'posts.html'), postsHtml);
  postsInfo = `posts.html: ${sets.length} carousel sets, ${sets.reduce((a, x) => a + x.pages.length, 0)} images${missing.length ? ` (${missing.length} missing)` : ''}${carouselPartial.length ? `; lessons under review: ${carouselPartial.join(', ')}` : ''}`;
}

// robots.txt: everyone, including AI search and AI assistants, may read the
// public pages; only the event endpoint is off limits.
// A real "not found" page: Cloudflare Pages answers unknown addresses with it
// and status 404 (without one, every address was the start screen with a 200).
writeSeo('404.html', seoPage({
  lang: 'th', title: `${S.notFoundTitle} · ${og.siteName}`, desc: S.notFoundBody, url: `${SITE}/`, thPath: '/', enPath: `${EN}/`,
  image: '/og/default.png', ld: null,
  main: `<main>
<h1>${esc(S.notFoundTitle)} <span class="en" lang="en">${esc(E.notFoundTitle)}</span></h1>
<p>${esc(S.notFoundBody)}</p>
<p class="en" lang="en">${esc(E.notFoundBody)}</p>
<p class="play"><a class="cta" href="/">${esc(og.siteName)}</a> <a class="cta" href="/?open=guide">${esc(strings.th.hubGuide)}</a></p>
<p class="check"><a href="/learn">${esc(fill(S.allLessons, { n: nLessons }))}</a> · <a href="${EN}/" lang="en">English</a></p>
</main>`,
}).replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">'));

writeSeo('robots.txt', `# ${og.siteName} (Baan Rod Mai?): free home-preparedness tools (what to do, what to keep, a family plan) and a 60-second game.
# Search engines and AI assistants are welcome to read and cite it.
# Generated by tools/build.mjs; do not edit by hand.
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`);

// Each page lists its other-language version (hreflang), as Google asks.
const sitemapPairs = [['/', `${EN}/`], ['/learn', `${EN}/learn`], ...hazardList.map((h) => [`/${h.slug}`, `${EN}/${h.slug}`]), ['/kit', `${EN}/kit`], ['/plan', `${EN}/plan`]];
writeSeo('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPairs.flatMap(([th, en]) => [th, en].map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${seoUpdated}</lastmod>
${alt(th, en).map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`).join('\n')}
  </url>`)).join('\n')}
</urlset>
`);

// llms.txt (llmstxt.org): a Markdown summary written for AI assistants.
const md = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const llmsLesson = (it) => {
  const right = it.choices.find((c) => c.correct);
  return `- **${md(it.name.en)}** (${md(it.name.th)}): ${md(right.label.en)}. ${md(it.tip.th)} [${LEARN_URL}#${it.id}]`;
};
writeSeo('llms.txt', `# ${og.siteName} (Baan Rod Mai?)

> ${md(E.llmsSummary)}

- Play in Thai: ${SITE}/ · in English: ${SITE}${EN}/
- Every lesson with its reason and sources: ${LEARN_URL} (Thai, with English) · ${LEARN_EN} (English)
- One page per hazard, with only its lessons and a link that opens that game mode:
${hazardList.map((h) => `  - ${md(E[`hazard${capM(h.id)}H1`])}: ${SITE}/${h.slug} (Thai) · ${SITE}${EN}/${h.slug} (English)`).join('\n')}
- Two family tools that run on the device; nothing typed is sent: ${allTools.tools.map((tool) => `${md(E[`tool${capM(tool)}`].replace(/^\S+\s/, ''))}: ${SITE}/?open=${tool}`).join(' · ')}
- Most advice comes from Thai government agencies, and the helplines are Thai. Some lessons rest on international guidance (WHO, the US CDC, FEMA, Tokyo Metropolitan Government) and are marked. Outside Thailand, people should follow their local authorities and emergency number.
- Last content update: ${seoUpdated}

${MODE_IDS.map((id) => `## ${md(E[`section${capM(id)}`])} (${md(S[`section${capM(id)}`])})

${lessonsBy[id].map(llmsLesson).join('\n')}
`).join('\n')}
${GUIDES.filter((g) => !MODE_IDS.includes(g.id)).map((g) => `## What to do: ${md(checklists[g.id].title.en)} (${md(checklists[g.id].title.th)})

A short guide with no game yet: ${SITE}/${HAZARDS[g.hazard].slug} · as a picture: ${SITE}/checklist/${g.id}

${checklists[g.id].items.map((x) => `- ${md(x.en)} (${md(x.th)}) [${(x.sources || []).map((id) => sources[id]?.url).filter(Boolean).join(' ')}]${x.verify === 'partial' ? ' (under review)' : ''}`).join('\n')}
`).join('\n')}
## Thai emergency helplines

${helplines.helplines.map((h) => `- ${h.number}: ${md(h.who.en)} (${md(h.who.th)}). ${md(h.what.en)}`).join('\n')}

## Notes for AI assistants

- Content is for learning. In an emergency, point people to the helplines above.
- Every correct action has a source, linked on ${LEARN_URL}: mostly Thai agency guidance. Items marked "under review" there are only partially verified or rest on international guidance only.
- ${md(strings.en.disclaimer)}
`);

// ---------------------------------------------------------------- app version for the code
// main.js compares this with content/config.json on boot; a mismatch means the
// browser mixed two releases, so it clears the caches and reloads once.
fs.writeFileSync(path.join(PUB, 'js/version.js'), `// Generated by tools/build.mjs from package.json. Do not edit.\nexport const APP_VERSION = '${pkgVersion}';\n`);

// ---------------------------------------------------------------- service worker
const listFiles = (dir) => fs.readdirSync(path.join(PUB, dir)).filter((f) => !f.startsWith('.')).map((f) => `/${dir}/${f}`);
const precache = [
  '/',
  '/en/',
  '/css/app.css',
  ...listFiles('js').filter((f) => f.endsWith('.js')),
  ...listFiles('content').filter((f) => f.endsWith('.json') && f !== '/content/carousel.json'),
  '/art/sprites.svg',
  ...enabledRooms.map((r) => r.art),
  ...listFiles('fonts').filter((f) => f.endsWith('.woff2')),
  '/manifest.webmanifest',
  '/icons/icon.svg',
];
const hash = crypto.createHash('sha256');
for (const url of precache) {
  const file = url === '/' ? indexPath : url.endsWith('/') ? path.join(PUB, url, 'index.html') : path.join(PUB, url);
  if (!fs.existsSync(file)) err(`precache: ${url} does not exist`);
  else hash.update(fs.readFileSync(file));
}
const version = hash.digest('hex').slice(0, 10);
const swTemplate = fs.readFileSync(path.join(ROOT, 'tools/sw.template.js'), 'utf8');
fs.writeFileSync(path.join(PUB, 'sw.js'), swTemplate
  .replace("'%%VERSION%%'", `'${version}'`)
  .replace('%%PRECACHE%%', JSON.stringify(precache, null, 2)));

// ---------------------------------------------------------------- size budget
// What the start screen needs before it is interactive (rooms load lazily).
const initial = ['index.html', 'css/app.css', ...listFiles('js').map((f) => f.slice(1)),
  ...['config', 'strings', 'items', 'rooms', 'sources', 'checklists', 'helplines'].map((f) => `content/${f}.json`),
  'fonts/kanit-thai-400.woff2', 'fonts/kanit-thai-600.woff2', 'fonts/kanit-latin-400.woff2', 'fonts/kanit-latin-600.woff2'];
let raw = 0, gz = 0;
for (const rel of initial) {
  const buf = fs.readFileSync(path.join(PUB, rel));
  raw += buf.length;
  gz += rel.endsWith('.woff2') ? buf.length : zlib.gzipSync(buf, { level: 9 }).length;
}
const firstRoom = fs.readFileSync(path.join(PUB, enabledRooms[0].art));
const sprites = fs.readFileSync(path.join(PUB, 'art/sprites.svg'));
const gameStart = gz + zlib.gzipSync(firstRoom).length + zlib.gzipSync(sprites).length;
if (gz > 500 * 1024) err(`initial load is ${(gz / 1024).toFixed(0)} KB compressed (budget 500 KB)`);

// ---------------------------------------------------------------- docs
// docs/01 holds a summary, the table, the flags and the references, all
// generated from the content. `npm run docs` writes them; a normal build only
// warns when the file is out of date, so the counts in it can't drift.
{
  const docPath = path.join(ROOT, 'docs/01-safety-content.md');
  if (fs.existsSync(docPath)) {
    const roomName = (id) => roomById.get(id)?.name?.th || id;
    const flag = { verified: '✅', partial: '⚠️', unverified: '❓' };
    const rows = itemsFile.items.map((it, i) => {
      const right = it.choices.find((c) => c.correct);
      const wrong = it.choices.find((c) => !c.correct);
      const agencies = [...new Set((it.sources || []).map((s) => sources[s]?.agency))].filter(Boolean).join(', ') || '—';
      const refs = (it.sources || []).map((s) => `[${s}]`).join(' ');
      const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
      const row = `| ${i + 1} | ${strings.th[`mode${capM(it.mode)}`] || it.mode} | ${cell(roomName(it.room))}${roomById.get(it.room)?.enabled ? '' : ' (เร็วๆ นี้)'} | ${cell(it.name.th)} | ${cell(wrong.label.th)} | ${cell(right.label.th)} | ${cell(it.tip.th)} | ${flag[it.verify]} ${cell(agencies)} ${refs} |`;
      if (!it.wet) return row;
      const wr = it.wet.choices.find((c) => !c.correct);
      const rr = it.wet.choices.find((c) => c.correct);
      const wAg = [...new Set((it.wet.sources || []).map((s) => sources[s]?.agency))].filter(Boolean).join(', ');
      const wRefs = (it.wet.sources || []).map((s) => `[${s}]`).join(' ');
      return `${row}\n| ${i + 1}b | ก่อนน้ำมา | ${cell(roomName(it.room))} | ${cell(it.name.th)} (น้ำเข้าบ้านแล้ว) | ${cell(wr.label.th)} | ${cell(rr.label.th)} | ${cell(it.wet.tip.th)} | ${flag[it.verify]} ${cell(wAg)} ${wRefs} |`;
    });
    const table = [
      '| # | mode | room | item / hazard | wrong action | correct action | Thai tip (≤80) | official source |',
      '|---|---|---|---|---|---|---|---|',
      ...rows,
    ].join('\n');
    const kindLabel = { official: 'agency site', government: 'government channel (PRD)', secondary: 'news quoting the agency', academic: 'academic statement or peer-reviewed study (not an agency)', international: 'international guidance (cross-check only)' };
    const used = new Set(itemsFile.items.flatMap((it) => [...(it.sources || []), ...(it.wet?.sources || [])]));
    // the guides with no game cite their own sources (checklists.json)
    for (const l of Object.values(checklists)) for (const x of l?.items || []) for (const id of x.sources || []) used.add(id);
    for (const h of helplines.helplines) if (h.source) used.add(h.source);
    for (const k of [...(kitFile.items || []), ...(kitFile.plan || [])]) for (const id of k.sources || []) used.add(id);
    const refs = Object.entries(sources)
      .sort((a, b) => a[1].agency.localeCompare(b[1].agency, 'th') || a[0].localeCompare(b[0]))
      .map(([id, s]) => `- **[${id}]** ${s.agency} — ${s.title}${s.date ? ` (${s.date})` : ''} · _${kindLabel[s.kind] || s.kind}_${used.has(id) ? '' : ' · not cited yet'}  \n  <${s.url}>${s.note ? `  \n  ${s.note}` : ''}`)
      .join('\n');
    const notes = itemsFile.items.filter((it) => it.verifyNote)
      .map((it) => `- ${flag[it.verify]} **${it.name.th}** (\`${it.id}\`): ${it.verifyNote}`).join('\n');
    const count = (f) => itemsFile.items.filter(f).length;
    const playable = count((it) => roomById.get(it.room)?.enabled && it.enabled !== false);
    const summary = `**${itemsFile.items.length} items in ${MODES.length} modes and ${(config.topics || []).length} topics:** `
      + `${MODES.map((m) => `${count((it) => it.mode === m.id)} ${strings.th[`mode${capM(m.id)}`]} (${capM(m.id)})`).join(', ')}. `
      + `${playable} are playable now; ${itemsFile.items.length - playable} wait for a room that is not open yet. `
      + `${count((it) => it.verify === 'verified')} ✅ verified, ${count((it) => it.verify === 'partial')} ⚠️ partial, ${count((it) => it.verify === 'unverified')} ❓ unverified, `
      + `from ${Object.keys(sources).length} sources. Generated by \`npm run docs\` from \`items.json\`.`;
    const before = fs.readFileSync(docPath, 'utf8');
    const doc = before
      .replace(/<!-- SUMMARY:START -->[\s\S]*?<!-- SUMMARY:END -->/, `<!-- SUMMARY:START -->\n${summary}\n<!-- SUMMARY:END -->`)
      .replace(/<!-- TABLE:START -->[\s\S]*?<!-- TABLE:END -->/, `<!-- TABLE:START -->\n${table}\n<!-- TABLE:END -->`)
      .replace(/<!-- NOTES:START -->[\s\S]*?<!-- NOTES:END -->/, `<!-- NOTES:START -->\n${notes}\n<!-- NOTES:END -->`)
      .replace(/<!-- REFS:START -->[\s\S]*?<!-- REFS:END -->/, `<!-- REFS:START -->\n${refs}\n<!-- REFS:END -->`);
    if (process.argv.includes('--docs')) {
      fs.writeFileSync(docPath, doc);
      console.log('docs/01-safety-content.md summary, table, flags and references refreshed');
    } else if (doc !== before) warn('docs/01-safety-content.md is out of date with the content: run npm run docs');
  }
}

finish();

function finish() {
  for (const w of warnings) console.warn(`warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`ERROR: ${e}`);
    console.error(`\nBuild failed: ${errors.length} problem(s) in the content. Nothing was deployed.`);
    process.exit(1);
  }
  if (typeof version !== 'undefined') {
    const pick = recommend(config, TODAY.replace(/-/g, ''));
    const until = (k) => (config[k] ? ` until ${config[k]}` : '');
    console.log(`site      ${SITE}`);
    console.log(`start     ${TODAY}: ${pick.mode} (${pick.why}${pick.why === 'warning' ? until('rainWarningUntil') : ''}) · featured ${pick.topic || 'none'}${pick.topic && pick.topic === config.featuredTopic ? until('featuredTopicUntil') : ''}${ALERT.guide && ALERT.until >= TODAY ? ` · alert ${ALERT.guide} until ${ALERT.until}` : ''}`);
    console.log(`items     ${itemsFile.items.length} (+${itemsFile.decoys.length} decoys), sources ${Object.keys(sources).length}`);
    console.log(`pages     ${written.length} link-preview pages`);
    console.log(`seo       ${seoFiles.join(', ')} (${nLessons} lessons on /learn)`);
    console.log(`posts     ${postsInfo}`);
    console.log(`sw.js     version ${version}, ${precache.length} files precached`);
    console.log(`budget    start screen ${(gz / 1024).toFixed(0)} KB, first game screen ${(gameStart / 1024).toFixed(0)} KB (compressed; limit 500 KB)`);
  }
}

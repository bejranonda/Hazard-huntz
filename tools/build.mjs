#!/usr/bin/env node
// Build step for Cloudflare Pages (no npm dependencies, Node 18+):
//   1. validate every content JSON file (fails the build on mistakes)
//   2. write the link-preview pages: /c/p0..p10, /c/r0..r10, /checklist/*
//   3. stamp the site URL into index.html's Open Graph tags
//   4. generate public/sw.js with a content-hash version and precache list
//   5. check the initial-load budget (< 500 KB)
// Usage: node tools/build.mjs [--docs]   (SITE_URL=https://example.org)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

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
const strings = readJSON('content/strings.json');
const itemsFile = readJSON('content/items.json');
const roomsFile = readJSON('content/rooms.json');
const sourcesFile = readJSON('content/sources.json');
const checklists = readJSON('content/checklists.json');
const helplines = readJSON('content/helplines.json');
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
  if (!['prepare', 'return'].includes(it.mode)) err(`${where}: mode must be "prepare" or "return"`);
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
}
for (const d of itemsFile.decoys) {
  thing(d, `items.json decoy ${d.id}`, 'decoy');
  text(d.note, `items.json decoy ${d.id} note`);
}

for (const mode of ['prepare', 'return']) {
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

// ---------------------------------------------------------------- site URL
const SITE = (process.env.SITE_URL
  || (!isPlaceholder(config.siteUrl) ? config.siteUrl : '')
  || process.env.CF_PAGES_URL
  || 'https://[DOMAIN]').replace(/\/$/, '');
if (SITE.includes('[DOMAIN]')) warn('No SITE_URL: link previews need an absolute address. Set SITE_URL in the Pages project or config.siteUrl.');

// ---------------------------------------------------------------- OG pages
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const og = strings.og;
const ogBlock = ({ title, desc, image, alt, url }) => [
  '<!--OG:START-->',
  '<meta property="og:type" content="website">',
  `<meta property="og:site_name" content="${esc(og.siteName)}">`,
  `<meta property="og:title" content="${esc(title)}">`,
  `<meta property="og:description" content="${esc(desc)}">`,
  `<meta property="og:image" content="${SITE}${image}">`,
  '<meta property="og:image:type" content="image/png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  `<meta property="og:image:alt" content="${esc(alt)}">`,
  '<meta property="og:locale" content="th_TH">',
  url ? `<meta property="og:url" content="${url}">` : '',
  '<meta name="twitter:card" content="summary_large_image">',
  '<!--OG:END-->',
].filter(Boolean).join('\n');

const indexPath = path.join(PUB, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
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
indexHtml = indexHtml.replace(OG_RE, ogBlock({
  title: og.defaultTitle, desc: og.defaultDesc, image: '/og/default.png', alt: og.defaultAlt, url: `${SITE}/`,
}));
fs.writeFileSync(indexPath, indexHtml);

for (const [m, mode] of [['p', 'prepare'], ['r', 'return']]) {
  const cap = mode === 'prepare' ? 'Prepare' : 'Return';
  for (let s = 0; s <= 10; s++) {
    const title = fill(og[`challengeTitle${cap}`], { score: s });
    // No og:url here: the shared link must keep its ?h= house key.
    write(`c/${m}${s}.html`, page(indexHtml, ogBlock({
      title, desc: og[`challengeDesc${cap}`], image: `/og/${m}${s}.png`, alt: title,
    }), `${title} · บ้านรอดไหม?`));
  }
  const ct = og[`checklistTitle${cap}`];
  write(`checklist/${mode}.html`, page(indexHtml, ogBlock({
    title: ct, desc: og.checklistDesc, image: `/og/checklist-${mode}.png`, alt: ct, url: `${SITE}/checklist/${mode}`,
  }), `${ct} · บ้านรอดไหม?`));
}

// ---------------------------------------------------------------- service worker
const listFiles = (dir) => fs.readdirSync(path.join(PUB, dir)).filter((f) => !f.startsWith('.')).map((f) => `/${dir}/${f}`);
const precache = [
  '/',
  '/css/app.css',
  ...listFiles('js').filter((f) => f.endsWith('.js')),
  ...listFiles('content').filter((f) => f.endsWith('.json')),
  '/art/sprites.svg',
  ...enabledRooms.map((r) => r.art),
  ...listFiles('fonts').filter((f) => f.endsWith('.woff2')),
  '/manifest.webmanifest',
  '/icons/icon.svg',
];
const hash = crypto.createHash('sha256');
for (const url of precache) {
  const file = url === '/' ? indexPath : path.join(PUB, url);
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

// ---------------------------------------------------------------- docs (optional)
if (process.argv.includes('--docs')) {
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
      const row = `| ${i + 1} | ${it.mode === 'prepare' ? 'ก่อนน้ำมา' : 'หลังน้ำลด'} | ${cell(roomName(it.room))}${roomById.get(it.room)?.enabled ? '' : ' (เร็วๆ นี้)'} | ${cell(it.name.th)} | ${cell(wrong.label.th)} | ${cell(right.label.th)} | ${cell(it.tip.th)} | ${flag[it.verify]} ${cell(agencies)} ${refs} |`;
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
    const kindLabel = { official: 'agency site', government: 'government channel (PRD)', secondary: 'news quoting the agency' };
    const used = new Set(itemsFile.items.flatMap((it) => [...(it.sources || []), ...(it.wet?.sources || [])]));
    for (const h of helplines.helplines) if (h.source) used.add(h.source);
    const refs = Object.entries(sources)
      .sort((a, b) => a[1].agency.localeCompare(b[1].agency, 'th') || a[0].localeCompare(b[0]))
      .map(([id, s]) => `- **[${id}]** ${s.agency} — ${s.title}${s.date ? ` (${s.date})` : ''} · _${kindLabel[s.kind] || s.kind}_${used.has(id) ? '' : ' · not cited yet'}  \n  <${s.url}>${s.note ? `  \n  ${s.note}` : ''}`)
      .join('\n');
    const notes = itemsFile.items.filter((it) => it.verifyNote)
      .map((it) => `- ${flag[it.verify]} **${it.name.th}** (\`${it.id}\`): ${it.verifyNote}`).join('\n');
    const doc = fs.readFileSync(docPath, 'utf8')
      .replace(/<!-- TABLE:START -->[\s\S]*?<!-- TABLE:END -->/, `<!-- TABLE:START -->\n${table}\n<!-- TABLE:END -->`)
      .replace(/<!-- NOTES:START -->[\s\S]*?<!-- NOTES:END -->/, `<!-- NOTES:START -->\n${notes}\n<!-- NOTES:END -->`)
      .replace(/<!-- REFS:START -->[\s\S]*?<!-- REFS:END -->/, `<!-- REFS:START -->\n${refs}\n<!-- REFS:END -->`);
    fs.writeFileSync(docPath, doc);
    console.log('docs/01-safety-content.md table refreshed');
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
    console.log(`site      ${SITE}`);
    console.log(`items     ${itemsFile.items.length} (+${itemsFile.decoys.length} decoys), sources ${Object.keys(sources).length}`);
    console.log(`pages     ${written.length} link-preview pages`);
    console.log(`sw.js     version ${version}, ${precache.length} files precached`);
    console.log(`budget    start screen ${(gz / 1024).toFixed(0)} KB, first game screen ${(gameStart / 1024).toFixed(0)} KB (compressed; limit 500 KB)`);
  }
}

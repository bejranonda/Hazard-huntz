// Browser smoke test in headless Chromium, mimicking Cloudflare Pages routing.
//   node tests/smoke.mjs                 run checks
//   node tests/smoke.mjs --screens DIR   also save screenshots for the docs
//   SMOKE_DATE=2026-12-05 node tests/smoke.mjs   play on another Bangkok day
// Needs playwright-core and a Chromium (set CHROME_PATH if needed).

import http from 'node:http';
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { setModes, recommend, modeLink } from '../public/js/modes.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const screensArg = process.argv.indexOf('--screens');
const SCREENS = screensArg > 0 ? path.resolve(process.argv[screensArg + 1]) : null;
if (SCREENS) fs.mkdirSync(SCREENS, { recursive: true });

const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/config.json'), 'utf8'));
const STR = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/strings.json'), 'utf8'));
const ITEMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/items.json'), 'utf8')).items;
const CAROUSEL = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/carousel.json'), 'utf8'));
setModes(CFG.modes);
const capM = (id) => id.charAt(0).toUpperCase() + id.slice(1);

// The test plays on a fixed Bangkok day (default 18 Oct 2026), so the season,
// the rain switch and the featured topic never depend on the calendar. What the
// start screen should recommend that day comes from the same pure function.
const SMOKE_DATE = process.env.SMOKE_DATE || '2026-10-18';
if (!/^\d{4}-\d{2}-\d{2}$/.test(SMOKE_DATE)) throw new Error(`SMOKE_DATE must be YYYY-MM-DD, not ${SMOKE_DATE}`);
const dayKey = (d) => d.replace(/-/g, '');
const START = recommend(CFG, dayKey(SMOKE_DATE));

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
let beacons = 0;
const events = []; // every [name, mode, label, value, lang] the pages sent
const sent = []; // every raw body posted to /api/e, to prove what never leaves the device
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/e') {
    beacons++;
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      sent.push(body);
      try { events.push(...JSON.parse(body).e); } catch { /* counted anyway */ }
      res.writeHead(204);
      res.end();
    });
    return;
  }
  let p = decodeURIComponent(url.pathname);
  const candidates = [p, `${p}.html`, path.join(p, 'index.html')].map((c) => path.join(PUB, c));
  let file = candidates.find((f) => f.startsWith(PUB) && fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) file = path.join(PUB, 'index.html'); // Pages without 404.html behaves like an SPA
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const UA = {
  android: 'Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
  line: 'Mozilla/5.0 (Linux; Android 13; SM-A145F wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.0.0 Mobile Safari/537.36 Line/14.16.0/IAB',
  facebook: 'Mozilla/5.0 (Linux; Android 13; SM-A145F wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
};

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// Move the page's clock to 10:00 on a Bangkok day. Only Date changes and time
// keeps running: rounds use performance.now() and requestAnimationFrame, which
// Playwright's clock would freeze.
async function pinDate(ctx, day = SMOKE_DATE) {
  await ctx.addInitScript((target) => {
    const Real = Date;
    const offset = target - Real.now();
    function Pinned(...a) {
      if (!new.target) return new Real(Real.now() + offset).toString();
      return a.length ? new Real(...a) : new Real(Real.now() + offset);
    }
    Pinned.prototype = Real.prototype;
    Pinned.now = () => Real.now() + offset;
    Pinned.parse = Real.parse;
    Pinned.UTC = Real.UTC;
    globalThis.Date = Pinned;
  }, Date.parse(`${day}T10:00:00+07:00`));
}
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

// Players default to a Thai phone in Bangkok (the main audience); the
// international test passes its own locale and time zone.
async function newPage({ width = 390, height = 760, ua = UA.android, reducedMotion = 'no-preference', locale = 'th-TH', timezoneId = 'Asia/Bangkok', day = SMOKE_DATE } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ua, reducedMotion, serviceWorkers: 'block', locale, timezoneId });
  await pinDate(ctx, day);
  // Desktop Chrome on Windows/macOS has Web Share, which opens the OS dialog
  // instead of our share sheet; the cloud Chromium has none. Hide it so every
  // platform tests the same in-page fallback.
  await ctx.addInitScript(() => { delete Navigator.prototype.share; delete Navigator.prototype.canShare; });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errors.push(m.text()); });
  return { ctx, page };
}

// Visible buttons, links and expanders under 44 px (the smaller of width and
// height). Source links inside a line of text ("ที่มา: ปภ. · …") fall under
// WCAG's inline-text exception, so only their padded height is checked.
// Measure once an open sheet has finished sliding in: mid-slide, a control
// laid out at exactly 44 px measured 43.5-44 px in CI's Chrome 153 (51defd8).
// The 0.01 px allowance covers floating-point rounding only.
async function smallControls(page) {
  await page.waitForFunction(() => {
    const sheet = document.querySelector('#sheet');
    return !sheet || sheet.hidden || sheet.getAnimations().every((a) => a.playState !== 'running');
  });
  return page.$$eval('button, a[href], summary, [role="button"]:not(.item)', (els) => els
    .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden')
    .map((e) => {
      const r = e.getBoundingClientRect();
      const size = e.closest('.src') ? r.height : Math.min(r.width, r.height);
      return { size, name: (e.id || e.textContent.trim()).slice(0, 16) };
    })
    .filter((c) => c.size < 43.99)
    .map((c) => `${c.name}: ${c.size.toFixed(2)} px`));
}

async function shot(page, name) {
  if (!SCREENS) return;
  await page.waitForTimeout(450); // let sheets finish sliding in
  await page.screenshot({ path: path.join(SCREENS, `${name}.png`) });
}

// `screens` names the screenshots to take during the round (docs/screens/*.png).
async function playRound(page, mode, { wrongAt = -1, decoy = true, screens = null } = {}) {
  await page.click(`.mode-btn.mode-${mode}`);
  if (await page.$('#howto-go')) {
    if (screens) await shot(page, screens.howto);
    await page.click('#howto-go');
  }
  await page.waitForFunction(() => window.__brm?.state.round?.running);
  await page.waitForTimeout(300);
  if (screens) await shot(page, screens.room);
  const info = await page.evaluate(() => {
    const s = window.__brm.state;
    return {
      rooms: s.house.rooms.map((r) => r.id),
      targets: s.house.targets.map((p) => ({ pid: p.pid, room: p.room })),
      decoys: s.house.decoys.map((p) => ({ pid: p.pid, room: p.room })),
    };
  });
  const go = async (room) => {
    await page.evaluate((i) => window.__brm.state.scene.goTo(i), info.rooms.indexOf(room));
    await page.waitForTimeout(350);
  };
  if (decoy && info.decoys[0]) {
    await go(info.decoys[0].room);
    await page.click(`.item[data-pid="${info.decoys[0].pid}"] .hit`, { force: true });
    await page.waitForTimeout(200);
  }
  let i = 0;
  for (const t of info.targets) {
    const status = await page.evaluate((pid) => window.__brm.state.round?.records.get(pid)?.status, t.pid);
    if (status !== 'pending') continue;
    await go(t.room);
    await page.click(`.item[data-pid="${t.pid}"] .hit`, { force: true });
    await page.waitForSelector('.choice');
    if (screens && i === 0) await shot(page, screens.choice);
    const pick = await page.evaluate(([pid, wrong]) => {
      const s = window.__brm.state;
      const p = s.house.targets.find((x) => x.pid === pid);
      const ch = s.round.choicesFor(p);
      const right = ch.findIndex((c) => c.correct);
      return wrong ? (right + 1) % ch.length : right;
    }, [t.pid, i === wrongAt]);
    await page.click(`.choice >> nth=${pick}`);
    await page.waitForSelector('#fb-next');
    if (screens && i === 0) await shot(page, screens.tip);
    if (screens && i === wrongAt) await shot(page, screens.learn);
    await page.click('#fb-next');
    i++;
  }
  await page.waitForSelector('#screen-result.active', { timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('#card-img')?.naturalWidth > 0, null, { timeout: 15000 });
  return info;
}

try {
  // 1. Android Chrome, Prepare, full round, result + share fallback
  {
    const { ctx, page } = await newPage();
    const resp = [];
    // Measure what a visitor downloads: Cloudflare compresses text files, so gzip
    // them here too; fonts and images are counted as they are.
    page.on('response', async (r) => {
      const body = await r.body().catch(() => Buffer.alloc(0));
      const text = /text|javascript|json|svg|xml|manifest/.test(r.headers()['content-type'] || '');
      resp.push({ url: r.url(), raw: body.length, len: text ? zlib.gzipSync(body).length : body.length });
    });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    const bytes = resp.reduce((a, r) => a + r.len, 0);
    const raw = resp.reduce((a, r) => a + r.raw, 0);
    check('start screen download < 500 KB (compressed, as served)', bytes < 500 * 1024, `${(bytes / 1024).toFixed(0)} KB compressed, ${(raw / 1024).toFixed(0)} KB raw`);
    await shot(page, '01-start');
    const start = await page.evaluate(() => ({
      mode: document.querySelector('.mode-btn.is-default')?.dataset.mode,
      badge: !!document.querySelector('.mode-btn.is-default .mode-badge:not([hidden])'),
      hero: document.querySelector('#hero-bubble').textContent,
      link: document.querySelector('#forecast-link-start').hidden ? null : document.querySelector('#forecast-link-start').getAttribute('href'),
    }));
    check(`${SMOKE_DATE}: the start screen recommends ${START.mode} (${START.why}) with its badge and gecko line`, start.mode === START.mode && start.badge && start.hero === STR.th[`hero${capM(START.mode)}`], `${start.mode} · ${start.hero}`);
    const wantLink = modeLink(CFG, START.mode) || null;
    check(`its "check before you go" link: ${wantLink || 'none'}`, start.link === wantLink, String(start.link));
    const shownVersion = (await page.textContent('#app-version')).trim();
    check('start screen shows the package.json version', shownVersion === `v${JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version}`, shownVersion);
    await playRound(page, 'prepare', {
      wrongAt: 1,
      screens: { howto: '02-howto', room: '03-room', choice: '04a-choice', tip: '04b-tip-correct', learn: '04c-tip-learned' },
    });
    await shot(page, '05-result');
    const card = await page.evaluate(() => document.querySelector('#card-img').naturalWidth);
    check('result card is 1080 px wide', card === 1080, String(card));
    const ending = await page.evaluate(() => [document.querySelector('#result .bubble').textContent, document.querySelector('#card-img').alt]);
    const endings = ['cheerPerfectPrepare', 'cheerHighPrepare', 'cheerMidPrepare', 'cheerLowPrepare'].flatMap((k) => STR.th[k]);
    const plain = ending[0].replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
    check('the ending on the result screen is a prepare ending, and the shared card carries it (alt text)', endings.includes(ending[0]) && ending[1].endsWith(plain), ending.join(' | '));
    check('lessons list has every target', (await page.$$('.lesson')).length >= 5);
    check('help numbers listed', (await page.$$eval('.help-list .num', (n) => n.map((x) => x.textContent))).join() .includes('1784'));
    await page.click('#btn-share');
    await page.waitForSelector('.share-grid');
    await shot(page, '06-share');
    const channels = await page.$$eval('[data-ch]', (b) => b.map((x) => x.dataset.ch));
    check('share fallbacks: LINE, Facebook, X, copy', ['line', 'facebook', 'x', 'copy'].every((c) => channels.includes(c)), channels.join());
    const sh = await page.evaluate(() => ({ url: window.__brm.state.share.url, text: window.__brm.state.share.text }));
    check('card and share text carry this house (challenge link + date)', /\/c\/p\d+\?h=\d{8}$/.test(sh.url) && sh.text.includes('บ้านวันที่'), sh.url);
    const order = await page.evaluate(() => {
      const r = document.querySelector('#btn-random').getBoundingClientRect().top;
      const l = document.querySelector('.lesson').getBoundingClientRect().top;
      return [r, l];
    });
    check('replay buttons sit above the lessons', order[0] < order[1], order.map((x) => x.toFixed(0)).join(' < '));
    check('safety book counts the new lessons', /\+\d/.test((await page.textContent('#btn-book-new').catch(() => '')) || ''));
    check('no page errors (Android, prepare)', !page.errors.length, page.errors.join(' | '));
    // Events are sent when the page is hidden. Closing the context does not
    // reliably fire that on every runner, so trigger it here.
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(300);
    await ctx.close();
  }

  // 1b. The smallest phones (320x460, iPhone SE 1st gen with toolbars): the
  // room tabs are hidden so the house is bigger and item tap areas reach 44 px
  {
    const { ctx, page } = await newPage({ width: 320, height: 460, ua: UA.iphone });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.click('.mode-btn.mode-return');
    await page.click('#howto-go');
    await page.waitForFunction(() => window.__brm?.state.round?.running);
    const sizes = await page.$$eval('.room:first-child .item .hit', (els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.min(r.width, r.height);
    }));
    const min = Math.min(...sizes);
    check('tap targets >= 44 px on 320x460', min >= 44, `${min.toFixed(1)} px`);
    const smallGame = await smallControls(page);
    check('game controls >= 44 px on 320x460', !smallGame.length, smallGame.join(', '));
    await ctx.close();
  }

  // 2. Return mode on a short iPhone-SE-sized screen: tap targets >= 44 px
  {
    const { ctx, page } = await newPage({ width: 375, height: 548, ua: UA.iphone });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.click('.mode-btn.mode-return');
    await page.click('#howto-go');
    await page.waitForFunction(() => window.__brm?.state.round?.running);
    const sizes = await page.$$eval('.room:first-child .item .hit', (els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.min(r.width, r.height);
    }));
    const min = Math.min(...sizes);
    check('tap targets >= 44 px on 375x548', min >= 44, `${min.toFixed(1)} px`);
    const smallGame = await smallControls(page);
    check('game controls >= 44 px on 375x548', !smallGame.length, smallGame.join(', '));
    await shot(page, '07-return-small');
    await page.evaluate(() => window.__brm.state.round.finish('time'));
    await page.waitForSelector('#screen-result.active', { timeout: 15000 });
    await page.waitForSelector('.lesson details');
    const smallResult = await smallControls(page);
    check('result controls >= 44 px on 375x548', !smallResult.length, smallResult.join(', '));
    check('no page errors (iPhone SE size)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }

  // 2b. Every non-flood mode in the registry plays end to end (v1.5.0: dust, fire)
  for (const m of JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/config.json'), 'utf8')).modes.filter((x) => x.hazard !== 'flood')) {
    const { ctx, page } = await newPage();
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await playRound(page, m.id, { wrongAt: 1, decoy: false });
    const r = await page.evaluate(() => ({
      layer: !!document.querySelector('.haze, .smoke-body, .dark'),
      lessons: document.querySelectorAll('.lesson').length,
    }));
    const okThreat = m.threat ? r.layer : true;
    check(`${m.id} mode: full round, result card, lessons, its threat layer, no page errors`, okThreat && r.lessons >= 5 && !page.errors.length, `${r.lessons} lessons, layer ${r.layer}, ${page.errors.join(' | ')}`);
    await ctx.close();
  }

  // 2b2. A power cut (v1.7.0): the room darkens, the clock shows hours without
  // power, and the fridge's food goes bad at 4 hours if nobody dealt with it.
  for (const m of CFG.modes.filter((x) => x.threat === 'dark')) {
    const { ctx, page } = await newPage();
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.click(`.mode-btn.mode-${m.id}`);
    if (await page.$('#howto-go')) await page.click('#howto-go');
    await page.waitForFunction(() => window.__brm?.state.round?.running);
    const hours = CFG.round[m.id].hours;
    // Jump the story clock to just past 4 hours, then let the game loop tick.
    await page.evaluate((h) => { const r = window.__brm.state.round; r.elapsed = r.duration * (4.05 / h); }, hours);
    await page.waitForTimeout(400);
    const st = await page.evaluate(() => {
      const s = window.__brm.state;
      const fridge = s.house.targets.find((p) => p.ref.lostAfter != null);
      return {
        status: s.round.records.get(fridge.pid).status,
        cls: document.querySelector(`.item[data-pid="${fridge.pid}"]`)?.classList.contains('spoiled'),
        label: document.querySelector('#gauge-label').textContent,
        dark: Number(document.querySelector('.dark')?.getAttribute('opacity')),
      };
    });
    check(`${m.id}: at 4 hours without power the fridge food is lost, the room is darker and the clock says so`,
      st.status === 'flooded' && st.cls && st.label.startsWith(STR.th.darkHours.replace('{h}', '4')) && st.dark > 0.25, JSON.stringify(st));
    await ctx.close();
  }

  // 2b3. The room arrows (‹ ›) sit over the house: they must not cover an
  // item's tap area, or a tap on the item turns the room instead (v1.7.0).
  {
    const covered = [];
    for (const [w, h] of [[390, 760], [360, 640]]) {
      const { ctx, page } = await newPage({ width: w, height: h });
      await page.addInitScript((ids) => { for (const id of ids) localStorage.setItem(`brm:howto-${id}`, 'true'); }, CFG.modes.map((m) => m.id));
      await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
      for (const m of CFG.modes) {
        for (const day of ['20261018', '20261105', '20261212']) {
          await page.evaluate(([id, k]) => window.__brm.startFlow(id, { houseKey: k, kind: 'daily' }), [m.id, day]);
          await page.waitForFunction(() => window.__brm?.state.round?.running);
          const n = await page.evaluate(() => window.__brm.state.house.rooms.length);
          for (let i = 0; i < n; i++) {
            await page.evaluate((idx) => window.__brm.state.scene.goTo(idx), i);
            await page.waitForTimeout(350);
            covered.push(...await page.evaluate((tag) => {
              const arrows = [...document.querySelectorAll('.nav-arrow')].filter((a) => !a.disabled).map((a) => a.getBoundingClientRect());
              const out = [];
              for (const hit of document.querySelectorAll('.item .hit')) {
                const r = hit.getBoundingClientRect();
                if (r.right <= 0 || r.left >= innerWidth) continue;
                for (const a of arrows) {
                  const ox = Math.max(0, Math.min(r.right, a.right) - Math.max(r.left, a.left));
                  const oy = Math.max(0, Math.min(r.bottom, a.bottom) - Math.max(r.top, a.top));
                  const pct = (100 * ox * oy) / (r.width * r.height);
                  if (pct > 5) out.push(`${tag} ${hit.closest('.item').dataset.pid} ${pct.toFixed(0)}%`);
                }
              }
              return out;
            }, `${w}x${h} ${m.id} ${day}`));
          }
          await page.evaluate(() => window.__brm.state.round.finish('time'));
          await page.waitForSelector('#screen-result.active');
        }
      }
      await ctx.close();
    }
    check('the room arrows cover at most 5% of any item\'s tap area (every mode, 3 houses, 390x760 and 360x640)', !covered.length, covered.slice(0, 6).join(' | '));
  }

  // 2c. Code and content from different releases (a cache mixed them): the page
  // clears the caches and reloads once, then still plays, never in a loop.
  {
    const { ctx, page } = await newPage();
    await page.route('**/content/config.json', async (route) => {
      const res = await route.fetch();
      const j = await res.json();
      j.version = '0.0.0-other';
      await route.fulfill({ json: j });
    });
    let loads = 0;
    page.on('load', () => loads++);
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const ok = await page.isVisible('.mode-btn.mode-dust');
    check('code/content version mismatch: reloads once, then the start screen works', loads === 2 && ok, `${loads} loads, dust button ${ok}`);
    await ctx.close();
  }

  // 2d. The funnel on a small Android in LINE (360x640) and the smallest phone:
  // the next step is always on the first screen, without scrolling.
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await playRound(page, 'return', { decoy: false });
    const inView = (sel) => page.evaluate((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom <= innerHeight; }, sel);
    check('result: the main share button is on the first screen (360x640)', await inView('#btn-share'));
    await page.click('#btn-share');
    await page.waitForSelector('#sheet [data-ch="line"]');
    await page.waitForTimeout(400);
    check('share sheet: LINE is on the first screen (360x640)', await inView('#sheet [data-ch="line"]'));
    await ctx.close();
    const small = await newPage({ width: 320, height: 460, ua: UA.iphone });
    await small.page.goto(`${BASE}/c/d7?h=20261016`, { waitUntil: 'networkidle' });
    await small.page.waitForTimeout(300);
    const acc = await small.page.evaluate(() => { const r = document.querySelector('#btn-accept')?.getBoundingClientRect(); return r ? Math.round(r.bottom) : 9999; });
    check('challenge landing: the accept button is on the first screen (320x460)', acc <= 460, `bottom ${acc} px`);
    await small.ctx.close();
  }

  // 3. LINE in-app browser: no Web Share, no download -> long-press hint
  {
    const { ctx, page } = await newPage({ ua: UA.line });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await playRound(page, 'return', { decoy: false });
    await page.click('#btn-share');
    await page.waitForSelector('.share-grid');
    check('LINE in-app: save-image hint shown', await page.isVisible('.save-hint'));
    check('LINE in-app: no download button', !(await page.$('[data-ch="save"]')));
    check('LINE in-app: open-in-browser link', !!(await page.$('a[href*="openExternalBrowser=1"]')));
    await ctx.close();
  }

  // 4. Challenge link reproduces the same house
  {
    const { ctx, page } = await newPage({ ua: UA.facebook });
    await page.goto(`${BASE}/c/r9?h=20261007&fbclid=abc&debug=1`, { waitUntil: 'networkidle' });
    const banner = await page.textContent('#challenge-banner');
    check('challenge banner shows 9/10', banner.includes('9/10'), banner.slice(0, 60));
    await shot(page, '08-challenge');
    await page.click('#btn-accept');
    if (await page.$('#howto-go')) await page.click('#howto-go');
    await page.waitForFunction(() => window.__brm?.state.round?.running);
    const key = await page.evaluate(() => [window.__brm.state.run.houseKey, window.__brm.state.house.mode]);
    check('challenge plays house 20261007 in return mode', key[0] === '20261007' && key[1] === 'return', key.join());
    const target = await page.textContent('#gauge-label');
    check('challenge round shows the target to beat', target.includes('9/10'), target);
    await page.evaluate(() => window.__brm.state.round.finish('time'));
    await page.waitForSelector('#screen-result.active', { timeout: 15000 });
    await page.waitForFunction(() => document.querySelector('#card-img')?.naturalWidth > 0, null, { timeout: 15000 });
    const firstBtn = await page.$eval('#result .btn', (b) => [b.id, b.textContent.trim()]);
    check('after a challenge, the first button challenges back', firstBtn[0] === 'btn-challenge' && firstBtn[1].includes('ส่งกลับไปท้า'), firstBtn.join(' | '));
    await page.click('#btn-challenge');
    await page.waitForSelector('.share-grid');
    check('challenge-back sheet carries the result card', !!(await page.$('#sheet .card-preview')));
    await shot(page, '11-challenge-back');
    const og = await (await fetch(`${BASE}/c/r9`)).text();
    check('challenge page has its own OG image', og.includes('/og/r9.png') && !og.includes('og:url'));
    await ctx.close();
  }

  // 4b. The safety book opens from the start screen
  {
    const { ctx, page } = await newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const chip = (await page.textContent('#btn-book')).trim();
    check('start screen shows the safety book count', /0\/\d{2}/.test(chip), chip);
    await page.click('#btn-book');
    await page.waitForSelector('.book-grid li');
    const rows = await page.$$eval('.book-list li, .book-grid li', (l) => l.length);
    check('safety book lists every playable lesson', rows === Number(chip.match(/\/(\d+)/)[1]), String(rows));
    const topicCount = await page.$$eval('.book-topic', (l) => l.length);
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/config.json'), 'utf8'));
    check('safety book is grouped by topic', topicCount === cfg.topics.length, String(topicCount));
    const smallBook = await smallControls(page);
    check('safety book controls >= 44 px', !smallBook.length, smallBook.join(', '));
    await shot(page, '12-book');
    await page.click('#book-close');
    await page.waitForTimeout(400);
    // The featured topic (the news topic until its end date, else the mode's
    // own): a card on the start screen that links to every answer.
    if (START.topic) {
      const href = await page.getAttribute('#featured-read', 'href');
      check(`start screen features "${START.topic}" on ${SMOKE_DATE}`, (await page.isVisible('#featured')) && href === `/learn#t-${START.topic}`, String(href));
      const learn = await (await fetch(`${BASE}/learn`)).text();
      check('/learn has an anchor for that topic', learn.includes(`id="t-${START.topic}"`));
      await page.click('#featured-book');
      await page.waitForSelector('.book-topic');
      const first = await page.$eval('.book-topic', (el) => el.id);
      check('featured topic opens first in the safety book', first === `book-${START.topic}`, first);
    } else {
      check(`no featured topic on ${SMOKE_DATE}`, await page.isHidden('#featured'));
    }
    check('no page errors (safety book)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }

  // 5. Checklist deep link + English toggle
  {
    const { ctx, page } = await newPage();
    await page.goto(`${BASE}/checklist/return`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#cl-img')?.naturalWidth > 0, null, { timeout: 15000 });
    check('checklist image renders 1080x1920', await page.evaluate(() => {
      const i = document.querySelector('#cl-img');
      return i.naturalWidth === 1080 && i.naturalHeight === 1920;
    }));
    await shot(page, '09-checklist');
    const smallSheets = await smallControls(page);
    await page.click('#cl-close');
    for (const what of ['help', 'about']) {
      await page.click(`[data-open="${what}"]`);
      await page.waitForSelector('#sheet-title');
      smallSheets.push(...await smallControls(page));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('#sheet-title'));
    }
    check('checklist, help and about controls >= 44 px', !smallSheets.length, smallSheets.join(', '));
    await page.click('#btn-lang');
    check('English toggle', (await page.textContent('.mode-btn.mode-prepare .mode-name')).includes('Before'));
    await shot(page, '10-english');
    await page.click('[data-open="about"]');
    await page.waitForSelector('#sheet-title');
    const aboutEn = await page.textContent('#sheet-body');
    check('About sheet follows the EN toggle', aboutEn.includes('Privacy') && aboutEn.includes('Baan Rod Mai?'));
    await page.keyboard.press('Escape');
    await ctx.close();
  }

  // 6. Offline after first visit (service worker)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true, locale: 'th-TH', timezoneId: 'Asia/Bangkok' });
    await pinDate(ctx);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => navigator.serviceWorker?.controller || navigator.serviceWorker.ready.then(() => true), null, { timeout: 15000 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    check('loads offline after first visit', await page.isVisible('.mode-btn.mode-prepare'));
    await page.click('.mode-btn.mode-prepare');
    if (await page.$('#howto-go')) await page.click('#howto-go');
    const ok = await page.waitForSelector('.room svg .item', { timeout: 8000 }).then(() => true).catch(() => false);
    check('plays offline after first visit', ok);
    await ctx.close();
  }

  // 7. Reduced motion
  {
    const { ctx, page } = await newPage({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await playRound(page, 'prepare', { decoy: false });
    check('no page errors with reduced motion', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }
  // 8b. Who is NOT sent to English: Thai browsers, a stored Thai choice, ?lang=th, search bots
  {
    const cases = [
      ['Thai browser abroad', { locale: 'th-TH', timezoneId: 'Europe/London' }, '/', null],
      ['English phone on Bangkok time', { locale: 'en-US', timezoneId: 'Asia/Bangkok' }, '/', null],
      ['English visitor with a stored Thai choice', { locale: 'en-GB', timezoneId: 'Europe/London' }, '/', 'th'],
      ['English visitor with ?lang=th', { locale: 'en-GB', timezoneId: 'Europe/London' }, '/?lang=th', null],
      ['Googlebot', { locale: 'en-US', timezoneId: 'UTC', ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X) AppleWebKit/537.36 Chrome/129.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }, '/', null],
    ];
    for (const [name, opts, url, stored] of cases) {
      const { ctx, page } = await newPage(opts);
      if (stored) await page.addInitScript((v) => localStorage.setItem('brm:lang', JSON.stringify(v)), stored);
      await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
      const lang = await page.getAttribute('html', 'lang');
      const here = new URL(page.url()).pathname;
      check(`stays on Thai: ${name}`, here === '/' && lang === 'th', `${here} ${lang}`);
      await ctx.close();
    }
  }

  // 8. International visitor: English browser outside Thailand
  {
    const { ctx, page } = await newPage({ locale: 'en-GB', timezoneId: 'Europe/London' });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const tag = await page.evaluate(() => [document.documentElement.lang, location.pathname, document.querySelector('.mode-btn.mode-prepare .mode-name').textContent]);
    check('international visitor gets English and the /en/ address', tag[0] === 'en' && tag[1] === '/en/' && tag[2].includes('Before'), tag.join(' | '));
    // They are sent to /en/ before any Thai is drawn: the page they land on is already English
    const seen = [];
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(new URL(f.url()).pathname); });
    await page.goto(`${BASE}/c/p8?h=20261007`, { waitUntil: 'networkidle' });
    check('visitor from abroad is sent to /en/ without seeing Thai', page.url().includes('/en/c/p8?h=20261007') && (await page.getAttribute('html', 'lang')) === 'en', seen.join(' > '));
    await page.goto(`${BASE}/en/c/p8?h=20261007`, { waitUntil: 'networkidle' });
    const banner = await page.textContent('#challenge-banner');
    check('English challenge link shows an English banner', /8\/10/.test(banner) && !/[\u0E00-\u0E7F]/.test(banner), banner.trim().slice(0, 60));
    await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
    const title = (await page.textContent('#logo-title')).trim();
    check('English start screen shows the English wordmark', title === 'Baan Rod Mai?', title);
    const html = await (await fetch(`${BASE}/en/`)).text();
    check('/en/ is English before any script runs (lang, title, hreflang, og:locale)',
      html.includes('<html lang="en">') && html.includes('<title>Will the house survive?') && html.includes('hreflang="th"') && html.includes('og:locale" content="en_US"') && html.includes('/og/en/default.png'));
    const learn = await (await fetch(`${BASE}/en/learn`)).text();
    check('/en/learn is the English lessons page', learn.includes('<html lang="en">') && /outside Thailand/i.test(learn) && learn.includes('hreflang="th"'));
    check('no page errors (international)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }
  // 9. What the start screen recommends, by date and by link (v1.6.0)
  {
    const startOf = (page) => page.evaluate(() => ({
      mode: document.querySelector('.mode-btn.is-default')?.dataset.mode,
      hero: document.querySelector('#hero-bubble').textContent,
      feat: document.querySelector('#featured').hidden ? null : document.querySelector('#featured-read')?.getAttribute('href'),
      link: document.querySelector('#forecast-link-start').hidden ? null : document.querySelector('#forecast-link-start').getAttribute('href'),
      playing: !!window.__brm?.state.round,
      screen: document.querySelector('.screen.active')?.id,
      why: window.__brm?.state.start?.why,
      lang: document.documentElement.lang,
      path: location.pathname + location.search,
    }));
    // December: the rain switch has ended by itself, so dust season leads.
    let { ctx, page } = await newPage({ day: '2026-12-05' });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    let st = await startOf(page);
    check('5 Dec 2026: dust is recommended (the rain switch ended on 30 Nov), with the air topic and Air4Thai',
      st.mode === 'dust' && st.hero === STR.th.heroDust && st.feat === '/learn#t-air' && /air4thai/.test(st.link || ''), JSON.stringify(st));
    await ctx.close();

    // A campaign link opens the start screen on that mode; nothing starts by itself.
    ({ ctx, page } = await newPage());
    await page.goto(`${BASE}/?mode=fire&debug=1`, { waitUntil: 'networkidle' });
    st = await startOf(page);
    check('/?mode=fire: fire is the big card, its topic is featured, no round starts',
      st.mode === 'fire' && st.why === 'link' && st.feat === '/learn#t-fire' && !st.playing && st.screen === 'screen-start', JSON.stringify(st));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(400);
    check('a link visit is counted as view · fire · link', events.some((e) => e[0] === 'view' && e[1] === 'fire' && e[2] === 'link'), JSON.stringify(events.filter((e) => e[0] === 'view').slice(-3)));
    await page.goto(`${BASE}/?mode=heat&debug=1`, { waitUntil: 'networkidle' });
    st = await startOf(page);
    check('/?mode=heat (not a mode) is ignored', st.mode === START.mode && st.why !== 'link', JSON.stringify(st));
    await page.goto(`${BASE}/c/d7?h=20261016&mode=fire&debug=1`, { waitUntil: 'networkidle' });
    st = await startOf(page);
    check('a friend\'s challenge beats ?mode=', (await page.isVisible('#btn-accept')) && st.why !== 'link', JSON.stringify(st));
    await page.goto(`${BASE}/en/?mode=dust&debug=1`, { waitUntil: 'networkidle' });
    st = await startOf(page);
    check('/en/?mode=dust opens the English start screen on dust', st.mode === 'dust' && st.lang === 'en' && st.hero === STR.en.heroDust, JSON.stringify(st));
    await ctx.close();

    ({ ctx, page } = await newPage({ locale: 'en-GB', timezoneId: 'Europe/London' }));
    await page.goto(`${BASE}/?mode=dust`, { waitUntil: 'networkidle' });
    st = await startOf(page);
    check('a visitor from abroad keeps the link: /?mode=dust → /en/?mode=dust', st.path === '/en/?mode=dust' && st.mode === 'dust', JSON.stringify(st));
    await ctx.close();
  }

  // 10. Hazard pages: /flood, /pm25, /fire and their English twins (v1.6.0).
  // The server falls back to index.html, so check content, not the status.
  {
    const hz = Object.entries(CFG.hazards).map(([id, v]) => ({ id, slug: v.slug, modes: CFG.modes.filter((m) => m.hazard === id).map((m) => m.id) }));
    const site = CFG.siteUrl.replace(/\/$/, '');
    for (const h of hz) {
      const n = ITEMS.filter((it) => h.modes.includes(it.mode) && it.enabled !== false).length;
      for (const lang of ['th', 'en']) {
        const pre = lang === 'en' ? '/en' : '';
        const html = await (await fetch(`${BASE}${pre}/${h.slug}`)).text();
        const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}');
        const ok = html.includes(`<h1>${STR.seo[lang][`hazard${capM(h.id)}H1`]}</h1>`)
          && html.includes(`<link rel="canonical" href="${site}${pre}/${h.slug}">`)
          && ['th', 'en', 'x-default'].every((hl) => html.includes(`hreflang="${hl}"`))
          && h.modes.every((m) => html.includes(`href="${pre}/?mode=${m}"`))
          && (html.match(/<article /g) || []).length === n
          && ld['@type'] === 'Article' && ld.citation?.length > 0
          && html.includes(`/og/${lang === 'en' ? 'en/' : ''}checklist-${h.modes[0]}.png`);
        check(`${pre}/${h.slug}: H1, canonical, hreflang, play links, ${n} lessons, JSON-LD, preview image`, ok);
      }
    }
    const learn = await (await fetch(`${BASE}/learn`)).text();
    const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
    const llms = await (await fetch(`${BASE}/llms.txt`)).text();
    check('/learn, sitemap.xml and llms.txt link every hazard page', hz.every((h) => learn.includes(`href="/${h.slug}"`) && sitemap.includes(`${site}/${h.slug}</loc>`) && sitemap.includes(`${site}/en/${h.slug}</loc>`) && llms.includes(`${site}/${h.slug} `)));

    // The smallest phone: every control is 44 px and the play button is on the first screen.
    const { ctx, page } = await newPage({ width: 320, height: 460, ua: UA.iphone });
    const bad = [];
    for (const p of [...hz.flatMap((h) => [`/${h.slug}`, `/en/${h.slug}`]), '/learn', '/en/learn']) {
      await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle' });
      const small = await smallControls(page);
      if (small.length) bad.push(`${p}: ${small.join(', ')}`);
      if (p !== '/learn' && p !== '/en/learn') {
        const bottom = await page.$eval('.play a', (a) => a.getBoundingClientRect().bottom);
        if (bottom > 460) bad.push(`${p}: play button at ${Math.round(bottom)} px`);
      }
    }
    check('hazard pages and /learn on 320x460: controls >= 44 px, play button on the first screen', !bad.length, bad.join(' | '));

    // /posts: the carousel images and their post text (v1.6.1), for the team only.
    const posts = await (await fetch(`${BASE}/posts`)).text();
    const imgs = [...posts.matchAll(/<img src="\/([^"]+)"/g)].map((m) => m[1]);
    const wantImgs = hz.reduce((a, h) => a + (CAROUSEL.sets[h.id]?.length ? CAROUSEL.sets[h.id].length + h.modes.length + 2 : 0), 0);
    check(`/posts lists all ${wantImgs} carousel images, each one exists, with a caption per set; noindex and not in the sitemap`,
      imgs.length === wantImgs && imgs.every((f) => fs.existsSync(path.join(PUB, f))) && (posts.match(/<textarea /g) || []).length === hz.filter((h) => CAROUSEL.sets[h.id]?.length).length
      && posts.includes('<meta name="robots" content="noindex, nofollow">') && !sitemap.includes('/posts'), `${imgs.length} images`);
    await page.goto(`${BASE}/posts`, { waitUntil: 'networkidle' });
    const smallPosts = await smallControls(page);
    check('/posts controls >= 44 px on 320x460', !smallPosts.length, smallPosts.join(', '));
    await ctx.close();

    // From a search result to the game: /pm25 → its play button → the dust card.
    const small = await newPage({ width: 360, height: 640 });
    await small.page.goto(`${BASE}/pm25`, { waitUntil: 'networkidle' });
    await shot(small.page, '15-hazard-page');
    await Promise.all([small.page.waitForURL(/\?mode=dust/), small.page.click('.play a')]);
    await small.page.waitForSelector('.mode-btn.is-default');
    const st = await small.page.evaluate(() => [document.querySelector('.mode-btn.is-default').dataset.mode, document.querySelector('.screen.active')?.id]);
    check('/pm25 → play button → the start screen on dust, no round started', st[0] === 'dust' && st[1] === 'screen-start', st.join());
    check('no page errors (links and hazard pages)', !small.page.errors.length, small.page.errors.join(' | '));
    await small.ctx.close();
  }

  // 11. The home check and the family plan card (v1.8.0): amounts follow the
  // household, the card renders and shares, and what people type stays on the device.
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/?open=kit&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#kit-go');
    const smallQ = await smallControls(page);
    await page.click('#kit-plus'); // 3 → 4 people
    await page.click('.kit-flag:has(input[value="meds"])');
    await page.click('#kit-go');
    await page.waitForSelector('.kit-row');
    const list = await page.evaluate(() => ({
      water: document.querySelector('.kit-row input[data-id="water"]')?.closest('.kit-row').querySelector('.kit-qty')?.textContent,
      meds: !!document.querySelector('.kit-row input[data-id="meds"]'),
      baby: !!document.querySelector('.kit-row input[data-id="baby"]'),
    }));
    check('home check: 4 people → 36 litres of water; daily medicine listed, baby items not', /^36 /.test(list.water || '') && list.meds && !list.baby, JSON.stringify(list));
    await page.click('.kit-row:has(input[data-id="water"])');
    const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('brm:kit')));
    check('home check: answers and ticks are kept on the device', kept.people === 4 && kept.have.includes('water') && kept.flags.includes('meds'), JSON.stringify(kept));
    const smallL = await smallControls(page);
    check('home check controls >= 44 px (questions and list)', !smallQ.length && !smallL.length, [...smallQ, ...smallL].join(', '));
    await page.click('#kit-share');
    await page.waitForFunction(() => document.querySelector('#kit-img')?.naturalWidth === 1080, null, { timeout: 15000 });
    const lineOk = await page.evaluate(() => document.querySelector('[data-k="line"]').getBoundingClientRect().bottom <= innerHeight);
    check('home check card renders 1080 px, LINE on the first screen (360x640)', lineOk);
    await page.click('[data-k="copy"]');
    await page.click('#kit-back');
    await page.click('#kit-plan');
    await page.waitForSelector('#plan-make');
    await page.fill('input[name="meet"]', 'PRIVATE-MEETING-PLACE');
    await page.fill('input[name="contact"]', 'PRIVATE 081-234-5678');
    const smallP = await smallControls(page);
    await page.click('#plan-make');
    await page.waitForFunction(() => document.querySelector('#kit-img')?.naturalWidth === 1080, null, { timeout: 15000 });
    await page.click('[data-k="copy"]');
    check('plan card controls >= 44 px; the card renders', !smallP.length, smallP.join(', '));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const leaked = sent.filter((b) => /PRIVATE|081-234/.test(b));
    const names = new Set(events.map((e) => e[0]));
    check('the plan text never leaves the device; only counts are sent (kit_open, kit_share, plan_share)',
      !leaked.length && ['kit_open', 'kit_share', 'plan_share'].every((n) => names.has(n)), `${leaked.length} leaked, events: ${[...names].filter((n) => /kit|plan/.test(n)).join(', ')}`);
    check('no page errors (home check and plan card)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }

  check('analytics beacons received', beacons > 0, String(beacons));
} finally {
  await browser.close();
  server.close();
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

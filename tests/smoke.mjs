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
import { setModes, recommend, modeLink, activeAlert } from '../public/js/modes.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const screensArg = process.argv.indexOf('--screens');
const SCREENS = screensArg > 0 ? path.resolve(process.argv[screensArg + 1]) : null;
if (SCREENS) fs.mkdirSync(SCREENS, { recursive: true });

const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/config.json'), 'utf8'));
const STR = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/strings.json'), 'utf8'));
const ITEMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/items.json'), 'utf8')).items;
const KIT = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/kit.json'), 'utf8'));
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
const ALERT = activeAlert(CFG, dayKey(SMOKE_DATE));
const CHECKLISTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/checklists.json'), 'utf8'));

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
let beacons = 0;
const events = []; // every [name, mode, label, value, lang] the pages sent
const h1 = (html) => (/<h1>([\s\S]*?)<\/h1>/.exec(html)?.[1] || '').replace(/<[^>]+>/g, ''); // the text, without the kept-word spans
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
  // Like Cloudflare Pages: with a top-level 404.html, an unknown address gets it
  // with status 404 (without one, Pages behaves like an SPA and serves index.html).
  let status = 200;
  if (!file) {
    const nf = path.join(PUB, '404.html');
    if (fs.existsSync(nf)) { file = nf; status = 404; } else file = path.join(PUB, 'index.html');
  }
  res.writeHead(status, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
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
    check('a flood result offers the home check (the hazard lists it in config.json → hazards.flood.tools)', await page.isVisible('#btn-kit'));
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
      if (stored) await page.addInitScript((v) => localStorage.setItem('brm:langPick', JSON.stringify(v)), stored);
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
    const hz = Object.entries(CFG.hazards).map(([id, v]) => ({ id, slug: v.slug, tools: v.tools || [], modes: CFG.modes.filter((m) => m.hazard === id).map((m) => m.id), guides: CFG.guides.filter((g) => g.hazard === id).map((g) => g.id) }));
    const site = CFG.siteUrl.replace(/\/$/, '');
    for (const h of hz) {
      const n = ITEMS.filter((it) => h.modes.includes(it.mode) && it.enabled !== false).length;
      for (const lang of ['th', 'en']) {
        const pre = lang === 'en' ? '/en' : '';
        const html = await (await fetch(`${BASE}${pre}/${h.slug}`)).text();
        const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}');
        // (the Thai pages wrap kept words in <span class="nw">, so compare the text)
        const ok = (html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '') === STR.seo[lang][`hazard${capM(h.id)}H1`]
          && html.includes(`<link rel="canonical" href="${site}${pre}/${h.slug}">`)
          && ['th', 'en', 'x-default'].every((hl) => html.includes(`hreflang="${hl}"`))
          && h.modes.every((m) => html.includes(`href="${pre}/?mode=${m}"`))
          && (html.match(/<article /g) || []).length === n
          && ld['@type'] === 'Article' && ld.citation?.length > 0
          && html.includes(`/og/${lang === 'en' ? 'en/' : ''}checklist-${h.modes[0] || h.guides[0]}.png`)
          && h.tools.every((tool) => html.includes(`href="${pre}/?open=${tool}"`))
          // a hazard with no game is its guide: 10 lines, each with a source, and its picture link
          && (h.modes.length || ((html.match(/<li>/g) || []).length >= 10 && html.includes(`href="${pre}/checklist/${h.guides[0]}"`) && (html.match(/class="src"/g) || []).length >= 10));
        check(`${pre}/${h.slug}: H1, canonical, hreflang, ${h.modes.length ? `play links, ${n} lessons` : 'its guide with a source on every line'}, JSON-LD, preview image${h.tools.length ? `, ${h.tools.join(' + ')} links` : ''}`, ok);
      }
    }
    const learn = await (await fetch(`${BASE}/learn`)).text();
    const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
    const llms = await (await fetch(`${BASE}/llms.txt`)).text();
    check('/learn, sitemap.xml and llms.txt link every hazard page', hz.every((h) => learn.includes(`href="/${h.slug}"`) && sitemap.includes(`${site}/${h.slug}</loc>`) && sitemap.includes(`${site}/en/${h.slug}</loc>`) && llms.includes(`${site}/${h.slug} `)));
    const tools = [...new Set(hz.flatMap((h) => h.tools))];
    check('/learn and llms.txt link every tool (the home check, the plan card, the fridge, dust today, the mask tool)', tools.length === CFG.tools.length && tools.every((tool) => learn.includes(`href="/?open=${tool}"`) && llms.includes(`${site}/?open=${tool}`)), tools.join(', '));

    // The smallest phone: every control is 44 px, and a hazard page's first line
    // (and the helplines above it) are on the first screen, before any game button.
    const { ctx, page } = await newPage({ width: 320, height: 460, ua: UA.iphone });
    const bad = [];
    const guideOnly = new Set(hz.filter((h) => !h.modes.length).flatMap((h) => [`/${h.slug}`, `/en/${h.slug}`]));
    for (const p of [...hz.flatMap((h) => [`/${h.slug}`, `/en/${h.slug}`]), '/kit', '/en/kit', '/plan', '/en/plan', '/learn', '/en/learn']) {
      await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle' });
      const small = await smallControls(page);
      if (small.length) bad.push(`${p}: ${small.join(', ')}`);
      if (p !== '/learn' && p !== '/en/learn') {
        // hazard pages lead with their list (v1.9.1); /kit and /plan with the button into the tool
        const hazardPage = !/\/(kit|plan)$/.test(p);
        const at = await page.$eval(hazardPage ? 'main ol li' : '.play a', (a, hp) => (hp ? a.getBoundingClientRect().top + 48 : a.getBoundingClientRect().bottom), hazardPage);
        if (at > 460) bad.push(`${p}: first ${hazardPage ? 'line' : 'button'} at ${Math.round(at)} px`);
        if (hazardPage) {
          const tel = await page.$eval('.tel', (e) => e.getBoundingClientRect().bottom).catch(() => 9999);
          if (tel > 460) bad.push(`${p}: helplines at ${Math.round(tel)} px`);
          const play = await page.$$eval('main > *', (els) => els.findIndex((e) => e.matches('.play')));
          const list = await page.$$eval('main > *', (els) => els.findIndex((e) => e.matches('ol')));
          if (play >= 0 && play < list) bad.push(`${p}: a game button comes before the list`);
        }
      }
    }
    check('hazard pages, /kit, /plan and /learn on 320x460: controls >= 44 px; a hazard page\'s helplines and first line on the first screen, the game after the list', !bad.length, bad.join(' | '));
    // /kit and /plan: their own preview, every line with its source, a button into the tool
    const kitOk = [];
    for (const [tool, n] of [['kit', KIT.items.length], ['plan', KIT.plan.length]]) {
      for (const pre of ['', '/en']) {
        const html = await (await fetch(`${BASE}${pre}/${tool}`)).text();
        kitOk.push(html.includes(`<link rel="canonical" href="${site}${pre}/${tool}">`) && html.includes(`/og/${pre ? 'en/' : ''}${tool}.png`)
          && html.includes(`href="${pre}/?open=${tool}"`) && (html.match(/<li>/g) || []).length >= n && sitemap.includes(`${site}${pre}/${tool}</loc>`) && fs.existsSync(path.join(PUB, `og/${pre ? 'en/' : ''}${tool}.png`)));
      }
    }
    check('/kit and /plan (+ /en): own preview image, every line with its source, a button into the tool, in the sitemap', kitOk.every(Boolean), kitOk.join(','));

    // /posts: the carousel images and their post text (v1.6.1), for the team only.
    const posts = await (await fetch(`${BASE}/posts`)).text();
    const imgs = [...posts.matchAll(/<img src="\/(share\/carousel\/[^"]+)"/g)].map((m) => m[1]);
    const guideImgs = [...posts.matchAll(/<img src="\/(share\/checklist-[^"]+)"/g)].map((m) => m[1]);
    const wantImgs = hz.reduce((a, h) => a + (CAROUSEL.sets[h.id]?.length ? CAROUSEL.sets[h.id].length + h.modes.length + 2 : 0), 0);
    check(`/posts lists all ${wantImgs} carousel images and the ${CFG.guides.length} guide pictures, each one exists, with a caption each; noindex and not in the sitemap`,
      imgs.length === wantImgs && imgs.every((f) => fs.existsSync(path.join(PUB, f))) && (posts.match(/<textarea /g) || []).length === hz.filter((h) => CAROUSEL.sets[h.id]?.length).length + CFG.guides.length
      && guideImgs.length === CFG.guides.length && guideImgs.every((f) => fs.existsSync(path.join(PUB, f)))
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
    // v1.10.0: "how many days will the pills last?" under the medicine line.
    await page.click('#med-calc summary');
    await page.fill('#med-left', '10');
    await page.fill('#med-day', '2');
    const pills = (await page.textContent('#med-out')).trim();
    await page.fill('#med-left', '14');
    const pillsOk = (await page.textContent('#med-out')).trim();
    const medKept = await page.evaluate(() => Object.keys(localStorage).filter((k) => localStorage.getItem(k).includes('"10"') || /med-left/.test(k)));
    check('pills: 10 left at 2 a day last 5 days and need 4 more for 7; 14 is enough; nothing typed is kept',
      pills === KIT.ui.th.medShort.replace('{days}', 5).replace('{target}', 7).replace('{need}', 4) && pillsOk === KIT.ui.th.medEnough.replace('{days}', 7).replace('{target}', 7) && !medKept.length, `${pills} | ${pillsOk}`);
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
    const backLabel = (await page.textContent('#kit-back')).trim();
    await page.click('#kit-back');
    await page.waitForSelector('#plan-make');
    check('plan card: "← แก้แผน" goes back to the form, with what was typed', backLabel === KIT.ui.th.backPlan && (await page.inputValue('input[name="meet"]')) === 'PRIVATE-MEETING-PLACE', backLabel);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const leaked = sent.filter((b) => /PRIVATE|081-234/.test(b));
    const names = new Set(events.map((e) => e[0]));
    check('the plan text never leaves the device; only counts are sent (kit_open, kit_share, plan_open, plan_share)',
      !leaked.length && ['kit_open', 'kit_share', 'plan_open', 'plan_share'].every((n) => names.has(n)), `${leaked.length} leaked, events: ${[...names].filter((n) => /kit|plan/.test(n)).join(', ')}`);
    check('no page errors (home check and plan card)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }

  // 11b. The fridge in a power cut (v1.10.0; one tap since v1.10.1; food by food
  // since v1.11.0): tap how long the power has been off, then one card per part,
  // the foods to throw out and to keep; the time stays on the device.
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/?open=fridge&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.fr-time');
    const fresh = await page.evaluate(() => ({ pick: !!document.querySelector('.fr-pick'), stored: localStorage.getItem('brm:fridge'), chosen: document.querySelectorAll('.fr-time[aria-checked="true"]').length, times: document.querySelectorAll('.fr-time').length }));
    check('fridge: nothing is counted until a time is tapped (no "1 นาที" out of nowhere); 9 times to tap', fresh.pick && !fresh.stored && !fresh.chosen && fresh.times === KIT.fridge.quick.length, JSON.stringify(fresh));
    const cards = () => page.$$eval('.fr-card', (cs) => cs.map((c) => ({ id: c.dataset.part, s: c.className.replace('fr-card ', ''), say: c.querySelector('.fr-say').textContent, d: c.querySelector('.fr-detail').textContent, groups: [...c.querySelectorAll('.fr-group')].map((g) => g.textContent), rows: [...c.querySelectorAll('.fr-foods')].map((l) => l.children.length) })));
    const F = KIT.fridge;
    const nToss = F.foods.filter((f) => f.after === 'discard').length;
    const nKeep = F.foods.filter((f) => f.after === 'keep').length;
    await page.click('.fr-time[data-h="3"]');
    let c = await cards();
    check('fridge: "3 ชม." → the fridge is nearly at 4 hours, about 1 hour left; a half-full freezer (the safer default) about 21 hours',
      c.length === 2 && c[0].s === 'is-soon' && c[0].d.includes('1 ชม.') && c[1].s === 'is-ok' && c[1].d.includes('21 ชม.') && (await page.getAttribute('.fr-time[data-h="3"]', 'aria-checked')) === 'true', JSON.stringify(c));
    check('fridge, food by food: before 4 hours, what will have to go after 4 hours and what keeps',
      c[0].groups[0] === KIT.ui.th.fridgeTossIf.replace('{h}', 4) && c[0].groups[1] === KIT.ui.th.fridgeKeepIf && c[0].rows[0] === nToss && c[0].rows[1] === nKeep, JSON.stringify(c[0]));
    await page.waitForTimeout(700); // the answer scrolls into view smoothly
    const onScreen = await page.evaluate(() => { const r = document.querySelector('.fr-card').getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; });
    check('fridge: the answer is on screen after the tap (360x640)', onScreen);
    await page.click('.fr-time[data-h="6"]');
    await page.click('.fr-seg .kit-flag:has(input[value="half"])');
    await page.click('.fr-flag:has(#fr-med)');
    c = await cards();
    check('fridge: "6 ชม.", half a freezer, cold medicine → the fridge foods listed to throw out and to keep; the freezer about 18 h; insulin still usable; a day for other medicine in about 18 h',
      c.length === 4 && c[0].s === 'is-over' && c[0].groups[0] === KIT.ui.th.fridgeToss && c[0].rows[0] === nToss && /18 ชม\./.test(c[1].d) && c[2].id === 'insulin' && c[2].s === 'is-ok' && c[3].id === 'med' && /18 ชม\./.test(c[3].d), JSON.stringify(c));
    const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('brm:fridge')));
    const want = await page.evaluate(() => Date.now() - 6 * 3600e3);
    check('fridge: the start time and answers are kept on the device', kept.freezer === 'half' && kept.med === true && kept.picked === 6 && Math.abs(kept.start - want) < 120e3, JSON.stringify(kept));
    const smallF = await smallControls(page);
    check('fridge controls >= 44 px', !smallF.length, smallF.join(', '));
    await page.click('[data-t="copy"]');
    await page.click('#fr-close');
    const chip = (await page.textContent('#fridge-chip')).trim();
    check('fridge: the start screen says how long the power has been off', chip === STR.th.hubFridgeRunning.replace('{h}', 6), chip);
    // A day: cold medicine says "check the label" (never "throw it out"); the freezer is checked pack by pack.
    // Closing the sheet steps its history entry back a task later (ui.js settleHistory);
    // a navigation started before that is aborted by it (LESSONS D23).
    await page.waitForFunction(() => !history.state?.brm);
    await page.goto(`${BASE}/?open=fridge&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.fr-card');
    await page.click('.fr-time[data-h="24"]');
    c = await cards();
    const med = c.find((x) => x.id === 'med');
    const fz = c.find((x) => x.id === 'freezer');
    check('fridge: after a day, other cold medicine says "check the label" (🔎), never "throw it out"; the half-full freezer lists each pack',
      med?.s === 'is-check' && med.say.startsWith('🔎') && !/ทิ้ง/.test(med.say) && fz?.s === 'is-over' && fz.rows[0] === F.frozen.length, JSON.stringify([med, fz]));
    await page.click('#fr-reset');
    const back = await page.evaluate(() => ({ text: document.querySelector('#fr-elapsed').textContent, again: !document.querySelector('#fr-again').hidden, cards: document.querySelectorAll('.fr-card').length, end: !!JSON.parse(localStorage.getItem('brm:fridge')).end }));
    check('fridge: "💡 ไฟมาแล้ว" keeps the answer (what to throw out now) and offers to start again', back.text.startsWith('💡') && back.again && back.cards >= 2 && back.end, JSON.stringify(back));
    await page.click('#fr-close');
    const chip2 = (await page.textContent('#fridge-chip')).trim();
    check('fridge: after the power is back, the start screen says what to do next', chip2 === STR.th.hubFridgeBack, chip2);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const names = new Set(events.map((e) => e[0]));
    const leaked = sent.filter((b) => b.includes(String(kept.start).slice(0, 7)));
    check('fridge: only counts are sent (tool_open, tool_share), never the time', names.has('tool_open') && names.has('tool_share') && !leaked.length, [...names].join(', '));
    check('no page errors (fridge)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
    const html = await (await fetch(`${BASE}/fridge`)).text();
    const en = await (await fetch(`${BASE}/en/fridge`)).text();
    check('/fridge and /en/fridge: their own pages, every part, food by food, and its source, a button that opens the tool',
      h1(html) === STR.seo.th.fridgePageH1 && h1(en) === STR.seo.en.fridgePageH1 && (html.match(/<li><b>/g) || []).length >= 6 && html.includes(F.foods[0].label.th) && en.includes(F.foods[0].label.en) && html.includes('href="/?open=fridge"') && en.includes('href="/en/?open=fridge"') && html.includes('cdc.gov') && html.includes('foodsafety.gov'), '');
  }

  // 11c. Dust today (v1.10.0): a reading or a colour → the PCD's level and what
  // everyone, the people at risk and people with a long-term illness do.
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.addInitScript(() => localStorage.setItem('brm:kit', JSON.stringify({ people: 3, flags: ['baby', 'meds'], have: [], answered: true })));
    await page.goto(`${BASE}/?open=air&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.air-colour');
    const first = await page.evaluate(() => ({ colours: [...document.querySelectorAll('.air-colour')].every((c) => c.getBoundingClientRect().bottom <= innerHeight), numberOpen: document.querySelector('#air-num').open }));
    check('dust: the five colours come first, on the first screen; the number is behind "รู้ตัวเลข?"', first.colours && !first.numberOpen, JSON.stringify(first));
    const link = await page.evaluate(() => { const a = document.querySelector('#air-check'); const c = document.querySelector('.air-colours'); return a && c ? { below: a.getBoundingClientRect().top >= c.getBoundingClientRect().bottom, text: a.textContent } : null; });
    check('dust: "don\'t know the colour?" and the Air4Thai link sit right under the colours (v1.11.0)', link?.below && link.text === KIT.ui.th.airCheck, JSON.stringify(link));
    const out = () => page.evaluate(() => ({ text: document.querySelector('#air-out').innerText, lists: document.querySelectorAll('#air-out .air-list').length }));
    await page.click('#air-num summary'); // the number is the second way in; the colour is the first
    await page.fill('#air-v', '82.4');
    let o = await out();
    const A = KIT.air;
    check('dust: 82.4 µg/m³ is red: no outdoor activities, a dust-free room (said to be the DOH), and lines for a long-term illness',
      o.text.includes(A.levels[4].label.th) && o.text.includes(A.levels[4].all[0].th) && o.text.includes(`${A.levels[4].all[3].th} (กรมอนามัย)`) && o.text.includes(A.levels[4].chronic[0].th), o.text.slice(0, 120));
    await page.click('.air-units .kit-flag:has(input[value="aqi"])');
    await page.fill('#air-v', '137');
    o = await out();
    const extra = (l) => l.risk.find((x) => !l.all.some((a) => a.th === x.th));
    check("dust: Thailand's AQI 137 is orange, with the at-risk lines for young children", o.text.includes(A.levels[3].label.th) && o.text.includes(extra(A.levels[3]).th) && o.text.includes('เด็กเล็ก'), o.text.slice(0, 120));
    const baby = () => page.evaluate(() => document.querySelector('#air-out .air-baby')?.innerText || '');
    check('dust: orange says "wear a mask", so it also says children under 2 wear none (v1.11.1)', (await baby()).includes(A.baby.th), await baby());
    await page.click('.air-colour:has(input[value="yellow"])');
    o = await out();
    const twice = await page.$$eval('#air-out .air-list li', (lis) => { const t = lis.map((li) => li.firstChild.textContent.trim()); return t.length - new Set(t).size; });
    check('dust: picking yellow clears the number; the at-risk lines show without ticking anyone, and no line is given twice (v1.11.0)', o.text.includes(A.levels[2].label.th) && (await page.inputValue('#air-v')) === '' && o.text.includes(KIT.ui.th.airAlso) && o.lists === 2 && !twice, o.text.slice(0, 160));
    const small = await smallControls(page);
    check('dust controls >= 44 px', !small.length, small.join(', '));
    await page.click('[data-t="copy"]');
    const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('brm:air')));
    check('dust: the kind of number is kept on the device, the reading is not', kept.unit === 'aqi' && !('value' in kept), JSON.stringify(kept));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const toolEv = events.filter((e) => /^tool_/.test(e[0]) && e[1] === 'air');
    check('dust: only counts are sent (tool_open, tool_share), never the reading', toolEv.some((e) => e[0] === 'tool_open') && toolEv.some((e) => e[0] === 'tool_share') && toolEv.every((e) => !e[3]) && !sent.some((b) => b.includes('82.4')), JSON.stringify(toolEv));
    await page.click('.air-colour:has(input[value="blue"])');
    check('dust: blue says nothing about masks, so no under-2 line either', !(await baby()), await baby());
    check('no page errors (dust)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
    const html = await (await fetch(`${BASE}/air`)).text();
    const en = await (await fetch(`${BASE}/en/air`)).text();
    const pm = await (await fetch(`${BASE}/pm25`)).text();
    check('/air and /en/air: the five colours with their bands and sources; /pm25 links the tool',
      h1(html) === STR.seo.th.airPageH1 && h1(en) === STR.seo.en.airPageH1 && (html.match(/class="dot"/g) || []).length === 5 && html.includes('37.6–75.0') && html.includes('ratchakitcha.soc.go.th') && en.includes('href="/en/?open=air"') && pm.includes('/?open=air'), '');
  }

  // 11d. Which mask, and all tools (v1.12.0): one tap at a time to a status word;
  // a baby never gets a mask, a house fire never sends anyone to look for one;
  // the tools sheet lists every tool and the agencies' own pages.
  {
    const M = KIT.mask;
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/?open=mask&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.mk-opt');
    const first = await page.evaluate(() => ({ opts: document.querySelectorAll('.mk-opt').length, out: document.querySelector('#mk-out').innerText, share: document.querySelector('#mk-share-row').hidden }));
    check('mask: the five situations come first, nothing is answered before a tap, no share yet', first.opts === M.why.length && first.out.includes(KIT.ui.th.maskPick.replace('👆 ', '')) && first.share, JSON.stringify(first));
    await page.click('.mk-opt[data-v="dust"]');
    await page.click('.air-colour[data-v="orange"]');
    await page.click('.mk-opt[data-v="baby"]');
    const out = () => page.evaluate(() => ({ status: document.querySelector('.mk-status')?.innerText.trim(), text: document.querySelector('#mk-out').innerText, card: !!document.querySelector('.mk-card'), cls: document.querySelector('#mk-out').className }));
    let o = await out();
    check('mask: orange dust, a child under 2 → "no mask", the under-2 line, no how-to-wear card', o.status.includes(M.status.baby.th) && o.text.includes(KIT.air.baby.th) && !o.card, JSON.stringify(o));
    await page.click('.mk-opt[data-v="elder"]');
    o = await out();
    check('mask: orange dust, someone over 60 → wear one going out, an N95 or a surgical mask (the DOH), with how to wear it', o.status.includes(M.status.wear.th) && o.text.includes(M.dust.type.risk.th) && o.card, JSON.stringify(o).slice(0, 200));
    await page.click('.air-colour[data-v="yellow"]');
    await page.click('.mk-opt[data-v="adult"]');
    o = await out();
    check('mask: yellow dust, an adult → not yet, wear one from orange (the PCD notice)', o.status.includes(M.status.none.th) && o.text.includes('ส้ม'), JSON.stringify(o).slice(0, 200));
    const smallM = await smallControls(page);
    check('mask controls >= 44 px', !smallM.length, smallM.join(', '));
    await page.click('[data-t="copy"]');
    await page.click('.mk-opt[data-v="fire"]');
    o = await out();
    const fireBtn = await page.$('[data-next="guide"][data-g="fire"]');
    check('mask: a fire in the house → "get out" (DDPM), no mask, no card, and the fire guide one tap away', o.status.includes(M.status.out.th) && !o.card && !!fireBtn && !/N95/.test(o.text), JSON.stringify(o).slice(0, 200));
    await page.click('.mk-opt[data-v="chem"]');
    o = await out();
    check('mask: a factory fire nearby → get away; masks can\'t filter the fumes', o.status.includes(M.status.leave.th) && o.text.includes(M.chem.lines[1].th), JSON.stringify(o).slice(0, 200));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const mEv = events.filter((e) => /^tool_/.test(e[0]) && e[1] === 'mask');
    check('mask: only counts are sent (tool_open, tool_share), never an answer', mEv.some((e) => e[0] === 'tool_open') && mEv.some((e) => e[0] === 'tool_share') && !sent.some((b) => /elder|baby|orange/.test(b)), JSON.stringify(mEv));
    check('no page errors (mask)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/?open=air&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.air-colour');
    await page.click('.air-colour:has(input[value="orange"])');
    await page.click('#air-mask');
    await page.waitForSelector('.mk-opt[data-v="adult"]');
    const pre = await page.evaluate(() => ({ why: document.querySelector('.mk-opt.is-on')?.dataset.v, colour: document.querySelector('.air-colour.is-on')?.dataset.v }));
    check('dust today → "which mask?" opens the mask tool on dust and today\'s colour, asking who', pre.why === 'dust' && pre.colour === 'orange', JSON.stringify(pre));
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.click('[data-open="tools"]');
    await page.waitForSelector('.tl-links');
    const t = await page.evaluate(() => ({
      tools: [...document.querySelectorAll('.tl-row[data-tool]')].map((b) => b.dataset.tool),
      links: [...document.querySelectorAll('.tl-link')].map((a) => ({ href: a.getAttribute('href'), target: a.target, rel: a.rel })),
      alerts: !!document.querySelector('#tl-alerts'),
    }));
    check('all tools: every tool in config order, every agency link (https, opens outside, noopener), and how to turn on emergency alerts',
      JSON.stringify(t.tools) === JSON.stringify(CFG.tools.map((x) => x.id)) && t.links.length === KIT.links.list.length && t.links.every((x) => x.href.startsWith('https://') && x.target === '_blank' && x.rel.includes('noopener')) && t.alerts, JSON.stringify(t).slice(0, 200));
    const smallT = await smallControls(page);
    check('all tools controls >= 44 px', !smallT.length, smallT.join(', '));
    await page.evaluate(() => { for (const a of document.querySelectorAll('.tl-link')) a.addEventListener('click', (e) => e.preventDefault()); });
    await page.click('.tl-link[data-link="linealert"]');
    await page.click('.tl-row[data-tool="mask"]');
    await page.waitForSelector('.mk-opt');
    check('all tools → a tool opens it (the mask tool)', true);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    check('all tools: a tap on an agency link counts as link_click with the link\'s id only', events.some((e) => e[0] === 'link_click' && e[2] === 'linealert'), JSON.stringify(events.filter((e) => e[0] === 'link_click')));
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=checklist-return`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#cl-links .tl-link');
    const g = await page.evaluate(() => ({ ids: [...document.querySelectorAll('#cl-links .tl-link')].map((a) => a.dataset.link), note: document.querySelector('#cl-links .tl-note')?.innerText }));
    const wantG = KIT.links.list.filter((x) => x.guides.includes('return')).map((x) => x.id);
    check('after the water: the guide links the agencies\' own pages (relief with where to apply and "never tap a link in an SMS")', JSON.stringify(g.ids) === JSON.stringify(wantG) && g.note === KIT.links.list.find((x) => x.id === 'relief').note.th, JSON.stringify(g));
    check('no page errors (tools)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
    const mask = await (await fetch(`${BASE}/mask`)).text();
    const maskEn = await (await fetch(`${BASE}/en/mask`)).text();
    const tools = await (await fetch(`${BASE}/tools`)).text();
    const toolsEn = await (await fetch(`${BASE}/en/tools`)).text();
    const map = await (await fetch(`${BASE}/sitemap.xml`)).text();
    check('/mask and /tools (and /en/): every situation and its sources, every agency link, the alert steps; both in the sitemap',
      h1(mask) === STR.seo.th.maskPageH1 && h1(maskEn) === STR.seo.en.maskPageH1 && mask.replace(/<[^>]+>/g, '').includes(KIT.air.baby.th) && mask.includes('ddc.moph.go.th') && h1(tools) === STR.seo.th.toolsPageH1 && h1(toolsEn) === STR.seo.en.toolsPageH1
      && KIT.links.list.every((x) => tools.includes(x.url.replaceAll('&', '&amp;'))) && tools.replace(/<[^>]+>/g, '').includes(KIT.alerts.ios.steps[1].th) && toolsEn.includes('href="/en/?open=tools"') && map.includes('/tools</loc>') && map.includes('/mask</loc>'), '');
  }

  // 11e. Six more tools (v1.13.0): heat today, water, the tank, the emergency card,
  // "I'm safe" and the bag; what is typed or counted stays on the device.
  {
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.addInitScript(() => localStorage.setItem('brm:kit', JSON.stringify({ people: 4, flags: ['baby', 'pet'], have: [], answered: true })));
    await page.goto(`${BASE}/?open=hot&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.hot-level');
    const before = await page.evaluate(() => ({ text: document.querySelector('#hot-out').innerText, share: document.querySelector('#hot-share-row').hidden }));
    await page.click('.hot-level[data-v="danger"]');
    const hot = await page.evaluate(() => ({ text: document.querySelector('#hot-out').innerText, aid: document.querySelector('#hot-aid').open }));
    check('heat today: nothing before a tap; "danger" shows what everyone and the people at risk do (their heading once), and opens the heatstroke signs and first aid', before.share && before.text.includes(KIT.ui.th.hotPick.replace('👆 ', '')) && hot.text.includes(KIT.hot.levels[2].all[0].th) && hot.text.includes('42.0–51.9') && hot.aid && hot.text.split(KIT.ui.th.hotRisk).length === 2, JSON.stringify(hot).slice(0, 160));
    let small = await smallControls(page);
    check('heat today controls >= 44 px', !small.length, small.join(', '));
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=water&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.wt-size');
    const people = await page.textContent('#wt-n');
    for (let i = 0; i < 6; i++) await page.click('[data-s="b1500"][data-d="1"]');
    await page.click('[data-s="g6"][data-d="1"]');
    const wt = await page.evaluate(() => ({ text: document.querySelector('#wt-out').innerText, kept: JSON.parse(localStorage.getItem('brm:water')) }));
    // 6 × 1.5 + 6 = 15 litres for 4 people at 3 L a day: about 1 day, 21 litres short of 3 days.
    check('water: people from the home check (4); 6 large bottles and a 6-litre jug → 15 litres, about 1 day, 21 litres short of 3 days', people.trim() === '4' && wt.text.includes('15 ลิตร') && wt.text.includes(KIT.ui.th.waterDays.replace('{d}', 1)) && wt.text.includes('21') && wt.kept.counts.b1500 === 6, wt.text.slice(0, 160));
    small = await smallControls(page);
    check('water controls >= 44 px', !small.length, small.join(', '));
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=tank&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.tk-size');
    await page.click('.tk-size[data-l="1000"]');
    await page.click('.tk-type[data-t="l5"]');
    const tk = await page.evaluate(() => document.querySelector('#tk-out').innerText);
    await page.fill('#tk-other', '700');
    await page.click('.tk-type[data-t="l10"]');
    const tk2 = await page.evaluate(() => document.querySelector('#tk-out').innerText);
    check('tank: 1,000 litres and 5% liquid → 100 ml; 700 litres and 10% → 35 ml (the MWA and the DDC); the steps say never climb in', tk.includes('100 มล.') && tk2.includes('35 มล.') && (await page.textContent('.tk-steps')).includes('อย่าลงไปในถัง'), `${tk} | ${tk2}`);
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=bag&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.kit-row');
    const bag = await page.evaluate(() => [...document.querySelectorAll('.kit-row input')].map((i) => i.dataset.id));
    await page.click('.kit-row:has(input[data-id="torch"])');
    const bagKept = await page.evaluate(() => JSON.parse(localStorage.getItem('brm:bag')));
    check('bag: every bag\'s list plus the baby and pet rows the home check\'s answers add; a tick is kept on the device', bag.includes('baby') && bag.includes('pet') && !bag.includes('elder') && bagKept.have.includes('torch'), bag.join(','));
    small = await smallControls(page);
    check('bag controls >= 44 px', !small.length, small.join(', '));
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=safe&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.sf-status');
    await page.click('.sf-status[data-v="help"]');
    const help = await page.evaluate(() => ({ shown: !document.querySelector('#sf-help').hidden, tel: [...document.querySelectorAll('#sf-help .tel-chip')].map((a) => a.getAttribute('href')) }));
    await page.click('.sf-status[data-v="moved"]');
    await page.fill('#sf-where', 'บ้านลุงสมชาย');
    const sf = await page.evaluate(() => ({ text: document.querySelector('#sf-preview').innerText, sms: document.querySelector('#sf-sms').getAttribute('href') }));
    check('"I\'m safe": needing help shows 1784 and 1669 to call first; the message names the place typed, and the SMS link carries it', help.shown && help.tel.join() === 'tel:1784,tel:1669' && sf.text.includes('บ้านลุงสมชาย') && sf.sms.startsWith('sms:') && decodeURIComponent(sf.sms).includes('บ้านลุงสมชาย'), JSON.stringify({ help, sf }).slice(0, 200));
    await page.click('#sf-send [data-t="copy"]');
    small = await smallControls(page);
    check('"I\'m safe" controls >= 44 px', !small.length, small.join(', '));
    await page.waitForFunction(() => history.state?.brm);
    await page.goto(`${BASE}/?open=info&debug=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.plan-form input');
    await page.fill('input[name="name"]', 'คุณยายสมศรี');
    await page.fill('input[name="allergy"]', 'แพ้เพนิซิลลิน');
    await page.click('#info-make');
    await page.waitForSelector('#kit-img[src]');
    const info = await page.evaluate(() => ({ kept: JSON.parse(localStorage.getItem('brm:info')), img: document.querySelector('#kit-img').naturalWidth }));
    check('emergency card: the picture is made on the phone and the text kept on it (brm:info)', info.kept.cards[0].name === 'คุณยายสมศรี' && info.img > 0, JSON.stringify(info).slice(0, 160));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(500);
    const opened = new Set(events.filter((e) => e[0] === 'tool_open').map((e) => e[1]));
    check('the six tools count as tool_open, and nothing typed or counted is ever sent', ['hot', 'water', 'tank', 'bag', 'safe', 'info'].every((m) => opened.has(m)) && !sent.some((b) => /สมศรี|ลุงสมชาย|เพนิซิลลิน/.test(b)), [...opened].join(','));
    check('no page errors (six tools)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
    const pages = await Promise.all(['hot', 'water', 'tank', 'info', 'safe', 'bag'].flatMap((x) => [fetch(`${BASE}/${x}`), fetch(`${BASE}/en/${x}`)]).map((r) => r.then((x) => x.text())));
    const ids = ['hot', 'water', 'tank', 'info', 'safe', 'bag'];
    const okPages = ids.every((x, i) => h1(pages[2 * i]) === STR.seo.th[`${x}PageH1`] && h1(pages[2 * i + 1]) === STR.seo.en[`${x}PageH1`] && pages[2 * i].includes(`/?open=${x}`));
    const flat = (h) => h.replace(/<[^>]+>/g, '');
    check('/hot /water /tank /info /safe /bag (and /en/): their own H1, the tool\'s link, and the sourced lines (heat bands, 100 ml per 1,000 litres)', okPages && flat(pages[0]).includes('27.0–32.9') && flat(pages[4]).includes('100 มล. / 1,000 ลิตร'), '');
    // English: a household of one reads "1 person", "1 day", and a chlorine's name
    // inside a sentence is in lower case.
    const en = await newPage({ width: 360, height: 640 });
    await en.page.addInitScript(() => localStorage.setItem('brm:kit', JSON.stringify({ people: 1, flags: [], have: [], answered: true })));
    await en.page.goto(`${BASE}/en/?open=water&debug=1`, { waitUntil: 'networkidle' });
    await en.page.waitForSelector('.wt-size');
    for (let i = 0; i < 2; i++) await en.page.click('[data-s="b1500"][data-d="1"]');
    const enWater = await en.page.evaluate(() => document.querySelector('#wt-out').innerText);
    await en.page.waitForFunction(() => history.state?.brm);
    await en.page.goto(`${BASE}/en/?open=tank&debug=1`, { waitUntil: 'networkidle' });
    await en.page.waitForSelector('.tk-size');
    await en.page.click('.tk-size[data-l="1000"]');
    await en.page.click('.tk-type[data-t="l5"]');
    const enTank = await en.page.evaluate(() => document.querySelector('#tk-out').innerText);
    check('English: one person and 3 litres read "About 1 day" and "1 person at home"; "About 100 ml of liquid chlorine"', enWater.includes('About 1 day') && !/1 days|1 people/.test(enWater) && enWater.includes('1 person at home') && enTank.includes('100 ml of liquid chlorine'), `${enWater.slice(0, 80)} | ${enTank.slice(0, 60)}`);
    await en.ctx.close();
    // Visitor audit 4 (v1.13.0): a way back to the list, the water answer in view,
    // a tank size in คิว, 1669 to tap, and the English app installs in English.
    const a4 = await newPage({ width: 360, height: 640 });
    await a4.page.goto(`${BASE}/?open=tools&debug=1`, { waitUntil: 'networkidle' });
    await a4.page.waitForSelector('[data-tool="water"]');
    await a4.page.click('[data-tool="water"]');
    await a4.page.waitForSelector('#tl-back');
    await a4.page.click('[data-s="b1500"][data-d="1"]');
    const live = await a4.page.evaluate(() => { const el = document.querySelector('#wt-live'); const r = el.getBoundingClientRect(); return { shown: !el.hidden, text: el.innerText, inView: r.top >= 0 && r.bottom <= innerHeight }; });
    await a4.page.click('#tl-back');
    await a4.page.waitForSelector('[data-tool="tank"]');
    const backOk = await a4.page.evaluate(() => !!document.querySelector('.tl-calls a.tel-chip[href="tel:1784"]'));
    await a4.page.click('[data-tool="tank"]');
    await a4.page.waitForSelector('#tk-other');
    await a4.page.click('.tk-type[data-t="l5"]');
    await a4.page.fill('#tk-other', '1.5');
    const hint = await a4.page.evaluate(() => ({ text: document.querySelector('#tk-out').innerText, btn: !!document.querySelector('#tk-cubic') }));
    await a4.page.click('#tk-cubic');
    const cubic = await a4.page.evaluate(() => document.querySelector('#tk-out').innerText);
    check('audit 4: water opened from all tools says "‹ all tools" and shows its answer in view after one tap; back on the list, 1784 is a button; a tank of "1.5" asks about 1.5 คิว, and 1,500 litres of 5% is 150 ml', live.shown && live.inView && backOk && hint.btn && !/มล\./.test(hint.text) && cubic.includes('150 มล.'), JSON.stringify({ live, backOk, hint, cubic: cubic.slice(0, 60) }));
    await a4.page.waitForFunction(() => history.state?.brm);
    await a4.page.goto(`${BASE}/?open=hot&debug=1`, { waitUntil: 'networkidle' });
    await a4.page.waitForSelector('.hot-level');
    const tel1669 = await a4.page.evaluate(() => !!document.querySelector('#hot-aid a.tel-chip[href="tel:1669"]'));
    const enMan = await fetch(`${BASE}/en/manifest.webmanifest`).then((r) => r.json()).catch(() => ({}));
    const enIdx = await fetch(`${BASE}/en/index.html`).then((r) => r.text());
    check('audit 4: heat today\'s first aid has 1669 to tap; /en/ installs as an English app (its own manifest, start page /en/, English shortcuts)', tel1669 && enIdx.includes('href="/en/manifest.webmanifest"') && enMan.start_url === '/en/?source=pwa' && enMan.lang === 'en' && (enMan.shortcuts || []).every((x) => x.url.startsWith('/en/') && !/[\u0E00-\u0E7F]/.test(x.name)), JSON.stringify({ tel1669, start: enMan.start_url }));
    check('no page errors (audit 4 checks)', !a4.page.errors.length, a4.page.errors.join(' | '));
    await a4.ctx.close();
  }

  // 12. Tools first (v1.9.0): what to do for any hazard, what to keep and the
  // family plan on the first screen, the game below; the owner's alert puts one
  // guide on top until its end date; any guide prints as a plain A4 list.
  {
    for (const [w, h] of [[320, 460], [360, 640]]) {
      const { ctx, page } = await newPage({ width: w, height: h });
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      const pos = await page.evaluate(() => ({
        hub: [...document.querySelectorAll('.hub-btn')].map((b) => b.getBoundingClientRect().bottom),
        alert: !document.querySelector('#alert-card').hidden,
        alertText: document.querySelector('#alert-card').textContent,
      }));
      // v1.10.0: two calculators follow, 2 × 2 with the first two tools; since v1.12.0 they follow the
      // season (config.json → hub.season) and "all tools" comes last.
      check(`${w}x${h}: "what to do", "check your supplies" and "family plan" are on the first screen; two seasonal tools and "all tools" follow`, pos.hub.length === 6 && pos.hub.slice(0, 3).every((b) => b <= h), pos.hub.map(Math.round).join(','));
      if (w === 360) {
        const tiles = await page.$$eval('.hub-btn[data-slot]', (bs) => bs.map((b) => b.dataset.open));
        const want = CFG.hub.season[START.mode];
        check(`${SMOKE_DATE}: the two seasonal tiles are ${want.join(' and ')} (config.json → hub.season)`, JSON.stringify(tiles) === JSON.stringify(want), tiles.join(','));
      }
      if (w === 360) check(`${SMOKE_DATE}: the alert card ${ALERT ? `shows ${ALERT}` : 'is hidden'} (config.alert, until its end date)`, pos.alert === !!ALERT && (!ALERT || pos.alertText.includes(STR.th[`guide${capM(ALERT)}`])), pos.alertText.trim());
      await ctx.close();
    }
    const { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.addInitScript(() => { window.print = () => { window.__printed = (window.__printed || 0) + 1; }; });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.click('.hub-main');
    await page.waitForSelector('.guide-grid');
    const tiles = await page.$$eval('[data-guide]', (ts) => ts.map((t) => t.dataset.guide));
    const want = CFG.guides.map((g) => g.id).sort((a, b) => (b === ALERT) - (a === ALERT));
    check('the guide picker lists every guide in config order (the alert first)', JSON.stringify(tiles) === JSON.stringify(want), tiles.join(','));
    const smallP = await smallControls(page);
    const bad = [];
    for (const id of want) {
      await page.click(`[data-guide="${id}"]`);
      await page.waitForSelector('#cl-back');
      await page.waitForFunction(() => document.querySelector('#cl-img')?.naturalWidth === 1080, null, { timeout: 15000 });
      const g = await page.evaluate(() => ({
        title: document.querySelector('#sheet-title').textContent, n: document.querySelectorAll('#sheet .check-list li').length,
        src: !!document.querySelector('#sheet p.src'), play: !!document.querySelector('#cl-play'), read: document.querySelector('#cl-read')?.getAttribute('href'),
      }));
      const isMode = CFG.modes.some((m) => m.id === id);
      const slug = CFG.hazards[CFG.guides.find((x) => x.id === id).hazard].slug;
      if (!(g.title.includes(CHECKLISTS[id].title.th) && g.n === 10 && g.play === isMode && g.read === `/${slug}` && (isMode || g.src))) bad.push(`${id}: ${JSON.stringify(g)}`);
      const small = await smallControls(page);
      if (small.length) bad.push(`${id}: ${small.join(', ')}`);
      await page.click('#cl-back');
      await page.waitForSelector('.guide-grid');
    }
    check(`every guide (${want.length}) opens: 10 lines, its picture, ▶ only with a game, a link to its page, sources on the guides with no game, controls >= 44 px`, !bad.length && !smallP.length, [...bad, ...smallP].join(' | '));
    await page.click('[data-guide="quake"]');
    await page.waitForSelector('#cl-print');
    await page.click('#cl-print');
    await page.emulateMedia({ media: 'print' });
    const pr = await page.evaluate(() => ({
      printed: window.__printed, items: document.querySelectorAll('#print-area li').length, flagged: [...document.querySelectorAll('#print-area li small')].length,
      area: getComputedStyle(document.querySelector('#print-area')).display,
      hidden: [...document.body.children].filter((e) => e.id !== 'print-area').every((e) => getComputedStyle(e).display === 'none'),
    }));
    const pdf = await page.pdf({ format: 'A4' });
    await page.emulateMedia({ media: 'screen' });
    const flaggedWant = CHECKLISTS.quake.items.filter((x) => x.verify === 'partial').length;
    check('print: a guide prints alone as an A4 list (10 boxes, ⚠️ on the lines under review), the app hidden', pr.printed === 1 && pr.items === 10 && pr.flagged === flaggedWant && pr.area === 'block' && pr.hidden && pdf.length > 10000, `${JSON.stringify(pr)} pdf ${pdf.length} B`);
    await page.click('#cl-back');
    await page.waitForSelector('.guide-grid');
    await page.click('[data-guide="prepare"]');
    await page.waitForSelector('#cl-play');
    await page.click('#cl-play');
    // the first round opens the how-to sheet; later ones go straight to the game
    await page.waitForFunction(() => document.querySelector('#screen-game.active, #howto-go'), null, { timeout: 10000 });
    check('a guide with a game: ▶ starts that game (or its how-to first)', await page.evaluate(() => !!document.querySelector('#screen-game.active, #howto-go')));
    // deep links and a forced alert (the config the server sends is changed for this page only)
    await page.goto(`${BASE}/?open=guide`, { waitUntil: 'networkidle' });
    const picker = !!(await page.$('.guide-grid'));
    await page.goto(`${BASE}/checklist/quake`, { waitUntil: 'networkidle' });
    const quake = (await page.textContent('#sheet-title')).includes(CHECKLISTS.quake.title.th);
    await page.goto(`${BASE}/en/checklist/heat`, { waitUntil: 'networkidle' });
    const heatEn = (await page.textContent('#sheet-title')).includes(CHECKLISTS.heat.title.en);
    check('deep links: /?open=guide opens the picker, /checklist/quake and /en/checklist/heat open those guides', picker && quake && heatEn, `${picker} ${quake} ${heatEn}`);
    await page.route(/\/content\/config\.json/, async (r) => {
      const res = await r.fetch();
      const j = await res.json();
      j.alert = { guide: 'storm', until: '2099-12-31' };
      await r.fulfill({ response: res, json: j });
    });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    // the page before was English, and the language choice is remembered
    const card = await page.textContent('#alert-card');
    const forced = card.includes(STR.th.guideStorm) || card.includes(STR.en.guideStorm);
    await page.click('#alert-open');
    await page.waitForSelector('#cl-back');
    const title = await page.textContent('#sheet-title');
    const opened = [CHECKLISTS.storm.title.th, CHECKLISTS.storm.title.en].some((x) => x && title.includes(x));
    check('an alert set to "storm" shows its card, and the card opens the storm guide', forced && opened, `${forced} ${opened}`);
    await page.unroute(/\/content\/config\.json/);
    await page.goto(`${BASE}/c/p8?h=20261018`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#btn-accept');
    check('a challenge link hides the tools and the alert (the friend\'s challenge is why they came)', (await page.isHidden('#hub')) && (await page.isHidden('#alert-card')));
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.waitForTimeout(400);
    const names = new Set(events.map((e) => e[0]));
    check('guide_open and print are counted (anonymous)', names.has('guide_open') && names.has('print'), [...names].filter((n) => /guide|print|checklist/.test(n)).join(', '));
    check('no page errors (tools first)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();
  }

  // 13. The visitor audit of 19 Oct 2026 (v1.9.1): the phone's back button,
  // sharing without losing the result, Thai words kept whole, one name per tool,
  // the guide's jumps and helplines, a fairer flood, the smoke drawn.
  {
    let { ctx, page } = await newPage({ width: 360, height: 640 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const startUrl = page.url();
    await page.click('[data-open="guide"]');
    await page.waitForSelector('[data-guide]');
    // The sheet's history entry comes a task later (settleHistory in ui.js). A person
    // can't press Back that fast, but a test can: on a busy CI runner Back left the app.
    await page.waitForFunction(() => history.state?.brm === 1);
    await page.goBack();
    await page.waitForTimeout(400);
    check('the phone\'s back button closes a sheet and stays in the app', (await page.isHidden('#sheet')) && page.url() === startUrl, page.url());
    await page.click('[data-open="guide"]');
    await page.waitForSelector('[data-guide="quake"]');
    await page.click('[data-guide="quake"]');
    await page.waitForSelector('#cl-back');
    await page.evaluate(() => { document.querySelector('#sheet').scrollTop = 900; });
    await page.waitForTimeout(200);
    const x = await page.evaluate(() => {
      const r = document.querySelector('#sheet-x').getBoundingClientRect();
      const s = document.querySelector('#sheet').getBoundingClientRect();
      return { top: r.top - s.top, w: r.width, h: r.height };
    });
    await page.click('#sheet-x');
    await page.waitForTimeout(300);
    check('✕ stays at the top of a long sheet (44 px) and closes it', x.top <= 4 && x.w >= 44 && x.h >= 44 && (await page.isHidden('#sheet')), JSON.stringify(x));

    // A guide: jump to "during", call buttons, next steps, no game promised.
    await page.goto(`${BASE}/checklist/quake`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-jump="during"]');
    await page.click('[data-jump="during"]');
    await page.waitForTimeout(800);
    const during = await page.evaluate(() => {
      const h = document.querySelector('#gp-during').getBoundingClientRect();
      const s = document.querySelector('#sheet').getBoundingClientRect();
      return h.top - s.top;
    });
    const tels = await page.$$eval('.tel-chip', (as) => as.map((a) => a.getAttribute('href')));
    const toolBtns = await page.$$eval('[data-tool]', (bs) => bs.map((b) => b.dataset.tool));
    check('a guide: "during" is one tap away, the helplines are buttons, next steps are the hazard\'s tools (an earthquake: the bag, the plan, the emergency card, "I\'m safe")', during >= 0 && during < 120 && tels.length === 3 && tels.every((h) => /^tel:\d+$/.test(h)) && toolBtns.join() === CFG.hazards.quake.tools.join(), `${Math.round(during)} ${tels.join(' ')} ${toolBtns}`);
    await page.evaluate(() => { window.__copied = ''; navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); }; });
    await page.waitForSelector('[data-c="copy"]');
    await page.click('[data-c="copy"]');
    const copied = await page.evaluate(() => window.__copied);
    check('a guide with no game is shared without promising a game', copied.includes('/checklist/quake') && !copied.includes('เกม') && copied.includes(STR.th.shareTextGuide.split('\n')[2].split(' 👉')[0]), copied.replace(/\n/g, ' / '));
    // Sharing to LINE opens one new tab and leaves this one where it is.
    // Like a real browser: with the 'noopener' feature, window.open returns null.
    await page.evaluate(() => { window.__opened = []; window.open = (u, n, f) => { window.__opened.push(u); return /noopener/.test(f || '') ? null : {}; }; });
    const before = page.url();
    await page.click('[data-c="line"]');
    await page.waitForTimeout(300);
    const opened = await page.evaluate(() => window.__opened);
    check('sharing to LINE opens one new tab; this tab stays (the result is not lost)', opened.length === 1 && opened[0].includes('line.me') && page.url() === before, `${opened.length} ${page.url()}`);
    // Thai words in keepTogether sit on one line.
    const split = await page.$$eval('#sheet .nw', (els) => els.filter((e) => e.getClientRects().length > 1).map((e) => e.textContent));
    const kept = await page.$$eval('#sheet .nw', (els) => els.length);
    check('Thai words in keepTogether are never split across lines in a guide', kept > 10 && !split.length, `${kept} kept, split: ${split.join(', ')}`);
    // A kept word must look exactly like the text around it: a rule such as
    // ".quick-btn span:first-child" once caught these spans (22 px, absolute).
    const odd = async () => page.$$eval('.nw', (els) => els.filter((e) => {
      const a = getComputedStyle(e), b = getComputedStyle(e.parentElement);
      return a.fontSize !== b.fontSize || a.position !== 'static' || a.display !== 'inline' || a.padding !== '0px' || a.borderStyle !== 'none';
    }).map((e) => `${e.parentElement.className}: ${e.textContent}`));
    const oddGuide = await odd();
    await page.click('#sheet-x');
    await page.waitForSelector('#sheet', { state: 'hidden' });
    const oddStart = await odd();
    await page.click('#btn-book');
    await page.waitForSelector('#sheet:not([hidden])');
    const oddBook = await odd();
    check('kept Thai words look like the text around them (guide, start screen, safety book)', ![...oddGuide, ...oddStart, ...oddBook].length, [...oddGuide, ...oddStart, ...oddBook].slice(0, 5).join(' | '));
    await ctx.close();

    // One visit to an English page doesn't turn Thai links English.
    ({ ctx, page } = await newPage({ width: 360, height: 640 }));
    await page.goto(`${BASE}/en/`, { waitUntil: 'networkidle' });
    await page.goto(`${BASE}/checklist/quake`, { waitUntil: 'networkidle' });
    const lang = await page.getAttribute('html', 'lang');
    check('opening /en/ once doesn\'t make Thai links open in English', lang === 'th' && !page.url().includes('/en/'), `${lang} ${page.url()}`);
    // The language button is remembered.
    await page.click('#sheet-x');
    await page.waitForSelector('#sheet', { state: 'hidden' });
    await page.click('#btn-lang');
    await page.goto(`${BASE}/checklist/quake`, { waitUntil: 'networkidle' });
    check('the language button is remembered', (await page.getAttribute('html', 'lang')) === 'en');
    await ctx.close();

    // The page as the server sends it: the alert card is already there (no jump), checklist pages point search at their hazard page, a real 404.
    const home = await (await fetch(`${BASE}/`)).text();
    check(`the alert card is in the page before the script runs (the hub doesn't jump)`, ALERT ? home.includes('id="alert-open"') : true, ALERT || 'no alert');
    const cl = await (await fetch(`${BASE}/checklist/quake`)).text();
    const clEn = await (await fetch(`${BASE}/en/checklist/prepare`)).text();
    const site = CFG.siteUrl.replace(/\/$/, '');
    check('checklist pages point search engines at their hazard page', cl.includes(`<link rel="canonical" href="${site}/quake">`) && clEn.includes(`<link rel="canonical" href="${site}/en/flood">`));
    const nf = await fetch(`${BASE}/no-such-page`);
    const nfText = await nf.text();
    check('an unknown address gets the 404 page (noindex), not the start screen', nf.status === 404 && nfText.includes(STR.seo.th.notFoundTitle) && nfText.includes('noindex'), String(nf.status));

    // Offline, the app answers /quake: it opens the quake guide.
    ({ ctx, page } = await newPage({ width: 360, height: 640 }));
    await page.route(/\/quake$/, (route) => route.fulfill({ path: path.join(PUB, 'index.html'), contentType: 'text/html' }));
    await page.goto(`${BASE}/quake`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#sheet-title', { timeout: 5000 }).catch(() => {});
    const t2 = await page.textContent('#sheet-title').catch(() => '');
    check('served the app at /quake (offline), it opens the quake guide', t2.includes(CHECKLISTS.quake.title.th), t2);
    await ctx.close();

    // The game: the smoke is drawn on a 360 x 640 screen; the hint rings only
    // what needs doing; lost things are counted apart; the flood starts later.
    ({ ctx, page } = await newPage({ width: 360, height: 640 }));
    await page.addInitScript(() => { for (const m of ['prepare', 'return', 'dust', 'fire', 'stock']) localStorage.setItem(`brm:howto-${m}`, 'true'); });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.__brm.startFlow('fire'));
    await page.waitForFunction(() => window.__brm.state.round?.running);
    await page.evaluate(() => window.__brm.state.round.addTime(40000));
    await page.waitForTimeout(500);
    const smokeH = await page.evaluate(() => Number(document.querySelector('.smoke-body')?.getAttribute('height')));
    check('fire: the smoke is drawn on a 360x640 screen (it was not before v1.9.1)', smokeH > 200, String(smokeH));
    await page.evaluate(() => document.querySelector('#stage').classList.add('show-hints'));
    const rings = await page.evaluate(() => ({
      target: [...document.querySelectorAll('.item-target:not(.is-resolved) .ring')].filter((r) => getComputedStyle(r).display !== 'none').length,
      decoy: [...document.querySelectorAll('.item-decoy .ring')].filter((r) => getComputedStyle(r).display !== 'none').length,
    }));
    check('the idle hint rings things to do, never the decoys', rings.target > 0 && rings.decoy === 0, JSON.stringify(rings));
    await page.evaluate(() => window.__brm.startFlow('prepare'));
    await page.waitForFunction(() => window.__brm.state.round?.running && window.__brm.state.round.mode === 'prepare');
    await page.evaluate(() => window.__brm.state.round.addTime(19000));
    await page.waitForTimeout(400);
    const early = await page.evaluate(() => [...window.__brm.state.round.records.values()].filter((r) => r.status === 'flooded').length);
    await page.evaluate(() => window.__brm.state.round.addTime(25000));
    await page.waitForTimeout(400);
    const hud = await page.evaluate(() => ({ text: document.querySelector('#hud-score').textContent, lost: [...window.__brm.state.round.records.values()].filter((r) => r.status === 'flooded').length }));
    check('flood: nothing goes under in the first 19 s; what the water took is shown apart (💧), not counted as done', early === 0 && hud.lost > 0 && hud.text.startsWith('0/') && hud.text.includes(`💧${hud.lost}`), `early ${early}, ${hud.text}`);
    check('no page errors (v1.9.1 checks)', !page.errors.length, page.errors.join(' | '));
    await ctx.close();

    // v1.9.2: the phone's back button inside a round pauses it, and on the
    // result goes back to the start screen; neither leaves the site.
    ({ ctx, page } = await newPage({ width: 360, height: 640 }));
    await page.addInitScript(() => { for (const m of ['prepare', 'return', 'dust', 'fire', 'stock']) localStorage.setItem(`brm:howto-${m}`, 'true'); });
    await page.goto(`${BASE}/learn`, { waitUntil: 'domcontentloaded' }); // a page before, like a chat
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.__brm.startFlow('prepare'));
    await page.waitForFunction(() => window.__brm.state.round?.running);
    const where = () => page.evaluate(() => ({ path: location.pathname, screen: document.querySelector('.screen.active')?.id, sheet: !document.querySelector('#sheet')?.hidden, running: !!window.__brm.state.round?.running }));
    // The answers carry ก ข ค, not an icon per kind of action (the right one was the odd icon out, KNOWN_ISSUES #66).
    await page.evaluate(() => [...document.querySelectorAll('.item-target .hit')].find((h) => { const r = h.getBoundingClientRect(); return r.width && r.left >= 0 && r.right <= innerWidth; }).dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await page.waitForSelector('#sheet:not([hidden]) .choice');
    const badges = await page.$$eval('#sheet .choice .ico', (els) => els.map((e) => e.textContent.trim() + (e.querySelector('svg') ? 'svg' : '')));
    check('the answers are lettered ก ข ค, with no icon that tells them apart', badges.join('') === 'กขค'.slice(0, badges.length) && badges.length >= 2, badges.join(' '));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await page.goBack(); await page.waitForTimeout(500);
    const paused = await where();
    await page.goBack(); await page.waitForTimeout(500);
    const resumed = await where();
    check('back inside a round pauses it (the pause sheet), back again resumes; still on the site', paused.path === '/' && paused.screen === 'screen-game' && paused.sheet && !paused.running && resumed.screen === 'screen-game' && !resumed.sheet && resumed.running, `${JSON.stringify(paused)} ${JSON.stringify(resumed)}`);
    await page.evaluate(() => window.__brm.state.round.addTime(60000));
    await page.waitForSelector('#screen-result.active', { timeout: 15000 });
    await page.goBack(); await page.waitForTimeout(500);
    const after = await where();
    check('back on the result goes to the start screen, still on the site', after.path === '/' && after.screen === 'screen-start' && !after.sheet, JSON.stringify(after));
    check('no page errors (back in the game)', !page.errors.length, page.errors.join(' | '));
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

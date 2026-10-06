// Browser smoke test in headless Chromium, mimicking Cloudflare Pages routing.
//   node tests/smoke.mjs                 run checks
//   node tests/smoke.mjs --screens DIR   also save screenshots for the docs
// Needs playwright-core and a Chromium (set CHROME_PATH if needed).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const screensArg = process.argv.indexOf('--screens');
const SCREENS = screensArg > 0 ? path.resolve(process.argv[screensArg + 1]) : null;
if (SCREENS) fs.mkdirSync(SCREENS, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
let beacons = 0;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/e') {
    beacons++;
    req.resume();
    res.writeHead(204);
    res.end();
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
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

async function newPage({ width = 390, height = 760, ua = UA.android, reducedMotion = 'no-preference' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: ua, reducedMotion, serviceWorkers: 'block' });
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
async function smallControls(page) {
  return page.$$eval('button, a[href], summary, [role="button"]:not(.item)', (els) => els
    .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden')
    .map((e) => {
      const r = e.getBoundingClientRect();
      const size = e.closest('.src') ? r.height : Math.min(r.width, r.height);
      return { size, name: (e.id || e.textContent.trim()).slice(0, 16) };
    })
    .filter((c) => c.size < 44)
    .map((c) => `${c.name}: ${c.size.toFixed(0)} px`));
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
    page.on('response', async (r) => {
      const len = Number(r.headers()['content-length'] || 0) || (await r.body().catch(() => Buffer.alloc(0))).length;
      resp.push({ url: r.url(), len });
    });
    await page.goto(`${BASE}/?debug=1`, { waitUntil: 'networkidle' });
    const bytes = resp.reduce((a, r) => a + r.len, 0);
    check('start screen transfer < 500 KB (uncompressed)', bytes < 500 * 1024, `${(bytes / 1024).toFixed(0)} KB`);
    await shot(page, '01-start');
    check('default mode badge shown', await page.isVisible('.mode-btn.is-default .mode-badge'));
    await playRound(page, 'prepare', {
      wrongAt: 1,
      screens: { howto: '02-howto', room: '03-room', choice: '04a-choice', tip: '04b-tip-correct', learn: '04c-tip-learned' },
    });
    await shot(page, '05-result');
    const card = await page.evaluate(() => document.querySelector('#card-img').naturalWidth);
    check('result card is 1080 px wide', card === 1080, String(card));
    check('lessons list has every target', (await page.$$('.lesson')).length >= 5);
    check('help numbers listed', (await page.$$eval('.help-list .num', (n) => n.map((x) => x.textContent))).join() .includes('1784'));
    await page.click('#btn-share');
    await page.waitForSelector('.share-grid');
    await shot(page, '06-share');
    const channels = await page.$$eval('[data-ch]', (b) => b.map((x) => x.dataset.ch));
    check('share fallbacks: LINE, Facebook, X, copy', ['line', 'facebook', 'x', 'copy'].every((c) => channels.includes(c)), channels.join());
    check('no page errors (Android, prepare)', !page.errors.length, page.errors.join(' | '));
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
    const og = await (await fetch(`${BASE}/c/r9`)).text();
    check('challenge page has its own OG image', og.includes('/og/r9.png') && !og.includes('og:url'));
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
    await ctx.close();
  }

  // 6. Offline after first visit (service worker)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true });
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

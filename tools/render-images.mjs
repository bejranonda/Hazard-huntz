#!/usr/bin/env node
// Renders every shareable image with the game's own canvas code, in headless
// Chromium: link previews (og/), family-group checklists (share/) and app
// icons (icons/). Run after changing copy, ranks or the domain:
//   SITE_URL=https://your.domain npm run images
// Needs: npm install (playwright-core) and a Chromium. Set CHROME_PATH to
// use a specific browser binary.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { geckoSVG } from '../public/js/mascot.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const config = JSON.parse(fs.readFileSync(path.join(PUB, 'content/config.json'), 'utf8'));
const placeholder = (u) => !u || /\[[A-Z_]+\]/.test(u);
const site = (process.env.SITE_URL || (!placeholder(config.siteUrl) ? config.siteUrl : '')).replace(/\/$/, '');
if (!site) console.warn('warning: SITE_URL not set — images will show #บ้านรอดไหม instead of your web address');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = p === '/__render.html' ? path.join(ROOT, 'tools/render.html') : path.join(PUB, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

// Static app icon (SVG) straight from the mascot code.
const gecko = geckoSVG({ face: 'happy' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
fs.mkdirSync(path.join(PUB, 'icons'), { recursive: true });
fs.writeFileSync(path.join(PUB, 'icons/icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140"><rect width="140" height="140" rx="30" fill="#FFE6B0"/><circle cx="70" cy="150" r="88" fill="#CFEAFB"/><g transform="translate(10 4)">${gecko}</g></svg>\n`);

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(`http://localhost:${port}/__render.html`);
  await page.waitForFunction(() => window.ready === true);
  await page.evaluate(() => document.fonts.ready);
  const images = await page.evaluate((s) => window.renderAll(s), site);
  let total = 0;
  for (const [rel, dataUrl] of Object.entries(images)) {
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    const file = path.join(PUB, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
    total += buf.length;
  }
  console.log(`wrote ${Object.keys(images).length} images (${(total / 1024).toFixed(0)} KB) + icons/icon.svg`);
} finally {
  await browser.close();
  server.close();
}

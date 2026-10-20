#!/usr/bin/env node
// npm run links: opens every agency link the app shows (content/kit.json → links)
// and prints what each answered, so a moved or dead page is found before a
// visitor finds it. Run it monthly, then update each link's `checked` date
// (the build warns once a date is 120 days old). Thai agency sites often refuse
// automated readers or foreign addresses: a refusal here is not proof that the
// page is gone; open it on a phone before changing anything.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const kit = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/content/kit.json'), 'utf8'));
const list = kit.links?.list || [];

async function probe(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' } });
    const body = await res.text();
    const title = (/<title[^>]*>([^<]*)/i.exec(body)?.[1] || '').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d))).trim().slice(0, 70);
    // A firewall or bot check answers 200 with its own page: count it as blocked, not as the page.
    const blocked = /blocked|denied|captcha|just a moment|attention required/i.test(title);
    return { status: res.status, final: res.url, title, blocked };
  } catch (e) {
    return { status: 0, final: '', title: String(e.cause?.code || e.name || e).slice(0, 70) };
  } finally {
    clearTimeout(timer);
  }
}

let bad = 0;
for (const x of list) {
  const r = await probe(x.url);
  const ok = r.status >= 200 && r.status < 400 && !r.blocked;
  if (!ok) bad += 1;
  const moved = r.final && r.final.replace(/\/$/, '') !== x.url.replace(/\/$/, '') ? ` → ${r.final}` : '';
  console.log(`${ok ? 'ok ' : r.blocked ? 'BLK' : 'ERR'} ${String(r.status).padEnd(3)} ${x.id.padEnd(12)} ${x.url}${moved}${r.title ? `  "${r.title}"` : ''}  (checked ${x.checked})`);
}
console.log(`\n${list.length - bad} of ${list.length} answered. Open any ERR or BLK (a bot check) on a phone before changing it; then update "checked" in kit.json → links.`);

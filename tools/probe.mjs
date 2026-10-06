#!/usr/bin/env node
// Measurements behind docs/KNOWN_ISSUES.md and docs/KNOWLEDGE.md (Node only,
// no browser). Run after changing rooms.json slots, item sizes or the water
// curve:  npm run probe
//   1. how often neighbouring tap areas overlap, over two years of daily houses
//   2. when each Prepare item floods during a round with no penalties

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHouse } from '../public/js/house.js';
import { waterY } from '../public/js/round.js';

const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const read = (f) => JSON.parse(fs.readFileSync(path.join(PUB, 'content', `${f}.json`), 'utf8'));
const items = read('items');
const content = { config: read('config'), rooms: read('rooms').rooms, items: items.items, decoys: items.decoys };

// ---------------------------------------------------------------- 1. overlaps
const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
  * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const pairs = new Map();
let houses = 0, affected = 0, worst = 0;
const start = Date.UTC(2026, 9, 1);
for (let d = 0; d < 730; d++) {
  const key = new Date(start + d * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
  for (const mode of ['prepare', 'return']) {
    const house = generateHouse(content, mode, key);
    houses++;
    let any = false;
    for (const room of house.rooms) {
      const ps = room.placements;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const area = overlap(ps[i].hit, ps[j].hit);
          if (!area) continue;
          any = true;
          const share = area / Math.min(ps[i].hit.w * ps[i].hit.h, ps[j].hit.w * ps[j].hit.h);
          worst = Math.max(worst, share);
          const k = `${room.id}: ${ps[i].slot} + ${ps[j].slot}`;
          const p = pairs.get(k) || { n: 0, max: 0 };
          p.n++;
          p.max = Math.max(p.max, share);
          pairs.set(k, p);
        }
      }
    }
    if (any) affected++;
  }
}
const pct = (x) => `${Math.round(100 * x)}%`;
console.log(`Tap-area overlaps over ${houses} houses (daily keys from 2026-10-01, both modes)`);
console.log(`  houses with an overlap: ${affected} (${pct(affected / houses)}), worst: ${pct(worst)} of the smaller area`);
for (const [k, p] of [...pairs].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`  ${k.padEnd(34)} ${String(p.n).padStart(4)} houses, worst ${pct(p.max)}`);
}

// ---------------------------------------------------------------- 2. flood timings
const cfg = content.config.round;
const T = cfg.prepare.seconds;
const floodAt = (y) => {
  for (let t = 0; t <= T * 10; t++) if (waterY(t / (T * 10), cfg.prepare.water) <= y) return t / 10;
  return null;
};
const fmt = (t) => (t == null ? 'never' : `${t} s`);
console.log(`\nPrepare flood timings (no penalties; floor wet at ${fmt(floodAt(cfg.prepare.floorWetY))})`);
for (const it of content.items.filter((i) => i.mode === 'prepare')) {
  const room = content.rooms.find((r) => r.id === it.room && r.enabled);
  if (!room) {
    console.log(`  ${it.id.padEnd(12)} room "${it.room}" not playable yet`);
    continue;
  }
  const times = room.slots.filter((s) => s.tags.some((t) => it.slots.includes(t))).map((s) => floodAt(s.y - it.size[1] / 2));
  const sorted = times.map((t) => (t == null ? Infinity : t)).sort((a, b) => a - b);
  const lo = sorted[0], hi = sorted[sorted.length - 1];
  const range = lo === hi ? fmt(lo === Infinity ? null : lo) : `${fmt(lo === Infinity ? null : lo)} – ${fmt(hi === Infinity ? null : hi)}`;
  console.log(`  ${it.id.padEnd(12)} ${it.critical ? '★' : ' '} ${range}`);
}

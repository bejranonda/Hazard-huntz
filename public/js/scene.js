// Draws the house: one inline SVG per room inside a swipeable strip, with
// sprites, tap targets, status badges and (before the flood) rising water.

import { svgEl, $, $$, prefersReducedMotion } from './util.js';
import { L } from './content.js';

const svgCache = new Map();
let spritesLoaded = null;

export function loadSprites() {
  if (!spritesLoaded) {
    spritesLoaded = fetch('/art/sprites.svg')
      .then((r) => r.text())
      .then((txt) => {
        const holder = document.createElement('div');
        holder.setAttribute('aria-hidden', 'true');
        holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
        holder.innerHTML = txt;
        document.body.appendChild(holder);
      });
  }
  return spritesLoaded;
}

export function loadRoomArt(url) {
  if (!svgCache.has(url)) {
    svgCache.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.text();
    }));
  }
  return svgCache.get(url);
}

// Warm the cache while the player is still on the start screen.
export function prefetchHouse(rooms) {
  loadSprites();
  for (const r of rooms) if (r.art) loadRoomArt(r.art).catch(() => {});
}

const BADGE = {
  correct: { fill: '#1F6FEB', glyph: 'M-5 0 L-1.5 4 L5.5 -4' },
  learned: { fill: '#C4610A', glyph: 'M0 -5 V1.5 M0 5 V5.2' },
  flooded: { fill: '#6F6A66', glyph: 'M0 -5 Q4 0 4 2.5 A4 4 0 0 1 -4 2.5 Q-4 0 0 -5 Z' },
  missed: { fill: '#6F6A66', glyph: 'M-3.5 -2.5 Q-3.5 -6 0 -6 Q3.5 -6 3.5 -3 Q3.5 -0.5 0 0.5 V2 M0 5 V5.2' },
  decoy: { fill: '#8A847F', glyph: 'M-5 0 L-1.5 4 L5.5 -4' },
};

export class Scene {
  constructor({ roomsEl, tabsEl, prevBtn, nextBtn, onTap, onRoomChange }) {
    this.roomsEl = roomsEl;
    this.tabsEl = tabsEl;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.onTap = onTap;
    this.onRoomChange = onRoomChange;
    this.nodes = new Map(); // pid -> <g>
    this.waterGroups = [];
    this.current = 0;
    this.rooms = [];
    this._onScroll = this._onScroll.bind(this);
  }

  async mount(house) {
    this.house = house;
    this.rooms = house.rooms;
    this.roomsEl.innerHTML = '';
    this.tabsEl.innerHTML = '';
    this.nodes.clear();
    this.waterGroups = [];
    await loadSprites();
    const arts = await Promise.all(this.rooms.map((r) => loadRoomArt(r.art)));

    this.rooms.forEach((room, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'room';
      wrap.dataset.room = room.id;
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', L(room.name));
      wrap.innerHTML = arts[i];
      const svg = wrap.querySelector('svg');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('aria-hidden', 'false');
      const itemsG = svg.querySelector('.items');
      for (const p of room.placements) itemsG.appendChild(this._itemNode(p));
      if (house.mode === 'prepare') this.waterGroups.push(this._water(svg.querySelector('.water')));
      this.roomsEl.appendChild(wrap);

      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.setAttribute('role', 'tab');
      tab.dataset.index = i;
      tab.innerHTML = `${L(room.name)}<span class="count"></span>`;
      tab.addEventListener('click', () => this.goTo(i));
      this.tabsEl.appendChild(tab);
    });

    this.roomsEl.scrollLeft = 0;
    this.roomsEl.addEventListener('scroll', this._onScroll, { passive: true });
    this.prevBtn.onclick = () => this.goTo(this.current - 1);
    this.nextBtn.onclick = () => this.goTo(this.current + 1);
    this._setCurrent(0);
  }

  destroy() {
    this.roomsEl.removeEventListener('scroll', this._onScroll);
    this.roomsEl.innerHTML = '';
    this.tabsEl.innerHTML = '';
  }

  _itemNode(p) {
    const g = svgEl('g', {
      class: `item item-${p.kind}`,
      'data-pid': p.pid,
      tabindex: '0',
      role: 'button',
      'aria-label': L(p.ref.name),
    });
    const sprite = svgEl('g', { class: 'sprite' });
    const use = svgEl('use', { href: `#s-${p.ref.sprite}`, x: p.x, y: p.y, width: p.w, height: p.h });
    sprite.appendChild(use);
    g.appendChild(sprite);
    const pad = 4;
    g.appendChild(svgEl('rect', {
      class: 'ring', x: p.hit.x - pad, y: p.hit.y - pad, width: p.hit.w + pad * 2, height: p.hit.h + pad * 2, rx: 14,
    }));
    g.appendChild(svgEl('rect', { class: 'hit', x: p.hit.x, y: p.hit.y, width: p.hit.w, height: p.hit.h, rx: 12 }));
    const activate = (e) => {
      e.preventDefault();
      this.onTap(p, g);
    };
    g.addEventListener('click', activate);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') activate(e);
    });
    this.nodes.set(p.pid, g);
    return g;
  }

  _water(group) {
    group.innerHTML = '';
    const body = svgEl('g', { class: 'water-g' });
    const rect = svgEl('rect', { class: 'water-body', x: -20, y: 0, width: 400, height: 700 });
    const wave = svgEl('path', {
      class: 'water-top',
      d: 'M-40 0 q15 -7 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V10 H-40 Z',
    });
    body.appendChild(rect);
    body.appendChild(wave);
    group.appendChild(body);
    group.style.pointerEvents = 'none';
    return { body, wave, phase: 0 };
  }

  setWater(y) {
    const animate = !prefersReducedMotion();
    for (const w of this.waterGroups) {
      w.phase = animate ? (w.phase + 0.6) % 30 : 0;
      w.body.setAttribute('transform', `translate(0 ${y.toFixed(1)})`);
      w.wave.setAttribute('transform', `translate(${(-w.phase).toFixed(1)} 0)`);
    }
  }

  node(pid) { return this.nodes.get(pid); }

  select(pid, on = true) {
    const g = this.nodes.get(pid);
    if (g) g.classList.toggle('selected', on);
  }

  // Visual outcome on an item: badge + optional sprite swap / animation.
  mark(p, status, { swap, anim } = {}) {
    const g = this.nodes.get(p.pid);
    if (!g) return;
    g.classList.add('is-resolved');
    g.classList.remove('selected');
    g.setAttribute('aria-label', `${L(p.ref.name)} (${status})`);
    if (swap) g.querySelector('use').setAttribute('href', `#s-${swap}`);
    if (anim === 'lift') g.classList.add('lift');
    if (anim === 'away') g.classList.add('away');
    if (status === 'flooded') g.classList.add('wet');
    this._badge(g, p, status);
  }

  // A decoy that was tapped: grey tick so nobody taps it twice.
  markDecoy(p) {
    const g = this.nodes.get(p.pid);
    if (!g) return;
    g.classList.add('is-resolved');
    this._badge(g, p, 'decoy');
  }

  _badge(g, p, status) {
    g.querySelector('.badge')?.remove();
    const b = BADGE[status];
    if (!b) return;
    const cx = Math.min(346, p.x + p.w - 4);
    const cy = Math.max(14, p.y + 4);
    const badge = svgEl('g', { class: `badge badge-${status}`, transform: `translate(${cx} ${cy})` });
    badge.appendChild(svgEl('circle', { r: 11, fill: b.fill }));
    const filled = status === 'flooded';
    badge.appendChild(svgEl('path', {
      d: b.glyph,
      fill: filled ? '#fff' : 'none',
      stroke: '#fff',
      'stroke-width': filled ? 1 : 2.8,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }));
    g.appendChild(badge);
  }

  // End of round: outline every target the player never got to.
  revealMissed(targets, records) {
    for (const p of targets) {
      const rec = records.get(p.pid);
      if (rec.status === 'missed') {
        const g = this.nodes.get(p.pid);
        if (!g) continue;
        g.appendChild(svgEl('rect', {
          class: 'miss-ring', x: p.hit.x - 3, y: p.hit.y - 3, width: p.hit.w + 6, height: p.hit.h + 6, rx: 14,
        }));
        this._badge(g, p, 'missed');
      }
    }
  }

  // Remaining targets per room on the tabs.
  updateCounts(records) {
    this.rooms.forEach((room, i) => {
      const left = room.placements.filter((p) => p.kind === 'target' && records.get(p.pid)?.status === 'pending').length;
      const tab = this.tabsEl.children[i];
      if (!tab) return;
      const c = tab.querySelector('.count');
      c.textContent = left ? String(left) : '✓';
      c.classList.toggle('zero', !left);
    });
  }

  roomOf(p) { return this.rooms.findIndex((r) => r.id === p.room); }

  goTo(i) {
    const n = this.rooms.length;
    const idx = Math.max(0, Math.min(n - 1, i));
    const w = this.roomsEl.clientWidth;
    this.roomsEl.scrollTo({ left: idx * w, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    this._setCurrent(idx);
  }

  _onScroll() {
    const w = this.roomsEl.clientWidth || 1;
    const idx = Math.round(this.roomsEl.scrollLeft / w);
    if (idx !== this.current) this._setCurrent(idx);
  }

  _setCurrent(idx) {
    this.current = idx;
    $$('.tab', this.tabsEl).forEach((t, i) => t.setAttribute('aria-selected', String(i === idx)));
    this.prevBtn.disabled = idx <= 0;
    this.nextBtn.disabled = idx >= this.rooms.length - 1;
    this.onRoomChange?.(idx);
  }

  // Screen position (CSS px, relative to the stage) of a scene point, for
  // floating text and sparkles drawn in HTML.
  toStage(roomIndex, x, y) {
    const wrap = this.roomsEl.children[roomIndex];
    const svg = wrap && $('svg', wrap);
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const m = svg.getScreenCTM();
    const s = pt.matrixTransform(m);
    const stage = this.roomsEl.parentElement.getBoundingClientRect();
    return { x: s.x - stage.left, y: s.y - stage.top };
  }
}

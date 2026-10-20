// Canvas renderers for everything people share: result cards (1080x1350),
// family-group checklists (1080x1920) and link-preview images (1200x630).
// Used live in the game and by tools/render-images.mjs at build time, so a
// preview in LINE looks exactly like the card in the game.

import { geckoSVG } from './mascot.js';
import { parseSvg, drawSvgInto } from './svgdraw.js';
import { modeOf, propFor } from './modes.js';
import { keptSpans } from './util.js';

const INK = '#3E2A1E';
const INK2 = '#6B4A35';
const CREAM = '#FFF4E3';
const TEAL = '#2F8F8A';
const CORAL = '#FF7A59';
const SUN = '#FFC83D';
const SKY = '#2E9BDB';
const OK = '#1F6FEB';
const WARN = '#C4610A';
const MISS = '#8A847F';
const FONT = 'Kanit, "Noto Sans Thai", Tahoma, sans-serif';

// Colours per mode for cards, checklists and link previews. A new mode adds
// one row here; anything missing falls back to the after-the-flood look.
const THEMES = {
  prepare: { sun: null, waves: ['#9FD3F0', '#63B8EA'], chip: '#CFEAFB', accentDark: SKY, og: '#DDF0FB' },
  return: { sun: SUN, waves: ['#D9C08E', '#B08B62'], chip: '#FFE6B0', accentDark: '#C98A0C', og: '#FFF0CC' },
  dust: { sun: 'rgba(240,150,80,.55)', waves: ['#D8CEC1', '#B0A292'], chip: '#E9E2D8', accentDark: '#8A7E70', og: '#EFE8DF' },
  fire: { sun: null, waves: ['#FFCDB0', '#FF9466'], chip: '#FFDCCB', accentDark: '#D9572B', og: '#FFEFE6' },
  stock: { sun: 'rgba(120,135,200,.45)', waves: ['#B9C3EA', '#8C9BD6'], chip: '#DCE1F5', accentDark: '#4B5BA6', og: '#E8ECFA' },
  // guides with no game yet (v1.9.0): their checklist pictures and link previews
  landslide: { sun: null, waves: ['#D9C9A8', '#B39B6E'], chip: '#EDE3CF', accentDark: '#7D6237', og: '#F3ECDD' },
  storm: { sun: null, waves: ['#B7CBE0', '#7F9FC2'], chip: '#DCE7F2', accentDark: '#3D6290', og: '#E9F0F7' },
  quake: { sun: null, waves: ['#D5C7BB', '#AC9585'], chip: '#ECE3DB', accentDark: '#73574A', og: '#F4EEE9' },
  heat: { sun: SUN, waves: ['#FFD3A3', '#FFAE5E'], chip: '#FFE7CC', accentDark: '#C4610A', og: '#FFF1E0' },
};
const theme = (mode) => THEMES[mode] || THEMES.return;
const propOf = (id) => propFor(id);

export async function loadCardAssets() {
  if (document.fonts?.load) {
    await Promise.all([
      document.fonts.load(`600 64px Kanit`, 'บ้านรอดไหม? Baan Rod Mai? 0123456789/'),
      document.fonts.load(`400 40px Kanit`, 'เตรียมบ้าน abc'),
    ]).catch(() => {});
  }
  const spritesText = await fetch('/art/sprites.svg').then((r) => r.text());
  return { sprites: parseSvg(spritesText), geckos: new Map() };
}

function gecko(assets, face, prop) {
  const key = `${face}|${prop}`;
  if (!assets.geckos.has(key)) assets.geckos.set(key, parseSvg(geckoSVG({ face, prop })).documentElement);
  return assets.geckos.get(key);
}

function drawGecko(ctx, assets, x, y, w, h, face = 'happy', prop = 'none') {
  const el = gecko(assets, face, prop);
  drawSvgInto(ctx, el, x, y, w, h, el.ownerDocument);
}

function drawSprite(ctx, assets, id, x, y, w, h) {
  const sym = assets.sprites.getElementById(`s-${id}`);
  if (sym) drawSvgInto(ctx, sym, x, y, w, h, assets.sprites);
}

// ---- text helpers (Thai has no spaces, so break on word segments) ----

const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;

function tokens(text) {
  if (segmenter) {
    // Keep closing punctuation (and Thai ๆ) on the word before it, so a line
    // never starts with "!", "?", "," or ")". Words in config.json →
    // keepTogether stay whole ("กระจก", not "กระ|จก"), as on the page.
    const out = [];
    const kept = keptSpans(text);
    const inKept = (i) => kept.some(([a, b]) => i > a && i < b);
    for (const { segment, index } of segmenter.segment(text)) {
      const glue = (/^[!?,.:;)\]}%…”’ๆฯ]+$/.test(segment) && /\S$/.test(out[out.length - 1])) || inKept(index);
      if (out.length && glue) out[out.length - 1] += segment;
      else out.push(segment);
    }
    return out;
  }
  // Fallback: split on spaces, keep Thai combining marks with their base.
  return text.split(/(\s+)/);
}

export function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const tok of tokens(para)) {
      const test = line + tok;
      if (ctx.measureText(test).width > maxWidth && line.trim()) {
        lines.push(line.trimEnd());
        line = tok.trimStart();
      } else line = test;
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

function font(ctx, size, weight = 600) {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

// Fit text on one line by shrinking from `size` down to `min`.
function fitText(ctx, text, maxWidth, size, min, weight = 600) {
  let s = size;
  font(ctx, s, weight);
  while (s > min && ctx.measureText(text).width > maxWidth) {
    s -= 2;
    font(ctx, s, weight);
  }
  return s;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function pill(ctx, cx, y, text, { size = 44, fill = SUN, color = INK, padX = 34, h = size * 1.6, stroke = INK, lw = 5 } = {}) {
  font(ctx, size);
  const w = ctx.measureText(text).width + padX * 2;
  roundRect(ctx, cx - w / 2, y, w, h, h / 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, y + h / 2 + size * 0.06);
  return w;
}

// The wordmark: Thai "บ้าน|รอดไหม?" or English "Baan |Rod Mai?" (d.logo). When the
// English words are wider than maxW, the type shrinks to fit.
function logo(ctx, cx, y, size, parts, maxW = 640) {
  const [a, b] = parts || ['บ้าน', 'รอดไหม?'];
  font(ctx, size);
  const natural = ctx.measureText(a).width + ctx.measureText(b).width;
  if (natural > maxW) {
    size = Math.floor(size * maxW / natural);
    font(ctx, size);
  }
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const wa = ctx.measureText(a).width, wb = ctx.measureText(b).width;
  const x0 = cx - (wa + wb) / 2;
  ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.16;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText(a, x0, y);
  ctx.strokeText(b, x0 + wa, y);
  ctx.fillStyle = TEAL;
  ctx.fillText(a, x0, y);
  ctx.fillStyle = CORAL;
  ctx.fillText(b, x0 + wa, y);
}

function waves(ctx, W, top, colorA, colorB) {
  ctx.fillStyle = colorA;
  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let x = 0; x <= W; x += 60) ctx.quadraticCurveTo(x + 30, top - 18, x + 60, top);
  ctx.lineTo(W, 99999);
  ctx.lineTo(0, 99999);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = colorB;
  ctx.beginPath();
  ctx.moveTo(0, top + 40);
  for (let x = -30; x <= W; x += 60) ctx.quadraticCurveTo(x + 30, top + 22, x + 60, top + 40);
  ctx.lineTo(W, 99999);
  ctx.lineTo(0, 99999);
  ctx.closePath();
  ctx.fill();
}

function background(ctx, W, H, mode) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  // soft dots
  ctx.fillStyle = 'rgba(233, 214, 189, .55)';
  for (let y = 30; y < H; y += 60) for (let x = (y / 60) % 2 ? 30 : 0; x < W; x += 60) {
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  if (theme(mode).sun) {
    ctx.fillStyle = theme(mode).sun;
    ctx.beginPath();
    ctx.arc(W - 120, 120, 70, 0, Math.PI * 2);
    ctx.fill();
  }
}

const STATUS_COLORS = { correct: OK, learned: WARN, flooded: MISS, missed: MISS };

function statusDot(ctx, cx, cy, r, status) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = STATUS_COLORS[status] || MISS;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  if (status === 'correct') {
    ctx.moveTo(cx - r * 0.42, cy + r * 0.02);
    ctx.lineTo(cx - r * 0.1, cy + r * 0.34);
    ctx.lineTo(cx + r * 0.46, cy - r * 0.3);
    ctx.stroke();
  } else if (status === 'learned') {
    ctx.moveTo(cx, cy - r * 0.45);
    ctx.lineTo(cx, cy + r * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.42, r * 0.11, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------------- result card 1080x1350 ----------------

export function drawResultCard(canvas, d, assets) {
  const W = 1080, H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  background(ctx, W, H, d.mode);
  waves(ctx, W, 1110, ...theme(d.mode).waves);

  // Themes with a sun or moon (top right, x 890–1030) keep the wordmark clear of it.
  logo(ctx, W / 2, 150, 104, d.logo, theme(d.mode).sun ? W - 440 : W - 160);
  const chipFill = theme(d.mode).chip;
  pill(ctx, W / 2, 192, d.modeLabel, { size: 40, fill: chipFill, lw: 4 });

  const face = d.tier >= 2 ? 'cheer' : d.tier === 1 ? 'happy' : 'think';
  // v1.9.2: the gecko a little smaller, its line in a wide bubble under it, no
  // separate headline (the rank and the mode chip say it), a bigger score and
  // link, so the card reads at the size a chat shows it (about 270 px wide).
  drawGecko(ctx, assets, W / 2 - 150, 318, 300, 316, face, propOf(d.mode));
  const bubbleH = d.ending ? endingBubble(ctx, d.ending, 60, 672, W - 120, W / 2) : 0;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const scoreY = Math.max(980, 672 + bubbleH + 178);
  font(ctx, 200);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 16;
  ctx.strokeStyle = INK;
  ctx.strokeText(d.scoreText, W / 2, scoreY);
  ctx.fillStyle = CORAL;
  ctx.fillText(d.scoreText, W / 2, scoreY);

  pill(ctx, W / 2, scoreY + 34, d.rankTitle, { size: 50, fill: SUN });

  // result dots, Wordle-style, with shapes as well as colours
  const n = d.grid.length;
  const r = 30, gap = 22;
  const total = n * (r * 2) + (n - 1) * gap;
  let x = W / 2 - total / 2 + r;
  for (const st of d.grid) {
    statusDot(ctx, x, 1158, r, st);
    x += r * 2 + gap;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, d.cta, W - 100, 50, 34);
  ctx.fillText(d.cta, W / 2, 1244);
  // The challenge link itself, so a forwarded picture leads to this house.
  const shown = d.url.replace(/^https?:\/\//, '');
  fitText(ctx, shown, W - 80, 46, 30, 600);
  ctx.fillText(shown, W / 2, 1294);
  font(ctx, 24, 400);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.fillText(d.footer, W / 2, 1334);
  font(ctx, 30, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.houseLabel, W / 2, 300);

  if (d.perfect) stamp(ctx, W - 190, 470, d.perfect);
}

// Canvas fonts may draw emoji as empty boxes, so the card leaves them out.
export const plainText = (text) => String(text ?? '')
  .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
  .replace(/\s+/g, ' ').trim();

// The ending ("บ้านรอด! …"), so a forwarded card answers "บ้านรอดไหม?" too: a
// wide bubble under the gecko, tail pointing up. Wide and large so it can still
// be read when a chat shows the card at a quarter of its size (v1.9.2: it was
// 38 px in a 330 px box beside the gecko, about 9 px in a chat). Centred lines;
// the largest size from 52 px that fits two lines, else three at 38 px.
// Returns the bubble's height.
function endingBubble(ctx, text, x, top, w, tailX) {
  const clean = plainText(text);
  if (!clean) return 0;
  const pad = 26;
  let fit = null;
  for (let s = 52; s >= 38; s -= 2) {
    font(ctx, s, 400);
    const ls = wrapText(ctx, clean, w - pad * 2);
    if (ls.length > 2) continue;
    // No lone short word on the last line (Thai breaks between words, e.g. "เต็ม|สิบ").
    const widow = ls.length > 1 && ctx.measureText(ls[ls.length - 1]).width < (w - pad * 2) * 0.3;
    fit = fit || { s, ls };
    if (!widow) { fit = { s, ls }; break; }
  }
  if (!fit) {
    font(ctx, 38, 400);
    fit = { s: 38, ls: wrapText(ctx, clean, w - pad * 2).slice(0, 3) };
  }
  const size = fit.s;
  const lines = fit.ls;
  font(ctx, size, 400);
  const lh = size * 1.3;
  const h = lines.length * lh + pad * 2;
  const r = 26;
  // One path for the box and its tail, which points up at the gecko.
  ctx.beginPath();
  ctx.moveTo(x + r, top);
  ctx.lineTo(tailX - 22, top);
  ctx.lineTo(tailX, top - 30);
  ctx.lineTo(tailX + 22, top);
  ctx.arcTo(x + w, top, x + w, top + h, r);
  ctx.arcTo(x + w, top + h, x, top + h, r);
  ctx.arcTo(x, top + h, x, top, r);
  ctx.arcTo(x, top, x + w, top, r);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => ctx.fillText(line, x + w / 2, top + pad + lh * (i + 0.5)));
  ctx.textBaseline = 'alphabetic';
  return h;
}

// A tilted "rubber stamp" for a perfect round.
function stamp(ctx, cx, cy, text) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.2);
  fitText(ctx, text, 300, 48, 28);
  const w = ctx.measureText(text).width + 56, h = 96;
  roundRect(ctx, -w / 2, -h / 2, w, h, 22);
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = CORAL;
  ctx.stroke();
  ctx.fillStyle = CORAL;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 4);
  ctx.restore();
}

// ---------------- checklist 1080x1920 ----------------

export function drawChecklist(canvas, d, assets) {
  const W = 1080, H = 1920;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const accent = theme(d.mode).chip;
  const accentDark = theme(d.mode).accentDark;
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);

  // header band
  ctx.fillStyle = accent;
  roundRect(ctx, 0, 0, W, 330, 0);
  ctx.fill();
  ctx.fillStyle = accentDark;
  ctx.fillRect(0, 322, W, 10);
  logo(ctx, 380, 108, 74, d.logo, 600);
  drawGecko(ctx, assets, 790, 24, 250, 270, 'happy', propOf(d.mode));
  ctx.textAlign = 'left';
  ctx.fillStyle = INK;
  const tsize = fitText(ctx, d.title, 720, 74, 50);
  const tlines = wrapText(ctx, d.title, 720);
  tlines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 56, 200 + i * tsize * 1.15));
  font(ctx, 36, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.subtitle, 56, 300);

  // rows (a guide with no pictures, like the earthquake guide: number on the left, more room for text)
  const top = 362, rowH = 120;
  const plain = !d.items.some((it) => it.sprite);
  const numX = plain ? 92 : 170, textX = plain ? 142 : 216;
  d.items.forEach((it, i) => {
    const y = top + i * rowH;
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      roundRect(ctx, 30, y, W - 60, rowH - 8, 26);
      ctx.fill();
    }
    // icon
    if (it.sprite) {
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, 48, y + 8, 96, 96, 22);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#EBD8BF';
      ctx.stroke();
      drawSprite(ctx, assets, it.sprite, 56, y + 16, 80, 80);
    }
    // number
    ctx.beginPath();
    ctx.arc(numX, y + 56, 25, 0, Math.PI * 2);
    ctx.fillStyle = TEAL;
    ctx.fill();
    ctx.fillStyle = '#fff';
    font(ctx, 30);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), numX, y + 58);
    ctx.textBaseline = 'alphabetic';
    // text, up to two lines
    ctx.textAlign = 'left';
    ctx.fillStyle = INK;
    font(ctx, 40);
    let lines = wrapText(ctx, it.text, W - textX - 64);
    let size = 40;
    while (lines.length > 2 && size > 32) {
      size -= 2;
      font(ctx, size);
      lines = wrapText(ctx, it.text, W - textX - 64);
    }
    const lh = size * 1.32;
    const startY = y + 56 - ((Math.min(lines.length, 2) - 1) * lh) / 2 + size * 0.36;
    lines.slice(0, 2).forEach((ln, k) => ctx.fillText(ln, textX, startY + k * lh));
  });

  // footer: helplines, link, disclaimer
  const fy = top + 10 * rowH + 14;
  ctx.fillStyle = INK;
  roundRect(ctx, 30, fy, W - 60, 204, 30);
  ctx.fill();
  ctx.fillStyle = SUN;
  ctx.textAlign = 'center';
  if (d.calls?.length) {
    // v1.11.0: the guide's own numbers, each with its name under it ("1669 / เจ็บป่วย"),
    // so a picture forwarded on its own says whom each number reaches.
    font(ctx, 34);
    ctx.fillText(d.helpLabel, W / 2, fy + 44);
    drawCalls(ctx, d.calls, { x: 60, w: W - 120, y: fy + 98, num: 48, name: 23 });
    font(ctx, 30, 400);
    ctx.fillStyle = '#FFE08A';
    ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, fy + 188);
  } else {
    font(ctx, 36);
    ctx.fillText(d.helpLabel, W / 2, fy + 56);
    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, d.helpNumbers, W - 120, 50, 32);
    ctx.fillText(d.helpNumbers, W / 2, fy + 122);
    font(ctx, 34, 400);
    ctx.fillStyle = '#FFE08A';
    ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, fy + 178);
  }
  font(ctx, 38);
  ctx.fillStyle = CORAL;
  ctx.fillText(d.forward, W / 2, fy + 262);
  font(ctx, 26, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.footer, W / 2, H - 26);
}

// Helpline numbers in columns, each with its short name under it ("1669 / เจ็บป่วย"),
// on a dark box (the guide picture, the plan card). y: the numbers' baseline.
export function drawCalls(ctx, calls, { x, w, y, num, name }) {
  const colW = w / calls.length;
  ctx.textAlign = 'center';
  calls.forEach((c, i) => {
    const cx = x + colW * (i + 0.5);
    ctx.fillStyle = '#FFFFFF';
    font(ctx, num);
    ctx.fillText(c.number, cx, y);
    ctx.fillStyle = '#F6E7D6';
    font(ctx, name, 400);
    wrapText(ctx, c.name, colW - 14).slice(0, 2).forEach((ln, k) => ctx.fillText(ln, cx, y + name * 1.3 + k * name * 1.1));
  });
}

// ---------------- link preview 1200x630 ----------------

export function drawOG(canvas, d, assets) {
  const W = 1200, H = 630;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const th = theme(d.mode || 'prepare');
  ctx.fillStyle = th.og;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  for (let y = 24; y < H; y += 48) for (let x = (y / 48) % 2 ? 24 : 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  waves(ctx, W, 540, ...th.waves);

  ctx.beginPath();
  ctx.arc(250, 300, 210, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.stroke();
  const face = d.kind === 'challenge' ? (d.score >= 8 ? 'cheer' : 'happy') : 'happy';
  drawGecko(ctx, assets, 70, 90, 360, 400, face, propOf(d.mode || 'prepare'));
  // A tool's own icon as a sticker on the gecko's circle (v1.13.0), so each
  // preview says what the tool is at chat size. Drawn only by tools/render.html,
  // where an emoji font is installed; players' phones never draw a preview.
  if (d.badge) {
    ctx.beginPath();
    ctx.arc(408, 132, 78, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.font = '88px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.badge, 408, 138);
    ctx.textBaseline = 'alphabetic';
  }

  const cx = 800;
  logo(ctx, cx, 120, 88, d.logo, 620);
  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  if (d.kind === 'challenge') {
    fitText(ctx, d.line1, 640, 52, 36);
    ctx.fillText(d.line1, cx, 215);
    font(ctx, 190);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = INK;
    ctx.strokeText(d.scoreText, cx, 395);
    ctx.fillStyle = CORAL;
    ctx.fillText(d.scoreText, cx, 395);
    pill(ctx, cx, 425, d.line2, { size: 40, fill: SUN, lw: 4 });
  } else if (d.kind === 'checklist') {
    ctx.fillStyle = INK;
    const s = fitText(ctx, d.line1, 640, 60, 40);
    wrapText(ctx, d.line1, 640).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, cx, 220 + i * s * 1.15));
    font(ctx, 36, 400);
    ctx.fillStyle = INK2;
    wrapText(ctx, d.line2, 640).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, cx, 370 + i * 48));
    pill(ctx, cx, 432, d.line3, { size: 36, fill: SUN, lw: 4 });
  } else {
    font(ctx, 52);
    wrapText(ctx, d.line1, 660).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, cx, 222 + i * 64));
    font(ctx, 38, 400);
    ctx.fillStyle = INK2;
    ctx.fillText(d.line2, cx, 372);
    pill(ctx, cx, 412, d.line3, { size: 40, fill: SUN, lw: 4 });
  }
  font(ctx, 32, 400);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, 604);
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    if (canvas.toBlob) canvas.toBlob((b) => resolve(b), 'image/png');
    else {
      const bin = atob(canvas.toDataURL('image/png').split(',')[1]);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      resolve(new Blob([arr], { type: 'image/png' }));
    }
  });
}

// The drawing helpers, for renderers outside the game (tools/carousel-draw.mjs),
// so code players never run stays out of what they download.
export const kit = {
  INK, INK2, CREAM, TEAL, CORAL, SUN, OK, WARN, font, fitText, wrapText, pill, logo, waves, background,
  roundRect, statusDot, drawGecko, drawSprite, theme, propOf, plainText,
};

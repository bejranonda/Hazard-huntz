// Canvas renderers for everything people share: result cards (1080x1350),
// family-group checklists (1080x1920) and link-preview images (1200x630).
// Used live in the game and by tools/render-images.mjs at build time, so a
// preview in LINE looks exactly like the card in the game.

import { geckoSVG } from './mascot.js';
import { parseSvg, drawSvgInto } from './svgdraw.js';

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

export async function loadCardAssets() {
  if (document.fonts?.load) {
    await Promise.all([
      document.fonts.load(`600 64px Kanit`, 'บ้านรอดไหม? 0123456789/'),
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
  if (segmenter) return Array.from(segmenter.segment(text), (s) => s.segment);
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

function logo(ctx, cx, y, size) {
  font(ctx, size);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const a = 'บ้าน', b = 'รอดไหม?';
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
  if (mode === 'return') {
    ctx.fillStyle = SUN;
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
  if (d.mode === 'prepare') waves(ctx, W, 1110, '#9FD3F0', '#63B8EA');
  else waves(ctx, W, 1110, '#D9C08E', '#B08B62');

  logo(ctx, W / 2, 150, 104);
  const chipFill = d.mode === 'prepare' ? '#CFEAFB' : '#FFE6B0';
  pill(ctx, W / 2, 192, d.modeLabel, { size: 40, fill: chipFill, lw: 4 });

  const face = d.tier >= 2 ? 'cheer' : d.tier === 1 ? 'happy' : 'think';
  drawGecko(ctx, assets, W / 2 - 190, 318, 380, 400, face, d.mode === 'prepare' ? 'hood' : 'torch');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  fitText(ctx, d.headline, W - 120, 70, 44);
  ctx.fillStyle = INK;
  ctx.fillText(d.headline, W / 2, 780);

  font(ctx, 230);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 16;
  ctx.strokeStyle = INK;
  ctx.strokeText(d.scoreText, W / 2, 990);
  ctx.fillStyle = CORAL;
  ctx.fillText(d.scoreText, W / 2, 990);

  pill(ctx, W / 2, 1022, d.rankTitle, { size: 50, fill: SUN });

  // result dots, Wordle-style, with shapes as well as colours
  const n = d.grid.length;
  const r = 30, gap = 22;
  const total = n * (r * 2) + (n - 1) * gap;
  let x = W / 2 - total / 2 + r;
  for (const st of d.grid) {
    statusDot(ctx, x, 1150, r, st);
    x += r * 2 + gap;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  font(ctx, 46);
  ctx.fillText(d.cta, W / 2, 1238);
  font(ctx, 40, 400);
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, 1290);
  font(ctx, 24, 400);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.fillText(d.footer, W / 2, 1332);
  font(ctx, 30, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.houseLabel, W / 2, 300);
}

// ---------------- checklist 1080x1920 ----------------

export function drawChecklist(canvas, d, assets) {
  const W = 1080, H = 1920;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const accent = d.mode === 'prepare' ? '#CFEAFB' : '#FFE6B0';
  const accentDark = d.mode === 'prepare' ? SKY : '#C98A0C';
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);

  // header band
  ctx.fillStyle = accent;
  roundRect(ctx, 0, 0, W, 330, 0);
  ctx.fill();
  ctx.fillStyle = accentDark;
  ctx.fillRect(0, 322, W, 10);
  logo(ctx, 380, 108, 74);
  drawGecko(ctx, assets, 790, 24, 250, 270, 'happy', d.mode === 'prepare' ? 'hood' : 'torch');
  ctx.textAlign = 'left';
  ctx.fillStyle = INK;
  const tsize = fitText(ctx, d.title, 720, 74, 50);
  const tlines = wrapText(ctx, d.title, 720);
  tlines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 56, 200 + i * tsize * 1.15));
  font(ctx, 36, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.subtitle, 56, 300);

  // rows
  const top = 362, rowH = 120;
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
    ctx.arc(170, y + 56, 25, 0, Math.PI * 2);
    ctx.fillStyle = TEAL;
    ctx.fill();
    ctx.fillStyle = '#fff';
    font(ctx, 30);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), 170, y + 58);
    ctx.textBaseline = 'alphabetic';
    // text, up to two lines
    ctx.textAlign = 'left';
    ctx.fillStyle = INK;
    font(ctx, 40);
    let lines = wrapText(ctx, it.text, W - 280);
    let size = 40;
    while (lines.length > 2 && size > 32) {
      size -= 2;
      font(ctx, size);
      lines = wrapText(ctx, it.text, W - 280);
    }
    const lh = size * 1.32;
    const startY = y + 56 - ((Math.min(lines.length, 2) - 1) * lh) / 2 + size * 0.36;
    lines.slice(0, 2).forEach((ln, k) => ctx.fillText(ln, 216, startY + k * lh));
  });

  // footer: helplines, link, disclaimer
  const fy = top + 10 * rowH + 14;
  ctx.fillStyle = INK;
  roundRect(ctx, 30, fy, W - 60, 204, 30);
  ctx.fill();
  ctx.fillStyle = SUN;
  font(ctx, 36);
  ctx.textAlign = 'center';
  ctx.fillText(d.helpLabel, W / 2, fy + 56);
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, d.helpNumbers, W - 120, 50, 32);
  ctx.fillText(d.helpNumbers, W / 2, fy + 122);
  font(ctx, 34, 400);
  ctx.fillStyle = '#FFE08A';
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, fy + 178);
  font(ctx, 38);
  ctx.fillStyle = CORAL;
  ctx.fillText(d.forward, W / 2, fy + 262);
  font(ctx, 26, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.footer, W / 2, H - 26);
}

// ---------------- link preview 1200x630 ----------------

export function drawOG(canvas, d, assets) {
  const W = 1200, H = 630;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const prepare = d.mode !== 'return';
  ctx.fillStyle = prepare ? '#DDF0FB' : '#FFF0CC';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  for (let y = 24; y < H; y += 48) for (let x = (y / 48) % 2 ? 24 : 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (prepare) waves(ctx, W, 540, '#9FD3F0', '#63B8EA');
  else waves(ctx, W, 540, '#D9C08E', '#B08B62');

  ctx.beginPath();
  ctx.arc(250, 300, 210, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.stroke();
  const face = d.kind === 'challenge' ? (d.score >= 8 ? 'cheer' : 'happy') : 'happy';
  drawGecko(ctx, assets, 70, 90, 360, 400, face, prepare ? 'hood' : 'torch');

  const cx = 800;
  logo(ctx, cx, 120, 88);
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

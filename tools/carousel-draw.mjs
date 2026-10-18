// Draws one carousel page (tools/carousel.mjs describes the pages). Runs in
// the browser that tools/render-images.mjs drives, with the game's own card
// helpers, so the posts look like the game; the game itself never loads it.
import { kit } from '/js/cards.js';

const {
  INK, INK2, TEAL, SUN, OK, WARN, font, fitText, wrapText, pill, logo, waves, background,
  roundRect, statusDot, drawGecko, drawSprite, theme, propOf, plainText,
} = kit;

// A set of square-ish pages for a Facebook/Instagram/LINE album post: a cover,
// one page per lesson, the checklist and a "play the game" page. Drawn with
// the same code as the cards, so the posts and the game look alike.
// d: { kind: 'cover'|'tip'|'checklist'|'cta', mode, logo, page, pages, url, footer, ... }

// The narrowest width that keeps the same number of lines, so Thai titles
// break evenly ("น้ำท่วม: 8 เรื่องที่ | ทำให้บ้านรอด", not "…ให้บ้าน | รอด").
function balanced(ctx, text, maxW) {
  const n = wrapText(ctx, text, maxW).length;
  if (n < 2) return wrapText(ctx, text, maxW);
  let lo = maxW * 0.4, hi = maxW;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    if (wrapText(ctx, text, mid).length > n) lo = mid;
    else hi = mid;
  }
  return wrapText(ctx, text, hi);
}

function wrapFit(ctx, text, maxW, size, min, maxLines, weight = 600) {
  let s = size;
  for (;;) {
    font(ctx, s, weight);
    const lines = wrapText(ctx, text, maxW);
    if (lines.length <= maxLines || s <= min) return { size: s, lines: (lines.length <= maxLines ? balanced(ctx, text, maxW) : lines).slice(0, maxLines) };
    s -= 2;
  }
}

function carouselFrame(ctx, W, H, d) {
  background(ctx, W, H, d.mode);
  waves(ctx, W, 1200, ...theme(d.mode).waves);
  logo(ctx, 250, 104, 64, d.logo, 420);
  // page number, top right
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  roundRect(ctx, W - 210, 52, 150, 70, 35);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  font(ctx, 36);
  ctx.fillStyle = INK;
  ctx.fillText(`${d.page}/${d.pages}`, W - 135, 89);
  ctx.textBaseline = 'alphabetic';
  // the game's address at the bottom of every page
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, d.url.replace(/^https?:\/\//, ''), W - 120, 44, 28);
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, 1282);
  font(ctx, 24, 400);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.fillText(d.footer, W / 2, 1326);
}

export function drawCarouselPage(canvas, d, assets) {
  const W = 1080, H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  carouselFrame(ctx, W, H, d);
  ctx.textAlign = 'center';
  const chip = theme(d.mode).chip;

  if (d.kind === 'cover') {
    pill(ctx, W / 2, 170, d.modeLabel, { size: 40, fill: chip, lw: 4 });
    drawGecko(ctx, assets, W / 2 - 200, 270, 400, 430, 'happy', propOf(d.mode));
    const t = wrapFit(ctx, plainText(d.title), W - 140, 80, 56, 3);
    ctx.fillStyle = INK;
    t.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 790 + i * t.size * 1.2));
    let y = 790 + (t.lines.length - 1) * t.size * 1.2 + 72;
    font(ctx, 40, 400);
    ctx.fillStyle = INK2;
    const sub = balanced(ctx, plainText(d.subtitle), W - 160).slice(0, 2);
    sub.forEach((ln, i) => ctx.fillText(ln, W / 2, y + i * 54));
    y += (sub.length - 1) * 54 + 44;
    pill(ctx, W / 2, Math.min(y, 1100), d.swipe, { size: 40, fill: SUN, lw: 4 });
    return;
  }

  if (d.kind === 'tip') {
    pill(ctx, W / 2, 160, d.modeLabel, { size: 36, fill: chip, lw: 4 });
    // the hazard as players see it in the house
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, W / 2 - 150, 250, 300, 300, 48);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    drawSprite(ctx, assets, d.sprite, W / 2 - 115, 285, 230, 230);
    let y = 640;
    const name = wrapFit(ctx, plainText(d.name), W - 140, 64, 46, 2);
    ctx.fillStyle = INK;
    name.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, y + i * name.size * 1.18));
    y += (name.lines.length - 1) * name.size * 1.18 + 40;
    // "do this": the correct action, with the game's blue tick
    const act = wrapFit(ctx, plainText(d.doText), W - 260, 46, 36, 3);
    const boxH = act.lines.length * act.size * 1.3 + 118;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, 60, y, W - 120, boxH, 32);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = OK;
    ctx.stroke();
    statusDot(ctx, 120, y + 58, 30, 'correct');
    ctx.textAlign = 'left';
    font(ctx, 32);
    ctx.fillStyle = OK;
    ctx.fillText(d.doLabel, 168, y + 70);
    font(ctx, act.size);
    ctx.fillStyle = INK;
    act.lines.forEach((ln, i) => ctx.fillText(ln, 100, y + 96 + act.size + i * act.size * 1.3 - act.size * 0.25));
    y += boxH + 30;
    // why, in one or two lines
    const why = wrapFit(ctx, `${d.whyLabel}: ${plainText(d.why)}`, W - 160, 34, 28, 3, 400);
    ctx.fillStyle = INK2;
    why.lines.forEach((ln, i) => ctx.fillText(ln, 80, y + why.size + i * why.size * 1.35));
    y += why.lines.length * why.size * 1.35 + 24;
    // the source, so the post can be checked
    font(ctx, 28, 400);
    ctx.fillStyle = INK2;
    const src = wrapText(ctx, `${d.sourceLabel}: ${d.source}`, W - 160).slice(0, 2);
    src.forEach((ln, i) => ctx.fillText(ln, 80, Math.min(y + 28 + i * 38, 1150)));
    if (d.flag) {
      ctx.fillStyle = WARN;
      ctx.fillText(d.flag, 80, Math.min(y + 28 + src.length * 38, 1180));
    }
    ctx.textAlign = 'center';
    return;
  }

  if (d.kind === 'checklist') {
    const t = wrapFit(ctx, plainText(d.title), W - 140, 56, 40, 2);
    ctx.fillStyle = INK;
    t.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 200 + i * t.size * 1.2));
    const top = 200 + t.lines.length * t.size * 1.2;
    const rowH = 92;
    d.items.slice(0, 10).forEach((it, i) => {
      const y = top + i * rowH;
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        roundRect(ctx, 40, y, W - 80, rowH - 8, 24);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(96, y + 42, 24, 0, Math.PI * 2);
      ctx.fillStyle = TEAL;
      ctx.fill();
      ctx.fillStyle = '#fff';
      font(ctx, 28);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), 96, y + 44);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      const r = wrapFit(ctx, plainText(it), W - 220, 34, 26, 2);
      ctx.fillStyle = INK;
      const lh = r.size * 1.25;
      const y0 = y + 42 - ((r.lines.length - 1) * lh) / 2 + r.size * 0.36;
      r.lines.forEach((ln, k) => ctx.fillText(ln, 140, y0 + k * lh));
    });
    ctx.textAlign = 'center';
    return;
  }

  // cta: play the game, then the helplines
  drawGecko(ctx, assets, W / 2 - 190, 170, 380, 410, 'cheer', propOf(d.mode));
  const t = wrapFit(ctx, plainText(d.title), W - 140, 72, 52, 2);
  ctx.fillStyle = INK;
  t.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 660 + i * t.size * 1.2));
  let y = 660 + t.lines.length * t.size * 1.2 + 10;
  font(ctx, 38, 400);
  ctx.fillStyle = INK2;
  balanced(ctx, plainText(d.sub), W - 160).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, W / 2, y + i * 52));
  y += 130;
  pill(ctx, W / 2, y, d.short, { size: 44, fill: SUN, lw: 5 });
  y += 130;
  ctx.fillStyle = INK;
  roundRect(ctx, 60, y, W - 120, 150, 30);
  ctx.fill();
  ctx.fillStyle = SUN;
  font(ctx, 34);
  ctx.fillText(d.helpLabel, W / 2, y + 56);
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, d.helpNumbers, W - 160, 46, 30);
  ctx.fillText(d.helpNumbers, W / 2, y + 116);
}

// Minimal SVG -> canvas renderer for our own flat art (g, path, rect,
// circle, ellipse, use, text; translate/rotate/scale transforms).
// Drawing with Path2D avoids loading SVG as an <img>, which can taint the
// canvas or fail outright in some in-app browsers.

const INHERITED = ['fill', 'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'stroke-dasharray',
  'font-size', 'font-family', 'font-weight', 'text-anchor', 'fill-opacity', 'stroke-opacity'];

export function parseSvg(text) {
  return new DOMParser().parseFromString(text, 'image/svg+xml');
}

function num(v, d = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
}

function applyTransform(ctx, tf) {
  if (!tf) return;
  const re = /(translate|rotate|scale)\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(tf))) {
    const a = m[2].split(/[\s,]+/).filter(Boolean).map(Number);
    if (m[1] === 'translate') ctx.translate(a[0] || 0, a[1] || 0);
    else if (m[1] === 'scale') ctx.scale(a[0], a.length > 1 ? a[1] : a[0]);
    else if (m[1] === 'rotate') {
      const rad = ((a[0] || 0) * Math.PI) / 180;
      if (a.length >= 3) {
        ctx.translate(a[1], a[2]);
        ctx.rotate(rad);
        ctx.translate(-a[1], -a[2]);
      } else ctx.rotate(rad);
    }
  }
}

function shapePath(el) {
  const p = new Path2D();
  switch (el.tagName) {
    case 'path':
      return new Path2D(el.getAttribute('d') || '');
    case 'rect': {
      const x = num(el.getAttribute('x')), y = num(el.getAttribute('y'));
      const w = num(el.getAttribute('width')), h = num(el.getAttribute('height'));
      const r = Math.min(num(el.getAttribute('rx')), w / 2, h / 2);
      if (r > 0) {
        p.moveTo(x + r, y);
        p.arcTo(x + w, y, x + w, y + h, r);
        p.arcTo(x + w, y + h, x, y + h, r);
        p.arcTo(x, y + h, x, y, r);
        p.arcTo(x, y, x + w, y, r);
        p.closePath();
      } else p.rect(x, y, w, h);
      return p;
    }
    case 'circle':
      p.arc(num(el.getAttribute('cx')), num(el.getAttribute('cy')), num(el.getAttribute('r')), 0, Math.PI * 2);
      return p;
    case 'ellipse':
      p.ellipse(num(el.getAttribute('cx')), num(el.getAttribute('cy')), num(el.getAttribute('rx')), num(el.getAttribute('ry')), 0, 0, Math.PI * 2);
      return p;
    default:
      return null;
  }
}

function drawNode(ctx, el, style, doc, depth = 0) {
  if (el.nodeType !== 1 || depth > 12) return;
  const tag = el.tagName;
  if (tag === 'defs' || tag === 'style' || tag === 'title' || tag === 'clipPath' || tag === 'pattern' || tag === 'linearGradient') return;
  if (el.getAttribute('display') === 'none') return;
  const st = { ...style };
  for (const k of INHERITED) {
    const v = el.getAttribute(k);
    if (v != null) st[k] = v;
  }
  const opacity = num(el.getAttribute('opacity'), 1);
  ctx.save();
  if (opacity < 1) ctx.globalAlpha *= opacity;
  applyTransform(ctx, el.getAttribute('transform'));

  if (tag === 'g' || tag === 'svg' || tag === 'symbol') {
    for (const c of el.children) drawNode(ctx, c, st, doc, depth + 1);
  } else if (tag === 'use') {
    const ref = (el.getAttribute('href') || el.getAttribute('xlink:href') || '').slice(1);
    const target = doc && doc.getElementById(ref);
    if (target) {
      ctx.translate(num(el.getAttribute('x')), num(el.getAttribute('y')));
      for (const c of target.children) drawNode(ctx, c, st, doc, depth + 1);
    }
  } else if (tag === 'text') {
    const size = num(st['font-size'], 10);
    ctx.font = `${st['font-weight'] || 400} ${size}px ${st['font-family'] || 'Kanit, sans-serif'}`;
    const anchor = st['text-anchor'];
    ctx.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = st.fill && st.fill !== 'none' ? st.fill : '#000';
    ctx.fillText(el.textContent, num(el.getAttribute('x')), num(el.getAttribute('y')));
  } else {
    const path = shapePath(el);
    if (path) {
      const fill = st.fill == null ? '#000' : st.fill;
      if (fill !== 'none' && !fill.startsWith('url(')) {
        ctx.save();
        ctx.globalAlpha *= num(st['fill-opacity'], 1);
        ctx.fillStyle = fill;
        ctx.fill(path);
        ctx.restore();
      }
      if (st.stroke && st.stroke !== 'none') {
        ctx.save();
        ctx.globalAlpha *= num(st['stroke-opacity'], 1);
        ctx.strokeStyle = st.stroke;
        ctx.lineWidth = num(st['stroke-width'], 1);
        ctx.lineJoin = st['stroke-linejoin'] || 'miter';
        ctx.lineCap = st['stroke-linecap'] || 'butt';
        if (st['stroke-dasharray']) ctx.setLineDash(st['stroke-dasharray'].split(/[\s,]+/).map(Number));
        ctx.stroke(path);
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

// Draw an <svg> root or a <symbol> into the box (x, y, w, h), keeping its
// aspect ratio and centring it.
export function drawSvgInto(ctx, rootEl, x, y, w, h, doc = rootEl.ownerDocument) {
  const vb = (rootEl.getAttribute('viewBox') || '0 0 100 100').split(/[\s,]+/).map(Number);
  const [vx, vy, vw, vh] = vb;
  const s = Math.min(w / vw, h / vh);
  ctx.save();
  ctx.translate(x + (w - vw * s) / 2, y + (h - vh * s) / 2);
  ctx.scale(s, s);
  ctx.translate(-vx, -vy);
  for (const c of rootEl.children) drawNode(ctx, c, {}, doc);
  ctx.restore();
}

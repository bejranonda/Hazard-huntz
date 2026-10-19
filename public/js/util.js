// Small DOM, storage and date helpers shared by every module.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

export function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  if (html) node.innerHTML = html;
  return node;
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Thai has no spaces between words, and the browser's dictionary splits some
// compounds across lines ("กระ|จก", "แข็ง|แรง", "ไฟ|ดับ"). The words in
// config.json → keepTogether are wrapped in <span class="nw"> (white-space:
// nowrap) once they are on the page. A span doesn't change the text the
// dictionary reads; an invisible joiner inside the word did, and moved the
// break next to it instead ("ขอ|งกรมอุตุฯ").
let keepRe = null;
export function setKeepTogether(words = []) {
  keepRe = words.length ? new RegExp([...words].sort((a, b) => b.length - a.length).join('|'), 'g') : null;
}
// Spans [start, end) of kept words, for code that wraps text itself (cards).
export function keptSpans(s) {
  const out = [];
  if (!keepRe) return out;
  keepRe.lastIndex = 0;
  for (const m of String(s).matchAll(keepRe)) out.push([m.index, m.index + m[0].length]);
  return out;
}
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'OPTION', 'TITLE']);
const XHTML = 'http://www.w3.org/1999/xhtml'; // never inside SVG text
export function keepWordsIn(root) {
  if (!keepRe || !root) return;
  const nodes = [];
  if (root.nodeType === 3) nodes.push(root);
  else {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
  }
  for (const n of nodes) {
    const parent = n.parentNode;
    if (!parent || SKIP.has(parent.nodeName) || parent.namespaceURI !== XHTML || parent.classList.contains('nw') || !/[\u0E00-\u0E7F]/.test(n.data)) continue;
    if (!n.data.match(keepRe)) continue; // (match with a /g pattern leaves lastIndex at 0)
    const frag = document.createDocumentFragment();
    let at = 0;
    for (const m of n.data.matchAll(keepRe)) {
      if (m.index > at) frag.append(n.data.slice(at, m.index));
      const span = document.createElement('span');
      span.className = 'nw';
      span.textContent = m[0];
      frag.append(span);
      at = m.index + m[0].length;
    }
    if (at < n.data.length) frag.append(n.data.slice(at));
    // In a flex or grid box each piece would become its own item (a gap opened
    // in "ทำแผน ครอบครัว"), so the line goes in as one inline span there.
    const display = getComputedStyle(parent).display;
    if (/flex|grid/.test(display)) {
      const one = document.createElement('span');
      one.append(frag);
      parent.replaceChild(one, n);
    } else parent.replaceChild(frag, n);
  }
}
// Keep words together in everything the app puts on the page from now on.
export function observeKeptWords(root = document.body) {
  if (!keepRe || typeof MutationObserver === 'undefined') return;
  keepWordsIn(root);
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') keepWordsIn(r.target);
      else for (const n of r.addedNodes) if (n.nodeType === 1 || n.nodeType === 3) keepWordsIn(n);
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
}

// localStorage can throw in private modes and some in-app browsers, so every
// access is guarded and the game keeps working with in-memory state.
const memory = new Map();
export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem('brm:' + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return memory.has(key) ? memory.get(key) : fallback;
    }
  },
  set(key, value) {
    memory.set(key, value);
    try { localStorage.setItem('brm:' + key, JSON.stringify(value)); } catch { /* memory only */ }
  },
};

// The daily house resets at midnight Bangkok time (UTC+7, no DST).
export function bangkokDateKey(now = Date.now()) {
  const d = new Date(now + 7 * 3600 * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "20261006" -> "6 ต.ค. 69" (Thai, Buddhist era) or "6 Oct 2026".
export function formatHouseDate(key, lang = 'th') {
  if (!/^\d{8}$/.test(key || '')) return '';
  const y = +key.slice(0, 4), m = +key.slice(4, 6) - 1, d = +key.slice(6, 8);
  if (lang === 'en') return `${d} ${EN_MONTHS[m]} ${y}`;
  return `${d} ${TH_MONTHS[m]} ${String(y + 543).slice(-2)}`;
}

export function daysBetween(keyA, keyB) {
  const toUtc = (k) => Date.UTC(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6, 8));
  return Math.round((toUtc(keyB) - toUtc(keyA)) / 86400000);
}

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function nextFrame() {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

export function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Identify in-app browsers so sharing can pick fallbacks that actually work there.
export function inAppBrowser(ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '')) {
  if (/\bLine\//i.test(ua)) return 'line';
  if (/FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(ua)) return 'facebook';
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/musical_ly|BytedanceWebview|TikTok|trill/i.test(ua)) return 'tiktok';
  return null;
}

export const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

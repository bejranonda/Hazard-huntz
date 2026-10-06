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

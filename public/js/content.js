// Loads the editable JSON content and provides translation helpers.

import { store, setKeepTogether } from './util.js';
import { setModes, setGuides, mk, codesRe, modeLink } from './modes.js';

const FILES = ['config', 'strings', 'items', 'rooms', 'sources', 'checklists', 'helplines'];

let C = null;
let lang = 'th';

export async function loadContent() {
  if (C) return C;
  const parts = await Promise.all(
    FILES.map((f) => fetch(`/content/${f}.json`).then((r) => {
      if (!r.ok) throw new Error(`content/${f}.json: ${r.status}`);
      return r.json();
    })),
  );
  const [config, strings, items, rooms, sources, checklists, helplines] = parts;
  C = {
    config,
    strings,
    items: items.items,
    decoys: items.decoys,
    rooms: rooms.rooms,
    sources: sources.sources,
    checklists,
    helplines: helplines.helplines,
  };
  setModes(config.modes);
  setGuides(config.guides);
  setKeepTogether(config.keepTogether);
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'th') setLang(q, true);
  else setLang(pathLang() || store.get(LANG_KEY, null) || (isBot() ? 'th' : guessLang()));
  return C;
}

export const content = () => C;
// An agency's name in the current language (strings.json → seo.en.agencies);
// English pages used to show "Source: กรมทรัพยากรธรณี".
export const agencyName = (a) => (lang === 'en' && C?.strings?.seo?.en?.agencies?.[a]) || a;
export const getLang = () => lang;

// English pages live under /en/ (/en/, /en/c/p8, /en/checklist/prepare).
export const pathLang = (pathname = location.pathname) => (/^\/en(\/|$)/.test(pathname) ? 'en' : null);

// First visit, no choice made yet: Thai for anyone whose browser lists Thai or
// whose clock is on Bangkok time (many Thais use English phone settings),
// English for everyone else.
export function guessLang(langs = navigator.languages || [navigator.language || ''], tz = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  if (langs.some((l) => /^th\b/i.test(l || ''))) return 'th';
  if (tz === 'Asia/Bangkok') return 'th';
  return 'en';
}

// Search and preview bots stay on the Thai page (their hreflang links point to the English one).
// Keep this pattern the same as the inline script in index.html.
export const isBot = (ua = navigator.userAgent) => /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse/i.test(ua || '');

// The same page in the other language: "/c/p8" <-> "/en/c/p8", "/" <-> "/en/".
// Paths outside the app shell (e.g. /learn) are returned unchanged.
export function langPath(pathname, next) {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  // Checklists include the guides with no game (/checklist/quake), so any id-shaped name.
  if (!new RegExp(`^/(c/${codesRe()}\\d{1,2}|checklist/[a-z][a-z0-9-]*)?/?$`).test(bare)) return pathname;
  if (next !== 'en') return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

// Only a choice the player made (the language button, ?lang=) is remembered.
// Opening an English page once used to be remembered too, and then every Thai
// link opened in English on that phone. A new key drops those old values.
const LANG_KEY = 'langPick';
export function setLang(next, remember = false) {
  lang = next === 'en' ? 'en' : 'th';
  if (remember) store.set(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.body.classList.toggle('lang-en', lang === 'en');
  document.body.classList.toggle('lang-th', lang === 'th');
}

// Pick the current language from a {th, en} object (Thai is the fallback).
export function L(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] ?? obj.th ?? '';
}

// UI string with {placeholders}.
export function t(key, vars = {}) {
  const table = C.strings[lang] || C.strings.th;
  let s = table[key] ?? C.strings.th[key] ?? key;
  if (Array.isArray(s)) return s;
  return String(s).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

// A per-mode string: "<base><Mode>" when it exists (rankDust, howtoFire …),
// otherwise the shared "<base>" (stFlooded, geckoFlood …).
export function tm(base, mode, vars = {}) {
  const key = mk(base, mode);
  const has = (C.strings[lang] && key in C.strings[lang]) || key in C.strings.th;
  return t(has ? key : base, vars);
}

export function pickLine(key, rng = Math.random) {
  const list = t(key);
  return Array.isArray(list) ? list[Math.floor(rng() * list.length)] : list;
}

// The same, preferring the mode's own lines (<base><Mode>) when they exist.
export function pickLineFor(base, mode, rng = Math.random) {
  const key = mk(base, mode);
  return pickLine((C.strings[lang] && key in C.strings[lang]) || key in C.strings.th ? key : base, rng);
}

export function rankTitle(mode, tier) {
  const list = t(mk('rank', mode));
  return list[Math.max(0, Math.min(list.length - 1, tier))];
}

export function sourceList(ids = []) {
  return ids.map((id) => C.sources[id]).filter(Boolean);
}

// Absolute site URL for share links: config.siteUrl unless still a placeholder.
export function siteUrl() {
  const u = C.config.siteUrl || '';
  return /^https?:\/\/[^[\]]+$/.test(u) ? u.replace(/\/$/, '') : location.origin;
}

// The "check before you go" link for a mode (modes.js → modeLink), or null
// while it is still a placeholder.
export function forecastUrl(mode) {
  const u = modeLink(C.config, mode) || '';
  return /^https?:\/\/[^[\]]+$/.test(u) ? u : null;
}

// i18n for static markup: <el data-i18n="key"> and data-i18n-aria.
export function applyStaticStrings(root = document) {
  for (const el of root.querySelectorAll('[data-i18n]')) {
    const v = t(el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  }
  for (const el of root.querySelectorAll('[data-i18n-aria]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  }
}

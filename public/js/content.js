// Loads the editable JSON content and provides translation helpers.

import { store } from './util.js';

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
  const q = new URLSearchParams(location.search).get('lang');
  setLang(q === 'en' || q === 'th' ? q : store.get('lang', 'th'));
  return C;
}

export const content = () => C;
export const getLang = () => lang;

export function setLang(next) {
  lang = next === 'en' ? 'en' : 'th';
  store.set('lang', lang);
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

export function pickLine(key, rng = Math.random) {
  const list = t(key);
  return Array.isArray(list) ? list[Math.floor(rng() * list.length)] : list;
}

export function rankTitle(mode, tier) {
  const list = t(mode === 'prepare' ? 'rankPrepare' : 'rankReturn');
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

export function forecastUrl() {
  const u = C.config.forecastAppUrl || '';
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

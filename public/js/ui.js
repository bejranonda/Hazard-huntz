// Screens, the shared bottom sheet, toasts and the mascot's speech bubble.

import { $, $$, esc, inAppBrowser } from './util.js';

export function showScreen(name) {
  for (const s of $$('.screen')) s.classList.toggle('active', s.id === `screen-${name}`);
  const active = $(`#screen-${name}`);
  if (active) active.scrollTop = 0;
}

// ---------- bottom sheet ----------

let sheetState = null;

export function sheetOpen() { return !!sheetState; }

export function openSheet(html, { dismissible = true, onClose, label } = {}) {
  const sheet = $('#sheet');
  const backdrop = $('#sheet-backdrop');
  const body = $('#sheet-body');
  if (sheetState) sheetState.cleanup(false);
  body.innerHTML = html;
  sheet.hidden = false;
  backdrop.hidden = false;
  sheet.scrollTop = 0;
  if (label) sheet.setAttribute('aria-label', label);
  const lastFocus = document.activeElement;

  const onKey = (e) => {
    if (e.key === 'Escape' && dismissible) close();
    if (e.key === 'Tab') trapFocus(e, sheet);
  };
  const onBackdrop = () => { if (dismissible) close(); };
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', onBackdrop);

  const cleanup = (restore = true) => {
    document.removeEventListener('keydown', onKey);
    backdrop.removeEventListener('click', onBackdrop);
    if (restore && lastFocus && lastFocus.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch { /* element gone */ }
    }
  };
  const close = () => {
    if (!sheetState) return;
    const cb = sheetState.onClose;
    sheetState = null;
    sheet.hidden = true;
    backdrop.hidden = true;
    body.innerHTML = '';
    cleanup(true);
    cb?.();
  };
  sheetState = { close, cleanup, onClose };
  requestAnimationFrame(() => {
    const first = sheet.querySelector('[autofocus], button, a[href], summary');
    if (first) first.focus({ preventScroll: true });
  });
  return { close, body };
}

export function closeSheet() {
  sheetState?.close();
}

function trapFocus(e, root) {
  const focusables = $$('button, a[href], summary, [tabindex]:not([tabindex="-1"])', root).filter((el) => !el.disabled && el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// ---------- toast & bubble ----------

let toastTimer = 0;
export function toast(text, ms = 2200) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}

let bubbleTimer = 0;
export function say(text, ms = 2600) {
  const el = $('#game-bubble');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => { el.hidden = true; }, ms);
}

export function hideBubble() {
  const el = $('#game-bubble');
  if (el) el.hidden = true;
}

export function setLoading(on) {
  const el = $('#loading');
  if (el) el.hidden = !on;
}

// ---------- printing (A4) ----------
// A plain list for the fridge door or an older relative: the screen is hidden
// while printing (#print-area, see app.css). In-app browsers (LINE, Facebook)
// can't print, so the button isn't shown there.
export const canPrint = () => typeof window.print === 'function' && !inAppBrowser();

// d: { title, sub, sections: [{ head, items: [{ text, note }] }], foot: [lines] }
export function printList(d) {
  let el = document.getElementById('print-area');
  if (!el) {
    el = document.createElement('div');
    el.id = 'print-area';
    document.body.append(el);
  }
  el.innerHTML = `
    <p class="p-brand">${esc(d.brand || '')}</p>
    <h1>${esc(d.title)}</h1>
    ${d.sub ? `<p class="p-sub">${esc(d.sub)}</p>` : ''}
    ${d.sections.map((s) => `${s.head ? `<h2>${esc(s.head)}</h2>` : ''}
    <ul>${s.items.map((it) => `<li><span class="p-box" aria-hidden="true"></span><span>${esc(it.text)}${it.note ? `<small>${esc(it.note)}</small>` : ''}</span></li>`).join('')}</ul>`).join('')}
    ${(d.foot || []).map((line) => `<p class="p-foot">${esc(line)}</p>`).join('')}`;
  window.print();
}

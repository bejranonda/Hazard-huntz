// Screens, the shared bottom sheet, toasts and the mascot's speech bubble.

import { $, $$ } from './util.js';

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

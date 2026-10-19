// Screens, the shared bottom sheet, toasts and the mascot's speech bubble.

import { $, $$, esc, inAppBrowser } from './util.js';

// ---------- the phone's back button ----------
// The game and result screens and an open sheet each own one history entry, so
// Back closes the sheet, pauses a round or leaves the result for the start
// screen, instead of leaving the site (a guide opened from LINE used to drop
// people back in the chat, v1.9.1; a round did until v1.9.2). After every
// change the entries are made to match what is showing, once, in the next task,
// so a sheet that closes and another that opens straight after share one entry.
const layers = []; // 'screen' | 'sheet', bottom to top; history.state.brm = depth
let ignorePop = 0;
let screenOn = false;
let onScreenBack = () => {};
export function setScreenBack(fn) { onScreenBack = fn; }
let settleTimer = 0;
function settleHistory() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    const want = [...(screenOn ? ['screen'] : []), ...(sheetState ? ['sheet'] : [])];
    try {
      if (layers.length > want.length) {
        const n = layers.length - want.length;
        layers.length = want.length;
        ignorePop += 1;
        history.go(-n);
      }
      while (layers.length < want.length) {
        layers.push(want[layers.length]);
        history.pushState({ ...(history.state || {}), brm: layers.length }, '');
      }
      want.forEach((kind, i) => { layers[i] = kind; });
    } catch { /* sandboxed */ }
  }, 0);
}
addEventListener('popstate', () => {
  if (ignorePop) { ignorePop -= 1; return; }
  const depth = Math.min(layers.length, Number(history.state?.brm) || 0);
  for (const kind of layers.splice(depth).reverse()) {
    if (kind === 'sheet') sheetState?.close();
    else onScreenBack();
  }
});

export function showScreen(name) {
  for (const s of $$('.screen')) s.classList.toggle('active', s.id === `screen-${name}`);
  const active = $(`#screen-${name}`);
  if (active) active.scrollTop = 0;
  screenOn = name === 'game' || name === 'result';
  settleHistory();
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
  sheet.classList.toggle('fixed', !dismissible);
  sheet.scrollTop = 0;
  if (label) sheet.setAttribute('aria-label', label);
  const lastFocus = document.activeElement;

  const onKey = (e) => {
    if (e.key === 'Escape' && dismissible) close();
    if (e.key === 'Tab') trapFocus(e, sheet);
  };
  const onBackdrop = () => { if (dismissible) close(); };
  const xBtn = $('#sheet-x');
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', onBackdrop);
  xBtn?.addEventListener('click', onBackdrop);

  const cleanup = (restore = true) => {
    document.removeEventListener('keydown', onKey);
    backdrop.removeEventListener('click', onBackdrop);
    xBtn?.removeEventListener('click', onBackdrop);
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
    settleHistory();
  };
  sheetState = { close, cleanup, onClose };
  settleHistory();
  requestAnimationFrame(() => {
    // The sheet's own content first; the ✕ is still a Tab away.
    const first = body.querySelector('[autofocus], button, a[href], summary') || $('#sheet-x');
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

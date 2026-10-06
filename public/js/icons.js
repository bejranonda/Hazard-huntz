// Action icons for the choice buttons (24x24 line icons). Drawn as SVG so
// they look the same on every phone, unlike emoji.

const P = {
  up: '<path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/>',
  pack: '<path d="M6 9h12l-1 11H7L6 9z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
  off: '<path d="M12 3v8"/><path d="M7.2 6.5a7 7 0 1 0 9.6 0"/>',
  leave: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  place: '<rect x="3" y="13" width="8" height="6" rx="1"/><rect x="13" y="13" width="8" height="6" rx="1"/><rect x="8" y="6" width="8" height="6" rx="1"/>',
  call: '<path d="M6.6 3.8l2.6-.8 1.8 4.2-1.9 1.4a11 11 0 0 0 6.3 6.3l1.4-1.9 4.2 1.8-.8 2.6a3 3 0 0 1-3.2 2A17 17 0 0 1 4.6 7a3 3 0 0 1 2-3.2z"/>',
  gear: '<path d="M8 3h6v11c3 0 6 1.5 6 4v2H5v-7a2 2 0 0 0 3 0V3z"/><path d="M5 17h15"/>',
  check: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  toss: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>',
  boil: '<path d="M4 12h16l-1.5 8h-13L4 12z"/><path d="M8 9c0-1.5 1.5-1.5 1.5-3M12 9c0-1.5 1.5-1.5 1.5-3M16 9c0-1.5 1.5-1.5 1.5-3"/>',
  move: '<path d="M3 15l2-6h10l4 6v3H3v-3z"/><circle cx="7" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/><path d="M14 4h6m-2.5-2.5L20 4l-2.5 2.5"/>',
  clear: '<path d="M14 3l-4 9"/><path d="M5 13h10l2 8H3l2-8z"/><path d="M8 17v4M12 17v4"/>',
};

export function actionIcon(kind) {
  const body = P[kind] || P.check;
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export function spriteIcon(spriteId, cls = '') {
  const sym = document.getElementById(`s-${spriteId}`);
  const vb = sym ? sym.getAttribute('viewBox') : '0 0 60 60';
  return `<svg class="${cls}" viewBox="${vb}" aria-hidden="true"><use href="#s-${spriteId}"/></svg>`;
}

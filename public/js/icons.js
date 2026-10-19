// A sprite from the page's SVG sheet, as a small icon (the choice sheet's head).
// The choice buttons drew an icon per kind of action until v1.9.2; they show
// ก ข ค / A B C now, so the icon no longer points at the right answer.

export function spriteIcon(spriteId, cls = '') {
  const sym = document.getElementById(`s-${spriteId}`);
  const vb = sym ? sym.getAttribute('viewBox') : '0 0 60 60';
  return `<svg class="${cls}" viewBox="${vb}" aria-hidden="true"><use href="#s-${spriteId}"/></svg>`;
}

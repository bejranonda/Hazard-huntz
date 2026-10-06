// Sparkles and floating "+100" text. Kept gentle: no flashing, and reduced
// to a short fade when the player prefers reduced motion.

import { prefersReducedMotion } from './util.js';

const STAR = 'M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z';

export function sparkle(layer, x, y, count = 7) {
  const reduce = prefersReducedMotion();
  const n = reduce ? 3 : count;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'fx-star';
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 28 + Math.random() * 26;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    el.style.setProperty('--s', (0.6 + Math.random() * 0.6).toFixed(2));
    el.innerHTML = `<svg viewBox="-10 -10 20 20" width="20" height="20" aria-hidden="true"><path d="${STAR}" fill="#FFC83D" stroke="#3E2A1E" stroke-width="1.4"/></svg>`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

export function floatText(layer, x, y, text, kind = 'ok') {
  const el = document.createElement('div');
  el.className = `fx-float fx-${kind}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// Soft confetti for the result screen (slow drift, no strobing).
export function confetti(layer, n = 26) {
  if (prefersReducedMotion()) return;
  const colors = ['#FFC83D', '#2E9BDB', '#FF7A59', '#79C24A', '#62B8B8'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'fx-confetti';
    el.style.left = `${Math.random() * 100}%`;
    el.style.background = colors[i % colors.length];
    el.style.animationDelay = `${Math.random() * 0.6}s`;
    el.style.animationDuration = `${2.2 + Math.random() * 1.4}s`;
    el.style.setProperty('--r', `${Math.random() * 360}deg`);
    layer.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
}

// Anonymous event counts (no IDs, no cookies, no personal data). Events are
// batched in memory and sent with sendBeacon when the page is hidden, so the
// game never waits on the network.

import { content } from './content.js';

const ALLOWED = new Set([
  'view', 'mode_select', 'round_start', 'round_end', 'share_open', 'share_click',
  'challenge_open', 'challenge_play', 'checklist_open', 'checklist_save',
  'help_click', 'forecast_click', 'lang', 'install',
]);
const queue = [];
let sampled = null;

function inSample() {
  if (sampled == null) {
    const rate = content()?.config?.analytics?.sampleRate ?? 1;
    sampled = Math.random() < rate;
  }
  return sampled;
}

// track('round_end', { mode: 'prepare', label: 'daily', value: 8 })
export function track(name, { mode = '', label = '', value = 0 } = {}) {
  if (!ALLOWED.has(name) || !inSample()) return;
  queue.push([name, String(mode).slice(0, 16), String(label).slice(0, 32), Number(value) || 0]);
  if (queue.length >= 20) flush();
}

export function flush() {
  if (!queue.length) return;
  const endpoint = content()?.config?.analytics?.endpoint;
  if (!endpoint) return;
  const body = JSON.stringify({ v: 1, e: queue.splice(0, queue.length) });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
    else fetch(endpoint, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
  } catch { /* analytics must never break the game */ }
}

export function initAnalytics() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  addEventListener('pagehide', flush);
}

// Personal progress kept only on this device (localStorage): best scores,
// daily streak and how-to flags. Nothing here leaves the phone.

import { store, bangkokDateKey, daysBetween } from './util.js';

export function seenHowto(mode) { return !!store.get(`howto-${mode}`, false); }
export function markHowto(mode) { store.set(`howto-${mode}`, true); }

export function bestScore(mode) {
  return store.get('best', {})[mode] ?? null;
}

export function streak() {
  const s = store.get('streak', null);
  if (!s) return 0;
  const gap = daysBetween(s.last, bangkokDateKey());
  return gap <= 1 ? s.count : 0;
}

// Save a finished round; returns { isBest, streak }.
export function recordResult(result, kind) {
  const best = store.get('best', {});
  const prev = best[result.mode];
  const isBest = prev == null || result.score10 > prev;
  if (isBest) {
    best[result.mode] = result.score10;
    store.set('best', best);
  }
  let count = streak();
  if (kind === 'daily') {
    const today = bangkokDateKey();
    const s = store.get('streak', null);
    if (!s || s.last !== today) {
      count = s && daysBetween(s.last, today) === 1 ? s.count + 1 : 1;
      store.set('streak', { last: today, count });
    }
  }
  const plays = store.get('plays', 0) + 1;
  store.set('plays', plays);
  return { isBest, streak: count, plays };
}

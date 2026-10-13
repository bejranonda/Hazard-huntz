// The "safety book": which lessons a player has got right at least once.
// Pure functions (unit-tested in Node); progress.js stores only item ids, on
// this device, like the best scores and the streak.

import { playableRooms } from './house.js';

// Every target a player can meet today, per mode (rooms that are drawn, items
// that are switched on). Rooms that aren't drawn yet don't count.
export function bookPool(content) {
  const rooms = new Set(playableRooms(content).map((r) => r.id));
  const pool = { prepare: [], return: [] };
  for (const it of content.items) {
    if (!it.disabled && rooms.has(it.room) && pool[it.mode]) pool[it.mode].push(it);
  }
  return pool;
}

// Item ids answered correctly in a finished round.
export function correctIds(targets, records) {
  const byPid = new Map(records.map((r) => [r.pid, r]));
  return targets.filter((p) => byPid.get(p.pid)?.status === 'correct').map((p) => p.ref.id);
}

// Merge new ids into the saved list; returns { ids, added }.
export function mergeLearned(prev, ids, valid = null) {
  const have = new Set((Array.isArray(prev) ? prev : []).filter((id) => typeof id === 'string'));
  const added = [];
  for (const id of ids) {
    if (have.has(id) || (valid && !valid.has(id))) continue;
    have.add(id);
    added.push(id);
  }
  return { ids: [...have], added };
}

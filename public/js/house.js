// Builds one playable house from the content JSON and a seed.
// Pure function (no DOM), so tools/ and tests/ can run it in Node.

import { makeRng } from './rng.js';

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

// Scene units (viewBox 360x600, scaled to fit the stage). On the shortest
// common stage (iPhone SE in Safari, ~375x450 px) 1 unit is ~0.73 px, so
// 64 units keeps every tap target at or above the 44 px minimum.
export const MIN_HIT = 64;

export function playableRooms(content) {
  return content.rooms.filter((r) => r.enabled && r.art).sort(byOrder);
}

// opts.include / opts.exclude (Sets of item ids) are used by version 2's
// combined run to carry Prepare outcomes into the Return house.
export function generateHouse(content, mode, houseKey, opts = {}) {
  const roundCfg = content.config.round;
  const rooms = playableRooms(content);
  const roomIds = new Set(rooms.map((r) => r.id));
  const rng = makeRng(`${mode}|${houseKey}|v${content.config.houseVersion ?? 1}`);

  const exclude = opts.exclude || new Set();
  const pool = content.items.filter((i) => i.mode === mode && roomIds.has(i.room) && !i.disabled && !exclude.has(i.id));
  const decoyPool = content.decoys.filter((d) => d.mode === mode && roomIds.has(d.room) && !d.disabled);

  const free = new Map(rooms.map((r) => [r.id, r.slots.map((s) => s.id)]));
  const slotById = new Map(rooms.flatMap((r) => r.slots.map((s) => [s.id, s])));

  const fits = (thing, slotId) => {
    const slot = slotById.get(slotId);
    return slot && thing.slots.some((tag) => slot.tags.includes(tag));
  };
  const freeSlotsFor = (thing) => (free.get(thing.room) || []).filter((sid) => fits(thing, sid));

  const wanted = Math.min(rng.int(roundCfg.targetsMin, roundCfg.targetsMax), pool.length);
  const cap = Math.ceil(wanted / Math.max(1, rooms.length)) + 1;
  const chosen = [];
  const assigned = new Map(); // item id -> slot id
  const usedGroups = new Set();
  const take = (item) => {
    if (chosen.length >= wanted || chosen.includes(item)) return false;
    if (item.group && usedGroups.has(item.group)) return false;
    if (chosen.filter((c) => c.room === item.room).length >= cap) return false;
    if (!freeSlotsFor(item).length) return false;
    const slotId = rng.pick(freeSlotsFor(item));
    free.set(item.room, free.get(item.room).filter((s) => s !== slotId));
    chosen.push(item);
    assigned.set(item.id, slotId);
    if (item.group) usedGroups.add(item.group);
    return true;
  };

  // Prepare mode always includes at least one critical item (documents,
  // medicines or the breaker) so the priority bonus is reachable.
  const critical = rng.shuffle(pool.filter((i) => i.critical));
  if (mode === 'prepare' && critical.length) take(critical[0]);
  for (const item of pool) if (opts.include?.has(item.id)) take(item);
  // Then at least one target per room, then fill up to the wanted count.
  for (const room of rng.shuffle(rooms)) {
    const inRoom = rng.shuffle(pool.filter((i) => i.room === room.id && !chosen.includes(i)));
    if (!chosen.some((c) => c.room === room.id)) inRoom.some(take);
  }
  for (const item of rng.shuffle(pool)) {
    if (chosen.length >= wanted) break;
    take(item);
  }

  const placements = [];
  const place = (thing, kind, slotId) => {
    const slot = slotById.get(slotId);
    const [w, h] = thing.size;
    // Slot (x, y) is the bottom-centre anchor of the sprite.
    const x = slot.x - w / 2;
    const y = slot.y - h;
    // Tap area: the sprite (or the item's own `hit` box), grown to at least
    // MIN_HIT units so it stays >= 44 CSS px on a 320 px wide phone.
    const [hx, hy, hw, hh] = thing.hit ? [x + thing.hit[0], y + thing.hit[1], thing.hit[2], thing.hit[3]] : [x, y, w, h];
    const gw = Math.max(hw, MIN_HIT), gh = Math.max(hh, MIN_HIT);
    placements.push({
      pid: `${kind[0]}-${thing.id}`,
      kind,
      ref: thing,
      room: thing.room,
      slot: slotId,
      x,
      y,
      w,
      h,
      cx: slot.x,
      cy: slot.y - h / 2,
      hit: { x: hx - (gw - hw) / 2, y: hy - (gh - hh) / 2, w: gw, h: gh },
      choices: kind === 'target' ? rng.shuffle(thing.choices.map((c, i) => ({ ...c, index: i }))) : null,
      wetChoices: kind === 'target' && thing.wet
        ? rng.shuffle(thing.wet.choices.map((c, i) => ({ ...c, index: i })))
        : null,
    });
  };
  for (const item of chosen) place(item, 'target', assigned.get(item.id));

  const wantDecoys = rng.int(roundCfg.decoysMin, roundCfg.decoysMax);
  let decoys = 0;
  for (const d of rng.shuffle(decoyPool)) {
    if (decoys >= wantDecoys) break;
    const slots = freeSlotsFor(d);
    if (!slots.length) continue;
    const slotId = rng.pick(slots);
    free.set(d.room, free.get(d.room).filter((s) => s !== slotId));
    place(d, 'decoy', slotId);
    decoys++;
  }

  const roomOrder = new Map(rooms.map((r, i) => [r.id, i]));
  const sortSpatial = (a, b) => roomOrder.get(a.room) - roomOrder.get(b.room) || a.cx - b.cx;
  placements.sort(sortSpatial);

  return {
    mode,
    houseKey,
    rooms: rooms.map((r) => ({ ...r, placements: placements.filter((p) => p.room === r.id) })),
    targets: placements.filter((p) => p.kind === 'target'),
    decoys: placements.filter((p) => p.kind === 'decoy'),
  };
}

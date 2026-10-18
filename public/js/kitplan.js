// "How ready is our house?": the list for one household, from content/kit.json.
// Pure (no DOM), so tests and tools can run it.

// answers: { people, flags: ['baby', 'elder', 'meds', 'pet'] }
export function kitPlan(kit, { people = kit.people.default, flags = [] } = {}) {
  const v = Math.round(Number(people));
  const n = Number.isFinite(v) ? Math.min(kit.people.max, Math.max(kit.people.min, v)) : kit.people.default;
  const on = new Set(flags);
  const items = kit.items
    .filter((it) => !it.for || on.has(it.for))
    .map((it) => {
      const q = it.qty || {};
      let kind = null;
      let total = null;
      if (q.perPersonPerDay) { kind = 'perPersonDay'; total = q.perPersonPerDay * n * (q.days || 1); }
      else if (q.perPerson) { kind = 'perPerson'; total = q.perPerson * n; }
      else if (q.days) kind = q.people ? 'daysPeople' : 'days';
      return { id: it.id, item: it, kind, total, per: q.perPersonPerDay ?? q.perPerson ?? null, days: q.days ?? null, people: n };
    });
  return { people: n, items };
}

export function kitScore(plan, have = []) {
  const got = plan.items.filter((x) => have.includes(x.id)).length;
  const total = plan.items.length;
  return { have: got, total, pct: total ? Math.round((100 * got) / total) : 0 };
}

// What the shared card lists as missing: what every home needs first, then
// the household's own items (which say more about who lives there).
export function kitMissing(plan, have = [], n = 3) {
  return plan.items
    .filter((x) => !have.includes(x.id))
    .sort((a, b) => (a.item.for ? 1 : 0) - (b.item.for ? 1 : 0))
    .slice(0, n);
}

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

// Power cut: how much longer what is in the fridge stays safe (content/kit.json
// → fridge). hours: since the power went off (fractions allowed); freezer:
// 'half' | 'full' (unknown → the first option, half: the shorter, safer time);
// med: medicine that must be kept cold is at home; milk: stored breast milk.
// status: 'ok', 'soon' (an hour or less left; display only), 'over', or the
// part's own overAs ('check' for medicine: never "throw it out", v1.11.0).
export function fridgePlan(cfg, { hours = 0, freezer = null, med = false, milk = false } = {}) {
  const h = Math.max(0, Number(hours) || 0);
  const fz = cfg.freezer.some((x) => x.id === freezer) ? freezer : cfg.freezer[0].id;
  const has = { med, milk };
  return cfg.parts
    .filter((p) => !p.if || has[p.if])
    .map((p) => {
      const limit = p.hours ?? p.hoursBy?.[fz] ?? (p.days != null ? p.days * 24 : 0);
      const left = limit - h;
      return { id: p.id, part: p, limit, left: Math.max(0, left), status: left <= 0 ? p.overAs || 'over' : left <= 1 ? 'soon' : 'ok' };
    });
}

// Food by food (v1.11.0, FoodSafety.gov's and USDA FSIS's charts): the fridge's
// time decides when, each food's row decides what. Before the fridge's time is
// up everything is still safe (door shut); after it, "discard" foods go and
// "keep" foods stay. In the freezer, once its time is up, each pack is checked:
// still has ice crystals → the food's crystals verdict, fully thawed → thawed.
export function fridgeFoods(cfg, plan) {
  const at = Object.fromEntries(plan.map((x) => [x.id, x]));
  return {
    over: at.fridge?.status === 'over',
    toss: cfg.foods.filter((f) => f.after === 'discard'),
    keep: cfg.foods.filter((f) => f.after === 'keep'),
    frozenOver: at.freezer?.status === 'over',
    frozen: cfg.frozen,
  };
}

// Daily medicine: how many days the pills left last, and how many more make
// the target (the home check's line, content/kit.json → items meds.qty.days).
// left, perDay: what the person types (tablets); null when either is unusable.
export function medDays({ left, perDay, target }) {
  const l = Number(left);
  const d = Number(perDay);
  if (!(Number.isFinite(l) && l >= 0 && Number.isFinite(d) && d > 0 && d <= 50)) return null;
  const days = Math.floor(l / d + 1e-9);
  const need = Math.max(0, Math.ceil(d * target - l - 1e-9));
  return { days, need, enough: need === 0 };
}

// Dust today: the PCD's level for a reading, and what everyone at home, the
// people at risk and people with a long-term illness should do (content/kit.json
// → air). unit: 'pm' (µg/m³, one decimal, rounded half up as the notice says) or
// 'aqi' (Thailand's); colour: a level id picked instead of a number.
export function airLevel(cfg, { unit = 'pm', value = null, colour = null } = {}) {
  if (colour) return cfg.levels.find((l) => l.id === colour) || null;
  const u = cfg.units.find((x) => x.id === unit);
  const raw = typeof value === 'string' ? value.trim().replace(',', '.') : value;
  if (!u || raw === '' || raw == null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > u.max) return null;
  const v = unit === 'pm' ? Math.round(n * 10 + 1e-9) / 10 : Math.round(n);
  return cfg.levels.find((l) => l[unit] == null || v <= l[unit]) || null;
}

// What to do at that level: the lines for everyone, then (always, since v1.11.0:
// the reader is often the one at risk) the extra lines for the people at risk
// and for people with a long-term illness, without repeating a line already
// given above. groups: who the household said is at home (named in the share text).
export function airAdvice(cfg, answers = {}, groups = []) {
  const level = airLevel(cfg, answers);
  if (!level) return null;
  const seen = new Set(level.all.map((x) => x.th));
  const fresh = (xs) => xs.filter((x) => !seen.has(x.th) && seen.add(x.th));
  const risk = fresh(level.risk);
  const chronic = fresh(level.chronic);
  return {
    level,
    all: level.all,
    risk,
    chronic,
    riskSame: level.risk.length > 0 && !risk.length,
    who: cfg.groups.filter((g) => groups.includes(g.id)),
    // Every level that says "wear a mask" also says who must not (v1.11.1: under 2s).
    baby: [...level.all, ...level.risk, ...level.chronic].some((x) => x.mask) ? cfg.baby || null : null,
  };
}

// "Do I need a mask, and which one?" (/mask, v1.12.0, content/kit.json → mask).
// One answer at a time: why (dust, clean, sick, chem, fire); for dust, today's
// colour (the dust today levels: a line with mask: true says who must wear one
// at that level) and who; for a clean-up, what. Returns { ask } while a
// question is still open, else the status, the lines, and whether the
// how-to-wear card applies. Never counts masks: no source gives a number.
export function maskAdvice(M, air, { why = null, colour = null, who = null, what = null } = {}) {
  const w = M.why.find((x) => x.id === why);
  if (!w) return { ask: 'why' };
  const st = (id) => ({ id, ...M.status[id] });
  if (why === 'dust') {
    const level = air.levels.find((l) => l.id === colour);
    if (!level) return { ask: 'colour' };
    const p = M.who.find((x) => x.id === who);
    if (!p) return { ask: 'who' };
    if (p.baby) return { why, level, who: p, status: st('baby'), lines: [air.baby], card: false };
    const maskIn = (xs) => xs.find((x) => x.mask);
    const line = maskIn(level.all) || (p.risk && maskIn(level.risk));
    if (!line) {
      // From which colour this person wears one, by the same lines.
      const i = air.levels.indexOf(level);
      const from = air.levels.slice(i + 1).find((l) => maskIn(l.all) || (p.risk && maskIn(l.risk)));
      return { why, level, who: p, status: st('none'), lines: from ? [{ ...M.dust.next, level: from }] : [], card: false };
    }
    const red = air.levels[air.levels.length - 1] === level;
    // Red also says "no outdoor activities" (its first line for everyone) before the mask.
    const lines = [...(red ? level.all.filter((x) => !x.mask).slice(0, 1) : []), line, M.dust.type[p.type], ...(p.doctor ? [M.dust.doctor] : []), ...M.dust.always];
    return { why, level, who: p, status: st(red ? 'stay' : 'wear'), lines, card: true };
  }
  if (why === 'clean') {
    const job = M.clean[what];
    if (!job || !M.what.some((x) => x.id === what)) return { ask: 'what' };
    return { why, what: M.what.find((x) => x.id === what), status: st(job.status), lines: [...job.lines, ...M.clean.always], card: true };
  }
  const b = M[why];
  const masked = b.status === 'n95' || b.status === 'surgical';
  return { why, status: st(b.status), lines: [...b.lines, ...(masked && air.baby ? [air.baby] : [])], card: masked, guide: b.guide || null };
}

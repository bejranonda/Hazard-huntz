// A run is what one tap on a mode button starts. In version 1 a run is a
// single round. Version 2 (behind config.features.comboRun) chains Prepare
// then Return in the same house: items saved in Prepare show up clean in
// Return, missed ones show up damaged, and the result is a before/after card
// ("เตรียมดี บ้านรอด 85%"). The data links live in items.json as `pair`.

export const PLANS = {
  prepare: ['prepare'],
  return: ['return'],
  combo: ['prepare', 'return'],
};

export class Run {
  constructor(planName, houseKey, kind) {
    this.planName = planName;
    this.plan = PLANS[planName] || PLANS.prepare;
    this.houseKey = houseKey;
    this.kind = kind; // 'daily' | 'challenge' | 'random'
    this.results = [];
  }

  get index() { return this.results.length; }
  get mode() { return this.plan[this.index]; }
  get done() { return this.index >= this.plan.length; }
  get isCombo() { return this.plan.length > 1; }

  record(result) { this.results.push(result); }

  // Options for generateHouse() in the next round of a combo run.
  nextHouseOptions(content) {
    if (!this.isCombo || this.index === 0) return {};
    const prev = this.results[this.index - 1];
    const byId = new Map(content.items.map((i) => [i.id, i]));
    const include = new Set();
    const exclude = new Set();
    for (const rec of prev.records) {
      const pair = byId.get(rec.id)?.pair;
      if (!pair) continue;
      if (rec.status === 'correct') exclude.add(pair); // saved: no hazard later
      else include.add(pair); // missed: the damaged version is guaranteed
    }
    return { include, exclude };
  }

  // Version 2 headline number: share of everything in both rounds that ended
  // up safe.
  survivalPercent() {
    const recs = this.results.flatMap((r) => r.records);
    if (!recs.length) return 0;
    return Math.round((100 * recs.filter((r) => r.status === 'correct').length) / recs.length);
  }
}

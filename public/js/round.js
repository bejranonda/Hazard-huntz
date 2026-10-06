// Rules for one 60-second round: clock, rising water, choices and score.
// No DOM here; the scene and UI subscribe through callbacks.

export const STATUS = {
  PENDING: 'pending',
  CORRECT: 'correct',   // right action on the first try
  LEARNED: 'learned',   // wrong choice, shown the safe action
  FLOODED: 'flooded',   // Prepare: water reached it first
  MISSED: 'missed',     // time ran out before it was found
};

// Water height in scene units (viewBox 0..600, smaller = higher) along the
// round, as [progress, y] keyframes. A target floods the moment the drawn
// waterline reaches the middle of its sprite, so the rule is exactly what the
// player sees: low things go under first.
export function waterY(u, keyframes) {
  if (u <= keyframes[0][0]) return keyframes[0][1];
  for (let i = 1; i < keyframes.length; i++) {
    const [u1, y1] = keyframes[i];
    const [u0, y0] = keyframes[i - 1];
    if (u <= u1) return y0 + ((u - u0) / (u1 - u0)) * (y1 - y0);
  }
  return keyframes[keyframes.length - 1][1];
}

export function rankTier(score10, thresholds = [5, 8]) {
  if (score10 >= thresholds[1]) return 2;
  if (score10 >= thresholds[0]) return 1;
  return 0;
}

export class Round {
  constructor({ house, config, clock = () => performance.now(), on = {} }) {
    this.house = house;
    this.mode = house.mode;
    this.cfg = config.round;
    this.modeCfg = this.cfg[this.mode];
    this.duration = this.modeCfg.seconds * 1000;
    this.clock = clock;
    this.on = on;
    this.elapsed = 0;
    this.running = false;
    this.ended = false;
    this.last = 0;
    this.points = 0;
    this.bonusHits = 0;
    this.wasWet = false;
    this.log = [];
    this.records = new Map(
      house.targets.map((p) => [p.pid, { pid: p.pid, id: p.ref.id, status: STATUS.PENDING, at: null, variant: 'normal', choice: null }]),
    );
  }

  get progress() { return Math.min(1, this.elapsed / this.duration); }
  get remaining() { return Math.max(0, (this.duration - this.elapsed) / 1000); }
  get floorWet() { return this.mode === 'prepare' && this.waterLevel <= this.modeCfg.floorWetY; }
  get waterLevel() { return this.mode === 'prepare' ? waterY(this.progress, this.modeCfg.water) : null; }

  start() {
    this.running = true;
    this.last = this.clock();
  }

  pause() {
    if (!this.running) return;
    this.tick();
    this.running = false;
  }

  resume() {
    if (this.running || this.ended) return;
    this.running = true;
    this.last = this.clock();
  }

  addTime(ms) {
    this.elapsed = Math.min(this.duration, this.elapsed + ms);
  }

  // Advance the clock; returns true while the round is still going.
  tick() {
    if (this.ended) return false;
    const now = this.clock();
    if (this.running) {
      this.elapsed += now - this.last;
      this.last = now;
    }
    this.checkWater();
    if (this.elapsed >= this.duration) {
      this.finish('time');
      return false;
    }
    return true;
  }

  checkWater() {
    if (this.mode !== 'prepare') return;
    const level = this.waterLevel;
    if (!this.wasWet && this.floorWet) {
      this.wasWet = true;
      this.on.wet?.();
    }
    for (const p of this.house.targets) {
      const rec = this.records.get(p.pid);
      if (rec.status === STATUS.PENDING && level <= p.cy) {
        rec.status = STATUS.FLOODED;
        rec.at = this.elapsed;
        this.on.flood?.(p);
      }
    }
    this.checkAllResolved();
  }

  // The "wet" variant (e.g. the breaker once water is on the floor) swaps in
  // a different correct answer.
  variantFor(p) {
    return p.ref.wet && this.floorWet ? 'wet' : 'normal';
  }

  choicesFor(p) {
    return this.variantFor(p) === 'wet' ? p.wetChoices : p.choices;
  }

  choose(p, choice) {
    const rec = this.records.get(p.pid);
    if (!rec || rec.status !== STATUS.PENDING) return null;
    const variant = this.variantFor(p);
    const correct = !!choice.correct;
    let bonus = 0;
    rec.variant = variant;
    rec.choice = choice.index;
    rec.at = this.elapsed;
    if (correct) {
      rec.status = STATUS.CORRECT;
      this.points += this.cfg.pointsCorrect;
      // Priority bonus: critical items handled before water gets into the house.
      if (this.mode === 'prepare' && p.ref.critical && !this.floorWet) {
        bonus = this.cfg.pointsBonus;
        this.points += bonus;
        this.bonusHits++;
        rec.bonus = true;
      }
    } else {
      rec.status = STATUS.LEARNED;
      this.addTime(this.cfg.wrongPenaltySec * 1000);
    }
    this.log.push({ pid: p.pid, correct, at: rec.at });
    return { correct, bonus, variant, penalty: correct ? 0 : this.cfg.wrongPenaltySec };
  }

  tapDecoy() {
    this.addTime(this.cfg.decoyPenaltySec * 1000);
    return { penalty: this.cfg.decoyPenaltySec };
  }

  checkAllResolved() {
    if (this.ended) return;
    const pending = [...this.records.values()].some((r) => r.status === STATUS.PENDING);
    if (!pending) this.finish('done');
  }

  finish(reason) {
    if (this.ended) return;
    this.ended = true;
    this.running = false;
    for (const rec of this.records.values()) {
      if (rec.status === STATUS.PENDING) rec.status = STATUS.MISSED;
    }
    this.endReason = reason;
    this.on.end?.(this.result());
  }

  maxPoints() {
    const n = this.house.targets.length;
    const crit = this.mode === 'prepare' ? this.house.targets.filter((p) => p.ref.critical).length : 0;
    return n * this.cfg.pointsCorrect + crit * this.cfg.pointsBonus;
  }

  result() {
    const recs = [...this.records.values()];
    const max = this.maxPoints();
    const score10 = max ? Math.round((10 * this.points) / max) : 0;
    return {
      mode: this.mode,
      houseKey: this.house.houseKey,
      score10,
      tier: rankTier(score10, this.cfg.rankThresholds),
      correct: recs.filter((r) => r.status === STATUS.CORRECT).length,
      total: recs.length,
      bonusHits: this.bonusHits,
      criticalTotal: this.house.targets.filter((p) => p.ref.critical).length,
      points: this.points,
      maxPoints: max,
      timeLeft: Math.round(this.remaining),
      reason: this.endReason,
      records: recs,
    };
  }
}

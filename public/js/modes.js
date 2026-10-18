// The mode registry: one entry per playable mode. config.json → modes is the
// editable copy (seasons, order); the defaults below keep pure modules (share
// links, routes) working in Node tests before any content is loaded.
//
//   id       mode id used everywhere (items.json "mode", strings "<base><Mode>")
//   hazard   flood | dust | fire | outage  (groups modes; one page per hazard)
//   code     one letter for challenge links /c/<code><score>; never reuse one
//   threat   water (rises from the floor) | smoke (falls from the ceiling) |
//            haze (thickens over the room) | dark (the room darkens through a
//            power cut; items with lostAfter go bad after that many hours) | null
//   prop     what the gecko wears or holds
//   months   Bangkok months (1–12) when the mode is recommended
//   bonus    the "critical items before the floor is wet" bonus (flood only)
//   emoji    used in share texts; icon (optional) replaces it on the start button
//   topic    the safety-book topic the start screen features in this mode's season
//   link     "check before you go" link (flood modes use config.forecastAppUrl)

const DEFAULTS = [
  { id: 'prepare', hazard: 'flood', code: 'p', threat: 'water', prop: 'hood', emoji: '🏠', months: [5, 6, 7, 8, 9, 10, 11], bonus: true },
  { id: 'return', hazard: 'flood', code: 'r', threat: null, prop: 'torch', emoji: '⚡', icon: '🧹', months: [] },
  { id: 'dust', hazard: 'dust', code: 'd', threat: 'haze', prop: 'mask', emoji: '😷', months: [12, 1, 2, 3], topic: 'air', link: 'https://air4thai.pcd.go.th/webV3/' },
  { id: 'fire', hazard: 'fire', code: 'f', threat: 'smoke', prop: 'firehat', emoji: '🔥', months: [4], topic: 'fire' },
  { id: 'stock', hazard: 'outage', code: 's', threat: 'dark', prop: 'torch', emoji: '🔦', months: [], topic: 'food' },
];

let MODES = DEFAULTS;

export function setModes(list) {
  if (Array.isArray(list) && list.length) MODES = list;
}

export const modeList = () => MODES;
export const modeIds = () => MODES.map((m) => m.id);
export const modeOf = (id) => MODES.find((m) => m.id === id) || null;
export const codeOf = (id) => modeOf(id)?.code ?? null;
export const idOfCode = (code) => MODES.find((m) => m.code === code)?.id ?? null;

// "prepare" -> "Prepare": strings use <base><Mode> keys (modePrepare, rankDust …).
export const cap = (id) => id.charAt(0).toUpperCase() + id.slice(1);
export const mk = (base, id) => `${base}${cap(id)}`;

// Regex sources built from the registry, shared by routes and links.
export const codesRe = () => `[${MODES.map((m) => m.code).join('')}]`;
export const idsRe = () => MODES.map((m) => m.id).join('|');

// The recommended mode: a rain warning means flood preparation; otherwise the
// first non-flood mode in season (Bangkok month); otherwise after-the-flood.
export function seasonalMode(month, rainWarning) {
  if (rainWarning && modeOf('prepare')) return 'prepare';
  const inSeason = MODES.find((m) => m.hazard !== 'flood' && (m.months || []).includes(month));
  return inSeason ? inSeason.id : (modeOf('return') ? 'return' : MODES[0].id);
}

// A hand-set switch (rainWarningActive, featuredTopic) with an optional end
// date: on while dayKey (YYYYMMDD, Bangkok) is on or before until ("YYYY-MM-DD",
// inclusive). A switch nobody turns off ends by itself.
export function switchOn(value, until, dayKey) {
  if (!value) return false;
  if (!until) return true;
  return dayKey <= String(until).replace(/-/g, '');
}

// The owner's alert (config.json → alert: { guide, until }): when something is
// in the news (a quake, a storm, a heatwave), its "what to do" guide goes to
// the top of the start screen until the end date. Off without an end date: a
// hand-set switch always ends by itself.
export function activeAlert(config, dayKey) {
  const a = config?.alert;
  if (!a?.guide || !a.until) return null;
  return switchOn(a.guide, a.until, dayKey) ? a.guide : null;
}

// The "check before you go" link: the mode's own link (dust → Air4Thai), else
// the flood forecast app for flood modes, else none.
export function modeLink(config, id) {
  const m = MODES.find((x) => x.id === id);
  if (!m) return config.forecastAppUrl || '';
  return m.link ?? (m.hazard === 'flood' ? config.forecastAppUrl || '' : '');
}

// What the start screen recommends on a Bangkok day:
//   want  a mode id from a ?mode= link (ignored unless it is in the registry)
//   live  the forecast app's rain warning, when it answered (true/false)
// Returns { mode, topic, why } with why = link | live | warning | season.
export function recommend(config, dayKey, { want = null, live = null } = {}) {
  const linked = want ? MODES.find((m) => m.id === String(want).toLowerCase()) : null;
  const warning = typeof live === 'boolean' ? live : switchOn(config.rainWarningActive, config.rainWarningUntil, dayKey);
  const mode = linked ? linked.id : seasonalMode(Number(String(dayKey).slice(4, 6)), warning);
  const news = switchOn(config.featuredTopic, config.featuredTopicUntil, dayKey) ? config.featuredTopic : null;
  const own = MODES.find((m) => m.id === mode)?.topic || null;
  const topic = linked ? own || news : news || own;
  let why = 'season';
  if (linked) why = 'link';
  else if (mode === 'prepare' && warning) why = typeof live === 'boolean' ? 'live' : 'warning';
  return { mode, topic, why };
}

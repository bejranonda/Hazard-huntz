// The mode registry: one entry per playable mode. config.json → modes is the
// editable copy (seasons, order); the defaults below keep pure modules (share
// links, routes) working in Node tests before any content is loaded.
//
//   id       mode id used everywhere (items.json "mode", strings "<base><Mode>")
//   hazard   flood | dust | fire  (groups modes on the start screen)
//   code     one letter for challenge links /c/<code><score>; never reuse one
//   threat   water (rises from the floor) | smoke (falls from the ceiling) |
//            haze (thickens over the room) | null
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

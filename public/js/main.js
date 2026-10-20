// บ้านรอดไหม? — boot, screens and the game loop.

import { $, $$, esc, observeKeptWords, store, bangkokDateKey, formatHouseDate, inAppBrowser, wait } from './util.js';
import { randomHouseKey, isValidHouseKey } from './rng.js';
import {
  loadContent, content, t, L, setLang, getLang, pickLine, pickLineFor, rankTitle, sourceList,
  siteUrl, forecastUrl, applyStaticStrings, langPath, tm, agencyName,
} from './content.js';
import { modeList, modeIds, modeOf, mk, cap, recommend, activeAlert } from './modes.js';
import { APP_VERSION } from './version.js';
import { generateHouse, playableRooms } from './house.js';
import { Round, STATUS } from './round.js';
import { Run } from './run.js';
import { Scene, prefetchHouse, loadSprites } from './scene.js';
import { Gecko } from './mascot.js';
import { unlockAudio, play, haptic, isMuted, setMuted } from './audio.js';
import { sparkle, floatText, confetti } from './fx.js';
import { showScreen, openSheet, closeSheet, sheetOpen, toast, say, hideBubble, setLoading, canPrint, printList, setScreenBack } from './ui.js';
import { spriteIcon } from './icons.js';
import { loadCardAssets, drawResultCard, drawChecklist, canvasToBlob, plainText } from './cards.js';
import {
  challengeUrl, parseChallenge, nativeShare, canNativeShare, copyText, shareChannel,
  canDownload, downloadBlob, lineExternalUrl, imageSrc,
} from './share.js';
import { track, initAnalytics, flush } from './analytics.js';
import { seenHowto, markHowto, bestScore, streak, recordResult, learnedIds, addLearned } from './progress.js';
import { bookPool, correctIds, topicProgress, completedTopics } from './collection.js';

const app = $('#app');
const state = {
  run: null,
  round: null,
  scene: null,
  house: null,
  raf: 0,
  challenge: null,
  decoysTapped: new Set(),
  lowWarned: false,
  combo: 0,
  target: null,
  lastTick: 0,
  lastFloodLine: 0,
  cardAssets: null,
  result: null,
  share: null,
  updateReady: false,
  start: null, // { mode, topic, why } from pickStart()
};
let heroGecko = null;
let gameGecko = null;
let hintTimer = null;

function resetHintTimer() {
  clearTimeout(hintTimer);
  $('#stage')?.classList.remove('show-hints');
  if (state.round && state.round.running && !sheetOpen()) {
    hintTimer = setTimeout(() => {
      $('#stage')?.classList.add('show-hints');
    }, 3500);
  }
}

function clearHintTimer() {
  clearTimeout(hintTimer);
  $('#stage')?.classList.remove('show-hints');
}

// ------------------------------------------------------------------ boot

async function boot() {
  initAnalytics();
  try {
    await loadContent();
  } catch (e) {
    console.error(e);
    $('#hero-bubble').textContent = 'โหลดเกมไม่สำเร็จ ลองรีเฟรชอีกครั้งนะ';
    return;
  }
  const C = content();
  if (C.config.version && C.config.version !== APP_VERSION && await refreshStaleApp(C.config.version)) return;
  for (const x of C.config.tools || []) TOOLS[x.id] = x.icon;
  applyStaticStrings();
  observeKeptWords();
  heroGecko = new Gecko($('#hero-gecko'), { title: 'น้องจก' });

  syncLangPath();
  state.challenge = parseChallenge();
  if (state.challenge && !isValidHouseKey(state.challenge.houseKey)) state.challenge.houseKey = bangkokDateKey();

  state.start = await pickStart(C);
  renderModes();
  renderStart();
  bindGlobal();

  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
  idle(() => prefetchHouse(playableRooms(C)));

  // Deep links: /checklist/prepare, ?open=help, etc.
  const open = new URLSearchParams(location.search).get('open') || '';
  const ids = guideIds().join('|');
  const cl = new RegExp(`^(?:/en)?/checklist/(${ids})/?$`).exec(location.pathname);
  // Offline, the service worker answers a page it never saved (/quake, /kit)
  // with this app: open what that page is about instead of the start screen.
  const page = /^(?:\/en)?\/([a-z][a-z0-9-]*)\/?$/.exec(location.pathname)?.[1];
  const hazard = page && Object.keys(C.config.hazards || {}).find((h) => C.config.hazards[h].slug === page);
  const pageGuide = hazard && guideList().find((g) => g.hazard === hazard)?.id;
  if (cl) openChecklist(cl[1], 'link');
  else if (pageGuide) openChecklist(pageGuide, 'link');
  else if (TOOLS[page] || page === 'tools') openTool(page, 'link');
  else if (new RegExp(`^checklist-(${ids})$`).test(open)) openChecklist(open.split('-')[1], 'link');
  else if (open === 'guide') openGuides('link');
  else if (open === 'help') openHelp();
  else if (open === 'about') openAbout();
  else if (TOOLS[open] || open === 'tools') openTool(open, 'link');

  const via = state.challenge ? 'challenge' : cl ? 'checklist' : state.start.why === 'link' ? 'link' : 'direct';
  track('view', { mode: via === 'link' ? state.start.mode : '', label: via });
  if (state.challenge) track('challenge_open', { mode: state.challenge.mode, value: state.challenge.score });
  registerServiceWorker();
}

// What the start screen recommends (modes.js → recommend): a ?mode= link
// (ignored on a friend's challenge), else a rain warning means flood
// preparation, else the mode in season this Bangkok month. The warning is the
// forecast app's answer (config.forecastStatusUrl → { "rainWarning": true })
// when it gives one, else the manual switch until its end date.
async function pickStart(C) {
  const want = state.challenge ? null : new URLSearchParams(location.search).get('mode');
  let live = null;
  const url = C.config.forecastStatusUrl;
  if (url && !want) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (typeof data.rainWarning === 'boolean') live = data.rainWarning;
    } catch { /* keep the manual switch */ }
  }
  return recommend(C.config, bangkokDateKey(), { want, live });
}

// The brand name in the current language ("บ้านรอดไหม?" / "Baan Rod Mai?").
const brandName = () => `${t('logoA')}${t('logoB')}`.trim();

function bookCounts() {
  const C = content();
  const pool = bookPool(C);
  const all = Object.values(pool).flat();
  const have = new Set(learnedIds());
  const topics = topicProgress(pool, have, C.config.topics || []);
  return { pool, total: all.length, n: all.filter((it) => have.has(it.id)).length, have, topics };
}

// "🦠 Health after floods" -> "🦠" (topic names start with their emoji).
const topicEmoji = (id) => t(`topic_${id}`).split(' ')[0];
const learnUrl = (hash = '') => `${getLang() === 'en' ? '/en' : ''}/learn${hash}`;

// One button per mode in the registry (config.json → modes). The season's
// mode is the big card; the rest are compact cards in a row below it.
function renderModes() {
  const list = modeList();
  const box = $('#modes');
  box.style.setProperty('--cols', Math.min(4, Math.max(1, list.length - 1)));
  box.innerHTML = list.map((m) => `
      <button class="mode-btn mode-${esc(m.id)}" type="button" data-mode="${esc(m.id)}">
        <span class="mode-icon" aria-hidden="true">${esc(m.icon || m.emoji || '')}</span>
        <span class="mode-text">
          <span class="mode-name" data-i18n="${esc(mk('mode', m.id))}">${esc(t(mk('mode', m.id)))}</span>
          <span class="mode-desc" data-i18n="${esc(`mode${cap(m.id)}Desc`)}">${esc(t(`mode${cap(m.id)}Desc`))}</span>
        </span>
        <span class="mode-badge" data-i18n="recommended" hidden>${esc(t('recommended'))}</span>
      </button>`).join('');
}

function renderStart() {
  const defaultMode = state.start.mode;
  state.defaultMode = defaultMode;
  for (const btn of $$('.mode-btn')) {
    const isDefault = btn.dataset.mode === defaultMode;
    btn.classList.toggle('is-default', isDefault);
    btn.querySelector('.mode-badge').hidden = !isDefault;
  }
  $('#hero-bubble').textContent = t(mk('hero', defaultMode));
  heroGecko?.setProp(modeOf(defaultMode)?.prop || 'none');

  const today = bangkokDateKey();
  const parts = [`<b>${esc(t('daily', { date: formatHouseDate(today, getLang()) }))}</b>`];
  const s = streak();
  if (s >= 2) parts.push(esc(t('streak', { n: s })));
  const bests = modeIds().map((id) => bestScore(id)).filter((b) => b != null);
  if (bests.length) parts.push(esc(t('best', { score: Math.max(...bests) })));
  $('#daily-line').innerHTML = parts.join(' · ');

  const book = bookCounts();
  // A topic in the news (config.featuredTopic, until featuredTopicUntil): read
  // every answer now, or collect it in the safety book by playing. Without one,
  // or after a ?mode= link, the mode brings its own topic (dust → air, fire → fire).
  const feat = state.start.topic;
  const ft = feat && book.topics.find((tp) => tp.id === feat);
  const featEl = $('#featured');
  if (ft) {
    const allInTopic = content().items.filter((it) => it.topic === feat && !it.disabled).length;
    featEl.innerHTML = `
      <p class="featured-label">${esc(t('featuredLabel'))}</p>
      <p class="featured-topic">${esc(t(`topic_${feat}`))}</p>
      <div class="featured-actions">
        <a class="btn small" id="featured-read" href="${esc(learnUrl(`#t-${feat}`))}">${esc(t('featuredRead', { total: allInTopic }))}</a>
        <button class="btn secondary small" type="button" id="featured-book">${esc(t('featuredBook', { n: ft.n, total: ft.total }))}</button>
      </div>`;
    featEl.hidden = false;
    $('#featured-book').addEventListener('click', () => openBook(feat));
    $('#featured-read').addEventListener('click', () => track('learn_open', { label: feat }));
  } else featEl.hidden = true;
  const bookBtn = $('#btn-book');
  bookBtn.textContent = t('bookChip', { n: book.n, total: book.total });
  bookBtn.hidden = false;

  const fUrl = forecastUrl(defaultMode);
  const fl = $('#forecast-link-start');
  if (fUrl) {
    fl.href = fUrl;
    fl.firstElementChild.textContent = tm('forecastIcon', defaultMode);
    fl.lastElementChild.textContent = tm('forecastShort', defaultMode);
  }
  fl.hidden = !fUrl;

  // The home check: "บ้านเราพร้อม 70%" once this household has checked (stored on the device).
  const kitSaved = store.get('kit', null);
  const kitChip = $('#kit-chip');
  if (kitChip) kitChip.textContent = kitSaved?.pct != null ? t('hubKitScore', { pct: kitSaved.pct }) : t('hubKitSub');
  renderHub(defaultMode);

  // The owner's alert (config.alert, until its end date): that guide, first; it says until when.
  const alertUntil = (cfg) => new Date(`${cfg.alert.until}T12:00:00+07:00`).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'th-TH', { day: 'numeric', month: 'short', timeZone: 'Asia/Bangkok' });
  const alertId = activeAlert(content().config, today);
  const alertEl = $('#alert-card');
  if (alertId && content().checklists[alertId] && !state.challenge) {
    alertEl.innerHTML = `<button class="alert-btn" type="button" id="alert-open"><span aria-hidden="true">${esc(guideOf(alertId)?.icon || '📢')}</span><span>${esc(t('alertCard', { name: t(mk('guide', alertId)), until: alertUntil(content().config) }))}</span><span aria-hidden="true">›</span></button>`;
    alertEl.hidden = false;
    $('#alert-open').addEventListener('click', () => openChecklist(alertId, 'alert'));
  } else alertEl.hidden = true;

  const vEl = $('#app-version');
  if (vEl && content()?.config?.version) {
    vEl.textContent = `v${content().config.version}`;
  }

  const banner = $('#challenge-banner');
  // A friend's challenge is why they came: it moves up and the season's
  // gecko line (which may be about another hazard) steps aside.
  $('#screen-start').classList.toggle('has-challenge', !!state.challenge);
  if (state.challenge) {
    const c = state.challenge;
    const lead = t(mk('challenge', c.mode));
    banner.innerHTML = `
      <h2>${esc(t('challengeTitle'))}</h2>
      <p>${esc(lead)}</p>
      <div class="big">${c.score}/10</div>
      <p>${esc(t('challengeBody', { date: houseLabel(c.houseKey) }))}</p>
      <button class="btn" type="button" id="btn-accept">${esc(t('challengeAccept'))}</button>`;
    banner.hidden = false;
    $('#btn-accept').addEventListener('click', () => {
      track('challenge_play', { mode: c.mode, value: c.score });
      startFlow(c.mode, { houseKey: c.houseKey, kind: 'challenge' });
    });
  } else banner.hidden = true;
}

// The start screen's tool tiles (v1.12.0): two that follow the season
// (config.json → hub.season, by the recommended mode); a power cut being
// counted keeps the fridge in the first, with how long it has been off.
function renderHub(defaultMode = state.start.mode) {
  // "ไฟดับมา 3 ชม.แล้ว" while a power cut is being counted (up to 3 days);
  // after "the power's back", it says so for a day: there is still food to sort out.
  const cut = store.get('fridge', null);
  const offH = cut?.start ? Math.floor((Date.now() - cut.start) / 3600e3) : -1;
  const back = cut?.end && Date.now() - cut.end < 24 * 3600e3;
  const counting = back || (offH >= 0 && offH <= 72 && !cut?.end);
  const season = (content().config.hub?.season?.[defaultMode] || ['fridge', 'air']).filter((x) => TOOLS[x]);
  const slots = [...new Set([...(counting ? ['fridge'] : []), ...season])].slice(0, 2);
  slots.forEach((id, i) => {
    const b = $(`.hub-btn[data-slot="${i + 1}"]`);
    if (!b) return;
    const cap = `${id[0].toUpperCase()}${id.slice(1)}`;
    b.dataset.open = id;
    b.querySelector('.hub-ico').textContent = TOOLS[id];
    const name = b.querySelector('.hub-text b');
    name.dataset.i18n = `hub${cap}`;
    name.textContent = t(`hub${cap}`);
    const sub = b.querySelector('.hub-text small');
    sub.dataset.i18n = `hub${cap}Sub`;
    sub.id = id === 'fridge' ? 'fridge-chip' : '';
    sub.textContent = t(`hub${cap}Sub`);
  });
  const fridgeChip = $('#fridge-chip');
  if (fridgeChip) fridgeChip.textContent = back ? t('hubFridgeBack') : offH < 0 || offH > 72 || cut?.end ? t('hubFridgeSub') : offH ? t('hubFridgeRunning', { h: offH }) : t('hubFridgeJust');
}

function houseLabel(key) {
  return /^\d{8}$/.test(key) ? formatHouseDate(key, getLang()) : t('cardRandomHouse');
}

function bindGlobal() {
  // Audio may only start after a real tap.
  const unlock = () => unlockAudio();
  addEventListener('pointerdown', unlock, { passive: true });
  addEventListener('keydown', unlock);

  $('#modes').addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;
    const pick = btn.dataset.mode !== state.defaultMode ? 'other' : state.start.why === 'link' ? 'link' : 'default';
    track('mode_select', { mode: btn.dataset.mode, label: pick });
    startFlow(btn.dataset.mode, { kind: 'daily' });
  });
  // A tool asks for a guide (the dust tool's "10 ways"); kit.js can't open one itself.
  document.addEventListener('brm:guide', (e) => openChecklist(e.detail, 'tool'));
  document.addEventListener('brm:guides', () => openGuides('tool'));
  // A tool changed what a tile should say (the fridge started or stopped counting).
  document.addEventListener('brm:hub', () => renderHub());
  for (const b of $$('[data-open]')) {
    b.addEventListener('click', () => {
      const what = b.dataset.open;
      if (what === 'guide' || what === 'checklist') openGuides('start');
      else if (what === 'help') openHelp();
      else if (what === 'about') openAbout();
      else if (TOOLS[what] || what === 'tools') openTool(what, 'start');
    });
  }
  $('#forecast-link-start').addEventListener('click', () => track('forecast_click', { label: 'start' }));

  $('#btn-lang').textContent = t('langSwitch');
  $('#btn-lang').addEventListener('click', () => {
    setLang(getLang() === 'th' ? 'en' : 'th', true);
    syncLangPath();
    track('lang', { label: getLang() });
    $('#btn-lang').textContent = t('langSwitch');
    applyStaticStrings();
    renderStart();
  });

  // Larger text (v1.11.0, for older readers): the start screen and every sheet at 115 %,
  // not the game's room, whose tap areas are measured. Kept on this device only.
  const bigBtn = $('#btn-big');
  const paintBig = () => {
    const on = !!store.get('big', false);
    document.documentElement.classList.toggle('big', on);
    bigBtn?.setAttribute('aria-pressed', String(on));
  };
  paintBig();
  bigBtn?.addEventListener('click', () => {
    store.set('big', !store.get('big', false));
    paintBig();
    track('big_text', { label: store.get('big', false) ? 'on' : 'off' });
  });

  const soundBtn = $('#btn-sound');
  const paintSound = () => {
    soundBtn.textContent = isMuted() ? '🔇' : '🔊';
    soundBtn.setAttribute('aria-pressed', String(!isMuted()));
  };
  paintSound();
  soundBtn.addEventListener('click', () => {
    setMuted(!isMuted());
    paintSound();
    if (!isMuted()) { unlockAudio(); play('tap'); }
  });
  $('#btn-book').addEventListener('click', () => openBook());

  $('#btn-pause').addEventListener('click', () => pauseGame(true));
  // The phone's back button in a round pauses it (the pause sheet offers to
  // quit); on the result it goes back to the start screen. It never leaves the site.
  setScreenBack(() => {
    const r = state.round;
    if (r && !r.ended && $('#screen-game').classList.contains('active')) pauseGame(true);
    else goHome();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
      if (state.round && state.round.running) pauseGame(true);
    }
  });
}

// ------------------------------------------------------------------ round

function startFlow(mode, { houseKey, kind = 'daily' } = {}) {
  unlockAudio();
  const key = houseKey || (kind === 'random' ? randomHouseKey() : bangkokDateKey());
  state.run = new Run(mode, key, kind);
  if (!seenHowto(mode)) showHowto(mode, () => startRound());
  else startRound();
}

function showHowto(mode, onStart) {
  const steps = t(mk('howto', mode));
  openSheet(`
    <h2 id="sheet-title">${esc(t(mk('howtoTitle', mode)))}</h2>
    <ol class="howto">${steps.map((s, i) => `<li><span class="n">${i + 1}</span><span>${esc(s.replace('{d}', content().config.round.decoyPenaltySec))}</span></li>`).join('')}</ol>
    <p class="sub">👉 ${esc(t('howtoSwipe'))}</p>
    <button class="btn" type="button" id="howto-go" autofocus>${esc(t('startBtn'))}</button>`, { dismissible: false });
  $('#howto-go').addEventListener('click', () => {
    markHowto(mode);
    closeSheet();
    onStart();
  });
}

async function startRound() {
  const C = content();
  const run = state.run;
  const mode = run.mode;
  const house = generateHouse(C, mode, run.houseKey, run.nextHouseOptions(C));
  state.house = house;
  state.decoysTapped = new Set();
  state.lowWarned = false;
  state.combo = 0;
  state.lastTick = 0;
  state.result = null;

  app.classList.remove(...modeIds().map((id) => `is-${id}`));
  app.classList.add(`is-${mode}`);
  const loadingTimer = setTimeout(() => setLoading(true), 180);
  showScreen('game');

  state.scene?.destroy();
  state.scene = new Scene({
    roomsEl: $('#rooms'),
    tabsEl: $('#room-tabs'),
    prevBtn: $('#nav-prev'),
    nextBtn: $('#nav-next'),
    onTap: onItemTap,
    onRoomChange: () => resetHintTimer(),
  });
  try {
    await state.scene.mount(house);
  } finally {
    clearTimeout(loadingTimer);
    setLoading(false);
  }
  gameGecko = new Gecko($('#game-gecko'), { prop: modeOf(mode)?.prop || 'none' });

  const round = new Round({
    house,
    config: C.config,
    on: { flood: onFlood, wet: onWet, end: onRoundEnd },
  });
  state.round = round;
  updateHud();
  state.scene.updateCounts(round.records, tm('lostMark', mode));
  state.scene.setThreat(threatLevel(round));
  $('#gauge').classList.remove('low');
  state.target = run.kind === 'challenge' && state.challenge ? state.challenge.score : null;
  updateHud();
  say(pickLine(mk('geckoStart', mode)), 3200);
  round.start();
  resetHintTimer();
  track('round_start', { mode, label: run.kind });
  loop();
}

const pickOne = (v) => (Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v);

// "Play another": the other flood mode, or the next mode in the registry.
function nextMode(mode) {
  const ids = modeIds();
  const def = modeOf(mode);
  const sibling = def && modeList().find((m) => m.id !== mode && m.hazard === def.hazard);
  if (sibling) return sibling.id;
  return ids[(ids.indexOf(mode) + 1) % ids.length];
}

// What the scene draws for the mode's threat (water y, smoke y, haze 0..1).
function threatLevel(r) {
  return r.waterLevel ?? r.smokeLevel ?? r.hazeLevel ?? r.darkLevel;
}

function loop() {
  cancelAnimationFrame(state.raf);
  const step = () => {
    const r = state.round;
    if (!r || r.ended) return;
    if (r.running) {
      r.tick();
      updateHud();
      state.scene.setThreat(threatLevel(r));
      if (!state.lowWarned && r.remaining <= 10 && !r.ended) {
        state.lowWarned = true;
        $('#gauge').classList.add('low');
        say(t('geckoTimeLow'), 2200);
      }
      const sec = Math.ceil(r.remaining);
      if (sec <= 5 && sec > 0 && sec !== state.lastTick) {
        state.lastTick = sec;
        play('tick');
      }
    }
    if (!r.ended) state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}

function updateHud() {
  const r = state.round;
  if (!r) return;
  const left = 1 - r.progress;
  $('#gauge-fill').style.transform = `scaleX(${left.toFixed(4)})`;
  // Haze modes: the gauge colour walks through the Air4Thai scale as dust builds up.
  if (r.threat === 'haze') $('#gauge').dataset.aqi = String(Math.min(4, Math.floor(r.progress * 5)));
  else delete $('#gauge').dataset.aqi;
  // In a challenge, the friend's score to beat sits next to the clock.
  // Power cut: the hours without power come first, then the seconds left.
  const secs = r.threat === 'dark'
    ? `${t('darkHours', { h: Math.floor(r.hoursOut) })} · ${t('seconds', { s: Math.ceil(r.remaining) })}`
    : t('seconds', { s: Math.ceil(r.remaining) });
  $('#gauge-label').textContent = state.target != null ? `${secs} · 🏆 ${t('challengeTarget', { score: state.target })}` : secs;
  // Done means the player handled it; what the water (smoke, dark) took is counted apart.
  const recs = [...r.records.values()];
  const done = recs.filter((x) => x.status === STATUS.CORRECT || x.status === STATUS.LEARNED).length;
  const lost = recs.filter((x) => x.status === STATUS.FLOODED).length;
  $('#hud-score').textContent = `${t('scoreHud', { done, total: r.records.size })}${lost ? ` ${tm('lostMark', r.mode)}${lost}` : ''}`;
}

function stagePoint(p) {
  const idx = state.scene.roomOf(p);
  return state.scene.toStage(idx, p.cx, p.y + p.h * 0.3);
}

function onItemTap(p) {
  const r = state.round;
  if (!r || r.ended || !r.running || sheetOpen()) return;
  clearHintTimer();
  unlockAudio();
  if (p.kind === 'decoy') {
    const pt = stagePoint(p);
    const note = L(p.ref.note);
    if (state.decoysTapped.has(p.pid)) {
      say(`${pickLine('geckoDecoy')} · ${note}`, 2200);
      return;
    }
    state.decoysTapped.add(p.pid);
    const res = r.tapDecoy();
    play('decoy');
    haptic(18);
    say(t('decoyToast', { note, s: res.penalty }), 2800);
    floatText($('#stage'), pt.x, pt.y, `−${res.penalty}`, 'warn');
    gameGecko.set('think', { hold: 1400, anim: 'nod' });
    state.scene.markDecoy(p);
    updateHud();
    return;
  }
  const rec = r.records.get(p.pid);
  if (rec.status === STATUS.FLOODED) {
    say(tm('floodedToast', r.mode, { name: L(p.ref.name) }), 2400);
    return;
  }
  if (rec.status !== STATUS.PENDING) {
    say(t('doneToast'), 1400);
    return;
  }
  r.pause();
  play('tap');
  haptic(10);
  state.scene.select(p.pid, true);
  openChoices(p);
}

function openChoices(p) {
  const r = state.round;
  const variant = r.variantFor(p);
  const ctx = variant === 'wet' ? p.ref.wet.context : p.ref.context;
  const choices = r.choicesFor(p);
  // Letters, not an icon per kind of action: the wrong answers were mostly
  // "wait" (a clock), so the right one was the odd icon out (KNOWN_ISSUES #66).
  const letters = [...t('choiceLetters')];
  play('sheet');
  openSheet(`
    <div class="item-head">
      ${spriteIcon(p.ref.sprite)}
      <div>
        <h2 id="sheet-title">${esc(L(p.ref.name))}</h2>
        <p class="sub">${esc(L(ctx))}</p>
      </div>
    </div>
    <div class="choice-intro">
      <p class="sub"><b>${esc(t('whatToDo'))}</b></p>
      <span class="paused-pill" aria-label="${esc(t('timePausedTag'))}">${esc(t('timePausedTag'))}</span>
    </div>
    <div class="choices">
      ${choices.map((c, i) => `
        <button class="choice" type="button" data-i="${i}">
          <span class="ico" aria-hidden="true">${esc(letters[i] || String(i + 1))}</span>
          <span>${esc(L(c.label))}</span>
        </button>`).join('')}
    </div>`, {
    dismissible: true,
    onClose: () => {
      state.scene.select(p.pid, false);
      resumeGame();
    },
  });
  for (const b of $$('.choice', $('#sheet'))) {
    b.addEventListener('click', () => onChoice(p, choices[Number(b.dataset.i)], variant, choices));
  }
}

function sourcesLine(ids) {
  const list = sourceList(ids);
  if (!list.length) return '';
  const seen = new Set();
  const links = [];
  for (const s of list) {
    if (seen.has(s.agency)) continue;
    seen.add(s.agency);
    links.push(`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(agencyName(s.agency))}</a>`);
  }
  return `<span class="src">${esc(t('source'))}: ${links.join(' · ')}</span>`;
}

function onChoice(p, choice, variant, choices) {
  const r = state.round;
  const res = r.choose(p, choice);
  if (!res) return;
  const data = variant === 'wet' ? p.ref.wet : p.ref;
  const tip = L(data.tip);
  const why = L(data.why);
  const srcIds = data.sources || p.ref.sources;
  const pt = stagePoint(p);
  const stage = $('#stage');

  if (res.correct) {
    play('correct');
    haptic([18, 40, 24]);
    gameGecko.set('cheer', { hold: 1800, anim: 'hop' });
    sparkle(stage, pt.x, pt.y);
    floatText(stage, pt.x, pt.y - 10, `+${content().config.round.pointsCorrect + res.bonus}`, 'ok');
    state.scene.mark(p, 'correct', { swap: p.ref.doneSprite, anim: p.ref.doneAnim });
    state.combo++;
    if (state.combo >= 3) {
      // Feel only: a streak of right answers never changes the score.
      // Centred near the top of the stage, so it never runs off the edge.
      floatText(stage, stage.clientWidth / 2, stage.clientHeight * 0.22, t('comboText', { n: state.combo }), 'combo');
      setTimeout(() => play('combo'), 260);
    }
    say(pickLine('geckoCorrect'), 1800);
  } else {
    play('wrong');
    haptic(50);
    state.combo = 0;
    gameGecko.set('oops', { hold: 1800, anim: 'wobble' });
    floatText(stage, pt.x, pt.y, `−${res.penalty} ${t('seconds', { s: '' }).trim()}`, 'warn');
    state.scene.mark(p, 'learned');
    say(pickLine('geckoWrong'), 1800);
  }
  state.scene.updateCounts(r.records, tm('lostMark', r.mode));
  updateHud();

  const right = choices.find((c) => c.correct);
  const title = pickLine(res.correct ? 'correctTitles' : 'wrongTitles');
  const pts = res.correct
    ? `${esc(t('points', { pts: content().config.round.pointsCorrect }))}${res.bonus ? ` · ${esc(t('bonus', { b: res.bonus }))}` : ''}`
    : esc(t('penalty', { s: res.penalty }));
  const sheet = $('#sheet-body');
  sheet.innerHTML = `
    <div class="verdict ${res.correct ? 'ok' : 'learn'}">
      <span class="mark" aria-hidden="true">${res.correct ? '✓' : '!'}</span>
      <div><h2 id="sheet-title">${esc(title)}</h2><div class="pts">${pts}</div></div>
    </div>
    ${res.correct ? '' : `
      <p class="safe-answer"><b>${esc(t('safeAnswer'))}:</b> ${esc(L(right.label))}</p>
      ${choice.feedback ? `<p class="safe-answer">${esc(L(choice.feedback))}</p>` : ''}`}
    <div class="tip-card ${res.correct ? 'ok' : 'learn'}">
      <span class="label">${esc(t('tipLabel'))} · ${esc(t(`topic_${p.ref.topic}`))}</span>
      <p class="tip">${esc(tip)}</p>
      ${why ? `<p class="why-text">💡 ${esc(why)}</p>` : ''}
    </div>
    ${srcIds && srcIds.length ? `
    <details class="why">
      <summary>${esc(t('source'))} ▾</summary>
      ${sourcesLine(srcIds)}
    </details>` : ''}
    <button class="btn" type="button" id="fb-next" autofocus>${esc(t(res.correct ? 'continue' : 'gotIt'))}</button>`;
  $('#fb-next').focus({ preventScroll: true });
  $('#fb-next').addEventListener('click', () => closeSheet());
}

function resumeGame() {
  const r = state.round;
  if (!r || r.ended) return;
  r.resume();
  r.checkAllResolved();
  checkRoomCleared();
  resetHintTimer();
}

function checkRoomCleared() {
  const r = state.round;
  if (!r || r.ended) return;
  const room = state.scene.rooms[state.scene.current];
  if (!room) return;
  const left = room.placements.filter((p) => p.kind === 'target' && r.records.get(p.pid).status === STATUS.PENDING).length;
  const anyElse = [...r.records.values()].some((x) => x.status === STATUS.PENDING);
  if (!left && anyElse) say(t('geckoRoomClear'), 2200);
}

function pauseGame(showSheet) {
  clearHintTimer();
  const r = state.round;
  if (!r || r.ended || sheetOpen()) return;
  r.pause();
  if (!showSheet) return;
  openSheet(`
    <h2 id="sheet-title">${esc(t('pausedTitle'))}</h2>
    <p class="sub">${esc(t('pausedBody'))}</p>
    <div class="btn-row">
      <button class="btn secondary" type="button" id="p-quit">${esc(t('quit'))}</button>
      <button class="btn" type="button" id="p-resume" autofocus>${esc(t('resume'))}</button>
    </div>`, { dismissible: true, onClose: () => resumeGame() });
  $('#p-resume').addEventListener('click', () => closeSheet());
  $('#p-quit').addEventListener('click', () => {
    const rr = state.round;
    state.round = null;
    cancelAnimationFrame(state.raf);
    closeSheet();
    if (rr) rr.ended = true;
    goHome();
  });
}

function onFlood(p) {
  state.scene.mark(p, 'flooded');
  state.scene.updateCounts(state.round.records, tm('lostMark', state.round.mode));
  play(modeOf(state.round.mode)?.threat === 'smoke' ? 'puff' : 'blub');
  const now = performance.now();
  if (now - state.lastFloodLine > 3000) {
    state.lastFloodLine = now;
    say(pickOne(tm('geckoFlood', state.round.mode)), 1800);
    gameGecko?.set('oops', { hold: 1200 });
  }
}

function onWet() {
  play(modeOf(state.round.mode)?.threat === 'smoke' ? 'puff' : 'splash');
  say(tm('geckoWet', state.round.mode), 3600);
  gameGecko?.set('wow', { hold: 1600, anim: 'wobble' });
}

async function onRoundEnd(result) {
  clearHintTimer();
  cancelAnimationFrame(state.raf);
  updateHud();
  state.scene.revealMissed(state.house.targets, state.round.records);
  closeSheet();
  hideBubble();
  play(result.score10 === 10 ? 'fanfareBig' : result.tier >= 2 ? 'fanfare' : 'chime');
  gameGecko?.set(result.tier >= 2 ? 'cheer' : 'happy', { anim: 'hop' });
  state.run.record(result);
  await wait(1100);
  if (!state.run.done && content().config.features.comboRun) {
    startRound(); // version 2: straight into the Return round
    return;
  }
  showResult(result);
}

// ------------------------------------------------------------------ result

function gridOf(result) {
  return state.house.targets.map((p) => result.records.find((r) => r.pid === p.pid).status);
}

function emojiGrid(mode, grid) {
  const lost = tm('lostMark', mode); // the same mark as the HUD and the room tabs
  const map = { correct: '✅', learned: '💡', flooded: lost, missed: '⬜' };
  return grid.map((s) => map[s] || '⬜').join('');
}

async function showResult(result) {
  const C = content();
  const run = state.run;
  const mode = result.mode;
  const rank = rankTitle(mode, result.tier);
  const prog = recordResult(result, run.kind);
  const site = siteUrl();
  const cUrl = challengeUrl(site, mode, result.score10, run.houseKey, getLang());
  const grid = gridOf(result);
  // Lost to the water, smoke or dark: then "N s left" would read as a win.
  const lostN = result.records.filter((r) => r.status === STATUS.FLOODED).length;
  const headlineKey = mk('result', mode);
  const houseText = run.kind === 'random' ? t('cardRandomHouse') : t('cardHouse', { date: houseLabel(run.houseKey) });
  const shareText = t(mk('shareText', mode), {
    score: result.score10, rank, grid: emojiGrid(mode, grid), url: cUrl, house: houseText,
    streak: prog.streak >= 2 ? ` · ${t('streak', { n: prog.streak })}` : '',
  });
  const isChallenge = run.kind === 'challenge' && !!state.challenge;
  const them = isChallenge ? state.challenge.score : null;
  state.result = result;
  state.share = {
    text: shareText, url: cUrl, mode, blob: null, file: null, score: result.score10,
    emoji: modeOf(mode)?.emoji || '🏠', them,
  };
  track('round_end', { mode, label: run.kind, value: result.score10 });

  // Safety book: lessons answered correctly for the first time.
  const pool = bookPool(C);
  const valid = new Set(Object.values(pool).flat().map((it) => it.id));
  const before = bookCounts().topics;
  const added = addLearned(correctIds(state.house.targets, result.records), valid);
  const book = bookCounts();
  const doneTopics = completedTopics(before, book.topics);

  const other = nextMode(mode);
  const me = result.score10;
  const vs = isChallenge
    ? (() => {
      // "So close" only when it was (1–2 points); 5 against 8 isn't.
      const line = me > them ? t('versusWin') : me === them ? t('versusTie') : t(them - me <= 2 ? 'versusLose' : 'versusLoseFar');
      return `<div class="versus">${esc(t('versus', { me: `${me}/10`, them: `${them}/10` }))}<br>${esc(line)}</div>`;
    })() : '';
  const perfect = me === 10;
  const cheerKey = perfect ? 'cheerPerfect' : ['cheerLow', 'cheerMid', 'cheerHigh'][result.tier] || 'cheerMid';
  // The ending answers "บ้านรอดไหม?": the same line on the screen and on the card.
  const ending = pickLineFor(cheerKey, mode);

  // What to learn first: wrong answers, then what was lost or missed, then the right ones.
  const order = { learned: 0, flooded: 1, missed: 2, correct: 3 };
  const statusOf = (p) => result.records.find((r) => r.pid === p.pid).status;
  const lessons = [...state.house.targets].sort((a, b) => order[statusOf(a)] - order[statusOf(b)]).map((p) => {
    const rec = result.records.find((r) => r.pid === p.pid);
    const data = rec.variant === 'wet' ? p.ref.wet : p.ref;
    const st = rec.status;
    const glyph = { correct: '✓', learned: '!', flooded: '~', missed: '?' }[st];
    const tagText = st === 'flooded' ? tm('stFlooded', mode) : t({ correct: 'stCorrect', learned: 'stLearned', missed: 'stMissed' }[st]);
    return `<li class="lesson ${st}">
      <div class="row"><span class="st" aria-hidden="true">${glyph}</span>
        <div>
          <div class="name"><span aria-hidden="true">${esc(topicEmoji(p.ref.topic))}</span> ${esc(L(p.ref.name))} <span class="tag">· ${esc(tagText)}</span></div>
          <p class="tip">${esc(L(data.tip))}</p>
          <details><summary>${esc(t('why'))}</summary><p>${esc(L(data.why))}</p>${sourcesLine(data.sources || p.ref.sources)}</details>
        </div>
      </div></li>`;
  }).join('');

  const help = C.helplines.map((h) => `
    <li><a href="tel:${esc(h.number)}" data-help="${esc(h.number)}">
      <span class="num">${esc(h.number)}</span>
      <span class="who">${esc(L(h.who))}<span class="what">${esc(L(h.what))}</span></span>
    </a></li>`).join('');
  const fUrl = forecastUrl(mode);
  // v1.11.0: what to do next for the home sits right under share, not three screens down.
  const hzTools = (C.config.hazards?.[modeOf(mode)?.hazard]?.tools || []).filter((x) => TOOLS[x]);

  $('#result').innerHTML = `
    <div class="card-wrap">
      <img class="card-preview" id="card-img" alt="${esc(t(headlineKey, { score: result.score10 }))} · ${esc(rank)} · ${esc(plainText(ending))}">
      <p class="card-sub-hint">👆 ${esc(t('cardTapHint'))}</p>
    </div>
    <div class="result-cheer">
      <div class="gecko-host" id="result-gecko"></div>
      <p class="bubble">${esc(ending)}</p>
    </div>
    <h1 id="result-title" class="sr-only">${esc(t(headlineKey, { score: result.score10 }))}</h1>
    <div class="stats">
      <span>${esc(t('statCorrect', { c: result.correct, n: result.total }))}</span>
      ${modeOf(mode)?.bonus && result.criticalTotal ? `<span>${esc(t('statBonus', { b: result.bonusHits }))}</span>` : ''}
      ${lostN ? `<span>${esc(tm('lostMark', mode))} ${esc(t('statLost', { what: tm('stFlooded', mode), n: lostN }))}</span>` : `<span>${esc(t('statTime', { t: result.timeLeft }))}</span>`}
    </div>
    ${added.length ? `<button class="book-chip is-new" type="button" id="btn-book-new">${esc(t('bookNew', { n: added.length, have: book.n, total: book.total }))}</button>` : ''}
    ${vs}
    ${isChallenge
    ? `<div class="result-cta"><button class="btn" type="button" id="btn-challenge">🏆 ${esc(t('challengeBackCta'))}</button></div>
    <button class="btn secondary" type="button" id="btn-share">📤 ${esc(t('shareCta'))}</button>`
    : `<div class="result-cta"><button class="btn" type="button" id="btn-share">📤 ${esc(t('shareCta'))}</button></div>
    <button class="btn secondary" type="button" id="btn-challenge">🏆 ${esc(t('challengeCta'))}</button>`}
    <div class="btn-row">
      <button class="btn secondary small" type="button" id="btn-other">${esc(t('playOther', { mode: t(mk('mode', other)) }))}</button>
      <button class="btn secondary small" type="button" id="btn-random">🎲 ${esc(t('playRandom'))}</button>
    </div>
    <h2 class="section-title">${esc(t('guideNext'))}</h2>
    <div class="result-next">
      <button class="btn secondary" type="button" id="btn-checklist">📋 ${esc(L(C.checklists[mode]?.title) || t('checklists'))}</button>
      ${hzTools.includes('kit') ? `<button class="btn blue" type="button" id="btn-kit">${esc(t('kitFromResult'))}</button>` : ''}
      ${hzTools.filter((x) => x !== 'kit').map((x) => `<button class="btn secondary" type="button" data-result-tool="${x}">${TOOLS[x]} ${esc(toolName(x))}</button>`).join('')}
      ${fUrl ? `<a class="btn blue" id="btn-forecast" href="${esc(fUrl)}" target="_blank" rel="noopener">${esc(tm('forecastIcon', mode))} ${esc(tm('forecastLong', mode))}</a>` : ''}
    </div>
    <h2 class="section-title">${esc(t('lessonTitle'))}</h2>
    <ul class="lessons">${lessons}</ul>
    <h2 class="section-title">${esc(t('helpTitle'))}</h2>
    <ul class="help-list">${help}</ul>
    <p class="note">${esc(t('helpNote'))}</p>
    <button class="btn secondary small" type="button" id="btn-home">${esc(t('home'))}</button>
    <p class="note">${esc(t('disclaimer'))}</p>`;
  showScreen('result');
  const resultGecko = new Gecko($('#result-gecko'), { prop: modeOf(mode)?.prop || 'none' });
  resultGecko.set(perfect ? 'wow' : result.tier >= 2 ? 'cheer' : result.tier === 1 ? 'happy' : 'think', { anim: 'hop' });
  if (result.tier >= 2) confetti($('#screen-result'));
  if (perfect) setTimeout(() => confetti($('#screen-result'), 40), 700);
  $('#btn-book-new')?.addEventListener('click', () => openBook());

  $('#btn-share').addEventListener('click', () => shareResultNow());
  $('#btn-challenge').addEventListener('click', () => shareChallenge());
  $('#btn-other').addEventListener('click', () => startFlow(other, { kind: 'daily' }));
  $('#btn-random').addEventListener('click', () => startFlow(mode, { kind: 'random' }));
  $('#btn-home').addEventListener('click', () => goHome());
  $('#btn-checklist').addEventListener('click', () => openChecklist(mode, 'result'));
  $('#btn-kit')?.addEventListener('click', () => openTool('kit', 'result', mode));
  for (const b of $$('[data-result-tool]')) b.addEventListener('click', () => openTool(b.dataset.resultTool, 'result'));
  $('#btn-forecast')?.addEventListener('click', () => track('forecast_click', { mode, label: 'result' }));
  for (const a of $$('[data-help]', $('#result'))) {
    a.addEventListener('click', () => track('help_click', { mode, label: a.dataset.help }));
  }

  // Draw the shareable card now, so a later tap can share instantly (the
  // Web Share API must be called straight from the tap).
  try {
    state.cardAssets = state.cardAssets || await loadCardAssets();
    const canvas = document.createElement('canvas');
    drawResultCard(canvas, {
      logo: [t('logoA'), t('logoB')],
      mode,
      tier: result.tier,
      modeLabel: t(mk('mode', mode)),
      headline: t(headlineKey, { score: '' }).replace(/\s*\/10\s*$/, '').trim(),
      scoreText: `${result.score10}/10`,
      rankTitle: rank,
      grid,
      cta: isChallenge ? t('cardVersus', { them: `${them}/10`, me: `${me}/10` }) : t('cardChallenge'),
      url: cUrl,
      perfect: perfect ? t('perfectStamp') : null,
      footer: t('cardFooter'),
      houseLabel: run.kind === 'random' ? t('cardRandomHouse') : t('cardHouse', { date: houseLabel(run.houseKey) }),
      ending,
    }, state.cardAssets);
    const blob = await canvasToBlob(canvas);
    state.share.blob = blob;
    try {
      state.share.file = new File([blob], `baanrodmai-${mode}-${result.score10}.png`, { type: 'image/png' });
    } catch { state.share.file = null; }
    $('#card-img').src = await imageSrc(blob);
  } catch (e) {
    console.warn('card render failed', e);
  }
  const notes = doneTopics.map((tp) => t('topicDoneToast', { topic: t(`topic_${tp}`) }));
  if (prog.milestone) notes.push(t('streakMilestone', { n: prog.milestone }));
  if (prog.isBest && prog.plays > 1) notes.push(`${t('best', { score: result.score10 })} 🎉`);
  notes.forEach((n, i) => setTimeout(() => toast(n, 2400), i * 2600));
}

async function shareResultNow() {
  const s = state.share;
  if (!s) return;
  track('share_open', { mode: s.mode, label: 'result' });
  if (canNativeShare()) {
    const outcome = await nativeShare({ file: s.file, title: brandName(), text: s.text, url: s.url });
    if (outcome === 'shared') {
      track('share_click', { mode: s.mode, label: 'native' });
      return;
    }
    if (outcome === 'cancelled') return;
  }
  openShareSheet({ ...s, filename: `baanrodmai-${s.mode}.png`, imgSrc: $('#card-img')?.src });
}

async function shareChallenge() {
  const s = state.share;
  if (!s) return;
  // After playing a friend's challenge, the reply names both scores.
  const back = s.them != null;
  const tail = !back ? '' : s.score > s.them ? t('backWin') : s.score === s.them ? t('backTie') : t('backLose');
  const text = back
    ? t('challengeBackText', { me: s.score, them: s.them, emoji: s.emoji, url: s.url, tail })
    : t('challengeText', { score: s.score, emoji: s.emoji, url: s.url });
  const label = back ? 'challenge-back' : 'challenge';
  track('share_open', { mode: s.mode, label });
  if (canNativeShare()) {
    const outcome = await nativeShare({ file: s.file, title: brandName(), text, url: s.url });
    if (outcome === 'shared') {
      track('share_click', { mode: s.mode, label: `${label}-native` });
      return;
    }
    if (outcome === 'cancelled') return;
  }
  openShareSheet({ ...s, text, filename: `baanrodmai-${s.mode}.png`, imgSrc: $('#card-img')?.src });
}

function openShareSheet({ text, url, blob, file, mode, filename, imgSrc }) {
  const app = inAppBrowser();
  const nativeOk = canNativeShare();
  const saveOk = blob && canDownload();
  openSheet(`
    <h2 id="sheet-title">${esc(t('shareTitle'))}</h2>
    ${app === 'line' ? `<p class="line-guide">💬 ${esc(t('lineGuideText'))}</p>` : ''}
    <div class="share-grid">
      ${nativeOk ? `<button class="share-btn" data-ch="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
      <button class="share-btn" data-ch="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
      <button class="share-btn" data-ch="facebook"><span class="ico ico-fb">f</span>${esc(t('shareFb'))}</button>
      <button class="share-btn" data-ch="x"><span class="ico ico-x">X</span>${esc(t('shareX'))}</button>
      <button class="share-btn" data-ch="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
      ${saveOk ? `<button class="share-btn" data-ch="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}
    </div>
    ${imgSrc ? `<img class="card-preview share-preview" src="${esc(imgSrc)}" alt="">` : ''}
    ${imgSrc && !saveOk ? `<p class="save-hint">💡 ${esc(t('saveHint'))}</p>` : ''}
    ${app === 'line' && imgSrc ? `<a class="link" href="${esc(lineExternalUrl(location.href))}">${esc(t('openExternal'))}</a>` : ''}
    <button class="btn secondary small" type="button" id="share-close">${esc(t('close'))}</button>`);
  $('#share-close').addEventListener('click', () => closeSheet());
  for (const b of $$('[data-ch]', $('#sheet'))) {
    b.addEventListener('click', async () => {
      const ch = b.dataset.ch;
      if (ch === 'native') {
        const o = await nativeShare({ file, title: brandName(), text, url });
        if (o === 'shared') track('share_click', { mode, label: 'native' });
      } else if (ch === 'copy') {
        await copyText(text);
        track('share_click', { mode, label: 'copy' });
        toast(t('copied'), 2200);
      } else if (ch === 'save') {
        downloadBlob(blob, filename);
        track('share_click', { mode, label: 'save' });
      } else shareChannel(ch, { text, url, blob, filename, mode });
    });
  }
}

function goHome() {
  state.scene?.destroy();
  state.round = null;
  state.challenge = state.run?.kind === 'challenge' ? null : state.challenge;
  app.classList.remove(...modeIds().map((id) => `is-${id}`));
  showScreen('start');
  renderStart();
  if (state.updateReady) toast(t('updateReady'), 3200);
}

// ------------------------------------------------------------------ sheets

// The tools outside the round (kit.js, loaded only when one opens): the home
// check, the family plan card and, since v1.10.0, the calculators that take
// the household's answers and work out what to do (the fridge in a power cut,
// the dust today). Each has a page of its own (/kit, /plan, /fridge, /air) and ?open=<id>.
// Since v1.12.0 the list (and each tool's icon and group) is config.json → tools, filled in at boot;
// "tools" itself is the page that lists them all (/tools), not one of them.
const TOOLS = {};
const toolName = (x) => t(`hub${x[0].toUpperCase()}${x.slice(1)}`);
async function openTool(which, from, mode = '') {
  try {
    const m = await import('./kit.js');
    // Each tool opens with open<Id> in kit.js (openKit, openFridge, openHot…).
    const fn = m[`open${which[0].toUpperCase()}${which.slice(1)}`];
    await (fn ? fn(from, mode || undefined) : m.openKit(from, mode));
  } catch (e) {
    console.warn('kit failed', e);
    toast(t('offlineTool'), 2600);
  }
}

// "What to do" guides, one per hazard, in config.json → guides (order, icon,
// hazard). A game mode's checklist is its guide; the hazards with no game yet
// (quake, heat, storm, landslide) are guides only, with a source on every line.
const guideList = () => (content().config.guides || []).filter((g) => content().checklists[g.id]);
const guideIds = () => guideList().map((g) => g.id);
const guideOf = (id) => guideList().find((g) => g.id === id);
// The numbers that fit the guide (config.json → guides[].calls: 1130 and 1129 in a power cut,
// 199 first for a fire), each with its short name; the first three main ones otherwise.
const guideCalls = (id) => {
  const C = content();
  const nums = guideOf(id)?.calls || C.helplines.filter((h) => h.main).slice(0, 3).map((h) => h.number);
  return nums.map((n) => C.helplines.find((h) => h.number === n)).filter(Boolean);
};

async function openGuides(from = 'start') {
  const C = content();
  track('guide_open', { label: from });
  const now = activeAlert(C.config, bangkokDateKey());
  const list = guideList().slice().sort((a, b) => (b.id === now) - (a.id === now));
  openSheet(`
    <h2 id="sheet-title">📋 ${esc(t('guidePickTitle'))}</h2>
    <p class="sub">${esc(t('guidePickSub'))}</p>
    <div class="guide-grid">${list.map((g) => `
      <button class="guide-tile${g.id === now ? ' is-now' : ''}" type="button" data-guide="${g.id}">
        <span class="guide-ico" aria-hidden="true">${esc(g.icon)}</span>
        <span class="guide-name">${esc(t(mk('guide', g.id)))}</span>
        ${g.id === now ? `<span class="guide-now">${esc(t('guideNow'))}</span>` : ''}
      </button>`).join('')}
    </div>
    <button class="btn secondary small" type="button" id="guide-close">${esc(t('close'))}</button>`, { label: t('guidePickTitle') });
  $('#guide-close').addEventListener('click', () => closeSheet());
  for (const b of $$('[data-guide]', $('#sheet'))) b.addEventListener('click', () => openChecklist(b.dataset.guide, 'picker'));
}

// The guide's lines, grouped by phase (before, during, after) when it has them.
// A guide can name its phases (checklists.json → phaseNames, e.g. heat).
function guideSections(list) {
  const phases = ['before', 'during', 'after'].filter((p) => list.items.some((it) => it.phase === p));
  if (!phases.length) return [{ head: '', items: list.items }];
  return phases.map((p) => ({
    head: list.phaseNames?.[p] ? L(list.phaseNames[p]) : t(mk('phase', p)),
    phase: p,
    items: list.items.filter((it) => it.phase === p),
  }));
}

// One guide: the lines first (with a jump to "during" for someone reading it
// while it happens, and the helplines), then what to do next for the home,
// then passing it on.
async function openChecklist(mode, from = '') {
  const C = content();
  const list = C.checklists[mode];
  if (!list) return openGuides(from || 'link');
  track('checklist_open', { mode, label: from });
  const g = guideOf(mode);
  const hz = g && C.config.hazards?.[g.hazard];
  const pre = getLang() === 'en' ? '/en' : '';
  const sections = guideSections(list);
  const row = (it) => `<li><span>${esc(it.icon)} ${esc(L(it))}${it.verify === 'partial' ? ' <span class="partial">⚠️</span>' : ''}</span></li>`;
  let n = 0;
  const listHtml = sections.map((sec) => {
    const start = n + 1;
    n += sec.items.length;
    return `${sec.head ? `<h3 class="phase phase-${sec.phase}" id="gp-${sec.phase}">${esc(sec.head)}</h3>` : ''}<ol class="check-list" start="${start}" style="counter-reset: c ${start - 1}">${sec.items.map(row).join('')}</ol>`;
  }).join('');
  const agencies = [...new Set(list.items.flatMap((it) => it.sources || []).map((s) => C.sources[s]?.agency).filter(Boolean))].map(agencyName);
  const partial = list.items.some((it) => it.verify === 'partial');
  const calls = guideCalls(mode);
  const tools = (hz?.tools || []).filter((x) => TOOLS[x]);
  openSheet(`
    <h2 id="sheet-title">${esc(g?.icon || '📋')} ${esc(L(list.title))}</h2>
    ${sections.length > 1 ? `<nav class="phase-jump" aria-label="${esc(t('guideJump'))}">${sections.map((sec) => `<button class="phase-chip phase-${sec.phase}" type="button" data-jump="${sec.phase}">${esc(sec.head)}</button>`).join('')}</nav>` : ''}
    ${g?.now && TOOLS[g.now] ? `<button class="btn guide-now-btn" type="button" data-tool="${esc(g.now)}">${esc(t(`guideNow${g.now[0].toUpperCase()}${g.now.slice(1)}`))}</button>` : ''}
    <p class="tel-row"><span>☎️ <span class="lbl">${esc(t('telFree'))}</span></span>${calls.map((h) => `<a class="tel-chip" href="tel:${esc(h.number)}" data-help="${esc(h.number)}"><b>${esc(h.number)}</b>${h.short ? `<small>${esc(L(h.short))}</small>` : ''}</a>`).join('')}</p>
    ${listHtml}
    ${agencies.length || partial ? `<p class="src guide-src">${agencies.length ? `${esc(t('source'))}: ${esc(agencies.join(' · '))}` : ''}${partial ? `<br>${esc(t('guidePartial'))}` : ''}</p>` : ''}
    <div class="guide-actions">
      ${modeIds().includes(mode) ? `<button class="btn" type="button" id="cl-play">${esc(t('guidePlay'))}</button>` : ''}
      ${hz ? `<a class="btn secondary small" id="cl-read" href="${pre}/${esc(hz.slug)}">${esc(t('guideRead'))}</a>` : ''}
      ${modeIds().includes(mode) && forecastUrl(mode) ? `<a class="btn blue small" id="cl-forecast" href="${esc(forecastUrl(mode))}" target="_blank" rel="noopener">${esc(tm('forecastIcon', mode))} ${esc(tm('forecastLong', mode))}</a>` : ''}
    </div>
    <div id="cl-links"></div>
    ${tools.length ? `<h3>${esc(t('guideNext'))}</h3>
    <div class="btn-row guide-next">${tools.map((x) => `<button class="btn secondary small" type="button" data-tool="${x}">${TOOLS[x]} ${esc(toolName(x))}</button>`).join('')}</div>` : ''}
    <h3>${esc(t('guideShare'))}</h3>
    <div class="share-grid" id="cl-share"></div>
    <div class="guide-pic">
      <img class="card-preview card-thumb" id="cl-img" alt="${esc(L(list.title))}">
      <p class="save-hint" id="cl-hint" hidden>💡 ${esc(t('saveHint'))}</p>
    </div>
    ${inAppBrowser() === 'line' ? `<a class="link" href="${esc(lineExternalUrl(location.href))}">${esc(t('openExternal'))}</a>` : ''}
    ${canPrint() ? `<button class="btn secondary small" type="button" id="cl-print">${esc(t('printBtn'))}</button>` : ''}
    <div class="btn-row">
      <button class="btn secondary small" type="button" id="cl-back">${esc(t('guideBack'))}</button>
      <button class="btn secondary small" type="button" id="cl-close">${esc(t('done'))}</button>
    </div>`, { label: L(list.title) });
  $('#cl-close').addEventListener('click', () => closeSheet());
  $('#cl-back').addEventListener('click', () => openGuides('guide'));
  for (const b of $$('[data-jump]', $('#sheet'))) {
    b.addEventListener('click', () => $(`#gp-${b.dataset.jump}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  for (const a of $$('.tel-chip', $('#sheet'))) a.addEventListener('click', () => track('help_click', { label: a.dataset.help, mode }));
  for (const b of $$('[data-tool]', $('#sheet'))) b.addEventListener('click', () => openTool(b.dataset.tool, 'guide'));
  // The agencies' own pages for this guide (kit.json → links, v1.12.0), filled in when the tools' code is in.
  import('./kit.js').then((m) => m.guideLinks(mode)).then((html) => {
    const box = $('#cl-links');
    if (!box || !html) return;
    box.innerHTML = html;
    for (const a of $$('[data-link]', box)) a.addEventListener('click', () => track('link_click', { label: a.dataset.link, mode }));
  }).catch(() => {});
  $('#cl-play')?.addEventListener('click', () => {
    closeSheet();
    track('mode_select', { mode, label: 'guide' });
    startFlow(mode, { kind: 'daily' });
  });
  $('#cl-read')?.addEventListener('click', () => track('learn_open', { label: mode }));
  $('#cl-print')?.addEventListener('click', () => {
    track('print', { mode, label: 'guide' });
    printList({
      brand: `${t('logoA')}${t('logoB')}`,
      title: L(list.title),
      sections: sections.map((sec) => ({ head: sec.head, items: sec.items.map((it) => ({ text: L(it), note: it.verify === 'partial' ? t('partialItem') : '' })) })),
      foot: [
        agencies.length ? `${t('source')}: ${agencies.join(' · ')}` : '',
        `${t('clHelpLabel')}: ${guideCalls(mode).map((h) => `${h.number} ${L(h.short)}`).join(' · ')}`,
        t('printNote', { url: `${siteUrl().replace(/^https?:\/\//, '')}${pre}/checklist/${mode}`, date: formatHouseDate(bangkokDateKey(), getLang()) }),
        t('disclaimer'),
      ].filter(Boolean),
    });
  });

  const assets = state.cardAssets || (state.cardAssets = await loadCardAssets());
  const canvas = document.createElement('canvas');
  drawChecklist(canvas, checklistData(mode), assets);
  const blob = await canvasToBlob(canvas);
  const img = $('#cl-img');
  if (!img) return; // sheet closed meanwhile
  img.src = await imageSrc(blob);
  const url = `${siteUrl()}${pre}/checklist/${mode}`;
  // Only a guide with a game invites people to play it.
  const text = t(modeIds().includes(mode) ? 'shareTextChecklist' : 'shareTextGuide', { title: L(list.title), url });
  let file = null;
  try { file = new File([blob], `baanrodmai-checklist-${mode}.png`, { type: 'image/png' }); } catch { /* old browser */ }
  const saveOk = canDownload();
  $('#cl-share').innerHTML = `
    ${canNativeShare() ? `<button class="share-btn" data-c="native"><span class="ico ico-native">⇪</span>${esc(t('checklistShare'))}</button>` : ''}
    <button class="share-btn" data-c="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
    <button class="share-btn" data-c="facebook"><span class="ico ico-fb">f</span>${esc(t('shareFb'))}</button>
    <button class="share-btn" data-c="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
    ${saveOk ? `<button class="share-btn" data-c="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}`;
  $('#cl-hint').hidden = saveOk;
  for (const b of $$('[data-c]', $('#cl-share'))) {
    b.addEventListener('click', async () => {
      const c = b.dataset.c;
      track('checklist_save', { mode, label: c });
      if (c === 'native') await nativeShare({ file, title: L(list.title), text, url });
      else if (c === 'line' || c === 'facebook') shareChannel(c, { text, url, mode });
      else if (c === 'copy') {
        await copyText(text);
        toast(t('copied'));
      } else if (c === 'save') downloadBlob(blob, `baanrodmai-checklist-${mode}.png`);
    });
  }
}

export function checklistData(mode) {
  const C = content();
  const list = C.checklists[mode];
  const main = C.helplines.filter((h) => h.main).map((h) => h.number);
  return {
    mode,
    logo: [t('logoA'), t('logoB')],
    title: L(list.title),
    subtitle: t('clSubtitle'),
    items: list.items.map((it) => ({ text: L(it), sprite: it.sprite })),
    helpLabel: t('clHelpLabel'),
    helpNumbers: main.join('  ·  '),
    calls: guideCalls(mode).map((h) => ({ number: h.number, name: L(h.short) })),
    url: siteUrl(),
    forward: t('clForward'),
    footer: t('cardFooter'),
  };
}

// The safety book, grouped by topic: learned lessons with their tip, locked
// ones as grey tiles, a progress bar per topic and a badge for a full set.
// Locked answers are never hidden for good: /learn has every one of them.
async function openBook(focus = null) {
  try { await loadSprites(); } catch { /* icons are optional */ }
  const { total, n, have, topics } = bookCounts();
  const modeTag = (it) => t(mk('mode', it.mode));
  const section = (tp) => {
    const got = tp.items.filter((it) => have.has(it.id));
    const locked = tp.items.filter((it) => !have.has(it.id));
    const full = tp.n === tp.total;
    return `
    <section class="book-topic${full ? ' is-full' : ''}" id="book-${esc(tp.id)}">
      <h3>${esc(t(`topic_${tp.id}`))} <span class="count">${tp.n}/${tp.total}</span>${full ? ` <span class="badge">${esc(t('bookTopicDone'))}</span>` : ''}</h3>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${tp.total}" aria-valuenow="${tp.n}"><i style="width:${Math.round((100 * tp.n) / tp.total)}%"></i></div>
      <ul class="book-list">${got.map((it) => `
        <li>${spriteIcon(it.sprite)}<div><b>${esc(L(it.name))}</b> <span class="mode-tag">${esc(modeTag(it))}</span><p>${esc(L(it.tip))}</p></div></li>`).join('')}</ul>
      <ul class="book-grid" aria-label="${esc(t('bookLocked'))}">${locked.map((it) => `
        <li title="${esc(t('bookLocked'))}">${spriteIcon(it.sprite)}<span aria-hidden="true">🔒</span></li>`).join('')}</ul>
    </section>`;
  };
  // The featured or asked-for topic comes first.
  const order = [...topics].sort((a, b) => (b.id === focus) - (a.id === focus));
  openSheet(`
    <h2 id="sheet-title">📖 ${esc(t('bookTitle'))} · ${n}/${total}</h2>
    <p class="sub">${esc(n >= total ? t('bookDone') : t('bookIntro'))}</p>
    ${order.map(section).join('')}
    <a class="link" id="book-learn" href="${esc(learnUrl(focus ? `#t-${focus}` : ''))}">${esc(t('bookReadAll'))}</a>
    <button class="btn" type="button" id="book-play">${esc(t('bookPlay'))}</button>
    <button class="btn secondary small" type="button" id="book-close">${esc(t('close'))}</button>`);
  $('#book-close').addEventListener('click', () => closeSheet());
  $('#book-learn').addEventListener('click', () => track('learn_open', { label: focus || 'book' }));
  $('#book-play').addEventListener('click', () => {
    closeSheet();
    // Play the mode that still has the most to find in the focused topic.
    const tp = focus && topics.find((x) => x.id === focus);
    const left = (m) => (tp ? tp.items.filter((it) => it.mode === m && !have.has(it.id)).length : 0);
    const mode = tp
      ? modeIds().reduce((best, id) => (left(id) > left(best) ? id : best), modeIds()[0])
      : (state.result?.mode || state.defaultMode);
    startFlow(mode, { kind: 'random' });
  });
}

function openHelp() {
  const C = content();
  const help = C.helplines.map((h) => `
    <li><a href="tel:${esc(h.number)}" data-help="${esc(h.number)}">
      <span class="num">${esc(h.number)}</span>
      <span class="who">${esc(L(h.who))}<span class="what">${esc(L(h.what))}</span></span>
    </a></li>`).join('');
  // One "check before you go" link per distinct mode link (flood forecast, Air4Thai).
  const seen = new Set();
  const links = modeIds().map((id) => [id, forecastUrl(id)]).filter(([, u]) => u && !seen.has(u) && seen.add(u));
  openSheet(`
    <h2 id="sheet-title">${esc(t('helpTitle'))}</h2>
    <ul class="help-list">${help}</ul>
    <p class="note">${esc(t('helpNote'))}</p>
    ${links.map(([id, u]) => `<a class="btn blue" href="${esc(u)}" target="_blank" rel="noopener" data-forecast="${esc(id)}">${esc(tm('forecastIcon', id))} ${esc(tm('forecastLong', id))}</a>`).join('')}
    <button class="btn secondary small" type="button" id="help-close">${esc(t('close'))}</button>`);
  $('#help-close').addEventListener('click', () => closeSheet());
  for (const a of $$('[data-forecast]', $('#sheet'))) a.addEventListener('click', () => track('forecast_click', { mode: a.dataset.forecast, label: 'help' }));
  for (const a of $$('[data-help]', $('#sheet'))) a.addEventListener('click', () => track('help_click', { label: a.dataset.help }));
}

function openAbout() {
  const C = content();
  const byAgency = new Map();
  for (const s of Object.values(C.sources)) {
    if (!byAgency.has(s.agency)) byAgency.set(s.agency, []);
    byAgency.get(s.agency).push(s);
  }
  const srcHtml = [...byAgency.entries()].map(([agency, list]) => `
    <li><b>${esc(agencyName(agency))}</b><ul>${list.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}${s.date ? `<span class="tag">(${esc(s.date)})</span>` : ''}</a></li>`).join('')}</ul></li>`).join('');
  openSheet(`
    <h2 id="sheet-title">${esc(t('aboutTitle'))}</h2>
    <p>${esc(t('aboutIntro'))}</p>
    <h3>${esc(t('aboutPrivacyTitle'))}</h3>
    <p>${esc(t('aboutPrivacy'))}</p>
    <h3>${esc(t('aboutSourcesTitle'))}</h3>
    <ul class="sources">${srcHtml}</ul>
    <p class="note">${esc(t('aboutCredits'))} · <span class="tag">v${esc(C.config.version)}</span></p>
    <p class="note">${esc(t('disclaimer'))}</p>
    <button class="btn secondary small" type="button" id="about-close">${esc(t('close'))}</button>`);
  $('#about-close').addEventListener('click', () => closeSheet());
}

// ------------------------------------------------------------------ offline

// Keep the address bar on the page for the current language, so a copied or
// shared link opens in that language (and previews in it).
function syncLangPath() {
  const next = langPath(location.pathname, getLang());
  if (next !== location.pathname) {
    try { history.replaceState(history.state, '', next + location.search + location.hash); } catch { /* sandboxed */ }
  }
}

// The code (APP_VERSION) and the content come from different releases: a
// cache served last release's code next to this release's content. Clear the
// caches and reload once per version; never loop (offline, blocked storage).
async function refreshStaleApp(version) {
  try {
    if (sessionStorage.getItem('brm:refresh') === version) return false;
    sessionStorage.setItem('brm:refresh', version);
  } catch { return false; }
  try {
    for (const key of await caches.keys()) if (key.startsWith('brm-')) await caches.delete(key);
    await (await navigator.serviceWorker?.getRegistration())?.update();
  } catch { /* reload anyway */ }
  location.reload();
  return true;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) state.updateReady = true;
    });
  };
  // Register after the page has loaded so caching never competes with the
  // first paint on a slow connection.
  if (document.readyState === 'complete') register();
  else addEventListener('load', register, { once: true });
}

// Debug hook for automated tests (?debug=1).
if (new URLSearchParams(location.search).has('debug')) {
  window.__brm = { state, startFlow, content, loadSprites };
}

boot();

// บ้านรอดไหม? — boot, screens and the game loop.

import { $, $$, esc, bangkokDateKey, formatHouseDate, inAppBrowser, wait } from './util.js';
import { randomHouseKey, isValidHouseKey } from './rng.js';
import {
  loadContent, content, t, L, setLang, getLang, pickLine, rankTitle, sourceList,
  siteUrl, forecastUrl, applyStaticStrings,
} from './content.js';
import { generateHouse, playableRooms } from './house.js';
import { Round, STATUS } from './round.js';
import { Run } from './run.js';
import { Scene, prefetchHouse, loadSprites } from './scene.js';
import { Gecko } from './mascot.js';
import { unlockAudio, play, haptic, isMuted, setMuted } from './audio.js';
import { sparkle, floatText, confetti } from './fx.js';
import { showScreen, openSheet, closeSheet, sheetOpen, toast, say, hideBubble, setLoading } from './ui.js';
import { actionIcon, spriteIcon } from './icons.js';
import { loadCardAssets, drawResultCard, drawChecklist, canvasToBlob } from './cards.js';
import {
  challengeUrl, parseChallenge, nativeShare, canNativeShare, copyText, shareChannel,
  canDownload, downloadBlob, lineExternalUrl, imageSrc,
} from './share.js';
import { track, initAnalytics, flush } from './analytics.js';
import { seenHowto, markHowto, bestScore, streak, recordResult } from './progress.js';

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
  lastFloodLine: 0,
  cardAssets: null,
  result: null,
  share: null,
  updateReady: false,
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
  applyStaticStrings();
  heroGecko = new Gecko($('#hero-gecko'), { title: 'น้องจก' });

  state.challenge = parseChallenge();
  if (state.challenge && !isValidHouseKey(state.challenge.houseKey)) state.challenge.houseKey = bangkokDateKey();

  const defaultMode = await pickDefaultMode(C);
  renderStart(defaultMode);
  bindGlobal();

  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
  idle(() => prefetchHouse(playableRooms(C)));

  // Deep links: /checklist/prepare, ?open=help, etc.
  const open = new URLSearchParams(location.search).get('open') || '';
  const cl = /^\/checklist\/(prepare|return)\/?$/.exec(location.pathname);
  if (cl) openChecklist(cl[1]);
  else if (/^checklist-(prepare|return)$/.test(open)) openChecklist(open.split('-')[1]);
  else if (open === 'help') openHelp();
  else if (open === 'about') openAbout();

  track('view', { label: state.challenge ? 'challenge' : cl ? 'checklist' : 'direct' });
  if (state.challenge) track('challenge_open', { mode: state.challenge.mode, value: state.challenge.score });
  registerServiceWorker();
}

// The default mode follows the rain-warning flag; later the forecast app
// can drive it through config.forecastStatusUrl ({ "rainWarning": true }).
async function pickDefaultMode(C) {
  let warning = !!C.config.rainWarningActive;
  const url = C.config.forecastStatusUrl;
  if (url) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (typeof data.rainWarning === 'boolean') warning = data.rainWarning;
    } catch { /* keep the manual flag */ }
  }
  return warning ? 'prepare' : 'return';
}

function renderStart(defaultMode) {
  state.defaultMode = defaultMode;
  for (const btn of $$('.mode-btn')) {
    const isDefault = btn.dataset.mode === defaultMode;
    btn.classList.toggle('is-default', isDefault);
    btn.querySelector('.mode-badge').hidden = !isDefault;
  }
  $('#hero-bubble').textContent = t(defaultMode === 'prepare' ? 'heroPrepare' : 'heroReturn');
  heroGecko?.setProp(defaultMode === 'prepare' ? 'hood' : 'torch');

  const today = bangkokDateKey();
  const parts = [`<b>${esc(t('daily', { date: formatHouseDate(today, getLang()) }))}</b>`];
  const s = streak();
  if (s >= 2) parts.push(esc(t('streak', { n: s })));
  const bp = bestScore('prepare'), br = bestScore('return');
  if (bp != null || br != null) {
    const best = Math.max(bp ?? 0, br ?? 0);
    parts.push(esc(t('best', { score: best })));
  }
  $('#daily-line').innerHTML = parts.join(' · ');

  const fUrl = forecastUrl();
  const fl = $('#forecast-link-start');
  if (fUrl) {
    fl.href = fUrl;
    fl.hidden = false;
  }

  const vEl = $('#app-version');
  if (vEl && content()?.config?.version) {
    vEl.textContent = `v${content().config.version}`;
  }

  const banner = $('#challenge-banner');
  if (state.challenge) {
    const c = state.challenge;
    const lead = t(c.mode === 'prepare' ? 'challengePrepare' : 'challengeReturn');
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

function houseLabel(key) {
  return /^\d{8}$/.test(key) ? formatHouseDate(key, getLang()) : t('cardRandomHouse');
}

function bindGlobal() {
  // Audio may only start after a real tap.
  const unlock = () => unlockAudio();
  addEventListener('pointerdown', unlock, { passive: true });
  addEventListener('keydown', unlock);

  for (const btn of $$('.mode-btn')) {
    btn.addEventListener('click', () => {
      track('mode_select', { mode: btn.dataset.mode, label: btn.dataset.mode === state.defaultMode ? 'default' : 'other' });
      startFlow(btn.dataset.mode, { kind: 'daily' });
    });
  }
  for (const b of $$('[data-open]')) {
    b.addEventListener('click', () => {
      const what = b.dataset.open;
      if (what === 'checklist') openChecklist(state.defaultMode);
      else if (what === 'help') openHelp();
      else if (what === 'about') openAbout();
    });
  }
  $('#forecast-link-start').addEventListener('click', () => track('forecast_click', { label: 'start' }));

  $('#btn-lang').textContent = t('langSwitch');
  $('#btn-lang').addEventListener('click', () => {
    setLang(getLang() === 'th' ? 'en' : 'th');
    track('lang', { label: getLang() });
    $('#btn-lang').textContent = t('langSwitch');
    applyStaticStrings();
    renderStart(state.defaultMode);
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
  });

  $('#btn-pause').addEventListener('click', () => pauseGame(true));
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
  const steps = t(mode === 'prepare' ? 'howtoPrepare' : 'howtoReturn');
  openSheet(`
    <h2 id="sheet-title">${esc(t(mode === 'prepare' ? 'howtoTitlePrepare' : 'howtoTitleReturn'))}</h2>
    <ol class="howto">${steps.map((s, i) => `<li><span class="n">${i + 1}</span><span>${esc(s)}</span></li>`).join('')}</ol>
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
  state.result = null;

  app.classList.remove('is-prepare', 'is-return');
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
  gameGecko = new Gecko($('#game-gecko'), { prop: mode === 'prepare' ? 'hood' : 'torch' });

  const round = new Round({
    house,
    config: C.config,
    on: { flood: onFlood, wet: onWet, end: onRoundEnd },
  });
  state.round = round;
  updateHud();
  state.scene.updateCounts(round.records);
  if (mode === 'prepare') state.scene.setWater(round.waterLevel);
  $('#gauge').classList.remove('low');
  say(pickLine(mode === 'prepare' ? 'geckoStartPrepare' : 'geckoStartReturn'), 3200);
  round.start();
  resetHintTimer();
  track('round_start', { mode, label: run.kind });
  loop();
}

function loop() {
  cancelAnimationFrame(state.raf);
  const step = () => {
    const r = state.round;
    if (!r || r.ended) return;
    if (r.running) {
      r.tick();
      updateHud();
      if (r.mode === 'prepare') state.scene.setWater(r.waterLevel);
      if (!state.lowWarned && r.remaining <= 10 && !r.ended) {
        state.lowWarned = true;
        $('#gauge').classList.add('low');
        say(t('geckoTimeLow'), 2200);
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
  $('#gauge-label').textContent = t('seconds', { s: Math.ceil(r.remaining) });
  const done = [...r.records.values()].filter((x) => x.status !== STATUS.PENDING).length;
  $('#hud-score').textContent = t('scoreHud', { done, total: r.records.size });
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
      say(note, 2200);
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
    say(t('floodedToast', { name: L(p.ref.name) }), 2400);
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
          <span class="ico" aria-hidden="true">${actionIcon(c.kind)}</span>
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
    links.push(`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.agency)}</a>`);
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
    say(pickLine('geckoCorrect'), 1800);
  } else {
    play('wrong');
    haptic(50);
    gameGecko.set('oops', { hold: 1800, anim: 'wobble' });
    floatText(stage, pt.x, pt.y, `−${res.penalty} ${t('seconds', { s: '' }).trim()}`, 'warn');
    state.scene.mark(p, 'learned');
    say(pickLine('geckoWrong'), 1800);
  }
  state.scene.updateCounts(r.records);
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
      <span class="label">${esc(t('tipLabel'))}</span>
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
  state.scene.updateCounts(state.round.records);
  play('blub');
  const now = performance.now();
  if (now - state.lastFloodLine > 3000) {
    state.lastFloodLine = now;
    say(pickLine('geckoFlood'), 1800);
    gameGecko?.set('oops', { hold: 1200 });
  }
}

function onWet() {
  say(t('geckoWet'), 3600);
  gameGecko?.set('wow', { hold: 1600, anim: 'wobble' });
}

async function onRoundEnd(result) {
  clearHintTimer();
  cancelAnimationFrame(state.raf);
  updateHud();
  state.scene.revealMissed(state.house.targets, state.round.records);
  closeSheet();
  hideBubble();
  play('fanfare');
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
  const map = { correct: '✅', learned: '💡', flooded: mode === 'prepare' ? '💧' : '⬜', missed: '⬜' };
  return grid.map((s) => map[s] || '⬜').join('');
}

async function showResult(result) {
  const C = content();
  const run = state.run;
  const mode = result.mode;
  const rank = rankTitle(mode, result.tier);
  const prog = recordResult(result, run.kind);
  const site = siteUrl();
  const cUrl = challengeUrl(site, mode, result.score10, run.houseKey);
  const grid = gridOf(result);
  const headlineKey = mode === 'prepare' ? 'resultPrepare' : 'resultReturn';
  const shareText = t(mode === 'prepare' ? 'shareTextPrepare' : 'shareTextReturn', {
    score: result.score10, rank, grid: emojiGrid(mode, grid), url: cUrl,
  });
  state.result = result;
  state.share = { text: shareText, url: cUrl, mode, blob: null, file: null, score: result.score10, emoji: mode === 'prepare' ? '🏠' : '⚡' };
  track('round_end', { mode, label: run.kind, value: result.score10 });

  const other = mode === 'prepare' ? 'return' : 'prepare';
  const vs = run.kind === 'challenge' && state.challenge
    ? (() => {
      const them = state.challenge.score;
      const me = result.score10;
      const line = me > them ? t('versusWin') : me === them ? t('versusTie') : t('versusLose');
      return `<div class="versus">${esc(t('versus', { me: `${me}/10`, them: `${them}/10` }))}<br>${esc(line)}</div>`;
    })() : '';

  const lessons = state.house.targets.map((p) => {
    const rec = result.records.find((r) => r.pid === p.pid);
    const data = rec.variant === 'wet' ? p.ref.wet : p.ref;
    const st = rec.status;
    const glyph = { correct: '✓', learned: '!', flooded: '~', missed: '?' }[st];
    const tag = { correct: 'stCorrect', learned: 'stLearned', flooded: 'stFlooded', missed: 'stMissed' }[st];
    return `<li class="lesson ${st}">
      <div class="row"><span class="st" aria-hidden="true">${glyph}</span>
        <div>
          <div class="name">${esc(L(p.ref.name))} <span class="tag">· ${esc(t(tag))}</span></div>
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
  const fUrl = forecastUrl();

  $('#result').innerHTML = `
    <div class="card-wrap">
      <img class="card-preview" id="card-img" alt="${esc(t(headlineKey, { score: result.score10 }))} · ${esc(rank)}">
      <p class="card-sub-hint">👆 ${esc(t('cardTapHint'))}</p>
    </div>
    <h1 id="result-title" class="sr-only">${esc(t(headlineKey, { score: result.score10 }))}</h1>
    <div class="stats">
      <span>${esc(t('statCorrect', { c: result.correct, n: result.total }))}</span>
      ${mode === 'prepare' && result.criticalTotal ? `<span>${esc(t('statBonus', { b: result.bonusHits }))}</span>` : ''}
      <span>${esc(t('statTime', { t: result.timeLeft }))}</span>
    </div>
    ${vs}
    <button class="btn" type="button" id="btn-share">📤 ${esc(t('shareCta'))}</button>
    <button class="btn secondary" type="button" id="btn-challenge">🏆 ${esc(t('challengeCta'))}</button>
    <h2 class="section-title">${esc(t('lessonTitle'))}</h2>
    <ul class="lessons">${lessons}</ul>
    <div class="btn-row">
      <button class="btn secondary small" type="button" id="btn-other">${esc(t('playOther', { mode: t(other === 'prepare' ? 'modePrepare' : 'modeReturn') }))}</button>
      <button class="btn secondary small" type="button" id="btn-random">🎲 ${esc(t('playRandom'))}</button>
    </div>
    <button class="btn secondary small" type="button" id="btn-home">${esc(t('home'))}</button>
    <h2 class="section-title">${esc(t('helpTitle'))}</h2>
    <ul class="help-list">${help}</ul>
    <p class="note">${esc(t('helpNote'))}</p>
    ${fUrl ? `<a class="btn blue" id="btn-forecast" href="${esc(fUrl)}" target="_blank" rel="noopener">🌧️ ${esc(t('forecastLong'))}</a>` : ''}
    <button class="btn secondary small" type="button" id="btn-checklist">📋 ${esc(t('checklists'))}</button>
    <p class="note">${esc(t('disclaimer'))}</p>`;
  showScreen('result');
  if (result.tier >= 2) confetti($('#screen-result'));

  $('#btn-share').addEventListener('click', () => shareResultNow());
  $('#btn-challenge').addEventListener('click', () => shareChallenge());
  $('#btn-other').addEventListener('click', () => startFlow(other, { kind: 'daily' }));
  $('#btn-random').addEventListener('click', () => startFlow(mode, { kind: 'random' }));
  $('#btn-home').addEventListener('click', () => goHome());
  $('#btn-checklist').addEventListener('click', () => openChecklist(mode));
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
      mode,
      tier: result.tier,
      modeLabel: t(mode === 'prepare' ? 'modePrepare' : 'modeReturn'),
      headline: t(headlineKey, { score: '' }).replace(/\s*\/10\s*$/, '').trim(),
      scoreText: `${result.score10}/10`,
      rankTitle: rank,
      grid,
      cta: t('cardChallenge'),
      url: site,
      footer: t('cardFooter'),
      houseLabel: run.kind === 'random' ? t('cardRandomHouse') : t('cardHouse', { date: houseLabel(run.houseKey) }),
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
  if (prog.isBest && prog.plays > 1) toast(`${t('best', { score: result.score10 })} 🎉`, 2200);
}

async function shareResultNow() {
  const s = state.share;
  if (!s) return;
  track('share_open', { mode: s.mode, label: 'result' });
  if (canNativeShare()) {
    const outcome = await nativeShare({ file: s.file, title: 'บ้านรอดไหม?', text: s.text, url: s.url });
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
  const text = t('challengeText', { score: s.score, emoji: s.emoji, url: s.url });
  track('share_open', { mode: s.mode, label: 'challenge' });
  if (canNativeShare()) {
    const outcome = await nativeShare({ title: 'บ้านรอดไหม?', text, url: s.url });
    if (outcome === 'shared') {
      track('share_click', { mode: s.mode, label: 'challenge-native' });
      return;
    }
    if (outcome === 'cancelled') return;
  }
  openShareSheet({ ...s, text, imgSrc: null });
}

function openShareSheet({ text, url, blob, file, mode, filename, imgSrc }) {
  const app = inAppBrowser();
  const nativeOk = canNativeShare();
  const saveOk = blob && canDownload();
  openSheet(`
    <h2 id="sheet-title">${esc(t('shareTitle'))}</h2>
    ${imgSrc ? `<img class="card-preview" src="${esc(imgSrc)}" alt="">` : ''}
    ${app === 'line' ? `<p class="line-guide">💬 ${esc(t('lineGuideText'))}</p>` : ''}
    <div class="share-grid">
      ${nativeOk ? `<button class="share-btn" data-ch="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
      <button class="share-btn" data-ch="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
      <button class="share-btn" data-ch="facebook"><span class="ico ico-fb">f</span>${esc(t('shareFb'))}</button>
      <button class="share-btn" data-ch="x"><span class="ico ico-x">X</span>${esc(t('shareX'))}</button>
      <button class="share-btn" data-ch="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
      ${saveOk ? `<button class="share-btn" data-ch="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}
    </div>
    ${imgSrc && !saveOk ? `<p class="save-hint">💡 ${esc(t('saveHint'))}</p>` : ''}
    ${app === 'line' && imgSrc ? `<a class="link" href="${esc(lineExternalUrl(location.href))}">${esc(t('openExternal'))}</a>` : ''}
    <button class="btn secondary small" type="button" id="share-close">${esc(t('close'))}</button>`);
  $('#share-close').addEventListener('click', () => closeSheet());
  for (const b of $$('[data-ch]', $('#sheet'))) {
    b.addEventListener('click', async () => {
      const ch = b.dataset.ch;
      if (ch === 'native') {
        const o = await nativeShare({ file, title: 'บ้านรอดไหม?', text, url });
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
  app.classList.remove('is-prepare', 'is-return');
  showScreen('start');
  renderStart(state.defaultMode);
  if (state.updateReady) toast(t('updateReady'), 3200);
}

// ------------------------------------------------------------------ sheets

async function openChecklist(mode) {
  const C = content();
  track('checklist_open', { mode });
  const list = C.checklists[mode];
  const other = mode === 'prepare' ? 'return' : 'prepare';
  openSheet(`
    <h2 id="sheet-title">${esc(t('checklistTitle'))}</h2>
    <div class="seg" role="group">
      <button type="button" data-cl="prepare" aria-pressed="${mode === 'prepare'}">${esc(t('checklistTabPrepare'))}</button>
      <button type="button" data-cl="return" aria-pressed="${mode === 'return'}">${esc(t('checklistTabReturn'))}</button>
    </div>
    <img class="card-preview" id="cl-img" alt="${esc(L(list.title))}">
    <div class="share-grid" id="cl-share"></div>
    <p class="save-hint" id="cl-hint" hidden>💡 ${esc(t('saveHint'))}</p>
    <h3>${esc(L(list.title))}</h3>
    <ol class="check-list">${list.items.map((it) => `<li><span>${esc(it.icon)} ${esc(L(it))}</span></li>`).join('')}</ol>
    <button class="btn secondary small" type="button" id="cl-close">${esc(t('close'))}</button>`);
  $('#cl-close').addEventListener('click', () => closeSheet());
  $(`[data-cl="${other}"]`).addEventListener('click', () => openChecklist(other));

  const assets = state.cardAssets || (state.cardAssets = await loadCardAssets());
  const canvas = document.createElement('canvas');
  drawChecklist(canvas, checklistData(mode), assets);
  const blob = await canvasToBlob(canvas);
  const img = $('#cl-img');
  if (!img) return; // sheet closed meanwhile
  img.src = await imageSrc(blob);
  const url = `${siteUrl()}/checklist/${mode}`;
  const text = t('shareTextChecklist', { title: L(list.title), url: siteUrl() });
  let file = null;
  try { file = new File([blob], `baanrodmai-checklist-${mode}.png`, { type: 'image/png' }); } catch { /* old browser */ }
  const saveOk = canDownload();
  $('#cl-share').innerHTML = `
    ${canNativeShare() ? `<button class="share-btn" data-c="native"><span class="ico ico-native">⇪</span>${esc(t('checklistShare'))}</button>` : ''}
    <button class="share-btn" data-c="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
    <button class="share-btn" data-c="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
    ${saveOk ? `<button class="share-btn" data-c="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}`;
  $('#cl-hint').hidden = saveOk;
  for (const b of $$('[data-c]', $('#cl-share'))) {
    b.addEventListener('click', async () => {
      const c = b.dataset.c;
      track('checklist_save', { mode, label: c });
      if (c === 'native') await nativeShare({ file, title: L(list.title), text, url });
      else if (c === 'line') shareChannel('line', { text: `${text}\n${url}`, url, mode });
      else if (c === 'copy') {
        await copyText(`${text}\n${url}`);
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
    title: L(list.title),
    subtitle: t('clSubtitle'),
    items: list.items.map((it) => ({ text: L(it), sprite: it.sprite })),
    helpLabel: t('clHelpLabel'),
    helpNumbers: main.join('  ·  '),
    url: siteUrl(),
    forward: t('clForward'),
    footer: t('cardFooter'),
  };
}

function openHelp() {
  const C = content();
  const help = C.helplines.map((h) => `
    <li><a href="tel:${esc(h.number)}" data-help="${esc(h.number)}">
      <span class="num">${esc(h.number)}</span>
      <span class="who">${esc(L(h.who))}<span class="what">${esc(L(h.what))}</span></span>
    </a></li>`).join('');
  const fUrl = forecastUrl();
  openSheet(`
    <h2 id="sheet-title">${esc(t('helpTitle'))}</h2>
    <ul class="help-list">${help}</ul>
    <p class="note">${esc(t('helpNote'))}</p>
    ${fUrl ? `<a class="btn blue" href="${esc(fUrl)}" target="_blank" rel="noopener" id="help-forecast">🌧️ ${esc(t('forecastLong'))}</a>` : ''}
    <button class="btn secondary small" type="button" id="help-close">${esc(t('close'))}</button>`);
  $('#help-close').addEventListener('click', () => closeSheet());
  $('#help-forecast')?.addEventListener('click', () => track('forecast_click', { label: 'help' }));
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
    <li><b>${esc(agency)}</b><ul>${list.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}${s.date ? `<span class="tag">(${esc(s.date)})</span>` : ''}</a></li>`).join('')}</ul></li>`).join('');
  openSheet(`
    <h2 id="sheet-title">${esc(t('aboutTitle'))}</h2>
    <p>${esc(t('aboutIntro'))}</p>
    <h3>${esc(t('aboutPrivacyTitle'))}</h3>
    <p>${esc(t('aboutPrivacy'))}</p>
    <h3>${esc(t('aboutSourcesTitle'))}</h3>
    <ul class="sources">${srcHtml}</ul>
    <p class="note">${esc(t('aboutCredits'))} · <span class="tag">v${esc(C.config.version || '1.0')}</span></p>
    <p class="note">${esc(t('disclaimer'))}</p>
    <button class="btn secondary small" type="button" id="about-close">${esc(t('close'))}</button>`);
  $('#about-close').addEventListener('click', () => closeSheet());
}

// ------------------------------------------------------------------ offline

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

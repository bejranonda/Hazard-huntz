// "How ready is our house?" (/?open=kit) and the family plan card
// (/?open=plan). Loaded only when one of them opens. Answers, ticks and the
// plan's text stay on this device (localStorage brm:kit, brm:plan); only
// anonymous counts are sent (kit_open, kit_share, plan_share), never the text.

import { $, $$, esc, store, bangkokDateKey, formatHouseDate } from './util.js';
import { t, L, getLang, siteUrl, content, agencyName } from './content.js';
import { openSheet, closeSheet, toast, canPrint, printList } from './ui.js';
import { kit as draw, loadCardAssets, canvasToBlob, wrapText, drawCalls } from './cards.js';
import {
  canNativeShare, nativeShare, shareChannel, copyText, canDownload, downloadBlob, imageSrc, openExternal, lineShareUrl,
} from './share.js';
import { track } from './analytics.js';
import { kitPlan, kitScore, kitMissing, fridgePlan, fridgeFoods, medDays, airAdvice } from './kitplan.js';
import { modeLink } from './modes.js';

let K = null;
let assets = null;

async function loadKit() {
  if (!K) K = await fetch('/content/kit.json').then((r) => r.json());
  return K;
}

const u = (key, vars = {}) => String(K.ui[getLang()]?.[key] ?? K.ui.th[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
// /kit and /plan are pages with their own link preview (a sample card) that open the tool.
const pageUrl = (tool) => `${siteUrl()}${getLang() === 'en' ? '/en' : ''}/${tool}`;
const agencies = (ids = []) => [...new Set(ids.map((id) => content().sources[id]?.agency).filter(Boolean))].map(agencyName).join(' · ');

function saved() {
  const s = store.get('kit', null);
  return s && typeof s === 'object' ? s : null;
}

export async function openKit(from = 'start', mode = '') {
  await loadKit();
  track('kit_open', { label: from, mode });
  const s = saved();
  if (s?.answered) showList(s);
  else showQuestions(s || { people: K.people.default, flags: [], have: [] });
}

function showQuestions(s) {
  let n = s.people || K.people.default;
  openSheet(`
    <h2 id="sheet-title">🎒 ${esc(u('title'))}</h2>
    <p class="sub">${esc(u('intro'))}</p>
    <p class="kit-q" id="kit-people-label">${esc(u('people'))}</p>
    <div class="stepper" role="group" aria-labelledby="kit-people-label">
      <button class="step-btn" type="button" id="kit-minus" aria-label="${esc(u('less'))}">−</button>
      <output id="kit-n" aria-live="polite">${n}</output>
      <button class="step-btn" type="button" id="kit-plus" aria-label="${esc(u('more'))}">+</button>
    </div>
    <p class="kit-q">${esc(u('who'))}</p>
    <div class="kit-flags">${K.flags.map((f) => `<label class="kit-flag"><input type="checkbox" value="${esc(f.id)}"${(s.flags || []).includes(f.id) ? ' checked' : ''}><span>${esc(f.icon)} ${esc(L(f.label))}</span></label>`).join('')}</div>
    <p class="kit-privacy">🔒 ${esc(u('privacy'))}</p>
    <button class="btn" type="button" id="kit-go">${esc(u('show'))}</button>
    <button class="btn secondary small" type="button" id="kit-close">${esc(u('close'))}</button>`, { label: u('title') });
  const paint = () => { $('#kit-n').textContent = n; };
  $('#kit-minus').addEventListener('click', () => { n = Math.max(K.people.min, n - 1); paint(); });
  $('#kit-plus').addEventListener('click', () => { n = Math.min(K.people.max, n + 1); paint(); });
  $('#kit-close').addEventListener('click', () => closeSheet());
  $('#kit-go').addEventListener('click', () => {
    const flags = $$('.kit-flag input', $('#sheet')).filter((i) => i.checked).map((i) => i.value);
    const next = { ...s, people: n, flags, answered: true, have: s.have || [] };
    showList(next);
  });
}

function qtyText(x) {
  const unit = L(x.item.qty?.unit) || '';
  if (x.kind === 'perPersonDay') return u('qtyPerPersonDay', { total: x.total, unit, per: x.per, people: x.people, days: x.days });
  if (x.kind === 'perPerson') return u('qtyPerPerson', { total: x.total, unit, per: x.per });
  if (x.kind === 'daysPeople') return u('qtyDaysPeople', { days: x.days, people: x.people });
  if (x.kind === 'days') return u('qtyDays', { days: x.days });
  return '';
}

function persist(s, plan) {
  const sc = kitScore(plan, s.have);
  const keep = { people: s.people, flags: s.flags, have: s.have.filter((id) => plan.items.some((x) => x.id === id)), answered: true, pct: sc.pct, date: bangkokDateKey() };
  store.set('kit', keep);
  // The start screen's button shows the new score at once, not after a reload.
  const chip = document.getElementById('kit-chip');
  if (chip) chip.textContent = t('hubKitScore', { pct: sc.pct });
  return { keep, sc };
}

function showList(s) {
  const plan = kitPlan(K, s);
  // "How many days will the pills last?" under the medicine line; nothing typed is kept.
  const meds = plan.items.find((x) => x.id === 'meds' && x.item.qty?.days);
  s = { ...s, people: plan.people, have: s.have || [] };
  persist(s, plan);
  openSheet(`
    <h2 id="sheet-title">🎒 ${esc(u('title'))}</h2>
    <p class="kit-house">${esc(u('household', { n: plan.people }))} · <button class="link" type="button" id="kit-edit">${esc(u('edit'))}</button></p>
    <div class="kit-meter" aria-hidden="true"><span id="kit-bar"></span></div>
    <p class="kit-score"><b id="kit-pct"></b> <span id="kit-count"></span></p>
    <p class="sub">${esc(u('tickHint'))}</p>
    <ul class="kit-list">${plan.items.map((x) => `
      <li><label class="kit-row">
        <input type="checkbox" data-id="${esc(x.id)}"${s.have.includes(x.id) ? ' checked' : ''}>
        <span class="kit-ico" aria-hidden="true">${esc(x.item.icon)}</span>
        <span class="kit-text"><b>${esc(L(x.item.label))}</b>${qtyText(x) ? `<span class="kit-qty">${esc(qtyText(x))}</span>` : ''}
          <span class="kit-src">${esc(u('source'))}: ${esc(agencies(x.item.sources))}${x.item.verify !== 'verified' ? ' · ⚠️' : ''}</span></span>
      </label></li>`).join('')}
    </ul>
    ${plan.items.some((x) => x.item.verify !== 'verified') ? `<p class="kit-src kit-note">${esc(t('guidePartial'))}</p>` : ''}
    ${meds ? `<details class="kit-calc" id="med-calc"><summary>💊 ${esc(u('medCalc'))}</summary>
      <div class="calc-row">
        <label class="calc-field"><span>${esc(u('medLeft'))}</span><input type="number" id="med-left" min="0" max="9999" step="1" inputmode="numeric"></label>
        <label class="calc-field"><span>${esc(u('medPerDay'))}</span><input type="number" id="med-day" min="0.5" max="50" step="0.5" inputmode="decimal"></label>
      </div>
      <p class="calc-out" id="med-out" aria-live="polite">${esc(u('medHint', { target: meds.item.qty.days }))}</p>
    </details>` : ''}
    <button class="btn" type="button" id="kit-share">${esc(u('share'))}</button>
    <button class="btn secondary" type="button" id="kit-plan">${esc(u('plan'))}</button>
    ${canPrint() ? `<button class="btn secondary small" type="button" id="kit-print">${esc(t('printBtn'))}</button>` : ''}
    <button class="btn secondary small" type="button" id="kit-close">${esc(u('close'))}</button>`, { label: u('title') });
  const paint = () => {
    const sc = kitScore(plan, s.have);
    $('#kit-pct').textContent = u('ready', { pct: sc.pct });
    $('#kit-count').textContent = `(${u('count', { have: sc.have, total: sc.total })})`;
    $('#kit-bar').style.width = `${sc.pct}%`;
  };
  paint();
  for (const box of $$('.kit-row input', $('#sheet'))) {
    box.addEventListener('change', () => {
      const id = box.dataset.id;
      s.have = box.checked ? [...new Set([...s.have, id])] : s.have.filter((x) => x !== id);
      persist(s, plan);
      paint();
    });
  }
  $('#kit-edit').addEventListener('click', () => showQuestions(s));
  const medCalc = () => {
    const target = meds.item.qty.days;
    const left = $('#med-left').value;
    const perDay = $('#med-day').value;
    const r = left !== '' && perDay !== '' ? medDays({ left, perDay, target }) : null;
    $('#med-out').textContent = !r ? u('medHint', { target }) : r.enough ? u('medEnough', { days: r.days, target }) : u(r.days ? 'medShort' : 'medNone', { days: r.days, target, need: r.need });
    $('#med-out').classList.toggle('is-ok', !!r?.enough);
    $('#med-out').classList.toggle('is-short', !!r && !r.enough);
  };
  if (meds) for (const id of ['#med-left', '#med-day']) $(id).addEventListener('input', medCalc);
  // A list to tick on paper: what this household needs, ticked or not, with the sources.
  $('#kit-print')?.addEventListener('click', () => {
    track('print', { label: 'kit' });
    printList({
      brand: `${t('logoA')}${t('logoB')}`,
      title: u('title'),
      sub: u('household', { n: plan.people }),
      sections: [{ head: '', items: plan.items.map((x) => ({ text: `${L(x.item.label)}${qtyText(x) ? `: ${qtyText(x)}` : ''}`, note: `${u('source')}: ${agencies(x.item.sources)}${x.item.verify !== 'verified' ? ` · ${u('partial')}` : ''}` })) }],
      foot: [t('printNote', { url: pageUrl('kit').replace(/^https?:\/\//, ''), date: formatHouseDate(bangkokDateKey(), getLang()) }), t('disclaimer')],
    });
  });
  $('#kit-close').addEventListener('click', () => closeSheet());
  $('#kit-plan').addEventListener('click', () => openPlan('kit'));
  $('#kit-share').addEventListener('click', async () => {
    const sc = kitScore(plan, s.have);
    const allMissing = kitMissing(plan, s.have, Infinity);
    const missing = allMissing.slice(0, 3).map((x) => L(x.item.label));
    assets = assets || await loadCardAssets();
    const canvas = document.createElement('canvas');
    drawKitCard(canvas, {
      logo: [t('logoA'), t('logoB')], title: u('cardTitle'), pct: sc.pct, count: u('cardCount', { have: sc.have, total: sc.total }),
      missingLabel: allMissing.length > 3 ? u('cardMissingN', { n: allMissing.length }) : u('cardMissing'), missing, allSet: u('cardAllSet'), cta: u('cardCta'), url: pageUrl('kit'), footer: t('cardFooter'),
    }, assets);
    const url = pageUrl('kit');
    shareImage({
      canvas, title: u('shareTitle'), text: u('shareText', { pct: sc.pct, url }), url, filename: 'baanrodmai-kit.png',
      event: 'kit_share', value: sc.pct, back: () => showList(s), backLabel: u('back'),
      // "What we still need": the missing rows with their amounts, for the shopping trip.
      copy: allMissing.length ? { label: u('kitCopy'), text: () => [u('kitCopyHead', { n: plan.people }), ...allMissing.map((x) => `• ${L(x.item.label)}${qtyText(x) ? `: ${qtyText(x)}` : ''}`), pageUrl('kit')].join('\n') } : null,
    });
  });
}

// ------------------------------------------------------------------ the plan card

// `again`: back from the card to the form, which is not a new arrival.
export async function openPlan(from = 'start', again = false) {
  await loadKit();
  if (!again) track('plan_open', { label: from });
  const p = store.get('plan', null) || {};
  openSheet(`
    <h2 id="sheet-title">📝 ${esc(u('planTitle'))}</h2>
    <p class="sub">${esc(u('planIntro'))}</p>
    <p class="kit-privacy">🔒 ${esc(u('planPrivacy'))}</p>
    <div class="plan-form">${K.plan.map((f) => `
      <label class="plan-field"><span class="plan-label">${esc(f.icon)} ${esc(L(f.label))}</span>
        <input type="text" name="${esc(f.id)}" maxlength="${f.max}" value="${esc(p[f.id] || '')}" placeholder="${esc(L(f.placeholder))}" autocomplete="off">
        ${f.hint ? `<small>${esc(L(f.hint))} (${esc(agencies(f.sources))}${f.verify !== 'verified' ? ` · ${esc(u('partial'))}` : ''})</small>` : ''}
      </label>`).join('')}
    </div>
    <button class="btn" type="button" id="plan-make">${esc(u('planMake'))}</button>
    ${from === 'kit' ? `<button class="btn secondary small" type="button" id="plan-back">${esc(u('back'))}</button>` : ''}
    <button class="btn secondary small" type="button" id="plan-close">${esc(u('close'))}</button>`, { label: u('planTitle') });
  const read = () => Object.fromEntries(K.plan.map((f) => [f.id, ($(`.plan-form input[name="${f.id}"]`)?.value || '').trim().slice(0, f.max)]));
  for (const input of $$('.plan-form input', $('#sheet'))) {
    input.addEventListener('change', () => store.set('plan', { ...read(), date: bangkokDateKey() }));
  }
  $('#plan-close').addEventListener('click', () => closeSheet());
  $('#plan-back')?.addEventListener('click', () => openKit('plan'));
  $('#plan-make').addEventListener('click', async () => {
    const v = read();
    if (!Object.values(v).some(Boolean)) {
      toast(u('planEmpty'));
      return;
    }
    const date = bangkokDateKey();
    store.set('plan', { ...v, date });
    assets = assets || await loadCardAssets();
    const canvas = document.createElement('canvas');
    const C = content();
    drawPlanCard(canvas, {
      logo: [t('logoA'), t('logoB')], title: u('planTitle'), date: u('planDate', { date: formatHouseDate(date, getLang()) }),
      rows: K.plan.map((f) => ({ label: L(f.label), value: v[f.id] })),
      helpLabel: u('helpLabel'), helpNumbers: C.helplines.filter((h) => h.main).map((h) => h.number).join('  ·  '),
      calls: C.helplines.filter((h) => h.main).map((h) => ({ number: h.number, name: L(h.short) })),
      keep: u('planKeep'), url: pageUrl('plan'), footer: t('cardFooter'),
    }, assets);
    const url = pageUrl('plan');
    shareImage({
      canvas, title: u('planShareTitle'), text: u('planShareText', { url }), url, filename: 'baanrodmai-plan.png',
      event: 'plan_share', back: () => openPlan(from, true), backLabel: u('backPlan'),
      copy: {
        label: u('planCopy'),
        text: () => [
          u('planTitle'),
          ...K.plan.filter((f) => v[f.id]).map((f) => `${f.icon} ${L(f.label)}: ${v[f.id]}`),
          `${u('helpLabel')}: ${C.helplines.filter((h) => h.main).map((h) => `${h.number} ${L(h.short)}`).join(' · ')}`,
        ].join('\n'),
      },
    });
  });
}

// ------------------------------------------------------------------ power cut: the fridge

// "Is the food in the fridge still safe?" (/fridge, /?open=fridge): how long the
// power has been off → how much longer each part of the fridge stays safe, live,
// and food by food what to throw out and what to keep (v1.11.0).
// The start time stays on this device (brm:fridge), so it keeps counting after
// the page is closed; nothing about it is sent (tool_open counts the opening).
const HOUR = 3600e3;
// Times read "about", to the nearest minute, so a time just tapped doesn't read
// "59 นาที"; a time left of 3 hours or more reads in whole hours ("ราว 45 ชม.").
// The time off keeps its minutes, so it never reads "4 ชม." when a card already
// says "เกิน 4 ชม.แล้ว". ✅ ⏳ ❌ always come from the exact time.
function span(hours, whole = false) {
  whole = whole && hours >= 3;
  const total = whole ? Math.round(hours) * 60 : Math.max(0, Math.round(hours * 60));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return u('minutes', { n: m });
  return m ? u('fridgeElapsed', { h, m }) : u('hours', { n: h });
}
// The clock time the power went off, for the message sent to the family (it may be read hours later).
const clock = (ms) => {
  const hm = new Date(ms).toLocaleTimeString(getLang() === 'th' ? 'th-TH' : 'en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' });
  return getLang() === 'th' ? `${hm} น.` : hm;
};

function fridgeSaved() {
  const s = store.get('fridge', null);
  // A count older than a week is from another power cut; a cut that ended a day ago is done with.
  const ok = s && Number.isFinite(s.start) && Date.now() - s.start < 7 * 24 * HOUR && s.start <= Date.now() && !(s.end && Date.now() - s.end > 24 * HOUR);
  return ok ? s : null;
}

export async function openFridge(from = 'start') {
  await loadKit();
  track('tool_open', { mode: 'fridge', label: from });
  const F = K.fridge;
  // start: when the power went off (null until a time is tapped); end: when "the power's back" was tapped.
  const s = { start: null, end: null, freezer: F.freezer[0].id, med: false, milk: false, ...fridgeSaved() };
  const hoursNow = () => ((s.end || Date.now()) - s.start) / HOUR;
  // The start screen's button says "ไฟดับมาเกิน 3 ชม.แล้ว" at once, not after a reload.
  const chip = () => {
    const c = document.getElementById('fridge-chip');
    if (!c) return;
    const h = s.start ? Math.floor(hoursNow()) : -1;
    c.textContent = h < 0 ? t('hubFridgeSub') : s.end ? t('hubFridgeBack') : h ? t('hubFridgeRunning', { h }) : t('hubFridgeJust');
  };
  const save = () => { store.set('fridge', s.start ? { start: s.start, end: s.end, picked: s.picked, freezer: s.freezer, med: s.med, milk: s.milk } : null); chip(); };
  const timeName = (h) => (!h ? u('fridgeJust') : h % 24 ? u('hours', { n: h }) : h === 24 ? u('fridgeDay') : u('fridgeDays', { n: h / 24 }));
  const fill = (x, vars) => Object.entries(vars).reduce((str, [key, v]) => str.replaceAll(`{${key}}`, v), L(x));
  const flag = (id, icon, label, on) => `<label class="kit-flag fr-flag"><input type="checkbox" id="${id}"${on ? ' checked' : ''}><span>${icon} ${esc(label)}</span></label>`;
  const srcIds = [...new Set([...F.parts, ...F.foods, ...F.frozen, ...F.always].flatMap((x) => x.sources))];
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🥛 ${esc(u('fridgeTitle'))}</h2>
    <p class="sub">${esc(u('fridgeIntro'))}</p>
    <p class="kit-q" id="fr-hours-label">${esc(u('fridgeHours'))}</p>
    <div class="fr-times" role="radiogroup" aria-labelledby="fr-hours-label">${F.quick.map((h) => `<button class="fr-time" type="button" role="radio" aria-checked="false" data-h="${h}">${esc(timeName(h))}</button>`).join('')}</div>
    <p class="fr-hint">${esc(u('fridgeHint'))}</p>
    <details class="fr-clock" id="fr-clock"><summary>${esc(u('fridgeClock'))}</summary><div class="fr-clock-row"><input type="time" id="fr-at" aria-label="${esc(u('fridgeClock'))}"><button class="btn secondary small" type="button" id="fr-at-use">${esc(u('fridgeClockUse'))}</button></div></details>
    <div class="fr-count" id="fr-count" hidden><p id="fr-elapsed" aria-live="polite"></p><button class="btn secondary small" type="button" id="fr-reset">💡 ${esc(u('fridgeReset'))}</button><button class="btn secondary small" type="button" id="fr-again" hidden>${esc(u('fridgeAgain'))}</button></div>
    <div class="fr-flags">${flag('fr-med', '💊', u('fridgeMed'), s.med)}${flag('fr-milk', '🤱', u('fridgeMilk'), s.milk)}</div>
    <h3 class="fr-head">${esc(u('fridgeNowHead'))}</h3>
    <div class="fr-out" id="fr-out"></div>
    <h3 class="fr-head">${esc(u('fridgeAlways'))}</h3>
    <ul class="fr-always">${F.always.map((a) => `<li><span aria-hidden="true">${esc(a.icon)}</span> ${esc(L(a.text))}</li>`).join('')}</ul>
    <p class="kit-src">⚠️ ${esc(u('fridgeIntl'))}<br>${esc(u('source'))}: ${esc(agencies(srcIds))}</p>
    <p class="kit-privacy">🔒 ${esc(u('fridgePrivacy'))}</p>
    <div class="fr-share" id="fr-share-row"></div>
    <button class="btn secondary" type="button" id="fr-kit">${esc(u('fridgeKit'))}</button>
    <button class="btn secondary small" type="button" id="fr-close">${esc(u('close'))}</button>`, { label: u('fridgeTitle') });
  // One card per part: the word that answers the question, then one line.
  // Medicine is never "throw it out": past its day it says "check the label" (🔎).
  const ICON = { ok: '✅', soon: '⏳', over: '❌', check: '🔎' };
  const say = (x) => `${ICON[x.status]} ${fill(x.part.say[x.status], { h: x.limit })}`;
  const detail = (x) => {
    if (x.status === 'over' || x.status === 'check') return L(x.part.over);
    const left = span(x.left, true);
    return x.part.ok ? fill(x.part.ok, { left }) : u('fridgeLeft', { left, cond: L(x.part.cond) });
  };
  const plan = () => fridgePlan(F, { hours: hoursNow(), freezer: s.freezer, med: s.med, milk: s.milk });
  // Food by food: in the fridge the two lists ("throw out" / "keep"), headed by
  // whether the fridge's time is up; in the freezer, once its time is up, each pack.
  const row = (f, extra = '') => `<li><span class="fr-ico" aria-hidden="true">${esc(f.icon)}</span><span>${esc(L(f.label))}${extra}</span></li>`;
  const verdict = (v) => u(v === 'refreeze' ? 'fridgeRefreeze' : 'fridgeDiscard');
  const frozenRow = (f) => {
    if (f.crystals === f.thawed) return row(f, `<small>${esc(f.crystals === 'discard' ? u('fridgeMelting') : verdict(f.crystals))}</small>`);
    return row(f, `<small>${esc(u('fridgeCrystals'))} → ${esc(verdict(f.crystals))} · ${esc(u('fridgeThawed'))} → ${esc(verdict(f.thawed))}</small>`);
  };
  const foodsHtml = (x, food) => {
    if (x.id === 'fridge') {
      const h = x.limit;
      return `<p class="fr-group is-toss">${esc(food.over ? u('fridgeToss') : u('fridgeTossIf', { h }))}</p><ul class="fr-foods">${food.toss.map((f) => row(f)).join('')}</ul>`
        + `<p class="fr-group is-keep">${esc(food.over ? u('fridgeKeep') : u('fridgeKeepIf'))}</p><ul class="fr-foods">${food.keep.map((f) => row(f)).join('')}</ul>`
        + `<p class="fr-other">${esc(u('fridgeOther'))}</p>`;
    }
    if (x.id === 'freezer' && food.frozenOver) return `<ul class="fr-foods">${food.frozen.map(frozenRow).join('')}</ul><p class="fr-other">${esc(u('fridgeOther'))}</p>`;
    return '';
  };
  const cards = () => {
    if (!s.start) {
      $('#fr-out').innerHTML = `<p class="fr-pick">👆 ${esc(u('fridgePick'))}</p>`;
      return;
    }
    $('#fr-out').innerHTML = plan().map((x) => `
      <div class="fr-card" data-part="${esc(x.id)}">
        <p class="fr-card-head"><span aria-hidden="true">${esc(x.part.icon)}</span> <b>${esc(L(x.part.label))}</b></p>
        <p class="fr-say"></p>
        <p class="fr-detail"></p>
        ${x.part.note ? `<p class="fr-note">${esc(L(x.part.note))}</p>` : ''}
        ${x.part.tip ? `<p class="fr-tip">❄️ ${esc(L(x.part.tip))}</p>` : ''}
        ${x.part.hoursBy && x.id === 'freezer' ? `<div class="fr-seg" role="radiogroup" aria-label="${esc(u('fridgeFreezer'))}"><span>${esc(u('fridgeFreezer'))}</span>${F.freezer.map((z) => `<label class="kit-flag"><input type="radio" name="fr-freezer" value="${esc(z.id)}"${z.id === s.freezer ? ' checked' : ''}><span>${esc(L(z.label))}</span></label>`).join('')}</div>` : ''}
        ${x.id === 'fridge' || x.id === 'freezer' ? '<div class="fr-food"></div>' : ''}
      </div>`).join('');
    for (const r of $$('input[name="fr-freezer"]', $('#fr-out'))) r.addEventListener('change', () => { s.freezer = r.value; save(); tick(); });
    tick();
  };
  // The time moves on by itself; only the words change, so a tap on the freezer answer stays put.
  const tick = () => {
    if (!document.getElementById('fr-out')) return false;
    $('#fr-count').hidden = !s.start;
    $('#fr-reset').hidden = !!s.end;
    $('#fr-again').hidden = !s.end;
    for (const b of $$('.fr-time', $('#sheet'))) b.setAttribute('aria-checked', String(s.start != null && Number(b.dataset.h) === s.picked));
    if (!s.start) return true;
    $('#fr-elapsed').textContent = s.end ? u('fridgeBack', { elapsed: span(hoursNow()) }) : hoursNow() < 1 / 60 ? u('fridgeCountingJust') : u('fridgeCounting', { elapsed: span(hoursNow()) });
    const p = plan();
    const food = fridgeFoods(F, p);
    for (const x of p) {
      const card = $(`.fr-card[data-part="${x.id}"]`, $('#fr-out'));
      if (!card) continue;
      card.className = `fr-card is-${x.status}`;
      $('.fr-say', card).textContent = say(x);
      $('.fr-detail', card).textContent = detail(x);
      const note = $('.fr-note', card);
      if (note) note.hidden = x.status === 'over' || x.status === 'check';
      const tip = $('.fr-tip', card);
      // "Move it into a cool box" is for the hour before the fridge's time is up, not after.
      if (tip) tip.hidden = x.part.tipAt === 'soon' && x.status !== 'soon';
      const list = $('.fr-food', card);
      if (list) {
        const html = foodsHtml(x, food);
        if (list.dataset.html !== html) { list.innerHTML = html; list.dataset.html = html; }
      }
    }
    return true;
  };
  cards();
  // Live while the sheet is open; stops by itself once another sheet replaces it.
  const timer = setInterval(() => { if (!tick()) clearInterval(timer); }, 20e3);
  const begin = (start, picked = null) => {
    s.start = start;
    s.picked = picked;
    s.end = null;
    save();
    cards();
    // The answer is long since v1.11.0 (food by food), so its start is brought to the top.
    $('#fr-out').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  for (const b of $$('.fr-time', $('#sheet'))) b.addEventListener('click', () => begin(Date.now() - Number(b.dataset.h) * HOUR, Number(b.dataset.h)));
  // "It went off at 20:00": today at that time, or yesterday if that is still to come.
  $('#fr-at-use').addEventListener('click', () => {
    const [hh, mm] = String($('#fr-at').value || '').split(':').map(Number);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) { $('#fr-at').focus(); return; }
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    if (d.getTime() > Date.now()) d.setDate(d.getDate() - 1);
    begin(d.getTime());
  });
  $('#fr-med').addEventListener('change', (e) => { s.med = e.target.checked; save(); cards(); });
  $('#fr-milk').addEventListener('change', (e) => { s.milk = e.target.checked; save(); cards(); });
  // "The power's back" keeps the answer (what to throw out now); "start again" clears it.
  $('#fr-reset').addEventListener('click', () => { s.end = Date.now(); save(); tick(); });
  $('#fr-again').addEventListener('click', () => { s.start = null; s.end = null; s.picked = null; save(); cards(); tick(); toast(u('fridgeCleared')); });
  $('#fr-kit').addEventListener('click', () => { clearInterval(timer); openKit('fridge'); });
  $('#fr-close').addEventListener('click', () => { clearInterval(timer); closeSheet(); });
  textShare($('#fr-share-row'), {
    label: u('fridgeShare'), title: u('fridgeTitle'), url: pageUrl('fridge'), mode: 'fridge',
    text: () => {
      if (!s.start) return [u('fridgeTitle'), `(${agencies(srcIds)} · ⚠️)`, u('fridgeShareTail', { url: pageUrl('fridge') })].join('\n');
      const p = plan();
      const food = fridgeFoods(F, p);
      const names = (xs) => xs.map((f) => L(f.short)).join(', ');
      return [
        s.end ? u('fridgeShareBack', { elapsed: span(hoursNow()) }) : u('fridgeShareSince', { at: clock(s.start), elapsed: span(hoursNow()) }),
        ...p.map((x) => `${x.part.icon} ${L(x.part.label)}: ${say(x)} · ${detail(x)}`),
        ...(food.over ? [u('fridgeShareToss', { list: names(food.toss) }), u('fridgeShareKeep', { list: names(food.keep) })] : []),
        `(${agencies(srcIds)} · ⚠️)`,
        u('fridgeShareTail', { url: pageUrl('fridge') }),
      ].join('\n');
    },
  });
}

// ------------------------------------------------------------------ dust today

// "Dust today: what should we do at home?" (/air, /?open=air): a reading
// (µg/m³ or Thailand's AQI) or the colour an app shows → the PCD's level and
// what everyone, the people at risk and people with a long-term illness do,
// all of it shown (since v1.11.0 the at-risk lines no longer wait for a tick:
// the reader is often the one at risk). The unit stays on the device (brm:air);
// the reading is never stored or sent.
export async function openAir(from = 'start') {
  await loadKit();
  track('tool_open', { mode: 'air', label: from });
  const A = K.air;
  const was = store.get('air', null);
  const s = {
    unit: A.units.some((x) => x.id === was?.unit) ? was.unit : A.units[0].id,
    value: '',
    colour: null,
  };
  const save = () => store.set('air', { unit: s.unit });
  const range = (l) => {
    const i = A.levels.indexOf(l);
    const prev = A.levels[i - 1];
    const unit = s.unit === 'pm' ? L(A.units[0].label).replace(/^.*\((.*)\)$/, '$1') : 'AQI';
    const fmt = (v) => (s.unit === 'pm' ? v.toFixed(1) : String(v));
    const lo = prev ? (s.unit === 'pm' ? prev.pm + 0.1 : prev.aqi + 1) : 0;
    return l[s.unit] == null ? u('airRangeTop', { lo: fmt(lo), unit }) : u('airRange', { lo: fmt(lo), hi: fmt(l[s.unit]), unit });
  };
  const doh = new Set(['doh-aqi-2566']);
  const li = (x) => `<li>${esc(L(x))}${x.sources.some((id) => doh.has(id)) ? ` <small class="air-by">${esc(u('airBy', { agency: agencies(x.sources) }))}</small>` : ''}</li>`;
  const check = modeLink(content().config, 'dust');
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🌫️ ${esc(u('airTitle'))}</h2>
    <p class="sub">${esc(u('airIntro'))}</p>
    <p class="kit-q" id="air-colour-label">${esc(u('airColourQ'))}</p>
    <div class="air-colours" role="radiogroup" aria-labelledby="air-colour-label">${A.levels.map((l) => `<label class="air-colour"><input type="radio" name="air-colour" value="${esc(l.id)}"><span class="air-dot" style="background:${esc(l.colour)}"></span><span>${esc(L(l.label).split(' · ')[0])}</span></label>`).join('')}</div>
    ${check ? `<a class="btn secondary small air-check" id="air-check" href="${esc(check)}" target="_blank" rel="noopener">${esc(u('airCheck'))}</a>` : ''}
    <details class="kit-calc air-num" id="air-num"><summary>🔢 ${esc(u('airNumber'))}</summary>
      <p class="kit-q" id="air-unit-label">${esc(u('airUnit'))}</p>
      <div class="kit-flags air-units" role="radiogroup" aria-labelledby="air-unit-label">${A.units.map((x) => `<label class="kit-flag"><input type="radio" name="air-unit" value="${esc(x.id)}"${x.id === s.unit ? ' checked' : ''}><span>${esc(L(x.label))}</span></label>`).join('')}</div>
      <label class="calc-field air-value"><span>${esc(u('airValue'))}</span><input type="text" id="air-v" inputmode="decimal" autocomplete="off" enterkeyhint="done"></label>
      <p class="kit-src">${esc(u('airAvg'))}</p>
    </details>
    <div class="air-out" id="air-out" aria-live="polite"></div>
    <div class="fr-share" id="air-share-row"></div>
    <button class="btn secondary" type="button" id="air-guide">${esc(u('airGuide'))}</button>
    <p class="kit-privacy">🔒 ${esc(u('airPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="air-close">${esc(u('close'))}</button>`, { label: u('airTitle') });
  const advice = () => airAdvice(A, { unit: s.unit, value: s.value, colour: s.colour });
  // "เด็กเล็ก ผู้สูงอายุ" / "young children and older people"
  const whoText = (gs) => {
    const names = gs.map((g) => L(g.short));
    if (names.length < 2) return names.join('');
    const last = names[names.length - 1];
    return getLang() === 'en' ? `${names.slice(0, -1).join(', ')} and ${last}` : `${names.slice(0, -1).join(' ')} และ${last}`;
  };
  const paint = () => {
    const r = advice();
    const box = $('#air-out');
    for (const c of $$('input[name="air-colour"]', $('#sheet'))) c.checked = r?.level.id === c.value;
    if (!r) {
      box.innerHTML = `<p class="air-none">${esc(u('airNone'))}</p>`;
      box.removeAttribute('style');
      return;
    }
    const who = whoText(A.groups);
    const srcIds = [...new Set([...r.all, ...r.risk, ...r.chronic].flatMap((x) => x.sources))];
    box.style.setProperty('--lv', r.level.colour);
    box.innerHTML = `
      <div class="air-badge"><span class="air-dot" style="background:${esc(r.level.colour)}"></span><span><b>${esc(u('airLevel', { name: L(r.level.label) }))}</b><small>${esc(range(r.level))}</small></span></div>
      <h3>${esc(u('airAll'))}</h3><ul class="air-list">${r.all.map(li).join('')}</ul>
      ${r.risk.length ? `<h3>${esc(u('airRisk', { who }))}</h3><p class="air-also">${esc(u('airAlso'))}</p><ul class="air-list">${r.risk.map(li).join('')}</ul>` : r.riskSame ? `<h3>${esc(u('airRisk', { who }))}</h3><p class="air-same">${esc(u('airSame'))}</p>` : ''}
      ${r.chronic.length ? `<h3>${esc(u('airChronic'))}</h3><ul class="air-list">${r.chronic.map(li).join('')}</ul>` : ''}
      <p class="kit-src">${esc(u('source'))}: ${esc(agencies(srcIds))}</p>`;
  };
  paint();
  const show = () => {
    const box = $('#air-out');
    if (box && advice()) box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  $('#air-v').addEventListener('input', (e) => { s.value = e.target.value; s.colour = null; paint(); });
  $('#air-v').addEventListener('change', show);
  for (const r of $$('input[name="air-unit"]', $('#sheet'))) r.addEventListener('change', () => { s.unit = r.value; save(); paint(); });
  for (const r of $$('input[name="air-colour"]', $('#sheet'))) {
    r.addEventListener('change', () => {
      s.colour = r.value;
      s.value = '';
      $('#air-v').value = '';
      paint();
      show();
    });
  }
  $('#air-close').addEventListener('click', () => closeSheet());
  $('#air-guide').addEventListener('click', () => document.dispatchEvent(new CustomEvent('brm:guide', { detail: 'dust' })));
  textShare($('#air-share-row'), {
    label: u('airShare'), title: u('airTitle'), url: pageUrl('air'), mode: 'air',
    text: () => {
      const r = advice();
      if (!r) return `${u('airTitle')}\n${pageUrl('air')}`;
      const name = L(r.level.label);
      const pmUnit = L(A.units[0].label).replace(/^.*\((.*)\)$/, '$1');
      const head = s.colour ? u('airShareColour', { name }) : u('airShareHead', { value: `${s.value} ${s.unit === 'pm' ? pmUnit : 'AQI'}`, name });
      const lines = [head, `${u('airAll')}: ${r.all.map((x) => L(x)).join(' · ')}`];
      if (r.risk.length) lines.push(`${u('airRisk', { who: whoText(A.groups) })}: ${r.risk.map((x) => L(x)).join(' · ')}`);
      if (r.chronic.length) lines.push(`${u('airChronic')}: ${r.chronic.map((x) => L(x)).join(' · ')}`);
      lines.push(`(${u('source')}: ${agencies([...new Set([...r.all, ...r.risk, ...r.chronic].flatMap((x) => x.sources))])})`, u('airShareTail', { url: pageUrl('air') }));
      return lines.join('\n');
    },
  });
}

// A text to send (LINE first): what a tool worked out, with the tool's link.
// The text is made when the button is pressed, so it says what shows then.
function textShare(box, { label, title, url, mode, text }) {
  box.innerHTML = `<p class="kit-q">${esc(label)}</p><div class="share-grid share-grid-text">
    ${canNativeShare() ? `<button class="share-btn" type="button" data-t="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
    <button class="share-btn" type="button" data-t="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
    <button class="share-btn" type="button" data-t="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button></div>`;
  for (const b of $$('[data-t]', box)) {
    b.addEventListener('click', async () => {
      const k = b.dataset.t;
      const body = text();
      track('tool_share', { mode, label: k });
      if (k === 'native') await nativeShare({ title, text: body, url });
      else if (k === 'line') openExternal(lineShareUrl(body));
      else {
        await copyText(body);
        toast(t('copied'));
      }
    });
  }
}

// ------------------------------------------------------------------ sharing an image

// copy: an extra button that puts the list itself on the clipboard (never in a URL or an
// event, GUIDELINES rule 56), for chats where the picture can't be attached (v1.11.0).
async function shareImage({ canvas, title, text, url, filename, event, value = 0, back, backLabel, copy = null }) {
  const blob = await canvasToBlob(canvas);
  let file = null;
  try { file = new File([blob], filename, { type: 'image/png' }); } catch { /* old browser */ }
  const saveOk = canDownload();
  openSheet(`
    <h2 id="sheet-title">${esc(title)}</h2>
    <p class="save-hint pic-hint">${esc(u('picHint'))}</p>
    <div class="share-grid">
      ${canNativeShare() ? `<button class="share-btn" data-k="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
      <button class="share-btn" data-k="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
      <button class="share-btn" data-k="facebook"><span class="ico ico-fb">f</span>${esc(t('shareFb'))}</button>
      <button class="share-btn" data-k="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
      ${saveOk ? `<button class="share-btn" data-k="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}
    </div>
    ${copy ? `<button class="btn secondary small" type="button" data-k="copylist">${esc(copy.label)}</button>` : ''}
    <img class="card-preview share-preview" id="kit-img" alt="${esc(title)}">
    <div class="btn-row">
      <button class="btn secondary small" type="button" id="kit-back">${esc(backLabel)}</button>
      <button class="btn secondary small" type="button" id="kit-done">${esc(t('done'))}</button>
    </div>`, { label: title });
  $('#kit-img').src = await imageSrc(blob);
  $('#kit-back').addEventListener('click', () => back());
  $('#kit-done').addEventListener('click', () => closeSheet());
  for (const b of $$('[data-k]', $('#sheet'))) {
    b.addEventListener('click', async () => {
      const k = b.dataset.k;
      track(event, { label: k, value });
      if (k === 'native') await nativeShare({ file, title, text, url });
      else if (k === 'line' || k === 'facebook') shareChannel(k, { text, url });
      else if (k === 'copy') {
        await copyText(text);
        toast(t('copied'));
      } else if (k === 'copylist') {
        await copyText(copy.text());
        toast(t('copied'));
      } else if (k === 'save') downloadBlob(blob, filename);
    });
  }
}

// ------------------------------------------------------------------ the cards (1080x1350)

export function drawKitCard(canvas, d, a) {
  const W = 1080, H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const { INK, INK2, OK, CREAM, font, fitText, logo, waves, background, drawGecko, plainText } = draw;
  background(ctx, W, H, 'stock');
  waves(ctx, W, 1110, ...draw.theme('stock').waves);
  logo(ctx, W / 2, 150, 104, d.logo, W - 440); // clear of the moon at the top right
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  fitText(ctx, plainText(d.title), W - 140, 64, 44);
  ctx.fillText(plainText(d.title), W / 2, 262);
  // the score ring
  const cx = W / 2 + 120, cy = 500, r = 160;
  ctx.lineWidth = 36;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#E3E6F3';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  if (d.pct > 0) {
    ctx.strokeStyle = OK;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.min(100, d.pct)) / 100);
    ctx.stroke();
  }
  ctx.fillStyle = INK;
  font(ctx, 120);
  ctx.fillText(`${d.pct}%`, cx, cy + 42);
  drawGecko(ctx, a, 70, 330, 300, 330, d.pct >= 80 ? 'cheer' : d.pct >= 40 ? 'happy' : 'think', 'torch');
  font(ctx, 44, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(plainText(d.count), W / 2, 760);
  // what is still missing (or "all set")
  ctx.fillStyle = CREAM;
  ctx.textAlign = 'left';
  if (d.missing.length) {
    font(ctx, 40);
    ctx.fillStyle = INK;
    ctx.fillText(`${plainText(d.missingLabel)}:`, 120, 850);
    font(ctx, 40, 400);
    d.missing.slice(0, 3).forEach((m, i) => {
      const line = wrapText(ctx, plainText(m), W - 300)[0];
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(140, 905 + i * 62 - 13, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(line, 170, 905 + i * 62);
    });
  } else {
    ctx.textAlign = 'center';
    font(ctx, 52);
    ctx.fillStyle = OK;
    ctx.fillText(plainText(d.allSet), W / 2, 940);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, plainText(d.cta), W - 100, 46, 32);
  ctx.fillText(plainText(d.cta), W / 2, 1238);
  const shown = d.url.replace(/^https?:\/\//, '');
  fitText(ctx, shown, W - 100, 40, 26, 400);
  ctx.fillText(shown, W / 2, 1290);
  font(ctx, 24, 400);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.fillText(d.footer, W / 2, 1332);
}

export function drawPlanCard(canvas, d, a) {
  const W = 1080, H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const { INK, INK2, CREAM, SUN, font, fitText, logo, roundRect, drawGecko, plainText } = draw;
  const th = draw.theme('stock');
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  // header band
  ctx.fillStyle = th.chip;
  ctx.fillRect(0, 0, W, 300);
  ctx.fillStyle = th.accentDark;
  ctx.fillRect(0, 292, W, 10);
  logo(ctx, 360, 104, 70, d.logo, 560);
  drawGecko(ctx, a, 800, 24, 230, 250, 'happy', 'torch');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  fitText(ctx, plainText(d.title), 700, 64, 44);
  ctx.fillText(plainText(d.title), 60, 200);
  font(ctx, 32, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(plainText(d.date), 60, 256);
  // Every field, in the largest text that fits between the header and the
  // helplines (y 320–1010). A field left empty gets a dotted line, so a
  // printed copy can be filled in by hand.
  const boxW = W - 100;
  const layout = (k, maxLines) => d.rows.map((row) => {
    font(ctx, Math.round(38 * k));
    const lines = row.value ? wrapText(ctx, row.value, boxW - 60).slice(0, maxLines) : [''];
    return { row, lines, h: Math.round((58 + lines.length * 46) * k) };
  });
  let k = 1;
  let rows = layout(k, 2);
  const height = (rs) => rs.reduce((a, r) => a + r.h + 12, 0);
  while (height(rows) > 690 && k > 0.66) { k -= 0.06; rows = layout(k, k > 0.8 ? 2 : 1); }
  let y = 320;
  for (const { row, lines, h } of rows) {
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, 50, y, boxW, h, 22);
    ctx.fill();
    font(ctx, Math.round(28 * k), 400);
    ctx.fillStyle = INK2;
    ctx.fillText(plainText(row.label), 80, y + Math.round(38 * k));
    font(ctx, Math.round(38 * k));
    ctx.fillStyle = INK;
    if (row.value) lines.forEach((ln, i) => ctx.fillText(ln, 80, y + Math.round((84 + i * 46) * k)));
    else {
      ctx.save();
      ctx.strokeStyle = INK2;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 10]);
      ctx.beginPath();
      ctx.moveTo(80, y + Math.round(88 * k));
      ctx.lineTo(50 + boxW - 30, y + Math.round(88 * k));
      ctx.stroke();
      ctx.restore();
    }
    y += h + 12;
  }
  // helplines, the reminder and the address
  const fy = 1030;
  ctx.fillStyle = INK;
  roundRect(ctx, 50, fy, W - 100, 160, 30);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = SUN;
  font(ctx, 34);
  if (d.calls?.length) {
    // v1.11.0: each number with its name under it, so the card says whom each one reaches.
    font(ctx, 30);
    ctx.fillText(plainText(d.helpLabel), W / 2, fy + 40);
    drawCalls(ctx, d.calls, { x: 60, w: W - 120, y: fy + 88, num: 38, name: 19 });
  } else {
    ctx.fillText(plainText(d.helpLabel), W / 2, fy + 56);
    ctx.fillStyle = '#FFFFFF';
    fitText(ctx, d.helpNumbers, W - 160, 50, 32);
    ctx.fillText(d.helpNumbers, W / 2, fy + 122);
  }
  ctx.fillStyle = INK;
  fitText(ctx, plainText(d.keep), W - 100, 36, 26);
  ctx.fillText(plainText(d.keep), W / 2, 1246);
  font(ctx, 30, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, 1294);
  font(ctx, 24, 400);
  ctx.fillText(d.footer, W / 2, 1334);
}

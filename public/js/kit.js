// "How ready is our house?" (/?open=kit) and the family plan card
// (/?open=plan). Loaded only when one of them opens. Answers, ticks and the
// plan's text stay on this device (localStorage brm:kit, brm:plan); only
// anonymous counts are sent (kit_open, kit_share, plan_share), never the text.

import { $, $$, esc, store, bangkokDateKey, formatHouseDate } from './util.js';
import { t, L, getLang, siteUrl, content, agencyName } from './content.js';
import { openSheet as uiOpenSheet, closeSheet, toast, canPrint, printList } from './ui.js';
import { kit as draw, loadCardAssets, canvasToBlob, wrapText, drawCalls } from './cards.js';
import {
  canNativeShare, nativeShare, shareChannel, copyText, canDownload, downloadBlob, imageSrc, openExternal, lineShareUrl,
} from './share.js';
import { track } from './analytics.js';
import { kitPlan, kitScore, kitMissing, fridgePlan, fridgeFoods, medDays, airAdvice, maskAdvice, hotAdvice, waterDays, tankDose, bagList, safeMessage } from './kitplan.js';
import { modeLink } from './modes.js';

let K = null;
let assets = null;

async function loadKit() {
  if (!K) K = await fetch('/content/kit.json').then((r) => r.json());
  return K;
}

// English counts of one read "1 person", "1 day", not "1 people", "1 days".
const ONE = { people: 'person', days: 'day', litres: 'litre', pills: 'pill' };
const one = (s) => (getLang() === 'en' ? s.replace(/(^|[^\d.,])1 (people|days|litres|pills)\b/g, (_, a, w) => `${a}1 ${ONE[w]}`) : s);
const u = (key, vars = {}) => one(String(K.ui[getLang()]?.[key] ?? K.ui.th[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`));
// A tool opened from another tool (or from the list of all tools) says, at its
// top, how to get back there: "‹ เครื่องมือทั้งหมด", "‹ เช็กของจำเป็น". The phone's
// Back still closes the sheet (v1.13.0, visitor audit 4). Each open… function
// marks where it was opened from; the next sheet it opens carries the link.
let pendingBack = null;
const BACK = { tools: () => openTools('back'), kit: () => openKit('back'), plan: () => openPlan('back'), bag: () => openBag('back'), air: () => openAir('back'), mask: () => openMask('back'), water: () => openWater('back'), info: () => openInfo('back'), safe: () => openSafe('back') };
function openSheet(html, opts) {
  uiOpenSheet(html, opts);
  const from = pendingBack;
  pendingBack = null;
  if (!BACK[from]) return;
  const name = from === 'tools' ? u('toolsBack') : t(`hub${from[0].toUpperCase()}${from.slice(1)}`);
  $('#sheet-body').insertAdjacentHTML('afterbegin', `<button class="link tl-back" type="button" id="tl-back">‹ ${esc(name)}</button>`);
  $('#tl-back').addEventListener('click', BACK[from]);
}
// Phone numbers as tap-to-call chips, each with whom it reaches (helplines.json → short).
const telChips = (numbers) => numbers.map((n) => content().helplines.find((h) => h.number === n)).filter(Boolean).map((h) => `<a class="tel-chip" href="tel:${esc(h.number)}" data-help="${esc(h.number)}"><b>${esc(h.number)}</b><small>${esc(L(h.short))}</small></a>`).join('');
const bindTel = (mode) => { for (const a of $$('.tel-chip[data-help]', $('#sheet'))) a.addEventListener('click', () => track('help_click', { label: a.dataset.help, mode })); };
// A number typed by hand: "1,500" is fifteen hundred; "1,5" and "1.5" are one and a half.
const typedNumber = (x) => { const v = String(x).replace(/\s/g, ''); return Number(/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(v) ? v.replace(/,/g, '') : v.replace(',', '.')) || 0; };
// A name that starts a button reads in lower case inside an English sentence.
const midSentence = (x) => (getLang() === 'en' ? x.replace(/^\p{Lu}(?!\p{Lu})/u, (c) => c.toLowerCase()) : x);
// /kit and /plan are pages with their own link preview (a sample card) that open the tool.
const pageUrl = (tool) => `${siteUrl()}${getLang() === 'en' ? '/en' : ''}/${tool}`;
const agencies = (ids = []) => [...new Set(ids.map((id) => content().sources[id]?.agency).filter(Boolean))].map(agencyName).join(' · ');

function saved() {
  const s = store.get('kit', null);
  return s && typeof s === 'object' ? s : null;
}

let kitReturn = null;
export async function openKit(from = 'start', mode = '') {
  await loadKit();
  pendingBack = from;
  track('kit_open', { label: from, mode });
  const s = saved();
  // From the bag ("change answers" / "answer 2 questions"): the questions, then back to the bag.
  kitReturn = from === 'bag' ? () => openBag('kitedit') : null;
  if (s?.answered && !kitReturn) showList(s);
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
    const back = kitReturn;
    kitReturn = null;
    if (back) { persist(next, kitPlan(K, next)); back(); } else showList(next);
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
    <div class="btn-row mk-next"><button class="btn secondary small" type="button" id="kit-water">💧 ${esc(u('waterTitle'))}</button><button class="btn secondary small" type="button" id="kit-bag">🧳 ${esc(u('bagTitle'))}</button></div>
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
  $('#kit-water').addEventListener('click', () => openWater('kit'));
  $('#kit-bag').addEventListener('click', () => openBag('kit'));
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
      copy: allMissing.length ? { label: u('kitCopy'), text: () => [u('kitCopyHead', { n: plan.people }), ...allMissing.map((x) => `• ${L(x.item.label)}${qtyText(x) ? `: ${midSentence(qtyText(x))}` : ''}`), pageUrl('kit')].join('\n') } : null,
    });
  });
}

// ------------------------------------------------------------------ the plan card

// `again`: back from the card to the form, which is not a new arrival.
export async function openPlan(from = 'start', again = false) {
  await loadKit();
  pendingBack = from;
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
    <div class="btn-row mk-next"><button class="btn secondary small" type="button" id="plan-info">🆔 ${esc(u('infoTitle'))}</button><button class="btn secondary small" type="button" id="plan-safe">💬 ${esc(u('safeTitle'))}</button></div>
    ${from === 'kit' ? `<button class="btn secondary small" type="button" id="plan-back">${esc(u('back'))}</button>` : ''}
    <button class="btn secondary small" type="button" id="plan-close">${esc(u('close'))}</button>`, { label: u('planTitle') });
  const read = () => Object.fromEntries(K.plan.map((f) => [f.id, ($(`.plan-form input[name="${f.id}"]`)?.value || '').trim().slice(0, f.max)]));
  for (const input of $$('.plan-form input', $('#sheet'))) {
    input.addEventListener('change', () => store.set('plan', { ...read(), date: bangkokDateKey() }));
  }
  $('#plan-close').addEventListener('click', () => closeSheet());
  $('#plan-back')?.addEventListener('click', () => openKit('plan'));
  $('#plan-info').addEventListener('click', () => openInfo('plan'));
  $('#plan-safe').addEventListener('click', () => openSafe('plan'));
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
  pendingBack = from;
  track('tool_open', { mode: 'fridge', label: from });
  const F = K.fridge;
  // start: when the power went off (null until a time is tapped); end: when "the power's back" was tapped.
  const s = { start: null, end: null, freezer: F.freezer[0].id, med: false, milk: false, ...fridgeSaved() };
  const hoursNow = () => ((s.end || Date.now()) - s.start) / HOUR;
  // The start screen's button says "ไฟดับมาเกิน 3 ชม.แล้ว" at once, not after a reload.
  const chip = () => {
    // The start screen's tiles follow the season, but a power cut being counted keeps the fridge tile.
    document.dispatchEvent(new CustomEvent('brm:hub'));
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
export async function openAir(from = 'start', colour = null) {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'air', label: from });
  const A = K.air;
  const was = store.get('air', null);
  const s = {
    unit: A.units.some((x) => x.id === was?.unit) ? was.unit : A.units[0].id,
    value: '',
    colour: A.levels.some((l) => l.id === colour) ? colour : null,
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
    <button class="btn secondary" type="button" id="air-mask">${esc(u('maskFromAir'))}</button>
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
    const srcIds = [...new Set([...r.all, ...r.risk, ...r.chronic, ...(r.baby ? [r.baby] : [])].flatMap((x) => x.sources))];
    box.style.setProperty('--lv', r.level.colour);
    box.innerHTML = `
      <div class="air-badge"><span class="air-dot" style="background:${esc(r.level.colour)}"></span><span><b>${esc(u('airLevel', { name: L(r.level.label) }))}</b><small>${esc(range(r.level))}</small></span></div>
      <h3>${esc(u('airAll'))}</h3><ul class="air-list">${r.all.map(li).join('')}</ul>
      ${r.risk.length ? `<h3>${esc(u('airRisk', { who }))}</h3><p class="air-also">${esc(u('airAlso'))}</p><ul class="air-list">${r.risk.map(li).join('')}</ul>` : r.riskSame ? `<h3>${esc(u('airRisk', { who }))}</h3><p class="air-same">${esc(u('airSame'))}</p>` : ''}
      ${r.chronic.length ? `<h3>${esc(u('airChronic'))}</h3><ul class="air-list">${r.chronic.map(li).join('')}</ul>` : ''}
      ${r.baby ? `<p class="air-baby"><span aria-hidden="true">${esc(r.baby.icon)}</span> <span>${esc(L(r.baby))}${r.baby.verify !== 'verified' ? ' ⚠️' : ''} <small>(${esc(agencies(r.baby.sources))})</small></span></p>` : ''}
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
  // Which mask, for whom: the mask tool with today's colour already picked (v1.12.0).
  $('#air-mask').addEventListener('click', () => openMask('air', { why: 'dust', colour: advice()?.level.id || null }));
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
      if (r.baby) lines.push(`${r.baby.icon} ${L(r.baby)}`);
      lines.push(`(${u('source')}: ${agencies([...new Set([...r.all, ...r.risk, ...r.chronic, ...(r.baby ? [r.baby] : [])].flatMap((x) => x.sources))])})`, u('airShareTail', { url: pageUrl('air') }));
      return lines.join('\n');
    },
  });
}

// ------------------------------------------------------------------ which mask

// "Do I need a mask, and which one?" (/mask, /?open=mask, v1.12.0): one tap
// at a time (what for; for dust, today's colour and who; for a clean-up, what)
// → a status word, the lines, and how to wear it. Nothing is stored or sent
// (tool_open and tool_share count the tool, never the answers).
export async function openMask(from = 'start', pre = {}) {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'mask', label: from });
  const M = K.mask;
  const A = K.air;
  const s = { why: null, colour: null, who: null, what: null, ...pre };
  const opt = (name, x, on) => `<button class="mk-opt${on ? ' is-on' : ''}" type="button" role="radio" aria-checked="${on}" data-q="${name}" data-v="${esc(x.id)}"><span class="mk-ico" aria-hidden="true">${esc(x.icon)}</span><span>${esc(L(x.label))}</span></button>`;
  const flag = (x) => (x.verify && x.verify !== 'verified' ? ' <span class="partial">⚠️</span>' : '');
  const lineText = (x) => (x.level ? L(x).replace('{name}', midSentence(L(x.level.label).split(' · ')[0])) : L(x));
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>😷 ${esc(u('maskTitle'))}</h2>
    <p class="sub">${esc(u('maskIntro'))}</p>
    <div id="mk-qs"></div>
    <div class="mk-out" id="mk-out" aria-live="polite"></div>
    <div class="fr-share" id="mk-share-row" hidden></div>
    <div class="btn-row mk-next" id="mk-next"></div>
    <p class="kit-privacy">🔒 ${esc(u('maskPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="mk-close">${esc(u('close'))}</button>`, { label: u('maskTitle') });
  const advice = () => maskAdvice(M, A, s);
  const paint = (scroll = false) => {
    const r = advice();
    // The questions asked so far, each with its answer marked; the next one appears only when it is due.
    const qs = [`<p class="kit-q" id="mk-why-q">${esc(u('maskWhyQ'))}</p><div class="mk-opts mk-why" role="radiogroup" aria-labelledby="mk-why-q">${M.why.map((x) => opt('why', x, s.why === x.id)).join('')}</div>`];
    if (s.why === 'dust') {
      qs.push(`<p class="kit-q" id="mk-colour-q">${esc(u('maskColourQ'))}</p><div class="air-colours mk-colours" role="radiogroup" aria-labelledby="mk-colour-q">${A.levels.map((l) => `<button class="air-colour${s.colour === l.id ? ' is-on' : ''}" type="button" role="radio" aria-checked="${s.colour === l.id}" data-q="colour" data-v="${esc(l.id)}"><span class="air-dot" style="background:${esc(l.colour)}"></span><span>${esc(L(l.label).split(' · ')[0])}</span></button>`).join('')}</div>`);
      if (s.colour) qs.push(`<p class="kit-q" id="mk-who-q">${esc(u('maskWhoQ'))}</p><div class="mk-opts" role="radiogroup" aria-labelledby="mk-who-q">${M.who.map((x) => opt('who', x, s.who === x.id)).join('')}</div>`);
    }
    if (s.why === 'clean') qs.push(`<p class="kit-q" id="mk-what-q">${esc(u('maskWhatQ'))}</p><div class="mk-opts mk-one" role="radiogroup" aria-labelledby="mk-what-q">${M.what.map((x) => opt('what', x, s.what === x.id)).join('')}</div>`);
    $('#mk-qs').innerHTML = qs.join('');
    for (const b of $$('[data-q]', $('#mk-qs'))) {
      b.addEventListener('click', () => {
        const q = b.dataset.q;
        s[q] = b.dataset.v;
        // A new answer to an earlier question clears the later ones.
        if (q === 'why') { s.colour = null; s.who = null; s.what = null; }
        if (q === 'colour') s.who = s.who && s.why === 'dust' ? s.who : null;
        paint(true);
      });
    }
    const out = $('#mk-out');
    const done = !r.ask;
    $('#mk-share-row').hidden = !done;
    if (!done) {
      out.innerHTML = `<p class="fr-pick">${esc(u('maskPick'))}</p>`;
      out.className = 'mk-out is-empty';
      $('#mk-next').innerHTML = '';
      return;
    }
    const ctx = [r.level ? u('maskLevel', { name: L(r.level.label).split(' · ')[0] }) : L(M.why.find((x) => x.id === s.why).label), r.who ? L(r.who.label) : '', r.what ? L(r.what.label) : ''].filter(Boolean).join(' · ');
    const C = M.card;
    const srcIds = [...new Set([...r.lines, ...(r.card ? [...C.fit, ...C.change, ...C.buy, ...C.cant] : [])].flatMap((x) => x.sources || []))];
    const sec = (head, xs) => `<h4>${esc(head)}</h4><ul>${xs.map((x) => `<li>${esc(L(x))}${flag(x)}</li>`).join('')}</ul>`;
    out.className = `mk-out is-${r.status.id}`;
    out.innerHTML = `
      <p class="mk-status"><span aria-hidden="true">${esc(r.status.icon)}</span> <b>${esc(L(r.status))}</b></p>
      <p class="mk-ctx">${esc(ctx)}</p>
      <ul class="mk-lines">${r.lines.map((x) => `<li><span class="mk-li-ico" aria-hidden="true">${esc(x.icon || (x.mask ? '😷' : '•'))}</span><span>${esc(lineText(x))}${flag(x)}</span></li>`).join('')}</ul>
      ${r.card ? `<details class="mk-card"><summary>${esc(u('maskHow'))}</summary>${sec(u('maskFit'), C.fit)}${sec(u('maskChange'), C.change)}${sec(u('maskBuy'), C.buy)}<p class="kit-src">${esc(u('maskNoNumber'))}</p>${sec(u('maskCant'), C.cant)}</details>` : ''}
      <p class="kit-src">${esc(u('source'))}: ${esc(agencies(srcIds))}${[...r.lines, ...(r.card ? C.cant : [])].some((x) => x.verify && x.verify !== 'verified') ? `<br>${esc(t('guidePartial'))}` : ''}</p>`;
    const next = [];
    if (s.why === 'dust') next.push(`<button class="btn secondary small" type="button" data-next="air">${esc(u('maskAir'))}</button>`);
    const g = r.guide || (s.why === 'clean' ? 'return' : null);
    if (g) next.push(`<button class="btn secondary small" type="button" data-next="guide" data-g="${esc(g)}">${esc(u('maskGuide', { name: t(`guide${g[0].toUpperCase()}${g.slice(1)}`) }))}</button>`);
    $('#mk-next').innerHTML = next.join('');
    for (const b of $$('[data-next]', $('#mk-next'))) {
      b.addEventListener('click', () => (b.dataset.next === 'air' ? openAir('mask', s.colour) : document.dispatchEvent(new CustomEvent('brm:guide', { detail: b.dataset.g }))));
    }
    if (scroll) out.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  paint();
  $('#mk-close').addEventListener('click', () => closeSheet());
  textShare($('#mk-share-row'), {
    label: u('maskShare'), title: u('maskTitle'), url: pageUrl('mask'), mode: 'mask',
    text: () => {
      const r = advice();
      if (r.ask) return `${u('maskTitle')}\n${pageUrl('mask')}`;
      const ctx = [r.level ? u('maskLevel', { name: L(r.level.label).split(' · ')[0] }) : L(M.why.find((x) => x.id === s.why).label), r.who ? L(r.who.label) : '', r.what ? L(r.what.label) : ''].filter(Boolean).join(' · ');
      const ids = [...new Set(r.lines.flatMap((x) => x.sources || []))];
      return [`😷 ${u('maskTitle')} ${ctx}`, `${r.status.icon} ${L(r.status)}`, ...r.lines.map((x) => `• ${lineText(x)}${x.verify && x.verify !== 'verified' ? ' ⚠️' : ''}`), `(${u('source')}: ${agencies(ids)})`, u('maskShareTail', { url: pageUrl('mask') })].join('\n');
    },
  });
}

// ------------------------------------------------------------------ all tools

// One agency link as a row (the tools sheet and the guides): what it is, whose,
// LINE or web, opening outside the app; a sourced note under it where needed
// (the relief link: where to apply, and never tap a link in an SMS).
const linkRow = (x) => `<li><a class="tl-link" href="${esc(x.url)}" target="_blank" rel="noopener" data-link="${esc(x.id)}"><span class="hub-ico" aria-hidden="true">${esc(x.icon)}</span><span class="hub-text"><b>${esc(L(x.label))}</b><small>${esc(agencyName(x.by))} · ${esc(u(x.kind === 'line' ? 'toolsLine' : 'toolsWeb'))}</small></span><span class="tl-ext" aria-hidden="true">↗</span></a>${x.note ? `<p class="tl-note">${esc(L(x.note))}</p>` : ''}${x.warn ? `<p class="tl-note tl-warn">🚫 ${esc(L(x.warn))}</p>` : ''}</li>`;
// "Turn on emergency alerts on your phone" (DDPM's Cell Broadcast steps, kit.json → alerts).
const alertsCard = () => {
  const X = K.alerts;
  const steps = (o) => `<p class="tl-os">${esc(o.label)}</p><ol class="tl-steps">${o.steps.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ol>`;
  return `<details class="mk-card tl-alerts" id="tl-alerts"><summary>📲 ${esc(L(X.title))}</summary>
    <p>${esc(L(X.intro))}</p>${steps(X.ios)}${steps(X.android)}<p class="kit-src">${esc(L(X.note))}${X.verify !== 'verified' ? ' ⚠️' : ''}</p>
    <ul class="mk-lines">${X.know.map((x) => `<li><span class="mk-li-ico" aria-hidden="true">${esc(x.icon)}</span><span>${esc(L(x))}</span></li>`).join('')}</ul>
    <p class="kit-src">${esc(u('source'))}: ${esc(agencies([...new Set([X.intro, X.note, ...X.know].flatMap((x) => x.sources))]))}${X.verify !== 'verified' ? `<br>${esc(t('guidePartial'))}` : ''}</p></details>`;
};

// "All tools" (/tools, /?open=tools, v1.12.0): every tool by when it is used,
// the guides, and the government's own websites and LINE accounts
// (content/kit.json → links), which open outside the app.
export async function openTools(from = 'start') {
  await loadKit();
  pendingBack = from;
  if (from !== 'back') track('tool_open', { mode: 'tools', label: from });
  const C = content();
  const tools = C.config.tools || [];
  const name = (id) => t(`hub${id[0].toUpperCase()}${id.slice(1)}`);
  const row = (x) => `<button class="hub-btn tl-row" type="button" data-tool="${esc(x.id)}"><span class="hub-ico" aria-hidden="true">${esc(x.icon)}</span><span class="hub-text"><b>${esc(name(x.id))}</b><small>${esc(t(`hub${x.id[0].toUpperCase()}${x.id.slice(1)}Sub`))}</small></span><span class="hub-go" aria-hidden="true">›</span></button>`;
  const links = K.links.list;
  const checked = links.map((x) => x.checked).sort()[0];
  const date = new Date(`${checked}T12:00:00+07:00`).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' });
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🧰 ${esc(u('toolsTitle'))}</h2>
    <p class="sub">${esc(u('toolsIntro'))}</p>
    <p class="tel-row tl-calls"><span>☎️ <span class="lbl">${esc(t('telFree'))}</span></span>${telChips(['1784', '199', '1669'])}</p>
    <button class="hub-btn hub-main tl-row" type="button" data-guides="1"><span class="hub-ico" aria-hidden="true">📋</span><span class="hub-text"><b>${esc(t('hubGuide'))}</b><small>${esc(t('hubGuideSub'))}</small></span><span class="hub-go" aria-hidden="true">›</span></button>
    <h3>${esc(u('toolsHome'))}</h3>
    <div class="tl-list">${tools.filter((x) => x.group === 'home').map(row).join('')}</div>
    <h3>${esc(u('toolsNow'))}</h3>
    <div class="tl-list">${tools.filter((x) => x.group === 'now').map(row).join('')}</div>
    ${alertsCard()}
    <h3>🔗 ${esc(u('toolsLinks'))}</h3>
    <ul class="tl-links">${links.map(linkRow).join('')}</ul>
    <p class="kit-src">${esc(u('toolsLinksNote', { date }))}</p>
    <button class="btn secondary small" type="button" id="tl-close">${esc(u('close'))}</button>`, { label: u('toolsTitle') });
  const open = { kit: openKit, plan: openPlan, fridge: openFridge, air: openAir, mask: openMask, hot: openHot, water: openWater, tank: openTank, info: openInfo, safe: openSafe, bag: openBag };
  for (const b of $$('[data-tool]', $('#sheet'))) b.addEventListener('click', () => open[b.dataset.tool]?.('tools'));
  bindTel('tools');
  $('[data-guides]', $('#sheet')).addEventListener('click', () => document.dispatchEvent(new CustomEvent('brm:guides')));
  for (const a of $$('[data-link]', $('#sheet'))) a.addEventListener('click', () => track('link_click', { label: a.dataset.link }));
  $('#tl-alerts').addEventListener('toggle', (e) => { if (e.target.open) track('link_click', { label: 'alerts' }); });
  $('#tl-close').addEventListener('click', () => closeSheet());
}

// ------------------------------------------------------------------ v1.13.0: six more tools

// Shared bits: a line with its icon and ⚠️ when under review; the sources once.
const lineLi = (x) => `<li><span class="mk-li-ico" aria-hidden="true">${esc(x.icon || '•')}</span><span>${esc(L(x))}${x.verify && x.verify !== 'verified' ? ' <span class="partial">⚠️</span>' : ''}</span></li>`;
const srcOnce = (xs) => {
  const list = xs.filter(Boolean);
  const partial = list.some((x) => x.verify && x.verify !== 'verified');
  return `<p class="kit-src">${esc(u('source'))}: ${esc(agencies([...new Set(list.flatMap((x) => x.sources || []))]))}${partial ? `<br>${esc(t('guidePartial'))}` : ''}</p>`;
};
const scrollTo = (el) => el?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
// A guide's button carries the guide's own title, as the picker and the guide do (v1.13.0, audit 4).
const guideBtn = (id, label) => `<button class="btn secondary small" type="button" data-guide-open="${esc(id)}">${esc(content().checklists?.[id] ? `📋 ${L(content().checklists[id].title)}` : label)}</button>`;
const bindGuideBtns = () => { for (const b of $$('[data-guide-open]', $('#sheet'))) b.addEventListener('click', () => document.dispatchEvent(new CustomEvent('brm:guide', { detail: b.dataset.guideOpen }))); };
// The household, as the home check knows it (people and who), for the water and the bag.
const household = () => {
  const k = saved();
  return { people: k?.people || K.people.default, flags: k?.flags || [], known: !!k?.answered };
};

// Heat today (/hot): the level announced → what to do; heatstroke signs and first aid always one tap away.
export async function openHot(from = 'start') {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'hot', label: from });
  const H = K.hot;
  const tmd = K.links.list.find((x) => x.id === 'tmdwarn');
  let pick = null;
  const range = (l) => (l.hi ? u('hotRange', { lo: l.lo, hi: l.hi }) : u('hotRangeTop', { lo: l.lo }));
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🌡️ ${esc(u('hotTitle'))}</h2>
    <p class="sub">${esc(u('hotIntro'))}</p>
    <p class="kit-q" id="hot-q">${esc(u('hotQ'))}</p>
    <div class="hot-levels" role="radiogroup" aria-labelledby="hot-q">${H.levels.map((l) => `<button class="air-colour hot-level" type="button" role="radio" aria-checked="false" data-v="${esc(l.id)}"><span class="air-dot" style="background:${esc(l.colour)}"></span><span>${esc(L(l.label))}</span><small>${esc(l.hi ? `${l.lo}–${l.hi}` : `${l.lo}+`)}</small></button>`).join('')}</div>
    ${tmd ? `<a class="btn secondary small air-check" href="${esc(tmd.url)}" target="_blank" rel="noopener">${esc(u('hotCheck'))}</a>` : ''}
    <div class="air-out" id="hot-out" aria-live="polite"></div>
    <details class="mk-card hot-aid" id="hot-aid"><summary>${esc(u('hotSigns'))} · ${esc(u('hotAid'))}</summary>
      <p><b>${esc(L(H.signs))}</b></p><p>${esc(L(H.sweat))}</p>
      <h4>${esc(u('hotAid'))}</h4><ol class="tl-steps">${H.aid.map((x) => `<li>${esc(x.icon)} ${esc(L(x))}</li>`).join('')}</ol>
      <p class="tel-row">${telChips(['1669'])}</p>
      ${srcOnce([H.signs, H.sweat, ...H.aid])}
    </details>
    <div class="fr-share" id="hot-share-row" hidden></div>
    <div class="btn-row mk-next">${guideBtn('heat', u('hotGuide'))}</div>
    <p class="kit-privacy">🔒 ${esc(u('hotPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="hot-close">${esc(u('close'))}</button>`, { label: u('hotTitle') });
  const paint = (scroll) => {
    const r = pick ? hotAdvice(H, pick) : null;
    for (const b of $$('.hot-level', $('#sheet'))) { const on = b.dataset.v === pick; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); }
    const box = $('#hot-out');
    $('#hot-share-row').hidden = !r;
    if (!r) { box.innerHTML = `<p class="air-none">${esc(u('hotPick'))}</p>`; box.removeAttribute('style'); return; }
    box.style.setProperty('--lv', r.level.colour);
    box.innerHTML = `<div class="air-badge"><span class="air-dot" style="background:${esc(r.level.colour)}"></span><span><b>${esc(L(r.level.label))}</b><small>${esc(range(r.level))}</small></span></div>
      <h3>${esc(u('hotAll'))}</h3><ul class="mk-lines">${r.all.map(lineLi).join('')}</ul>
      ${r.risk.length ? `<h3>${esc(u('hotRisk'))}</h3><p class="air-also">${esc(L(H.risk))}</p><ul class="mk-lines">${r.risk.map(lineLi).join('')}</ul>` : `<p class="air-also">${esc(u('hotRiskWho', { who: L(H.risk) }))}</p>`}
      ${srcOnce([...r.all, ...r.risk, H.risk])}`;
    // From "danger" up, the signs and first aid open by themselves.
    $('#hot-aid').open = ['danger', 'extreme'].includes(r.level.id) || $('#hot-aid').open;
    if (scroll) scrollTo(box);
  };
  paint();
  for (const b of $$('.hot-level', $('#sheet'))) b.addEventListener('click', () => { pick = b.dataset.v; paint(true); });
  bindTel('hot');
  bindGuideBtns();
  $('#hot-close').addEventListener('click', () => closeSheet());
  textShare($('#hot-share-row'), {
    label: u('hotShare'), title: u('hotTitle'), url: pageUrl('hot'), mode: 'hot',
    text: () => {
      const r = hotAdvice(H, pick);
      if (!r) return `${u('hotTitle')}\n${pageUrl('hot')}`;
      return [u('hotShareHead', { name: L(r.level.label) }), range(r.level), ...r.all.map((x) => `• ${L(x)}`), ...r.risk.map((x) => `• ${u('hotRisk')}: ${L(x)}`), `${u('hotSigns')}: ${midSentence(L(H.signs))}`, `☎️ ${L(H.aid[0])}`, `(${u('source')}: ${agencies([...new Set([...r.all, ...r.risk, H.signs].flatMap((x) => x.sources))])})`, u('hotShareTail', { url: pageUrl('hot') })].join('\n');
    },
  });
}

// Water we have (/water): bottles and jugs counted → days at the home check's amount.
export async function openWater(from = 'start') {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'water', label: from });
  const W = K.water;
  const rule = K.items.find((x) => x.id === 'water');
  const per = rule.qty.perPersonPerDay;
  const target = rule.qty.days;
  const kept = store.get('water', null) || {};
  const s = { people: kept.people || household().people, counts: { ...(kept.counts || {}) }, other: kept.other || '' };
  const fmt = (n) => (getLang() === 'th' ? n.toLocaleString('th-TH') : n.toLocaleString('en-GB'));
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>💧 ${esc(u('waterTitle'))}</h2>
    <p class="sub">${esc(u('waterIntro'))}</p>
    <p class="kit-q" id="wt-people-label">${esc(u('waterPeople'))}</p>
    <div class="stepper" role="group" aria-labelledby="wt-people-label"><button class="step-btn" type="button" data-p="-1" aria-label="${esc(u('less'))}">−</button><output id="wt-n" aria-live="polite">${s.people}</output><button class="step-btn" type="button" data-p="1" aria-label="${esc(u('more'))}">+</button></div>
    <p class="kit-q">${esc(u('waterHave'))}</p>
    <p class="wt-live" id="wt-live" aria-live="polite" hidden></p>
    <div class="wt-sizes">${W.sizes.map((x) => `<div class="wt-size"><span class="mk-ico" aria-hidden="true">${esc(x.icon)}</span><span class="wt-name">${esc(L(x.label))}</span><span class="wt-step"><button class="step-btn" type="button" data-s="${esc(x.id)}" data-d="-1" aria-label="${esc(u('lessItem'))} ${esc(L(x.label))}">−</button><output id="wt-${esc(x.id)}">${s.counts[x.id] || 0}</output><button class="step-btn" type="button" data-s="${esc(x.id)}" data-d="1" aria-label="${esc(u('moreItem'))} ${esc(L(x.label))}">+</button></span></div>`).join('')}</div>
    <label class="calc-field wt-other"><span>${esc(u('waterOther'))}</span><input type="text" id="wt-other" inputmode="decimal" autocomplete="off" value="${esc(s.other)}"></label>
    <div class="air-out" id="wt-out"></div>
    <div class="fr-share" id="wt-share-row" hidden></div>
    <div class="btn-row mk-next"><button class="btn secondary small" type="button" id="wt-kit">${esc(u('waterKit'))}</button></div>
    <p class="kit-privacy">🔒 ${esc(u('waterPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="wt-close">${esc(u('close'))}</button>`, { label: u('waterTitle') });
  const calc = () => waterDays(W, { counts: s.counts, other: s.other, people: s.people, per, target });
  const paint = () => {
    store.set('water', { people: s.people, counts: s.counts, other: s.other });
    $('#wt-n').textContent = s.people;
    for (const x of W.sizes) $(`#wt-${x.id}`).textContent = s.counts[x.id] || 0;
    const r = calc();
    const box = $('#wt-out');
    $('#wt-share-row').hidden = !r.litres;
    const live = $('#wt-live');
    live.hidden = !r.litres;
    if (r.litres) live.innerHTML = `💧 <b>${esc(r.days ? u('waterDays', { d: r.days }) : u('waterLess'))}</b> · <button class="link" type="button" id="wt-more">${esc(u('waterMore'))}</button>`;
    $('#wt-more')?.addEventListener('click', () => scrollTo(box));
    if (!r.litres) { box.innerHTML = `<p class="air-none">${esc(u('waterPick'))}</p>`; box.className = 'air-out'; return; }
    box.className = `air-out wt-out ${r.enough ? 'is-ok' : 'is-short'}`;
    box.innerHTML = `<p class="mk-status"><span aria-hidden="true">💧</span> <b>${esc(r.days ? u('waterDays', { d: r.days }) : u('waterLess'))}</b></p>
      <p class="mk-ctx">${esc(u('waterTotal', { l: fmt(r.litres) }))} · ${esc(u('household', { n: r.people }))}</p>
      <p class="mk-ctx">${esc(u('waterRule', { per }))}</p>
      <p class="wt-goal">${esc(r.enough ? u('waterEnough', { days: target }) : u('waterShort', { need: fmt(r.need), days: target }))}</p>
      <ul class="mk-lines">${W.lines.map(lineLi).join('')}</ul>
      ${srcOnce([rule, ...W.lines])}`;
  };
  paint();
  for (const b of $$('[data-p]', $('#sheet'))) b.addEventListener('click', () => { s.people = Math.min(K.people.max, Math.max(K.people.min, s.people + Number(b.dataset.p))); paint(); });
  for (const b of $$('[data-s]', $('#sheet'))) b.addEventListener('click', () => { s.counts[b.dataset.s] = Math.max(0, Math.min(99, (s.counts[b.dataset.s] || 0) + Number(b.dataset.d))); paint(); });
  $('#wt-other').addEventListener('input', (e) => { s.other = e.target.value.slice(0, 6); paint(); });
  $('#wt-kit').addEventListener('click', () => openKit('water'));
  $('#wt-close').addEventListener('click', () => closeSheet());
  textShare($('#wt-share-row'), {
    label: u('waterShare'), title: u('waterTitle'), url: pageUrl('water'), mode: 'water',
    text: () => {
      const r = calc();
      return [`💧 ${u('waterTitle')}`, `${r.days ? u('waterDays', { d: r.days }) : u('waterLess')} · ${u('waterTotal', { l: fmt(r.litres) })} · ${u('household', { n: r.people })}`, r.enough ? u('waterEnough', { days: target }) : u('waterShort', { need: fmt(r.need), days: target }), `(${u('waterRule', { per })})`, u('waterShareTail', { url: pageUrl('water') })].join('\n');
    },
  });
}

// Chlorine for a water tank (/tank): its size and the chlorine → how much; the steps and the care always shown.
export async function openTank(from = 'start') {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'tank', label: from });
  const T = K.tank;
  const s = { litres: null, type: null, small: null };
  const fmt = (n) => (getLang() === 'th' ? n.toLocaleString('th-TH') : n.toLocaleString('en-GB'));
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🚰 ${esc(u('tankTitle'))}</h2>
    <p class="sub">${esc(u('tankIntro'))}</p>
    <p class="kit-q" id="tk-size-q">${esc(u('tankSize'))}</p>
    <div class="mk-opts tk-sizes" role="radiogroup" aria-labelledby="tk-size-q">${T.sizes.map((n) => `<button class="mk-opt tk-size" type="button" role="radio" aria-checked="false" data-l="${n}"><span>${esc(u('tankLitres', { n: fmt(n) }))}</span></button>`).join('')}</div>
    <label class="calc-field wt-other"><span>${esc(u('tankOther'))}</span><input type="text" id="tk-other" inputmode="decimal" autocomplete="off"></label>
    <p class="kit-q" id="tk-type-q">${esc(u('tankType'))}</p>
    <div class="mk-opts mk-one" role="radiogroup" aria-labelledby="tk-type-q">${T.types.map((x) => `<button class="mk-opt tk-type" type="button" role="radio" aria-checked="false" data-t="${esc(x.id)}"><span class="mk-ico" aria-hidden="true">🧪</span><span>${esc(L(x.label))}</span></button>`).join('')}</div>
    <div class="air-out" id="tk-out" aria-live="polite"></div>
    <h3>${esc(u('tankSteps'))}</h3>
    <ol class="mk-lines tk-steps">${T.steps.map(lineLi).join('')}</ol>
    <h3>${esc(u('tankSafety'))}</h3>
    <ul class="mk-lines">${T.safety.map(lineLi).join('')}</ul>
    ${srcOnce([...T.types, ...T.steps, ...T.safety])}
    <div class="fr-share" id="tk-share-row" hidden></div>
    <div class="btn-row mk-next">${guideBtn('return', u('tankGuide'))}</div>
    <p class="kit-privacy">🔒 ${esc(u('tankPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="tk-close">${esc(u('close'))}</button>`, { label: u('tankTitle') });
  const paint = (scroll) => {
    for (const b of $$('.tk-size', $('#sheet'))) { const on = Number(b.dataset.l) === s.litres; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); }
    for (const b of $$('.tk-type', $('#sheet'))) { const on = b.dataset.t === s.type; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); }
    const box = $('#tk-out');
    // Under 100 litres is not a tank: "1.5" usually means 1.5 คิว (cubic metres,
    // as the MWA's leaflet counts), so ask instead of answering for 1.5 litres.
    if (s.small) {
      $('#tk-share-row').hidden = true;
      box.className = 'air-out';
      box.innerHTML = `<p class="air-none">${esc(u('tankSmall'))}</p><button class="btn secondary small" type="button" id="tk-cubic">${esc(u('tankCubic', { v: fmt(s.small), l: fmt(Math.round(s.small * 1000)) }))}</button>`;
      $('#tk-cubic').addEventListener('click', () => { s.litres = Math.round(s.small * 1000); s.small = null; $('#tk-other').value = String(s.litres); paint(!!s.type); });
      return;
    }
    const r = tankDose(T, s);
    $('#tk-share-row').hidden = !r;
    if (!r) { box.innerHTML = `<p class="air-none">${esc(u('tankPick'))}</p>`; box.className = 'air-out'; return; }
    box.className = 'air-out tk-out';
    box.innerHTML = `<p class="mk-status"><span aria-hidden="true">🧪</span> <b>${esc(u('tankAmount', { type: midSentence(L(r.type.label)), n: fmt(r.amount), unit: L(r.type.unit) }))}</b></p>
      <p class="mk-ctx">${esc(u('tankFor', { l: fmt(r.litres) }))}</p>
      ${r.type.dissolve ? `<ul class="mk-lines">${lineLi({ icon: '🥣', ...r.type.dissolve })}</ul>` : ''}`;
    if (scroll) scrollTo(box);
  };
  paint();
  for (const b of $$('.tk-size', $('#sheet'))) b.addEventListener('click', () => { s.litres = Number(b.dataset.l); s.small = null; $('#tk-other').value = ''; paint(!!s.type); });
  for (const b of $$('.tk-type', $('#sheet'))) b.addEventListener('click', () => { s.type = b.dataset.t; paint(!!s.litres); });
  $('#tk-other').addEventListener('input', (e) => { const v = typedNumber(e.target.value); s.small = v > 0 && v < 100 ? v : null; s.litres = v >= 100 ? Math.round(v) : null; paint(); });
  bindGuideBtns();
  $('#tk-close').addEventListener('click', () => closeSheet());
  textShare($('#tk-share-row'), {
    label: u('tankShare'), title: u('tankTitle'), url: pageUrl('tank'), mode: 'tank',
    text: () => {
      const r = tankDose(T, s);
      if (!r) return `${u('tankTitle')}\n${pageUrl('tank')}`;
      return [`🚰 ${u('tankTitle')}`, `${u('tankAmount', { type: midSentence(L(r.type.label)), n: fmt(r.amount), unit: L(r.type.unit) })} · ${u('tankFor', { l: fmt(r.litres) })}`, ...T.steps.map((x, i) => `${i + 1}. ${L(x)}`), ...T.safety.slice(0, 3).map((x) => `⚠️ ${L(x)}`), `(${u('source')}: ${agencies([...new Set([...T.types, ...T.steps].flatMap((x) => x.sources))])})`, u('tankShareTail', { url: pageUrl('tank') })].join('\n');
    },
  });
}

// The emergency info card (/info): what a doctor or rescuer needs to know, made into a picture
// on the phone (the plan card's layout). Kept on this device only (brm:info), several people.
export async function openInfo(from = 'start', again = false) {
  await loadKit();
  pendingBack = from;
  if (!again) track('tool_open', { mode: 'info', label: from });
  const I = K.info;
  const st = store.get('info', null);
  const data = { cards: Array.isArray(st?.cards) && st.cards.length ? st.cards : [{}], cur: Number.isInteger(st?.cur) ? st.cur : 0 };
  data.cur = Math.min(data.cur, data.cards.length - 1);
  const save = () => store.set('info', data);
  const card = () => data.cards[data.cur];
  const who = (c, i) => c.name || u('infoNth', { n: i + 1 });
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🆔 ${esc(u('infoTitle'))}</h2>
    <p class="sub">${esc(u('infoIntro'))}</p>
    <p class="kit-privacy">🔒 ${esc(u('infoPrivacy'))}</p>
    <div class="kit-flags info-people">${data.cards.map((c, i) => `<button class="mk-opt info-person${i === data.cur ? ' is-on' : ''}" type="button" data-i="${i}"><span>${esc(who(c, i))}</span></button>`).join('')}${data.cards.length < 6 ? `<button class="mk-opt info-person" type="button" data-i="new"><span>${esc(u('infoAdd'))}</span></button>` : ''}</div>
    <div class="plan-form">${I.fields.map((f) => `
      <label class="plan-field"><span class="plan-label">${esc(f.icon)} ${esc(L(f.label))}</span>
        <input type="text" name="${esc(f.id)}" maxlength="${f.max}" value="${esc(card()[f.id] || '')}" placeholder="${esc(L(f.placeholder))}" autocomplete="off">
      </label>`).join('')}
    </div>
    <button class="btn" type="button" id="info-make">${esc(u('infoMake'))}</button>
    ${data.cards.length > 1 ? `<button class="btn secondary small" type="button" id="info-del">${esc(u('infoDelete'))}</button>` : ''}
    <h3>${esc(u('infoWhy'))}</h3><ul class="mk-lines">${I.why.map(lineLi).join('')}</ul>
    <h3>${esc(u('infoKeep'))}</h3><ul class="mk-lines">${I.keep.map(lineLi).join('')}</ul>
    <details class="mk-card"><summary>${esc(u('infoCall'))}</summary><ol class="tl-steps">${I.call.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ol></details>
    ${srcOnce([...I.why, ...I.keep, ...I.call])}
    <button class="btn secondary small" type="button" id="info-close">${esc(u('close'))}</button>`, { label: u('infoTitle') });
  const read = () => Object.fromEntries(I.fields.map((f) => [f.id, ($(`.plan-form input[name="${f.id}"]`)?.value || '').trim().slice(0, f.max)]));
  for (const input of $$('.plan-form input', $('#sheet'))) input.addEventListener('change', () => { data.cards[data.cur] = read(); save(); });
  $('.plan-form input[name="name"]').addEventListener('input', (e) => { const tab = $('.info-person.is-on span'); if (tab) tab.textContent = e.target.value.trim() || u('infoNth', { n: data.cur + 1 }); });
  for (const b of $$('.info-person', $('#sheet'))) {
    b.addEventListener('click', () => {
      data.cards[data.cur] = read();
      if (b.dataset.i === 'new') { data.cards.push({}); data.cur = data.cards.length - 1; } else data.cur = Number(b.dataset.i);
      save();
      openInfo(from, true);
    });
  }
  $('#info-del')?.addEventListener('click', () => { data.cards.splice(data.cur, 1); data.cur = 0; save(); openInfo(from, true); });
  $('#info-close').addEventListener('click', () => closeSheet());
  $('#info-make').addEventListener('click', async () => {
    const v = read();
    if (!Object.values(v).some(Boolean)) { toast(u('infoEmpty')); return; }
    data.cards[data.cur] = v;
    save();
    assets = assets || await loadCardAssets();
    const canvas = document.createElement('canvas');
    const C = content();
    const date = bangkokDateKey();
    const calls = ['1669', '1784'].map((n) => C.helplines.find((h) => h.number === n)).filter(Boolean);
    drawPlanCard(canvas, {
      logo: [t('logoA'), t('logoB')], title: v.name ? `${u('infoCardTitle')}: ${v.name}` : u('infoCardTitle'), date: u('planDate', { date: formatHouseDate(date, getLang()) }),
      rows: I.fields.filter((f) => f.id !== 'name').map((f) => ({ label: L(f.label), value: v[f.id] })),
      helpLabel: u('helpLabel'), helpNumbers: calls.map((h) => h.number).join('  ·  '), calls: calls.map((h) => ({ number: h.number, name: L(h.short) })),
      keep: u('infoKeepCard'), url: pageUrl('info'), footer: u('infoFooter'),
    }, assets);
    shareImage({
      canvas, title: u('infoShareTitle'), text: u('infoShareText', { url: pageUrl('info') }), url: pageUrl('info'), filename: 'baanrodmai-info.png',
      event: 'tool_share', mode: 'info', back: () => openInfo(from, true), backLabel: u('infoBack'),
      copy: { label: u('infoCopy'), text: () => [`${u('infoCardTitle')}${v.name ? `: ${v.name}` : ''}`, ...I.fields.filter((f) => f.id !== 'name' && v[f.id]).map((f) => `${f.icon} ${L(f.label)}: ${v[f.id]}`), `${u('helpLabel')}: ${calls.map((h) => `${h.number} ${L(h.short)}`).join(' · ')}`].join('\n') },
    });
  });
}

// "I'm safe" (/safe): how you are → one message, sent by LINE or SMS; needing help shows the numbers first.
export async function openSafe(from = 'start') {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'safe', label: from });
  const Sf = K.safe;
  const C = content();
  const plan = store.get('plan', null) || {};
  const places = ['meet', 'shelter'].map((id) => plan[id]).filter(Boolean);
  const s = { status: null, where: '', note: '' };
  const now = () => new Date().toLocaleString(getLang() === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' }) + (getLang() === 'th' ? ' น.' : '');
  const msg = () => safeMessage(Sf, { ...s, time: u('safeNow', { time: now() }), lang: getLang() });
  const line = K.links.list.find((x) => x.id === 'ddpm1784');
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>💬 ${esc(u('safeTitle'))}</h2>
    <p class="sub">${esc(u('safeIntro'))}</p>
    <p class="kit-q" id="sf-q">${esc(u('safeQ'))}</p>
    <div class="mk-opts mk-one" role="radiogroup" aria-labelledby="sf-q">${Sf.status.map((x) => `<button class="mk-opt sf-status" type="button" role="radio" aria-checked="false" data-v="${esc(x.id)}"><span class="mk-ico" aria-hidden="true">${esc(x.icon)}</span><span>${esc(L(x.label))}</span></button>`).join('')}</div>
    <div class="sf-help" id="sf-help" hidden><p><b>${esc(u('safeCallFirst'))}</b></p><p class="tel-row">${telChips(Sf.status.find((x) => x.id === 'help').calls || [])}</p>${line ? `<ul class="tl-links">${linkRow(line)}</ul>` : ''}</div>
    <div id="sf-form" hidden>
      <label class="plan-field" id="sf-where-row"><span class="plan-label">📍 ${esc(u('safeWhere'))}</span><input type="text" id="sf-where" maxlength="60" placeholder="${esc(u('safeWherePh'))}" autocomplete="off"></label>
      ${places.length ? `<div class="kit-flags sf-places">${places.map((p) => `<button class="mk-opt sf-place" type="button" data-p="${esc(p)}"><span>📝 ${esc(p)}</span></button>`).join('')}</div>` : ''}
      <label class="plan-field"><span class="plan-label">✏️ ${esc(u('safeNote'))}</span><input type="text" id="sf-note" maxlength="80" placeholder="${esc(u('safeNotePh'))}" autocomplete="off"></label>
      <p class="kit-q">${esc(u('safePreview'))}</p>
      <p class="sf-preview" id="sf-preview"></p>
      <div class="share-grid share-grid-text" id="sf-send">
        ${canNativeShare() ? `<button class="share-btn" type="button" data-t="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
        <button class="share-btn" type="button" data-t="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
        <a class="share-btn" id="sf-sms" data-t="sms" href="sms:"><span class="ico ico-copy">✉</span>${esc(u('safeSms'))}</a>
        <button class="share-btn" type="button" data-t="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
      </div>
    </div>
    <ul class="mk-lines">${Sf.lines.map(lineLi).join('')}</ul>
    ${srcOnce(Sf.lines)}
    <div class="btn-row mk-next"><button class="btn secondary small" type="button" id="sf-plan">${esc(u('safePlan'))}</button></div>
    <p class="kit-privacy">🔒 ${esc(u('safePrivacy'))}</p>
    <button class="btn secondary small" type="button" id="sf-close">${esc(u('close'))}</button>`, { label: u('safeTitle') });
  const paint = () => {
    const st = Sf.status.find((x) => x.id === s.status);
    for (const b of $$('.sf-status', $('#sheet'))) { const on = b.dataset.v === s.status; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); }
    $('#sf-help').hidden = s.status !== 'help';
    $('#sf-form').hidden = !st;
    $('#sf-where-row').hidden = !st?.at;
    const m = msg();
    $('#sf-preview').textContent = m;
    $('#sf-sms').href = `sms:?&body=${encodeURIComponent(m)}`;
  };
  paint();
  for (const b of $$('.sf-status', $('#sheet'))) b.addEventListener('click', () => { s.status = b.dataset.v; paint(); scrollTo($(s.status === 'help' ? '#sf-help' : '#sf-form')); });
  for (const b of $$('.sf-place', $('#sheet'))) b.addEventListener('click', () => { s.where = b.dataset.p; $('#sf-where').value = s.where; paint(); });
  $('#sf-where').addEventListener('input', (e) => { s.where = e.target.value; paint(); });
  $('#sf-note').addEventListener('input', (e) => { s.note = e.target.value; paint(); });
  for (const b of $$('[data-t]', $('#sf-send'))) {
    b.addEventListener('click', async (e) => {
      const k = b.dataset.t;
      track('tool_share', { mode: 'safe', label: k });
      if (k === 'sms') return; // the link itself opens the messages app
      e.preventDefault();
      const body = msg();
      if (k === 'native') await nativeShare({ title: u('safeTitle'), text: body });
      else if (k === 'line') openExternal(lineShareUrl(body));
      else { await copyText(body); toast(t('copied')); }
    });
  }
  for (const a of $$('[data-link]', $('#sheet'))) a.addEventListener('click', () => track('link_click', { label: a.dataset.link, mode: 'safe' }));
  $('#sf-plan').addEventListener('click', () => openPlan('safe'));
  bindTel('safe');
  $('#sf-close').addEventListener('click', () => closeSheet());
}

// The emergency bag (/bag): what every bag holds and what our people add; ticks kept on this device (brm:bag).
export async function openBag(from = 'start') {
  await loadKit();
  pendingBack = from;
  track('tool_open', { mode: 'bag', label: from });
  const B = K.bag;
  const hh = household();
  const list = bagList(B, hh.flags);
  const have = new Set((store.get('bag', null)?.have || []).filter((id) => list.all.some((x) => x.id === id)));
  const flagNames = hh.flags.map((f) => K.flags.find((x) => x.id === f)).filter(Boolean).map((f) => L(f.label));
  const row = (x) => `<li><label class="kit-row"><input type="checkbox" data-id="${esc(x.id)}"${have.has(x.id) ? ' checked' : ''}><span class="kit-ico" aria-hidden="true">${esc(x.icon)}</span><span class="kit-text"><b>${esc(L(x.label))}</b>${x.verify !== 'verified' ? '<span class="kit-src">⚠️</span>' : ''}</span></label></li>`;
  openSheet(`
    <h2 id="sheet-title" tabindex="-1" autofocus>🧳 ${esc(u('bagTitle'))}</h2>
    <p class="sub">${esc(L(B.what))}</p>
    <p class="kit-house">${hh.known ? `${esc(u('household', { n: hh.people }))}${flagNames.length ? ` · ${esc(flagNames.join(' · '))}` : ''} · <button class="link" type="button" id="bag-edit">${esc(u('edit'))}</button>` : `${esc(u('bagNoKit'))} <button class="link" type="button" id="bag-edit">${esc(u('bagAnswer'))}</button>`}</p>
    <div class="kit-meter" aria-hidden="true"><span id="bag-bar"></span></div>
    <p class="kit-score"><b id="bag-count"></b></p>
    <p class="sub">${esc(u('bagIntro'))}</p>
    <h3>${esc(u('bagEvery'))}</h3><ul class="kit-list">${list.every.map(row).join('')}</ul>
    ${list.extra.length ? `<h3>${esc(u('bagExtra'))}</h3><ul class="kit-list">${list.extra.map(row).join('')}</ul>` : ''}
    <ul class="mk-lines">${lineLi({ icon: '🔁', ...B.check })}</ul>
    ${srcOnce([...list.all, B.check, B.what])}
    <div class="fr-share" id="bag-share-row"></div>
    <div class="btn-row mk-next"><button class="btn secondary small" type="button" id="bag-info">${esc(u('bagInfo'))}</button><button class="btn secondary small" type="button" id="bag-kit">${esc(u('bagKit'))}</button></div>
    ${canPrint() ? `<button class="btn secondary small" type="button" id="bag-print">${esc(t('printBtn'))}</button>` : ''}
    <p class="kit-privacy">🔒 ${esc(u('bagPrivacy'))}</p>
    <button class="btn secondary small" type="button" id="bag-close">${esc(u('close'))}</button>`, { label: u('bagTitle') });
  const paint = () => {
    const n = list.all.filter((x) => have.has(x.id)).length;
    $('#bag-count').textContent = u('bagCount', { have: n, total: list.all.length });
    $('#bag-bar').style.width = `${Math.round((100 * n) / list.all.length)}%`;
    store.set('bag', { have: [...have] });
  };
  paint();
  for (const box of $$('.kit-row input', $('#sheet'))) box.addEventListener('change', () => { if (box.checked) have.add(box.dataset.id); else have.delete(box.dataset.id); paint(); });
  $('#bag-edit').addEventListener('click', () => openKit('bag'));
  $('#bag-kit').addEventListener('click', () => openKit('bag'));
  $('#bag-info').addEventListener('click', () => openInfo('bag'));
  $('#bag-close').addEventListener('click', () => closeSheet());
  $('#bag-print')?.addEventListener('click', () => {
    track('print', { label: 'bag' });
    printList({
      brand: `${t('logoA')}${t('logoB')}`, title: u('bagTitle'), sub: L(B.what),
      sections: [{ head: u('bagEvery'), items: list.every.map((x) => ({ text: L(x.label), note: '' })) }, ...(list.extra.length ? [{ head: u('bagExtra'), items: list.extra.map((x) => ({ text: L(x.label), note: x.verify !== 'verified' ? u('partial') : '' })) }] : [])],
      foot: [L(B.check), `${u('source')}: ${agencies([...new Set(list.all.flatMap((x) => x.sources))])}`, t('printNote', { url: pageUrl('bag').replace(/^https?:\/\//, ''), date: formatHouseDate(bangkokDateKey(), getLang()) }), t('disclaimer')],
    });
  });
  textShare($('#bag-share-row'), {
    label: u('bagShare'), title: u('bagTitle'), url: pageUrl('bag'), mode: 'bag',
    text: () => {
      const missing = list.all.filter((x) => !have.has(x.id));
      return [missing.length ? u('bagShareHead') : u('bagShareDone'), ...missing.map((x) => `• ${L(x.label)}`), u('bagShareTail', { url: pageUrl('bag') })].join('\n');
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
async function shareImage({ canvas, title, text, url, filename, event, value = 0, back, backLabel, copy = null, mode = '' }) {
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
      track(event, { label: k, value, mode });
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
  // A title too long for one line at 44 px (an English name on the emergency
  // card) wraps to two, so it never runs under the gecko (v1.13.0, audit 4).
  const title = plainText(d.title);
  fitText(ctx, title, 720, 64, 44);
  const two = ctx.measureText(title).width > 720;
  if (two) { font(ctx, 44); wrapText(ctx, title, 720).slice(0, 2).forEach((ln, i) => ctx.fillText(ln, 60, 160 + i * 54)); } else ctx.fillText(title, 60, 200);
  font(ctx, two ? 30 : 32, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(plainText(d.date), 60, two ? 270 : 256);
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

// A guide's links to the agencies' own pages (kit.json → links[].guides), as chips.
export async function guideLinks(guide) {
  await loadKit();
  const xs = K.links.list.filter((x) => x.guides.includes(guide));
  if (!xs.length) return '';
  return `<h3>${esc(u('guideLinks'))}</h3><ul class="tl-links">${xs.map(linkRow).join('')}</ul>`;
}

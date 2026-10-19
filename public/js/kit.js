// "How ready is our house?" (/?open=kit) and the family plan card
// (/?open=plan). Loaded only when one of them opens. Answers, ticks and the
// plan's text stay on this device (localStorage brm:kit, brm:plan); only
// anonymous counts are sent (kit_open, kit_share, plan_share), never the text.

import { $, $$, esc, store, bangkokDateKey, formatHouseDate } from './util.js';
import { t, L, getLang, siteUrl, content, agencyName } from './content.js';
import { openSheet, closeSheet, toast, canPrint, printList } from './ui.js';
import { kit as draw, loadCardAssets, canvasToBlob, wrapText } from './cards.js';
import {
  canNativeShare, nativeShare, shareChannel, copyText, canDownload, downloadBlob, imageSrc,
} from './share.js';
import { track } from './analytics.js';
import { kitPlan, kitScore, kitMissing } from './kitplan.js';

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
    const missing = kitMissing(plan, s.have).map((x) => L(x.item.label));
    assets = assets || await loadCardAssets();
    const canvas = document.createElement('canvas');
    drawKitCard(canvas, {
      logo: [t('logoA'), t('logoB')], title: u('cardTitle'), pct: sc.pct, count: u('cardCount', { have: sc.have, total: sc.total }),
      missingLabel: u('cardMissing'), missing, allSet: u('cardAllSet'), cta: u('cardCta'), url: pageUrl('kit'), footer: t('cardFooter'),
    }, assets);
    const url = pageUrl('kit');
    shareImage({
      canvas, title: u('shareTitle'), text: u('shareText', { pct: sc.pct, url }), url, filename: 'baanrodmai-kit.png',
      event: 'kit_share', value: sc.pct, back: () => showList(s), backLabel: u('back'),
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
      keep: u('planKeep'), url: pageUrl('plan'), footer: t('cardFooter'),
    }, assets);
    const url = pageUrl('plan');
    shareImage({
      canvas, title: u('planShareTitle'), text: u('planShareText', { url }), url, filename: 'baanrodmai-plan.png',
      event: 'plan_share', back: () => openPlan(from, true), backLabel: u('backPlan'),
    });
  });
}

// ------------------------------------------------------------------ sharing an image

async function shareImage({ canvas, title, text, url, filename, event, value = 0, back, backLabel }) {
  const blob = await canvasToBlob(canvas);
  let file = null;
  try { file = new File([blob], filename, { type: 'image/png' }); } catch { /* old browser */ }
  const saveOk = canDownload();
  openSheet(`
    <h2 id="sheet-title">${esc(title)}</h2>
    <div class="share-grid">
      ${canNativeShare() ? `<button class="share-btn" data-k="native"><span class="ico ico-native">⇪</span>${esc(t('shareNative'))}</button>` : ''}
      <button class="share-btn" data-k="line"><span class="ico ico-line">L</span>${esc(t('shareLine'))}</button>
      <button class="share-btn" data-k="facebook"><span class="ico ico-fb">f</span>${esc(t('shareFb'))}</button>
      <button class="share-btn" data-k="copy"><span class="ico ico-copy">⧉</span>${esc(t('shareCopy'))}</button>
      ${saveOk ? `<button class="share-btn" data-k="save"><span class="ico ico-save">↓</span>${esc(t('shareSave'))}</button>` : ''}
    </div>
    <img class="card-preview share-preview" id="kit-img" alt="${esc(title)}">
    ${saveOk ? '' : `<p class="save-hint">💡 ${esc(t('saveHint'))}</p>`}
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
  ctx.fillText(plainText(d.helpLabel), W / 2, fy + 56);
  ctx.fillStyle = '#FFFFFF';
  fitText(ctx, d.helpNumbers, W - 160, 50, 32);
  ctx.fillText(d.helpNumbers, W / 2, fy + 122);
  ctx.fillStyle = INK;
  fitText(ctx, plainText(d.keep), W - 100, 36, 26);
  ctx.fillText(plainText(d.keep), W / 2, 1246);
  font(ctx, 30, 400);
  ctx.fillStyle = INK2;
  ctx.fillText(d.url.replace(/^https?:\/\//, ''), W / 2, 1294);
  font(ctx, 24, 400);
  ctx.fillText(d.footer, W / 2, 1334);
}

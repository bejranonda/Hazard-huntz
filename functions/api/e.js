// POST /api/e — anonymous event counter.
// Body: { "v": 1, "e": [[name, mode, label, value], ...] } (max 25 events).
// Writes one Analytics Engine data point per event. Nothing identifying is
// stored: no IP, no user agent, no IDs, no location. If the EVENTS binding is
// missing the endpoint still answers 204, so the game never notices.

const ALLOWED = new Set([
  'view', 'mode_select', 'round_start', 'round_end', 'share_open', 'share_click',
  'challenge_open', 'challenge_play', 'checklist_open', 'checklist_save',
  'help_click', 'forecast_click', 'lang',
]);
const MAX_EVENTS = 25;
const MAX_BODY = 4096;

const clean = (v, n) => String(v ?? '').replace(/[^\w\-.:]/g, '').slice(0, n);

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { allow: 'POST' } });
  }
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) {
    return new Response(null, { status: 413 });
  }
  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const events = Array.isArray(body?.e) ? body.e.slice(0, MAX_EVENTS) : [];
  const ds = env.EVENTS;
  if (ds && typeof ds.writeDataPoint === 'function') {
    for (const ev of events) {
      if (!Array.isArray(ev)) continue;
      const name = clean(ev[0], 24);
      if (!ALLOWED.has(name)) continue;
      const value = Number(ev[3]);
      // blob1 event, blob2 mode, blob3 label; double1 value (e.g. score).
      ds.writeDataPoint({
        indexes: [name],
        blobs: [name, clean(ev[1], 16), clean(ev[2], 32)],
        doubles: [Number.isFinite(value) ? value : 0],
      });
    }
  }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

// The carousel sets: one multi-image post per hazard (a cover, one page per
// lesson, the checklists and a "play the game" page). Shared by
// tools/build.mjs (the /posts page and its checks) and tools/render.html (the
// images), so the two never disagree. Every lesson's text comes from
// items.json; carousel.json → sets.<hazard> picks which lessons.

const cap = (id) => id.charAt(0).toUpperCase() + id.slice(1);
const fill = (s, vars) => String(s ?? '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// { config, strings, carousel, items, sources, checklists, helplines } as in public/content.
export function carouselSets(C, site, lang = 'th') {
  const S = C.strings[lang];
  const K = C.carousel?.[lang] || {};
  const seo = C.strings.seo?.[lang] || {};
  const host = site.replace(/^https?:\/\//, '');
  const main = C.helplines.filter((h) => h.main).map((h) => h.number).join('  ·  ');
  const agency = (id) => (lang === 'en' ? C.strings.seo?.en?.agencies?.[C.sources[id].agency] : null) || C.sources[id].agency;
  return Object.entries(C.config.hazards || {}).map(([hazard, h]) => {
    const H = cap(hazard);
    const modes = C.config.modes.filter((m) => m.hazard === hazard).map((m) => m.id);
    const ids = C.carousel?.sets?.[hazard] || [];
    const lessons = ids.map((id) => C.items.find((it) => it.id === id)).filter(Boolean);
    const url = `${site}/${h.slug}`;
    const common = { logo: [S.logoA, S.logoB], url, footer: S.cardFooter };
    const pages = [
      {
        kind: 'cover', mode: modes[0], modeLabel: modes.map((m) => S[`mode${cap(m)}`]).join(' · '),
        title: fill(K[`cover${H}Title`], { n: lessons.length }), subtitle: K[`cover${H}Sub`], swipe: K.swipe,
      },
      ...lessons.map((it) => {
        const right = it.choices.find((c) => c.correct);
        return {
          kind: 'tip', mode: it.mode, modeLabel: S[`mode${cap(it.mode)}`], sprite: it.sprite,
          name: it.name[lang], doLabel: K.doLabel, doText: right.label[lang],
          whyLabel: K.whyLabel, why: it.why[lang], sourceLabel: K.sourceLabel,
          source: [...new Set((it.sources || []).filter((id) => C.sources[id]).map(agency))].join(' · '),
          flag: it.verify === 'verified' ? null : seo.partialNote,
        };
      }),
      ...modes.filter((m) => C.checklists[m]).map((m) => ({
        kind: 'checklist', mode: m, title: C.checklists[m].title[lang], items: C.checklists[m].items.map((x) => x[lang]),
      })),
      {
        kind: 'cta', mode: modes[0], title: K.ctaTitle, sub: K.ctaSub, short: `${host}/${h.slug}`,
        helpLabel: K.helpLabel, helpNumbers: main,
      },
    ].map((p, i, all) => ({ ...common, ...p, page: i + 1, pages: all.length, file: `${String(i + 1).padStart(2, '0')}.jpg` }));
    return {
      hazard, slug: h.slug, modes, ids, dir: `share/carousel/${lang === 'en' ? 'en/' : ''}${h.slug}`, pages,
      caption: fill(K[`caption${H}`], { n: lessons.length, url, play: `${site}/?mode=${modes[0]}` }),
    };
  });
}

// A fingerprint of everything the images show. tools/render-images.mjs writes
// it next to the images (manifest.json); the build compares, so lesson text
// changed after the last render shows up as a warning, not as an old picture.
export async function carouselHash(C, site, lang = 'th') {
  const data = new TextEncoder().encode(JSON.stringify(carouselSets(C, site, lang)));
  const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

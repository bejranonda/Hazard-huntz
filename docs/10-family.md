# 10. The family: บ้านรอดไหม, ภัยรอบบ้าน and FloodWatch

> Since v1.14.0 (2 Nov 2026). The owner runs three apps. This page says what each one is for, what they share, and what must not change without telling the others. The rules are [GUIDELINES rules 100–101](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the work is [ROADMAP N30](ROADMAP.md#n30-fit-with-the-family-v1140); the method [APPROACH §37](APPROACH_AND_METHOD.md#37-fitting-the-family-check-the-brief-then-source-what-the-sister-app-needs-v1140).

## 1. Who does what (don't merge them)

| App | Its job | Address |
|---|---|---|
| **บ้านรอดไหม** (this repository, Hazard-huntz) | **What to do.** Sourced guides, the home check, the family plan, the calculators, the game. No live data. | https://baanrodmai.autobahn.bot (English `/en/`) |
| **ภัยรอบบ้าน · Thai Risk** | **What is happening** at the reader's subdistrict now and for 3 days, every hazard. Writes no advice of its own: its action lines are copied from this repository's `public/content/kit.json`, and its "what to do" links come here. | https://risk.autobahn.bot (English `/en`) |
| **FloodWatch** | The rivers and canals: gauge levels against their banks. It is being handed over to ONWR, whose copy links none of the family (tested by FloodWatch), and its own site closes after the project, on no date yet: it follows ONWR's install (FloodWatch, 2–3 Nov 2026); ภัยรอบบ้าน keeps working without it. | https://flood.autobahn.bot |

**In this app:**
- The start screen, every guide, the result screen, the eight hazard pages and the dust, heat and mask pages link "📍 ดูภัยที่ตำบลของคุณตอนนี้" to ภัยรอบบ้าน in the reader's language (`config.json → riskAppUrl`). Nothing about the reader goes with the link (no place, no position, no event).
- FloodWatch stays as the extra link for the rivers (`forecastAppUrl`, "🌊 ระดับน้ำในแม่น้ำ คลอง (FloodWatch)"), after ภัยรอบบ้าน, never the only route. **When it closes,** set `forecastAppUrl` to `""`: every FloodWatch button hides and nothing else changes (tested in v1.14.2: no build warning, every unit and smoke check passes, no page links it; [KNOWN_ISSUES #102](KNOWN_ISSUES.md#102-floodwatch-closes-after-its-handover-the-rivers-link-goes-with-it)).
- No line states a live condition: the hand-set rain switch is gone, and the gecko's lines are timeless ([KNOWN_ISSUES F164–F166](KNOWN_ISSUES.md#in-v1140-2-nov-2026)).

## 2. What ภัยรอบบ้าน reads from this app (the contract)

`https://baanrodmai.autobahn.bot/content/kit.json`, checked there by `npm run check:advice`:

| Field | What it holds | Fixed numbers |
|---|---|---|
| `air.levels[].all[0]` (`th`, `en`, `sources`) and `.pm` | PM2.5 by the PCD's bands: the line for everyone | band tops 15 / 25 / 37.5 / 75 µg/m³ (the last open) |
| `air.baby` | the under-2 line that goes with every mask line | — |
| `hot.levels[].all[0]` and `.lo` | the heat index by the DOH and TMD bands | floors 27 / 33 / 42 / 52 °C |
| **`flood.levels[]`** (v1.14.0) | `id` `watch` · `warn` · `danger` = ติดตามไว้ · เตรียมตัว · เสี่ยงสูง; `label`; `all[]` of `{th, en, sources, verify}` | — |
| **`flood.during[]`** (v1.14.0) | while the water is rising, eight lines (the `/flood#during` section) | — |
| **`flood.flash`** (v1.14.3, ภัยรอบบ้าน's B28) | water off the hills: one line `{label, th, en, sources, verify, verifyNote, icon, guide}`, shown by ภัยรอบบ้าน in place of the เตรียมตัว line when HII's flash-flood list set the level; on `/flood#flash`, followed by a link to `/landslide#landslide-during` (`guide: "landslide"`) | — |
| **`uv.levels[]`** (v1.14.0) | `id` `low` · `protect` · `veryhigh` · `extreme`; `lo`, `hi` whole UV index numbers; `label`; `all[]` | 0–2 / 3–7 / 8–10 / 11+ |
| **`uv.notes[]`** (v1.14.0) | two lines for any level (sunscreen isn't more time in the sun; clouds don't stop UV) | — |

**The pages ภัยรอบบ้าน links**, each also under `/en`: `/air`, `/flood` (and since v1.14.0 `/flood#during`, `/flood#levels`, `/flood#level-watch`, `#level-warn`, `#level-danger`), `/hot`, `/landslide`, `/mask`, `/pm25`, `/quake`, `/storm`, and since v1.14.0 `/uv` (anchors `#uv-low`, `#uv-protect`, `#uv-veryhigh`, `#uv-extreme`).

**The pages FloodWatch links** (until it closes): exactly `/`, `/learn`, `/checklist/prepare` and `/checklist/return`, which FloodWatch's own test pins too (FloodWatch, 3 Nov 2026); held by the same unit test since v1.14.2. FloodWatch doesn't link `/flood#during`; it is kept for ภัยรอบบ้าน (and for a FloodWatch station link its owner may add later). **If one of the four must ever move, tell FloodWatch first**, then leave a redirect in `public/_redirects`.

**Arriving here** (v1.14.1): every anchor lands at the top of the screen, and a level a link points at (`/uv#uv-<id>`, `/flood#level-<id>`) is drawn as a framed card. On `/flood` the parts run in time order, each with a jump chip: ก่อนน้ำมา (`#cl-prepare`) · น้ำกำลังมา (`#during`, then `#levels`) · หลังน้ำลด (`#cl-return`).

**Cross-checked** (2 Nov 2026, against ภัยรอบบ้าน v0.11.2's tables, read as text and applied by the rule its `actionFor()` states): 12,017 PM2.5 values (0–120 µg/m³ by 0.01, and the half-way values at each edge), 4,001 heat-index values (20–60 °C by 0.01), 1,601 UV values (0–16 by 0.01) and the three flood ids give the same band and the same words, Thai and English, in both apps.

**Held by a unit test** (`tests/run.mjs`, "the advice file ภัยรอบบ้าน reads"): the numbers, the ids, a first line per level, no river, canal or city in a flood line, 8–10 and 11+ sharing WHO's message, every linked page generated. A change to any of these is on purpose, with a note to the owner, so both apps change together.

**Words that stay each owner's:** ภัยรอบบ้าน's four levels (ยังไม่น่าห่วง · ติดตามไว้ · เตรียมตัว · เสี่ยงสูง) and the agencies' band words (the heat bands เฝ้าระวัง … อันตรายมาก, the PCD's PM2.5 words). Colours aren't changed here: one palette for the family is the owner's open decision.

## 3. How the new lines fit every place

ภัยรอบบ้าน's **flood** row (its correction of 3 Nov 2026; heavy rain and TMD's notices set its **rain** row, not this one) rises, by the same rules everywhere in Thailand, on: a river or canal gauge near the place against its own bank (ติดตามไว้ to เสี่ยงสูง); an agency's own table for a gauge at the table's own level (a province's river steps to เสี่ยงสูง, a city's flag lines to เตรียมตัว, a dam's release bands naming the subdistrict at เตรียมตัว; a gauge's street zones add a line naming the streets, with no level of their own); FloodWatch's look ahead and upstream lines (to เตรียมตัว: a forecast alone never says เสี่ยงสูง); a late gauge that already said เตรียมตัว or more (keeps its level and says its age); a tidal gauge judged on its highest reading of 25 h (over its bank only at high tide, with its 25-h mean under the bank and the river not rising: เตรียมตัว, "ล้นตลิ่งช่วงน้ำขึ้น"; else เสี่ยงสูง like any gauge); and **HII's flash-flood list** (สสน., the subdistricts at risk of water off the hills in the next day: เตรียมตัว, "เสี่ยงน้ำป่า (สสน.)"). A large dam above the place is information, never a level. So each flood line:

- says "น้ำอาจมาถึง" (water may arrive), never "เมื่อแม่น้ำขึ้น"; names no river, canal or city (the build checks);
- **water off the hills gets its own line** (`flood.flash`, v1.14.3): the เตรียมตัว line isn't wrong for it (DDPM's own flash-flood alert of 20 Aug 2026 also says to lift belongings), but a flash flood comes fast, and what only it needs is to be ready to leave and to go at once when a stream turns muddy or roars (DMR, through news reports, so ⚠️); the rest is the landslide guide's "during" part (`/landslide#landslide-during`);
- **a high tide over a bank fits the เตรียมตัว line as it is:** the water comes and goes with the tide, slowly and at known times, and lifting belongings and electrical appliances is the action the sources give for water over a bank; no agency text specific to tides was read here [unverified], so nothing was added;
- borrows DDPM's actions, not its orders: DDPM's warning levels 1–5 are warnings DDPM issues, while ภัยรอบบ้าน's level is computed from data, so เสี่ยงสูง says to leave **when officials tell you to**;
- rests, since v1.14.2, on the agencies' own documents where they could be found (FloodWatch's review: a news report points to the agency's words, it isn't the source): RID's own news pages (28 and 29 Sep 2026: "ยกสิ่งของ เครื่องใช้ไฟฟ้า และทรัพย์สินมีค่าขึ้นที่สูง", "ติดตามประกาศจากทางราชการอย่างใกล้ชิด"), PEA's own page (29 May 2025, the power), DDPM's own phone alert (Cell Broadcast, 20 Aug 2026, kept as screenshots on the Internet Archive) and a municipality's plan quoting the national plan's five colours (Pak Kret, 2021). DDPM's own site answered every automated reader with a bot check (3 Nov 2026). Three "during" lines (the safe route, fast-flowing water, power lines) and the pets in a fourth have no agency original yet, so they show ⚠️; a unit test holds the rule, and the page marks news reports "(ข่าว)".

UV follows WHO: protection from 3, extra protection from 8, one message for 8 and above. ภัยรอบบ้าน's split of 8–10 (เตรียมตัว) and 11+ (เสี่ยงสูง) is its own; the lines for both are the same, plus one MOPH line said in an 11+ warning.

## 4. Hand-back to ภัยรอบบ้าน (paste into a Thai Risk session)

**Delivered and adopted on 2 Nov 2026.** The owner pasted the list below into a ภัยรอบบ้าน session, and ภัยรอบบ้าน v0.11.2 shipped it the same day. Checked on its live site (its scripts read again at 19:34 UTC, and its page opened at 13.75, 100.50 in Thai and English at 360 and 320 px, the UV card opened):

| Asked | On ภัยรอบบ้าน v0.11.2 |
|---|---|
| 1. Show `flood.levels[].all[0]`; extend `check:advice` | **Done.** Its flood table holds the three first lines word for word, with this app's source ids, and no line at ยังไม่น่าห่วง. Its code says `npm run check:advice` compares every line with the live `kit.json`; that script is in its repository and was not run from here. |
| 2. Link `/flood#during` from เตรียมตัว up | **Done:** "ระหว่างน้ำกำลังมา ทำอะไรก่อน" → `/flood#during` from level 2; below it "ก่อนน้ำมา ทำอย่างไร" → `/flood#prepare`. |
| 3. Replace its own UV line with `uv.levels[].all[0]`, link `/uv` | **Done.** Its line "ช่วงสาย–บ่ายเลี่ยงแดดจัด…" is gone; the card shows this app's line for the day's peak (rounded, never milder than the UV now) and links `/uv#uv-<id>`. Seen live: a peak of 6 → "ช่วงเที่ยงวัน หลบเข้าที่ร่ม" / "Around midday, keep to the shade" and `/uv#uv-protect`. |
| 4. One word for UV 11+ | **Done:** ภัยรอบบ้าน says "สูงจัด" (its decision D-122: "สูงที่สุด" had no source). The palette is still the owner's ([KNOWN_ISSUES #101](KNOWN_ISSUES.md#101-the-familys-colours-differ)). |
| 5. Say the UV values are clear-sky | **Already said** in its own words before the hand-back: "ช่วงเที่ยง เมฆมากจะต่ำกว่านี้" beside the peak. |

Every anchor it builds exists here, live, in both languages (`/flood#during`, `#prepare`, `/uv#uv-low` … `#uv-extreme`); its page showed no script error, and its 11 links into this app all open existing pages.

```
From บ้านรอดไหม v1.14.0 (Hazard-huntz, 2 Nov 2026). Nothing in "What the apps already share" changed:
air.levels[].all[0] + .pm (15/25/37.5/75), air.baby, hot.levels[].all[0] + .lo (27/33/42/52) are as before,
and every linked path still answers (/air /flood /hot /landslide /mask /pm25 /quake /storm, also under /en).

New in content/kit.json:
- flood.levels[]: id watch | warn | danger (= ติดตามไว้ | เตรียมตัว | เสี่ยงสูง), label {th,en},
  all[] of {th, en, sources[], verify, verifyNote?, icon}. all[0] is the line to show:
  watch  "คอยฟังประกาศเตือนจากทางราชการ และทำตามคำแนะนำ"
  warn   "น้ำอาจมาถึง ยกของและเครื่องใช้ไฟฟ้าขึ้นที่สูงไว้ก่อน"
  danger "พาเด็ก ผู้สูงอายุ ผู้ป่วยติดเตียง ไปที่ปลอดภัยก่อนน้ำมา"
         (all[1]: "ถ้าเจ้าหน้าที่ให้อพยพ ออกทันที ต้องการคนช่วย โทร 1784")
- flood.during[]: eight lines for while the water is rising (same line shape).
- uv.levels[]: id low (0–2) | protect (3–7) | veryhigh (8–10) | extreme (11+), lo/hi whole numbers,
  label {th,en}, all[]. Round the UV index to a whole number first (WHO). veryhigh and extreme share
  WHO's one message for 8+; extreme adds one MOPH line at the end. uv.notes[]: two lines for any level.
- Every source id in these lines is in content/sources.json (title, url, date, kind, note).

New paths and anchors (also under /en):
- /flood#during (while the water is rising), /flood#levels, /flood#level-watch, #level-warn, #level-danger
- /uv, with #uv-low, #uv-protect, #uv-veryhigh, #uv-extreme

Please:
1. Show flood.levels[].all[0] on the flood row at ติดตามไว้ / เตรียมตัว / เสี่ยงสูง, and extend check:advice
   to flood.levels (ids, all[0]) and uv.levels (ids, lo/hi).
2. Point the flood row's link at /flood#during from เตรียมตัว up (now /flood, "ก่อนน้ำมา ทำอย่างไร").
3. Replace the UV card's own line "ช่วงสาย–บ่ายเลี่ยงแดดจัด สวมหมวก ทาครีมกันแดด (คำแนะนำ WHO)", shown only from
   a peak of 6, with uv.levels[].all[0] by band (WHO asks protection from 3), and link /uv.
4. UV words: ภัยรอบบ้าน calls 11+ "สูงที่สุด"; the MOPH (via news reports) says "สูงจัด", which this app uses.
   The owner decides one word for the family.
5. TMD's UV values are clear-sky forecasts: say "เมื่อฟ้าโปร่ง" where the value is shown.
```

**Addendum for ภัยรอบบ้าน (v1.14.2, 3 Nov 2026):** no line's words changed and no id moved, so `check:advice` still matches; but the **sources** behind every flood level's lines now start with the agencies' own documents. If ภัยรอบบ้าน shows or checks sources, add these ids from `content/sources.json`: `rid-news-28880`, `rid-news-28896`, `rid-news-28953`, `rid-news-28597`, `ddpm-cbs-laplae-2569`, `pakkret-plan-2564` (and `pea-943`, whose note now quotes PEA's page). Paste:

```
From บ้านรอดไหม v1.14.2 (3 Nov 2026): kit.json flood.levels[].all[] words and ids unchanged. Their sources now
lead with the agencies' own documents (FloodWatch asked that news reports only point to them):
watch  all[0] + rid-news-28896, rid-news-28953, pakkret-plan-2564
warn   all[0] + rid-news-28880, pea-943
danger all[0] + rid-news-28597, ddpm-cbs-laplae-2569
Every id is in content/sources.json (title, url, date, kind, note). flood.during is reordered (when to leave
first); /flood#during is where it was. The source line on /flood marks news reports "(ข่าว)".
```

**B28: water off the hills (v1.14.3, 3 Nov 2026).** ภัยรอบบ้าน asked whether the เตรียมตัว line fits HII's flash-flood list, and named the real causes of its flood row (§3). Answer: option 2, its own line. Paste:

```
From บ้านรอดไหม v1.14.3 (3 Nov 2026), on B28:
- Choice 2: a line of its own for water off the hills.
  Field: kit.json flood.flash = { label{th,en}, th, en, sources[], verify, verifyNote, icon, guide }
    th "เตรียมพร้อมอพยพ ถ้าน้ำห้วยขุ่นข้นหรือมีเสียงดังผิดปกติ รีบไปที่ปลอดภัยทันที"
    en "Be ready to leave. If a stream turns muddy or makes a loud odd noise, get somewhere safe at once"
    sources dmr-signs-2568, dmr-watch-2567, dmr-riskvillage-2565, dwr-ews-2569 (all in content/sources.json)
    verify "partial" (DMR's and DWR's words through news reports; DMR's own posts carry them in images)
  Show it in place of flood.levels[warn].all[0] only when HII's flash-flood list set the level.
  Link: /landslide#landslide-during (the landslide guide's "during" part: heavy rain, muddy or roaring
  streams, cracking ground, flowing water), or /flood#flash (the line, then that link). Both under /en too.
- all[0] of every level and the ids watch | warn | danger are unchanged.
- Tide: the เตรียมตัว line fits a high tide over a bank as it is (slow, at known times; lifting
  belongings is the action). No new field.
- flood._readme now lists your flood row's causes (river or canal gauge, an agency's table, FloodWatch's
  look ahead, a late gauge, a tidal gauge, HII's flash-flood list; a dam above is information).
```

**For ภัยรอบบ้าน, from visitor audit 5 (v1.15.0, 3 Nov 2026):** its flood row's "ก่อนน้ำมา ทำอย่างไร" links `/flood#prepare`, which is the reasons for each step, far down the page (6,486 px at 320 px). The 10 short steps are `/flood#cl-prepare`, near the top. Both anchors stay. `/uv` now has its own preview image. Paste:

```
From บ้านรอดไหม v1.15.0 (3 Nov 2026): for "ก่อนน้ำมา ทำอย่างไร" (below เตรียมตัว), please link
/flood#cl-prepare (the 10 short steps, near the top) rather than /flood#prepare (the reasons, far down).
Both anchors stay. /uv has its own link preview now. Nothing in kit.json changed.
```

**The Thai read (v1.15.1, 4 Nov 2026).** The owner asked for the Thai read of the shared lines to be finished ([KNOWN_ISSUES #99](KNOWN_ISSUES.md#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid), [#100](KNOWN_ISSUES.md#100-the-uv-lines-rest-on-who-and-on-news-reports-quoting-thai-agencies-the-thai-is-ours)). **No level's first line changed** (`flood.levels[].all[0]`, `uv.levels[].all[0]`), nor an id, a number, a source id, `verify` or an anchor; the lines below did, with the same advice. ภัยรอบบ้าน's `check:advice` compares every line, so it reports these until its copies are updated. The flash line here replaces the one in the B28 note above. Paste:

```
From บ้านรอดไหม v1.15.1 (4 Nov 2026): the Thai read of the shared lines. No level's first line
(flood.levels[].all[0], uv.levels[].all[0]), id, number, source id, verify or anchor changed.
Changed wording, same advice (Thai | English):
- flood.levels[danger].all[1] and flood.during[0]:
  "ถ้าเจ้าหน้าที่ให้อพยพ ออกทันที ขอความช่วยเหลือ โทร 1784" | English unchanged
- flood.during[2]: "ถ้าต้องอพยพ ใช้เส้นทางที่ปลอดภัย เลี่ยงทางที่น้ำไหลผ่าน"
  | "If you have to leave, take a safe route and avoid where the water is flowing"
- flood.during[3]: "อย่าเดินลุยหรือขับรถผ่านกระแสน้ำที่ไหลเชี่ยว" | English unchanged
- flood.during[6]: "ตัดไฟจุดที่น้ำอาจท่วมถึง (ปลดเบรกเกอร์หรือสับคัตเอาต์) ทำตอนตัวแห้งเท่านั้น"
  | "Switch off the power for anywhere the water may reach (at the breaker or main switch), only while you are dry"
- flood.flash (B28): "เตรียมพร้อมอพยพ ถ้าน้ำในลำห้วยขุ่นข้น หรือได้ยินเสียงดังผิดปกติ รีบไปที่ปลอดภัยทันที"
  | "Be ready to leave. If a stream turns muddy or you hear a loud, unusual noise, get somewhere safe at once"
- flood.title: "เมื่อน้ำกำลังมา ทำอะไรก่อน" (was "ระหว่าง…"); if your link to /flood#during uses our
  heading as its label, match it. flood.levelsTitle and flood.intro reworded too (page text).
- uv.levels[protect].all[1]: "ถ้าออกแดด ใส่เสื้อแขนยาว ทาครีมกันแดด และสวมหมวก"
  | "If you go out in the sun: long sleeves, sunscreen and a hat"
- uv.levels[veryhigh].all[1] and [extreme].all[1]: "ถ้าต้องออกไป ให้หาที่ร่มเสมอ" | English unchanged
- uv.levels[extreme].all[5]: "ถ้าจำเป็นต้องออกไป อยู่กลางแดดให้น้อยที่สุด"
  | "If you must go out, spend as little time in the sun as you can"
- uv.notes[0]: "ทาครีมกันแดดแล้ว ก็ไม่ควรอยู่กลางแดดนานขึ้น" | English unchanged
Please copy these, run check:advice, and tell บ้านรอดไหม if anything else differs.
```

## 5. What ภัยรอบบ้าน or FloodWatch should check (frank)

- **ภัยรอบบ้าน wrote one advice line of its own** (the UV line above), against its own rule, and only from a peak of 6, while WHO's threshold is 3. **Fixed in its v0.11.2** (2 Nov 2026): it shows this app's line at every level.
- **ภัยรอบบ้าน's FloodWatch link carries the point** (`flood.autobahn.bot/#p=<lat>,<lon>`, rounded to 0.01°, about 1 km), built from the point for every place, a GPS fix included (its `assess.js`, read 2 Nov 2026). Its own rule U17 keeps coordinates off the screen except for a searched place, because screenshots travel in family groups; a link copied from the page travels the same way. The fragment isn't sent when FloodWatch's page loads, but that page then asks its `/api/point` with it (FloodWatch strips the query from its logs). Fine if intended; worth saying in ภัยรอบบ้าน's privacy text, or linking FloodWatch by station instead. **Unchanged in v0.11.2** (2 Nov 2026): its owner's call.
- **FloodWatch** links here (its start screen, `/learn`, and the two checklists under every point, since 14 Oct 2026), but not to `/flood` or to "while the water is rising" (`/flood#during`), and not to ภัยรอบบ้าน at all. Corrected on 2 Nov 2026: v1.14.0 said it had no link back. The hand-back is §6, and FloodWatch's answer is under it ([ROADMAP L9](ROADMAP.md#l9-link-floodwatch-and-the-game-to-each-other)).

## 6. Hand-back to FloodWatch (paste into a FloodWatch session)

FloodWatch's links here are the owner's (its D-166), so this is a list for the owner, not an edit to FloodWatch. Seen live in FloodWatch v0.98.0 on 2 Nov 2026 (its page and `static/app.js`; FloodWatch is in Thai only).

```
From บ้านรอดไหม v1.14.1 (Hazard-huntz, 2 Nov 2026). Every page FloodWatch links here still answers:
/, /learn, /checklist/prepare, /checklist/return.

New since v1.14.0: /flood#during, "ระหว่างน้ำกำลังมา ทำอะไรก่อน": eight lines for while the water is rising
(DDPM and RID, read through news reports), between "ก่อนน้ำมา" and "หลังน้ำลด" on /flood. /flood itself is
the flood page (before, during, after, the helplines, a source on every line), narrower than /learn (all 81
lessons, every hazard).

Please consider:
1. prepLinks(), in time order: เตรียมบ้านก่อนน้ำมา 10 ข้อ (/checklist/prepare) · ระหว่างน้ำกำลังมา ทำอะไรก่อน
   (https://baanrodmai.autobahn.bot/flood#during) · ก่อนกลับเข้าบ้าน 10 ข้อ (/checklist/return). Where the
   point's gauge is at or over its bank, the middle one could come first.
2. The footer's "วิธีเตรียมบ้านรับน้ำ (บ้านรอดไหม?)": https://baanrodmai.autobahn.bot/flood rather than /learn.
3. A link to ภัยรอบบ้าน (https://risk.autobahn.bot/) for rain, dust and heat at the reader's subdistrict, so
   FloodWatch's readers already know it if FloodWatch closes.
Keep ONWR's copy (data-site="onwr") without them, as now. No position needs to go with any of these links.
```

**FloodWatch's answer (2 Nov 2026, forwarded by the owner), and what this app did:**

| FloodWatch said | Here |
|---|---|
| All five pages answer, and `/flood#during` exists with the right heading | Held by the unit test (v1.14.2): the four pages and `#during` |
| It isn't changing its links now: it is preparing its handover to ONWR, ONWR's copy carries none of these links, and its own site closes after the project, so don't count on its traffic long-term | §6's list stays as a record, not a to-do; the rivers' link can go with one line ([KNOWN_ISSUES #102](KNOWN_ISSUES.md#102-floodwatch-closes-after-its-handover-the-rivers-link-goes-with-it)) |
| Cite DDPM's and RID's own documents with dates for the eight "during" lines; news reports can point to them but shouldn't be the source | v1.14.2: RID's own pages, PEA's own page, DDPM's own phone alert and a municipality's plan quoting the national plan now lead; news reports are marked "(ข่าว)". Three lines and the pets have no agency original yet and show ⚠️ (DDPM's site turned every automated reader away); [KNOWN_ISSUES #99](KNOWN_ISSUES.md#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid) |
| Keep `#during` and the old addresses stable; redirect if anything moves | Held by tests; [GUIDELINES rule 101](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| In "during", put when to leave first, and never imply the house will stay dry | v1.14.2: "ถ้าเจ้าหน้าที่ให้อพยพ ออกทันที…" first, people before belongings; no line promises a dry house (a unit test reads them) |
| The natural place for a ภัยรอบบ้าน link is FloodWatch's closing notice, if the owner posts one (about an hour with checks) | The owner's decision ([HANDOFF](../HANDOFF.md)) |

**FloodWatch's second answer (3 Nov 2026, on v1.14.2, checked against its code):**

| FloodWatch said | Here |
|---|---|
| It links exactly four of the addresses the test holds (`/`, `/learn`, `/checklist/prepare`, `/checklist/return`), not `/flood#during`; its own test pins the set; tell it first if one must move | Recorded in §2, the unit test's note and [GUIDELINES rule 101](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| ONWR's copy removes every บ้านรอดไหม link (tested); after FloodWatch's own site closes (no date yet; it follows ONWR's install), no FloodWatch page will link here. Dropping the rivers' link then is right; don't point it at ONWR's copy unless FloodWatch's owner gives a URL that ONWR has agreed to | [KNOWN_ISSUES #102](KNOWN_ISSUES.md#102-floodwatch-closes-after-its-handover-the-rivers-link-goes-with-it) corrected: it had said to use ONWR's copy if public |
| "Nothing promises a dry house" matches FloodWatch's rule: never say the bank will hold | Held by the unit test since this answer (no flood line says a bank, dyke or wall keeps water out) |
| Keep the four ⚠️ rather than work around DDPM's block; FloodWatch's way with a blocked page: the owner opens it by hand and keeps a dated copy as the source | [KNOWN_ISSUES #99](KNOWN_ISSUES.md#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid) and [GUIDELINES rule 103](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) say so |
| Maybe later, FloodWatch's owner's call: a link to `/flood#during` from a station sheet when the river is over its bank | Nothing to do here; `#during` is held by the test |


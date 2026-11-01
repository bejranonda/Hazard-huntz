# 10. The family: บ้านรอดไหม, ภัยรอบบ้าน and FloodWatch

> Since v1.14.0 (2 Nov 2026). The owner runs three apps. This page says what each one is for, what they share, and what must not change without telling the others. The rules are [GUIDELINES rules 100–101](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the work is [ROADMAP N30](ROADMAP.md#n30-fit-with-the-family-v1140); the method [APPROACH §37](APPROACH_AND_METHOD.md#37-fitting-the-family-check-the-brief-then-source-what-the-sister-app-needs-v1140).

## 1. Who does what (don't merge them)

| App | Its job | Address |
|---|---|---|
| **บ้านรอดไหม** (this repository, Hazard-huntz) | **What to do.** Sourced guides, the home check, the family plan, the calculators, the game. No live data. | https://baanrodmai.autobahn.bot (English `/en/`) |
| **ภัยรอบบ้าน · Thai Risk** | **What is happening** at the reader's subdistrict now and for 3 days, every hazard. Writes no advice of its own: its action lines are copied from this repository's `public/content/kit.json`, and its "what to do" links come here. | https://risk.autobahn.bot (English `/en`) |
| **FloodWatch** | The rivers and canals: gauge levels against their banks. The owner has said it may close; ภัยรอบบ้าน keeps working without it. | https://flood.autobahn.bot |

**In this app:**
- The start screen, every guide, the result screen, the eight hazard pages and the dust, heat and mask pages link "📍 ดูภัยที่ตำบลของคุณตอนนี้" to ภัยรอบบ้าน in the reader's language (`config.json → riskAppUrl`). Nothing about the reader goes with the link (no place, no position, no event).
- FloodWatch stays as the extra link for the rivers (`forecastAppUrl`, "🌊 ระดับน้ำในแม่น้ำ คลอง (FloodWatch)"), after ภัยรอบบ้าน, never the only route.
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
| **`uv.levels[]`** (v1.14.0) | `id` `low` · `protect` · `veryhigh` · `extreme`; `lo`, `hi` whole UV index numbers; `label`; `all[]` | 0–2 / 3–7 / 8–10 / 11+ |
| **`uv.notes[]`** (v1.14.0) | two lines for any level (sunscreen isn't more time in the sun; clouds don't stop UV) | — |

**The pages ภัยรอบบ้าน links**, each also under `/en`: `/air`, `/flood` (and since v1.14.0 `/flood#during`, `/flood#levels`, `/flood#level-watch`, `#level-warn`, `#level-danger`), `/hot`, `/landslide`, `/mask`, `/pm25`, `/quake`, `/storm`, and since v1.14.0 `/uv` (anchors `#uv-low`, `#uv-protect`, `#uv-veryhigh`, `#uv-extreme`).

**Held by a unit test** (`tests/run.mjs`, "the advice file ภัยรอบบ้าน reads"): the numbers, the ids, a first line per level, no river, canal or city in a flood line, 8–10 and 11+ sharing WHO's message, every linked page generated. A change to any of these is on purpose, with a note to the owner, so both apps change together.

**Words that stay each owner's:** ภัยรอบบ้าน's four levels (ยังไม่น่าห่วง · ติดตามไว้ · เตรียมตัว · เสี่ยงสูง) and the agencies' band words (the heat bands เฝ้าระวัง … อันตรายมาก, the PCD's PM2.5 words). Colours aren't changed here: one palette for the family is the owner's open decision.

## 3. How the new lines fit every place

ภัยรอบบ้าน's flood level can be set by measured heavy rain near the place, a river or canal at its bank, TMD's notice for the region (ติดตามไว้ only), an agency's table for its gauge (a city's flags, a gauge's flood zones), or a dam's release band naming the subdistrict. So each flood line:

- says "น้ำอาจมาถึง" (water may arrive), never "เมื่อแม่น้ำขึ้น"; names no river, canal or city (the build checks);
- borrows DDPM's actions, not its orders: DDPM's warning levels 1–5 are warnings DDPM issues, while ภัยรอบบ้าน's level is computed from data, so เสี่ยงสูง says to leave **when officials tell you to**;
- rests on DDPM or RID (Royal Irrigation Department) advice, read through news reports quoting them (the agencies' sites refused automated readers on 1–2 Nov 2026); no province's manual was found online.

UV follows WHO: protection from 3, extra protection from 8, one message for 8 and above. ภัยรอบบ้าน's split of 8–10 (เตรียมตัว) and 11+ (เสี่ยงสูง) is its own; the lines for both are the same, plus one MOPH line said in an 11+ warning.

## 4. Hand-back to ภัยรอบบ้าน (paste into a Thai Risk session)

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

## 5. What ภัยรอบบ้าน or FloodWatch should check (frank)

- **ภัยรอบบ้าน writes one advice line of its own** (the UV line above), against its own rule; and from a peak of 6, while WHO's threshold is 3.
- **ภัยรอบบ้าน's FloodWatch link carries the point** (`flood.autobahn.bot/#p=<lat>,<lon>`, rounded to 0.01°, about 1 km), built from the point for every place, a GPS fix included (its `assess.js`, read 2 Nov 2026). Its own rule U17 keeps coordinates off the screen except for a searched place, because screenshots travel in family groups; a link copied from the page travels the same way. The fragment isn't sent when FloodWatch's page loads, but that page then asks its `/api/point` with it (FloodWatch strips the query from its logs). Fine if intended; worth saying in ภัยรอบบ้าน's privacy text, or linking FloodWatch by station instead.
- **FloodWatch** has no link back to this app's flood guide; a "ทำอะไรก่อน" link to `/flood#during` beside a gauge at or over its bank would close the loop ([ROADMAP L9](ROADMAP.md#l9-link-floodwatch-and-the-game-to-each-other)).

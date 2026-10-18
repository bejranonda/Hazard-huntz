# Knowledge base

A reference for anyone maintaining บ้านรอดไหม?. It covers every rule, constant and formula in the game, the content model, the platform facts the design depends on, and the research behind it.

Facts are as of **19 Oct 2026** (v1.8.0). The research in §13–§15 was compiled on 6 Oct 2026, and each later section gives its own date. Where a fact comes from outside this repository, its source is linked. Anything marked **[unverified]** could not be confirmed from a primary source.

What building it taught us is in [LESSONS_LEARNED.md](LESSONS_LEARNED.md), and what to do next is in [ROADMAP.md](ROADMAP.md).

**Contents**

1. [Domain summary](#1-domain-summary)
2. [Glossary](#2-glossary)
3. [Round rules and constants](#3-round-rules-and-constants)
4. [House generation](#4-house-generation)
5. [Content model](#5-content-model)
6. [Build pipeline](#6-build-pipeline)
7. [Offline: the service worker](#7-offline-the-service-worker)
8. [Sharing system](#8-sharing-system)
9. [Analytics and privacy](#9-analytics-and-privacy)
10. [Cloudflare platform facts](#10-cloudflare-platform-facts)
11. [Browser and in-app facts](#11-browser-and-in-app-facts)
12. [Link-preview facts](#12-link-preview-facts)
13. [Safety domain knowledge](#13-safety-domain-knowledge)
14. [Audience and virality research](#14-audience-and-virality-research)
15. [From research to features](#15-from-research-to-features)
16. [Search and AI-search facts](#16-search-and-ai-search-facts)
17. [UI/UX evaluation and target persona findings](#17-uiux-evaluation-and-target-persona-findings)
18. [International version and social previews](#18-international-version-and-social-previews)
19. [The water-level link (BKK FloodWatch)](#19-the-water-level-link-bkk-floodwatch)
20. [Fun and sharing features (v1.3.0)](#20-fun-and-sharing-features-v130)
21. [Topics and the news-driven lessons (v1.4.0)](#21-topics-and-the-news-driven-lessons-v140)
22. [A game for the whole year (v1.5.0)](#22-a-game-for-the-whole-year-v150)
23. [The visitor funnel, measured (v1.5.2)](#23-the-visitor-funnel-measured-v152)
24. [The story: the ending answers the title (v1.5.3)](#24-the-story-the-ending-answers-the-title-v153)
25. [A start screen that keeps itself current (v1.6.0)](#25-a-start-screen-that-keeps-itself-current-v160)
26. [Carousel posts (v1.6.1)](#26-carousel-posts-v161)
27. [Power cuts and home stock (v1.7.0)](#27-power-cuts-and-home-stock-v170)
28. [The home check and the family plan card (v1.8.0)](#28-the-home-check-and-the-family-plan-card-v180)

---

## 1. Domain summary

Thailand floods every rainy season (roughly May to November).

**When this was built.** On 1 Oct 2026, ปภ. reported floods in 30 provinces plus Bangkok, affecting 1,177,404 households and 3,352,395 people ([The Bangkok Insight](https://www.thebangkokinsight.com/news/politics-general/general/1703135/)). During this flood, Bangkok closed more than 400 schools ([Thai Wikipedia: อุทกภัยในกรุงเทพมหานคร พ.ศ. 2569](https://th.wikipedia.org/wiki/อุทกภัยในกรุงเทพมหานคร_พ.ศ._2569)).

**Two moments decide most harm and loss:**

1. **Before the water arrives.** What gets lifted, packed or switched off, and who is ready to leave.
2. **Coming back after it drops.** Electricity, gas, animals hiding in the debris, contaminated food and water, damaged structures.

The game teaches the correct action for each of those moments, one tap at a time, using what Thai agencies themselves say.

## 2. Glossary

| Term | Meaning |
|---|---|
| ก่อนน้ำมา | *Before the water comes*: **Prepare** mode, `mode: "prepare"` |
| หลังน้ำลด | *After the water drops*: **Return** mode, `mode: "return"` |
| ฝุ่น PM2.5, ไฟไหม้ | *PM2.5 dust* and *House fire*: `mode: "dust"` and `mode: "fire"` (v1.5.0, §22) |
| ไฟดับ | *Power cut*: `mode: "stock"` (v1.7.0, §27), year-round |
| story hours | The power cut's clock: `round.stock.hours` (12) spread over the 55 s round, shown in the HUD as "ไฟดับมา 4 ชม." |
| `lostAfter` | An item field (power cut only): the story hour at which the item goes bad if nobody dealt with it. Only the fridge has it (4) |
| บ้านเราพร้อมแค่ไหน? | *How ready is our house?*: the home check, `/?open=kit` (v1.8.0, §28). Its things to have are "kit items" in `kit.json`, not lessons |
| แผนบ้านรอด | *Our family safety plan*: the plan card, `/?open=plan` (v1.8.0, §28.4) |
| `kit` | Two different things: the home check (`kit.json`, `kit.js`, the `kit_open` event, `brm:kit`), and the card-drawing helpers that `cards.js` exports as `kit` (v1.6.1, §26), which `kit.js` imports as `draw` |
| น้องจก | The mascot, a gecko (จิ้งจก) in yellow rubber boots. In Thai folk belief a gecko's chirp (จิ้งจกทัก) is a friendly warning. |
| target | An item with a right action. It counts toward the score. |
| decoy | Something that is already fine. Tapping it costs 2 s the first time, and the gecko explains why it is fine. |
| critical | A Prepare target worth a +50 bonus if handled before water enters the house: `p-docs`, `p-meds`, `p-breaker` |
| house key | The seed of a house: `YYYYMMDD` for the daily house, `r` + 6 characters for a random one |
| slot | A named anchor point in a room (bottom-centre of a sprite) with tags such as `floor`, `table` or `breaker` |
| scene units | Coordinates inside a room's 360×600 SVG viewBox |
| wet variant | A different correct answer once the floor is wet. Only the main breaker has one. |

**Agencies** (Thai abbreviation → English name):

| Thai | English |
|---|---|
| ปภ. | Department of Disaster Prevention and Mitigation (DDPM) |
| กฟน. | Metropolitan Electricity Authority (MEA): Bangkok, Nonthaburi, Samut Prakan |
| กฟภ. | Provincial Electricity Authority (PEA): the rest of the country |
| กรมควบคุมโรค | Department of Disease Control (DDC) |
| กรมอนามัย | Department of Health (DOH) |
| กทม. | Bangkok Metropolitan Administration (BMA) |
| สพฉ. | National Institute for Emergency Medicine (NIEMS) |
| กรมสุขภาพจิต | Department of Mental Health (DMH) |
| กรมการขนส่งทางบก | Department of Land Transport (DLT) |
| คปภ. | Office of Insurance Commission (OIC) |
| กรมโยธาธิการและผังเมือง | Department of Public Works and Town & Country Planning (DPT) |
| อย. | Thai Food and Drug Administration (FDA) |
| กปน. / กปภ. | Metropolitan / Provincial Waterworks Authority (MWA / PWA) |
| กรมประชาสัมพันธ์ | Government Public Relations Department (PRD), which republishes agency statements |
| กรมธุรกิจพลังงาน | Department of Energy Business (DOEB) |

## 3. Round rules and constants

All tunables live in `public/content/config.json → round`. The code in `public/js/round.js` holds no numbers of its own.

| Constant | Value | Meaning |
|---|---|---|
| `targetsMin`–`targetsMax` | 5–7 | Targets per house |
| `decoysMin`–`decoysMax` | 3–4 | Decoys per house |
| `pointsCorrect` | 100 | Per target answered right on the first try |
| `pointsBonus` | 50 | Extra per *critical* target answered right before the floor is wet (Prepare only) |
| `wrongPenaltySec` | 4 | Seconds added to the clock for a wrong answer |
| `decoyPenaltySec` | 2 | Seconds added on the first tap of each decoy (later taps are free) |
| `rankThresholds` | [5, 8] | score10 0–4 → rank 0, 5–7 → rank 1, 8–10 → rank 2 |
| `prepare.seconds` | 60 | Round length |
| `prepare.water` | [[0, 612], [0.25, 580], [0.45, 470], [0.7, 390], [1, 300]] | Waterline keyframes as [progress, y]. A smaller y is higher on screen. |
| `prepare.floorWetY` | 470 | Waterline at or above this means the floor is wet |
| `return.seconds` | 50 | Round length (a "daylight" bar; no water) |
| `dust`, `fire`, `stock` | 55 s each | Their threats' settings are in §22.3 (haze, smoke) and §27.4 (the power cut's `hours` and `dark`) |

### The clock

`elapsed` advances only while the round is running. It **stops while any sheet is open**: the choice sheet, the tip card or pause. Penalties add straight to `elapsed`. The round ends when every target is resolved (`reason: "done"`) or when `elapsed ≥ seconds` (`reason: "time"`). Pending targets then become `missed`.

### Water (Prepare only)

`waterY(u)` interpolates linearly between the keyframes, where `u = elapsed / duration`.

- **Flood rule:** a pending target floods the moment `waterY(u) ≤ cy`, where `cy` is the vertical centre of its sprite (`slot.y − h/2`). Low things go under first, exactly as drawn.
- **Floor wet:** happens at `u = 0.45`, which is **27 s** with no penalties. The gecko says *"น้ำเข้าบ้านแล้ว!…"*, and from then on:
  - the breaker's wet variant applies
  - the critical bonus is no longer available

When each Prepare item floods, in seconds with no penalties, for the slots it can occupy. `npm run probe` prints this table.

| Item | Floods at | Item | Floods at |
|---|---|---|---|
| `p-gutter` | 13.6 s | `p-sandbags` | 28.9 s |
| `p-torch` | 14.6–47.2 s | `p-chem` | 36 s |
| `p-meds` ★ | 15.5–60 s | `p-tv` | 45.2 s |
| `p-docs` ★ | 15.8–48.8 s | `p-poster` | 47 s |
| `p-petkit` | 15.9–26 s | `p-numbers` | 43.6 s (55.6 s before v1.7.0) |
| `p-waterfood` | 15.9 s – never | `p-plan` | 58.4 s |
| `p-car` | 18 s | `p-breaker` ★ | never (its answer changes at 27 s) |
| `p-drain` | 19.6 s | `p-toilet`, `p-fuel` | rooms not playable yet |
| `p-lpg` | 21.3 s | | |
| `p-phone` | 26.4–48 s | | |

★ = critical. The range comes from the possible slots: an item on the floor goes under earlier than the same item on a table. `p-numbers` sits on the fridge (slot `kt-fridge-note`), which moved 60 units down in v1.7.0 so the room arrow no longer covers it ([KNOWN_ISSUES F38](KNOWN_ISSUES.md#in-v170-19-oct-2026)); it now goes under 12 s earlier.

### Scoring

```
points   = 100 × (targets right on the first try) + 50 × (critical targets right before floorWet)
max      = 100 × targets + 50 × critical targets      (critical count only in Prepare)
score10  = round(10 × points / max)                   (0–10, comparable across houses)
rank     = 0 if score10 < 5, 1 if score10 < 8, else 2
```

**Example:** 6 targets, 1 of them critical, so max = 650. With everything right but the critical item after 27 s: points = 600, score10 = round(9.23) = **9**.

**Rank titles** (`strings.json → rankPrepare / rankReturn`):

| Rank | ก่อนน้ำมา | หลังน้ำลด |
|---|---|---|
| 0 | มือใหม่หัดเตรียมตัว | มือใหม่หัดกู้บ้าน |
| 1 | หัวหน้าทีมยกของ | ช่างไฟประจำซอย |
| 2 | บ้านนี้เตรียมพร้อม | เซียนกู้บ้าน |

**Statuses:** `correct` (blue ✓), `learned` (orange !), `flooded` (grey: under water in Prepare, in the smoke in fire, gone bad in the power cut), `missed` (grey ?). In the share text these become ✅ 💡 💧 ⬜, in target order: room by room, left to right. A lost item is 💨 in fire and 🌑 in the power cut.

## 4. House generation

`generateHouse(content, mode, houseKey, opts)` in `public/js/house.js` is a pure function. Tests and the build run it in Node.

**Randomness.** The seed string is `` `${mode}|${houseKey}|v${houseVersion}` ``. A cyrb53-style hash folds it to 32 bits, which seeds **mulberry32** (`public/js/rng.js`). The generator exposes `next()`, `int(min, max)`, `pick(arr)` and `shuffle(arr)`, using Fisher–Yates.

**House keys:**

- **Daily house:** `bangkokDateKey()`, the date in UTC+7, so everyone gets the same house until 00:00 Bangkok time.
- **Random house:** `r` followed by 6 characters from `abcdefghijkmnpqrstuvwxyz23456789`. Ambiguous characters such as l, o, 0 and 1 are left out.
- **Valid keys** match `/^(\d{8}|r[a-z0-9]{6})$/`. An invalid key in a challenge link falls back to today's daily house.

**Selection steps:**

1. **Pool:** items of this mode in enabled rooms, not `disabled`, not in `opts.exclude`.
2. `wanted = rng.int(5, 7)`, capped at the pool size. Each room may hold at most `ceil(wanted / rooms) + 1` targets.
3. **Prepare:** one critical item is chosen first, at random, so the bonus can always be earned. **Power cut** (a mode whose threat is `dark`, v1.7.0): one item with `lostAfter` is chosen first, so something always goes bad in time. The rule checks the threat, so no other mode's houses change.
4. Items in `opts.include` are added next. This is used by the version 2 combined run.
5. **At least one target per room**, visiting rooms in shuffled order.
6. The rest are filled from the shuffled pool, up to `wanted`.
7. An item takes a random free slot whose tags match one of its own `slots` tags. Items sharing a `group` can't appear together; the mechanism exists but no item uses it yet.
8. **Decoys:** `rng.int(3, 4)`, placed in the remaining free slots that fit them.
9. **Answers:** each target's choices are shuffled, and so are its wet choices if it has any. The original index is kept in the round record.

**Geometry.** A slot's `(x, y)` is the **bottom centre** of the sprite. For an item of size `[w, h]`:

```
x = slot.x − w/2,  y = slot.y − h,  cx = slot.x,  cy = slot.y − h/2
hit = the sprite box (or the item's own `hit` box), grown to at least MIN_HIT = 64 units each way, centred
```

**From scene units to pixels.** The SVG uses `preserveAspectRatio="xMidYMid meet"`, so `scale = min(stageWidth/360, stageHeight/600)`. On phones the height usually decides. Example: a 375×548 viewport gives a stage of 375×445, so the scale is 0.742 and 64 units = 47.5 px. Before the 13 Oct fix the smallest item at 320×460 was 38.1 px, at 320×504 42.8 px and at 360×560 48.7 px; see [KNOWN_ISSUES F21](KNOWN_ISSUES.md#fixed).

**Determinism and content.** The same seed and the **same content** always give the same house. Changing the pool, slots or sizes changes houses. See [KNOWN_ISSUES #24](KNOWN_ISSUES.md#24-some-content-edits-reshuffle-todays-house-and-old-challenge-links).

**Content in play (v1.0.0):**

| | Front | Living | Kitchen | Not playable yet |
|---|---|---|---|---|
| Prepare items | 5 | 6 | 6 | 2 (bathroom `p-toilet`, garage `p-fuel`) |
| Return items | 8 | 7 | 6 | — |
| Prepare decoys | 3 | 2 | 2 | |
| Return decoys | 3 | 3 | 2 | |
| Slots | 12 | 16 | 12 | |

## 5. Content model

Every file is in `public/content/`. The build validates all of them (section 6). Each file starts with a `_readme` key explaining it in Thai.

### `items.json` → `items[]`

| Field | Type | Notes |
|---|---|---|
| `id` | string | `p-…` (Prepare), `r-…` (Return), `a-…` (dust), `f-…` (fire) or `s-…` (power cut). Unique across items and decoys. |
| `mode` | a mode id | `prepare`, `return`, `dust`, `fire` or `stock` (the registry, §22.3) |
| `room` | room id | Must exist in `rooms.json` |
| `critical` | bool | Prepare bonus item |
| `pair` | item id | Version 2 link from a Prepare item to its Return counterpart (`p-tv → r-tv`, `p-car → r-carmud`, `p-lpg → r-gas`, `p-breaker → r-breaker`, `p-waterfood → r-foodwet`) |
| `sprite`, `doneSprite` | sprite id | `s-<id>` symbols in `art/sprites.svg`. `doneSprite` is shown after the right action (breaker → OFF). |
| `size` | [w, h] | Scene units |
| `hit` | [x, y, w, h] | Optional tap box, relative to the sprite |
| `slots` | tag[] | The slot tags the item fits |
| `name`, `context` | {th, en} | `context` is the question line in the choice sheet |
| `choices` | 2–3 × {kind, correct?, label{th,en}, feedback{th,en}} | **Exactly one** has `correct: true`. Every wrong one needs `feedback`. `kind` picks the icon: up, pack, off, leave, place, call, gear, check, toss, boil, move, clear. |
| `tip` | {th, en} | **At most 80 characters** in each language (counted by code points) |
| `why` | {th, en} | The "ทำไม?" explanation |
| `sources` | source id[] | Keys into `sources.json` |
| `verify` | `verified` / `partial` / `unverified` | The build warns on `unverified` |
| `verifyNote` | string | Why it's partial, for reviewers. Shown in [01-safety-content.md](01-safety-content.md). |
| `wet` | {context, choices, tip, why, sources} | Optional variant used once the floor is wet |
| `group` | string | Optional: at most one item per group in a house |
| `lostAfter` | number (hours) | Optional, power cut only (v1.7.0): the item goes bad once the power has been out this many story hours. Must be between 0 and `round.<mode>.hours`; the build stops otherwise, or if the mode's threat isn't `dark`. Only `s-fridge` has it (4, §27.4) |
| `disabled` | bool | Optional: leave the item out without deleting it |

### `items.json` → `decoys[]`

`{id, mode, room, sprite, size, slots, name{th,en}, note{th,en}}`. `note` is what the gecko says when someone taps it.

### Other files

- **`rooms.json`:** `{id, order, enabled, art, name{th,en}, slots: [{id, x, y, tags[]}]}`. Slots must lie inside the 360×600 scene.
- **`sources.json`:** `{<id>: {agency, title, url, date?, kind, note?}}`.
  - `kind` is one of: `official` (the agency's own site), `government` (a กรมประชาสัมพันธ์ repost), `secondary` (news quoting the agency), `academic` or `international` ([GUIDELINES §2.1](GUIDELINES.md#21-adding-or-changing-an-item)).
  - Totals: 73 sources, of which 30 official, 9 government, 23 secondary, 2 academic (a university statement and a peer-reviewed study, used only for `r-stagnant` and always flagged ⚠️) and 9 international: WHO Europe and the US Fire Administration (2), used to cross-check dust and fire and as the only source of `f-alarm`; since v1.7.0 the US CDC, Ready.gov (2), the Tokyo Metropolitan Government and a third US Fire Administration page, for the power cut (§27.2); and since v1.8.0 Ready.gov "Make A Plan" (`readygov-plan`), cited only by the plan card (§28.4).
- **`strings.json`:**
  - `th` and `en` UI strings (233 keys each, the same keys in both; the home check's own texts are in `kit.json`). Placeholders look like `{score}`, `{rank}`, `{grid}` and `{url}`. `logoA` / `logoB` are the two halves of the wordmark (Thai "บ้าน" + "รอดไหม?", English "Baan " + "Rod Mai?"); `langSwitch` is the label of the language button.
  - `og`: Thai link-preview texts, and `ogEn`: their English twins (the build fails if a key is missing from `ogEn`). Both are used by the build and by the image renderer.
  - `seo`: the text of `/learn`, the hazard pages and `llms.txt` (`th`, `en`, `en.agencies` = English names of the source agencies, and `updated`). The hazard pages use `byHazard`, `allLessons`, `playMode`, `hazard<H><Nav|Title|Desc|H1|Intro>` (§25.4) and, for a hazard with `tools`, `toolKit` and `toolPlan` (v1.8.0).
- **`checklists.json`:** `prepare`, `return`, `dust`, `fire` and `stock` (v1.7.0), each `{title, items: exactly 10 × {icon, th, en, sprite?}}`.
- **`kit.json`** (v1.8.0, loaded only when the home check or the plan card opens): `people {min, max, default}`, `flags[]` (`{id, icon, label{th,en}}`: `baby`, `elder`, `meds`, `pet`), `items[]` (`{id, for?, icon, label{th,en}, qty?, sources[], verify}`), `plan[]` (`{id, icon, label, hint?, placeholder, max, sources?, verify?}`) and `ui.th` / `ui.en` (41 interface texts each). `qty` is one of `{perPersonPerDay, days, unit}`, `{perPerson, unit}`, `{days, people: true}` or `{days}`. Details in §28.
- **`carousel.json`** (v1.6.1, not loaded by the game): `sets.<hazard>` (the lessons per post set, `outage` since v1.7.0) and the frame text in `th` and `en` (§26).
- **`helplines.json`:** `{number, main, who{th,en}, what{th,en}, source}`. Numbers have 3–5 digits. `main: true` puts the number on the cards.
- **`config.json`:**
  - `rainWarningActive` and its end date `rainWarningUntil`, `featuredTopic` and `featuredTopicUntil` (§25.1)
  - `forecastAppUrl`, `forecastStatusUrl`, `siteUrl`, `version`, `houseVersion`
  - `modes` (the registry, §22.3), `topics` (§21), `hazards` (the hazard pages' slugs, §25.4, and since v1.8.0 optional `tools`, `["kit", "plan"]` on `outage`: links on that page to the home check and the plan card, §28.2)
  - `round` (section 3; `round.stock.hours` and `round.stock.dark` for the power cut, §27.4)
  - `analytics.endpoint`, `analytics.sampleRate`
  - `features.comboRun`

## 6. Build pipeline

`node tools/build.mjs`: Node 18 or later, no dependencies.

**1. Validate.** Any error fails the build, and on Cloudflare the previous version stays live. It checks:

- the JSON parses
- every enabled room has its art file
- slots are unique and inside the scene
- every item has: th and en text, a sprite that exists, a valid size, at least one compatible slot, 2–3 choices with exactly one correct, feedback on every wrong choice, tips of 80 characters or fewer in both languages, known sources, a valid `verify` value, and a `pair` that exists
- decoys have notes
- each checklist has exactly 10 items, and their sprites exist
- helpline numbers are 3–5 digits with known sources
- source URLs are `http(s)`
- `rainWarningUntil` and `featuredTopicUntil` are real `YYYY-MM-DD` dates (v1.6.0)
- every hazard has a slug in `config.json → hazards` that is valid, unique and not a site path, and its `seo` strings exist in both languages (v1.6.0)
- a mode whose threat is `dark` has `round.<mode>.hours`; `lostAfter` is used only in such a mode and lies between 0 and its hours (v1.7.0)
- `kit.json` (v1.8.0): every item and plan hint has existing sources, `verify` is `verified` or `partial`, `for` is a real answer, a plan field's `max` is 1–80, every number above 1 in an amount rule appears in one of its sources' title or note, and every text has Thai and English; a hazard's `tools` are only `kit` or `plan`, with their `seo` strings (§28.8)

Since v1.7.0 the build **stops after these checks** when any failed, before it generates a page, and lists every error. Before, it carried on and could crash with a `TypeError` on a missing string ([KNOWN_ISSUES F40](KNOWN_ISSUES.md#in-v170-19-oct-2026)).

**Warnings only:**

- missing English strings
- `unverified` items
- too few playable items
- placeholder URLs
- a switch that is on with no end date, or whose end date has passed (v1.6.0)
- `docs/01-safety-content.md` out of date with the content (v1.6.0)
- a power-cut mode with no item that has `lostAfter` (v1.7.0)
- carousel images older than the text, or missing (v1.6.1)
- Thai text on an English page outside Thai-tagged spans

A carousel lesson that isn't ✅ verified is no longer a warning (v1.7.0): the `posts` line lists them per set ("lessons under review: outage 5 ⚠️"), because they stay until a Thai review and would otherwise bury real warnings.

**2. Site URL.** The first of these that is set: `SITE_URL` env → `config.siteUrl` (if not a placeholder) → `CF_PAGES_URL` → `https://[DOMAIN]`. On Cloudflare the `SITE_URL` variable doesn't exist (see §10), so the live value is `config.siteUrl` = `https://baanrodmai.autobahn.bot`.

**3. Link-preview pages.** It rewrites the Open Graph block between `<!--OG:START-->` and `<!--OG:END-->` in `index.html`. That block now also holds the `<link rel="canonical">` and, on `index.html`, the JSON-LD. It then writes 55 challenge pages (`c/{p,r,d,f,s}{0..10}.html`, *without* `og:url`) and 5 checklist pages, and the English set: `en/index.html` (the app shell in English), 55 `en/c/…` pages and 5 `en/checklist/…` pages. That is 121 generated pages in all (v1.7.0; 97 with four modes).

**3b. SEO and AI-search files.** It writes `learn.html`, `en/learn.html`, the hazard pages (`flood.html`, `pm25.html`, `fire.html`, `ready.html` and their `en/` twins, §25.4), `robots.txt`, `sitemap.xml` and `llms.txt` from the content JSON (§16, §18), and `posts.html` (§26). The build fails if `strings.json → seo` is incomplete or `seo.updated` isn't `YYYY-MM-DD`.

**4. Service worker.** It fills `tools/sw.template.js` with the precache list (44 files since v1.8.0, including `/en/`, `kit.js`, `kitplan.js` and `kit.json`) and a version: the first 10 hex characters of the SHA-256 of those files.

**5. Budget.** It sums the gzipped start-screen files (fonts counted as-is) and fails above 500 KB. Currently **208 KB**, or **223 KB** including the first room and the sprites (v1.8.0; 200 and 215 KB in v1.7.0, 188 and 201 KB in v1.6.1). It counts every file in `js/`, including `kit.js` (about 5.5 KB) and `kitplan.js` (0.8 KB), which the start screen loads only when the home check opens, so most of v1.8.0's 8 KB is code a first visit doesn't fetch ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)); `kit.json` isn't counted. In v1.7.0 the 12 KB were the fifth mode's content, which the start screen loads: mostly its 13 lessons and 5 decoys (`items.json`, about +7 KB compressed), then its strings, sources and checklist; its sprites added about 2 KB more to the first game screen.

**6. `--docs`.** Regenerates the summary (between `<!-- SUMMARY:START -->` and `<!-- SUMMARY:END -->`), the table, the flags and the references in `docs/01-safety-content.md` from `items.json` and `sources.json`. Without `--docs` the build only compares the file with what it would write, and warns if it is out of date (v1.6.0).

**7. The `start` line.** The build prints what the start screen recommends on today's Bangkok date, from the same `recommend()` the game uses (§25.2), for example `start     2026-10-18: prepare (warning until 2026-11-30) · featured health until 2026-11-15`.

**Images** (`npm run images` → `tools/render-images.mjs` + `tools/render.html`): drawn with the game's own canvas code in headless Chromium.

| Image | Size |
|---|---|
| Link previews | 1200×630 |
| Checklists | 1080×1920 |
| Sample result cards | 1080×1350 |
| App icons | 180, 192, 512, 512 maskable |

## 7. Offline: the service worker

| Request | Strategy |
|---|---|
| Page navigations | Network first with a 3 s timeout, then the cached page, then the cached `/` |
| `/js/`, `/css/`, `/content/`, `/art/`, the manifest (v1.5.1) | Network first with a 3 s timeout, then the cache, so a page never mixes two releases |
| Fonts and images (same origin) | Stale-while-revalidate |
| `/api/*`, other origins, non-GET | Not handled |

- **Install** precaches the 44 files and calls `skipWaiting()`.
- **Activate** deletes old `brm-*` caches and claims open clients. If an old cache has no `/js/version.js` (a service worker from before v1.5.1, which served code cache-first), it also reloads open pages once.
- **Version guard** (v1.5.1): the build writes `js/version.js` (`APP_VERSION` from `package.json`). On boot, if it differs from `config.json → version`, `main.js` deletes the `brm-*` caches and reloads, once per version per tab (`sessionStorage brm:refresh`), so it can't loop offline.
- **Registration** happens after `load`. Boot checks `document.readyState`, so it also registers when boot runs late.
- **iOS in-app browsers** never run it. See [KNOWN_ISSUES #16](KNOWN_ISSUES.md#16-no-offline-play-inside-ios-in-app-browsers).

**localStorage** (prefix `brm:`, wrapped in try/catch) holds only:

- `howto-<mode>` (one per mode)
- `best`, `streak`, `plays`, `learned` (the safety book)
- `lang`, `muted`
- `kit` (v1.8.0): the home check's answers, ticks, score and date
- `plan` (v1.8.0): the plan card's six fields and date, as typed (§28.5)

## 8. Sharing system

**Challenge URL.** `/c/{p|r|d|f|s}{score}?h={houseKey}` (`s`, the power cut, since v1.7.0), for example `/c/p8?h=20261007` (English players use `/en/c/p8?h=20261007`; `parseChallenge()` accepts both, and the house is identical). `parseChallenge()` reads the mode, score and key, and ignores any extra query such as `fbclid`. Pages serves `/c/p8` from `c/p8.html` with a 200, and redirects `/c/p8.html` and `/c/p8/` with a 308 that keeps the query.

**Share text** (`strings.json → shareTextPrepare / shareTextReturn`):

```
ตรวจบ้านผ่าน {score}/10 ⚡ / ได้ฉายา "{rank}" / {grid} / … 👉 {url} / #บ้านรอดไหม
(English) Home checked: {score}/10 ⚡ / Title: "{rank}" / {grid} / … 👉 {url} / #BaanRodMai #FloodSafety
```

**Order of attempts, inside the tap:**

1. `navigator.share({files: [card.png], text})` when `canShare({files})` allows it. iOS keeps the text with a file, so the URL goes inside the text.
2. `navigator.share({title, text, url})`.
3. The fallback sheet: LINE `https://line.me/R/share?text=…`, Facebook `https://www.facebook.com/sharer/sharer.php?u=…`, X `https://x.com/intent/tweet?text=…&url=…`, copy (Clipboard API, then `execCommand`, then `prompt`), and save (`<a download>` in normal browsers only).

**Spotting in-app browsers** (`inAppBrowser()` in `util.js`):

| User-agent pattern | App |
|---|---|
| `Line/` | `line` |
| `FBAN`, `FBAV`, `FB_IAB`, `FBIOS`, `Messenger` | `facebook` |
| `Instagram` | `instagram` |
| `musical_ly`, `BytedanceWebview`, `TikTok`, `trill` | `tiktok` |

Only the Facebook tokens are documented by Meta; the others were taken from real user agents. Inside these apps:

- outbound links navigate in place, because `window.open` is often blocked
- images use `data:` URLs
- LINE gets `?openExternalBrowser=1`, which opens the phone's browser

**Cards** are drawn on a `<canvas>` by `cards.js`. `svgdraw.js` is a small SVG-to-canvas renderer: Path2D, groups, `use`, text and transforms. Drawing SVG through an `<img>` can taint the canvas in some browsers, blocking the PNG export (older Safari is one), and fonts and `use` render unreliably that way. So the renderer avoids it. Thai lines are wrapped with `Intl.Segmenter('th', {granularity: 'word'})`, because Thai writes no spaces between words.

## 9. Analytics and privacy

- **Cloudflare Web Analytics** (turned on in the dashboard, cookieless) counts page views, referrers, devices and Core Web Vitals.
- **Game events:**
  - `track(name, {mode, label, value})` queues events allowed by the allowlist.
  - `flush()` sends them with `sendBeacon` (falling back to `fetch` with keepalive) when the page is hidden, on `pagehide`, or after 20 queued events.
  - `POST /api/e` takes at most 4,096 bytes and 25 events, cleans every field to `[\w\-.:]` and writes one Analytics Engine data point per event: `indexes: [name]`, `blobs: [name, mode, label, lang]`, `doubles: [value]`.
- **Sampling:** `config.analytics.sampleRate` decides once per page load whether this player is counted. The SQL uses `SUM(_sample_interval)`, so totals stay correct.
- **Language in the numbers:** since 13 Oct 2026 every event carries the player's language (`th` or `en`, stored as `blob4`; [KNOWN_ISSUES F22](KNOWN_ISSUES.md#after-v122-13-oct-2026)). Cloudflare Web Analytics also counts `/en/…` paths separately from `/…` paths ([05-metrics.md](05-metrics.md)).
- **How a visit arrived:** `view` is labelled `direct`, `challenge`, `checklist` or, since v1.6.0, `link` (a `?mode=` link, with the mode; §25.3). A `/?open=kit` arrival is a `direct` view plus `kit_open` with the label `link` (§28.6).
- **The home check and plan card (v1.8.0)** add three events, `kit_open`, `kit_share` (the score in % as the value) and `plan_share`. Their answers, ticks and typed text never leave the device; a smoke check reads every `/api/e` body to prove it (§28.5).
- **No IP, user agent, ID, cookie or location is stored.** Scores, the home check's answers and the plan card's text stay in `localStorage`. There is nothing to ask consent for under the PDPA. The About sheet says this in Thai and English.

## 10. Cloudflare platform facts

Checked on 6 Oct 2026 against Cloudflare's docs.

| Fact | Value | Source |
|---|---|---|
| Workers / Pages Functions free requests | 100,000 a day, shared between Workers and Pages Functions. Resets 00:00 UTC; error 1027 when exceeded. | [limits](https://developers.cloudflare.com/workers/platform/limits/), [pricing](https://developers.cloudflare.com/pages/functions/pricing/) |
| CPU per request (free) | 10 ms | same |
| Static asset requests | "free and unlimited", as long as they don't invoke Functions | [pricing](https://developers.cloudflare.com/pages/functions/pricing/) |
| Quota exhausted | Settings → Runtime → **Fail open** (static assets keep serving) / Fail closed. Which is the default is not stated in the current docs. | [routing](https://developers.cloudflare.com/pages/functions/routing/) |
| `_routes.json` | Up to 100 rules, 100 characters each; exclude beats include. Without it, every request invokes Functions once a `functions/` folder exists. | same |
| Pages free | 500 builds/month, 1 at a time, 20 min timeout, 20,000 files, 25 MiB per file | [limits](https://developers.cloudflare.com/pages/platform/limits/) |
| Build image v3 | Node 22.16.0 by default. Pin it with `.node-version` / `.nvmrc` / `NODE_VERSION`. `package.json` `engines` is ignored. | [build image](https://developers.cloudflare.com/pages/configuration/build-image/) |
| Root directory | "The entire build pipeline… will begin from this location." `functions/` must sit at the project root. | [build config](https://developers.cloudflare.com/pages/configuration/build-configuration/) |
| `wrangler.toml` | Needs `name`, `pages_build_output_dir` and `compatibility_date`. It becomes the source of truth over the dashboard. | [wrangler config](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) |
| Git vs direct upload | You can't switch a project from one to the other later | [direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) |
| Analytics Engine (free) | 100,000 data points written and 10,000 read queries a day. 1 index and up to 20 blobs and 20 doubles per point. Kept 3 months. No local binding. | [pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/), [limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/) |
| Web Analytics | One-click from the dashboard, which injects the beacon into the HTML. Blocked by ad blockers. No query strings, no custom events. Unsampled for 7 days. | [Pages how-to](https://developers.cloudflare.com/pages/how-to/web-analytics/), [FAQ](https://developers.cloudflare.com/web-analytics/faq/) |
| Unknown paths | With no top-level `404.html`, Pages serves `/` (SPA behaviour) | [serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) |

Seen on the live account, 6 Oct 2026 (observed, not from the docs):

| Observation | Consequence |
|---|---|
| The Pages API refused a token without **Cloudflare Pages → Edit** ("Authentication error", code 10000), while listing zones worked | Check the token with `wrangler pages project list` first |
| Creating a Git-connected project failed with code 8000012 ("linked to a repository that no longer exists") until the repository was visible to the Cloudflare GitHub app | Make the repository public or grant the app access before creating the project |
| With `wrangler.toml` present, the build log said "Build environment variables: (none found)" and the project's `env_vars` came back empty | A dashboard or API `SITE_URL` is cleared. Keep the address in `config.json`. |
| The first deploy uploaded all 100 files, then failed with "You need to enable Analytics Engine" | Create the dataset once in Workers → Analytics Engine. The site stays down (522) until a deploy succeeds. |
| The first successful deploy still returned 522 on the custom domain for under a minute | Retest before debugging |
| A push to `main` did not start a build | Deploys were started with `POST …/pages/projects/baanrodmai/deployments`. Check the GitHub app's access. |
| `_headers` accepts `https://:project.pages.dev/*` rules | Used to set `X-Robots-Tag: noindex` on `*.pages.dev`; confirmed on the live `baanrodmai.pages.dev` |

## 11. Browser and in-app facts

- **Desktop Chrome has Web Share.** Windows and macOS Chrome define `navigator.share`, which opens the OS dialog instead of the game's share sheet. The smoke test removes it so every platform exercises the same code (`tests/smoke.mjs → newPage`).

| Fact | Consequence in the game | Source |
|---|---|---|
| `navigator.share`: Chrome Android 61+, Safari/iOS 12.2+; files from Chrome Android 76 / Safari 14. **Not in Android WebView.** | Native share where it exists, otherwise the fallback sheet | [MDN BCD](https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json) |
| On iOS every in-app browser is WKWebView (App Store rule 2.5.6) | iOS in-app browsers behave like Safari, minus a few features | [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) |
| WKWebView turns off service workers unless the app opts in | No offline play in iOS in-app browsers | [WebKit source](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/WebProcess/WebPage/WebPage.cpp), MDN BCD |
| LINE's LIFF browser does not support service workers or the `download` attribute | Long-press save instead of a download button | [LINE docs](https://developers.line.biz/en/docs/liff/differences-between-liff-browser-and-external-browser/) |
| `?openExternalBrowser=1` opens a link in the phone's browser from LINE | "เปิดในเบราว์เซอร์" link in LINE | [LINE URL scheme](https://developers.line.biz/en/docs/messaging-api/using-line-url-scheme/) |
| `https://line.me/R/share?text=` opens LINE's "share with" picker (not on LINE for PC) | LINE share button | same |
| Facebook UA tokens: `FB_IAB/FB4A` (Android), `FBAN/FBIOS` (iOS) | `inAppBrowser()` | [Meta docs](https://developers.facebook.com/docs/sharing/best-practices/) |
| `navigator.vibrate`: none on iOS; Android needs a user gesture | Haptics on Android only | [caniuse](https://caniuse.com/vibration) |
| Web Audio starts suspended until a user gesture | Audio unlocks on the first tap | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) |
| `dvh` units: Safari 15.4+, Chrome 108+ | CSS writes `100vh` first, then `100dvh` | [caniuse](https://caniuse.com/viewport-unit-variants) |
| Clipboard `writeText` on Safari must run inside a user gesture | Copy runs inside the tap, with `execCommand` and `prompt` as fallbacks | MDN BCD |
| Kanit is under SIL OFL 1.1, with no Reserved Font Name. Subsets count as modified versions and may be self-hosted if the license file ships with them. | `public/fonts/OFL-Kanit.txt` ships with the subsets | [OFL.txt](https://github.com/google/fonts/blob/main/ofl/kanit/OFL.txt) |

## 12. Link-preview facts

| Platform | Facts | Source |
|---|---|---|
| Facebook | Image at least 1200×630 (about 1.91:1), JPEG/PNG/GIF only (no SVG), up to 8 MB, **absolute URLs**. Set `og:image:width/height` so the first share renders. Previews are cached per URL; refresh with the Sharing Debugger. All URLs with the same `og:url` share one preview, so pages that differ must omit `og:url` or point it at themselves. | [images](https://developers.facebook.com/docs/sharing/webmasters/images/), [crawler](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/), [FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq) |
| LINE | Uses only `og:title`, `og:description` and `og:image`. No official image spec and no cache time. Third-party reports say its crawler identifies as `facebookexternalhit/1.1;line-poker/1.0` **[unverified]**. To refresh, add a cache-busting query. | [LINE FAQ](https://developers.line.biz/en/faq/) |
| X | `twitter:card = summary_large_image`, falling back to `og:*`. Image details could not be confirmed after the docs moved **[unverified]**. | [web intent](https://docs.x.com/x-for-websites/post-button/guides/web-intent) |

## 13. Safety domain knowledge

The full table of 81 items with their sources is in [01-safety-content.md](01-safety-content.md); this section covers the flood items, §22.4–22.5 the dust and fire ones, and §27 the power-cut ones. These are the rules that shaped the game mechanics:

- **Electricity is the top killer in both modes.**
  - **Before the flood:** turn off the main breaker while your body and the ground are dry, wearing rubber shoes (MEA). **Never** touch switches while wet or standing in water (PEA).
    - This is why the breaker has a *wet variant*: after 27 s, the correct answer becomes "don't touch it, get to dry ground, call 1130/1129".
  - **After the flood:** don't touch the breaker on a wet floor; have an electrician check anything that was under water before switching power back on (MEA, PEA, DDC). Stay **3–5 m** from fallen power lines and call 1130 or 1129 (PEA news 1348).
- **Critical items** (the +50 bonus) are the things that hurt most to lose or get wrong:
  - documents in a waterproof bag (ปภ.)
  - at least 7 days of regular medicine (ปภ., กระทรวงสาธารณสุข, กรมอนามัย; the 7-day figure is a 2013 statement, flagged ⚠️)
  - the breaker (MEA/PEA)
- **Animals after the flood** (DDC): snakes and centipedes hide in shoes, debris and dark cupboards. Hence the "snake in the shoe" hazard and the coiled-rope decoy.
- **Disease after the flood** (DDC):
  - Fever and sore calves 2–30 days after wading can be leptospirosis: see a doctor, mention the wading, and don't self-medicate (with dengue, NSAIDs must be avoided). Hence `r-fever`.
  - Wear boots and gloves in mud, then wash with soap. Hence `r-mudfeet`.
- **Food and water** (DOH, FDA, MWA/PWA):
  - Throw away food that touched floodwater, even if it was bagged.
  - Throw out dented, bulging, leaking or rusty cans.
  - Boil tap water before drinking or use bottled water. The mains supply stays safe, but flooded house plumbing and tanks need checking and cleaning.
- **Gas and generators:**
  - A gas smell means no switches and no flames: open the windows, shut the valve, leave and call (ปภ.).
  - Never run a generator indoors or in a closed space, because its fumes are a silent poison (DDC).

**Help numbers** (verified on 6 Oct 2026; sources in `helplines.json`):

| Number | Who |
|---|---|
| 1784 | ปภ. disaster hotline, 24 h |
| 199 | Fire (added in v1.5.0, from DDPM's fire advice as reported by Krungthep Turakij) |
| 1669 | Medical emergency (สพฉ.) |
| 1555 | Bangkok (BMA), also via Traffy Fondue |
| 1130 | MEA (Bangkok, Nonthaburi, Samut Prakan) |
| 1129 | PEA (other provinces) |
| 1323 | Mental health (กรมสุขภาพจิต) |

Left out on purpose:

- **192** looks wrong; use 1784.
- **199** (fire) was left out of the flood version because only news reports cited it; the fire mode (v1.5.0) added it with DDPM's advice as quoted in the news (§22.5).

**Kept out because sources disagree:**

- sandbag fill (½ vs ⅓)
- bleach dilution (1:10 vs 3–5 tablespoons per gallon)
- boiling time (1 vs 1–3 vs 3–5 min)
- soaked mattresses (clean and dry vs throw away)

**Kept out for the content guardrails or for lack of official wording:**

- rescue steps for electric shock (they show an injured person)
- wading-depth limits (too close to drowning)
- "wait for the official all-clear"
- "photograph your documents"

## 14. Audience and virality research

Compiled on 6 Oct 2026. Figures are as published in the cited sources.

### Who is online, and where

- **Internet and social media** ([DataReportal *Digital 2026 Thailand*](https://datareportal.com/reports/digital-2026-thailand), data from Oct 2025): 67.8M internet users (94.7% of the population) and 56.6M social-media identities.
- **Platform reach** (same report):
  - LINE: **56M** monthly users
  - TikTok: **56.6M** adults
  - Facebook: **51.5M**
  - YouTube: 47.2M
  - Instagram: 20.6M
  - X: 13.3M
- **Top reason for using social media:** keeping in touch with friends and family ([Rainmaker summary](https://www.rainmaker.in.th/social-media-2026-thailand-from-datareportal/)).
- **Fake news:** 65.4% worry about telling real information from fake (same summary).
- **Devices** (StatCounter, Sep 2026):
  - mobile **78.4%** of web traffic ([platform](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/thailand))
  - Android **74%** of mobiles ([OS](https://gs.statcounter.com/os-market-share/mobile/thailand))
- **Older users go online by phone:** 96% of Baby Boomers (58+) do, and their main purpose is chatting ([ETDA 2022](https://www.etda.or.th/getattachment/78750426-4a58-4c36-85d3-d1c11c3db1f3/IUB-65-Final.pdf.aspx)).
- **LINE OpenChat:** about 17M monthly users ([Brand Inside](https://brandinside.asia/?p=152634)).

### How older family members use LINE

- **What they send.** A study of 711 LINE messages from users aged 55+ ([Thansettakij](https://www.thansettakij.com/business/319116)):
  - 34% were flowers and daily greetings (สวัสดีวันจันทร์…)
  - 25% were care and missing-you messages
  - 0.08% were politics or sports
- **When they send.** Mostly just after waking (about **04:00–06:30**), during breaks and before bed. They prefer **bright, warm colours**.
- **They forward rather than chat.** A study in Nonthaburi found older users forward news and pictures instead of chatting, and that easy forwarding and a credible look drive it ([2023 study](https://so01.tci-thaijo.org/index.php/AJPU/article/download/264606/173756/1016575)).

### What spread during this flood

Social listening by Wisesight / Zocial Eye, 16–26 Sep 2026 ([Marketeer](https://marketeeronline.co/archives/489229), [Springnews](https://www.springnews.co.th/news/hot-issue/865212)):

- 40M engagements across 167,607 posts.
- **Coping humour spread fastest:** 1,767 posts and 400k+ engagements for one catchphrase.
- **Facebook vs TikTok:** Facebook carried 70.5% of posts. TikTok had 4.5% of posts but 14M engagements.
- **Weather pages beat official warnings for speed.** One warning got 49k shares.
- **"สาดไปสมาชิก":** people tagged their group-chat members with jokes about flooding at home. This is the "tag your family" habit, happening on its own.

### What makes games and quizzes spread

- **Wordle** ([Wikipedia](https://en.wikipedia.org/wiki/Wordle)):
  - one shared puzzle a day (scarcity, comparison)
  - a spoiler-free emoji grid
  - 1.2M shares in 13 days
- **Spotify Wrapped:** the last screen invites you to share, and it works through identity and self-expression.
- **STEPPS** (Berger): social currency, practical value ("people want to help others"), emotion, triggers. The original paper was **[unverified]**.
- **Thai proof that short self-tests scale:** the Department of Mental Health check-in has run more than 10M assessments at 3–5 minutes each ([checkin.dmh.go.th](https://checkin.dmh.go.th)).
- **รู้สู้! Flood (2011):** calm, practical animation that was easier to understand than official material. Its long "9 things" document lost to its short videos ([Thaipublica](https://thaipublica.org/?p=26987)).

### What drew backlash

- **AI-generated flood images** from brands and celebrities, criticised as turning "other people's suffering into content" ([Rainmaker](https://www.rainmaker.in.th/ai-content-drama-during-bangkok-flooded/)).
- **Dismissing victims, or mocking rescuers** ([MGR Online](https://mgronline.com/onlinesection/detail/9690000097229), [MGR Online](https://mgronline.com/onlinesection/detail/9670000115245)).
- **Politics:** anger over the flood response ran high in Sep–Oct 2026, so any political reference is a risk.
- **Quiet edits:** a weather page lost trust by editing a forecast quietly, and switched to labelled "UPDATE" posts ([Amarin TV](https://amarintv.com/news/social/559194)).
- **Mascots that look creepy or costly.** A 2017 government mascot was mocked. This was seen only in search snippets **[unverified]**.

### Outreach channels

- **อสม.** (village health volunteers): about 1.04M of them, who already use an app and social groups ([WHO](https://www.who.int/thailand/news/feature-stories/detail/thailands-1-million-village-health-volunteers-unsung-heroes-are-helping-guard-communities-nationwide-from-covid-19)).
- School and education-office LINE groups.
- Provincial disaster LINE bots.
- Foundation pages.
- OpenChat.
- Weather pages.

## 15. From research to features

| Insight | Feature |
|---|---|
| LINE is everywhere, and older users forward bright greeting-style pictures in the morning and evening | Bright 1080×1350 result card and 1080×1920 checklists, styled like greeting images, with "ส่งต่อด้วยความห่วงใย ♥" |
| Wordle: one shared puzzle a day plus a spoiler-free grid | A daily house that is the same for everyone (Bangkok date), a ✅💡💧⬜ grid, and a streak |
| Identity and social currency drive sharing | Flattering rank titles that never shame (*บ้านนี้เตรียมพร้อม*, *เซียนกู้บ้าน*) |
| People tag family on their own (สาดไปสมาชิก) | Challenge links that rebuild the exact house: "ท้าเพื่อนเล่นบ้านนี้", "ส่งให้คนที่บ้าน" |
| Practical value spreads; long documents don't | Every tap teaches one action with a tip of 80 characters or fewer; every result lists all the lessons and the help numbers |
| 78% mobile, 74% Android, in-app browsers dominate | A light start screen (151 KB at launch, 188 KB in v1.6.0, 200 KB with five modes in v1.7.0, 208 KB counting the home check's lazy code in v1.8.0), no login, works in LINE/FB/TikTok with fallbacks, offline after the first visit |
| Coping humour works; suffering-as-content backfires | Humour only at the situation (mud, the rope that isn't a snake, the gecko's faces). No real photos, no AI flood images, no people in danger. |
| Political anger is high | No politicians, agencies blamed, party colours, royal or religious references |
| Quiet edits cost trust | "UPDATE:" labels for content changes, and dated sources in the About sheet |
| People worry about fake news | Every tip links to its agency source in the game ("ทำไม?" → ที่มา) |

---

## 16. Search and AI-search facts

What the build does for search, why, and how sure we are. Facts about *this site* were checked on the live address on 6 Oct 2026; statements about how search engines and AI assistants behave are marked.

**The problem.** The game renders in the browser with JavaScript. Link-preview bots (LINE, Facebook, X) don't run it, and neither do most AI crawlers **[unverified: crawler behaviour changes and wasn't tested here]**. The start page's static HTML therefore holds only a title, a description and a `<noscript>` line.

**What was added** (all generated by `tools/build.mjs` from the content JSON):

| File or tag | Where it comes from | Notes |
|---|---|---|
| `/learn` | `items.json`, `rooms.json`, `sources.json`, `checklists.json`, `helplines.json`, `strings.json → seo` | 81 articles (one per item, ordered by mode then room) after a "By hazard" row of links (v1.6.0) and an index by topic (`#t-health` and so on), each with the correct action, tip, reason, the wet-house variant, and linked sources. The 21 partly verified items carry "⚠️ under review". About 167 KB, 32 KB gzipped (v1.7.0). No script. |
| `/flood`, `/pm25`, `/fire` (v1.6.0), `/ready` (v1.7.0) | the same files, one hazard each | Only that hazard's lessons (43, 12, 13, 13), its checklists and the helplines, with ▶ play buttons to `/?mode=<id>`. No script. See §25.4. |
| `/llms.txt` | same, plus `seo.en.llmsSummary` | Markdown per [llmstxt.org](https://llmstxt.org). It's an informal proposal; **no major search engine is confirmed to use it [unverified]**. It costs nothing and is read by some AI tools. |
| `/sitemap.xml` | 12 addresses: `/`, `/learn`, `/flood`, `/pm25`, `/fire`, `/ready` and their `/en/` twins, with `seo.updated` as `lastmod` and `xhtml:link` language alternates | The `/c/*`, `/checklist/*` and `/en/c/*` share pages are left out on purpose: they are copies of the app shell. |
| `/robots.txt` | generated | `Allow: /`, `Disallow: /api/`, `Sitemap:`. Search and AI crawlers aren't blocked. |
| `<link rel="canonical">` and `hreflang` | the OG block, and the page template for `/learn` and the hazard pages | Each indexable page points at itself (`/`, `/learn`, `/pm25`, `/en/`, `/en/learn`, `/en/pm25` and so on); the 60 Thai share pages → `/` and the 60 English ones → `/en/`. Each indexable page lists its twin with `hreflang` (§18). |
| JSON-LD on `/` and `/en/` | `og` / `ogEn` strings | `WebSite` and a `VideoGame`/`WebApplication` (free, 1 minute, Thai and English). Its `about` lists the four hazards in Thai and English (floods, PM2.5 dust, house fire, power cuts) since v1.7.0; before, it listed floods only. |
| JSON-LD on `/learn` and `/en/learn` | `sources.json` | `Article` with a `citation` list of the 69 source addresses actually used. |
| JSON-LD on the hazard pages | `sources.json` | `Article` whose `citation` lists the sources of that page's lessons (54 for floods, 4 for dust, 6 for fire, 10 for the power cut). |
| `X-Robots-Tag: noindex` | `_headers` | On `*.pages.dev` addresses only. Confirmed present on `baanrodmai.pages.dev` and absent on the custom domain. |
| GitHub About | `gh repo edit` | Thai + English description, homepage, 20 topics. |

**Choices and why**

- **One subdomain, named after the game** (`baanrodmai.autobahn.bot`). A brand-matching host name helps people and assistants connect the name to the address, and it fits on the 1200×630 previews with room to spare. It matches the zone's other subdomains (`mutelu`, `simgov2569`). A shorter alias could redirect to it later.
- **Content for crawlers comes from the same JSON as the game,** so it can't contradict it. `seo.updated` is the one value to bump by hand.
- **Thai first, English alongside.** Players search in Thai script; the English text helps assistants answering in English.
- **No invented structured data.** There is no `FAQPage`, `HowTo`, rating or review markup, because there are no such questions, steps or reviews to mark up.

**Not verified yet:** whether Google or Bing index the pages, how they rank, and whether AI assistants cite `/learn`. Indexing takes days to weeks. See [ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check) and [KNOWN_ISSUES #32](KNOWN_ISSUES.md#32-search-and-ai-search-results-cant-be-guaranteed).

---

## 17. UI/UX evaluation and target persona findings

Findings from the live-site evaluation on 7 Oct 2026 across mobile viewports (390×844 and 375×667) at https://baanrodmai.autobahn.bot, refined across a 3-loop iterative optimization cycle:

### Heuristic evaluation score: 9.74 / 10 (Optimal)
- **Visual Design (9.7/10):** Hand-drawn SVG aesthetic, mascot น้องจก, and enhanced contrast rims on muddy return hazards ensure clarity across varied lighting conditions.
- **Gameplay & Educational Retention (9.7/10):** The 60-second loop with "pause-on-sheet" and immediate visibility of the 💡 `why` explanation ensures immediate retention without speed-skipping.
- **Touch Ergonomics (10.0/10):** Solved with the Slot Exclusion Graph (`slot.excludes` in `rooms.json`), dropping tap hitbox overlaps from 32% (worst 45%) to **0% (0 overlaps)** across 1,460 tested houses.
- **Thai Copy & Tone (9.8/10):** Warm, supportive Thai copy with cultural care forwarding phrasing (*"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยจากน้ำท่วม 💙"*).
- **Sharing Architecture (9.8/10):** Dedicated LINE In-App Browser guidance, long-press save instructions, and direct external browser launcher.
- **Senior Accessibility (9.6/10):** Contextual idle affordance timer (3.5s breathing cue) and timer anxiety relief with prominent `⏸️ พักเวลาอยู่` badge.
- **Performance (9.9/10):** 145 KB start load at the time of the review (147 KB with the English version), zero runtime npm packages, 0 KB Web Audio synthesis, 100% offline functionality.

### Target personas and validation outcomes
1. **Elderly LINE Forwarders (ป้าสมศรี, 64):**
   - *Outcome:* Timer anxiety eliminated via clear paused badges; unhandled items highlighted via soft idle hints; clear guidance for saving cards in LINE family groups.
2. **Young Social Media Users (น้องแบงก์, 27):**
   - *Outcome:* 0% hitbox overlap ensures fast, precise tapping; immediate educational rationale visibility; warm social sharing templates.
3. **Disaster-Affected Homeowners (พี่วิชัย, 48):**
   - *Outcome:* Immediate access to 10-point checklist and emergency helplines; enhanced visual contrast for hazards on muddy floors; full offline resilience.

Full evaluation, task backlog, and iterative loop logs are documented in [review/](../review/README.md) and [review/ITERATION_LOG.md](../review/ITERATION_LOG.md).

## 18. International version and social previews

Added in v1.2.0 (11 Oct 2026), with the wordmark fix in v1.2.2. Everything below is generated by `tools/build.mjs` from `strings.json` (`ogEn`, `seo.en`) and the content files.

**Addresses**

| Thai | English | Notes |
|---|---|---|
| `/` | `/en/` | The same game. The English page is English **before any script runs**: `lang="en"`, title, description, the start-screen text and the English wordmark "Baan Rod Mai?" in the `<h1>`, so crawlers and link previews see English. |
| `/learn` | `/en/learn` | `/en/learn` is English-first: every lesson's action, tip and reason in English, agency names in English (`seo.en.agencies`), and a note that the advice and hotlines are Thai. |
| `/c/p8?h=…` | `/en/c/p8?h=…` | English players share `/en/c/…`, so the friend's preview is English. Both rebuild the same house. |
| `/checklist/prepare` | `/en/checklist/prepare` | |
| `/pm25` (and `/flood`, `/fire`, `/ready`) | `/en/pm25` | Hazard pages (v1.6.0, `/ready` v1.7.0, §25.4). The English page is English-first and says the helplines are Thai and most advice comes from Thai agencies. |
| `/?mode=dust` | `/en/?mode=dust` | Opens the start screen on that mode (v1.6.0, §25.3). The redirect for visitors from abroad keeps the query. |

**Which language a visitor gets** (`content.js`):

1. `?lang=en|th` in the address, then
2. an `/en` path, then
3. the player's earlier choice (stored), then
4. a first-visit guess (`guessLang`): **Thai** if any browser language is Thai **or** the device clock is on `Asia/Bangkok`; otherwise **English**.

The time-zone rule matters: many Thais set their phones to English, and the game's main audience must not be switched away from Thai. Whenever the language changes, the address bar switches between the Thai and English address (`langPath`, `history.replaceState`), so a copied link opens in the same language.

**Search signals**

- `hreflang` links on `/`, `/en/`, `/learn`, `/en/learn`, the hazard pages and the checklist pages: `th`, `en`, and `x-default` → English (for people whose language is neither).
- `sitemap.xml` lists the twelve indexable pages (`/`, `/learn` and the four hazard pages, in both languages), each with its `xhtml:link` alternates, as Google documents for multilingual sites.
- Separate JSON-LD for the English pages (`inLanguage: en`, English description).
- The English share pages' canonical is `/en/`; the Thai ones' is `/`.

**Social previews**

- `og:locale` (`th_TH` or `en_US`) plus `og:locale:alternate`, and `twitter:image:alt` on every page.
- 61 English preview images in `public/og/en/` (default, 55 challenge scores, 5 checklists; v1.7.0), drawn by the same canvas code from `strings.json → ogEn`. The wordmark follows the language: Thai "บ้านรอดไหม?" or English "Baan Rod Mai?" (`strings.json → logoA/logoB`), on the start screen, the result card, the checklist image and every preview image; the canvas shrinks it to fit. The English default image reads *"Will the house survive? A 60-second home-safety game"* under it; the Thai one lists "น้ำท่วม · ฝุ่น · ไฟไหม้ · ไฟดับ" (v1.7.0).
- English share texts carry `#BaanRodMai #FloodSafety`; the Thai ones keep `#บ้านรอดไหม`.

**Honesty for an international audience.** Most advice comes from Thai agencies, some from international guidance (marked ⚠️, §27.2), and the hotlines are Thai numbers. The English help sheet, `/en/learn`, the checklist preview and `llms.txt` say so and tell people outside Thailand to follow their local authorities and emergency number. Since v1.7.0 they no longer say *every* tip is from Thai agencies ([KNOWN_ISSUES F39](KNOWN_ISSUES.md#in-v170-19-oct-2026)), and since v1.8.0 neither does the English checklist preview ([F41](KNOWN_ISSUES.md#in-v180-19-oct-2026)). **No foreign numbers were added**, because none were verified.

**The wordmark.** The two-colour title is drawn from `strings.json → logoA/logoB` in the page, on the result card, on the checklist image and on every preview image (`cards.js → logo()`; the canvas shrinks it to fit when the English words are wider than the space). The static `/en/` page carries the English text, so it never flashes Thai.

**How to add a language** (what it would take; only Thai and English exist): add a table next to `th`/`en` in `strings.json` and every `*.en` object in the content files, an `og` twin and `seo` block, agency names, a `logoA/logoB` pair, a path prefix and `hreflang` entries in `build.mjs`, preview images in `tools/render.html`, and rows in the test matrix. See [KNOWN_ISSUES #37](KNOWN_ISSUES.md#37-the-international-version-is-english-only-with-thai-advice-and-hotlines).

## 19. The water-level link (BKK FloodWatch)

- `config.json → forecastAppUrl` is `https://flood.autobahn.bot/`: **BKK FloodWatch**, canal and river water levels across Thailand, the owner's own Autobahn Bot project (confirmed 11 Oct 2026).
- The "เช็กระดับน้ำล่วงหน้า" / "Water levels" button shows on the start screen, the result screen and the help sheet, only when this is a real `https://` address (`forecastUrl()` in `content.js`, which takes the address from `modeLink()` in `modes.js`; since v1.6.0 the `/flood` page links it too). It opens in a new tab and is counted as `forecast_click`.
- `flood.autobahn.bot` is a different live site: **never redirect it to the game**. Both sites sit on `autobahn.bot` and can link to each other.
- Optional and not set: `forecastStatusUrl`, a small endpoint returning `{"rainWarning": true|false}` with CORS, so the start screen could pick the recommended mode from live data ([KNOWN_ISSUES #13](KNOWN_ISSUES.md#13-forecaststatusurl-needs-cors-and-a-fast-answer)). When it answers, its answer beats the manual switch both ways (`recommend()`, §25.2).

## 20. Fun and sharing features (v1.3.0)

Built 14 Oct 2026 (ROADMAP N8). None of it changes scoring, items or slots.

| Feature | Where | Facts |
|---|---|---|
| Challenge link on the card | `main.js → showResult` passes `cUrl`; `cards.js → drawResultCard` fits it with `fitText` (40 → 26 px) | `baanrodmai.autobahn.bot/c/p8?h=20261014` is 43 characters and fits at full size; English adds `/en` |
| Challenge back | `main.js → shareChallenge`, strings `challengeBackCta`, `challengeBackText`, `backWin`/`backTie`/`backLose`, `cardVersus` | Only after `run.kind === 'challenge'`. The text names both scores, the share attaches the card, events use the label `challenge-back` |
| Score to beat | `updateHud`, string `challengeTarget` | Shown in the gauge label ("50 วิ · 🏆 เป้า 8/10"), not as an overlay, so it never covers the room or the gecko's bubble |
| Share text | `shareTextPrepare/Return` gained `{house}` and `{streak}` | `{streak}` is " · เล่นต่อเนื่อง N วัน 🔥" from N = 2, else empty. A unit test checks every placeholder in both languages |
| Safety book | `collection.js` (`bookPool`, `correctIds`, `mergeLearned`), `progress.js` (`learnedIds`, `addLearned`), `main.js → openBook` | Stored as `brm:learned`, item ids only. Counts targets in drawn rooms that aren't disabled: 17 Prepare + 21 Return = **38**. `p-toilet` and `p-fuel` don't count until their rooms are drawn |
| End of round by score | `onRoundEnd`, `audio.js` (`fanfareBig`, `fanfare`, `chime`), `fx.js → confetti` | 10/10: big fanfare, two confetti bursts, `perfectStamp` on the card. Tier 2 (8–9): fanfare and confetti. Tiers 0–1: chime. Result gecko line from `cheerPerfect`/`cheerHigh`/`cheerMid`/`cheerLow` |
| Combo | `state.combo` in `main.js`, sound `combo`, string `comboText` | From 3 right answers in a row; a wrong answer resets it. Feel only: no points |
| Sounds | `audio.js`: `splash` (floor wet), `tick` (each of the last 5 s), `tap` on un-mute | All synthesised, still 0 KB of audio files |
| Streak milestones | `progress.js → recordResult` returns `milestone` | Days 3, 7, 14, 21, … of the daily house, shown as a toast (`streakMilestone`) |
| Replay first | result screen order | Share buttons → "play the other mode" / "random house" → lessons |
| Bilingual share title | `brandName()` in `main.js` | `t('logoA') + t('logoB')`, trimmed |

**Why the combo doesn't score.** The score means "safe actions out of 10" and is compared across challenge links. Adding speed or combo points would make a 10/10 from v1.2 worth less than one from v1.3, and would reward rushing over reading the tip.

**Why the safety book stores ids only.** The same rule as the streak: nothing personal and nothing that leaves the phone ([KNOWN_ISSUES #41](KNOWN_ISSUES.md#41-the-safety-book-and-streak-live-on-one-device)).

**Language redirect (v1.3.1).** An inline script in `index.html` (not in a module, so it runs before anything is drawn) sends visitors on `/`, `/c/{p|r}N` and `/checklist/{prepare|return}` to the same path under `/en/` when: no `/en` in the path, no `?lang=`, nothing stored under `brm:lang`, the user agent doesn't match `isBot` (`content.js`; keep the two patterns identical), the browser has no Thai language, and the time zone isn't Asia/Bangkok. It uses `location.replace`, so the Back button doesn't bounce. `main.js` applies the same bot rule, so a bot that runs JavaScript also stays on Thai. The copy of the script inside `/en/index.html` exits at once.

## 21. Topics and the news-driven lessons (v1.4.0)

Built 15 Oct 2026 (ROADMAP N9).

**Topics.** Every item has `topic`, one of `config.topics`. The build fails on an unknown topic or a missing `topic_<id>` string in either language.

| Topic | Emoji | Lessons (playable) | Examples |
|---|---|---|---|
| `health` | 🦠 | 8 (8) | `r-mudfeet`, `r-fever`, `r-bucket`, `r-mould`, `r-stagnant`, `r-ors`, `r-towel`, `p-meds` |
| `power` | ⚡ | 9 (9) | breakers, sockets, appliances, generator, gas |
| `food` | 💧 | 4 (4) | water and food stocks, flooded food, cans, tap water |
| `critters` | 🐍 | 4 (4) | shoes, glass and nails, debris, the cupboard |
| `home` | 🏠 | 12 (10) | sandbags, drains, documents, chemicals, car, cracks, ceiling, bleach; `p-toilet` and `p-fuel` wait for their rooms |
| `plan` | 🎒 | 6 (6) | phone, torch, the plan for grandma, pets, shelter, numbers |

- **Safety book:** grouped by topic in `config.topics` order (the featured or asked-for topic first), each with `n/total`, a progress bar and a 🏅 badge when full. `collection.js → topicProgress()` and `completedTopics()` are pure and unit-tested; a full set after a round shows `topicDoneToast`. Playable lessons: 41 (17 Prepare, 24 Return).
- **Locked lessons are never hidden for good:** the book links to `/learn` (`bookReadAll`). For health topics in particular, nobody should have to play to read the answer.
- **Featured topic:** `config.featuredTopic` (`"health"` now, or `null`), until `featuredTopicUntil` since v1.6.0 (§25.1). The start-screen card links to `/learn#t-<topic>` (event `learn_open`) and opens the book on the topic; the book's "play" button picks the mode with the most lessons left to find in that topic.
- **`/learn`:** an index by topic (`<div class="tix" id="t-<topic>">`, chips of at least 44 px) before the mode sections; each article names its topic.

**EM balls (`r-stagnant`).**

| Source | What it says |
|---|---|
| Statement by 48 environmental scientists, led by Chula's Dept. of Environmental Engineering, 9 Nov 2011 (read in full) | Floodwater is organic-polluted and low in dissolved oxygen. EM is not recommended for treating it: not scientifically proven for wastewater; its microbes can't reduce the dirt; part of EM is organic matter that adds to it; its microbes don't produce oxygen. Instead, in order: drain the water as soon as possible, collect rubbish and waste, add oxygen (circulate the water, aerators). |
| Krobthong & Watpathomsub, J Med Glob 4(3):52–61, 2026 (abstract read) | Three stagnant-floodwater sites in Bangkok, field and lab, one month. Field: fewer coliforms at two sites, clearer water. Lab: BOD up to 290 mg/L, DO below 1 mg/L. EM balls alone could not consistently improve the water. |
| Khaosod English, 8 Oct 2026 | Khlong Sam SAO (Pathum Thani) used EM balls together with aerators in a canal. The article makes no claim about effectiveness. Not cited in the game. |
| NSTDA, 2011, "Suggested treatments for foul water and when EM is effective" | **[unverified]** returned HTTP 503 on 15 Oct 2026. A search index quotes it as not recommending EM during the flood itself and recommending aeration. |

**Disease groups after floods (DDC, 27 Sep 2026, via Bangkokbiznews).** Leptospirosis, skin infections, stomach and bowel illness, mosquito-borne disease, eye infections, respiratory infections. The game covers the first five (`r-mudfeet`, `r-fever`; `r-mudfeet` partly for skin; `r-ors`, `r-foodwet`, `r-tap`; `r-bucket`; `r-towel`). Respiratory infections and melioidosis are not covered ([ROADMAP P6](ROADMAP.md#p6-more-lessons-for-the-remaining-disease-groups)).

## 22. A game for the whole year (v1.5.0)

The owner asked to keep people engaged outside the flood season and to "consider the future, also international guidance". This section records what we found, what we built and what is left.

### 22.1 Research: what other programmes do

| Source | What it says | What we took |
|---|---|---|
| IFRC and Save the Children, *Public Awareness and Public Education for Disaster Risk Reduction: Key Messages* (2nd ed., 2018) | An all-hazards template: household preparedness plus about a dozen hazards (flood, storm, fire, heat, earthquake, tsunami, air pollution and more), each as short action messages meant to be adapted locally. People act when they know the specific step, believe it works and feel able to do it. | The checklist of hazards to cover in time (ROADMAP P7–P8), and the rule that each lesson is one concrete action. Thai agencies still decide the wording. |
| The Great ShakeOut (yearly earthquake drill on a fixed date); Ready.gov (a theme per month); Japan's *Bōsai* ("disaster prevention") campaigns that make drills playful | Fixed, expected dates keep people coming back between disasters. | The season default and the idea of yearly hazard weeks (ROADMAP P9). |
| A 2026 systematic review of serious games for disaster education (preprint, about 130 studies) | Evidence is mostly about usability and knowledge right after play; evidence on real behaviour change is thin. | We measure plays, shares and checklist saves (05-metrics) and claim knowledge, not behaviour. |

The review and the IFRC document were read through their summaries; the numbers above are approximate **[not re-verified in full]**.

### 22.2 The Thai year

| Months | Hazard | Mode | `months` |
|---|---|---|---|
| December–March | PM2.5 dust and smoke (Bangkok Dec–Feb, the North Feb–Apr) | `dust` | 12, 1, 2, 3 |
| April (dry season, all year in practice) | House fire | `fire` | 4 |
| May–November | Flood | `prepare` (rain warning on) / `return` | 5–11 / — |
| March–May | Heat, summer storms | not built (P7) | — |
| Any time, 26 Dec anniversary | Earthquake, tsunami | not built (P8) | — |
| Any time (v1.7.0) | Power cuts, home stock | `stock` | none: never the default (§27) |

The month table is ours, not an agency's ([KNOWN_ISSUES #47](KNOWN_ISSUES.md#47-the-season-calendar-is-editorial)). `seasonalMode(month, rainWarning)` in `modes.js`: a rain warning → `prepare`; else the first non-flood mode whose `months` include the month; else `return`. Since v1.6.0 the start screen calls it through `recommend()`, which adds the switches' end dates and `?mode=` links (§25.2).

### 22.3 The mode registry

Each mode is one entry in `config.json → modes` (defaults in `public/js/modes.js`): `id`, `hazard`, `code` (challenge letter: `p`, `r`, `d`, `f`, `s`; `h` kept for heat), `threat`, `prop`, `emoji`, `icon`, `months`, `topic`, `link`, `bonus`. Per-mode strings are `<base><Mode>` (for example `rankDust`); `tm(base, mode)` uses the mode's key if it exists, else the shared one, so a mode only overrides what differs. House seeds are `${mode}|${houseKey}|v${houseVersion}`, so a new mode never changes another mode's houses. How to add one: [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode).

| Threat | Drawn as | Loses an item when | Config |
|---|---|---|---|
| `water` (prepare) | A waterline rising from the floor | the line reaches the item's centre | `water` keyframes, `floorWetY` |
| `smoke` (fire) | A grey band with a wavy edge falling from the ceiling | the edge reaches the item's centre (high items first) | `smoke` keyframes (y of the edge: −30 → 60 → 230 → 330 over 55 s), `lowY` 230 (the gecko says "crawl low") |
| `haze` (dust) | A full-room tint with drifting specks, opacity 0.06 → 0.64 | never; the clock is the pressure | `haze` keyframes |
| `dark` (stock, v1.7.0) | A deep-blue dim over the room, heavier at the edges, opacity 0.1 → 0.66; the HUD counts story hours | an item with `lostAfter` goes bad at that story hour (the fridge at 4 of 12) | `dark` keyframes, `hours` (§27.4) |
| `null` (return) | nothing | never | — |

In dust mode the gauge carries `data-aqi` 0–4 and moves through the Air4Thai colours (blue `#3BB3E6`, green `#5CC05C`, yellow `#F2D22E`, orange `#F59B3A`, red `#E5533D`) as the haze thickens. It teaches the order, not the µg/m³ ranges, because the ranges changed in 2023 ([GUIDELINES rule 45](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### 22.4 PM2.5 dust: sources and what each lesson rests on

| Source (`id`) | Read | Key points used |
|---|---|---|
| `doh-dustroom-2569` THE STANDARD, 1 Apr 2026, DOH deputy DG | 15 Oct 2026 | Dust-free room: shut doors and windows, seal gaps and vents, purifier or fresh-air system, damp cloth instead of sweeping, **filters every 6 months**, shoes off. Above 37.5 µg/m³ cut outdoor activity; above 75 stay mainly in a clean room. N95 outside. Air4Thai, AirBKK, Life Dee. |
| `doh-10ways-2564` Thai PBS, 10 Dec 2021, DOH DG | 15 Oct 2026 | Ten ways: Air4Thai before going out; masks; clean dust traps (air-con, fan, screens, bedding) with a wet cloth; seal gaps; no outdoor exercise over the standard; medicines ready; cough, wheeze or tight chest → doctor; cut charcoal grilling, no open burning, fewer black-smoke diesels, plant trees. |
| `doh-mask-2565` PPTV, 14 Dec 2022, DOH deputy DG | 15 Oct 2026 | N95 snug over the nose and under the chin; cloth masks at least 2 layers; replace when loose, torn, dirty or wet; at-risk groups: children, pregnant women, older people, the chronically ill; on red days they stay in, with **at least 5 days** of medicine. |
| `who-smoke-2566` WHO Europe Q&A, 16 Jun 2023 (`international`) | 15 Oct 2026 | Stay in with doors and windows shut; reduce frying, grilling and smoking indoors; well-fitting N95/FFP2 outside; the same at-risk groups; get medical help for symptoms. |

Deliberately left out: incense and candles (the DOH lists them, but religious references are off limits for the game), air-purifier brands and numbers, and the colour ranges.

### 22.5 House fire: sources and what each lesson rests on

| Source (`id`) | Read | Key points used |
|---|---|---|
| `ddpm-fire10-2569` Krungthep Turakij, DDPM's 10 ways (2026, page undated) | 15 Oct 2026 | Sound the alarm; **199** for a serious fire; extinguisher on a small fire; cloth over nose and mouth; feel the door, open slowly only if not hot; crawl low (clean air near the floor); no lifts. |
| `ddpm-fire10-2563` Krungthep Turakij, the same 10 ways (Feb 2020) | 15 Oct 2026 | Same steps with a **wet** cloth; check the stove and LPG cylinder, close the valve after every use. |
| `ddpm-dryfire-2568` MGR Online, 17 Dec 2025 | 15 Oct 2026 | Dry, windy weather: check wiring; repair cracked or burning-smelling cords; unplug after use; don't load one strip; **don't charge phones on a bed or sofa**; close the gas; no burning rubbish or weeds in wind; never leave fire unattended; put cigarettes out; flammables away from heat; an extinguisher within reach. |
| `mea-strip-2569` Thansettakij, 17 Sep 2026 | 15 Oct 2026 | Power strips with **มอก. 2432-2555**; never chain strips; don't run microwave, electric pan and iron together; not in wet places; damaged, hot or burning-smelling: stop and cut the power; unplug when not in use. |
| `usfa-cooking-2569` US Fire Administration (`international`) | 15 Oct 2026 | Cooking is the leading cause of home fires; stand by your pan; turn the burner off if you leave. |
| `usfa-alarm-2569` US Fire Administration (`international`) | 15 Oct 2026 | Test smoke alarms monthly; change batteries yearly; under 2 minutes to get out once it sounds. The only source for `f-alarm` ⚠️. |

NFPA's pages render only with JavaScript and could not be read, so the US Fire Administration was used for the international cross-check. Not used: "never use water on an oil fire" (no source we could read said it in those words), escape-plan drills (no Thai source yet), kitchen-hood grease (not confirmed).

### 22.6 What changed for players

- The start screen recommends the season's mode as the big card; the others are a row of small cards.
- The "check before you go" link follows the mode: the flood forecast app, or Air4Thai for dust. Fire has none; 199 is in the helplines.
- The safety book and `/learn` gain two topics (😷 `air`, 🔥 `fire`), 66 playable lessons in all.
- Each mode has its own link previews (`/c/d0…d10`, `/c/f0…f10`, English under `/en/`) and checklist (`/checklist/dust`, `/checklist/fire`).

## 23. The visitor funnel, measured (v1.5.2)

The owner asked three questions as a Thai visitor would live them: does the home page get people playing, does the game get them to the end, and does the end get them to share? We measured where the next button sits on six screens (top–bottom in CSS px, against the screen height), with `?debug=1` and Web Share removed so the fallback sheet shows.

| Step | Screen | Before (v1.5.1) | After (v1.5.2) |
|---|---|---|---|
| Home: the recommended mode | 320 × 460 | 332–418 / 460, the only mode on screen | 332–440 / 460 (▶ mark added) |
| Home: the recommended mode | 360 × 640, 390 × 664 | 308–394, 313–399; all four modes on screen | same |
| Challenge link: "รับคำท้า!" | 320 × 460 | 509–565 / 460 ✗ | 303–359 ✓ (gecko and tagline step aside) |
| Challenge link: "รับคำท้า!" | 360 × 640 | 486–542 ✓ | 343–399 ✓ |
| How-to: "เริ่มเลย!" | 320 × 460 | 538–594 ✗ | 388–444 ✓ (sticky) |
| After an answer: "next" | 320 × 460 | 445–501 ✗ | 388–444 ✓ (sticky) |
| Result: share | 320 × 460 | 690–746 ✗ | 394–450 ✓ |
| Result: share | 360 × 640 | 700–756 ✗ | 574–630 ✓ |
| Result: share | 390 × 664 (LINE, iPhone) | 738–794 ✗ | 598–654 ✓ |
| Result: share | 412 × 800 | 765–821 ✗ | 734–790 ✓ |
| Result: share | 1024 × 768 | 811–867 ✗ | 702–758 ✓ |
| Share sheet: channels on screen | 320 × 460, 390 × 664, 1024 × 768 | none ✗ | LINE, Facebook, X, copy (save) ✓ |

**Playing to the end.** A round always ends: when every target is resolved or at 50–60 s. The clock pauses while a choice or tip is open, so reading never costs time; the room tabs show how many targets are left in each room (hidden below 520 px tall, where the arrows remain). No change was needed here.

**What the measurements can't tell.** Whether people actually tap share. That needs the live numbers (`share_open` ÷ `round_end`, [05-metrics](05-metrics.md)) after launch ([ROADMAP N5](ROADMAP.md#n5-first-metrics-review)).

## 24. The story: the ending answers the title (v1.5.3)

The owner allowed adapting the story. The story was already there: a gecko (น้องจก) helps a Thai family's house through the hazards of the year, and the family appears in the lessons (grandpa's inhaler, grandma's cough, the grandchildren's ball, dad's morning run). What was missing was an ending. The title asks "บ้านรอดไหม?", and the round ended with a cheer that could belong to any game.

Now the gecko on the result screen answers the question for the mode just played:

| Mode | 10/10 | 8–9 | 5–7 | 0–4 |
|---|---|---|---|---|
| ก่อนน้ำมา | บ้านรอดแน่นอน! ของสำคัญปลอดภัยครบทุกชิ้น 🎉 | บ้านรอด! ของสำคัญเกือบครบ อีกนิดเดียวเต็มสิบ | บ้านรอดครึ่งๆ ของบางชิ้นยังเสี่ยงโดนน้ำ ลองอีกรอบนะ | น้ำมาเร็วกว่าเรา แต่ตอนนี้รู้แล้วว่าต้องทำอะไร ลองใหม่นะ |
| หลังน้ำลด | บ้านรอด! ปลอดภัย พร้อมกลับเข้าอยู่แล้ว 🏠 | เกือบพร้อมกลับเข้าบ้านแล้ว เหลืออีกนิดเดียว | ยังมีอันตรายซ่อนอยู่ ค่อยๆ ตรวจอีกรอบนะ | บ้านยังไม่พร้อม ตรวจให้ครบอีกรอบ ก่อนกลับเข้าบ้านนะ |
| ฝุ่น PM2.5 | บ้านรอดจากฝุ่น! อากาศในบ้านสะอาด ทุกคนหายใจสบาย 💙 | บ้านเกือบปลอดฝุ่นแล้ว คุณตาคุณยายหายใจสบายขึ้นเยอะ | ฝุ่นยังเล็ดลอดเข้าบ้านบ้าง ลองปิดจุดที่พลาดดูนะ | ฝุ่นยังเข้าบ้านอยู่ แต่ตอนนี้เรารู้วิธีแล้ว ลองอีกรอบ! |
| ไฟไหม้ | บ้านรอดจากไฟ! จุดเสี่ยงเรียบร้อยทุกจุด นอนหลับสบายได้ 💙 | บ้านเกือบปลอดภัยจากไฟ เหลืออีกจุดสองจุด | ยังมีจุดเสี่ยงไฟอยู่ ลองหาให้ครบอีกรอบนะ | จุดเสี่ยงยังเยอะ แต่ตอนนี้เรารู้แล้ว ลองอีกรอบ! |

Two endings changed in v1.6.0 (หลังน้ำลด 0–4, ไฟไหม้ 5–7): they said "ด้านล่าง" (below), which is wrong on the shared card that now carries the ending (§25.5).

**Rules we kept.** The endings are narrative, not safety advice, so they need no source; they never say the house or anyone was lost (guardrail), and a low score always ends on "now you know, try again". The score tiers are the same as the ranks (0–4, 5–7, 8–9, 10). Keys are `cheer<Level><Mode>`; `pickLineFor()` in `content.js` falls back to the shared `cheer<Level>` lines, so a new mode works before its endings are written (the unit test then fails until they are).

**Story ideas not built** (for the owner to choose): a named family on the start screen ("บ้านคุณยายมาลี") and a one-line intro per mode on the how-to sheet ("คุณตามีโรคประจำตัว วันนี้ฝุ่นสีแดง…"). Each adds text to read before or after a 60-second game, so test them on real players first. The third idea, the ending line on the shared card, was built in v1.6.0 (§25.5).

## 25. A start screen that keeps itself current (v1.6.0)

Built 18 Oct 2026 (ROADMAP N12). Nothing here touches items, rooms, slots or `houseVersion`, so houses and challenge links are unchanged.

### 25.1 Switches with end dates

| Switch | End date | Now | What it does |
|---|---|---|---|
| `rainWarningActive` | `rainWarningUntil` | `true` until `2026-11-30` | Recommends ก่อนน้ำมา (Prepare) first |
| `featuredTopic` | `featuredTopicUntil` | `"health"` until `2026-11-15` | Puts that topic's card on the start screen |

- `switchOn(value, until, dayKey)` in `modes.js` (pure): off when `value` is empty; on when there is no `until`; otherwise on while `dayKey` (`YYYYMMDD`, the Bangkok date from `bangkokDateKey()`) is on or before `until`. So `2026-11-30` is on for all of 30 Nov in Bangkok and off from 00:00 on 1 Dec.
- The build stops if an `*Until` value isn't a real `YYYY-MM-DD` date. It warns when a switch is on with no end date, or when its end date has passed (the switch is then already off), and prints a `start` line for today (§6).
- The Thai `_readme` in `config.json` explains the dates for people who edit it on GitHub.

### 25.2 What the start screen recommends

`recommend(config, dayKey, { want, live })` in `modes.js` returns `{ mode, topic, why }`. At boot, `pickStart()` in `main.js` calls it with `want` from `?mode=` (none on a friend's challenge) and `live` from `forecastStatusUrl` (fetched only when there is no link, 1.5 s timeout). The result is kept in `state.start`, and `renderStart()` reads it.

| Order | Rule | Mode | `why` |
|---|---|---|---|
| 1 | `want` is a mode id in the registry, in any letter case | that mode | `link` |
| 2 | The rain warning is on: the forecast app's answer when it gave one (`true` or `false`), otherwise `switchOn(rainWarningActive, rainWarningUntil, dayKey)` | `prepare` | `live` or `warning` |
| 3 | The first non-flood mode whose `months` include the Bangkok month (`seasonalMode()`, §22.2) | `dust` (Dec–Mar), `fire` (Apr) | `season` |
| 4 | Otherwise | `return` | `season` |

The power cut (`stock`, v1.7.0) has no `months`, so rule 3 never picks it: it is recommended only through rule 1, a `?mode=stock` link (its topic, 💧 `food`, is then featured).

**The topic.** After a link: the linked mode's own `topic`, else the news topic. Otherwise: the news topic (`featuredTopic`, while `switchOn` says so), else the recommended mode's own topic. The flood modes have no topic of their own, so in the flood months only a news topic is featured.

**Examples** from the unit test, on a fixed config (rain warning until 30 Nov 2026, `health` until 15 Nov 2026):

| Day | Input | Mode | Topic | `why` |
|---|---|---|---|---|
| 18 Oct 2026 | | `prepare` | `health` | `warning` |
| 16 Nov 2026 | | `prepare` | none | `warning` |
| 1 Dec 2026 | | `dust` | `air` | `season` |
| 10 Apr 2027 | | `fire` | `fire` | `season` |
| 15 Jun 2027 | | `return` | none | `season` |
| 1 Dec 2026 | `live: true` | `prepare` | none | `live` |
| 18 Oct 2026 | `live: false` | `return` | `health` | `season` |
| 18 Oct 2026 | `want: 'Dust'` | `dust` | `air` | `link` |
| 18 Oct 2026 | `want: 'return'` | `return` | `health` | `link` |
| 18 Oct 2026 | `want: 'heat'` | ignored: the same as no link | | |

**The "check before you go" link.** `modeLink(config, id)`: the mode's own `link` (dust → Air4Thai), else `forecastAppUrl` for flood modes (BKK FloodWatch), else none (fire). `forecastUrl()` in `content.js` and the hazard pages both use it.

### 25.3 `?mode=` links

- `/?mode=prepare`, `return`, `dust`, `fire` or, since v1.7.0, `stock` (any letter case) opens the start screen with that mode as the big recommended card and its topic featured. It never starts a round; the visitor still taps the card.
- Ignored: an id that isn't in the registry (`/?mode=heat`), and any `?mode=` on a friend's challenge link, where the challenge comes first.
- Visitors from abroad: the inline language redirect keeps the query, so `/?mode=dust` becomes `/en/?mode=dust`.
- **Analytics,** with no new event names: `view` gets `label: link` and the mode; `mode_select` is `link` when the tapped card is the linked mode, `default` when it is the recommended mode without a link, and `other` for any other card ([05-metrics](05-metrics.md#event-dictionary)).
- The link previews as the main game, because it is the app shell ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)). When the preview matters, share the hazard page.

### 25.4 Hazard pages

| Hazard | Slug | Thai | English | Modes | Lessons | Check link | Preview image |
|---|---|---|---|---|---|---|---|
| flood | `flood` | `/flood` | `/en/flood` | prepare, return | 43 | BKK FloodWatch | `og/checklist-prepare.png` |
| dust | `pm25` | `/pm25` | `/en/pm25` | dust | 12 | Air4Thai | `og/checklist-dust.png` |
| fire | `fire` | `/fire` | `/en/fire` | fire | 13 | none | `og/checklist-fire.png` |
| outage (v1.7.0) | `ready` | `/ready` | `/en/ready` | stock | 13 | none | `og/checklist-stock.png` |

- **Generated** by `tools/build.mjs` into `public/<slug>.html` and `public/en/<slug>.html`; never edit them by hand. Cloudflare Pages serves `/pm25` from `pm25.html` and redirects `/pm25.html` to `/pm25` with a 308, as it does for the challenge pages (§8).
- **Order on the page:** the top links (the game, all lessons, the other language), the H1, the ▶ play button to `/?mode=<id>` (`seo.playMode`, with the mode's name and round length; one per mode, so two on `/flood`), the intro (the English pages add that the advice and helplines are Thai), the "check before you go" link, the date updated, the lessons by mode, the hazard's checklists, the helplines, the play buttons again, the "อ่านตามภัย / By hazard" row (this page marked with `aria-current`), and the disclaimer.
- **Search signals:** a canonical link to itself, `hreflang` th / en / x-default, `og:url`, the preview image of the hazard's first mode's checklist (`/og/` or `/og/en/`; no new images), and `Article` JSON-LD whose `citation` lists the sources of its lessons. Both languages are in the sitemap and `llms.txt`, and `/learn` and `/en/learn` link them from the same "By hazard" row.
- **Slugs** live in `config.json → hazards`. The build stops unless each one is lowercase letters, digits or "-", is unique, isn't a reserved site path (`c`, `checklist`, `en`, `learn`, `api`, `js`, `css`, `content`, `art`, `fonts`, `icons`, `og`, `share`, `index`, `sw`, `robots`, `sitemap`, `llms`, `manifest`, `posts`) and doesn't match an existing `public/<slug>`; every hazard in the registry needs one. A slug must never change once published, because shared links and search results point at it.
- **Strings** in `seo.th` and `seo.en`: `byHazard`, `allLessons`, `playMode`, and `hazard<Flood|Dust|Fire|Outage><Nav|Title|Desc|H1|Intro>`. The build stops when one is missing. The text is a draft for the language check ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)). It adds no advice or numbers, and the descriptions name no agencies, so it can't drift from the lessons. The `/ready` intro says that several lessons come from international guidance and are marked.
- **One template.** `/learn`, `/en/learn` and the eight hazard pages come from one `seoPage()` function. The old `/learn` template was replaced first, and its output checked byte-identical (`git diff --quiet`) before the hazard pages were added.
- **Tap targets:** the helpline `tel:` links (28–38 px wide on `/learn` before v1.6.0) and the source links have `min-width: 44px`; the top links, the check link and the chips are 44 px tall. A smoke check measures every control on all these pages at 320 × 460 (ten since v1.7.0), and checks that each hazard page's play button is on the first screen.

### 25.5 The ending on the shared card

- `showResult()` in `main.js` picks the ending once (`pickLineFor(cheerKey, mode)`), shows it in the result gecko's bubble and passes it to `drawResultCard()`, so the screen and the card say the same line.
- `endingBubble()` in `cards.js` draws a white speech bubble with a 5 px ink outline and a tail pointing right at the gecko: x 30–360 on the 1080 × 1350 card, centred at y 462, at most 300 px tall.
- The text starts at 38 px and shrinks in 2 px steps to 28 px, at most 4 lines (line height 1.3). It takes the largest size that fits, and prefers a size where the last line isn't a lone short word (under 30 % of the width), because Thai breaks between words.
- `plainText()` strips emoji (pictographs, variation selectors and joiners) on the card only, because canvas fonts can draw them as empty boxes. The screen keeps them.
- The card preview's `alt` text ends with the same line, without emoji.
- An ending must make sense without the screen: a unit test forbids "ด้านล่าง" and "below" (§24).

### 25.6 The smoke test runs on a pinned date

- `SMOKE_DATE` (default `2026-10-18`) sets the Bangkok day. `pinDate()` in `tests/smoke.mjs` adds an init script that replaces `Date` with one moved to 10:00 Bangkok time on that day; time keeps running from there. Some checks pin their own day (5 Dec 2026 for the dust check).
- Playwright's clock API isn't used, because it also fakes the timers and `requestAnimationFrame`, and the rounds run on `performance.now()` and `requestAnimationFrame`.
- The expected mode, topic and link come from `recommend()` and `modeLink()`, the functions the game uses, so the test never reads the real calendar and never keeps a second copy of the rules.
- Other seasons: `SMOKE_DATE=2026-12-05 npm run smoke` (dust, Air4Thai, the air topic) and `SMOKE_DATE=2027-04-10 npm run smoke` (fire, no check link, the fire topic) both passed 79/79 on 18 Oct 2026.
- What it can't see is today's real state. The build's `start` line and warnings cover that ([KNOWN_ISSUES #53](KNOWN_ISSUES.md#53-the-smoke-test-runs-on-a-pinned-date)).

### 25.7 Docs and generated files that can't drift

- `npm run docs` writes the summary between `<!-- SUMMARY:START -->` and `<!-- SUMMARY:END -->` at the top of [01-safety-content.md](01-safety-content.md), as well as the table, flags and references. A normal build warns when the file is out of date with the content.
- CI's "generated files are committed and current" step diffs `'public/*.html'` (which covers the hazard pages), `public/sw.js` and `public/js/version.js` with the rest of the generated output, and fails when a generated file under `public/` isn't committed.

## 26. Carousel posts (v1.6.1)

A Thai stockpiling infographic shared on social media showed what people forward: practical advice, one page at a time. The game's lessons are sourced and short, so each hazard now has a ready-made set of images for a Facebook album, an Instagram carousel or a LINE post.

- **Files:** `public/share/carousel/<slug>/01.jpg … NN.jpg`, 1080 × 1350 (4:5, the tallest ratio Facebook and Instagram show in the feed without cropping), JPEG quality 0.86, about 130 KB each. Today: `flood` 12, `pm25` 11, `fire` 11 and `ready` 11 (v1.7.0); 45 images, about 6 MB.
- **Pages, in order** (`carouselSets()` in `tools/carousel.mjs`, shared by the build and the renderer):
  1. a cover: the mode names, the gecko with the hazard's prop, the title (`carousel.json → cover<H>Title`, with the number of lessons), a subtitle and "ปัดดูทีละข้อ →"
  2. one page per lesson in `carousel.json → sets.<hazard>` (at most 8): the mode's chip, the item's sprite, its name, **ควรทำ** with the correct action and the game's blue tick, **ทำไม** with the reason, and **ที่มา** with the agencies (English names on English sets); a lesson that isn't ✅ verified says "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน"
  3. the hazard's checklists (two for floods)
  4. the game: "ลองเล่นจริง 60 วิ ฟรี", the hazard page's address and the free helplines
  - Every page shows the page number ("3/12") and, at the bottom, the hazard page's address (`baanrodmai.autobahn.bot/pm25`) and the disclaimer.
- **Text and code that cost players nothing:** every lesson word comes from `items.json`, so a post can't say something the game doesn't. `public/content/carousel.json` holds the lesson picks and the frame (titles, labels, captions) in Thai and English; the game never loads it, and the service worker doesn't precache it. The drawing code is `drawCarouselPage()` in `tools/carousel-draw.mjs`, which imports the card helpers `cards.js` exports as `kit`; only the renderer's browser loads it.
- **Lessons picked:** floods `p-breaker`, `p-docs`, `p-waterfood`, `p-plan`, `r-wire`, `r-gas`, `r-generator`, `r-foodwet`; dust `a-window`, `a-mask`, `a-app`, `a-sweep`, `a-purifier`, `a-ball`, `a-inhaler`, `a-leaves`; fire `f-strip`, `f-charge`, `f-pan`, `f-gas`, `f-towel`, `f-door`, `f-call`, `f-extinguisher` (all ✅); power cut (v1.7.0) `s-water`, `s-pantry`, `s-opener`, `s-fridge`, `s-torch`, `s-powerbank`, `s-candle`, `s-generator` (5 ⚠️: `s-water`, `s-pantry`, `s-opener`, `s-fridge`, `s-candle`; their pages say they are under review). The build stops on a lesson that doesn't exist, belongs to another hazard or isn't playable. Since v1.7.0 it lists the lessons under review on its `posts` line ("lessons under review: outage 5 ⚠️") instead of a warning for each.
- **Line breaks:** `balanced()` in `tools/carousel-draw.mjs` finds the narrowest width that keeps the same number of lines, so Thai titles break evenly ("น้ำท่วม: 8 เรื่อง | ที่ทำให้บ้านรอด", not "…ทำให้บ้าน | รอด").
- **Freshness:** `npm run images` writes `share/carousel/manifest.json` with a SHA-256 fingerprint (16 hex characters) of every set's data and the site address. The build computes the same and warns when they differ ([KNOWN_ISSUES #54](KNOWN_ISSUES.md#54-carousel-images-are-committed-and-thai-only)). Render only these images with `npm run images -- --only share/carousel`.
- **`/posts`** (`public/posts.html`, generated): each set's images in order, the Thai caption in a text box (`carousel.json → caption<H>`, with the page link, the play link `/?mode=…` and hashtags) and a copy button (a few lines of inline script; it falls back to selecting the text). `noindex, nofollow` in the page, `X-Robots-Tag: noindex` in `_headers`, not in the sitemap.
- **How to post** is in [04-launch-kit](04-launch-kit.md#posting-the-carousels-v161).

## 27. Power cuts and home stock (v1.7.0)

Built 18–19 Oct 2026 (ROADMAP N14). A fifth mode, `stock` (ไฟดับ / Power cut), on the same registry, rooms and rules. The four older modes' houses are unchanged: a year of houses per mode was compared with v1.6.1 and is identical.

### 27.1 Why: a viral infographic

The owner saw a Thai stockpiling infographic spreading on social media, from a lifestyle page. Its slides said, among other things: "72 hours minimum, aim for 7 days", "eat old stock first", "when the power is out, eat fridge → freezer → canned" and "don't forget a manual can opener". It was the prompt for the carousel posts (§26) and then for this mode.

The infographic names no agency, so it is **not a source**. Each of its claims was looked up at an agency; the game teaches what an agency says, flags what only a foreign agency says, and leaves out what no agency says (§27.3). The mode also covers parts of a power cut that agencies address beyond stockpiling: candles, generators, unplugging, a battery radio and cold medicine.

### 27.2 Sources: what each claim rests on

Read on 18 Oct 2026. Each new source's `note` in `sources.json` quotes what was read.

| Claim in the game | Source (`id`) | Status |
|---|---|---|
| Keep the fridge shut; a closed fridge keeps food safe about **4 hours**; after that throw out chilled meat, fish, eggs, milk and leftovers | US CDC, "Keep Food Safe After a Disaster or Emergency", 24 Nov 2025 (`cdc-food-outage`); Ready.gov "Power Outages", updated 4 Jun 2026 (`readygov-outage`) | ⚠️ international only (`s-fridge`, `s-leftover`) |
| Never taste food to check it | US CDC (`cdc-food-outage`) | ⚠️ international only (`s-leftover`) |
| A full freezer holds about **48 hours**, a half-full one about **24** | US CDC (`cdc-food-outage`) | ⚠️ international only (`s-freezer`) |
| A manual can opener with the cans | Ready.gov "Build A Kit", updated 1 Jul 2026 (`readygov-kit`) | ⚠️ international only (`s-opener`) |
| At least **3 litres** of drinking water per person per day, for **at least 3 days** | กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`, the figure is in its title; the page refuses automated reading), ปภ. 3–4 days (`ddpm-amarin`) | ⚠️ (`s-water`) |
| Everyday stockpiling: buy a little extra of what you eat, use it, restock, replace what's expired | กรมอนามัย 3–5 days of dry and canned food (`anamai-stock`, via news); Tokyo Metropolitan Government, Tokyo Stockpiling Navi (`tokyo-bichiku`); Ready.gov kit (`readygov-kit`) | ⚠️ mixed (`s-pantry`) |
| A plan for medicine that must stay cold, or a medical device on power | Ready.gov (`readygov-outage`); 7 days of daily medicine is the MOPH's (`moph-7days`, checklist only) | ⚠️ international only (`s-medcold`) |
| Flashlights, not candles; never leave a candle burning | US Fire Administration, "Candle Fire Safety", reviewed 1 Apr 2023 (`usfa-candle`); Ready.gov | ⚠️ international only (`s-candle`) |
| Spare batteries with the flashlight, a flashlight for everyone | ปภ.'s 6-item kit (`ddpm-6kit`); Ready.gov | ✅ (`s-torch`) |
| A battery radio for official news | `prd-72h` (seen in a search summary of the page); Ready.gov kit | ⚠️ (`s-radio`) |
| Charge phones and power banks before the power goes | ปภ. (`ddpm-amarin`); Ready.gov | ✅ (`s-powerbank`) |
| Unplug appliances against a surge when the power returns | Ready.gov (`readygov-outage`) | ⚠️ international only (`s-plugs`) |
| A generator only outdoors, in the open, away from doors and windows | กรมควบคุมโรค's manual (`ddc-manual`); Ready.gov (at least 20 ft, about 6 m, from windows and doors) | ✅ (`s-generator`) |

Totals after v1.7.0: 81 items in 5 modes and 8 topics, 79 playable, 60 ✅ and 21 ⚠️, from 72 sources (8 international; v1.8.0 added a ninth, `readygov-plan`, for the plan card, §28.4). Why the international ones are flagged, and what would make them Thai: [KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance).

### 27.3 What was left out, and why

| From the infographic | Why it's not in the game |
|---|---|
| "Aim for 7 days" | Only Tokyo says it. Thai agencies say 3 days (PRD's 72 hours), 3–4 (ปภ.) or 3–5 (กรมอนามัย). The game keeps "at least 3 days", which they share. |
| "Check your stock every 3–6 months" | No agency source gives an interval (Ready.gov says "replace expired items" and "re-think your needs every year"; Tokyo has a yearly stockpiling day). The game says "replace what's expired" and gives no interval. |
| "When the power is out, eat fridge → freezer → canned" | No agency states it as an order. The game teaches the sourced times instead: the fridge is lost at 4 hours, the full freezer lasts about 48 (§27.4), so a player learns that the fridge goes first. |
| "Eat old stock first" | Kept as "eat it as usual, restock, replace what's expired" (`s-pantry`), the wording Tokyo and Ready.gov use. |

Foreign numbers appear only where they are the source's own and are named as such: the CDC's 4 and 48 hours, and Ready.gov's 20 feet (about 6 m) in `s-generator`'s "ทำไม?". The tips themselves carry no foreign number except the CDC's hours.

### 27.4 The `dark` threat and `lostAfter`

| Setting | Value | Meaning |
|---|---|---|
| `round.stock.seconds` | 55 | Round length |
| `round.stock.hours` | 12 | The story's hours without power over the round: one story hour ≈ 4.6 s |
| `round.stock.dark` | [[0, 0.1], [0.33, 0.38], [0.7, 0.56], [1, 0.66]] | How dark the room is (0–1) by progress |
| `s-fridge.lostAfter` | 4 | Goes bad at 4 story hours: about 18 s with no penalties, earlier after mistakes (penalties move the clock forward, [KNOWN_ISSUES #26](KNOWN_ISSUES.md#26-wrong-answers-and-decoys-make-the-water-rise-faster)) |

- `Round.darkLevel` interpolates the keyframes like the water (`waterY()`); `Round.hoursOut` is progress × `hours`. `checkWater()` marks a pending item with `lostAfter` as `flooded` once `hoursOut >= lostAfter`, and calls the same `flood` hook as the water, so the toast, the gecko line and the result work unchanged.
- **On screen:** `scene.js → _dark()` draws a group of two full-room rectangles, a deep-blue body (`#141A33` at 85 %) and a wide darker edge stroke, with the group's opacity set from `darkLevel` each frame; pointer events pass through. A lost item gets the class `spoiled` (greyed, a little sepia) and a grey clock badge. The status reads "เสียก่อน" / "Went bad first" (`stFloodedStock`), the toast "{name} เสียแล้ว ไฟดับนานเกินไป…" (`floodedToastStock`), and the share grid shows 🌑.
- **The HUD** shows the story hours, then the seconds: "ไฟดับมา 4 ชม. · 37 วิ" (`darkHours` + `seconds`). The gauge is striped blue-violet (`.is-stock .gauge-fill`).
- **Why only the fridge:** its 4 hours are the one sourced time that falls inside a 12-hour night. The freezer's 48 hours (24 half full) are longer than the night, so it never goes bad in the round. The other lessons have no time limit; the clock is the pressure, as in the dust mode.
- **Build checks:** a `dark` mode needs `round.<mode>.hours`; `lostAfter` must lie between 0 and `hours` and only appear in a `dark` mode (errors); a `dark` mode with no `lostAfter` item is a warning.
- **Tests:** a unit test runs the clock to 3.9 story hours (nothing lost), 4.1 (only the fridge) and 11.9 (still only the fridge); a smoke check jumps a real round to 4.05 hours and checks the fridge's status and class, the HUD text and that the dark layer's opacity is above 0.25.

### 27.5 The lessons, room by room

| Room | Lesson | The right action (the wrong ones people pick) |
|---|---|---|
| Kitchen | `s-fridge` | Keep the door shut (keep checking it's still cold; take everything out) |
| | `s-leftover` minced pork after a night without power | Throw it out without tasting (taste a little; cook it well) |
| | `s-freezer` a full freezer | Keep it shut, about 2 days (cook everything now; check it every hour) |
| | `s-opener` a shelf of cans | A manual can opener with the food (wait for the power) |
| | `s-water` stored water | At least 3 L per person per day (two bottles will do) |
| | `s-pantry` the food store | Eat as usual, restock, replace what's expired (dry food never goes off; buy as much as fits) |
| Living room | `s-medcold` grandma's cold medicine | Plan ahead for keeping it cold (leave it in the fridge and don't worry; keep using it whatever the label says) |
| | `s-candle` a candle left burning | Blow it out, use a flashlight (leave it; light another) |
| | `s-torch` a flashlight with flat batteries | Spare batteries with it, one for everyone (phone lights) |
| | `s-radio` a battery radio | Turn it on for official news (go by the chat groups) |
| | `s-powerbank` one bar left | Charge everything now (when the power's back) |
| | `s-plugs` TV and computer plugged in | Unplug against a surge (leave them in) |
| Front | `s-generator` a generator under the window | Move it into the open, away from doors and windows (open the window; bring it inside) |

- **Topics:** 💧 `food` 6, 🎒 `plan` 3, ⚡ `power` 2, 🦠 `health` 1 (`s-medcold`), 🔥 `fire` 1 (`s-candle`). The mode's own topic is `food`. Across the game the topics now hold: home 12, power 11, health 11, plan 9, food 10, critters 4, air 10, fire 14.
- **Decoys:** a closed rice bin, a battery wall clock, books on the shelf, a potted plant, dishes in the sink.
- **The family** appears as in the other modes (grandma's medicine that must stay cold), and the gecko carries a torch: "ไฟดับแล้ว! ดูตู้เย็นก่อนเลย", "มืดแล้ว ไฟฉายอยู่ไหนนะ".
- **Ranks:** มือใหม่หัดตุนของ → ผู้จัดการคลังบ้าน → บ้านนี้พร้อมทุกไฟดับ. **Endings:** "บ้านรอด! ไฟดับทั้งคืนก็อยู่สบาย ของพร้อมครบ 💙" (10/10) down to "คืนนี้ลำบากหน่อย แต่ตอนนี้รู้แล้วว่าต้องตุนอะไร" (0–4).

### 27.6 The house rule

`generateHouse()` takes one item with `lostAfter` first in a mode whose threat is `dark` (§4, step 3), so every power-cut house has something that goes bad and the story hours always matter. Today that item is always `s-fridge`. A unit test checks a year of power-cut houses for it. The rule looks at the threat, not the mode id, so a later `dark` mode gets it too, and no other mode's houses change.

### 27.7 The checklist

`checklists.json → stock`, "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" / "10 things for a 3-day power cut", at `/checklist/stock`:

1. 💧 drinking water, 3 L per person per day, for 3 days
2. 🥫 dry and canned food for at least 3 days; eat it and restock
3. 🔧 a manual can opener, kept with the food
4. 🔦 a flashlight for everyone, with spare batteries
5. 📻 a battery radio for official news
6. 🔋 phones and power banks kept charged
7. 💊 at least 7 days of daily medicine (MOPH, `moph-7days`); a plan for cold medicine
8. 🧊 keep the fridge shut: about 4 hours for fresh food
9. 🔌 unplug appliances against surges
10. ⚠️ generators outdoors only; flashlights, not candles

### 27.8 The hazard page and posts

- `/ready` and `/en/ready` (`config.json → hazards.outage.slug`): the 13 lessons, the checklist, the helplines and two ▶ buttons to `/?mode=stock`. No "check before you go" link. The preview is `og/checklist-stock.png`. Its intro says several lessons come from international guidance and are marked. The slug can never change.
- The carousel set `ready` (11 images) is in §26; 5 of its 8 lessons are ⚠️ and say so on the image. The caption (`carousel.json → captionOutage`) ends with `#บ้านรอดไหม #ไฟดับ #ของตุน`.

### 27.9 The start screen with five modes

- The recommended mode is the big card; the other four sit in **one row of four** (`--cols` is `min(4, modes − 1)` in `main.js`; the static grid in `index.html` has `--cols: 4` so the first paint doesn't jump).
- Small-card names are `clamp(12px, 3.9vw, 16px)` with 2 px side padding, so every Thai name ("ก่อนน้ำมา", "หลังน้ำลด", "ฝุ่น PM2.5", "ไฟไหม้", "ไฟดับ") fits on one line at 320 px; English names wrap to two lines. A sixth mode would need a new layout check at 320 px.
- The power-cut card is blue-violet (`#DCE1F5`), and its share cards use the `stock` theme in `cards.js` (blue-violet waves).

### 27.10 The room arrows and the fridge slot

The ‹ › room arrows are 44 × 64 px at 44 % of the stage's height, over the room. Measured in v1.7.0, the left one covered the item on the fridge (slot `kt-fridge-note`, x 44, y 344):

| Screen | `p-numbers`, `f-call` | `s-fridge` |
|---|---|---|
| 390 × 760 | up to 23 % of the tap area | 27 % |
| 360 × 640 | 18–20 % | |
| 768 × 1024 | 6–8 % | |
| 320 × 460 | 0 | |

A tap on the covered part turned the room. The slot moved to y 404, below the arrows; the id is the same, so houses and challenge links didn't change. The worst coverage left is 2 % (window items at the right edge), and a smoke check now fails above 5 % in any mode, room and three houses at 390 × 760 and 360 × 640. The old smoke clicks used `force: true`, which clicks through whatever covers an item ([LESSONS D11](LESSONS_LEARNED.md#d-testing-and-verification)). Lower on the screen, `p-numbers` now goes under at 43.6 s instead of 55.6 s, and the fire smoke (lowest edge y 330) no longer reaches `f-call`.

## 28. The home check and the family plan card (v1.8.0)

Built 19 Oct 2026 (ROADMAP N15). Two tools outside the round, for a family at home: **"บ้านเราพร้อมแค่ไหน?" / "How ready is our house?"** (`/?open=kit`) and **"แผนบ้านรอดของบ้านเรา" / "Our family safety plan"** (`/?open=plan`). No item, room, slot or `houseVersion` changed, so houses and challenge links are the same.

### 28.1 Why

The power cut (§27) teaches what to stock, one lesson at a time, in a house that isn't the player's. A family then has to turn "3 L per person per day for 3 days" into its own number and find out what it is still missing. The check does that sum for the household and keeps the ticks, and its card is something to send to the family group, with the text "บ้านเราพร้อมรับมือไฟดับ 56% 🎒 แล้วบ้านคุณล่ะ?". The plan card does the same for the flood lessons about who does what (`p-plan`: older and bedridden people first; `p-poster`: the way to the shelter): the family writes its own answers and keeps them on every phone.

### 28.2 The flow

**The home check** (`openKit()` in `kit.js`):

1. **Questions** (first time, or after "แก้คำตอบ"): "บ้านเรามีกี่คน?" with a − / + stepper (1–10, 3 to start; the buttons are 52 px circles) and "ในบ้านมีใครบ้าง? (เลือกได้หลายข้อ)" with four answers: 👶 มีเด็กเล็ก, 🧓 มีผู้สูงอายุ หรือผู้ป่วยติดเตียง, 💊 มีคนกินยาประจำ, 🐾 มีสัตว์เลี้ยง. Under them: "🔒 คำตอบอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน".
2. **The list** ("ดูรายการของบ้านเรา"): "บ้าน 3 คน · แก้คำตอบ", a meter and "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)", then one row per thing: a checkbox, the icon, the label, the amount for this household where there is one, and "ที่มา: <agencies>" with "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on `partial` items ([17-kit.png](screens/17-kit.png)). Agencies come from `sources.json`, with their English names on `/en/` (`seo.en.agencies`). A tick updates the meter and is saved at once.
3. **Share** ("📤 แชร์ผลของบ้านเรา"): draws the kit card (§28.7) and opens a share sheet like the game's: native share where the browser has it, LINE, Facebook, copy, and save where downloads work (otherwise the long-press hint). There is no X button. The text is "บ้านเราพร้อมรับมือไฟดับ {pct}% 🎒 แล้วบ้านคุณล่ะ? เช็กฟรี 1 นาที 👉 {url} #บ้านรอดไหม" (English "Our home is {pct}% ready for a power cut 🎒 …").
4. "📝 ทำแผนบ้านรอดของบ้านเรา" opens the plan card, with "← กลับไปที่รายการ" back to the list.

A returning visitor goes straight to the list with their answers and ticks. If they change the answers so a thing no longer applies (no more pets), its tick is dropped.

**The plan card** (`openPlan()`): a form of six fields (§28.4), each with its label, an example, and a hint with its agencies where there is one; "🔒 ข้อความอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น" above them. "สร้างการ์ดแผนบ้านรอด" needs at least one field ("กรอกอย่างน้อย 1 ช่องก่อนนะ") and draws the card ([18-plan-card.png](screens/18-plan-card.png)); its share text is "แผนบ้านรอดของบ้านเรา 📝 เซฟไว้ในมือถือทุกคนนะ ทำของบ้านคุณได้ที่ 👉 {url} #บ้านรอดไหม".

**Ways in:**

| From | What | `kit_open` label |
|---|---|---|
| The start screen | Quick button 🎒 "บ้านพร้อมไหม?" (`#kit-chip`, `data-open="kit"`); once checked it reads "บ้านพร้อม {pct}%" from `brm:kit` | `start` |
| The result of a power cut | "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" (`#btn-kit`), on any mode whose threat is `dark` | `result` |
| A link | `/?open=kit` and `/?open=plan` (`/en/…` in English), read in `boot()` | `link` (the check only) |
| `/ready`, `/en/ready` | "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน (ฟรี 1 นาที)" and "📝 ทำการ์ดแผนบ้านรอดของบ้านเรา", from `config.json → hazards.outage.tools` and `seo.<lang>.toolKit` / `toolPlan` | `link` (the check only) |
| The plan card's back button | Back to the list | `plan` |

The quick buttons became two per row with the icon beside the label (52 px tall, labels `clamp(12px, 3.9vw, 14px)`), so the four Thai labels ("เช็กลิสต์ 10 ข้อ", "บ้านพร้อมไหม?", "เบอร์ช่วยเหลือ", "เช็กระดับน้ำ") don't break mid-word.

### 28.3 The list: amounts and sources

`kitPlan(kit, {people, flags})` in `kitplan.js` (pure) clamps the people to 1–10, keeps the items with no `for` and those whose `for` was answered, and computes each amount:

| `qty` | Total | Thai line (English) |
|---|---|---|
| `perPersonPerDay`, `days`, `unit` | per × people × days | "27 ลิตร (3 ลิตร × 3 คน × 3 วัน)" ("27 litres (3 litres × 3 people × 3 days)") |
| `perPerson`, `unit` | per × people | "3 อัน (คนละ 1)" ("3 (one each)") |
| `days`, `people: true` | — | "พอ 3 วัน สำหรับ 3 คน" ("Enough for 3 days for 3 people") |
| `days` | — | "พออย่างน้อย 7 วัน" ("At least 7 days' worth") |

The 15 things, in the order shown:

| Id | For | Label (th) | Amount | Sources | Status |
|---|---|---|---|---|---|
| `water` | everyone | น้ำดื่ม | 3 L per person per day, 3 days | `prd-72h`, `ddpm-amarin` | ⚠️ |
| `food` | everyone | อาหารแห้ง อาหารกระป๋อง | 3 days for the household | `anamai-stock`, `ddpm-amarin`, `moph-7days` | ✅ |
| `opener` | everyone | ที่เปิดกระป๋องแบบมือหมุน | — | `readygov-kit` | ⚠️ international only |
| `torch` | everyone | ไฟฉาย พร้อมถ่านสำรอง | one each | `ddpm-6kit`, `readygov-outage` | ✅ |
| `radio` | everyone | วิทยุใส่ถ่าน | — | `prd-72h`, `readygov-kit` | ⚠️ |
| `power` | everyone | มือถือและพาวเวอร์แบงก์ ชาร์จเต็ม | — | `ddpm-amarin`, `readygov-kit` | ✅ |
| `firstaid` | everyone | ชุดปฐมพยาบาล | — | `ddpm-6kit`, `readygov-kit` | ✅ |
| `docs` | everyone | เอกสารสำคัญ ใส่ถุงกันน้ำ | — | `ddpm-noru`, `ddpm-6kit` | ✅ |
| `cash` | everyone | เงินสดติดบ้านไว้บ้าง | — | `readygov-kit` | ⚠️ international only |
| `meds` | 💊 daily medicine | ยาประจำตัว | at least 7 days | `moph-7days`, `ddpm-6kit` | ⚠️ (2013 figure) |
| `medcold` | 💊 daily medicine | แผนสำรองสำหรับยาที่ต้องแช่เย็น | — | `readygov-outage` | ⚠️ international only |
| `baby` | 👶 small children | นมผง ขวดนม ผ้าอ้อม | — | `readygov-kit` | ⚠️ international only |
| `device` | 🧓 older or bedridden | แผนไฟสำรอง สำหรับเครื่องมือแพทย์ที่ใช้ไฟ | — | `readygov-outage` | ⚠️ international only |
| `glasses` | 🧓 older or bedridden | แว่นตาสำรอง | — | `readygov-kit` | ⚠️ international only |
| `pet` | 🐾 pets | อาหาร น้ำ และกรงหรือสายจูงของสัตว์เลี้ยง | — | `ddpm-noru`, `anamai-pets`, `readygov-kit` | ✅ |

- **Where the numbers come from:** the 3 L per person per day is in the title of กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`); 3 days are its 72 hours and the shared floor of ปภ.'s 3–4 days (`ddpm-amarin`), กรมอนามัย's 3–5 days (`anamai-stock`) and the MOPH's "at least 3 days" (`moph-7days`); 7 days of daily medicine are the MOPH's (`moph-7days`, a 2013 statement); a flashlight for every household member is Ready.gov's (`readygov-outage`). The same numbers are in the power-cut lessons (§27.2) and its checklist (§27.7).
- **9 ⚠️, 6 ✅.** Why each is ⚠️, and what would make it Thai: [KNOWN_ISSUES #57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance). The cash, glasses and baby lines rest on the "Additional Emergency Supplies" list of Ready.gov's "Build A Kit", which the `readygov-kit` note quotes (read again on 19 Oct 2026).
- **The score** (`kitScore`) is the share of this household's things ticked, rounded: `round(100 × have ÷ total)`. A household with every answer has 15 things, one with none has 9. The score counts things, not amounts: a tick means "we have this", not "we have 27 L".
- **"Still missing" on the card** (`kitMissing`, at most 3) lists the everyday things before the household's own, in list order.
- **1–10 people** is the stepper's range, an interface choice, not advice.

### 28.4 The plan card's fields

From `kit.json → plan`, in this order. `max` is the input's `maxlength` (the text is trimmed and cut to it again when read).

| Id | Label (th) | Example | Hint (th) | Sources | Status | Max |
|---|---|---|---|---|---|---|
| `shelter` | ศูนย์พักพิงหรือจุดอพยพใกล้บ้าน | เช่น โรงเรียนในซอย | รู้ไว้ก่อนว่าอยู่ไหน ไปทางไหน แล้วบอกทุกคนในบ้าน | `prd-flood`, `ddpm-noru` | ✅ | 40 |
| `meet` | จุดนัดพบของครอบครัว | เช่น หน้าร้านสะดวกซื้อปากซอย | ที่ที่ทุกคนรู้จักและหาง่าย | `readygov-plan` | ⚠️ international only | 40 |
| `contact` | ถ้าพลัดกัน จะติดต่อใคร | เช่น น้าแดง 08x-xxx-xxxx | ตกลงกันไว้ก่อนว่าจะติดต่อกันอย่างไร | `readygov-plan` | ⚠️ international only | 40 |
| `help1` | ใครช่วยใคร | เช่น พ่อพาคุณยาย | พาผู้สูงอายุและผู้ป่วยติดเตียงไปที่ปลอดภัยก่อน พร้อมยาและอุปกรณ์ | `ddpm-noru`, `anamai-elderly` | ✅ | 40 |
| `help2` | ใครช่วยใคร (อีกคู่) | เช่น แม่ดูแลน้องและน้องหมา | — | — | — | 40 |
| `meds` | ยาและของจำเป็น | เช่น ยาความดันคุณตา | ยาประจำตัวอย่างน้อย 7 วัน | `moph-7days` | ⚠️ (2013 figure) | 60 |

`readygov-plan` (Ready.gov "Make A Plan", updated 1 Sep 2026, read on 19 Oct 2026) says "Establish a family meeting place that's familiar and easy to find" and "Know how you'll contact one another and reconnect if separated". No Thai agency page on a family meeting place was found. The example contact is a pattern (`08x-xxx-xxxx`), not a real number.

The helplines on the card are the `main` numbers of `helplines.json`: 1784 · 199 · 1669 · 1555 · 1130 · 1129, labelled "เบอร์ช่วยเหลือ โทรฟรี" ("Thai helplines, free to call" in English: the English card still prints Thai numbers, [KNOWN_ISSUES #37](KNOWN_ISSUES.md#37-the-international-version-is-english-only-with-thai-advice-and-hotlines)).

### 28.5 What stays on the device

The rule: what a family answers, ticks or types is theirs, and the game never needs it anywhere but on their screen.

| Key (`localStorage`, via `store`) | Holds | Written |
|---|---|---|
| `brm:kit` | `{people, flags, have, answered, pct, date}`: the answers, the ids ticked, the score and the Bangkok date | When the list opens, and on every tick |
| `brm:plan` | `{shelter, meet, contact, help1, help2, meds, date}`: the six fields as typed (trimmed and cut to `max`) and the date | When a field changes, and when the card is made |

- **Nothing typed is sent.** The cards are drawn on a `<canvas>` in the browser; the image leaves the phone only when the person shares or saves it. The analytics events carry a label from a fixed list (where from, or the share channel) and, for `kit_share`, the score, and `/api/e` cleans every field to `[\w\-.:]` anyway (§9).
- **Proved by a test.** The smoke check types "PRIVATE-MEETING-PLACE" and "PRIVATE 081-234-5678" into the plan, makes and shares the card, fires `pagehide`, and fails if any `/api/e` body contains "PRIVATE" or "081-234", or if `kit_open`, `kit_share` or `plan_share` is missing.
- **Less to leak.** Six short fields with a `maxlength` (40, or 60 for medicine), `autocomplete="off"`, and the line "อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น" on the form. The examples are a place, a name with a pattern number, and "Dad takes Grandma".
- **Said where people read it.** The About sheet's privacy text (th/en) names the home check's answers and the plan card's text among what stays on the device.
- **The limits** (one browser, cleared with site data, LINE's in-app browser separate from the phone's browser): [KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser).

### 28.6 Analytics events

| Event | When | mode | label | value |
|---|---|---|---|---|
| `kit_open` | The home check opens | – | `start` / `result` / `link` / `plan` (§28.2) | – |
| `kit_share` | A channel in the check's share sheet is tapped | – | `native` / `line` / `facebook` / `copy` / `save` | the score, 0–100 |
| `plan_share` | A channel in the plan card's share sheet is tapped | – | `native` / `line` / `facebook` / `copy` / `save` | 0 |

Opening the plan card sends no event of its own, so a `/?open=plan` arrival shows only as a `direct` view; the made cards show as `plan_share`. The queries are in [05-metrics](05-metrics.md#the-home-check-and-the-plan-card-v180).

### 28.7 The two cards (1080 × 1350)

Both are drawn in `kit.js` with the card helpers `cards.js` exports as `kit` (here `draw`), in the power cut's `stock` theme.

- **The kit card** (`drawKitCard`): the blue-violet background and waves; the wordmark at the top, kept clear of the moon; the title "บ้านเราพร้อมแค่ไหน?"; a score ring (radius 160, a grey track and the game's blue "correct" colour from the top, clockwise) with the percentage in 120 px; the gecko with a torch on the left, cheering from 80 %, happy from 40 %, thinking below; "มีแล้ว 3 จาก 9 อย่าง"; "ยังขาด:" with up to three things (one line each) or "ครบทุกอย่างแล้ว!"; then "บ้านคุณพร้อมแค่ไหน? เช็กฟรี", the address `…/?open=kit` and the disclaimer on the waves.
- **The plan card** (`drawPlanCard`): a header band in the theme's colour with the wordmark, the title "แผนบ้านรอดของบ้านเรา", "ทำเมื่อ 19 ต.ค. 69" and the gecko; one white box per filled field (label above, value below; empty fields are left out); a dark box with the helplines; "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน", the address `…/?open=plan` and the disclaimer.
  - **All rows fit.** The boxes share the space between y 320 and 1010. The code lays them out at full size with up to two lines per value, and while they don't fit it shrinks the whole block in steps of 6 % (never below 64 %); below 80 % each value keeps its first line only. Six one-line rows fit at 76 %, so every filled field is always on the card; a value too long for one line at that size would lose the rest of its text. The first version dropped the sixth row instead ([LESSONS D12](LESSONS_LEARNED.md#d-testing-and-verification)).
  - **Measured on 19 Oct 2026** with a one-off probe in headless Chromium: all six fields at their maximum length (40 characters, 60 for medicine), in Thai and in English, drew every row and every character; the English medicine line took two lines.

### 28.8 Build checks and tests

- **`tools/build.mjs`** stops on a `kit.json` item with no sources, an unknown source, a duplicate id, a `verify` other than `verified` or `partial`, or a `for` that isn't one of the answers; on a plan field whose `max` isn't 1–80, or whose hint has no or unknown sources; on any label, hint, example or interface text without Thai and English; on a `unit` without Thai; and on a hazard `tools` entry other than `kit` or `plan`, or one without its `seo.<lang>.tool<Kit|Plan>` string.
- **Numbers must be in the source.** Every whole number above 1 in `perPersonPerDay`, `perPerson` and `days` must appear, as a number on its own, in the title or `note` of one of the item's sources, so an amount can't be made up. It shows that the number is there, not what it means there: `days: 3` on the water passes on "3 ลิตร" as well as on "3–4 วัน", so a person still reads the source. `perPerson: 1` (a flashlight each) is not checked, since a 1 is in almost any text.
- **Unit test** "home check: amounts follow the household, special items follow the answers": 9, 27 and 90 litres for 1, 3 and 10 people; a flashlight each; food for 3 days; 0 and 99 people clamped to 1 and 10; each answer adds only its items; daily medicine 7 days; 0 % and 100 %; the card's missing list starts with everyday things.
- **Smoke section 11** (7 checks, 360 × 640): 4 people with daily medicine → 36 litres, medicine listed, baby items not; answers and ticks in `brm:kit`; controls of the questions, list and plan form ≥ 44 px; the kit card at 1080 px with LINE on the first screen; the plan card renders; the typed text in no `/api/e` body and the three events present; no page errors.

### 28.9 Code and loading

- `kitplan.js` is pure (no DOM), so the unit test and tools import it in Node, like `house.js` and `modes.js`.
- `kit.js` holds the sheets, the cards and the share sheet. `main.js` loads it with `import('./kit.js')` only when the check or the plan opens (`openTool()`); `kit.js` fetches `kit.json` on first use. If the import fails (offline and not cached), the toast "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`) shows and nothing else changes.
- The start-screen chip's text is set by `main.js` from `brm:kit`, so the start screen never loads `kit.js`.
- The service worker precaches `kit.js`, `kitplan.js` and `kit.json` (44 files), and the build's budget counts the two scripts as start-screen weight ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)).
- Sizes on 19 Oct 2026 (gzip -9): `kit.js` 5.5 KB (17.2 KB raw), `kitplan.js` 0.8 KB, `kit.json` 4.3 KB (17.1 KB raw).

### 28.10 What was left out, and why

| Idea | Why it's not in the check |
|---|---|
| "Check your kit every 3–6 months" | No agency gives an interval (§27.3). The check shows no reminder date; it keeps the date of the last check in `brm:kit`. |
| A 7-day stock target | Tokyo's alone (§27.3). The check uses 3 days for water and food; 7 days appear only for daily medicine, from the MOPH. |
| "Eat the fridge, then the freezer, then cans" | No agency states the order (§27.3). |
| Amounts for food, pet food, baby supplies or cash | No source gives one that fits a Thai household; those lines carry no number. |
| Names, ages or phone numbers in the questions | Not needed for the list; the check asks only a count and four yes/no answers. The plan card's fields are free text kept on the device (§28.5). |

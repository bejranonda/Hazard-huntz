# Knowledge base

A reference for anyone maintaining บ้านรอดไหม?. It covers every rule, constant and formula in the game, the content model, the platform facts the design depends on, and the research behind it.

Facts are as of **19 Oct 2026** (v1.10.0). The research in §13–§15 was compiled on 6 Oct 2026, and each later section gives its own date. Where a fact comes from outside this repository, its source is linked. Anything marked **[unverified]** could not be confirmed from a primary source.

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
29. [Tools first: a guide for every hazard (v1.9.0)](#29-tools-first-a-guide-for-every-hazard-v190)
30. [Visitor audit 2 (v1.9.1)](#30-visitor-audit-2-v191)
31. [Answers, back button, card and security (v1.9.2)](#31-answers-back-button-card-and-security-v192)
32. [Calculators: the fridge, dust today, the pills (v1.10.0)](#32-calculators-the-fridge-dust-today-the-pills-v1100)

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
| เช็กของจำเป็น | *Check your supplies*: the home check, `/kit` or `/?open=kit` (v1.8.0, §28). Since v1.9.1 its one name; its sheet is titled "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" / "Check your supplies: how ready is our home?" (before: บ้านเราพร้อมแค่ไหน?, เครื่องเช็กบ้าน, §30.6). Its things to have are "kit items" in `kit.json`, not lessons |
| แผนครอบครัว | *Our family plan*: the plan card ("การ์ดแผนครอบครัว"), `/plan` or `/?open=plan` (v1.8.0, §28.4). Called แผนบ้านรอด / "family safety plan" until v1.9.1 |
| `tools` | `config.json → hazards.<hazard>.tools`: the tools (`kit`, `plan`) a hazard offers. They are linked on its page (`/ready` since v1.8.0, `/flood` since v1.8.1, the four guide-only hazards since v1.9.0), and since v1.8.1 `kit` also puts the 🎒 button on its modes' result screens (§28.2). Since v1.9.0 each tool also has its own page, `/kit` and `/plan` (§29.9) |
| guide | A short "what to do" list for one hazard, 10 lines (v1.9.0, §29): `config.json → guides` (order, icon, hazard, and since v1.9.2 the gecko's `prop` on its picture) and `checklists.json`. A game mode's checklist is its guide; `landslide`, `storm`, `quake` and `heat` are guides with no game, with a phase, sources and `verify` on every line. Opened from the hub ("📋 ต้องทำอะไร เมื่อเกิดภัย"), `/?open=guide` or `/checklist/<id>` |
| phase | A guide line's moment: `before` (ก่อนเกิด), `during` (ขณะเกิด) or `after` (หลังเกิด), in that order (§29.2). Since v1.9.1 a guide may name its phases in `phaseNames` (heat: เตรียมไว้ก่อน / วันที่ร้อนจัด / ถ้ามีคนเป็นลมแดด, §30.6) |
| `keepTogether` | `config.json → keepTogether` (v1.9.1): Thai words that must never break across lines, wrapped in `<span class="nw">` wherever Thai is shown (§30.1) |
| alert | `config.json → alert: { guide, until }`: the owner's card at the top of the start screen for the guide in the news, until its end date (§29.5) |
| hub | The start screen's three tools above the game: what to do, check your supplies, the family plan (v1.9.0, §29.6) |
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
| กรมทรัพยากรธรณี | Department of Mineral Resources (DMR): landslides and earthquakes (v1.9.0) |
| กรมทรัพยากรน้ำ | Department of Water Resources (DWR): flash-flood and landslide warning levels (v1.9.0) |
| กรมอุตุนิยมวิทยา | Thai Meteorological Department (TMD): weather warnings (1182), the heat index, tsunamis |

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
| `prepare.water` | [[0, 625], [0.35, 590], [0.6, 470], [0.82, 390], [1, 300]] | Waterline keyframes as [progress, y]. A smaller y is higher on screen. Since v1.9.1; before, [[0, 612], [0.25, 580], [0.45, 470], [0.7, 390], [1, 300]] (§30.8) |
| `prepare.floorWetY` | 470 | Waterline at or above this means the floor is wet |
| `return.seconds` | 50 | Round length (a "daylight" bar; no water) |
| `dust`, `fire`, `stock` | 55 s each | Their threats' settings are in §22.3 (haze, smoke) and §27.4 (the power cut's `hours` and `dark`) |

### The clock

`elapsed` advances only while the round is running. It **stops while any sheet is open**: the choice sheet, the tip card or pause. Penalties add straight to `elapsed`. The round ends when every target is resolved (`reason: "done"`) or when `elapsed ≥ seconds` (`reason: "time"`). Pending targets then become `missed`.

### Water (Prepare only)

`waterY(u)` interpolates linearly between the keyframes, where `u = elapsed / duration`.

- **Flood rule:** a pending target floods the moment `waterY(u) ≤ cy`, where `cy` is the vertical centre of its sprite (`slot.y − h/2`). Low things go under first, exactly as drawn.
- **Floor wet:** happens at `u = 0.6`, which is **36 s** with no penalties (since v1.9.1; `u = 0.45`, 27 s, before). The gecko says *"น้ำเข้าบ้านแล้ว!…"*, and from then on:
  - the breaker's wet variant applies
  - the critical bonus is no longer available

When each Prepare item floods, in seconds with no penalties, for the slots it can occupy. `npm run probe` prints this table; these are its numbers for the water curve of v1.9.1 (19 Oct 2026).

| Item | Floods at | Item | Floods at |
|---|---|---|---|
| `p-gutter` | 21.9 s | `p-phone` | 35.3–52.8 s |
| `p-torch` | 22.2–52.4 s | `p-sandbags` | 37.7 s |
| `p-meds` ★ | 22.8–60 s | `p-chem` | 44 s |
| `p-docs` ★ | 23.2–53.3 s | `p-numbers` | 50.2 s |
| `p-petkit` | 23.3–34.8 s | `p-tv` | 51.2 s |
| `p-waterfood` | 23.3 s – never | `p-poster` | 52.2 s |
| `p-car` | 25.7 s | `p-plan` | 59.1 s |
| `p-drain` | 27.5 s | `p-breaker` ★ | never (its answer changes at 36 s) |
| `p-lpg` | 29.4 s | `p-toilet`, `p-fuel` | rooms not playable yet |

★ = critical. The range comes from the possible slots: an item on the floor goes under earlier than the same item on a table. Under the curve of v1.0–v1.9.0 the first item went under at 13.6 s (`p-gutter`) and the floor was wet at 27 s; why the curve changed is in §30.8. `p-numbers` sits on the fridge (slot `kt-fridge-note`), which moved 60 units down in v1.7.0 so the room arrow no longer covers it ([KNOWN_ISSUES F38](KNOWN_ISSUES.md#in-v170-19-oct-2026)); it went under 12 s earlier then (43.6 s instead of 55.6 s, on the old curve).

### Scoring

```
points   = 100 × (targets right on the first try) + 50 × (critical targets right before floorWet)
max      = 100 × targets + 50 × critical targets      (critical count only in Prepare)
score10  = round(10 × points / max)                   (0–10, comparable across houses)
rank     = 0 if score10 < 5, 1 if score10 < 8, else 2
```

**Example:** 6 targets, 1 of them critical, so max = 650. With everything right but the critical item after 36 s (the floor is wet; 27 s before v1.9.1): points = 600, score10 = round(9.23) = **9**.

**Rank titles** (`strings.json → rankPrepare / rankReturn`):

| Rank | ก่อนน้ำมา | หลังน้ำลด |
|---|---|---|
| 0 | มือใหม่หัดเตรียมตัว | มือใหม่หัดกู้บ้าน |
| 1 | หัวหน้าทีมยกของ | ช่างไฟประจำซอย |
| 2 | บ้านนี้เตรียมพร้อม | เซียนกู้บ้าน |

**Statuses:** `correct` (blue ✓), `learned` (orange !), `flooded` (grey: under water in Prepare, in the smoke in fire, gone bad in the power cut), `missed` (grey ?). In the share text these become ✅ 💡 💧 ⬜, in target order: room by room, left to right. A lost item is 💨 in fire and 🌑 in the power cut. Since v1.9.1 the HUD's "done" counts only `correct` and `learned`, and shows `flooded` apart with the same mark (💧, 💨, 🌑: §30.9).

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
| `choices` | 2–3 × {kind, correct?, label{th,en}, feedback{th,en}} | **Exactly one** has `correct: true`. Every wrong one needs `feedback`. Since v1.9.2 a wrong label gives the reason a real person would give for that mistake, in at most 60 Thai letters or 80 English characters, and the right label must not stand out by length (a unit test, §31.1). `kind` names the kind of action: up, pack, off, leave, place, call, gear, check, toss, boil, move, clear (and wash, drink, seal, home). Until v1.9.1 it picked the button's icon; since v1.9.2 it is a description only and is not drawn: the buttons are lettered ก ข ค / A B C (`strings.json → choiceLetters`, §31.1). |
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
  - Totals (v1.10.0): 112 sources, of which 32 official, 9 government, 52 secondary, 2 academic and 17 international. The 3 added in v1.10.0 are for dust today (§32.3): the PCD's notice in the Royal Gazette (`pcd-aqi-2566`, official), Thai PBS quoting the PCD Director-General (`pcd-aqi-thaipbs-2566`, secondary) and MGR Online quoting the DOH Deputy Director-General (`doh-aqi-2566`, secondary).
  - Totals (v1.9.0): 109 sources, of which 31 official, 9 government, 50 secondary, 2 academic and 17 international. The 36 added in v1.9.0 for the four new guides are 27 secondary, 1 official (TMD's tsunami paper) and 8 international (Ready.gov ×4, the US NWS ×2, WHO, the US CDC) (§29.3). Before v1.9.0: 73 sources, of which 30 official, 9 government, 23 secondary, 2 academic (a university statement and a peer-reviewed study, used only for `r-stagnant` and always flagged ⚠️) and 9 international: WHO Europe and the US Fire Administration (2), used to cross-check dust and fire and as the only source of `f-alarm`; since v1.7.0 the US CDC, Ready.gov (2), the Tokyo Metropolitan Government and a third US Fire Administration page, for the power cut (§27.2); and since v1.8.0 Ready.gov "Make A Plan" (`readygov-plan`), cited only by the plan card (§28.4).
- **`strings.json`:**
  - `th` and `en` UI strings (281 keys each since v1.10.0, 264 in v1.9.0, 233 before, the same keys in both; the home check's own texts are in `kit.json`). Placeholders look like `{score}`, `{rank}`, `{grid}` and `{url}`. `logoA` / `logoB` are the two halves of the wordmark (Thai "บ้าน" + "รอดไหม?", English "Baan " + "Rod Mai?"); `langSwitch` is the label of the language button.
  - `og`: Thai link-preview texts, and `ogEn`: their English twins (the build fails if a key is missing from `ogEn`). Both are used by the build and by the image renderer.
  - `seo`: the text of `/learn`, the hazard pages and `llms.txt` (`th`, `en`, `en.agencies` = English names of the source agencies, and `updated`). The hazard pages use `byHazard`, `allLessons`, `playMode`, `hazard<H><Nav|Title|Desc|H1|Intro>` (§25.4) and, for a hazard with `tools`, `toolKit` and `toolPlan` (v1.8.0); since v1.9.0 also `guideHeading` and `guidePicture`, and `/kit` and `/plan` use `kitPage<Title|Desc|H1|Intro|Cta|List>`, `planPage…` and the amount rules `kitPerPersonDay`, `kitPerPerson`, `kitDaysPeople`, `kitDays`, `kitIf` (§29.9). Since v1.10.0 `toolFridge` and `toolAir` (the hazard pages' links), `fridgePage<Title|Desc|H1|Intro|Cta|List>`, `fridgeKeeps`, `fridgeAfter`, `airPage…` and `airFor<All|Risk|Chronic>` (the `/fridge` and `/air` pages, §32.5).
- **`checklists.json`:** one per guide (§29.2): `prepare`, `return`, `dust`, `fire` and `stock` (v1.7.0), each `{title, items: exactly 10 × {icon, th, en, sprite?}}`, and since v1.9.0 the guides with no game, `landslide`, `storm`, `quake` and `heat`, each `{title, phaseNames?, items: exactly 10 × {icon, th, en, phase, sources[], verify, verifyNote?}}`. `phaseNames` (v1.9.1, optional) is `{before|during|after: {th, en}}`, names that replace "ก่อนเกิด / ขณะเกิด / หลังเกิด" for that guide (only `heat` uses it, §30.6).
- **`kit.json`** (v1.8.0, loaded only when the home check or the plan card opens): `people {min, max, default}`, `flags[]` (`{id, icon, label{th,en}}`: `baby`, `elder`, `meds`, `pet`), `items[]` (`{id, for?, icon, label{th,en}, qty?, sources[], verify}`), `plan[]` (`{id, icon, label, hint?, placeholder, max, sources?, verify?}`) and `ui.th` / `ui.en` (96 interface texts each since v1.10.0; 42 in v1.8.1, with `backPlan`). `qty` is one of `{perPersonPerDay, days, unit}`, `{perPerson, unit}`, `{days, people: true}` or `{days}`. Details in §28. Since v1.10.0 also the calculators (§32): `fridge` (`{maxHours, freezer[] {id, label}, parts[] {id, if?, icon, label, hours | hoursBy {full, half} | days, ok, over, left?, sources[], verify}, always[] {icon, text, sources[], verify}}`) and `air` (`{units[] {id, label, step, max}, groups[] {id, icon, from?, chronic?, label, short}, levels[] {id, pm, aqi, colour, label, all[], risk[], chronic[]}}`, each line `{th, en, sources[]}`; `pm` and `aqi` are the level's upper edges, `null` on the top level). The build checks every figure against its sources (§32.6).
- **`carousel.json`** (v1.6.1, not loaded by the game): `sets.<hazard>` (the lessons per post set, `outage` since v1.7.0) and the frame text in `th` and `en` (§26); since v1.9.0 also `guidesTitle`, `guidesIntro` and `guideCaption` for the guide pictures on `/posts` (§29.9).
- **`helplines.json`:** `{number, main, who{th,en}, what{th,en}, source}`. Numbers have 3–5 digits. `main: true` puts the number on the cards.
- **`config.json`:**
  - `rainWarningActive` and its end date `rainWarningUntil`, `featuredTopic` and `featuredTopicUntil` (§25.1), and since v1.9.0 `alert: { guide, until }` (§29.5)
  - `keepTogether` (v1.9.1): 217 Thai words, 2–14 letters each, that never break across lines (§30.1)
  - `forecastAppUrl`, `forecastStatusUrl`, `siteUrl`, `version`, `houseVersion`
  - `modes` (the registry, §22.3), `topics` (§21), `guides` (v1.9.0: the guides in display order, `{id, hazard, icon, prop?}`, §29.2; `prop`, v1.9.2, is the gecko's accessory on the picture of a guide with no game, §31.4), `hazards` (the hazard pages' slugs, §25.4, a hazard needing a mode or, since v1.9.0, a guide; and since v1.8.0 optional `tools`, `["kit", "plan"]` on `outage` and, since v1.8.1, on `flood`, and since v1.9.0 on `landslide`, `storm`, `quake` and `heat`: links on those pages to the home check and the plan card, and the 🎒 button on their modes' result screens, §28.2; since v1.10.0 the list may also hold `fridge` (on `outage` and `storm`) and `air` (on `dust`), §32.5)
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
- `config.json → guides` and the guides (v1.9.0, §29.2): each guide's hazard, icon, strings and checklist; every checklist is a guide; a guide with no game has 10 lines, phases in order, existing sources on every line and a valid `verify` (with a `verifyNote` when `partial`); `config.json → alert` names a guide and has a real end date; a guide's `prop` is one the gecko has (v1.9.2)
- `checklists.json → <guide>.phaseNames` (v1.9.1): a named phase must be one the guide's lines have, with Thai and English; `config.json → keepTogether` is a list of Thai words of 2–14 letters, each listed once
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
- a guide line whose Thai is over 48 characters, and an alert whose end date has passed (v1.9.0)
- a `keepTogether` word that appears in no Thai text (v1.9.1)
- carousel images older than the text, or missing (v1.6.1)
- Thai text on an English page outside Thai-tagged spans

A carousel lesson that isn't ✅ verified is no longer a warning (v1.7.0): the `posts` line lists them per set ("lessons under review: outage 5 ⚠️"), because they stay until a Thai review and would otherwise bury real warnings.

**2. Site URL.** The first of these that is set: `SITE_URL` env → `config.siteUrl` (if not a placeholder) → `CF_PAGES_URL` → `https://[DOMAIN]`. On Cloudflare the `SITE_URL` variable doesn't exist (see §10), so the live value is `config.siteUrl` = `https://baanrodmai.autobahn.bot`.

**3. Link-preview pages.** It rewrites the Open Graph block between `<!--OG:START-->` and `<!--OG:END-->` in `index.html`. That block now also holds the `<link rel="canonical">` and, on `index.html`, the JSON-LD. It then writes 55 challenge pages (`c/{p,r,d,f,s}{0..10}.html`, *without* `og:url`) and a checklist page per guide (9 since v1.9.0), and the English set: `en/index.html` (the app shell in English), 55 `en/c/…` pages and 9 `en/checklist/…` pages. That is 129 generated pages in all (v1.9.0; 121 in v1.7.0–1.8.1, 97 with four modes). Since v1.9.0 it also writes the start screen's static Thai text, `<title>` and meta description into `index.html` from `strings.json` (§29.6), and since v1.9.1 the alert card while the alert is on (§30.4). Since v1.9.1 a checklist page's canonical link is its hazard's page, and it has no `hreflang` (§30.5).

**3b. SEO and AI-search files.** It writes `learn.html`, `en/learn.html`, the hazard pages (`flood.html`, `pm25.html`, `fire.html`, `ready.html` and their `en/` twins, §25.4; since v1.9.0 also `landslide.html`, `storm.html`, `quake.html`, `heat.html`, §29.9), `kit.html` and `plan.html` with their `en/` twins (v1.9.0), `robots.txt`, `sitemap.xml` and `llms.txt` from the content JSON (§16, §18), `posts.html` (§26), and since v1.9.1 `404.html` (§30.5). On the Thai plain pages it wraps the `keepTogether` words in `<span class="nw">` (`keepHtml`: text only, never inside a tag or an attribute; the English pages are unchanged). The build fails if `strings.json → seo` is incomplete or `seo.updated` isn't `YYYY-MM-DD`.

**4. Service worker.** It fills `tools/sw.template.js` with the precache list (44 files since v1.8.0, including `/en/`, `kit.js`, `kitplan.js` and `kit.json`) and a version: the first 10 hex characters of the SHA-256 of those files.

**5. Budget.** It sums the gzipped start-screen files (fonts counted as-is) and fails above 500 KB. Currently **240 KB**, or **254 KB** including the first room and the sprites (v1.9.1: +8 KB for the hub's text, the guide sheet and the `keepTogether` list; 232 and 247 KB in v1.9.0, mostly the new sources' notes, §29.13; 209 and 223 KB in v1.8.0–1.8.1, 200 and 215 KB in v1.7.0, 188 and 201 KB in v1.6.1). It counts every file in `js/`, including `kit.js` (about 5.5 KB) and `kitplan.js` (0.8 KB), which the start screen loads only when the home check opens, so most of v1.8.0's 8 KB is code a first visit doesn't fetch ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)); `kit.json` isn't counted. In v1.7.0 the 12 KB were the fifth mode's content, which the start screen loads: mostly its 13 lessons and 5 decoys (`items.json`, about +7 KB compressed), then its strings, sources and checklist; its sprites added about 2 KB more to the first game screen.

**6. `--docs`.** Regenerates the summary (between `<!-- SUMMARY:START -->` and `<!-- SUMMARY:END -->`), the table, the flags and the references in `docs/01-safety-content.md` from `items.json` and `sources.json`. Without `--docs` the build only compares the file with what it would write, and warns if it is out of date (v1.6.0).

**7. The `start` line.** The build prints what the start screen recommends on today's Bangkok date, from the same `recommend()` the game uses (§25.2), for example `start     2026-10-18: prepare (warning until 2026-11-30) · featured health until 2026-11-15`. Since v1.9.0 it ends with the alert while it is on: `· alert landslide until 2026-10-25` (§29.5).

**Images** (`npm run images` → `tools/render-images.mjs` + `tools/render.html`): drawn with the game's own canvas code in headless Chromium. `-- --only <path>` keeps every other image as it is; since v1.9.0 it takes several comma-separated paths (`--only og/kit,og/en/kit`).

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

- **Install** precaches the 44 files and calls `skipWaiting()`. Since v1.9.1 it fetches them with `cache: 'no-cache'` (revalidate), not `'reload'`, so a first visit doesn't download the app twice (§30.7).
- **A page never visited, offline:** the navigation falls back to the cached `/`; since v1.9.1 the app then reads the path and opens that hazard's guide (`/quake`) or the tool (`/kit`, `/plan`), not the start screen (§30.7).
- **Activate** deletes old `brm-*` caches and claims open clients. If an old cache has no `/js/version.js` (a service worker from before v1.5.1, which served code cache-first), it also reloads open pages once.
- **Version guard** (v1.5.1): the build writes `js/version.js` (`APP_VERSION` from `package.json`). On boot, if it differs from `config.json → version`, `main.js` deletes the `brm-*` caches and reloads, once per version per tab (`sessionStorage brm:refresh`), so it can't loop offline.
- **Registration** happens after `load`. Boot checks `document.readyState`, so it also registers when boot runs late.
- **iOS in-app browsers** never run it. See [KNOWN_ISSUES #16](KNOWN_ISSUES.md#16-no-offline-play-inside-ios-in-app-browsers).

**localStorage** (prefix `brm:`, wrapped in try/catch) holds only:

- `howto-<mode>` (one per mode)
- `best`, `streak`, `plays`, `learned` (the safety book)
- `langPick` (since v1.9.1: the language the player chose with the button or `?lang=`; an older `lang`, stored on every visit, is ignored, §30.3), `muted`
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

- outbound links navigate in place, because `window.open` is often blocked. Elsewhere `openExternal()` opens a new tab with `window.open(href, '_blank')` and sets its `opener` to `null`; it never asks for `'noopener'`, which makes `window.open` return `null` and sent this tab away too until v1.9.1 (§30.2)
- images use `data:` URLs
- LINE gets `?openExternalBrowser=1`, which opens the phone's browser

**Cards** are drawn on a `<canvas>` by `cards.js`. `svgdraw.js` is a small SVG-to-canvas renderer: Path2D, groups, `use`, text and transforms. Drawing SVG through an `<img>` can taint the canvas in some browsers, blocking the PNG export (older Safari is one), and fonts and `use` render unreliably that way. So the renderer avoids it. Thai lines are wrapped with `Intl.Segmenter('th', {granularity: 'word'})`, because Thai writes no spaces between words. The segmenter returns punctuation as words of its own, so since v1.8.1 `tokens()` joins closing punctuation (`! ? , . : ; ) ] } % … ” ’`) and Thai ๆ and ฯ to the word before: no line starts with one ([GUIDELINES rule 60](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Since v1.9.1 it also joins the segments inside a `keepTogether` word (`keptSpans()`), so a card never breaks "กระ|จก" (§30.1).

## 9. Analytics and privacy

- **Cloudflare Web Analytics** (turned on in the dashboard, cookieless) counts page views, referrers, devices and Core Web Vitals.
- **Game events:**
  - `track(name, {mode, label, value})` queues events allowed by the allowlist.
  - `flush()` sends them with `sendBeacon` (falling back to `fetch` with keepalive) when the page is hidden, on `pagehide`, or after 20 queued events.
  - `POST /api/e` takes at most 4,096 bytes and 25 events, cleans every field to `[\w\-.:]` and writes one Analytics Engine data point per event: `indexes: [name]`, `blobs: [name, mode, label, lang]`, `doubles: [value]`.
- **Sampling:** `config.analytics.sampleRate` decides once per page load whether this player is counted. The SQL uses `SUM(_sample_interval)`, so totals stay correct.
- **Language in the numbers:** since 13 Oct 2026 every event carries the player's language (`th` or `en`, stored as `blob4`; [KNOWN_ISSUES F22](KNOWN_ISSUES.md#after-v122-13-oct-2026)). Cloudflare Web Analytics also counts `/en/…` paths separately from `/…` paths ([05-metrics.md](05-metrics.md)).
- **How a visit arrived:** `view` is labelled `direct`, `challenge`, `checklist` or, since v1.6.0, `link` (a `?mode=` link, with the mode; §25.3). A `/?open=kit` or `/?open=plan` arrival is a `direct` view plus `kit_open` or `plan_open` with the label `link` (§28.6), and a `/?open=guide` arrival a `direct` view plus `guide_open` (v1.9.0, §29.11).
- **The home check and plan card (v1.8.0)** add four events: `kit_open`, `kit_share` (the score in % as the value), `plan_share` and, since v1.8.1, `plan_open`. Their answers, ticks and typed text never leave the device; a smoke check reads every `/api/e` body to prove it (§28.5).
- **The guides (v1.9.0)** add `guide_open` and `print`, and labels on `checklist_open` (where the guide was opened from) (§29.11).
- **The calculators (v1.10.0)** add `tool_open` and `tool_share`, with the tool (`fridge` or `air`) as the mode: where it was opened from, or the share channel. No reading, time, answer or count of people is sent (§32.5). A `/?open=fridge` or `/?open=air` arrival is a `direct` view plus `tool_open` with the label `link`.
- **No IP, user agent, ID, cookie or location is stored.** Scores, the home check's answers, the plan card's text and, since v1.10.0, the fridge's start time and the dust tool's answers stay in `localStorage`. There is nothing to ask consent for under the PDPA. The About sheet says this in Thai and English.

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
| Unknown paths | With no top-level `404.html`, Pages serves `/` (SPA behaviour); with one, it serves that page with status 404. The build writes one since v1.9.1 (§30.5) | [serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) |

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
| 19 Oct 2026: the HTML served to browsers carries the Web Analytics beacon (`static.cloudflareinsights.com`), with no `Set-Cookie` | Web Analytics looks on; the owner confirms it in the dashboard ([ROADMAP L1](ROADMAP.md#l1-create-the-cloudflare-pages-project)) |
| 19 Oct 2026: every page also loads `/cdn-cgi/challenge-platform/scripts/jsd` (about 12 KB) | The zone's "JavaScript detections" (Security → Bots), not our code; the owner may switch it off if nothing needs it |
| Pages files are served with `max-age=0, must-revalidate` and an ETag (seen 19 Oct 2026) | A service worker that fetches with `cache: 'no-cache'` gets a 304 for what the page already loaded (§30.7) |

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
| `window.open(url, '_blank', 'noopener')` returns `null` by the HTML specification, even when the new tab opens | Never treat that `null` as "blocked"; open without the feature and set `opener = null` (v1.9.1, §30.2) | [HTML spec, window open steps](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window-open-steps) |
| Chromium breaks Thai lines with ICU's dictionary, which splits some compounds ("กระ\|จก"); `word-break: keep-all` has no effect on Thai there (tested on Chromium 141, 19 Oct 2026); an invisible joiner inside a word changes what the dictionary sees | Kept words go in a `white-space: nowrap` span instead (v1.9.1, §30.1). iOS uses its own dictionary, not tested **[unverified]** | tested in this repository |
| A history entry pushed with `history.pushState` makes the phone's back button fire `popstate` on the page instead of leaving it | An open sheet owns one entry, so Back closes it (v1.9.1, §30.2) | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) |
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
| 78% mobile, 74% Android, in-app browsers dominate | A light start screen (151 KB at launch, 188 KB in v1.6.0, 200 KB with five modes in v1.7.0, 208 KB counting the home check's lazy code in v1.8.0, 232 KB with the guides and their sources in v1.9.0), no login, works in LINE/FB/TikTok with fallbacks, offline after the first visit |
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
| `/learn` | `items.json`, `rooms.json`, `sources.json`, `checklists.json`, `helplines.json`, `strings.json → seo` | 81 articles (one per item, ordered by mode then room) after a "By hazard" row of links (v1.6.0) and an index by topic (`#t-health` and so on), each with the correct action, tip, reason, the wet-house variant, and linked sources. The 21 partly verified items carry "⚠️ under review". After the checklists, since v1.8.1, links to the home check and the plan card. About 167 KB, 32 KB gzipped (v1.7.0). No script. |
| `/flood`, `/pm25`, `/fire` (v1.6.0), `/ready` (v1.7.0) | the same files, one hazard each | Since v1.9.1 its checklists first (with a jump row and the helplines above them), then only that hazard's lessons (43, 12, 13, 13), with ▶ play buttons to `/?mode=<id>`; `/ready` (v1.8.0) and `/flood` (v1.8.1) also link the home check and the plan card. No script. See §25.4 and §30.4. |
| `/landslide`, `/storm`, `/quake`, `/heat` (v1.9.0) | `checklists.json`, `sources.json` | The hazard's guide first, by phase, with the sources under every line, then the picture link, the tool links and the helplines. No script. See §29.9. |
| `/kit`, `/plan` (v1.9.0) | `kit.json`, `sources.json` | Every line of the home check or the plan card with its sources, and a button into the tool. JSON-LD `WebPage`. See §29.9. |
| `/llms.txt` | same, plus `seo.en.llmsSummary` | Markdown per [llmstxt.org](https://llmstxt.org). Since v1.9.0 a section per guide with no game, "What to do: …", lists each line with its source URLs. Since v1.8.1 one line names the two family tools and their links: "Two family tools that run on the device; nothing typed is sent: …/?open=kit · …/?open=plan". It's an informal proposal; **no major search engine is confirmed to use it [unverified]**. It costs nothing and is read by some AI tools. |
| `/sitemap.xml` | 28 addresses since v1.10.0 (24 in v1.9.0, 12 before): `/`, `/learn`, `/flood`, `/pm25`, `/fire`, `/ready`, `/landslide`, `/storm`, `/quake`, `/heat`, `/kit`, `/plan`, `/fridge`, `/air` and their `/en/` twins, with `seo.updated` as `lastmod` and `xhtml:link` language alternates | The `/c/*`, `/checklist/*` and `/en/c/*` share pages are left out on purpose: they are copies of the app shell. |
| `/robots.txt` | generated | `Allow: /`, `Disallow: /api/`, `Sitemap:`. Search and AI crawlers aren't blocked. |
| `<link rel="canonical">` and `hreflang` | the OG block, and the page template for `/learn` and the hazard pages | Each indexable page points at itself (`/`, `/learn`, `/pm25`, `/en/`, `/en/learn`, `/en/pm25` and so on); the 55 Thai challenge pages → `/` and the 55 English ones → `/en/`; since v1.9.1 the 9 checklist pages in each language → their hazard's page (`/checklist/quake` → `/quake`), with no `hreflang` (before: `/` and `/en/`). Each indexable page lists its twin with `hreflang` (§18). |
| JSON-LD on `/` and `/en/` | `og` / `ogEn` strings | `WebSite` and a `VideoGame`/`WebApplication` (free, 1 minute, Thai and English). Its `about` lists every hazard in Thai and English: floods, PM2.5 dust, house fire and power cuts (since v1.7.0; before, floods only), and since v1.9.0 flash floods and landslides, storms and lightning, earthquakes and extreme heat ([KNOWN_ISSUES #65](KNOWN_ISSUES.md#65-loose-ends-from-the-v190-sweep)). |
| JSON-LD on `/learn` and `/en/learn` | `sources.json` | `Article` with a `citation` list of the 69 source addresses actually used. |
| JSON-LD on the hazard pages | `sources.json` | `Article` whose `citation` lists the sources of that page's lessons (54 for floods, 4 for dust, 6 for fire, 10 for the power cut), and on a guide-only page (v1.9.0) the sources of its guide's lines. |
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
3. the player's earlier choice, stored only when they chose it (the language button or `?lang=`, under `brm:langPick` since v1.9.1; before, every visit to an English page was stored, §30.3), then
4. a first-visit guess (`guessLang`): **Thai** if any browser language is Thai **or** the device clock is on `Asia/Bangkok`; otherwise **English**.

The time-zone rule matters: many Thais set their phones to English, and the game's main audience must not be switched away from Thai. Whenever the language changes, the address bar switches between the Thai and English address (`langPath`, `history.replaceState`), so a copied link opens in the same language.

**Search signals**

- `hreflang` links on `/`, `/en/`, `/learn`, `/en/learn` and the hazard pages: `th`, `en`, and `x-default` → English (for people whose language is neither). The checklist pages had them too until v1.9.1, when they lost them and point their canonical at the hazard page (§30.5).
- `sitemap.xml` lists the twelve indexable pages (`/`, `/learn` and the four hazard pages, in both languages), each with its `xhtml:link` alternates, as Google documents for multilingual sites.
- Separate JSON-LD for the English pages (`inLanguage: en`, English description).
- The English challenge pages' canonical is `/en/`; the Thai ones' is `/`. The checklist pages' canonical is their hazard's page (`/quake`, `/en/flood`) since v1.9.1.

**Social previews**

- `og:locale` (`th_TH` or `en_US`) plus `og:locale:alternate`, and `twitter:image:alt` on every page.
- 61 English preview images in `public/og/en/` (default, 55 challenge scores, 5 checklists; v1.7.0), drawn by the same canvas code from `strings.json → ogEn`. The wordmark follows the language: Thai "บ้านรอดไหม?" or English "Baan Rod Mai?" (`strings.json → logoA/logoB`), on the start screen, the result card, the checklist image and every preview image; the canvas shrinks it to fit. The English default image reads *"Will the house survive? A 60-second home-safety game"* under it; the Thai one lists "น้ำท่วม · ฝุ่น · ไฟไหม้ · ไฟดับ" (v1.7.0).
- English share texts carry `#BaanRodMai #FloodSafety`; the Thai ones keep `#บ้านรอดไหม`.

**One English: British.** The English text is British English: "torch", "power cut", "litres", "nappies", "colour". Agency names keep their own spelling (World Health Organization, Centers for Disease Control and Prevention), and a source's `note` quotes it as written. v1.7.0–1.8.0 had let the American pages behind the power-cut lessons bring in "flashlight", "power outage" and "Blackout"; v1.8.1 aligned them ([KNOWN_ISSUES F43](KNOWN_ISSUES.md#in-v181-19-oct-2026), [GUIDELINES rule 58](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). The JSON-LD `about` in `tools/build.mjs` still names "Power outage preparedness" for the power cut.

**Honesty for an international audience.** Most advice comes from Thai agencies, some from international guidance (marked ⚠️, §27.2), and the hotlines are Thai numbers. The English help sheet, `/en/learn`, the checklist preview and `llms.txt` say so and tell people outside Thailand to follow their local authorities and emergency number. Since v1.7.0 they no longer say *every* tip is from Thai agencies ([KNOWN_ISSUES F39](KNOWN_ISSUES.md#in-v170-19-oct-2026)), and since v1.8.0 neither does the English checklist preview ([F41](KNOWN_ISSUES.md#in-v180-19-oct-2026)). **No foreign numbers were added**, because none were verified.

**The wordmark.** The two-colour title is drawn from `strings.json → logoA/logoB` in the page, on the result card, on the checklist image and on every preview image (`cards.js → logo()`; the canvas shrinks it to fit when the English words are wider than the space). On the result card of the themes with a sun or moon at the top right (return, dust and the power cut, x 890–1030), the space is W − 440 (640 px) instead of W − 160, so "Baan Rod Mai?" stays clear of the circle; the Thai wordmark is drawn as before (v1.8.1). The static `/en/` page carries the English text, so it never flashes Thai.

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

**Language redirect (v1.3.1).** An inline script in `index.html` (not in a module, so it runs before anything is drawn) sends visitors on `/`, `/c/{p|r}N` and `/checklist/{prepare|return}` to the same path under `/en/` when: no `/en` in the path, no `?lang=`, nothing stored under `brm:lang` (since v1.9.1 `brm:langPick`, a choice the player made), the user agent doesn't match `isBot` (`content.js`; keep the two patterns identical), the browser has no Thai language, and the time zone isn't Asia/Bangkok. It uses `location.replace`, so the Back button doesn't bounce. `main.js` applies the same bot rule, so a bot that runs JavaScript also stays on Thai. The copy of the script inside `/en/index.html` exits at once.

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
| landslide, storm, quake, heat (v1.9.0) | same as the id | `/landslide` … | `/en/landslide` … | none: a guide (§29.9) | 10 guide lines each | none | `og/checklist-<id>.png` |

- **Generated** by `tools/build.mjs` into `public/<slug>.html` and `public/en/<slug>.html`; never edit them by hand. Cloudflare Pages serves `/pm25` from `pm25.html` and redirects `/pm25.html` to `/pm25` with a 308, as it does for the challenge pages (§8).
- **Order on the page (v1.9.1):** the top links, the H1, a jump row to each checklist (`/flood`: ก่อนน้ำมา / หลังน้ำลด), "☎️ โทรฟรี" with 1784 · 199 · 1669 as `tel:` links, **the checklists** (as `h2`), the picture links, the intro, the ▶ play buttons, the "check before you go" link, the tool links, the date, the lessons by mode, the helplines, the "By hazard" row and the disclaimer. So the advice comes first and the game after ([KNOWN_ISSUES F63](KNOWN_ISSUES.md#in-v191-19-oct-2026), §30.4). The titles name no count since v1.9.1 ("…เช็กลิสต์พร้อมที่มา · บ้านรอดไหม?"), because the preview picture says "10 ข้อ".
- **Order on the page until v1.9.0:** the top links (the game, all lessons, the other language), the H1, the ▶ play button to `/?mode=<id>` (`seo.playMode`, with the mode's name and round length; one per mode, so two on `/flood`), the intro (the English pages add that the advice and helplines are Thai), the "check before you go" link, the links to the home check and the plan card for a hazard with `tools` (`/ready` since v1.8.0, `/flood` since v1.8.1), the date updated, the lessons by mode, the hazard's checklists, the helplines, the play buttons again, the "อ่านตามภัย / By hazard" row (this page marked with `aria-current`), and the disclaimer.
- **Search signals:** a canonical link to itself, `hreflang` th / en / x-default, `og:url`, the preview image of the hazard's first mode's checklist (`/og/` or `/og/en/`; no new images), and `Article` JSON-LD whose `citation` lists the sources of its lessons. Both languages are in the sitemap and `llms.txt`, and `/learn` and `/en/learn` link them from the same "By hazard" row.
- **Slugs** live in `config.json → hazards`. The build stops unless each one is lowercase letters, digits or "-", is unique, isn't a reserved site path (`c`, `checklist`, `en`, `learn`, `api`, `js`, `css`, `content`, `art`, `fonts`, `icons`, `og`, `share`, `index`, `sw`, `robots`, `sitemap`, `llms`, `manifest`, `posts` and, since v1.9.0, `kit` and `plan`) and doesn't match an existing `public/<slug>`; every hazard in the registry needs one. A slug must never change once published, because shared links and search results point at it.
- **Strings** in `seo.th` and `seo.en`: `byHazard`, `allLessons`, `playMode`, and `hazard<Flood|Dust|Fire|Outage><Nav|Title|Desc|H1|Intro>`. The build stops when one is missing. The text is a draft for the language check ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)). It adds no advice or numbers, and the descriptions name no agencies, so it can't drift from the lessons. The `/ready` intro says that several lessons come from international guidance and are marked.
- **One template.** `/learn`, `/en/learn` and the hazard pages (eight until v1.8.1, sixteen since v1.9.0, with `/kit` and `/plan` too) come from one `seoPage()` function. The old `/learn` template was replaced first, and its output checked byte-identical (`git diff --quiet`) before the hazard pages were added.
- **Tap targets:** the helpline `tel:` links (28–38 px wide on `/learn` before v1.6.0) and the source links have `min-width: 44px`; the top links, the check link and the chips are 44 px tall. A smoke check measures every control on all these pages at 320 × 460 (ten since v1.7.0); since v1.9.1 it checks that each hazard page's helplines and first checklist line are on the first screen and that no game button comes before the list (before: that the play button was on the first screen).

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
| Torches, not candles; never leave a candle burning | US Fire Administration, "Candle Fire Safety", reviewed 1 Apr 2023 (`usfa-candle`); Ready.gov | ⚠️ international only (`s-candle`) |
| Spare batteries with the torch, a torch for everyone | ปภ.'s 6-item kit (`ddpm-6kit`); Ready.gov | ✅ (`s-torch`) |
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
| | `s-candle` a candle left burning | Blow it out, use a torch (leave it; light another) |
| | `s-torch` a torch with flat batteries | Spare batteries with it, one for everyone (phone lights) |
| | `s-radio` a battery radio | Turn it on for official news (go by the chat groups) |
| | `s-powerbank` one bar left | Charge everything now (when the power's back) |
| | `s-plugs` TV and computer plugged in | Unplug against a surge (leave them in) |
| Front | `s-generator` a generator under the window | Move it into the open, away from doors and windows (open the window; bring it inside) |

- **Topics:** 💧 `food` 6, 🎒 `plan` 3, ⚡ `power` 2, 🦠 `health` 1 (`s-medcold`), 🔥 `fire` 1 (`s-candle`). The mode's own topic is `food`. Across the game the topics now hold: home 12, power 11, health 11, plan 9, food 10, critters 4, air 10, fire 14.
- **Decoys:** a closed rice bin, a battery wall clock, books on the shelf, a potted plant, dishes in the sink.
- **The family** appears as in the other modes (grandma's medicine that must stay cold), and the gecko carries a torch: "ไฟดับแล้ว! ดูตู้เย็นก่อนเลย", "มืดแล้ว ไฟฉายอยู่ไหนนะ".
- **Ranks:** มือใหม่หัดตุนของ → ผู้จัดการคลังบ้าน → บ้านนี้พร้อมทุกไฟดับ (English "Rookie Stocker → Home Store Manager → Ready for Any Power Cut"; the last was "Ready for Any Blackout" before v1.8.1). **Endings:** "บ้านรอด! ไฟดับทั้งคืนก็อยู่สบาย ของพร้อมครบ 💙" (10/10) down to "คืนนี้ลำบากหน่อย แต่ตอนนี้รู้แล้วว่าต้องตุนอะไร" (0–4).

### 27.6 The house rule

`generateHouse()` takes one item with `lostAfter` first in a mode whose threat is `dark` (§4, step 3), so every power-cut house has something that goes bad and the story hours always matter. Today that item is always `s-fridge`. A unit test checks a year of power-cut houses for it. The rule looks at the threat, not the mode id, so a later `dark` mode gets it too, and no other mode's houses change.

### 27.7 The checklist

`checklists.json → stock`, "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" / "10 things for a 3-day power cut", at `/checklist/stock`:

1. 💧 drinking water, 3 L per person per day, for 3 days
2. 🥫 dry and canned food for at least 3 days; eat it and restock
3. 🔧 a manual can opener, kept with the food
4. 🔦 a torch for everyone, with spare batteries
5. 📻 a battery radio for official news
6. 🔋 phones and power banks kept charged
7. 💊 at least 7 days of daily medicine (MOPH, `moph-7days`); a plan for cold medicine
8. 🧊 keep the fridge shut: about 4 hours for fresh food
9. 🔌 unplug appliances against surges
10. ⚠️ generators outdoors only; torches, not candles

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

v1.8.1 (19 Oct 2026, ROADMAP N16) renamed the English title "How ready is our home?", named floods next to power cuts in the check's intro and share text, linked both tools from `/flood`, `/learn` and `llms.txt` and from the installed app's shortcuts, put the 🎒 button on the flood results, counts the plan form's opens (`plan_open`), and draws every field on the plan card. Houses and challenge links are still the same.

v1.9.0 (19 Oct 2026, §29) moved both tools into the start screen's hub ("🎒 เช็กของจำเป็น", which shows the saved score as "บ้านเราพร้อม 64%", and "📝 แผนครอบครัว"), gave them their own pages, `/kit` and `/plan`, with their own previews, which the two cards now print and link instead of `/?open=kit` and `/?open=plan`, and added "🖨️ พิมพ์เก็บไว้" to the check's list (§29.10).

### 28.1 Why

The power cut (§27) teaches what to stock, one lesson at a time, in a house that isn't the player's. A family then has to turn "3 L per person per day for 3 days" into its own number and find out what it is still missing. The check does that sum for the household and keeps the ticks, and its card is something to send to the family group, with the text "บ้านเราพร้อมแล้ว 56% ถ้าน้ำท่วมหรือไฟดับ 3 วัน 🎒 แล้วบ้านคุณล่ะ?" (v1.8.1; it said "พร้อมรับมือไฟดับ" before). The same 3-day amounts are in the flood lessons' Thai sources (กรมประชาสัมพันธ์'s 72-hour list, ปภ.), so since v1.8.1 the check names floods as well as power cuts. The plan card does the same for the flood lessons about who does what (`p-plan`: older and bedridden people first; `p-poster`: the way to the shelter): the family writes its own answers and keeps them on every phone.

### 28.2 The flow

**The home check** (`openKit()` in `kit.js`):

1. **Questions** (first time, or after "แก้คำตอบ"), under the intro "ตอบ 2 ข้อ แล้วดูว่าบ้านเราควรมีอะไรบ้าง ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน" ("Answer 2 questions and see what your home needs for a flood, a power cut or 3 days indoors"): "บ้านเรามีกี่คน?" with a − / + stepper (1–10, 3 to start; the buttons are 52 px circles) and "ในบ้านมีใครบ้าง? (เลือกได้หลายข้อ)" with four answers: 👶 มีเด็กเล็ก, 🧓 มีผู้สูงอายุ หรือผู้ป่วยติดเตียง, 💊 มีคนกินยาประจำ, 🐾 มีสัตว์เลี้ยง, in a grid whose columns are at least 150 px wide, so on phones under about 360 px they stack in one column and the Thai labels don't break mid-word (v1.8.1; at 140 px "มีเด็ก|เล็ก" broke). Under them: "🔒 คำตอบอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน".
2. **The list** ("ดูรายการของบ้านเรา"): "บ้าน 3 คน · แก้คำตอบ", a meter and "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)", then one row per thing: a checkbox, the icon, the label, the amount for this household where there is one, and "ที่มา: <agencies>" with "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on `partial` items ([17-kit.png](screens/17-kit.png)). Agencies come from `sources.json`, with their English names on `/en/` (`seo.en.agencies`). A tick updates the meter and is saved at once.
3. **Share** ("📤 แชร์ผลของบ้านเรา"): draws the kit card (§28.7) and opens a share sheet like the game's: native share where the browser has it, LINE, Facebook, copy, and save where downloads work (otherwise the long-press hint). There is no X button. The text is "บ้านเราพร้อมแล้ว {pct}% ถ้าน้ำท่วมหรือไฟดับ 3 วัน 🎒 แล้วบ้านคุณล่ะ? เช็กฟรี 1 นาที 👉 {url} #บ้านรอดไหม" (English "Our home is {pct}% ready for 3 days of flood or power cut 🎒 How about yours? Free 1-minute check 👉 {url} #BaanRodMai"; before v1.8.1 both named only the power cut).
4. "📝 ทำแผนบ้านรอดของบ้านเรา" opens the plan card, with "← กลับไปที่รายการ" back to the list.

A returning visitor goes straight to the list with their answers and ticks. If they change the answers so a thing no longer applies (no more pets), its tick is dropped.

**The plan card** (`openPlan()`): a form of six fields (§28.4), each with its label, an example, and a hint with its agencies where there is one; "🔒 ข้อความอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น" above them. "สร้างการ์ดแผนบ้านรอด" needs at least one field ("กรอกอย่างน้อย 1 ช่องก่อนนะ") and draws the card ([18-plan-card.png](screens/18-plan-card.png)); its share text is "แผนบ้านรอดของบ้านเรา 📝 เซฟไว้ในมือถือทุกคนนะ ทำของบ้านคุณได้ที่ 👉 {url} #บ้านรอดไหม". The share sheet's back button, "← แก้แผน" / "← Edit the plan" (`ui.backPlan`, v1.8.1; it said "← กลับไปที่รายการ" before), returns to the form with what was typed.

**Ways in:**

| From | What | Label (`kit_open` for the check, `plan_open` for the plan) |
|---|---|---|
| The start screen | Until v1.8.1 the quick button 🎒 "บ้านพร้อมไหม?" ("บ้านพร้อม {pct}%" once checked). Since v1.9.0 the hub's "🎒 เช็กของจำเป็น" (`data-open="kit"`; its sub-label `#kit-chip` reads "บ้านเราพร้อม {pct}%" from `brm:kit`) and "📝 แผนครอบครัว" (`data-open="plan"`) (§29.6) | `start` |
| A result screen | "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" (`#btn-kit`) when the mode's hazard lists `kit` in `config.json → hazards.<hazard>.tools`: prepare, return and the power cut, not dust or fire (v1.8.1; before, any mode whose threat is `dark`, so only the power cut) | `result` |
| A link | `/?open=kit` and `/?open=plan` (`/en/…` in English), read in `boot()` | `link` |
| `/ready`, `/flood` and their English twins | "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน (ฟรี 1 นาที)" and "📝 ทำการ์ดแผนบ้านรอดของบ้านเรา", from `config.json → hazards.<hazard>.tools` (`outage` since v1.8.0, `flood` since v1.8.1) and `seo.<lang>.toolKit` / `toolPlan` | `link` |
| `/learn`, `/en/learn` (v1.8.1) | The same two links, after the checklists (every tool any hazard lists) | `link` |
| `llms.txt` (v1.8.1) | One line with both links, for AI assistants | `link` |
| The installed app (v1.8.1) | A long-press on the home-screen icon: "บ้านเราพร้อมแค่ไหน?" (short "เช็กบ้าน") → `/?open=kit&source=pwa` and "แผนบ้านรอดของบ้านเรา" (short "แผนบ้าน") → `/?open=plan&source=pwa`, from `manifest.webmanifest → shortcuts` (both with the 192 px icon). The game doesn't read `source`, so these count like any link | `link` |
| The check's list | "📝 ทำแผนบ้านรอดของบ้านเรา" | `kit` (`plan_open`) |
| The plan form's back button | "← กลับไปที่รายการ", back to the list (only when the plan was opened from it) | `plan` (`kit_open`) |

- **The shortcuts** appear only once the game is installed (added to the home screen), and only in browsers that support manifest shortcuts. Which phones show them, and whether iPhones do at all, has not been tried **[unverified]** ([ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix), row 49). The manifest has one language, so the shortcuts' names are Thai on an English install too; the page then picks its language as for any link to `/` (§18).

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

- **Where the numbers come from:** the 3 L per person per day is in the title of กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`); 3 days are its 72 hours and the shared floor of ปภ.'s 3–4 days (`ddpm-amarin`), กรมอนามัย's 3–5 days (`anamai-stock`) and the MOPH's "at least 3 days" (`moph-7days`); 7 days of daily medicine are the MOPH's (`moph-7days`, a 2013 statement); a torch for every household member is Ready.gov's (`readygov-outage`, "Have flashlights for every household member"). The same numbers are in the power-cut lessons (§27.2) and its checklist (§27.7).
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
- **Proved by a test.** The smoke check types "PRIVATE-MEETING-PLACE" and "PRIVATE 081-234-5678" into the plan, makes and shares the card, fires `pagehide`, and fails if any `/api/e` body contains "PRIVATE" or "081-234", or if `kit_open`, `kit_share`, `plan_open` (v1.8.1) or `plan_share` is missing.
- **Less to leak.** Six short fields with a `maxlength` (40, or 60 for medicine), `autocomplete="off"`, and the line "อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น" on the form. The examples are a place, a name with a pattern number, and "Dad takes Grandma".
- **Said where people read it.** The About sheet's privacy text (th/en) names the home check's answers and the plan card's text among what stays on the device.
- **The limits** (one browser, cleared with site data, LINE's in-app browser separate from the phone's browser): [KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser).

### 28.6 Analytics events

| Event | When | mode | label | value |
|---|---|---|---|---|
| `kit_open` | The home check opens | – | `start` / `result` / `link` / `plan` (§28.2) | – |
| `kit_share` | A channel in the check's share sheet is tapped | – | `native` / `line` / `facebook` / `copy` / `save` | the score, 0–100 |
| `plan_open` (v1.8.1) | The plan form opens | – | `link` / `kit` (§28.2) / `start` (the hub, v1.9.0) | – |
| `plan_share` | A channel in the plan card's share sheet is tapped | – | `native` / `line` / `facebook` / `copy` / `save` | 0 |

- **`plan_open` counts arrivals at the form.** "← แก้แผน" in the card's share sheet reopens the form without sending it again (`openPlan(from, true)`); the check's list button and the plan form's back button still send one event each way. `kit_open` from a result carries the mode (`prepare`, `return`, `stock`). Before v1.8.1 opening the plan sent nothing, so a `/?open=plan` arrival showed only as a `direct` view.
- **No answer or typed text** is in any of them (§28.5). The queries are in [05-metrics](05-metrics.md#the-home-check-and-the-plan-card-v180).

### 28.7 The two cards (1080 × 1350)

Both are drawn in `kit.js` with the card helpers `cards.js` exports as `kit` (here `draw`), in the power cut's `stock` theme.

- **The kit card** (`drawKitCard`): the blue-violet background and waves; the wordmark at the top, kept clear of the moon; the title "บ้านเราพร้อมแค่ไหน?"; a score ring (radius 160, a grey track and the game's blue "correct" colour from the top, clockwise) with the percentage in 120 px; the gecko with a torch on the left, cheering from 80 %, happy from 40 %, thinking below; "มีแล้ว 3 จาก 9 อย่าง"; "ยังขาด:" with up to three things (one line each) or "ครบทุกอย่างแล้ว!"; then "บ้านคุณพร้อมแค่ไหน? เช็กฟรี", the address `…/?open=kit` and the disclaimer on the waves.
- **The plan card** (`drawPlanCard`): a header band in the theme's colour with the wordmark, the title "แผนบ้านรอดของบ้านเรา", "ทำเมื่อ 19 ต.ค. 69" and the gecko; one white box per field, all six every time (label above, value below; since v1.8.1 an empty field gets a dotted line where its value would be, so the card has no gap and a printed copy can be filled in by hand; before, empty fields were left out and a card with two or three filled had a large empty space); a dark box with the helplines; "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน", the address `…/?open=plan` and the disclaimer.
  - **All rows fit.** The boxes share the space between y 320 and 1010. The code lays them out at full size with up to two lines per value, and while they don't fit it shrinks the whole block in steps of 6 % (never below 64 %); below 80 % each value keeps its first line only. Six one-line rows fit at 76 %, so every field is always on the card; a value too long for one line at that size would lose the rest of its text. The first version dropped the sixth row instead ([LESSONS D12](LESSONS_LEARNED.md#d-testing-and-verification)).
  - **Measured on 19 Oct 2026** with a one-off probe in headless Chromium: all six fields at their maximum length (40 characters, 60 for medicine), in Thai and in English, drew every row and every character; the English medicine line took two lines.

### 28.8 Build checks and tests

- **`tools/build.mjs`** stops on a `kit.json` item with no sources, an unknown source, a duplicate id, a `verify` other than `verified` or `partial`, or a `for` that isn't one of the answers; on a plan field whose `max` isn't 1–80, or whose hint has no or unknown sources; on any label, hint, example or interface text without Thai and English; on a `unit` without Thai; and on a hazard `tools` entry other than `kit` or `plan`, or one without its `seo.<lang>.tool<Kit|Plan>` string.
- **Numbers must be in the source.** Every whole number above 1 in `perPersonPerDay`, `perPerson` and `days` must appear, as a number on its own, in the title or `note` of one of the item's sources, so an amount can't be made up. It shows that the number is there, not what it means there: `days: 3` on the water passes on "3 ลิตร" as well as on "3–4 วัน", so a person still reads the source. `perPerson: 1` (a torch each) is not checked, since a 1 is in almost any text.
- **Unit test** "home check: amounts follow the household, special items follow the answers": 9, 27 and 90 litres for 1, 3 and 10 people; a torch each; food for 3 days; 0 and 99 people clamped to 1 and 10; each answer adds only its items; daily medicine 7 days; 0 % and 100 %; the card's missing list starts with everyday things.
- **Smoke section 11** (8 checks since v1.8.1, 360 × 640): 4 people with daily medicine → 36 litres, medicine listed, baby items not; answers and ticks in `brm:kit`; controls of the questions, list and plan form ≥ 44 px; the kit card at 1080 px with LINE on the first screen; the plan card renders; "← แก้แผน" goes back to the form with what was typed (v1.8.1); the typed text in no `/api/e` body and the four events present; no page errors.
- **Elsewhere in the smoke test (v1.8.1):** a Prepare result offers the 🎒 button (section 1); each hazard page with `tools` links them, and `/learn` and `llms.txt` link both tools (section 10).
- **Card text** (v1.8.1, not only the kit's cards): the unit test "card text: a wrapped line never starts with closing punctuation (every ending, both languages)".

### 28.9 Code and loading

- `kitplan.js` is pure (no DOM), so the unit test and tools import it in Node, like `house.js` and `modes.js`.
- `kit.js` holds the sheets, the cards and the share sheet. `main.js` loads it with `import('./kit.js')` only when the check or the plan opens (`openTool()`); `kit.js` fetches `kit.json` on first use. If the import fails (offline and not cached), the toast "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`) shows and nothing else changes.
- The start-screen chip's text is set by `main.js` from `brm:kit`, so the start screen never loads `kit.js`.
- The service worker precaches `kit.js`, `kitplan.js` and `kit.json` (44 files), and the build's budget counts the two scripts as start-screen weight ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)).
- Sizes on 19 Oct 2026 (gzip -9): `kit.js` 5.5 KB (17.2 KB raw), `kitplan.js` 0.8 KB, `kit.json` 4.3 KB (17.1 KB raw). With the calculators (v1.10.0): `kit.js` 11.0 KB, `kitplan.js` 1.9 KB, `kit.json` 9.1 KB (§32.9).

### 28.10 What was left out, and why

| Idea | Why it's not in the check |
|---|---|
| "Check your kit every 3–6 months" | No agency gives an interval (§27.3). The check shows no reminder date; it keeps the date of the last check in `brm:kit`. |
| A 7-day stock target | Tokyo's alone (§27.3). The check uses 3 days for water and food; 7 days appear only for daily medicine, from the MOPH. |
| "Eat the fridge, then the freezer, then cans" | No agency states the order (§27.3). |
| Amounts for food, pet food, baby supplies or cash | No source gives one that fits a Thai household; those lines carry no number. |
| Names, ages or phone numbers in the questions | Not needed for the list; the check asks only a count and four yes/no answers. The plan card's fields are free text kept on the device (§28.5). |

## 29. Tools first: a guide for every hazard (v1.9.0)

Built 18–19 Oct 2026 (ROADMAP N17). The start screen leads with three tools, every hazard has a short "what to do" guide, four of them for hazards the game doesn't cover, and the owner can put one guide on top while it is in the news. No item, room, slot or `houseVersion` changed, so houses and challenge links are the same.

### 29.1 Why tools first

The owner's direction on 19 Oct 2026, in their words: "We do not know which topics can hit now; prepare for all possibilities; some trends happen spontaneously. เตรียมบ้าน can be general for all catastrophes. People like to know what they should prepare or do. The game can be the option to make it more understandable or help them not read so much text. It should not force everyone to play the game; it is a tool to help them."

Until v1.8.1 the app was a game with tools beside it: the start screen led with the mode cards, the checklists were a quick button, and a hazard without a game mode had nothing to offer. When an earthquake, a storm or a heatwave is in the news, people search for what to do now, not for a game. So v1.9.0 turns the order round:

- **What to do comes first,** for any hazard, in a minute of reading: 10 lines, by phase, each with its source.
- **What to keep and who does what** (the home check and the plan card of v1.8.0, §28) sit next to it, because they are the same for every hazard.
- **The game is the optional way to remember** ("🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน"): it stays for the five hazards it covers, and a guide with a game offers "▶ เล่นเกมเรื่องนี้ 60 วิ".
- **The owner can follow the news** without a code change: the alert switch (§29.5) and the guides' pictures and captions on `/posts` ([04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook)).

### 29.2 The data model: guides, phases, sources, verify

**`config.json → guides`** lists the guides in the order the app shows them, each `{id, hazard, icon}`, and since v1.9.2 an optional `prop` for the gecko on the picture of a guide with no game (§31.4):

| Order | Id | Icon | Hazard | Name (`guide<Id>`, th / en) | Game | Page |
|---|---|---|---|---|---|---|
| 1 | `prepare` | 🌊 | flood | น้ำท่วม: ก่อนน้ำมา / Flood: before it comes (v1.9.1; was น้ำกำลังมา / A flood is coming) | ก่อนน้ำมา | `/flood` |
| 2 | `return` | 🧹 | flood | น้ำท่วม: หลังน้ำลด / Flood: after it goes down (v1.9.1; was หลังน้ำลด / After a flood, 4th) | หลังน้ำลด | `/flood` |
| 3 | `landslide` | ⛰️ | landslide | น้ำป่า ดินถล่ม / Flash floods and landslides | — | `/landslide` |
| 4 | `storm` | ⛈️ | storm | พายุ ฟ้าผ่า / Storms and lightning | — | `/storm` |
| 5 | `quake` | 🏚️ | quake | แผ่นดินไหว / Earthquake | — | `/quake` |
| 6 | `fire` | 🔥 | fire | ไฟไหม้ / House fire | ไฟไหม้ | `/fire` |
| 7 | `stock` | 🔦 | outage | ไฟดับ / Power cut | ไฟดับ | `/ready` |
| 8 | `heat` | 🌡️ | heat | อากาศร้อนจัด / Extreme heat | — | `/heat` |
| 9 | `dust` | 😷 | dust | ฝุ่น PM2.5 / PM2.5 dust | ฝุ่น PM2.5 | `/pm25` |

- **A game mode's checklist is its guide.** `checklists.json → prepare`, `return`, `dust`, `fire` and `stock` are unchanged: 10 lines that sum up the mode's sourced lessons, with sprites for the picture, and no phases or sources of their own (the lessons carry them, §27.7).
- **A guide with no game** (`landslide`, `storm`, `quake`, `heat`) has no lessons behind it, so each line carries its own evidence: `{icon, th, en, phase, sources[], verify, verifyNote?}`. `phase` is `before`, `during` or `after` (shown as "ก่อนเกิด", "ขณะเกิด", "หลังเกิด"); `verify` is `verified` or `partial`, and a `partial` line has a `verifyNote` that says which part is unconfirmed and why. These guides have no sprites, so their picture uses the plain layout (§29.9).
- **`config.json → hazards`** gains `landslide`, `storm`, `quake` and `heat`, each with a slug (the same word) and `tools: ["kit", "plan"]`. Since v1.9.0 a hazard needs a mode **or** a guide.
- **Build checks** (`tools/build.mjs`): a guide is listed once, its hazard exists, it has an icon, `strings.<lang>.guide<Id>` and `og`/`ogEn.checklistTitle<Id>`, and a checklist; every checklist is a guide; a guide that is a mode has the mode's hazard. A guide with no game has exactly 10 lines, phases in order (before → during → after), at least one source per line, all of them in `sources.json`, a valid `verify` and, when `partial`, a `verifyNote`; a Thai line over 48 characters is a warning (about 45 fit two lines on the 1080 × 1920 picture). The unit test "guides with no game: 10 lines, before → during → after, a source on every line" checks the same from the shipped files.

### 29.3 The four new guides and their sources

Researched in parallel on 18–19 Oct 2026, one hazard per researcher with the same strict brief: Thai agencies first, cross-checked with international guidance; every line traced to a page actually read, with the sentence quoted in the source's `note`; anything sources disagree on left out and recorded; a line whose core rests on one foreign agency, or whose detail is an inference, marked ⚠️ with the reason. Each line was then read again as an editor against its sources before it went in. Agency sites refuse automated readers ([KNOWN_ISSUES #9](KNOWN_ISSUES.md#9-agency-websites-blocked-automated-checks)), so most Thai agencies were read through Thai news reports that quote them (`kind: secondary`); [#60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies) is the open review.

**Totals:** 40 lines, 35 ✅ and 5 ⚠️, citing 40 sources: the 36 added in v1.9.0 (27 `secondary`, 1 `official`, 8 `international`) and 4 already in `sources.json` (`tmd-warn`, `pea-1348`, `pea-service`, `mea-1130`, for the storm guide's warnings and fallen-line helplines).

**น้ำป่า ดินถล่ม** (`landslide`, "น้ำป่า ดินถล่ม ทำอะไร 10 ข้อ" / "Flash floods and landslides: 10 steps"), 7 ✅, 3 ⚠️:

| # | Phase | Line (th / en) | Sources | |
|---|---|---|---|---|
| 1 | before | ดูว่าบ้านติดเขาหรือลำห้วยที่เสี่ยงดินถล่มไหม / Check if your home is by a slope or stream at risk | `dmr-riskvillage-2565`, `dwr-ews-2569` | ⚠️ DMR describes a risk village (2022) but no text read says "check your own home" |
| 2 | before | ติดตามคำเตือนในแอป THA DISASTER ALERT / Follow warnings on the THA DISASTER ALERT app | `ddpm-app-2569`, `dmr-signs-2568`, `dwr-ews-2569` | ✅ |
| 3 | before | รู้สัญญาณเตือนหมู่บ้าน และจุดปลอดภัยที่นัดไว้ / Know your village's warning signal and agreed safe spot | `dmr-riskvillage-2565` | ✅ |
| 4 | before | วางแผนเส้นทางอพยพไปจุดปลอดภัยไว้ก่อน / Plan your evacuation route to the safe spot in advance | `dwr-ews-2569` | ✅ |
| 5 | before | เตรียมแผนดูแลเด็ก ผู้สูงอายุ ผู้ป่วยติดเตียง / Plan how you'll help children, older and bedridden people | `ddpm-mhs-2569`, `ddpm-nan-2568` | ✅ |
| 6 | during | ฝนตกหนักต่อเนื่อง เตรียมพร้อมอพยพไปที่ปลอดภัย / Heavy rain that won't stop? Get ready to evacuate | `dmr-watch-2567`, `dmr-rain-2568` | ✅ |
| 7 | during | น้ำห้วยขุ่นข้น เสียงดังผิดปกติ รีบอพยพทันที / Stream turns muddy or a loud odd noise? Leave at once | `dmr-signs-2568`, `dmr-riskvillage-2565`, `dmr-rain-2568` | ✅ |
| 8 | during | ดินเริ่มมีรอยแยก รีบอพยพไปที่ปลอดภัยทันที / Ground starting to crack? Move to a safe place at once | `dmr-signs-2568`, `readygov-landslide` | ✅ |
| 9 | during | อย่าข้ามทางที่มีน้ำหรือโคลนไหลผ่าน / Never cross a road with water or mud flowing over it | `readygov-landslide` | ⚠️ Ready.gov only; no Thai text on crossing flowing water could be read |
| 10 | after | อยู่ห่างจุดดินถล่ม จนเจ้าหน้าที่บอกว่าปลอดภัย / Keep away from the slide until officials say it's safe | `readygov-landslide`, `ddpm-app-2569` | ⚠️ "more slides may follow" is Ready.gov's; ปภ. says only "follow official instructions" and closes risk sites |

**พายุ ลมแรง ฟ้าผ่า** (`storm`, "รับมือพายุ ลมแรง ฟ้าผ่า 10 ข้อ" / "Storms, wind and lightning: 10 steps"), 9 ✅, 1 ⚠️:

| # | Phase | Line (th / en) | Sources | |
|---|---|---|---|---|
| 1 | before | ติดตามประกาศเตือนภัยของกรมอุตุฯ และทำตาม / Follow Met Department storm warnings and act on them | `ddpm-storm6`, `tmd-warn`, `tmd-storm-2566`, `mea-storm-2565`, `readygov-storm` | ✅ |
| 2 | before | ตรวจหลังคา ประตู หน้าต่าง ให้มั่นคงแข็งแรง / Check the roof, doors and windows are secure | `ddpm-storm6`, `ddpm-storm-home`, `ddpm-storm-2561` | ✅ |
| 3 | before | เก็บของที่ลมพัดปลิวได้ไว้ในที่มิดชิด / Put away anything the wind could blow about | `ddpm-storm-home`, `ddpm-storm-2561` | ✅ |
| 4 | before | ตัดแต่งกิ่งไม้ใหญ่ใกล้บ้านที่เสี่ยงหักโค่น / Trim weak branches on big trees near the house | `ddpm-storm-home`, `ddpm-storm6`, `mea-storm-2565`, `readygov-storm` | ✅ |
| 5 | during | อยู่ในอาคารแข็งแรง ปิดประตูหน้าต่างให้มิดชิด / Stay in a sturdy building with doors and windows shut | `ddpm-storm6`, `ddc-rainy-lightning`, `readygov-storm`, `nws-lightning-outdoors` | ✅ |
| 6 | during | ไม่หลบใต้ต้นไม้ใหญ่ ป้ายโฆษณา หรือเสาไฟฟ้า / Don't shelter under big trees, billboards or power poles | `ddpm-storm6`, `tmd-storm-2566`, `ddc-rainy-lightning`, `mea-storm-2568`, `nws-lightning-outdoors` | ✅ |
| 7 | during | ฟ้าคะนอง อย่าอยู่บนดาดฟ้า ระเบียง หรือที่โล่ง / In lightning, keep off rooftops, balconies and open ground | `ddpm-storm6`, `ddpm-storm-2561`, `ddc-rainy-lightning`, `nws-lightning-indoors`, `nws-lightning-outdoors` | ✅ |
| 8 | during | ฟ้าคะนอง งดใช้เครื่องใช้ไฟฟ้าที่เสียบปลั๊ก / In lightning, don't use anything plugged into the mains | `ddpm-storm6`, `ddpm-storm-2561`, `readygov-storm`, `nws-lightning-indoors` | ✅ |
| 9 | after | สายไฟขาด เสาล้ม อย่าเข้าใกล้ แจ้ง 1130/1129 / Keep away from fallen lines or poles; call 1130 or 1129 | `pea-storm-2569`, `pea-1348`, `pea-service`, `mea-storm-2565`, `mea-1130`, `readygov-storm` | ✅ |
| 10 | after | หลังพายุ ตรวจอุปกรณ์ไฟฟ้า ถ้าชำรุดรีบซ่อม / After the storm, check electrics and repair any damage | `mea-storm-2565`, `mea-storm-2568` | ⚠️ กฟน. gives it as storm-season advice; "after the storm" is ours. No source read says to inspect the roof afterwards, so the roof is left out |

Line 8 says "don't **use**" what is plugged in, which ปภ., Ready.gov and the US NWS all say; it doesn't say "unplug", where they disagree (§29.4).

**แผ่นดินไหว** (`quake`, "แผ่นดินไหว ทำอะไร 10 ข้อ" / "Earthquake: 10 things to do"), 9 ✅, 1 ⚠️:

| # | Phase | Line (th / en) | Sources | |
|---|---|---|---|---|
| 1 | before | ยึดเครื่องใช้หนักๆ ให้แน่นกับผนังหรือพื้น / Fix heavy appliances firmly to the wall or floor | `dmr-quake-2568`, `readygov-quake` | ✅ |
| 2 | before | ไม่วางของหนักไว้บนชั้นหรือหิ้งสูง / Keep heavy things off high shelves and ledges | `dmr-quake-2568` | ✅ |
| 3 | before | เตรียมไฟฉาย ถ่านสำรอง และกระเป๋ายาไว้ในบ้าน / Keep a torch, spare batteries and a first-aid kit at home | `dmr-quake-2568`, `doh-quake-2566`, `readygov-quake` | ✅ |
| 4 | during | หมอบ ป้อง เกาะ ใต้โต๊ะหรือจุดที่แข็งแรง / Drop, cover and hold on under a sturdy table | `ddpm-quake-2568`, `ddpm-quake-2562`, `readygov-quake` | ✅ |
| 5 | during | อยู่ห่างประตูและหน้าต่างที่เป็นกระจก / Keep away from glass doors and windows | `ddpm-quake-2562`, `doh-quake-2566`, `dmr-quake-2568`, `readygov-quake` | ✅ |
| 6 | during | ริมทะเล: ไหวหรือน้ำลดฉับพลัน รีบไปที่สูง / By the sea: a quake or a sudden ebb? Go to high ground | `dmr-quake-2568`, `tmd-tsunami`, `readygov-quake` | ⚠️ DMR: move away from the shore in a quake. The sudden ebb as a signal is read from TMD's paper, which describes the sea pulling back before the wave: an inference. Fully verified fallback in the `verifyNote`: "อยู่ชายหาดแล้วแผ่นดินไหว รีบออกห่างฝั่ง" |
| 7 | after | ออกจากตึกทางบันไดหนีไฟ ห้ามใช้ลิฟต์ / Leave by the fire stairs, never the lift | `dmr-quake-2568`, `ddpm-quake-2562`, `doh-quake-2566` | ✅ (no timing: §29.4) |
| 8 | after | อย่าเพิ่งกลับเข้าตึก รอตรวจหรือรอคำสั่งทางการ / Don't rush back in; wait for a check or official word | `ddpm-quake-2568`, `ddpm-quake-2562` | ✅ |
| 9 | after | ได้กลิ่นแก๊ส ปิดวาล์วถัง เปิดประตูหน้าต่าง / Smell gas? Shut the cylinder valve, open doors and windows | `dmr-quake-2568` | ✅ |
| 10 | after | สวมรองเท้าหุ้มส้น กันเศษแก้วและของมีคม / Wear closed shoes against broken glass and debris | `dmr-quake-2568` | ✅ |

**อากาศร้อนจัด** (`heat`, "อากาศร้อนจัด ดูแลกันได้ 10 ข้อ" / "Extreme heat: 10 ways to look after each other"), 10 ✅:

| # | Phase | Line (th / en) | Sources | |
|---|---|---|---|---|
| 1 | before | ดูแลผู้สูงวัย เด็กเล็ก คนท้อง คนมีโรคประจำตัว / Look after elders, young children, pregnant women, the ill | `ddc-heatstroke-2568`, `ddc-heatstroke-pptv-2568`, `doh-heatstroke-2566`, `who-heat`, `readygov-heat`, `cdc-heat-about` | ✅ |
| 2 | before | ติดตามข่าวเตือนภัยความร้อนและค่าดัชนีความร้อน / Follow heat warnings and the heat index | `bma-heatindex-2569`, `tmd-heatindex-posttoday-2567` | ✅ |
| 3 | before | วางน้ำใกล้ผู้สูงวัย ชวนจิบบ่อย ไม่รอให้กระหาย / Keep water by elders; have them sip before they feel thirsty | `doh-elders-water-2565`, `tmd-heatindex-posttoday-2567`, `ddc-heatstroke-2568` | ✅ |
| 4 | before | จัดห้องที่เย็น อากาศถ่ายเท ให้ผู้สูงวัยพัก / Set up a cool, airy room for elders to rest in | `doh-elders-water-2565`, `ddc-heatstroke-2568`, `doh-heatstroke-2566`, `who-heat` | ✅ |
| 5 | during | ใส่เสื้อผ้าสีอ่อน หลวม ระบายความร้อนได้ดี / Wear light-coloured, loose clothes that breathe | `ddc-heatstroke-2568`, `ddc-heatstroke-pptv-2568`, `doh-elders-water-2565`, `readygov-heat` | ✅ |
| 6 | during | ย้ายกิจกรรมกลางแจ้งไปทำช่วงเช้าหรือเย็น / Move outdoor activity to the morning or evening | `doh-heatstroke-2566`, `ddc-heatstroke-2568`, `who-heat`, `readygov-heat` | ✅ |
| 7 | during | เลี่ยงเหล้า เบียร์ ในวันที่อากาศร้อนจัด / Avoid alcohol on very hot days | `ddc-heatstroke-2568`, `ddc-heatstroke-pptv-2568`, `doh-elders-water-2565`, `cdc-heat-about` | ✅ |
| 8 | during | ห้ามทิ้งเด็กหรือใครไว้ในรถที่จอดกลางแดด / Never leave a child, or anyone, in a car parked in the sun | `ddc-heatstroke-2568`, `ddc-heatstroke-pptv-2568`, `doh-heatstroke-2566`, `who-heat`, `readygov-heat` | ✅ |
| 9 | after | ตัวร้อนจัด เหงื่อไม่ออก สับสน รีบโทร 1669 / Very hot, not sweating, confused? Call 1669 at once | `doh-heatstroke-2566`, `ddc-heatstroke-2568`, `doh-elders-water-2565`, `readygov-heat` | ✅ |
| 10 | after | พาเข้าที่ร่ม คลายเสื้อ เช็ดตัวผ้าชุบน้ำเย็น / Into the shade, loosen clothes, wipe with a cool wet cloth | `ddc-heatstroke-2568`, `ddc-heatstroke-pptv-2568`, `doh-heat-illness-2569`, `readygov-heat` | ✅ |

In the heat guide "after" means once someone is unwell; on the page and in the sheet the heading still reads "หลังเกิด" / "After".

**The sources** (the `note` of each quotes what was read; dates are the article's where it shows one):

| Source | Agency | Kind, read via | Date | What it supports | Cited by |
|---|---|---|---|---|---|
| `dmr-signs-2568` | กรมทรัพยากรธรณี | secondary, Bangkok Biz News | — (refers to Sep 2025) | follow warnings; muddy stream, odd loud noise, cracking ground → evacuate at once | landslide #2, #7, #8 |
| `dmr-riskvillage-2565` | กรมทรัพยากรธรณี | secondary, Thansettakij | 2022-06-15 | what a risk village looks like; warning signs; village loudspeaker and agreed safe points | landslide #1, #3, #7 |
| `dmr-watch-2567` | กรมทรัพยากรธรณี | secondary, Thansettakij | 2024-09-19 | long continuous rain, muddy water; be ready to evacuate | landslide #6 |
| `dmr-rain-2568` | กรมทรัพยากรธรณี | secondary, Thai PBS | 2025-08-06 | follow rainfall; thick muddy water and floating debris as signs | landslide #6, #7 |
| `dwr-ews-2569` | กรมทรัพยากรน้ำ | secondary, Bangkok Biz News | — (2026) | the green / yellow / red warning levels: follow news, plan the evacuation route, move when told | landslide #1, #2, #4 |
| `ddpm-mhs-2569` | ปภ. | secondary, Bangkok Biz News | — (Sep 2026) | a plan for vulnerable household members | landslide #5 |
| `ddpm-nan-2568` | ปภ. | secondary, Thansettakij | 2025-06-27 | look after young children, older and bedridden people | landslide #5 |
| `ddpm-app-2569` | ปภ. | secondary, Naewna | 2026-05-28 | the THA DISASTER ALERT app; follow official instructions; risk sites closed | landslide #2, #10 |
| `readygov-landslide` | Ready.gov (FEMA) | international | — | cracking ground; never cross flowing water or mud; stay away from the slide | landslide #8, #9, #10 |
| `ddpm-storm6` | ปภ. | secondary, Bangkok Biz News | — | follow forecasts; a sturdy house; shut doors and windows; trim trees; off rooftops and open ground; no devices in lightning | storm #1, #2, #4–#8 |
| `ddpm-storm-home` | ปภ. | secondary, Bangkok Biz News | — | store what the wind can blow; sturdy doors, windows, roof; trim weak branches | storm #2, #3, #4 |
| `ddpm-storm-2561` | ปภ. | secondary, Thai Post | 2018-03-07 | the same storm checks; keep off rooftops and balconies; stop using electronics (its "unplug everything" is not used) | storm #2, #3, #7, #8 |
| `tmd-storm-2566` | กรมอุตุนิยมวิทยา | secondary, Thai PBS | 2023-03-12 | avoid open ground, big trees, weak structures and billboards; follow TMD | storm #1, #6 |
| `ddc-rainy-lightning` | กรมควบคุมโรค | secondary, Bangkok Biz News | — | shelter in a sturdy building; avoid open ground and rooftops, trees, billboards and poles | storm #5, #6, #7 |
| `mea-storm-2565` | กฟน. | secondary, MGR Online | 2022-01-22 | away from billboards and trees near lines; check electrics and repair; report to 1130 | storm #1, #4, #9, #10 |
| `mea-storm-2568` | กฟน. | secondary, Daily News | 2025-05-14 | the same, May 2025 | storm #6, #10 |
| `pea-storm-2569` | กฟภ. | secondary, Bangkok Biz News | 2026-05-04 | keep away from broken lines and fallen poles; report to 1129 | storm #9 |
| `readygov-storm` | Ready.gov (FEMA) | international | 2026-05-11 | warnings; trim trees; indoors; avoid plugged-in devices; report fallen lines | storm #1, #4, #5, #8, #9 |
| `nws-lightning-indoors` | US NWS | international | — | off balconies; don't touch electrical equipment ("do not unplug" is not used) | storm #7, #8 |
| `nws-lightning-outdoors` | US NWS | international | — | a safe building; avoid open fields and tall isolated trees | storm #5, #6, #7 |
| `ddpm-quake-2568` | ปภ. | secondary, Bangkok Biz News | 2025-03-28 | drop, cover, hold on; don't rush back in; wait for a check or official word | quake #4, #8 |
| `ddpm-quake-2562` | ปภ. | secondary, The Bangkok Insight | 2019-11-22 | drop, cover, hold on; away from glass; never the lift; don't go back into weak buildings | quake #4, #5, #7, #8 |
| `dmr-quake-2568` | กรมทรัพยากรธรณี | secondary, Thansettakij | 2025-03-28 | secure heavy things; nothing heavy up high; torch and medicine kit; away from windows; on a beach move away from the shore; no lift; closed shoes; gas | quake #1–#3, #5–#7, #9, #10 |
| `doh-quake-2566` | กรมอนามัย | secondary, InfoQuest | 2023-06-21 | away from glass; fire stairs, never the lift; a kit with a torch | quake #3, #5, #7 |
| `tmd-tsunami` | กรมอุตุนิยมวิทยา | official (a technical paper on earthquake.tmd.go.th) | — | the sea pulling back before a tsunami; leave the shore for high ground | quake #6 |
| `readygov-quake` | Ready.gov (FEMA) | international | 2026-09-09 | cross-check: secure heavy items, drop-cover-hold, away from windows, high ground after a coastal quake | quake #1, #3–#6 |
| `ddc-heatstroke-2568` | กรมควบคุมโรค | secondary, Thansettakij | 2025-03-18 | who is at risk; water, no alcohol, light loose clothes, no one left in a parked car; signs; first aid; 1669 | heat #1, #3–#10 |
| `ddc-heatstroke-pptv-2568` | กรมควบคุมโรค | secondary, PPTV | 2025-03-20 | the same statement (a second link; its headline's death count is not reused) | heat #1, #5, #7, #8, #10 |
| `doh-elders-water-2565` | กรมอนามัย | secondary, PPTV | 2022-04-09 | water by elders without waiting for thirst; a cool, airy room; light clothes; avoid alcohol; call 1669 | heat #3, #4, #5, #7, #9 |
| `doh-heatstroke-2566` | กรมอนามัย | secondary, Thansettakij | 2023-04-06 | at-risk groups; activity in the morning or evening; no one left in a closed car; heatstroke signs | heat #1, #4, #6, #8, #9 |
| `doh-heat-illness-2569` | กรมอนามัย | secondary, Thansettakij | 2026-03-24 | first aid for heat illness: shade, loosen clothes | heat #10 |
| `bma-heatindex-2569` | กทม. | secondary, InfoQuest | 2026-05-03 | follow heat warnings by heat-index level | heat #2 |
| `tmd-heatindex-posttoday-2567` | กรมอุตุนิยมวิทยา | secondary, Post Today | 2024-03-11 | the heat index TMD publishes; drink without waiting to feel thirsty | heat #2, #3 |
| `who-heat` | WHO | international | 2026-07-31 | cross-check: who is vulnerable, the hottest hours, no one in parked vehicles, a cool home | heat #1, #4, #6, #8 |
| `readygov-heat` | Ready.gov (FEMA) | international | 2026-07-16 | cross-check: at-risk groups, clothing, midday, closed cars, heat-stroke signs and first aid | heat #1, #5, #6, #8–#10 |
| `cdc-heat-about` | US CDC | international | 2026-07-20 | cross-check: higher-risk groups; limit alcohol | heat #1, #7 |

Already in `sources.json` and cited by the storm guide: `tmd-warn` (TMD warnings, 1182), `pea-1348` (PEA: keep away from a fallen line, 1129), `pea-service` (PEA's area and 1129) and `mea-1130` (MEA Call Center 1130, via PRD).

English agency names were added to `seo.en.agencies`: กรมทรัพยากรธรณี → Department of Mineral Resources (DMR), กรมทรัพยากรน้ำ → Department of Water Resources (DWR), องค์การอนามัยโลก (WHO) → World Health Organization (WHO), กรมอุตุนิยมวิทยาสหรัฐฯ (NWS) → US National Weather Service (NWS).

### 29.4 What was left out, and why

| Left out | Why | Where it is recorded |
|---|---|---|
| Unplug appliances during lightning | ปภ. (2018) says unplug everything; the US NWS says don't unplug during a thunderstorm, because you could be struck. The guide keeps what both say: don't use what is plugged in (storm #8) | `ddpm-storm-2561`, `nws-lightning-indoors` |
| No mobile phones in lightning | ปภ. and a TMD warning (via Thai PBS) say stop using communication devices; the NWS says mobile and cordless phones are fine indoors | `ddpm-storm-2561`, `tmd-storm-2566`, `nws-lightning-indoors` |
| How much water to drink in the heat | กรมอนามัย's article gives at least 8 glasses a day; WHO gives a different amount (rule: a number sources disagree on stays out). The guide says "sip often, before you feel thirsty" | `doh-elders-water-2565`, `who-heat` |
| Fans and windows in the heat | กรมอนามัย: a fan set away from the body, open doors and windows; WHO: shut windows and block sun by day, fans heat the body above 40 °C; the CDC: fans only below 90 °F; Ready.gov: cover windows, don't rely on a fan. The guide says "a cool, airy room" | `doh-elders-water-2565`, `who-heat`, `cdc-heat-about`, `readygov-heat` |
| Temperatures (body heat, heat-index bands, how fast a parked car heats) | กรมอนามัย's 40 °C and Ready.gov's 103 °F differ; the heat-index bands and hours change with the agency; the 10–20 minutes for a car are not needed for the advice | `doh-heat-illness-2569`, `readygov-heat`, `bma-heatindex-2569`, `ddc-heatstroke-2568` |
| Pets in a parked car | WHO and Ready.gov name animals or pets; no Thai source read does. The guide says "a child, or anyone" | `who-heat`, `readygov-heat` |
| Leave a tall building at once, or wait until the shaking stops | ปภ. (2025) says evacuate high-rises at once and กรมอนามัย ties leaving to continued strong shaking; ปภ. (2019) and กรมทรัพยากรธรณี say leave after the shaking stops. The stairs line (quake #7) is in "after" and gives no timing | `ddpm-quake-2568`, `doh-quake-2566`, `ddpm-quake-2562`, `dmr-quake-2568` |
| A walking time to safety from the shore | TMD's tsunami paper gives a walking-time figure in the sentence the guide uses; not used ("15 minutes" in the research brief) | `tmd-tsunami` |
| Landslide warning minutes ("5–10 minutes") and the 100 mm-a-day rain threshold | The minutes came up in research without a source that settles them; the 100 mm is กรมทรัพยากรธรณี's monitoring threshold, not advice for a household | `dmr-riskvillage-2565`, `dmr-rain-2568` (100 mm); research notes (minutes) |
| Trees or poles starting to tilt as a landslide sign | No Thai source found (Ready.gov lists other slow signs) | research notes |
| Tie down roof sheets before a storm | No source found; ROADMAP P7 had it as a candidate | research notes; [ROADMAP P7](ROADMAP.md#p7-heat-and-summer-storms) |
| Check the roof after a storm | No source read says so; storm #10 keeps the electrics only | storm #10 `verifyNote` |
| Wait 30 minutes after the last thunder | The NWS says so; no Thai source checked does | `nws-lightning-outdoors` |
| A death count from a heatstroke headline | A guardrail: no deaths in player-facing text | `ddc-heatstroke-pptv-2568` |

### 29.5 The alert switch

| Key | Now | Meaning |
|---|---|---|
| `config.json → alert.guide` | `"landslide"` | The guide to put first: the card on the start screen and the first tile in the picker, with a "ช่วงนี้" badge |
| `config.json → alert.until` | `"2026-10-25"` | Its last day (Bangkok date, that day included) |

- **Why landslide, until 25 Oct:** ปภ.'s warning of 18 Oct 2026 of heavy rain with flash floods and mudslides, 18–25 Oct, as reported by Thairath that day.
- **`activeAlert(config, dayKey)`** in `modes.js` (pure) returns the guide while `switchOn(guide, until, dayKey)` is on, and `null` without a guide **or without an end date**: unlike the older switches, an alert with no `until` never shows. The unit test "the alert switch: one guide on top until its end date, never without one" checks the last day, the day after, no date and no guide, and that the shipped config names a real guide with a real date.
- **The card:** "⛰️ ช่วงนี้: น้ำป่า ดินถล่ม · ดูว่าต้องทำอะไร ›" (`alertCard`, the guide's icon and `guide<Id>` name; since v1.9.1 a no-break space keeps the "·" with the name), a 48 px button with the warning colours, above the hub. Since v1.9.1 the build writes it into the page while the alert is on (§30.4). It opens that guide (`checklist_open`, label `alert`). Hidden on a challenge link and when the guide has no checklist.
- **The build** stops when `alert.guide` isn't a guide or `alert.until` isn't a real date, warns after the date has passed ("clear it or give a new end date"), and its `start` line ends with "· alert landslide until 2026-10-25" while it is on.
- **The smoke test** expects the card from `activeAlert()` on `SMOKE_DATE` (on 18 Oct 2026 it shows, on 5 Dec 2026 it doesn't) and forces an alert (`storm`, until 2099) in one check by changing the `config.json` the test server sends to that page ([KNOWN_ISSUES #53](KNOWN_ISSUES.md#53-the-smoke-test-runs-on-a-pinned-date)).
- **How the owner uses it:** [04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook); its limits: [KNOWN_ISSUES #64](KNOWN_ISSUES.md#64-the-alert-must-be-cleared-or-renewed-by-hand).

### 29.6 The start screen

From the top: the language and sound buttons, the wordmark, the tagline "เตรียมบ้านให้พร้อมทุกภัย รู้ว่าต้องทำอะไร และมีเกม 60 วิ ช่วยจำ", the alert card (when on), the hub, "🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน", the gecko and its bubble, the recommended mode's big card and the four small ones, the house date and streak, the featured topic and the safety book, the quick buttons (☎️ helplines and, where configured, 🌧️ the water level), and the footer ([20-start-tools.png](screens/20-start-tools.png)).

**The hub** (`<nav class="hub">`, two columns, 8 px gaps):

| Button | Label (th / en) | Sub-label | Opens | Size |
|---|---|---|---|---|
| 📋 (full width, yellow, ›) | ต้องทำอะไร เมื่อเกิดภัย / What to do in a disaster | น้ำท่วม แผ่นดินไหว พายุ ไฟไหม้ และเรื่องอื่น / Floods, earthquakes, storms, fire and more | the guide picker (`guide_open`, `start`) | ≥ 64 px tall |
| 🎒 | เช็กของจำเป็น / Check your supplies | ตามจำนวนคนในบ้าน, or "บ้านเราพร้อม {pct}%" from `brm:kit` / Sized for your household, or "Your home: {pct}% ready" | the home check (`kit_open`, `start`) | ≥ 56 px |
| 📝 | แผนครอบครัว / Family plan | จุดนัดพบ ใครช่วยใคร / Where to meet, who helps whom | the plan card (`plan_open`, `start`) | ≥ 56 px |

The quick buttons "📋 เช็กลิสต์ 10 ข้อ" and "🎒 บ้านพร้อมไหม?" of v1.8.0 were removed: the hub replaces them. A challenge link adds `.has-challenge`, which hides the hub, the game label and the alert, so the friend's challenge and "รับคำท้า!" stay first.

**Measured** (18–19 Oct 2026, headless Chromium): the three hub buttons end at 324, 420 and 420 px on 320 × 460 and at 327, 407 and 407 px on 360 × 640, inside the first screen, as they are at 390 × 844 and 768 × 1024. The recommended game card is below the first screen at 320 × 460 and 360 × 640, by design ([KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)). The smoke test checks the hub at the two small sizes.

**The static Thai text is generated.** The build replaces the text of every `data-i18n` element in `index.html` whose `strings.json → th` value has no `{placeholder}`, and writes the `<title>` from `og.defaultTitle` and the meta description from `og.defaultDesc`, as it already wrote the English page. Thai copy can no longer go stale in `index.html` ([GUIDELINES rule 65](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### 29.7 The guide picker and the guide sheet

Since v1.9.1 the guide sheet has a new layout (§30.2) and the sheet's ✕ and the phone's back button close it.

**The picker** (`openGuides(from)` in `main.js`): "📋 ต้องทำอะไร เมื่อเกิดภัย", "เลือกเรื่องที่อยากรู้ อ่านจบใน 1 นาที แล้วส่งเป็นรูปให้คนที่บ้านได้", a grid of 84 px tiles (`repeat(auto-fill, minmax(96px, 1fr))` with 8 px gaps inside the sheet's 16 px padding: three columns from 336 px wide, two on a 320 px phone, by the CSS) with the icon and the short name, in `config.json → guides` order with the alert's guide moved first and marked "ช่วงนี้", and "ปิด" ([21-guide-picker.png](screens/21-guide-picker.png)).

**A guide** (`openChecklist(id, from)`; [22-guide-quake.png](screens/22-guide-quake.png)):

1. The icon and the title ("🏚️ แผ่นดินไหว ทำอะไร 10 ข้อ").
2. The lines: `guideSections()` groups them under "ก่อนเกิด", "ขณะเกิด" (`#9A4A05`) and "หลังเกิด" when they have phases (a game checklist has none, so one list), numbered 1–10 across the groups; ⚠️ after a `partial` line.
3. "ที่มา: …" with the agencies of every line (from `sources.json`), and "⚠️ ข้อที่มีป้ายนี้ยังรอตรวจทานกับหน่วยงาน" when a line is ⚠️.
4. "▶ เล่นเกมเรื่องนี้ 60 วิ" when the guide is a mode (starts the daily house, `mode_select` with label `guide`), and "📖 อ่านเหตุผลและที่มาทีละข้อ", a link to the hazard page (`/quake`, or `/en/quake`).
5. "ส่งต่อเป็นรูป": the share buttons, the save hint and the 1080 × 1920 picture.
6. "🖨️ พิมพ์เก็บไว้" (§29.10), "← เรื่องอื่น" back to the picker, and "ปิด".

The old per-mode tabs at the top of the checklist sheet are gone. The result screen's "📋 เช็กลิสต์ 10 ข้อ" opens the mode's guide (label `result`). Every control in the picker and in the nine guides is 44 px or more (smoke-checked at 360 × 640).

### 29.8 Deep links

| Link | Opens | Preview |
|---|---|---|
| `/?open=guide` (`/en/?open=guide`) | the picker | the main game's ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)) |
| `/checklist/<id>` (`/en/checklist/<id>`), any of the nine | that guide | the guide's own (`og/checklist-<id>.png`, title `checklistTitle<Id>`) |
| `/?open=checklist-<id>` | that guide | the main game's |
| `/landslide`, `/storm`, `/quake`, `/heat` (`/en/…`) | the hazard page (§29.9) | the guide's |
| `/kit`, `/plan` (`/en/…`) | a page with a button into the tool | `og/kit.png`, `og/plan.png` |

`langPath()` keeps the language on any `/checklist/<id>`, so the language switch works on the new guides too. The installed app's third shortcut, "ต้องทำอะไร เมื่อเกิดภัย" (short "ต้องทำอะไร"), opens `/?open=guide&source=pwa`.

### 29.9 Pages and pictures

**Hazard pages for the guides** (`tools/build.mjs`, the same `seoPage()` as §25.4):

| Hazard | Slug | Thai / English | Guide | Lines | Preview image |
|---|---|---|---|---|---|
| landslide | `landslide` | `/landslide`, `/en/landslide` | `landslide` | 10 | `og/checklist-landslide.png` |
| storm | `storm` | `/storm`, `/en/storm` | `storm` | 10 | `og/checklist-storm.png` |
| quake | `quake` | `/quake`, `/en/quake` | `quake` | 10 | `og/checklist-quake.png` |
| heat | `heat` | `/heat`, `/en/heat` | `heat` | 10 | `og/checklist-heat.png` |

- **Order on a page with no game:** the top links, the H1 (`hazard<H>H1`), since v1.9.1 a jump row to each phase and the "☎️ โทรฟรี" row (§30.4), then **the guide**: the phases as `<h2>` headings (no separate title), each line in Thai with its English, and under it "ที่มา: …" with a link per source and "⚠️ ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน" on `partial` lines; then "📲 ส่งต่อเป็นรูป: …" (`/checklist/<id>`), the intro, the home check and plan card links, the date updated, the helplines, the "อ่านตามภัย" row and the disclaimer. The English page adds the note that the advice and helplines are Thai. On 320 × 460 the first line starts on the first screen (smoke-checked; [KNOWN_ISSUES F51](KNOWN_ISSUES.md#in-v190-19-oct-2026)).
- **Title** `hazard<H>Title` with `{n}` = 10 ("แผ่นดินไหว ทำอะไร 10 ข้อ · บ้านรอดไหม?"); **JSON-LD** `Article` whose `citation` lists every guide line's source URL.
- **Pages with a game** (`/flood`, `/pm25`, `/fire`, `/ready`) are as in §25.4 and gain a "📲 ส่งต่อเป็นรูป" link for each checklist.
- **`/learn`** lists all nine guides under its checklists, grouped by phase, with the sources under the four new guides' lines; **`llms.txt`** adds a section per new guide, "## What to do: … (…)", with the hazard page, the picture link and each line with its source URLs and "(under review)" on ⚠️ lines.
- **`/kit` and `/plan`** (`/en/…`): plain pages for the two tools of §28. The H1, a ▶-style button into the tool (`/?open=kit`: "🎒 เริ่มเช็กบ้านเรา ฟรี 1 นาที"; `/?open=plan`: "📝 ทำการ์ดแผนของบ้านเรา"), the intro, the privacy line from `kit.json`, the list ("ของที่ควรมี และที่มา": each kit line with its amount rule, such as "3 ลิตร ต่อคน ต่อวัน × 3 วัน", and "ถ้ามี…" for a household-specific line; or "6 ช่องในการ์ด และที่มา" with each plan field's hint), the sources and ⚠️ under every line, the button again, a link to the other tool's page, the date, the helplines, the "อ่านตามภัย" row and the disclaimer. JSON-LD `WebPage`. The kit card and the plan card print `/kit` and `/plan`, and their share texts link them, so a forwarded card previews as the check or the plan.
- **The sitemap** has 24 addresses, 12 Thai–English pairs: `/`, `/learn`, the eight hazard pages, `/kit` and `/plan` (28 since v1.10.0, with `/fridge` and `/air`, §32.5). `kit` and `plan` are reserved: no hazard can take those slugs.
- **Link-preview pages:** 129 (110 challenge pages, 18 checklist pages, `en/index.html`).
- **Pictures** (`npm run images`; `--only` takes comma-separated paths since v1.9.0): for each guide, `og/checklist-<id>.png` and `og/en/checklist-<id>.png` (1200 × 630: the title, "เบอร์ช่วยเหลือ 1784 · 199 · 1669" / "Free · from official safety advice", "ดูครบ 10 ข้อ" / "See all 10") and `share/checklist-<id>.png` (1080 × 1920, Thai); `og/kit.png`, `og/plan.png` and their English twins in the power cut's colours. A guide with no sprites is drawn with the plain layout of `drawChecklist()`: the number at x 92 and the text from x 142 (with sprites: 170 and 216), so lines have 74 px more room. New card themes in `cards.js → THEMES`: `landslide` (earth browns), `storm` (grey-blue), `quake` (warm grey) and `heat` (orange, with a sun).
- **`/posts`** has a section "รูป "ต้องทำอะไร" ทุกภัย (โพสต์ได้ทันทีเมื่อมีข่าว)" after the carousel sets: each guide's icon and name, its 1080 × 1920 picture, and a caption to copy (`carousel.json → guideCaption`): "{title} 📋 / อ่านจบใน 1 นาที แล้วส่งต่อให้คนที่บ้าน ทุกข้อบอกที่มา / 👉 {url} / #บ้านรอดไหม #เตรียมพร้อมรับมือภัยพิบัติ", with `{url}` = `/checklist/<id>`.

### 29.10 Print

`printList(d)` in `ui.js` fills a `#print-area` element and calls `window.print()`; the `@media print` rules hide everything else and lay out an A4 page (14 mm margins, 13 pt text): the wordmark, the title, the household line for the home check ("บ้าน 3 คน"), the phase headings, one row per line with an empty tick box, and under a line the note ("⚠️ ข้อนี้ยังรอตรวจทานกับหน่วยงาน" on a guide's `partial` line; "ที่มา: …" and the ⚠️ on each home-check line), then the guide's agencies, "เบอร์ช่วยเหลือ โทรฟรี: 1784 · 199 · 1669 · 1555 · 1130 · 1129", "พิมพ์จาก baanrodmai.autobahn.bot/checklist/quake เมื่อ 19 ต.ค. 69" (`printNote`) and the disclaimer.

- **Where:** every guide sheet and the home check's list ("🖨️ พิมพ์เก็บไว้"); event `print` with label `guide` (and the guide's id as the mode) or `kit`.
- **Not in in-app browsers.** `canPrint()` is false in LINE, Facebook and Messenger, Instagram and TikTok, which have no print, so the button isn't shown ([KNOWN_ISSUES #63](KNOWN_ISSUES.md#63-printing-isnt-offered-in-in-app-browsers)).
- **Checked** by the smoke test as a PDF in headless Chromium (the earthquake guide: 10 boxes, 1 ⚠️, the app hidden); not yet from a phone.

### 29.11 Analytics

| Event | When | mode | label |
|---|---|---|---|
| `guide_open` (new) | The picker opens | – | `start` (the hub) / `link` (`/?open=guide`, the app shortcut) / `guide` (← เรื่องอื่น) |
| `checklist_open` | A guide opens | the guide's id | `picker` / `alert` / `link` (`/checklist/<id>`, `?open=checklist-<id>`) / `result` (the result screen's 📋) |
| `print` (new) | "🖨️ พิมพ์เก็บไว้" is tapped | the guide's id (none for the kit) | `guide` / `kit` |
| `mode_select` | ▶ in a guide | the mode | `guide` (new value) |
| `learn_open` | "📖" in a guide | – | the guide's id (new value) |
| `checklist_save` | A share channel under the guide's picture | the guide's id | the channel |

The hub's 🎒 and 📝 send `kit_open` and `plan_open` with the label `start` (for `plan_open` a new value). Both allowlists (`public/js/analytics.js`, `functions/api/e.js`) have `guide_open` and `print`. Nothing about the household is sent. Queries: [05-metrics](05-metrics.md#tools-first-v190).

### 29.12 Emoji

The guides' icons are emoji in the page and the sheet (the pictures draw sprites or numbers, never emoji). Emoji newer than Unicode 11 (2018) show as empty boxes on older Android phones and older iOS, which the audience still uses. The new guides' first drafts used 🪟 🪜 🪧 🪴 🪨 (Unicode 13) and 🟤 🧊 (Unicode 12); they were replaced by older ones before release ([GUIDELINES rule 64](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Five older icons in the game checklists and the home check that were also newer than Unicode 11 were replaced in the same release (🚪 🏥 ❄️ ⛑️ ❄️), and a scan found no others ([KNOWN_ISSUES #65](KNOWN_ISSUES.md#65-loose-ends-from-the-v190-sweep)).

### 29.13 Budget, code and tests

- **Budget:** start screen 232 KB compressed (was 209), first game screen 247 KB (was 223), limit 500 KB (240 and 254 KB in v1.9.1, §30.12). `sources.json` grew from 12.0 to 23.8 KB compressed, about 14 KB of it the sources' `note`s, which the game never shows ([KNOWN_ISSUES #62](KNOWN_ISSUES.md#62-source-notes-are-downloaded-by-every-visitor), [ROADMAP N18](ROADMAP.md#n18-keep-source-notes-out-of-what-the-game-loads)); `checklists.json` +4.1 KB, `strings.json` +4.2 KB, code and CSS about +3 KB. 44 files are precached, as before.
- **Code:** `main.js` (`guideList()`, `guideIds()`, `guideOf()`, `openGuides()`, `guideSections()`, `openChecklist()`, the alert in `renderStart()`), `modes.js` (`activeAlert()`), `ui.js` (`canPrint()`, `printList()`), `kit.js` (print, `/kit` and `/plan` links), `cards.js` (themes, the plain checklist layout), `content.js` (`langPath()`), `tools/build.mjs` (guide checks, the guide-only hazard pages, `/kit`, `/plan`, `/posts`, `llms.txt`, the sitemap, the start screen's Thai text), `tools/render.html` and `render-images.mjs`.
- **Tests:** 29 rule tests (the alert switch; guides with no game) and 117 smoke checks; the new section "tools first" is listed in [06-test-checklist](06-test-checklist.md#automated-run-before-every-release).

## 30. Visitor audit 2 (v1.9.1)

Built 19 Oct 2026 (ROADMAP N19). The owner asked: "Validate the app as visitors for overall, and look what good in UI/UX or anything to improve? You can suggest." Three audit agents walked the live v1.9.0 site in parallel; the lead re-checked every finding, and the owner approved groups A (bugs), B (pages and tools) and C (game); group D (content) waits for the Thai review. The method is in [APPROACH §28](APPROACH_AND_METHOD.md#28-visitor-audit-2-three-auditors-in-parallel-v191), the fixes one by one in [KNOWN_ISSUES F55–F82](KNOWN_ISSUES.md#in-v191-19-oct-2026). No item, room, slot or `houseVersion` changed, so houses and challenge links are the same; the flood's water curve changed (§30.8).

**What the audit found good, and kept:** the alert and the three hub buttons on the first screen on every device tried (LINE's in-app browser at 360 × 640, 320 × 460, English at 390 × 844, a tablet at 768 × 1024), the advice one or two taps away; no console errors; no tap target under 44 px; axe-core clean except the wordmark's coral half; first paint 0.30–0.69 s (1.14–1.20 s on slow 4G with the CPU slowed 4×); offline after one visit; 142 of 142 internal links answering 200; amounts that follow the household; a clear challenge loop; about 60 fps.

### 30.1 Thai words that must not break (`keepTogether`)

**The problem.** Thai has no spaces between words, so the browser finds line breaks with a dictionary (ICU in Chromium; Node's `Intl.Segmenter` uses the same and gives "เป็นก|ระ|จก"). It splits some compounds: the home check's intro broke "กระ|จก", "แข็ง|แรง" and "ไฟ|ดับ", and the start screen "หน่วย|งาน", "ต้องทำ|อะไร" and "ใครช่วย|ใคร".

**What doesn't work, and why:**

- **`word-break: keep-all`** has no effect on Thai in Chromium (tested on 19 Oct 2026).
- **A word joiner (U+2060) inside the word,** the first fix tried, made it worse: it splits the run of letters the dictionary reads, so the dictionary sees two unknown pieces and moves the break next to them ("ขอ|งกรมอุตุฯ", "บ้า|นที่เสี่ยง"). It also puts an invisible character into text that people copy and search. Never insert invisible characters into Thai text ([GUIDELINES rule 68](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS C19](LESSONS_LEARNED.md#c-engineering-and-platform)).

**What does:** markup that leaves the text alone. `config.json → keepTogether` lists 217 Thai words of 2–14 letters, chosen from the word pairs in the content. Each is wrapped in `<span class="nw">` (`.nw { white-space: nowrap }`) wherever Thai is shown:

| Where | How |
|---|---|
| The app | `content.js` calls `setKeepTogether(config.keepTogether)` (one pattern, longest words first). At boot, after the static strings, `observeKeptWords()` wraps every Thai text node on the page, and a `MutationObserver` does the same for everything the app adds later (sheets, toasts, the HUD). `keepWordsIn()` skips `SCRIPT`, `STYLE`, `TEXTAREA`, `OPTION` and `TITLE`, anything outside the XHTML namespace (never inside SVG text), text already in a `.nw` and text with no Thai |
| Flex and grid boxes | In a flex or grid parent, each piece of text and each span would become a flex item of its own, and a gap opened ("ทำแผน ครอบครัว"). There the whole line goes in as **one** inline span that holds the pieces, so the line still flows as text |
| The plain pages | The build's `keepHtml()` wraps the words on the Thai pages (`/learn`, the hazard pages, `/kit`, `/plan`, `404`): text between tags only, never inside a tag or an attribute. The English pages are unchanged. The pages' CSS has `.nw` too |
| The pictures | `cards.js → tokens()` joins the `Intl.Segmenter` pieces that fall inside a kept word (`keptSpans()` in `util.js`), so a card never breaks one either. `tools/render.html` calls `setKeepTogether()`, so the rendered images follow the same list |

Lines also use `text-wrap: pretty` (paragraphs, list items, headings, the gecko's bubble), and `balance` on the hub's labels, the alert, the guide and mode names and the tagline, so a short last line is rare.

**The CSS trap (F82).** A span added for typography inherits every rule that matches "any span inside". Four did: `.quick-btn span:first-child` (it drew "ช่วยเหลือ" in the "เบอร์ช่วยเหลือ" button at the icon's 22 px), `.book-grid span` (`position: absolute`, for the badge in a safety-book tile), `.stats span` (the result's pill border) and `.alert-btn span:nth-child(2)`. They now match direct children only (`.quick-btn > span:first-child`, `.book-grid li > span`, `.stats > span`, `.alert-btn > span:nth-child(2)`), and a smoke check finds every kept word in a guide, on the start screen and in the safety book and requires it to look like the text around it (its parent's font size, and a plain inline span: `position: static`, no padding, no border); it fails with the v1.9.0 selectors ([GUIDELINES rule 72](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS C18](LESSONS_LEARNED.md#c-engineering-and-platform)).

**Checks:** the build stops on a word that isn't 2–14 Thai letters or is listed twice, and warns about a word that appears in no Thai text (`strings.json → th`, `items.json`, `checklists.json`, `kit.json`). A unit test wraps every kept word on the cards at widths 80–300 and finds none split (without the list it finds 7 bad wraps on "…ที่เป็นกระจก"); a smoke check finds no `.nw` split across lines in a guide (36 kept words there). A wrap dump of every guide line, the hub, the alert and the home check at 320 and 360 px showed only breaks between words.

**How to add a word.** When you see a Thai word broken across two lines, add the whole word (Thai letters only, 2–14) to `config.json → keepTogether`, run the build, and look again at 320 and 360 px. If the word is drawn on a picture, re-render that picture (`npm run images -- --only <path>`) and commit it only if it changed on purpose. Prefer the shortest word that stops the split: a long kept run can stop a narrow line from breaking at all. The list is kept by hand, and iPhones use their own dictionary (CoreFoundation, not ICU), which hasn't been tried **[unverified]** ([KNOWN_ISSUES #69](KNOWN_ISSUES.md#69-kept-thai-words-are-a-hand-made-list)).

### 30.2 Sheets, the back button and sharing

**The phone's back button** closed nothing: a guide opened from a LINE chat went back to the chat. Now an open sheet owns one history entry (`ui.js`):

1. Opening a sheet pushes one entry (`history.pushState`, with `brmSheet: 1` added to the state) unless a sheet already owns one.
2. Back fires `popstate`, which closes the open sheet; the visitor stays in the app.
3. Closing it any other way (✕, a button, the backdrop, Esc) removes the entry: after the current task (`setTimeout(…, 0)`), if no sheet is open and the entry is still owned, the app calls `history.back()` and ignores the `popstate` that follows. If another sheet opened in the meantime (a guide → "← เรื่องอื่น" → the picker), it reuses the entry, so one Back still leaves the sheets.
4. Where `pushState` throws (a sandboxed frame), the sheets work as before.

Since v1.9.2 this is one history manager for the game and result screens as well as the sheets (§31.2): the state key is `brm` (the depth), and the entries are made to match what is showing in the next task.

**✕ is always in view.** A sticky top bar (`.sheet-top`) holds the handle and a 44 px ✕ (`#sheet-x`, labelled "ปิด" / "Close"). Guides were 2.3–4.8 screens long and the About sheet 16–25, with "ปิด" only at the bottom. The how-to, which can't be dismissed, hides it (`.sheet.fixed`). Focus goes to the sheet's own content first; ✕ is a Tab away.

**The guide sheet** (`openChecklist()`), from the top: the title; phase jump chips (when the guide has phases, so "ขณะเกิด" is one tap away for someone reading it while it happens); "☎️ โทรฟรี" with 1784, 199 and 1669 as `tel:` chips (`help_click` with the guide as the mode); the lines; the sources, small and muted, with the agencies' English names on English pages (`agencyName()` in `content.js`, also used by the tip card, the About sheet and the home check), and one ⚠️ footnote; ▶ and 📖 as before; "เตรียมบ้านต่อ" with 🎒 เช็กของจำเป็น and 📝 แผนครอบครัว for a hazard with `tools` (`kit_open` / `plan_open`, label `guide`); "ส่งต่อให้คนที่บ้าน" with the four share buttons 2 × 2 and the picture as a thumbnail (it was 580 px tall and repeated the list; the heading was "ส่งต่อเป็นรูป", which promised a picture LINE's buttons don't send); "เปิดในเบราว์เซอร์" inside LINE; print; "← เรื่องอื่น" and "เสร็จแล้ว" side by side.

**Sharing kept the tab.** `openExternal()` in `share.js` opened LINE, Facebook and X with `window.open(href, '_blank', 'noopener')` and went to `href` in the same tab when that returned `null`. With `'noopener'`, `window.open` returns `null` by the specification even when the new tab opens, so the game's tab always left too, and Back lost the result, the lessons and the challenge back. Now: `window.open(href, '_blank')`, then `opener = null` on the new window, and the fallback only on a real `null` (a blocked pop-up). In-app browsers still navigate in place (§8). The smoke test stubs `window.open` the way browsers behave (`null` with `'noopener'`); with the old code the tab went to line.me ([GUIDELINES rules 66 and 74](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS D16](LESSONS_LEARNED.md#d-testing-and-verification)).

**A guide with no game** is shared with `shareTextGuide` ("{title} / เก็บไว้ ส่งต่อให้คนที่บ้านด้วยนะ 💛 / อ่านครบทุกข้อ พร้อมที่มา 👉 {url}"); `shareTextChecklist`, which invites people to play, is kept for the five guides with a game.

### 30.3 The language a visitor gets

Until v1.9.1 `setLang()` stored the language on every visit (`brm:lang`), so one visit to an English page made every later Thai link open in English on that phone. Now only a choice is stored: `setLang(next, true)` from the language button or a `?lang=` link, under the new key `brm:langPick`. An `/en` path still shows English, but isn't remembered. Values stored under the old key are ignored, so phones that picked up English by accident are back on Thai. The redirect script in `index.html` (and every page copied from it) reads `brm:langPick`. Two smoke checks: opening `/en/` once doesn't make Thai links open in English; the language button is remembered ([GUIDELINES rule 70](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### 30.4 The start screen and the hazard pages

**The alert card is written by the build.** On slow 4G the script added the card at 2.75 s and pushed the hub down 79 px (CLS 0.08). Now the build writes it into `index.html` (Thai) and the English page while the alert is on, from `alertCard` and the guide's name, and so into every page copied from them (`/c/…`, `/checklist/…`); when the alert is off it writes the empty, hidden `<div>`. The script still hides it after `until` and on a challenge link. The build stops if `#alert-card` is missing from `index.html`. It is generated: never edit it there.

**The start screen:** the hub's sub-labels are 14 px (were 12.6 px), its labels wrap balanced ("ตามจำนวนคนในบ้าน" no longer breaks unevenly), and `alertCard` has a no-break space before "·", so the dot stays with the name.

**The hazard pages lead with the list.** `/flood`, `/pm25`, `/fire` and `/ready` opened with the game buttons; `/flood`'s checklist was at y ≈ 28,833 px. The order now:

| Page | From the top |
|---|---|
| With a game (`/flood`, `/pm25`, `/fire`, `/ready`) | H1 → jump row (only with two lists: `/flood` ก่อนน้ำมา / หลังน้ำลด) → "☎️ โทรฟรี" 1784 · 199 · 1669 → the checklist(s) as `h2` → the picture links → the intro → ▶ the game → the "check before you go" link → the tool links → the date → the lessons by mode → the helplines → "By hazard" |
| A guide only (`/landslide`, `/storm`, `/quake`, `/heat`) | H1 → jump row to each phase (so "ขณะเกิด" is one tap away) → "☎️ โทรฟรี" → the guide by phase → the picture link → the intro → the tool links → the helplines → "By hazard" |

- **Small screens:** under 380 px the H1 is 1.3em, the phase headings carry the English inline, and the "โทรฟรี" label is visually hidden (still read by screen readers). Measured at 320 × 460 and 360 × 640: every hazard page's first line by 450 px, in Thai and English.
- **Titles and intros.** The mode hazards' titles said "43 ข้อ", "12" or "13" while the preview picture said "10 ข้อ"; they now name no count ("น้ำท่วม ทำอะไรก่อนน้ำมา และหลังน้ำลด เช็กลิสต์พร้อมที่มา · บ้านรอดไหม?"), and the intros start with the checklist ("เริ่มจากเช็กลิสต์ 10 ข้อ … ด้านล่างเป็นเหตุผลและที่มาของทุกข้อ และมีเกม 60 วิ ให้ลองฝึก"). The English start page's title is 59 characters (was 83). The plain pages have `og:image:alt`.

### 30.5 Search signals and the 404 page

- **`/checklist/<id>`** pages are copies of the app shell with a guide's preview. They pointed their canonical at `/` and listed themselves in `hreflang`, so search engines were told the start screen was the original. Their canonical is now the hazard's page, which has the same list as text (`/checklist/quake` → `/quake`, `/en/checklist/prepare` → `/en/flood`), and they have no `hreflang`. They stay out of the sitemap.
- **404.** Without a top-level `404.html`, Cloudflare Pages answers an unknown address with `/` and status 200 (§10): `/nonexistent-page`, `/c/p99`, `/en/posts` and `/og/nope.png` all got the start screen. The build now writes `public/404.html` from `seo.<lang>.notFoundTitle` and `notFoundBody`: Thai with English, `noindex`, no JSON-LD, and links to the start, "📋 ต้องทำอะไร เมื่อเกิดภัย" (`/?open=guide`), `/learn` and `/en/`. Pages serves it with status 404. The smoke test's server answers like Pages, so it is checked before a deploy; check the live site after it.
- **`robots.txt`'s first line** says "free home-preparedness tools (what to do, what to keep, a family plan) and a 60-second game" (was "a public home-safety game"), and the `<noscript>` line links "อ่านวิธีรับมือทุกภัย" (was the flood summary).

### 30.6 Guides and tools: order, names and phase names

- **The flood guides** are side by side and named for what they are: "น้ำท่วม: ก่อนน้ำมา" / "น้ำท่วม: หลังน้ำลด" ("Flood: before it comes" / "Flood: after it goes down"). `config.json → guides` order: prepare, return, landslide, storm, quake, fire, stock, heat, dust (the alert's guide still goes first in the picker).
- **`phaseNames`** (`checklists.json`, optional): a guide can name its phases. The heat guide's last lines are about someone with heatstroke ("call 1669"), which "หลังเกิด" (after) didn't describe, so `heat.phaseNames` is เตรียมไว้ก่อน / วันที่ร้อนจัด / ถ้ามีคนเป็นลมแดด (Get ready / Very hot days / Heatstroke). The build checks that each named phase is used by a line and has Thai and English; the app's sheet and jump chips, print, the hazard page, its jump row and `/learn` use the names.
- **One name per tool.** The home check is **เช็กของจำเป็น** (its sheet "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?", the result's button "🎒 เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน", the share sheet "แชร์ผลเช็กของจำเป็น"); the plan is **แผนครอบครัว** (the card "การ์ดแผนครอบครัว", the sheet "แผนครอบครัวของบ้านเรา", the button "สร้างการ์ดแผนครอบครัว"). English: "Check your supplies: how ready is our home?" and "Our family plan". The manifest's shortcuts are "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" (short "เช็กของ") and "แผนครอบครัวของบ้านเรา" (short "แผนครอบครัว"). `og/plan.png` and `og/en/plan.png` were re-rendered with the new name.
- **The home check:** a ⚠️ next to a line's sources and one footnote under the list ("⚠️ ข้อที่มีป้ายนี้ยังรอตรวจทานกับหน่วยงาน"), instead of "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on 4 of the 9 rows; the start screen's 🎒 sub-label shows the new score as soon as a tick changes it (it waited for a reload); the share sheet has "เสร็จแล้ว" next to "← กลับไปที่รายการ".

### 30.7 The service worker: the first visit and pages never visited

- **Install with `cache: 'no-cache'`.** The install fetched every precached file with `cache: 'reload'`, which skips the browser's cache, so a first visit downloaded the app twice (about 560 KB instead of about 290 KB, on prepaid data). `'no-cache'` revalidates instead: Cloudflare serves the files with `max-age=0, must-revalidate` and an ETag, so what the page has just loaded comes back as a 304 of a few hundred bytes. Not measured on the live site yet.
- **A page never visited, offline.** The service worker answers an unsaved page (`/quake`, `/kit`) with the cached app shell (§7). The app now reads the path: a hazard's slug opens that hazard's guide (label `link`), `/kit` and `/plan` open the tool; before, it showed the start screen. Smoke check: the app served at `/quake` opens the quake guide.

### 30.8 The flood's pace

The audit played the house of the day, 18 Oct 2026, and measured 90 houses from 1 Oct 2026. With the old curve every target of the 18 Oct house was under water by 26.8 s (the first at 13.6 s), and a careful player who read every tip ended the round at 15.9 s of game time with 5/10, against a friend's 8. Over the 90 houses, 32 % of targets flooded before 20 s, and in 49 of 90 a target in another room went under before 18 s, before a player could reach it. The 18 Oct house was the harshest of the 90 ([LESSONS D17](LESSONS_LEARNED.md#d-testing-and-verification)).

| `round.prepare.water` | Keyframes | First flood (90 houses) | Targets before 20 s | Other-room target before 18 s | 18 Oct house, last target | Floor wet |
|---|---|---|---|---|---|---|
| v1.0–v1.9.0 | [[0, 612], [0.25, 580], [0.45, 470], [0.7, 390], [1, 300]] | from 13.6 s (`p-gutter`) | 32 % | 49 of 90 houses | 26.8 s | 27 s |
| v1.9.1 | [[0, 625], [0.35, 590], [0.6, 470], [0.82, 390], [1, 300]] | 21.9 s at the earliest, median 23.2 s | 0 % | 0 of 90 | 35.8 s | 36 s |

- **Same houses.** No item, room, slot or `houseVersion` changed, so the daily houses and challenge links are the same. A Prepare score from before v1.9.1 and one after aren't strictly comparable: there is more time before the water, and the critical bonus (handled before the floor is wet) is easier ([KNOWN_ISSUES #26](KNOWN_ISSUES.md#26-wrong-answers-and-decoys-make-the-water-rise-faster)).
- **Checks.** The unit test "flood pace: no target goes under in the first 20 s, and never all of them before 30 s" runs over 120 days (the water test reads the first keyframe from `config.json`); a smoke check sees nothing flood in the first 19 s. `npm run probe` prints the per-item table in §3.

### 30.9 What "done" means

The HUD counted every target that was no longer pending as done, so "4/6" could mean 2 handled and 2 lost to the water, and a room tab showed a blue ✓ when its only item had flooded. A ✓ means the player did it.

- **The HUD** (`scoreHud`) counts only right and learned answers, and shows what the threat took apart, with the mode's mark: "0/6 💧5" (`lostMark` 💧 water, `lostMarkFire` 💨 smoke, `lostMarkStock` 🌑 the power cut; the share text's grid uses the same marks).
- **A room tab** whose remaining things were lost shows the mark (class `lost`), not ✓ (`scene.js → updateCounts`).
- **The result's stats** show "💧 โดนน้ำก่อน 6 อย่าง" (`statLost`, with the mode's `stFlooded` word) instead of "เหลือเวลา 44 วิ" when anything was lost: time left read as a win.
- **The lessons** list mistakes first: wrong answers, then what was lost, then what was missed, then the right ones.
- **A lost challenge** says "อีกนิดเดียว!" (`versusLose`) only when the player was 1–2 points short; otherwise "รอบหน้าเอาใหม่! เล่นบ้านสุ่มฝึกมือ แล้วกลับมาแก้มือ" (`versusLoseFar`). 5 against 8 isn't "so close".

[GUIDELINES rule 69](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

### 30.10 Hints, the how-to and short screens

- **Hint rings only on things to do.** The idle hint ringed every unresolved item, decoys included, and a decoy costs 2 s; now `.show-hints .item-target`. A tapped decoy shows a grey dash (`BADGE.decoy`), not a tick that read as a win. Smoke check: rings on targets, none on decoys.
- **How-to step 4** said "ไม่ต้องกังวลเรื่องเวลา: เมื่อแตะของ นาฬิกาจะหยุดทันที…" in every mode. The clock does stop while a sheet is open, but the water (haze, smoke, dark) rises while the player looks, and a decoy costs time. Now, per mode: "นาฬิกาหยุดตอนอ่านตัวเลือก แต่น้ำขึ้นระหว่างที่มองหา แตะของที่ไม่เสี่ยงเสียเวลา {d} วิ 💡" (fire: "ควันลงมา", dust: "ฝุ่นหนาขึ้น", power cut: "บ้านมืดลง"; Return: "เวลาหยุดตอนอ่านตัวเลือก ค่อยๆ พิจารณาได้ แตะจุดที่ไม่อันตรายเสียเวลา {d} วิ"), with `{d}` filled from `round.decoyPenaltySec`, so the text can't drift from the rule.
- **Short screens** (`max-height: 520px`, e.g. 320 × 460): smaller headings, steps and choice padding, so the how-to's four steps and a choice's three answers fit above the fold (looked at in screenshots); every sheet shows a soft shadow at its bottom while there is more below, which scrolls away at the end.
- **The LINE share sheet** said "แตะรูปด้านบน" for a picture that is below the buttons; `lineGuideText` now says "แตะรูปด้านล่างค้างไว้เพื่อบันทึกรูป หรือกดปุ่มเปิดในเบราว์เซอร์ที่ท้ายหน้า".
- **The fire smoke** (F58): a layer that started above the picture (`y: -700`) and was moved in only with a `transform` was never painted on shorter screens (360 × 640, 375 × 667, 320 × 460), while the gecko said the smoke was low. `scene.js` now sets the smoke rectangle's height and redraws its wavy edge at the current level each frame. Smoke check: the rectangle is 262 units tall at 40 s on 360 × 640 ([GUIDELINES rule 73](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS C20](LESSONS_LEARNED.md#c-engineering-and-platform)). Whether real phones had the bug too needs a phone.

### 30.11 What was left open

| Finding | Where it is tracked |
|---|---|
| Group D: the right answer is the longest choice in 72 of 82 items (Thai) and 74 of 82 (English), about 1.4 times as long, and in 26 items the only one with a different icon Fixed in v1.9.2 (§31.1, [KNOWN_ISSUES #66](KNOWN_ISSUES.md#66-the-right-answer-was-usually-the-longest-choice)); the Thai read in [ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy) |
| The result card at 25 % in a chat: the bubble (about 9 px), the link (about 7 px) and the footer unreadable; the result dots have no key Fixed in v1.9.2 (§31.3, [F86](KNOWN_ISSUES.md#in-v192-19-oct-2026)) |
| Previews at 260 px: the hotline line about 6 px; every guide uses the same gecko; `/?open=…` previews as the start screen The guide pictures fixed in v1.9.2 (§31.4); the rest in [#68](KNOWN_ISSUES.md#68-link-previews-are-small-at-chat-size), [#52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game) |
| `keepTogether` is a hand list; iOS's dictionary untested | [#69](KNOWN_ISSUES.md#69-kept-thai-words-are-a-hand-made-list) |
| The back button inside a round still leaves the page Fixed in v1.9.2 (§31.2, [F85](KNOWN_ISSUES.md#in-v192-19-oct-2026)) |
| A tablet gets a 480 px column with wide margins By design since v1.9.2 ([#71](KNOWN_ISSUES.md#71-on-a-tablet-the-app-is-a-narrow-column)) |
| JSON-LD: `VideoGame` on the start page; `Article` without `author` or `publisher`; `x-default` → `/en/` Fixed in v1.9.2 (§31.6, [F89](KNOWN_ISSUES.md#in-v192-19-oct-2026)) |
| In `llms.txt` most earthquake sources are news reports, labelled by the agency they quote | [#60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies) |
| Web Analytics is on (the beacon is in the live HTML, no `Set-Cookie`); Cloudflare's "JavaScript detections" add about 12 KB per page | [ROADMAP L1](ROADMAP.md#l1-create-the-cloudflare-pages-project), [#30](KNOWN_ISSUES.md#30-web-analytics-search-consoles-and-push-to-deploy-are-not-done-or-checked) |
| Real phones, LINE and Facebook in-app, iOS Safari, screen readers | [#3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers), [ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix) |

### 30.12 Budget, code and tests

- **Budget:** start screen **240 KB** compressed (232 in v1.9.0), first game screen **254 KB** (247), limit 500 KB. The 8 KB are the hub's text, the guide sheet and the `keepTogether` list. 44 files precached, as before; 129 link-preview pages.
- **Code:** `util.js` (`setKeepTogether`, `keptSpans`, `keepWordsIn`, `observeKeptWords`), `content.js` (`agencyName`, `brm:langPick`), `ui.js` (the sheet's history entry, ✕, focus), `share.js` (`openExternal`), `scene.js` (the smoke's geometry, `updateCounts(records, lostMark)`, the decoy's dash), `main.js` (the guide sheet, the HUD, the result, the offline path, the how-to's `{d}`), `cards.js` (`tokens()`), `kit.js` (names, footnote, the score on the hub, "เสร็จแล้ว"), `app.css` (`.nw`, `text-wrap`, `.sheet-top`, `.sheet-x`, the guide sheet, short screens, direct-child selectors), `tools/build.mjs` (the hazard pages' order, `jumpRow`, `telRow`, `keepHtml`, the static alert, the checklist canonical, `404.html`, the `keepTogether` and `phaseNames` checks), `tools/sw.template.js`, `tools/render.html`.
- **Tests:** 32 rule tests (flood pace; kept words on the cards; the `keepTogether` list) and 134 smoke checks (section 13, "the visitor audit of 19 Oct 2026", listed in [06-test-checklist](06-test-checklist.md#automated-run-before-every-release)).

## 31. Answers, back button, card and security (v1.9.2)

Built 19 Oct 2026 (ROADMAP N20). After v1.9.1 the owner said: "Continue what yo suggested to make app attractive and secure practical usability". What had been suggested were the leftovers of the second visitor audit (§30.11). The method is in [APPROACH §29](APPROACH_AND_METHOD.md#29-answers-drafted-in-parallel-read-by-one-lead-v192), the fixes one by one in [KNOWN_ISSUES F83–F91](KNOWN_ISSUES.md#in-v192-19-oct-2026). No item, room, slot or `houseVersion` changed, and no right answer, tip, `why`, `feedback`, source, `kind` or id: the advice, the houses and the challenge links are the same.

### 31.1 Wrong answers that don't give the right one away

**The problem.** The right answers were written from the agencies' wording, which names the action and often its reason; the wrong ones were short. Recounted for v1.9.2 over the 82 choice sets (the 81 items and `p-breaker`'s `wet` set), the right answer was strictly the longest in 71 in Thai and 73 in English (the v1.9.1 audit reported 72 and 74, counting slightly differently). A player could pick it without reading, and the round taught less.

**The brief** for the rewrite, the same for every drafter:

- keep the wrong answer's meaning and its mistake, so the item's existing `feedback` still answers it;
- add the reason a real person would give for doing it;
- no new facts, advice or numbers;
- a wrong label at most 60 Thai code points and 80 English characters (it must fit a phone's choice button);
- no filler: every added word is part of the reason.

**What it looks like** (`p-docs`, documents before a flood):

| | Before | After |
|---|---|---|
| Wrong answer | ปล่อยไว้ เสียก็ไปทำใหม่ได้ | ปล่อยไว้ในลิ้นชักเหมือนเดิม เสียก็ไปขอทำใหม่ได้ / Leave them in the drawer as usual; if they're ruined, get new ones |
| Its feedback (unchanged) | ทำใหม่ได้ก็จริง แต่ยุ่งยากและเสียเวลามาก ตอนอพยพหรือขอความช่วยเหลือก็ต้องใช้ ห่อกันน้ำไว้ก่อนดีกว่า | the same |

**The numbers.** 117 wrong labels were rewritten, in the prepare, return, dust, fire and power-cut items and `p-breaker`'s `wet` set.

| | Right answer strictly the longest | Longest / middle / shortest by length |
|---|---|---|
| Thai, v1.9.1 | 71 of 82 | — |
| Thai, v1.9.2 | 17 of 82 | 17 / 40 / 25 |
| English, v1.9.1 | 73 of 82 | — |
| English, v1.9.2 | 16 of 82 | 16 / 37 / 29 |

**The balance.** Rewriting every set would have made the right answer almost never the longest, and "never pick the longest" would have been the new tell. So in 14 sets one drafted rewrite was left out, and the right answer stays the longest by a hair (the longest wrong one is 0.79–0.97 of it): `p-waterfood`, `p-poster`, `r-glass`, `r-mudfeet`, `r-mould`, `f-extinguisher`, `r-fever`, `r-debris`, `r-breaker`, `a-inhaler`, `a-purifier`, `r-tap`, `a-grill`, `s-plugs`. Length now says nothing either way.

**What the review changed.** Every draft was read against its item's `context` and `feedback`:

- `p-phone`'s draft said the battery was "still half full", but the item's context says 15 % ("แบตเหลือ 15%"). It became "แบตยังเหลือ 15% เดี๋ยวค่อยชาร์จตอนไฟใกล้ดับก็ทัน" / "15% will do for now; charge it just before the power goes".
- Three drafts proposed shorter right answers (`r-gas`, `r-tap`, `r-cupboard`). They were declined: a right answer is sourced advice and stays word for word.
- `p-drain`'s second wrong answer was trimmed to "เทน้ำยาล้างท่อลงไปเยอะๆ ให้น้ำระบายลงไปเร็วๆ" so its Thai sheet fits at 320 × 568 (§31.7).
- One draft was dropped by its own agent: `s-plugs` "leave them plugged in but switched off" would have been half right, since Ready.gov says "turn off or disconnect". `s-plugs` keeps its one wrong answer.

**The test.** "the right answer is not given away by its length (KNOWN_ISSUES #66)" in `tests/run.mjs`, per language (Thai counted in code points): the right answer is strictly the longest in 10–33 % of the sets; where it is, the longest wrong one is at least 0.75 of it; and every wrong label is at most 60 Thai code points or 80 English characters. On the v1.9.1 content it fails (71 of 82). [GUIDELINES rule 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

**The icons were a tell too.** Each answer button drew an icon for its `kind` (a clock for `leave`, a bag for `pack`…). In 42 of the 82 sets one answer's icon was the odd one out, and it was the right answer in 26 of them: the two wrong answers often shared the clock, because a common mistake is to wait or leave things as they are (24 of the 26). So "pick the odd icon" was right in 26 of 42, the audit's "in 26 items it is the only choice with a different icon". Since v1.9.2 each button shows a letter in the same 36 px badge, ก ข ค in Thai and A B C in English (`strings.json → choiceLetters`). The choices are still shuffled for each house, so a letter says nothing about the answer. `icons.js` lost `actionIcon` (only `spriteIcon` is left), and `kind` stays in `items.json` as a description of the action, not drawn (§5). Smoke check: "the answers are lettered ก ข ค, with no icon that tells them apart" ([KNOWN_ISSUES F90](KNOWN_ISSUES.md#in-v192-19-oct-2026)).

**Still for people.** The new wrong answers are new Thai copy: a native reader checks that each sounds like what a person would say ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy), [KNOWN_ISSUES #66](KNOWN_ISSUES.md#66-the-right-answer-was-usually-the-longest-choice)).

### 31.2 The back button: one history manager

Since v1.9.1 a sheet owned a history entry (§30.2), but Back during a round, or on the result screen, still left the page. Now `ui.js` keeps a list of layers, bottom to top: the game or result screen (`'screen'`) and an open sheet (`'sheet'`). Each owns one history entry, and `history.state.brm` is the depth.

- **Settling.** `showScreen()`, `openSheet()` and a sheet's `close()` call `settleHistory()`. In the next task (`setTimeout(…, 0)`, once, however many changes came before) it compares the layers with what is showing: missing entries are pushed with `history.pushState`, at the same address, so a challenge link or a `?mode=` link keeps its address; extra entries are removed with `history.go(-n)`, and the one `popstate` that follows is ignored. A sheet that closes and another that opens straight after share one entry.
- **Back.** On `popstate` the layers above the new depth close, top first: a sheet closes (its `onClose` runs, as with ✕); a screen calls `onScreenBack`, which `main.js` sets with `setScreenBack()`: in a running round it pauses the game (the pause sheet), otherwise it goes to the start screen (`goHome()`).
- **Where `pushState` throws** (a sandboxed frame), the app works as it did without the entries.

| Showing | Entries the app owns | The phone's back button |
|---|---|---|
| The start screen | 0 | Leaves the site (back to the chat or the page before), as before |
| The start screen with a sheet (a guide) | 1 | Closes the sheet (v1.9.1) |
| A round, running | 1 | Pauses it: the pause sheet opens, and the round owns 2 entries again |
| A round with the pause sheet | 2 | Closes the sheet, which resumes the round |
| A round with a choice sheet | 2 | Closes the choice sheet, as ✕ does; the round goes on |
| The result | 1 | Goes to the start screen |
| The result with a sheet (sharing) | 2 | Closes the sheet |

**Checks:** three smoke checks at 360 × 640, with a page before the game as a chat would be: "back inside a round pauses it (the pause sheet), back again resumes; still on the site", "back on the result goes to the start screen, still on the site" and "no page errors (back in the game)". Also tried in a scratch probe. The Android back gesture, iOS's swipe back and LINE's in-app browser are untried **[unverified]** ([06-test-checklist](06-test-checklist.md) row 61). [GUIDELINES rule 77](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

### 31.3 The result card at chat size

A chat shows the 1080 × 1350 card about 270 px wide, a quarter of its size. Before v1.9.2 the gecko's line was 38 px (down to 28 px, up to 4 lines) in a 330 px bubble left of the gecko, about 9 px in a chat, and the printed link about 7 px. The new layout in `drawResultCard` (`cards.js`), top to bottom:

| Part | Size | Where (y on the 1350 px card) |
|---|---|---|
| The wordmark, the mode chip, the house date | 104 px, 40 px, 30 px (as before) | 150, 192, 300 |
| The gecko | 300 × 316, centred | from 318 |
| Its line (`endingBubble`) | 960 px wide (x 60–1020), white with the tail pointing up at the gecko; centred text from 52 px down to 38 px, the largest size that fits two lines without a lone short word on the last; a line that needs more even at 38 px gets up to three | from 672 |
| The score | 200 px | at 980, or lower under a taller bubble |
| The rank pill | 50 px | just under the score |
| The result dots | 60 px each, 22 px apart | 1158 |
| The call to action | 50 px, down to 34 | 1244 |
| The challenge link | 46 px, down to 30, weight 600 | 1294 |
| The footer | 24 px | 1334 |

The separate headline is no longer drawn: the wordmark, the mode chip, the score and the rank say it. At a quarter of the size the line's 52 px text is 13 px and the 46 px link 11.5 px; looked at 270 px wide, both can be read. The dots still have no key and the footer stays small. `share/sample-result-prepare.png` and `share/sample-result-return.png` were re-rendered.

### 31.4 A prop for every guide picture

The picture of a guide with a game draws the gecko with its mode's prop (the rain hood, the torch, the mask, the fire helmet). The four guides with no game drew it with nothing on, so in a chat they looked alike. `config.json → guides[].prop` (optional, v1.9.2) gives them one:

| Guide | `prop` | What the gecko wears |
|---|---|---|
| `landslide` | `helmet` | a yellow hard hat |
| `storm` | `hood` | the rain hood (as in Prepare) |
| `quake` | `helmet` | a yellow hard hat |
| `heat` | `sunhat` | a straw sun hat with a red band |
| a guide with a game | its mode's | `prepare` hood, `return` torch, `dust` mask, `fire` fire helmet, `stock` torch |

- **Code:** `content.js` calls `setGuides(config.guides)`; `propFor(id)` in `modes.js` returns the mode's prop, else the guide's, else `none`; `cards.js` draws with it. `mascot.js` has two new props, `helmet` and `sunhat`.
- **Checks:** the build stops on a prop the gecko doesn't have (`hood`, `torch`, `mask`, `firehat`, `helmet`, `sunhat`); the unit test "every guide picture has a gecko accessory, games and guides alike (v1.9.2)".
- **Images:** `og/checklist-{landslide,storm,quake,heat}.png`, the same under `og/en/`, and `share/checklist-{landslide,storm,quake,heat}.png`. Landslide and earthquake share the hard hat; their titles tell them apart.
- **Still open:** the previews' helpline line, about 6 px in a chat ([KNOWN_ISSUES #68](KNOWN_ISSUES.md#68-link-previews-are-small-at-chat-size)).

### 31.5 Security headers

`public/_headers` sends these on every path (`/*`):

| Header or directive | What it stops |
|---|---|
| `Content-Security-Policy: frame-ancestors 'self'` | Another site showing the app inside a frame, to trick taps onto it (clickjacking) |
| `object-src 'none'` | Plugins (`<object>`, `<embed>`); the app uses none |
| `base-uri 'self'` | An injected `<base>` sending the page's relative links and scripts to another site |
| `form-action 'self'` | A form sending what is typed to another site; the plan card's fields are never submitted anyway |
| `upgrade-insecure-requests` | Any `http://` request from the page; it is made over HTTPS |
| `X-Frame-Options: SAMEORIGIN` (v1.9.2) | Framing, for browsers that don't read `frame-ancestors` |
| `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` | As before |

- **No `script-src` or `default-src`, on purpose.** Cloudflare injects inline scripts into the pages it serves: the Web Analytics beacon and the zone's JavaScript detections (`/cdn-cgi/challenge-platform/…`, §10). A script policy would block them, or allow them only through hashes or nonces that Cloudflare can change at any time. The app has no third-party scripts of its own, and the privacy rules keep it that way ([GUIDELINES rule 76](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **HSTS** is sent by Cloudflare for the domain already, so `_headers` doesn't repeat it.
- **In-app browsers** (LINE, Facebook) show the page in their own web view, not inside another site's frame, so `frame-ancestors` doesn't affect them; the phone test will show it **[unverified]**.
- **Checks:** the unit test "security headers: no framing by other sites, no plugins, no foreign base or form target" reads `_headers` (and fails on a `script-src`); after the deploy, `curl -sI https://baanrodmai.autobahn.bot/` should show both headers ([06-test-checklist](06-test-checklist.md#live-site-checks-search-and-ai-search)).

### 31.6 Structured data

The JSON-LD the build writes (`tools/build.mjs`):

| Where | What |
|---|---|
| `/` and `/en/` (`@graph`) | `WebSite` (`…/#website`, `publisher` → `…/#org`); **the publisher**, an `Organization` (`@id` `${SITE}/#org`, the name, `alternateName` "Baan Rod Mai?", `url`, `logo` `icons/icon-512.png`); the app (`…/#game`), typed `['VideoGame', 'WebApplication']` with `applicationCategory: UtilitiesApplication`, free, about the eight hazards |
| `/learn`, the hazard pages and their `/en/` twins | `Article` with `author` and `publisher` (the same `Organization`) and the sources as `citation` |

- **The English start page.** The build makes `/en/`'s graph by copying the Thai one and changing the website and game nodes. It first did so by position, and the publisher, inserted at position 1, took the game's English description and addresses, while the game node kept the Thai ones; found in our own review before release, never live. It now finds the game node by its `@id` (`…/#game`), and the unit test "structured data: one publisher, and each start page describes the app in its own language" checks both pages ([KNOWN_ISSUES F91](KNOWN_ISSUES.md#in-v192-19-oct-2026), [LESSONS C22](LESSONS_LEARNED.md#c-engineering-and-platform)).
- **Kept on purpose:** the `VideoGame` type, because the game is still part of the app; `x-default` → `/en/`, because `x-default` is the page for visitors whose language matches none of the others, and for them the English page is right.
- **`llms.txt`:** the tools line now also links the tools' own pages: "every line and its source: https://baanrodmai.autobahn.bot/kit" and "…/plan".
- **Left:** Google's Rich Results Test of the publisher and its logo ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)).

### 31.7 Choice sheets on short screens

With wrong answers that say why, a choice's three answers grew longer. Under `@media (max-height: 640px)` the choice sheet is now more compact: `.sheet { max-height: 92% }`, the item's picture 52 px wide (46 px tall), `.choices` gap 8 px, `.choice` at least 52 px tall with 8 × 12 px padding. Every tap target stays 44 px or more. Screens 520 px tall or less keep their own, tighter rules (§30.10).

Measured with a scratch probe that filled the real choice sheet with every item's context and labels, in both languages, and compared its scroll height with its height:

| Screen | Thai sheets that scroll | English sheets that scroll |
|---|---|---|
| 320 × 568 | 0 of 82 | 20 of 82, by up to 78 px (`p-meds`, whose right answer is 82 characters); 42 of 82 on the live v1.9.1, by up to 78 px |
| 360 × 640 | 0 | 0 |
| 390 × 844 | 0 | 0 |

The English remainder is [KNOWN_ISSUES #73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones). The probe's first run said 6 Thai sheets scrolled; the truth was 1 (`p-drain`, then trimmed). It rewrote the text inside the sheet, and the app's keep-together observer (`observeKeptWords`, §30.1) had already wrapped words of earlier labels in spans, so old text stayed behind ([LESSONS D19](LESSONS_LEARNED.md#d-testing-and-verification)).

### 31.8 Budget, code and tests

- **Budget:** start screen **243 KB** compressed (240 in v1.9.1), first game screen **258 KB** (254), limit 500 KB: the longer wrong answers, the history manager and the card. 44 files precached; 81 items (and 30 decoys), 109 sources.
- **Code:** `ui.js` (`settleHistory`, `setScreenBack`, the layers), `main.js` (Back in a round and on the result; lettered answers), `icons.js` (`actionIcon` removed), `cards.js` (`drawResultCard`, `endingBubble`), `modes.js` (`setGuides`, `propFor`), `mascot.js` (`helmet`, `sunhat`), `content.js`, `app.css` (the choice sheet under 640 px), `tools/build.mjs` (the publisher, `applicationCategory`, the English game node by `@id`, the guides' `prop` check, `llms.txt`), `public/_headers`; `strings.json → choiceLetters`.
- **Tests:** 36 rule tests (the answers' lengths, the guides' props, the security headers, the structured data) and 138 smoke checks (the lettered answers, the back button in a round and on the result, listed in [06-test-checklist](06-test-checklist.md#automated-run-before-every-release)), on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027.

## 32. Calculators: the fridge, dust today, the pills (v1.10.0)

Built 19 Oct 2026 (ROADMAP N21). The owner sent a screenshot of the home check and wrote: "ชอบแบบนี้ ใส่ค่า แล้วคำนวณให้เลยว่าต้องเตรียมของยังไง เท่าไหร่ มีแบบนี้อีกไหม ดีๆ เอาแนวคิดนี้ไปใช้ทำ Features อื่นได้อีกไหม" ("I like this: put in values and it works out what to prepare and how much. Are there more good ones like this? Can this idea be used for other features?"). Until then only the home check calculated (§28.3); the plan card is a form. v1.10.0 adds three calculators built the same way and joins them to the start screen, the guides, the hazard pages and the results. The method is in [APPROACH §30](APPROACH_AND_METHOD.md#30-from-one-tool-the-owner-liked-to-three-v1100), what is still open in [KNOWN_ISSUES #74–#78](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only). No item, room, slot or `houseVersion` changed, and no lesson: houses, challenge links and the game's advice are the same.

| Calculator | Asks | Works out | Numbers from | Where |
|---|---|---|---|---|
| **ไฟดับ: ของในตู้เย็นยังกินได้ไหม?** / "Power cut: is the food in the fridge still safe?" (`fridge`) | How long the power has been off; how full the freezer is; whether there is medicine that must be kept cold | For each part, how much longer it keeps and until what time, or what to throw out | The US CDC and Ready.gov (⚠️ international) | `/fridge`, `/?open=fridge`, the hub, an app shortcut |
| **ฝุ่นวันนี้ บ้านเราต้องทำอะไร?** / "Dust today: what should we do at home?" (`air`) | A reading (µg/m³ or Thailand's AQI) or the colour an app shows; who at home needs extra care | The level, and what everyone, the people at risk and people with a long-term illness should do | The PCD's notice in the Royal Gazette (2023); two lines from the DOH, named | `/air`, `/?open=air`, the hub, an app shortcut |
| **ยาพอกี่วัน?** / "How many days will the pills last?" | Pills left; pills a day | How many days they last, and how many more make 7 days | The home check's 7 days (`moph-7days`, ⚠️ a 2013 figure) | In the home check, under the daily-medicine line |

### 32.1 The pattern

The same rules as the home check, written down so that the next calculator follows them ([GUIDELINES rules 78–81](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)):

- **Answers given once, and reused.** Each tool asks only what it needs, in taps where it can (a stepper, radio buttons, ticks). Who is at home starts from the home check's answers where they fit, and the person can change it.
- **Sourced numbers only.** Every figure a tool computes with is in `kit.json`, and the build stops unless it appears in a cited source's title or note (§32.6). Figures from a foreign agency are ⚠️ `partial`, and the tool says so on screen. A tool adds no number of its own: a day is 24 hours, and "enough for 7 days" is 7 × pills a day.
- **Rounding in the safe direction.** Time that has passed rounds up and time that is left rounds down, so an answer never looks safer than its source.
- **Nothing typed or read is sent.** Answers stay in `localStorage`; events carry only the tool and where it was opened from or shared to (§32.5).
- **It ends in something to send.** "📤 ส่งให้คนที่บ้าน" ("Send to the family") shares what the tool worked out as text, through LINE, the phone's share sheet or a copy, with the tool's link.
- **Pure functions.** The sums are in `kitplan.js` (no DOM), unit-tested in Node and cross-checked against a script written apart from them (§32.7).

### 32.2 The fridge in a power cut

`openFridge()` in `kit.js`; content `kit.json → fridge`; logic `fridgePlan(cfg, { hours, freezer, med })` in `kitplan.js`.

**The questions:**

- "ไฟดับมานานแค่ไหนแล้ว?" ("How long has the power been off?"): a − / + stepper that moves the time by exactly one hour, within 0–72 h (`fridge.maxHours`), and shows the time off ("3 ชม. 30 นาที"); and "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้" ("It has just gone off: start counting now"), which starts a count from this moment. Under them: "นับจากราว 21:10 น. ระบบนับต่อให้เองแม้ปิดหน้านี้" ("Counting from about 21:10; it keeps counting even if you close this").
- "ช่องแช่แข็งมีของแค่ไหน?" ("How full is the freezer?"): เต็มช่อง / ราวครึ่งช่อง ("Full" / "About half full").
- "💊 มียาที่ต้องเก็บในตู้เย็น" ("There is medicine that must be kept cold"): a tick that adds the medicine line.

**The answer** ("ตอนนี้", "Right now"), worked out again every 20 s while the sheet is open:

| Part | Keeps for | Source | While it keeps (✅, or ⏳ in its last hour) | When it is over (❌) |
|---|---|---|---|---|
| 🥛 ของในตู้เย็น (ช่องธรรมดา) / food in the fridge | 4 h | `cdc-food-outage` | "ยังเก็บได้อีกราว 30 นาที ถ้าไม่เปิดประตูตู้ · ถึงราว 23:30 น." ("Safe for about 30 min more, if the door stays shut · until about 23:30") | "เกิน 4 ชม.แล้ว: ทิ้งเนื้อสัตว์ ปลา ไข่ นม และอาหารที่เหลือ" ("Over 4 hours: throw out meat, fish, eggs, milk and leftovers") |
| ❄️ ของในช่องแช่แข็ง / food in the freezer | 48 h full, 24 h about half full | `cdc-food-outage` | "… ถ้าไม่เปิดช่องแช่แข็ง · ถึงราว …" ("… if it stays shut · until about …") | "เกิน 48 ชม.แล้ว: ห้ามชิมเพื่อดูว่าเสียไหม ไม่แน่ใจให้ทิ้ง" ("Over 48 hours: never taste it to check; when in doubt, throw it out"), 24 for a half-full one |
| 💊 ยาที่ต้องเก็บในตู้เย็น / cold medicine (only when ticked) | 1 day | `readygov-outage` | "อีกราว 20 ชม. 30 นาที จะครบ 1 วัน (ราว …)" ("About 20 h 30 min until it has been a day"), with "ถ้าไฟดับเกิน 1 วัน Ready.gov แนะให้ทิ้ง เว้นแต่ฉลากบอกว่าเก็บนอกตู้ได้" under it | "ไฟดับเกิน 1 วันแล้ว: Ready.gov แนะให้ทิ้ง เว้นแต่ฉลากยาบอกว่าเก็บนอกตู้เย็นได้" ("Off for over a day: Ready.gov says throw it out unless the label says it can be kept out of the fridge") |

- **Statuses:** ✅ more than an hour left; ⏳ an hour or less (display only: the advice is the same, the mark says time is short); ❌ over.
- **Clock times:** "ถึงราว 23:30 น."; when that time isn't today, the date too ("02:19 น. 22 ต.ค."), because 48 hours on, the clock alone would repeat.
- **However long the power is off** ("ไม่ว่าไฟดับนานแค่ไหน"): 🚪 open the fridge and freezer only when you must (CDC, Ready.gov, ⚠️); 🚫 never taste food to see if it has gone off, when in doubt throw it out (CDC, ⚠️); 🥫 throw out cans that are dented, bulging, leaking or rusty (อย. and กรมอนามัย, `fda-cans`, `anamai-cans`, ✅).
- **Said on screen:** each line's agencies with ⚠️ where it is `partial`; a footnote, "⚠️ ตัวเลขชั่วโมงมาจาก CDC และ Ready.gov ของสหรัฐฯ ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานไทย" ("The hours come from the US CDC and Ready.gov; no Thai agency advice on this was found."); "🔒 เวลาที่นับอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน".
- **Buttons:** 📤 ส่งให้คนที่บ้าน (the text: "ไฟดับมา 3 ชม. 30 นาที แล้ว", one line per part, the two agencies with ⚠️, and the `/fridge` link); 🎒 เช็กของจำเป็นสำหรับไฟดับ (the home check, `kit_open` with the label `fridge`); 💡 ไฟมาแล้ว: ล้างเวลา ("The power's back: clear the time"); ปิด.

**Rounding.** `span()` in `kit.js` rounds the time off **up** to the minute and the time left **down**, with a tolerance of a millionth of a minute for floating point, so neither ever looks safer than it is. At 3 h 30 min 20 s without power, the stepper says 3 ชม. 31 นาที and the fridge has 29 นาที left, not 30 ([GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS B13](LESSONS_LEARNED.md#b-safety-content-and-research)).

**The + button** adds exactly one hour to the time shown, within 0–72 h: 3 h 30 min becomes 4 h 30 min. The first version rounded the time first (`Math.round`), so 3 h 30 min + 1 became 5 h and skipped the hour in which the fridge's 4 hours run out. Found in testing, never live ([KNOWN_ISSUES F92](KNOWN_ISSUES.md#in-v1100-19-oct-2026), [LESSONS C23](LESSONS_LEARNED.md#c-engineering-and-platform)).

**What stays on the device.** `brm:fridge` = `{start, freezer, med}`: the moment the power went off (in milliseconds), the freezer answer and the tick. A count that started more than 7 days ago, or in the future, is ignored as another power cut. Because the start is stored, not the hours, the count goes on after the page or the app is closed. The start screen reads it too (in `main.js`, without loading `kit.js`): while a cut is counted, up to 72 h, the tile's second line says "⏱️ ไฟดับมาเกิน 5 ชม.แล้ว" ("⏱️ Off for over 5 h"; whole hours rounded down, so the wording says "more than", which is never safer than the truth) or, in the first hour, "⏱️ ไฟเพิ่งดับ กำลังนับเวลา"; otherwise "ยังกินได้อีกกี่ชั่วโมง". "💡 ไฟมาแล้ว: ล้างเวลา" clears it. The same limits as the home check apply: one browser, and LINE's in-app browser keeps its own copy ([KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)).

**What the hours rest on.** `cdc-food-outage` (the US CDC, "Keep Food Safe After a Disaster or Emergency", read 18 Oct 2026): with the doors closed, food stays safe up to 4 hours in a fridge, 48 hours in a full freezer and 24 in a half-full one; never taste food to check; and its power-outage message, after 4 hours throw out meat, fish, eggs, milk and leftovers. `readygov-outage` (Ready.gov, "Power Outages"): keep the doors closed, and if the power is out for more than a day, discard medication that should be refrigerated unless the label says otherwise. The research of 19 Oct 2026 again found no Thai agency advice on food in a fridge during a power cut (§32.8), so all three parts are ⚠️ `partial` ([KNOWN_ISSUES #74](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only)). The power-cut lessons `s-fridge` and `s-freezer` use the same hours (§27.2), so the game and the tool agree.

### 32.3 Dust today

`openAir()` in `kit.js`; content `kit.json → air`; logic `airLevel()` and `airAdvice()` in `kitplan.js`.

**The questions:**

- "ตัวเลขที่เห็นเป็นแบบไหน?" ("What kind of number is it?"): PM2.5 (มคก./ลบ.ม.) / AQI ของไทย ("Thailand's AQI"); µg/m³ to start.
- "ค่าฝุ่นตอนนี้" ("The reading now"): a number field (`inputmode="decimal"`; a comma counts as a decimal point; µg/m³ from 0 to 999 and AQI from 0 to 500, anything else gives no level).
- "หรือเลือกสีที่เห็นในแอป" ("or pick the colour the app shows"): five swatches, ฟ้า เขียว เหลือง ส้ม แดง. Picking one clears the number; typing a number marks its colour.
- Under them: "สีของกรมควบคุมมลพิษใช้ค่าเฉลี่ย 24 ชั่วโมง AQI ในนี้คือ AQI ของไทย แอปต่างประเทศใช้ AQI คนละแบบ ให้ใส่ค่า PM2.5 แทน" ("The PCD's colours are for the 24-hour average. The AQI here is Thailand's AQI; apps from abroad use a different AQI, so put in the PM2.5 figure instead.").
- "ในบ้านมีใครต้องระวังเป็นพิเศษไหม?" ("Is anyone at home who needs extra care?"): 👶 เด็กไม่เกิน 5 ขวบ, 🧓 คนอายุเกิน 60, 🤰 คนท้อง, ❤️ คนมีโรคหัวใจ ปอด หรือโรคประจำตัว. These are the notice's people at risk (its clause 2: older people over 60, young children up to 5, pregnant women, people with heart and blood-vessel or respiratory disease, "among others").

**The bands.** The PCD's notice, Table 2. PM2.5 is the continuous 24-hour average in µg/m³, to one decimal place, rounded by the usual rule (clause 4.1(1)). AQI 100 equals the 24-hour standard of 37.5 µg/m³ (clause 3).

| Colour (`colour`) | Level | PM2.5, µg/m³ (`pm`, the upper edge) | Thailand's AQI (`aqi`) |
|---|---|---|---|
| ฟ้า (`#4FB3E8`) | ดีมาก / very good | 0–15.0 (15) | 0–25 (25) |
| เขียว (`#6CC04A`) | ดี / good | 15.1–25.0 (25) | 26–50 (50) |
| เหลือง (`#F2CF3A`) | ปานกลาง / moderate | 25.1–37.5 (37.5) | 51–100 (100) |
| ส้ม (`#F28C28`) | เริ่มมีผลกระทบต่อสุขภาพ / starting to affect health | 37.6–75.0 (75) | 101–200 (200) |
| แดง (`#E5372E`) | มีผลกระทบต่อสุขภาพ / affects health | 75.1 and over (`null`) | 201 and over (`null`) |

- **How a reading is placed.** `airLevel()` rounds µg/m³ to one decimal, half up (`Math.round(n × 10) / 10`, with a tiny tolerance for floating point), and AQI to a whole number, then takes the first level whose upper edge it doesn't pass. So 15.04 is blue and 15.05 green, 37.55 is orange and 75.05 red.
- **The averaging period.** The colours are for the 24-hour average. Many apps also show an hourly reading; whether Air4Thai colours hourly readings with the same bands is **[unverified]**, because Air4Thai couldn't be opened ([KNOWN_ISSUES #75](KNOWN_ISSUES.md#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings)). The tool says its colours are for the 24-hour average.
- **The old scale.** The notice took effect with the 37.5 µg/m³ standard on 1 Jun 2023 (Thai PBS) and was published on 3 Jul 2023; it replaced the 2018 notice. Thai PBS prints the old bands beside the new: 0–25, 25–37, 38–50, 51–90 and 91 and over µg/m³. Reports from before mid-2023, and the repository's PPTV 2022 source, still carry them ([LESSONS B7](LESSONS_LEARNED.md#b-safety-content-and-research)).

**What each level says** (`levels[].all`, `risk` and `chronic`; every line with its sources):

| Level | Everyone at home (`all`) | People at risk (`risk`) | People with a long-term illness (`chronic`) |
|---|---|---|---|
| ฟ้า | ทุกคนใช้ชีวิตได้ตามปกติ (everyone can go about life as normal) | — | — |
| เขียว | ทำกิจกรรมกลางแจ้งได้ตามปกติ (outdoor activities as normal) | watch for unusual symptoms: frequent cough, hard breathing, wheeze, a tight chest, palpitations, dizziness | — |
| เหลือง | spend less time on hard outdoor activity or exercise | a PM2.5 mask every time you go outside; spend less time on hard outdoor activity or exercise; any unusual symptoms, see a doctor promptly | — |
| ส้ม | a PM2.5 mask every time you go outside; limit hard outdoor activity or exercise; watch for symptoms such as a cough, hard breathing or sore eyes | a PM2.5 mask every time you go outside; **avoid** hard outdoor activity or exercise; follow the doctor's advice, and with any unusual symptoms see a doctor promptly | have the medicine and equipment you need ready **(กรมอนามัย)** |
| แดง | no outdoor activities; if you must go out, always wear a PM2.5 mask; any unusual symptoms, see a doctor promptly; stay in a dust-free room **(กรมอนามัย)** | — (the notice has one list for everyone at red) | stay in a room kept safe from air pollution, with the medicine and equipment you need ready, and follow the doctor's advice strictly |

- **Sources.** Every line but the two marked **(กรมอนามัย)** cites the notice (`pcd-aqi-2566`, the Royal Gazette, `official`, read 19 Oct 2026) and Thai PBS, which prints its table word for word while quoting the PCD Director-General (`pcd-aqi-thaipbs-2566`, `secondary`). The two marked lines cite the DOH (`doh-aqi-2566`: MGR Online quoting the DOH Deputy Director-General, 21 Oct 2023; InfoQuest carries the same statement), and say so where they are shown: "(กรมอนามัย)" in the tool, "— Department of Health (DOH)" on `/en/air`.
- **The bands are verified** in the primary text (Table 2 and clause 4.1(1)), and two agencies give the same five: the PCD (the notice, Thai PBS) and the DOH (MGR Online, InfoQuest). The DDPM (Matichon, Feb 2024) gives the same four lowest.
- **Masks.** Neither agency's advice per level names N95: the PCD says "หน้ากากป้องกัน PM2.5", the DOH "หน้ากากป้องกันฝุ่น". The tool says "หน้ากากป้องกัน PM2.5". N95 is in the dust guide and lessons, from THE STANDARD's report of 1 Apr 2026 quoting the DOH (`doh-dustroom-2569`, §22.4).

**The two agencies differ** (research conflict 1, §32.8):

| Level | The PCD's notice | The DOH (21 Oct 2023) |
|---|---|---|
| เขียว, people at risk | watch for symptoms | avoid outdoor activity or exercise; watch your health |
| เหลือง, everyone | spend less time on hard outdoor activity | avoid outdoor activity; watch your health |
| แดง | people with a chronic illness stay in an air-pollution safe area | everyone stays in a dust-free room |

The DOH is stricter at the lower levels; its green advice for people at risk ("avoid") is even stronger than its yellow advice for them ("spend less time"), as published. **The decision:** the PCD's notice is the main text, because it is the legal notice, the one Air4Thai follows, and it separates the general public from the people at risk. The DOH's lines are added only where they add something the notice lacks (medicine and equipment ready at orange; a dust-free room for everyone at red), and each is named on its line. The two sets' green and yellow lines are never mixed ([GUIDELINES rule 81](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES #76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red), [LESSONS B14](LESSONS_LEARNED.md#b-safety-content-and-research)).

**The unit question.** Apps show either µg/m³ or an AQI number, and the same number means different colours: AQI 152 is orange, 152 µg/m³ is red. So the tool asks which it is, remembers the answer, and calls the AQI "AQI ของไทย". Apps from abroad (the US AQI, for example) use a different scale, so the tool asks for the PM2.5 figure instead ([GUIDELINES rule 79](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS A7](LESSONS_LEARNED.md#a-product-and-audience)).

**The answer** (`airAdvice()`):

1. A badge with the colour, the level ("ระดับแดง · มีผลกระทบต่อสุขภาพ") and its band in the chosen unit ("75.1 มคก./ลบ.ม. ขึ้นไป").
2. "ทุกคนในบ้าน" ("Everyone at home"): `all`.
3. If anyone is ticked, "สำหรับเด็กเล็ก และคนมีโรคประจำตัว" ("For young children and people with a long-term illness", from the ticked groups' `short` names): `risk`, or "ทำแบบเดียวกับทุกคนในบ้าน" ("The same as everyone at home") where the level has none.
4. If ❤️ is ticked, "เพิ่มเติมสำหรับคนมีโรคประจำตัว" ("Also, for people with a long-term illness"): `chronic`.
5. If nobody is ticked and the level has lines for people at risk, a hint: "กลุ่มเสี่ยง (เด็กเล็ก ผู้สูงอายุ คนท้อง คนเป็นโรคหัวใจหรือโรคทางเดินหายใจ) ต้องระวังมากกว่านี้ ติ๊กด้านบนถ้าในบ้านมี".
6. The agencies of the lines shown.

After a number is entered (the field's `change`: on leaving it or pressing done on the keyboard) or a colour is picked, the answer scrolls into view, smoothly unless reduced motion is on.

**Buttons:** "🌐 ดูค่าฝุ่นใน Air4Thai" (the dust mode's `link`, the same one the start screen shows in the dust season); 📤 ส่งให้คนที่บ้าน (the text: "ฝุ่นตอนนี้ 82.4 µg/m³ สีแดง · มีผลกระทบต่อสุขภาพ", the lines shown, the agencies and the `/air` link); "😷 วิธีป้องกันฝุ่นในบ้าน 10 ข้อ" (the dust guide: `kit.js` dispatches a `brm:guide` event, and `main.js` opens the guide with the label `tool`); ปิด.

**Who is at home, and what is kept.** On the first open the ticks come from the home check's answers in `brm:kit` (`groups[].from`: `baby` → 👶, `elder` → 🧓, `meds` → ❤️; nothing maps to 🤰). It is a starting guess: "older or bedridden people" and "daily medicine" are close to, not the same as, "over 60" and "a long-term illness", so the person can change the ticks. From then on `brm:air` = `{unit, groups}` keeps the kind of number and the ticks. The reading itself is never stored and never sent.

### 32.4 The pills

Under the home check's daily-medicine line (`meds`, shown only when "💊 มีคนกินยาประจำ" is ticked) there is a closed section, "💊 ยาพอกี่วัน? ลองคำนวณ" ("How many days will the pills last?"), with two number fields, "ยาเหลือกี่เม็ด" ("Pills left", whole pills) and "กินวันละกี่เม็ด" ("Pills a day", in halves), and one line under them:

- "⏳ พอ 4 วัน ให้พอ 7 วัน ต้องมีอีก 5 เม็ด" (9 left, 2 a day), or
- "✅ พอ 7 วัน ถึง 7 วันแล้ว" (14 left, 2 a day).

`medDays({ left, perDay, target })` in `kitplan.js`: days = ⌊left ÷ pills a day⌋; more needed = ⌈pills a day × target − left⌉, at least 0. The target is the home check's own line (`items.meds.qty.days`, 7 days, `moph-7days`, ⚠️ a 2013 figure, [KNOWN_ISSUES #57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)). It is arithmetic only, with no dose or medical advice. A part pill counts as one: 3 left at half a pill a day last 6 days and need 1 more for 7. One medicine at a time ("ใส่ทีละตัวยา ดูว่าพออย่างน้อย 7 วันไหม"). Pills a day must be more than 0 and at most 50. Nothing typed is kept or sent.

### 32.5 Integration

- **The start screen.** The hub has two more tiles; under the main guide button they make a 2 × 2 grid: 🎒 เช็กของจำเป็น, 📝 แผนครอบครัว, 🥛 ไฟดับ: ตู้เย็น ("ยังกินได้อีกกี่ชั่วโมง", or the running count, §32.2) and 😷 ฝุ่นวันนี้ ("ค่าเท่านี้ บ้านเราทำอะไร"). The first three tools stay on the first screen at 320 × 460 and 360 × 640 (smoke-checked); the new row comes next, below the first screen at 320 × 460, by design ([KNOWN_ISSUES #77](KNOWN_ISSUES.md#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones)).
- **One map of tools.** `main.js` has one `TOOLS` map (`kit` 🎒, `plan` 📝, `fridge` 🥛, `air` 😷) for routing (`/?open=<id>`, and the tools' pages opened offline), the hub, the guide sheets' next steps and the result buttons; `toolName()` takes each name from `hub<Id>`. `openTool()` loads `kit.js` on first use, as before (§28.9).
- **The hazards that offer them** (`config.json → hazards.<h>.tools`; the build allows `kit`, `plan`, `fridge` and `air`):

| Hazard | `tools` |
|---|---|
| `flood` | `kit`, `plan` |
| `dust` | `air` (new) |
| `fire` | none |
| `outage` | `kit`, `plan`, `fridge` (new) |
| `storm` | `kit`, `plan`, `fridge` (new) |
| `landslide`, `quake`, `heat` | `kit`, `plan` |

  The list puts the links on the hazard's page (`/pm25` → `/?open=air`; `/ready` and `/storm` → `/?open=fridge`, with `seo.<lang>.toolFridge` and `toolAir`), the buttons under "เตรียมบ้านต่อ" in the hazard's guide sheet, and a button on the result screen of the hazard's modes (`data-result-tool`): "🥛 ไฟดับ: ตู้เย็น" after a power-cut round, beside the 🎒 home check, and "😷 ฝุ่นวันนี้" after a dust round. The storm has no game, so its guide and its page offer the fridge tool.
- **Pages.** `/fridge` and `/air` (and `/en/…`) are written by the build like `/kit` (§29.9): the H1 and an intro, a button into the tool (`/?open=fridge`, `/?open=air`), then every part or level with its figures and sources (the fridge's parts with "เก็บได้ราว 4 ชม." and what to do after; the five dust levels with both bands and the lines for everyone, people at risk and a long-term illness, the DOH's named). Each has its own link preview: `og/fridge.png` in the power-cut look and `og/air.png` with the masked gecko, and their `og/en/` twins. `fridge` and `air` are reserved names, so no hazard slug can take them. Opened offline before they were ever visited, the pages open their tool (as `/kit` does since v1.9.1, §30.7).
- **Search and AI search.** The sitemap has 28 addresses (the 24 of v1.9.0, plus `/fridge`, `/air` and their twins). `llms.txt` lists every tool on one line, "Family tools that run on the device; nothing typed is sent: …", with each tool's `?open=` link and its page; `/learn` links all four.
- **The installed app.** Two more shortcuts in `manifest.webmanifest`, five in all: "ไฟดับ: ของในตู้เย็นยังกินได้ไหม?" (short "ไฟดับ ตู้เย็น") → `/?open=fridge&source=pwa` and "ฝุ่นวันนี้ บ้านเราต้องทำอะไร?" (short "ฝุ่นวันนี้") → `/?open=air&source=pwa`.
- **Events.** Two new anonymous events, in both allowlists (`functions/api/e.js`, `public/js/analytics.js`):

| Event | When | mode | label | value |
|---|---|---|---|---|
| `tool_open` | A calculator opens | `fridge` / `air` | `start` (the hub) / `link` (`/?open=…`, a page's button, a shortcut) / `result` (a result screen) / `guide` (a guide's next steps) | – |
| `tool_share` | A channel tapped under "📤 ส่งให้คนที่บ้าน" | `fridge` / `air` | `native` / `line` / `copy` | – |

  No reading, time, freezer answer, tick or count of people is in any event; two smoke checks read every `/api/e` body to prove it. The fridge's 🎒 button sends `kit_open` with the new label `fridge`. Queries: [05-metrics](05-metrics.md#calculators-v1100).
- **Texts about the whole app** (rule 59): the About intro and the privacy line (Thai and English; the privacy line now names the fridge and dust tools among what stays on the device), the default preview's description (`og`/`ogEn.defaultDesc`, also the start page's meta description), `seo.en.llmsSummary` ("calculators that work out what to do from the household's answers…"), the manifest's description and `package.json → description`. The tagline, `/learn`'s intro and the JSON-LD `about` don't name the calculators; they stay true as written. `seo.en.agencies` has the new agency: กรมควบคุมมลพิษ → "Pollution Control Department (PCD)".

### 32.6 Build checks

- **The fridge.** Each part has `label`, `ok` and `over` (and `left` where used) in Thai and English; `if` can only be `med`; `verify` is `verified` or `partial`; at least one known source; exactly one of `hours`, `hoursBy` (with every freezer option) or `days`. Every figure is a whole number, and every figure above 1 (4, 48, 24) must appear as a number on its own in the title or `note` of one of the part's sources. Every `always` line has known sources.
- **Dust today.** Each level has a `#RRGGBB` colour and at least one line for everyone; every line has Thai and English and at least one known source. For each unit the upper edges rise from level to level and the top level's is `null` (open). Every edge must appear in the sources of that level's lines: µg/m³ written to one decimal ("15.0", "37.5"), AQI as a whole number, not inside a longer number. Each group's `from` must be a home-check answer (`kit.json → flags`).
- **The hazards.** A `tools` entry must be one of `TOOL_IDS` (`kit`, `plan`, `fridge`, `air`).
- **Shown to fail** with a wrong figure: the fridge at 5 h, orange's edge at 70 µg/m³, green's AQI edge at 10; each stopped the build with a message naming the figure.
- **What it doesn't prove:** that the number means the same thing in the source, as for the home check (§28.8). A person still reads the source.

### 32.7 Checks: tests, a visitor walk and an independent cross-check

- **Unit tests** (3 new, 39 in all): "power cut: the fridge keeps 4 h, a full freezer 48 h, a half one 24 h, cold medicine a day (v1.10.0)"; "medicine: days the pills last and how many more make the home check's target (v1.10.0)" (10 left at 2 a day: 5 days and 4 more; 14: enough; 3 at half a pill: 6 days and 1 more; 0 a day, −1 or text: nothing); "dust today: the PCD bands to the decimal, AQI too, and who gets which lines (v1.10.0)" (13 µg/m³ readings around every edge, "82,4" with a comma among them; 8 AQI values; bad input gives nothing; a picked colour wins over a number; who gets which lines; every line has a source; the groups map onto the home check's answers).
- **Smoke checks** (19 new, 157 in all, at 360 × 640), passing on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027:
  - the pills: 10 left at 2 a day, "พอ 5 วัน ให้พอ 7 วัน ต้องมีอีก 4 เม็ด"; 14, enough; nothing typed is kept;
  - the fridge (9): 3 h 30 min off gives the fridge ⏳ about 30 min, a full freezer 44 h 30 min and cold medicine 20 h 30 min; the answer starts on the first screen; + gives 4 h 30 min, the fridge over (meat, fish, eggs, milk, leftovers) and half a freezer 19 h 30 min of its 24; the start time and answers are kept; controls ≥ 44 px; the start screen says "ไฟดับมา 4 ชม.แล้ว"; only `tool_open` and `tool_share` are sent, never the time; no page errors; `/fridge` and `/en/fridge` have every part with its source and a button into the tool;
  - dust today (9): who is at home starts from the home check (a small child, daily medicine); 82.4 µg/m³ is red, with no outdoor activities, the dust-free room named as the DOH's, and the lines for a long-term illness; Thailand's AQI 137 is orange, with the at-risk lines for young children; picking yellow clears the number and, with nobody ticked, shows the hint; controls ≥ 44 px; the kind of number and the ticks are kept, the reading is not; only counts are sent, never the reading; no page errors; `/air` and `/en/air` show the five colours with their bands and sources, and `/pm25` links the tool.

  Two older checks now cover the tools too: the hub check expects five buttons with the first three on the first screen at 320 × 460 and 360 × 640, and `/learn` and `llms.txt` must link all four tools.
- **A visitor walk** in headless Chromium at 320 × 568 (Thai), 360 × 640 (Thai), 390 × 844 (English), 768 × 1024 (Thai) and 1024 × 1366 (English): the start screen, the fridge, dust today (82 µg/m³), the pills (9 left, 2 a day: "พอ 4 วัน ให้พอ 7 วัน ต้องมีอีก 5 เม็ด"), `/air` and `/fridge`. No sideways scrolling, no control under 44 px, no page or console errors. One screenshot of a sheet looked like a broken overlay; it had been taken during the sheet's 0.22 s slide and fade-in (`sheet-in`), and one taken after it was fine ([LESSONS D22](LESSONS_LEARNED.md#d-testing-and-verification)).
- **axe-core:** nothing on the fridge sheet, the dust sheet, `/air` or `/fridge`; on the start screen only the wordmark's coral half, as before ([KNOWN_ISSUES #51](KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- **An independent cross-check.** A scratch script written from the sources, not from `kitplan.js` (its own table of bands, its own rounding, its own hours), was compared with the app's answers: 35 of 35 dust readings got the notice's colour (25 in µg/m³ on both sides of every edge, such as 15.04 → blue, 15.05 → green, 37.55 → orange and 75.05 → red, and 10 AQI values), and 8 of 8 fridge times (0.5 to 48.5 h, a full and a half-full freezer, cold medicine) got the status the sources' hours give ([LESSONS D21](LESSONS_LEARNED.md#d-testing-and-verification)).
- **Not run:** real phones ([ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix), rows 64–66); `npm run probe` (no item, slot or water change).

### 32.8 Research record (19 Oct 2026)

A research agent read the agency texts and the news that quotes them while the lead built the fridge tool from the sources already in the repository. A quote counted as read only when it was checked against the downloaded page, not a summary. The notes were a scratch file of the session; what matters is below and in the sources' `note`s.

**Read:**

- **The Royal Gazette PDF of the PCD's notice** (ประกาศกรมควบคุมมลพิษ เรื่อง ดัชนีคุณภาพอากาศของประเทศไทย พ.ศ. 2566; vol. 140, special part 157 ง, pp. 3–6; signed on 16 May 2023 by the PCD Director-General, Pinsak Suraswadi; published on 3 Jul 2023; it replaces the notice of 24 Sep 2018): Table 2 (the bands), clause 4.1(1) (the continuous 24-hour average, one decimal, rounded by the usual rule), clause 3 (five levels, AQI 100 equal to the standard), clause 2 (who is at risk; the general public; an "air-pollution safe area", a room prepared in a public building or a home), and Table 1 (what to do). The PDF's text drops the vowel ำ when it is extracted ("ทากิจกรรม"); Thai PBS prints the same table with it, which confirms the wording.
- **Thai PBS 329386** (5 Jul 2023, quoting the PCD Director-General): the new bands with the old ones in brackets, and the notice's advice word for word (one typo, กำจัด for จำกัด).
- **MGR Online 9660000094860 and InfoQuest 2023/344790** (21 Oct 2023, the DOH Deputy Director-General, Dr Atthaphon Kaewsamrit): the same bands, and the DOH's own advice per colour.
- **Matichon** (15 Feb 2024, the DDPM): four bands (no red) and simpler advice.
- **The heat index:** two pages on the TMD's own site (7 Mar 2024 and 21 Apr 2023), Post Today (11 Mar 2024), InfoQuest quoting the BMA (3 May 2026), Thai PBS 504055 (31 Mar 2026), the TMD's 2012 explainer PDF and a TMD Northern Meteorological Centre sheet of 2019.

**Could not be reached on 19 Oct 2026:** pcd.go.th's news (connection reset; 503 through a fetch tool), the DOH's PM2.5 guideline PDF on hia.anamai.moph.go.th (the same), air4thai.pcd.go.th (its TLS certificate chain couldn't be verified; checking wasn't turned off), rnd.tmd.go.th (503), thairath.co.th and hfocus.org (403); tmd.go.th/forecast/heatindex returned only the page shell. A PCD news page, "ค่ามาตรฐาน PM2.5 ใหม่ บังคับใช้แล้ววันนี้ (1 มิ.ย. 66)", was seen in search results only.

**Conflicts recorded:**

1. The PCD and the DOH differ at green, yellow and red (§32.3).
2. Thai PBS 327288 (3 May 2023, before the notice) prints the 2018 advice and a green range "15-125": not used for advice.
3. The green band's lower edge: Thai PBS writes 15–25; the Gazette, the DOH and the DDPM 15.1–25(.0). The tool uses 15.1.
4. The repository's PPTV 2022 source has the old scale (orange 51–90, red over 91); it was already flagged and isn't used for numbers.
5. The heat-index bands, old and new; the wording of the top band; the advice per level by agency; and the formula (below).

**Food in a fridge in a power cut.** No Thai agency source (กรมอนามัย, อย., กรมวิทยาศาสตร์การแพทย์, PEA or MEA) after two targeted searches. Found instead: a media article reposted on LINE Today with 4 h and 48 h and no agency named (not usable), a Thai-language leaflet from the health department of Victoria, Australia (foreign advice), and the US FoodSafety.gov and CDC figures already in `sources.json`. So the hours stay ⚠️ international ([KNOWN_ISSUES #74](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only)).

**The heat index, for a calculator not built yet** ([ROADMAP P10](ROADMAP.md#p10-more-calculators), [KNOWN_ISSUES #78](KNOWN_ISSUES.md#78-a-heat-index-calculator-is-not-built)):

| Level | Colour | Heat index, °C | Where it was read |
|---|---|---|---|
| เฝ้าระวัง (watch) | green | 27.0–32.9 | Post Today, InfoQuest (the BMA), Thai PBS |
| เตือนภัย (warning) | yellow | 33.0–41.9 | the same three |
| อันตราย (danger) | orange | 42.0–51.9 | **the TMD's own site** (the DOH and TMD press conference of 7 Mar 2024), and the same three |
| อันตรายมาก (extreme danger) | red | 52.0 and over | Post Today ("from 52"), InfoQuest and Thai PBS ("over 52"); the danger band ends at 51.9, so 52.0 and over |

- **The scheme** is the DOH's and the TMD's (2024), in four levels; the TMD's page gives the level names and the danger band, and the news gives all four. The index is "computed from air temperature and relative humidity" (the TMD, 2023 and 2024). The TMD publishes the expected maximum by region on Mondays, Wednesdays and Fridays.
- **The formula.** The TMD's 2012 explainer, "ดัชนีความร้อนคืออะไร" (arcims.tmd.go.th), prints the US NWS table and the Rothfusz regression with the NWS coefficients (T in °F, relative humidity in %). Whether the current TMD product uses it, and with which adjustments at low values, is **[unverified]**: the TMD's heat-index pages answered 503. Two academic works using TMD data say "Steadman" (seen in search results only).
- **Old bands still in print.** The 2012 explainer has 27–32 / 32–41 / 41–54 / over 54 (the NWS's); the TMD Northern centre's 2019 sheet 27–31 / 32–40 / 41–54 / over 54 (citing the DOH); MGR Online's science page (13 Apr 2024) still prints the NWS-style bands. Use the 2024 bands only.
- **Advice per level differs by agency, without contradicting.** The BMA: at warning, cut outdoor activity from 11:00 to 15:00 (the BMA alone says this), at danger watch yourself for symptoms, at extreme danger stop outdoor activity completely. The DOH: at danger, spend less time outdoors. Thai PBS: at extreme danger, a hat, sunglasses and breathable clothes if you must go out.
- **People at risk in the heat** (the TMD's page, 2024): young children, older people, people with a chronic illness, people with obesity, people who drink alcohol, and people who work or are active outdoors for long periods.
- `tmd-heatindex-posttoday-2567` and `bma-heatindex-2569` in `sources.json` already point at the Post Today and InfoQuest pages; their bands were checked on the pages on 19 Oct 2026.

### 32.9 Budget and code

- **Budget:** start screen **253 KB** compressed (243 in v1.9.2), first game screen **268 KB** (258), against 500 KB. Most of the 10 KB is the tools' code, which the budget counts as start-screen weight although it loads only when a tool opens ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)): `kit.js` is 11.0 KB with `gzip -9` (37.0 KB raw; 5.8 KB in v1.9.0) and `kitplan.js` 1.9 KB (4.3 KB raw). `kit.json`, 9.1 KB (41.6 KB raw), isn't counted: it is fetched when a tool opens. Still 44 files precached: `kit.js`, `kitplan.js` and `kit.json` were already in the precache, so the calculators work offline after one visit, and `/fridge` and `/air` open their tool offline.
- **Code:** `kit.js` (`openFridge`, `openAir`, the pills in the home check's list, `textShare`, `span`), `kitplan.js` (`fridgePlan`, `medDays`, `airLevel`, `airAdvice`), `main.js` (`TOOLS`, `toolName`, `openTool`, the fridge tile's line, `data-result-tool`, the `brm:guide` listener), `app.css` (the 2 × 2 hub, the stepper's time, the statuses, the swatches, the dust badge), `tools/build.mjs` (`TOOL_IDS`, the checks of §32.6, the `/fridge` and `/air` pages, the sitemap, `llms.txt`), `tools/render.html` (the two previews), `functions/api/e.js` and `analytics.js` (the two events).
- **Content:** `kit.json → fridge` and `air`, and 54 new `ui` texts (96 per language); `strings.json` (`hubFridge…`, `hubAir…`, `seo.<lang>.toolFridge`, `toolAir`, `fridgePage…`, `airPage…`, `og`/`ogEn` `fridge…` and `air…`; 281 keys per language); three sources (112 in all); `config.json → hazards.<h>.tools`; the manifest. Version 1.10.0.

# Knowledge base

A reference for anyone maintaining บ้านรอดไหม?. It covers every rule, constant and formula in the game, the content model, the platform facts the design depends on, and the research behind it.

Facts are as of **12 Oct 2026** (the research in §13–§15 was compiled on 6 Oct 2026). Where a fact comes from outside this repository, its source is linked. Anything marked **[unverified]** could not be confirmed from a primary source.

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
| `p-petkit` | 15.9–26 s | `p-numbers` | 55.6 s |
| `p-waterfood` | 15.9 s – never | `p-plan` | 58.4 s |
| `p-car` | 18 s | `p-breaker` ★ | never (its answer changes at 27 s) |
| `p-drain` | 19.6 s | `p-toilet`, `p-fuel` | rooms not playable yet |
| `p-lpg` | 21.3 s | | |
| `p-phone` | 26.4–48 s | | |

★ = critical. The range comes from the possible slots: an item on the floor goes under earlier than the same item on a table.

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

**Statuses:** `correct` (blue ✓), `learned` (orange !), `flooded` (grey, Prepare), `missed` (grey ?). In the share text these become ✅ 💡 💧 ⬜, in target order: room by room, left to right.

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
3. **Prepare:** one critical item is chosen first, at random, so the bonus can always be earned.
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
| `id` | string | `p-…` (Prepare) or `r-…` (Return). Unique across items and decoys. |
| `mode` | `"prepare"` / `"return"` | |
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
| `disabled` | bool | Optional: leave the item out without deleting it |

### `items.json` → `decoys[]`

`{id, mode, room, sprite, size, slots, name{th,en}, note{th,en}}`. `note` is what the gecko says when someone taps it.

### Other files

- **`rooms.json`:** `{id, order, enabled, art, name{th,en}, slots: [{id, x, y, tags[]}]}`. Slots must lie inside the 360×600 scene.
- **`sources.json`:** `{<id>: {agency, title, url, date?, kind, note?}}`.
  - `kind` is one of: `official` (the agency's own site), `government` (a กรมประชาสัมพันธ์ repost) or `secondary` (news quoting the agency).
  - Totals: 57 sources, of which 30 official, 9 government, 16 secondary and 2 academic (a university statement and a peer-reviewed study, used only for `r-stagnant` and always flagged ⚠️).
- **`strings.json`:**
  - `th` and `en` UI strings (130 keys each, the same keys in both). Placeholders look like `{score}`, `{rank}`, `{grid}` and `{url}`. `logoA` / `logoB` are the two halves of the wordmark (Thai "บ้าน" + "รอดไหม?", English "Baan " + "Rod Mai?"); `langSwitch` is the label of the language button.
  - `og`: Thai link-preview texts, and `ogEn`: their English twins (the build fails if a key is missing from `ogEn`). Both are used by the build and by the image renderer.
  - `seo`: the lessons pages and `llms.txt` text (`th`, `en`, `en.agencies` = English names of the source agencies, and `updated`).
- **`checklists.json`:** `prepare` and `return`, each `{title, items: exactly 10 × {icon, th, en, sprite?}}`.
- **`helplines.json`:** `{number, main, who{th,en}, what{th,en}, source}`. Numbers have 3–5 digits. `main: true` puts the number on the cards.
- **`config.json`:**
  - `rainWarningActive`, `forecastAppUrl`, `forecastStatusUrl`, `siteUrl`, `houseVersion`
  - `round` (section 3)
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

**Warnings only:**

- missing English strings
- `unverified` items
- too few playable items
- placeholder URLs

**2. Site URL.** The first of these that is set: `SITE_URL` env → `config.siteUrl` (if not a placeholder) → `CF_PAGES_URL` → `https://[DOMAIN]`. On Cloudflare the `SITE_URL` variable doesn't exist (see §10), so the live value is `config.siteUrl` = `https://baanrodmai.autobahn.bot`.

**3. Link-preview pages.** It rewrites the Open Graph block between `<!--OG:START-->` and `<!--OG:END-->` in `index.html`. That block now also holds the `<link rel="canonical">` and, on `index.html`, the JSON-LD. It then writes 22 challenge pages (`c/{p,r}{0..10}.html`, *without* `og:url`) and 2 checklist pages, and the English set: `en/index.html` (the app shell in English), 22 `en/c/…` pages and 2 `en/checklist/…` pages. That is 49 generated pages in all.

**3b. SEO and AI-search files.** It writes `learn.html`, `en/learn.html`, `robots.txt`, `sitemap.xml` and `llms.txt` from the content JSON (§16, §18). The build fails if `strings.json → seo` is incomplete or `seo.updated` isn't `YYYY-MM-DD`.

**4. Service worker.** It fills `tools/sw.template.js` with the precache list (39 files, including `/en/`) and a version: the first 10 hex characters of the SHA-256 of those files.

**5. Budget.** It sums the gzipped start-screen files (fonts counted as-is) and fails above 500 KB. Currently **183 KB**, or **197 KB** including the first room and the sprites (v1.5.0).

**6. `--docs`.** Regenerates the table, flags and references in `docs/01-safety-content.md` from `items.json` and `sources.json`.

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
| `/content/*.json` | Network first with a 2.5 s timeout, so safety fixes arrive quickly; then the cache |
| Everything else (same origin) | Stale-while-revalidate |
| `/api/*`, other origins, non-GET | Not handled |

- **Install** precaches the 39 files and calls `skipWaiting()`.
- **Activate** deletes old `brm-*` caches and claims open clients.
- **Registration** happens after `load`. Boot checks `document.readyState`, so it also registers when boot runs late.
- **iOS in-app browsers** never run it. See [KNOWN_ISSUES #16](KNOWN_ISSUES.md#16-no-offline-play-inside-ios-in-app-browsers).

**localStorage** (prefix `brm:`, wrapped in try/catch) holds only:

- `howto-prepare`, `howto-return`
- `best`, `streak`, `plays`
- `lang`, `muted`

## 8. Sharing system

**Challenge URL.** `/c/{p|r}{score}?h={houseKey}`, for example `/c/p8?h=20261007` (English players use `/en/c/p8?h=20261007`; `parseChallenge()` accepts both, and the house is identical). `parseChallenge()` reads the mode, score and key, and ignores any extra query such as `fbclid`. Pages serves `/c/p8` from `c/p8.html` with a 200, and redirects `/c/p8.html` and `/c/p8/` with a 308 that keeps the query.

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
  - `POST /api/e` takes at most 4,096 bytes and 25 events, cleans every field to `[\w\-.:]` and writes one Analytics Engine data point per event: `indexes: [name]`, `blobs: [name, mode, label]`, `doubles: [value]`.
- **Sampling:** `config.analytics.sampleRate` decides once per page load whether this player is counted. The SQL uses `SUM(_sample_interval)`, so totals stay correct.
- **Language in the numbers:** only the `lang` event (label `th` / `en`) records language, when someone toggles it. Events don't say which address a visit came through. Cloudflare Web Analytics counts `/en/…` paths separately from `/…` paths, which is the simplest split of English and Thai traffic ([05-metrics.md](05-metrics.md)).
- **No IP, user agent, ID, cookie or location is stored.** Scores stay in `localStorage`. There is nothing to ask consent for under the PDPA. The About sheet says this in Thai and English.

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

The full table of 43 items with their sources is in [01-safety-content.md](01-safety-content.md). These are the rules that shaped the game mechanics:

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
| 1669 | Medical emergency (สพฉ.) |
| 1555 | Bangkok (BMA), also via Traffy Fondue |
| 1130 | MEA (Bangkok, Nonthaburi, Samut Prakan) |
| 1129 | PEA (other provinces) |
| 1323 | Mental health (กรมสุขภาพจิต) |

Left out on purpose:

- **192** looks wrong; use 1784.
- **199** (fire) is cited only by news.

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
| 78% mobile, 74% Android, in-app browsers dominate | 151 KB start, no login, works in LINE/FB/TikTok with fallbacks, offline after the first visit |
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
| `/learn` | `items.json`, `rooms.json`, `sources.json`, `checklists.json`, `helplines.json`, `strings.json → seo` | 43 articles (one per enabled item, ordered by mode then room) after an index by topic (`#t-health` and so on), each with the correct action, tip, reason, the wet-house variant, and linked sources. The 9 partly verified items carry "⚠️ under review". About 50 KB, 17 KB gzipped. No script. |
| `/llms.txt` | same, plus `seo.en.llmsSummary` | Markdown per [llmstxt.org](https://llmstxt.org). It's an informal proposal; **no major search engine is confirmed to use it [unverified]**. It costs nothing and is read by some AI tools. |
| `/sitemap.xml` | `/`, `/en/`, `/learn`, `/en/learn`, with `seo.updated` as `lastmod` and `xhtml:link` language alternates | The `/c/*`, `/checklist/*` and `/en/c/*` share pages are left out on purpose: they are copies of the app shell. |
| `/robots.txt` | generated | `Allow: /`, `Disallow: /api/`, `Sitemap:`. Search and AI crawlers aren't blocked. |
| `<link rel="canonical">` and `hreflang` | the OG block | `/` → `/`, `/learn` → `/learn`, `/en/` → `/en/`, `/en/learn` → `/en/learn`; the 24 Thai share pages → `/` and the 24 English ones → `/en/`. Each indexable page lists its twin with `hreflang` (§18). |
| JSON-LD on `/` and `/en/` | `og` / `ogEn` strings | `WebSite` and a `VideoGame`/`WebApplication` (free, 1 minute, Thai and English, about flood safety). |
| JSON-LD on `/learn` and `/en/learn` | `sources.json` | `Article` with a `citation` list of the 51 sources actually used. |
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

**Which language a visitor gets** (`content.js`):

1. `?lang=en|th` in the address, then
2. an `/en` path, then
3. the player's earlier choice (stored), then
4. a first-visit guess (`guessLang`): **Thai** if any browser language is Thai **or** the device clock is on `Asia/Bangkok`; otherwise **English**.

The time-zone rule matters: many Thais set their phones to English, and the game's main audience must not be switched away from Thai. Whenever the language changes, the address bar switches between the Thai and English address (`langPath`, `history.replaceState`), so a copied link opens in the same language.

**Search signals**

- `hreflang` links on `/`, `/en/`, `/learn`, `/en/learn` and the checklist pages: `th`, `en`, and `x-default` → English (for people whose language is neither).
- `sitemap.xml` lists the four indexable pages, each with its `xhtml:link` alternates, as Google documents for multilingual sites.
- Separate JSON-LD for the English pages (`inLanguage: en`, English description).
- The English share pages' canonical is `/en/`; the Thai ones' is `/`.

**Social previews**

- `og:locale` (`th_TH` or `en_US`) plus `og:locale:alternate`, and `twitter:image:alt` on every page.
- 25 English preview images in `public/og/en/` (default, 22 challenge scores, 2 checklists), drawn by the same canvas code from `strings.json → ogEn`. The wordmark follows the language: Thai "บ้านรอดไหม?" or English "Baan Rod Mai?" (`strings.json → logoA/logoB`), on the start screen, the result card, the checklist image and every preview image; the canvas shrinks it to fit. The English default image reads *"Will the house survive? A 60-second flood game"* under it.
- English share texts carry `#BaanRodMai #FloodSafety`; the Thai ones keep `#บ้านรอดไหม`.

**Honesty for an international audience.** The advice comes from Thai agencies and the hotlines are Thai numbers. The English help sheet, `/en/learn`, the checklist preview and `llms.txt` say so and tell people outside Thailand to follow their local authorities and emergency number. **No foreign numbers were added**, because none were verified.

**The wordmark.** The two-colour title is drawn from `strings.json → logoA/logoB` in the page, on the result card, on the checklist image and on every preview image (`cards.js → logo()`; the canvas shrinks it to fit when the English words are wider than the space). The static `/en/` page carries the English text, so it never flashes Thai.

**How to add a language** (what it would take; only Thai and English exist): add a table next to `th`/`en` in `strings.json` and every `*.en` object in the content files, an `og` twin and `seo` block, agency names, a `logoA/logoB` pair, a path prefix and `hreflang` entries in `build.mjs`, preview images in `tools/render.html`, and rows in the test matrix. See [KNOWN_ISSUES #37](KNOWN_ISSUES.md#37-the-international-version-is-english-only-with-thai-advice-and-hotlines).

## 19. The water-level link (BKK FloodWatch)

- `config.json → forecastAppUrl` is `https://flood.autobahn.bot/`: **BKK FloodWatch**, canal and river water levels across Thailand, the owner's own Autobahn Bot project (confirmed 11 Oct 2026).
- The "เช็กระดับน้ำล่วงหน้า" / "Water levels" button shows on the start screen, the result screen and the help sheet, only when this is a real `https://` address (`forecastUrl()` in `content.js`). It opens in a new tab and is counted as `forecast_click`.
- `flood.autobahn.bot` is a different live site: **never redirect it to the game**. Both sites sit on `autobahn.bot` and can link to each other.
- Optional and not set: `forecastStatusUrl`, a small endpoint returning `{"rainWarning": true|false}` with CORS, so the start screen could pick the recommended mode from live data ([KNOWN_ISSUES #13](KNOWN_ISSUES.md#13-forecaststatusurl-needs-cors-and-a-fast-answer)).

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
- **Featured topic:** `config.featuredTopic` (`"health"` now, or `null`). The start-screen card links to `/learn#t-<topic>` (event `learn_open`) and opens the book on the topic; the book's "play" button picks the mode with the most lessons left to find in that topic.
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

The month table is ours, not an agency's ([KNOWN_ISSUES #47](KNOWN_ISSUES.md#47-the-season-calendar-is-editorial)). `seasonalMode(month, rainWarning)` in `modes.js`: a rain warning → `prepare`; else the first non-flood mode whose `months` include the month; else `return`.

### 22.3 The mode registry

Each mode is one entry in `config.json → modes` (defaults in `public/js/modes.js`): `id`, `hazard`, `code` (challenge letter: `p`, `r`, `d`, `f`; `h` kept for heat), `threat`, `prop`, `emoji`, `icon`, `months`, `topic`, `link`, `bonus`. Per-mode strings are `<base><Mode>` (for example `rankDust`); `tm(base, mode)` uses the mode's key if it exists, else the shared one, so a mode only overrides what differs. House seeds are `${mode}|${houseKey}|v${houseVersion}`, so a new mode never changes another mode's houses. How to add one: [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode).

| Threat | Drawn as | Loses an item when | Config |
|---|---|---|---|
| `water` (prepare) | A waterline rising from the floor | the line reaches the item's centre | `water` keyframes, `floorWetY` |
| `smoke` (fire) | A grey band with a wavy edge falling from the ceiling | the edge reaches the item's centre (high items first) | `smoke` keyframes (y of the edge: −30 → 60 → 230 → 330 over 55 s), `lowY` 230 (the gecko says "crawl low") |
| `haze` (dust) | A full-room tint with drifting specks, opacity 0.06 → 0.64 | never; the clock is the pressure | `haze` keyframes |
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


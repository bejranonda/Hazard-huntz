# Changelog

This project uses [semantic versioning](https://semver.org/). Each release is tagged `vX.Y.Z` on `main` once its Cloudflare deploy has been checked.

## [Unreleased]

## [1.8.1] — 2026-10-19

A whole-app visitor audit after v1.8.0. Every screen, sheet, card and page was walked as a visitor, in Thai and in English, at 320 × 460 and 360 × 640; each finding was fixed, measured and walked again ([APPROACH §26](docs/APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)). The release also ties the home check and the plan card into the flood pages, `/learn`, `llms.txt` and the installed app. No item, room, slot or `houseVersion` changed, so houses and challenge links are the same and no midnight release is needed.

### Fixed

- **The start screen still described three hazards.** The tagline (`strings.json → tagline`, th/en, and the static text in `index.html`, which every generated page copies) still said "จากน้ำท่วม ฝุ่น และไฟ" / "from floods, dust and fire" after the power cut (v1.7.0). It now reads "เกม 60 วิ ดูแลบ้านให้รอด จากน้ำท่วม ฝุ่น ไฟไหม้ และไฟดับ" / "A 60-second game to keep your home safe from floods, dust, fire and power cuts", and `manifest.webmanifest → description` adds "รับมือไฟดับ". The Thai `<title>` of `index.html` was hand-written and missed ไฟดับ; the build now writes it from `og.defaultTitle`. The index JSON-LD `about` says "Power cut preparedness" (was "Power outage") ([KNOWN_ISSUES F42](docs/KNOWN_ISSUES.md#in-v181-19-oct-2026)).
- **One English, British.** The power-cut lessons and the home check said "flashlight" while the rest of the game says "torch", "power cut", "litres" and "nappies". Now "torch" or "torches" everywhere: `s-candle` (the right choice, both feedbacks, tip and why), `s-torch` (name, context, right choice, feedback, tip and why), `s-radio`'s why, the home check's `torch` line ("Torches with spare batteries"), two lines of the `stock` checklist, `geckoStartStock` ("It's getting dark. Where's the torch?") and `seo.en.hazardOutageDesc`. `s-candle`'s why says "in a power cut", not "in a power outage", and the top power-cut rank (`rankStock`) is "Ready for Any Power Cut" (was "Ready for Any Blackout"). No image needed re-rendering: the English checklist previews draw only titles, the challenge previews draw no rank, and the carousels are Thai (F43).
- **The home check said "house" and "home" in one sheet.** Its English title and card said "How ready is our house?" and its buttons "home". Now "How ready is our home?" (`ui.en.title`, `cardTitle`), and the card's call to action "How ready is your home? Check for free" (`cardCta`) (F44).
- **A card line could start with "!".** `tokens()` in `cards.js` takes words from `Intl.Segmenter`, which returns "!" as a segment of its own, so the English result card could break "The house copes" | "! Nearly…". Closing punctuation (`! ? , . : ; ) ] } % … ” ’`) and Thai ๆ and ฯ now stay with the word before. A new unit test wraps every ending, in Thai and English, at widths 60–300: the old code made 180 such breaks, the new code none (F45).
- **The English wordmark ran into the sun or moon on the result card.** On the themes that draw one at the top right (return, dust and the power cut, x 890–1030), "Baan Rod Mai?" now shrinks to fit W − 440 (640 px) instead of W − 160; the Thai wordmark is drawn as before (F46).
- **The home check's questions broke Thai words at 320 px.** The four answers sat two per row and wrapped mid-word ("มีเด็ก|เล็ก"). `.kit-flags` columns are now at least 150 px wide (was 140), so under about 360 px they stack in one column (F47).
- **The plan card's share sheet said "back to the list" but went back to the plan form.** Its button now reads "← แก้แผน" / "← Edit the plan" (`kit.json → ui.backPlan`) and returns to the form with what was typed (F48).
- **A plan card with a few fields filled had a big empty gap.** The card now draws all six fields every time; an empty one gets a dotted line, so a printed copy can be filled in by hand (`drawPlanCard`, F49).

### Changed

- **The home check names floods as well as power cuts.** Its intro reads "ตอบ 2 ข้อ แล้วดูว่าบ้านเราควรมีอะไรบ้าง ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน" / "Answer 2 questions and see what your home needs for a flood, a power cut or 3 days indoors", and its share text "บ้านเราพร้อมแล้ว {pct}% ถ้าน้ำท่วมหรือไฟดับ 3 วัน 🎒 …" / "Our home is {pct}% ready for 3 days of flood or power cut 🎒 …". The same 3-day amounts come from the flood-era Thai sources (กรมประชาสัมพันธ์'s 72-hour list, ปภ.).
- **The flood hazard has the tools too:** `config.json → hazards.flood.tools: ["kit", "plan"]`. `/flood` and `/en/flood` link the home check and the plan card under the FloodWatch link.
- **The result screen's 🎒 button follows the hazard's tools,** not the `dark` threat: a result offers "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" when its mode's hazard lists `kit` in `config.json → hazards.<hazard>.tools`. Prepare, return and power-cut results show it; dust and fire don't.
- Version 1.8.1 in `package.json`, `package-lock.json` and `config.json`. The build regenerated every page that copies the start screen (the tagline and the version chip) and the pages with the changed lessons.

### Added

- **`plan_open`,** an anonymous event when the plan form opens, labelled where from (`link`, or `kit` from the home check's list), in both allowlists (`public/js/analytics.js`, `functions/api/e.js`); "← แก้แผน" back to the form doesn't send it again. Before, only shares of the plan card were counted. `kit_open` from a result now carries that result's mode. Nothing typed is ever sent, and the smoke test still checks it.
- **`/learn` and `/en/learn` link both tools** after the checklists, and **`llms.txt`** has a line for them: "Two family tools that run on the device; nothing typed is sent: Check how ready your home is (free, 1 minute): …/?open=kit · Make your family plan card: …/?open=plan".
- **App shortcuts** in `manifest.webmanifest → shortcuts`: a long-press on the installed app's icon offers "บ้านเราพร้อมแค่ไหน?" (`/?open=kit&source=pwa`) and "แผนบ้านรอดของบ้านเรา" (`/?open=plan&source=pwa`). Not tried on a real phone yet **[unverified]** ([ROADMAP L6](docs/ROADMAP.md#l6-real-phone-test-matrix)).
- `kit.json → ui.backPlan` (42 interface texts per language, was 41).

### Tests

- 27 rule tests (+1): "card text: a wrapped line never starts with closing punctuation (every ending, both languages)": "The house copes! Nearly everything is ready" at 155 px, then every `cheer…` ending in Thai and English at widths 60–300 in steps of 5.
- 96 smoke checks (+3): "a flood result offers the home check (the hazard lists it in config.json → hazards.flood.tools)", "/learn and llms.txt link the home check and the plan card", and "plan card: "← แก้แผน" goes back to the form, with what was typed". Two checks look further: a hazard page with `tools` must link them (`/flood`, `/ready` and their English twins), and the privacy check expects `plan_open` beside `kit_open`, `kit_share` and `plan_share`.
- **The smoke test's 44 px check waits for a sheet to finish sliding in** (`ae51b31`). CI failed once on a docs-only commit (`51defd8`) because the About sheet's 44 px source links measured just under 44 px mid-slide in Chrome 153. `smallControls()` now waits for `#sheet`'s animations to end, allows 0.01 px of rounding and prints two decimals ([LESSONS D13](docs/LESSONS_LEARNED.md#d-testing-and-verification)).

### Checked

- Build: 81 items (+30 decoys), 73 sources, 121 link-preview pages, 81 lessons on `/learn`, 44 files precached, start screen **209 KB** compressed and first game screen **223 KB** (limit 500 KB), no warnings.
- `npm test`: 27 passed. `npm run smoke`: 96 passed on the pinned day, 18 Oct 2026, and 96 passed as 5 Dec 2026 (`SMOKE_DATE=2026-12-05`).
- axe-core: nothing found on the start screen (except the wordmark's coral half, [KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)), the home check's questions and list, the plan form, a power-cut result, `/ready`, `/en/ready`, `/flood`, `/learn` and `/posts`.
- `npm run probe` was not re-run: no item, slot or water setting changed. Houses and challenge links are unchanged.
- **Source health, no code change.** On 19 Oct 2026 `prd.go.th` (`prd-72h`, the 3 L per person per day behind `p-waterfood`, `s-water`, `s-radio` and the home check's water and radio lines) answered `curl` with a 301 to `prd.go.th` and then a 404, and headless Chromium with a 500 block page, even for its home page. It blocks automated readers, so whether the page still exists is unknown; a search engine's index still shows it with the 3-litre line. The owner opens it in a normal browser in Thailand ([ROADMAP L10](docs/ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons), [KNOWN_ISSUES #55](docs/KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)).

## [1.8.0] — 2026-10-19

Two tools for the family at home, built on the power-cut and flood lessons (ROADMAP N15): **"บ้านเราพร้อมแค่ไหน?" / "How ready is our house?"**, a home-kit check that works out what this household needs and how ready it is, and **"แผนบ้านรอดของบ้านเรา" / "Our family safety plan"**, a plan card to keep on every phone. What people answer, tick and type stays on their device. No item, room, slot or `houseVersion` changed, so houses and challenge links are the same and no midnight release is needed.

### Added

- **The home check, `/?open=kit`** (`/en/?open=kit`), in a sheet over the start screen:
  - **Two questions:** how many people live here (1–10, 3 to start, a − / + stepper with 52 px buttons) and who (any of 👶 small children, 🧓 older or bedridden people, 💊 someone on daily medicine, 🐾 pets). "คำตอบอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน" sits under them.
  - **The household's list:** 9 things every home gets, and up to 6 more by answer (15 in all). Amounts follow the household: drinking water 3 L × people × 3 days ("27 ลิตร (3 ลิตร × 3 คน × 3 วัน)"), dry and canned food "enough for 3 days for 3 people", a flashlight each, daily medicine for at least 7 days. Each line names its agencies, and the 9 items that are ⚠️ `partial` say "ข้อนี้อยู่ระหว่างตรวจทาน".
  - **Ticks and a meter:** "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)", and "แก้คำตอบ" to change the answers.
  - **Share:** a 1080 × 1350 card (`drawKitCard`) with a score ring, the gecko with a torch (cheering from 80 %), "มีแล้ว 3 จาก 9 อย่าง", up to 3 things still missing (everyday items before the household's own) or "ครบทุกอย่างแล้ว!", "บ้านคุณพร้อมแค่ไหน? เช็กฟรี" and the link `/?open=kit`. It uses the game's share sheet (native share, LINE, Facebook, copy, save).
- **The family plan card, `/?open=plan`** (`/en/?open=plan`): six short fields from `kit.json → plan`: the shelter or evacuation point near home, the family meeting place, who to contact if separated, who helps whom (twice), and medicine and must-haves. 40 characters each (60 for medicine), each with an example, most with a sourced hint ("ยาประจำตัวอย่างน้อย 7 วัน"), and the warning "อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น". **สร้างการ์ดแผนบ้านรอด** draws a 1080 × 1350 card (`drawPlanCard`) with the filled fields only, the date, the free helplines 1784 · 199 · 1669 · 1555 · 1130 · 1129 (`helplines.json`, `main`), "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน" and the link `/?open=plan`. Long entries shrink the rows together so all six fit.
- **Ways in:** a start-screen quick button, 🎒 "บ้านพร้อมไหม?" (`#kit-chip`), which reads "บ้านพร้อม 70%" once the household has checked; a button "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" on the result screen of the power cut (any mode whose threat is `dark`); two links on `/ready` and `/en/ready` (`config.json → hazards.outage.tools: ["kit", "plan"]`); the two deep links; and a button from the list to the plan card and back.
- **Files:** `public/content/kit.json` (the answers, the 15 items with their amounts and sources, the 6 plan fields, and 41 interface texts in each language), `public/js/kitplan.js` (pure and unit-tested: `kitPlan`, `kitScore`, `kitMissing`) and `public/js/kit.js` (the sheets, the two cards and sharing). `main.js` loads `kit.js` only when one of them opens (`import('./kit.js')`); if that fails offline, a toast says "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`).
- **A source, `readygov-plan`** (Ready.gov "Make A Plan", updated 1 Sep 2026, read on 19 Oct 2026, `international`), for the plan card's meeting place and contact. No Thai agency page on a family meeting place was found, so both fields are ⚠️. 73 sources (9 international).
- **Three anonymous events** in both allowlists (`public/js/analytics.js`, `functions/api/e.js`): `kit_open` (the label says where from), `kit_share` (the channel, with the score in % as the value) and `plan_share` (the channel). No answer, tick or typed text is ever sent.
- **Build checks for `kit.json`:** every item and every plan hint has sources that exist in `sources.json`; `verify` is `verified` or `partial`; `for` names a real answer; a plan field's `max` is 1–80; every number above 1 in an amount rule (`perPersonPerDay`, `perPerson`, `days`) appears in one of its sources' title or note; Thai and English for every label, hint, example and interface text. A hazard's `tools` may only be `kit` or `plan`, and each needs `seo.<lang>.tool<Kit|Plan>`.
- **Strings:** `kitChip`, `kitChipScore`, `kitFromResult` and `offlineTool` (233 keys per language, was 229), and `seo.<lang>.toolKit` and `toolPlan` for the hazard page.
- **Left out on purpose,** because no agency gives them: a fixed interval to re-check the kit ("every 3–6 months"), a 7-day stock target (Tokyo's alone; the check keeps 3 days, and 7 days only for daily medicine, from the MOPH), and the eating order fridge → freezer → canned.

### Changed

- **The quick buttons** under the start screen's modes are now two per row, with the icon beside the label (`min-height` 52 px, labels `clamp(12px, 3.9vw, 14px)`), so the four Thai labels stay on one line instead of breaking mid-word.
- **The About sheet's privacy text** (th/en) says the home check's answers and the plan card's text stay on the device and are never sent anywhere.
- `package.json → description` mentions power cuts, the home-kit checker and the family plan card.
- The service worker precaches 44 files (+ `kit.js`, `kitplan.js`, `kit.json`).
- **`readygov-kit`'s `note`** now quotes the page's "Additional Emergency Supplies" list (cash, prescription eyeglasses, infant formula, bottles and diapers, pet food and water), which the check's cash, glasses and baby lines rest on (read again on 19 Oct 2026).
- **`npm run docs`** counts the check's and the plan card's citations in docs/01's source list, so `readygov-plan` is no longer listed as "not cited yet".

### Fixed

- **The English checklist previews no longer say the advice is Thai.** `ogEn.checklistDesc` reads "A family checklist from government agency advice. Outside Thailand, follow your local authorities." The CDC, Ready.gov and the Tokyo Metropolitan Government are government agencies too. The Thai twin is unchanged. Page text only: the five `/en/checklist/…` pages were regenerated, no image changed ([KNOWN_ISSUES F41](docs/KNOWN_ISSUES.md#in-v180-19-oct-2026), was #56).

### Tests

- 26 rule tests (+1): "home check: amounts follow the household, special items follow the answers" (9, 27 and 90 litres of water for 1, 3 and 10 people, a flashlight each, food for 3 days; 0 and 99 people clamped to 1 and 10; each answer adds only its own items; daily medicine for 7 days; 0 % and 100 %; the card lists everyday items first).
- 93 smoke checks (+7), at 360 × 640 from `/?open=kit`: 4 people with daily medicine give 36 litres of water and list the medicine but not baby items; answers and ticks are kept in `brm:kit`; every control of the questions, the list and the plan form is 44 px or more; the check's card renders at 1080 px with LINE on the first screen; the plan card renders; the typed plan text (a meeting place and a phone number) appears in no `/api/e` body, while `kit_open`, `kit_share` and `plan_share` do; no page errors. New doc screenshots: `docs/screens/17-kit.png` (the list for 3 people at 33 %) and `docs/screens/18-plan-card.png` (a filled plan card).

### Checked

- Build: 81 items (+30 decoys), 73 sources, 121 link-preview pages, 81 lessons on `/learn`, `posts` 4 sets and 45 images, 44 files precached, start screen **208 KB** compressed and first game screen **223 KB** (limit 500 KB), no warnings. The build counts every file in `js/`, so the 8 KB include `kit.js` (about 5.5 KB compressed) and `kitplan.js` (0.8 KB), which the start screen loads only when the check opens ([KNOWN_ISSUES #59](docs/KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)).
- The plan card with all six fields at their maximum length (40 characters, 60 for medicine), in Thai and in English: every row and every character is drawn (a one-off probe in headless Chromium, 19 Oct 2026).
- `npm run probe` was not re-run: no item, slot or water setting changed. Houses and challenge links are unchanged.

## [1.7.0] — 2026-10-19

A fifth mode, **ไฟดับ (Power cut)**: stock up, keep the fridge shut, flashlights not candles. It was prompted by a Thai stockpiling infographic spreading on social media ("72 hours minimum, aim for 7 days", "eat old stock first", "when the power is out eat fridge → freezer → canned", "don't forget a manual can opener"). The infographic is not a source; the mode teaches only what agencies back up. Houses and challenge links in the other four modes are unchanged (a year of houses compared identical).

### Added

- **The power-cut mode** in the registry: `{ id: 'stock', hazard: 'outage', code: 's', threat: 'dark', prop: 'torch', emoji: '🔦', months: [], topic: 'food' }`. Thai "ไฟดับ" ("เตรียมของตุน รับมือไฟดับทั้งคืน"), English "Power cut" ("Stock up for a night without power"). It is **year-round**: never the season's default, reached by its start card, `/?mode=stock`, `/ready` and posts. Round: 55 s, 12 story hours.
- **A new threat, `dark`.** The room darkens over the round (`round.stock.dark` keyframes 0.1 → 0.38 → 0.56 → 0.66; a deep blue layer with a heavier edge, so items stay readable) and the HUD shows the story's hours, then the seconds: "ไฟดับมา 4 ชม. · 37 วิ" (`darkHours`). `Round.darkLevel` (0–1) and `Round.hoursOut` (progress × `round.stock.hours`).
  - An item with `lostAfter: <hours>` goes bad once the power has been out that long: status `flooded`, shown as "เสียก่อน" / "Went bad first", a grey clock badge, 🌑 in the share grid. Only `s-fridge` has it, `lostAfter: 4`, from the US CDC ("a closed fridge keeps food safe up to 4 hours"). With no penalties that is about 18 s into the round. The freezer never goes bad in the 12-hour round (CDC: about 48 hours full, 24 half full). So the game teaches "the fridge goes first" from sourced times, not from the infographic's eating order.
  - `house.js`: every power-cut house includes one item with `lostAfter`. The rule applies only when the mode's threat is `dark`, so other modes' houses are unchanged.
- **13 lessons** (`s-…`), 5 decoys (rice bin, battery clock, books, potted plant, dishes) and 16 new symbols in `art/sprites.svg` (12 objects and 4 "done" states such as the shut fridge and the lit flashlight; the generator reuses the flood sprite):
  - kitchen: `s-fridge` (keep the door shut), `s-leftover` (minced pork after a night without power: throw it out, never taste to check), `s-freezer` (a full freezer, about 48 h), `s-opener` (a manual can opener with the cans), `s-water` (at least 3 L per person per day for at least 3 days), `s-pantry` (everyday stockpiling: eat as usual, restock, replace what has expired)
  - living room: `s-medcold` (a plan for medicine that must stay cold, or medical devices on power), `s-candle` (flashlights, not candles; never leave one burning), `s-torch` (spare batteries, a flashlight for everyone), `s-radio` (a battery radio for official news), `s-powerbank` (charge before the power goes), `s-plugs` (unplug against a surge when the power returns)
  - front: `s-generator` (outdoors in the open, away from doors and windows)
  - 3 are ✅ verified (`s-torch`, `s-powerbank`, `s-generator`) and 10 are ⚠️ partial, each with a `verifyNote` that says why ([docs/01](docs/01-safety-content.md#flags-please-review-these)).
- **5 sources, all `international`,** each with a `note` quoting what was read on 18 Oct 2026: `cdc-food-outage` (US CDC, "Keep Food Safe After a Disaster or Emergency", 24 Nov 2025), `readygov-outage` (Ready.gov "Power Outages", updated 4 Jun 2026), `readygov-kit` (Ready.gov "Build A Kit", updated 1 Jul 2026), `tokyo-bichiku` (Tokyo Metropolitan Government, Tokyo Stockpiling Navi, "Why Stockpiling Matters") and `usfa-candle` (US Fire Administration, "Candle Fire Safety", reviewed 1 Apr 2023). Their English agency names are in `seo.en.agencies`. Thai sources already in the game carry the Thai parts: PRD's 72-hour checklist (3 L), DDPM's kits, the Department of Health's 3–5 days, the DDC's generator advice and the MOPH's 7 days of medicine.
- **Left out on purpose,** because no agency says it or sources disagree: the infographic's eating order (fridge → freezer → canned), "check every 3–6 months", and the 7-day target (Tokyo's alone; the game keeps "at least 3 days", which Thai agencies also give).
- **Checklist** `stock`: "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" / "10 things for a 3-day power cut", at `/checklist/stock` and `/en/checklist/stock`.
- **A hazard page, `/ready`** (and `/en/ready`), from `config.json → hazards.outage.slug`: the 13 lessons, the checklist, the helplines and ▶ buttons to `/?mode=stock`. No "check before you go" link. Its preview is the power-cut checklist image.
- **Challenge links and previews** `/c/s0`–`/c/s10` and `/en/c/s…`, a card theme `stock` (blue-violet waves) and a blue-violet card colour (`#DCE1F5`) and gauge.
- **Strings:** every per-mode key with the `Stock` suffix (mode name and description, hero, challenge, how-to, gecko lines, result, share text, checklist tab, ranks "มือใหม่หัดตุนของ → ผู้จัดการคลังบ้าน → บ้านนี้พร้อมทุกไฟดับ", the lost-item status and toast, four endings), the `og`/`ogEn` challenge and checklist texts, `seo.<lang>.sectionStock` and `hazardOutage{Nav,Title,Desc,H1,Intro}`, and `darkHours`. 229 keys per language (was 210).
- **A carousel set for the power cut,** `share/carousel/ready/` (11 images): `s-water`, `s-pantry`, `s-opener`, `s-fridge`, `s-torch`, `s-powerbank`, `s-candle`, `s-generator`. Five of the eight are ⚠️, and their pages say "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน". The build's `posts` line now lists lessons under review ("lessons under review: outage 5 ⚠️") instead of warning about each one.
- **Build checks for the new threat:** it stops when a `dark` mode has no `round.<mode>.hours`, when `lostAfter` is outside (0, hours) or used in a mode whose threat isn't `dark`, and warns when a `dark` mode has no item with `lostAfter`.

### Changed

- **The generic texts no longer say every tip comes from Thai agencies.** The About text (th/en), the default link preview's title and description (`og`/`ogEn`), the `/learn` titles and heading, `seo.en.llmsSummary`, `seo.en.intlNote`, `index.html`'s meta description and `llms.txt`'s notes now say every tip has a source, most from Thai agencies, some international and marked. The default preview image `og/default.png` (and its English twin) reads "น้ำท่วม · ฝุ่น · ไฟไหม้ · ไฟดับ" and was re-rendered.
- The index JSON-LD's `about` lists all four hazards in Thai and English; since v1.5.0 it had listed floods only.
- **The start screen** has five modes: the recommended one as the big card, the other four in one row (`--cols` up to 4; the static grid in `index.html` is `--cols: 4`). Small-card names are `clamp(12px, 3.9vw, 16px)` with 2 px side padding, so every Thai name fits on one line at 320 px; English names wrap to two lines.
- The sitemap lists 12 addresses (adds `/ready`, `/en/ready`); `llms.txt`, `/learn` and the "By hazard" row link the new page.
- `strings.json → seo.updated` is `2026-10-19`.

### Fixed

- **The left room arrow covered the item on the fridge.** The ‹ arrow (44 × 64 px, at 44 % of the stage's height) covered up to **23 %** of the tap area of `p-numbers` (Prepare) and `f-call` (fire), and 27 % of the new fridge, all on the slot `kt-fridge-note`, measured at 390 × 760 (18–20 % at 360 × 640, 6–8 % at 768 × 1024, none at 320 × 460). A tap there turned the room instead. The slot moved from y 344 to y 404, below the arrows. It keeps its id, so every house and challenge link is unchanged; the worst coverage left is 2 % (window items at the right edge). Side effects, measured with `npm run probe`: in Prepare `p-numbers` now goes under at 43.6 s instead of 55.6 s, and in fire the smoke no longer reaches `f-call` (it did at 53.7 s). The smoke test had always clicked items with `force: true`, which is why it never noticed ([KNOWN_ISSUES F38](docs/KNOWN_ISSUES.md#in-v170-19-oct-2026)).
- **The build stops after content errors** before it generates any page. It used to crash with a `TypeError` on a missing `og` string instead of listing what was missing (F40).

### Tests

- 25 rule tests (+2): the existing per-mode test now also generates a year of power-cut houses, each with an item that goes bad; a new test "power cut: fridge food goes bad at 4 story hours, the freezer never does in 12".
- 86 smoke checks (+5): a power-cut round in the loop over the non-flood modes; `/ready` and `/en/ready`; "stock: at 4 hours without power the fridge food is lost, the room is darker and the clock says so"; "the room arrows cover at most 5% of any item's tap area (every mode, 3 houses, 390x760 and 360x640)". New doc screenshot `docs/screens/16-stock.png` (the kitchen at 6 hours without power).

### Checked

- `npm run probe`: 0 % tap overlaps over 3,650 houses (5 modes × 730 days).
- The houses of the four older modes are identical to v1.6.1 over a year.
- Build: start screen **200 KB** compressed, first game screen **215 KB** (limit 500 KB), 41 files precached, 121 link-preview pages, 81 lessons on `/learn`, sitemap 12 addresses, `posts` 4 sets and 45 images (`ready` 11), no warnings.

## [1.6.1] — 2026-10-18

Posts that teach on their own: a ready-made set of images for each hazard, for Facebook albums, Instagram carousels and LINE. Nothing in the game changes; houses and challenge links stay the same.

### Added

- **Carousel posts.** Three sets of 1080 × 1350 JPEG images in `public/share/carousel/<slug>/NN.jpg` (34 images, 4.5 MB): `flood` (12), `pm25` (11) and `fire` (11). Each set is a cover, one page per lesson, the hazard's checklists and a last page with the game's address and the helplines. A lesson page shows the hazard's sprite, the correct action, why, and the agencies it comes from, and says when a lesson is still being reviewed.
  - `carousel.json → sets.<hazard>` picks at most 8 lessons per hazard; every lesson picked today is ✅ verified. The build stops on a lesson that doesn't exist, belongs to another hazard or isn't playable, and warns about one that isn't verified.
  - The lesson text always comes from `items.json`. The new `public/content/carousel.json` holds the lesson picks and the frame text (cover titles, labels, post captions) in Thai and English. The game never loads it, and it is left out of the service worker's precache.
  - `drawCarouselPage()` in `tools/carousel-draw.mjs` draws the pages with the card helpers that `cards.js` now exports as `kit`, so the posts look like the game while the drawing code stays out of the game's download (the start screen is still 188 KB). Thai lines are balanced (`balanced()`), so a title never ends on a lone word.
- **`/posts`**, a plain page for whoever posts for the game: each set's images in order (touch and hold to save) and a ready-to-paste Thai caption with the page link, the play link and hashtags, plus a copy button. It is not for search: `noindex, nofollow` in the page and an `X-Robots-Tag: noindex` header, and it isn't in the sitemap.
- **Images that can't go stale.** `npm run images` writes `share/carousel/manifest.json` with a fingerprint of everything the images show. The build compares it with the current content and warns when a lesson's text, a caption or the site address changed after the last render.
- `npm run images -- --only <path>` renders only the images under a path (for example `share/carousel`), so the other images aren't re-encoded into unrelated diffs.

### Tests

- 81 smoke checks (+2): `/posts` lists every carousel image, each image exists, one caption per set, `noindex` and not in the sitemap; its controls are 44 px or more at 320 × 460. The new doc screenshot is `docs/screens/15-hazard-page.png`.

## [1.6.0] — 2026-10-18

The start screen keeps itself current, a post can link straight to a mode, and each hazard has its own page for search. Houses, items, rooms, slots and scores are unchanged, so today's houses and old challenge links stay the same and no midnight release is needed.

### Added

- **Switches that end by themselves.** `config.json` gained `rainWarningUntil` (now `2026-11-30`) and `featuredTopicUntil` (now `2026-11-15`). They are Bangkok dates and include that day; after it, the switch is off by itself. The rain warning and the health topic were switched on by hand in mid-October with no end, so in December's dust season the start screen would still have said "ฝนจะมาอีกระลอก" and featured diseases after floods.
  - The build stops on an end date that isn't a real `YYYY-MM-DD` date. It warns when a switch is on with no end date, or when its end date has passed.
  - A new build line shows what the start screen recommends today: `start     2026-10-18: prepare (warning until 2026-11-30) · featured health until 2026-11-15`.
  - The Thai `_readme` in `config.json` explains the end dates.
- **`?mode=` links.** `/?mode=dust` (or `prepare`, `return`, `fire`) opens the start screen with that mode as the big recommended card and its topic featured, for posts and campaigns.
  - Only mode ids from the registry count, in any letter case; anything else is ignored (`/?mode=heat` does nothing).
  - A friend's challenge link wins over it, and it never starts a round by itself.
  - Visitors from abroad go to `/en/?mode=dust`; the redirect keeps the link.
- **A page per hazard:** `/flood`, `/pm25` and `/fire`, plus `/en/flood`, `/en/pm25` and `/en/fire`, generated from the content like `/learn`.
  - Each page: the top links, the heading, a ▶ play button to `/?mode=<id>` on the first screen (two on `/flood`, one per flood mode), the intro (the English pages add that the advice and helplines are Thai), the "check before you go" link (FloodWatch for floods, Air4Thai for dust, none for fire), only that hazard's lessons (43, 12 and 13), its checklists, the helplines, the play buttons again, a "อ่านตามภัย / By hazard" row of links, and the disclaimer.
  - For search: its own canonical link, `hreflang` pairs (th, en, x-default), `og:url`, and `Article` JSON-LD that cites its lessons' sources. The preview reuses the checklist image (`/og/checklist-<mode>.png`, or `/og/en/…`), so there are no new images.
  - `/learn` and `/en/learn` gained the same "By hazard" row (44 px links). `sitemap.xml` grew from 4 to 10 addresses, and `llms.txt` lists the pages.
  - The address of each page comes from `config.json → hazards` (`flood → flood`, `dust → pm25`, `fire → fire`). The build stops on a slug that isn't lowercase letters, digits or "-", is used twice, or clashes with a site path, and on a hazard without a slug or a missing `seo` string. Slugs never change once published.
  - New `seo` strings in both languages: `byHazard`, `allLessons`, `playMode` and `hazard<Flood|Dust|Fire><Nav|Title|Desc|H1|Intro>`. The page text is a draft for the language check ([ROADMAP L5](docs/ROADMAP.md#l5-second-native-reader-for-the-thai-copy)); it adds no advice or numbers, and the descriptions name no agencies, so they can't drift from the lessons.
- **The ending on the shared card.** In v1.5.3 the line that answers "บ้านรอดไหม?" was on the result screen only. The card now carries the same line in a speech bubble left of the gecko, so a forwarded picture answers the question too.
  - The text is 38 px and shrinks to 28 px to fit at most 4 lines, preferring a size that leaves no lone short word on the last line.
  - Emoji are left out on the card, because canvas fonts can draw them as empty boxes.
  - The card's `alt` text ends with the same line.
  - The sample cards `public/share/sample-result-prepare.png` and `-return.png` were re-rendered; no other image changed.
- **The safety table's counts can't drift.** `npm run docs` also writes a summary at the top of [docs/01](docs/01-safety-content.md) (68 items in 4 modes and 8 topics, 66 playable, 57 ✅ and 11 ⚠️, 67 sources), and a normal build warns when that file is out of date with the content.

### Changed

- **Two endings pointed at the screen.** "…ด้านล่าง" / "below" was fine on the result screen but wrong on a forwarded card:
  - `cheerLowReturn`: "บ้านยังไม่พร้อม ตรวจให้ครบอีกรอบ ก่อนกลับเข้าบ้านนะ" / "Not ready yet. Check it all again before moving back in"
  - `cheerMidFire`: "ยังมีจุดเสี่ยงไฟอยู่ ลองหาให้ครบอีกรอบนะ" / "Some fire risks remain. Find them all next round"
- **The smoke test plays on a fixed Bangkok day:** `SMOKE_DATE`, `2026-10-18` by default. An init script shifts only `Date`, and time keeps running. Playwright's clock API isn't used, because it also fakes the timers and `requestAnimationFrame` that the rounds run on. What the start screen should show comes from the game's own `recommend()`, so the test never reads the real calendar.
- **Code:** `modes.js` gained the pure functions `switchOn()`, `modeLink()` and `recommend()` (which returns `{ mode, topic, why }`). In `main.js`, `pickDefaultMode` became `pickStart()`, kept in `state.start`. The forecast app's live answer (`forecastStatusUrl`) still beats the manual switch, both ways.
- **One template for the plain pages.** The `/learn` template became `seoPage()` in `tools/build.mjs`. Its output was checked byte for byte against the old one (`git diff --quiet`) before anything was added.
- **Analytics, with no new event names:** `view` gets the label `link`, with the mode, and `mode_select` is labelled `link`, `default` or `other`.
- **CI** checks that every generated `public/*.html` page (the hazard pages too), `sw.js` and `js/version.js` are committed and current, and fails when a generated file under `public/` is not committed.
- `robots.txt` and the `package.json` description say "home-safety game" (floods, PM2.5 dust and house fire). `strings.json → seo.updated` is `2026-10-18`.

### Fixed

- The helpline `tel:` links on `/learn` were 28–38 px wide; they now have `min-width: 44px`, and the top links are 44 px tall.
- The play button on `/learn` was white on orange (3.0:1, below WCAG AA). The plain pages now use the game's yellow button with dark text, and the current-hazard chip has dark text; axe-core finds nothing on `/learn` and the hazard pages.
- Stale counts in the docs (the safety table's item count, the test matrix size, the playable lessons and topics, the precache list, the string keys, issue #2 still listed as open). [KNOWN_ISSUES F32–F37](docs/KNOWN_ISSUES.md#in-v160-18-oct-2026) lists everything fixed in this release.

### Checked

- Frame times with the CPU slowed 6× (360 × 640, 2× pixels): 40–46 fps in all four modes; the haze and smoke cost no more than the flood modes. Unthrottled, 60 fps. KNOWN_ISSUES #48 updated with the table.
- The smoke test also passes as another season: `SMOKE_DATE=2026-12-05` (dust, Air4Thai, the air topic) and `SMOKE_DATE=2027-04-10` (fire, no check link, the fire topic), 79/79 each.
- Build: start screen 188 KB compressed, first game screen 201 KB (limit 500 KB), 41 files precached, 97 link-preview pages.

### Tests

- 23 rule tests (+2: a switch ends on its end date and not before; what the start screen recommends on five days of the year, with the forecast app's answer and with `?mode=` links, and each mode's "check before you go" link). The endings test also forbids "ด้านล่าง" and "below".
- 79 smoke checks (+18): dust recommended on 5 Dec 2026 with the air topic and Air4Thai; `/?mode=fire` (the fire card and topic, no round, a `view · fire · link` event); `/?mode=heat` ignored; a challenge beats `?mode=`; `/en/?mode=dust`, and a visitor from London keeps the link; each of the six hazard pages (heading, canonical, `hreflang`, play links, lesson count, JSON-LD, preview image); `/learn`, the sitemap and `llms.txt` link every hazard page; every control on the hazard pages and `/learn` is 44 px or more at 320 × 460, with the play button on the first screen; `/pm25` → play → the dust card with no round started; the ending on the result screen and in the card's `alt` text.

## [1.5.3] — 2026-10-15

Second check-and-improve loop. Houses, items and scores are unchanged.

### Added

- **The ending answers the title.** The game asks "บ้านรอดไหม?" (Will the house survive?) but its last word was a generic cheer. The gecko on the result screen now says how the house came through, per mode and score: "บ้านรอดจากฝุ่น! อากาศในบ้านสะอาด ทุกคนหายใจสบาย 💙" (dust, 10/10), "บ้านรอด! ปลอดภัย พร้อมกลับเข้าอยู่แล้ว 🏠" (after the flood), and for low scores a kind line that sends people back ("…แต่ตอนนี้รู้แล้วว่าต้องทำอะไร ลองใหม่นะ"). 16 endings in Thai and English (`cheer<Level><Mode>`), falling back to the shared lines for a new mode.

### Checked (no change needed)

- axe-core on the start, how-to, round, choice, tip, result and share views in dust and fire, Thai and English: one finding, the coral half of the wordmark (2.35:1), which is a logotype and exempt ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- The language switch rebuilds every mode button, its description and the tagline.
- The gecko's speech bubble covers no item at the start of a round (48 houses, all four modes).
- No visible text is cut off (only screen-reader-only text measures as clipped, by design).

### Tests

- 21 rule tests (+1: every mode has its four endings in both languages, at most 60 characters).

## [1.5.2] — 2026-10-15

The path a Thai visitor takes (open → play → finish → share), measured on six screens (320 × 460, 360 × 640 Android in LINE, 390 × 664 iPhone in LINE, 412 × 800, 768 × 1024, 1024 × 768) and fixed where the next step was off screen. Houses, items and scores are unchanged.

### Changed

- **The share button is always on the first screen of the result.** It was below the fold on every phone and on landscape tablets (for example 738 px down on a 664 px LINE screen). The card preview is capped at 58 % of the screen and the main action (share, or "challenge back" after a friend's challenge) sticks to the bottom until its place scrolls into view. Now 598–654 px on that screen.
- **The share sheet shows LINE, Facebook, X and copy first,** then the card (capped at 40 % of the screen) and the long-press hint. Before, a second full-size card pushed every channel off the first screen on 320 px phones, in LINE on iPhone and on landscape tablets.
- **"Start" and "next" stay in reach on short phones.** In the how-to sheet and after each answer the button sticks to the bottom of the sheet; at 320 × 460 both were off screen (538 and 445–501 px).
- **A friend's challenge comes first.** On a challenge link the gecko and its seasonal line step aside (a dust challenge used to sit under "ฝนจะมาอีกระลอก"), and on short screens the tagline too, so "รับคำท้า!" is on the first screen: 303–359 px at 320 × 460 (it was 509–565).
- **The recommended card shows a ▶ play mark,** so it reads as a button to play, not a label.

### Tests

- 61 smoke checks (+3: the result's share button, LINE in the share sheet and the challenge's accept button are on the first screen at 360 × 640 or 320 × 460).

## [1.5.1] — 2026-10-15

### Fixed

- **Tapping ฝุ่น PM2.5 could open the flood house.** The owner saw it on a browser that had played an earlier version. The service worker served the page and content from the network but the code from its cache, so the new page ran the old code, and the old code turned an unknown mode into Prepare. Only the first visit after a deploy was affected. Three fixes:
  - The service worker now fetches `/js/`, `/css/`, `/content/`, `/art/` and the manifest network-first (3 s, then the cache for offline play). Fonts and images stay cached.
  - When the new service worker replaces one from before v1.5.1, it reloads the open pages once from the network.
  - The build writes `js/version.js`; if it disagrees with `config.json → version`, the page clears its caches and reloads once (never in a loop).
- Tested over an installed v1.4.0 (one automatic reload, then dust mode opens the dust house) and over v1.5.1 with a fake next release (the new code on the first visit, no reload). KNOWN_ISSUES F27.

### Tests

- 58 smoke checks (+1: content and code from different releases reload once, then the start screen works); offline play still passes.

## [1.5.0] — 2026-10-15

A home-safety game for the whole year, not only the flood season. **Two new modes, PM2.5 dust and house fire, with their own houses and challenge links (`/c/d…`, `/c/f…`).** Flood houses and old flood challenge links are unchanged (244 houses compared byte for byte), so this needs no midnight release.

### Added

- **PM2.5 dust mode (`dust`, ฝุ่น PM2.5, code `d`).** 12 lessons in the front yard, living room and kitchen, topic 😷 ฝุ่นและควัน (`air`), 5 decoys, 14 new sprites.
  - Shut and seal the window, wipe with a damp cloth instead of sweeping, check the purifier filter (every 6 months), keep medicine ready, see a doctor for a bad cough or tight chest, wet-wipe fans and air-cons, check Air4Thai before going out, skip the charcoal grill, wear a snug N95, exercise indoors, keep children (an at-risk group) in on red days, don't burn leaves.
  - A haze with drifting specks thickens over 55 seconds and the gauge moves through the Air4Thai colours (blue, green, yellow, orange, red). Nothing is lost to the haze; the clock is the pressure.
  - Sources: the Department of Health via THE STANDARD (1 Apr 2026), Thai PBS (10 Dec 2021) and PPTV (14 Dec 2022), cross-checked with WHO Europe (16 Jun 2023). The colour ranges in the 2022 article use the scale before the 2023 change, so the game teaches the colour order, not the numbers.
  - Checklist "ห้องปลอดฝุ่น 10 ข้อ" (`/checklist/dust`), and a "😷 เช็กค่าฝุ่นวันนี้ (Air4Thai)" link where flood modes show the forecast app.
- **House fire mode (`fire`, ไฟไหม้, code `f`).** 13 lessons, topic 🔥 ไฟไหม้ (`fire`), 5 decoys, 12 new sprites.
  - Chained power strips, a hot cracked cord, a phone charging on the sofa, a chirping smoke alarm, a towel (wet cloth over nose and mouth, crawl low), a pan left on the stove, the gas valve, sprays by the stove, an extinguisher buried in a cupboard, which number to call (199), smoke under a door (touch it first), burning leaves on a windy day, a cigarette end.
  - Smoke falls from the ceiling, so high things are lost first (`round.fire.smoke`, `lowY`); the gecko says "near the floor the air is cleaner".
  - Sources: DDPM via Krungthep Turakij (2020 and 2026) and MGR Online (17 Dec 2025), MEA via Thansettakij (17 Sep 2026). The US Fire Administration cross-checks cooking, and is the only source for the smoke-alarm lesson, which is flagged ⚠️ `partial`.
  - Checklist "บ้านปลอดภัยจากไฟ 10 ข้อ" (`/checklist/fire`). Helpline **199** (fire) added, so the checklist cards now list it.
- **Mode registry** (`config.json → modes`, `js/modes.js`): id, hazard, challenge letter, threat (water, smoke, haze or none), gecko prop, emoji, months, topic and link per mode. Strings follow `<base><Mode>`; `tm()` falls back to the shared key. The build checks every mode has its round settings, strings, link-preview text, `/learn` section, checklist and start button.
- **Season default.** Without a rain warning, the start screen recommends the mode in season (Bangkok month): dust in December–March, fire in April, otherwise "after the flood". The featured card falls back to that mode's topic when `featuredTopic` is `null`.
- New source kind `international` (WHO, US Fire Administration): used to cross-check Thai advice, never alone without a ⚠️.
- The gecko wears a mask in dust mode and a red helmet in fire mode, on the start screen, in rounds and on the cards.

### Changed

- **Start screen:** the season's mode is the big card; the others sit in a row of compact cards (icon over name, at least 78 × 89 px at 320 px wide).
- **Wording:** tagline, page titles, link previews, `/learn`, `llms.txt` and the app manifest now say floods, dust and fire. English hashtag `#HomeSafety`.
- **Help sheet** lists one "check before you go" link per kind (flood forecast app, Air4Thai).
- `npm run probe` prints smoke timings for fire (alarm 21.8 s, pan 50.1 s, note 53.7 s).

### Fixed

- Source links in lessons were 31–43 px wide for short agency names (ปภ., อย.); they now have a 44 px wide tap area, in the game and on `/learn`.
- A fan sprite overlapped a kitchen floor slot by 1% in 35 of 2,920 houses; now 0%.

### Tests

- 20 rule tests (every mode: a year of houses, codes round-trip, season pick), 57 smoke checks (+2: a full dust round and a full fire round, each with its haze or smoke layer and no page errors), 0% tap overlaps over 2,920 houses.
- Visitor pass: four modes × Thai/English × 320 × 460, 390 × 760, 768 × 1024, 1024 × 1366 and 1366 × 1024: no overflow, no page errors, no target under 44 px; `/c/d7`, `/c/f7`, `/checklist/dust`, `/checklist/fire`, `/learn#t-air`, `/learn#t-fire`; season default for 15 Dec, 1 Feb, 10 Apr and 15 Oct.

## [1.4.0] — 2026-10-15

Knowledge, organised. **Adds 3 Return-mode lessons, so today's Return houses and old Return challenge links change** (Prepare houses are unchanged). Shipped at night, Bangkok time.

### Added

- **EM balls in stagnant floodwater (`r-stagnant`, front yard).** The owner asked whether EM balls help; the evidence says no. A statement by 48 environmental scientists (Chula-led, 9 Nov 2011) does not recommend EM for stagnant floodwater: its microbes add no oxygen and part of it is organic matter. Do this instead, in order: drain, remove rubbish, add air. A 2026 peer-reviewed Bangkok study found EM balls alone didn't help consistently. Flagged ⚠️ because the sources are academic, not an agency.
- **Two lessons from the DDC's warning of 27 Sep 2026 on six disease groups after floods:** diarrhoea, sip ORS and eat freshly cooked food (`r-ors`, kitchen); eye infections, wash hands, don't rub, don't share towels (`r-towel`, living room). The same source now backs `r-mudfeet`, `r-bucket` and `r-fever`.
- **Six topics** for every lesson (`topic` in `items.json`, list in `config.topics`): 🦠 health after floods, ⚡ power & gas, 💧 water & food, 🐍 snakes & sharp things, 🏠 home, car & belongings, 🎒 plans & go-bag.
  - The safety book is grouped by topic, with a progress bar per topic and a 🏅 badge for a full set; finishing a set after a round shows a toast.
  - The tip card names the topic; result lessons show its emoji.
  - `/learn` and `/en/learn` start with an index by topic (`#t-health` …) made of 44 px chips, and every lesson names its topic.
  - The safety book links to `/learn` so no answer is ever locked away.
- **A topic in the news on the start screen** (`config.featuredTopic`, now `"health"`): "📰 เรื่องที่ควรรู้ช่วงนี้ · 🦠 โรคหลังน้ำท่วม", with "📄 read all 8" (→ `/learn#t-health`) and "📖 book n/8" (opens the book on that topic; "play" picks the mode with the most left to find). Set it to `null` when the news fades.
- New event `learn_open` (label: the topic, or `book`) in both allowlists.
- New source kind `academic`, labelled in the docs table as "academic statement or peer-reviewed study (not an agency)".

### Tests

- 17 rule tests (topics: every lesson has one; a full set is reported once), 55 smoke checks (+4: book grouped by topic, the featured card and its `/learn` anchor, the featured topic opens first).

### Also in 1.4.0


- The smoke test's start-screen size check now measures what visitors download (text gzipped like Cloudflare does): 167 KB of 500 KB. It used to count raw bytes (481 KB) and was about to fail on harmless text additions. KNOWN_ISSUES #40 → F24.

## [1.3.1] — 2026-10-14

### Fixed

- **No more flash of Thai for visitors from abroad.** On `/`, `/c/…` and `/checklist/…`, an inline script sends visitors from outside Thailand to the English page (`/en/…`) before anything is drawn. Thai browsers, Bangkok time, a stored choice, `?lang=` and search or preview bots (new `isBot()` in `content.js`) stay on Thai. KNOWN_ISSUES #38 → F23. Tests: 16 rule tests, 51 smoke checks (+6, five of them for who is *not* redirected).

## [1.3.0] — 2026-10-14

More fun to play, more worth sharing. **Scores, items and slots are unchanged**, so today's houses and old challenge links stay the same.

### Added

- **The card carries the challenge link.** The result card prints `baanrodmai.autobahn.bot/c/p8?h=…` (or `/en/c/…`) instead of the bare site address, so a forwarded *picture* leads to the same house. The text shrinks to fit.
- **Challenge back.** After playing a friend's challenge, the first button is "🏆 ส่งกลับไปท้าเพื่อน" / "Challenge them back". Its text names both scores ("เพื่อนได้ 3/10 เราได้ 8/10 …"), the card shows "เพื่อน 3/10 · เรา 8/10 · บ้านหลังเดียวกัน", and the share now attaches the card image. Its events use the label `challenge-back`, so the loop depth can be counted.
- **Score to beat on the clock.** During a challenge round the gauge reads "50 วิ · 🏆 เป้า 8/10" (the `challengeTarget` string was written but never used).
- **Share text names the house and the streak:** "เตรียมบ้านทัน 8/10 🏠 (บ้านวันที่ 14 ต.ค. 69)", plus " · เล่นต่อเนื่อง 3 วัน 🔥" from two days on. `challengeText` gained the hashtag.
- **Safety book (สมุดบ้านรอด).** Every lesson answered correctly is kept on the device (item ids only, `brm:learned`). A chip on the start screen ("📖 รู้แล้ว 6/38 เรื่อง") opens a sheet with learned lessons and their tips, and locked tiles for the rest. The result screen says "ใหม่! +2 เรื่อง". Only rooms that are drawn count (38 lessons today).
- **End-of-round moments by score:** 10/10 gets a bigger fanfare, a second confetti burst and a "เต็มสิบไม่หัก!" / "Perfect 10!" stamp on the screen card and shared card; 8–9 keep today's fanfare and confetti; lower scores get a soft chime. A small gecko on the result screen says a line that fits the score (warm and encouraging at every level).
- **Combo, for feel only.** Three or more right answers in a row show "🔥 3 ข้อติด!" and a rising run of notes. It never changes the score.
- **Sounds for silent moments:** a splash when water reaches the floor, a soft tick for each of the last five seconds, and a blip when sound is switched back on.
- **Streak milestones:** a toast on day 3, day 7 and every 7th day after.
- **Checklist sheet:** a Facebook button; the share text carries the checklist link once (LINE and copy used to add it twice).

### Changed

- **Replay first.** On the result screen, "play the other mode" and "🎲 random house" moved up under the share buttons, above the lessons.
- **Native share titles follow the language** ("Baan Rod Mai?" in English); they were hard-coded Thai.
- A second tap on a decoy now gets one of the gecko's decoy lines (`geckoDecoy`, unused until now) with the note.
- Sample result cards in `public/share/` re-rendered: one shows a challenge win with the perfect stamp.
- Tests: 15 rule tests (safety book, share-text placeholders), 45 smoke checks (+10).

### Also in 1.3.0 (live since 13 Oct 2026, still labelled v1.2.2 then)

#### Fixed

- **Tap areas on 320 px phones.** Under 520 px of height the room tabs are hidden (the ‹ › arrows stay) and the HUD padding shrinks, so item tap areas at 320×460 grow from 38.1 px to 44.1 px (N4, issue #2). Two new smoke checks (35).

#### Changed

- **Game events carry the language** (`th` or `en`, stored as `blob4` by `/api/e`), so plays can be split by language (issue #39).

#### Documentation

- Documentation sweep for v1.2.2: README, HANDOFF, KNOWLEDGE (new §19, the FloodWatch link), KNOWN_ISSUES (fixed rows moved to *Fixed* as F18–F20; new #38 flash of Thai on `/` and #39 no language in game events), GUIDELINES (English copy rules and rules 30–34), APPROACH_AND_METHOD (new §§16–17), ROADMAP (new L9 and P4), and docs 02–06 (English previews, 50 images, 35-row phone matrix, 147/156 KB, 38 precached files). No code changes; the app stays at 1.2.2.

## [1.2.2] — 2026-10-11

### Fixed

- **English mode still showed the Thai logo.** The big title, the result card, the checklist image and the English preview images now show **"Baan Rod Mai?"** in English (`strings.json → logoA/logoB`); Thai stays "บ้านรอดไหม?". The canvas shrinks the English wordmark to fit, and the static `/en/` page carries it too. New smoke check (33). Reported by the owner from a screenshot.

## [1.2.1] — 2026-10-11

### Changed

- **Published 11 Oct 2026** (CI green on `f31c600`; live site shows `v1.2.1`). FloodWatch is the owner's own Autobahn Bot project.
- **Forecast button is live:** `config.json → forecastAppUrl` is `https://flood.autobahn.bot/` (BKK FloodWatch, canal and river water levels across Thailand), so "เช็กระดับน้ำล่วงหน้า" / "Water levels" shows on the start screen, the result screen and the help sheet. A smoke check (32) covers it; the build no longer warns about the placeholder.

## [1.2.0] — 2026-10-11

An international (English) version, and better search and social previews in both languages.

### Added

- **English addresses:** `/en/` (the game), `/en/learn` (every lesson in English, agency names in English), `/en/c/…` challenge links and `/en/checklist/…`. The English pages are English in their static HTML (title, description, start-screen text, a hidden English `<h1>`), so crawlers and link previews see English.
- **Language choice:** `?lang=`, then the `/en` path, then the stored choice, then a first-visit guess: Thai for Thai browsers **or** Bangkok time, English otherwise. The address bar follows the language, and English players share `/en/c/…` links.
- **Search:** `hreflang` (th, en, x-default → en) on every indexable page and in `sitemap.xml` (`xhtml:link` alternates); English JSON-LD; `llms.txt` lists the English pages.
- **Social:** 25 English preview images (`public/og/en/`, from `strings.json → ogEn`), `og:locale:alternate`, `twitter:image:alt`; English share texts add `#FloodSafety`.
- **Honest scope for visitors outside Thailand:** the English help sheet, `/en/learn` and `llms.txt` say the advice and hotlines are Thai and point people to their local emergency number.
- **Checks:** the build fails if any `og` key lacks an English `ogEn` version or an agency lacks an English name; 1 new unit test (13) and 5 new smoke checks (31), including an English visitor from London.

### Changed

- **Version 1.2.0.** The smoke test now runs players as a Thai phone in Bangkok by default; CI also checks that `public/en/` is regenerated and committed.

## [1.1.0] — 2026-10-10

CI, a text clean-up and a clearer version label on top of 1.0.0. Live at https://baanrodmai.autobahn.bot (push-to-deploy checked).

### Added

- **Version on the homepage:** the start screen shows `v1.1.0` as a visible chip (13 px, bordered) under the footer links, and the About sheet shows it too. A smoke check compares it with `package.json` (26 checks).
- **One version number.** `package.json` is the source. The build stamps it into the start screen's HTML (so it shows before any script runs) and **fails** if `config.json → version` differs.

- **CI** (`.github/workflows/ci.yml`): build, rule tests, docs link check and the browser smoke test on every push to `main` and every pull request.
- **Smoke check:** the About sheet follows the EN toggle (25 checks).

### Changed

- **Version bumped** from 1.0.0 to 1.1.0 in `package.json`, `package-lock.json` and `config.json`.
- **About sheet, checklist captions and the language button** read their text from `strings.json`; the unused `install` analytics event was removed.

## [1.0.0] — 2026-10-07

The official 1.0 release of **บ้านรอดไหม? (Baan Rod Mai?)** — a 60-second flood-safety hazard hunt game for Thai families, live at [https://baanrodmai.autobahn.bot](https://baanrodmai.autobahn.bot).

### Added

- **Version indicator in UI:** added app version display (`v1.0`) on the start screen footer and in the "About" information sheet (`public/index.html`, `public/js/main.js`, `public/css/app.css`, `public/content/config.json`).
- **Home: `https://baanrodmai.autobahn.bot`.** `config.json → siteUrl` is set, and Cloudflare Pages project `baanrodmai` is live.
- **SEO and AI search,** all generated by `tools/build.mjs` from content JSON:
  - **`/learn`:** a script-free page with all 40 lessons, source citations, checklists, and helplines.
  - **`/llms.txt`**, **`/sitemap.xml`**, **`/robots.txt`**, canonical links, and JSON-LD structured data.
- **Live-site UI/UX review, persona validation, and 3-loop iterative optimization** in `review/`:
  - Executed 3 full refinement loops ([review/ITERATION_LOG.md](review/ITERATION_LOG.md)), raising overall score from 8.8/10 to **9.74/10 (Optimal)** across all heuristics and personas.
  - **Loop 1 (Collisions & Affordance):** Resolved hitbox overlaps over 1,460 houses from 3.8% down to **0% (0 overlaps)** via `slot.excludes` graph. Added 3.5s idle affordance breathing ring (`.show-hints`) and desktop hover states. Surfaced educational 💡 `why` rationale directly in the verdict sheet.
  - **Loop 2 (Senior Accessibility & LINE UX):** Resolved timer anxiety for older players with reassuring modal copy and prominent `⏸️ พักเวลาอยู่ ค่อยๆ คิดได้เลย` badge in choice sheets. Added LINE In-App Browser save guides (`.line-guide`). Enhanced Return mode hazard drop-shadows.
  - **Loop 3 (Cultural Polish & Optimal Verification):** Infused warm Thai care copy (*"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยจากน้ำท่วม 💙"*) into result forwarding templates.
- **Guidance for AI assistants:** [AGENTS.md](AGENTS.md), [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md), [docs/ROADMAP.md](docs/ROADMAP.md).
- **Two modes in one illustrated house:** ก่อนน้ำมา (60 s, rising water) and หลังน้ำลด (50 s, daylight bar), across three rooms (หน้าบ้าน, ห้องนั่งเล่น, ครัว).
- **Safety content:** 40 items: 19 Prepare and 21 Return, of which 38 are playable now, from 54 dated Thai agency sources.
- **Replay & Sharing:** daily house, streak, challenge links, offline PWA caching, and high-res share cards.
  - 15 decoys, from 54 dated sources.
  - 31 items fully verified and 9 flagged ⚠️ partial, each with a written reason.
  - The help numbers 1784, 1669, 1555, 1130, 1129 and 1323.
- **Rules:**
  - Low items flood first, judged by the sprite's centre.
  - The breaker's correct answer changes once the floor is wet.
  - +50 bonus for critical items handled before water enters.
  - A wrong answer costs 4 s; each decoy costs 2 s the first time.
  - The clock pauses while the player reads.
  - Scores are out of 10, with flattering rank titles.
- **Replay:**
  - a daily house that is the same for everyone (Bangkok date)
  - a streak
  - random practice houses
  - challenge links (`/c/p8?h=…`) that rebuild a friend's exact house
- **น้องจก,** the gecko mascot: five faces, a rain hood and a torch, and short lines of dialogue. Sounds are synthesised with Web Audio, and Android also gets haptics.
- **Sharing:**
  - a 1080×1350 result card and two 1080×1920 checklists
  - native share with a file, then LINE / Facebook / X / copy / save as fallbacks
  - long-press saving and an "open in browser" link inside in-app browsers
  - 25 pre-rendered link-preview pages and images
- **Offline play** after the first visit, through a service worker that refreshes content from the network first.
- **Anonymous metrics:** events go through `POST /api/e` to Workers Analytics Engine, alongside Cloudflare Web Analytics. There are no cookies and no personal data.
- **Build:** content validation that fails the deploy on mistakes, link-preview generation, a service-worker version from a content hash, and a 500 KB budget check (142 KB used).
- **Tests:** 12 rule tests and 24 headless-browser checks, with Android, iPhone, LINE and Facebook user agents, offline mode and reduced motion.
- **Documents:** the safety table, game design and wireframes, deploy steps, the Thai launch kit, the metrics plan, the test checklist, the handoff, the knowledge base, known issues, guidelines, and approach and method.
- **Tools:** `npm run probe` measures tap-area overlaps and flood timings.

### Fixed before release (found during the handoff review)

- **Tab and HUD sizes:** on screens 640 px tall or shorter, the HUD buttons and room tabs were 40 px. They are 44 px again.
- **"ทำไม?" expander:** in the result lessons it was 35×40 px. It is now at least 44×44 px.
- **Source links:**
  - In the lessons and the tip card they are padded to a 44 px tap height without moving the text.
  - The About list now uses full-width rows of at least 44 px.
- **Screenshot names:** `npm run smoke -- --screens` now writes the screenshot names the docs use.

### Changed

- **Moved repository.** The game moved from the `baanrodmai/` folder of a `bejranonda/carrier-vector-1988` feature branch to the root of this repository. Its first two commits were kept, and the Cloudflare "Root directory" setting is now empty. The original branch was never merged and no longer carries the game.

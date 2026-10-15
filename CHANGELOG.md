# Changelog

This project uses [semantic versioning](https://semver.org/). Each release is tagged `vX.Y.Z` on `main` once its Cloudflare deploy has been checked.

## [Unreleased]

### Checked

- Frame times with the CPU slowed 6× (360 × 640, 2× pixels): 40–46 fps in all four modes; the haze and smoke cost no more than the flood modes. Unthrottled, 60 fps. KNOWN_ISSUES #48 updated with the table.

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

# Roadmap

What to do next, as task cards. Each card says who can do it, why it matters, the steps, and when it counts as done. Issue numbers (#n) refer to [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

**How to use this file:**

- Work top to bottom. Launch tasks (L) come first whenever the owner has supplied what they need.
- When you start or finish a task, change its **Status** in the same commit as the work.
- Follow the definition of done in [AGENTS.md §4](../AGENTS.md#4-definition-of-done).
- Add new tasks at the end of the right section with the next free id. Never reuse an id.

| Status | Meaning |
|---|---|
| Todo | Not started |
| Doing | In progress (say who is doing it) |
| Blocked | Waiting for something; say what |
| Done | Finished, with the commit or date |

| Who | Meaning |
|---|---|
| **Owner** | Only the project owner can do it (accounts, decisions, real phones, people) |
| **AI-ready** | An assistant can do it from the repository alone |
| **Owner + AI** | The owner supplies an input; an assistant does the rest |

## Summary

| Id | Task | Who | Status |
|---|---|---|---|
| L1 | [Create the Cloudflare Pages project](#l1-create-the-cloudflare-pages-project) | Owner | Mostly done: Web Analytics left |
| L2 | [Set the domain and re-render the images](#l2-set-the-domain-and-re-render-the-images) | Owner + AI | Done: preview-debugger check left |
| L3 | [Set the forecast-app link](#l3-set-the-forecast-app-link) | Owner + AI | Done (11 Oct 2026): link set; live status endpoint optional |
| L4 | [Review the 11 flagged (⚠️) safety items](#l4-review-the-11-flagged-safety-items) | Owner + AI | Todo |
| L5 | [Second native reader for the Thai copy](#l5-second-native-reader-for-the-thai-copy) | Owner + AI | Todo |
| L6 | [Real-phone test matrix](#l6-real-phone-test-matrix) | Owner + AI | Todo |
| L7 | [Soft launch, then the launch phases](#l7-soft-launch-then-the-launch-phases) | Owner | Todo |
| L8 | [Search consoles and AI-search check](#l8-search-consoles-and-ai-search-check) | Owner + AI | Todo |
| L9 | [Link FloodWatch and the game to each other](#l9-link-floodwatch-and-the-game-to-each-other) | Owner + AI | Half done: game → FloodWatch is live |
| L10 | [Thai review of the dust and fire lessons](#l10-thai-review-of-the-dust-and-fire-lessons) | Owner + AI | Todo |
| N1 | [Fix overlapping tap areas](#n1-fix-overlapping-tap-areas) | AI-ready | Done: 0% overlap via slot exclusion |
| N2 | [Move hard-coded text into JSON and settle the `install` event](#n2-move-hard-coded-text-into-json-and-settle-the-install-event) | AI-ready | Done (10 Oct 2026) |
| N3 | [Add CI on GitHub](#n3-add-ci-on-github) | AI-ready | Done (10 Oct 2026) |
| N4 | [Bigger tap areas on 320 px phones](#n4-bigger-tap-areas-on-320-px-phones) | AI-ready | Done (13 Oct 2026) |
| N5 | [First metrics review](#n5-first-metrics-review) | Owner + AI | Blocked: needs 2 weeks live |
| N6 | [Implement live-site UX improvements](#n6-implement-live-site-ux-improvements) | AI-ready | Done: IMP-01 to IMP-07 verified |
| N7 | [International version and social previews](#n7-international-version-and-social-previews) | AI-ready | Done (11 Oct 2026, v1.2.0) |
| N8 | [More fun to play, more worth sharing](#n8-more-fun-to-play-more-worth-sharing) | AI-ready | Done (14 Oct 2026, v1.3.0) |
| N9 | [Organise the knowledge by topic, add the news-driven lessons](#n9-organise-the-knowledge-by-topic-add-the-news-driven-lessons) | AI-ready | Done (15 Oct 2026, v1.4.0) |
| N10 | [A game for the whole year: PM2.5 dust and house fire](#n10-a-game-for-the-whole-year-pm25-dust-and-house-fire) | AI-ready | Done (15 Oct 2026, v1.5.0) |
| P1 | [Bathroom, bedroom and garage](#p1-bathroom-bedroom-and-garage) | Owner + AI | Todo |
| P2 | [Accessibility pass with a screen reader](#p2-accessibility-pass-with-a-screen-reader) | Owner | Todo |
| P3 | [Lighter preview images](#p3-lighter-preview-images) | AI-ready | Todo (optional) |
| P4 | [More languages](#p4-more-languages) | Owner + AI | Todo (optional) |
| P5 | [Share-loop ideas not built yet](#p5-share-loop-ideas-not-built-yet) | AI-ready / Owner + AI | Todo (optional) |
| P6 | [More lessons for the remaining disease groups](#p6-more-lessons-for-the-remaining-disease-groups) | Owner + AI | Todo (optional) |
| P7 | [Heat and summer storms](#p7-heat-and-summer-storms) | AI-ready (research) + Owner review | Todo |
| P8 | [Earthquake and tsunami](#p8-earthquake-and-tsunami) | AI-ready (research) + Owner review | Todo |
| P9 | [A safety calendar: one hazard week at a time](#p9-a-safety-calendar-one-hazard-week-at-a-time) | Owner + AI | Todo |
| V1 | [Version 2: the combined Prepare → Return run](#v1-version-2-the-combined-prepare--return-run) | AI-ready | Todo |
| S1 | [Seasonal relaunch (every April–May)](#s1-seasonal-relaunch-every-aprilmay) | Owner + AI | Recurring |
| H1 | [Housekeeping](#h1-housekeeping) | Owner | Partly done |

---

## Launch (do these first)

### L1. Create the Cloudflare Pages project

- **Who:** Owner · **Status:** Mostly done (6 Oct 2026). **Live** at https://baanrodmai.autobahn.bot after Analytics Engine was enabled on the account (the first deploy failed without it); `/`, `/learn`, `/llms.txt`, `/sitemap.xml`, `/c/p7` return 200 and `/api/e` returns 204. The project `baanrodmai` was created through the API and connected to `bejranonda/Hazard-huntz`, with the build settings below, the `EVENTS` binding and fail open. The site address comes from `config.json → siteUrl`. **Left for the owner:** step 3, Web Analytics (the API token has no permission for it), and checking that a push to `main` starts a build (the first two deploys were started through the API).
- **Steps:**
  1. Connect this repository.
  2. Leave the root directory empty, set the build command to `node tools/build.mjs`, and the output to `public`.
  3. Enable Web Analytics.
  4. Check that the `EVENTS` binding is listed.
  5. Set Settings → Runtime → **Fail open**.

  The details are in [03-deploy.md](03-deploy.md).
- **Done when:** the production URL loads the game, `/c/p8` shows a preview page, and a game played there produces a 204 from `/api/e` (visible in DevTools).

### L2. Set the domain and re-render the images

- **Who:** Owner + AI · **Status:** Done (6 Oct 2026): domain `https://baanrodmai.autobahn.bot` (proxied CNAME to `baanrodmai.pages.dev`), `config.json → siteUrl` set, images re-rendered. **Left:** the Facebook Sharing Debugger check once the site is live. · **Issues:** #6, #7
- **Steps:**
  1. The owner sets `SITE_URL` in the Pages project.
  2. An assistant runs `CHROME_PATH=… SITE_URL=https://<domain> npm run images` and checks `public/og/`, `public/share/` and `public/icons/`. Optionally it also sets `config.json → siteUrl`.
  3. Commit with `content: bake <domain> into images`.
- **Done when:**
  - the images show the domain
  - `node tools/build.mjs` prints `site https://<domain>`
  - Facebook's Sharing Debugger shows the right preview
  - #6 and #7 are moved to *Fixed*

### L3. Set the forecast-app link

- **Who:** Owner + AI · **Status:** Done (11 Oct 2026, v1.2.1): `forecastAppUrl` is `https://flood.autobahn.bot/` (BKK FloodWatch, water levels of canals and rivers across Thailand; the owner confirmed on 11 Oct 2026 that it is their own Autobahn Bot project). The button shows on the start screen, result screen and help sheet. **Optional left:** `forecastStatusUrl`, only if FloodWatch offers a small `{"rainWarning": true|false}` endpoint with CORS · **Issues:** #6 (fixed), #13
- **Steps:**
  1. Set `config.json → forecastAppUrl`.
  2. Optionally set `forecastStatusUrl`. Its endpoint must send CORS headers and answer `{"rainWarning": true|false}` within 1.5 s.
- **Done when:** the build no longer warns about the placeholder, and the "เช็กระดับน้ำล่วงหน้า" buttons appear and open the app.

### L4. Review the 11 flagged safety items

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #8, #9, #10
- **Steps:**
  1. An assistant prepares a review sheet from [01-safety-content.md](01-safety-content.md#flags-please-review-these). Ask the owner before publishing it anywhere.
  2. The owner or an agency contact confirms or corrects each item.
  3. An assistant applies the answers in `items.json` and `sources.json`, sets `verify`, and runs `npm run docs`.
- **Done when:** every playable item is `verified`, or the owner has knowingly accepted it as `partial`, and the table is regenerated.
- **Note (v1.5.0):** the eleventh is `f-alarm` (smoke alarms), backed only by the US Fire Administration.

### L5. Second native reader for the Thai copy

- **Who:** Owner + AI · **Status:** Todo (the owner said on 11 Oct 2026 they will provide a language check, Thai and English) · **Issue:** #11
- **Steps:** a native speaker reads `strings.json` (`th`, `en`, `ogEn`, `seo`), `items.json` and `checklists.json`, ideally an older relative for the Thai and a native English reader for the `en` and `ogEn` text. An assistant applies the edits. Tips stay at 80 characters or fewer, and placeholders stay as they are.
- **Done when:** the edits are committed and the images re-rendered where the copy appears in them.

### L6. Real-phone test matrix

- **Who:** Owner + AI · **Status:** Todo · **Issue:** #3
- **Steps:**
  1. Run [06-test-checklist.md](06-test-checklist.md) on at least one cheap Android and one iPhone, inside LINE, Facebook and TikTok.
  2. An assistant records the results in the matrix and turns each ❌ into a KNOWN_ISSUES entry or a fix.
- **Done when:** the matrix is filled in, and no ❌ remains that blocks sharing or playing.

### L7. Soft launch, then the launch phases

- **Who:** Owner · **Status:** Todo
- **Steps:** follow [04-launch-kit.md](04-launch-kit.md): 20–30 people first, then *Prepare first*, then *Return*.
- **Done when:** the launch-day checklist in the launch kit is complete.

### L8. Search consoles and AI-search check

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #30, #32
- **Steps:**
  1. The owner adds the site in Google Search Console and Bing Webmaster Tools and submits `https://baanrodmai.autobahn.bot/sitemap.xml`.
  2. Run `/` and `/learn` through Google's Rich Results Test and fix anything it reports in the JSON-LD (`tools/build.mjs`).
  3. Paste a challenge link and `/learn` into the Facebook Sharing Debugger and a LINE chat.
  4. After about two weeks, search the game's Thai name and "เตรียมบ้านก่อนน้ำท่วม" in Google and Bing, and ask two AI assistants about it. Record what appears.
  5. Record the result in [KNOWN_ISSUES #32](KNOWN_ISSUES.md#32-search-and-ai-search-results-cant-be-guaranteed), and adjust the `/learn` headings and `seo` copy if the Thai queries find nothing.
  6. Repeat steps 2 and 3 for `/en/`, `/en/learn` and an English challenge link (`/en/c/p7`), and check that the `hreflang` pairs show no errors in Search Console. Search in English for "flood safety game Thailand".
- **Done when:** both consoles accept the sitemap, the Rich Results Test shows no errors, and the findings are written down.

### L9. Link FloodWatch and the game to each other

- **Who:** Owner + AI · **Status:** Half done (12 Oct 2026). Game → FloodWatch is live: `forecastAppUrl` is `https://flood.autobahn.bot/`. **Left:** FloodWatch → game. · **Issues:** #6 (fixed), #13
- **Steps:**
  1. The owner adds a link from https://flood.autobahn.bot/ to https://baanrodmai.autobahn.bot/ (Thai) and `/en/` (English). The two sites share the parent domain, which helps both.
  2. Optional: FloodWatch offers `{"rainWarning": true|false}` with CORS, and the owner sets `forecastStatusUrl` so the game can show a rain banner.
  3. After two weeks, check whether Web Analytics shows referrals from `flood.autobahn.bot`.
- **Done when:** both sites link to each other and the referrals show in Web Analytics.

### L10. Thai review of the dust and fire lessons

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #45, #46
- **Why:** the 25 new lessons (v1.5.0) quote the Department of Health, DDPM and MEA through news reports, because the agency sites refuse automated access. A person should read the agency pages themselves before the dust season (December).
- **Steps:**
  1. An assistant prints the dust and fire rows of [01-safety-content.md](01-safety-content.md) with their source links as a review sheet.
  2. The owner (or a contact at กรมอนามัย / ปภ.) opens each source, checks the wording, and notes changes.
  3. An assistant applies them, upgrades sources to `official` where an agency page is found, and runs `npm run docs`.
- **Done when:** every dust and fire lesson is confirmed or corrected by a person, and the decision on `f-alarm` (keep as ⚠️, or drop) is recorded.

## Next (v1.1, AI-ready)

### N1. Fix overlapping tap areas

- **Who:** AI-ready · **Status:** Done (7 Oct 2026: slot exclusion graph implemented, `npm run probe` reports 0% overlap) · **Issue:** #1
- **Why:** 32% of houses had two neighbouring items whose tap areas overlapped, at worst by 45% of the smaller item, so a tap could open the wrong item.
- **Steps:**
  1. `npm run probe` and note the pairs. The worst are `fr-shoes` + `fr-floor-d` and `fr-door` + `fr-floor-b`.
  2. In `public/content/rooms.json`, move the conflicting slots at least about 70 scene units apart on the same baseline. Keep each slot on a surface that makes sense in `public/art/rooms/<room>.svg`; slots are the bottom centre of the sprite.
  3. Add a unit test in `tests/run.mjs`: over a year of daily houses in both modes, no two placements in a room may overlap by more than 10% of the smaller tap area. The loop in `tools/probe.mjs` can be reused.
  4. `npm test`, `npm run probe`, then `CHROME_PATH=… npm run smoke -- --screens docs/screens`. Look at `03-room.png` and `07-return-small.png`.
  5. Moving slots reshuffles houses (#24). Say so in the commit and CHANGELOG, and suggest the owner deploys around midnight Bangkok time.
- **Done when:**
  - the probe reports a worst overlap of 10% or less
  - the new test passes
  - the screenshots look right
  - #1 is moved to *Fixed* with the new numbers

### N2. Move hard-coded text into JSON and settle the `install` event

- **Who:** AI-ready · **Status:** Done (10 Oct 2026: texts moved to `strings.json`, `install` removed, smoke check added) · **Issue:** #5 (now F16)
- **Steps:**
  1. Add `th` and `en` keys to `strings.json` for:
     - the About paragraphs, including the "ตรวจสอบเมื่อ" date
     - the About section titles and the art note
     - the three checklist image captions
     - the share title
  2. Replace those literals in `public/js/main.js` with `t('key')`.
  3. **Keep the boot-failure line in JS.** It shows when the JSON couldn't load, so it can't come from the JSON. The logo words in `cards.js` are the brand and also stay.
  4. Remove `install` from both allowlists, in `analytics.js` and `functions/api/e.js`. Or, if the owner wants install counts, send it on `appinstalled`.
  5. Re-render the images if a checklist caption changed.
- **Done when:**
  - no Thai literals remain in `main.js` apart from comments and the boot line
  - the EN toggle switches the About sheet
  - the smoke test passes
  - #5 is moved to *Fixed*

### N3. Add CI on GitHub

- **Who:** AI-ready · **Status:** Done (10 Oct 2026). Run 1 caught a timing-dependent test (fixed); run 2 (`90de49d`) passed both jobs on GitHub · **Issue:** #4 (now F15)
- **Steps:**
  1. Add `.github/workflows/ci.yml`, run on pushes and pull requests:
     - Node 22 (`actions/setup-node` with `node-version-file: .node-version`)
     - `npm ci`
     - `node tools/build.mjs`
     - `npm test`
     - `npm run check:docs`
  2. Optionally add a smoke job: `npx playwright@1.63.0 install --with-deps chromium && npm run smoke`.
  3. Confirm it passes on a branch before relying on it.
- **Done when:** the workflow is green on a pull request, the README mentions it, and #4 is moved to *Fixed*.

### N4. Bigger tap areas on 320 px phones

- **Who:** AI-ready · **Status:** Done (13 Oct 2026: below 520 px of height the room tabs are hidden and the HUD padding shrinks; smallest item tap area at 320×460 is 44.1 px, smoke checks added) · **Issue:** #2 (now F21)
- **Steps:**
  1. Add a media query for screens under about 480 px tall that gives the stage more room. For example, hide `.tabs`, since the ‹ › arrows stay.
  2. Add a smoke check at 320×460 that measures the item tap areas.
  3. Never let a control drop below 44 px; the same smoke checks cover this.
- **Done when:** the smallest item tap area at 320×460 is 44 px or more, everything else stays green, and #2 is moved to *Fixed*.

### N5. First metrics review

- **Who:** Owner + AI · **Status:** Blocked (needs about 2 weeks live, plus an API token from the owner)
- **Steps:**
  1. Run the SQL in [05-metrics.md](05-metrics.md).
  2. Report: completion per mode, share rate, the challenge funnel, help clicks, and score trends.
  3. Propose content changes for the most-missed lessons. Change the art or wording, never make the answers easier.
- **Done when:** a short report is written, and every content change it proposes is posted with "UPDATE:".

### N6. Implement live-site UX improvements

- **Who:** AI-ready · **Status:** Done (7 Oct 2026: completed in 3-loop refinement cycle) · **Issues:** #33, #34, #35, #36
- **Steps:**
  1. Review the prioritized backlog in [review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md).
  2. Implement **IMP-01** (tap-area collision offsets in `rooms.json`).
  3. Implement **IMP-02** (subtle visual breathing pulse/shimmer on pending interactive targets in `app.css` and `scene.js` to mitigate pixel hunting).
  4. Implement **IMP-03** (animated hold-to-save guide and open-in-external-browser CTA for LINE in-app webviews in `share.js` and `app.css`).
  5. Implement **IMP-04** (timer anxiety relief copy in `strings.json` and how-to dialog).
  6. Implement **IMP-05** (surface primary educational rationale directly in feedback sheet rather than behind `<details>` in `main.js`).
  7. Run `npm test`, `npm run probe`, and `npm run smoke`.
- **Done when:**
  - Tasks IMP-01 through IMP-05 are implemented and verified.
  - Smoke tests and probe checks pass with 0 regressions.
  - Issues #33–#36 are updated in `KNOWN_ISSUES.md`.

### N7. International version and social previews

- **Who:** AI-ready · **Status:** Done (11 Oct 2026, v1.2.0) · **Issue:** #37
- **What was done:** English addresses `/en/`, `/en/learn`, `/en/c/…`, `/en/checklist/…`; English start screen in the static HTML; first-visit language guess (Thai for Thai browsers or Bangkok time); `hreflang` + sitemap alternates; English JSON-LD; 25 English preview images; `og:locale:alternate` and `twitter:image:alt`; English share links keep `/en`. See [KNOWLEDGE §18](KNOWLEDGE.md#18-international-version-and-social-previews).
- **Left for the owner:**
  - language check of the English text (`ogEn`, `seo.en`, the English UI strings): the owner will provide it; apply it in `strings.json`, re-render with `npm run images`, and restore the Thai images that change by pixel noise
  - submit the updated sitemap again in Google Search Console and Bing (it now lists `/en/` and `/en/learn`)
  - check an `/en/c/p8` link in Facebook's Sharing Debugger and in LinkedIn's Post Inspector
  - have a native English speaker read `ogEn` and `seo.en`

### N8. More fun to play, more worth sharing

- **Who:** AI-ready · **Status:** Done (14 Oct 2026, v1.3.0)
- **Why:** the owner asked what else would make the game more enjoyable and more shareable. A review found that a forwarded card led to the wrong house, there was no real "challenge back", and nothing gave a reason to come back.
- **What was built:** the challenge link on the card, challenge back with both scores, the score to beat on the clock, the house date and streak in the share text, the safety book, end-of-round moments by score, a feel-only combo, sounds for silent moments, streak milestones, replay buttons above the lessons, bilingual share titles, and the checklist share fix. See [CHANGELOG 1.3.0](../CHANGELOG.md).
- **Rule kept:** no change to scoring, items or slots, so houses and old links stay the same.
- **Done when:** build, 15 unit tests and 45 smoke checks pass, screenshots looked at in Thai and English, and the live site shows v1.3.0. All true on 14 Oct 2026.

### N9. Organise the knowledge by topic, add the news-driven lessons

- **Who:** AI-ready · **Status:** Done (15 Oct 2026, v1.4.0)
- **Why:** the owner asked to check the EM-ball advice, to add knowledge about diseases after floods (in the news), and to organise the growing knowledge for a better journey and more enjoyment.
- **What was built:** `r-stagnant` (EM balls), `r-ors` (diarrhoea), `r-towel` (eye infections); six topics across the book, tip card, result list and `/learn`; a featured-topic card on the start screen. See [CHANGELOG 1.4.0](../CHANGELOG.md).
- **Done when:** build, 17 unit tests, 55 smoke checks and the overlap probe (0%) pass; screens checked as a visitor in Thai and English on a phone and three tablet sizes. All true on 15 Oct 2026.

### N10. A game for the whole year: PM2.5 dust and house fire

- **Who:** AI-ready · **Status:** Done (15 Oct 2026, v1.5.0)
- **Why:** the owner: "we have stories only before and after flood, that no people will pay attention outside risk time". The game needed reasons to come back in the dry season too.
- **What was built:** a mode registry, `dust` (12 lessons, haze, Air4Thai link) and `fire` (13 lessons, falling smoke, helpline 199), a season default, the year-round wording, and per-mode link previews and checklists. See [CHANGELOG 1.5.0](../CHANGELOG.md) and [KNOWLEDGE §22](KNOWLEDGE.md#22-a-game-for-the-whole-year-v150).
- **Done when:** build, 20 unit tests, 57 smoke checks and the overlap probe (0%) pass; flood houses unchanged; four modes checked as a visitor in Thai and English at 320 px and on three tablet sizes. All true on 15 Oct 2026.

## Later

### P1. Bathroom, bedroom and garage

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #14, #10
- **Steps:**
  1. Get the owner's decision on soaked mattresses (#10).
  2. Draw each room following [GUIDELINES §4](GUIDELINES.md#4-art).
  3. Add its slots and set `enabled: true`.
  4. Add the candidate items listed in [01-safety-content.md](01-safety-content.md#content-ready-for-the-later-rooms), each with sources.
  5. Run `npm run probe`, all the tests, and the image re-render.
- **Done when:** the build passes, every new item appears in a year of houses (the unit test checks this), and the screenshots are reviewed.

### P2. Accessibility pass with a screen reader

- **Who:** Owner · **Status:** Todo
- **Steps:** test VoiceOver and TalkBack (rows 31–32 of the test matrix), and record the findings.
- **Done when:** the matrix rows are filled in, and each problem is either fixed or entered in KNOWN_ISSUES.

### P3. Lighter preview images

- **Who:** AI-ready · **Status:** Todo (optional) · **Issue:** #28
- **Steps:** render `og/*.png` as JPEG at about quality 85, update `og:image:type` in `tools/build.mjs`, and re-check Facebook and LINE.
- **Done when:** the previews are about half their current size and still look sharp in both apps.

### P4. More languages

- **Who:** Owner + AI · **Status:** Todo (optional)
- **Why:** English and Thai cover the first launch. Tourists and migrant workers in Thailand may read Burmese, Lao, Khmer or Chinese.
- **Steps:** add a `strings.json` block and an `ogEn`-style set for the language, a path such as `/my/`, extend `langPath`, `guessLang` and the build's `localize()`, and have a native reader check the safety text. Do not machine-translate safety advice without that review.
- **Done when:** the build, tests and smoke test cover the new language and a native reader has signed off.

### P5. Share-loop ideas not built yet

- **Who:** AI-ready (P5a–c) / Owner + AI (P5d) · **Status:** Todo (optional)
- **P5a. Weekly house** ("บ้านแห่งสัปดาห์"): a house key per ISO week, a third start button for the week, its own streak. It gives family groups one house to compare all week.
- **P5b. QR code on the card and the checklists:** for people who print the checklist or forward only the picture. It needs a small hand-written QR encoder (no runtime packages); check the 500 KB budget first.
- **P5c. Family round-up:** the share text of a challenge chain could list every score it has seen (`?s=8,6,9` in the link). Keep it to scores only, no names, and cap the list.
- **P5d. Crowd stats on the page** ("7 in 10 players turned the breaker off"): needs aggregate numbers from Analytics Engine published as a static JSON by the owner, never per-player data.
- **P5e. Themed practice house:** a random house built only from one topic (for example "🦠 health week"). It needs the topic in the house key so challenge links rebuild the same house; until then the featured card sends players to `/learn` and the book.
- **Done when:** each idea is built with a smoke check, or dropped with a reason written here.

### P6. More lessons for the remaining disease groups

- **Who:** Owner + AI · **Status:** Todo (optional)
- **Why:** the DDC's six groups (27 Sep 2026) are now covered except **skin infections** (keep skin clean and dry, avoid walking barefoot; partly in `r-mudfeet`) and **respiratory infections** (hygiene, a mask when coughing or sneezing). Melioidosis (southern provinces) is not covered either.
- **Steps:** find an agency source (or the DDC page itself), draw a sprite, pick a slot, run `npm run probe`, and keep each tip under 80 characters in both languages.
- **Done when:** each new lesson has a source, a topic, a smoke-checked tip card, and the probe still reports 0%.

### P7. Heat and summer storms

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** Todo
- **Season:** March–May (`months: [3, 4, 5]`), next to fire. Reserve code `h` for heat.
- **Why:** heat illness and summer storms (พายุฤดูร้อน: wind, hail, lightning) hit in the same dry months as fire, and DDPM and the DOH publish advice every year.
- **Candidate lessons** (each needs its own source): water for elders and children, never leave a child or pet in a parked car, tie down loose roof sheets and signs, stay away from big trees and billboards in a storm, unplug in lightning, call 1669 for heatstroke.
- **Sources to try:** DDPM summer-storm advice (via PRD or news), DOH heat advice, TMD warnings (1182), WHO heat-health guidance (international).
- **Art:** a heat shimmer threat (`haze` with a warm tint) or a storm layer; a sun-hat prop for the gecko.
- **Done when:** the mode passes [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode) and a person has reviewed the advice.

### P8. Earthquake and tsunami

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** Todo
- **Season:** any time; feature it around 26 December (the 2004 tsunami anniversary) and after quakes in the news (Bangkok felt the March 2025 Myanmar quake).
- **Why:** rare but high-impact; people in high-rise condos and on the Andaman coast need a few clear actions.
- **Candidate lessons:** drop, cover, hold on; stay away from windows and tall furniture; secure shelves; after shaking, use the stairs not the lift; on the coast, a strong quake or the sea pulling back means go to high ground at once; know the evacuation route signs.
- **Sources to try:** DDPM and the Department of Mineral Resources, the National Disaster Warning Center, Great ShakeOut and Ready.gov (international).
- **Note:** this may need a condo room (P1) and a coast scene; the current rooms suit the indoor part only.
- **Done when:** as P7.

### P9. A safety calendar: one hazard week at a time

- **Who:** Owner + AI · **Status:** Todo
- **Why:** year-round engagement works best with fixed dates people expect (the Great ShakeOut drill, Ready.gov's monthly themes). A Thai calendar could be: dust week (December), fire week (April), flood week (May, before the rains), tsunami day (26 December).
- **Steps:**
  1. The owner picks the weeks and who to partner with (schools, district offices).
  2. An assistant adds `config.weeks` (start, end, mode, featured topic), so the start screen and the featured card switch by themselves; the season default stays as the fallback.
  3. A launch-kit post per week in [04-launch-kit.md](04-launch-kit.md).
- **Done when:** each week switches the start screen without a code change, and the posts are written.

### V1. Version 2: the combined Prepare → Return run

- **Who:** AI-ready · **Status:** Todo · **Issue:** #15
- **Steps:**
  1. Add the before/after split card to `cards.js` ("เตรียมดี บ้านรอด 85%", from `Run.survivalPercent()`).
  2. Add the third start button behind `config.features.comboRun`.
  3. Run Return with `run.nextHouseOptions()`.
  4. Add smoke checks.
- **Done when:** a combined run plays end to end, the card renders at 1080×1350, the flag defaults to off until the owner turns it on, and the tests pass.

## Recurring and housekeeping

### S1. Seasonal relaunch (every April–May)

- **Who:** Owner + AI · **Status:** Recurring
- **Steps:**
  1. Re-check every source and hotline.
  2. Update the dates, including the About date.
  3. Bump `config.houseVersion`.
  4. Re-render the images.
  5. Run all the tests and the real-phone matrix.
  6. Post the relaunch, following [04-launch-kit.md §5](04-launch-kit.md#5-relaunch-every-rainy-season).

### H1. Housekeeping

- **Who:** Owner · **Status:** Partly done
- **Done, 6 Oct 2026:** in `bejranonda/carrier-vector-1988`, the old game branch `ccr-b279fcc9-aqphnj` was pointed back at `master` (`7a9c196`). It carries no game commits and is no longer ahead of `master`.
- **Optional:** delete that branch in the GitHub UI (Branches → 🗑). The session's git proxy refuses branch deletion.
- **Optional:** confirm the MIT license, or change it in `LICENSE` and `package.json`.

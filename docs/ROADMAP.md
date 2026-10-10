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
| L3 | [Set the forecast-app link](#l3-set-the-forecast-app-link) | Owner + AI | Blocked: needs the URL |
| L4 | [Review the 9 flagged (⚠️) safety items](#l4-review-the-9-flagged-safety-items) | Owner + AI | Todo |
| L5 | [Second native reader for the Thai copy](#l5-second-native-reader-for-the-thai-copy) | Owner + AI | Todo |
| L6 | [Real-phone test matrix](#l6-real-phone-test-matrix) | Owner + AI | Todo |
| L7 | [Soft launch, then the launch phases](#l7-soft-launch-then-the-launch-phases) | Owner | Todo |
| L8 | [Search consoles and AI-search check](#l8-search-consoles-and-ai-search-check) | Owner + AI | Todo |
| N1 | [Fix overlapping tap areas](#n1-fix-overlapping-tap-areas) | AI-ready | Done: 0% overlap via slot exclusion |
| N2 | [Move hard-coded text into JSON and settle the `install` event](#n2-move-hard-coded-text-into-json-and-settle-the-install-event) | AI-ready | Done (10 Oct 2026) |
| N3 | [Add CI on GitHub](#n3-add-ci-on-github) | AI-ready | Done (10 Oct 2026) |
| N4 | [Bigger tap areas on 320 px phones](#n4-bigger-tap-areas-on-320-px-phones) | AI-ready | Todo |
| N5 | [First metrics review](#n5-first-metrics-review) | Owner + AI | Blocked: needs 2 weeks live |
| N6 | [Implement live-site UX improvements](#n6-implement-live-site-ux-improvements) | AI-ready | Done: IMP-01 to IMP-07 verified |
| P1 | [Bathroom, bedroom and garage](#p1-bathroom-bedroom-and-garage) | Owner + AI | Todo |
| P2 | [Accessibility pass with a screen reader](#p2-accessibility-pass-with-a-screen-reader) | Owner | Todo |
| P3 | [Lighter preview images](#p3-lighter-preview-images) | AI-ready | Todo (optional) |
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

- **Who:** Owner + AI · **Status:** Blocked (needs the URL) · **Issues:** #6, #13
- **Steps:**
  1. Set `config.json → forecastAppUrl`.
  2. Optionally set `forecastStatusUrl`. Its endpoint must send CORS headers and answer `{"rainWarning": true|false}` within 1.5 s.
- **Done when:** the build no longer warns about the placeholder, and the "เช็กระดับน้ำล่วงหน้า" buttons appear and open the app.

### L4. Review the 9 flagged safety items

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #8, #9, #10
- **Steps:**
  1. An assistant prepares a review sheet from [01-safety-content.md](01-safety-content.md#flags-please-review-these). Ask the owner before publishing it anywhere.
  2. The owner or an agency contact confirms or corrects each item.
  3. An assistant applies the answers in `items.json` and `sources.json`, sets `verify`, and runs `npm run docs`.
- **Done when:** every playable item is `verified`, or the owner has knowingly accepted it as `partial`, and the table is regenerated.

### L5. Second native reader for the Thai copy

- **Who:** Owner + AI · **Status:** Todo · **Issue:** #11
- **Steps:** a native speaker reads `strings.json`, `items.json` and `checklists.json`, ideally an older relative. An assistant applies the edits. Tips stay at 80 characters or fewer, and placeholders stay as they are.
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
- **Done when:** both consoles accept the sitemap, the Rich Results Test shows no errors, and the findings are written down.

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

- **Who:** AI-ready · **Status:** Todo · **Issue:** #2
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

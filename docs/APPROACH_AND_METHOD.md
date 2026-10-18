# Approach and method

How บ้านรอดไหม? was researched, designed, built and checked, and why it was done that way. Read this before making a big change, so that you change the reasoning and not only the code.

## 1. The brief, in short

The brief asked for a **60-second Thai flood-safety game for phones**:

- **Two modes in one illustrated house:** ก่อนน้ำมา (prepare) and หลังน้ำลด (return).
- **Facts:** every fact comes from an official Thai agency.
- **Platform:** it runs on Cloudflare Pages and works inside the LINE, Facebook and TikTok in-app browsers.
- **Weight:** the first load is under 500 KB.
- **Privacy:** no personal data and no cookies.
- **Accessibility:** tap targets of 44 px or more, colour-blind-safe highlights and no flashing.
- **Tone:** respectful, with no tragedy, no blame and no politics.
- **Spread:** a follow-up asked for it to "hit very fast": people should enjoy it, recommend it and love to share it, and the audience is Thai social-media users who pass things on.

The deliverables were:

- the safety content table
- a design with wireframes
- the full source
- deploy steps
- a Thai launch kit
- a metrics plan
- a test checklist

## 2. Principles

Four principles decided every trade-off, in this order:

1. **Useful first.**
   - Each tap teaches one real action, sourced and dated.
   - Players leave with *all* the lessons, including the items they missed.
   - When "fun" and "correct" pulled apart, correct won: wrong options are common real mistakes, not jokes.
2. **Fun within 60 seconds.**
   - A short loop: scan → tap → choose → instant feedback.
   - The water (or the daylight) creates the pressure.
   - The clock stops while the player reads, so learning is never punished.
3. **Respectful.**
   - Humour only at the situation.
   - No people in danger, no real photos, no AI disaster images, and no blame.
   - Gentle wording for mistakes: "learned", never "failed".
4. **Built to spread, at no cost.**
   - Every result is a shareable object: a card, a grid and a challenge link.
   - The whole thing runs on free tiers, with no server rendering on the hot path.

Two working rules followed from those principles:

- **Content is data.** Everything a player reads lives in validated JSON, so people who don't code can maintain it and the build can protect it.
- **Measure, don't assume.** Requirements such as "44 px" and "under 500 KB" are measured by scripts, not eyeballed (section 7).

## 3. How the work was done

| Phase | What happened | Output |
|---|---|---|
| 1. Research, in parallel | Several research passes ran at the same time (section 4): <br>• **fact-checks** grouped by agency (electricity: MEA/PEA; health: DDC/MOPH; preparation: DDPM/BMA; then the leftover claims) <br>• **platform** (Cloudflare limits, in-app browsers, link previews) <br>• **audience** (Thai social-media use, what spreads, what draws backlash) | The sources in `sources.json`, plus [KNOWLEDGE.md](KNOWLEDGE.md) §§10–14 |
| 2. Content table | Each claim was turned into an item: a wrong action, the correct action, a tip of 80 characters or fewer, and a source with a verification flag | [01-safety-content.md](01-safety-content.md), generated from `items.json` |
| 3. Game design | Rules, modes, scoring, mascot, sharing loop and accessibility, then wireframes | [02-game-design.md](02-game-design.md) |
| 4. Engine | Pure, testable modules first: the seeded generator (`house.js`, `rng.js`) and the round rules (`round.js`), with unit tests over a year of houses | `public/js/`, `tests/run.mjs` |
| 5. Art and UI | Hand-made SVG rooms and sprites, the gecko, sheets, the HUD and effects; Web Audio synthesis | `public/art/`, `public/css/`, the UI modules |
| 6. Sharing | Canvas cards drawn with a small SVG renderer; Web Share and its fallbacks; challenge links; pre-rendered previews | `cards.js`, `share.js`, `public/og/`, `public/c/` |
| 7. Platform | A build that validates and generates; the service worker; a single Pages Function for counts | `tools/`, `functions/` |
| 8. Verification | Unit tests, headless smoke tests with in-app user agents, probes and screenshot review. Bugs found this way were fixed and turned into rules. | `tests/`, [GUIDELINES §8](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| 9. Documents | Deploy steps, launch kit, metrics and test checklist, written against the built code | `docs/03`–`06` |
| 10. Handoff | Moved to this repository (§12); every control re-measured; four tap-size problems fixed; maintainer documents written | This file, [HANDOFF.md](../HANDOFF.md), [KNOWN_ISSUES.md](KNOWN_ISSUES.md) |
| 11. Guidance for AI | What was learned and what comes next, written down for the next assistant | [AGENTS.md](../AGENTS.md), [LESSONS_LEARNED.md](LESSONS_LEARNED.md), [ROADMAP.md](ROADMAP.md) |
| 12. Live review, three refinement loops, going live | Persona review of the live site, slot exclusion, affordance and wording fixes, CI, Cloudflare connected to GitHub (§§14–15) | v1.1.0, v1.2.x |
| 13. International version | `/en/` pages, English previews, SEO for both languages, the FloodWatch link, and fixes from the owner's screenshots (§§16–17) | v1.2.0 to v1.2.2 |
| 14. More fun, more worth sharing | Review of the round and the share loop, one release that fixes the loop and adds reasons to return, a visitor probe in both languages (§18) | v1.3.0 |

The brief allowed up to three questions. None were asked: every gap had a reasonable default, so the work used one and wrote it down. The two values only the owner has became the placeholders `[DOMAIN]` and `[FORECAST_APP_URL]`. Judgement calls, such as which rooms the first version should include, are written down in [02-game-design.md](02-game-design.md) and in this file.

## 4. Verifying safety facts

The brief said *"Verify every number"* and *"Flag anything you cannot verify."* The method:

1. **One claim at a time.** Each candidate action was written down as a claim, for example "turn off the main breaker before water enters, only while dry".
2. **Find the agency's words.** The search went in this order: the agency's own page, then the agency's statement as republished by กรมประชาสัมพันธ์, then a news article that quotes the agency directly. `sources.json` records which one was found (`kind`) and its date.
3. **Grade it:**
   - **verified:** the wording supports the action as written.
   - **partial:** the core advice is official, but one detail is inferred, older, or from another body. A note says which.
   - **unverified:** nothing official was found. Nothing unverified was shipped.
4. **Numbers get their own check.**
   - Each hotline and figure was confirmed separately.
   - Where sources disagreed (sandbag fill, bleach dilution, boiling time, mattresses), the number was **left out** and the conflict written down.
   - A number that looked wrong (192) was dropped.
5. **Guardrails beat completeness.** Rescue procedures that show an injured person, and depth limits for walking in water, were kept out even where sources exist.
6. **Be honest about limits.** Several agency sites blocked automated access. That is recorded per source and as [KNOWN_ISSUES #9](KNOWN_ISSUES.md#9-agency-websites-blocked-automated-checks), so a person can finish the check.

The same `items.json` drives both the game and the review table (`npm run docs`). A reviewer's correction can't drift between the document and what players see.

## 5. Designing the game

- **Verbs, not trivia.** The four actions from the brief (ยกขึ้นที่สูง / แพ็ก / ปิด–ตัด / ปล่อยไว้) plus a few natural extras (วางกั้น, ย้าย, เก็บกวาด, เรียกช่าง) make each choice something you *do*. Icons show the type of action, never whether it's correct.
- **Wrong options are real mistakes,** each with feedback that explains the risk. Decoys teach the good habit ("already safe") and carry the comedy: the coiled rope that isn't a snake.
- **Pressure that means something.**
  - **Prepare:** the rising water decides what floods, using the item's visual centre, so the rule is exactly what the player sees.
  - **The breaker** changes its correct answer once the floor is wet. This is the single most important electrical lesson.
  - **Return:** a daylight bar, because the danger there is hidden, not rising.
- **Forgiving by design.**
  - The clock pauses while reading.
  - A mistake costs time, not points. It becomes "learned".
  - The result lists every lesson.
- **Comparable scores.** `score10` normalises houses of 5–7 targets to a score out of 10, so cards from different houses still compare. Rank titles flatter at every level.
- **Replay:**
  - the daily house, the same for everyone (Bangkok date)
  - a streak
  - random practice houses
  - challenge links that rebuild a friend's exact house

  This all comes from deterministic seeding: same seed, same content, same house.
- **One house, two looks.** Each room is one SVG with a `mud` layer and two skies. The Return mode reuses the art at almost no extra cost.

## 6. Designing for sharing

Each feature answers a research finding. The full table is in [KNOWLEDGE §15](KNOWLEDGE.md#15-from-research-to-features). The method behind it:

1. **Share objects, not just links.** The result card and the checklists are images that work even when nobody opens the game. They copy the bright greeting pictures that older relatives already forward.
2. **A text that pastes anywhere.** The score, the rank, a spoiler-free ✅💡💧⬜ grid, the link and a hashtag.
3. **Challenges that are fair.** A link encodes the mode, the score and the house seed. The friend plays the same house and sees "เพื่อน… 8/10".
4. **Previews without a server.** Each `/c/{p|r}{0–10}` is a static page with its own pre-rendered image. Crawlers get the score and the click keeps the house key (no `og:url`), and nothing counts against the free Functions quota.
   - This is the one deliberate change from the brief, which asked for a Pages Function to render the image. The reasons are in [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered).
5. **Assume the worst in-app browser.** Native share → share sheet → LINE/Facebook/X intents → copy → long-press the image. LINE also gets an "open in browser" link. Each step was chosen from documented platform behaviour ([KNOWLEDGE §11](KNOWLEDGE.md#11-browser-and-in-app-facts)).

## 7. Measuring instead of assuming

Several requirements are numbers, and numbers get measured.

| What | How | Where |
|---|---|---|
| Start-screen weight (< 500 KB) | The build gzips everything the start screen loads and fails above the limit | `tools/build.mjs` (prints `budget …`) |
| Item tap areas (≥ 44 px) | Playwright reads `getBoundingClientRect()` of every `.hit` on a 375×548 screen | `tests/smoke.mjs` |
| Controls (≥ 44 px) | Every visible `button`, `a[href]`, `summary` and `[role=button]` on the game, result, checklist, help and about screens is measured. Source links inside a line of text are checked by height. | `tests/smoke.mjs` (`smallControls`) |
| Tap areas on other screen sizes | The same measurement at 320×460 … 390×664 (one-off probe; results in [KNOWN_ISSUES F21](KNOWN_ISSUES.md#fixed)) | Re-run by changing the smoke test's viewport |
| Overlapping tap areas | Generate two years of daily houses in every mode and intersect the hit boxes in each room | `npm run probe` |
| Controls over items (v1.7.0) | Intersect the room arrows' boxes with every item's hit box, in every mode, room and three houses, at 390 × 760 and 360 × 640 | `tests/smoke.mjs` |
| Flood timings | Invert the water curve for each item's possible slots | `npm run probe` |
| Determinism and rules | 365 daily houses per mode. Each must have: 5–7 targets, at least one target per room, a critical item in Prepare, no slot used twice, tap areas ≥ `MIN_HIT`, and exactly one correct answer. Across the year, every playable item must appear at least once. | `npm test` |

**The lesson from the handoff.** The original smoke test measured only the items inside the art, and they passed. Measuring *every* control at handoff found four problems:

- the HUD and tabs at 40 px on short screens
- the "ทำไม?" expander at 35×40 px
- source links 21–38 px tall
- screenshot names that didn't match the docs

All four are now fixed and checked automatically. The lesson: measure the whole requirement, not the part you were thinking about.

## 8. Building for the free plan

- **Static first.** Everything is static except `POST /api/e`. `_routes.json` keeps Functions on `/api/*`, so pages and images never touch the 100,000-requests-a-day Functions quota.
- **No build dependencies.** The build uses only Node built-ins, and Cloudflare runs it as-is with Node 22 (`.node-version`).
- **Validation is the safety net.** A typo in the JSON fails the Cloudflare build, and the previous version stays live. Non-developers can therefore edit on GitHub safely.
- **Offline is an extra, not a requirement.** The service worker caches the game after the first visit. iOS in-app browsers don't run service workers, and the game doesn't need them.
- **Enable the account first.** Analytics Engine has to be switched on once per Cloudflare account. Until then the files upload but the deploy fails and the site stays down, which looks like a hosting error (522).
- **Analytics never block anything.** Events are batched and sent with `sendBeacon` when the page is hidden. They are anonymous counts written to Analytics Engine, and can be sampled if the game goes viral. Cookieless Web Analytics adds page views.

## 9. Testing

1. **Unit tests** (`npm test`, 27) cover only the pure modules: seeding, house rules, water, scoring, the wet breaker, ranks, challenge links, the midnight reset, the version 2 carry-over, since v1.6.0 the switches' end dates and what the start screen recommends, since v1.7.0 the power cut's fridge at 4 story hours, since v1.8.0 the home check's amounts, and since v1.8.1 the card text wrapping. They run in Node in well under a second.
2. **Smoke tests** (`npm run smoke`, 117 checks since v1.9.0, run by default as a Thai phone in Bangkok on a pinned day, 18 Oct 2026, which `SMOKE_DATE` changes; the English checks use their own locale and time zone, for example a visitor from London) run real headless Chromium against a server that copies Pages routing (`/c/p8` → `c/p8.html`, SPA fallback). They use the user agents of:
   - Android Chrome
   - an iPhone SE-sized Safari
   - LINE's Android in-app browser
   - Facebook's Android in-app browser

   They also test offline play after the first visit, reduced motion, and the analytics beacon.
3. **Screenshots** from the same run (`--screens docs/screens`) were *looked at*. Several bugs were found only that way: the lamp behind the wall, the speech bubble covering items, a blue result screen, a date overlapping a pill on the card.
4. **Real phones were not available.** The 50-row manual matrix in [06-test-checklist.md](06-test-checklist.md) is the plan, and [KNOWN_ISSUES #3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers) keeps it visible as a launch blocker.

## 10. Scope cuts, said out loud

| Cut | Why | Where it stands |
|---|---|---|
| Bathroom, bedroom, garage | Three rooms already hold every priority item; art takes time | Content partly ready; `enabled: false` ([#14](KNOWN_ISSUES.md#14-bathroom-bedroom-and-garage-are-not-drawn)) |
| Version 2 combined run | The brief asked for it to be structured, not built | Data links, `Run` and a test exist; the card and button don't ([#15](KNOWN_ISSUES.md#15-version-2-the-combined-prepare--return-run)) |
| Per-request preview images | Free-plan CPU and request limits | Pre-rendered instead ([#23](KNOWN_ISSUES.md#23-link-previews-are-pre-rendered-not-drawn-per-request)) |
| Leaderboards, names, accounts | Personal data and PDPA work, plus moderation | Not planned. Challenge links give the social comparison without identities. |
| Push notifications, install prompt | They need permissions, and in-app browsers lack them | Not planned. The `install` event is reserved ([#5](KNOWN_ISSUES.md#fixed)). |
| Real-device testing | No devices in the build environment | The owner's launch task ([#3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers)) |

## 11. How to keep going

The loop that should run every season:

1. **Measure:** read the metrics in [05-metrics.md](05-metrics.md): completion, share rate, the challenge funnel, which lessons get missed most.
2. **Decide:** the most-missed items need clearer art or wording, not easier answers. Channels that bring players back get the outreach effort.
3. **Change the content:** edit the JSON with sources ([GUIDELINES §2](GUIDELINES.md#2-safety-content)), bump `seo.updated`, run the checks, and ship structural edits around midnight.
4. **Say so:** post "UPDATE:" for any change to safety advice, and share aggregate results ("7 ใน 10 คนเลือกเรียกช่างไฟ"), never individual ones.

The concrete next tasks are in [ROADMAP.md](ROADMAP.md), and what this first iteration taught us is in [LESSONS_LEARNED.md](LESSONS_LEARNED.md).

## 12. Moving the project between repositories

The game was built in `bejranonda/carrier-vector-1988/baanrodmai/`, then moved to the root of this repository on 6 Oct 2026. The method below keeps the history and can be reused.

1. **Re-root each commit.** For each commit that touched the folder, oldest first, take the folder's tree. Recreate the commit with the same author, committer, dates and raw message, with the previous recreated commit as its parent:

   ```bash
   tree=$(git rev-parse "$c:baanrodmai")
   git cat-file commit "$c" | sed '1,/^$/d' > msg.txt     # the raw message
   GIT_AUTHOR_NAME=… GIT_AUTHOR_DATE="$(git log -1 --format=%ad --date=raw $c)" … \
     git commit-tree "$tree" ${parent:+-p "$parent"} -F msg.txt
   ```
2. **Import the commits.** Point a temporary branch at the last recreated commit, `git fetch` it into the new repository, set `main` to it, and remove the temporary branch.
3. **Commit the new work on top** in separate commits: here, the accessibility fixes, then the docs.
4. **Check a fresh clone** (build with a clean `git status`, tests, smoke test) before pushing.
5. **Clean up the old repository additively,** with a commit that removes the folder. Rewrite or delete its branch only if the owner asks. In this case the owner did ask, and the branch was force-pushed back to `master` with `--force-with-lease`.
6. **Write the move down only once it is verified:** commit ids, `git ls-remote`, the GitHub file listing.

## 13. Making the game findable (SEO and AI search)

The brief for going live was: put the app on a suitable subdomain of `autobahn.bot`, and think about search and AI search. This is how that was approached and what was checked.

1. **Find the real problem before choosing tactics.** The game is a JavaScript app, and link-preview bots don't run JavaScript. Fetching the live start page showed what a crawler sees: a title, a description and one `<noscript>` line. Everything the game teaches was invisible. That decided the plan: put the substance into plain HTML.
2. **Reuse the content, don't rewrite it.** Safety advice is the one thing in this project that must not drift. `/learn`, `/llms.txt` and the JSON-LD are generated from the same JSON as the game, so a corrected tip corrects every surface, and `seo.updated` is the single value to bump.
3. **Be honest about uncertainty on the page.** The partly verified items (11 since v1.5.0) appear on `/learn` with "⚠️ under review", the same flag the game's docs use. Crawlers and assistants shouldn't see more certainty than a reviewer would give.
4. **Add only what is true.** There is no FAQ, HowTo, rating or review markup, because the page has none of those. `llms.txt` is included knowing it is an informal proposal that no major engine is confirmed to use ([KNOWLEDGE §16](KNOWLEDGE.md#16-search-and-ai-search-facts)); it costs nothing.
5. **Choose the address on evidence.** `baanrodmai.autobahn.bot` was weighed against a shorter name. Length wasn't the problem: the name matches the game, follows the zone's other subdomains, and rendered fully on the 1200×630 previews and the checklist image. Those images were re-rendered and looked at, not assumed. The one existing name that would have been shorter (`flood`) was already in use by another service, so it was left alone.
6. **Keep the duplicates out of the index.** The share pages (49 at the time, 97 since v1.5.0, Thai and English) are copies of the app shell, so they canonicalise to `/` and stay out of the sitemap, and `*.pages.dev` gets `noindex` so only the custom domain competes.
7. **Test the part you can measure; say what you can't.** The build, tests and a phone-sized browser run were checked on the live site. Indexing, ranking and AI citation can't be measured on day one, so they became a roadmap task with a date ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) and a known issue (#32).
8. **Run the existing guard rails on new work.** The new footer link failed the 44 px check at 41 px, and a smoke-test hang on Windows Chrome was reproduced on untouched `HEAD` before anyone blamed the new code. Both are in [LESSONS D7, D8](LESSONS_LEARNED.md#d-testing-and-verification).
9. **Deployment surfaced two account-level prerequisites** (a repository Cloudflare could see, and Analytics Engine enabled) that no code change could fix. They are recorded as lessons ([F6, F7](LESSONS_LEARNED.md#f-working-in-an-ai-sandbox)) and in [03-deploy.md](03-deploy.md#the-live-setup), so the next deploy starts with them.

## 14. Post-deploy live site review and empirical persona validation

Following the initial production deployment to https://baanrodmai.autobahn.bot on 6 Oct 2026, an empirical evaluation was conducted on 7 Oct 2026 to validate real-world usability:

1. **Inspection on the live origin:** Testing directly on the live domain ensured that Cloudflare asset delivery, Web Audio unlocked behaviors, and service worker caching matched real player conditions.
2. **Multi-device mobile viewport testing:** The game loop was validated at 390×844 and 375×667 viewports, testing tap accuracy, HUD responsiveness, and dialog ergonomics.
3. **Target persona simulations:** Rather than evaluating generic web metrics, the game was tested against three core Thai user journeys:
   - **Elderly LINE group forwarders (ป้าสมศรี):** Testing readability, panic-inducing timer pressure, and in-app Webview card saving.
   - **Young social media natives (น้องแบงก์):** Testing visual snap, animation pacing, and emoji grid shareability.
   - **Flood-affected homeowners (พี่วิชัย):** Testing rapid emergency utility access and offline functionality.
4. **Actionable engineering backlog:** Insights were structured into prioritized, AI-ready task cards (IMP-01 through IMP-07) in [review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md) with explicit file targets and acceptance criteria.

## 15. Three-loop iterative refinement and optimal verification

Following the empirical live evaluation, a structured 3-loop improvement process was executed to drive all dimensions to optimal quality:

1. **Loop 1: Collision Resolution & Educational Immediacy**
   - Implemented a slot exclusion graph (`slot.excludes` in `rooms.json` checked in `house.js`) eliminating tap overlaps from 32% (worst 45%) down to 0% (worst 0%) across 1,460 simulated houses.
   - Introduced a contextual idle affordance timer (3.5s) triggering a gentle breathing ring (`.show-hints`), eliminating pixel-hunting without visual clutter for fast players.
   - Surfaced the 1-sentence educational `why` rationale directly beneath the tip card in choice sheets, leaving the `<details>` accordion strictly for authoritative agency citations.
2. **Loop 2: Elderly Accessibility & In-App Friction Relief**
   - Relieved timer anxiety for seniors by adding reassuring copy in How-to modals and a prominent `⏸️ พักเวลาอยู่ ค่อยๆ คิดได้เลย` badge inside choice sheets.
   - Enhanced muddy floor hazard contrast in Return mode using a bright contour rim and drop-shadow.
   - Added clear tap/hold image save guidance and a dedicated LINE In-App Browser helper banner (`.line-guide`) with external browser launch shortcuts.
3. **Loop 3: Cultural Polish & Final Verification**
   - Infused warm Thai care copy (*"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยจากน้ำท่วม 💙"*) into result forwarding templates.
   - Re-validated across all 3 personas and heuristics, achieving an optimal net score of 9.74 / 10.
   - Validated automated suites (`npm test`, `node tools/build.mjs`, `npm run probe`, `npm run check:docs`). Documented in [review/ITERATION_LOG.md](../review/ITERATION_LOG.md).

## 16. Making the game international

The brief was: people around the world should be able to find and use it, with the focus kept on Thailand. The decisions and the method:

1. **Decide the scope in a sentence.** English, added to Thai, with Thai advice and Thai hotlines. Safety advice is sourced from Thai agencies, so it isn't translated into other legal or electrical settings, and no foreign numbers were added because none were verified ([KNOWN_ISSUES #37](KNOWN_ISSUES.md#37-the-international-version-is-english-only-with-thai-advice-and-hotlines)).
2. **Give each language its own address.** `/en/`, `/en/learn`, `/en/c/…` and `/en/checklist/…` are real files, so crawlers and link previews see English without running JavaScript. `hreflang` pairs (th, en, x-default → en) sit in the pages and the sitemap.
3. **Choose the language in a fixed order:** `?lang`, then the `/en` path, then the stored choice, then a guess. The guess is Thai for a Thai browser or the Asia/Bangkok time zone, otherwise English. A Thai person abroad can switch with one button, and the choice is remembered.
4. **Keep the address bar honest.** `langPath` rewrites it with `history.replaceState`, so a link copied from the page is in the language the person sees.
5. **Generate, don't copy.** The English pages, previews and `/learn` come from the same JSON as the Thai ones (`strings.json` `th`/`en`/`ogEn`/`seo`, and the English fields of `items.json`). The build fails if a key is missing in either language, so the two can't drift.
6. **Render English previews separately.** `ogEn` feeds `tools/render.html`, giving 25 English images next to the 25 Thai ones (50 in all). Static files keep this inside the free plan.
7. **Treat the brand as data.** The Thai name stays in Thai pages; the English pages use "Baan Rod Mai?" built from `logoA`/`logoB`, in HTML and on the canvas.
8. **Choose the subdomain on evidence.** The owner asked whether to change it for SEO. The existing name matches the game and sits in the zone the owner already controls, and the shorter `flood` was taken by the owner's own BKK FloodWatch. So the game stayed on `baanrodmai.autobahn.bot`, and FloodWatch became a button inside the game ([KNOWLEDGE §19](KNOWLEDGE.md#19-the-water-level-link-bkk-floodwatch)).
9. **Test as the new audience.** The smoke test runs an English visitor from London, the `/en/` HTML as a crawler sees it, `/en/learn`, an English challenge banner and the English wordmark. The default Thai tests moved to the Thai locale and Bangkok time zone so the guess doesn't change them.
10. **Say what isn't done.** The short flash of Thai on `/` for visitors from abroad was found by timing the first paint and fixed on 14 Oct with a redirect that leaves search bots on Thai ([F23](KNOWN_ISSUES.md#fixed)). Game events gained a language field on 13 Oct. Still open: no native English review ([#11](KNOWN_ISSUES.md#11-thai-and-english-copy-need-a-second-native-reader)).

## 17. Working from the owner's feedback

After going live, most corrections came from the owner's short messages and screenshots. The method that worked:

1. **Reproduce first.** "Header still in Thai at EN mode" was reproduced in headless Chromium before changing anything. It was a hard-coded wordmark, which also affected the result card and the checklist image, so the fix covered all three ([GUIDELINES §8, rules 31–32](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
2. **Fix the class of bug, not the instance.** The wordmark became data, and a smoke check was added so it can't regress.
3. **Answer the question that was asked.** For "should we change the subdomain" the answer was an evidence-based "no", with the reasons, then the owner's decision was followed.
4. **Don't assume what a name means.** `flood.autobahn.bot` already existed; the owner confirmed it was their own project before it was linked as `forecastAppUrl`.
5. **Verify the live site after each push.** A green push is not a live site (see [LESSONS](LESSONS_LEARNED.md)). The version chip on the start screen makes this a one-glance check.
6. **Write the documents last, from the code.** Every figure in this sweep (130 keys per language, 49 pages, 50 images, 38 precached files, 35 checks, 147 KB) was read from the build or test output, not remembered.

## 18. Making it more fun and more worth sharing (v1.3.0)

The owner's question was open: "anything else to improve, to enjoy and like to share". The method:

1. **Map before proposing.** Two read-only reviews ran in parallel: one traced the round (timer, scoring, feedback, progress), one traced every share path (card, text, links, previews, events). Each listed gaps with file and line.
2. **Fix the loop before adding features.** The biggest gap wasn't missing fun but a broken share path: the card printed the site root, so forwarding the picture (the main way older relatives share) led to today's house, not the one on the card. That and challenge back came first.
3. **Add reasons to return that respect the rules.** A safety book (ids on the device), streak milestones and score-based endings. No leaderboards, names or accounts, because the privacy rule forbids them.
4. **Keep the score honest.** Feel features (combo, sounds, stamp) add no points, so challenge links stay fair and nobody is rewarded for rushing past the tips.
5. **Reuse what exists.** `fitText`, `pickLine`, `Gecko`, `confetti`, `shareChannel`, `playableRooms`, and two strings that were written but never used (`challengeTarget`, `geckoDecoy`).
6. **Test as a visitor, then look.** Beyond the 45 checks, a one-off probe played a perfect English round, a Thai challenge win, the smallest phone and the checklist, copying the real share texts from the clipboard. Its screenshots found two layout bugs the checks missed ([LESSONS C10](LESSONS_LEARNED.md#c-engineering-and-platform)).
7. **Say what was left out:** a weekly house, a QR code, a family round-up and crowd stats ([ROADMAP P5](ROADMAP.md#p5-share-loop-ideas-not-built-yet)).

## 19. Checking a claim, adding knowledge, and organising it (v1.4.0)

The owner asked three things in one go: is "throw EM balls into stagnant water" right, add knowledge about the diseases in the news, and organise the growing knowledge for a better and more enjoyable journey. The method:

1. **Find the strongest source you can read in full.** For EM balls no agency statement turned up; a statement by 48 environmental scientists (2011) and a 2026 peer-reviewed study did. Both were read (the statement in full, the study's abstract). Pages that couldn't be read (NSTDA, HTTP 503) were written down as **[unverified]**, not used.
2. **Say what is uncertain.** The lesson is flagged ⚠️ with the reason, and the docs name the local office still using EM balls without blaming it.
3. **Prefer today's agency wording for news topics.** The diseases lessons use the DDC's own advice of 27 Sep 2026 (six disease groups), and only the parts that fit a 60-second hazard hunt (ORS for diarrhoea, towels and eyes).
4. **Organise by what people ask, not by where the code keeps things.** Rooms and modes suit the game; topics ("health after floods") suit a person reading the news. Topics now run through the book, the tip card, the results and `/learn`.
5. **Keep enjoyment and access apart.** Collecting a set (🏅) is the fun; reading every answer on `/learn` is the safety net. The news card offers both.
6. **Re-run every probe.** The overlap probe caught a new tap-area clash at once (9% of houses), fixed before release by changing the slot.
7. **Test on the screens people have.** Phone (390 px) and tablets (768, 1024 portrait, 1366 landscape) in Thai and English: no sideways scrolling, item tap areas 69–85 px, no page errors. Two layout issues (a button wrapping to two lines, small inline links on `/learn`) were seen in the screenshots and fixed.

## 20. From one hazard to a year of hazards (v1.5.0)

The owner saw the problem plainly: a flood game matters for half the year. They asked to extend it to other dangers (storm, tsunami, fire, PM2.5 …), to look at international guidance, and chose to start with **both dust and fire**. How it was done:

1. **Research what keeps people coming back.** All-hazards programmes (IFRC and Save the Children key messages), yearly drills (the Great ShakeOut), monthly themes (Ready.gov) and playful drills in Japan all point to a calendar people can expect. That became the season default now and a roadmap card for hazard weeks (P9). A review of serious games warned that evidence of behaviour change is thin, so we still claim knowledge only.
2. **Refactor before adding.** A registry replaced every "prepare or return" in the code, with the flood houses proven unchanged before any new content went in ([LESSONS C13](LESSONS_LEARNED.md#c-engineering-and-platform)).
3. **One mechanic per hazard that teaches something true.** Water rises, so low things flood first. Smoke falls from the ceiling, so high things go first and the air near the floor is cleaner, which is the DDPM's "crawl low". Dust is a haze you can't escape, only shut out, so nothing is lost to it and the gauge teaches the Air4Thai colours.
4. **Thai agencies decide; international guidance checks.** Every correct action rests on the Department of Health, DDPM or MEA. WHO and the US Fire Administration cross-check, and the one lesson that rests on them alone is flagged ⚠️ (smoke alarms).
5. **Leave out what can't be said safely.** Incense and candles (religious), µg/m³ ranges (changed in 2023), "never put water on an oil fire" (no readable source said it), flames on people (guardrail).
6. **Check every screen, every mode, both languages.** Four modes × Thai and English × five screen sizes, plus deep links, the checklists, `/learn` anchors and the season default for four dates. The pass found short source links under 44 px wide, now fixed.

## 21. Measuring the funnel instead of judging screenshots (v1.5.2)

The owner asked whether the home page gets people playing, whether the game gets them to the end, and whether the end gets them to share. Screenshots at one size had looked fine for weeks. This time:

1. **Use the screens people really have.** Besides a 390 × 760 phone: 320 × 460 (small iPhone with bars), 360 × 640 (Android inside LINE), 390 × 664 (iPhone inside LINE), 412 × 800 and two tablets.
2. **Measure the next button, not the page.** For each step (start, accept a challenge, start the round, next, share, the share channels) record its top and bottom against the screen height. The share button turned out to be below the fold on every phone, which no check had asked.
3. **Fix the layout, not the content.** Cap the card, make the main action sticky, put channels before the preview, let the challenge move up. No text or rule changed.
4. **Lock it in.** Three smoke checks now fail if the share button, LINE or the challenge accept button leave the first screen ([KNOWLEDGE §23](KNOWLEDGE.md#23-the-visitor-funnel-measured-v152)).

## 22. The second loop: checks that look for different things (v1.5.3)

A repeated loop is only worth it if it looks somewhere new. The second pass used tools the first did not: **axe-core** for accessibility across every view, a **language-switch** check, a **clipped-text** scan, and a **bubble-over-item** measure across 48 houses. Only one finding (the logo's coral, exempt). The bigger gain came from reading the game as a story: the title asks a question the ending never answered, so the ending now does ([KNOWLEDGE §24](KNOWLEDGE.md#24-the-story-the-ending-answers-the-title-v153)).

## 23. Things that depend on the date, and docs that can't drift (v1.6.0)

The owner's switches were right in October and would have been wrong in December, and nothing would have said so: the tests read the same config on the same day. The fix and the method behind it:

1. **Give every hand-set state an end.** A switch that someone must remember to turn off will be forgotten. `rainWarningUntil` and `featuredTopicUntil` end the two switches by themselves, the build warns about a switch with no end date or a past one, and its `start` line shows what visitors see today ([KNOWLEDGE §25.1](KNOWLEDGE.md#251-switches-with-end-dates)).
2. **Put the date logic in one pure function.** What the start screen shows on a given day is `recommend(config, dayKey, …)` in `modes.js`. It takes the day as an argument and touches no DOM, so a unit test can ask about 18 Oct, 16 Nov, 1 Dec, 10 Apr and 15 Jun against a fixed config, in the same run as the other rule tests.
3. **Pin the date in the browser test, and derive the expectation.** The smoke test plays on `SMOKE_DATE` and asks `recommend()` what to expect, instead of reading today's date or keeping a second copy of the rules. Only `Date` is moved, because the rounds need real timers and `requestAnimationFrame`. Running it again with a December or April date tests another season in one command ([LESSONS D10](LESSONS_LEARNED.md#d-testing-and-verification)).
4. **Prove a template refactor changes nothing before adding to it.** The `/learn` template was turned into one `seoPage()` function for every plain page. Before any hazard page was added, the build's output had to be byte-identical (`git diff --quiet` on the generated files). Only then did the new pages go in, so any later difference in `/learn` is a deliberate one. This is the same move as the mode registry in v1.5.0 ([§20](#20-from-one-hazard-to-a-year-of-hazards-v150)).
5. **Generate the numbers a document states.** The safety table's counts are now a generated summary at the top of docs/01, and the build warns when that file is out of date. Hand-written counts elsewhere had drifted (43 items for 68, 10 partial for 11, a 35-row matrix with 40 rows); they were corrected, and where a doc gives a test count, the run's own output is the reference ([KNOWN_ISSUES F34](KNOWN_ISSUES.md#in-v160-18-oct-2026)).
6. **Keep the real date where it belongs.** A test on a pinned date can't see that today's switch has expired; the build, which runs on every deploy on the real date, can. Each check covers the part it can see ([KNOWN_ISSUES #53](KNOWN_ISSUES.md#53-the-smoke-test-runs-on-a-pinned-date)).

## 24. From a viral infographic to sourced lessons (v1.7.0)

A stockpiling infographic was spreading on Thai social media, and the owner shared it. It was useful and popular, and it cited nobody. The method for turning it into the power-cut mode:

1. **Treat the post as a list of claims, not a source.** Each claim ("72 hours", "aim for 7 days", "eat old stock first", "fridge → freezer → canned", "a manual can opener") was looked up at an agency. Thai agencies agreed on 3 days. The fridge and freezer times, the can opener, candles, unplugging and cold medicine were found only at foreign agencies (the US CDC, Ready.gov, the US Fire Administration, Tokyo); the 7 days were Tokyo's alone; no agency gave the eating order or a 3–6-month check.
2. **Keep, flag, drop.** Keep what a Thai agency says (✅). Flag what only a foreign agency says (⚠️, with the reason in `verifyNote`, on `/learn` and on the carousel image), and read and quote those pages in full. Drop what nobody says, however widely it is shared ([KNOWLEDGE §27.3](KNOWLEDGE.md#273-what-was-left-out-and-why)).
3. **Deviate from the brief in the open.** The brief asked for Thai agencies only. Ten flagged lessons depart from that; the docs say so in the summary, the issue list and the release notes, and the owner decides after a Thai review ([LESSONS E7](LESSONS_LEARNED.md#e-process-documentation-and-git), [KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)).
4. **Re-read what the whole game says about itself.** Adding international lessons made the About text, the previews, `/learn`'s titles and `llms.txt` untrue ("every tip comes from Thai agencies"). They were rewritten in the same release. A search for "Thai government" across the strings, done while documenting the release, found one that was missed (KNOWN_ISSUES #56, fixed in v1.8.0 as [F41](KNOWN_ISSUES.md#in-v180-19-oct-2026)): search the strings, not only the texts you remember.
5. **Build the story mechanic from a sourced number.** The infographic's eating order has no source, but the CDC's "a closed fridge keeps food safe about 4 hours" does. A 12-hour night in story hours with the fridge lost at hour 4 (`lostAfter`) teaches the same lesson, the fridge goes first, from a number someone can check; the freezer's 48 hours keep it safe through the night, as the source says.
6. **Measure what lies over a target.** The new fridge went on a slot that the ‹ room arrow partly covered. Measuring the overlap, rather than the item's size, showed it had covered up to 23 % of the item there since v1.0, unseen because the smoke test clicked with `force: true`. The slot moved below the arrow with its id kept, so no house changed, and a smoke check now measures arrow coverage in every mode ([LESSONS D11](LESSONS_LEARNED.md#d-testing-and-verification)).
7. **Prove the old modes didn't change.** A year of houses in each of the four older modes was compared with v1.6.1 and is identical, as in v1.5.0 ([§20](#20-from-one-hazard-to-a-year-of-hazards-v150)).

## 25. Privacy by design for what families type (v1.8.0)

The plan card is the first place the game asks people to type something of their own: where the family meets, who to call, who looks after grandma. The home check asks how many people live in the house and whether there are small children, older people, daily medicine or pets. The brief's "no personal data" had been easy while the game only stored scores; here it had to be designed in. The method:

1. **Ask only what the tool needs.** The list needs a count and four yes/no answers, so it asks nothing else: no names, ages or addresses. The plan card's fields are free text because only the family knows its meeting place, but there are six, they are short (40 characters, 60 for medicine), and the form says not to type ID-card numbers or more than needed.
2. **Keep it where it was typed.** Answers, ticks and text go to `localStorage` through `store` and nowhere else. The cards are drawn on a canvas in the browser, so even the picture is made on the phone; it leaves only when the person shares it, as their own choice.
3. **Count without content.** Three events say that the tools were opened and shared, from where, through which channel, and the shared score. They carry a label from a fixed list and a number, never a string the person typed, and the endpoint cleans every field anyway.
4. **Prove it with a test, not a promise.** The smoke test types a marker and a phone number into the plan, makes and shares the card, flushes the analytics and fails if any request body contains them ([GUIDELINES rule 56](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
5. **Say it where people decide.** The check says "คำตอบอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน" under its questions, the plan form "ข้อความอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน" above its fields, and the About sheet's privacy text names both tools.
6. **Accept the cost in the open.** Nothing on a server means nothing to sync: the list lives in one browser, and LINE's in-app browser is a different one from the phone's ([KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)). The card's own words, "เซฟไว้ในมือถือทุกคน", make the saved picture the copy that lasts.
7. **The same honesty about sources.** A tool that multiplies numbers spreads a wrong number to every family that uses it, so every number in an amount must be in a cited source, and the build checks it ([GUIDELINES rule 57](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)); lines that rest on foreign guidance say they are under review, as the lessons do.

## 26. The visitor audit loop (v1.8.1)

After v1.8.0 every automated check passed, but nobody had read the whole app as a visitor since the power cut (v1.7.0) and the home check (v1.8.0) were added. Checks look for what they were written for; a visitor reads the words, the pictures and where things go. The loop, as run on 19 Oct 2026:

1. **Walk every surface as a visitor, in both languages, on the smallest screens.** The start screen, each mode's round and result, the share sheets and the cards they make, the checklists, the home check's questions and list, the plan form and its card, `/learn`, the hazard pages, `/posts`, `llms.txt` and the manifest, in Thai and English, at 320 × 460 and 360 × 640. Read every sentence as someone who has never seen the game, and look at every card as a picture.
2. **Ask what each sentence claims about the whole game.** The tagline still said "ฝุ่น และไฟ", three hazards, after the power cut (v1.7.0) and the home check (v1.8.0) (F42, [LESSONS E9](LESSONS_LEARNED.md#e-process-documentation-and-git)).
3. **Cross-check numbers and words between surfaces.** The home check, the lessons and the checklists state the same amounts (3 L per person per day for 3 days, a torch each, 7 days of medicine) from the same sources, and no amount needed a change. The words did: "flashlight" beside "torch", "house" beside "home" (F43, F44, [LESSONS B10](LESSONS_LEARNED.md#b-safety-content-and-research)). Where a tool's wording rests on a narrower story than its sources (the home check named only power cuts, though its 3 days come from the flood-era Thai lists), widen the words, not the advice.
4. **Follow every button to where it goes, and every link to where it should come from.** A back button that named the wrong place (F48); a home check that the flood pages and the flood results didn't offer, though floods are where its amounts come from; tools that `/learn` and `llms.txt` didn't mention. The fix for the second was data, not a new rule in code: the hazard's `tools` list now drives both the page links and the result button.
5. **Look at the pictures at their real size.** Card text that broke before a "!" (F45), a wordmark into the sun (F46), a plan card with a gap (F49), Thai words broken in a two-column grid at 320 px (F47).
6. **Fix, then measure.** Each fix got a number or a check where one fits: a unit test that wraps every ending at widths 60–300 (180 bad breaks before, 0 after), three smoke checks (the flood result's 🎒 button, the tool links on `/learn` and in `llms.txt`, "← แก้แผน" back to the form), axe-core on ten screens and pages, and the build's budget (208 / 223 KB, unchanged).
7. **Walk again.** The second walk, over the same surfaces in both languages, is what says the loop is done; the first walk only says what to fix. What a walk can't show (the app's shortcuts on a real phone, the PRD page that no tool could read) goes to the owner with a task card ([ROADMAP N16](ROADMAP.md#n16-v181-visitor-audit-fixes-and-integration)), not into the release as done.

## 27. Tools first: from a game to a toolkit (v1.9.0)

On 19 Oct 2026 the owner reframed the project: "We do not know which topics can hit now; prepare for all possibilities; some trends happen spontaneously. เตรียมบ้าน can be general for all catastrophes. People like to know what they should prepare or do. The game can be the option to make it more understandable or help them not read so much text. It should not force everyone to play the game; it is a tool to help them." Until then every hazard waited for a game mode, which takes research, art, slots and a probe. The method that followed:

1. **Turn the product round, not just add a feature.** What a visitor needs in the next minute (what to do, what to keep, who does what) went to the top of the start screen as three tools; the game stayed, below, as the easier way to remember ([LESSONS A6](LESSONS_LEARNED.md#a-product-and-audience)). The cost was named before building: the game card would leave the first screen on small phones, and that was accepted as a trade-off, not discovered later ([KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)).
2. **A guide format that works without a game.** Ten lines, by phase (before, during, after), each with its own sources and `verify`, because there are no lessons behind them to carry the evidence. The format was fixed first and enforced by the build and a unit test, so the research had a target ([KNOWLEDGE §29.2](KNOWLEDGE.md#292-the-data-model-guides-phases-sources-verify)).
3. **Parallel research, one hazard each, under one strict brief.** Four researchers (flash floods and landslides, storms and lightning, earthquakes, extreme heat) worked at the same time on 18–19 Oct 2026, each told: Thai agencies first (ปภ., กรมทรัพยากรธรณี, กรมทรัพยากรน้ำ, กรมอุตุนิยมวิทยา, กรมอนามัย, กรมควบคุมโรค, กฟน., กฟภ., กทม.), through news reports that quote them when the agency site refuses automated readers; international guidance (Ready.gov, WHO, the US CDC, the US NWS) to cross-check; quote the sentence each line rests on in the source's `note`; leave out what sources disagree on and say so; mark ⚠️ anything that rests on one foreign source or on an inference; no numbers the sources don't share. Each returned 10 lines and their sources as data in the repository's format.
4. **Read every line as an editor before it goes in.** Each line was checked against the quoted sentences in its sources: does the source say this, for a Thai home, in this phase? Lines whose timing was ours (checking the electrics *after* a storm) or whose signal was an inference (the sea pulling back before a tsunami) became ⚠️ with the reason; lines where the sources split (unplugging in lightning, leaving a tall building at once) were cut to what they share or dropped ([LESSONS B11](LESSONS_LEARNED.md#b-safety-content-and-research), [KNOWLEDGE §29.4](KNOWLEDGE.md#294-what-was-left-out-and-why)). Emoji newer than Unicode 11 were replaced on the way ([GUIDELINES rule 64](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
5. **One switch for the news, with an end date.** Instead of a new mode per trend, an alert puts one guide on top until a date the owner sets, tested by a pure function on a pinned day, like the other switches ([KNOWLEDGE §29.5](KNOWLEDGE.md#295-the-alert-switch)).
6. **Walk the visitor's path at 320 px, then measure.** The hub, the picker, every guide, the new hazard pages, `/kit` and `/plan` were walked in Thai and English at 320 × 460 and 360 × 640. The walk found the guide-only pages showing no advice on the first screen, a heading below contrast and preview texts cut off ([KNOWN_ISSUES F51–F54](KNOWN_ISSUES.md#in-v190-19-oct-2026)); each fix got a smoke check or an axe-core pass. Two of the new checks were wrong at first, in ways worth keeping: one measured the bottom of an element that carries long source lists instead of where the line starts ([LESSONS D14](LESSONS_LEARNED.md#d-testing-and-verification)), and one forgot that the visitor's language choice carries over from the page before ([D15](LESSONS_LEARNED.md#d-testing-and-verification)).
7. **Look at every preview by eye.** Each new link preview, guide picture and the re-rendered default preview was opened at full size in Thai and English before it was committed; that is how the cut-off lines and the English plan preview running into its pill were found, which no check measures.
8. **Write down what the method couldn't settle.** The Thai sources were read through news reports, so a person still has to read the agencies' own pages ([KNOWN_ISSUES #60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies), [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)); what was found after the checks passed went into [#65](KNOWN_ISSUES.md#65-loose-ends-from-the-v190-sweep) rather than into the release notes as done.

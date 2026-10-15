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

1. **Unit tests** (`npm test`) cover only the pure modules: seeding, house rules, water, scoring, the wet breaker, ranks, challenge links, the midnight reset and the version 2 carry-over. They run in Node in well under a second.
2. **Smoke tests** (`npm run smoke`, 58 checks, run by default as a Thai phone in Bangkok; the English checks use their own locale and time zone, for example a visitor from London) run real headless Chromium against a server that copies Pages routing (`/c/p8` → `c/p8.html`, SPA fallback). They use the user agents of:
   - Android Chrome
   - an iPhone SE-sized Safari
   - LINE's Android in-app browser
   - Facebook's Android in-app browser

   They also test offline play after the first visit, reduced motion, and the analytics beacon.
3. **Screenshots** from the same run (`--screens docs/screens`) were *looked at*. Several bugs were found only that way: the lamp behind the wall, the speech bubble covering items, a blue result screen, a date overlapping a pill on the card.
4. **Real phones were not available.** The 35-row manual matrix in [06-test-checklist.md](06-test-checklist.md) is the plan, and [KNOWN_ISSUES #3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers) keeps it visible as a launch blocker.

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
3. **Be honest about uncertainty on the page.** The partly verified items (10 since v1.4.0) appear on `/learn` with "⚠️ under review", the same flag the game's docs use. Crawlers and assistants shouldn't see more certainty than a reviewer would give.
4. **Add only what is true.** There is no FAQ, HowTo, rating or review markup, because the page has none of those. `llms.txt` is included knowing it is an informal proposal that no major engine is confirmed to use ([KNOWLEDGE §16](KNOWLEDGE.md#16-search-and-ai-search-facts)); it costs nothing.
5. **Choose the address on evidence.** `baanrodmai.autobahn.bot` was weighed against a shorter name. Length wasn't the problem: the name matches the game, follows the zone's other subdomains, and rendered fully on the 1200×630 previews and the checklist image. Those images were re-rendered and looked at, not assumed. The one existing name that would have been shorter (`flood`) was already in use by another service, so it was left alone.
6. **Keep the duplicates out of the index.** The 49 share pages (Thai and English, a few of them `/learn` and `/en/learn` excluded) are copies of the app shell, so they canonicalise to `/` and stay out of the sitemap, and `*.pages.dev` gets `noindex` so only the custom domain competes.
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

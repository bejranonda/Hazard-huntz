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
| 10. Handoff | Moved to this repository; every control re-measured; four tap-size problems fixed; maintainer documents written | This file, [HANDOFF.md](../HANDOFF.md), [KNOWN_ISSUES.md](KNOWN_ISSUES.md) |

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
| Tap areas on other screen sizes | The same measurement at 320×460 … 390×664 (one-off probe; results in [KNOWN_ISSUES #2](KNOWN_ISSUES.md#2-item-tap-areas-are-3843-px-on-320-px-wide-phones)) | Re-run by changing the smoke test's viewport |
| Overlapping tap areas | Generate two years of daily houses in both modes and intersect the hit boxes in each room | `npm run probe` |
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
- **Analytics never block anything.** Events are batched and sent with `sendBeacon` when the page is hidden. They are anonymous counts written to Analytics Engine, and can be sampled if the game goes viral. Cookieless Web Analytics adds page views.

## 9. Testing

1. **Unit tests** (`npm test`) cover only the pure modules: seeding, house rules, water, scoring, the wet breaker, ranks, challenge links, the midnight reset and the version 2 carry-over. They run in Node in well under a second.
2. **Smoke tests** (`npm run smoke`, 24 checks) run real headless Chromium against a server that copies Pages routing (`/c/p8` → `c/p8.html`, SPA fallback). They use the user agents of:
   - Android Chrome
   - an iPhone SE-sized Safari
   - LINE's Android in-app browser
   - Facebook's Android in-app browser

   They also test offline play after the first visit, reduced motion, and the analytics beacon.
3. **Screenshots** from the same run (`--screens docs/screens`) were *looked at*. Several bugs were found only that way: the lamp behind the wall, the speech bubble covering items, a blue result screen, a date overlapping a pill on the card.
4. **Real phones were not available.** The 32-row manual matrix in [06-test-checklist.md](06-test-checklist.md) is the plan, and [KNOWN_ISSUES #3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers) keeps it visible as a launch blocker.

## 10. Scope cuts, said out loud

| Cut | Why | Where it stands |
|---|---|---|
| Bathroom, bedroom, garage | Three rooms already hold every priority item; art takes time | Content partly ready; `enabled: false` ([#14](KNOWN_ISSUES.md#14-bathroom-bedroom-and-garage-are-not-drawn)) |
| Version 2 combined run | The brief asked for it to be structured, not built | Data links, `Run` and a test exist; the card and button don't ([#15](KNOWN_ISSUES.md#15-version-2-the-combined-prepare--return-run)) |
| Per-request preview images | Free-plan CPU and request limits | Pre-rendered instead ([#23](KNOWN_ISSUES.md#23-link-previews-are-pre-rendered-not-drawn-per-request)) |
| Leaderboards, names, accounts | Personal data and PDPA work, plus moderation | Not planned. Challenge links give the social comparison without identities. |
| Push notifications, install prompt | They need permissions, and in-app browsers lack them | Not planned. The `install` event is reserved ([#5](KNOWN_ISSUES.md#5-some-ui-text-is-hard-coded-in-mainjs-and-one-event-is-unused)). |
| Real-device testing | No devices in the build environment | The owner's launch task ([#3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers)) |

## 11. How to keep going

The loop that should run every season:

1. **Measure:** read the metrics in [05-metrics.md](05-metrics.md): completion, share rate, the challenge funnel, which lessons get missed most.
2. **Decide:** the most-missed items need clearer art or wording, not easier answers. Channels that bring players back get the outreach effort.
3. **Change the content:** edit the JSON with sources ([GUIDELINES §2](GUIDELINES.md#2-safety-content)), run the checks, and ship structural edits around midnight.
4. **Say so:** post "UPDATE:" for any change to safety advice, and share aggregate results ("7 ใน 10 คนเลือกเรียกช่างไฟ"), never individual ones.

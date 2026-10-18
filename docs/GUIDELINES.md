# Guidelines

These rules are for anyone changing this game's content, art or code, people and AI assistants alike. Several of them exist because a bug or a mistake already happened. Those are collected in [section 8](#8-rules-that-come-from-bugs-we-already-hit).

**Before you change anything,** read [HANDOFF.md](../HANDOFF.md) and [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## 1. Non-negotiables

These come from the original brief. A change that breaks one of them is not finished, however good it looks.

1. **Safety facts are real.**
   - Every action the game calls correct traces to an official source in `sources.json`: a Thai agency wherever one says it. Where only a foreign agency does (the smoke alarm, most power-cut lessons), the lesson is ⚠️ `partial`, says so, and waits for a Thai review (rule 55).
   - Never invent advice, numbers or sources. A viral post or infographic is a prompt, not a source.
   - Mark how sure you are (`verify`), and flag anything you could not confirm.
2. **Content guardrails:**
   - No drowning, deaths, injured people or photos of real damage.
   - No blaming government agencies or politicians.
   - No political, royal or religious references.
   - Humour is aimed at the situation (mud, chaos, the gecko's reactions), never at affected people.
3. **Privacy:**
   - No personal data and no cookies.
   - The only third-party script is Cloudflare Web Analytics, which is cookieless.
   - Events are anonymous counts.
   - Anything personal (scores, streaks, the home check's answers, the plan card's text) stays in the player's own `localStorage`, and nothing a player types is ever sent (rule 56).
   - The game must stay PDPA-compliant without needing a consent banner.
4. **Accessibility:**
   - Every tap target is **at least 44 px**: items, buttons, tabs, expanders and links.
   - Colour is never the only signal; use blue / orange / grey **plus** shapes, and never pair red with green.
   - Nothing flashes, and `prefers-reduced-motion` is respected.
   - Every control is reachable by keyboard and readable by a screen reader.
5. **Fast:**
   - The start screen stays **under 500 KB** compressed. It is 232 KB today (247 KB with the first game screen), counting the home check's code, which loads only when it opens, and the sources' notes, which it never shows ([KNOWN_ISSUES #62](KNOWN_ISSUES.md#62-source-notes-are-downloaded-by-every-visitor)).
   - No frameworks and no runtime npm packages.
6. **Works where people share it.** It must work in the LINE, Facebook and TikTok in-app browsers on Android and iOS, in iOS Safari and in Android Chrome. Every feature that a platform may lack has a fallback (see [KNOWLEDGE §11](KNOWLEDGE.md#11-browser-and-in-app-facts)).
7. **The disclaimer and help numbers are always there.**
   - The footer reads *"เนื้อหาเพื่อการเรียนรู้ หากไม่แน่ใจให้ติดต่อช่างหรือเจ้าหน้าที่"*.
   - Every result screen lists the help numbers.
8. **Never break the live game.** `node tools/build.mjs` must pass. A content mistake fails the build, and the previous version stays live. Don't work around a validation error; fix the content.

## 2. Safety content

### 2.1 Adding or changing an item

1. **Find the source first.** Add it to `sources.json` with `agency`, `title`, `url`, `date` and `kind`:
   - **`official`:** the agency's own site. Preferred.
   - **`government`:** the agency's statement republished by กรมประชาสัมพันธ์ (prd.go.th).
   - **`secondary`:** a news article that directly quotes the agency. Use this only when the first two can't be reached, and say so in `note`.
   - **`academic`:** a peer-reviewed study or an academic statement. Flag the item ⚠️ `partial`.
   - **`international`:** a UN, WHO or foreign agency page (WHO Europe, the US Fire Administration, the US CDC, Ready.gov, the Tokyo Metropolitan Government). Use it to cross-check Thai advice. When it is the *only* source, the item is ⚠️ `partial` with a `verifyNote` that says so (today: `f-alarm` and seven power-cut lessons; the list is under *Flags* in [01-safety-content.md](01-safety-content.md#flags-please-review-these)). Quote what you read in the source's `note`, with the date you read it.
2. **Write the item in `items.json`** (field reference: [KNOWLEDGE §5](KNOWLEDGE.md#5-content-model)):
   - **One correct choice**, using the agency's action in plain words.
   - **One or two wrong choices** that are *common real mistakes*. Each has gentle `feedback` that says why it's risky.
   - A **tip** of **80 characters or fewer** in Thai *and* English. It is one action, starting with the verb.
   - A **"ทำไม?"** (`why`) text that says which agency recommends this and why, in one or two sentences.
3. **Set `verify` honestly:**
   - `verified`: the agency's wording supports the action as written.
   - `partial`: the core is official but one detail is inferred, older, or from another body. Explain which in `verifyNote`.
   - `unverified`: no official source. The build warns. Do not ship these.
4. Run `npm run docs` to regenerate the table in [01-safety-content.md](01-safety-content.md). Then run `node tools/build.mjs` and `npm test`.
5. If the item is in a playable room, check that it fits a slot and doesn't crowd a neighbour (see [KNOWN_ISSUES #1](KNOWN_ISSUES.md#fixed)).

### 2.2 Numbers

- **Verify every number** against its source: phone numbers, distances, days, ratios and temperatures.
- **When sources disagree, leave the number out of the game** and record the conflict under *Flags* in 01-safety-content.md. Current exclusions: sandbag fill, bleach dilution, boiling time, mattress disposal, and from the stockpiling infographic (v1.7.0) the 7-day target, a 3–6-month check and an eating order for the fridge, freezer and cans ([KNOWLEDGE §27.3](KNOWLEDGE.md#273-what-was-left-out-and-why)).
- Re-check every **hotline** before each season. A wrong number that was deliberately left out: 192 (use 1784). 199 (fire) was left out of the flood version because only news reports cited it; the fire mode (v1.5.0) added it, quoting DDPM through a news report.

### 2.3 Wrong answers and feedback

- Wrong options must be **plausible**: what people actually do. They must never be stunts that would be dangerous to copy because the game made them look normal.
- Feedback explains the risk **without blame or fear**: *"ไม่เป็นไร รู้แล้วรอดของจริง"*. The status is "learned" (orange !), never "failed".
- No rescue procedures that show an injured person, and no depth thresholds for walking in water.

### 2.4 Changing advice that is already public

- **Never edit safety advice quietly.**
  - After the deploy, post a correction that starts with **"UPDATE:"** on every channel where the game was shared.
  - Say what changed and why.
- **Update the source dates.** If the guidance changed, also update the "ตรวจสอบเมื่อ" date in the About sheet. It is currently in `main.js`; see [KNOWN_ISSUES #5](KNOWN_ISSUES.md#fixed).
- **Ship structural edits at night.** Adding, removing or disabling items, or changing slots, reshuffles today's house. Ship such edits around midnight Bangkok time ([KNOWN_ISSUES #24](KNOWN_ISSUES.md#24-some-content-edits-reshuffle-todays-house-and-old-challenge-links)).

### 2.5 Seasonal review (April–May, before the rains)

Follow the checklist in [04-launch-kit.md §5](04-launch-kit.md#5-relaunch-every-rainy-season):

1. Re-check every source and hotline.
2. Update the dates.
3. Bump `config.houseVersion`.
4. Re-render the images.
5. Re-run the full test matrix.

## 3. Thai and English copy and tone

- **Voice:** a helpful neighbour. Warm, casual and native. Short sentences, with particles used naturally (นะ, จ้า, เลย). Explain jargon; use everyday words (ภาษาชาวบ้าน).
- **Tips:**
  - one action per tip, verb first, 80 characters or fewer
  - no exclamation-mark shouting
  - no "you must or you will die" framing
- **The gecko's lines:** about 30 Thai characters or fewer so they fit the speech bubble in one or two lines. Encouraging, never sarcastic about the player.
- **Rank titles** flatter at every level. Even the lowest rank (*มือใหม่หัดเตรียมตัว*) is something people are happy to share.
- **Humour:** at the situation only. Mud, the rope that isn't a snake, a gecko in boots. Never at victims, rescuers, agencies or any area of the country.
- **Avoid:**
  - names of politicians, parties or party colours
  - royal or religious references
  - catchphrases that mock officials, even popular ones
  - fear-mongering
  - AI-generated or realistic disaster imagery
- **English** mirrors the tone. It is written for visitors from outside Thailand and for helpers, not as a separate voice.
  - **One variety: British English** (rule 58). "torch", not "flashlight"; "power cut", not "power outage" or "blackout"; "litres", "nappies", "colour". When a source is American (Ready.gov, the US CDC, the US Fire Administration), quote it in `sources.json → note` as written, but write the lesson in the game's words; agency names keep their own spelling. Before a release, search the `en` text of every content file for the American words.
  - One name for one thing: the home check is about "our home" in its title, buttons, card and share text, not "house" in some and "home" in others.
  - Every player-facing string has a `th` and an `en` value with the same keys (233 each), and every `og` key has an `ogEn` twin. The build fails otherwise.
  - Say plainly that the hotlines are Thai and that most advice comes from Thai agencies; never say *all* of it does (rule 55). Don't add foreign numbers or laws that no source backs.
  - Agency names appear in English in `seo.en.agencies`.
  - The wordmark is `logoA` + `logoB` in each language ("Baan " + "Rod Mai?" in English; a space at the end of `logoA` is intentional). Never hard-code the name in HTML or canvas code.
- **Formatting:**
  - Keep `{placeholders}` exactly as they are.
  - Write phone numbers as plain digits (`1784`).
  - Write Thai dates as `6 ต.ค. 69` in the UI (Buddhist era, short), produced by `formatHouseDate()`.
- **Review:** have a second native speaker read new copy before release, ideally an older family member from the forwarding audience, and a native English reader for English copy (the owner has promised a language check, [KNOWN_ISSUES #11](KNOWN_ISSUES.md#11-thai-and-english-copy-need-a-second-native-reader)).

## 4. Art

- **Hand-made SVG only:** flat and warm, with chunky outlines (`#4A3426`, stroke about 2–2.2). Use the palette in `css/app.css` `:root`: mud browns plus sun yellow, sky blue, coral and teal. No photos, no AI images, and no people in danger.
- **Room files** (`public/art/rooms/<room>.svg`):
  - `viewBox="0 0 360 600"`.
  - Top-level layers in this order:
    1. `<g class="bg">`, with `sky-rain` and `sky-sun` inside
    2. `<g class="mud">`, the Return look
    3. `<g class="items">`, which the game fills
    4. `<g class="water">`, Prepare only
  - **Paint order is document order.** Later elements cover earlier ones.
  - Prefix every `id` with the room (`fr-`, `lv-`, `kt-`, and so on). All rooms are inlined into one page, so ids would otherwise clash.
- **Sprites** (`public/art/sprites.svg`): one `<symbol id="s-<name>">` each. `size` in `items.json` sets the drawn size.
  - Draw a "done" state (for example `breaker-off`) when the right action visibly changes the object.
  - Test icons at 24 px; an hourglass once read as "Σ".
- **Slots** (`rooms.json`):
  - `(x, y)` is the **bottom centre** of whatever sits there, and tags say what fits.
  - Items on the same baseline need **at least about 70 scene units** between slot centres, so their 64-unit tap areas don't overlap.
  - Run `npm run probe` after moving slots. It reports overlapping tap areas and flood timings.
- **Status colours:** blue `--ok` ✓, orange `--warn` !, grey `--miss` ? or ~. Red and green are never paired.

## 5. Code

- **Plain ES modules in `public/js/`, served as they are.**
  - No bundler, no transpiler, no framework.
  - The only npm package is the dev-only `playwright-core`, for images and smoke tests.
  - The build uses only Node built-ins.
- **Logic stays pure.** `house.js`, `round.js`, `rng.js`, `run.js`, `modes.js` and `kitplan.js` (the home check's amounts and score, v1.8.0) don't touch the DOM. Tests and the build import them in Node. Keep it that way, and put DOM work in `scene.js`, `ui.js` and `main.js`.
- **Data, not code.**
  - Tunable numbers go in `config.json`.
  - Text players see goes in `strings.json`, `items.json` and `checklists.json`, and the home check's and plan card's in `kit.json`. A few exceptions remain; see [KNOWN_ISSUES #5](KNOWN_ISSUES.md#fixed), and don't add more.
  - New features go behind `config.features.*`.
- **Tap targets:**
  - Items get `MIN_HIT` (64 scene units).
  - Controls get CSS `min-height` / `min-width` of 44 px. That includes the short-screen media query.
  - Inline text links get padding with negative margins: a 44 px tall tap area without moving the text.
  - The smoke test measures all of these.
- **In-app browsers:** check that a feature exists before using it, and always have a fallback. Never rely on any of these:
  - `window.open`
  - downloads
  - `navigator.share`
  - service workers
  - `navigator.vibrate`
  - clipboard access outside a tap
- **Network:**
  - Gameplay never waits on the network.
  - Analytics are fire-and-forget (`sendBeacon`).
  - Optional calls such as `forecastStatusUrl` have short timeouts (1.5 s).
- **Storage:** only through `store` in `util.js` (prefix `brm:`, wrapped in try/catch). Private mode and blocked storage must not break the game.
- **Accessibility:**
  - SVG items use `role="button"`, `tabindex="0"` and an `aria-label`, and Enter and Space work on them.
  - Sheets trap focus and close with Esc.
  - Motion goes through CSS animations that the reduced-motion query turns off.
- **Generated files** are never edited by hand: `public/sw.js` (edit `tools/sw.template.js`), `public/js/version.js`, `public/c/*.html`, `public/checklist/*.html`, the English pages under `public/en/`, the SEO files `public/learn.html`, `robots.txt`, `sitemap.xml` and `llms.txt`, the hazard pages `public/<slug>.html` and `public/en/<slug>.html` (`/flood`, `/pm25`, `/fire`, `/ready`; edit `tools/build.mjs`, `strings.json → seo` or the content JSON), `public/posts.html`, and the `<!--OG:START-->` block in `index.html`, which also holds the canonical link and JSON-LD.
- **Search and AI search.**
  - The lessons on `/learn`, the hazard pages and `/llms.txt` come from the content JSON. Never hand-write lesson text elsewhere.
  - A hazard page's address is its slug in `config.json → hazards`. **Never change a slug once published:** shared links and search results point at it. Hazard pages have their own canonical link and are in the sitemap, like `/learn`.
  - Bump `strings.json → seo.updated` (YYYY-MM-DD) whenever lessons or sources change.
  - Keep every crawl page script-free, and every link or button on it at least 44 px tall.
  - Add structured data only for things that exist on the page. No `FAQPage`, `HowTo`, ratings or reviews unless the page really has them.
  - Share-preview pages (`/c/*`, `/checklist/*`) keep a canonical link to `/` and stay out of the sitemap.
  - Keep `/api/` the only path `robots.txt` closes, and leave Cloudflare's AI-bot blocking off for this host.
- **Budget:** read the build's `budget` line after any change that adds files, fonts or JS. The start screen limit is 500 KB, and the aim is to stay near today's 232 KB (each mode's content adds to it, about 12 KB for the power cut; the four guides of v1.9.0 and their 36 sources added 23 KB, mostly notes the game never shows). The line counts every file in `js/`, even code loaded on demand such as `kit.js` ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)). A tool the start screen doesn't need is loaded with `import()` when it opens, and its text lives in its own file.
- **Style:** follow the surrounding code. Two-space indentation, single quotes, semicolons, small functions, and comments that explain *why*.

## 6. Testing

| When | Run |
|---|---|
| Every change | `node tools/build.mjs` and `npm test` (29 rule tests: a year of daily houses in every mode, flooding, the power cut's 4-hour fridge, scoring, bonus, challenge links, midnight reset, version 2 carry-over, the switches' end dates, what the start screen recommends, the home check's amounts, that no wrapped card line starts with closing punctuation and, since v1.9.0, the alert switch and the guides with no game) |
| UI, CSS or sharing changes | `npm run smoke` (117 checks in headless Chromium with Android, iPhone, LINE and Facebook user agents, including offline, reduced motion, `?mode=` links, the hazard pages and their tool links, the power cut, what covers each item's tap area, the home check and plan card, including that typed text is never sent, and since v1.9.0 the hub, the guides, the alert, print, `/kit` and `/plan`). It plays on a pinned Bangkok day, 18 Oct 2026 by default; add `SMOKE_DATE=YYYY-MM-DD` before the command to play another season. Add `-- --screens docs/screens` to refresh the screenshots, **and look at them**. |
| Before a release | The relevant rows of the real-phone matrix in [06-test-checklist.md](06-test-checklist.md), and a visitor pass: every screen, sheet, card and page in Thai and English at 320 × 460 and 360 × 640 ([APPROACH §26](APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)) |
| Copy, rank or domain changes | `SITE_URL=… npm run images`, then look at `public/og/` and `public/share/` |
| Changes to the build's SEO output, `seo` strings or `_headers` | The live-site checks in [06-test-checklist.md](06-test-checklist.md#live-site-checks-search-and-ai-search), after the deploy |
| Any doc change | `npm run check:docs`: every relative link and heading anchor must resolve |

Rules:

- **Rule changes get a unit test,** in `tests/run.mjs`.
- **UI requirements get a smoke check,** in `tests/smoke.mjs`. A requirement that isn't measured will regress, and the 44 px rule already did once.
- **Measure, don't assume.**
  - `npm run probe` covers overlaps and flood timings.
  - The build reports the bundle size.
  - The smoke test measures tap sizes, and since v1.7.0 how much of each item the room arrows cover (rule 54).
  - For anything else, write a short probe and record the numbers (see [APPROACH_AND_METHOD §7](APPROACH_AND_METHOD.md#7-measuring-instead-of-assuming)).
- **Report results as they are.** A skipped check is reported as skipped.

## 7. Git and releases

- **Branches.**
  - `main` is production: Cloudflare deploys every push.
  - Every other branch gets its own preview URL.
  - Content typo fixes may go straight to `main` through the GitHub editor, because the build protects the site. Code changes go through a branch.
- **Commit messages:** `feat:`, `fix:`, `content:`, `docs:`, `test:`, `chore:`. Say *what* and *why*. Content commits name the item ids.
- **Generated files.** Commit them as `node tools/build.mjs` produced them. Cloudflare rebuilds them on every deploy, so they only need to be valid ([KNOWN_ISSUES #27](KNOWN_ISSUES.md#27-the-build-rewrites-tracked-files)).
- **Images are the exception.** Cloudflare can't render them, so commit `public/og/`, `public/share/` and `public/icons/` re-rendered with the real `SITE_URL`.
- **Secrets:** never commit any. The Cloudflare API token lives in `.env` (git-ignored); `.env.example` shows the format and the permissions it needs. Keep `.dev.vars`, API tokens and account ids out of git; `.gitignore` covers the usual files. The game itself needs no secrets.
- **Versions.** Use semantic versions in `package.json`, with a matching `CHANGELOG.md` entry and a `vX.Y.Z` tag on `main` after the deploy is checked.
- **Release checklist:**
  1. `node tools/build.mjs` passes with no unexpected warnings.
  2. `npm test` and `npm run smoke` pass.
  3. Images are re-rendered if the copy, ranks, checklists or domain changed (Thai `og/` and English `og/en/`). Restore any PNG you did not mean to change with `git checkout -- <path>`; a different Chromium alters every PNG slightly.
  4. `CHANGELOG.md` and the version are updated. The version lives in `package.json` (and `package-lock.json`); `config.json → version` must match it, and the build fails if it doesn't.
  5. Merge to `main`, and wait for the Cloudflare deploy.
  6. Open the live site once and reload, so the new service worker takes over. Check that a changed text appears, in Thai (`/`) **and** English (`/en/`), and that the version chip matches. A green push is not a live site.
  7. If the previews changed, re-scrape them in Facebook's Sharing Debugger and check LINE with `?v=<n>`.
  8. If safety content changed, publish an "UPDATE:" post. Bump `strings.json → seo.updated`.
  9. If a version tag is wanted, the owner creates it as a GitHub Release, because the session's git proxy refuses tag pushes.
- **Rollback:** Cloudflare → the Pages project → Deployments → pick an earlier one → *Rollback*.
- **Prefer additive history.**
  - Fix mistakes with new commits (reverts, removal commits), not resets.
  - Force-push only when the owner explicitly asks, with `--force-with-lease=<branch>:<expected sha>`, and check the result with `git ls-remote`.
  - Branch deletion is done by the owner in the GitHub UI.
- **Before committing,** read `git status --short` and stage files by name, not with `git add -A`. CI fails only on generated files under `public/` that were left uncommitted; a stray file that does get committed (a probe's screenshot, as in v1.7.0) passes it ([LESSONS E8](LESSONS_LEARNED.md#e-process-documentation-and-git)). Run one-off probes from the session scratchpad.
- **Before pushing,** check that a fresh clone builds with a clean `git status` and passes `npm test`.

## 8. Rules that come from bugs we already hit

Each rule encodes a mistake that was made once. Details are under *Fixed* in [KNOWN_ISSUES.md](KNOWN_ISSUES.md#fixed).

1. **No control under 44 px, including in media queries.** Compact layouts for short screens once shrank the HUD and tabs to 40 px.
2. **Expanders and inline links are tap targets too.** "ทำไม?" and the source links were 21–40 px until they were measured.
3. **Check `document.readyState` before waiting for `load`.** Boot ran after `load` had fired, so the service worker never registered.
4. **One class name, one meaning.** `.mode-prepare` on both the mode buttons and the app root turned the result screen blue. Root state now uses `is-prepare` / `is-return`.
5. **"Under water" means the sprite's centre**, which matches what players see in the perspective art. Whether the floor is wet is a separate threshold (`floorWetY`).
6. **In-game messages go in the gecko's bubble** (`say()`, top-right). Toasts are for app-level messages and must never cover the floor where items sit.
7. **SVG paint order is document order.** Draw the wall before the lamp and the ground before the steps, and look at a screenshot after any art change.
8. **Use `data:` image URLs in in-app browsers.** `blob:` URLs failed to display or save there.
9. **Challenge pages must not set `og:url`,** or the shared link loses its `?h=` house key. Facebook needs PNG or JPEG previews, absolute URLs, and `og:image:width/height`.
10. **Wrap Thai with `Intl.Segmenter`.** Thai has no spaces between words, so splitting on spaces breaks lines badly.
11. **Draw share cards with `svgdraw.js`**, not by drawing an SVG `<img>` on a canvas.
12. **Count tip length in both languages.** English overflowed 80 characters first.
13. **Keep Functions on `/api/*` only** (`_routes.json`), so static pages never use up the free Functions quota.
14. **Match Chromium to `playwright-core`, or set `CHROME_PATH`.** The lock file pins 1.63.0. In Claude Code cloud sessions, use `CHROME_PATH=/opt/pw-browsers/chromium`.
15. **Screenshot names come from the test.** `--screens` used to write names the docs didn't use; the test now names them, so don't rename files by hand.
16. **Describe an action in the docs only after it has succeeded and been checked.** The handoff once said a branch "was reset" before the reset ran, and the reset was then blocked.
17. **Prefer additive git operations.** A history rewrite was first denied, and the visible result was reached with a removal commit. Rewrites happen only on the owner's explicit request (see §7).
18. **Check every statement in the docs against the code or a source while writing it.** First drafts got a test's coverage, two safety summaries and the Playwright version wrong.
19. **Run `npm run check:docs` after editing docs.** Renaming a heading silently breaks the anchors that point to it.
20. **`min-height` does nothing on an inline link.** Give link-styled anchors `display: inline-block` (`a.link`), or they measure under 44 px.
21. **Hide `navigator.share` in the smoke test.** Desktop Chrome has it, so the real share dialog opens instead of the in-page sheet.
22. **The site address lives in `config.json → siteUrl`.** `wrangler.toml` manages the Pages project, so a dashboard `SITE_URL` is cleared on the next build. If the domain changes, edit the config and re-render the images.
23. **Enable Analytics Engine once per Cloudflare account** before the first deploy. Without it the files upload but the deploy fails and the site stays down.
24. **Retest before debugging a fresh deploy.** The custom domain answered 522 for under a minute after the first successful deploy.
25. **Load the Cloudflare token from `.env` and never print it.**
26. **Interactive elements need visual affordance on touchscreens.** Because touchscreens have no cursor hover, interactive SVG objects should have subtle visual hints (such as a breathing shimmer on pending targets) to avoid random tapping ("pixel hunting").
27. **Reassure players against timer anxiety.** Explain prominently in how-to dialogs that timer countdowns pause during question reading, avoiding unnecessary panic for older adults.
28. **In-app browser sharing must guide around download restrictions.** In LINE and Facebook webviews where programmatic canvas downloads fail, pair long-press guidance with a direct "Open in external browser" option.
29. **Slot exclusions prevent neighbouring tap collisions.** Instead of fragile manual coordinate balancing that cascades across room layouts, declare conflicting slot IDs in `slot.excludes` within `rooms.json` so `generateHouse()` in `house.js` never places two items in overlapping hitboxes in the same house.
30. **Every language switch has three places:** the page text (`data-i18n`), the address bar (`langPath`, `/en/…`) and the images (`ogEn`). A change that touches only one leaves English visitors with Thai in the other two.
31. **The wordmark is data, not markup.** `logoA`/`logoB` feed both the HTML and the canvas `logo()`, which shrinks to fit. A hard-coded Thai name once stayed in the English header and on the English result card.
32. **Spacing between canvas text parts lives in the string.** CSS can't add it to a canvas; the English name showed as "BaanRod Mai?" until the space went into `logoA`.
33. **Test as an international visitor, not only a Thai one.** The smoke test defaults to locale th-TH and the Asia/Bangkok time zone; English checks set their own (for example London). Otherwise `guessLang` hides English bugs.
34. **A path ending in `/` precaches `index.html`.** The service-worker list once crashed the build (`EISDIR`) on `/en/`.
35. **Feel features never change the score.** Combos, sounds and stamps make a round enjoyable; the score stays "safe actions out of 10" so challenge links stay fair across versions.
36. **Pop-up text goes where it can't run off the screen.** The combo text first followed the item and was cut off at the right edge; it now sits centred near the top of the room.
37. **New HUD information goes inside the HUD.** An overlay chip for the challenge target covered the gecko's bubble on a 320 px phone; the target now sits in the gauge label.
38. **Every share path names its house.** The card, the share text and the challenge reply all carry the challenge link, because many people forward only the picture.
39. **Every lesson has a topic.** Pick one of `config.topics`; add a topic only with its `topic_<id>` string in both languages. The build checks both.
40. **Never lock health advice behind play.** Collecting is for fun; anyone who needs the answer now gets it on `/learn`, and the book and the featured card link there.
41. **A myth needs evidence, not an opinion.** When busting a popular belief (EM balls), cite the strongest source you can read in full, flag it ⚠️ when it isn't an agency, and blame nobody who still uses it.
42. **A featured topic is temporary.** Switch `config.featuredTopic` on when a topic is in the news, with `featuredTopicUntil` set to its last day, so it ends by itself (rule 51). End it early with `null` if the news fades sooner.
43. **Measure what visitors get.** The size check counts compressed bytes; the raw size passed 500 KB in v1.4.0 while visitors download 174 KB.
44. **Short link text still needs a 44 px target.** "ปภ." is 23 px wide; source links get `min-width: 44px` as well as 44 px of height.
45. **Teach the order when the numbers moved.** Thailand changed its PM2.5 colour ranges in 2023 and older articles still quote the old ones, so the dust mode teaches blue → green → yellow → orange → red and "red means stay in", not the µg/m³ ranges.
46. **A threat must be visible on its own background.** The first haze (tan at 55%) disappeared against beige walls; it now has drifting specks and a darker fill. Look at the screenshot in every room before calling an effect done.
47. **Smoke, not victims.** Fire lessons show smoke, cords, pans and doors. No flames on people, no injuries, no burnt rooms.
48. **A release must never run on last release's code.** The service worker serves `/js/`, `/css/`, `/content/` and `/art/` network-first, and `main.js` reloads once if `js/version.js` and `config.json` disagree. Test a deploy over an installed older version before changing the caching.
49. **The next step is on the first screen.** Start, accept a challenge, start the round, next, share, and the share channels must be visible without scrolling at 320 × 460 and 360 × 640 (Android in LINE). Measure where the button is, not only that it exists; the smoke test checks the share button, LINE and the challenge accept button. Since v1.9.0 the start screen's first step is the three tools, which must be on the first screen; the game card may sit below them on small phones (rule 61).
50. **The ending answers "บ้านรอดไหม?".** Every mode has `cheerPerfect`, `cheerHigh`, `cheerMid` and `cheerLow` lines with its own suffix that say how the house came through. Low scores stay kind and point to the next try; never "the house was lost". Since v1.6.0 the ending is also printed on the shared card, so it must make sense without the screen: never "below" or "ด้านล่าง" (a unit test checks this).
51. **A hand-set switch has an end date.** `rainWarningActive` and `featuredTopic` were switched on in mid-October with no end, and would have kept the flood warning and the diseases topic on the start screen into December's dust season. Every switch someone turns on by hand gets the last day it should show (`rainWarningUntil`, `featuredTopicUntil`: a Bangkok date, that day included). The build stops on a date that isn't real, and warns about a switch with no end date or a past one. A new hand-set switch gets an end date and the same checks.
52. **Tests never read the calendar.** The smoke test once expected FloodWatch and read `config.featuredTopic`, so it would have failed by itself when the season changed. Pin the date the test runs on (`SMOKE_DATE`, by shifting `Date` only, not the timers the rounds use), and take the expected result from the same pure function the game uses (`recommend()`), not from a copy of its rules. Unit tests pass the day in (`dayKey`) and check the date rules against a fixed config, not against `config.json`'s live dates.
53. **What the game never uses stays out of what the game loads.** The carousel's text first went into `strings.json` and its drawing code into `cards.js`, and the start screen grew from 188 to 191 KB for words and code no player uses. Text for posts, tools or pages outside the game goes in its own file (`carousel.json`), which the game doesn't fetch and the service worker doesn't precache; code goes in `tools/` (`carousel-draw.mjs` imports the card helpers `cards.js` exports as `kit`). Images made from the content carry a fingerprint (`share/carousel/manifest.json`), so the build warns when they are older than the text.
54. **Measure what covers a tap target, not only its size.** The ‹ room arrow sat over the item on the fridge from v1.0: up to 23 % of `p-numbers` and `f-call`, and 27 % of the power cut's fridge, at 390 × 760, so a tap there turned the room. Every item was 44 px or more and every check passed, because the smoke test clicked items with `force: true`, which clicks through whatever lies on top. Anything that floats over the room (arrows, the gecko's bubble, toasts, the HUD) must leave each item's tap area uncovered: the smoke check fails above 5 % in any mode and room, at 390 × 760 and 360 × 640. Click without `force` where a real tap matters, or measure the overlap with `getBoundingClientRect()`. When a slot moves to clear an overlay, keep its id so houses don't change, and re-run `npm run probe`: a lower slot changes when water or smoke reaches the item.
55. **International-only advice ships flagged, never as Thai advice.** When no Thai agency source can be found and a foreign agency's is used (the US CDC's 4 hours for the fridge, Ready.gov on unplugging), the lesson is ⚠️ `partial`, its `verifyNote` names the foreign source and says no Thai one was found, its "ทำไม?" names the foreign agency, and its carousel page says it is under review. The texts about the whole game must stay true too: v1.7.0 found the About text, the link previews, `/learn`'s titles and `llms.txt` saying *every* tip comes from Thai agencies, which the smoke-alarm lesson already broke. Say "every tip has a source, most from Thai agencies, some international and marked". Never add a foreign number the source doesn't give, and leave out what only a viral post says.
56. **What a family types stays on their phone.** The plan card (v1.8.0) is the first place players type free text (a meeting place, a contact, who helps whom), and the home check asks about the household (how many people, small children, older people, daily medicine, pets). Keep such text and answers only in `localStorage` through `store`, draw any card from them on the device, and let them leave the phone only in a picture the person chooses to share. Never put them in an analytics event, a URL, a request or a log: events carry a label from a fixed list and at most a number (the score). Cap every field (`maxlength`, 40–60 characters today, the build allows at most 80), set `autocomplete="off"`, and say on the form that the text stays on the device and that ID-card numbers and more personal data than needed don't belong there. Ask only what the tool needs: a count and yes/no answers, never names or ages. The smoke test types a marker into the form and fails if any `/api/e` body contains it; a new field or event gets the same check.
57. **A number in a kit amount must be in its source.** The home check multiplies numbers from `kit.json → items[].qty` (3 L × people × 3 days, a torch each, 7 days of medicine), so a made-up number would reach every family's list. The build stops unless every number above 1 in an amount appears in the title or `note` of one of that item's sources. Before adding a number, quote the sentence that gives it in the source's `note`. The check only shows the number is there, not that it means the same thing (a "3" in "3 ลิตร" also satisfies "3 days"), so read the source too. Where no agency gives an amount that fits a Thai household (food by weight, cash, pet food), the line has no number.
58. **English copy is British English.** The power-cut lessons and the home check (v1.7.0–1.8.0) said "flashlight" and "power outage", and a rank "Ready for Any Blackout", while the rest of the game said "torch" (the flood lesson `p-torch`, in the same topic as `s-torch`), "power cut", "litres" and, in the home check itself, "nappies"; the visitor audit of v1.8.1 found them ([KNOWN_ISSUES F43](KNOWN_ISSUES.md#in-v181-19-oct-2026)). Write "torch", "power cut", "litres", "nappies" and "colour" in every `en`, `ogEn` and `seo.en` text and in `kit.json`. Lessons that rest on American pages paraphrase them in the game's English; the source's `note` keeps its own words, and agency names keep theirs (World Health Organization, Centers for Disease Control and Prevention). Before a release, search the English text for "flashlight", "outage", "blackout", "diaper", "liter", "color" and "-ize" (on 19 Oct 2026 that finds only those two agency names), and use one name for one thing in a tool ("home", not "house" in some places and "home" in others).
59. **When a mode or a tool is added, rewrite every sentence that describes the whole game.** The tagline still said "จากน้ำท่วม ฝุ่น และไฟ" / "from floods, dust and fire", and the manifest's description left out the power cut, through v1.7.0, which added it, and v1.8.0 ([KNOWN_ISSUES F42](KNOWN_ISSUES.md#in-v181-19-oct-2026)). v1.7.0 had swept these texts, but for "Thai agencies", not for what the game covers. Check, in both languages: the tagline (`strings.json → tagline`; until v1.9.0 also the static copy in `index.html`, which the build now writes from `strings.json`, rule 65), `index.html`'s `<title>` and meta description, `manifest.webmanifest → name` and `description`, the default preview (`og`/`ogEn` `defaultTitle`, `defaultDesc`, `defaultLine1`, then `npm run images` for `og/default.png`), the About text (`aboutIntro`), `/learn`'s title, description, heading and intro (`seo.<lang>.learnTitle`, `learnDesc`, `learnH1`, `learnIntro`), `seo.en.llmsSummary` and the `llms.txt` lines the build writes, the JSON-LD `about` (written in `tools/build.mjs`), and `package.json → description`. Search for the old list of hazards ("ฝุ่น และไฟ", "dust and fire") as well as for the new one.
60. **A card line never starts with closing punctuation.** `Intl.Segmenter` (rule 10) returns "!", "?", "," and ")" as words of their own, so `wrapText()` could put one at the start of a line: "The house copes" | "! Nearly…" on the English result card. `tokens()` in `cards.js` keeps closing punctuation (`! ? , . : ; ) ] } % … ” ’`) and Thai ๆ and ฯ on the word before. A unit test wraps every ending in both languages at widths 60–300; a new kind of card text (a new string family drawn on a canvas) gets the same test.

61. **Tools first: every hazard gets a short sourced guide, and the game is never required.** Until v1.8.1 the start screen led with the game, and a hazard with no game mode (an earthquake, a heatwave) had nothing to send when it was in the news. The owner's direction (19 Oct 2026): prepare for any disaster; tell people what to do and what to keep; the game is an option that makes it easier to remember, never a gate. So: the "what to do" guide, the home check and the plan card come first on the start screen and must stay on the first screen at 320 × 460 and 360 × 640 (smoke-checked); a hazard gets its guide **before**, or instead of, a game mode ([§10](#10-adding-a-hazard-mode) step 0); every piece of advice in a game is also readable without playing (a guide, `/learn`, the hazard page), extending rule 40; and a feature that only works inside a round needs a reason. The game card below the tools on small phones is accepted ([KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)).
62. **A guide with no game is 10 sourced lines in phase order.** Exactly 10 lines in `checklists.json`, each with a `phase` (`before`, `during`, `after`, in that order), at least one source in `sources.json`, and `verify` (`partial` with a `verifyNote` that says which part is unconfirmed and why). Thai agencies first, cross-checked with international guidance; a line that rests on a foreign agency alone, or on an inference, is ⚠️ (rule 55). Leave out anything the sources disagree on and record it in the source's `note` and [KNOWLEDGE §29.4](KNOWLEDGE.md#294-what-was-left-out-and-why): v1.9.0 left out unplugging in lightning, phones in lightning, water amounts and fans in the heat, and when to leave a tall building. Keep each Thai line within about 45 characters, two lines on the 1080 × 1920 picture (the build warns above 48), and use no number the sources don't share. Add the guide to `config.json → guides` with its hazard and an icon, `guide<Id>` (th/en), `og`/`ogEn.checklistTitle<Id>`, the hazard with its slug and `seo` strings, and render its pictures (`npm run images -- --only og/checklist-<id>,og/en/checklist-<id>,share/checklist-<id>`). The build and a unit test check the rest.
63. **The alert switch always has an end date, and is cleared after it.** `config.json → alert: { guide, until }` puts one guide on top of the start screen while it is in the news. Unlike the older switches, an alert with no `until` never shows (`activeAlert()`), and the build stops on a date that isn't real. Pick the last day the news is likely to matter (the agency's warning period, as for the landslide alert of 18–25 Oct 2026), not "until further notice". After the date, set it back to `{ "guide": null, "until": null }` or to a new date: the build warns until you do ([KNOWN_ISSUES #64](KNOWN_ISSUES.md#64-the-alert-must-be-cleared-or-renewed-by-hand)). A new hand-set switch gets the same treatment (rule 51).
64. **Emoji in player-facing text are Unicode 11 or older.** The first drafts of the v1.9.0 guides used 🪟 🪜 🪧 🪴 🪨 (Unicode 13) and 🟤 🧊 (Unicode 12), which older Android phones and older iPhones draw as empty boxes, and the audience includes older relatives on older phones. Use emoji from Unicode 11 (2018) or earlier in `strings.json`, `checklists.json`, `kit.json`, `config.json` (guide icons) and `items.json`; look a new one up on emojipedia or in the Unicode emoji list before using it. The 1080 × 1920 pictures draw a line's text with a sprite or a number, not its icon, but the page, the sheets, the hazard pages and the share texts show the emoji. Five older icons that broke it were replaced in v1.9.0 ([KNOWN_ISSUES #65](KNOWN_ISSUES.md#65-loose-ends-from-the-v190-sweep)); a code-point scan (Unicode 12+ blocks such as U+1FA70–1FAFF and U+1F7E0–1F7EB) is a quick check.
65. **The start screen's static Thai text comes from `strings.json`; don't edit it in `index.html`.** Until v1.9.0 the Thai text in `index.html` was kept by hand next to `strings.json` and could drift (the tagline did, [KNOWN_ISSUES F42](KNOWN_ISSUES.md#in-v181-19-oct-2026)). The build now writes the text of every `data-i18n` element whose Thai string has no `{placeholder}`, the `<title>` (from `og.defaultTitle`) and the meta description (from `og.defaultDesc`). Edit the string, run the build, and commit `index.html` with it; a new static element gets a `data-i18n` key (and `data-i18n-aria` for an `aria-label`).

## 9. Working with AI assistants

- **Give the assistant the context first.** [AGENTS.md](../AGENTS.md) is the entry point: read order, commands, definition of done and sandbox notes. `CLAUDE.md` imports it for Claude Code.
- **Pick work from [ROADMAP.md](ROADMAP.md),** and update the task's status, [CHANGELOG.md](../CHANGELOG.md) and [KNOWN_ISSUES.md](KNOWN_ISSUES.md) in the same commit.
- **Record new lessons** in [LESSONS_LEARNED.md](LESSONS_LEARNED.md). Turn each into a rule here when it should never happen again.
- **Don't let it make up safety facts.** Ask for the source first. Treat every claim without a source in `sources.json` as `unverified`.
- **Ask for real test output.** The build, `npm test` and, for UI work, `npm run smoke` should be run and their output reported, not summarised from memory.
- **Keep changes small.** One change per commit, written in the style of the code around it, without unrelated rewrites.

## 10. Adding a hazard mode

The registry (`config.json → modes`, defaults in `public/js/modes.js`) makes a new hazard mostly data. Dust and fire (v1.5.0) and the power cut (v1.7.0) were added this way. The build fails on anything missing.

0. **Add a guide first** (v1.9.0, rules 61–62). A new hazard starts as a "what to do" guide with no game: research, 10 sourced lines by phase in `checklists.json`, `config.json → guides` (hazard, icon) and `hazards.<hazard>` (slug, `tools`), the strings (`guide<Id>`, `og`/`ogEn.checklistTitle<Id>`, `seo.<lang>.hazard<H><Nav|Title|Desc|H1|Intro>`), a card theme in `cards.js → THEMES`, the pictures, and a line in [04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook). The build then writes `/<slug>` (guide first), `/checklist/<id>`, the sitemap, `llms.txt` and `/posts` entries. That alone is a release; a game mode is a second step, and its lessons may teach only what the guide's sources back. The steps below are for that second step (or for a game mode of an existing guide's hazard, whose guide then becomes the mode's checklist: keep the id, so shared `/checklist/<id>` links keep working).
1. **Research first.** At least one Thai agency source per correct action (see §2.1), cross-checked with an international one where possible. Where only an international one exists, flag the lesson ⚠️ (rule 55). Record what the sources disagree on and leave it out. If a post or infographic started the idea, check each of its claims at an agency; it is not a source itself.
2. **Registry entry** in `config.json → modes`: `id` (a–z), a new one-letter `code` (never reuse one; `p`, `r`, `d`, `f` and `s` are taken, `h` is kept for heat), `hazard`, `threat` (`water`, `smoke`, `haze`, `dark` or `null`), `prop` (in `mascot.js`), `emoji`, optional `icon`, `months` (Bangkok months it is in season; empty for a year-round mode that is never the default, like the power cut), `topic`, optional `link` (https). Mirror it in `modes.js` `DEFAULTS`.
3. **Round settings:** `round.<id>.seconds` and the threat's keyframes (`water` + `floorWetY`, `smoke` + `lowY`, `haze`, or `dark` + `hours`). A `dark` mode needs `round.<id>.hours` (the story's length), and its items may use `lostAfter: <hours>` (between 0 and `hours`) to go bad at that hour; give at least one item a sourced time, or the build warns, and every house of the mode will include one. `lostAfter` in a mode whose threat isn't `dark` stops the build. Check the timings with `npm run probe`.
4. **Strings** in `th` and `en` (the English in British English, rule 58): `mode`, `mode<Mode>Desc`, `hero`, `challenge`, `howto`, `howtoTitle`, `geckoStart`, `result`, `shareText`, `checklistTab`, `rank` (3), and the endings `cheerPerfect`, `cheerHigh`, `cheerMid`, `cheerLow` (a unit test checks them), each as `<base><Mode>`. Optional overrides that fall back to the shared key: `floodedToast`, `geckoFlood`, `geckoWet`, `stFlooded`, `forecastShort`, `forecastLong`, `forecastIcon`. Plus `og`/`ogEn` `challengeTitle`, `challengeDesc`, `challengeLine`, `checklistTitle`, and `seo.th/en.section<Mode>`.
5. **A new hazard needs a page.** If the mode brings a new `hazard` (not a second flood mode), add `config.json → hazards.<hazard>.slug`: lowercase letters, digits or "-", unique, and not a site path (`c`, `checklist`, `en`, `learn`, `api`, `js` and the other reserved names in `tools/build.mjs`) or an existing file in `public/`. Pick it with care, because it can never change once published. Add the `seo` strings `hazard<H>Nav`, `hazard<H>Title`, `hazard<H>Desc`, `hazard<H>H1` and `hazard<H>Intro` in `th` and `en` (`<H>` is the hazard id with a capital, for example `hazardHeatH1`). The build then writes `/<slug>` and `/en/<slug>` and adds them to the sitemap, `llms.txt` and the "By hazard" row; it stops if the slug or a string is missing. Keep the page text free of advice, numbers and agency names; the lessons carry those. A hazard can also link the home check and the plan card (`hazards.<hazard>.tools: ["kit", "plan"]`, with `seo.<lang>.toolKit` and `toolPlan`), as `/ready` and, since v1.8.1, `/flood` do. Since v1.8.1 the same list puts the 🎒 home-check button on the result screen of the hazard's modes, so give a hazard `kit` only where a household stock fits (power cut, floods), not where it doesn't (dust, fire).
6. **Content:** 10–13 items across the three drawn rooms (at least one per room), 5 decoys, a 10-item checklist with sprites, a `topic_<id>` string pair and the topic in `config.topics`.
7. **Start button:** add a static `data-mode` button to `index.html` (the JS rebuilds the grid from the registry; the static one avoids a jump on first paint). Card colours in `app.css` (`.mode-btn.mode-<id>`, `.is-<id>` layers, and hide `.mud` and `.sky-rain` for a non-flood mode). The small cards share one row of up to four (`--cols` in `main.js`, and the static `--cols` in `index.html`); with five modes all four small names fit on one line at 320 px in Thai. A sixth mode needs a new layout, checked at 320 px in both languages.
8. **Card theme** in `cards.js → THEMES`, then `SITE_URL=… npm run images` and commit only the new images.
9. **Rewrite what describes the whole game** (rule 59): the tagline in `strings.json` (the build writes it into `index.html`, rule 65), `index.html`'s `<title>` and meta description, the manifest's description, the default preview texts and image, the About text, `/learn`'s title, heading, description and intro, `seo.en.llmsSummary`, and `package.json → description`, in Thai and English. Search for the old hazard list.
10. **Check:** build, `npm test`, `npm run probe`, `npm run smoke`, a visitor pass at 320 px and on a tablet in both languages (including `/?mode=<id>` and the new hazard page), and compare every other mode's houses before and after over a year (they must not change). If the mode has `months`, also run the smoke test with `SMOKE_DATE` set to a day in its season. If its sprites sit on a slot near the room arrows, look at the arrow check (rule 54).
11. **Carousel and posts:** add `carousel.json → sets.<hazard>` (at most 8 playable lessons of the hazard) with `cover<H>Title`, `cover<H>Sub` and `caption<H>` in both languages, render with `npm run images -- --only share/carousel`, and add a post to [04-launch-kit.md](04-launch-kit.md).


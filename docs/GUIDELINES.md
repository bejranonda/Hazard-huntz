# Guidelines

These rules are for anyone changing this game's content, art or code, people and AI assistants alike. Several of them exist because a bug or a mistake already happened. Those are collected in [section 8](#8-rules-that-come-from-bugs-we-already-hit).

**Before you change anything,** read [HANDOFF.md](../HANDOFF.md) and [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## 1. Non-negotiables

These come from the original brief. A change that breaks one of them is not finished, however good it looks.

1. **Safety facts are real.**
   - Every action the game calls correct traces to an official Thai source in `sources.json`.
   - Never invent advice, numbers or sources.
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
   - Anything personal (scores, streaks) stays in the player's own `localStorage`.
   - The game must stay PDPA-compliant without needing a consent banner.
4. **Accessibility:**
   - Every tap target is **at least 44 px**: items, buttons, tabs, expanders and links.
   - Colour is never the only signal; use blue / orange / grey **plus** shapes, and never pair red with green.
   - Nothing flashes, and `prefers-reduced-motion` is respected.
   - Every control is reachable by keyboard and readable by a screen reader.
5. **Fast:**
   - The start screen stays **under 500 KB** compressed. It is 144 KB today.
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
5. If the item is in a playable room, check that it fits a slot and doesn't crowd a neighbour (see [KNOWN_ISSUES #1](KNOWN_ISSUES.md#1-neighbouring-tap-areas-can-overlap)).

### 2.2 Numbers

- **Verify every number** against its source: phone numbers, distances, days, ratios and temperatures.
- **When sources disagree, leave the number out of the game** and record the conflict under *Flags* in 01-safety-content.md. Current exclusions: sandbag fill, bleach dilution, boiling time, mattress disposal.
- Re-check every **hotline** before each season. Wrong numbers that were deliberately left out: 192 (use 1784) and 199 (cited only by news).

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

## 3. Thai copy and tone

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
- **English** mirrors the tone. It is a translation for helpers, not a separate voice.
- **Formatting:**
  - Keep `{placeholders}` exactly as they are.
  - Write phone numbers as plain digits (`1784`).
  - Write Thai dates as `6 ต.ค. 69` in the UI (Buddhist era, short), produced by `formatHouseDate()`.
- **Review:** have a second native speaker read new copy before release, ideally an older family member from the forwarding audience.

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
- **Logic stays pure.** `house.js`, `round.js`, `rng.js` and `run.js` don't touch the DOM. Tests and the build import them in Node. Keep it that way, and put DOM work in `scene.js`, `ui.js` and `main.js`.
- **Data, not code.**
  - Tunable numbers go in `config.json`.
  - Text players see goes in `strings.json`, `items.json` and `checklists.json`. A few exceptions remain; see [KNOWN_ISSUES #5](KNOWN_ISSUES.md#fixed), and don't add more.
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
- **Generated files** are never edited by hand: `public/sw.js` (edit `tools/sw.template.js`), `public/c/*.html`, `public/checklist/*.html`, the SEO files `public/learn.html`, `robots.txt`, `sitemap.xml` and `llms.txt` (edit `tools/build.mjs` or `strings.json → seo`), and the `<!--OG:START-->` block in `index.html`, which also holds the canonical link and JSON-LD.
- **Search and AI search.**
  - The lessons on `/learn` and `/llms.txt` come from the content JSON. Never hand-write lesson text elsewhere.
  - Bump `strings.json → seo.updated` (YYYY-MM-DD) whenever lessons or sources change.
  - Keep every crawl page script-free, and every link or button on it at least 44 px tall.
  - Add structured data only for things that exist on the page. No `FAQPage`, `HowTo`, ratings or reviews unless the page really has them.
  - Share-preview pages (`/c/*`, `/checklist/*`) keep a canonical link to `/` and stay out of the sitemap.
  - Keep `/api/` the only path `robots.txt` closes, and leave Cloudflare's AI-bot blocking off for this host.
- **Budget:** read the build's `budget` line after any change that adds files, fonts or JS. The start screen limit is 500 KB, and the aim is to stay near today's 144 KB.
- **Style:** follow the surrounding code. Two-space indentation, single quotes, semicolons, small functions, and comments that explain *why*.

## 6. Testing

| When | Run |
|---|---|
| Every change | `node tools/build.mjs` and `npm test` (12 rule tests: a year of daily houses, flooding, scoring, bonus, challenge links, midnight reset, version 2 carry-over) |
| UI, CSS or sharing changes | `npm run smoke` (25 checks in headless Chromium with Android, iPhone, LINE and Facebook user agents, including offline and reduced motion). Add `-- --screens docs/screens` to refresh the screenshots, **and look at them**. |
| Before a release | The relevant rows of the real-phone matrix in [06-test-checklist.md](06-test-checklist.md) |
| Copy, rank or domain changes | `SITE_URL=… npm run images`, then look at `public/og/` and `public/share/` |
| Changes to the build's SEO output, `seo` strings or `_headers` | The live-site checks in [06-test-checklist.md](06-test-checklist.md#live-site-checks-search-and-ai-search), after the deploy |
| Any doc change | `npm run check:docs`: every relative link and heading anchor must resolve |

Rules:

- **Rule changes get a unit test,** in `tests/run.mjs`.
- **UI requirements get a smoke check,** in `tests/smoke.mjs`. A requirement that isn't measured will regress, and the 44 px rule already did once.
- **Measure, don't assume.**
  - `npm run probe` covers overlaps and flood timings.
  - The build reports the bundle size.
  - The smoke test measures tap sizes.
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
  3. Images are re-rendered if the copy, ranks, checklists or domain changed.
  4. `CHANGELOG.md` and the version are updated.
  5. Merge to `main`, and wait for the Cloudflare deploy.
  6. Open the live site once and reload, so the new service worker takes over. Check that a changed text appears.
  7. If the previews changed, re-scrape them in Facebook's Sharing Debugger and check LINE with `?v=<n>`.
  8. If safety content changed, publish an "UPDATE:" post.
- **Rollback:** Cloudflare → the Pages project → Deployments → pick an earlier one → *Rollback*.
- **Prefer additive history.**
  - Fix mistakes with new commits (reverts, removal commits), not resets.
  - Force-push only when the owner explicitly asks, with `--force-with-lease=<branch>:<expected sha>`, and check the result with `git ls-remote`.
  - Branch deletion is done by the owner in the GitHub UI.
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

## 9. Working with AI assistants

- **Give the assistant the context first.** [AGENTS.md](../AGENTS.md) is the entry point: read order, commands, definition of done and sandbox notes. `CLAUDE.md` imports it for Claude Code.
- **Pick work from [ROADMAP.md](ROADMAP.md),** and update the task's status, [CHANGELOG.md](../CHANGELOG.md) and [KNOWN_ISSUES.md](KNOWN_ISSUES.md) in the same commit.
- **Record new lessons** in [LESSONS_LEARNED.md](LESSONS_LEARNED.md). Turn each into a rule here when it should never happen again.
- **Don't let it make up safety facts.** Ask for the source first. Treat every claim without a source in `sources.json` as `unverified`.
- **Ask for real test output.** The build, `npm test` and, for UI work, `npm run smoke` should be run and their output reported, not summarised from memory.
- **Keep changes small.** One change per commit, written in the style of the code around it, without unrelated rewrites.

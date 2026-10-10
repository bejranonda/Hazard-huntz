# Known issues and deliberate trade-offs

This is a straight list of what is wrong, what is not built yet, and what is limited on purpose. The state is as of **v1.0.0 (6 Oct 2026)**. Each entry gives a status, the evidence and what to do about it. Numbers are measured, not guessed. `npm run probe` reproduces the overlap and flood-timing figures, and the browser measurements are described in [APPROACH_AND_METHOD.md](APPROACH_AND_METHOD.md#7-measuring-instead-of-assuming).

The planned fixes are scheduled as task cards in [ROADMAP.md](ROADMAP.md) (N1 = #1, N2 = #5, N3 = #4, N4 = #2).

| Status | Meaning |
|---|---|
| **Open** | A real defect or gap. It should be fixed. |
| **Owner** | Needs a decision, an input or outside verification from the project owner. Code can't fix it. |
| **Not built** | Out of scope for v1. The structure is in place. |
| **Platform** | A limit of the browser, the app or Cloudflare. We work around it; it can't be removed. |
| **By design** | A conscious decision. Please discuss before "fixing" it. |

## Summary

| # | Issue | Status | Severity |
|---|---|---|---|
| 1 | [Neighbouring tap areas can overlap](#1-neighbouring-tap-areas-can-overlap) | Fixed | Medium |
| 2 | [Item tap areas are 38–43 px on 320 px-wide phones](#2-item-tap-areas-are-3843-px-on-320-px-wide-phones) | Open | Low |
| 3 | [Not yet tested on real phones or real in-app browsers](#3-not-yet-tested-on-real-phones-or-real-in-app-browsers) | Open | **High (launch blocker)** |
| 33 | [Interactive targets lack visual affordance (Pixel-hunting risk)](#33-interactive-targets-lack-visual-affordance-pixel-hunting-risk) | Fixed | Medium |
| 34 | [LINE in-app browser blocks direct image downloads](#34-line-in-app-browser-blocks-direct-image-downloads) | Fixed | Medium |
| 35 | [Timer anxiety in older players during the first 5 seconds](#35-timer-anxiety-in-older-players-during-the-first-5-seconds) | Fixed | Low |
| 36 | [Hidden "ทำไม?" explanation is frequently skipped by players](#36-hidden-ทำไม-explanation-is-frequently-skipped-by-players) | Fixed | Low |
| 6 | [Placeholders `[DOMAIN]` and `[FORECAST_APP_URL]` are unset](#6-placeholders-domain-and-forecast_app_url-are-unset) | Owner (domain fixed) | **High (launch blocker)** |
| 8 | [9 safety items are only partially verified](#8-9-safety-items-are-only-partially-verified) | Owner | **High (review before launch)** |
| 9 | [Agency websites blocked automated checks](#9-agency-websites-blocked-automated-checks) | Owner | Medium |
| 10 | [Sources conflict on soaked mattresses](#10-sources-conflict-on-soaked-mattresses) | Owner | Low |
| 11 | [Thai copy needs a second native reader](#11-thai-copy-needs-a-second-native-reader) | Owner | Medium |
| 12 | [Analytics SQL and the Fail-open default are unchecked on a live account](#12-analytics-sql-and-the-fail-open-default-are-unchecked-on-a-live-account) | Owner (partly checked) | Low |
| 13 | [`forecastStatusUrl` needs CORS and a fast answer](#13-forecaststatusurl-needs-cors-and-a-fast-answer) | Owner | Low |
| 30 | [Web Analytics, search consoles and push-to-deploy are not done or checked](#30-web-analytics-search-consoles-and-push-to-deploy-are-not-done-or-checked) | Owner | Medium |
| 14 | [Bathroom, bedroom and garage are not drawn](#14-bathroom-bedroom-and-garage-are-not-drawn) | Not built | — |
| 15 | [Version 2, the combined Prepare → Return run](#15-version-2-the-combined-prepare--return-run) | Not built | — |
| 16 | [No offline play inside iOS in-app browsers](#16-no-offline-play-inside-ios-in-app-browsers) | Platform | — |
| 17 | [No Web Share inside Android in-app browsers](#17-no-web-share-inside-android-in-app-browsers) | Platform | — |
| 18 | [Downloads fail inside in-app browsers](#18-downloads-fail-inside-in-app-browsers) | Platform | — |
| 19 | [No vibration on iOS](#19-no-vibration-on-ios) | Platform | — |
| 20 | [Silent until the first tap](#20-silent-until-the-first-tap) | Platform | — |
| 21 | [Link previews are cached by LINE and Facebook](#21-link-previews-are-cached-by-line-and-facebook) | Platform | — |
| 22 | [Web Analytics blind spots](#22-web-analytics-blind-spots) | Platform | — |
| 23 | [Link previews are pre-rendered, not drawn per request](#23-link-previews-are-pre-rendered-not-drawn-per-request) | By design | — |
| 24 | [Some content edits reshuffle today's house and old challenge links](#24-some-content-edits-reshuffle-todays-house-and-old-challenge-links) | By design | — |
| 25 | [The daily house rolls over at midnight Bangkok time for everyone](#25-the-daily-house-rolls-over-at-midnight-bangkok-time-for-everyone) | By design | — |
| 26 | [Wrong answers and decoys make the water rise faster](#26-wrong-answers-and-decoys-make-the-water-rise-faster) | By design | — |
| 27 | [The build rewrites tracked files](#27-the-build-rewrites-tracked-files) | By design | — |
| 28 | [Images are PNG, about 145 KB per preview and 400 KB per checklist](#28-images-are-png-about-145-kb-per-preview-and-400-kb-per-checklist) | By design | — |
| 29 | [Rendering images needs a matching Chromium](#29-rendering-images-needs-a-matching-chromium) | By design | — |
| 31 | [`/learn` repeats the lessons, and `seo.updated` is bumped by hand](#31-learn-repeats-the-lessons-and-seoupdated-is-bumped-by-hand) | By design | — |
| 32 | [Search and AI-search results can't be guaranteed](#32-search-and-ai-search-results-cant-be-guaranteed) | Platform | — |

Fixed issues are listed [at the end](#fixed).

---

## Open

### 1. Neighbouring tap areas can overlap

**Status:** Fixed in v1.1.0 ([F10](#fixed)) · **Severity:** Medium

Every item's tap area is grown to at least `MIN_HIT` = 64 scene units so that it stays at or above 44 px (`public/js/house.js`). Some slots in `rooms.json` were originally close enough that grown areas overlapped (in 32% of houses, worst 45%).

**Fix:** Resolved in v1.1.0 using a slot exclusion graph (`slot.excludes` in `rooms.json` checked during item and decoy placement in `house.js`). `npm run probe` over 1,460 houses (both modes, 2 years) confirms **0 (0%) overlaps**, worst 0%.

### 2. Item tap areas are 38–43 px on 320 px-wide phones

**Status:** Open · **Severity:** Low

The room art is 360×600 scene units, scaled to fit the stage. On short screens the height limits the scale, so 64 units shrink below 44 px.

| Viewport (CSS px) | Example | Stage | Smallest item tap area |
|---|---|---|---|
| 320×460 | iPhone SE (1st gen) / 5s in Safari with toolbars | 320×357 | **38.1 px** |
| 320×504 | same, toolbars collapsed | 320×401 | **42.8 px** |
| 360×560 | small Android inside LINE | 360×457 | 48.7 px |
| 375×548 | iPhone SE (2nd/3rd gen) in Safari | 375×445 | 47.5 px |
| 360×640 | common Android in Chrome | 360×537 | 57.3 px |
| 390×664 | iPhone 12–15 in Safari | 390×552 | 58.9 px |

Buttons, tabs and links stay at 44 px or more everywhere; only the items inside the art are affected. Phones 320 px wide are rare by 2026, so this is low priority.

**A possible fix:** on screens under about 480 px tall, hide the room tabs (the ‹ › arrows remain) to give the stage about 50 px more. Growing `MIN_HIT` instead would make [#1](#1-neighbouring-tap-areas-can-overlap) worse.

### 3. Not yet tested on real phones or real in-app browsers

**Status:** Open · **Severity:** High: a launch blocker

Everything was tested in headless Chromium. That includes user agents for the LINE and Facebook in-app browsers, an iPhone-sized viewport, offline mode and reduced motion. Each of those checks passes.

What a headless test **cannot** show:

- whether `navigator.share` with a PNG file works in each real app
- whether long-pressing to save the card works in LINE, Facebook and TikTok on iOS and Android
- what LINE and Facebook show as the link preview
- how the font, notch and home bar look on real screens
- audio on iOS when the silent switch is on

**To do:** run the 32-row matrix in [06-test-checklist.md](06-test-checklist.md) on at least one cheap Android phone and one iPhone, inside LINE, Facebook and TikTok. Record the results in that file.

### 33. Interactive targets lack visual affordance (Pixel-hunting risk)

**Status:** Fixed in v1.1.0 ([F11](#fixed)) · **Severity:** Medium

Resolved by adding a 3.5s contextual idle hint timer in `main.js` that triggers a soft breathing ring (`.show-hints`) on unhandled items, plus hover micro-interactions and reduced-motion fallback. See [IMP-02 in review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md).

### 34. LINE in-app browser blocks direct image downloads

**Status:** Fixed in v1.1.0 ([F12](#fixed)) · **Severity:** Medium

Resolved by displaying explicit card tap/hold guidance on the result screen, a dedicated `.line-guide` helper banner in the share sheet, and a direct external browser launcher. See [IMP-03 in review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md).

### 35. Timer anxiety in older players during the first 5 seconds

**Status:** Fixed in v1.1.0 ([F13](#fixed)) · **Severity:** Low

Resolved by adding reassuring How-to micro-copy explaining that time pauses on tap, and adding a prominent `⏸️ พักเวลาอยู่` badge inside the choice sheet. See [IMP-04 in review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md).

### 36. Hidden "ทำไม?" explanation is frequently skipped by players

**Status:** Fixed in v1.1.0 ([F14](#fixed)) · **Severity:** Low

Resolved by surfacing the causal 1-sentence `why` explanation directly inside the tip card (💡), reserving the `<details>` accordion strictly for authoritative agency citations. See [IMP-05 in review/ACTIONABLE_RECOMMENDATIONS.md](../review/ACTIONABLE_RECOMMENDATIONS.md).

---

## Needs the owner

### 6. Placeholders `[DOMAIN]` and `[FORECAST_APP_URL]` are unset

**Status:** Owner · **Severity:** High: a launch blocker

- **`[DOMAIN]`: fixed on 6 Oct 2026.** `config.json → siteUrl` is `https://baanrodmai.autobahn.bot`, and the build prints `site https://baanrodmai.autobahn.bot`. A dashboard `SITE_URL` does not survive, because `wrangler.toml` manages the project. If the domain ever changes, edit `config.json` and re-render the images.
  - Without either, the build falls back to `CF_PAGES_URL`. That is the address of one particular deployment (`https://<hash>.<project>.pages.dev`), so link-preview tags would point at an old deployment.
  - In-game share links use the address the player is on, so they keep working either way.
- **`[FORECAST_APP_URL]`:** the "เช็กระดับน้ำล่วงหน้า" buttons stay hidden until `config.json → forecastAppUrl` is a real `https://` address. The build warns about this on every run.

### 8. 9 safety items are only partially verified

**Status:** Owner · **Severity:** High: review before launch

`p-phone`, `p-car`, `p-meds`, `p-numbers`, `p-chem`, `p-drain`, `p-toilet`, `p-fuel` and `r-sag` are marked ⚠️. For each one, the core advice is official, but one detail is:

- an inference (for example "charge fully")
- from an older statement (the 2011 police request about parking on bridges, or the 2013 7-day medicine figure)
- or common practice rather than official wording (a sandbag in the toilet bowl)

Each reason is listed under *Flags* in [01-safety-content.md](01-safety-content.md). `p-toilet` and `p-fuel` are in rooms that are not playable yet.

**Fix:**

- Confirm each one with the agency, or rephrase it to the exact official wording.
- Change `"verify"` to `"verified"` in `items.json` and run `npm run docs`.

### 9. Agency websites blocked automated checks

**Status:** Owner · **Severity:** Medium

These sites refused automated access during the check on 6 Oct 2026:

- disaster.go.th
- anamai.moph.go.th (HTTP 503)
- mea.or.th (firewall)
- bangkok.go.th
- doeb.go.th
- dpt.go.th

Their wording was taken from the agencies' statements as republished by กรมประชาสัมพันธ์, or from news articles quoting them. `sources.json` records which, under `kind`. Each claim is still traceable, but the agency's own page was not seen.

**Fix:** compare the items against the agencies' own infographics in a normal browser, or ask an agency contact.

### 10. Sources conflict on soaked mattresses

**Status:** Owner · **Severity:** Low

- กรมอนามัย says to clean and sun-dry bedding.
- A 2011 statement from กรมวิทยาศาสตร์การแพทย์ says soaked mattresses should be thrown away.

The mattress is **not in the game**. Decide which advice to follow, or ask กรมอนามัย, before adding it to the bedroom.

### 11. Thai copy needs a second native reader

**Status:** Owner · **Severity:** Medium

All Thai copy was written in one pass and checked against the guidelines: the tone, the 80-character tip limit and the guardrails. That covers tips, choices, feedback, the gecko's lines, rank titles and the share texts. A second native speaker should still read everything in `strings.json`, `items.json` and `checklists.json` once, ideally an older family member who represents the forwarding audience.

### 12. Analytics SQL and the Fail-open default are unchecked on a live account

**Status:** Owner · **Severity:** Low

- **SQL.** The queries in [05-metrics.md](05-metrics.md) stick to the documented subset (`SUM(_sample_interval)`, `GROUP BY`, `toStartOfInterval`). They have not been run against a real Analytics Engine dataset. Analytics Engine bindings don't work in local development.
- **Fail open.** Cloudflare's current docs don't say whether **Fail open** is the default for Pages Functions. Check it under Settings → Runtime after the first deploy.

**Checked on 6 Oct 2026:** Analytics Engine is enabled, the dataset `baanrodmai_events` is bound as `EVENTS`, **Fail open** is set on the project, and `POST /api/e` returns 204 on the live site. **Still unchecked:** the SQL in [05-metrics.md](05-metrics.md) against real data, because no player events have been written yet.

### 13. `forecastStatusUrl` needs CORS and a fast answer

**Status:** Owner · **Severity:** Low

If `config.json → forecastStatusUrl` is set, the start screen fetches it from the player's browser. That request comes from another origin, so the forecast app must:

- send `Access-Control-Allow-Origin: *` (or this site's origin)
- answer within **1.5 s** with `{"rainWarning": true|false}`

Otherwise the manual `rainWarningActive` flag is used. Nothing breaks, but the automation silently does nothing.

---

### 30. Web Analytics, search consoles and push-to-deploy are not done or checked

**Status:** Owner · **Severity:** Medium

Three launch steps are still open on the Cloudflare and search side:

- **Web Analytics** isn't enabled. It's a dashboard switch the API token can't reach (Pages project → Metrics → Web Analytics → Enable).
- **The sitemap hasn't been submitted** to Google Search Console or Bing Webmaster Tools, and the JSON-LD hasn't been through the Rich Results Test ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)).
- **Push-to-deploy is unverified.** A push to `main` didn't start a build, so the first two deploys were started through the API. The likely cause is that the Cloudflare GitHub app can't see this repository **[unverified]**.

## Not built

### 14. Bathroom, bedroom and garage are not drawn

**Status:** Not built

`rooms.json` lists them with `"enabled": false`, and they have no slots yet.

- **Content that already exists:** `p-toilet` (bathroom) and `p-fuel` (garage). The other candidates are listed in [01-safety-content.md](01-safety-content.md#content-ready-for-the-later-rooms).
- **To add a room:**
  1. Draw `public/art/rooms/<room>.svg` with the same layer structure.
  2. Add its slots.
  3. Set `"enabled": true`.
- The build checks that the art exists and that every item has a slot that fits it.

### 15. Version 2, the combined Prepare → Return run

**Status:** Not built (the structure is in place)

**What is ready:**

- `public/js/run.js` has `PLANS.combo` and carries Prepare outcomes into Return through the `pair` links.
- `generateHouse()` accepts `include` and `exclude`.
- A unit test covers the carry-over.

**What is missing:**

- a before/after split card in `cards.js`
- a third start-screen button
- turning on `config.features.comboRun`

See [02-game-design.md](02-game-design.md#version-2-combined-run-structured-not-built).

---

## Platform limits

### 16. No offline play inside iOS in-app browsers

**Status:** Platform

On iOS, LINE, Facebook, Instagram and TikTok all use WKWebView. WKWebView turns service workers off unless the app opts in (WebKit source; MDN lists ServiceWorker as unsupported in WebView iOS). The game works normally there, but only online. Offline play works in Safari, Chrome, and the Android in-app browsers.

### 17. No Web Share inside Android in-app browsers

**Status:** Platform

Android System WebView, which LINE and Facebook use on Android, has no `navigator.share` (MDN: "not supported"). The game shows its own share sheet instead:

- LINE (`line.me/R/share`)
- Facebook (`sharer.php`)
- X (`x.com/intent/tweet`)
- copy the link
- the card as an image you can press and hold to save

### 18. Downloads fail inside in-app browsers

**Status:** Platform

`<a download>` only works if the host app supports downloads. Most in-app browsers don't, and LINE's own documentation lists the download attribute as unsupported in its LIFF browser. In those browsers the game hides "บันทึกรูป" and shows the card as an `<img>`, with the hint *"กดค้างที่รูป แล้วเลือกบันทึกรูปภาพ"*.

LINE also gets an "open in the phone's browser" link (`openExternalBrowser=1`). The image uses a `data:` URL there, because `blob:` URLs were unreliable in web views.

### 19. No vibration on iOS

**Status:** Platform

`navigator.vibrate` doesn't exist in Safari or any iOS web view, so haptics are Android-only. Sound and animation carry the feedback on iOS.

### 20. Silent until the first tap

**Status:** Platform

Browsers keep audio suspended until a user gesture, so the game starts its Web Audio on the first tap. All sounds are synthesised, so there are no audio files to preload.

### 21. Link previews are cached by LINE and Facebook

**Status:** Platform

- **Facebook** caches each preview by URL. Use the [Sharing Debugger](https://developers.facebook.com/tools/debug/) → *Scrape Again* after changing tags or images. Titles freeze after about 50 interactions.
- **LINE** publishes no cache time and has no official refresh tool. A third-party "Page Poker" tool exists but could not be reached or verified. To force a fresh preview, share a variant URL such as `?v=2`.

### 22. Web Analytics blind spots

**Status:** Platform

Cloudflare Web Analytics:

- is blocked by ad blockers
- does not record query strings, so the `?h=` house key is invisible (the path `/c/p8` is still counted)
- has no custom events
- keeps data unsampled for 7 days, then samples it down to about 10%

Game events go to Analytics Engine through `/api/e`, which covers what Web Analytics can't. See [05-metrics.md](05-metrics.md).

---

## By design

### 23. Link previews are pre-rendered, not drawn per request

**Status:** By design

There are only 25 preview images: 2 modes × 11 scores, plus the default and the two checklists. Each is a static page and a PNG.

A Pages Function that drew previews per request would face two limits:

- **CPU:** 10 ms per request on the free plan, too little to render Thai text to PNG.
- **Requests:** 100,000 a day, shared with all Functions, which one viral link could use up.

Static files are unlimited. See [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered).

### 24. Some content edits reshuffle today's house and old challenge links

**Status:** By design. Keep it in mind when editing.

A house is generated from the seed `mode|houseKey|v<houseVersion>` **and the current content**.

**Safe:** text-only edits (tips, labels, feedback, strings) never move anything.

**These change which items are picked and where they go:**

- adding, removing or disabling an item or decoy
- changing an item's `slots`, `size` or `room`
- changing a room's slots
- bumping `houseVersion`

After such a deploy:

- today's daily house changes for anyone who loads the new content
- a challenge link shared before the change rebuilds a different house

**Advice:** ship structural content changes around midnight Bangkok time, and bump `houseVersion` only at a seasonal relaunch.

### 25. The daily house rolls over at midnight Bangkok time for everyone

**Status:** By design

The daily key is the date in UTC+7, so everyone shares the same house, as in Wordle. Players abroad see it change at 00:00 Bangkok time, not at their own midnight.

### 26. Wrong answers and decoys make the water rise faster

**Status:** By design

Penalties (−4 s for a wrong answer, −2 s for the first tap on each decoy) move the round clock forward. In Prepare mode the water level comes from that clock, so it jumps with each penalty. This makes mistakes cost something in the fiction too (*"น้ำขึ้นไวขึ้น"*), and the score never punishes reading: the clock stops while a sheet is open.

### 27. The build rewrites tracked files

**Status:** By design. Watch for it in commits.

`node tools/build.mjs` rewrites these files:

- `public/index.html` (its Open Graph block, canonical link and JSON-LD)
- `public/learn.html`, `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`
- `public/c/*.html`
- `public/checklist/*.html`
- `public/sw.js`

So a local run with a different `SITE_URL`, or after editing any precached file (which changes the service-worker version), leaves changes in git. That is expected. Cloudflare runs the same build on every deploy, so the committed copies only need to be valid, not current. See [GUIDELINES.md](GUIDELINES.md#7-git-and-releases) for what to commit.

### 28. Images are PNG, about 145 KB per preview and 400 KB per checklist

**Status:** By design

Facebook accepts only PNG, JPEG and GIF for `og:image`, and PNG keeps the flat illustration and Thai text sharp. Crawlers fetch each preview once per URL. The checklists (1080×1920) are meant to be saved and forwarded, and LINE re-compresses them anyway.

Converting the previews to JPEG at about quality 85 would roughly halve them, if the hosting budget ever matters. It doesn't on Pages Free.

### 29. Rendering images needs a matching Chromium

**Status:** By design (tooling)

`npm run images` and `npm run smoke` use `playwright-core`, which brings no browser of its own.

- `package-lock.json` pins **1.63.0**, which expects its own Chromium build (1243). Install it with `npx playwright@1.63.0 install chromium`,
- or point `CHROME_PATH` at an existing Chrome or Chromium. Claude Code cloud sessions ship Chromium 141 at `/opt/pw-browsers/chromium`, and every check passes with it.

A version mismatch shows up as "Executable doesn't exist". Set `CHROME_PATH`; any recent Chromium works for these scripts.

### 31. `/learn` repeats the lessons, and `seo.updated` is bumped by hand

**Status:** By design

`/learn` and `/llms.txt` repeat every lesson so that crawlers without JavaScript can read them. They are generated from the same JSON as the game, so the text can't drift, and a build that changes a lesson changes them too. Two things are not automatic:

- `strings.json → seo.updated` (the page's "last updated" date, and the sitemap's `lastmod`) is a value someone sets when lessons change. It is not derived from git.
- The English text on `/learn` is the English already in `items.json`; the page's own headings and labels are in `seo.en` and `seo.th`.

### 32. Search and AI-search results can't be guaranteed

**Status:** Platform

The build does what can be done from this side: crawlable pages, canonical links, structured data, a sitemap, `robots.txt` and `llms.txt` ([KNOWLEDGE §16](KNOWLEDGE.md#16-search-and-ai-search-facts)). Whether Google or Bing index and rank them, and whether AI assistants cite `/learn`, isn't in our control and hasn't been measured. `llms.txt` is an informal proposal, and no major search engine is confirmed to use it **[unverified]**. A brand-new subdomain also starts with no authority.

Check after about two weeks ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) and write the result here.

---

## Fixed

### In v1.0.0, during the handoff review (6 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F1 | On screens ≤ 640 px tall, the HUD buttons and room tabs shrank to **40 px**, against the ≥ 44 px requirement | Restored to 44 px in the short-screen CSS. The stage lost 6 px; item tap areas are still ≥ 47 px at 375×548. |
| F2 | The "ทำไม?" expander in the result lessons was **35×40 px** | Now at least 44×44 px |
| F3 | Source links were **26 px** tall in the lessons, 38 px in the tip card and **21 px** in the About list | The inline links are padded to a 44 px tall tap area without moving the text. The About list became full-width 44 px rows, with the date inside the link. |
| F4 | `npm run smoke -- --screens` saved five screenshots under names the docs didn't use | The test now writes the documented names. A new smoke check covers F1–F3, measuring every visible control on the game, result, checklist, help and about screens. |

### After v1.0.0: going live (6 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F5 (was #7) | Share images showed `#บ้านรอดไหม` instead of the web address, because no `SITE_URL` was set when they were rendered | Re-rendered with `SITE_URL=https://baanrodmai.autobahn.bot npm run images` (33 images plus icons). Checked by eye: `og/default.png`, `og/p7.png` and `share/checklist-prepare.png` show the full address. Re-render whenever the domain changes. |
| F6 | The new `/learn` footer link measured **41 px**: `min-height` does nothing on an inline `<a>` | `a.link { display: inline-block }`. Caught by the smoke check "checklist, help and about controls >= 44 px". |
| F7 | `npm run smoke` timed out at the share step on desktop Chrome (Windows), even on untouched `HEAD`, because Chrome's own Web Share opened the OS dialog | The smoke test hides `navigator.share`, so the in-page sheet is always tested. 24/24 pass on Chrome (Windows). |
| F8 | The first deploy failed at the Functions step with "You need to enable Analytics Engine", and the site returned 522 | The owner created the dataset `baanrodmai_events` (binding `EVENTS`) in Workers → Analytics Engine; the next deploy succeeded. |
| F9 | Creating the Git-connected Pages project failed (code 8000012, then an authentication error from a token without Pages → Edit) | The repository was made visible to Cloudflare and the token was given Pages → Edit. See [LESSONS F6](LESSONS_LEARNED.md#f-working-in-an-ai-sandbox). |

### After v1.0.0: CI and text clean-up (10 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F15 (was #4) | No CI on GitHub | `.github/workflows/ci.yml`, green on GitHub since run 2 (`90de49d`): a `checks` job (build with content validation and the budget, generated files current, `npm test`, `npm run check:docs`) and a `smoke` job (Playwright 1.63.0 Chromium, `npm run smoke`), on every push to `main` and every pull request. |
| F16 (was #5) | About-sheet text, the checklist captions and the language-button label were hard-coded in `main.js`; the `install` event was allowed but never sent | The texts now live in `strings.json` (th and en), and a smoke check proves the About sheet follows the EN toggle. `main.js` keeps only the brand name, the mascot name and the boot-failure line (it must work when the JSON can't load). `install` was removed from both allowlists. |
| F17 | "analytics beacons received" counted **0** on GitHub's runner (6 locally), because the beacon is only sent when the page is hidden and closing the context doesn't fire that reliably | The test fires `pagehide` itself. CI is how this was found. |

### In v1.1.0, during the 3-loop optimization cycle (7 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F10 (was #1) | Neighbouring tap areas overlapped in 32% of houses (worst 45%) | Implemented `slot.excludes` graph in `rooms.json` and checked during target/decoy placement in `house.js`. `npm run probe` over 1,460 houses now reports **0 (0%) overlaps**, worst 0%. |
| F11 (was #33) | Actionable targets lacked visual affordance (Pixel-hunting risk) | Added a 3.5s contextual idle hint timer in `main.js` that fades in a soft breathing dashed ring (`.show-hints`) on unhandled items, with hover micro-interactions on desktop and reduced-motion support. |
| F12 (was #34) | LINE in-app browser blocks direct canvas image downloads | Added explicit card tap/hold instructions below the preview card, a dedicated `.line-guide` helper banner in the share sheet, and direct external browser launcher. |
| F13 (was #35) | Timer anxiety in older players during countdown | Added clear reassurance micro-copy in How-to dialogs explaining the clock stops upon tapping, and added a prominent `⏸️ พักเวลาอยู่` badge inside the choice sheet. |
| F14 (was #36) | Educational rationale ("ทำไม?") was hidden inside `<details>` and skipped | Surfaced the causal 1-sentence `why` explanation directly inside the tip card (💡), reserving the `<details>` accordion strictly for authoritative agency citations. |

### During development (before the first commit)

Each of these became a rule in [GUIDELINES.md](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit):

- The service worker never registered, because boot ran after `load` had already fired.
- A class was used both on the mode buttons and on the app root, which turned the whole result screen blue.
- The "flooded" rule used the item's bottom edge, which didn't match the perspective art. It now uses the sprite's centre.
- The gecko's speech bubble and toasts covered items on the floor.
- SVG layer order: the lamp was drawn behind the wall, and the ground covered the front steps.
- `blob:` image URLs failed in in-app browsers.
- Some English tips were longer than 80 characters.
- The timer icon (an hourglass) read as "Σ" at small size.

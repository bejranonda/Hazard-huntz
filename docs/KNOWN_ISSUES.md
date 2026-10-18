# Known issues and deliberate trade-offs

This is a straight list of what is wrong, what is not built yet, and what is limited on purpose. The state is as of **v1.8.0 (19 Oct 2026)**. Each entry gives a status, the evidence and what to do about it. Numbers are measured, not guessed. `npm run probe` reproduces the overlap and flood-timing figures, and the browser measurements are described in [APPROACH_AND_METHOD.md](APPROACH_AND_METHOD.md#7-measuring-instead-of-assuming).

The planned fixes are scheduled as task cards in [ROADMAP.md](ROADMAP.md) (L-cards for the owner items). Issues that were fixed keep their number and sit under [Fixed](#fixed).

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
| 3 | [Not yet tested on real phones or real in-app browsers](#3-not-yet-tested-on-real-phones-or-real-in-app-browsers) | Open | **High (launch blocker)** |
| 8 | [21 safety items are only partially verified](#8-21-safety-items-are-only-partially-verified) | Owner | **High (review before launch)** |
| 9 | [Agency websites blocked automated checks](#9-agency-websites-blocked-automated-checks) | Owner | Medium |
| 10 | [Sources conflict on soaked mattresses](#10-sources-conflict-on-soaked-mattresses) | Owner | Low |
| 11 | [Thai and English copy need a second native reader](#11-thai-and-english-copy-need-a-second-native-reader) | Owner | Medium |
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
| 37 | [The international version is English only, with Thai advice and hotlines](#37-the-international-version-is-english-only-with-thai-advice-and-hotlines) | By design | — |
| 41 | [The safety book and streak live on one device](#41-the-safety-book-and-streak-live-on-one-device) | By design | — |
| 58 | [The home check and the plan live in one browser](#58-the-home-check-and-the-plan-live-in-one-browser) | By design | — |
| 42 | [A challenge link carries one score, and the combo never scores](#42-a-challenge-link-carries-one-score-and-the-combo-never-scores) | By design | — |
| 43 | [The EM-ball lesson rests on academic sources, not an agency](#43-the-em-ball-lesson-rests-on-academic-sources-not-an-agency) | Owner | Medium |
| 44 | [The featured topic is switched by hand](#44-the-featured-topic-is-switched-by-hand) | By design | — |
| 45 | [The smoke-alarm lesson has no Thai source](#45-the-smoke-alarm-lesson-has-no-thai-source) | Owner | Medium |
| 46 | [Dust and fire advice is quoted through news reports](#46-dust-and-fire-advice-is-quoted-through-news-reports) | Owner | Medium |
| 55 | [The power-cut lessons rest largely on international guidance](#55-the-power-cut-lessons-rest-largely-on-international-guidance) | Owner | **Medium (review before posting widely)** |
| 57 | [The home check and plan card rest partly on international guidance](#57-the-home-check-and-plan-card-rest-partly-on-international-guidance) | Owner | Medium |
| 47 | [The season calendar is editorial](#47-the-season-calendar-is-editorial) | By design | — |
| 48 | [Haze, smoke and the dark are untested on low-end phones](#48-haze-smoke-and-the-dark-are-untested-on-low-end-phones) | Owner | Low |
| 49 | [Dust, fire and the power cut use the flood house](#49-dust-fire-and-the-power-cut-use-the-flood-house) | By design | — |
| 50 | [The v1.5.1 service worker reloads open pages once](#50-the-v151-service-worker-reloads-open-pages-once) | By design | — |
| 51 | [The wordmark's coral half is low contrast](#51-the-wordmarks-coral-half-is-low-contrast) | By design | — |
| 52 | [A `?mode=` link previews as the main game](#52-a-mode-link-previews-as-the-main-game) | By design | — |
| 53 | [The smoke test runs on a pinned date](#53-the-smoke-test-runs-on-a-pinned-date) | By design | — |
| 54 | [Carousel images are committed and Thai only](#54-carousel-images-are-committed-and-thai-only) | By design | — |
| 59 | [The home check's code is counted in the start-screen budget and precached](#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached) | By design | — |

Fixed issues are listed [at the end](#fixed).

---

## Open

### 3. Not yet tested on real phones or real in-app browsers

**Status:** Open · **Severity:** High: a launch blocker

Everything was tested in headless Chromium. That includes user agents for the LINE and Facebook in-app browsers, an iPhone-sized viewport, offline mode and reduced motion. Each of those checks passes.

What a headless test **cannot** show:

- whether `navigator.share` with a PNG file works in each real app
- whether long-pressing to save the card works in LINE, Facebook and TikTok on iOS and Android
- what LINE and Facebook show as the link preview
- how the font, notch and home bar look on real screens
- audio on iOS when the silent switch is on
- whether the home check's ticks and the plan card's text are still there when the page is opened again inside LINE, and whether the shared kit and plan cards save there (v1.8.0, [#58](#58-the-home-check-and-the-plan-live-in-one-browser))

**To do:** run the 48-row matrix in [06-test-checklist.md](06-test-checklist.md) on at least one cheap Android phone and one iPhone, inside LINE, Facebook and TikTok. Record the results in that file.

---

## Needs the owner

### 8. 21 safety items are only partially verified

**Status:** Owner · **Severity:** High: review before launch

Twenty-one items are marked ⚠️ `partial`: ten in the flood modes, one in fire and ten in the power cut (v1.7.0). The summary at the top of [01-safety-content.md](01-safety-content.md) is generated from `items.json`, so it always has the current count.

- **Nine flood items with one uncertain detail:** `p-phone`, `p-car`, `p-meds`, `p-numbers`, `p-chem`, `p-drain`, `p-toilet`, `p-fuel` and `r-sag`. For each one, the core advice is official, but one detail is:
  - an inference (for example "charge fully")
  - from an older statement (the 2011 police request about parking on bridges, or the 2013 7-day medicine figure)
  - or common practice rather than official wording (a sandbag in the toilet bowl)
- **`r-stagnant`** (EM balls, after the flood) rests on academic sources, not an agency ([#43](#43-the-em-ball-lesson-rests-on-academic-sources-not-an-agency)).
- **`f-alarm`** (smoke alarms) rests only on the US Fire Administration ([#45](#45-the-smoke-alarm-lesson-has-no-thai-source)).
- **Ten power-cut lessons** (v1.7.0): `s-fridge`, `s-leftover`, `s-freezer`, `s-opener`, `s-medcold`, `s-candle` and `s-plugs` rest on international guidance only (US CDC, Ready.gov, US Fire Administration); `s-pantry` mixes the Department of Health's 3–5 days with Tokyo's everyday stockpiling and Ready.gov's "replace what's expired"; `s-water` and `s-radio` rest on a PRD checklist page that tools can't read ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)).

Each reason is listed under *Flags* in [01-safety-content.md](01-safety-content.md). `p-toilet` and `p-fuel` are in rooms that are not playable yet, so 19 of the 21 are in play.

The home check (v1.8.0) has ⚠️ lines of its own, outside this count: they are things to have at home in `kit.json`, not lessons in `items.json` ([#57](#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)).

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

### 11. Thai and English copy need a second native reader

**Status:** Owner (the owner said on 11 Oct 2026 they will provide the language check) · **Severity:** Medium

The English text (`en`, `ogEn`, `seo.en`) was written alongside the Thai and has had no native-English review either. All Thai copy was written in one pass and checked against the guidelines: the tone, the 80-character tip limit and the guardrails. That covers tips, choices, feedback, the gecko's lines, rank titles and the share texts. A second native speaker should still read everything in `strings.json`, `items.json` and `checklists.json` once, ideally an older family member who represents the forwarding audience.

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

Otherwise the manual `rainWarningActive` switch is used, until its end date `rainWarningUntil`. Nothing breaks, but the automation silently does nothing. When it does answer, its answer beats the manual switch both ways (`recommend()` in `modes.js`).

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

There are only 122 preview images: 61 Thai and 61 English, each being 5 modes × 11 scores, plus the default and the five checklists. Each is a static page and a PNG. The hazard pages (`/flood`, `/pm25`, `/fire`, v1.6.0, and `/ready`, v1.7.0) reuse the checklist images, so they add none.

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
- changing a room's slots: adding or removing one, or changing its id, tags or `excludes`
- bumping `houseVersion`

Moving a slot's `x`/`y` while keeping its id, tags and exclusions picks the same items for the same slots, so houses and challenge links stay the same; only where the item is drawn changes, and with it when water or smoke reaches it. v1.7.0 moved `kt-fridge-note` this way ([F38](#in-v170-19-oct-2026)).

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
- the hazard pages `public/flood.html`, `public/pm25.html`, `public/fire.html` (v1.6.0) and `public/ready.html` (v1.7.0)
- `public/posts.html` (v1.6.1)
- `public/c/*.html`
- `public/checklist/*.html`
- the English set under `public/en/`
- `public/sw.js` and `public/js/version.js`

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

`/learn` and `/llms.txt` repeat every lesson so that crawlers without JavaScript can read them. Since v1.6.0 the hazard pages (`/flood`, `/pm25`, `/fire`, since v1.7.0 `/ready`, and their `/en/` twins) repeat them a second time, each with only its hazard's lessons, so a search for one hazard lands on a short page. All of them are generated from the same JSON as the game, so the text can't drift, and a build that changes a lesson changes every page. Two things are not automatic:

- `strings.json → seo.updated` (the pages' "last updated" date, and the sitemap's `lastmod`) is a value someone sets when lessons change. It is not derived from git.
- The English lesson text is the English already in `items.json`; the pages' own headings, titles, descriptions and intros are in `seo.en` and `seo.th`. The hazard pages' text adds no advice or numbers and names no agencies, so it can't contradict the lessons, but it is still a draft for the language check ([#11](#11-thai-and-english-copy-need-a-second-native-reader)).

### 32. Search and AI-search results can't be guaranteed

**Status:** Platform

The build does what can be done from this side: crawlable pages, canonical links, structured data, a sitemap, `robots.txt` and `llms.txt` ([KNOWLEDGE §16](KNOWLEDGE.md#16-search-and-ai-search-facts)). Whether Google or Bing index and rank them, and whether AI assistants cite `/learn`, isn't in our control and hasn't been measured. `llms.txt` is an informal proposal, and no major search engine is confirmed to use it **[unverified]**. A brand-new subdomain also starts with no authority.

Check after about two weeks ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) and write the result here.

### 37. The international version is English only, with Thai advice and hotlines

**Status:** By design (v1.2.0)

- **One extra language.** `/en/` adds English. Other languages would need their own `strings.json` table, `ogEn`-style preview text and images; the build only knows Thai and English.
- **Thai advice and numbers.** Most lessons are sourced from Thai agencies; a few rest on international guidance and are flagged ⚠️ (the smoke alarm, and most of the power-cut lessons, [#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)). The hotlines (1784, 199, 1669, 1555, 1130, 1129, 1323) are Thai. English pages say so and point people outside Thailand to their local authorities. No foreign numbers were added, because none were verified. Electrical details (MEA/PEA, breaker behaviour) may differ elsewhere.
- **The wordmark is romanised in English** ("Baan Rod Mai?", from `strings.json → logoA/logoB`), so English players don't see Thai script as the brand; the Thai name still appears in the Thai pages' titles and `alternateName`.
- **The English text has had no native-speaker review** of tone; it was written alongside the Thai ([#11](#11-thai-and-english-copy-need-a-second-native-reader)).
- **Preview caches:** Facebook and LINE cache per URL, so a previously shared `/c/…` link keeps its Thai preview.


### 41. The safety book and streak live on one device

**Status:** By design

The safety book (`brm:learned`), the streak, best scores and the how-to flags are kept in the browser's `localStorage`, with no account. A new phone, a different in-app browser (LINE and Facebook each have their own storage) or private mode starts from zero, and an in-app browser may clear it. That is the price of keeping no personal data. The sheet says "เก็บในเครื่องนี้เท่านั้น" so players aren't surprised.

### 58. The home check and the plan live in one browser

**Status:** By design (v1.8.0)

The home check's answers, ticks and score (`brm:kit`) and the plan card's text (`brm:plan`) are kept only in this browser's `localStorage`, through `store` in `util.js`, like the safety book ([#41](#41-the-safety-book-and-streak-live-on-one-device)). Nothing is sent, so there is nothing to sync:

- **Cleared with the site's data,** and not kept in private browsing.
- **Each browser has its own copy.** LINE's in-app browser and the phone's main browser keep separate storage, so a list made in LINE isn't there when the same link opens in Chrome or Safari, and the other way round. Facebook's and TikTok's in-app browsers are separate again. **[unverified]** on a real phone: this follows from how in-app browsers keep site data ([#41](#41-the-safety-book-and-streak-live-on-one-device)), and it has not been tried; the headless tests start every browser context empty, so they can't show it.
- **Safari may delete it after a week without a visit.** WebKit caps script-written storage for sites the user hasn't interacted with in seven days of browser use; whether that applies here, and to LINE's in-app browser on iPhone, is **[unverified]**.
- **Anyone holding the phone can open it.** The plan text is on the device in plain form, which is why the form warns against ID-card numbers and more personal data than needed, and caps each field at 40 characters (60 for medicine).

**What families keep is the picture.** The plan card says "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน": the saved or forwarded image is the copy that lasts, and the household can make it again from any browser. Real-phone checks: rows 46–48 of [06-test-checklist.md](06-test-checklist.md).

### 42. A challenge link carries one score, and the combo never scores

**Status:** By design (v1.3.0)

- **One score per link.** `/c/p8?h=…` carries the sender's score only. In a family group, each reply compares with the person it came from, not with everyone. A round-up of several scores is an idea in [ROADMAP P5c](ROADMAP.md#p5-share-loop-ideas-not-built-yet).
- **Anyone can edit a link's score.** The score is in the URL, so a sender could type `/c/p10`. It is a friendly game with no leaderboard, so this is accepted.
- **The combo is feel only.** Three right answers in a row show "🔥 3 ข้อติด!" but add no points. The score stays "safe actions out of 10", and challenge links from earlier versions stay fair.

### 43. The EM-ball lesson rests on academic sources, not an agency

**Status:** Owner · **Severity:** Medium

`r-stagnant` says EM balls don't treat stagnant floodwater. Its sources are a 2011 statement signed by 48 environmental scientists (Chula, Kasetsart, Mahidol, KMUTT and others) and a 2026 peer-reviewed study from Bangkokthonburi University ([KNOWLEDGE §21](KNOWLEDGE.md#21-topics-and-the-news-driven-lessons-v140)). No current statement from the Pollution Control Department or the Department of Health was found, and a local administration in Pathum Thani was using EM balls with aerators in October 2026. The lesson is flagged ⚠️, states the evidence without blaming anyone, and gives the action the scientists recommend (drain, remove rubbish, add air).

**Fix:** ask the PCD or the Department of Health for a current position. If an agency supports using EM in some situations (for example to reduce smell), add that nuance and its source; if it agrees, mark the item `verified`. An NSTDA page from 2011 ("Suggested treatments for foul water and when EM is effective") returned an error on 15 Oct 2026 and was not read; read it first.

### 44. The featured topic is switched by hand

**Status:** By design

`config.featuredTopic` puts one topic on the start screen. Nothing switches it on from the news; the owner sets it (now `"health"`, for the disease warnings in September–October 2026).

**It ends by itself (v1.6.0).** `config.featuredTopicUntil` is its last day (now `2026-11-15`, Bangkok date, that day included); from the next day the topic is off without anyone touching it. The rain warning works the same way with `rainWarningUntil` (now `2026-11-30`). Before v1.6.0 neither had an end, so a forgotten switch would have kept "ฝนจะมาอีกระลอก" and the diseases-after-floods topic on the start screen into the dust season ([F32](#in-v160-18-oct-2026)). Set an end date every time you turn a switch on; the build warns about a switch with no end date or one whose date has passed, and its `start` line shows what today's visitors see.

When no topic is in the news, the start screen features the topic of the recommended mode (dust → 😷 `air` in December–March, fire → 🔥 `fire` in April). A `?mode=` link brings that mode's own topic first. In the flood months nothing is featured unless the owner sets a topic. Leaving a topic on for months makes it wallpaper, so the owner still decides when to end it early or extend it.

### 45. The smoke-alarm lesson has no Thai source

**Status:** Owner · **Severity:** Medium

`f-alarm` (test smoke alarms monthly, change a low battery) rests only on the US Fire Administration (`usfa-alarm-2569`, kind `international`) and is flagged ⚠️ `partial`. No Thai agency page about home smoke alarms was found on 15 Oct 2026, and few Thai homes have one. Keep it as a nudge, or drop it, after the owner's review ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)). Dropping it reshuffles fire houses only.

### 46. Dust and fire advice is quoted through news reports

**Status:** Owner · **Severity:** Medium

The Department of Health, DDPM and MEA advice in v1.5.0 comes from news reports that quote them (THE STANDARD, Thai PBS, PPTV, Krungthep Turakij, MGR Online, Thansettakij), kind `secondary`, because the agency sites refuse automated access ([AGENTS §7](../AGENTS.md#7-environment-notes)). Two details to know:

- The DDPM "10 ways to survive a fire" article of 2026 (`ddpm-fire10-2569`) shows no date on the page; related stories are from July 2026. The 2020 version (`ddpm-fire10-2563`) says the same.
- PPTV (2022) gives PM2.5 colour ranges from before Thailand's 2023 change. The game uses only the colour order and "red: at-risk groups stay in", which both scales share.

A person should read the agency pages before December ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 55. The power-cut lessons rest largely on international guidance

**Status:** Owner · **Severity:** Medium: review before posting the power-cut set widely

The power-cut mode (v1.7.0) was prompted by a Thai stockpiling infographic, which is not a source. Its 13 lessons rest on what agencies could be read on 18 Oct 2026, and for most of them that was not a Thai agency:

| Lessons | What they rest on | Status |
|---|---|---|
| `s-torch`, `s-powerbank`, `s-generator` | ปภ. kits, the DDC's generator advice, cross-checked with Ready.gov | ✅ |
| `s-water`, `s-radio` | กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`). The 3 L per person per day is in the page's title, and the radio was seen only in a search summary: the page refuses automated reading. Ready.gov lists the radio too | ⚠️ |
| `s-pantry` | The Department of Health's 3–5 days (via a news report), Tokyo's everyday stockpiling, Ready.gov's "replace what's expired" | ⚠️ |
| `s-fridge`, `s-leftover`, `s-freezer` | The US CDC only (4 hours for a closed fridge, 48 / 24 hours for a full / half-full freezer, never taste to check); `s-fridge` also Ready.gov | ⚠️ |
| `s-opener`, `s-plugs`, `s-medcold` | Ready.gov only | ⚠️ |
| `s-candle` | The US Fire Administration and Ready.gov only | ⚠️ |

- **Why:** no Thai agency page on fridge food in a power cut, unplugging against surges, candles, a manual can opener or cold medicine was found. The international pages were read in full and quoted in each source's `note`. Each ⚠️ lesson's `verifyNote` says which part is international, and `/learn`, the hazard page and the carousel mark them as under review.
- **What the game does with the numbers:** only the CDC's 4 hours drives play (`lostAfter: 4` on the fridge); the 48 hours keep the freezer safe through the 12-hour round. Numbers no agency shares are left out: the infographic's eating order, "check every 3–6 months" and the 7-day aim (Tokyo's alone).
- **Written for other countries.** The US and Tokyo pages were written for their own homes and services. The lessons keep to general actions with no foreign numbers or laws, and whether they fit Thai homes is what the Thai review should confirm.
- **What would make them Thai:** a person opening the PRD checklist page in a normal browser (3 L, the radio); MEA (กฟน.) or PEA (กฟภ.) advice on unplugging in a power cut; กรมอนามัย or อย. on fridge and freezer food; a Thai pharmacist or อย. on cold medicine; ปภ. wording on candles and on a can opener in a kit. Add the Thai source beside the international one and mark the lesson ✅ when it says the same. The steps are in [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons).
- **Until then,** 5 of the 8 lessons in the `ready` carousel set are ⚠️, and each of those images says "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน". Post that set knowing so ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)).

### 57. The home check and plan card rest partly on international guidance

**Status:** Owner · **Severity:** Medium: review before promoting the check widely

The home check (v1.8.0, `kit.json`) lists 15 things a household may need; 9 of them are ⚠️ `partial`, and the list says "ข้อนี้อยู่ระหว่างตรวจทาน" next to their sources. They rest on the same pages as the power-cut lessons:

| Kit items | What they rest on | Why ⚠️ |
|---|---|---|
| `water` (3 L × people × 3 days), `radio` | กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`, the 3 L is in its title; the page refuses automated reading), ปภ.'s 3–4 days (`ddpm-amarin`), Ready.gov for the radio | As `s-water` and `s-radio` ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)) |
| `opener`, `cash`, `baby` (formula, bottles, nappies), `glasses` | Ready.gov "Build A Kit" only (`readygov-kit`) | International only. The source's `note` quotes the basic kit (water, food, a can opener, a flashlight, a radio, batteries). Cash, glasses and baby supplies are on the same page's "Additional Emergency Supplies" list ("Cash or traveler's checks", "Prescription eyeglasses and contact lens solution", "Infant formula, bottles, diapers, wipes and diaper rash cream"), read again on 19 Oct 2026 and quoted in the `note` since v1.8.0 |
| `medcold`, `device` | Ready.gov "Power Outages" only (`readygov-outage`) | International only, as `s-medcold` |
| `meds` (at least 7 days) | The MOPH's 2013 statement via news (`moph-7days`), ปภ.'s kit (`ddpm-6kit`) | The 7 days are from 2013, as `p-meds` |

The 6 ✅ items rest on Thai agencies, some cross-checked with Ready.gov: food for 3 days (กรมอนามัย, ปภ., the MOPH), a flashlight each (ปภ.; "every household member" is Ready.gov's), charged phones and a power bank, the first aid kit and the documents in a waterproof bag (ปภ.), and the pet's food and carrier or leash (ปภ., กรมอนามัย).

**The plan card:** the hints of the meeting place and the contact rest on Ready.gov "Make A Plan" alone (`readygov-plan`, added in v1.8.0); no Thai agency page on a family meeting place or a contact plan was found on 19 Oct 2026. Both say ⚠️ on the form. The medicine hint (7 days) is ⚠️ as above. The shelter and "who helps whom" hints are Thai (กรมประชาสัมพันธ์, ปภ., กรมอนามัย), and the second "who helps whom" has no hint.

- **Not in the safety table.** [01-safety-content.md](01-safety-content.md) is generated from `items.json`, so the kit's ⚠️ lines are not among #8's 21 (its source list does count the kit's and the plan card's citations). [KNOWLEDGE §28.3](KNOWLEDGE.md#283-the-list-amounts-and-sources) lists every kit line with its sources.
- **What would make them Thai:** the same reviews as [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons) (the PRD page in a normal browser, กรมอนามัย or อย. on cold medicine), plus ปภ. wording on a family meeting place and keeping cash at home, and กรมอนามัย on supplies for small children.
- **The kit's Thai and English wording** has had no native-speaker reading ([#11](#11-thai-and-english-copy-need-a-second-native-reader)).

### 47. The season calendar is editorial

**Status:** By design

`config.modes[].months` (dust December–March, fire April, flood May–November; the power cut, v1.7.0, has none) was chosen by us from the general pattern (Bangkok's dust peaks December–February and the North's February–April; dry, windy months raise fire risk). No Thai agency publishes a month-by-month hazard calendar that we could find **[unverified]**. The North's dust season runs later than Bangkok's, so a northern player in April sees fire recommended, not dust. The owner can change the months, and `rainWarningActive` still overrides them until `rainWarningUntil` (now 30 Nov 2026).

The south floods later, in the November–January monsoon. The model has one calendar for the whole country, so it doesn't cover that: once the rain switch ends on 30 Nov, the start screen recommends dust from December. Campaigns for the south use `/?mode=prepare`, which opens the game on flood preparation whatever the date, or `/flood`, the flood lessons with play buttons. Extending `rainWarningUntil` instead would change the start screen for the whole country.

**The power cut is year-round, never the default.** Its `months` is empty, so `seasonalMode()` never picks it, and the start screen never recommends it by itself; it is always one of the small cards. People reach it through its card, `/?mode=stock`, the `/ready` page and posts. Power cuts and storms don't follow a calendar we could source, so a post after a planned cut or a storm is the way to feature it ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)). For a week, `featuredTopic: "food"` with an end date puts the 💧 water-and-food topic on the start screen (6 of its 10 lessons are power-cut lessons since v1.7.0).

### 48. Haze, smoke and the dark are untested on low-end phones

**Status:** Owner · **Severity:** Low

The power cut's dark layer (v1.7.0: a group of two full-room rectangles, the body and a wide edge stroke) was not measured; the table below is from v1.5.0, before it existed. Like the haze, it changes one attribute per room each frame (the group's `opacity`), so it should cost no more, but that is **[unverified]**.

The haze (a full-room rectangle and 46 specks per room) and the smoke (a translucent band) are redrawn by changing one attribute per room each frame. Measured on 15 Oct 2026 in headless Chromium at 360 × 640, 2× pixels, half-way through a round, with the CPU slowed 6× (Chrome's "low-end mobile" setting):

| Mode | fps | median frame | 95th percentile | worst |
|---|---|---|---|---|
| ก่อนน้ำมา (water) | ~43 | 16.7 ms | 33.4 ms | 50 ms |
| หลังน้ำลด (no threat) | ~40 | 16.7 ms | 50.0 ms | 83 ms |
| ฝุ่น (haze) | ~46 | 16.7 ms | 33.4 ms | 50 ms |
| ไฟ (smoke) | ~40 | 16.7 ms | 50.0 ms | 133 ms |

Unthrottled, all four hold 60 fps. The haze and smoke cost no more than the flood modes, so the layers are not the bottleneck. A real low-end Android phone is still untested ([ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix)); if it stutters, drop the specks or update less often.

### 51. The wordmark's coral half is low contrast

**Status:** By design

axe-core flags "รอดไหม?" in the start-screen wordmark: coral `#FF7A59` on cream `#FFF4E3` is 2.35:1, under the 3:1 for large text. WCAG exempts text that is part of a logo, the word is 44 px, and the teal half next to it carries the contrast. Everything else on the screens checked passes. Darken the coral only if a real reader struggles with it, and re-render the images if you do.

### 50. The v1.5.1 service worker reloads open pages once

**Status:** By design

When the v1.5.1 service worker replaces one from before v1.5.1, it reloads the open pages once so they don't keep running old code (F27). A visitor in the middle of a round at that moment is sent back to the start screen. It happens once per browser, only at that upgrade; later releases fetch code network-first and need no reload.

### 49. Dust, fire and the power cut use the flood house

**Status:** By design

The three rooms were drawn for floods: the Return mud layer and the rain are hidden for dust, fire and the power cut, but the window and yard are the same, and the smoke can cover the alarm early (about 22 s). In the power cut the window still shows the sun, dimmed by the dark layer ([16-stock.png](screens/16-stock.png)); the darkness is a tint over the whole room, not a night scene. New rooms (P1) and a coast scene (P8) would give each hazard its own look. Items don't overlap: the probe reports 0% over 3,650 houses in all five modes (v1.7.0).

### 52. A `?mode=` link previews as the main game

**Status:** By design

`/?mode=dust` is the app shell with a query, so LINE and Facebook show the same preview as `/` (the default image and title), not a dust one. Pages are static and the previews are fixed per path ([#23](#23-link-previews-are-pre-rendered-not-drawn-per-request)). The game itself reads the link and opens on the right card. Web Analytics doesn't record the query either ([#22](#22-web-analytics-blind-spots)), so count link arrivals with the `view` event's `link` label ([05-metrics](05-metrics.md#event-dictionary)).

The home check and the plan card work the same way (v1.8.0): `/?open=kit` and `/?open=plan` preview as the main game. Post them with the picture of a kit or plan card, or link `/ready`, whose page links both.

**When the preview matters,** share the hazard page instead: `/pm25`, `/fire`, `/flood` or `/ready` (or `/en/…`). Each has its own title, description and the hazard's checklist image, and its ▶ button opens `/?mode=<id>`. Use the `?mode=` link where the post already carries a picture, or next to the hazard page ([04-launch-kit](04-launch-kit.md#when-the-dust-season-starts-v150-from-december)).

### 53. The smoke test runs on a pinned date

**Status:** By design (tooling)

`npm run smoke` plays on a fixed Bangkok day, `SMOKE_DATE` (default `2026-10-18`), and takes what the start screen should show from `recommend()`. So it passes on any real date, and it can't catch a problem that depends on today's date, such as a switch whose end date has passed or a season that starts tomorrow.

- **Today's state shows in the build,** not the smoke test: `node tools/build.mjs` prints a `start` line (what visitors see today) and warns about a switch with no end date or a past one. Read it after every release and at the start of each month.
- **To test another season,** run `SMOKE_DATE=2026-12-05 npm run smoke` (dust) or `SMOKE_DATE=2027-04-10 npm run smoke` (fire); both passed 79/79 on 18 Oct 2026.
- **Only `Date` is shifted,** by an init script, and time keeps running. Playwright's clock API would also fake the timers and `requestAnimationFrame` that the rounds use, so it isn't used ([LESSONS D10](LESSONS_LEARNED.md#d-testing-and-verification)).

### 54. Carousel images are committed and Thai only

**Status:** By design (content)

The carousel posts (v1.6.1) are 45 JPEG images in four sets (`flood` 12, `pm25` 11, `fire` 11 and, since v1.7.0, `ready` 11), about 6 MB, committed under `public/share/carousel/`. They are rendered by `npm run images`, like the link previews, because Cloudflare's build has no browser.

- **They go stale when the text changes.** A lesson's wording, a caption or the site address can change after the last render. The build warns when the fingerprint in `share/carousel/manifest.json` no longer matches; run `npm run images -- --only share/carousel` and commit the images.
- **Each full re-render adds about 6 MB to the repository's history.** Re-render when the text changed, not on every release.
- **Lessons under review are posted as such.** 5 of the 8 lessons in the `ready` set are ⚠️ ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)), and their pages say "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน". Since v1.7.0 the build lists them on its `posts` line ("lessons under review: outage 5 ⚠️") rather than warning about each one, so a real warning isn't lost among them. When a review changes a lesson, re-render the set.
- **Only Thai sets exist.** `carouselSets()` takes a language and `carousel.json` has English text, so English sets can be rendered when an English channel needs them (`share/carousel/en/<slug>/`).
- **Only the owner's page lists them.** `/posts` is `noindex` and not in the sitemap; the images themselves are public files, like the link previews.

### 59. The home check's code is counted in the start-screen budget and precached

**Status:** By design (v1.8.0)

`kit.js` (about 5.5 KB compressed) and `kitplan.js` (0.8 KB) load only when the check or the plan card opens (`import('./kit.js')` in `main.js`), and `kit.json` (about 4.3 KB) is fetched then.

- **The budget counts them anyway.** The build sums every file in `public/js/` as start-screen weight, so its `budget` line says 208 KB where a first visit fetches about 6 KB less before the start screen. The limit is 500 KB, so the build errs on the safe side; `kit.json` isn't counted.
- **The service worker downloads them after the page has loaded.** All three are in the precache (44 files), so a visitor whose browser runs the service worker gets about 10.5 KB more in the background, whether or not they open the check; in return the check works offline after the first visit.
- **Without the files,** offline in a browser with no service worker (the iOS in-app browsers, [#16](#16-no-offline-play-inside-ios-in-app-browsers)) or before the precache finished, the button shows the toast "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`) and the game carries on.

If the check grows, measure it on its own (`gzip -9` of the files) rather than through the budget line.

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

### In v1.8.0 (19 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F41 (was #56) | v1.7.0 rewrote the generic texts that said every tip comes from Thai agencies (F39) but missed `ogEn.checklistDesc`, the description of every English checklist preview: "A family checklist from Thai government agency advice. Outside Thailand, follow your local authorities." `/en/checklist/stock` said it too, although four of that checklist's ten lines rest on US guidance | It reads "A family checklist from government agency advice. Outside Thailand, follow your local authorities." The CDC, Ready.gov and the Tokyo Metropolitan Government are government agencies too. The Thai twin, "เช็กลิสต์จากคำแนะนำหน่วยงานรัฐ", names no country and is unchanged. The build regenerated the five `/en/checklist/…` pages; no image changed. |

### In v1.7.0 (19 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F40 | The build carried on after a content error and crashed with a `TypeError` on a missing `og` string while generating pages, so the message didn't say what was missing | It stops after the content checks when any of them failed (`if (errors.length) finish()`), before it generates a page, and lists every error. |
| F39 | The generic texts said every tip comes from Thai government agencies: the About text (th/en), the default link preview's title and description (`og`/`ogEn`), the `/learn` titles and heading, `seo.en.llmsSummary`, `seo.en.intlNote`, `index.html`'s meta description and `llms.txt`'s notes. It was already not quite true for `f-alarm` (US source only, v1.5.0) and would have been plainly wrong with the power-cut lessons | They now say every tip has a source, most from Thai agencies, some international and marked. `og/default.png` and its English twin were re-rendered ("น้ำท่วม · ฝุ่น · ไฟไหม้ · ไฟดับ"). One text was missed: the English checklist preview description (#56, fixed in v1.8.0 as [F41](#in-v180-19-oct-2026)). Rule: [GUIDELINES rule 55](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). |
| F38 | The left room arrow (‹, 44 × 64 px at 44 % of the stage's height) covered part of the item on the fridge, slot `kt-fridge-note`: up to **23 %** of the tap area of `p-numbers` (Prepare) and `f-call` (fire), and **27 %** of the new `s-fridge`, at 390 × 760; 18–20 % at 360 × 640, 6–8 % at 768 × 1024, none at 320 × 460. A tap there turned the room instead of opening the item. It had been there since v1.0 (`p-numbers`) and v1.5 (`f-call`); the smoke test clicked items with `force: true`, which ignores what covers them | The slot moved from y 344 to y 404, below the arrows. Same slot id, so every house and challenge link is unchanged. Worst coverage left: 2 % (window items at the right edge). New smoke check: "the room arrows cover at most 5% of any item's tap area (every mode, 3 houses, 390x760 and 360x640)". `npm run probe`: still 0 % overlaps. Side effects of the lower slot: `p-numbers` now goes under at 43.6 s (was 55.6 s), and the fire smoke no longer reaches `f-call` (it did at 53.7 s). Rule: [GUIDELINES rule 54](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lesson [D11](LESSONS_LEARNED.md#d-testing-and-verification). |

### In v1.6.0 (18 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F37 | The play button on `/learn` was white on orange (`#e8742a`, **3.0:1**, below the 4.5:1 WCAG AA needs for its 17 px text), and the new hazard pages copied it; the current-hazard chip was 3.9:1. axe-core flagged both | The plain pages use the game's own button: yellow (`#FFC83D`) with dark text (`#3E2A1E`), and the current chip has dark text. axe-core finds nothing on `/learn`, `/pm25`, `/flood` or `/en/fire`. |
| F36 | Two endings pointed at the screen: `cheerLowReturn` said "อ่านข้อที่พลาดด้านล่าง" and `cheerMidFire` "อ่านข้อที่พลาดด้านล่างนะ" ("below"). Fine on the result screen, wrong on the shared card, which now carries the ending | Reworded: "บ้านยังไม่พร้อม ตรวจให้ครบอีกรอบ ก่อนกลับเข้าบ้านนะ" and "ยังมีจุดเสี่ยงไฟอยู่ ลองหาให้ครบอีกรอบนะ", and the English twins. A unit test forbids "ด้านล่าง" and "below" in every ending. |
| F35 | The helpline `tel:` links on `/learn` were **28–38 px** wide | `min-width: 44px` on them, and the top links (the game, the other language) are 44 px tall, on every plain page. Smoke check: every control on `/learn`, `/en/learn` and the six hazard pages is at least 44 px at 320 × 460. |
| F34 | Counts in the docs had drifted from the code: the safety table described as 43 items (68); #8 said 10 partial items and listed 9 (11); the safety book as 41 lessons in 6 topics (66 in 8); the phone matrix as 35 or 38 rows (40, now 42); the precache list as 39 files (41); the first game screen as 168 KB (201 KB); the strings as 130 keys per language (210); 50 preview images (98); KNOWLEDGE §24 still quoted the two old endings; 02-game-design still had 38–43 px items on 320 px phones; HANDOFF still listed #2 as open (fixed as F21) | Fixed in every doc. The safety table's counts are now a generated summary at the top of docs/01 (`npm run docs`), and a normal build warns when that file is out of date with the content. For test counts, the number the run prints is the reference. |
| F33 | The smoke test read the real calendar: it expected the FloodWatch link and read `config.featuredTopic`, so it would have failed by itself (and waited 30 s for a missing card) once the topic was switched off or the season moved on | It plays on a pinned Bangkok day (`SMOKE_DATE`, default `2026-10-18`) and takes its expectations from `recommend()`. 79/79 on the default day, on `2026-12-05` and on `2027-04-10`. See [#53](#53-the-smoke-test-runs-on-a-pinned-date). |
| F32 | `rainWarningActive` and `featuredTopic`, switched on by hand in mid-October, had no end. Forgotten, they would have kept "ฝนจะมาอีกระลอก", Prepare as the big card and the diseases-after-floods topic on the start screen into December's dust season | `rainWarningUntil` (`2026-11-30`) and `featuredTopicUntil` (`2026-11-15`) end them by themselves (`switchOn()` in `modes.js`). The build stops on a date that isn't real, warns about a switch with no end date or a past one, and prints today's `start` line. A unit test covers the last day and the day after. See [#44](#44-the-featured-topic-is-switched-by-hand). |

### In v1.5.2 (15 Oct 2026): the visitor funnel

| # | Problem | Fix |
|---|---|---|
| F31 | On a challenge link, "รับคำท้า!" was below the fold on 320 × 460 (509–565 px) and the gecko said the season's line (flood) above a dust or fire challenge | The gecko steps aside on challenge landings, and the tagline too below 520 px tall: 303–359 px. Smoke check. |
| F30 | The how-to "start" and the post-answer "next" buttons were off screen at 320 × 460 | Both stick to the bottom of their sheet. |
| F29 | The share sheet showed a full-size card first, so no channel was on the first screen at 320 px, in LINE on iPhone (390 × 664) or on a landscape tablet | Channels first, card capped at 40 % of the screen. Smoke check (360 × 640). |
| F28 | The result's main share button was below the fold on every phone and on landscape tablets (e.g. 738 px on a 664 px screen) | Card capped at 58 % of the screen; the main action sticks to the bottom. 598–654 px on 390 × 664. Smoke check. |

### In v1.5.1 (15 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F27 | A returning visitor tapped ฝุ่น PM2.5 and got the rising-water house. The service worker served HTML and content network-first but code stale-while-revalidate, so the first visit after a deploy ran v1.4.0 code (which maps an unknown mode to Prepare) under v1.5.0 HTML and content. Reproduced by installing v1.4.0, then serving v1.5.0 on the same address. | Code, content and room art are network-first; a service worker replacing a pre-1.5.1 cache reloads open pages once; `main.js` reloads once when `js/version.js` and `config.json` disagree. Measured: v1.4.0 → v1.5.1 gives one automatic reload and the dust house; v1.5.1 → a fake next release gives the new code on the first visit with no reload. Smoke check added. |

### In v1.5.0 (15 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F26 | Source links under lessons were 31–43 px wide for short agency names (ปภ. 23 px of text, อย. 43 px with padding), in the game and on `/learn` | `min-width: 44px` on the links in both places; the visitor pass over four modes and five screen sizes finds no target under 44 px. |
| F25 | The first dust fan sprite (50 × 70) overlapped the kitchen's lower floor slot by 1% in 35 of 2,920 houses | Resized to 46 × 64; `npm run probe` reports 0%. |

### After v1.3.0 (14 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F24 (was #40) | The smoke test counted the start screen **uncompressed** (479 KB against 500 KB), so a text addition could fail it though visitors download a third of that | The test now gzips text responses the way Cloudflare does and counts fonts and images as they are: **167 KB** compressed (481 KB raw), still against 500 KB. |
| F23 (was #38) | A visitor from outside Thailand who opened `/` saw Thai text for about 0.9 s before the page switched to English | A tiny inline script at the top of `index.html` sends them to the same page under `/en/` (`/`, `/c/…`, `/checklist/…`) before anything is drawn, so they never see Thai. Same rule as the language guess: a Thai browser or Bangkok time stays on Thai; a stored choice or `?lang=` wins; search and preview bots (`isBot`) stay on Thai, so Google keeps the Thai page and finds English through `hreflang`. Measured: the wordmark text seen is only "Baan Rod Mai?". Five smoke checks cover who is **not** sent. |

### After v1.2.2 (13 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F21 (was #2) | Item tap areas were 38.1 px at 320×460 and 42.8 px at 320×504 | Under 520 px of height the room tabs are hidden (the ‹ › arrows stay) and the HUD padding shrinks. Smoke check "tap targets >= 44 px on 320x460" measures **44.1 px**; the same page's controls stay at 44 px or more. On 360×560 and larger screens nothing changes. |
| F22 (was #39) | Game events carried no language | `track()` now sends `th` or `en` as a fifth field and `/api/e` stores it as `blob4` (anything else is stored as `th`). [05-metrics.md](05-metrics.md) has the Thai/English split. |

### After v1.1.0: international version and wording (11–12 Oct 2026)

| # | Problem | Fix |
|---|---|---|
| F18 (was #6) | `[FORECAST_APP_URL]` was a placeholder, so the "check the water level" button was hidden | `config.json → forecastAppUrl` is `https://flood.autobahn.bot/` (BKK FloodWatch, the owner's own project). A smoke check proves the start-screen button points there. The `[DOMAIN]` half was fixed on 6 Oct (F5). |
| F19 | On `/en/` the header still said "บ้านรอดไหม?", and the English result card and checklist image drew the Thai name | The wordmark comes from `strings.json → logoA/logoB` in HTML (`data-i18n`) and in the canvas `logo()`, which also shrinks to fit. A smoke check covers the English wordmark. The first English version drew "BaanRod Mai?" (no space); the space now lives in `logoA`. |
| F20 | English visitors had to find the language button; links and previews were Thai only | `/en/` pages, English previews, `hreflang`, language guess (Thai browser or Bangkok time zone = Thai, otherwise English) and `/en` challenge links (v1.2.0). |

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

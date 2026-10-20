# Known issues and deliberate trade-offs

This is a straight list of what is wrong, what is not built yet, and what is limited on purpose. The state is as of **v1.11.0 (20 Oct 2026)**. Each entry gives a status, the evidence and what to do about it. Numbers are measured, not guessed. `npm run probe` reproduces the overlap and flood-timing figures, and the browser measurements are described in [APPROACH_AND_METHOD.md](APPROACH_AND_METHOD.md#7-measuring-instead-of-assuming).

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
| 60 | [The four new guides rest on news reports quoting the agencies](#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies) | Owner | **Medium (review before posting widely)** |
| 47 | [The season calendar is editorial](#47-the-season-calendar-is-editorial) | By design | — |
| 48 | [Haze, smoke and the dark are untested on low-end phones](#48-haze-smoke-and-the-dark-are-untested-on-low-end-phones) | Owner | Low |
| 49 | [Dust, fire and the power cut use the flood house](#49-dust-fire-and-the-power-cut-use-the-flood-house) | By design | — |
| 50 | [The v1.5.1 service worker reloads open pages once](#50-the-v151-service-worker-reloads-open-pages-once) | By design | — |
| 51 | [The wordmark's coral half is low contrast](#51-the-wordmarks-coral-half-is-low-contrast) | By design | — |
| 52 | [A `?mode=` link previews as the main game](#52-a-mode-link-previews-as-the-main-game) | By design | — |
| 53 | [The smoke test runs on a pinned date](#53-the-smoke-test-runs-on-a-pinned-date) | By design | — |
| 54 | [Carousel images are committed and Thai only](#54-carousel-images-are-committed-and-thai-only) | By design | — |
| 59 | [The home check's code is counted in the start-screen budget and precached](#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached) | By design | — |
| 61 | [The game card is below the first screen on small phones](#61-the-game-card-is-below-the-first-screen-on-small-phones) | By design | — |
| 62 | [Source notes are downloaded by every visitor](#62-source-notes-are-downloaded-by-every-visitor) | Open | Low |
| 63 | [Printing isn't offered in in-app browsers](#63-printing-isnt-offered-in-in-app-browsers) | Platform | — |
| 64 | [The alert must be cleared or renewed by hand](#64-the-alert-must-be-cleared-or-renewed-by-hand) | By design | — |
| 65 | [Loose ends from the v1.9.0 sweep](#65-loose-ends-from-the-v190-sweep) | Fixed in v1.9.0 | Low |
| 66 | [The right answer was usually the longest choice](#66-the-right-answer-was-usually-the-longest-choice) | Fixed in v1.9.2 (F83, F90); Owner: the Thai read of the new wrong answers | Low |
| 68 | [Link previews are small at chat size](#68-link-previews-are-small-at-chat-size) | Open (partly fixed in v1.9.2, F87) | Low |
| 69 | [Kept Thai words are a hand-made list](#69-kept-thai-words-are-a-hand-made-list) | By design | Low |
| 71 | [On a tablet the app is a narrow column](#71-on-a-tablet-the-app-is-a-narrow-column) | By design (v1.9.2) | — |
| 73 | [English choice sheets still scroll on the smallest phones](#73-english-choice-sheets-still-scroll-on-the-smallest-phones) | Open | Low |
| 74 | [The fridge hours rest on US guidance only](#74-the-fridge-hours-rest-on-us-guidance-only) | Owner (since v1.11.0 also the food lists, #79) | **Medium (review before posting `/fridge` widely)** |
| 75 | [The dust colours are for the 24-hour average; apps often show hourly readings](#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings) | Owner (the note is by design) | Low |
| 76 | [The PCD and the DOH advise differently at green, yellow and red](#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red) | By design (v1.10.0); Owner: the dust guide and dust today at orange (v1.11.0) | Low |
| 77 | [The fridge and dust tiles are below the first screen on the smallest phones](#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones) | By design (v1.10.0) | — |
| 78 | [A heat-index calculator is not built](#78-a-heat-index-calculator-is-not-built) | Not built (needs the owner first) | — |
| 79 | [The fridge's food lists rest on US charts](#79-the-fridges-food-lists-rest-on-us-charts) | Owner | **Medium (review before posting `/fridge` widely)** |
| 80 | [Insulin above 30 °C has no number](#80-insulin-above-30-c-has-no-number) | By design (v1.11.0); Owner: a pharmacist's read | Low |
| 81 | [Larger text (ก+) covers the start screen and the sheets only, and sizes ignore the phone's text setting](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting) | Open | Low |
| 82 | ["power: Bangkok area" stands for MEA's three provinces](#82-power-bangkok-area-stands-for-meas-three-provinces) | Owner (the English read) | Low |
| 83 | [Leftovers of visitor audit 3](#83-leftovers-of-visitor-audit-3) | Open (AI-ready, two owner decisions) | Low |
| 84 | [Ideas from the audience research not built yet](#84-ideas-from-the-audience-research-not-built-yet) | Not built (some need the owner) | — |

Fixed issues are listed [at the end](#fixed); #67, #70 and #72 were fixed in v1.9.2 ([F85, F86, F89](#in-v192-19-oct-2026)). v1.10.0 fixed one bug found in its own testing, never live ([F92](#in-v1100-19-oct-2026)). v1.10.1 fixed two that the owner reported from the live v1.10.0: the fridge tool was hard to understand, and its times read a minute off ([F93, F94](#in-v1101-19-oct-2026)), and one found while checking them: nine buttons left one alone on a wider screen ([F95](#in-v1101-19-oct-2026)). v1.11.0 fixed 30 findings of visitor audit 3, an older relative in LINE and a parent preparing at the weekend, among them the only blocker of both audits, the fridge tool telling people to throw away cold medicine such as insulin ([F96–F125](#in-v1110-20-oct-2026)), and two of its own found before release ([F126, F127](#in-v1110-20-oct-2026)), and one found while documenting it: the game's cold-medicine lesson still told players to discard cold medicine after a day, as the tool had ([F128](#in-v1110-20-oct-2026)); what the audit left is [#83](#83-leftovers-of-visitor-audit-3).

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
- whether a long-press on the installed app's icon offers the two shortcuts to the home check and the plan card (`manifest.webmanifest → shortcuts`, v1.8.1), and which phones show them **[unverified]**; since v1.9.0 there are three, with "ต้องทำอะไร เมื่อเกิดภัย"
- how the start screen's hub (v1.9.0) reads on a real phone: whether people see the three tools first and still find the game below, and whether the alert card is noticed
- whether "🖨️ พิมพ์เก็บไว้" prints a clean A4 list from Chrome and Safari on a phone, and whether the guide picker and the guide sheets work inside LINE (v1.9.0)
- since v1.9.1: whether the phone's back button closes a sheet inside LINE (and iOS's swipe back), whether sharing to LINE keeps the result in the game's tab, whether Thai words still break between words on an iPhone (its dictionary isn't ICU, [#69](#69-kept-thai-words-are-a-hand-made-list)), whether the fire smoke is drawn on a real 360 × 640 phone (F58 was found in headless Chromium), and whether a guide's ☎️ buttons dial; `/no-such-page` answering with the 404 page is checked on the live site after the deploy
- since v1.9.2: whether the phone's back button inside a round pauses it and on the result goes to the start screen, with the Android back gesture, iOS's swipe back and inside LINE (F85); whether the result card's line and link can be read in a real chat (F86); and whether a choice's three answers fit on a small phone without scrolling (F84, [#73](#73-english-choice-sheets-still-scroll-on-the-smallest-phones))
- since v1.10.0 and v1.10.1: whether the fridge's count goes on after LINE is closed, now started by tapping a time ("3 ชม."), with the "⏱️ ไฟดับมาแล้ว …" line and "💡 ไฟมาแล้ว" (F93); whether an older relative reads the cards and the dust tool's colour-first screen without help; and whether the number box behind "รู้ตัวเลข?" opens and shows the number keyboard inside LINE (rows 64–65)
- since v1.11.0 (rows 67–75): whether the fridge's food lists read clearly at 3 h and at 6 h on a real screen, and whether "💡 ไฟมาแล้ว" keeps the answer after LINE is closed; whether the "🕘 จำได้ว่าไฟดับตอนกี่โมง?" time box opens the phone's time picker inside LINE; the medicine and breast-milk ticks; whether "ก+" enlarges the start screen and the sheets inside LINE and on an iPhone (CSS `zoom`, [#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)); whether "📋 คัดลอกแผนเป็นข้อความ" and "🛒 คัดลอกรายการที่ยังขาด" put the text on the clipboard inside LINE; the named numbers on a guide and on its picture in a chat; dust today's at-risk lines with no ticks; and how long a Thai hazard page now is on a phone. The walk ran LINE's user agent in headless Chromium, which can't show any of these

**To do:** run the 75-row matrix in [06-test-checklist.md](06-test-checklist.md) on at least one cheap Android phone and one iPhone, inside LINE, Facebook and TikTok. Record the results in that file.

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

The home check (v1.8.0) has ⚠️ lines of its own, outside this count: they are things to have at home in `kit.json`, not lessons in `items.json` ([#57](#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)). So do the four guides with no game (v1.9.0): 5 of their 40 lines are ⚠️, in `checklists.json` ([#60](#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)).

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

On 19 Oct 2026 prd.go.th, the fallback for these reposts, refused automated readers too: a 301 and then a 404 to `curl`, and a 500 block page to headless Chromium, even for its home page ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)). Reposts already cited stay cited; a person checks them in a normal browser.

**Fix:** compare the items against the agencies' own infographics in a normal browser, or ask an agency contact.

### 10. Sources conflict on soaked mattresses

**Status:** Owner · **Severity:** Low

- กรมอนามัย says to clean and sun-dry bedding.
- A 2011 statement from กรมวิทยาศาสตร์การแพทย์ says soaked mattresses should be thrown away.

The mattress is **not in the game**. Decide which advice to follow, or ask กรมอนามัย, before adding it to the bedroom.

### 11. Thai and English copy need a second native reader

**Status:** Owner (the owner said on 11 Oct 2026 they will provide the language check) · **Severity:** Medium

The English text (`en`, `ogEn`, `seo.en`) was written alongside the Thai and has had no native-English review either. All Thai copy was written in one pass and checked against the guidelines: the tone, the 80-character tip limit and the guardrails. That covers tips, choices, feedback, the gecko's lines, rank titles and the share texts. A second native speaker should still read everything in `strings.json`, `items.json`, `checklists.json` and `kit.json` once, ideally an older family member who represents the forwarding audience.

The English is written in one variety, British ("torch", "power cut", "litres", "nappies"; [GUIDELINES rule 58](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). The v1.8.1 visitor audit found the power-cut lessons and the home check saying "flashlight" beside the flood lessons' "torch", and the home check saying both "house" and "home"; both were aligned ([F43, F44](#in-v181-19-oct-2026)). A native English reader should still read the tone.

v1.9.0 added much new copy in both languages: the hub and the guide picker, the four new guides' 40 lines, the new hazard pages and the `/kit` and `/plan` pages (`seo.<lang>`), the new link-preview texts and the rewritten tagline, About intro, default preview and `llmsSummary` ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).

v1.9.1 renamed the two tools (เช็กของจำเป็น, แผนครอบครัว; "Check your supplies", "Our family plan") and the flood guides ("น้ำท่วม: ก่อนน้ำมา", "น้ำท่วม: หลังน้ำลด"), rewrote the mode hazard pages' titles and intros, how-to step 4 in every mode, the heat guide's phase names and the guide sheet's labels ("ส่งต่อให้คนที่บ้าน", "เตรียมบ้านต่อ", "โทรฟรี", "เสร็จแล้ว"), and added the 404 page's text and `versusLoseFar`.

v1.9.2 rewrote 117 wrong answers in `items.json`, in Thai and English, so that the right answer is no longer given away by its length ([#66](#66-the-right-answer-was-usually-the-longest-choice), [F83](#in-v192-19-oct-2026)). They are new copy: the reader should check that each sounds like something a person would really say, and that its `feedback` still answers it.

v1.11.0 added the fridge's food lists (13 foods and 4 packs with Thai names of our own choosing, mapped to US chart rows), the insulin, other-medicine and breast-milk lines, the helplines' short names ("power: Bangkok area" for 1130 in English, [#82](#82-power-bangkok-area-stands-for-meas-three-provinces)), the sharing texts and copy buttons, the trust line, "ก+", the alert's "ช่วงนี้ถึง …" and new `/fridge` and `/air` texts; and the Thai pages lost their English twin lines, so a hazard page now reads in Thai alone ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).

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

- **Web Analytics** looks enabled since the v1.9.1 audit (19 Oct 2026): the HTML the live site serves to browsers carries Cloudflare's beacon (`static.cloudflareinsights.com`), with no `Set-Cookie`. The owner confirms it in the dashboard (Pages project → Metrics → Web Analytics), which the API token can't reach ([ROADMAP L1](ROADMAP.md#l1-create-the-cloudflare-pages-project)). Cloudflare also injects `/cdn-cgi/challenge-platform/scripts/jsd` (about 12 KB) on every page: that is the zone's "JavaScript detections" security setting, not our code. The owner may switch it off (Security → Bots) if nothing needs it.
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

Penalties (−4 s for a wrong answer, −2 s for the first tap on each decoy) move the round clock forward. In Prepare mode the water level comes from that clock, so it jumps with each penalty. This makes mistakes cost something in the fiction too (*"น้ำขึ้นไวขึ้น"*), and the score never punishes reading: the clock stops while a sheet is open. Since v1.9.1 the how-to says so in every mode ("นาฬิกาหยุดตอนอ่านตัวเลือก แต่น้ำขึ้นระหว่างที่มองหา แตะของที่ไม่เสี่ยงเสียเวลา 2 วิ"; before, it said not to worry about time at all), and the idle hint no longer rings decoys ([F77, F78](#in-v191-19-oct-2026)).

**The water curve changed in v1.9.1** ([F75](#in-v191-19-oct-2026)): the floor is wet at 36 s (was 27 s), and no target floods before 20 s with no penalties. Houses and challenge links are the same, but a Prepare score from v1.9.0 or earlier and one from v1.9.1 aren't strictly comparable: the new round gives more time before the water, and the critical bonus (before the floor is wet) is easier to get.

### 27. The build rewrites tracked files

**Status:** By design. Watch for it in commits.

`node tools/build.mjs` rewrites these files:

- `public/index.html` (its Open Graph block, canonical link and JSON-LD; since v1.9.0 its static Thai text, and since v1.9.1 the alert card)
- `public/learn.html`, `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`
- the hazard pages `public/flood.html`, `public/pm25.html`, `public/fire.html` (v1.6.0) and `public/ready.html` (v1.7.0)
- `public/posts.html` (v1.6.1)
- `public/404.html` (v1.9.1)
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

**The calculators (v1.10.0)** keep their answers the same way: `brm:fridge` (when the power went off, since v1.10.1 the time button tapped, the freezer answer, the cold-medicine tick) and `brm:air` (the kind of number and who is at home, never the reading). So a power cut counted in LINE's browser isn't counted in Chrome, and the other way round; a phone test should open `/fridge` from LINE, tap a time, close LINE and open the link again (row 64 of [06-test-checklist.md](06-test-checklist.md)). **Since v1.11.0** `brm:fridge` also keeps when "💡 ไฟมาแล้ว" was tapped (`end`, so the answer stays for a day) and the breast-milk tick (`{start, end, picked, freezer, med, milk}`), `brm:air` keeps only the kind of number (the ticks are gone, [F101](#in-v1110-20-oct-2026)), and `brm:big` keeps the larger-text choice ("ก+"). Each is per browser in the same way.

**What families keep is the picture.** The plan card says "เซฟไว้ในมือถือทุกคน และพิมพ์เก็บไว้กับเอกสารสำคัญ" (until v1.11.0 "…และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน", [F113](#in-v1110-20-oct-2026)): the saved or forwarded image is the copy that lasts, and since v1.11.0 "📋 คัดลอกแผนเป็นข้อความ" puts the plan on the clipboard as text for a chat where the picture can't be attached, and the household can make it again from any browser. Real-phone checks: rows 46–48 of [06-test-checklist.md](06-test-checklist.md).

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

The alert card of v1.9.0 (`config.json → alert`) is the third hand-set switch and follows the same rule ([#64](#64-the-alert-must-be-cleared-or-renewed-by-hand)).

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
| `s-opener`, `s-plugs`, `s-medcold` | Ready.gov only (`s-medcold` also the US FDA since v1.11.0, [F128](#in-v1110-20-oct-2026)) | ⚠️ |
| `s-candle` | The US Fire Administration and Ready.gov only | ⚠️ |

- **Why:** no Thai agency page on fridge food in a power cut, unplugging against surges, candles, a manual can opener or cold medicine was found. The international pages were read in full and quoted in each source's `note`. Each ⚠️ lesson's `verifyNote` says which part is international, and `/learn`, the hazard page and the carousel mark them as under review.
- **The fridge calculator (v1.10.0)** uses the same CDC hours and Ready.gov's day for cold medicine, flagged the same way ([#74](#74-the-fridge-hours-rest-on-us-guidance-only)); a Thai source for one is a Thai source for both.
- **What the game does with the numbers:** only the CDC's 4 hours drives play (`lostAfter: 4` on the fridge); the 48 hours keep the freezer safe through the 12-hour round. Numbers no agency shares are left out: the infographic's eating order, "check every 3–6 months" and the 7-day aim (Tokyo's alone).
- **Written for other countries.** The US and Tokyo pages were written for their own homes and services. The lessons keep to general actions with no foreign numbers or laws, and whether they fit Thai homes is what the Thai review should confirm.
- **What would make them Thai:** a person opening the PRD checklist page in a normal browser (3 L, the radio); MEA (กฟน.) or PEA (กฟภ.) advice on unplugging in a power cut; กรมอนามัย or อย. on fridge and freezer food; a Thai pharmacist or อย. on cold medicine; ปภ. wording on candles and on a can opener in a kit. Add the Thai source beside the international one and mark the lesson ✅ when it says the same. The steps are in [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons).
- **Until then,** 5 of the 8 lessons in the `ready` carousel set are ⚠️, and each of those images says "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน". Post that set knowing so ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)).
- **Source health (19 Oct 2026).** The PRD page behind `s-water` and `s-radio` (`prd-72h`, "เช็กลิสต์ถุงยังชีพ เพื่อการเอาตัวรอดใน 72 ชั่วโมงแรก (น้ำดื่มอย่างน้อย 3 ลิตร/คน/วัน)", also cited by `p-waterfood` and the home check, [#57](#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)) could not be read by any tool: `curl` got a 301 from `www.prd.go.th` to `prd.go.th` and then a 404, and headless Chromium a 500 block page, even for the site's home page. So prd.go.th blocks automated readers, and whether the page still exists is unknown. A search engine's index still shows the page with the 3-litre line. Nothing was changed: the owner opens the link in a normal browser in Thailand. If it is gone, look for the same checklist on another PRD or ปภ. page and replace the source; the 3 L would otherwise rest on its title alone ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 57. The home check and plan card rest partly on international guidance

**Status:** Owner · **Severity:** Medium: review before promoting the check widely

The home check (v1.8.0, `kit.json`) lists 15 things a household may need; 9 of them are ⚠️ `partial`, and the list says so next to their sources (since v1.9.1 a ⚠️ there and one footnote under the list, instead of "ข้อนี้อยู่ระหว่างตรวจทาน" on every such line). They rest on the same pages as the power-cut lessons:

| Kit items | What they rest on | Why ⚠️ |
|---|---|---|
| `water` (3 L × people × 3 days), `radio` | กรมประชาสัมพันธ์'s 72-hour checklist (`prd-72h`, the 3 L is in its title; the page refuses automated reading), ปภ.'s 3–4 days (`ddpm-amarin`), Ready.gov for the radio | As `s-water` and `s-radio` ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)) |
| `opener`, `cash`, `baby` (formula, bottles, nappies), `glasses` | Ready.gov "Build A Kit" only (`readygov-kit`) | International only. The source's `note` quotes the basic kit (water, food, a can opener, a flashlight, a radio, batteries). Cash, glasses and baby supplies are on the same page's "Additional Emergency Supplies" list ("Cash or traveler's checks", "Prescription eyeglasses and contact lens solution", "Infant formula, bottles, diapers, wipes and diaper rash cream"), read again on 19 Oct 2026 and quoted in the `note` since v1.8.0 |
| `medcold`, `device` | Ready.gov "Power Outages" only (`readygov-outage`) | International only, as `s-medcold` |
| `meds` (at least 7 days) | The MOPH's 2013 statement via news (`moph-7days`), ปภ.'s kit (`ddpm-6kit`) | The 7 days are from 2013, as `p-meds` |

The 6 ✅ items rest on Thai agencies, some cross-checked with Ready.gov: food for 3 days (กรมอนามัย, ปภ., the MOPH), a torch each (ปภ.; "every household member" is Ready.gov's), charged phones and a power bank, the first aid kit and the documents in a waterproof bag (ปภ.), and the pet's food and carrier or leash (ปภ., กรมอนามัย).

**The plan card:** the hints of the meeting place and the contact rest on Ready.gov "Make A Plan" alone (`readygov-plan`, added in v1.8.0); no Thai agency page on a family meeting place or a contact plan was found on 19 Oct 2026. Both say ⚠️ on the form. The medicine hint (7 days) is ⚠️ as above. The shelter and "who helps whom" hints are Thai (กรมประชาสัมพันธ์, ปภ., กรมอนามัย), and the second "who helps whom" has no hint.

- **Not in the safety table.** [01-safety-content.md](01-safety-content.md) is generated from `items.json`, so the kit's ⚠️ lines are not among #8's 21 (its source list does count the kit's and the plan card's citations). [KNOWLEDGE §28.3](KNOWLEDGE.md#283-the-list-amounts-and-sources) lists every kit line with its sources.
- **What would make them Thai:** the same reviews as [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons) (the PRD page in a normal browser, กรมอนามัย or อย. on cold medicine), plus ปภ. wording on a family meeting place and keeping cash at home, and กรมอนามัย on supplies for small children.
- **The kit's Thai and English wording** has had no native-speaker reading ([#11](#11-thai-and-english-copy-need-a-second-native-reader)).
- **The water line's source could not be read on 19 Oct 2026.** `water` (3 L × people × 3 days) and `radio` cite the PRD 72-hour checklist (`prd-72h`), which answered every automated reader with a 404 or a block page; whether it still exists is unknown until a person opens it ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance), source health). The build's number check still passes, because the 3 is in the source's title as recorded in `sources.json`.
- **Since v1.8.1 the check also names floods** ("ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน"): its 3-day amounts come from the same flood-era Thai sources, and `/flood` links it. The ⚠️ lines are the same.

### 47. The season calendar is editorial

**Status:** By design

`config.modes[].months` (dust December–March, fire April, flood May–November; the power cut, v1.7.0, has none) was chosen by us from the general pattern (Bangkok's dust peaks December–February and the North's February–April; dry, windy months raise fire risk). No Thai agency publishes a month-by-month hazard calendar that we could find **[unverified]**. The North's dust season runs later than Bangkok's, so a northern player in April sees fire recommended, not dust. The owner can change the months, and `rainWarningActive` still overrides them until `rainWarningUntil` (now 30 Nov 2026).

The south floods later, in the November–January monsoon. The model has one calendar for the whole country, so it doesn't cover that: once the rain switch ends on 30 Nov, the start screen recommends dust from December. Campaigns for the south use `/?mode=prepare`, which opens the game on flood preparation whatever the date, or `/flood`, the flood lessons with play buttons. Extending `rainWarningUntil` instead would change the start screen for the whole country.

**The power cut is year-round, never the default.** Its `months` is empty, so `seasonalMode()` never picks it, and the start screen never recommends it by itself; it is always one of the small cards. People reach it through its card, `/?mode=stock`, the `/ready` page and posts. Power cuts and storms don't follow a calendar we could source, so a post after a planned cut or a storm is the way to feature it ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)). For a week, `featuredTopic: "food"` with an end date puts the 💧 water-and-food topic on the start screen (6 of its 10 lessons are power-cut lessons since v1.7.0).

**Hazards with a guide and no game (v1.9.0)** have no season either: flash floods and landslides, storms, earthquakes and extreme heat are brought forward by the owner's alert, which puts one guide on top of the start screen until an end date ([#64](#64-the-alert-must-be-cleared-or-renewed-by-hand)), not by `months`.

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

The home check and the plan card work the same way (v1.8.0): `/?open=kit` and `/?open=plan` preview as the main game. This still holds in v1.8.1, so a post that links `/?open=kit` or `/?open=plan` ([04-launch-kit](04-launch-kit.md)) shows the game's default preview: post it with the picture of a kit or plan card, or link `/ready` or `/flood` (v1.8.1), whose pages link both and have previews of their own. The app's shortcuts (v1.8.1) open the same links but show no preview.

**Since v1.9.0** the home check and the plan card have pages of their own, `/kit` and `/plan` (`/en/…`), with their own previews (`og/kit.png`, `og/plan.png`) and a button into the tool; the kit and plan cards print and link these addresses. Post `/kit` or `/plan`, not `/?open=kit` or `/?open=plan`. The guide picker's link, **`/?open=guide`, still previews as the main game**: in a post, link one guide's `/checklist/<id>` (its preview is that guide's picture and title) or its hazard page (`/quake`, `/heat`…) instead. The app's third shortcut opens `/?open=guide` but shows no preview.

**Still true in v1.9.1** (the audit checked it again): `/?open=kit`, `/?open=plan` and `/?open=guide` preview as the start screen. The owner's posts in [04-launch-kit](04-launch-kit.md#the-home-check-and-the-plan-card-v180-any-time-of-year) now link `/kit` and `/plan` and use the tools' new names ([#68](#68-link-previews-are-small-at-chat-size)).

**When the preview matters,** share the hazard page instead: `/pm25`, `/fire`, `/flood` or `/ready` (or `/en/…`). Each has its own title, description and the hazard's checklist image, and its ▶ button opens `/?mode=<id>`. Use the `?mode=` link where the post already carries a picture, or next to the hazard page ([04-launch-kit](04-launch-kit.md#when-the-dust-season-starts-v150-from-december)).

### 53. The smoke test runs on a pinned date

**Status:** By design (tooling)

`npm run smoke` plays on a fixed Bangkok day, `SMOKE_DATE` (default `2026-10-18`), and takes what the start screen should show from `recommend()`. So it passes on any real date, and it can't catch a problem that depends on today's date, such as a switch whose end date has passed or a season that starts tomorrow.

- **Today's state shows in the build,** not the smoke test: `node tools/build.mjs` prints a `start` line (what visitors see today, and since v1.9.0 the alert while it is on) and warns about a switch with no end date or a past one. Read it after every release and at the start of each month.
- **The alert (v1.9.0)** is expected from `activeAlert()` on `SMOKE_DATE`, like the mode from `recommend()`: on 18 Oct 2026 the card shows the landslide guide, on 5 Dec 2026 it is hidden. A separate check forces an alert (`storm`, until 2099) by changing the `config.json` the test server sends to that page only, so the card is tested whatever the shipped date.
- **To test another season,** run `SMOKE_DATE=2026-12-05 npm run smoke` (dust) or `SMOKE_DATE=2027-04-10 npm run smoke` (fire); both passed 79/79 on 18 Oct 2026, 134/134 on 19 Oct 2026 (v1.9.1) and 138/138 (v1.9.2).
- **The test server answers like Pages** since v1.9.1: an unknown address gets `404.html` with status 404, so the 404 page can be checked before a deploy.
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

`kit.js` (about 5.5 KB compressed, 5.8 KB since v1.9.0 added printing) and `kitplan.js` (0.8 KB) load only when the check or the plan card opens (`import('./kit.js')` in `main.js`), and `kit.json` (about 4.3 KB) is fetched then.

- **The budget counts them anyway.** The build sums every file in `public/js/` as start-screen weight, so its `budget` line (208 KB in v1.8.0, 232 KB in v1.9.0, 240 KB in v1.9.1) counts about 6.6 KB that a first visit doesn't fetch before the start screen. The limit is 500 KB, so the build errs on the safe side; `kit.json` isn't counted.
- **The service worker downloads them after the page has loaded.** All three are in the precache (44 files), so a visitor whose browser runs the service worker gets about 10.5 KB more in the background, whether or not they open the check; in return the check works offline after the first visit.
- **Without the files,** offline in a browser with no service worker (the iOS in-app browsers, [#16](#16-no-offline-play-inside-ios-in-app-browsers)) or before the precache finished, the button shows the toast "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`) and the game carries on.

If the check grows, measure it on its own (`gzip -9` of the files) rather than through the budget line.

- **v1.10.0:** the calculators (the fridge, dust today, the pills) live in the same files, so they load and are precached the same way. `kit.js` is now 11.0 KB compressed and `kitplan.js` 1.9 KB, about 12.9 KB the budget counts as start-screen weight (253 KB in v1.10.0); `kit.json` is 9.1 KB ([KNOWLEDGE §32.9](KNOWLEDGE.md#329-budget-and-code)). v1.10.1's plain-words pass made `kit.js` 11.4 KB (254 KB on the start screen). If the calculators keep growing, give them a file of their own, loaded only when one opens.
- **v1.11.0:** food by food, the medicine and breast-milk cards and the copy buttons made `kit.js` 13.1 KB with `gzip -9` (43.4 KB raw) and `kitplan.js` 2.5 KB; `kit.json`, fetched only when a tool opens and not counted, is 13.0 KB (61.9 KB raw, 9.1 KB before). The budget line says 264 KB for the start screen; the two tool files are about 2.4 KB of its 10 KB growth ([KNOWLEDGE §33.15](KNOWLEDGE.md#3315-budget-code-and-content)). The case for a file of their own is stronger, but it is still far under 500 KB.

### 60. The four new guides rest on news reports quoting the agencies

**Status:** Owner · **Severity:** Medium: review before posting the guides widely

The four guides with no game (v1.9.0: น้ำป่า ดินถล่ม, พายุ ลมแรง ฟ้าผ่า, แผ่นดินไหว, อากาศร้อนจัด) have 40 lines: 35 ✅ and 5 ⚠️. Every line has a source, but the Thai agencies were read through Thai news reports that quote them (`kind: secondary`), because the agency sites refuse automated access ([#9](#9-agency-websites-blocked-automated-checks)). Of the 36 sources added for them, 27 are such news reports, 1 is an agency paper (TMD's tsunami paper, `tmd-tsunami`) and 8 are international pages used to cross-check; the storm guide's line on fallen power lines also cites the PEA, MEA and TMD pages already in `sources.json`.

| Guide | ✅ / ⚠️ | The ⚠️ lines, and why |
|---|---|---|
| น้ำป่า ดินถล่ม (`landslide`) | 7 / 3 | #1 "check if your home is by a slope or stream at risk": กรมทรัพยากรธรณี lists what a risk village looks like (2022 data) but no text read says "check your own home"; #9 "never cross a road with water or mud flowing over it" and the core of #10 "keep away from the slide until officials say it's safe": Ready.gov only, no Thai text found |
| พายุ ลมแรง ฟ้าผ่า (`storm`) | 9 / 1 | #10 "after the storm, check electrics and repair any damage": กฟน. asks people to check their electrics and repair damage as storm-season advice; tying it to "after the storm" is ours |
| แผ่นดินไหว (`quake`) | 9 / 1 | #6 "by the sea: a quake or a sudden ebb? Go to high ground": กรมทรัพยากรธรณี says move away from the shore in a quake; the sudden ebb as a signal is read from TMD's technical paper, an inference. The `verifyNote` keeps a fully verified fallback: "อยู่ชายหาดแล้วแผ่นดินไหว รีบออกห่างฝั่ง" |
| อากาศร้อนจัด (`heat`) | 10 / 0 | — |

- **Dates.** Several reports are older (ปภ. on storms 2018, กรมทรัพยากรธรณี's risk villages 2022, กรมอนามัย on elders and water 2022) or show no date on the page; each `note` says so.
- **What would close it:** a person opens the agency pages (or asks an agency contact) and confirms each line, as for the dust and fire lessons ([#46](#46-dust-and-fire-advice-is-quoted-through-news-reports)); a Thai source for the three Ready.gov-only landslide points; and ปภ. or กรมทรัพยากรธรณี wording on the sea pulling back before a tsunami. Steps: [ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons).
- **Labelled by agency, read through the news.** The v1.9.1 audit noticed that in `llms.txt` most of the earthquake guide's source links are news reports, while the page names the agency they quote. That is how these sources are recorded (`agency` is who is quoted, `kind: secondary`), and it is why this review is open; nothing was changed.
- **Not in the safety table.** [01-safety-content.md](01-safety-content.md) is generated from `items.json`; the guides' lines are in `checklists.json`, and [KNOWLEDGE §29.3](KNOWLEDGE.md#293-the-four-new-guides-and-their-sources) lists them with their sources. What was left out because sources disagree is in [§29.4](KNOWLEDGE.md#294-what-was-left-out-and-why).

### 61. The game card is below the first screen on small phones

**Status:** By design (v1.9.0)

The start screen now puts the alert card and the three tools above the game. Measured on 18–19 Oct 2026: the three tools are on the first screen at 320 × 460 (their bottoms at 324, 420 and 420 px), 360 × 640 (327, 407 and 407 px), 390 × 844 and 768 × 1024, and the smoke test checks the first two. The recommended game card is no longer on the first screen at 320 × 460 and 360 × 640: a player scrolls past "🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน" and the gecko to reach it.

- **Why it stays:** the owner's direction is tools first, and the game is optional ([KNOWLEDGE §29.1](KNOWLEDGE.md#291-why-tools-first)). v1.5.2's rule that the next step is on the first screen ([GUIDELINES rule 49](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) now applies to the tools.
- **Where the game is still first:** a friend's challenge link hides the hub, the label and the alert, so "รับคำท้า!" stays on the first screen at 320 × 460; a `?mode=` link still makes its mode the big card (below the tools); ▶ in a guide and the hazard pages' ▶ buttons start or open the game directly.
- **Watch:** `mode_select` and `round_start` per day before and after v1.9.0 ([05-metrics](05-metrics.md#tools-first-v190)). If plays fall and the tools aren't used either, revisit the order with the owner.

### 62. Source notes are downloaded by every visitor

**Status:** Open · **Severity:** Low

`sources.json` holds each source's `note`: what was read and quoted, for reviewers, the build and docs/01. The game never shows a note, but `content.js` loads the whole file before the start screen. The 36 sources of v1.9.0 have long notes, so `sources.json` grew from 12.0 to 23.8 KB compressed; about 14 KB of it is notes (about 9.6 KB from the new ones). That is most of the start screen's growth from 209 to 232 KB (the rest: the guides in `checklists.json`, +4.1 KB; new strings, +4.2 KB; code and CSS, about +3 KB).

- **The fix,** AI-ready: keep the notes out of what the client loads, for example in a second file the build, `npm run docs` and the tests read (or the build writes a slim `sources.json` without notes for `public/`), and let `content.js` load only `agency`, `title`, `url`, `date` and `kind` ([ROADMAP N18](ROADMAP.md#n18-keep-source-notes-out-of-what-the-game-loads)). Keep one file to edit by hand, so a source can't drift from its note.
- **Not urgent:** 232 KB (240 KB in v1.9.1, with the hub's text, the guide sheet and the `keepTogether` list; 243 KB in v1.9.2; 253 KB in v1.10.0, with the calculators' code; 254 KB in v1.10.1; 264 KB in v1.11.0) is far under the 500 KB limit. v1.10.0 added three sources with notes (dust today). **v1.11.0 added seven,** each with the page's own words quoted in its note for the reviewer (FoodSafety.gov's whole chart, the FDA on insulin, the CDC on breast milk): `sources.json` went from 25.2 to 30.5 KB compressed, about half of the start screen's 10 KB growth, and every visitor downloads it for notes the app never shows. N18 is worth doing before the next source-heavy release. It is a rule-53 case ([GUIDELINES](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)): what the game never uses shouldn't be in what it loads.

### 63. Printing isn't offered in in-app browsers

**Status:** Platform

"🖨️ พิมพ์เก็บไว้" (v1.9.0) prints a guide or the home check's list as a plain A4 list. The LINE, Facebook, Instagram and TikTok in-app browsers have no print, so the button isn't shown there (`canPrint()` in `ui.js`: `window.print` exists and `inAppBrowser()` is false). In those apps, people save the guide's picture instead, or open the link in the phone's browser (LINE's "เปิดในเบราว์เซอร์"). The print layout was checked as a PDF in headless Chromium (10 boxes, ⚠️ on lines under review, the app hidden); printing from Chrome and Safari on a real phone hasn't been tried **[unverified]** ([06-test-checklist](06-test-checklist.md) row 53).

### 64. The alert must be cleared or renewed by hand

**Status:** By design (v1.9.0)

`config.json → alert: { guide, until }` puts one guide at the top of the start screen and first in the picker. It is set by the owner, never from the news: on 19 Oct 2026, `landslide` until `2026-10-25`, for ปภ.'s warning of heavy rain, flash floods and mudslides on 18–25 Oct (reported by Thairath on 18 Oct 2026).

- **It ends by itself.** `activeAlert()` shows it while today's Bangkok date is on or before `until`, that day included, and never without an end date; the build stops on a date that isn't real.
- **After the date, it stays in the file.** The card is gone, but the build warns ("alert.until … has passed, so the alert is off; clear it or give a new end date") on every build until the owner sets `"alert": { "guide": null, "until": null }` or a new date. On 26 Oct 2026 the warning appears.
- **Written into the page since v1.9.1.** The build puts the card into `index.html` and every page copied from it while the alert is on, so it no longer appears late and pushes the hub down ([F70](#in-v191-19-oct-2026)). After `until` the script hides it the next day even if no build has run, and the next build leaves it out.
- **One at a time.** Only one guide can be on top. When two things are in the news, pick the more urgent and post the other's `/checklist/<id>` link ([04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook)).

### 65. Loose ends from the v1.9.0 sweep

**Status:** Fixed in v1.9.0, before release · **Severity:** Low

Found while documenting v1.9.0, after its first checks had passed, and fixed in the same release (the build, `npm test` 29/29 and the smoke run were repeated afterwards):

- **The index JSON-LD `about`** (in `tools/build.mjs`) listed four hazards; it now lists all eight, in Thai and English (adds flash floods and landslides, storms and lightning, earthquakes, extreme heat). [GUIDELINES rule 59](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).
- **Five older icons newer than Unicode 11** ([GUIDELINES rule 64](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) were replaced: 🪟 → 🚪 (the `dust` checklist's line 2), 🩺 → 🏥 (`dust` line 9), 🧊 → ❄️ (`stock` line 8) in `checklists.json`; 🩹 → ⛑️ (`firstaid`) and 🧊 → ❄️ (`medcold`) in `kit.json`. A scan of every content file, `index.html`, `main.js`, `kit.js`, `build.mjs` and the manifest found no other emoji newer than Unicode 11. The pictures draw sprites, not these icons, so no image changed.
- **docs/01's reference list** marked the guides' sources "not cited yet": `npm run docs` now counts the citations in `checklists.json` too.
- **Texts that called the whole app a game:** `ogEn.siteName` is now "Baan Rod Mai? Home safety" and `aboutTitle` "เกี่ยวกับบ้านรอดไหม?" / "About Baan Rod Mai?".

### 66. The right answer was usually the longest choice

**Status:** Fixed in v1.9.2 ([F83, F90](#in-v192-19-oct-2026)); Owner: the Thai read of the new wrong answers · **Severity:** Low

The v1.9.1 audit found the right answer strictly the longest choice in most sets (recounted for v1.9.2: 71 of 82 in Thai, 73 of 82 in English), so it could be picked without reading. v1.9.2 rewrote 117 wrong answers so that each gives the reason a real person would give for that mistake; the right answer is now the longest in 17 of 82 sets in Thai and 16 in English, and a unit test keeps it between 10 and 33 % ([KNOWLEDGE §31.1](KNOWLEDGE.md#311-wrong-answers-that-dont-give-the-right-one-away)).

- **Left for the owner:** the new wrong answers are new Thai copy. A native reader checks that each sounds like what a person would say and that its `feedback` still answers it ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy), [#11](#11-thai-and-english-copy-need-a-second-native-reader)). Rewriting one keeps it within 60 Thai letters or 80 English characters and keeps the length test passing ([GUIDELINES rule 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **The icons, too (F90).** The audit also found that in 26 items the right answer was the only choice with a different icon. Each button drew an icon for its `kind`; in 42 of the 82 sets one answer's icon was the odd one out, and it was the right one in 26 (in 24 of those the two wrong answers shared the clock of `leave`). Since v1.9.2 the buttons show ก ข ค (A B C in English) instead, and `kind` is no longer drawn.

### 68. Link previews are small at chat size

**Status:** Open (partly fixed in v1.9.2) · **Severity:** Low

At the 260 px a chat shows them, the 1200 × 630 previews' helpline line is about 6 px. `/?open=kit`, `/?open=plan` and `/?open=guide` still preview as the start screen ([#52](#52-a-mode-link-previews-as-the-main-game)): share `/kit`, `/plan` or a `/checklist/<id>`. Found in the v1.9.1 audit.

- **Fixed in v1.9.2:** the four guides with no game drew the gecko with nothing on, so their pictures looked alike in a chat. Now the gecko wears a hard hat (landslide, earthquake), the rain hood (storm) or a sun hat (heat) ([F87](#in-v192-19-oct-2026), [KNOWLEDGE §31.4](KNOWLEDGE.md#314-a-prop-for-every-guide-picture)).
- **Still open:** the helpline line, and the `/?open=…` previews (by design, [#52](#52-a-mode-link-previews-as-the-main-game)). Larger helplines would need a new preview layout and a re-render of every preview image, in both languages; check them at 260 px before and after.

### 69. Kept Thai words are a hand-made list

**Status:** By design (v1.9.1) · **Severity:** Low

The browser's Thai dictionary decides where a Thai line may break, and it splits some compounds ("กระ|จก", "ไฟ|ดับ"). Since v1.9.1 the 217 words in `config.json → keepTogether` are wrapped in a no-wrap span wherever Thai is shown ([KNOWLEDGE §30.1](KNOWLEDGE.md#301-thai-words-that-must-not-break-keeptogether)).

- **New text may need new words.** The list was made from the content's word pairs on 19 Oct 2026. After adding Thai text, look at it at 320 and 360 px (or make a wrap dump of the new lines) and add any word that breaks; the build warns about a listed word that appears in no Thai text.
- **iPhones may break differently.** iOS uses its own dictionary (CoreFoundation), not ICU, so its breaks may differ from Chromium's and Node's. Not tried on a phone **[unverified]** ([06-test-checklist](06-test-checklist.md) row 57).
- **Keep words short.** The build allows 2–14 letters: a long glued run could stop a narrow line from breaking at all.

### 71. On a tablet the app is a narrow column

**Status:** By design (v1.9.2)

At 768 × 1024 the start screen, the sheets and the round are a 480 px column with wide margins. Everything works and the tools are on the first screen, but the space isn't used. Found in the v1.9.1 audit and looked at again for v1.9.2, then kept:

- **The audience is on phones.** People arrive from LINE and Facebook chats on their phones, and there is no data on tablet visits yet.
- **A second layout doubles the checking.** Every screen, sheet and card would need screenshots and checks at a second size, for little gain.
- **Revisit** if Web Analytics shows tablet visits ([05-metrics](05-metrics.md#answers-back-button-and-card-v192)).

### 73. English choice sheets still scroll on the smallest phones

**Status:** Open · **Severity:** Low

Since v1.9.2 a choice's three answers fit without scrolling on phones up to 640 px tall in Thai ([F84](#in-v192-19-oct-2026)). English is longer: at 320 × 568, 20 of 82 English choice sheets still scroll, by up to 78 px; the worst is `p-meds`, whose right answer is 82 characters. On the live v1.9.1 it was 42 of 82, by up to 78 px. At 360 × 640 and 390 × 844 no sheet scrolls in either language. Measured with a scratch probe that filled the real sheet with every item's labels ([KNOWLEDGE §31.7](KNOWLEDGE.md#317-choice-sheets-on-short-screens)).

- **Why it is low:** the sheet scrolls normally and the shadow at its bottom shows there is more (F79); the clock is stopped while a sheet is open.
- **What would fix it:** shorter English right answers where the source allows it, read by a native English reader ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)), or a smaller picture in the sheet at that size. Don't shorten a sourced right answer just to save a line ([GUIDELINES rule 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)); measure with the same probe before and after.

### 74. The fridge hours rest on US guidance only

**Status:** Owner · **Severity:** Medium: review before posting `/fridge` widely

The fridge calculator (v1.10.0, `/fridge`) works out how long food keeps in a power cut from the US CDC's hours (4 h for a closed fridge, 48 h for a full freezer, 24 h for a half-full one) and Ready.gov's day for medicine that must be kept cold. No Thai agency page on food in a fridge during a power cut was found: not on 18 Oct 2026, for the power-cut lessons ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)), and not again on 19 Oct 2026 after two targeted searches (กรมอนามัย, อย., กรมวิทยาศาสตร์การแพทย์, PEA, MEA). What did come up was a media article with no agency named (not usable) and a Thai-language leaflet from the health department of Victoria, Australia (foreign advice) ([KNOWLEDGE §32.8](KNOWLEDGE.md#328-research-record-19-oct-2026)).

- **What the tool does about it:** all three parts are ⚠️ `partial`; at the bottom of the tool, once (since v1.10.1; under every line before), it says "⚠️ ตัวเลขชั่วโมงมาจาก CDC และ Ready.gov ของสหรัฐฯ ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานไทย" and names every agency it cites; the text it shares names the two agencies with ⚠️; `/fridge` lists each figure with its source. Only the line on cans is Thai (อย., กรมอนามัย) and ✅.
- **Written for American homes.** Whether the hours fit Thai kitchens (warmer rooms, fridges opened often) is what the Thai review should confirm. The tool adds no margin of its own: each status comes from the exact hours, and the time shown reads "about" (ราว), to the nearest minute and in whole hours from 3 hours ([GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Cold medicine** followed Ready.gov's "more than a day … unless the label says otherwise" and, past a day, said "Ready.gov แนะให้ทิ้ง" for any cold medicine, insulin included. That was the blocker of the v1.11.0 audit ([F96](#in-v1110-20-oct-2026)): insulin now has its own card (28 days at 15–30 °C, the US FDA, with Siriraj Hospital's leaflet agreeing), and other cold medicine says "🔎 เกิน 1 วันแล้ว ดูฉลากก่อนใช้" and "ask a pharmacist; don't throw away what you can't do without" (the FDA). A Thai pharmacist or อย. should still read the wording ([#80](#80-insulin-above-30-c-has-no-number)); the game's lesson `s-medcold`, which quoted Ready.gov's "discard" too, was reworded in the same release ([F128](#in-v1110-20-oct-2026)).
- **Since v1.11.0 the tool says what to throw out, food by food** ([KNOWLEDGE §33.2](KNOWLEDGE.md#332-the-fridge-food-by-food-the-model-and-the-content)), from FoodSafety.gov's chart and USDA FSIS's list, both American ([#79](#79-the-fridges-food-lists-rest-on-us-charts)). The research of 20 Oct 2026 looked again for Thai per-food advice (Siriraj, Mahidol, the DOH through the news) and found none; the UK Food Standards Agency and Food Standards Scotland give the same 4, 48 and 24 hours, as estimates, and say a hot room or a door opened often shortens them, with no number, which the tool now says in one line ("🌡️ ห้องร้อนหรือเปิดตู้บ่อย ของจะอยู่ได้สั้นกว่าเวลาข้างบน"). The note at the bottom now reads "⚠️ เวลาและรายการมาจากหน่วยงานสหรัฐฯ (CDC, FoodSafety.gov, USDA, FDA) เรื่องอินซูลินตรงกับโรงพยาบาลศิริราช ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานรัฐของไทย". An unanswered freezer counts as half full, 24 h, the shorter time ([F97](#in-v1110-20-oct-2026)). The only Thai source added is the Siriraj nursing leaflet on insulin (`siriraj-insulin`, `academic`), a university hospital, not a ministry.
- **The pills calculator** in the home check uses its 7 days, the MOPH's 2013 figure, ⚠️ as before ([#57](#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)).
- **What would make it Thai:** กรมอนามัย or อย. on fridge and freezer food in a power cut, and on cold medicine. Add the Thai source beside the CDC's in `kit.json → fridge.parts[].sources` (the build checks that the hours are in it) and mark the part ✅ if it says the same. If it gives other hours, the owner decides, and the lessons `s-fridge` and `s-freezer` change with the tool, so the game and the tool keep agreeing ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).
- **The owner's decision:** keep the international hours, flagged as they are, or hold `/fridge` back from posts until a Thai source is found. Since v1.11.0 the same decision covers the food lists (#79). Frankly: the tool is now far more useful in a cut, and its whole answer is still American advice read for a Thai kitchen.

### 75. The dust colours are for the 24-hour average; apps often show hourly readings

**Status:** Owner (the note is by design) · **Severity:** Low

The PCD's notice defines its colours on the continuous 24-hour average of PM2.5, to one decimal (clause 4.1(1)), and dust today places a reading with those bands. Many apps also show the last hour's reading, which in a morning or an evening can be well above or below the 24-hour average, and so a different colour.

- **What the tool does:** since v1.10.1 it asks for the colour the app shows first, so most people never type a reading; behind "รู้ตัวเลข?", under the number field, it says "… สีตามเกณฑ์ใช้ค่าเฉลี่ย 24 ชั่วโมง" ("The colours are for the 24-hour average"; until v1.10.1 "สีของกรมควบคุมมลพิษใช้ค่าเฉลี่ย 24 ชั่วโมง", under a field shown first). It doesn't ask whether a reading is hourly or a 24-hour average, because few people know. Whether an app's colour for an hourly reading is the notice's colour is part of the question below.
- **[unverified]:** whether Air4Thai colours its hourly readings with the same bands. air4thai.pcd.go.th couldn't be opened on 19 Oct 2026 (its TLS certificate chain couldn't be verified, and checking wasn't turned off). A person opens Air4Thai, the app and the site, notes whether it shows hourly and 24-hour values and how it colours each, and the tool's note is changed if it needs to be ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).
- **A foreign AQI** (the US AQI in many weather apps) has other bands; the tool asks for the PM2.5 number instead ([GUIDELINES rule 79](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### 76. The PCD and the DOH advise differently at green, yellow and red

**Status:** By design (v1.10.0)

The PCD's notice (2023) and the DOH's advice (21 Oct 2023) give the same five bands but different advice. At green, people at risk "watch for symptoms" (PCD) or "avoid outdoor activity or exercise" (DOH); at yellow, everyone "spends less time on hard outdoor activity" (PCD) or "avoids outdoor activity" (DOH); at red, people with a chronic illness (PCD) or everyone (DOH) stay in a safe, dust-free room. The DOH is stricter at the lower levels ([KNOWLEDGE §32.3](KNOWLEDGE.md#323-dust-today)).

- **The decision:** the notice is the main text. It is the legal notice, the one Air4Thai follows, and it separates the general public from the people at risk. Two DOH lines are added where they add something the notice lacks (at orange, medicine and equipment ready for a long-term illness; at red, a dust-free room for everyone), each named "(กรมอนามัย)" on its line. The two sets' green and yellow lines are never mixed ([GUIDELINES rule 81](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **What a family sees:** at green and yellow the tool reads milder than a DOH post. That is the notice's wording, said with its source, not a choice to play the dust down.
- **Revisit** if the PCD issues a new notice or the two agencies publish one set, or if the Thai reviewer prefers the DOH's stricter lines at green and yellow: then add them, named, beside the notice's ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).
- **The guide and the tool at orange (v1.11.0, audit finding B8).** The dust guide says "วันฝุ่นเกินมาตรฐาน งดออกกำลังกายกลางแจ้ง" (on days over the standard, stop exercising outdoors; the lesson `a-runshoes`, from the DOH), while dust today at orange, from the PCD's notice, tells everyone "ออกกำลังหนักๆ นอกบ้านให้สั้นลง" (keep hard exercise outdoors short), and only the people at risk "เลี่ยงการออกกำลังหนักๆ นอกบ้าน" (avoid it). Orange starts at 37.6 µg/m³, just over the 37.5 standard, so a family that opens the guide and then the tool on the same orange day reads "stop" and "keep it short". Both are sourced; they differ because the agencies do. Nothing was changed in v1.11.0. **The owner decides:** leave both, each with its agency; add a line under the tool's orange answer that the DOH advises no outdoor exercise on days over the standard, named, like the two DOH lines; or reword the guide's line. Whatever is chosen goes to the Thai reviewer ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).
- **Since v1.11.0 the at-risk lines are always shown** ([F101](#in-v1110-20-oct-2026)), so this difference is in front of every reader at orange, not only those who ticked someone at home.

### 77. The fridge and dust tiles are below the first screen on the smallest phones

**Status:** By design (v1.10.0)

The hub has five buttons since v1.10.0: "📋 ต้องทำอะไร เมื่อเกิดภัย", then a 2 × 2 grid of 🎒 เช็กของจำเป็น, 📝 แผนครอบครัว, 🥛 ไฟดับ: ตู้เย็น and 🌫️ ฝุ่นวันนี้ (😷 until v1.11.0, [F105](#in-v1110-20-oct-2026)). Since v1.11.0 a trust line, "🔒 ฟรี ไม่ต้องสมัคร ไม่ขอข้อมูลส่วนตัว", follows the tools, and "ก+" makes the start screen 15 % larger ([#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)), which pushes everything further down; the first three tools are still smoke-checked on the first screen at the normal size. At 320 × 460 the grid's second row, the two calculators, is below the first screen; the first three tools stay on it at 320 × 460 and 360 × 640, which the smoke test checks as it has since v1.9.0 ([#61](#61-the-game-card-is-below-the-first-screen-on-small-phones)).

- **Why it stays:** tools first ([GUIDELINES rule 61](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) puts what to do, what to keep and the family plan first. The calculators are for a moment (a power cut, a dusty day), and people will mostly reach them from a link or a guide.
- **The other ways in:** `/fridge` and `/air` (posts), `/?open=fridge` and `/?open=air`, the next steps in the power-cut, storm and dust guides, the power-cut and dust results, `/ready`, `/storm` and `/pm25`, and the installed app's shortcuts.
- **Watch:** `tool_open` by label ([05-metrics](05-metrics.md#calculators-v1100)). If the tools are opened from links but almost never from `start`, that is expected; if they are hardly opened at all, revisit the order with the owner.

### 78. A heat-index calculator is not built

**Status:** Not built (needs the owner first)

The next calculator the idea suggests is "heat today": the temperature and the humidity give the heat index, its level and what to do. The research of 19 Oct 2026 found the current Thai levels (watch 27.0–32.9, warning 33.0–41.9, danger 42.0–51.9, extreme danger 52.0 °C and over: the DOH and TMD scheme of 2024), but only the danger band was read on an agency page (the TMD's own site); the other three come from Post Today, InfoQuest quoting the BMA and Thai PBS, and older bands are still in print. The TMD's 2012 explainer prints the US NWS (Rothfusz) formula, but whether the current TMD product uses it is **[unverified]**: the TMD's heat-index pages answered 503 ([KNOWLEDGE §32.8](KNOWLEDGE.md#328-research-record-19-oct-2026)).

- **Why not now:** a calculator that computes the index itself would show a number that no Thai agency page we could read confirms ([GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Two ways forward** ([ROADMAP P10](ROADMAP.md#p10-more-calculators)): a person confirms the TMD's heat-index page (the four levels and the formula it uses), and the tool computes from the temperature and humidity; or the tool asks for the level the TMD publishes (its expected maximum by region, every Monday, Wednesday and Friday) and shows only what to do at that level, with no formula.

### 79. The fridge's food lists rest on US charts

**Status:** Owner · **Severity:** Medium: review before posting `/fridge` widely

Since v1.11.0 the fridge tool says, food by food, what to throw out and what to keep ([KNOWLEDGE §33.2–33.4](KNOWLEDGE.md#332-the-fridge-food-by-food-the-model-and-the-content)): 13 kinds of food in the fridge (9 to throw out after its 4 hours, 4 that keep) and 4 kinds of pack in the freezer (refreeze or throw out, by whether ice crystals are left). Each verdict comes from a row of FoodSafety.gov's power-outage charts (US HHS, reviewed 8 Aug 2024) or USDA FSIS's list (last updated 7 Aug 2013); both are international, so every row is ⚠️ `partial`. The Thai names and the grouping are ours: no Thai agency publishes per-food advice for a power cut that the research of 20 Oct 2026 could find.

- **Flags for the Thai reviewer:** eggs, which the US charts throw out after 4 hours, while Thai shops often sell eggs unrefrigerated (our observation, not a source); ลูกชิ้น and หมูยอ, put under the chart's "Lunchmeats, hot dogs, bacon, sausage" row; and the other mappings in [KNOWLEDGE §33.3](KNOWLEDGE.md#333-the-sources), such as ข้าวเหนียว and ขนมจีน under "cooked pasta, rice", น้ำเต้าหู้ under "soy milk" and สังขยา under "custards and puddings".
- **Left out on purpose** ([KNOWLEDGE §33.4](KNOWLEDGE.md#334-what-was-left-out-and-the-flags-for-the-reviewer)): น้ำปลา, which the chart's "Fish sauces, oyster sauce: Discard" row would cover, though Thai fish sauce is a cupboard condiment and the opposite has no source; opened fruit juice and coconut (the two US sources disagree); mayonnaise (its rule needs a thermometer); oyster sauce (sourced, but not on the short list); and น้ำพริก, กะปิ, กะทิ, ซอสพริก, Thai coconut desserts and ice, which no source covers. A unit test keeps น้ำปลา, น้ำผลไม้, มะพร้าว and มายองเนส out. Under every list the tool says "ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง" (anything not on the list: if in doubt, throw it out).
- **No thermometer, no "4 + 2".** The charts' verdicts are for food above 4 °C (40 °F) for more than 2 hours, which needs a thermometer; the tool uses the fridge's 4 hours (FSIS's own list for people without one, and the CDC) to decide when, and the chart only to decide what. It never adds the two.
- **What would close it:** a Thai food-safety source (กรมอนามัย, อย., or a university food-science department) on food after a power cut, added beside the US one in `kit.json → fridge.foods[].sources`; the reviewer's yes or no on each Thai name and on eggs ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)). The decision on posting `/fridge` before then is the same as [#74](#74-the-fridge-hours-rest-on-us-guidance-only)'s.

### 80. Insulin above 30 °C has no number

**Status:** By design (v1.11.0); Owner: a pharmacist's read · **Severity:** Low

The insulin card (v1.11.0, [F96](#in-v1110-20-oct-2026)) says "✅ ยังใช้ได้ · เก็บนอกตู้เย็นได้ถึง 28 วัน ถ้าไม่ร้อนเกิน 30°C ไม่โดนแดด และห้ามแช่แข็ง", from the US FDA (opened or unopened vials and cartridges, 15–30 °C, up to 28 days; "Content current as of 09/28/2026"), with Siriraj Hospital's nursing leaflet agreeing for opened insulin (room temperature not above 25–30 °C, out of the sun, up to 28 days, never frozen; checked พ.ศ. 2561).

- **Above 30 °C no source gives a number.** The FDA says heat makes insulin less effective the longer it lasts, and that in an emergency you might still need to use insulin stored above 86 °F (30 °C). So the card adds, with no figure: "ห้องร้อนเกิน 30°C ยาจะค่อยๆ เสื่อม แต่ถ้ายังไม่มียาใหม่ ใช้ต่อได้ แล้วรีบหามาเปลี่ยน". The tool doesn't ask the room's temperature, so its status ("ยังใช้ได้" up to 28 days) doesn't change with it.
- **One tick, two cards.** "💊 มียาที่ต้องเก็บในตู้เย็น เช่น อินซูลิน" adds both the insulin card and "ยาอื่นที่ต้องเก็บในตู้เย็น" (Ready.gov's day, then "check the label"), so a family with cold medicine that isn't insulin sees an insulin card too. Two ticks would be one more question; kept as it is until the phone test says otherwise.
- **After 28 days** the card says "ถามเภสัชกรหรือโรงพยาบาล แล้วหายาใหม่มาเปลี่ยน", never "throw it out" ([GUIDELINES rule 83](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **What would close it:** a Thai pharmacist, or อย., reads the three insulin lines and the other-medicine lines; a Thai figure for heat, if they give one, is added with its source ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 81. Larger text (ก+) covers the start screen and the sheets only, and sizes ignore the phone's text setting

**Status:** Open · **Severity:** Low

"ก+" ("A+" in English), next to EN and 🔊 since v1.11.0, sets CSS `zoom: 1.15` on the start screen and every sheet, kept on the device (`brm:big`) and counted as `big_text` (`on` / `off`). At 360 px the start screen then lays out as if the screen were 313 px wide; the walk at 320, 360, 390 and 768 px found no sideways scrolling and no control under 44 px with it on ([KNOWLEDGE §33.11](KNOWLEDGE.md#3311-the-start-screen-the-alerts-date-the-trust-line-and-ก)).

- **Not everywhere.** The game's room isn't zoomed, on purpose: its tap areas and the room arrows' overlap are measured at fixed sizes. The result screen and the static pages (`/flood`, `/kit`, `/fridge`…) aren't either; on those, the browser's own zoom works.
- **The phone's text-size setting is mostly ignored.** The app's text sizes are in `px`, so a larger system font (Android's font size, iOS's text size) changes little, and in-app browsers may ignore it anyway ([07-audience §8](07-audience.md#8-design-and-content-implications-in-priority-order)). The one study the research found (18 older Thai readers) had them read 18-point text faster than 14 or 16 point; v1.11.0's advice text is 15–16 px, about 17–18 px with ก+ ([F124](#in-v1110-20-oct-2026)).
- **[unverified] on real phones:** CSS `zoom` inside LINE's in-app browser on Android and iOS, and on an older Android WebView (row 71 of [06-test-checklist](06-test-checklist.md)).
- **What would fix it:** text sizes in `rem`, so the phone's setting applies, checked at 320 px with the largest system size; then extend ก+ to the result screen, or retire it. Watch how many visitors turn it on ([05-metrics](05-metrics.md#larger-text-and-the-real-readers-v1110)).

### 82. "power: Bangkok area" stands for MEA's three provinces

**Status:** Owner (the English read) · **Severity:** Low

Since v1.11.0 every number on a guide carries a short name under it (`helplines.json → short`). 1130 is "ไฟดับ กทม. นนทบุรี สมุทรปราการ" in Thai, the area the MEA (กฟน.) serves, but "power: Bangkok area" in English, and 1129 "power: other provinces". The English was shortened so that the named chips don't push the first line of `/en/ready` and `/en/storm` below the first screen at 320 × 460 ([F126](#in-v1110-20-oct-2026)). A reader in Nonthaburi or Samut Prakan reading English may not take "Bangkok area" to include them. The help list on the result screen still gives the full area ("Bangkok, Nonthaburi, Samut Prakan").

- **What would close it:** a native English reader picks a short name that still fits at 320 × 460, or keeps this one ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)); re-render the guide pictures if it changes.

### 83. Leftovers of visitor audit 3

**Status:** Open (AI-ready, except where marked) · **Severity:** Low

Visitor audit 3 (20 Oct 2026, v1.11.0: an older relative in LINE, a parent preparing at the weekend, an English reader and a consistency check) reported 57 findings between its two auditors (28 and 29); v1.11.0 fixed most of them, in the 30 rows F96–F125 ([In v1.11.0](#in-v1110-20-oct-2026)). These are left, with their audit ids ([ROADMAP N23](ROADMAP.md#n23-food-by-food-and-the-app-for-its-real-readers-v1110)):

- **The home check per hazard** (B5, B10): add-ons from the guides' own sources (N95 masks for dust, a fire extinguisher, rubber boots and gloves and sandbags for a flood, closed shoes after a quake), and a "not needed here" answer for the medical-device and cold-medicine rows. `/kit`'s title still says "รับมือทุกภัย" while its list is for a flood, a power cut or 3 days indoors. **The owner decides** which add-ons.
- **"กระเป๋าฉุกเฉิน" (go-bag)** (B9): the flood guide's line 1 ("เอกสารสำคัญใส่ถุงกันน้ำ เก็บรวมกับกระเป๋าฉุกเฉิน") and the topic "🎒 plans & go-bag" use the word, and the app never says what goes in one. The plan card no longer does ([F113](#in-v1110-20-oct-2026)). Define it (ROADMAP P10c, a go-bag per person) or reword.
- **Back from a tool opened inside a guide** (B12, A24) goes to the start screen, not back to the guide.
- **One short and one long name per tool, checked by a test** (B13): the audit's naming table listed each tool's names across the hub, the guides, the results and the pages; v1.11.0 fixed the dust guide's button ([F105](#in-v1110-20-oct-2026)), but no test holds every tool to one short and one long name yet.
- **Units and dates** (B16, the rest; the Thai µg/m³ was fixed, [F104](#in-v1110-20-oct-2026)): "ชม." and "ชั่วโมง" side by side; "60 วิ" in the texts while the Return round runs 50 s and the dust, fire and power-cut rounds 55 s; three date formats.
- **The lesson count** (B17): the pages count 81 lessons, the app 79 (two wait for rooms that aren't open).
- **The same agency twice in a source line** (B23).
- **An English 404 page** (B24): `/en/no-such-page` gets the one bilingual 404 page.
- **`/posts` has no pictures for the tools** (B28).
- **The plan form's order** (B29): it starts with the shelter field.
- **The alert says until when, not who issued it or where** (A8): `config.json → alert` has no field for either yet.
- **"U.S." and "US" both** appear in the English agency names (`seo.en.agencies`: "U.S. Food and Drug Administration (FDA)" beside "US National Weather Service (NWS)"); pick one with the English reader.
- **The dust guide and dust today at orange** (B8): the owner decides, [#76](#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red).

### 84. Ideas from the audience research not built yet

**Status:** Not built (some need the owner) · **Severity:** —

The audience research of 20 Oct 2026 ([07-audience.md](07-audience.md)) found that the person who forwards the app is often not the one who needs it, that older people forward pictures and dislike links, that about a third of people over 60 aren't online, and that most links open inside LINE's or Facebook's browser. v1.11.0 built the trust line and the ก+ button from it ([F118](#in-v1110-20-oct-2026), [#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)). Not built:

- **A print pack for อสม. and village heads:** A4, one guide per page, with a QR code, the date and the sources (ties in with [ROADMAP P5b](ROADMAP.md#p5-share-loop-ideas-not-built-yet)).
- **Burmese pictures of the top three guides** (before the water, after the water, house fire), with a native translator, then Khmer and Lao ([ROADMAP P4](ROADMAP.md#p4-more-languages)).
- **A looped Thai font for body text** (Sarabun or Noto Sans Thai Looped, subset), tested with real older readers before any change; watch the 500 KB budget.
- **Text sizes in `rem`** ([#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)).
- **A second household in the home check** ("บ้านพ่อแม่"), so the organiser can size water and medicine for the parents' home and send that card; nothing leaves the phone.
- **A regional posting calendar** in [04-launch-kit](04-launch-kit.md#5-relaunch-every-rainy-season) (a TODO row is there): the South's floods in November, while Bangkok gets dust.
- **A `?src=` channel code and an in-app-browser bucket** on `view`, counting channel types, never people. **The owner decides:** both are new data, and the guidelines say no user agent is stored ([05-metrics](05-metrics.md#larger-text-and-the-real-readers-v1110)).
- **The real-phone pass on Android 10–11** inside LINE and Facebook: about 12 % of Thai Android traffic runs Android 11 or older ([06-test-checklist](06-test-checklist.md), [#3](#3-not-yet-tested-on-real-phones-or-real-in-app-browsers)).

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

### In v1.11.0 (20 Oct 2026)

Found by visitor audit 3 on 20 Oct 2026, after the owner asked for the fridge food by food, a usability revision of the whole app and research into who receives it from LINE and social media ([ROADMAP N23](ROADMAP.md#n23-food-by-food-and-the-app-for-its-real-readers-v1110), [KNOWLEDGE §33](KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110), [APPROACH §32](APPROACH_AND_METHOD.md#32-four-researchers-in-parallel-then-one-decision-list-v1110)). Auditor A read the app as an older relative (60–70) in LINE's in-app browser at 360 × 640 and 320 × 568 with the text at 1.3×, and reported 28 findings, one of them a blocker (F96); auditor B as a Thai parent preparing at the weekend, an English reader and a consistency checker at 390, 360 and 768 px, and reported 29, nine of them major. Their ids (A…, B…) are given with each row. Every finding was checked against the code or a screenshot before it was fixed. F126 and F127 were found in our own testing before release, never live; F128 was found while documenting the release and had been live since v1.7.0. What the audit left is [#83](#83-leftovers-of-visitor-audit-3).

| # | Problem | Fix |
|---|---|---|
| F96 | **The fridge tool could make someone throw away insulin** (audit A's blocker, the only blocker of both audits). v1.10.0–v1.10.1 had one card for every medicine that must be kept cold, with Ready.gov's day: past 24 hours it said "❌ เกิน 1 วันแล้ว" and "Ready.gov แนะให้ทิ้ง เว้นแต่ฉลากยาบอกว่าเก็บนอกตู้เย็นได้". The commonest such medicine at home is insulin, which the US FDA says keeps out of the fridge for up to 28 days at 15–30 °C (page current as of 28 Sep 2026). Ready.gov's "unless the label says otherwise" was always its condition; the tool put the verdict first | `kit.json → fridge.parts`: a new insulin card (`days: 28`, `fda-insulin`, `siriraj-insulin`, `fda-drugs-disaster`): "✅ ยังใช้ได้" · "เก็บนอกตู้เย็นได้ถึง 28 วัน ถ้าไม่ร้อนเกิน 30°C ไม่โดนแดด และห้ามแช่แข็ง", with the note "ห้องร้อนเกิน 30°C ยาจะค่อยๆ เสื่อม แต่ถ้ายังไม่มียาใหม่ ใช้ต่อได้ แล้วรีบหามาเปลี่ยน" ([#80](#80-insulin-above-30-c-has-no-number)); "ยาอื่นที่ต้องเก็บในตู้เย็น" keeps Ready.gov's day, but past it (`overAs: 'check'`, an orange edge) says "🔎 เกิน 1 วันแล้ว ดูฉลากก่อนใช้" and "ฉลากไม่ได้บอกว่าเก็บนอกตู้เย็นได้ ถามเภสัชกรก่อนใช้ ยาที่ขาดไม่ได้ อย่าเพิ่งทิ้ง ใช้ไปก่อนจนกว่าจะได้ยาใหม่" (the FDA: check the label or ask a pharmacist; a life-sustaining medicine may be used until replaced). The tick reads "มียาที่ต้องเก็บในตู้เย็น เช่น อินซูลิน". The build allows `overAs` only as `check`. Unit test: medicine past a day is `check`, insulin `ok`, "no medicine status word says throw it out". Smoke check "fridge: after a day, other cold medicine says "check the label" (🔎), never "throw it out"; the half-full freezer lists each pack". The game's lesson `s-medcold` quoted the same "discard" and was reworded in the same release ([F128](#in-v1110-20-oct-2026)). Rule: [GUIDELINES 83](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). Lesson: [B16](LESSONS_LEARNED.md#b-safety-content-and-research) |
| F97 | An unanswered freezer counted as **full**, 48 hours, the longer of the two times, though few people know how full their freezer is (A3, B1) | `fridge.freezer` lists half full first, and the first option is the default: an unanswered freezer gets 24 hours, the shorter, safer time. The question in the freezer's card reads "ช่องแช่แข็งมีของ (ไม่แน่ใจ เลือกครึ่งช่อง)". Unit test (the default is 24 h, `full` 48 h, an unknown answer the first option); the smoke check "fridge: "3 ชม." → … a half-full freezer (the safer default) about 21 hours" |
| F98 | "💡 ไฟมาแล้ว" **cleared the answer** at the moment the family needs it: when the power comes back is when they sort out what to throw out (A2) | It stops the clock instead: `brm:fridge` gets `end`, the line reads "💡 ไฟมาแล้ว หลังดับไปราว 24 ชม. คำตอบด้านล่างคือของที่ต้องจัดการ", the cards stay, and "↺ เริ่มนับใหม่" clears it (toast "ล้างเวลาแล้ว"). The stopped answer is kept a day; meanwhile the start screen's tile says "💡 ไฟมาแล้ว ดูว่าต้องทิ้งอะไร" (`hubFridgeBack`). Smoke checks "fridge: "💡 ไฟมาแล้ว" keeps the answer (what to throw out now) and offers to start again" and "fridge: after the power is back, the start screen says what to do next" |
| F99 | A time **between two buttons** had no rule, and someone who knew the clock time ("it went off at nine") had to work out the hours (B2, A19) | Under the buttons: "ไม่ตรงกับปุ่มไหน ให้เลือกเวลาที่นานกว่า" (between two, pick the longer time); and "🕘 จำได้ว่าไฟดับตอนกี่โมง?", a time box with "ใช้เวลานี้": that time today, or yesterday if it is still to come. The box is on the phone-test list (row 69) |
| F100 | **The shared text aged:** "ไฟดับมาแล้ว 3 ชม." is wrong by the time someone reads it in a chat hours later (B20, A16) | The text starts with the clock time: "ไฟดับตั้งแต่ราว 21:10 น. (3 ชม.แล้ว)", or "ไฟมาแล้ว หลังดับไปราว …"; then one line per card, and after the fridge's 4 hours "❌ ทิ้ง: …" and "✅ เก็บได้: …" by each food's short name, the sources, and "เช็กตู้เย็นเอง: {url}" |
| F101 | **Dust today hid the advice for the people at risk behind ticks** (A5): with nobody ticked, only a hint said that more advice existed, while the person reading is often the one at risk (an older person, someone with asthma). With ticks, the at-risk list repeated lines already given for everyone, such as orange's mask line (B22) | The at-risk and long-term-illness lines are always shown, under "สำหรับเด็กเล็ก ผู้สูงอายุ คนท้อง และคนมีโรคประจำตัว", "ทำตามข้อด้านบน และ", and only the lines not already given (`airAdvice()` drops a repeat); "ทำแบบเดียวกับทุกคน" when every at-risk line repeats one above (`riskSame`). The household ticks are gone, and `brm:air` keeps only the kind of number. Unit test (orange gives all three groups with no tick; no level gives a line twice; `riskSame` only when every line repeats). Smoke check "dust: picking yellow clears the number; the at-risk lines show without ticking anyone, and no line is given twice (v1.11.0)" |
| F102 | **"Don't know the colour?" had no answer near the question:** the Air4Thai link sat below the answer (A11, B21) | "ยังไม่รู้สี? 🌐 เปิดดูในเว็บกรมควบคุมมลพิษ (Air4Thai)" right under the colours; the intro reads "ดูสีค่าฝุ่นตอนนี้ แล้วแตะสีเดียวกันด้านล่าง รู้ทันทีว่าทุกคนในบ้านควรทำอะไร"; `/air`'s title, intro and button lead with the colour, and its previews were re-rendered. Smoke check "dust: "don't know the colour?" and the Air4Thai link sit right under the colours (v1.11.0)" |
| F103 | **"15,1" came out as 151, red,** where 15.1 µg/m³ is green (B18). The field was `type="number"`, so the browser, not the app, read what was typed with a comma for the decimal point; the app's own reading of a comma was right all along (the unit test's "82,4") | The field is `type="text"` with `inputmode="decimal"` (the number keyboard), so the app reads what was typed: "15,1" is 15.1, green |
| F104 | The Thai text sent from dust today said "µg/m³" (part of B16) | "มคก./ลบ.ม." in Thai, taken from the unit's own label; English keeps µg/m³ |
| F105 | **One icon for two things, and a button that didn't say where it went** (B26, B13): dust today and the dust guide were both 😷, and the tool's guide button read "😷 วิธีป้องกันฝุ่นในบ้าน 10 ข้อ", which is not the guide's title | Dust today is 🌫️ (the hub tile, the sheet, `TOOLS` in `main.js`, the guides' next steps and the results); 😷 stays for the dust guide and mode. The button reads "📋 ห้องปลอดฝุ่น 10 ข้อ", the guide's real title (English "📋 10 things to do on PM2.5 days"). The tile's line: "ดูสีฝุ่น รู้ว่าต้องทำอะไร" / "Tap the colour, see what to do" |
| F106 | **Numbers without names, and the same three for every hazard** (A4): every guide showed 1784, 199 and 1669 as bare numbers, so the power-cut guide had no electricity number and nothing said whom each number reaches | `helplines.json → short` names every number (1784 ภัยพิบัติ, 199 ไฟไหม้, 1669 เจ็บป่วย, 1555 กทม., 1130 ไฟดับ กทม. นนทบุรี สมุทรปราการ, 1129 ไฟดับ จังหวัดอื่น, 1323 สุขภาพจิต), and `config.json → guides[].calls` gives each guide the numbers that fit it (the power cut 1130 · 1129 · 1669; the fire 199 first). They show as named chips on the guide, in its print footer, on its picture (`drawCalls()` in `cards.js`, a column per number with the name under it), on the hazard pages' call row, and the plan card shows all six main numbers with names. The build checks 1–4 numbers per guide, each in `helplines.json`, and a short name in Thai and English for every number. The nine guide pictures were re-rendered. Rule: [GUIDELINES 85](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F107 | **The power-cut guide didn't lead to the fridge tool** (A9): someone opening it during a cut found the tool only under "เตรียมบ้านต่อ", after the ten lines | `config.json → guides[].now`: the power-cut guide opens with "🥛 ไฟดับอยู่ตอนนี้? ดูว่าของในตู้เย็นอะไรต้องทิ้ง", a button into the tool (counted as `tool_open` with the label `guide`). The build checks that `now` is a tool with a `guideNow<Tool>` string in both languages |
| F108 | **⚠️ meant two things** (A10): three guide lines used it as their own icon (the fallen wire, `return` line 5; the generator outside, `stock` line 10; cracks, then leave, `landslide` line 8), while everywhere else ⚠️ means "under review" | ⚡, ⛽ and 🏃; ⚠️ now only marks lines under review |
| F109 | **The flood and dust guides had no "check before you go" link** (A13), though the start screen and the results have them | A guide with a game and a check link shows it among its actions (🌧️ เช็กระดับน้ำล่วงหน้า for the flood guides, Air4Thai for dust) |
| F110 | **The fire guide offered nothing for the home after its ten lines** (B11): `hazards.fire` had no `tools` | `config.json → hazards.fire.tools` = `["plan"]`: the fire guide's next steps, `/fire` and the fire result offer the family plan, whose meeting place is where a family meets once it is out |
| F111 | The phase chip **"ขณะเกิด" looked chosen** (A23): it alone had an orange border | The border is gone; every chip looks alike, and "ขณะเกิด" keeps only its text colour |
| F112 | **The plan's share text promised what it didn't send** (A6, B4): sent to LINE or Facebook as text, "แผนครอบครัวของบ้านเรา 📝 เซฟไว้ในมือถือทุกคนนะ" arrived without the plan, because a chat link can't carry the picture; the hint to save the picture was at the bottom of the sheet | The text says what it is: "ทำการ์ดแผนครอบครัวของบ้านเราแล้ว 📝 ดูรูปการ์ดที่ส่งในกลุ่ม แล้วเซฟไว้ในมือถือทุกคนนะ ทำของบ้านคุณได้ที่ 👉 {url} #บ้านรอดไหม". New "📋 คัดลอกแผนเป็นข้อความ" puts the filled fields and the named helplines on the clipboard only, never in a URL, an event or a request ([GUIDELINES rule 56](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Both image share sheets (the plan card, the home check's card) start with "👆 วิธีส่งทั้งการ์ด: กดค้างที่รูป แล้วกด "บันทึกรูปภาพ" จากนั้นส่งรูปในกลุ่มไลน์"; the old hint at the bottom is gone. Rule: [GUIDELINES 87](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F113 | The plan card's footer said "…เก็บสำเนาไว้ในกระเป๋าฉุกเฉิน", a go-bag the app never defines (part of B9) | "เซฟไว้ในมือถือทุกคน และพิมพ์เก็บไว้กับเอกสารสำคัญ" ("…keep a printed copy with your important documents"). The go-bag in the flood guide is left ([#83](#83-leftovers-of-visitor-audit-3)) |
| F114 | **The home check's card said "ยังขาด" over three things when ten were missing** (B6), and there was no way to take the list shopping | Over three missing, the card says "ยังขาด 10 อย่าง เช่น:"; new "🛒 คัดลอกรายการที่ยังขาด" copies every missing line with its amount ("ของที่บ้านเรายังขาด (บ้านเรา 5 คน)", "• น้ำดื่ม: 45 ลิตร" …) to the clipboard only |
| F115 | **"คัดลอกลิงก์" copied a whole message** (A26, B27) | Everywhere: "คัดลอกข้อความ" / "Copy message" |
| F116 | With no pills left, the pills line read "⏳ พออีก 0 วัน …" (B19) | "⏳ ยาหมดแล้ว ต้องมีอย่างน้อย {need} เม็ด จะพอ {target} วัน" (`medNone`). The English lines read "⏳ Enough for {days} days; {need} more pills cover {target} days" and "✅ Enough for {days} days, at least the {target}-day minimum" (were "Lasts … more days") |
| F117 | **The alert didn't say until when** (A8) | "ช่วงนี้ถึง 25 ต.ค.: น้ำป่า ดินถล่ม · ดูว่าต้องทำอะไร" / "Until 25 Oct: …", the date from `alert.until` in the Bangkok calendar, in the page the build writes and on the start screen. Who issued it and where is left ([#83](#83-leftovers-of-visitor-audit-3)) |
| F118 | **Nothing said the app is free and asks for nothing** (A21; the audience research: the receivers distrust links, and scams target their age group) | A line under the tools: "🔒 ฟรี ไม่ต้องสมัคร ไม่ขอข้อมูลส่วนตัว" / "🔒 Free, no sign-up, no personal data asked" |
| F119 | **The hub's buttons ran out of the screen at 1.3× text** (A20): a grid item's minimum width followed its longest word | `.hub-btn { min-width: 0 }`. With ก+ ([#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)) the walk found no sideways scrolling at 320, 360, 390 and 768 px |
| F120 | **What to do next was three screens down the result** (B7): at 360 px the 🎒 button was at y ≈ 2849 of a 3024 px page, after the lessons and the helplines | A "เตรียมบ้านต่อ" row right under share and challenge: the guide by its real title ("📋 เตรียมบ้านก่อนน้ำมา 10 ข้อ", was "📋 เช็กลิสต์ 10 ข้อ"), the hazard's tools (🎒, 📝, 🥛, 🌫️, from `hazards.<h>.tools`) and the check link; it starts at y ≈ 874 at 360 px. "หน้าแรก" moved to the end |
| F121 | **The Thai pages were twice as long as they needed to be** (A7, B15): every Thai line had its English twin under it, so `/flood` was about 50 screens on a phone | Thai pages are Thai only (`En()` in the build writes nothing); `/en/` pages and `hreflang` serve English readers; `/learn` keeps one English pointer line, and the 404 page stays bilingual. `/flood` at 360 px: 32,360 → 26,209 px tall; at 320 px: 36,476 → 29,239 px |
| F122 | **Links on the static pages broke Thai words apart and lost their spaces** (B3, A14): "🎒 เช็ก \| ของจำเป็น \|", "รับมือพายุลมแรงฟ้าผ่า10 ข้อ"; 45 links. They were `inline-flex`, so each kept word's `.nw` span became a flex item, a column of its own, and the spaces between items collapsed | `.top a`, `.check a`, `.tix a` and `.jump a` are `inline-block` with padding for the 44 px height. Rule: [GUIDELINES 88](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (with 68 and 72). Lesson: [C19](LESSONS_LEARNED.md#c-engineering-and-platform)'s flex warning, now a rule |
| F123 | `/plan` showed an empty "ที่มา: ·" line under fields with no source (B14) | A line's sources are written only when it has some |
| F124 | **Small print where older readers need it most** (A12): the plan form's hints at 13 px, the privacy lines at 14, the calculators' labels at 14, the helplines' "what" at 14, the sources at 13 | 15 px for the hints, privacy, labels and the helplines' "what"; 14 px for the sources (and the DOH tag in dust today) |
| F125 | English: the room "Front yard" (B25), where the room is the front of a Thai shophouse or house; the home check's name on the result and the hazard pages was not the tool's name | "Front of the house"; "Check your supplies: how ready is our home?" on the result and the hazard links |
| F126 | Found while testing F106, never live: on `/en/ready` and `/en/storm` at 320 × 460 the named chips pushed the guide's first line below the first screen, and the smoke check "hazard pages … on 320x460" failed | Shorter English names ("power: Bangkok area", "power: other provinces", [#82](#82-power-bangkok-area-stands-for-meas-three-provinces)) and compact chips (a 13 px name under the number, 18 px corners). The check passes in both languages |
| F127 | Found in our own review, never live: the power-cut guide's new button (F107) was first given the class `guide-now`, which the guide picker already uses for its "ช่วงนี้" badge (`position: absolute`, 12 px, the warning colour), so the button took the badge's style | Renamed `.guide-now-btn`. Rule: [GUIDELINES 89](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). Lesson: [C24](LESSONS_LEARNED.md#c-engineering-and-platform) |
| F128 (was #85) | Found while documenting v1.11.0, live since v1.7.0: **the game's cold-medicine lesson `s-medcold` said what the fridge tool had said** (F96). Its `why` ended "ถ้าไฟดับเกินหนึ่งวัน ให้ทิ้งยาที่ต้องแช่เย็น เว้นแต่ฉลากยาบอกเป็นอย่างอื่น" ("…discard medication that should be refrigerated, unless the label says otherwise"), and the feedback on the wrong answer "ใช้ต่อไปเรื่อยๆ ไม่ต้องดูฉลาก…" read "ถ้าไฟดับเกินหนึ่งวัน Ready.gov แนะให้ทิ้งยาที่ต้องแช่เย็น เว้นแต่ฉลากยาบอกว่าเก็บนอกตู้เย็นได้". So after v1.11.0's tool fix the game and the tool disagreed, and the lesson, on `/ready` and `/learn` as well, still told players to throw cold medicine away | `items.json → s-medcold`, text only: that feedback is now "ดูฉลากยาก่อน ถ้าไม่ได้บอกว่าเก็บนอกตู้เย็นได้ ให้ถามเภสัชกรว่ายังใช้ได้ไหม" / "Check the label first; if it doesn't say it keeps out of the fridge, ask a pharmacist."; the `why` keeps Ready.gov's plan-ahead advice and adds the US FDA: "…ถ้ายาไม่ได้แช่เย็นระหว่างไฟดับ องค์การอาหารและยาสหรัฐฯ ให้ดูฉลากหรือถามเภสัชกรว่ายังใช้ได้ไหม ยาที่ขาดไม่ได้ เช่น อินซูลิน ใช้ต่อได้จนกว่าจะได้ยาใหม่" ("If a medicine was not kept cold during a power cut, the US FDA says to check its label or ask a pharmacist whether it can still be used; a medicine needed to sustain life, such as insulin, may be used until a new supply is found."); sources `readygov-outage` and `fda-drugs-disaster`; still ⚠️ `partial`, the `verifyNote` saying why it was reworded. The right answer, the tip, the name, the item and its slot didn't change, so houses and challenge links are the same. `npm run docs` regenerated [01-safety-content.md](01-safety-content.md); `/learn` and `/ready` regenerate it; the build has no warnings and `npm test` 40 passed. It changes published advice, so an **"UPDATE:" post is due** ([GUIDELINES §2.4](GUIDELINES.md#24-changing-advice-that-is-already-public)); a Thai pharmacist reads it with the tool's lines ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)). Rule: [GUIDELINES 83](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). Lesson: [B16](LESSONS_LEARNED.md#b-safety-content-and-research) |

### In v1.10.1 (19 Oct 2026)

Reported by the owner from the live v1.10.0, with a screenshot of the fridge tool: "I cannot understand, please review and validate the UI and UX, try to improve and use general simple language." Every automated check had passed ([ROADMAP N22](ROADMAP.md#n22-calculators-in-plain-words-v1101), [KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)).

| # | Problem | Fix |
|---|---|---|
| F93 | The fridge tool was hard to understand. It started counting the moment it opened ("ไฟดับมานานแค่ไหนแล้ว? 1 นาที") before the person had said anything; it had two ways to set the time, a − / + stepper and "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้", with no hint which to use; every answer line packed three facts ("✅ ยังเก็บได้อีกราว 3 ชม. 59 นาที ถ้าไม่เปิดประตูตู้ · ถึงราว 02:38 น. 20 ต.ค."); the agency's long name ("ที่มา: ศูนย์ควบคุมและป้องกันโรคสหรัฐฯ (CDC) · ⚠️") was repeated under every row; and words such as "ช่องธรรมดา" and "ระบบนับต่อให้เองแม้ปิดหน้านี้" came first, with the freezer question below the answers it changed. The dust tool had the same habits in a milder form: the kind of number and the number came before the colour, and the advice was in the notice's formal words | `openFridge()` in `kit.js`: one question, "ไฟดับมานานเท่าไรแล้ว?", answered by one of 9 buttons (`kit.json → fridge.quick`: เพิ่งดับ, 1, 2, 3, 4, 6, 12 ชม., 1 วัน, 2 วัน); nothing is counted or stored until a tap ("👆 แตะเวลาด้านบน แล้วคำตอบจะขึ้นตรงนี้"); after it, "⏱️ ไฟดับมาแล้ว 3 ชม. แอปจะนับเวลาต่อให้ ปิดแล้วเปิดใหม่ได้" and "💡 ไฟมาแล้ว"; the tapped button stays chosen (`picked` in `brm:fridge`), and the answer scrolls into view. Under "คำตอบ", one card per part: its name, a status word in large type (`say`: "ยังกินได้" / "ใกล้ครบ 4 ชม." / "เกิน 4 ชม.แล้ว"), one line ("เหลืออีกราว 1 ชม. ถ้าไม่เปิดตู้", or the action when over), a left edge coloured by status; no clock time or date; the freezer's "เต็มช่อง / ครึ่งช่อง" inside its card. "จำไว้": three short lines; the sources once at the bottom with the ⚠️ note. Dust today: the colour first ("ค่าฝุ่นตอนนี้เป็นสีอะไร?", 64 px buttons), the number behind "🔢 รู้ตัวเลข? ใส่ตัวเลขแทน", shorter labels, the advice in everyday words with the same meaning and strength (ให้น้อยลง / ให้สั้นลง / เลี่ยง / งด), every source kept. The pills' lines and the dust tile reworded. The build checks the new `say`, `cond` and `ok`. Smoke checks "fridge: nothing is counted until a time is tapped (no "1 นาที" out of nowhere); 9 times to tap" and "dust: the five colours come first, on the first screen; the number is behind "รู้ตัวเลข?"" (159 in all). Rule: [GUIDELINES 82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). Lesson: [A8](LESSONS_LEARNED.md#a-product-and-audience) |
| F94 | A time just set read a minute off. v1.10.0 rounded the time off **up** and the time left **down** so that neither looked safer, but the clock had always moved on a little: a count just started read "1 นาที", and a cut just set read "3 ชม. 59 นาที" left for the fridge and "44 ชม. 59 นาที" for a full freezer, numbers a visitor reads as a mistake | `span()` in `kit.js` reads a time "about": to the nearest minute, and a time left of 3 hours or more in whole hours ("เหลืออีกราว 45 ชม."); the time off keeps its minutes, so it never reads "4 ชม." beside "เกิน 4 ชม.แล้ว". The ✅ ⏳ ❌ status still comes from the exact time in `fridgePlan()`, never from the rounded one; where whole hours could flatter (3 hours or more left), the status is ✅ and ⏳ is still two hours away. Smoke check "fridge: "3 ชม." → the fridge is nearly at 4 hours, about 1 hour left; a full freezer about 45 hours". Rule: [GUIDELINES 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (rewritten). Lesson: [B13](LESSONS_LEARNED.md#b-safety-content-and-research) (rewritten) |
| F95 | Nine buttons left one alone on a wider screen. The fridge's nine time buttons (`.fr-times`) and the guide picker's nine tiles (`.guide-grid`) filled as many columns as fit (`auto-fill`), so they came out 4 + 4 + 1, with "2 วัน" or "ฝุ่น PM2.5" alone on the last row: the times on a 400 px phone, the guides on any screen 480 px or wider (tablets, since v1.9.0). Found in the v1.10.1 before-and-after picture, at 400 px | Both are three columns at every width, 3 × 3 (`repeat(3, 1fr)` in `app.css`); the guide picker keeps two columns on a 320 px phone, as before. A probe at 320, 360, 400, 412, 768 and 1024 px in both languages: times 3 + 3 + 3 everywhere (at least 91 × 48 px), guides 3 + 3 + 3 from 360 px (2 + 2 + 2 + 2 + 1 at 320), no text cut off |

### In v1.10.0 (19 Oct 2026)

Found while testing the calculators, before release; never live ([ROADMAP N21](ROADMAP.md#n21-calculators-from-the-home-checks-idea-v1100), [KNOWLEDGE §32](KNOWLEDGE.md#32-calculators-the-fridge-dust-today-the-pills-v1100)).

| # | Problem | Fix |
|---|---|---|
| F92 | The fridge tool's + button rounded the time off to the nearest hour (`Math.round`) before adding one, so from 3 h 30 min it jumped to 5 h. It skipped the very hour in which the fridge's 4 hours run out, and a half hour of the count was lost | `shift()` in `kit.js` moves the start time by exactly one hour from what is shown, within 0–72 h: 3 h 30 min → 4 h 30 min, and − the same way. Smoke check "fridge: + adds an hour (4 h 30 min): the fridge food is out (meat, fish, eggs, milk, leftovers); half a freezer has 19 h 30 min of its 24 h". Lesson: [C23](LESSONS_LEARNED.md#c-engineering-and-platform). The stepper itself was replaced by time buttons in v1.10.1 ([F93](#in-v1101-19-oct-2026)), and that smoke check with it |

### In v1.9.2 (19 Oct 2026)

The leftovers of the second visitor audit (#66–#72), after the owner's "Continue what yo suggested to make app attractive and secure practical usability" ([ROADMAP N20](ROADMAP.md#n20-v192-answers-back-button-card-security), [KNOWLEDGE §31](KNOWLEDGE.md#31-answers-back-button-card-and-security-v192)). F84 was found while measuring F83, and F88 answers the owner's "secure"; F91 was found in our own review before release and was never live. The tablet layout (#71) was looked at and kept, by design.

| # | Problem | Fix |
|---|---|---|
| F83 (was #66) | The right answer was strictly the longest choice in 71 of 82 choice sets in Thai and 73 of 82 in English (81 items and `p-breaker`'s `wet` set; the v1.9.1 audit, counting slightly differently, reported 72 and 74), so it could be picked without reading | 117 wrong labels rewritten in `items.json`, Thai and English (prepare, return, dust, fire and power-cut items, and the `wet` set). Each gives the reason a real person would give and keeps the same mistake, so its `feedback` still answers it ("ปล่อยไว้ เสียก็ไปทำใหม่ได้" → "ปล่อยไว้ในลิ้นชักเหมือนเดิม เสียก็ไปขอทำใหม่ได้"). Drafted by three agents from one brief, then read by the lead against each item's `context` and `feedback` ([APPROACH §29](APPROACH_AND_METHOD.md#29-answers-drafted-in-parallel-read-by-one-lead-v192)). The right answer is now the longest in 17 of 82 (Thai) and 16 of 82 (English); longest / middle / shortest: Thai 17 / 40 / 25, English 16 / 37 / 29. In 14 sets (`p-waterfood`, `p-poster`, `r-glass`, `r-mudfeet`, `r-mould`, `f-extinguisher`, `r-fever`, `r-debris`, `r-breaker`, `a-inhaler`, `a-purifier`, `r-tap`, `a-grill`, `s-plugs`) one drafted rewrite was left out, so the right answer stays the longest by a hair (the longest wrong one is 0.79–0.97 of it) and "never pick the longest" isn't a new tell. No right answer, tip, `why`, `feedback`, source, `kind` or id changed, so the advice, houses and challenge links are the same. Unit test "the right answer is not given away by its length (KNOWN_ISSUES #66)"; on the v1.9.1 content it fails. The Thai read is left ([#66](#66-the-right-answer-was-usually-the-longest-choice)). Rule: [GUIDELINES 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F84 | With answers that say why, a choice sheet could need scrolling on phones 640 px tall or less: on the live v1.9.1, 42 of 82 English sheets already scrolled at 320 × 568, by up to 78 px | Under `@media (max-height: 640px)`: `.sheet { max-height: 92% }`, the item's picture 52 px, `.choices` gap 8 px, `.choice` at least 52 px tall with padding 8 × 12 px (tap targets stay ≥ 44 px). `p-drain`'s second wrong answer was trimmed ("เทน้ำยาล้างท่อลงไปเยอะๆ ให้น้ำระบายลงไปเร็วๆ") so its Thai sheet fits. Measured with a probe that filled the real sheet with every item's labels: Thai sheets that scroll, 0 at 320 × 568, 360 × 640 and 390 × 844; English, 20 of 82 at 320 × 568 (by up to 78 px, [#73](#73-english-choice-sheets-still-scroll-on-the-smallest-phones)), 0 at the other two. A 320 × 460 screen keeps its own compaction (`max-height: 520px`, F79) |
| F85 (was #70) | Since v1.9.1 a sheet closed with the phone's back button, but Back during a round, or on the result screen with no sheet open, left the page, into the chat when the link came from LINE; a round in progress was lost | One history manager in `ui.js`: the game and result screens own one entry, an open sheet one more (`history.state.brm` = the depth). After each change, `settleHistory()` makes the entries match what is showing, once, in the next task: missing entries are pushed (same address, so challenge and `?mode=` links keep theirs), extra ones removed with `history.go(-n)` while one `popstate` is ignored. On `popstate` the layers above the new depth close: a sheet closes; a screen calls `onScreenBack` (`setScreenBack` in `main.js`), which pauses a running round (the pause sheet) or else goes to the start screen. So Back in a round → the pause sheet; Back again → the round resumes; Back on the result → the start screen; Back on the start screen → leaves the site. Smoke checks "back inside a round pauses it (the pause sheet), back again resumes; still on the site", "back on the result goes to the start screen, still on the site", "no page errors (back in the game)". A real phone is still needed ([06-test-checklist](06-test-checklist.md) row 61). Rule: [GUIDELINES 77](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F86 (was #67) | Shown at about a quarter of its size in a chat (about 270 px wide), the 1080 × 1350 result card's gecko line was about 9 px (38 px text in a 330 px box beside the gecko) and its printed link about 7 px | `cards.js → drawResultCard`: the gecko (300 × 316) at the top; its line in a wide bubble under it (`endingBubble`, 960 px wide, 52 px text shrinking to 38 px to fit two lines, three at 38 px if it must, centred, the tail pointing up); the score at 200 px; the rank pill; the result dots; the call to action at 50 px (down to 34); the link at 46 px (down to 30, weight 600); the footer. The headline is no longer drawn: the wordmark, the mode chip, the score and the rank carry it. Looked at 270 px wide: the line and the link can be read. `share/sample-result-prepare.png` and `share/sample-result-return.png` re-rendered. The dots still have no key, and the footer stays 24 px ([06-test-checklist](06-test-checklist.md) row 62) |
| F87 (part of #68) | The four guides with no game drew the gecko with no accessory on their pictures, so landslide, storm, earthquake and heat looked alike in a chat | `config.json → guides[].prop` (new, optional): `helmet` (a yellow hard hat) for `landslide` and `quake`, `hood` (the rain hood) for `storm`, `sunhat` (a straw sun hat with a red band) for `heat`. `modes.js → setGuides(list)`, `propFor(id)` (a guide with a game keeps its mode's prop); `mascot.js` draws `helmet` and `sunhat`; the build stops on a prop the gecko doesn't have. Re-rendered `og/checklist-{landslide,storm,quake,heat}.png`, the same four under `og/en/`, and `share/checklist-{landslide,storm,quake,heat}.png`. Unit test "every guide picture has a gecko accessory, games and guides alike (v1.9.2)". The helpline line and the `/?open=…` previews stay open ([#68](#68-link-previews-are-small-at-chat-size)) |
| F88 | Any site could show the app inside a frame (clickjacking), and nothing limited plugins, a `<base>` or a form target: `_headers` sent only `nosniff`, `Referrer-Policy` and `Permissions-Policy` | `public/_headers`, for every path: `Content-Security-Policy: frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` and `X-Frame-Options: SAMEORIGIN` (for browsers that don't read `frame-ancestors`). No `script-src` or `default-src`: Cloudflare injects inline scripts (the Web Analytics beacon, the zone's JavaScript detections), which such a policy would block, or allow only with hashes that change. HSTS is already sent by Cloudflare. Unit test "security headers: no framing by other sites, no plugins, no foreign base or form target", which also fails on a `script-src`. The live headers are checked with `curl -sI` after the deploy ([06-test-checklist](06-test-checklist.md#live-site-checks-search-and-ai-search)). Rule: [GUIDELINES 76](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F89 (was #72) | The JSON-LD named no publisher: the `Article` markup on `/learn` and the hazard pages had no `author` or `publisher`, and the app, tools first since v1.9.0, had no utility category. `llms.txt`'s tools line linked only `/?open=kit` and `/?open=plan` | `tools/build.mjs`: a publisher `Organization` (`@id` `${SITE}/#org`, the name, `alternateName` "Baan Rod Mai?", the address, `icon-512.png` as its logo) in the start page's `@graph`; `WebSite.publisher` points to it; `author` and `publisher` on the `Article` of `/learn` and every hazard page, in both languages; `applicationCategory: UtilitiesApplication`. Kept: the type `['VideoGame', 'WebApplication']` (the game is still part of the app) and `x-default` → `/en/` (for visitors whose language is neither Thai nor English). `llms.txt` adds "every line and its source: …/kit" and "…/plan". The Rich Results Test is the owner's ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) |
| F90 (was #66, its second half) | The answer buttons drew an icon for each choice's `kind` (a clock for `leave`, a bag for `pack`…). In 42 of the 82 choice sets one answer's icon was the odd one out, and it was the right answer in 26 of them, mostly because the two wrong answers shared the clock ("wait", "leave it": 24 of the 26). So "pick the odd icon" was right in 26 of 42; the v1.9.1 audit had noted "in 26 items it is the only choice with a different icon" | Each button shows a letter in the same 36 px badge: ก ข ค in Thai, A B C in English (`strings.json → choiceLetters`). The choices are still shuffled for each house, so a letter tells nothing about the answer. `icons.js` lost `actionIcon` (only `spriteIcon` is left); `kind` stays in `items.json` as a description of the action, but is no longer drawn. Smoke check "the answers are lettered ก ข ค, with no icon that tells them apart". Rule: [GUIDELINES 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F91 | Found in our own review of F89, before release (never live): the build makes the English start page's `@graph` by copying the Thai one and overwriting its nodes **by position**. The publisher had been inserted at position 1, where the game node used to be, so on `/en/` the `Organization` got the game's English description, the `/en/` address, `isPartOf` `/en/#website` and `subjectOf` `/en/learn`, while the game node (`#game`) kept the Thai description and addresses | The build finds the English game node by its `@id` (`${SITE}/#game`) before changing it. Checked in both built pages: the `#org` node has no description or `subjectOf`; the `/en/` `#game` node has the `/en/` address and `subjectOf` `/en/learn`. Unit test "structured data: one publisher, and each start page describes the app in its own language". Lesson: [C22](LESSONS_LEARNED.md#c-engineering-and-platform) |

### In v1.9.1 (19 Oct 2026)

Found by the second visitor audit: three audit agents walked the live v1.9.0 site at the same time (the tools journey, the game and share loop, the pages and previews), on phone and tablet sizes, in Thai and English, with analytics blocked; the lead re-checked every finding before fixing it ([APPROACH §28](APPROACH_AND_METHOD.md#28-visitor-audit-2-three-auditors-in-parallel-v191), [KNOWLEDGE §30](KNOWLEDGE.md#30-visitor-audit-2-v191)). F82 was found in our own review of the fixes. Group D (content) was left for the Thai review, then rewritten in v1.9.2 ([F83](#in-v192-19-oct-2026), [#66](#66-the-right-answer-was-usually-the-longest-choice)).

| # | Problem | Fix |
|---|---|---|
| F55 | Sharing to LINE, Facebook or X sent the game's own tab to the share page, so Back lost the result, the lessons and the challenge back. `openExternal()` in `share.js` called `window.open(href, '_blank', 'noopener')`, which by the specification always returns `null`, so its `location.href` fallback always ran too. No test caught it: nothing in the smoke test returned `null` from `window.open` as browsers do ([LESSONS D16](LESSONS_LEARNED.md#d-testing-and-verification)) | `window.open(href, '_blank')`, then `w.opener = null`; the fallback runs only when `window.open` really returns `null`. Smoke check "sharing to LINE opens one new tab; this tab stays" with a stub that returns `null` for `'noopener'`: with the old `share.js` the tab went to line.me, with the new one it stays. Rule: [GUIDELINES 66](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F56 | The phone's back button left the site: a guide opened from a LINE chat dropped people back in the chat. Guides were 2.3–4.8 screens long and the About sheet 16–25, with "ปิด" only at the bottom | An open sheet owns one history entry (`history.pushState`); `popstate` closes it, and closing it any other way removes the entry (`history.back()` after the current task, unless another sheet opened and reuses it). A sticky top bar with a 44 px ✕ (`#sheet-x`; hidden on the how-to, which can't be dismissed); focus goes to the sheet's content first, ✕ is a Tab away. Smoke checks: Back closes a sheet and stays in the app; ✕ stays at the top of a long sheet and closes it. Rule: [GUIDELINES 67](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F57 | Thai words broke across lines: "กระ\|จก", "แข็ง\|แรง", "ไฟ\|ดับ" in the home check's intro, "หน่วย\|งาน", "ต้องทำ\|อะไร", "ใครช่วย\|ใคร" on the start screen. The browser's ICU Thai dictionary splits them (Node's too: "เป็นก\|ระ\|จก"), and `word-break: keep-all` has no effect on Thai in Chromium (tested). A word joiner (U+2060) inside the word, tried first, moved the break next to it ("ขอ\|งกรมอุตุฯ", "บ้า\|นที่เสี่ยง") | `config.json → keepTogether`: 217 Thai words of 2–14 letters, wrapped in `<span class="nw">` (`white-space: nowrap`) in the app (`util.js → keepWordsIn`, `observeKeptWords`), on the Thai plain pages by the build (`keepHtml`) and on the canvas pictures (`cards.js → tokens()` with `keptSpans`), plus `text-wrap: pretty` ([KNOWLEDGE §30.1](KNOWLEDGE.md#301-thai-words-that-must-not-break-keeptogether)). A wrap dump of every guide line, the hub, the alert and the home check at 320 and 360 px shows only breaks between words; a unit test keeps every kept word whole on the cards at widths 80–300 (without the list: 7 bad wraps on "…ที่เป็นกระจก"); a smoke check finds no split `.nw` in a guide (36 kept words). Rule: [GUIDELINES 68](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F58 | Fire mode drew no smoke on shorter screens (360 × 640, 375 × 667, 320 × 460; 390 × 844 was fine) while the gecko said "ควันลงมาต่ำแล้ว!" over a clear sky; reproduced in headless Chromium. The smoke layer started above the picture and was moved in only with a `transform`, and it was never repainted | `scene.js` redraws the smoke's rectangle height and edge path each frame instead of translating the group. Smoke check: the smoke rectangle is 262 units tall at 40 s on 360 × 640 (more than 200). Whether the original bug happened on real phones too needs a phone ([06-test-checklist](06-test-checklist.md) row 58). Rule: [GUIDELINES 73](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F59 | A guide with no game was shared with the text "เล่นเกมฝึกจริง 60 วิ" (the earthquake guide, for one) | `shareTextGuide`: "อ่านครบทุกข้อ พร้อมที่มา 👉" / "Every step, with its source 👉" for the guides without a mode. Smoke check: the quake guide's shared text has its link and no "เกม" |
| F60 | The `/checklist/<id>` pages told search engines that the start screen was the original (canonical `/`) and listed themselves as their own `hreflang` twins, so neither page was a good result | Canonical is the hazard page (`/checklist/quake` → `/quake`, `/en/checklist/prepare` → `/en/flood`); no `hreflang`. Smoke check: both canonical links |
| F61 | One visit to an English page made Thai links open in English on that phone: `setLang()` stored the language on every visit, and the redirect script read it | Only a choice is stored (the language button, `?lang=`), under the new key `brm:langPick`; old `brm:lang` values are ignored, and the redirect script in `index.html` reads the new key. Smoke checks: opening `/en/` once doesn't make Thai links open in English; the language button is remembered. Rule: [GUIDELINES 70](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F62 | A first visit downloaded the app twice, about 560 KB instead of about 290 KB on prepaid data: the service worker's install fetched every precached file with `cache: 'reload'` | `cache: 'no-cache'`: the install revalidates, so what the page already loaded comes back as a 304 (Cloudflare sends `max-age=0, must-revalidate` and an ETag). Not measured on the live site yet |
| F63 | `/flood`, `/pm25`, `/fire` and `/ready` opened with the game buttons; `/flood`'s 10-line checklist was at y ≈ 28,833 px, about 80 screens down | H1 → jump row (flood: ก่อนน้ำมา / หลังน้ำลด; a guide-only page: each phase) → "☎️ โทรฟรี" 1784 · 199 · 1669 as `tel:` links → the list(s) as `h2` → picture links → intro → game buttons → check and tool links → lessons; small-screen CSS (H1 1.3em, phase headings with the English inline, the helplines' label visually hidden under 380 px). Measured at 320 × 460 and 360 × 640: every hazard page's first line by 450 px, in Thai and English. The smoke check now requires the helplines and the first line on the first screen and no game button before the list. Rule: [GUIDELINES 71](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F64 | The mode hazards' titles said "43 ข้อ", "12" or "13" while their preview picture said "10 ข้อ"; their intros described the game first; the `/en/` title was 83 characters | Titles name no count ("น้ำท่วม ทำอะไรก่อนน้ำมา และหลังน้ำลด เช็กลิสต์พร้อมที่มา · บ้านรอดไหม?"); intros tools first ("เริ่มจากเช็กลิสต์ 10 ข้อ … ด้านล่างเป็นเหตุผลและที่มาของทุกข้อ และมีเกม 60 วิ ให้ลองฝึก"); the `/en/` title is 59 characters; `og:image:alt` on the plain pages |
| F65 | The guide sheet: "ส่งต่อเป็นรูป" promised a picture that LINE's share buttons don't send; the 580 px picture repeated the list; English pages said "Source: กรมทรัพยากรธรณี"; the helplines and the next step for the home were not in the sheet; the four share buttons sat 3 + 1 | Phase jump chips and "☎️ โทรฟรี" with three `tel:` chips at the top; sources small and muted under the list, agency names in English on English pages (`agencyName()`); one ⚠️ footnote; "เตรียมบ้านต่อ" with 🎒 เช็กของจำเป็น / 📝 แผนครอบครัว; "ส่งต่อให้คนที่บ้าน"; the picture as a thumbnail; "เปิดในเบราว์เซอร์" in LINE; "← เรื่องอื่น" and "เสร็จแล้ว" side by side; share buttons 2 × 2. Smoke check: "during" one tap away, three `tel:` buttons, next steps lead to the home check and the plan |
| F66 | The two flood guides were apart in the picker (1st and 4th) and named "น้ำกำลังมา" / "หลังน้ำลด", without the word flood | "น้ำท่วม: ก่อนน้ำมา" / "น้ำท่วม: หลังน้ำลด" ("Flood: before it comes" / "Flood: after it goes down"), side by side; order prepare, return, landslide, storm, quake, fire, stock, heat, dust |
| F67 | The heat guide's last lines, about someone with heatstroke ("call 1669"), sat under "หลังเกิด" (after), which doesn't fit a heatwave | `checklists.json → heat.phaseNames`: เตรียมไว้ก่อน / วันที่ร้อนจัด / ถ้ามีคนเป็นลมแดด (Get ready / Very hot days / Heatstroke). `phaseNames` is optional, checked by the build (a named phase must exist, both languages), and used by the app, print and the pages |
| F68 | Each tool had several names: the check was เช็กของจำเป็น, บ้านเราพร้อมแค่ไหน?, แชร์ผลเช็กบ้าน and เครื่องเช็กบ้าน; the plan แผนครอบครัว, แผนบ้านรอดของบ้านเรา and การ์ดแผนบ้านรอด | One name each: เช็กของจำเป็น (sheet "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?") and แผนครอบครัว (card "การ์ดแผนครอบครัว", sheet "แผนครอบครัวของบ้านเรา"); "Check your supplies: how ready is our home?" and "Our family plan" in English. Manifest shortcuts renamed; `og/plan.png` and `og/en/plan.png` re-rendered |
| F69 | The home check said "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on 4 of its 9 rows; the start screen's 🎒 button showed a new score only after a reload; its share sheet had no way to finish | ⚠️ next to the line's sources and one footnote under the list; the button updates at once; "เสร็จแล้ว" next to "← กลับไปที่รายการ" |
| F70 | On slow 4G the alert card appeared at 2.75 s, when the script added it, and pushed the hub down 79 px (CLS 0.08) | The build writes the card into `index.html` and every page copied from it while the alert is on; the script still hides it after its end date and on a challenge link. Smoke check: the card is in the page before the script runs |
| F71 | The hub's sub-labels were 12.6 px; "ตามจำนวน\|คนในบ้าน" broke unevenly; the alert's "·" could start a line | 14 px; balanced wrapping on the hub, the alert and the tiles; a no-break space before "·" in `alertCard` |
| F72 | Unknown addresses (`/nonexistent-page`, `/c/p99`, `/en/posts`, `/og/nope.png`) got the start screen with status 200: with no top-level `404.html`, Pages serves `/` | The build writes `public/404.html` (Thai and English, `noindex`, links to the start, "what to do" and `/learn`); Pages serves it with a 404. Smoke check against a test server that answers like Pages. Check on the live site after the deploy |
| F73 | Offline, a page never visited (`/quake`, `/kit`) got the app shell from the service worker and showed the start screen | The app reads the path: a hazard's page opens its guide, `/kit` and `/plan` open the tool. Smoke check: `/quake` served the app shell opens the quake guide |
| F74 | `robots.txt`'s first line called the site "a public home-safety game", and the `<noscript>` line offered the flood summary only | "free home-preparedness tools (what to do, what to keep, a family plan) and a 60-second game"; the `<noscript>` line links "อ่านวิธีรับมือทุกภัย" |
| F75 | The flood came too fast. On the 18 Oct 2026 house every target was under water by 26.8 s (the first at 13.6 s), and a careful player's round ended at 15.9 s of game time, 5/10 against a target of 8. Over 90 houses, 32 % of targets flooded before 20 s, and in 49 of 90 a target in another room flooded before 18 s | `round.prepare.water` `[[0, 625], [0.35, 590], [0.6, 470], [0.82, 390], [1, 300]]` (was `[[0, 612], [0.25, 580], [0.45, 470], [0.7, 390], [1, 300]]`). Over 90 houses from 1 Oct 2026: first flood at 21.9 s at the earliest (median 23.2 s), no target before 20 s, no house with an other-room target before 18 s; the 18 Oct house's last target at 35.8 s; floor wet at 36 s (was 27 s). No item, room or `houseVersion` changed, so houses and challenge links are the same; scores before and after aren't strictly comparable ([#26](#26-wrong-answers-and-decoys-make-the-water-rise-faster)). Unit test over 120 days; `npm run probe` table in [KNOWLEDGE §3](KNOWLEDGE.md#water-prepare-only) |
| F76 | The HUD's "done" counted what the water took: "4/6" with 2 of the 4 lost; a room tab showed a blue ✓ though its only item had flooded; the result showed "เหลือเวลา 44 วิ" after things were lost | The HUD counts only right and learned answers and shows losses apart ("0/6 💧5"; 💨 in fire, 🌑 in the power cut, as in the share text: `lostMark…`); a tab whose things were lost shows the mark; the result shows "💧 โดนน้ำก่อน 6 อย่าง" (`statLost`) instead of the time left. Smoke check: nothing floods in the first 19 s, and the HUD shows the 💧 count apart. Rule: [GUIDELINES 69](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) |
| F77 | The idle hint also ringed the decoys, which cost 2 s to tap; a tapped decoy got a grey tick that read as a win | `.show-hints .item-target` only; a tapped decoy shows a grey dash. Smoke check: the rings are on targets, none on decoys |
| F78 | How-to step 4 said "ไม่ต้องกังวลเรื่องเวลา: เมื่อแตะของ นาฬิกาจะหยุดทันที…" in every mode, though the water (haze, smoke, dark) keeps coming while the player looks, and a decoy costs time | Per mode, e.g. "นาฬิกาหยุดตอนอ่านตัวเลือก แต่น้ำขึ้นระหว่างที่มองหา แตะของที่ไม่เสี่ยงเสียเวลา 2 วิ 💡"; the 2 comes from `round.decoyPenaltySec` (`{d}`) |
| F79 | On screens 520 px tall or less, the how-to and a choice's answers were laid out as on taller phones, and a sheet gave no sign that more was below | Compact rules under `max-height: 520px`: the how-to's four steps and a choice's three answers fit above the fold at 320 × 460 (screenshots); a soft shadow at a sheet's bottom while more is below |
| F80 | The result listed lessons in house order, and "อีกนิดเดียว!" (so close) followed any lost challenge, 5 against 8 too | Lessons: wrong, lost, missed, then right; "อีกนิดเดียว!" only 1–2 points short, otherwise "รอบหน้าเอาใหม่!" (`versusLoseFar`) |
| F81 | The LINE share sheet said "แตะรูปด้านบน" (the picture above) for a picture below the buttons | "แตะรูปด้านล่างค้างไว้…" (`lineGuideText`, th/en) |
| F82 | Found in our own review of F57: four CSS rules matched any span inside (`.quick-btn span:first-child`, `.book-grid span`, `.stats span`, `.alert-btn span:nth-child(2)`), so a kept-word `<span class="nw">` inherited them: "ช่วยเหลือ" in the "เบอร์ช่วยเหลือ" button was drawn at 22 px, and a kept word in the safety book would have been `position: absolute`, one in the result's stats a pill | Direct-child selectors: `.quick-btn > span:first-child`, `.book-grid li > span`, `.stats > span`, `.alert-btn > span:nth-child(2)`. Smoke check "kept Thai words look like the text around them (guide, start screen, safety book)", which fails with the v1.9.0 selectors. Rule: [GUIDELINES 72](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lesson [C18](LESSONS_LEARNED.md#c-engineering-and-platform) |

### In v1.9.0 (19 Oct 2026)

Found by walking the new hub, the guide picker, every guide sheet, the new hazard pages, `/kit` and `/plan` as a visitor, in Thai and English, at 320 × 460 and 360 × 640, and by looking at every new image, before release.

| # | Problem | Fix |
|---|---|---|
| F51 | On a 320 × 460 phone, the hazard pages with no game (`/landslide`, `/storm`, `/quake`, `/heat` and `/en/…`) showed no advice on the first screen: the guide's first line came after the page's intro and links. The smoke check written for it first measured the bottom of the first item, which sits under the line's source links, instead of where the line starts ([LESSONS D14](LESSONS_LEARNED.md#d-testing-and-verification)) | The guide comes first, under the H1, with the phases ("ก่อนเกิด", "ขณะเกิด", "หลังเกิด") as its headings and no separate title; the intro, the picture link, the tool links and the date follow. The smoke check measures where the first line starts (its top, plus 48 px for one line) on the first screen |
| F52 | In the first render of the new link previews, some second lines ran past the image's edge | The texts were shortened and the images re-rendered and looked at |
| F53 | axe-core: the guide sheet's "ขณะเกิด" (during) heading, in the warning orange, was under 4.5:1 on the sheet's background | `.phase-during { color: #9A4A05 }`; axe-core finds nothing on the picker and the guide sheets |
| F54 | The English plan-card preview (`og/en/plan.png`): its text ran into the pill | The English lines now clear the pill (`ogEn.planLine2` reads "Where to meet, and who to call"); re-rendered and looked at |

### In v1.8.1 (19 Oct 2026)

Found by walking every screen, sheet, card and page as a visitor in Thai and English at 320 × 460 and 360 × 640 ([APPROACH §26](APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)).

| # | Problem | Fix |
|---|---|---|
| F42 | The start screen's tagline (`strings.json → tagline` and the static text in `index.html`, copied into every generated page) still said "เกม 60 วิ ดูแลบ้านให้รอด จากน้ำท่วม ฝุ่น และไฟ" / "… from floods, dust and fire", and `manifest.webmanifest → description` left out the power cut. Both were written in v1.5.0; v1.7.0's sweep of the texts about the whole game searched for "Thai agencies", not for what the game covers ([LESSONS E9](LESSONS_LEARNED.md#e-process-documentation-and-git)) | "เกม 60 วิ ดูแลบ้านให้รอด จากน้ำท่วม ฝุ่น ไฟไหม้ และไฟดับ" / "A 60-second game to keep your home safe from floods, dust, fire and power cuts"; the manifest adds "รับมือไฟดับ". The Thai `<title>` of `index.html` (hand-written, "…น้ำท่วม ฝุ่น ไฟไหม้") is now generated from `og.defaultTitle`, which already named ไฟดับ, and the index JSON-LD says "Power cut preparedness" (was "outage"). The build regenerated the pages that copy the start screen. Rule: [GUIDELINES rule 59](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). |
| F43 | The English mixed American and British words: the power-cut lessons (`s-candle`, `s-torch`, `s-radio`'s why), the home check's `torch` line, the `stock` checklist, `geckoStartStock` and `seo.en.hazardOutageDesc` said "flashlight", `s-candle`'s why "power outage" and the top rank `rankStock` "Ready for Any Blackout", while the rest of the game (`p-torch` "Torch and spare batteries" in the same topic) says "torch", "power cut", "litres" and "nappies" | "torch" or "torches" everywhere, "power cut" in `s-candle`'s why, "Ready for Any Power Cut". No image re-rendered: the English checklist previews draw only titles, the challenge previews no rank, and the carousels are Thai. Rule: [GUIDELINES rule 58](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lesson [B10](LESSONS_LEARNED.md#b-safety-content-and-research). |
| F44 | The home check's English title and card said "How ready is our house?", its buttons "home". The intro and share text named only power cuts, though the 3-day amounts come from the flood-era Thai sources (PRD's 72-hour list, ปภ.) | "How ready is our home?", and "How ready is your home? Check for free" on the card. The intro and share text (th/en) name floods too: "ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน", "Our home is {pct}% ready for 3 days of flood or power cut". |
| F45 | A wrapped card line could start with closing punctuation: `Intl.Segmenter` returns "!" as a segment of its own, so the English result card broke "The house copes" \| "! Nearly…" | `tokens()` in `cards.js` keeps `! ? , . : ; ) ] } % … ” ’` and Thai ๆ ฯ on the word before. A unit test wraps every ending (th/en) at widths 60–300: the old code made 180 bad breaks, the new 0. Rule: [GUIDELINES rule 60](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit). |
| F46 | On the result card of the themes with a sun or moon at the top right (return, dust, power cut; x 890–1030), the English wordmark "Baan Rod Mai?" ran into the circle | The wordmark's maximum width is W − 440 (640 px) on those themes, W − 160 on the others; the Thai wordmark is drawn as before. |
| F47 | At 320 px the home check's four answers sat two per row, and their Thai labels broke mid-word ("มีเด็ก\|เล็ก") | `.kit-flags` columns are at least 150 px (was 140), so under about 360 px they stack in one column. |
| F48 | The plan card's share sheet had "← กลับไปที่รายการ" (back to the list) but went back to the plan form | Its own label, "← แก้แผน" / "← Edit the plan" (`kit.json → ui.backPlan`). Smoke check: it returns to the form with what was typed. |
| F49 | The plan card drew only the filled fields, so a card with two or three filled had a big empty gap above the helplines | All six fields every time; an empty one gets a dotted line, so a printed copy can be filled in by hand (`drawPlanCard`). |
| F50 | Opening the plan card sent no event, so plan-card arrivals (from `/?open=plan` or the home check's list) were invisible; only shares were counted | `plan_open`, labelled `link` or `kit`, in both allowlists. Typed text is still never sent; the privacy smoke check now expects `plan_open` too. |

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

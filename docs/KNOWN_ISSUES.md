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
| 62 | [Source notes are downloaded by every visitor](#62-source-notes-are-downloaded-by-every-visitor) | Fixed in v1.15.0 ([F181](#in-v1150-3-nov-2026)) | — |
| 63 | [Printing isn't offered in in-app browsers](#63-printing-isnt-offered-in-in-app-browsers) | Platform | — |
| 64 | [The alert must be cleared or renewed by hand](#64-the-alert-must-be-cleared-or-renewed-by-hand) | By design | — |
| 65 | [Loose ends from the v1.9.0 sweep](#65-loose-ends-from-the-v190-sweep) | Fixed in v1.9.0 | Low |
| 66 | [The right answer was usually the longest choice](#66-the-right-answer-was-usually-the-longest-choice) | Fixed in v1.9.2 (F83, F90); Owner: the Thai read of the new wrong answers | Low |
| 68 | [Link previews are small at chat size](#68-link-previews-are-small-at-chat-size) | Fixed in v1.16.0 ([F214](#in-v1160-4-nov-2026)); the `/?open=…` previews stay by design (#52) | — |
| 69 | [Kept Thai words are a hand-made list](#69-kept-thai-words-are-a-hand-made-list) | By design | Low |
| 71 | [On a tablet the app is a narrow column](#71-on-a-tablet-the-app-is-a-narrow-column) | By design (v1.9.2) | — |
| 73 | [English choice sheets still scroll on the smallest phones](#73-english-choice-sheets-still-scroll-on-the-smallest-phones) | Fixed in v1.16.0 ([F211](#in-v1160-4-nov-2026)) | — |
| 74 | [The fridge hours rest on US guidance only](#74-the-fridge-hours-rest-on-us-guidance-only) | Owner (since v1.11.0 also the food lists, #79) | **Medium (review before posting `/fridge` widely)** |
| 75 | [The dust colours are for the 24-hour average; apps often show hourly readings](#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings) | Owner (the note is by design) | Low |
| 76 | [The PCD and the DOH advise differently at green, yellow and red](#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red) | By design (v1.10.0); Owner: the dust guide and dust today at orange (v1.11.0) | Low |
| 77 | [The fridge and dust tiles are below the first screen on the smallest phones](#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones) | By design (v1.10.0) | — |
| 78 | [A heat-index calculator is not built](#78-a-heat-index-calculator-is-not-built) | By design since v1.13.0 (heat today takes the announced level); a calculator still needs the owner | — |
| 79 | [The fridge's food lists rest on US charts](#79-the-fridges-food-lists-rest-on-us-charts) | Owner | **Medium (review before posting `/fridge` widely)** |
| 80 | [Insulin above 30 °C has no number](#80-insulin-above-30-c-has-no-number) | By design (v1.11.0); Owner: a pharmacist's read | Low |
| 81 | [Larger text (ก+) covers the start screen and the sheets only, and sizes ignore the phone's text setting](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting) | Fixed in v1.16.0 ([F212, F213](#in-v1160-4-nov-2026)); real phones [unverified] (#3) | — |
| 82 | ["power: Bangkok area" stands for MEA's three provinces](#82-power-bangkok-area-stands-for-meas-three-provinces) | Owner (the English read) | Low |
| 83 | [Leftovers of visitor audit 3](#83-leftovers-of-visitor-audit-3) | Open (AI-ready, two owner decisions) | Low |
| 84 | [Ideas from the audience research not built yet](#84-ideas-from-the-audience-research-not-built-yet) | Not built (some need the owner); the print pack built in v1.17.0 ([F215](#in-v1170-4-nov-2026)), text in `rem` in v1.16.0, the second household in v1.18.0 ([F216](#in-v1180-10-nov-2026)) | — |
| 86 | [Air4Thai's server sends the wrong certificate chain](#86-air4thais-server-sends-the-wrong-certificate-chain) | Owner (phone test; tell the PCD) | Medium |
| 87 | [The mask tool's lines for children, pregnancy and heart or lung disease need a doctor's read](#87-the-mask-tools-lines-for-children-pregnancy-and-heart-or-lung-disease-need-a-doctors-read) | Owner | **Medium (review before posting `/mask` widely)** |
| 88 | [Agency links can move; they are checked by hand, monthly](#88-agency-links-can-move-they-are-checked-by-hand-monthly) | By design; Owner: run `npm run links` monthly | Low |
| 89 | [Emergency-alert menus differ by phone](#89-emergency-alert-menus-differ-by-phone) | Owner (phone test) | Low |
| 90 | [Heat today rests on news reports quoting the agencies](#90-heat-today-rests-on-news-reports-quoting-the-agencies) | Owner | **Medium (review before posting `/hot` widely)** |
| 91 | [Six tools rest partly on foreign guidance](#91-six-tools-rest-partly-on-foreign-guidance) | Owner | Low |
| 92 | [The tank's soak time: overnight or 3 hours](#92-the-tanks-soak-time-overnight-or-3-hours) | By design (v1.13.0); Owner: the reviewer picks | Low |
| 93 | [Cloudflare's bot detection sets a cookie](#93-cloudflares-bot-detection-sets-a-cookie) | Owner (a Cloudflare setting) | **Medium (the privacy promise)** |
| 94 | [Leftovers of visitor audit 4](#94-leftovers-of-visitor-audit-4) | Open (AI-ready, one needs a source) | Low |
| 95 | [Live data for "around my home" isn't read yet](#95-live-data-for-around-my-home-isnt-read-yet) | By design since v1.14.0: it is ภัยรอบบ้าน's | — |
| 96 | [The PDPA and the traffic-data rule apply once a server keeps anything about a person](#96-the-pdpa-and-the-traffic-data-rule-apply-once-a-server-keeps-anything-about-a-person) | Owner (a Thai lawyer, before any per-person data) | **High if ignored** (fines of 1–5 M baht a breach) |
| 97 | [Web Push can't reach readers inside LINE or Facebook](#97-web-push-cant-reach-readers-inside-line-or-facebook) | Platform limit | Medium (decides whether push is worth building) |
| 98 | [The gecko's lines and the ภัยรอบบ้าน link are drafts in the owner's name](#98-the-geckos-lines-and-the-ภัยรอบบ้าน-link-are-drafts-in-the-owners-name) | Fixed in v1.15.1 ([F204](#in-v1151-4-nov-2026)) | — |
| 99 | [The flood lines for ภัยรอบบ้าน rest on news reports quoting DDPM and RID](#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid) | Owner (DDPM's own page for four ⚠️ parts; the Thai read was done in v1.15.1) | **Medium (ภัยรอบบ้าน shows them)**; since v1.14.2 most lines lead with the agencies' own documents |
| 100 | [The UV lines rest on WHO and on news reports quoting Thai agencies; the Thai is ours](#100-the-uv-lines-rest-on-who-and-on-news-reports-quoting-thai-agencies-the-thai-is-ours) | Owner (optional: a health agency's read; the Thai read was done in v1.15.1) | Low |
| 101 | [The family's colours differ](#101-the-familys-colours-differ) | Deferred by the owner ("No need now", 4 Nov 2026) | Low |
| 102 | [FloodWatch closes after its handover; the rivers' link goes with it](#102-floodwatch-closes-after-its-handover-the-rivers-link-goes-with-it) | Owner (one line, when it closes) | Low |
| 103 | [Leftovers of visitor audit 5](#103-leftovers-of-visitor-audit-5) | Closed: A5 by ภัยรอบบ้าน (its v0.12.12, seen 10 Nov 2026), the rest in v1.15.1–v1.15.2 | — |
| 104 | [Leftovers of visitor audit 6](#104-leftovers-of-visitor-audit-6) | Mostly closed in v1.18.2 ([F223–F225](#in-v1182-11-nov-2026)); left: choice sheets at 150 % text on a 320 px phone, two cosmetic wraps | Low |

Fixed issues are listed [at the end](#fixed); #67, #70 and #72 were fixed in v1.9.2 ([F85, F86, F89](#in-v192-19-oct-2026)). v1.10.0 fixed one bug found in its own testing, never live ([F92](#in-v1100-19-oct-2026)). v1.10.1 fixed two that the owner reported from the live v1.10.0: the fridge tool was hard to understand, and its times read a minute off ([F93, F94](#in-v1101-19-oct-2026)), and one found while checking them: nine buttons left one alone on a wider screen ([F95](#in-v1101-19-oct-2026)). v1.11.0 fixed 30 findings of visitor audit 3, an older relative in LINE and a parent preparing at the weekend, among them the only blocker of both audits, the fridge tool telling people to throw away cold medicine such as insulin ([F96–F125](#in-v1110-20-oct-2026)), and two of its own found before release ([F126, F127](#in-v1110-20-oct-2026)), and one found while documenting it: the game's cold-medicine lesson still told players to discard cold medicine after a day, as the tool had ([F128](#in-v1110-20-oct-2026)); what the audit left is [#83](#83-leftovers-of-visitor-audit-3). v1.11.1 fixed one found by the mask research: dust today told the parents of a baby to put a mask on it ([F129](#in-v1111-20-oct-2026)). v1.13.0 fixed one found by its own visitor walk, live since v1.8.0: the English tools said "1 people" ([F130](#in-v1130-21-oct-2026)). v1.13.1 fixed 33 findings of visitor audit 4, an older relative in LINE and an English reader checking consistency, among them four majors: the emergency card's English names ran under the gecko, the tank dropped decimals ("1.5" became 15 litres), installing from `/en/` gave a Thai app, and the privacy text promised no cookies while the host sets one ([F131–F163](#in-v1131-21-oct-2026), [#93](#93-cloudflares-bot-detection-sets-a-cookie)); what it left is [#94](#94-leftovers-of-visitor-audit-4). v1.14.0 fitted the app to the owner's other two apps and fixed six things found on the way: a start screen that said rain was coming from a hand-set switch, a season that told the whole country the water had gone, FloodWatch as the only route to "now", an expired alert, `/uv` 404 and no "during" on `/flood` ([F164–F169](#in-v1140-2-nov-2026)); what it left is #98–#101. (#85 was used for F128 while v1.11.0 was documented, so the next open issue is #86.)

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

- **Since v1.17.0:** whether "🖨️ พิมพ์ทั้ง 9 หน้า" prints from a phone (Chrome and Safari; inside LINE the page says to open the browser first), and whether a phone's camera and LINE's own QR scanner read the printed codes (row 96).
- **Since v1.16.0:** whether the phone's own text size reaches the page: Chrome's text scaling and Samsung Internet's text size on Android, LINE's in-app browser (its text zoom), and on iOS only Safari's "aA" page zoom (row 95); the app's sizes are in `rem` now, so a browser that uses its default size applies it ([#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)).
- **First real-phone screenshots (3–4 Nov 2026):** the owner sent the start screen of v1.15.0 and of v1.15.1 and the home check, from an Android phone in Chrome (not inside LINE). They read as designed, apart from "บ้านเราพร้อม 0%" after a first look (F202) and one line break (F205), both fixed. This is not the matrix: no iPhone, no in-app browser, no sharing yet.

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

Otherwise the season decides (`modes[].months`). Nothing breaks, but the automation silently does nothing. The manual `rainWarningActive` switch it used to fall back on was removed in v1.14.0: what is happening now is ภัยรอบบ้าน's ([F164](#in-v1140-2-nov-2026)). Whether to keep this hook at all is the owner's call; ภัยรอบบ้าน makes it unnecessary for the start screen's choice.

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

### 95. Live data for "around my home" isn't read yet

**Status:** By design since v1.14.0 (1 Nov 2026): live data is the sister app ภัยรอบบ้าน's (Thai Risk, https://risk.autobahn.bot), which this app links from the start screen, every guide and the hazard pages ([GUIDELINES rule 100](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Nothing below is to be built here; it stays as the record of what was found.

The app shows no live situation: dust today, heat today and the fridge ask the reader for the colour, the level or the hours, and the alert card is set by hand. The owner asked whether the app could show PM2.5 from the user's position and tell "the situation around my home" for every hazard. The research ([docs/08-open-data.md](08-open-data.md), [ROADMAP N28](ROADMAP.md#n28-home-today-and-home-risk-proposed)) found the data published and machine-readable, but not yet usable as the app stands:

- **CORS:** TMD's CAP warnings and earthquake RSS, NASA FIRMS's fire file and FloodWatch's `/api/stations` send no CORS header, so a phone can't read them; a scheduled job must ([GUIDELINES rule 98](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Keys:** TMD's forecast and warning-text APIs and GISTDA's flood history need the owner's own keys (the public demo keys are for trying out); a key never goes into the browser.
- **Licence:** DMR's ArcGIS hazard layers (faults, landslide-risk villages) state none.
- **Platform:** a Pages Function has 10 ms of CPU, too little for ThaiWater's 4.9 MB rain file; KV allows 1,000 writes a day; Open-Meteo counts its free limit per IP.
- **Privacy:** GISTDA's PM2.5 by point and FloodWatch's `/api/point` need the user's coordinates, which this app never sends ([GUIDELINES rule 56](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)); the design uses lists and subdistrict codes instead.
- **Air4Thai** still sends the wrong certificate chain ([#86](#86-air4thais-server-sends-the-wrong-certificate-chain)); its `air4thai.com` mirror sends CORS `*`.

**Since the server research ([docs/09](09-server.md), 21 Oct 2026):** a collection cycle measured 84–109 ms of CPU, so Workers Free and Pages Functions are out but Workers Paid or any small server fits; about 70 MB a day downloaded and 53 MB archived; TMD's warning polygons are the provinces, so province codes are enough; the nearest Air4Thai station is more than 25 km away for 55 % of subdistricts; half of FloodWatch's gauges were more than 3 h old at that moment; and the Air4Thai chain can be repaired by a server ([#86](#86-air4thais-server-sends-the-wrong-certificate-chain)). The plan is [ROADMAP N29](ROADMAP.md#n29-a-server-that-publishes-files-proposed).

**What would close it:** the owner says yes or no to N28; on yes, picks how the data is served (FloodWatch publishes a slim file with CORS for this site, recommended; or a Worker cron; or GitHub Actions) and gets the TMD key (phase 1), then the GISTDA key and DMR's licence (phase 3).

### 96. The PDPA and the traffic-data rule apply once a server keeps anything about a person

**Status:** Owner (a Thai lawyer, before any per-person data) · **Severity:** High if ignored

Today the app keeps nothing about anyone: what people answer stays in `localStorage`, events are anonymous counts. A server that only fetches agency data and publishes files keeps it that way ([docs/09 §7](09-server.md#7-the-law-once-the-server-keeps-anything-about-a-person), [GUIDELINES rule 99](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). The first per-person record changes that: a Web Push subscription with a province, a LINE user id with a province, a position, an IP log.

- **The PDPA (B.E. 2562)** then asks for a lawful basis (consent by default, s.19), a notice that says what is kept and for how long (s.23), only what is needed (s.22), erasure when done (s.37(3)), a breach notice within 72 hours where feasible (s.37(4)), and, if the server is abroad, a cross-border basis (s.28) and possibly a representative in Thailand (s.37(5)). Fines: up to 1, 3 or 5 M baht a breach; 7 M baht in the first case (31 Jul 2024); 14.5 M baht across five cases on 1 Aug 2025.
- **The 2021 notification on computer traffic data** (Royal Gazette เล่ม 138 ตอนพิเศษ 188 ง) asks service providers, listing "Web Services" and health and lifestyle digital services, to keep traffic data at least 90 days and to verify every user's identity. Whether a free, anonymous preparedness site is in scope is **[unverified]**; it pulls against "no logs".
- **The GDPR** may apply too if the owner is established in the EU.
- **What would close it:** a Thai lawyer reads the plan before any push, account or LINE Official Account is built; then a privacy notice in the app (th and en), the retention period in code, consent on a tap, and a way to delete. Until then a server holds no per-person data.

### 98. The gecko's lines and the ภัยรอบบ้าน link are drafts in the owner's name

**Status:** Fixed in v1.15.1 ([F204](#in-v1151-4-nov-2026)): the owner asked for the read to be finished (4 Nov 2026), and the words below are now the app's, two of them reworded · **Severity:** —

The brief for v1.14.0 asked the owner for the words of the line that replaced "ฝนจะมาอีกระลอก มาเตรียมบ้านกัน!". Rather than leave the false line live until an answer, v1.14.0 ships drafts that claim nothing about this week (F164), for the owner to change in `strings.json`:

- `heroPrepare` "ถ้าน้ำมา บ้านเราพร้อมไหม? มาเตรียมกัน!" / "If the water comes, is the house ready? Let's get it ready!"
- `heroReturn` "หลังน้ำลด อย่าเพิ่งวางใจ ตรวจบ้านก่อนเข้าอยู่" / "After a flood, stay sharp: check the house before moving back."
- `heroDust` "วันฝุ่นเยอะ บ้านเรากันฝุ่นได้ไหม? มาเช็กกัน!" / "On dusty days, can the house keep the dust out? Let's check!"
- `riskLink` "ดูภัยที่ตำบลของคุณตอนนี้" (the brief's own words) / "See the risks at your subdistrict now"; `riskLinkSub` "ฝน น้ำ ฝุ่น ร้อน ทุกตำบล ที่เว็บ ภัยรอบบ้าน"; `riskLinkGuide` "ตอนนี้ที่ตำบลของคุณเป็นอย่างไร? ดูที่ ภัยรอบบ้าน"
- `forecastLong` "ระดับน้ำในแม่น้ำ คลอง (FloodWatch)" / "River and canal levels (FloodWatch)"

None says "the rainy season" for the whole country. A unit test fails if a gecko line says "อีกระลอก", "มาอีกแล้ว", "น้ำลดแล้ว", "is coming", "is back" or "water's gone" again.

- **What would close it:** the owner's words, or a "fine as they are" ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).
- **Closed in v1.15.1:** the owner said "suggest, then validate and make it finish" (4 Nov 2026). Kept: `heroPrepare`, `heroDust`, `riskLink` (the owner's own brief), `riskLinkGuide`, `forecastLong`. Changed: `heroReturn` "…ตรวจบ้านก่อนกลับเข้าอยู่" ("กลับ": the reader is moving back, as in DDPM's "ก่อนกลับเข้าบ้าน"), and `riskLinkSub` "ฝน น้ำท่วม ฝุ่น อากาศร้อน ทุกตำบล ที่เว็บ ภัยรอบบ้าน" ("น้ำ" and "ร้อน" alone read clipped; "อากาศร้อน" is the heat guide's word). The English twins stay.

### 99. The flood lines for ภัยรอบบ้าน rest on news reports quoting DDPM and RID

**Status:** Owner (DDPM's own page for four ⚠️ parts; the Thai read was done in v1.15.1) · **Severity:** Medium: ภัยรอบบ้าน shows them beside its flood level

`kit.json → flood` (three levels and eight lines for while the water rises, v1.14.0) quotes DDPM and the Royal Irrigation Department through news reports (InfoQuest, The Standard, Krungthep Turakij, Thansettakij, MGR Online, 2022–2026): disaster.go.th answered 403 and prd.go.th 404 to the research host on 1–2 Nov 2026, and rid.go.th an empty script page. No province's own flood manual was found online. Two lines are ⚠️ `partial`: the emergency bag at ติดตามไว้ (DDPM gives it with no level; putting it there is ours) and "don't walk or drive through fast-flowing floodwater" (DDPM's walking line names a depth above the knee, left out as a wading depth, so the app's line is stricter).

- **DDPM's levels are not ภัยรอบบ้าน's.** DDPM's 1–5 warning levels (InfoQuest, 24 Sep 2024; The Standard, 21 Jun 2025) are warnings DDPM issues; ภัยรอบบ้าน's level is computed from data. The lines borrow DDPM's actions and never its orders: เสี่ยงสูง says to leave "when officials tell you to".
- **A colour is not the same everywhere:** DWR's flags have three colours, Rangsit's four, DDPM's levels five. No line says "red flag = evacuate".
- **Since v1.14.2 (FloodWatch's review: a news report points to the agency's words, it isn't the source):** the lines lead with the agencies' own documents where two researchers could find them on 3 Nov 2026: RID's own news pages (rid.go.th, 28–30 Sep 2026 and 26 Sep 2024: belongings and appliances up high, follow official notices, vehicles somewhere safe; read in a browser, since the site builds its pages by script), PEA's own page (29 May 2025: appliances up high, cut the downstairs power before the water, never touch a switch wet), DDPM's own phone alert (Cell Broadcast, 20 Aug 2026: "ให้ยกของขึ้นที่สูง เคลื่อนย้ายรถ เก็บทรัพย์สินมีค่าและเอกสารสำคัญ ระวังไฟฟ้าดูด ดูแลกลุ่มเปราะบาง", kept as two screenshots on the Internet Archive), the government's instruction to agencies published by RID (24 Aug 2026: move patients, older and bedridden people out first) and Pak Kret municipality's plan quoting the national plan's five colours (2021). The page marks news reports "(ข่าว)", and a unit test holds the rule.
- **Still without an agency original, so ⚠️:** "ไปทางที่ปลอดภัย ไม่ไปตามทางน้ำไหล", "อย่าเดินลุยหรือขับรถผ่านน้ำท่วมที่ไหลเชี่ยว", "อยู่ห่างสายไฟและเสาไฟฟ้า", the pets in "ย้ายรถและสัตว์เลี้ยง…", and since v1.14.3 the flash-flood line (`flood.flash`: DMR's and DWR's words through news reports; DMR's own warning posts on dmr.go.th, Oct 2026, carry their advice in images and files that weren't read). DDPM's own site (disaster.go.th and its provincial subdomains) answered every automated reader with a Cloudflare challenge; prd.go.th and thaigov.go.th the same; the Internet Archive couldn't be reached from the research host. Nothing was bypassed.
- **How to close it without working around a block (FloodWatch's way, 3 Nov 2026):** the owner opens each page by hand, keeps a dated copy (a saved PDF or screenshot with the date), and the source's `note` records who opened it, when, and where the copy is kept. Until then the ⚠️ stays.
- **For a person in Thailand (the quickest close):** open the national disaster plan 2564–2570 on disaster.go.th (the five levels), the Internet Archive's copy of disaster.go.th of 27 Sep 2026 (`/web/20260927100531/`), PRD's T-Alert page (prd.go.th …/id/39/iid/425692, archived 6 Aug 2026), PRD's August 2026 pages for Nan (iid 533309, 533361; DDPM's phone-alert advice), and PRD's iid 534015 ("หลีกเลี่ยงการเดินผ่านกระแสน้ำไหลเชี่ยว", reported) and 432703 (distance from poles, reported). A PRD page is a government channel here, so any of these that says a ⚠️ line can lift it.
- **The Thai read (v1.15.1, 4 Nov 2026, at the owner's request):** every line read against the agencies' own words in `sources.json`. No level's first line changed (ภัยรอบบ้าน shows them). Changed, with the same advice: "ต้องการคนช่วย โทร 1784" → "ขอความช่วยเหลือ โทร 1784" (DDPM's phrase, `ddpm-alert-2568`); "ไปทางที่ปลอดภัย ไม่ไปตามทางน้ำไหล" → "ใช้เส้นทางที่ปลอดภัย เลี่ยงทางที่น้ำไหลผ่าน"; "น้ำท่วมที่ไหลเชี่ยว" → "กระแสน้ำที่ไหลเชี่ยว" (PRD's "กระแสน้ำไหลเชี่ยว"); "สับคัตเอาต์จุดที่…" → "ตัดไฟจุดที่น้ำอาจท่วมถึง (ปลดเบรกเกอร์หรือสับคัตเอาต์)…" (most homes have breakers: PEA "ปลดสวิตช์ตัดกระแสไฟฟ้า", MEA "ปลดเมนเบรกเกอร์", DDPM "สับคัทเอาต์"); the flash line in DMR's order ("ถ้าน้ำในลำห้วยขุ่นข้น หรือได้ยินเสียงดังผิดปกติ"); the headings "เมื่อน้ำกำลังมา ทำอะไรก่อน" and "เมื่อ ภัยรอบบ้าน บอก… ให้ทำสิ่งนี้ก่อน" (it read as a statement); the intro says "ประกาศ" and "คำแนะนำ" once each. Kept: "เด็ก ผู้สูงอายุ ผู้ป่วยติดเตียง" without "และ", as DDPM writes it. The read is the app's, not an agency's; a DDPM officer's read stays welcome.
- **What would close it:** the four ⚠️ parts get an agency or government original (above); then `verify` can stay or change ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 100. The UV lines rest on WHO and on news reports quoting Thai agencies; the Thai is ours

**Status:** Owner (optional: a health agency's read; the Thai read was done in v1.15.1) · **Severity:** Low (was Medium until the Thai read)

`kit.json → uv` and `/uv` (v1.14.0) follow WHO's Global Solar UV Index guide (2002, its Figure 2 checked against the page image) and its 2022 Q&A and fact sheet. WHO has no Thai version, so the Thai lines are the app's translation. The TMD's own UV page shows a clear-sky forecast with WHO's colour bands and no advice per level; the TMD's, the MOPH's and the DOH's advice reached the research only through news reports (PPTV 2024, MGR Online 2023 and 2015). The 3–7 lines and the 0–2 line are ⚠️ `partial` (WHO alone ties them to a level); the 8+ lines are `verified` (WHO and the TMD say the same). Left out: hours (WHO "midday"; the TMD, DOH and MOPH 09.00–15.00; a dermatology institute 10.00–15.00), SPF numbers (15+, 30, 50, 50–60+), burn times (WHO advises against them), and WHO's annexed "children below one year must never stay in direct sun" (an example adapted from other countries).

- **WHO gives one message from 8 up.** ภัยรอบบ้าน's split of 8–10 (เตรียมตัว) and 11+ (เสี่ยงสูง) is its own; `veryhigh` and `extreme` share WHO's lines, and `extreme` adds the MOPH's "ต้องออกไปจริงๆ อยู่กลางแดดให้สั้นที่สุด", said in an 11+ warning.
- **The Thai read (v1.15.1, 4 Nov 2026, at the owner's request):** no level's first line changed. Changed, with the same advice: "ถ้าออกแดด ใส่เสื้อแขนยาว ทาครีมกันแดด และสวมหมวก" and "ถ้าต้องออกไป ให้หาที่ร่มเสมอ" (an "if" was missing), "ถ้าจำเป็นต้องออกไป อยู่กลางแดดให้น้อยที่สุด" (the MOPH's "หากจำเป็นควรใช้เวลาให้น้อยที่สุด"), "ทาครีมกันแดดแล้ว ก็ไม่ควรอยู่กลางแดดนานขึ้น" (WHO: sunscreen is not a reason to stay longer; the old line read as a claim about sunscreen), and the intro ("แสงแดดทำร้ายผิวและดวงตา", not "เผาตา") and description. Kept: "ผิวแพ้ง่าย", the TMD's own sense ("ผิวหนังอ่อนไหวหรือภูมิแพ้"), and "เลี่ยงออกไปกลางแจ้ง".
- **What would close it:** the TMD's own page with advice per level, if one is found; a read by the DOH or the Institute of Dermatology stays welcome ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 101. The family's colours differ

**Status:** Deferred by the owner ("One colour palette for the three apps > No need now", 4 Nov 2026) · **Severity:** Low

- **UV at 11+: settled on 2 Nov 2026.** Both apps say "สูงจัด": ภัยรอบบ้าน v0.11.2 took this app's word (the MOPH's, through a news report), since its "สูงที่สุด" had no source. Which word the TMD itself uses for each of the five bands is still **[unverified]** (its page shows colours only).
- **Colours:** the two apps draw levels in different palettes; one palette for the family is the owner's open decision, so v1.14.0 changes no colour (the ภัยรอบบ้าน link uses the hub's existing teal).
- **Levels:** ภัยรอบบ้าน's four words (ยังไม่น่าห่วง · ติดตามไว้ · เตรียมตัว · เสี่ยงสูง) label `kit.json → flood.levels` as they are; this app doesn't rename them, nor the agencies' band words.
- **What would close it:** the owner picks a palette for the family ([docs/10](10-family.md)). Not now: each app keeps its own colours; the words for the levels are already shared. Reopen only when the owner asks.


### 102. FloodWatch closes after its handover; the rivers' link goes with it

**Status:** Owner (one line, when it closes) · **Severity:** Low

FloodWatch said on 2 Nov 2026 that it is preparing its handover to ONWR, that ONWR's copy carries none of the family's links, and that its own site closes after the project. This app links it as the rivers' link (`config.json → forecastAppUrl`): the start screen in the flood months, the flood guides, the result, the help sheet and `/flood`, always after ภัยรอบบ้าน.

- **When it closes:** set `forecastAppUrl` to `""` and push. Tested on a copy in v1.14.2: the build gives no warning (only a `[PLACEHOLDER]` warns now), `npm test` passes, the smoke test passes (its guide check expects no FloodWatch button then), and no generated page links `flood.autobahn.bot`. ภัยรอบบ้าน's link stays everywhere.
- **Not ONWR's copy, unless** FloodWatch's owner gives a URL that ONWR has agreed to (FloodWatch, 3 Nov 2026: ONWR's copy removes every link to this app, and its address isn't settled). With such a URL, set it and change the label `forecastLong` ("…(FloodWatch)") in both languages. This replaces the v1.14.2 note that said to use ONWR's copy if it was public.
- **When:** no date yet; FloodWatch closes after ONWR's install.
- **Traffic:** referrals from FloodWatch won't last; don't plan on them ([docs/05](05-metrics.md)).
- **ภัยรอบบ้าน** also links FloodWatch for river detail; that is its own change.


### 103. Leftovers of visitor audit 5

**Status:** Closed (10 Nov 2026): A5 done by ภัยรอบบ้าน, A8, A11, A13, A14 and the dates fixed in v1.15.1–v1.15.2 · **Severity:** —

Visitor audit 5 (3 Nov 2026, the live v1.14.3; [ROADMAP N34](ROADMAP.md#n34-visitor-audit-5-and-audit-3s-leftovers-v1150)) found 17 new things; v1.15.0 fixed 13 ([F188–F199](#in-v1150-3-nov-2026)) and A18 with B23. Left:

- **A5, done by ภัยรอบบ้าน** (its v0.12.12 links `/flood#cl-prepare` for "ก่อนน้ำมา ทำอย่างไร", read from its live code on 10 Nov 2026, [docs/10 §4](10-family.md#4-hand-back-to-ภัยรอบบ้าน-paste-into-a-thai-risk-session)). It had linked `/flood#prepare`, the reasons for each step, far down the page; the 10 short steps are `/flood#cl-prepare` near the top. In the hand-back ([docs/10 §4](10-family.md#4-hand-back-to-ภัยรอบบ้าน-paste-into-a-thai-risk-session)); both anchors stay.
- ~~**A8:** on the plan and info cards' share sheets, "คัดลอกข้อความ" (the invitation) sits beside "คัดลอกแผนเป็นข้อความ" (the plan)~~ Fixed in v1.15.2 ([F206](#in-v1152-4-nov-2026)).
- ~~**A11:** the fridge's share row shows before any time is tapped; choosing "4 ชม." reads "เกิน 4 ชม.แล้ว"~~ Fixed in v1.15.1 ([F200, F201](#in-v1151-4-nov-2026)).
- ~~**A13:** heat today's level buttons have no °C~~ Fixed in v1.15.2 ([F207](#in-v1152-4-nov-2026)).
- ~~**A14:** the dust number box says nothing for "abc", an AQI of 1000 or Thai digits ("๘๐")~~ Fixed in v1.15.2 ([F208](#in-v1152-4-nov-2026)). Kept: the box's limits (PM2.5 999, AQI 500, `kit.json → air.units[].max`) are typo guards from v1.10.0; whether a Thai AQI can go above 500 is **[unverified]**, and a reader above it is told to check the number or tap a colour, which always works.
- ~~**Dates (also #83 B16):** the pages' "ปรับปรุงล่าสุด: 2026-11-03" is ISO~~ Fixed in v1.15.2 ([F209](#in-v1152-4-nov-2026)); the sitemap and `llms.txt` keep ISO, which is for machines.

---

## Platform limits

### 104. Leftovers of visitor audit 6

**Status:** Mostly closed in v1.18.2; what is left is by design or cosmetic · **Severity:** Low

Visitor audit 6 (10 Nov 2026, the live v1.17.1, LINE's Android browser, 69 pages and 24 sheets at 100/125/150 % text, a round in every mode, the print pack decoded from PDF) found two high and four medium problems, fixed in v1.18.1 ([F217–F222](#in-v1181-10-nov-2026)). Left:

- ~~**English choice sheets at 125 % text**~~ Done in v1.18.2 ([F223](#in-v1182-11-nov-2026)). Measured over all 82 sheets (the audit saw 39): English at 125 % on 320 × 568 went from 53 scrolling to 3 (by up to 38 px), Thai from 5 to 0; on 360 × 640 none scroll at 125 %.
- **Left, by design: 150 % text on a 320 px phone.** Three answers at 24 px don't fit a 568 px screen: 25 of 82 Thai sheets and 68 of 82 English ones scroll (on 360 × 640: 0 and 5). The text stays the size the reader chose; the third answer shows cut at the bottom edge with the sheet's shadow, and the time is paused while a sheet is open.
- ~~**"go-bag" in English**~~ Done in v1.18.2 ([F224](#in-v1182-11-nov-2026)): "emergency bag" in the 4 lessons, the flood guide's line and the topic name; a unit test keeps "go-bag" out.
- ~~**One carousel image ends its "why" in "…"**~~ Done in v1.18.2 ([F225](#in-v1182-11-nov-2026)): the gas lesson's Thai "why" ends "ออกให้พ้นบริเวณก่อน แล้วค่อยโทรแจ้ง" (290 letters), and flood page 7 shows it whole.
- **At 150 % text:** the fridge's "เพิ่งดับ" button wraps to two lines (its row 95 px against 56 px for the others); on the supplies list the checkbox and icon columns take about a third of a 320 px screen, so "กรม / ประชาสัมพันธ์" splits at its compound. Cosmetic.
- **Not checked:** the result and share cards (`cards.js`) also keep at most two lines in places (`lines.slice(0, 2)`); no cut text was seen there, but nothing names one if it happens.

### 97. Web Push can't reach readers inside LINE or Facebook

**Status:** Platform limit · **Severity:** Medium (it decides whether push is worth building)

MDN's compatibility data (8.1.6, 15 Oct 2026) marks `PushManager` unsupported in Android WebView and iOS WKWebView, which in-app browsers are built on; LINE's LIFF browser lists push and service workers as unsupported. On an iPhone, Web Push works only for a web app added to the Home Screen (iOS 16.4+), and only after the person taps to allow. Most of this app's readers open it from a LINE chat ([docs/07](07-audience.md)), so push would reach only people who installed it.

- **What would change this:** nothing on our side. Before building push, count installs (an anonymous event); point people to LINE ALERT and DDPM's Cell Broadcast for warnings, which reach phones without the app ([docs/09 §6](09-server.md#6-push-and-messages)). Push inside LINE's in-app browser was not tried on a phone (**[inferred]**).

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

**Since v1.13.0** three more stores work the same way: `brm:water` (how many people and the bottles counted), `brm:bag` (the bag's ticks) and `brm:info` (up to six emergency cards: name, long-term conditions, medicines and doses, allergies, hospital and patient number, two contacts). The emergency card holds health details, so its form says "🔒 สิ่งที่พิมพ์อยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปไหน อย่าใส่เลขบัตรประชาชน"; the card is a picture made on the phone, and with two or more cards "ลบบัตรนี้" removes one. "I'm safe" keeps nothing of its own: it offers the plan's meeting places (`brm:plan`) as buttons, and the person sends the message themselves through LINE, an SMS or a copy; the app sends no place and keeps no message.

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

**It ends by itself (v1.6.0).** `config.featuredTopicUntil` is its last day (now `2026-11-15`, Bangkok date, that day included); from the next day the topic is off without anyone touching it. The rain warning worked the same way with `rainWarningUntil` until v1.14.0 removed it ([F164](#in-v1140-2-nov-2026)). Before v1.6.0 neither had an end, so a forgotten switch would have kept "ฝนจะมาอีกระลอก" and the diseases-after-floods topic on the start screen into the dust season ([F32](#in-v160-18-oct-2026)). Set an end date every time you turn a switch on; the build warns about a switch with no end date or one whose date has passed, and its `start` line shows what today's visitors see.

When no topic is in the news, the start screen features the topic of the recommended mode (dust → 😷 `air` in December–March, fire → 🔥 `fire` in April). A `?mode=` link brings that mode's own topic first. In the flood months (ก่อนน้ำมา, May–November) nothing is featured unless the owner sets a topic. Leaving a topic on for months makes it wallpaper, so the owner still decides when to end it early or extend it.

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
- **Until then,** 5 of the 8 lessons in the `ready` carousel set are ⚠️, and each of those images says "ข้อนี้ยังรอตรวจทานกับหน่วยงาน". Post that set knowing so ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)).
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

The south floods later, in the November–January monsoon. The model has one calendar for the whole country, so it doesn't cover December and January there: from December the start screen recommends dust. Since v1.14.0 that matters less: the calendar only picks which game card is big, ก่อนน้ำมา counts its own months (May–November, so หลังน้ำลด is never recommended to the whole country), and whether water is coming where the reader lives is ภัยรอบบ้าน's, which every guide and the start screen link. Campaigns for the south use `/?mode=prepare` or `/flood`.

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
- **Lessons under review are posted as such.** 5 of the 8 lessons in the `ready` set are ⚠️ ([#55](#55-the-power-cut-lessons-rest-largely-on-international-guidance)), and their pages say "ข้อนี้ยังรอตรวจทานกับหน่วยงาน". Since v1.7.0 the build lists them on its `posts` line ("lessons under review: outage 5 ⚠️") rather than warning about each one, so a real warning isn't lost among them. When a review changes a lesson, re-render the set.
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

**Status:** Fixed in v1.15.0 ([F181](#in-v1150-3-nov-2026)): the app loads `content/sources-app.json`, written by the build without the notes; the start screen went from 304 to 274 KB. Kept below as the record. · **Severity:** Low

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

**Status:** Fixed in v1.16.0 ([F214](#in-v1160-4-nov-2026)); the `/?open=…` previews stay by design ([#52](#52-a-mode-link-previews-as-the-main-game)) · **Severity:** —

At the 260 px a chat shows them, the 1200 × 630 previews' helpline line is about 6 px. `/?open=kit`, `/?open=plan` and `/?open=guide` still preview as the start screen ([#52](#52-a-mode-link-previews-as-the-main-game)): share `/kit`, `/plan` or a `/checklist/<id>`. Found in the v1.9.1 audit.

- **Fixed in v1.9.2:** the four guides with no game drew the gecko with nothing on, so their pictures looked alike in a chat. Now the gecko wears a hard hat (landslide, earthquake), the rain hood (storm) or a sun hat (heat) ([F87](#in-v192-19-oct-2026), [KNOWLEDGE §31.4](KNOWLEDGE.md#314-a-prop-for-every-guide-picture)).
- **Fixed in v1.16.0 ([F214](#in-v1160-4-nov-2026)):** larger numbers wouldn't have been readable either (the line is about 8 px at 260 px however it is laid out), and they were the only phone numbers in the app shown without whom they reach. The guides' previews now say "ฟรี · ทุกข้อบอกที่มา" / "Free · every line names its source" (the two languages said different things before), and the guides' page description no longer lists six bare numbers; the numbers stay on the pages and the 1080 × 1920 pictures, with their names. A unit test fails if a preview string shows a helpline number.
- **By design:** the `/?open=…` previews ([#52](#52-a-mode-link-previews-as-the-main-game)).

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

**Status:** Fixed in v1.16.0 ([F211](#in-v1160-4-nov-2026)) · **Severity:** —

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

**Status:** By design since v1.13.0: heat today takes the level announced (the second way below); a calculator from the temperature and humidity still needs the owner

The next calculator the idea suggests is "heat today": the temperature and the humidity give the heat index, its level and what to do. The research of 19 Oct 2026 found the current Thai levels (watch 27.0–32.9, warning 33.0–41.9, danger 42.0–51.9, extreme danger 52.0 °C and over: the DOH and TMD scheme of 2024), but only the danger band was read on an agency page (the TMD's own site); the other three come from Post Today, InfoQuest quoting the BMA and Thai PBS, and older bands are still in print. The TMD's 2012 explainer prints the US NWS (Rothfusz) formula, but whether the current TMD product uses it is **[unverified]**: the TMD's heat-index pages answered 503 ([KNOWLEDGE §32.8](KNOWLEDGE.md#328-research-record-19-oct-2026)).

- **Why not now:** a calculator that computes the index itself would show a number that no Thai agency page we could read confirms ([GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Two ways forward** ([ROADMAP P10](ROADMAP.md#p10-more-calculators)): a person confirms the TMD's heat-index page (the four levels and the formula it uses), and the tool computes from the temperature and humidity; or the tool asks for the level the TMD publishes (its expected maximum by region, every Monday, Wednesday and Friday) and shows only what to do at that level, with no formula.
- **Since v1.13.0** heat today (`/hot`) is the second way: the person taps the level announced today and sees what everyone and the people at risk do, with the heatstroke signs and first aid; it computes nothing. Its sources and what they rest on are [#90](#90-heat-today-rests-on-news-reports-quoting-the-agencies).

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

**Status:** Fixed in v1.16.0 ([F212, F213](#in-v1160-4-nov-2026)): text sizes in `rem`, breakpoints in `em`; whether each phone's own setting reaches the page is **[unverified]** ([#3](#3-not-yet-tested-on-real-phones-or-real-in-app-browsers), row 95) · **Severity:** —

"ก+" ("A+" in English), next to EN and 🔊 since v1.11.0, sets CSS `zoom: 1.15` on the start screen and every sheet, kept on the device (`brm:big`) and counted as `big_text` (`on` / `off`). At 360 px the start screen then lays out as if the screen were 313 px wide; the walk at 320, 360, 390 and 768 px found no sideways scrolling and no control under 44 px with it on ([KNOWLEDGE §33.11](KNOWLEDGE.md#3311-the-start-screen-the-alerts-date-the-trust-line-and-ก)).

- **Not everywhere.** The game's room isn't zoomed, on purpose: its tap areas and the room arrows' overlap are measured at fixed sizes. The result screen and the static pages (`/flood`, `/kit`, `/fridge`…) aren't either; on those, the browser's own zoom works.
- **The phone's text-size setting is mostly ignored.** The app's text sizes are in `px`, so a larger system font (Android's font size, iOS's text size) changes little, and in-app browsers may ignore it anyway ([07-audience §8](07-audience.md#8-design-and-content-implications-in-priority-order)). The one study the research found (18 older Thai readers) had them read 18-point text faster than 14 or 16 point; v1.11.0's advice text is 15–16 px, about 17–18 px with ก+ ([F124](#in-v1110-20-oct-2026)).
- **[unverified] on real phones:** CSS `zoom` inside LINE's in-app browser on Android and iOS, and on an older Android WebView (row 71 of [06-test-checklist](06-test-checklist.md)).
- **What would fix it:** text sizes in `rem`, so the phone's setting applies, checked at 320 px with the largest system size; then extend ก+ to the result screen, or retire it. Watch how many visitors turn it on ([05-metrics](05-metrics.md#larger-text-and-the-real-readers-v1110)).
- **Done in v1.16.0 ([F212, F213](#in-v1160-4-nov-2026)):** every text size in `app.css` is in `rem` and the pages' in `rem`/`em`, so a browser's own text size applies; the breakpoints are in `em`, so the compact layouts take over as text grows; the round's top bar, room tabs and room bubble stay in `px` (a fixed scene). Measured in headless Chromium with the default text at 100 %, 125 % and 150 % (`Page.setFontSizes`): no sideways scroll on any of the 64 pages at 320 px, the start screen's tiles go to one column, nothing clipped in the share sheet or the guide picker. At 100 % the 28 screens compared are the same pixel for pixel (anti-aliasing aside). ก+ stays, on top.
- **Still [unverified]:** which phones pass their text setting to the page. Desktop browsers and Firefox use the default size (this change); Chrome on Android applies its own text scaling and LINE's Android browser its text zoom, which may scale any unit; iOS changes page text only through Safari's "aA" page zoom. Row 95 of the phone test says how to check.

### 82. "power: Bangkok area" stands for MEA's three provinces

**Status:** Owner (the English read) · **Severity:** Low

Since v1.11.0 every number on a guide carries a short name under it (`helplines.json → short`). 1130 is "ไฟดับ กทม. นนทบุรี สมุทรปราการ" in Thai, the area the MEA (กฟน.) serves, but "power: Bangkok area" in English, and 1129 "power: other provinces". The English was shortened so that the named chips don't push the first line of `/en/ready` and `/en/storm` below the first screen at 320 × 460 ([F126](#in-v1110-20-oct-2026)). A reader in Nonthaburi or Samut Prakan reading English may not take "Bangkok area" to include them. The help list on the result screen still gives the full area ("Bangkok, Nonthaburi, Samut Prakan").

- **What would close it:** a native English reader picks a short name that still fits at 320 × 460, or keeps this one ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)); re-render the guide pictures if it changes.

### 83. Leftovers of visitor audit 3

**Status:** Open, mostly fixed in v1.15.0 (B12, B13, B23, B24, B29 and "U.S."; [F182–F187](#in-v1150-3-nov-2026)); B9 was answered by `/bag` in v1.13.0 (five guides link it, the flood "before" guide included); B17 is by design (below). Left: the units and dates, `/posts` pictures for the tools, the alert's issuer, and the owner's two decisions · **Severity:** Low

Visitor audit 3 (20 Oct 2026, v1.11.0: an older relative in LINE, a parent preparing at the weekend, an English reader and a consistency check) reported 57 findings between its two auditors (28 and 29); v1.11.0 fixed most of them, in the 30 rows F96–F125 ([In v1.11.0](#in-v1110-20-oct-2026)). These are left, with their audit ids ([ROADMAP N23](ROADMAP.md#n23-food-by-food-and-the-app-for-its-real-readers-v1110)):

- **The home check per hazard** (B5, B10): add-ons from the guides' own sources (N95 masks for dust, a fire extinguisher, rubber boots and gloves and sandbags for a flood, closed shoes after a quake), and a "not needed here" answer for the medical-device and cold-medicine rows. `/kit`'s title still says "รับมือทุกภัย" while its list is for a flood, a power cut or 3 days indoors. **The owner decides** which add-ons.
- **"กระเป๋าฉุกเฉิน" (go-bag)** (B9): the flood guide's line 1 ("เอกสารสำคัญใส่ถุงกันน้ำ เก็บรวมกับกระเป๋าฉุกเฉิน") and the topic "🎒 plans & go-bag" use the word, and the app never says what goes in one. The plan card no longer does ([F113](#in-v1110-20-oct-2026)). Define it (ROADMAP P10c, a go-bag per person) or reword. **Since v1.13.0 the bag tool (`/bag`) says what goes in one, and since v1.18.2 the English says "emergency bag" everywhere ([F224](#in-v1182-11-nov-2026)): closed.**
- **Back from a tool opened inside a guide** (B12, A24) goes to the start screen, not back to the guide.
- **One short and one long name per tool, checked by a test** (B13): the audit's naming table listed each tool's names across the hub, the guides, the results and the pages; v1.11.0 fixed the dust guide's button ([F105](#in-v1110-20-oct-2026)), but no test holds every tool to one short and one long name yet.
- **Units and dates** (B16, the rest; the Thai µg/m³ was fixed, [F104](#in-v1110-20-oct-2026)): "ชม." and "ชั่วโมง" side by side; "60 วิ" in the texts while the Return round runs 50 s and the dust, fire and power-cut rounds 55 s; three date formats.
- **The lesson count** (B17): the pages count 81 lessons, the app 79 (two wait for rooms that aren't open). **By design (v1.15.0):** the app's 📖 book counts what the game can show (79); the pages list every lesson (81).
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

- ~~**A print pack for อสม. and village heads:** A4, one guide per page, with a QR code, the date and the sources~~ Built in v1.17.0: `/print` and `/en/print` ([F215](#in-v1170-4-nov-2026)).
- **The sources a printed page lists** are agencies only; the QR code leads to the page with each line's own source.
- **Burmese pictures of the top three guides** (before the water, after the water, house fire), with a native translator, then Khmer and Lao ([ROADMAP P4](ROADMAP.md#p4-more-languages)).
- **A looped Thai font for body text** (Sarabun or Noto Sans Thai Looped, subset), tested with real older readers before any change; watch the 500 KB budget.
- ~~**Text sizes in `rem`**~~ Done in v1.16.0 ([#81](#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)).
- ~~**A second household in the home check** ("บ้านพ่อแม่"), so the organiser can size water and medicine for the parents' home and send that card; nothing leaves the phone.~~ Built in v1.18.0: "🏠 บ้านเรา / 🏡 บ้านพ่อแม่" ([F216](#in-v1180-10-nov-2026)).
- ~~**A regional posting calendar**~~ Written in v1.17.1: [04-launch-kit](04-launch-kit.md#a-regional-posting-calendar-v1171), from the sourced seasons (S30–S43).
- **A `?src=` channel code and an in-app-browser bucket** on `view`, counting channel types, never people. **The owner decides:** both are new data, and the guidelines say no user agent is stored ([05-metrics](05-metrics.md#larger-text-and-the-real-readers-v1110)).
- **The real-phone pass on Android 10–11** inside LINE and Facebook: about 12 % of Thai Android traffic runs Android 11 or older ([06-test-checklist](06-test-checklist.md), [#3](#3-not-yet-tested-on-real-phones-or-real-in-app-browsers)).

### 86. Air4Thai's server sends the wrong certificate chain

**Status:** Owner (phone test; tell the PCD) · **Severity:** Medium

On 20 Oct 2026 `https://air4thai.pcd.go.th/webV3/` answered `curl` with "SSL certificate problem: unable to get local issuer certificate". `openssl s_client` showed why: the server's own certificate is from Let's Encrypt (YR1), but the chain it sends is Sectigo's and USERTrust's, which don't sign it. Chromium 141 opened the page (it fetches the missing certificate itself); whether LINE's and Facebook's in-app browsers on Android do, or show a security warning, is **[unverified]**.

- **Where the app links it:** `config.json → modes` (the dust mode's check link), dust today's "ไม่รู้ว่าวันนี้สีอะไร? ดูใน Air4Thai", the dust guide's line 1 and `/pm25`.
- **What would close it:** a real-phone test inside LINE on Android ([06-test-checklist](06-test-checklist.md), [ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix)). If it warns, add GISTDA's PM2.5 page (`pm25.gistda.or.th`, which itself says official alerts are Air4Thai's) as the second link, and tell the PCD (the fix is on their server: send Let's Encrypt's chain).
- **Confirmed again on 20 Oct at 20:43 UTC, and a server-side fix tested** ([docs/09 §3](09-server.md#3-air4thai-the-chain-diagnosed-and-a-fix-only-a-server-can-apply)): the leaf (valid 30 Sep–29 Dec 2026, with `air4thai.pcd.go.th` among its names) is issued by YR1, which the server doesn't send; nothing is expired. The `air4thai.com` mirror is the same server with the same chain (it only adds CORS `*`), so it is no workaround. A collector that adds Let's Encrypt's `int-yr1.pem` and the Root YR cross-sign by ISRG Root X1 (both from letsencrypt.org) as untrusted intermediates verifies strictly to the system's roots (curl and Node: 173 stations). The next certificate may come from another Let's Encrypt intermediate, so a collector ships them all and alerts on failure ([GUIDELINES rule 99](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### 87. The mask tool's lines for children, pregnancy and heart or lung disease need a doctor's read

**Status:** Owner · **Severity:** Medium: review before posting `/mask` widely

The mask tool (v1.12.0) gives when from the PCD's notice and which kind from the DOH (6 Feb 2025). The answers that matter most to the app's readers rest on thinner ground:

- **Children under 2: no mask** (the DDC spokesperson, InfoQuest, 27 Jan 2025; Health Canada agrees). The same article also lists muslin masks as suiting under-2s, so the line is ⚠️ `partial`.
- **Children of 2 to 5: "a 3-layer surgical mask that fits"** (the DOH says young children may use a surgical mask instead of an N95; the DDC article says surgical masks suit children from 2). No source gives a child size; ⚠️.
- **Pregnancy, older people, a long-term illness:** "an N95, or a 3-layer surgical mask instead" (the DOH). Singapore's MOH also says not to wear an N95 for long in later pregnancy; left out (one foreign source).
- **Heart or lung disease:** "follow your doctor's advice" (the PCD). "Ask before wearing an N95" is Singapore's alone and is left out.
- **Masks can't filter chemical fumes or the gases in smoke:** a Chulalongkorn academic (Amarin TV, 6 Jul 2021) and Health Canada; no Thai agency statement was read; ⚠️.
- **What would close it:** a paediatrician and a doctor (lung or heart) read the dust answers; an occupational-health reader (the DDC's กองโรคจากการประกอบอาชีพฯ) the clean-up and chemical-fire answers ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)); a Thai reader the two words for the kinds, "หน้ากาก N95" and "หน้ากากอนามัย" ([L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).

### 88. Agency links can move; they are checked by hand, monthly

**Status:** By design; Owner: run `npm run links` monthly · **Severity:** Low

Since v1.12.0 the all-tools page, the guides and the hazard pages link 13 agency pages (`kit.json → links`), each with the date it was checked. Government sites move pages, and some open on a special page first, so the links go to deep pages, never a home page (the build refuses the TMD's, RID's, the OIC's and the DOH's home pages), and LINE accounts by their exact id.

- **`npm run links`** opens each one and says ok, ERR or BLK (a bot check). On 21 Oct and again on 10 Nov 2026: 11 of 13 answered (their `checked` dates moved to 10 Nov); Air4Thai gave 503 to Node ([#86](#86-air4thais-server-sends-the-wrong-certificate-chain)), and PEA's planned-cuts page answered with its firewall's "Unauthorized Request Blocked", as it did to the researcher's headless browser. Neither is proof that the page is gone: open them on a phone.
- **The build warns** when a link's `checked` date is over 120 days old.
- **Look-alikes:** a Play Store search for "Thai Disaster Alert" shows foreign apps first, and DDPM's older "DPM Alert" is stale; the app names THAI DISASTER ALERT in the alert steps but doesn't link a store page (the two stores need two links, and LINE's browser may not leave for a store).

### 89. Emergency-alert menus differ by phone

**Status:** Owner (phone test) · **Severity:** Low

The all-tools page's "📲 เปิดรับข้อความเตือนภัยในมือถือ" gives DDPM's steps (Thansettakij, 19 Jan 2026): on iPhone, Settings → Notifications → the bottom → Emergency Alerts (or TH-ALERT) and Amber Alerts; on Android, Settings → Safety and emergency → Emergency alerts → allow, all kinds. Thairath (9 Jul 2026) says the menus differ a little by make and model ("การแจ้งเตือนฉุกเฉินไร้สาย" on some Android phones), so the card says so and is ⚠️.

- **Left out:** the alert levels (only "National Alert" for the January test comes from DDPM; the Extreme/Informational counts come from an opposition analysis) and "full screen" (the sources say a sound and a pop-up).
- **What would close it:** row 79 of [06-test-checklist](06-test-checklist.md) on a Samsung, an Oppo or Vivo, and an iPhone; reword the steps to what the phones show.

### 90. Heat today rests on news reports quoting the agencies

**Status:** Owner · **Severity:** Medium: review before posting `/hot` widely

Heat today (v1.13.0) asks which level is announced today and shows what to do. Every line comes from a news report quoting an agency, read word for word on 20 Oct 2026; no agency page could be read (the TMD's heat-index page answered 503, [#78](#78-a-heat-index-calculator-is-not-built)):

- **The four levels and what to do:** Post Today quoting the BMA (2 Apr 2026: 27.0–32.9 เฝ้าระวัง, 33.0–41.9 เตือนภัย, 42.0–51.9 อันตราย, 52.0 °C and over อันตรายมาก, and each level's lines) and Daily News quoting the DOH Director-General (7 Apr 2026: drink water, cut time in the sun, avoid the sun and move activities, stop outdoor activity); THE STANDARD (3 May 2024) maps the DOH's colours to the BMA's names.
- **Who is at risk and the signs:** THE STANDARD and MGR Online quoting the DOH (14 Mar 2026). **First aid:** Thansettakij quoting the DMS and Lerdsin Hospital (5 Apr 2023) and Khaosod quoting the BMA's Medical Department (26 Feb 2026): call 1669, shade and moving air, lie down with the feet raised, loosen clothes, cold wet cloths at the neck, armpits and groin and a fan.
- **Left out:** the BMA's "11.00–15.00" (one source), CPR (a skill, not a line; the guide and 1669 cover it), and any formula: the tool computes nothing, so it shows no number the agencies didn't publish. "ยังไม่รู้ระดับ?" links the TMD's warnings.
- **The sweating sign, for the reviewer.** The heat guide (v1.9.0) says "ตัวร้อนจัด เหงื่อไม่ออก สับสน รีบโทร 1669"; the DMS says that early in heatstroke a person may still sweat, so heat today adds "ยังมีเหงื่อออกอยู่ ก็เป็นฮีทสโตรกได้". They don't contradict each other, but someone who is sweating might rule heatstroke out from the guide alone. The reviewer decides whether the guide's line changes; changing it is a change of published advice and needs an "UPDATE:" post ([GUIDELINES §2.4](GUIDELINES.md#24-changing-advice-that-is-already-public)).
- **What would close it:** a person opens the TMD's heat-index page and a DOH page with the levels and confirms them; a doctor reads the first aid ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 91. Six tools rest partly on foreign guidance

**Status:** Owner · **Severity:** Low

The amounts in the v1.13.0 tools are Thai (3 litres a person a day, the PRD; the chlorine doses, the MWA and the DDC; what to say to 1669, NIEMS; the medicine list, the Pharmacy Council), but some of their lines are ⚠️ `partial` because only a foreign agency, a study or a news report says them:

- **Water:** "children, nursing mothers, sick people and hot weather may need more" and "drink enough; don't ration unless the authorities tell you to" (Ready.gov only).
- **The tank:** "buy chlorine whose label states its strength (%)": a Department of Science Service study found 7 of 17 products without it; no agency says the sentence.
- **The emergency card:** "keep it in your wallet or as a lock-screen picture" (adapted from the Pharmacy Council's medicine book) and "tell the family where it is" (FEMA's guide for older adults). The UK's "Message in a Bottle" (a form in the fridge) was left out: Thai responders don't know to look there.
- **"I'm safe":** "a text may get through when a call won't" (the American Red Cross) and "agree beforehand how you'll reach each other, and where to meet" (Ready.gov). No Thai agency page on telling family you're safe was found.
- **The bag:** cash and relatives' numbers (the Department of Mineral Resources' earthquake list, through Daily News), and the baby, older person and pet rows (that list and Ready.gov, FEMA).
- **What would close it:** Thai sources for these lines, added beside the foreign ones, and the reviewer's read ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

### 92. The tank's soak time: overnight or 3 hours

**Status:** By design (v1.13.0); Owner: the reviewer picks · **Severity:** Low

The MWA's leaflet says leave the chlorine in overnight ("แช่ทิ้งค้างคืน 1 คืน"); the DDC's November 2025 manual says 3 hours. Their doses agree (5 % liquid 100 ml, 10 % liquid 50 ml, powder about 8 g per 1,000 litres; the MWA: 5 mg per litre, the WHO's figure), so the tool computes those and shows both times in one line: "แช่ไว้: กปน. แนะค้างคืน 1 คืน กรมควบคุมโรคแนะ 3 ชั่วโมง". Amounts are rounded: grams to the gram, millilitres to 5 from 20 ml up; another size up to 100,000 litres can be typed.

- **What would close it:** a reviewer (or the MWA) says which to give, or that both are fine.

### 93. Cloudflare's bot detection sets a cookie

**Status:** Owner (a Cloudflare setting) · **Severity:** Medium: the app promises no cookies

Visitor audit 4 (21 Oct 2026) found, and a headless check confirmed, that the first page view loads Cloudflare's `/cdn-cgi/challenge-platform/…/jsd/main.js` and ends with a `cf_clearance` cookie (HttpOnly, Secure, a year long) on `.autobahn.bot`, the parent domain. The app sets no cookie of its own, and Web Analytics is cookieless; this one comes from Cloudflare's bot protection ("JavaScript detections", part of Bot Fight Mode or Super Bot Fight Mode), a setting of the whole `autobahn.bot` zone, so it may affect the owner's other sites too.

- **Since v1.13.1** the About text says so: "แอปไม่ใช้คุกกี้ (ระบบกันบอตของผู้ให้บริการเว็บอาจตั้งคุกกี้ความปลอดภัยไว้ 1 ตัว)" / "the app sets no cookies (the web host's bot protection may set one security cookie)".
- **What would close it:** the owner turns off JavaScript detections for the zone (Cloudflare dashboard → the `autobahn.bot` zone → Security → Bots), or adds a rule that skips them for `baanrodmai.autobahn.bot`; then the About text goes back to "ไม่ใช้คุกกี้" and a live headless check (`context.cookies()` after a page load) shows none. An assistant doesn't change the zone's security settings ([GUIDELINES rule 96](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Bot Fight Mode itself must stay off.** The owner's FloodWatch, on the same zone, found on 26 Sep 2026 that with Bot Fight Mode on, Cloudflare answered `curl` and LINE's and Facebook's link-preview fetchers with a challenge (HTTP 403, `cf-mitigated: challenge`), so previews broke for every `*.autobahn.bot` site; the owner turned it off that day, and page rules could not skip it. Turning off JavaScript detections must not mean turning Bot Fight Mode back on, and a live `curl -sI` with LINE's user agent after any change should still get 200 ([docs/08 §3](08-open-data.md#3-how-it-could-work-without-the-location-leaving-the-phone)).

### 94. Leftovers of visitor audit 4

**Status:** Open (AI-ready, one needs a source) · **Severity:** Low

- **The phone's Back still closes the sheet.** Since v1.13.1 a tool opened from another tool or from the list says "‹ เครื่องมือทั้งหมด" or "‹ เช็กของจำเป็น" at its top, but the phone's Back button closes the sheet; a tool opened from a guide has no way back to the guide (the guide case of [#83](#83-leftovers-of-visitor-audit-3)). A sheet stack in the history would close both.
- **A household measure for the tank** (A17): "8 กรัม" and "100 มล." with no spoon or cup, and people know "น้ำยาฟอกผ้าขาว", not "คลอรีนน้ำ 5%". Needs a Thai source that gives the equivalent; none was found.
- **Previews at chat size** (A16): the second line is about 8 px at 300 px wide. v1.13.1 gave each tool its own look and icon; a larger second line needs a new layout.
- **Names that still differ** (B12): the game's mode "หลังน้ำลด" and the guide "10 ข้อเช็กก่อนกลับเข้าบ้าน" are the same subject under two names; the buttons now use the guide's own title.
- **Where the heat level is announced** (B8): the TMD's warning page lists heat warnings only in the hot season; whether it shows the heat-index level is **[unverified]** ([#90](#90-heat-today-rests-on-news-reports-quoting-the-agencies)).
- **App shortcuts** for the seven newer tools: the manifest has shortcuts for the home check, the guides, the plan, the fridge, dust today and all tools.

---

## Fixed

### In v1.18.2 (11 Nov 2026)

| # | Problem | Fix |
|---|---|---|
| F223 | **With the text at 125 %, a round's answers ran below the screen on the smallest phone** (#104): on 320 × 568, 53 of 82 English choice sheets scrolled (by up to 133 px) and 5 Thai ones, the third answer out of sight | Under 18.4em of width (320 px at 125 % text, 360 px at 125 % and more) the sheet may take the whole screen, the item's picture (already seen in the room) leaves the title its full width, and the answers sit closer (6 px gaps, line height 1.2). The answers keep the reader's size (20 px at 125 %) and stay 44 px or more. After: English 3 of 82 scroll (p-plan 7 px, r-cupboard 17 px, p-meds 38 px), Thai 0; nothing changes at 100 %. The smoke check builds all 82 sheets at 125 % in both languages |
| F224 | **Two English names for one bag** (#104, #83's B9): 4 lessons, the flood guide's first line and a topic said "go-bag"; the tool is "Emergency bag" | "emergency bag" everywhere in English. Two wrong answers gained a few words so the right one isn't the longest (rule 75); no Thai changed. Unit test: no "go-bag" in the content files |
| F226 | **CI's Chromium install failed the run** (11 Nov 2026, runs 60 and 61): the runner couldn't resolve Ubuntu's mirrors ("Temporary failure resolving 'archive.ubuntu.com'"), so `playwright install --with-deps chromium` couldn't fetch nine font packages, and the smoke job never started, while the same 238 checks had passed locally on all three dates. The session couldn't re-run the job (GitHub answered 403). Run 61 carried a first fix (retry the whole install) that failed too: `timeout` stopped `npx` but not its `apt-get`, which kept the package lock, so the next try failed on the lock | The browser download (`playwright install chromium`, from Playwright's host) retries three times, 3 minutes each, killed with `timeout -k`; the system packages are their own step (`install-deps`, 5 minutes, `continue-on-error`). The runner already has every library Chromium needs ("already the newest version" in the log); the step only adds fonts. Still on the runner's side: GitHub warns that `actions/checkout@v4` and `setup-node@v4` target Node 20 and are forced onto Node 24 (a warning, not a failure) |
| F225 | **The gas lesson's "why" didn't fit its carousel picture** (#104): flood page 7 ended "…ค่อยโทรขอความ…" | The Thai "why" says the same in 12 fewer letters ("ออกไปให้พ้นบริเวณก่อนแล้วค่อยโทรขอความช่วยเหลือ" → "ออกให้พ้นบริเวณก่อน แล้วค่อยโทรแจ้ง", the words of its own answer); the picture was re-rendered and `npm run images` reports no cut text. No advice changed |

### In v1.18.1 (10 Nov 2026)

| # | Problem | Fix |
|---|---|---|
| F217 | **With large text, the worst heat level and the red dust colour ran off the side** (visitor audit 6 H1): heat today's four levels sat in a row that never wrapped, so "อันตรายมาก 52.0 °C ขึ้นไป" was pushed 54 px off a 320 px screen at 150 % text (3–15 px at 125 % or 360 px); dust today's English "Red" was entirely off-screen | The rows halve their columns when they get narrow, measured in `em` so the browser's text size and ก+ both count: heat 4 → 2 × 2 under 16em, dust 5 → 3 + 2 under 14em (`clamp()` in the grid track, no media query). Same layout as before at normal text. Smoke check at 150 % |
| F218 | **Other sheets ran off the side at 150 % text** (M1): the plan's and the emergency card's boxes (20 px), the water rows (6 px), the English mask tiles (29 px), a guide's English tool button (17 px), the English dust units (11 px) | The boxes fill their width (`min-width: 0`); the water stepper goes under its name; two-button rows (`.btn-row`), the mask tiles and the dust units go to one column under 14em. A probe of 13 sheets × 2 languages × 2 widths × 3 text sizes finds nothing past the edge; the smoke check covers 7 sheets in both languages |
| F219 | **The print pack was hard to find, and couldn't print from LINE** (M2, M3): the in-app "all tools" sheet never mentioned it; inside LINE, `/print` showed a print button LINE can't use, and the guide's "open in browser" link said it was for sharing the image | "🖨️ ชุดพิมพ์แจก 9 เรื่อง" in the tools sheet; inside LINE, `/print` shows "🌐 เปิดในเบราว์เซอร์ เพื่อพิมพ์" (LINE's `?openExternalBrowser=1`) instead of the print button; the guide's link says "เพื่อแชร์รูปหรือพิมพ์เก็บไว้". Smoke check with LINE's user agent |
| F220 | **Thai words broke in the middle** (M4): "เปลี่ยนแบ\|ต" on `/fire` at normal text, "เก็บแบ\|ต", "ออกกำ\|ลัง", "ภูมิ\|แพ้", "เช็\|กอาการ" at larger sizes | แบต, ออกกำลัง, ภูมิแพ้ and เช็ก added to `keepTogether` (251 words); the water sizes and the supplies amounts keep each number with its unit (a no-break space, as heat's °C) |
| F221 | **Printed addresses differed from their QR codes, and the review note read as being about the last source** (low 2, 3): the app's printed guide said "…/checklist/landslide" while its code opened `/landslide`; the print pack captioned both flood guides ".../flood" while their codes open `#cl-prepare` and `#cl-return`; the app's printed code had no caption; "· ⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" came last in a sources line, after Ready.gov; four Thai wordings of the review note | Every printed address is the code's own (anchor included); the app's code has "สแกนอ่านฉบับเต็มและที่มา" under it; on paper the guide-wide note is its own line in the guide's words ("⚠️ ข้อที่มีป้ายนี้ยังรอตรวจทานกับหน่วยงาน"); per line, one wording everywhere: "ข้อนี้ยังรอตรวจทานกับหน่วยงาน" / "still being reviewed with the agency". The 5 power-cut carousel images that print it were re-rendered |
| F222 | **Smaller things the audit found** (low 5–7, 9): the tools sheet's date ("20 ต.ค. 2569", unlike "4 พ.ย. 69" elsewhere); dust today refused "45 มคก." ("type a number"); the plan reminder put pets under "ใครดูแลแต่ละคน" ("each person"); `/en/uv`'s title ended "Baan Rod Mai? Home safety"; and, found while re-rendering, three carousel images cut their "why" mid-sentence with nothing to show it | The tools sheet's date like the cards'; a reading with the box's own unit is read ("45 มคก./ลบ.ม.", "45 µg/m³"; "AQI 80" in the AQI box), the other box's unit still asks for a number (an AQI is not a PM2.5 reading); "ว่าใครจะเป็นคนดูแล"; the UV title ends with the brand; a carousel "why" may take a fourth line when the page has room (two of three now whole), else ends in "…", and `npm run images` names every cut |

### In v1.18.0 (10 Nov 2026)

| # | Problem | Fix |
|---|---|---|
| F216 | **The home check described one home only** (#84): the grown-up child who organises supplies for older parents in another home could size only their own, or had to overwrite their answers to check the parents' | "🏠 บ้านเรา / 🏡 บ้านพ่อแม่" under the sheet's title: the parents' home has its own two questions, list, score, print and card ("บ้านพ่อแม่พร้อมแค่ไหน?"), kept in `brm:kit2`. Every way in opens บ้านเรา; the start screen's score, the plan's reminder, the water and the bag stay with it, and the parents' list hides their buttons. Unit test: every line that names the home has a parents' twin with the same placeholders. Smoke section 11a: 7 checks at 320 × 568 ([KNOWLEDGE §44](KNOWLEDGE.md#44-a-second-household-the-parents-home-v1180)) |

### In v1.17.0 (4 Nov 2026)

| # | Problem | Fix |
|---|---|---|
| F215 | **No way to put the guides on paper with a way back to them** (#84, ROADMAP P5b): a printed guide named its address in words only, and the nine guides could only be printed one by one from the app | `/print` and `/en/print`: the nine guides, one per A4 page (the screen's header hidden in print), each with the date, its helplines and whom they reach, its sources and a QR code. The codes are drawn at build time (`qrcode-generator`, a dev dependency; nothing new runs on the phone) into `/qr/`, and lead to the guide's hazard page, which opens without the app and gives each line its source (`/flood#cl-prepare`, `/landslide`). The app's own printed guide carries its code too, and waits up to 2 s for it to load. A game guide's sources line lists the agencies behind its mode's lessons (its lines have none of their own). Unit test: every code decoded by an independent decoder (`jsqr`) reads back the exact address; checked again from the printed PDF at 150 dpi (18 of 18). Smoke checks: printed to A4 PDF, one page per guide in each language; the printed guide's code loaded before the dialog |

### In v1.16.0 (4 Nov 2026)

Three items the owner said to continue with (#73, #81, #68), each measured with a probe before and after.

| # | Problem | Fix |
|---|---|---|
| F211 | **20 of 82 English choice sheets scrolled at 320 × 568** (#73), by up to 75 px (`p-meds`); 18 of them fitted once "⏸️ Time paused — take your time" stopped taking a line of its own (about 30 px) | Under 22.4 em wide (359 px at the default text size), English shows "⏸️ Time paused" (`timePausedShort`, the full line stays the label read aloud); on 320 px phones under 40 em tall the letter box is 28 px and the answer's padding and the margins smaller, so its text gets about 12 px more width. The text keeps its 17 px. 0 of 82 sheets scroll in either language at 320 × 568, 320 × 640, 360 × 640 and 390 × 844, measured with a probe that opens each item's real sheet after its animation. Smoke check "the longest English choice sheet (p-meds) fits at 320 x 568" |
| F212 | **Text sizes ignored the browser's text setting** (#81): 170 sizes in `px` | 174 font sizes in `app.css` are in `rem` (`17px` → `1.0625rem`), the two `line-height`s in `px` are `1.5rem`, the pages' `body` is `1.0625rem`, and the eight width and height breakpoints are in `em`; the round's top bar, room tabs and room bubble keep `px`. Unit test "text follows the phone"; smoke check "text at 150 %" |
| F213 | **The ⚠️ note could not wrap** (`.flag{white-space:nowrap}`): it pushed `/flood` 1 px sideways at 320 px with normal text, and 75–130 px with larger text; a source shown by its site name ("multimedia.anamai.moph.go.th") did the same | The note wraps after "· ⚠️" (kept together); a source link's label may break inside itself when it must (`overflow-wrap:anywhere`). 64 pages × 3 text sizes at 320 px: none scrolls sideways |
| F214 | **The guides' previews showed "เบอร์ช่วยเหลือ 1784 · 199 · 1669"** (#68), about 8 px tall at chat size and the only numbers in the app without whom they reach; their English twin said "Free · from official safety advice", and the guides' page description listed six bare numbers | "ฟรี · ทุกข้อบอกที่มา" / "Free · every line names its source" on the 18 guide previews (re-rendered), and a description without numbers in both languages. Unit test "link previews show no helpline number without whom it reaches" |

### In v1.15.2 (4 Nov 2026)

F205 from the owner's two screenshots of the live v1.15.1 on an Android phone in Chrome (4 Nov 2026): the start screen and the home check. F206–F210 are visitor audit 5's AI-ready leftovers (#103) and one break seen in the 320 px check of v1.15.1.

| # | Problem | Fix |
|---|---|---|
| F206 | **Two copy buttons on a card's share sheet with nothing to tell them apart** (#103 A8): "คัดลอกข้อความ" (the invitation) beside "คัดลอกแผนเป็นข้อความ" (the plan) on the plan and emergency-card sheets, and "🛒 คัดลอกรายการที่ยังขาด" on the home check's | The card's own text comes first, as a full-width button under the hint; then "ชวนบ้านอื่นมาทำด้วย" / "Invite other homes to make theirs" over the share buttons, whose copy says "คัดลอกคำชวน" / "Copy the invitation". "คำชวน" is kept together. Smoke check "plan card: "copy the plan" comes before the share buttons" |
| F207 | **Heat today's level buttons had no unit** (#103 A13), while its answer says "ดัชนีความร้อน 33.0–41.9 °C" | Each button says "33.0–41.9 °C" or "52.0 °C ขึ้นไป"; each number keeps its °C, so at 320 px a range wraps after its dash, and "ขึ้นไป" is kept together. Smoke check "heat today: every level button carries °C" |
| F208 | **The dust number box said nothing useful for "abc", Thai digits ("๘๐") or a number above its limit** (#103 A14): each showed the usual "แตะสีด้านบน…" | `readNumber()` in `kitplan.js` reads Thai digits and both commas ("1,500", "37,5"), for dust today, water and the tank; `airCheck()` says why a reading gives no answer: "พิมพ์เป็นตัวเลข เช่น 45…", or "ตัวเลขเกินที่ช่องนี้รับได้ (999)…". Unit test; smoke check "dust: "abc" says type a number; "๘๐" gives the level for 80" |
| F209 | **The pages dated themselves in ISO** ("ปรับปรุงล่าสุด: 2026-11-03", #103 and #83 B16) while the app's cards say "4 พ.ย. 69" | The build formats the date with the app's own `formatHouseDate()`: "4 พ.ย. 69" / "4 Nov 2026"; `<time datetime>` keeps ISO. Smoke check (with F210) |
| F210 | **A source link's comma could start a line** (", 2022" under a `/flood` line at 320 px): the links are 44 px inline blocks, and a line may break on either side of one | `srcGroups()` keeps each comma inside a no-wrap span with the link before it. Smoke check "pages: no source link leaves its comma to start a line" |
| F205 | **The ภัยรอบบ้าน link's line broke inside "ที่เว็บ"** ("…ทุกตำบล ที่ / เว็บ ภัยรอบบ้าน") on phones under 393 px wide: v1.15.1's longer wording ("น้ำท่วม", "อากาศร้อน") made it wrap, and Thai line breaking split the phrase | "ที่เว็บ" added to `config.json → keepTogether`: measured in headless Chromium at 320 and 360 px it now breaks "…ทุกตำบล / ที่เว็บ ภัยรอบบ้าน", and stays on one line at 393 and 412 px |

Also confirmed on the phone: the supplies tile says "ตามจำนวนคนในบ้าน" after a first look (F202), and the version reads v1.15.1. Inside the home check, "พร้อมแล้ว 0% (มี 0 จาก 11 อย่าง)" before any tick is progress beside the list and stays ([GUIDELINES rule 105](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### In v1.15.1 (4 Nov 2026)

The Thai read the owner asked to finish (4 Nov 2026: "suggest, then validate and make it finish") of the fridge's words (#103 A11), the flood and UV lines (#99, #100) and the gecko's words (#98), each line checked against the agencies' own words in `sources.json`, plus one thing seen on the owner's phone photo. No advice, number, source or `verify` changed; no item or slot, so houses and challenge links are the same.

| # | Problem | Fix |
|---|---|---|
| F200 | **The fridge said "เกิน 4 ชม.แล้ว" at exactly 4 hours** (A11): the CDC's limit is reached, not passed, and "เกิน" read as if the reader was already late | At the limit and after it: "ครบ 4 ชม.แล้ว" / "4 hours or more"; the same for the freezer, breast milk, insulin's 28 days and other medicine's day ("ครบ 1 วันแล้ว ดูฉลากก่อนใช้"); "❌ ถ้าครบ 4 ชม. ต้องทิ้ง"; the hint "ถ้าไม่มีปุ่มที่ตรง ให้เลือกเวลาที่นานกว่า". The status logic is unchanged (`left <= 0`). Smoke check "fridge: "4 ชม." → the fridge reads "ครบ 4 ชม.แล้ว"" |
| F201 | **The fridge's share row showed before any time was tapped** (A11), unlike the mask, heat, water and tank tools | It shows once a time is tapped. Smoke check "fridge: the share row shows only after a time is tapped" |
| F202 | **"บ้านเราพร้อม 0%" on the start screen after a first look** at the home check (the owner's phone photo, 4 Nov 2026): opening the list saved a score of 0 before anything was ticked | The tile keeps "ตามจำนวนคนในบ้าน" until something is ticked, then the score. Smoke check "home check: the start screen tile says its plain line until something is ticked" |
| F203 | **Flood and UV lines that read unclear in Thai** (#99, #100): a missing "ถ้า", "ต้องการคนช่วย", "สับคัตเอาต์" where most homes have breakers, "เผาตา", a levels heading that read as a statement | Reworded with the agencies' own words where they exist; no level's first line changed; details in [#99](#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid) and [#100](#100-the-uv-lines-rest-on-who-and-on-news-reports-quoting-thai-agencies-the-thai-is-ours). ภัยรอบบ้าน copies these lines, so the hand-back lists each change ([docs/10 §4](10-family.md#4-hand-back-to-ภัยรอบบ้าน-paste-into-a-thai-risk-session)) |
| F204 | **The gecko's words were drafts in the owner's name** (#98) | Read and kept, two reworded (`heroReturn`, `riskLinkSub`); [#98](#98-the-geckos-lines-and-the-ภัยรอบบ้าน-link-are-drafts-in-the-owners-name) |

### In v1.15.0 (3 Nov 2026)

N18, visitor audit 3's AI-ready leftovers (#83) and visitor audit 5 (an independent walk of the live v1.14.3, 3 Nov 2026: 204 page loads, every sheet, LINE's browser at 320, 360 and 390 px, Thai and English; 0 blocker, 0 high, 6 medium, 11 low; [ROADMAP N34](ROADMAP.md#n34-visitor-audit-5-and-audit-3s-leftovers-v1150)).

| # | Problem | Fix |
|---|---|---|
| F181 | **Every visitor downloaded the source notes** the app never shows (#62): `sources.json` was 46.9 KB of the start screen's 304 KB compressed | The build writes `content/sources-app.json` (agency, title, link, date, kind; 15.6 KB) and the app loads it; `sources.json` stays whole for editing and for ภัยรอบบ้าน. 274 KB; every generated page unchanged; a unit test holds the copy |
| F182 | **A tool opened from a guide led back to the start screen** (B12) | "‹ <the guide>" at the tool's top reopens the guide (smoke, Thai and English) |
| F183 | **No test held one short and one long name per tool** (B13); `/kit`'s page said "…รับมือทุกภัย" while its sheet said "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" | A unit test: the short name on the hub and `/tools`, the long name the same on the sheet and the page (the plan card's own heading excepted); `/kit`'s title, heading and preview take the sheet's name |
| F184 | **The same agency twice in a source line** (B23; 11 of 44 lessons on `/flood`; 92 lines on 8 pages in audit 5's count, A18) | One agency name, then a link per source; news reports marked; the label unique within each group (740 source lines, none repeated) |
| F185 | **`/en/no-such-page` got the bilingual 404** (B24) | `en/404.html`, English only, links in English |
| F186 | **The plan form started with the shelter** (B29) | It starts with the meeting place and ends with the shelter |
| F187 | **"U.S." and "US" both** in the English agency names | "U.S." throughout, the agencies' own spelling |
| F188 | **The plan card cut whom 1130 reaches:** "ไฟดับ กทม. นนทบุรี" without "สมุทรปราการ" (A1) | The label shrinks to fit two lines, else takes a third (`drawCalls()`) |
| F189 | **Heat today's sources were news reports with nothing to say so** (A2) | Marked " (ข่าว)", and one ⚠️ note on the page and in the sheet (`kit.json → hot.note`) |
| F190 | **`/uv` previewed as the heat guide**, with no brand in its title (A3) | `og/uv.png` (+ English) and " · บ้านรอดไหม?" |
| F191 | **"เปิดในเบราว์เซอร์" inside LINE opened the start screen** from a guide or a result (A4) | The guide's `/checklist/<id>`, or the result's own link |
| F192 | **`/tools`'s agency links were 19 px tall** (A6) | 44 px (`a.tool-a`) |
| F193 | **"อ่านเหตุผลและที่มาทีละข้อ" from the after-the-flood guide opened the top of `/flood`** (A7) | `/flood#return` (each mode's lessons) |
| F194 | **The Air4Thai row looked like the dust-today tool** (A9: "ค่าฝุ่นวันนี้ (Air4Thai)", the same icon) | "ค่าฝุ่นจากสถานีวัดของ คพ. (Air4Thai)", 📡 |
| F195 | **A guide's "now" tool appeared twice** (A10) | Not repeated in the tool row |
| F196 | **A guide opened with a focus ring on its first button** (A12) | The heading takes the focus |
| F197 | **1323 said "after the flood" on every page** (A15) | "หลังเกิดภัย" / "after a disaster" |
| F198 | **American English:** "canned food" ×4, "A first aid kit" (A16) | "tinned", "first-aid" |
| F199 | **At 320 px a line started "· English", or ended on a lone "·" before ⚠️** (A17) | The separator stays with what it introduces |

### In v1.14.3 (3 Nov 2026)

From ภัยรอบบ้าน's question B28 (3 Nov 2026), forwarded by the owner ([docs/10 §4](10-family.md#4-hand-back-to-ภัยรอบบ้าน-paste-into-a-thai-risk-session)).

| # | Problem | Fix |
|---|---|---|
| F178 | **Water off the hills had only the general เตรียมตัว line** ("น้ำอาจมาถึง ยกของ…"), which ภัยรอบบ้าน shows when HII's flash-flood list sets the level; a flash flood comes fast, and what only it needs (be ready to leave; go at once when a stream turns muddy or roars) wasn't there | `flood.flash`, its own line (DMR and DWR, through news reports, ⚠️), on `/flood#flash` with a link to `/landslide#landslide-during`; the เตรียมตัว line is unchanged (DDPM's own flash-flood alert also says to lift belongings) |
| F179 | **`flood._readme` named the wrong causes** of ภัยรอบบ้าน's flood row (heavy rain and TMD's notices, which set its rain row) and left out HII's flash-flood list | The causes as ภัยรอบบ้าน stated them: a gauge against its bank, an agency's table, FloodWatch's look ahead, a late gauge, a tidal gauge, HII's list; a dam above is information |
| F180 | **A source with no date showed "·" as its link**, which read as a broken link | It shows its site's name (`srcDates()`) |

### In v1.14.2 (3 Nov 2026)

From FloodWatch's review of the hand-back (2 Nov 2026), forwarded by the owner ([docs/10 §6](10-family.md#6-hand-back-to-floodwatch-paste-into-a-floodwatch-session)).

| # | Problem | Fix |
|---|---|---|
| F174 | **The flood lines ภัยรอบบ้าน shows, and the eight "during" lines, rested on news reports only** (FloodWatch: "news reports can point to them but shouldn't be the source") | The agencies' own documents lead where found (RID's pages, PEA's page, DDPM's phone alert, a municipality's plan quoting the national plan); news reports are marked "(ข่าว)" on the page; the four parts with no original show ⚠️ with a note; a unit test holds it ([#99](#99-the-flood-lines-for-ภัยรอบบ้าน-rest-on-news-reports-quoting-ddpm-and-rid)) |
| F175 | **"During" led with belongings; when to leave came last** | When to leave first ("ถ้าเจ้าหน้าที่ให้อพยพ ออกทันที…"), then people, the way out, then belongings; no line promises a dry house (a unit test reads the order and the words) |
| F176 | **The app wasn't ready for FloodWatch to close:** an empty `forecastAppUrl` drew a "placeholder" warning, and the smoke test required a FloodWatch button | Empty now means "no rivers' link": no warning, the guide check expects no button; a copy with it empty passed the build, 46 unit and 212 smoke checks, and linked FloodWatch nowhere ([#102](#102-floodwatch-closes-after-its-handover-the-rivers-link-goes-with-it)) |
| F177 | **The addresses FloodWatch links** (`/`, `/learn`, `/checklist/prepare`, `/checklist/return`) **weren't held by a test** | Added to the unit test beside `/flood#during` |

### In v1.14.1 (2 Nov 2026)

Found by opening every page ภัยรอบบ้าน links into this app as a visitor arriving from it (14 links and anchors, Thai and English, 320, 360 and 390 px, LINE's browser), after its v0.11.2 took the hand-back ([APPROACH §38](APPROACH_AND_METHOD.md#38-arriving-from-the-sister-app-walk-in-through-its-links-v1141)).

| # | Problem | Fix |
|---|---|---|
| F170 | **"While the water is rising" had no way in from the top of `/flood`:** it sat after both checklists with no jump chip (v1.14.0 dropped the chip because a third one pushed the English list below the first screen) | In time order, between the two lists, with short chips ("ก่อนน้ำมา · น้ำกำลังมา · หลังน้ำลด", "Before · While it rises · After"): one row at 320 px in English; in Thai the third chip takes a second row at 320 px and the list still starts on the first screen (smoke, 320 × 460) |
| F171 | **Arriving at a level gave no sign of it:** ภัยรอบบ้าน links `/uv#uv-<id>` for the day's UV, and the page scrolled there with nothing to say which level was meant | `li:target` draws the level as a framed card, without its bullet, on `/uv` and `/flood#level-*`; smoke checks the frame and its place in Thai and English |
| F172 | **A level's lines ran together** (joined by `<br>`): in English "Around midday, avoid being outdoors / If you must go out, always find shade …" read as one paragraph | One bullet per line (`kitLines()` in the build) |
| F173 | **Sources read "2026, 2026, 2026"** under a flood line resting on three DDPM reports of one year: three links with one label | The month too when an agency's years repeat ("ต.ค. 2026", "Oct 2026"), and the day if that still repeats (`srcDates()`); smoke checks that no agency has two links with one label |

### In v1.14.0 (2 Nov 2026)

Found while fitting this app to the owner's other two apps (ภัยรอบบ้าน and FloodWatch), from the owner's brief of 1 Nov 2026 and checked against both apps' live pages ([docs/10](10-family.md), [APPROACH §37](APPROACH_AND_METHOD.md#37-fitting-the-family-check-the-brief-then-source-what-the-sister-app-needs-v1140)).

| # | Problem | Fix |
|---|---|---|
| F164 | **The start screen stated a live condition it couldn't source.** The gecko said "ฝนจะมาอีกระลอก มาเตรียมบ้านกัน!" from the hand-set `rainWarningActive` (on until 30 Nov 2026), "น้ำลดแล้ว" in the after-the-flood mode and "ฝุ่นมาอีกแล้ว" in the dust mode, for the whole country; in November the south's east coast is in its wettest months while most of the country dries | The switch is removed (the build fails if it returns); the three lines claim nothing about this week; the start screen links ภัยรอบบ้าน, which says what is happening at the reader's subdistrict; a unit test reads every gecko line ([GUIDELINES rule 100](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) |
| F165 | **The season recommended "after the flood" to the whole country** from June to November whenever the switch was off: `seasonalMode()` skipped the flood modes' own months | Each mode's months decide: ก่อนน้ำมา May–November (its months were already in `config.json`), dust December–March, fire April; หลังน้ำลด opens only from a link |
| F166 | **FloodWatch was the only route to "now"** (the start screen's, the guides', the result's and the help sheet's water-level link), while the owner has said it may close | ภัยรอบบ้าน first, in the reader's language, everywhere; FloodWatch after it as "🌊 ระดับน้ำในแม่น้ำ คลอง (FloodWatch)", the rivers' link ([docs/10](10-family.md)) |
| F167 | **An expired alert stayed in `config.json`** (landslide, until 25 Oct 2026; hidden by its date, warned by the build) | Cleared; since v1.14.0 an alert also needs `source`, the https link of the agency notice it rests on (the build checks) |
| F168 | **`/uv` answered 404**, and UV was the one hazard on ภัยรอบบ้าน with neither a line nor a guide | `kit.json → uv` (WHO's bands and messages, the TMD's and MOPH's words) and `/uv` + `/en/uv`, in the sitemap and `llms.txt` |
| F169 | **`/flood` had nothing for while the water is rising**; ภัยรอบบ้าน's flood row at เสี่ยงสูง linked a page about before and after | `/flood#during` (eight lines) and `#levels` (what to do first at ติดตามไว้, เตรียมตัว, เสี่ยงสูง), from `kit.json → flood` |

### In v1.13.1 (21 Oct 2026)

Found by visitor audit 4 on the live v1.13.0: auditor A an older relative in LINE at 360 × 640 and 320 × 568 with ก+ (20 findings, A1–A20), auditor B an English reader and a consistency checker at 390 and 360 px (20, B1–B20); six overlapped. Every finding was checked against a screenshot or the code before it was fixed ([ROADMAP N27](ROADMAP.md#n27-visitor-audit-4-v1131)).

| # | Problem | Fix |
|---|---|---|
| F131 | A1, B11: **The water tool's answer appeared off-screen**: after a tap on + only the count changed; the answer was below "อื่นๆ (ลิตร)" (top 657 on a 640 px screen) | A line under "มีน้ำดื่มเท่าไร?" says the answer as you count ("💧 พอดื่มราว 2 วัน · ดูรายละเอียด"); "ดูรายละเอียด" scrolls to the full answer |
| F132 | A2: **Heat today's "โทร 1669 ทันที" was plain text** | A 1669 button (tap to call, with "เจ็บป่วย") under the first aid; `telChips()` draws every tool's numbers the same way, and taps count as `help_click` |
| F133 | A3: **No phone numbers near the top**: the start screen's list is below the game; the all-tools sheet had none | The all-tools sheet opens with 1784, 199 and 1669 as buttons |
| F134 | A4: **The emergency card's two copy buttons** read alike and did different things | "📋 คัดลอกข้อมูลในบัตร" / "Copy the card's details" for the card's text; the share row's "คัดลอกข้อความ" stays the message with the link |
| F135 | A5: **"กระเป๋าฉุกเฉิน" was clipped on its hub tile with ก+ at 320 px**: kept whole by `keepTogether`, it couldn't wrap | "กระเป๋า" and "ฉุกเฉิน" are kept separately, so the title wraps between them |
| F136 | A6, B6: **Heat today's preview**: "อา\|การ", the fire helmet instead of the sun hat, "ตามกทม."; the English pill was cut off | อาการ kept whole; the heat guide's look and sun hat; "ตาม กทม."; "Thai agencies' advice, free" |
| F137 | A7: **Thai words broken mid-word**: ขา\|หนีบ, เบา\|หวาน, โรง\|พยาบาล, รถ\|พยาบาล, ล่วง\|หน้า, ส่วน\|ตัว, ต่าง\|ประเทศ, ปวด\|หัว, ทะเบียน\|บ้าน, เฝ้า\|ระวัง, บ้าน\|รอดไหม | All 11 added to `config.json → keepTogether` |
| F138 | A8: **The alert card ended "· ⚠️ ⚠️ ข้อที่มีป้ายนี้…"** with no line marked | ⚠️ on the line that needs it (menus differ by phone), and the note once |
| F139 | A9: **Fold-out cards didn't look like they open** | A ▾ that turns when open, on every fold-out card in the tools |
| F140 | A10: **The bag's "แก้คำตอบ"** opened the home check's list and left the person there; before any answer it said "change answers" | From the bag, the home check asks its two questions and goes back to the bag; with no answers the link says "ตอบ 2 ข้อ" |
| F141 | A11, B7: **No way back to the list** from a tool opened from all tools, or to a tool opened from another tool | "‹ เครื่องมือทั้งหมด", "‹ เช็กของจำเป็น"… at the top of a tool opened from one; the phone's Back still closes the sheet ([#94](#94-leftovers-of-visitor-audit-4)) |
| F142 | A12: **The relief link's scam warning** ran on after where to apply, in orange 14 px at 3.81:1; the game card's "แนะนำช่วงนี้" badge was white on coral at 2.57:1 | The warning is its own line, "🚫 อย่ากดลิงก์ใน SMS หรือ LINE ที่ให้ "สำรวจบ้าน" หรือรับเงิน" (`links[].warn`, sourced and checked by the build); notes at 5.9:1, the badge 5.35:1 |
| F143 | A13, B14: **The card's person tab read "ทำบัตรของ 1"**, even after a name was typed | "คนที่ 1" / "Person 1", and the name as it is typed |
| F144 | A14, B8: **"ดูประกาศกรมอุตุฯ"** promised the level; the page shows the TMD's weather warnings | "ดูประกาศเตือนของกรมอุตุฯ" / "The TMD's weather warnings" |
| F145 | A15: **`/tools`'s tool links were 19 px tall** | 44 px, like the other links on the pages |
| F146 | A16, B5: **The previews looked alike** (water, the card and all tools the same gecko), and `/tools`'s description and preview named only the older tools | Each tool its hazard's look and its own icon as a sticker; the description and preview list the newer tools (rule 59) |
| F147 | A18: **"ใช้ N95 หรือหน้ากากอนามัย 3 ชั้นแทนก็ได้"**: instead of what? | "ใช้ N95 หรือจะใช้หน้ากากอนามัย 3 ชั้นแทน N95 ก็ได้"; same advice, same source |
| F148 | A19: **The emergency card's footer** said "ติดต่อช่างหรือเจ้าหน้าที่" (the plan card's) | "บัตรนี้เจ้าของบัตรกรอกเอง · ทำบัตรได้ฟรี" |
| F149 | A20: **The water tool's bottle buttons** were read out as "ลดจำนวนคน ขวดเล็ก…" | "ลดจำนวน" / "เพิ่มจำนวน" for the bottles |
| F150 | B1: **On the emergency card, an English name ran under the gecko** ("Emergency information: Somchai Jaidee") | A title too long for one line wraps to two, clear of the gecko |
| F151 | B2: **The tank dropped decimals**: "1.5" became 15 litres and 2 ml, where 1.5 คิว needs 150 ml | Decimals are read ("1.5", "1,5"; "1,500" stays fifteen hundred); under 100 litres the tool asks "หมายถึง 1.5 คิว (1,500 ลิตร) ใช่ไหม?" instead of answering |
| F152 | B4: **Installing from `/en/` gave a Thai app** | The build writes `/en/manifest.webmanifest` (English name, `/en/?source=pwa`, English shortcuts) and `/en/` links it |
| F153 | B9: **Masks for illness ended with dust today's under-2 line** ("…a room that keeps the dust out") | `mask.baby`, the same advice without the dust words, for answers that aren't about dust |
| F154 | B10: **Capitals mid-sentence in English**: "From Orange up", "Signs of heatstroke: A very hot body", "Dry food: Enough for…" | Lower case inside the sentence (`midSentence()`) |
| F155 | B12: **A guide's name on a tool's button differed from the guide's own title** | The button carries the guide's title ("📋 อากาศร้อนจัด ดูแลกันได้ 10 ข้อ") |
| F156 | B13: **The related-tool link on tool pages** carried the page title and the brand | The tool's name |
| F157 | B15: **The plan's share text** asked people to look at a picture that LINE's share doesn't send | "ทำแผนครอบครัวของบ้านเราแล้ว 📝 ทำของบ้านคุณได้ฟรีที่ …", true with or without the picture |
| F158 | B16: **English wording**: the water questions had no "?"; the tank said "stood with chlorine… Enter its size" next to buttons | "How many people live here?", "…disinfected with chlorine… Pick its size" (Thai "เลือกขนาดถัง") |
| F159 | B17: **The water rule named the PRD differently** from the sources line, and the shared text doubled the brackets | "…ตามกรมประชาสัมพันธ์" / "…from the Government Public Relations Department", no brackets |
| F160 | B18: **"Someone over 60"** against Thai "60 ปีขึ้นไป" | "Someone aged 60 or over" |
| F161 | B19: **The guide for before a flood offered the tank and masks**, which are for after (both flood guides used the hazard's tools) | `config.json → guides[].tools`: before a flood the home check, the bag, the plan; after it the tank, masks, the home check (the build checks them) |
| F162 | B20: **"ใช้ คลอรีนน้ำ 5%"** had a stray space | "ใช้คลอรีนน้ำ 5% ราว 100 มล." |
| F163 | B3: **The About text promised no cookies**, and the host's bot detection sets one | The text says so until the owner turns it off ([#93](#93-cloudflares-bot-detection-sets-a-cookie)) |

### In v1.13.0 (21 Oct 2026)

Found by v1.13.0's visitor walk in English.

| # | Problem | Fix |
|---|---|---|
| F130 | Live since v1.8.0: **the English tools said "1 people".** A household of one read "1 people at home" in the home check, its amounts "(3 L × 1 people × 3 days)" and "Enough for 3 days for 1 people", the copied list "(1 people)"; the medicine days "Enough for 1 days"; and the new water tool "About 1 days" | `u()` in `kit.js` turns "1 people", "1 days", "1 litres" and "1 pills" into the singular in English (not after another digit, a point or a comma, so "21 days" and "1.5 litres" stay); one smoke check opens the water tool in English for one person with 3 litres ("About 1 day", "1 person at home"). Thai has no plural, so nothing changed there |

### In v1.11.1 (20 Oct 2026)

Found by the research for the owner's question on masks ([ROADMAP N24](ROADMAP.md#n24-masks-and-children-under-2-v1111)).

| # | Problem | Fix |
|---|---|---|
| F129 | **Dust today told the parents of a baby to put a mask on it.** At yellow and orange its at-risk lines say "ใส่หน้ากากกันฝุ่น PM2.5 ทุกครั้งที่ออกนอกบ้าน", and since v1.11.0 they show to everyone, under a heading that names "เด็กเล็ก" (the group "เด็กไม่เกิน 5 ขวบ"). The PCD's notice has no infant exception; the DDC spokesperson (InfoQuest, 27 Jan 2025) says no mask of any kind under 2 years, and Health Canada agrees | Every level whose lines mention a mask (`mask: true`) adds "👶 เด็กต่ำกว่า 2 ขวบ ไม่ควรใส่หน้ากากทุกชนิด ให้อยู่ในห้องที่กันฝุ่นได้ และอย่าพาไปที่ฝุ่นเยอะ ⚠️" (`kit.json → air.baby`, ⚠️ `partial` until a paediatrician reads it) in the tool, the shared text and `/air`. The build fails on a mask line without `mask: true` and on a missing or unsourced under-2 line; a unit test checks every level and two smoke checks the sheet (orange shows it, blue doesn't). |


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

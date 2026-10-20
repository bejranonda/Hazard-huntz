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
| L1 | [Create the Cloudflare Pages project](#l1-create-the-cloudflare-pages-project) | Owner | Mostly done: Web Analytics looks on (19 Oct 2026); the owner confirms |
| L2 | [Set the domain and re-render the images](#l2-set-the-domain-and-re-render-the-images) | Owner + AI | Done: preview-debugger check left |
| L3 | [Set the forecast-app link](#l3-set-the-forecast-app-link) | Owner + AI | Done (11 Oct 2026): link set; live status endpoint optional |
| L4 | [Review the 21 flagged (⚠️) safety items](#l4-review-the-21-flagged-safety-items) | Owner + AI | Todo |
| L5 | [Second native reader for the Thai copy](#l5-second-native-reader-for-the-thai-copy) | Owner + AI | Todo (the home check's and plan card's text added in v1.8.0; the hub, the guides and the new pages in v1.9.0; the renamed tools, new titles and intros, how-to step 4, the heat phase names in v1.9.1; the 117 rewritten wrong answers in v1.9.2; the calculators' texts in v1.10.0, and their plain words in v1.10.1; the fridge's food lists, the medicine and breast-milk lines, the named helplines and the new start-screen and sharing texts in v1.11.0) |
| L6 | [Real-phone test matrix](#l6-real-phone-test-matrix) | Owner + AI | Todo (75 rows since v1.11.0: rows 67–75 for food by food, ก+ and the copy buttons inside LINE; rows 64–65 rewritten for v1.10.1's taps) |
| L7 | [Soft launch, then the launch phases](#l7-soft-launch-then-the-launch-phases) | Owner | Todo |
| L8 | [Search consoles and AI-search check](#l8-search-consoles-and-ai-search-check) | Owner + AI | Todo (28 addresses since v1.10.0: sixteen hazard pages, `/kit`, `/plan`, `/fridge` and `/air`; the Rich Results Test of the publisher added in v1.9.2) |
| L9 | [Link FloodWatch and the game to each other](#l9-link-floodwatch-and-the-game-to-each-other) | Owner + AI | Half done: game → FloodWatch is live |
| L10 | [Thai review of the dust, fire and power-cut lessons](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons) | Owner + AI | Todo (power cut added in v1.7.0; the home check's ⚠️ items in v1.8.0; the PRD page couldn't be read by tools on 19 Oct 2026; the four new guides, 40 lines, in v1.9.0; the fridge's international hours and the dust tool's choices in v1.10.0; the fridge's food lists and their Thai names, the insulin and medicine wording and the breast-milk lines in v1.11.0) |
| N1 | [Fix overlapping tap areas](#n1-fix-overlapping-tap-areas) | AI-ready | Done: 0% overlap via slot exclusion |
| N2 | [Move hard-coded text into JSON and settle the `install` event](#n2-move-hard-coded-text-into-json-and-settle-the-install-event) | AI-ready | Done (10 Oct 2026) |
| N3 | [Add CI on GitHub](#n3-add-ci-on-github) | AI-ready | Done (10 Oct 2026) |
| N4 | [Bigger tap areas on 320 px phones](#n4-bigger-tap-areas-on-320-px-phones) | AI-ready | Done (13 Oct 2026) |
| N5 | [First metrics review](#n5-first-metrics-review) | Owner + AI | Blocked: needs 2 weeks live |
| N6 | [Implement live-site UX improvements](#n6-implement-live-site-ux-improvements) | AI-ready | Done: IMP-01 to IMP-07 verified |
| N7 | [International version and social previews](#n7-international-version-and-social-previews) | AI-ready | Done (11 Oct 2026, v1.2.0) |
| N8 | [More fun to play, more worth sharing](#n8-more-fun-to-play-more-worth-sharing) | AI-ready | Done (14 Oct 2026, v1.3.0) |
| N9 | [Organise the knowledge by topic, add the news-driven lessons](#n9-organise-the-knowledge-by-topic-add-the-news-driven-lessons) | AI-ready | Done (15 Oct 2026, v1.4.0) |
| N10 | [A game for the whole year: PM2.5 dust and house fire](#n10-a-game-for-the-whole-year-pm25-dust-and-house-fire) | AI-ready | Done (15 Oct 2026, v1.5.0) |
| N11 | [The visitor funnel: next step always on the first screen](#n11-the-visitor-funnel-next-step-always-on-the-first-screen) | AI-ready | Done (15 Oct 2026, v1.5.2) |
| N12 | [A start screen that keeps itself current, mode links and hazard pages](#n12-a-start-screen-that-keeps-itself-current-mode-links-and-hazard-pages) | AI-ready | Done (18 Oct 2026, v1.6.0) |
| N13 | [Carousel posts for social media](#n13-carousel-posts-for-social-media) | AI-ready | Done (18 Oct 2026, v1.6.1) |
| N14 | [A power-cut and stockpile mode](#n14-a-power-cut-and-stockpile-mode) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.7.0); Thai review left (L10) |
| N15 | [How ready is our house? A checker and a family plan card](#n15-how-ready-is-our-house-a-checker-and-a-family-plan-card) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.8.0); Thai review of its wording left (L5, L10) |
| N16 | [v1.8.1: visitor audit fixes and integration](#n16-v181-visitor-audit-fixes-and-integration) | AI-ready | Done (19 Oct 2026, v1.8.1); the shortcuts on a real phone left (L6) |
| N17 | [Tools first and a guide for every hazard](#n17-tools-first-and-a-guide-for-every-hazard) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.9.0); the Thai review of the four guides (L10), the language check (L5) and the phone checks (L6) left |
| N18 | [Keep source notes out of what the game loads](#n18-keep-source-notes-out-of-what-the-game-loads) | AI-ready | Todo |
| N19 | [Visitor audit 2](#n19-visitor-audit-2) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.9.1); its leftovers done in v1.9.2 (N20), except the previews' helpline line (#68) and the phone checks (L6) |
| N20 | [v1.9.2: answers, back button, card, security](#n20-v192-answers-back-button-card-security) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.9.2); the Thai read of the wrong answers (L5), the phone checks (L6, rows 61–63) and the Rich Results Test (L8) left |
| N21 | [Calculators from the home check's idea (v1.10.0)](#n21-calculators-from-the-home-checks-idea-v1100) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.10.0); the Thai read (L5), the phone checks (L6, rows 64–66) and the review of the fridge hours and the dust tool (L10) left; its screens redone in plain words in v1.10.1 (N22) |
| N22 | [Calculators in plain words (v1.10.1)](#n22-calculators-in-plain-words-v1101) | AI-ready (+ Owner review) | Done (19 Oct 2026, v1.10.1); the Thai read of the new words (L5) and the phone test of the taps (L6, rows 64–65) left |
| N23 | [Food by food, and the app for its real readers (v1.11.0)](#n23-food-by-food-and-the-app-for-its-real-readers-v1110) | AI-ready (+ Owner review) | Done (20 Oct 2026, v1.11.0); the reviews (L5, L10), the phone test (L6, rows 67–75), three owner decisions, an "UPDATE:" post for the corrected cold-medicine lesson and the audit's leftovers (#83, #84) left |
| P1 | [Bathroom, bedroom and garage](#p1-bathroom-bedroom-and-garage) | Owner + AI | Todo |
| P2 | [Accessibility pass with a screen reader](#p2-accessibility-pass-with-a-screen-reader) | Owner | Todo |
| P3 | [Lighter preview images](#p3-lighter-preview-images) | AI-ready | Todo (optional) |
| P4 | [More languages](#p4-more-languages) | Owner + AI | Todo (optional) |
| P5 | [Share-loop ideas not built yet](#p5-share-loop-ideas-not-built-yet) | AI-ready / Owner + AI | Todo (optional) |
| P6 | [More lessons for the remaining disease groups](#p6-more-lessons-for-the-remaining-disease-groups) | Owner + AI | Todo (optional) |
| P7 | [Heat and summer storms](#p7-heat-and-summer-storms) | AI-ready (research) + Owner review | Guides done (v1.9.0); game modes Todo |
| P8 | [Earthquake and tsunami](#p8-earthquake-and-tsunami) | AI-ready (research) + Owner review | Guide done (v1.9.0, the tsunami line ⚠️); game mode Todo |
| P9 | [A safety calendar: one hazard week at a time](#p9-a-safety-calendar-one-hazard-week-at-a-time) | Owner + AI | Todo |
| P10 | [More calculators](#p10-more-calculators) | AI-ready (+ Owner review) | Todo (proposed in v1.10.0; heat today first, once a person confirms the TMD's page; v1.11.0 widened the fridge tool instead, food by food) |
| V1 | [Version 2: the combined Prepare → Return run](#v1-version-2-the-combined-prepare--return-run) | AI-ready | Todo |
| S1 | [Seasonal relaunch (every April–May)](#s1-seasonal-relaunch-every-aprilmay) | Owner + AI | Recurring |
| S2 | [When something is in the news: the alert and the guide posts](#s2-when-something-is-in-the-news-the-alert-and-the-guide-posts) | Owner (+ AI for a new guide) | Recurring (since v1.9.0) |
| H1 | [Housekeeping](#h1-housekeeping) | Owner | Partly done |

---

## Launch (do these first)

### L1. Create the Cloudflare Pages project

- **Who:** Owner · **Status:** Mostly done (6 Oct 2026). **Live** at https://baanrodmai.autobahn.bot after Analytics Engine was enabled on the account (the first deploy failed without it); `/`, `/learn`, `/llms.txt`, `/sitemap.xml`, `/c/p7` return 200 and `/api/e` returns 204. The project `baanrodmai` was created through the API and connected to `bejranonda/Hazard-huntz`, with the build settings below, the `EVENTS` binding and fail open. The site address comes from `config.json → siteUrl`. **Left for the owner:** step 3, Web Analytics (the API token has no permission for it), and checking that a push to `main` starts a build (the first two deploys were started through the API). **Update (19 Oct 2026, v1.9.1 audit):** Web Analytics looks on: the HTML the live site serves to browsers carries Cloudflare's beacon (`static.cloudflareinsights.com`), with no `Set-Cookie`. The owner confirms it in the dashboard (Metrics → Web Analytics). Push-to-deploy was verified on 10 Oct 2026. Optional: the zone's "JavaScript detections" (Security → Bots) add `/cdn-cgi/challenge-platform/scripts/jsd`, about 12 KB, to every page; switch them off if nothing needs them ([KNOWN_ISSUES #30](KNOWN_ISSUES.md#30-web-analytics-search-consoles-and-push-to-deploy-are-not-done-or-checked)).
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

- **Who:** Owner + AI · **Status:** Done (11 Oct 2026, v1.2.1): `forecastAppUrl` is `https://flood.autobahn.bot/` (BKK FloodWatch, water levels of canals and rivers across Thailand; the owner confirmed on 11 Oct 2026 that it is their own Autobahn Bot project). The button shows on the start screen, result screen and help sheet. **Optional left:** `forecastStatusUrl`, only if FloodWatch offers a small `{"rainWarning": true|false}` endpoint with CORS · **Issues:** #6 (fixed), #13
- **Steps:**
  1. Set `config.json → forecastAppUrl`.
  2. Optionally set `forecastStatusUrl`. Its endpoint must send CORS headers and answer `{"rainWarning": true|false}` within 1.5 s.
- **Done when:** the build no longer warns about the placeholder, and the "เช็กระดับน้ำล่วงหน้า" buttons appear and open the app.

### L4. Review the 21 flagged safety items

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #8, #9, #10, #55
- **Steps:**
  1. An assistant prepares a review sheet from [01-safety-content.md](01-safety-content.md#flags-please-review-these). Ask the owner before publishing it anywhere.
  2. The owner or an agency contact confirms or corrects each item.
  3. An assistant applies the answers in `items.json` and `sources.json`, sets `verify`, and runs `npm run docs`.
- **Done when:** every playable item is `verified`, or the owner has knowingly accepted it as `partial`, and the table is regenerated.
- **Note (v1.5.0):** the eleventh is `f-alarm` (smoke alarms), backed only by the US Fire Administration.
- **Note (v1.7.0):** ten more are power-cut lessons (`s-…`), most of them backed only by international guidance. Their review is the power-cut part of [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons).
- **Note (v1.8.0):** the home check's 9 ⚠️ lines and the plan card's 3 ⚠️ hints are in `kit.json`, not among these 21 lessons. They are reviewed with [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons) ([#57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)).
- **Note (v1.9.0):** the four guides with no game have 5 ⚠️ lines of their own in `checklists.json` (3 landslide, 1 storm, 1 quake), also outside these 21; they are reviewed with [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons) ([#60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)).

### L5. Second native reader for the Thai copy

- **Who:** Owner + AI · **Status:** Todo (the owner said on 11 Oct 2026 they will provide a language check, Thai and English) · **Issue:** #11
- **Steps:** a native speaker reads `strings.json` (`th`, `en`, `ogEn`, `seo`), `items.json`, `checklists.json` and, since v1.8.0, `kit.json` (the home check's labels and amounts, the plan card's labels, hints and examples, and its `ui` texts), ideally an older relative for the Thai and a native English reader for the `en` and `ogEn` text. An assistant applies the edits. Tips stay at 80 characters or fewer, and placeholders stay as they are.
- **New in v1.9.0:** the start screen's tagline ("เตรียมบ้านให้พร้อมทุกภัย รู้ว่าต้องทำอะไร และมีเกม 60 วิ ช่วยจำ") and hub (`hub…`, `gameLabel`, `alertCard`), the guide picker and sheet (`guide…`, `phase…`, `printBtn`, `printNote`, `partialItem`), the four new guides' 40 lines in `checklists.json` (keep each Thai line within about 45 characters, two lines on the picture), the new hazard pages and the `/kit` and `/plan` pages (`seo.<lang>.hazard<Landslide|Storm|Quake|Heat>…`, `kitPage…`, `planPage…`), the new preview texts (`og`/`ogEn` `default…`, `checklistTitle<…>`, `kit…`, `plan…`), the About intro, `llmsSummary`, the manifest's name and description, and the `/posts` caption (`carousel.json → guideCaption`). Also read the renamed `ogEn.siteName` ("Baan Rod Mai? Home safety") and `aboutTitle` ("เกี่ยวกับบ้านรอดไหม?"). The draft post in [04-launch-kit](04-launch-kit.md#your-own-post-the-tools-first-relaunch-v190-draft) needs the owner's own voice.
- **New in v1.9.1:** the tools' one name each, เช็กของจำเป็น ("เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?") and แผนครอบครัว ("การ์ดแผนครอบครัว", "แผนครอบครัวของบ้านเรา"), and "Check your supplies" / "Our family plan" (`kit.json → ui`, `kitFromResult`, `toolKit`, `toolPlan`, `kitPageCta`, `planPage…`, `og`/`ogEn.planLine1`, the manifest's shortcuts); the flood guides' names ("น้ำท่วม: ก่อนน้ำมา", "น้ำท่วม: หลังน้ำลด"); the mode hazard pages' new titles and intros (`seo.<lang>.hazard<Flood|Dust|Fire|Outage><Title|Intro>`); how-to step 4 in every mode (`howto…`); the heat guide's phase names (`checklists.json → heat.phaseNames`); the guide sheet's labels (`guideShare`, `guideNext`, `guideJump`, `telFree`, `done`), `shareTextGuide`, `versusLoseFar`, `statLost`, `lineGuideText` and the 404 page (`seo.<lang>.notFound…`).
- **New in v1.9.2: the wrong answers.** 117 wrong labels in `items.json` were rewritten so that the right answer is no longer the longest by habit ([KNOWN_ISSUES #66](KNOWN_ISSUES.md#66-the-right-answer-was-usually-the-longest-choice), F83). Each gives the reason a real person would give for that mistake ("ปล่อยไว้ในลิ้นชักเหมือนเดิม เสียก็ไปขอทำใหม่ได้"). Read them in Thai and English: does each sound like something a person would really say, is it still clearly the wrong thing to do, and does its `feedback` still answer it? Keep a rewrite within 60 Thai letters or 80 English characters, keep the right answers word for word, and run `npm test`: the length test fails if the right answer becomes the longest too often, or too rarely ([GUIDELINES rule 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). A native English reader may also find shorter English right answers where the source allows it ([KNOWN_ISSUES #73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones)). Text only, so houses don't change.
- **New in v1.10.0: the calculators.** `kit.json → ui` (the 54 new texts, `fridge…`, `med…`, `air…`, `hours` and `minutes`: the questions, the status lines such as "ยังเก็บได้อีกราว {left} {cond}", the footnote on the US hours, the hint for people at risk, the share texts), `kit.json → fridge` (the parts, "ok" and "over" lines) and `air` (the five levels' lines, the groups' names), the hub's `hubFridge…` and `hubAir…`, the pages' `seo.<lang>.fridgePage…`, `airPage…`, `toolFridge` and `toolAir`, the previews' `og`/`ogEn` `fridge…` and `air…`, the About text and privacy line, `llmsSummary`, and the manifest's description and two new shortcuts. The dust lines follow the PCD's notice closely; keep their meaning, and keep "(กรมอนามัย)" on the DOH's two ([KNOWN_ISSUES #76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red)). After a change, `npm run images -- --only og/fridge,og/en/fridge,og/air,og/en/air` if a preview's text changed.
- **New in v1.10.1: the calculators in plain words** ([N22](#n22-calculators-in-plain-words-v1101)). Read the new screens, not v1.10.0's: the fridge's "ไฟดับมานานเท่าไรแล้ว?" and its 9 time buttons, "⏱️ ไฟดับมาแล้ว … แอปจะนับเวลาต่อให้ ปิดแล้วเปิดใหม่ได้", the status words in `kit.json → fridge.parts[].say` ("ยังกินได้", "ใกล้ครบ 4 ชม.", "เกิน 4 ชม.แล้ว"…), `cond`, `ok`, `note` and `over`, "จำไว้" and its three lines; dust today's "ค่าฝุ่นตอนนี้เป็นสีอะไร?", "รู้ตัวเลข? ใส่ตัวเลขแทน", the groups' labels and every level's lines, now in everyday words; the pills' "พออีก … ต้องมีเพิ่ม … จะพอ …"; the dust tile's "ค่าฝุ่นนี้ ต้องทำอะไร". Keep the four strength words apart (ให้น้อยลง / ให้สั้นลง / เลี่ยง / งด) and "(กรมอนามัย)" on the DOH's two lines. Three rewordings are close but not identical, and need a native reader's yes or no: "นอกบ้าน" for both "กลางแจ้ง" and "นอกอาคาร", "หมอ" for "แพทย์" ([KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)). Ideally an older relative reads both tools cold, with no help.
- **New in v1.11.0** ([N23](#n23-food-by-food-and-the-app-for-its-real-readers-v1110)): the fridge's food lists (`kit.json → fridge.foods[].label` and `short`, `frozen[].label`; are the Thai names the ones a family uses, and is anything mapped oddly, such as นมเปรี้ยว as yoghurt or ขนมจีน as fresh pasta?), the new `ui` texts ("ไม่ตรงกับปุ่มไหน ให้เลือกเวลาที่นานกว่า", "🕘 จำได้ว่าไฟดับตอนกี่โมง?", "❌ ถ้าเกิน 4 ชม. ต้องทิ้ง", "✅ ไม่ต้องทิ้งเพราะไฟดับ", "✅ เก็บได้ ถ้าไม่ขึ้นรา ไม่มีกลิ่น สี หรือเนื้อผิดปกติ", "ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง", "💡 ไฟมาแล้ว หลังดับไปราว …", "↺ เริ่มนับใหม่", the shared text's "ไฟดับตั้งแต่ราว …"), the insulin, medicine and breast-milk lines (the safety review of the same lines is in [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)), dust today's "สำหรับเด็กเล็ก ผู้สูงอายุ คนท้อง และคนมีโรคประจำตัว", "ทำตามข้อด้านบน และ" and "ยังไม่รู้สี? 🌐 เปิดดูในเว็บกรมควบคุมมลพิษ (Air4Thai)", the helplines' short names (`helplines.json → short`; is "power: Bangkok area" right for 1130 in English? [KNOWN_ISSUES #82](KNOWN_ISSUES.md#82-power-bangkok-area-stands-for-meas-three-provinces)), "🥛 ไฟดับอยู่ตอนนี้? ดูว่าของในตู้เย็นอะไรต้องทิ้ง", the sharing texts (the plan's new share text, "👆 วิธีส่งทั้งการ์ด…", "📋 คัดลอกแผนเป็นข้อความ", "🛒 คัดลอกรายการที่ยังขาด", "คัดลอกข้อความ", "ยังขาด {n} อย่าง เช่น", "ยาหมดแล้ว…", the plan card's "…และพิมพ์เก็บไว้กับเอกสารสำคัญ"), the start screen's "ช่วงนี้ถึง {until}: …", "🔒 ฟรี ไม่ต้องสมัคร ไม่ขอข้อมูลส่วนตัว" and "ก+" / "ตัวหนังสือใหญ่ขึ้น", the result's "เตรียมบ้านต่อ" row, the new `/fridge` and `/air` titles, descriptions and intros, and the previews' second lines (`og`/`ogEn` `fridgeLine2`, `airLine2`). In English: "Front of the house" and the new agency names, which mix "U.S." and "US". The Thai pages are now Thai only, so read one hazard page through on a phone. After a change to a guide's numbers or a preview's text, re-render (`npm run images -- --only share/checklist-…,og/fridge,og/en/fridge,og/air,og/en/air`).
- **Done when:** the edits are committed and the images re-rendered where the copy appears in them.

### L6. Real-phone test matrix

- **Who:** Owner + AI · **Status:** Todo · **Issue:** #3
- **Steps:**
  1. Run [06-test-checklist.md](06-test-checklist.md) on at least one cheap Android and one iPhone, inside LINE, Facebook and TikTok. Since v1.8.0 that includes the home check and the plan card (rows 46–48): open `/?open=kit` and `/?open=plan` from a LINE chat, and check whether the ticks and the plan are still there after reopening, and whether the cards save ([KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)). Since v1.8.1 (rows 49–50): add the game to the home screen, then long-press the installed icon: the two shortcuts, "บ้านเราพร้อมแค่ไหน?" and "แผนบ้านรอดของบ้านเรา", should open the check and the plan card (`manifest.webmanifest → shortcuts`, **[unverified]** on any phone); and make a plan card with some fields left empty, which should show dotted lines to fill in by hand. Since v1.9.0 (rows 51–54): the start screen's hub on a real phone (the three tools first, the game still easy to find), the alert card, printing a guide and the home check's list from Chrome and Safari, and the guide picker and a guide inside LINE. Since v1.9.1 (rows 55–60): the phone's back button (and iOS's swipe back) closes a sheet inside LINE and stays in the app; sharing a result to LINE and coming back keeps the result, the lessons and the challenge back; Thai words don't break mid-word on an iPhone (its dictionary isn't the one tested, [KNOWN_ISSUES #69](KNOWN_ISSUES.md#69-kept-thai-words-are-a-hand-made-list)); the fire smoke is drawn on a real 360 × 640 phone; `/no-such-page` answers with the 404 page on the live site; a guide's ☎️ buttons dial. Row 49's shortcuts now read "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" and "แผนครอบครัวของบ้านเรา". Since v1.9.2 (rows 61–63): the phone's back button inside a round pauses it and a second Back resumes it, and on the result it goes to the start screen, with the Android back gesture, iOS's swipe back and inside LINE ([KNOWN_ISSUES F85](KNOWN_ISSUES.md#in-v192-19-oct-2026)); a result card forwarded to a chat can be read at the size the chat shows it, the gecko's line and the link (F86); a choice's three answers fit on a small phone without scrolling (F84). Since v1.10.0 (rows 64–66): the fridge tool's count keeps going after the app or LINE is closed and reopened, and the start screen's tile says how long the power has been off; dust today inside LINE: the number keyboard, the decimal point (or comma), and the scroll to the answer after typing or picking a colour; the pills fields in the home check, and that nothing typed is still there after reopening ([KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)). The two new app shortcuts are under row 49. **Since v1.10.1, rows 64–65 describe the new screens** ([N22](#n22-calculators-in-plain-words-v1101)): the fridge has no stepper and no "start now" button; tap a time ("เพิ่งดับ" or "3 ชม."), check that nothing is counted before the tap, that "⏱️ ไฟดับมาแล้ว …" shows after it, that the count goes on after closing LINE, and that "💡 ไฟมาแล้ว" clears it; dust today starts with the five colours, and the number box is behind "🔢 รู้ตัวเลข? ใส่ตัวเลขแทน", which must open and show the number keyboard inside LINE. Hand both tools to an older relative without explaining them, and note where they hesitate. **Since v1.11.0, rows 67–75** ([N23](#n23-food-by-food-and-the-app-for-its-real-readers-v1110)): the fridge's food lists at 3 h and at 6 h; "💡 ไฟมาแล้ว" keeps the answer, after closing LINE too, and the start screen's tile says what to do next; the "🕘 จำได้ว่าไฟดับตอนกี่โมง?" time box inside LINE; the medicine and breast-milk ticks; "ก+" inside LINE and on an iPhone ([KNOWN_ISSUES #81](KNOWN_ISSUES.md#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)); the plan's "📋 คัดลอกแผนเป็นข้อความ" and the home check's "🛒 คัดลอกรายการที่ยังขาด" inside LINE (does the text reach the clipboard?); the named numbers on a guide and on its picture in a chat; dust today's at-risk lines with no ticks; and a Thai hazard page's length. Include an Android 10 or 11 phone inside LINE and Facebook if you can: about 12 % of Thai Android traffic runs Android 11 or older ([07-audience](07-audience.md)). Best of all, two or three older relatives, one of them rarely online, handed the phone and watched.
  2. An assistant records the results in the matrix and turns each ❌ into a KNOWN_ISSUES entry or a fix.
- **Done when:** the matrix is filled in, and no ❌ remains that blocks sharing or playing.

### L7. Soft launch, then the launch phases

- **Who:** Owner · **Status:** Todo
- **Steps:** follow [04-launch-kit.md](04-launch-kit.md): 20–30 people first, then *Prepare first*, then *Return*.
- **Done when:** the launch-day checklist in the launch kit is complete.

### L8. Search consoles and AI-search check

- **Who:** Owner + AI · **Status:** Todo · **Issues:** #30, #32
- **Steps:**
  1. The owner adds the site in Google Search Console and Bing Webmaster Tools and submits `https://baanrodmai.autobahn.bot/sitemap.xml`. Since v1.10.0 it lists 28 addresses: `/`, `/learn`, the hazard pages `/flood`, `/pm25`, `/fire`, `/ready`, `/landslide`, `/storm`, `/quake` and `/heat`, and `/kit`, `/plan`, `/fridge` and `/air`, each with its `/en/` twin (24 in v1.9.0–1.9.2, 12 in v1.7.0–1.8.1). If the sitemap was submitted before 19 Oct 2026, submit it again, and ask for the hazard pages to be indexed (URL Inspection → Request indexing in Google; URL Submission in Bing): the six from v1.6.0, `/ready` and `/en/ready` from v1.7.0, the twelve from v1.9.0 (`/landslide`, `/storm`, `/quake`, `/heat`, `/kit`, `/plan` and their twins) and the four from v1.10.0 (`/fridge`, `/air` and their twins).
  2. Run `/`, `/learn` and one hazard page (`/pm25`) through Google's Rich Results Test and fix anything it reports in the JSON-LD (`tools/build.mjs`). Since v1.9.2 the start page names a publisher (an `Organization`, `…/#org`), the `Article` markup on `/learn` and the hazard pages has it as `author` and `publisher`, and the app's `applicationCategory` is `UtilitiesApplication` ([KNOWN_ISSUES F89](KNOWN_ISSUES.md#in-v192-19-oct-2026)); check that the test reads the publisher and its logo without warnings. `x-default` points to `/en/` on purpose. Since v1.9.1 the `/checklist/<id>` pages point their canonical at the hazard page, so only the hazard pages should be indexed for a guide.
  3. Paste a challenge link, `/learn`, `/pm25`, `/fire` and `/ready` into the Facebook Sharing Debugger and a LINE chat. The hazard pages should show their own title and the checklist image.
  4. After about two weeks, search the game's Thai name, "เตรียมบ้านก่อนน้ำท่วม" and "ป้องกันฝุ่น PM2.5 ในบ้าน" in Google and Bing, and ask two AI assistants about it. Record what appears, and whether the hazard pages or `/learn` come up.
  5. Record the result in [KNOWN_ISSUES #32](KNOWN_ISSUES.md#32-search-and-ai-search-results-cant-be-guaranteed), and adjust the `/learn` headings and `seo` copy if the Thai queries find nothing.
  6. Repeat steps 2 and 3 for `/en/`, `/en/learn` and an English challenge link (`/en/c/p7`), and check that the `hreflang` pairs show no errors in Search Console. Search in English for "flood safety game Thailand".
- **Done when:** both consoles accept the sitemap, the Rich Results Test shows no errors, and the findings are written down.

### L9. Link FloodWatch and the game to each other

- **Who:** Owner + AI · **Status:** Half done (12 Oct 2026). Game → FloodWatch is live: `forecastAppUrl` is `https://flood.autobahn.bot/`, and since v1.6.0 the `/flood` page links it too. **Left:** FloodWatch → game. · **Issues:** #6 (fixed), #13
- **Steps:**
  1. The owner adds a link from https://flood.autobahn.bot/ to the game. Since v1.6.0 the best targets are `https://baanrodmai.autobahn.bot/?mode=prepare` (opens the game on flood preparation, whatever the date) for a "play" link, and `https://baanrodmai.autobahn.bot/flood` (the flood lessons, with play buttons) for a "learn" link; `/en/?mode=prepare` and `/en/flood` for English. The two sites share the parent domain, which helps both.
  2. Optional: FloodWatch offers `{"rainWarning": true|false}` with CORS, and the owner sets `forecastStatusUrl` so the game can show a rain banner.
  3. After two weeks, check whether Web Analytics shows referrals from `flood.autobahn.bot`.
- **Done when:** both sites link to each other and the referrals show in Web Analytics.

### L10. Thai review of the dust, fire and power-cut lessons

- **Who:** Owner + AI · **Status:** Todo (the power-cut lessons were added in v1.7.0, the home check and plan card in v1.8.0, the four guides with no game in v1.9.0, the calculators in v1.10.0, the fridge food by food, medicine and breast milk in v1.11.0) · **Issues:** #45, #46, #55, #57, #60, #74, #75, #76, #78, #79, #80; F128
- **Why:** the 25 dust and fire lessons (v1.5.0) quote the Department of Health, DDPM and MEA through news reports, because the agency sites refuse automated access. A person should read the agency pages themselves before the dust season (December). The 13 power-cut lessons (v1.7.0) go further: 10 are ⚠️, and 7 of those rest on international guidance only (the US CDC, Ready.gov, the US Fire Administration). Their `verifyNote` points here.
- **Steps:**
  1. An assistant prints the dust, fire and power-cut rows of [01-safety-content.md](01-safety-content.md) with their source links as a review sheet.
  2. The owner (or a contact at กรมอนามัย / ปภ.) opens each source, checks the wording, and notes changes.
  3. For the power-cut lessons, look for the Thai statement that would replace or back the international one:
     - open the PRD 72-hour checklist page (`prd-72h`) in a normal browser and confirm "3 litres per person per day" (`s-water`) and the battery radio (`s-radio`); tools can't read it ([#55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance))
     - **note (19 Oct 2026):** no tool could read prd.go.th that day, not even its home page: `curl` got a 301 from `www.prd.go.th` to `prd.go.th` and then a 404, and headless Chromium a 500 block page. So whether the page still exists is unknown; a search engine's index still shows it with the 3-litre line. Open https://www.prd.go.th/th/content/category/detail/id/35/iid/533126 from a phone or computer in Thailand. If it is gone, find the same checklist on another PRD or ปภ. page and replace `prd-72h` in `p-waterfood`, `s-water`, `s-radio` and the home check's `water` and `radio` lines; until then the 3 L rests on the source's title as recorded
     - ask MEA (กฟน.) or PEA (กฟภ.) whether they advise unplugging appliances in a power cut (`s-plugs`)
     - ask กรมอนามัย or อย. about fridge and freezer food in a power cut (`s-fridge`, `s-leftover`, `s-freezer`), and have a Thai pharmacist or อย. read the cold-medicine wording (`s-medcold`)
     - look for Thai wording on candles in a power cut (ปภ.) and on a manual can opener in a kit (`s-candle`, `s-opener`)
  4. For the home check and plan card (v1.8.0, [#57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)): 9 of its 15 lines are ⚠️. The PRD and cold-medicine checks above cover `water`, `radio`, `meds` and `medcold`. Also look for Thai wording on keeping some cash at home, supplies for small children (กรมอนามัย), spare glasses, a back-up plan for powered medical devices, and a family meeting place and contact plan (ปภ.; the plan card's `meet` and `contact` rest on Ready.gov alone). Read the amounts as a family would: "27 ลิตร (3 ลิตร × 3 คน × 3 วัน)".
  5. For the four guides with no game (v1.9.0, [#60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)): 40 lines, 5 ⚠️. The Thai agencies were read through Thai news reports quoting them (27 of the 36 new sources; the others are TMD's tsunami paper and 8 international pages used to cross-check). Open the agency pages behind them (ปภ., กรมทรัพยากรธรณี, กรมทรัพยากรน้ำ, กรมอุตุนิยมวิทยา, กรมอนามัย, กรมควบคุมโรค, กฟน., กฟภ., กทม.) and confirm each line; look for Thai wording on not crossing flowing water or mud and on staying away from a slide until officials say so (`landslide` #9–#10, Ready.gov only), on checking whether one's own home is at risk (`landslide` #1), on checking the electrics after a storm (`storm` #10), and on the sea pulling back before a tsunami (`quake` #6; a fully verified fallback is in its `verifyNote`). [KNOWLEDGE §29.3](KNOWLEDGE.md#293-the-four-new-guides-and-their-sources) has every line with its sources.
  6. For the calculators (v1.10.0): the fridge's hours rest on the US CDC and Ready.gov only ([#74](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only)); the questions to กรมอนามัย or อย. in step 3 cover them too, and a Thai source for `s-fridge` and `s-freezer` goes into `kit.json → fridge.parts[].sources` as well. For dust today, open Air4Thai (the app and the site) and note whether it shows hourly and 24-hour readings and how it colours each ([#75](KNOWN_ISSUES.md#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings)), and read the five levels' lines against the notice (the Royal Gazette PDF is linked from `/air`; since v1.10.1 the lines are in everyday words, so check that each keeps the notice's meaning and strength, [KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)): is the PCD's notice the right main text, with the DOH's two lines named ([#76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red))? For a heat calculator, open the TMD's heat-index page and note its levels and formula ([#78](KNOWN_ISSUES.md#78-a-heat-index-calculator-is-not-built), [P10](#p10-more-calculators)).
  7. **For the fridge food by food (v1.11.0, [N23](#n23-food-by-food-and-the-app-for-its-real-readers-v1110)):** read the 13 foods and 4 packs (`/fridge` lists them with their sources) against FoodSafety.gov's charts and USDA FSIS's list, and against a Thai kitchen: is each Thai name under the right row, and is eggs' "throw out after 4 hours" right for Thai eggs, which shops often sell unrefrigerated? Are ลูกชิ้น and หมูยอ right under "lunchmeats, hot dogs, sausage"? Is leaving น้ำปลา out right ([#79](KNOWN_ISSUES.md#79-the-fridges-food-lists-rest-on-us-charts), [KNOWLEDGE §33.3–33.4](KNOWLEDGE.md#333-the-sources))? Ask a **Thai pharmacist** (or อย.) to read the insulin card ("เก็บนอกตู้เย็นได้ถึง 28 วัน ถ้าไม่ร้อนเกิน 30°C …", the note above 30 °C, "ถามเภสัชกรหรือโรงพยาบาล…" after 28 days) and the other-medicine card ("🔎 เกิน 1 วันแล้ว ดูฉลากก่อนใช้", "ยาที่ขาดไม่ได้ อย่าเพิ่งทิ้ง…"), and `s-medcold`'s reworded `why` and feedback, which since v1.11.0 follow the FDA instead of "discard after a day" ([#80](KNOWN_ISSUES.md#80-insulin-above-30-c-has-no-number), [F128](KNOWN_ISSUES.md#in-v1110-20-oct-2026)). Ask a **nurse or the DOH's breastfeeding centre** (ศูนย์นมแม่) to read the two breast-milk cards, which follow the CDC's power-cut rules (ice crystals: refreeze; thawed but cold: the fridge, used within the next day or thrown away; never refrozen). Decide with the reviewer what dust today says at orange beside the guide's "งดออกกำลังกายกลางแจ้ง" ([#76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red)).
  8. An assistant applies them, upgrades sources to `official` where an agency page is found, adds the Thai source next to the international one, sets `verify` (in `items.json`, `kit.json` and `checklists.json`), and runs `npm run docs`; a changed guide line also needs `npm run images -- --only share/checklist-<id>,og/checklist-<id>,og/en/checklist-<id>`. Post an "UPDATE:" if the advice changes.
- **Done when:** every dust, fire and power-cut lesson is confirmed or corrected by a person; the decision on `f-alarm` (keep as ⚠️, or drop) is recorded; each power-cut lesson and each ⚠️ line of the home check and plan card either has a Thai source or the owner has knowingly kept it as international guidance, flagged; every line of the four guides with no game has been read against its agency's own page or confirmed by a contact; the owner has decided on the fridge tool's international hours, and Air4Thai's colouring of hourly readings is noted; since v1.11.0 also: the food list's Thai names and the eggs are confirmed or changed, a pharmacist has read the medicine lines and a nurse or the DOH's breastfeeding centre the breast-milk lines, and the orange question is decided.

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

- **Who:** AI-ready · **Status:** Done (13 Oct 2026: below 520 px of height the room tabs are hidden and the HUD padding shrinks; smallest item tap area at 320×460 is 44.1 px, smoke checks added) · **Issue:** #2 (now F21)
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

### N7. International version and social previews

- **Who:** AI-ready · **Status:** Done (11 Oct 2026, v1.2.0) · **Issue:** #37
- **What was done:** English addresses `/en/`, `/en/learn`, `/en/c/…`, `/en/checklist/…`; English start screen in the static HTML; first-visit language guess (Thai for Thai browsers or Bangkok time); `hreflang` + sitemap alternates; English JSON-LD; 25 English preview images; `og:locale:alternate` and `twitter:image:alt`; English share links keep `/en`. See [KNOWLEDGE §18](KNOWLEDGE.md#18-international-version-and-social-previews).
- **Left for the owner:**
  - language check of the English text (`ogEn`, `seo.en`, the English UI strings): the owner will provide it; apply it in `strings.json`, re-render with `npm run images`, and restore the Thai images that change by pixel noise
  - submit the updated sitemap again in Google Search Console and Bing (it now lists `/en/` and `/en/learn`)
  - check an `/en/c/p8` link in Facebook's Sharing Debugger and in LinkedIn's Post Inspector
  - have a native English speaker read `ogEn` and `seo.en`

### N8. More fun to play, more worth sharing

- **Who:** AI-ready · **Status:** Done (14 Oct 2026, v1.3.0)
- **Why:** the owner asked what else would make the game more enjoyable and more shareable. A review found that a forwarded card led to the wrong house, there was no real "challenge back", and nothing gave a reason to come back.
- **What was built:** the challenge link on the card, challenge back with both scores, the score to beat on the clock, the house date and streak in the share text, the safety book, end-of-round moments by score, a feel-only combo, sounds for silent moments, streak milestones, replay buttons above the lessons, bilingual share titles, and the checklist share fix. See [CHANGELOG 1.3.0](../CHANGELOG.md).
- **Rule kept:** no change to scoring, items or slots, so houses and old links stay the same.
- **Done when:** build, 15 unit tests and 45 smoke checks pass, screenshots looked at in Thai and English, and the live site shows v1.3.0. All true on 14 Oct 2026.

### N9. Organise the knowledge by topic, add the news-driven lessons

- **Who:** AI-ready · **Status:** Done (15 Oct 2026, v1.4.0)
- **Why:** the owner asked to check the EM-ball advice, to add knowledge about diseases after floods (in the news), and to organise the growing knowledge for a better journey and more enjoyment.
- **What was built:** `r-stagnant` (EM balls), `r-ors` (diarrhoea), `r-towel` (eye infections); six topics across the book, tip card, result list and `/learn`; a featured-topic card on the start screen. See [CHANGELOG 1.4.0](../CHANGELOG.md).
- **Done when:** build, 17 unit tests, 55 smoke checks and the overlap probe (0%) pass; screens checked as a visitor in Thai and English on a phone and three tablet sizes. All true on 15 Oct 2026.

### N10. A game for the whole year: PM2.5 dust and house fire

- **Who:** AI-ready · **Status:** Done (15 Oct 2026, v1.5.0)
- **Why:** the owner: "we have stories only before and after flood, that no people will pay attention outside risk time". The game needed reasons to come back in the dry season too.
- **What was built:** a mode registry, `dust` (12 lessons, haze, Air4Thai link) and `fire` (13 lessons, falling smoke, helpline 199), a season default, the year-round wording, and per-mode link previews and checklists. See [CHANGELOG 1.5.0](../CHANGELOG.md) and [KNOWLEDGE §22](KNOWLEDGE.md#22-a-game-for-the-whole-year-v150).
- **Done when:** build, 20 unit tests, 57 smoke checks and the overlap probe (0%) pass; flood houses unchanged; four modes checked as a visitor in Thai and English at 320 px and on three tablet sizes. All true on 15 Oct 2026.

### N11. The visitor funnel: next step always on the first screen

- **Who:** AI-ready · **Status:** Done (15 Oct 2026, v1.5.2)
- **Why:** the owner asked how well the home page starts play, the game reaches the end, and the end leads to sharing, for Thai visitors on phones and tablets.
- **What was built:** sticky share (result) and start/next (sheets), channels before the preview in the share sheet, the challenge first on challenge links, a ▶ play mark. See [KNOWLEDGE §23](KNOWLEDGE.md#23-the-visitor-funnel-measured-v152).
- **Done when:** every step's button is on the first screen at 320 × 460 to 1024 × 768, three smoke checks guard it, 61 smoke checks pass. All true on 15 Oct 2026.
- **Second loop (v1.5.3):** the ending answers "บ้านรอดไหม?" per mode and score; axe, language switch, clipping and bubble checks clean.

### N12. A start screen that keeps itself current, mode links and hazard pages

- **Who:** AI-ready · **Status:** Done (18 Oct 2026, v1.6.0)
- **Why:** the rain warning and the health topic were switched on by hand in mid-October with no end, so in December the start screen would still have said "ฝนจะมาอีกระลอก" and featured diseases after floods. Posts for dust or fire had no link that opened the right mode, and search had no page per hazard. The smoke test read the real calendar, so it would have failed by itself once the season changed.
- **What was built:**
  - end dates for the two switches (`rainWarningUntil`, `featuredTopicUntil`), with build errors, warnings and a `start` line
  - `recommend()` in `modes.js`, one pure function for the mode, topic and reason the start screen shows
  - `?mode=` links (`/?mode=dust`) for posts and campaigns
  - hazard pages `/flood`, `/pm25`, `/fire` and their `/en/` twins, with play buttons, the hazard's lessons, checklists and helplines, and their own search signals
  - the ending on the shared card, in a speech bubble
  - a smoke test that plays on a pinned date (`SMOKE_DATE`), and a generated summary at the top of docs/01

  See [CHANGELOG 1.6.0](../CHANGELOG.md) and [KNOWLEDGE §25](KNOWLEDGE.md#25-a-start-screen-that-keeps-itself-current-v160).
- **Rule kept:** no change to items, rooms, slots or `houseVersion`, so houses and old challenge links stay the same.
- **Done when:** build (no warnings), 23 unit tests and 79 smoke checks pass; the smoke test also passes with `SMOKE_DATE=2026-12-05` and `SMOKE_DATE=2027-04-10`; the `/learn` output is byte-identical before the new template gained anything; the six hazard pages and `/learn` have no control under 44 px at 320 × 460. All true on 18 Oct 2026.
- **Left for the owner:** submit the sitemap again and the six new pages in Search Console and Bing ([L8](#l8-search-consoles-and-ai-search-check)); point FloodWatch at `/?mode=prepare` or `/flood` ([L9](#l9-link-floodwatch-and-the-game-to-each-other)); have the hazard pages' text read in the language check ([L5](#l5-second-native-reader-for-the-thai-copy)).

### N13. Carousel posts for social media

- **Who:** AI-ready · **Status:** Done (18 Oct 2026, v1.6.1)
- **Why:** the owner saw a Thai stockpiling infographic spreading on social media: people share practical, page-by-page advice. The game's lessons are sourced and short, but they could only be read in the game or on `/learn`.
- **What was built:** one set of 1080 × 1350 images per hazard (cover, up to 8 lessons, the checklists, the game's address and helplines), drawn by the card code from `items.json`; `/posts` with the images and a Thai caption to copy; a fingerprint that makes the build warn when the images are older than the text. See [CHANGELOG 1.6.1](../CHANGELOG.md) and [KNOWLEDGE §26](KNOWLEDGE.md#26-carousel-posts-v161).
- **Done when:** the build has no warnings, 23 unit tests and 81 smoke checks pass, and every image has been looked at. All true on 18 Oct 2026.
- **Left for the owner:** post the dust set in early December and the fire set in March ([04-launch-kit §2](04-launch-kit.md#posting-the-carousels-v161)); have the cover titles and captions read in the language check ([L5](#l5-second-native-reader-for-the-thai-copy)). English sets can be rendered from the same code when wanted.

### N14. A power-cut and stockpile mode

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** Done (19 Oct 2026, v1.7.0); the Thai review is left ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons))
- **Why:** the Thai stockpiling infographic behind N13 ("72 hours minimum, aim for 7 days", "eat old stock first", "when the power is out eat fridge → freezer → canned", "a manual can opener") was spreading on Thai social media. The game had no lesson on stocking a home or getting through a power cut, and the infographic itself cites no agency.
- **What was built:**
  - a fifth mode, `stock` (ไฟดับ / Power cut), year-round, code `s`, with a new threat `dark`: the room darkens over 12 story hours, the HUD counts them ("ไฟดับมา 4 ชม. · 37 วิ"), and an item with `lostAfter` goes bad at that hour (the fridge at 4 hours, from the US CDC)
  - 13 lessons in three rooms, 5 decoys, a 10-item checklist "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ", challenge links `/c/s0`–`/c/s10`, the hazard page `/ready` and a carousel set
  - 5 international sources (US CDC, Ready.gov ×2, Tokyo Metropolitan Government, US Fire Administration); 10 lessons flagged ⚠️, each saying why
  - generic texts that no longer say every tip is from Thai agencies; a start screen with four small cards in one row
  - on the way: the left room arrow no longer covers the item on the fridge (F38), and the build stops cleanly on content errors (F40)

  See [CHANGELOG 1.7.0](../CHANGELOG.md) and [KNOWLEDGE §27](KNOWLEDGE.md#27-power-cuts-and-home-stock-v170).
- **Rule kept:** only what an agency backs is taught. The infographic's eating order, "check every 3–6 months" and the 7-day target were left out. The four older modes' houses and challenge links are unchanged (a year of houses compared).
- **Done when:** the build has no warnings, 25 unit tests and 86 smoke checks pass, the probe reports 0 % over 3,650 houses, the four older modes' houses are identical, and `16-stock.png` has been looked at. All true on 19 Oct 2026.
- **Left for the owner:**
  - the Thai review of the 10 ⚠️ power-cut lessons, including the PRD page check for 3 L and the radio, MEA/PEA on unplugging, and กรมอนามัย/อย. on fridge food and cold medicine ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons), [#55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance))
  - play `/?mode=stock` and read `/ready` on a phone ([L6](#l6-real-phone-test-matrix)), and submit `/ready` with the sitemap ([L8](#l8-search-consoles-and-ai-search-check))
  - the power-cut strings and the `/ready` text in the language check ([L5](#l5-second-native-reader-for-the-thai-copy))
  - post the `ready` carousel set when it fits ([04-launch-kit](04-launch-kit.md#power-cuts-and-home-stock-v170-any-time-of-year)); 5 of its 8 lessons say on the image that they are under review

### N15. How ready is our house? A checker and a family plan card

- **Who:** AI-ready (+ Owner review) · **Status:** Done (19 Oct 2026, v1.8.0); the Thai review of its wording is left ([L5](#l5-second-native-reader-for-the-thai-copy), [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)) · **Issues:** #57, #58, #59
- **Why:** the power cut (N14) teaches what to stock in a house that isn't the player's. A family still has to turn "3 L per person per day for 3 days" into its own number, find what it is missing, and agree who does what. Both are things a family group forwards.
- **What was built:**
  - **"บ้านเราพร้อมแค่ไหน?"** (`/?open=kit`): two questions (how many people, 1–10; small children, older or bedridden people, daily medicine, pets), then the household's list of up to 15 things with amounts computed from `kit.json` (water 3 L × people × 3 days, food for 3 days, a flashlight each, medicine for 7 days), ticks, a percentage, the agencies per line and ⚠️ on the 9 `partial` lines; a 1080 × 1350 card with the score ring and up to 3 missing things
  - **"แผนบ้านรอดของบ้านเรา"** (`/?open=plan`): six short fields (shelter, meeting place, contact, who helps whom ×2, medicine), a card with the helplines 1784 · 199 · 1669 · 1555 · 1130 · 1129; rows shrink together so all six fit
  - ways in from the start screen (a quick button that shows the last score), the power cut's result, `/ready` and the deep links; `kit.js` loads only when opened
  - privacy by design: answers, ticks and text only in `localStorage` (`brm:kit`, `brm:plan`); three anonymous events (`kit_open`, `kit_share` with the score, `plan_share`); a smoke check proves typed text never reaches `/api/e`
  - build checks: sources exist, every number in an amount is in a cited source's title or note, Thai and English everywhere; a new source `readygov-plan`
  - on the way: the English checklist previews no longer call the advice Thai (F41, was #56)

  See [CHANGELOG 1.8.0](../CHANGELOG.md) and [KNOWLEDGE §28](KNOWLEDGE.md#28-the-home-check-and-the-family-plan-card-v180).
- **Rule kept:** only sourced amounts (no re-check interval, no 7-day stock target, no eating order); nothing personal leaves the phone ([GUIDELINES rules 56–57](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)); every control 44 px or more; both languages. No item, room or slot changed, so houses and challenge links are unchanged.
- **Done when:** the build has no warnings, 26 unit tests and 93 smoke checks pass, `17-kit.png` and `18-plan-card.png` have been looked at, and the plan card draws all six fields at their maximum length. All true on 19 Oct 2026.
- **Left for the owner:**
  - try `/?open=kit` and `/?open=plan` on a phone, inside LINE and in the phone's browser ([L6](#l6-real-phone-test-matrix), rows 46–48)
  - the Thai review of the check's ⚠️ lines and the plan card's meeting place and contact ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons), [#57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)), and the language check of `kit.json` ([L5](#l5-second-native-reader-for-the-thai-copy))
  - post it when it fits ([04-launch-kit](04-launch-kit.md#the-home-check-and-the-plan-card-v180-any-time-of-year))
- **Possible next step** (not planned): turn the plan card's longest-input probe into a smoke check ([LESSONS D12](LESSONS_LEARNED.md#d-testing-and-verification)).

### N16. v1.8.1: visitor audit fixes and integration

- **Who:** AI-ready · **Status:** Done (19 Oct 2026, v1.8.1); the app shortcuts on a real phone are left ([L6](#l6-real-phone-test-matrix), row 49) · **Issues:** fixed F42–F50; notes on #52, #55, #57
- **Why:** after v1.8.0 every check passed, but no one had read the whole app as a visitor since the power cut and the home check were added. Checks look for what they were written for; a visitor reads the words.
- **How:** every screen, sheet, card and page walked as a visitor in Thai and English at 320 × 460 and 360 × 640, the numbers cross-checked between the home check, the lessons and the checklists, each finding fixed and measured, then the same walk again ([APPROACH §26](APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)).
- **What was fixed:**
  - the tagline and the manifest's description still described three hazards (F42)
  - the English said "flashlight", "power outage" and "Blackout" beside "torch" and "power cut": now British English throughout (F43)
  - the home check said "house" and "home"; its intro and share text now name floods as well as power cuts (F44)
  - a card line could start with "!"; closing punctuation and ๆ/ฯ now stay with the word before (F45)
  - the English wordmark ran into the sun or moon on the result card (F46)
  - the home check's answers broke Thai words at 320 px (F47)
  - the plan card's share sheet said "back to the list" but went to the form: now "← แก้แผน" (F48)
  - the plan card left a gap when fields were empty: now all six, with dotted lines for the empty ones (F49)
  - opening the plan card wasn't counted: now `plan_open` (F50)
- **What was tied in:** `config.json → hazards.flood.tools`, so `/flood` and `/en/flood` link the home check and the plan card, and the result screen's 🎒 button follows the hazard's tools (prepare, return and power-cut results show it; dust and fire don't); `/learn`, `/en/learn` and `llms.txt` link both tools; `manifest.webmanifest → shortcuts` for a long-press on the installed icon.
- **Rule kept:** no item, room or slot changed, so houses and challenge links are unchanged; nothing typed is sent. New rules: [GUIDELINES 58–60](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lessons [B10 and E9](LESSONS_LEARNED.md#e-process-documentation-and-git).
- **Done when:** the build has no warnings, 27 unit tests and 96 smoke checks pass, axe-core finds nothing new on the screens it checks, and the walk has been repeated after the fixes. True on 19 Oct 2026 (smoke 96/96 on the pinned day, 18 Oct 2026, and as 5 Dec 2026).
- **Left for the owner:**
  - the two shortcuts and a plan card with empty fields on a real phone ([L6](#l6-real-phone-test-matrix), rows 49–50)
  - open the PRD 72-hour checklist page in a normal browser in Thailand ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons))
  - the language check now reads one English variety ([L5](#l5-second-native-reader-for-the-thai-copy))

### N17. Tools first and a guide for every hazard

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** Done (19 Oct 2026, v1.9.0); the Thai review of the four guides ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)), the language check ([L5](#l5-second-native-reader-for-the-thai-copy)) and the phone checks ([L6](#l6-real-phone-test-matrix), rows 51–54) are left · **Issues:** #60–#65; fixed F51–F54
- **Why:** the owner, 19 Oct 2026: "We do not know which topics can hit now; prepare for all possibilities; some trends happen spontaneously. เตรียมบ้าน can be general for all catastrophes. People like to know what they should prepare or do. The game can be the option to make it more understandable or help them not read so much text. It should not force everyone to play the game; it is a tool to help them." Until v1.8.1 the start screen led with the game, and a hazard without a game mode (an earthquake, a heatwave, a storm) had nothing to send.
- **What was built:**
  - **the hub** on the start screen: an optional alert card, then "📋 ต้องทำอะไร เมื่อเกิดภัย", "🎒 เช็กของจำเป็น" and "📝 แผนครอบครัว", then "🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน" and the game; a challenge link hides the hub
  - **nine guides** (`config.json → guides`): the five game checklists and **four new guides with no game**, น้ำป่า ดินถล่ม, พายุ ลมแรง ฟ้าผ่า, แผ่นดินไหว and อากาศร้อนจัด, 10 lines each by phase (before, during, after), a source on every line, 35 ✅ and 5 ⚠️, from 36 new sources researched in parallel, Thai agencies first; what sources disagree on was left out and recorded
  - **the guide picker and sheet**, `/?open=guide`, `/checklist/<id>` for every guide, the guide's 1080 × 1920 picture, ▶ into the game where there is one, the hazard page, print
  - **the alert switch** `config.json → alert: { guide, until }`, always with an end date (now `landslide` until 25 Oct 2026)
  - **print** of any guide and of the home check's list as a plain A4 list (not in in-app browsers)
  - **pages:** `/landslide`, `/storm`, `/quake`, `/heat` (guide first), `/kit` and `/plan` with their own previews (the kit and plan cards now link them), every guide on `/learn` and in `llms.txt`, a sitemap of 24 addresses, and the nine guide pictures with captions on `/posts`
  - **the words about the whole app** rewritten (rule 59), and the start screen's static Thai text generated from `strings.json`
  - **events:** `guide_open`, `print`, and labels on `checklist_open`

  See [CHANGELOG 1.9.0](../CHANGELOG.md) and [KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190).
- **Rule kept:** every guide line has a source and an honest `verify`; nothing sources disagree on; the game is never required to get the advice. No item, room or slot changed, so houses and challenge links are unchanged. New rules: [GUIDELINES 61–65](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).
- **Done when:** the build has no warnings, 29 unit tests and 117 smoke checks pass, axe-core finds nothing new on the picker, the guide sheets and the new pages, the three tools are on the first screen at 320 × 460 and 360 × 640, and `20-start-tools.png`, `21-guide-picker.png` and `22-guide-quake.png` have been looked at. All true on 19 Oct 2026 (smoke 117/117 on the pinned day, 18 Oct 2026, and as 5 Dec 2026).
- **Left for the owner:**
  - the Thai review of the four guides ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons), [#60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies))
  - clear or renew the alert after 25 Oct 2026 ([#64](KNOWN_ISSUES.md#64-the-alert-must-be-cleared-or-renewed-by-hand), [S2](#s2-when-something-is-in-the-news-the-alert-and-the-guide-posts))
  - the hub, the alert card, print and the picker inside LINE on a real phone ([L6](#l6-real-phone-test-matrix), rows 51–54)
  - the language check of the new copy and the draft relaunch post ([L5](#l5-second-native-reader-for-the-thai-copy))
- **Possible next steps** (not planned): game modes for the new hazards ([P7](#p7-heat-and-summer-storms), [P8](#p8-earthquake-and-tsunami)); a guide for a hazard still without one (a chemical or gas leak, a fire in a high-rise) on the same model; keep source notes out of the client ([N18](#n18-keep-source-notes-out-of-what-the-game-loads)).

### N18. Keep source notes out of what the game loads

- **Who:** AI-ready · **Status:** Todo · **Issue:** #62
- **Why:** the game never shows a source's `note`, but it loads all of `sources.json`; the notes are about 14 KB of its 23.8 KB compressed since v1.9.0, most of the start screen's growth from 209 to 232 KB ([GUIDELINES rule 53](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). v1.11.0's seven sources, each quoting its page for the reviewer, took `sources.json` from 25.2 to 30.5 KB compressed, about half of that release's 10 KB growth (264 KB); worth doing before the next source-heavy release.
- **Steps:**
  1. Keep one file to edit by hand. Either the build writes a slim copy for the client (only `agency`, `title`, `url`, `date`, `kind`) and the full file moves out of `public/`, or the notes move to a second file beside it that the build, `npm run docs` and the tests read. Check every reader first: `content.js`, `kit.js` (agencies), `tools/build.mjs` (validation, the kit number check, `/learn`, the hazard pages, `llms.txt`, `--docs`), `tests/run.mjs` and `tests/smoke.mjs`.
  2. Update the service worker's precache list if a file name changes, and [KNOWLEDGE §5](KNOWLEDGE.md#5-content-model).
  3. Compare the generated pages before and after (`git diff --quiet public/`), apart from `sw.js`.
- **Done when:** the build's `budget` line drops by the notes' weight, every generated page is unchanged, and the tests pass.

### N19. Visitor audit 2

- **Who:** AI-ready + Owner (review) · **Status:** Done (19 Oct 2026, v1.9.1); its leftovers were done in v1.9.2 ([N20](#n20-v192-answers-back-button-card-security)), except the previews' helpline line; the phone checks ([L6](#l6-real-phone-test-matrix), rows 55–60) are left · **Issues:** fixed F55–F82; new #66–#72; notes on #3, #11, #26, #30, #52, #57, #60, #64
- **Why:** the owner, 19 Oct 2026: "Validate the app as visitors for overall, and look what good in UI/UX or anything to improve? You can suggest." Then, after the report: "Continue all as you suggested."
- **How:** three audit agents walked the live v1.9.0 site in parallel, with analytics blocked: the tools journey (LINE's in-app browser at 360 × 640, 320 × 460, English at 390 × 844, a tablet at 768 × 1024; first-screen positions, Thai wrapping, axe-core, slow-4G timings), the game and the share loop (rounds by real taps, a friend's challenge, LINE's share sheet, the CPU slowed 6×, 90 days of water timings) and the pages and previews (16 link previews looked at, 142 internal links, a throttled connection, offline return visits, `robots.txt`, the sitemap, `llms.txt`, JSON-LD). The lead re-checked every finding before fixing it; the fixes were grouped A (bugs), B (pages and tools), C (game) and D (content) ([APPROACH §28](APPROACH_AND_METHOD.md#28-visitor-audit-2-three-auditors-in-parallel-v191), [KNOWLEDGE §30](KNOWLEDGE.md#30-visitor-audit-2-v191)).
- **What was fixed:**
  - **A, bugs:** sharing to LINE, Facebook or X sent the game's tab away (F55); the phone's back button left the site, and ✕ was far down long sheets (F56); Thai words broke across lines, now `config.json → keepTogether` (F57) and the CSS rules that caught its spans (F82); the fire smoke wasn't drawn on shorter screens (F58); a guide without a game promised one when shared (F59); the checklist pages' canonical (F60); one look at `/en/` switched Thai links to English (F61); a first visit downloaded the app twice (F62)
  - **B, pages and tools:** the hazard pages lead with the list, helplines and a jump row (F63); titles agree with the previews (F64); the guide sheet redesigned (F65); the flood guides' order and names (F66); the heat guide's phase names (F67); one name per tool (F68); the home check's ⚠️ footnote, live score and "เสร็จแล้ว" (F69); the alert card written into the page (F70); the start screen's small labels (F71); a 404 page (F72); offline pages open their guide (F73); `robots.txt` and `<noscript>` say tools first (F74)
  - **C, the game:** the flood's pace (F75); "done" counts only what the player did (F76); hint rings only on things to do (F77); how-to step 4 tells the truth (F78); short screens (F79); the result's lessons and challenge line (F80); the LINE share sheet's wording (F81)

  See [CHANGELOG 1.9.1](../CHANGELOG.md).
- **Rule kept:** no item, room, slot or `houseVersion` changed, so houses and challenge links are unchanged (Prepare scores before and after aren't strictly comparable, because the water curve changed). No advice changed. New rules: [GUIDELINES 66–74](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lessons [C18–C20, D16–D17, E10–E11](LESSONS_LEARNED.md#d-testing-and-verification).
- **Done when:** the build has no warnings, 32 unit tests and 134 smoke checks pass on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027, axe-core finds nothing new, `npm run probe` shows 0 % overlaps and no target flooding before 20 s, and the walk has been repeated at 320 × 460, 360 × 640, 390 × 844 and 768 × 1024. All true on 19 Oct 2026.
- **What remains** (updated for v1.9.2, [N20](#n20-v192-answers-back-button-card-security)):
  - **Group D, the wrong answers:** done, rewritten in v1.9.2 (F83); a native reader still reads them ([L5](#l5-second-native-reader-for-the-thai-copy), [#66](KNOWN_ISSUES.md#66-the-right-answer-was-usually-the-longest-choice))
  - **Card legibility at chat size:** the result card done in v1.9.2 (F86), and the guide pictures differ (F87); the previews' helpline line, about 6 px in a chat, is open ([#68](KNOWN_ISSUES.md#68-link-previews-are-small-at-chat-size)); AI-ready, then re-render and compare pixels
  - **The back button inside a round:** done in v1.9.2 (F85); a real phone is still needed ([L6](#l6-real-phone-test-matrix), row 61)
  - **A tablet layout:** looked at in v1.9.2 and kept as a phone column, by design ([#71](KNOWN_ISSUES.md#71-on-a-tablet-the-app-is-a-narrow-column)); **the structured data:** done in v1.9.2 (F89), the Rich Results Test is the owner's ([L8](#l8-search-consoles-and-ai-search-check))
  - **Real phones:** rows 55–60 of the matrix ([L6](#l6-real-phone-test-matrix)), including Thai line breaks on an iPhone ([#69](KNOWN_ISSUES.md#69-kept-thai-words-are-a-hand-made-list))
  - **The owner:** confirm Web Analytics ([L1](#l1-create-the-cloudflare-pages-project)); post `/kit` and `/plan` with the new names ([04-launch-kit](04-launch-kit.md#the-home-check-and-the-plan-card-v180-any-time-of-year))

### N20. v1.9.2: answers, back button, card, security

- **Who:** AI-ready + Owner (review) · **Status:** Done (19 Oct 2026, v1.9.2); the Thai read of the new wrong answers ([L5](#l5-second-native-reader-for-the-thai-copy)), the phone checks ([L6](#l6-real-phone-test-matrix), rows 61–63) and the Rich Results Test ([L8](#l8-search-consoles-and-ai-search-check)) are left · **Issues:** fixed F83–F91 (#66, #67, #70, #72; #68 in part); #71 by design; new #73
- **Why:** the owner, 19 Oct 2026, after v1.9.1: "Continue what yo suggested to make app attractive and secure practical usability", with suggestions on the UI and UX, a check as visitors with cross-validation, frank advice, and the docs brought up to date at the end. What had been suggested were [N19](#n19-visitor-audit-2)'s leftovers: group D (the right answer was the longest choice in most sets, so it could be guessed), the result card at chat size, the back button inside a round, a tablet layout and the structured data.
- **How:**
  - **The wrong answers:** a written brief (keep the meaning and the mistake, add the reason a real person would give, no new facts, advice or numbers, a wrong label at most 60 Thai letters and 80 English characters, no filler); three agents drafted in parallel (prepare and power cut, return, dust and fire), each checking its own drafts' lengths; the lead read every draft against its item's `context` and `feedback`, then balanced the lengths so that the right answer is neither always nor never the longest; then removed the other tell on the button that the audit had counted, the icons ([APPROACH §29](APPROACH_AND_METHOD.md#29-answers-drafted-in-parallel-read-by-one-lead-v192), [KNOWLEDGE §31.1](KNOWLEDGE.md#311-wrong-answers-that-dont-give-the-right-one-away)).
  - **Small screens:** a scratch probe filled the real choice sheet with every item's labels at 320 × 568, 360 × 640 and 390 × 844, before and after the CSS change.
  - **The back button, the card, the pictures, the headers and the structured data:** written, then checked in a scratch probe, at chat size and by unit and smoke checks; the images re-rendered and compared by pixels.
- **What was fixed:**
  - the right answer no longer given away by its length: 117 wrong labels rewritten; longest in 17 of 82 sets in Thai and 16 in English, was 71 and 73 (F83)
  - nor by its icon: the answers are lettered ก ข ค (A B C) instead of an icon per `kind`, which made the right one the odd icon out in 26 of the 42 sets that had one (F90)
  - a choice's three answers fit on phones up to 640 px tall: no Thai sheet scrolls at 320 × 568, 360 × 640 or 390 × 844 (F84; English at 320 × 568 is [#73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones))
  - Back in a round pauses it, Back again resumes, Back on the result goes to the start screen (F85)
  - the result card's line and link can be read at chat size (F86)
  - the four guides with no game give the gecko a hard hat, the rain hood or a sun hat (F87)
  - security headers: no framing by other sites, no plugins, no foreign `<base>` or form target (F88)
  - a publisher in the structured data, `author` and `publisher` on the articles, `UtilitiesApplication`; `llms.txt` links `/kit` and `/plan` (F89); and, found in our own review before release, the English start page's game details written onto the publisher because the build edited the graph by position (F91)

  See [CHANGELOG 1.9.2](../CHANGELOG.md) and [KNOWLEDGE §31](KNOWLEDGE.md#31-answers-back-button-card-and-security-v192).
- **Not done, on purpose:** a tablet layout ([#71](KNOWN_ISSUES.md#71-on-a-tablet-the-app-is-a-narrow-column), by design); a `script-src` in the security policy (Cloudflare injects scripts, [GUIDELINES rule 76](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Rule kept:** no right answer, tip, `why`, `feedback`, source, `kind` or id changed, and no item, room, slot or `houseVersion`, so the advice, houses and challenge links are the same. New rules: [GUIDELINES 75–77](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lessons [B12, C21–C22, D18–D20](LESSONS_LEARNED.md#d-testing-and-verification).
- **Done when:** the build has no warnings, 36 unit tests and 138 smoke checks pass on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027, no Thai choice sheet scrolls at 320 × 568, the result card is read at 270 px wide, and only the images meant to change are committed. All true on 19 Oct 2026.
- **What remains:**
  - **The owner:** the Thai read of the new wrong answers ([L5](#l5-second-native-reader-for-the-thai-copy)); Back in a round on a real phone, inside LINE, and the card in a real chat ([L6](#l6-real-phone-test-matrix), rows 61–63); the Rich Results Test of the publisher ([L8](#l8-search-consoles-and-ai-search-check))
  - **After the deploy:** the live headers with `curl -sI` ([06-test-checklist](06-test-checklist.md#live-site-checks-search-and-ai-search))
  - **AI-ready:** English choice sheets at 320 × 568 ([#73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones), with the English reader); the previews' helpline line ([#68](KNOWN_ISSUES.md#68-link-previews-are-small-at-chat-size))

### N21. Calculators from the home check's idea (v1.10.0)

- **Who:** AI-ready + Owner (review) · **Status:** Done (19 Oct 2026, v1.10.0); the Thai read of the new texts ([L5](#l5-second-native-reader-for-the-thai-copy)), the phone checks ([L6](#l6-real-phone-test-matrix), rows 64–66) and the review of the international fridge hours and the dust tool's choices ([L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)) are left · **Issues:** fixed F92; new #74–#78; notes on #55, #57, #58, #59, #62
- **Why:** the owner, 19 Oct 2026, with a screenshot of the home check: "ชอบแบบนี้ ใส่ค่า แล้วคำนวณให้เลยว่าต้องเตรียมของยังไง เท่าไหร่ มีแบบนี้อีกไหม ดีๆ เอาแนวคิดนี้ไปใช้ทำ Features อื่นได้อีกไหม" ("I like this: put in values and it works out what to prepare and how much. Are there more good ones like this? Can this idea be used for other features?"), with the process: UI/UX suggestions, consistency across the app, a test as visitors on tablets and phones, a cross-check of the output, frank suggestions (including on the owner's instructions), the integration, and the docs brought up to date before the commit.
- **How:** the pattern was named first (answers given once, sourced numbers only, rounding in the safe direction, nothing sent, a result to send, pure functions); a research agent read the PCD's notice in the Royal Gazette, the news quoting the PCD and the DOH, and the TMD's heat-index pages while the lead built the fridge tool from sources already in the repository; content in `kit.json` with build checks made to fail on a wrong figure; pure functions with unit tests; 19 smoke checks; a visitor walk at five phone and tablet sizes with axe-core; a cross-check script written apart from the app's code ([APPROACH §30](APPROACH_AND_METHOD.md#30-from-one-tool-the-owner-liked-to-three-v1100), [KNOWLEDGE §32](KNOWLEDGE.md#32-calculators-the-fridge-dust-today-the-pills-v1100)).
- **What was built:**
  - **ไฟดับ: ของในตู้เย็นยังกินได้ไหม?** (`/fridge`, `/?open=fridge`): how long the power has been off (± one hour, or a count from now that goes on after the page is closed), how full the freezer is, cold medicine → how much longer the fridge (4 h), the freezer (48 h full, 24 h half) and cold medicine (a day) keep, and until what time; the hours from the US CDC and Ready.gov, ⚠️, and the tool says no Thai agency advice was found; time off rounds up, time left down; the hub tile counts the hours of a cut
  - **ฝุ่นวันนี้ บ้านเราต้องทำอะไร?** (`/air`, `/?open=air`): a reading in µg/m³ or Thailand's AQI, or a colour, and who at home needs extra care → the level and what everyone, the people at risk and a long-term illness should do, from the PCD's notice of 2023 (bands verified in the Royal Gazette), with two DOH lines, named; who is at home starts from the home check
  - **ยาพอกี่วัน?** in the home check: pills left and pills a day → the days they last and how many more make 7
  - **Integration:** a 2 × 2 hub; `hazards.<h>.tools` with `fridge` (power cut, storms) and `air` (dust) on the pages, in the guides' next steps and on the results; `/fridge` and `/air` with their previews; a sitemap of 28; `llms.txt`; two app shortcuts; `tool_open` and `tool_share`; "📤 ส่งให้คนที่บ้าน"; the texts about the whole app

  See [CHANGELOG 1.10.0](../CHANGELOG.md).
- **Not done, on purpose:** a heat-index calculator, until a person confirms the TMD's page ([#78](KNOWN_ISSUES.md#78-a-heat-index-calculator-is-not-built), [P10](#p10-more-calculators)); the two new tiles on the first screen of the smallest phones ([#77](KNOWN_ISSUES.md#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones), by design).
- **Rule kept:** no item, room, slot or `houseVersion` changed, and no lesson, so houses, challenge links and the game's advice are the same. New rules: [GUIDELINES 78–81](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lessons [A7, B13–B14, C23, D21–D22](LESSONS_LEARNED.md#d-testing-and-verification).
- **Done when:** the build has no warnings and stops on a wrong hour or band; 39 unit tests and 157 smoke checks pass on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027; the walk at 320 × 568, 360 × 640, 390 × 844, 768 × 1024 and 1024 × 1366 finds no sideways scrolling, no control under 44 px and no errors; axe-core finds nothing new; the independent cross-check agrees on every reading and time. All true on 19 Oct 2026.
- **What remains:**
  - **The owner:** decide whether to post `/fridge` with the international hours, flagged, or wait for a Thai source ([#74](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only)); the Thai read of the new texts ([L5](#l5-second-native-reader-for-the-thai-copy)); the phone test of the fridge timer after closing the app, the dust tool inside LINE and the pills ([L6](#l6-real-phone-test-matrix)); a look at Air4Thai for how it colours hourly readings ([#75](KNOWN_ISSUES.md#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings)); the TMD heat-index page ([#78](KNOWN_ISSUES.md#78-a-heat-index-calculator-is-not-built)); posting `/fridge` before the next storm season and `/air` from December ([04-launch-kit](04-launch-kit.md#the-fridge-and-dust-today-v1100))
  - **AI-ready:** the next calculators ([P10](#p10-more-calculators))
- **Since:** the owner couldn't read the fridge tool on the live site, and its screens and the dust tool's were redone in plain words in v1.10.1 ([N22](#n22-calculators-in-plain-words-v1101)).

### N22. Calculators in plain words (v1.10.1)

- **Who:** AI-ready + Owner (review) · **Status:** Done (19 Oct 2026, v1.10.1); the Thai read of the new words ([L5](#l5-second-native-reader-for-the-thai-copy)) and the phone test of the taps ([L6](#l6-real-phone-test-matrix), rows 64–65) are left · **Issues:** fixed F93, F94; notes on #3, #58, #74, #75
- **Why:** the owner, 19 Oct 2026, with a screenshot of the live v1.10.0 fridge tool ("ไฟดับมานานแค่ไหนแล้ว? 1 นาที", − / +, "นับจากราว 22:38 น. ระบบนับต่อให้เองแม้ปิดหน้านี้", "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้", rows such as "✅ ยังเก็บได้อีกราว 3 ชม. 59 นาที ถ้าไม่เปิดประตูตู้ · ถึงราว 02:38 น. 20 ต.ค." each with "ที่มา: ศูนย์ควบคุมและป้องกันโรคสหรัฐฯ (CDC) · ⚠️"): "I cannot understand, please review and validate the UI and UX, try to improve and use general simple language." Every automated check had passed: the tool was correct, but not clear ([LESSONS A8](LESSONS_LEARNED.md#a-product-and-audience)).
- **How:** the screenshot read as a first-time visitor (five problems: counting before asked, two ways in, three facts per line, the source repeated, jargon first and the freezer question below its answer); each tool redesigned one question at a time; the dust advice reworded with its meaning, strength and source kept; the tests changed to the new taps; the walk at five sizes, axe-core and the cross-check run again ([APPROACH §31](APPROACH_AND_METHOD.md#31-a-plain-words-pass-after-the-owner-couldnt-read-a-tool-v1101), [KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)).
- **What changed:**
  - **The fridge:** one question, "ไฟดับมานานเท่าไรแล้ว?", 9 buttons (เพิ่งดับ to 2 วัน, `kit.json → fridge.quick`); nothing counted or stored before a tap; "⏱️ ไฟดับมาแล้ว 3 ชม. แอปจะนับเวลาต่อให้ ปิดแล้วเปิดใหม่ได้" and "💡 ไฟมาแล้ว" after it; one card per part, a status word first ("ยังกินได้", "ใกล้ครบ 4 ชม.", "เกิน 4 ชม.แล้ว") and one line, no clock time; the freezer's question in its card; "จำไว้" in three short lines; the sources once at the bottom; times read "about", to the minute and in whole hours from 3 h, the status from the exact time
  - **Dust today:** the colour first ("ค่าฝุ่นตอนนี้เป็นสีอะไร?", bigger buttons), the number behind "🔢 รู้ตัวเลข? ใส่ตัวเลขแทน", shorter labels for who is at home, every level's advice in everyday words with the same meaning and strength (ให้น้อยลง / ให้สั้นลง / เลี่ยง / งด), every source kept and the DOH's lines still named
  - **The pills and the tile:** "⏳ พออีก 4 วัน ต้องมีเพิ่ม 5 เม็ด จะพอ 7 วัน"; "ค่าฝุ่นนี้ ต้องทำอะไร"
  - **Content and build:** `fridge.parts[].say`, `cond`, `ok`, `note`; 7 `ui` keys removed and 8 added (97); the build checks `say` and `cond` or `ok`

  See [CHANGELOG 1.10.1](../CHANGELOG.md).
- **Rule kept:** no hour, band edge, source or `verify` changed, and no item, slot or `houseVersion`, so houses, challenge links and the game's advice are the same. New rule: [GUIDELINES 82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); rule 78 rewritten; lesson [A8](LESSONS_LEARNED.md#a-product-and-audience) new, B13 rewritten.
- **Done when:** nothing is counted before a time is tapped and the five colours are on the first screen at 360 × 640 (both smoke-checked); the build has no warnings; 39 unit tests and 159 smoke checks pass on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027; the walk at 320 × 568, 360 × 640, 390 × 844, 768 × 1024 and 1024 × 1366 finds no sideways scrolling, no control under 44 px and no errors; axe-core finds nothing new; the cross-check agrees on 35 of 35 readings and 8 of 8 times. All true on 19 Oct 2026.
- **What remains:** the owner: the Thai read of the new words, including the three rewordings to confirm ([L5](#l5-second-native-reader-for-the-thai-copy)), and the taps on a real phone, ideally handed to an older relative without help ([L6](#l6-real-phone-test-matrix), rows 64–65). Every future tool gets the same first-time read before it ships ([GUIDELINES rule 82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### N23. Food by food, and the app for its real readers (v1.11.0)

- **Who:** AI-ready + Owner (review) · **Status:** Done (20 Oct 2026, v1.11.0); the reviews ([L5](#l5-second-native-reader-for-the-thai-copy), [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)), the phone test ([L6](#l6-real-phone-test-matrix), rows 67–75), three owner decisions and the leftovers below are left · **Issues:** fixed F96–F128 (F128 was #85, found while documenting); new #79–#84; notes on #3, #58, #59, #62, #74, #76, #77
- **Why:** the owner, 20 Oct 2026: "# fridge — จริงแล้วควรคำนวณว่า ของอะไรในตู้เย็นได้นานแค่ไหน / # usability — Please analyse the usability and practical use of the app, the try to improve and revise the whole app. / # target and main users — Please research who can be potential users who get from line and social media in Thailand.", with the usual process: UI/UX suggestions validated for consistency, a test as visitors, the output validated and cross-validated, frank suggestions, the integration, every doc updated and a commit.
- **How:** four research agents in parallel (the fridge's sources food by food; the Thai audience on LINE and social media, now [07-audience.md](07-audience.md); visitor audit A, an older relative in LINE at 360 × 640 and 320 × 568 with the text at 1.3×, 28 findings, one blocker; visitor audit B, a parent preparing at the weekend, an English reader and a consistency check at 390, 360 and 768 px, 29 findings, nine major); one decision list with the auditors' ids; the work in batches; then unit and smoke tests, a visitor walk at four sizes in LINE's user agent, axe-core, and an independent cross-check of every food at 18 times (1,368 agree, 0 disagree) ([APPROACH §32](APPROACH_AND_METHOD.md#32-four-researchers-in-parallel-then-one-decision-list-v1110), [KNOWLEDGE §33](KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110)).
- **What shipped:**
  - **The fridge, food by food:** the fridge's 4 hours decide when, each food's row of FoodSafety.gov's and USDA FSIS's charts decides what: 13 foods (9 to throw out, 4 that keep, Thai names; น้ำปลา and four others left out on purpose), 4 freezer packs by ice crystals, "anything not on the list: if in doubt, throw it out", a hot-room line (the UK FSA); an unanswered freezer counts as half full (24 h); "💡 ไฟมาแล้ว" keeps the answer for a day; a hint between buttons and a clock-time box; the shared text says the clock time; `/fridge` food by food with new previews; seven new sources (119)
  - **Medicine never "throw it out"** (the audit's blocker): insulin 28 days at 15–30 °C (the FDA, Siriraj), other cold medicine "🔎 check the label", "ask a pharmacist", "don't throw away what you can't do without"; breast milk in the fridge and the freezer (the CDC); and the game's lesson `s-medcold`, which said "discard after a day" too, reworded to match (F128)
  - **Dust today for everyone at home:** the at-risk lines always shown, with no line twice; the Air4Thai link under the colours; "15,1" reads 15.1; มคก./ลบ.ม. in Thai; 🌫️ for the tool
  - **Named helplines** and the numbers that fit each guide (`calls`), on the guides, their pictures and print, the hazard pages and the plan card; the power-cut guide opens with the fridge tool (`now`); check links on the flood and dust guides; ⚠️ only for "under review"; the fire guide offers the plan
  - **Sharing that says what it sends:** the plan's honest share text and "📋 คัดลอกแผนเป็นข้อความ", the home check's "🛒 คัดลอกรายการที่ยังขาด" and "ยังขาด 10 อย่าง เช่น:", the hold-to-save hint first, "คัดลอกข้อความ"
  - **The start screen and the result:** the alert's end date, the trust line, "ก+" (`big_text`), a "เตรียมบ้านต่อ" row under share; Thai pages without the English twin lines (`/flood` 32,360 → 26,209 px at 360 px); links that keep Thai words whole; larger small print
  - **New doc:** [07-audience.md](07-audience.md), 50 sources, seven personas, implications and signals

  See [CHANGELOG 1.11.0](../CHANGELOG.md).
- **Rule kept:** no item, room, slot or `houseVersion` changed, so houses and challenge links are the same; one lesson's text changed: `s-medcold`'s `why` and one feedback no longer say "discard after a day" (F128), so an "UPDATE:" post is due; no hour, band edge or dust line changed. New rules: [GUIDELINES 83–89](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); lessons [A9, B15, B16, C24, D24, D25](LESSONS_LEARNED.md#d-testing-and-verification), and D23 extended.
- **Done when:** the build has no warnings; 40 unit tests and 163 smoke checks pass on the pinned days; the walk at 320 × 568, 360 × 640, 390 × 844 and 768 × 1024 finds no sideways scrolling, no control under 44 px and no errors, with ก+ on; axe-core finds nothing new; the cross-check agrees on every case. All true on 20 Oct 2026, on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027.
- **Left** (in [KNOWN_ISSUES #83](KNOWN_ISSUES.md#83-leftovers-of-visitor-audit-3) and [#84](KNOWN_ISSUES.md#84-ideas-from-the-audience-research-not-built-yet) unless marked):
  - **Done in the same release:** `s-medcold`'s "discard after a day", found while documenting, reworded with the FDA's source ([F128](KNOWN_ISSUES.md#in-v1110-20-oct-2026)); the owner posts an "UPDATE:" for it
  - **AI-ready:** "กระเป๋าฉุกเฉิน" / go-bag in the flood guide's line 1 and the topic "Plans & go-bag" (B9): define it ([P10c](#p10-more-calculators)) or reword; Back from a tool opened inside a guide returns to the start screen, not the guide (B12, A24); one short and one long name per tool, held by a test (B13); units and date formats (B16: ชม. and ชั่วโมง, "60 วิ" beside 55 and 50 s rounds, three date formats); the pages count 81 lessons, the app 79 (B17); the same agency twice in a source line (B23); an English 404 page (B24); `/posts` pictures for the tools (B28); the plan form's order, the shelter first (B29); who issued the alert and for where (A8); text sizes in `rem` ([#81](KNOWN_ISSUES.md#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)); a regional posting calendar in [04-launch-kit](04-launch-kit.md#5-relaunch-every-rainy-season)
  - **AI-ready, with people:** a print pack for อสม. and village heads (A4, one guide per page, a QR code: ties in with [P5b](#p5-share-loop-ideas-not-built-yet)); Burmese pictures of the top three guides with a native translator, then Khmer and Lao ([P4](#p4-more-languages)); a looped Thai font for body text, tested with real older readers; a second household in the home check ("บ้านพ่อแม่")
  - **The owner decides:** the home check's add-ons per hazard (N95 masks, an extinguisher, boots and gloves, sandbags, closed shoes) and a "not needed here" answer (B5, B10; `/kit`'s title still says "รับมือทุกภัย"); the dust guide and dust today at orange (B8, [#76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red)); a `?src=` channel code and an in-app-browser bucket on `view` (privacy; [05-metrics](05-metrics.md#larger-text-and-the-real-readers-v1110))
  - **The owner's reviews:** the food list and its Thai names, eggs and ลูกชิ้น / หมูยอ ([#79](KNOWN_ISSUES.md#79-the-fridges-food-lists-rest-on-us-charts)); the insulin and medicine wording, ideally with a Thai pharmacist ([#80](KNOWN_ISSUES.md#80-insulin-above-30-c-has-no-number)); the breast-milk lines, with a nurse or the DOH's breastfeeding centre; "power: Bangkok area" ([#82](KNOWN_ISSUES.md#82-power-bangkok-area-stands-for-meas-three-provinces)) ([L5](#l5-second-native-reader-for-the-thai-copy), [L10](#l10-thai-review-of-the-dust-fire-and-power-cut-lessons))
  - **The phone test:** rows 67–75 ([L6](#l6-real-phone-test-matrix)), on Android 10–11 inside LINE and Facebook as well as a current phone

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

### P4. More languages

- **Who:** Owner + AI · **Status:** Todo (optional)
- **Why:** English and Thai cover the first launch. Tourists and migrant workers in Thailand may read Burmese, Lao, Khmer or Chinese.
- **Steps:** add a `strings.json` block and an `ogEn`-style set for the language, a path such as `/my/`, extend `langPath`, `guessLang` and the build's `localize()`, and have a native reader check the safety text. Do not machine-translate safety advice without that review.
- **Done when:** the build, tests and smoke test cover the new language and a native reader has signed off.

### P5. Share-loop ideas not built yet

- **Who:** AI-ready (P5a–c) / Owner + AI (P5d) · **Status:** Todo (optional)
- **P5a. Weekly house** ("บ้านแห่งสัปดาห์"): a house key per ISO week, a third start button for the week, its own streak. It gives family groups one house to compare all week.
- **P5b. QR code on the card and the checklists:** for people who print the checklist or forward only the picture. It needs a small hand-written QR encoder (no runtime packages); check the 500 KB budget first.
- **P5c. Family round-up:** the share text of a challenge chain could list every score it has seen (`?s=8,6,9` in the link). Keep it to scores only, no names, and cap the list.
- **P5d. Crowd stats on the page** ("7 in 10 players turned the breaker off"): needs aggregate numbers from Analytics Engine published as a static JSON by the owner, never per-player data.
- **P5e. Themed practice house:** a random house built only from one topic (for example "🦠 health week"). It needs the topic in the house key so challenge links rebuild the same house; until then the featured card sends players to `/learn` and the book.
- **Done when:** each idea is built with a smoke check, or dropped with a reason written here.

### P6. More lessons for the remaining disease groups

- **Who:** Owner + AI · **Status:** Todo (optional)
- **Why:** the DDC's six groups (27 Sep 2026) are now covered except **skin infections** (keep skin clean and dry, avoid walking barefoot; partly in `r-mudfeet`) and **respiratory infections** (hygiene, a mask when coughing or sneezing). Melioidosis (southern provinces) is not covered either.
- **Steps:** find an agency source (or the DDC page itself), draw a sprite, pick a slot, run `npm run probe`, and keep each tip under 80 characters in both languages.
- **Done when:** each new lesson has a source, a topic, a smoke-checked tip card, and the probe still reports 0%.

### P7. Heat and summer storms

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** The guides are done (v1.9.0): อากาศร้อนจัด (`heat`, 10 ✅) and พายุ ลมแรง ฟ้าผ่า (`storm`, 9 ✅, 1 ⚠️), with the pages `/heat` and `/storm` ([N17](#n17-tools-first-and-a-guide-for-every-hazard), [KNOWLEDGE §29.3](KNOWLEDGE.md#293-the-four-new-guides-and-their-sources)). The game modes are Todo.
- **A game mode now starts from its guide:** its lessons can only teach what the guide's sources back. Two candidates below were researched for v1.9.0 and **left out**: unplugging in lightning (ปภ. says unplug, the US NWS says don't) and tying down roof sheets (no source found); don't add them as lessons without a source that settles it ([KNOWLEDGE §29.4](KNOWLEDGE.md#294-what-was-left-out-and-why)).
- **Season:** March–May (`months: [3, 4, 5]`), next to fire. Reserve code `h` for heat.
- **Why:** heat illness and summer storms (พายุฤดูร้อน: wind, hail, lightning) hit in the same dry months as fire, and DDPM and the DOH publish advice every year.
- **Candidate lessons** (each needs its own source): water for elders and children, never leave a child or pet in a parked car (v1.9.0 found no Thai source for pets), tie down loose roof sheets and signs (no source found in v1.9.0), stay away from big trees and billboards in a storm, unplug in lightning (sources disagree), call 1669 for heatstroke.
- **Sources to try:** DDPM summer-storm advice (via PRD or news), DOH heat advice, TMD warnings (1182), WHO heat-health guidance (international). Since v1.9.0, 21 of them are in `sources.json` with notes (`ddpm-storm6`, `ddc-heatstroke-2568`, `who-heat` and others).
- **A heat calculator** (the heat index from the temperature and humidity) is [P10a](#p10-more-calculators); it waits for a person to confirm the TMD's page. A game mode doesn't.
- **Art:** a heat shimmer threat (`haze` with a warm tint) or a storm layer. The gecko's sun hat (`sunhat`) exists since v1.9.2, on the heat guide's picture.
- **Done when:** the mode passes [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode) and a person has reviewed the advice.

### P8. Earthquake and tsunami

- **Who:** AI-ready (research and build) + Owner (review) · **Status:** The guide is done (v1.9.0): แผ่นดินไหว (`quake`, 9 ✅, 1 ⚠️: the tsunami line), with the page `/quake` ([N17](#n17-tools-first-and-a-guide-for-every-hazard)). The game mode is Todo.
- **Before a mode:** settle with a Thai reviewer what the tsunami line should say (the sudden ebb as a signal is read from TMD's technical paper; the `verifyNote` keeps a fully verified fallback) and whether "leave a tall building" waits for the shaking to stop: the sources disagree, so the guide's stairs line gives no timing ([KNOWLEDGE §29.4](KNOWLEDGE.md#294-what-was-left-out-and-why)).
- **Season:** any time; feature it around 26 December (the 2004 tsunami anniversary) and after quakes in the news (Bangkok felt the March 2025 Myanmar quake).
- **Why:** rare but high-impact; people in high-rise condos and on the Andaman coast need a few clear actions.
- **Candidate lessons:** drop, cover, hold on; stay away from windows and tall furniture; secure shelves; after shaking, use the stairs not the lift; on the coast, a strong quake or the sea pulling back means go to high ground at once; know the evacuation route signs.
- **Sources to try:** DDPM and the Department of Mineral Resources, the National Disaster Warning Center, Great ShakeOut and Ready.gov (international).
- **Note:** this may need a condo room (P1) and a coast scene; the current rooms suit the indoor part only.
- **Done when:** as P7.

### P9. A safety calendar: one hazard week at a time

- **Who:** Owner + AI · **Status:** Todo
- **Why:** year-round engagement works best with fixed dates people expect (the Great ShakeOut drill, Ready.gov's monthly themes). A Thai calendar could be: dust week (December), fire week (April), flood week (May, before the rains), tsunami day (26 December).
- **Steps:**
  1. The owner picks the weeks and who to partner with (schools, district offices).
  2. An assistant adds `config.weeks` (start, end, mode, featured topic), so the start screen and the featured card switch by themselves; the season default stays as the fallback. Since v1.6.0 the switches have end dates and the choice is one pure function, `recommend()` in `modes.js`, so a week would be one more rule there, tested on a fixed date like the others.
  3. A launch-kit post per week in [04-launch-kit.md](04-launch-kit.md).
- **Done when:** each week switches the start screen without a code change, and the posts are written.

### P10. More calculators

- **Who:** AI-ready (research and build) + Owner (review; for heat, a person who can open the TMD's page) · **Status:** Todo (proposed in v1.10.0; v1.11.0 widened the fridge tool, food by food, instead of adding one) · **Issues:** #74, #78, #79
- **Why:** the owner liked the idea of "put in values and it works out what to prepare and how much" and asked for more like it (19 Oct 2026, [N21](#n21-calculators-from-the-home-checks-idea-v1100)). v1.10.0 built three; these are the next, each only where a source gives the numbers ([GUIDELINES rules 78–82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **P10a. Heat today, first:** the temperature and the humidity → the heat index, its level and what to do. The current levels (watch 27.0–32.9, warning 33.0–41.9, danger 42.0–51.9, extreme danger 52.0 °C and over: the DOH and TMD scheme of 2024) were read on 19 Oct 2026, but only the danger band on the TMD's own site; the others came from Post Today, InfoQuest (the BMA) and Thai PBS, and older bands are still in print ([KNOWLEDGE §32.8](KNOWLEDGE.md#328-research-record-19-oct-2026)). The TMD's 2012 explainer prints the US NWS (Rothfusz) formula; whether the current TMD product uses it is **[unverified]**. **Conditions:** build the formula version only after a person confirms the TMD's heat-index page (the four levels, and the formula with its adjustments), with the formula's source in `sources.json` and its constants checked by the build like the dust bands; **or**, without that, let people pick the level the TMD publishes (its expected maximum by region, Mondays, Wednesdays and Fridays) and show only what to do at that level. The advice per level differs by agency without contradicting (the BMA's 11:00–15:00 is the BMA's alone); name each agency on its line (rule 81). People at risk in the heat (the TMD's page): young children, older people, a chronic illness, obesity, alcohol, long work outdoors; the home check's answers can start the ticks (rule 80). It would join the `heat` guide's next steps (`hazards.heat.tools`).
- **P10b. Water for a longer cut, or for a sick person:** the home check's 3 L × people × 3 days for more days, or more water for someone ill, an infant or someone on oral rehydration. Needs sources that give those amounts for Thai homes; none was looked for yet. Without them, don't build it.
- **P10c. A go-bag per person:** what each person in the household takes when leaving, from ปภ.'s kit lists and the home check's answers (a baby, an older person, daily medicine, a pet). The items are sourced already (`ddpm-6kit`, `prd-72h`, `readygov-kit`); amounts only where a source gives them.
- **P10d. A plan card filled from the home check:** who helps whom, prefilled with the people the home check knows about (a small child, an older person), and the medicine line from the pills calculator. No new numbers; it is rule 80 applied to the plan card.
- **Since v1.11.0** ([N23](#n23-food-by-food-and-the-app-for-its-real-readers-v1110)): the fridge tool answers food by food, with insulin, other cold medicine and breast milk, so a new calculator now has a fuller pattern to follow: a named chart row for each verdict and a left-out list ([GUIDELINES rule 84](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)), never "throw it out" for medicine (rule 83), advice for the reader's own group never behind a tick (rule 86), and a share text that is true without the picture (rule 87). P10c's go-bag would also settle the "กระเป๋าฉุกเฉิน" the app uses without defining it ([KNOWN_ISSUES #83](KNOWN_ISSUES.md#83-leftovers-of-visitor-audit-3)), and P10d could take the home check's second household ("บ้านพ่อแม่", [#84](KNOWN_ISSUES.md#84-ideas-from-the-audience-research-not-built-yet)).
- **Also:** a printable version of the fridge's and dust today's results (as the home check's list prints, §29.10); and in the dust season, an alert-style tie-in that points to dust today (`config.json → alert` or the featured card, with an end date, rule 63).
- **Steps for each:** research first and record conflicts; content in `kit.json` with build checks that fail on a wrong figure; a pure function with unit tests at every edge; the sheet, a page with a preview, `TOOL_IDS` and `TOOLS`, the hazard's `tools`; smoke checks that read every `/api/e` body; a visitor walk at five sizes with axe-core; an independent cross-check script ([APPROACH §30](APPROACH_AND_METHOD.md#30-from-one-tool-the-owner-liked-to-three-v1100)); and, before it ships, a read as a first-time older visitor: one question at a time, nothing started before it is asked, a status word first, the source once ([GUIDELINES rule 82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [APPROACH §31](APPROACH_AND_METHOD.md#31-a-plain-words-pass-after-the-owner-couldnt-read-a-tool-v1101)).
- **Done when:** each calculator is built with its checks, or dropped with the reason written here.

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
  5. Run all the tests and the real-phone matrix. Run the smoke test once with `SMOKE_DATE` set to a day in the coming season as well.
  6. Post the relaunch, following [04-launch-kit.md §5](04-launch-kit.md#5-relaunch-every-rainy-season).
- **Each season (and each news wave), set the switches with end dates:** `rainWarningActive: true` with `rainWarningUntil` before a rain wave, and `featuredTopic` with `featuredTopicUntil` while a topic is in the news. Pick the last day the switch should show (a Bangkok date, included); it turns itself off after that. Check the build's `start` line, which shows what visitors see today, and its warnings ([KNOWN_ISSUES #44](KNOWN_ISSUES.md#44-the-featured-topic-is-switched-by-hand)).

### S2. When something is in the news: the alert and the guide posts

- **Who:** Owner (+ AI for a new guide) · **Status:** Recurring (since v1.9.0) · **Issues:** #52, #64
- **Why:** hazards don't follow a calendar we can source: a quake abroad, a storm warning, a heatwave or a flash flood can be the topic of the day without notice. The guides and the alert switch let the owner answer within minutes, without a code change.
- **Steps:** the 5-minute playbook in [04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook): set `config.json → alert` with an end date and push; save the guide's picture and caption from `/posts`; post with `/checklist/<id>` or the hazard page; clear the alert after.
- **When there is no guide for it:** ask an assistant for one, following [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode) step 0 (a guide first): research, 10 sourced lines by phase, the hazard page, the pictures. That takes a release, not five minutes; meanwhile post the closest guide or the home check (`/kit`).
- **Each time:** read the build's `start` line after the push; after the end date, clear the alert or set a new date (the build warns until you do).

### H1. Housekeeping

- **Who:** Owner · **Status:** Partly done
- **Done, 6 Oct 2026:** in `bejranonda/carrier-vector-1988`, the old game branch `ccr-b279fcc9-aqphnj` was pointed back at `master` (`7a9c196`). It carries no game commits and is no longer ahead of `master`.
- **Optional:** delete that branch in the GitHub UI (Branches → 🗑). The session's git proxy refuses branch deletion.
- **Optional:** confirm the MIT license, or change it in `LICENSE` and `package.json`.

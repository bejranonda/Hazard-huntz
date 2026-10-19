# Test checklist

## Automated (run before every release)

```bash
node tools/build.mjs     # validates all content JSON; fails on any error
npm test                 # rule tests (36 in v1.9.2): a year of daily houses in every mode, flooding, the power cut's fridge at 4 hours, scoring, bonus, challenge links, midnight reset, safety book, share texts, switch end dates, what the start screen recommends, the home check's amounts, card lines that never start with closing punctuation, the alert switch, the guides with no game, the flood's pace, kept Thai words on the cards, the keepTogether list, the answers' lengths, the guides' props, the security headers, the structured data
npm run smoke            # browser checks (138 in v1.9.2) in headless Chromium (needs CHROME_PATH or `npx playwright@1.63.0 install chromium`)
SMOKE_DATE=2026-12-05 npm run smoke   # the same, on another Bangkok day (here: dust season)
npm run probe            # tap-area overlaps + flood timings, when slots, sizes or the water curve change
npm run check:docs       # every relative link and anchor in the Markdown resolves
```

Each run ends with its own count (`36 passed, 0 failed` and `138 passed, 0 failed` in v1.9.2, the smoke test on the pinned day, as 5 Dec 2026 and as 10 Apr 2027); the number the run prints is the reference, not the one written here. Read it after adding checks: a file that doesn't parse runs nothing ([LESSONS D20](LESSONS_LEARNED.md#d-testing-and-verification)).

The smoke test plays on a pinned Bangkok day: `SMOKE_DATE`, 18 Oct 2026 by default. Only `Date` is moved; time keeps running. What the start screen should show that day comes from `recommend()` in `modes.js`, so the test never reads the real calendar ([KNOWN_ISSUES #53](KNOWN_ISSUES.md#53-the-smoke-test-runs-on-a-pinned-date)). It covers:

- Android Chrome: a full Prepare round with a decoy, a wrong answer and the result card; since v1.8.1 the result offers the home check (🎒), because `config.json → hazards.flood.tools` lists it.
- An iPhone-SE-sized screen (375×548):
  - item tap areas ≥ 44 px (measured 47.5 px)
  - every button, link and expander ≥ 44 px on the game and result screens
  - the same check on the checklist, help and about sheets
- LINE in-app user agent: long-press hint, no download button, open-in-browser link.
- The funnel (v1.5.2): at 360 × 640 the result's share button and LINE in the share sheet are on the first screen; at 320 × 460 a challenge link's accept button is.
- Every non-flood mode (dust, fire, and since v1.7.0 the power cut): a full round with one wrong answer, the result card and lessons, its haze, smoke or dark layer, no page errors (v1.5.0).
- The power cut (v1.7.0): at 4 story hours the fridge's food is lost (status, the `spoiled` class), the HUD reads "ไฟดับมา 4 ชม.", and the room is darker.
- The room arrows (v1.7.0): in every mode, room and three houses, at 390 × 760 and 360 × 640, no arrow covers more than 5 % of an item's tap area.
- Facebook in-app user agent: the challenge link `/c/r9?h=20261007&fbclid=…` rebuilds the same house, and its preview page has its own image.
- Checklist deep link (1080×1920 image) and the English toggle.
- **Offline play after the first visit.**
- Reduced motion, and analytics beacons.
- What the start screen recommends (v1.6.0): the pinned day's mode, gecko line, "check before you go" link and featured topic; 5 Dec 2026 recommends dust with the air topic and Air4Thai; `/?mode=fire` opens on fire with no round and counts `view · fire · link`; `/?mode=heat` is ignored; a challenge beats `?mode=`; `/en/?mode=dust`, and a visitor from London keeps the link.
- The hazard pages (v1.6.0): `/flood`, `/pm25`, `/fire`, `/ready` (v1.7.0) and `/en/…` (heading, canonical, `hreflang`, play links, lesson count, JSON-LD, preview image, and since v1.8.1 the home check and plan card links on a hazard with `tools`: `/flood`, `/ready` and their twins); `/learn`, the sitemap and `llms.txt` link them, and `/learn` and `llms.txt` link both tools (v1.8.1); at 320 × 460 every control there and on `/learn` is 44 px or more and the play button is on the first screen; `/pm25` → play → the dust card, no round started.
- The ending on the result screen and in the card's `alt` text (v1.6.0).
- The guide-only hazard pages (v1.9.0): `/landslide`, `/storm`, `/quake`, `/heat` and `/en/…` (heading, canonical, `hreflang`, a guide of 10 lines with a source on every line, its picture link, JSON-LD, the preview image, the tool links); at 320 × 460 the first line of the guide **starts** on the first screen; `/kit` and `/plan` (+ `/en/`): their own preview image, every line, a button into the tool, in the sitemap, controls ≥ 44 px; `/posts` lists the nine guide pictures with a caption each.
- Tools first (v1.9.0), at 320 × 460 and 360 × 640: the three hub buttons are on the first screen; the alert card shows the guide `activeAlert()` gives for the pinned day (on 18 Oct 2026 the landslide guide, on 5 Dec 2026 none); the picker lists every guide in config order, the alert's first; each of the nine guides opens with 10 lines, its 1080 px picture, ▶ only when it has a game, a link to its hazard page, sources on the guides with no game, and 44 px controls; print produces an A4 PDF of 10 boxes with ⚠️ on the lines under review and the app hidden; ▶ in a guide starts its game; `/?open=guide`, `/checklist/quake` and `/en/checklist/heat` open the right sheet; an alert forced to `storm` shows its card and opens the storm guide; a challenge link hides the hub and the alert; `guide_open` and `print` are sent; no page errors.
- The visitor audit of 19 Oct 2026 (v1.9.1): the phone's back button closes a sheet and stays in the app; ✕ stays at the top of a long sheet (44 px) and closes it; a guide's "during" is one tap away, its helplines are `tel:` buttons, and its next steps lead to the home check and the plan; a guide with no game is shared without promising a game; sharing to LINE opens one new tab and this tab stays (a `window.open` stub that returns `null` for `'noopener'`, as browsers do); no kept Thai word is split across lines in a guide; kept words look like the text around them (guide, start screen, safety book); opening `/en/` once doesn't make Thai links open in English, and the language button is remembered; the alert card is in the page before the script runs; checklist pages point their canonical at the hazard page; an unknown address gets the 404 page (the test server answers like Pages); the app served at `/quake` offline opens the quake guide; the fire smoke is drawn at 360 × 640; the idle hint rings things to do, never decoys; nothing floods in the first 19 s and the HUD shows what the water took (💧) apart from what was done; no page errors. The hazard-page check at 320 × 460 requires the helplines and the first line on the first screen, and no game button before the list.
- v1.9.2, at 360 × 640 with a page opened before the game (as a chat would be): a choice's answers are lettered ก ข ค, with no icon that tells them apart; the phone's back button inside a round pauses it (the pause sheet), and Back again resumes it, still on the site; Back on the result goes to the start screen, still on the site; no page errors.
- The home check and the plan card (v1.8.0), at 360 × 640 from `/?open=kit`: 4 people with daily medicine give 36 litres of water and list the medicine but not baby items; answers and ticks are kept in `brm:kit`; every control of the questions, the list and the plan form is 44 px or more; the check's card renders at 1080 px with LINE on the first screen; the plan card renders; "← แก้แผน" in its share sheet goes back to the form with what was typed (v1.8.1); the typed plan text is in no `/api/e` body, while `kit_open`, `kit_share`, `plan_open` (v1.8.1) and `plan_share` are sent; no page errors.

## Manual matrix (real phones)

Mark ✅ / ❌ / n/a. "In-app" means: open the link from a chat or post inside that app.

| # | Check | iOS Safari | Android Chrome (mid-range) | LINE iOS | LINE Android | Facebook iOS | Facebook Android | TikTok iOS | TikTok Android |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Start screen shows Thai text in Kanit (no boxes), within 3 s on 4G | | | | | | | | |
| 2 | First load on a throttled "3G" profile is usable in under 8 s (Chrome DevTools) | | | | | | | | |
| 3 | The recommended mode has the "แนะนำช่วงนี้" badge and comes first | | | | | | | | |
| 4 | How-to shows on the first play only | | | | | | | | |
| 5 | Sound starts after the first tap; the 🔊 toggle works | | | | | | | | |
| 6 | Vibration on correct/wrong (Android only) | n/a | | n/a | | n/a | | n/a | |
| 7 | Swiping between rooms snaps; tabs and ‹ › arrows work | | | | | | | | |
| 8 | Every target is easy to tap with a thumb; no mis-taps on neighbours² | | | | | | | | |
| 9 | Tapping a target pauses the timer; closing the sheet resumes it | | | | | | | | |
| 10 | Prepare: water rises; low items get wet first, none before about 20 s; "น้ำเข้าบ้านแล้ว" line at about 36 s (27 s before v1.9.1); breaker answer changes; the HUD counts what the water took apart ("0/6 💧2") | | | | | | | | |
| 11 | Wrong answer: −4 s, gentle text, orange "!" badge (not red) | | | | | | | | |
| 12 | Decoy: −2 s once, gecko explains; second tap is free | | | | | | | | |
| 13 | Switching apps mid-round pauses the game | | | | | | | | |
| 14 | Result: card image appears; lessons list includes missed items with tips | | | | | | | | |
| 15 | **Share** opens the native share sheet with the image (iOS Safari, Android Chrome) | | | | | | | | |
| 16 | Share fallback sheet: LINE opens the LINE share picker | | | | | | | | |
| 17 | Facebook sharer opens; the preview shows the score image | | | | | | | | |
| 18 | X intent opens with text and link | | | | | | | | |
| 19 | "คัดลอกลิงก์" puts text and link on the clipboard | | | | | | | | |
| 20 | Save image: downloads (browsers) **or** long-press on the image saves it (in-app) | | | | | | | | |
| 21 | LINE only: "เปิดในเบราว์เซอร์" opens the external browser | n/a | n/a | | | n/a | n/a | n/a | n/a |
| 22 | Challenge link opens the banner "เพื่อน… X/10" and plays the same house (same items in the same places) | | | | | | | | |
| 23 | Link preview in a LINE chat shows title and image for `/`, `/c/p8?h=…`, `/checklist/prepare` | | | | | | | | |
| 24 | Checklist sheet renders both images; save or share works | | | | | | | | |
| 25 | Helpline numbers open the dialler (1784, 199, 1669, 1555, 1130, 1129, 1323) | | | | | | | | |
| 26 | "เช็กระดับน้ำล่วงหน้า" opens the forecast app (once configured) | | | | | | | | |
| 27 | EN toggle switches all texts; the choice persists after reload | | | | | | | | |
| 28 | Offline: after one visit, airplane mode → reload → game still plays | | | n/a¹ | | n/a¹ | | n/a¹ | |
| 29 | Notch and home bar: nothing hidden under them (portrait) | | | | | | | | |
| 30 | Android "force dark" / dark-mode WebView does not invert the art | n/a | | n/a | | n/a | | n/a | |
| 31 | VoiceOver / TalkBack reads item names; sheets can be closed | | | | | | | | |
| 32 | iOS "Reduce Motion" / Android "Remove animations": no bouncing, still playable | | | | | | | | |
| 33 | Open `/en/`: the header and start screen are English ("Baan Rod Mai?"), the version chip shows, and the language button switches to Thai and back | | | | | | | | |
| 34 | Share an English result: the card shows "Baan Rod Mai?"; the link is `/en/c/…`; LINE or Facebook shows the English preview | | | | | | | | |
| 35 | Open `/en/learn`: English headings, 81 lessons, hotlines marked as Thai | | | | | | | | |
| 36 | Play a friend's challenge link, then tap "ส่งกลับไปท้าเพื่อน": the text names both scores, the card is attached, and the link opens the same house | | | | | | | | |
| 37 | Forward only the result **picture** to a chat: the printed link on it opens the same house | | | | | | | | |
| 38 | Safety book: the start-screen count goes up after a round; the sheet scrolls and closes; the count survives closing the app | | | | | | | | |
| 39 | Featured card "📰 เรื่องที่ควรรู้ช่วงนี้": "read all" opens `/learn` at the health topic; "book" opens the book with health first | | | | | | | | |
| 40 | New lessons look right on the phone: the EM-ball puddle (front yard), the ORS glass (kitchen), the towel on the sofa (living room) | | | | | | | | |
| 41 | Open `/pm25` (and `/flood`, `/fire`, `/ready`) from a chat: the preview shows its own title and checklist image, the page reads well, every link is easy to tap, and ▶ opens the game on that mode without starting a round | | | | | | | | |
| 42 | Open `/?mode=dust` from a chat: the start screen shows dust as the big card with the 😷 topic; in English (`/en/?mode=dust`) the same | | | | | | | | |
| 43 | Open `/posts` on the phone you post from: touch and hold saves each carousel image; **คัดลอกข้อความโพสต์** copies the caption; post one set as an album and check the order and the text in the feed | | | | | | | | |
| 44 | Play the power cut (`/?mode=stock`): the room darkens but every item stays easy to see and read; the clock shows "ไฟดับมา … ชม."; if you leave the fridge, it goes bad at 4 hours with a clock badge and the gecko says why, and a tester understands that the fridge goes first | | | | | | | | |
| 45 | In the kitchen (the power cut always has an item there; Prepare and fire sometimes), tap the item on the fridge, just below the left ‹ arrow: the item opens and the room doesn't turn (the slot moved below the arrow in v1.7.0) | | | | | | | | |
| 46 | Home check (`/kit` → its button, or `/?open=kit`, from a chat, and the hub's 🎒 เช็กของจำเป็น): the stepper and the four answers are easy to tap; the list shows amounts for your household (3 people: 27 ลิตร); ticks move the meter; the start screen's 🎒 button then reads "บ้านเราพร้อม …%" at once (v1.9.1); the shared card shows the score and up to 3 missing things, and saves (long-press in-app) | | | | | | | | |
| 47 | Plan card (`/plan` → its button, or `/?open=plan`): Thai typing works in every field (including the keyboard's suggestions), the keyboard doesn't cover the field being typed, the card shows every filled field and the helplines, and it saves or shares; an older relative understands what to fill in | | | | | | | | |
| 48 | Where the answers live: make a list and a plan inside LINE, close LINE, open the same link from LINE again (they should still be there), then open it in the phone's browser (expected: empty, a separate browser; [KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)). Note what you see | | | | | | | | |
| 49 | App shortcuts (v1.8.1): add the game to the home screen, then touch and hold its icon: "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" opens the home check and "แผนครอบครัวของบ้านเรา" the plan form (renamed in v1.9.1). Note which phones show no shortcuts (expected on some browsers; **[unverified]**) | | | n/a³ | n/a³ | n/a³ | n/a³ | n/a³ | n/a³ |
| 50 | Plan card with blanks (v1.8.1): fill in two or three fields, make the card: every field has its box, the empty ones a dotted line; save it, and print it or show it to an older relative: is it clear what to write on the lines? "← แก้แผน" goes back to the form with the text still there | | | | | | | | |
| 51 | The start screen's hub (v1.9.0): on the first screen you see the tagline, the alert card (while one is set), "📋 ต้องทำอะไร เมื่อเกิดภัย", "🎒 เช็กของจำเป็น" and "📝 แผนครอบครัว"; the Thai labels don't break mid-word; scrolling down, "🎮 หรือเล่นเกม 60 วิ" and the game cards are easy to find; an older relative understands where to start | | | | | | | | |
| 52 | The alert card (v1.9.0): with an alert set, the card names the topic and opens its guide, and the picker shows that guide first with "ช่วงนี้"; on a friend's challenge link, no hub or alert, and "รับคำท้า!" is on the first screen | | | | | | | | |
| 53 | Print (v1.9.0): open a guide (and the home check's list) in the phone's browser and tap "🖨️ พิมพ์เก็บไว้": the print preview shows only a plain A4 list (tick boxes, phase headings, ⚠️ notes, sources, helplines, the link and date, the disclaimer), nothing of the app; save as PDF or print. Inside LINE, Facebook and TikTok the button should not appear | | | n/a⁴ | n/a⁴ | n/a⁴ | n/a⁴ | n/a⁴ | n/a⁴ |
| 54 | The guide picker inside LINE (v1.9.0): open `https://baanrodmai.autobahn.bot/?open=guide` and `/checklist/quake` from a LINE chat: every tile and button is easy to tap, a guide scrolls to its picture, the picture saves with a long-press, "📖" opens the hazard page, "← เรื่องอื่น" goes back; a `/checklist/quake` link previews with the earthquake picture and title | | | | | | | | |
| 55 | The phone's back button (v1.9.1): open `/checklist/quake` from a LINE chat, and a guide from the picker; press Back (Android) or swipe back (iOS): the sheet closes and you stay in the app; press Back again only then to leave. On a long guide the ✕ stays at the top while you scroll | | | | | | | | |
| 56 | Sharing keeps the result (v1.9.1): finish a round, share to LINE (and to Facebook) from the share sheet, then come back: the game's tab still shows the result, the lessons and "ส่งกลับไปท้าเพื่อน" | | | | | | | | |
| 57 | Thai line breaks (v1.9.1): read the start screen, a guide (e.g. `/checklist/quake`), the home check's intro and list, and a hazard page at your phone's width: no Thai word is split across two lines ("กระ\|จก", "ไฟ\|ดับ", "หน่วย\|งาน"); note any that is, with the screen. **Most important on an iPhone,** whose line breaking wasn't tested | | | | | | | | |
| 58 | Fire smoke on a small phone (v1.9.1): play `/?mode=fire` on a 360 × 640-class phone (and a 320-wide one if you have it): the grey smoke comes down from the ceiling during the round, and when the gecko says "ควันลงมาต่ำแล้ว!" the smoke is low on screen | | | | | | | | |
| 59 | The 404 page (v1.9.1, live site): open `https://baanrodmai.autobahn.bot/no-such-page` and `/c/p99`: a small "ไม่พบหน้านี้ / Page not found" page with links home and to "ต้องทำอะไร", not the start screen | | | | | | | | |
| 60 | A guide's ☎️ buttons (v1.9.1): in a guide, tap ☎️ 1784, 199 and 1669 under the title: each opens the phone's dialler with the number (don't call); on a hazard page (`/flood`) the ☎️ row does the same | | | | | | | | |
| 61 | Back inside a round (v1.9.2): start a round from a LINE chat (`/?mode=prepare`) and press Back (Android) or swipe back (iOS): the round pauses (the pause sheet) and you stay in the game; press Back again: the round goes on; finish it and press Back on the result: the start screen; only Back on the start screen goes back to the chat. Also try it in the phone's own browser | | | | | | | | |
| 62 | The result card at chat size (v1.9.2): share a result card to a LINE chat and look at it in the chat without opening it: the gecko's line (in the bubble under it) and the printed link can be read; open it: nothing is cut off, and the link on it opens the same house | | | | | | | | |
| 63 | The answers on a small phone (v1.9.2): on the smallest phone you have, tap a few things, in Thai and in English: the answers are marked ก ข ค (A B C), and in Thai all three show without scrolling; note any sheet that needs a scroll, with the item and the phone ([KNOWN_ISSUES #73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones)) | | | | | | | | |

¹ iOS in-app browsers (LINE, Facebook, TikTok) don't allow service workers, so offline play there isn't possible. The game works normally online.

² Tap areas no longer overlap in the generator ([KNOWN_ISSUES F10](KNOWN_ISSUES.md#fixed)). If a tap still opens the wrong item, note the room, the two items and the phone.

³ Install from the phone's own browser (Safari or Chrome), not from inside an app: the in-app browsers are not expected to offer "add to home screen" **[unverified]**. If one does, note it. Since v1.9.0 there is a third shortcut, "ต้องทำอะไร เมื่อเกิดภัย", which opens the guide picker.

⁴ The in-app browsers can't print, so the button is hidden there ([KNOWN_ISSUES #63](KNOWN_ISSUES.md#63-printing-isnt-offered-in-in-app-browsers)). If it shows, note it as ❌.

## Content and preview checks after each content change

- [ ] `node tools/build.mjs` passes, with no new warnings you didn't expect.
- [ ] Changed copy reads naturally in Thai, ideally checked by a second native speaker.
- [ ] Re-render images if ranks, OG texts, checklists or the domain changed (`npm run images`).
- [ ] Facebook Sharing Debugger → *Scrape Again* for the main URLs. For LINE, share a `&v=2` variant to see the new preview.
- [ ] After deploy, open the site once and reload. The new service worker activates (check a changed text).

## Performance budget (checked by the build)

The build's `budget` line prints the current numbers. In v1.9.2:

- Start screen: **243 KB** compressed (HTML + CSS + JS + content JSON + fonts; 240 KB in v1.9.1, 232 KB in v1.9.0, 209 KB in v1.8.0–1.8.1). It counts every file in `js/`, including the home check's `kit.js` and `kitplan.js` (about 6.6 KB), which load only when the check opens ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)), and `sources.json`, whose notes (about 14 KB) the game never shows ([KNOWN_ISSUES #62](KNOWN_ISSUES.md#62-source-notes-are-downloaded-by-every-visitor)).
- First game screen: **258 KB** (adds the first room and the sprites; 254 KB in v1.9.1, 247 KB in v1.9.0, 223 KB in v1.8.0–1.8.1).
- Limit: 500 KB.

Rooms are fetched while the player is still on the start screen. The service worker precaches 44 files for offline play after the page has loaded (the build's `sw.js` line).

## Live-site checks (search and AI search)

Run these against https://baanrodmai.autobahn.bot after any change to the build, `strings.json → seo` or `_headers`. They were last run on 6 Oct 2026 and passed, except where noted.

| Check | How | Expected |
|---|---|---|
| Pages and files exist | `curl -s -o /dev/null -w '%{http_code} %{content_type}' <url>` for `/`, `/learn`, `/en/`, `/en/learn`, `/flood`, `/pm25`, `/fire`, `/ready`, `/en/pm25`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/c/p7`, `/en/c/p7`, `/checklist/prepare`, and since v1.8.0 `/js/kit.js`, `/js/kitplan.js`, `/content/kit.json`, and since v1.9.0 `/landslide`, `/storm`, `/quake`, `/heat`, `/kit`, `/plan`, `/en/quake`, `/checklist/quake`, `/en/checklist/heat`, `/og/kit.png`, `/share/checklist-quake.png` | 200, right content type; `/pm25.html` answers 308 to `/pm25` |
| Unknown addresses (v1.9.1) | `curl -s -o /dev/null -w '%{http_code}' …/no-such-page`, and the same for `/c/p99` and `/og/nope.png`; view the body | 404, the "ไม่พบหน้านี้ / Page not found" page with `noindex` |
| Checklist pages' canonical (v1.9.1) | View source of `/checklist/quake` and `/en/checklist/prepare` | `rel="canonical"` to `/quake` and `/en/flood`; no `hreflang` |
| First visit downloads (v1.9.1) | DevTools → Network, a fresh profile, load `/` and wait for the service worker to install | The precache requests come back as 304 (revalidated), not a second full download of the app **[not measured yet]** |
| Event endpoint | `curl -X POST -H 'Content-Type: application/json' --data '{"e":[]}' …/api/e` | 204 |
| Canonical, hreflang and JSON-LD | View source of `/`, `/learn`, `/en/`, `/en/learn` and one hazard page (`/pm25`) | `rel="canonical"` with the live address; th, en and x-default `hreflang` links; one `application/ld+json` block that parses; since v1.9.2 one publisher (`Organization`, `…/#org`, with no description), `author` and `publisher` on the `Article`, and on `/en/` the game node (`…/#game`) with the `/en/` address |
| Security headers (v1.9.2) | `curl -sI https://baanrodmai.autobahn.bot/` and the same for `/en/` and `/quake` | `content-security-policy: frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` (no `script-src`), `x-frame-options: SAMEORIGIN`, plus `x-content-type-options`, `referrer-policy`, `permissions-policy` and Cloudflare's `strict-transport-security`; the page still loads, with the Web Analytics beacon, and no console error about a blocked script |
| `/learn` is complete | Count `<article` in `/learn` and `/en/learn` | 81 each, and 26 ⚠️ flags since v1.9.0: 21 on lessons (the summary at the top of [01-safety-content.md](01-safety-content.md) has the current counts) and 5 on the new guides' lines |
| Hazard pages are complete | Count `<article` in `/flood`, `/pm25`, `/fire`, `/ready` and their `/en/` twins; on `/landslide`, `/storm`, `/quake`, `/heat` (v1.9.0) count the guide's lines and their source lines | 43, 12, 13 and 13; 10 lines each, every one with "ที่มา" ("Sources") under it |
| Sitemap | Count `<loc>` in `/sitemap.xml` | 24 (since v1.9.0; 12 before) |
| Tool links (v1.8.1) | Search `/flood`, `/ready`, the four guide pages (v1.9.0), `/learn` (and `/en/…`) and `/llms.txt` for `?open=kit` and `?open=plan`; read `/manifest.webmanifest` | Both links on each; the manifest's `name` is "บ้านรอดไหม? เตรียมบ้านให้พร้อมทุกภัย" and it has three `shortcuts` (v1.9.0) |
| Only the custom domain is indexable | `curl -sI` the `*.pages.dev` address and the custom domain | `x-robots-tag: noindex` on `*.pages.dev` only |
| Phone-sized load | Headless Chromium, 390×760, touch | No console errors; the footer link to `/learn` is ≥ 44 px |
| Rich Results Test, Search Console, Bing | Owner, in the web tools | Not done yet ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) |

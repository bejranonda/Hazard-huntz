# Test checklist

## Automated (run before every release)

```bash
node tools/build.mjs     # validates all content JSON; fails on any error
npm test                 # rule tests (27 in v1.8.1): a year of daily houses in every mode, flooding, the power cut's fridge at 4 hours, scoring, bonus, challenge links, midnight reset, safety book, share texts, switch end dates, what the start screen recommends, the home check's amounts, card lines that never start with closing punctuation
npm run smoke            # browser checks (96 in v1.8.1) in headless Chromium (needs CHROME_PATH or `npx playwright@1.63.0 install chromium`)
SMOKE_DATE=2026-12-05 npm run smoke   # the same, on another Bangkok day (here: dust season)
npm run probe            # tap-area overlaps + flood timings, when slots, sizes or the water curve change
npm run check:docs       # every relative link and anchor in the Markdown resolves
```

Each run ends with its own count (`27 passed, 0 failed` and `96 passed, 0 failed` in v1.8.1); the number the run prints is the reference, not the one written here.

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
| 10 | Prepare: water rises; low items get wet first; "น้ำเข้าบ้านแล้ว" line at about 27 s; breaker answer changes | | | | | | | | |
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
| 46 | Home check (`/?open=kit` from a chat, and the 🎒 quick button): the stepper and the four answers are easy to tap; the list shows amounts for your household (3 people: 27 ลิตร); ticks move the meter; the start-screen button then reads "บ้านพร้อม …%"; the shared card shows the score and up to 3 missing things, and saves (long-press in-app) | | | | | | | | |
| 47 | Plan card (`/?open=plan`): Thai typing works in every field (including the keyboard's suggestions), the keyboard doesn't cover the field being typed, the card shows every filled field and the helplines, and it saves or shares; an older relative understands what to fill in | | | | | | | | |
| 48 | Where the answers live: make a list and a plan inside LINE, close LINE, open the same link from LINE again (they should still be there), then open it in the phone's browser (expected: empty, a separate browser; [KNOWN_ISSUES #58](KNOWN_ISSUES.md#58-the-home-check-and-the-plan-live-in-one-browser)). Note what you see | | | | | | | | |
| 49 | App shortcuts (v1.8.1): add the game to the home screen, then touch and hold its icon: "บ้านเราพร้อมแค่ไหน?" opens the home check and "แผนบ้านรอดของบ้านเรา" the plan form. Note which phones show no shortcuts (expected on some browsers; **[unverified]**) | | | n/a³ | n/a³ | n/a³ | n/a³ | n/a³ | n/a³ |
| 50 | Plan card with blanks (v1.8.1): fill in two or three fields, make the card: every field has its box, the empty ones a dotted line; save it, and print it or show it to an older relative: is it clear what to write on the lines? "← แก้แผน" goes back to the form with the text still there | | | | | | | | |

¹ iOS in-app browsers (LINE, Facebook, TikTok) don't allow service workers, so offline play there isn't possible. The game works normally online.

² Tap areas no longer overlap in the generator ([KNOWN_ISSUES F10](KNOWN_ISSUES.md#fixed)). If a tap still opens the wrong item, note the room, the two items and the phone.

³ Install from the phone's own browser (Safari or Chrome), not from inside an app: the in-app browsers are not expected to offer "add to home screen" **[unverified]**. If one does, note it.

## Content and preview checks after each content change

- [ ] `node tools/build.mjs` passes, with no new warnings you didn't expect.
- [ ] Changed copy reads naturally in Thai, ideally checked by a second native speaker.
- [ ] Re-render images if ranks, OG texts, checklists or the domain changed (`npm run images`).
- [ ] Facebook Sharing Debugger → *Scrape Again* for the main URLs. For LINE, share a `&v=2` variant to see the new preview.
- [ ] After deploy, open the site once and reload. The new service worker activates (check a changed text).

## Performance budget (checked by the build)

The build's `budget` line prints the current numbers. In v1.8.1 (the same as in v1.8.0):

- Start screen: **209 KB** compressed (HTML + CSS + JS + content JSON + fonts). It counts every file in `js/`, including the home check's `kit.js` and `kitplan.js` (about 6 KB), which load only when the check opens ([KNOWN_ISSUES #59](KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)).
- First game screen: **223 KB** (adds the first room and the sprites).
- Limit: 500 KB.

Rooms are fetched while the player is still on the start screen. The service worker precaches 44 files for offline play after the page has loaded (the build's `sw.js` line).

## Live-site checks (search and AI search)

Run these against https://baanrodmai.autobahn.bot after any change to the build, `strings.json → seo` or `_headers`. They were last run on 6 Oct 2026 and passed, except where noted.

| Check | How | Expected |
|---|---|---|
| Pages and files exist | `curl -s -o /dev/null -w '%{http_code} %{content_type}' <url>` for `/`, `/learn`, `/en/`, `/en/learn`, `/flood`, `/pm25`, `/fire`, `/ready`, `/en/pm25`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/c/p7`, `/en/c/p7`, `/checklist/prepare`, and since v1.8.0 `/js/kit.js`, `/js/kitplan.js`, `/content/kit.json` | 200, right content type; `/pm25.html` answers 308 to `/pm25` |
| Event endpoint | `curl -X POST -H 'Content-Type: application/json' --data '{"e":[]}' …/api/e` | 204 |
| Canonical, hreflang and JSON-LD | View source of `/`, `/learn`, `/en/`, `/en/learn` and one hazard page (`/pm25`) | `rel="canonical"` with the live address; th, en and x-default `hreflang` links; one `application/ld+json` block that parses |
| `/learn` is complete | Count `<article` in `/learn` and `/en/learn` | 81 each, and 21 ⚠️ flags (the summary at the top of [01-safety-content.md](01-safety-content.md) has the current counts) |
| Hazard pages are complete | Count `<article` in `/flood`, `/pm25`, `/fire`, `/ready` and their `/en/` twins | 43, 12, 13 and 13 |
| Sitemap | Count `<loc>` in `/sitemap.xml` | 12 |
| Tool links (v1.8.1) | Search `/flood`, `/ready`, `/learn` (and `/en/…`) and `/llms.txt` for `?open=kit` and `?open=plan`; read `/manifest.webmanifest` | Both links on each; the manifest's `description` names "รับมือไฟดับ" and it has two `shortcuts` |
| Only the custom domain is indexable | `curl -sI` the `*.pages.dev` address and the custom domain | `x-robots-tag: noindex` on `*.pages.dev` only |
| Phone-sized load | Headless Chromium, 390×760, touch | No console errors; the footer link to `/learn` is ≥ 44 px |
| Rich Results Test, Search Console, Bing | Owner, in the web tools | Not done yet ([ROADMAP L8](ROADMAP.md#l8-search-consoles-and-ai-search-check)) |

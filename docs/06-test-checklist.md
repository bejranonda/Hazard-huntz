# Test checklist

## Automated (run before every release)

```bash
node tools/build.mjs     # validates all content JSON; fails on any error
npm test                 # 12 rule tests: a year of daily houses, flooding, scoring, bonus, challenge links, midnight reset
npm run smoke            # 24 browser checks in headless Chromium (needs CHROME_PATH or `npx playwright install chromium`)
```

The smoke test covers:

- Android Chrome: a full Prepare round with a decoy, a wrong answer and the result card.
- An iPhone-SE-sized screen (375×548):
  - item tap areas ≥ 44 px (measured 47.5 px)
  - every button, link and expander ≥ 44 px on the game and result screens
  - the same check on the checklist, help and about sheets
- LINE in-app user agent: long-press hint, no download button, open-in-browser link.
- Facebook in-app user agent: the challenge link `/c/r9?h=20261007&fbclid=…` rebuilds the same house, and its preview page has its own image.
- Checklist deep link (1080×1920 image) and the English toggle.
- **Offline play after the first visit.**
- Reduced motion, and analytics beacons.

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
| 25 | Helpline numbers open the dialler (1784, 1669, 1555, 1130, 1129, 1323) | | | | | | | | |
| 26 | "เช็กระดับน้ำล่วงหน้า" opens the forecast app (once configured) | | | | | | | | |
| 27 | EN toggle switches all texts; the choice persists after reload | | | | | | | | |
| 28 | Offline: after one visit, airplane mode → reload → game still plays | | | n/a¹ | | n/a¹ | | n/a¹ | |
| 29 | Notch and home bar: nothing hidden under them (portrait) | | | | | | | | |
| 30 | Android "force dark" / dark-mode WebView does not invert the art | n/a | | n/a | | n/a | | n/a | |
| 31 | VoiceOver / TalkBack reads item names; sheets can be closed | | | | | | | | |
| 32 | iOS "Reduce Motion" / Android "Remove animations": no bouncing, still playable | | | | | | | | |

¹ iOS in-app browsers (LINE, Facebook, TikTok) don't allow service workers, so offline play there isn't possible. The game works normally online.

² About a third of houses have two neighbouring items whose tap areas overlap ([KNOWN_ISSUES #1](KNOWN_ISSUES.md#1-neighbouring-tap-areas-can-overlap)). If a tap opens the wrong item, note the room, the two items and the phone.

## Content and preview checks after each content change

- [ ] `node tools/build.mjs` passes, with no new warnings you didn't expect.
- [ ] Changed copy reads naturally in Thai, ideally checked by a second native speaker.
- [ ] Re-render images if ranks, OG texts, checklists or the domain changed (`npm run images`).
- [ ] Facebook Sharing Debugger → *Scrape Again* for the main URLs. For LINE, share a `&v=2` variant to see the new preview.
- [ ] After deploy, open the site once and reload. The new service worker activates (check a changed text).

## Performance budget (checked by the build)

- Start screen: **142 KB** compressed (HTML + CSS + JS + content JSON + fonts).
- First game screen: **152 KB** (adds the first room and the sprites).
- Limit: 500 KB.

Rooms are fetched while the player is still on the start screen. The service worker precaches about 37 files for offline play after the page has loaded.

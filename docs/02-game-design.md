# Game design: บ้านรอดไหม?

> **A 60-second house, two moments of truth.** Before the flood you race the rising water to save what matters. After the flood you spot what can still hurt you. Every tap teaches one real action from a Thai agency, and every result is built to be forwarded to the family LINE group.

## Design pillars

1. **Useful first.** Every target is a real action with an official source behind it (see [01-safety-content.md](01-safety-content.md)). Every player leaves with the full lesson, including the items they missed.
2. **Fun in 60 seconds.** A tense but forgiving loop: scan → tap → choose → instant feedback. The timer pauses while you read, so learning is never punished.
3. **Respectful.** Humour is aimed at the situation (mud, a rope that looks like a snake, the gecko's faces), never at people. No drowning, injuries, real photos, politics or blame. Wrong answers get *"ไม่เป็นไร รู้แล้วรอดของจริง"*, never a buzzer.
4. **Built to spread.** A daily house that is the same for everyone (a Wordle-style shared puzzle), a spoiler-free emoji grid, a flattering rank title, challenge links that rebuild the exact same house, and checklist images styled like the greeting pictures Thai families already forward.

## Player flow

```
 LINE / FB / TikTok post ─┐            ┌───────────── challenge link /c/p8?h=20261007 ──┐
                          ▼            ▼                                                 │
                   ┌──────────────────────────┐  first time   ┌──────────┐               │
                   │ START  (mode select)      │──────────────▶│ HOW-TO   │               │
                   │ ก่อนน้ำมา / หลังน้ำลด        │               └────┬─────┘               │
                   │ checklists · helplines     │                    ▼                     │
                   └─────────────┬─────────────┘            ┌────────────────┐            │
                                 └─────────────────────────▶│ ROOM (60 s)    │◀─┐         │
                                                            │ tap a target   │  │ resume │
                                                            └───────┬────────┘  │         │
                                                                    ▼           │         │
                                                            ┌────────────────┐  │         │
                                                            │ CHOICE sheet   │  │         │
                                                            │ (timer paused) │  │         │
                                                            └───────┬────────┘  │         │
                                                                    ▼           │         │
                                                            ┌────────────────┐  │         │
                                                            │ TIP card ทำไม?  │──┘         │
                                                            └───────┬────────┘            │
                                              all targets done or time up                 │
                                                                    ▼                     │
                   ┌───────────────────────────────────────────────────────────┐          │
                   │ RESULT: card 8/10 + rank · share · challenge · lessons ·  │──────────┘
                   │ help numbers · เช็กระดับน้ำ · other mode · random house    │
                   └───────────────────────────────────────────────────────────┘
```

## The house

- **Six rooms:** หน้าบ้าน, ห้องนั่งเล่น, ครัว, ห้องน้ำ, ห้องนอน, โรงรถ.
  - The **MVP ships หน้าบ้าน + ห้องนั่งเล่น + ครัว** in both modes; those three hold every priority item.
  - The other rooms are listed in `rooms.json` with `enabled: false`. Their safety content already exists in `items.json`; adding art and flipping the flag unlocks them.
- **One illustration per room, reused by both modes.** The Return look is a `mud` layer inside the same SVG: a high-water stain, a muddy floor, puddles and debris. The window shows rain clouds before the flood and sunshine after.
- **Layout:** rooms sit side by side in a swipeable strip (CSS scroll-snap), with tabs showing how many targets are left in each room and ‹ › arrows for people who don't think to swipe.
- **Seeded placement:** each room defines *slots* (bottom-centre anchors with tags such as `floor`, `table`, `breaker`). Each item lists the slot tags it fits.
  - A seed (mode + house key) picks **5–7 targets** and **3–4 decoys**.
  - It guarantees at least one target per room and, in Prepare, at least one *critical* item.
  - It then places everything in random compatible slots and shuffles the answer order. Same seed, same house.

## Mode 1: ก่อนน้ำมา (Prepare)

| Element | Rule |
|---|---|
| Timer | 60 s, shown as a water gauge. The water in the scene rises with it. |
| Flooding | A target floods when the drawn waterline reaches the middle of its sprite, so things lower on screen go first. The rule is exactly what the player sees. |
| Water curve | Slow start (first item wet at about 15 s), floor fully covered at **27 s**, counter height at about 60 s. Keyframes are in `config.json`. |
| Floor wet | When water covers the floor, the gecko says *"น้ำเข้าบ้านแล้ว! ตัวเปียกห้ามแตะสวิตช์ไฟนะ"*. The main breaker's correct answer then **switches** from "ปลดตอนตัวแห้ง" to "อย่าแตะ ออกไปที่แห้ง โทร 1130/1129". |
| Actions | Your four: **ยกขึ้นที่สูง (up) / แพ็ก (pack) / ปิด–ตัด (off) / ปล่อยไว้ (leave)**, plus วางกั้น, ย้าย and เก็บกวาด where they read more naturally. Each choice carries an icon for its action type, never for its correctness. |
| Decoys | Already safe: plant outside, books and clock up high, dishes on the top shelf, rice tub on the fridge, and boxes already moved upstairs. The last one is a "that's exactly right!" moment. |
| Priority bonus | +50 for each **critical** item (documents, medicines, main breaker) handled before water gets into the house. The how-to tells players this. |

## Mode 2: หลังน้ำลด (Return)

| Element | Rule |
|---|---|
| Timer | 50 s, a sunshine bar ("check the house before dark"). |
| Hazards | Hidden in the muddy house: a snake peeking out of a shoe, a centipede in the debris, a tail in the dark cupboard, glints of glass in the mud. Others are in plain sight: a sagging ceiling, a wet socket, a generator in the living room. |
| Example choice | Your breaker example: **ตัดเบรกเกอร์เอง / เรียกช่างไฟ / เสียบปลั๊กลองดู**, with เรียกช่างไฟ correct. |
| Decoys | Messy but fine, and they teach the good habit: clean boots, an open window ("ถูกต้องแล้ว"), a tied rubbish bag, new bottled water. The comic one is a coiled rope: *"เชือกจ้า ไม่ใช่งู 😅 แต่ระวังไว้ก่อนก็ดีแล้ว"*. |

## Shared rules

- **Tap a target:** the timer pauses and a bottom sheet shows 3 choices.
- **Correct:** +100, a squish and sparkle sound, the gecko cheers. The item changes state: the breaker flips to OFF, sandbags line up, the TV lifts, the car drives away. A **tip card** shows the ≤ 80-character tip, a **ทำไม?** expander and the agency link.
- **Wrong:** −4 s, a soft "boop" and the gecko's worried face. A gentle correction shows the safer choice, why the chosen one is risky, and the same tip card. The item is marked 💡 *learned*, not failed.
- **Decoy:** −2 s on the first tap only. The gecko explains why it is fine.
- **End:** when every target is resolved or time is up. Missed targets get a dashed outline and "?" badge, and **every** target appears in the lesson list with its tip and source.
- **Score:** `score10 = round(10 × points ÷ max)`. Max is 100 per target plus 50 per critical item. Results are always shown as X/10, so cards compare across houses.
- **Ranks (by score10):** 0–4, 5–7, 8–10.
  - ก่อนน้ำมา: มือใหม่หัดเตรียมตัว → หัวหน้าทีมยกของ → บ้านนี้เตรียมพร้อม
  - หลังน้ำลด: มือใหม่หัดกู้บ้าน → ช่างไฟประจำซอย → เซียนกู้บ้าน
- **Replay:**
  - **Daily house** per mode, the same for everyone, resetting at midnight Bangkok time.
  - A **streak** counter.
  - **Random house** (🎲) for practice.
  - **Challenge links** that rebuild any house exactly.
  - All progress stays in `localStorage`.

## Mode selection

- Two large buttons. The recommended one is first, with a "แนะนำช่วงนี้" badge, and the gecko's line changes to match.
- `config.json → rainWarningActive: true` makes Prepare the default; set it to `false` as water recedes.
- Later, `forecastStatusUrl` can point at your forecast app, returning `{ "rainWarning": true|false }` within 1.5 s. If the call fails, the manual flag is used.

## Feel

- **Art:** flat, warm illustration with chunky outlines. Mud browns with bright accents (sun yellow, sky blue, coral, teal). Hopeful skies: rain clouds before, sunshine after. Everything is hand-made SVG (about 40 KB), crisp on any screen.
- **Mascot:** **น้องจก**, an original gecko in yellow rubber boots. A rain hood before the flood, a torch after. Five faces: happy, cheer, oops, wow, think.
  - It reacts to every choice: it hops on correct answers and wobbles on mistakes.
  - It speaks short lines: *"บ้านรอดแล้วหนึ่ง!"*, *"พลาดในเกมดีกว่าพลาดจริง"*.
  - Its name plays on the Thai folk idea that a gecko's chirp (จิ้งจกทัก) is a friendly warning.
- **Sound:**
  - **squish + sparkle** on success, a soft boop on mistakes, a blub when water reaches something, a short fanfare at the end.
  - All synthesised with Web Audio (0 KB of audio files), and only started after the first tap.
  - Vibration on Android only (iOS has none).
- **Motion:** gentle hops and sparkles, no flashing. `prefers-reduced-motion` turns animations into instant state changes.
- **Copy voice:** casual, warm, native Thai, like a helpful neighbour. Short sentences, particles used naturally (นะ, จ้า, เลย). No jargon, no blame. English mirrors the tone (toggle at top right).

## Accessibility

- **Tap areas:** at least 64 scene units. That measures **47.5 px** on a 375×548 screen (iPhone SE in Safari) and 48.7 px at 360×560.
- **Controls:** every button, link and expander is at least 44 px. The smoke test checks this on the game, result, checklist, help and about screens.
- **Exception:** phones only 320 px wide get 38–43 px item tap areas (see [KNOWN_ISSUES.md](KNOWN_ISSUES.md)).
- Results use **colour and shape**: blue ✓ correct, orange ! learned, grey ~/? missed. There is no red/green pairing anywhere.
- Every target is a focusable SVG `role="button"` with a Thai or English label, operable with Enter or Space. Sheets trap focus and support Esc. Text is 15–19 px with Thai-friendly line height.
- No flashing effects. Rain streaks drift slowly and stop under reduced motion.

## Wireframes

Low-fidelity layouts below. Real screenshots from the built game, captured by `npm run smoke -- --screens docs/screens`, are in [`docs/screens/`](screens/).

```
 START / MODE SELECT            ROOM (Prepare)                  ACTION CHOICE (sheet)
┌──────────────────────┐       ┌──────────────────────┐        ┌──────────────────────┐
│               [EN][🔊]│       │[❚❚] [≈≈≈≈ 47 วิ ≈ ] 2/6│        │   (room, dimmed)     │
│     บ้านรอดไหม?        │       │[หน้าบ้าน①][นั่งเล่น②][ครัว✓]│        │                      │
│ เกม 60 วิ ช่วยให้บ้านรอด │       │           ┌bubble┐ 🦎 │        ├──────────────────────┤
│ ┌bubble────────┐  🦎   │       │   house / room art    │        │ [sprite] เอกสารสำคัญ   │
│ │ฝนจะมาอีกระลอก│ (big) │       │  items + decoys       │        │ บัตร ปชช. ทะเบียนบ้าน… │
│ └──────────────┘       │       │ ‹                    › │        │ จะทำยังไงดี?           │
│┌[แนะนำช่วงนี้]─────────┐│       │                      │        │┌[⬆] วางบนตู้สูงๆ     ─┐│
││🏠 ก่อนน้ำมา           ││       │~~~~ rising water ~~~~│        │└──────────────────────┘│
│└──────────────────────┘│       │  (items under the    │        │┌[🎒] ใส่ถุงกันน้ำ… ───┐│
│┌──────────────────────┐│       │   waterline = wet)   │        │└──────────────────────┘│
││🧹 หลังน้ำลด           ││       └──────────────────────┘        │┌[⏱] ปล่อยไว้ ทำใหม่ได้ ┐│
│└──────────────────────┘│                                        │└──────────────────────┘│
│ บ้านประจำวันที่ 7 ต.ค. 69 🔥3 │                                        └──────────────────────┘
│ [📋 เช็กลิสต์][☎️ เบอร์][🌧️]│
│ ห้องน้ำ·ห้องนอน·โรงรถ เร็วๆนี้ │
│ เนื้อหาเพื่อการเรียนรู้…      │
└──────────────────────┘

 TIP CARD (correct / learned)   RESULT                          SHARE (fallback sheet)
┌──────────────────────┐       ┌──────────────────────┐        ┌──────────────────────┐
│ (●✓) ถูกต้อง!          │       │┌ result card PNG ───┐│        │ แชร์ผลลัพธ์            │
│      +100 · ⭐+50     │       ││ บ้านรอดไหม? ก่อนน้ำมา ││        │┌ card preview ──────┐│
│ ┌ จำไว้ใช้จริง ───────┐│       ││      🦎 (cheer)     ││        ││  (press & hold to  ││
│ │ tip ≤ 80 chars     ││       ││  เตรียมบ้านทัน 8/10   ││        ││   save in LINE/FB) ││
│ └────────────────────┘│       ││ [บ้านนี้เตรียมพร้อม]   ││        │└────────────────────┘│
│ (ทำไม? ▾) why + ที่มา  │       ││  ✓ ! ✓ ✓ ✓ ✓        ││        │[⇪แชร์][LINE][Facebook]│
│ [      ไปต่อ       ]  │       │└────────────────────┘│        │[X][คัดลอกลิงก์][บันทึกรูป]│
│                      │       │ ทำถูก 5/6 · ⭐1 · 12วิ  │        │ 💡 กดค้างที่รูปเพื่อบันทึก │
│ learned: (●!) เกือบแล้ว │       │ vs friend 9 · 8 (challenge)│     │ เปิดในเบราว์เซอร์ (LINE) │
│ ทางที่ปลอดภัยกว่า: …    │       │ [📤 แชร์ผลให้คนที่บ้าน]   │        │ [ปิด]                 │
│ why the choice is risky│       │ [🏆 ท้าเพื่อนเล่นบ้านนี้]  │        └──────────────────────┘
│ [    เข้าใจแล้ว    ]  │       │ สรุปบ้านนี้: ✓/!/? + tips │
└──────────────────────┘       │ [โหมดอื่น][🎲 บ้านสุ่ม][หน้าแรก]│
                               │ เบอร์ช่วยเหลือ 1784 1669… │
                               │ [🌧️ เช็กระดับน้ำล่วงหน้า]   │
                               │ [📋 เช็กลิสต์ 10 ข้อ]      │
                               └──────────────────────┘
```

| Screen | Screenshot |
|---|---|
| Start / mode select | [01-start.png](screens/01-start.png) |
| How-to | [02-howto.png](screens/02-howto.png) |
| Room (Prepare) | [03-room.png](screens/03-room.png) |
| Action choice | [04a-choice.png](screens/04a-choice.png) |
| Tip card: correct / learned | [04b-tip-correct.png](screens/04b-tip-correct.png) · [04c-tip-learned.png](screens/04c-tip-learned.png) |
| Result | [05-result.png](screens/05-result.png) |
| Share | [06-share.png](screens/06-share.png) |
| Return mode on a small phone | [07-return-small.png](screens/07-return-small.png) |
| Challenge landing | [08-challenge.png](screens/08-challenge.png) |
| Checklist | [09-checklist.png](screens/09-checklist.png) |
| English | [10-english.png](screens/10-english.png) |

The share assets, rendered by the same canvas code as the game:

- result cards: [`public/share/sample-result-prepare.png`](../public/share/sample-result-prepare.png), [`…-return.png`](../public/share/sample-result-return.png)
- checklists: [`public/share/checklist-prepare.png`](../public/share/checklist-prepare.png), [`…-return.png`](../public/share/checklist-return.png)
- link previews: `public/og/*.png`

## Sharing design

- **Result card** (1080×1350 PNG, drawn on a canvas in the browser):
  - logo, mode chip, house date, the gecko's face matching the rank, the headline and big score
  - rank pill, a ✓/!/? row (shapes as well as colours), "บ้านหลังเดียวกัน ท้าเลย!", the web address, the disclaimer
  - bright and warm, readable at chat-thumbnail size
- **Share text** pastes anywhere: `เตรียมบ้านทัน 8/10 🏠 · ได้ฉายา "…" · ✅✅💡✅💧✅ · … 👉 link · #บ้านรอดไหม`
- **One tap:**
  - Web Share API with the PNG attached (iOS Safari, Android Chrome).
  - Otherwise a sheet with LINE (`line.me/R/share`), Facebook (`sharer.php`), X (`x.com/intent/tweet`), copy link, and save image.
  - In LINE, Facebook and TikTok in-app browsers, downloads usually fail. The card is shown as an `<img>` with *"กดค้างที่รูป แล้วเลือกบันทึกรูปภาพ"*, and LINE also gets an *open in browser* link (`openExternalBrowser=1`).
- **Challenge link:** `/c/p8?h=20261007` encodes the mode, the score to beat and the house seed. The friend sees a banner ("เพื่อนเตรียมบ้านทัน 8/10") and plays the identical house. The result compares scores and invites a challenge back.
- **Link previews:** each `/c/{p|r}{0–10}` URL is its own static HTML page. Each has Open Graph tags and a pre-rendered 1200×630 PNG showing the score, so LINE and Facebook show "เพื่อนเตรียมบ้านทัน 8/10" in the preview. See [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered) for why these are pre-rendered rather than rendered per request.
- **Family-group checklists:** two 1080×1920 images, *เตรียมบ้านก่อนน้ำมา 10 ข้อ* and *ก่อนกลับเข้าบ้าน 10 ข้อ*. They have big text, an icon per item, the helpline numbers and "ส่งต่อด้วยความห่วงใย ♥". They are available in-game and at `/checklist/prepare` and `/checklist/return`, which have their own previews for people who never play.

## Version 2: combined run (structured, not built)

- `js/run.js` models a run as a list of rounds. `PLANS.combo = ['prepare', 'return']`, behind `config.features.comboRun`.
- **Carry-over:** `Run.nextHouseOptions()` reads each Prepare outcome through the `pair` links in `items.json`. For example `p-tv → r-tv`, `p-car → r-carmud`, `p-lpg → r-gas`, `p-breaker → r-breaker`, `p-waterfood → r-foodwet`.
  - **Saved** items are excluded from the Return hazards: they appear clean.
  - **Missed** items are guaranteed to appear damaged.
  - `generateHouse()` already accepts these `include`/`exclude` sets, and a unit test covers it.
- **Result:** `Run.survivalPercent()` gives the headline *"เตรียมดี บ้านรอด 85%"*.
- **Still to build for v2:** the before/after split card in `cards.js` and a third button on the start screen.

## Code map

```
Hazard-huntz/               (repository root = Cloudflare Pages root directory)
├── public/                 ← what Cloudflare Pages serves (build output dir)
│   ├── index.html          start screen markup (works before JS runs)
│   ├── css/app.css
│   ├── js/
│   │   ├── main.js         boot, screens, game loop, result, sharing UI
│   │   ├── house.js        seeded house generation (pure, unit-tested)
│   │   ├── round.js        timer, water, choices, score (pure, unit-tested)
│   │   ├── run.js          v1 single round / v2 combo structure
│   │   ├── scene.js        inline SVG rooms, sprites, tap areas, water, badges
│   │   ├── cards.js        canvas: result card, checklists, link previews
│   │   ├── svgdraw.js      tiny SVG→canvas renderer (no image decoding)
│   │   ├── share.js        Web Share + LINE/FB/X/copy/save, challenge links
│   │   ├── mascot.js       น้องจก (SVG, faces, props)
│   │   ├── audio.js fx.js icons.js ui.js content.js progress.js analytics.js rng.js util.js
│   ├── content/            ← EDITABLE: items, rooms, strings, config, sources, checklists, helplines
│   ├── art/                rooms/*.svg (front, living, kitchen) + sprites.svg
│   ├── fonts/              Kanit Thai + Latin subsets (OFL)
│   ├── og/  share/  icons/ pre-rendered images (npm run images)
│   ├── c/  checklist/      generated link-preview pages (npm run build)
│   ├── learn.html llms.txt sitemap.xml robots.txt   generated SEO / AI-search files (npm run build)
│   ├── sw.js               generated service worker (offline)
│   ├── _headers _routes.json manifest.webmanifest
├── functions/api/e.js      Pages Function: anonymous event counter → Analytics Engine
├── tools/                  build.mjs (validate + generate), render-images.mjs, sw.template.js, probe.mjs, check-docs.mjs
├── tests/                  run.mjs (rules), smoke.mjs (browser)
├── docs/                   this documentation + screens/
├── HANDOFF.md  CHANGELOG.md  README.md  LICENSE  AGENTS.md  CLAUDE.md
└── wrangler.toml  package.json  .node-version
```

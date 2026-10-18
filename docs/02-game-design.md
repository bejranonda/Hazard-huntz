# Game design: บ้านรอดไหม?

> **A 60-second house, two moments of truth.** Before the flood you race the rising water to save what matters. After the flood you spot what can still hurt you. Every tap teaches one real action with its source, almost always a Thai agency, and every result is built to be forwarded to the family LINE group.
>
> Since v1.5.0 the same house also faces PM2.5 dust and house fire, and since v1.7.0 a night without power (ไฟดับทั้งคืน บ้านเราอยู่ได้ไหม?): five modes in all.
>
> Since v1.8.0 two tools outside the round turn the lessons into the family's own: **บ้านเราพร้อมแค่ไหน?** (a home-kit check) and **แผนบ้านรอดของบ้านเรา** (a family plan card).

## Design pillars

1. **Useful first.** Every target is a real action with an official source behind it (see [01-safety-content.md](01-safety-content.md)); the few that rest on a foreign agency only are flagged ⚠️ and say so. Every player leaves with the full lesson, including the items they missed.
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
- **One illustration per room, reused by every mode.** The Return look is a `mud` layer inside the same SVG: a high-water stain, a muddy floor, puddles and debris. The window shows rain clouds before the flood and sunshine after. Dust, fire and the power cut hide the mud and the rain and draw their threat on top (haze, smoke, the dark).
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

## Mode 3: ฝุ่น PM2.5 (Dust, v1.5.0)

| Element | Rule |
|---|---|
| Timer | 55 s. A haze with drifting specks thickens over the rooms (opacity 0.06 → 0.64). Nothing is lost to it; the clock is the pressure. |
| Gauge | Moves through the Air4Thai colours, blue → green → yellow → orange → red (`data-aqi` 0–4), to teach the order. |
| Hazards | An open window on a red day, a broom on a dusty floor, a purifier with an unchecked filter, grandpa's inhaler, grandma's cough, a dusty fan, a phone before going out (Air4Thai), a charcoal grill, a thin cloth mask, running shoes, the kids' ball, a leaf pile with matches. |
| Gecko | Wears a mask. "ฝุ่นจิ๋วมองไม่เห็น แต่เข้าปอดได้นะ" |
| Link | "😷 เช็กค่าฝุ่นวันนี้ (Air4Thai)" instead of the flood forecast. |

## Mode 4: ไฟไหม้ (House fire, v1.5.0)

| Element | Rule |
|---|---|
| Timer | 55 s. Smoke falls from the ceiling; an item is lost when the smoke reaches its centre, so the smoke alarm goes first (about 22 s), then the pan (about 50 s). Since v1.7.0 the 199 note sits lower on the fridge, below the room arrow, and the smoke no longer reaches it. At `lowY` the gecko says "crawl low". |
| Hazards | Chained power strips, a hot cracked lamp cord, a phone charging on the sofa, a chirping smoke alarm, a towel (wet cloth, crawl low), a pan left on the stove, the gas valve, sprays by the stove, an extinguisher buried in a cupboard, the 199 note, smoke under the front door, burning leaves in wind, a cigarette end. |
| Gecko | Wears a red helmet. "ใกล้พื้นอากาศดีกว่า จำไว้นะ" |
| Guardrail | Smoke, cords and pans only. No flames on people, no injuries. |

## Mode 5: ไฟดับ (Power cut, v1.7.0)

**The story:** "ไฟดับทั้งคืน บ้านเราอยู่ได้ไหม?" (A night without power: will the house cope?). The power has gone out for the night; the family has to keep the food safe, light the house safely and get by on what is stocked. Year-round: never the season's default, played from its card, `/?mode=stock`, `/ready` or a post.

| Element | Rule |
|---|---|
| Timer | 55 s, covering **12 story hours** without power. The HUD shows both: "ไฟดับมา 4 ชม. · 37 วิ". The room darkens over the round (a deep-blue dim, heavier at the edges; items stay readable). |
| Losing an item | Only the fridge can go bad: if the player hasn't tapped it by **4 story hours** (about 18 s with no penalties), its food is lost. The number is the US CDC's "a closed fridge keeps food safe about 4 hours". It gets a grey clock badge and "เสียก่อน" / "Went bad first", and 🌑 in the share grid. Every power-cut house includes the fridge. The full freezer lasts about 48 hours, so it never goes bad in the round; that is how the game teaches "the fridge goes first" without an unsourced eating order. |
| Hazards | Kitchen: the fridge everyone keeps opening, minced pork left after the night, a full freezer, cans with no opener, too little stored water, the food store. Living room: grandma's medicine that must stay cold, a candle left burning, a flashlight with flat batteries, a battery radio, a power bank on one bar, the TV and computer still plugged in. Front: a generator under the window. |
| Decoys | A closed rice bin, a battery wall clock, books, a potted plant, dishes in the sink. |
| Gecko | Carries a torch. "ไฟดับแล้ว! ดูตู้เย็นก่อนเลย" / "มืดแล้ว ไฟฉายอยู่ไหนนะ" |
| Sources | 3 lessons ✅ (Thai agencies, cross-checked with Ready.gov); 10 ⚠️, most on international guidance only (US CDC, Ready.gov, US Fire Administration). The lesson says so ([KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)). |
| Guardrail | No fear about the dark: the room stays readable, the gecko stays cheerful, and nothing about injuries. Food and medicine advice is general and names its source. |


## Outside the round: the home check and the plan card (v1.8.0)

**The idea:** after a round about someone else's house, check your own. Both open in a sheet over the start screen, keep everything on the device, and end in a card to forward. Details and sources: [KNOWLEDGE §28](KNOWLEDGE.md#28-the-home-check-and-the-family-plan-card-v180).

| Element | บ้านเราพร้อมแค่ไหน? (`/?open=kit`) | แผนบ้านรอดของบ้านเรา (`/?open=plan`) |
|---|---|---|
| Asks | How many people (1–10, a − / + stepper) and who lives there (small children, older or bedridden people, daily medicine, pets) | Six short fields: the shelter near home, the family meeting place, who to contact if separated, who helps whom (×2), medicine and must-haves |
| Shows | The household's list: 9 things for every home plus up to 6 by answer, with amounts for this household ("27 ลิตร (3 ลิตร × 3 คน × 3 วัน)", a flashlight each), the agencies per line, and "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on lines under review. Ticks fill a meter: "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)" | Each field with an example and, for most, a sourced hint ("ยาประจำตัวอย่างน้อย 7 วัน"); the warning not to type ID-card numbers |
| Card (1080 × 1350) | A score ring, the gecko with a torch (its face follows the score), "มีแล้ว 3 จาก 9 อย่าง", up to 3 things still missing, "บ้านคุณพร้อมแค่ไหน? เช็กฟรี" and `/?open=kit` | The filled fields, the date, the free helplines 1784 · 199 · 1669 · 1555 · 1130 · 1129, "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน" and `/?open=plan` |
| Ways in | The start screen's quick button 🎒 "บ้านพร้อมไหม?" (then "บ้านพร้อม 70%"), the power cut's result screen, `/ready`, the link | From the check's list, `/ready`, the link |
| Kept | `brm:kit` on this device | `brm:plan` on this device |
| Guardrail | No fear and no shame: the score counts things the house has, and the card lists what to get next | Nothing typed leaves the phone except in the picture the family shares; short fields, no names asked |

- **The quick buttons** (checklists, the home check, helplines, the water-level link) sit two per row with the icon beside the label, so the Thai labels don't break mid-word.
- **Why a score:** a percentage is something to compare in a family group ("บ้านเราพร้อมรับมือไฟดับ 56% 🎒 แล้วบ้านคุณล่ะ?"), like the game's X/10, and the missing things on the card are the next step. The score counts things, not amounts.

## Playing a round

- **Tap a target:** the timer pauses and a bottom sheet shows 3 choices.
- **Correct:** +100, a squish and sparkle sound, the gecko cheers. The item changes state: the breaker flips to OFF, sandbags line up, the TV lifts, the car drives away. A **tip card** shows the ≤ 80-character tip, a **ทำไม?** expander and the agency link.
- **Wrong:** −4 s, a soft "boop" and the gecko's worried face. A gentle correction shows the safer choice, why the chosen one is risky, and the same tip card. The item is marked 💡 *learned*, not failed.
- **Decoy:** −2 s on the first tap only. The gecko explains why it is fine.
- **End:** when every target is resolved or time is up. Missed targets get a dashed outline and "?" badge, and **every** target appears in the lesson list with its tip and source.
- **Score:** `score10 = round(10 × points ÷ max)`. Max is 100 per target plus 50 per critical item. Results are always shown as X/10, so cards compare across houses.
- **Ranks (by score10):** 0–4, 5–7, 8–10.
  - ก่อนน้ำมา: มือใหม่หัดเตรียมตัว → หัวหน้าทีมยกของ → บ้านนี้เตรียมพร้อม
  - หลังน้ำลด: มือใหม่หัดกู้บ้าน → ช่างไฟประจำซอย → เซียนกู้บ้าน
  - ฝุ่น PM2.5: มือใหม่หัดสู้ฝุ่น → นักอุดรอยรั่ว → บ้านนี้หายใจโล่ง
  - ไฟไหม้: มือใหม่หัดกันไฟ → สารวัตรปลั๊กพ่วง → บ้านนี้ปลอดภัยจากไฟ
  - ไฟดับ: มือใหม่หัดตุนของ → ผู้จัดการคลังบ้าน → บ้านนี้พร้อมทุกไฟดับ
- **Replay:**
  - **Daily house** per mode, the same for everyone, resetting at midnight Bangkok time.
  - A **streak** counter.
  - **Random house** (🎲) for practice.
  - **Challenge links** that rebuild any house exactly.
  - All progress stays in `localStorage`.

## Mode selection

- One button per mode, built from the registry (`config.json → modes`). The recommended one is a big card on top with a "แนะนำช่วงนี้" badge; the others are compact cards (icon over name) in one row, four of them since v1.7.0. Their names shrink with the screen (`clamp(12px, 3.9vw, 16px)`), so every Thai name stays on one line at 320 px; English names wrap to two lines. The gecko's line, prop and the featured topic change to match.
- **What is recommended** comes from one pure function, `recommend()` in `modes.js` (v1.6.0; [KNOWLEDGE §25.2](KNOWLEDGE.md#252-what-the-start-screen-recommends)), in this order:
  1. a `?mode=` link (`/?mode=dust`): that mode, with its own topic featured
  2. a rain warning: Prepare. That is `config.json → rainWarningActive: true` until its end date `rainWarningUntil` (now 30 Nov 2026), or the forecast app's live answer when there is one
  3. the mode in season (`modes[].months`, Bangkok month): dust December–March, fire April. The power cut has no months, so it is never picked here.
  4. otherwise Return
- **`?mode=` links** are for posts and campaigns. Only the five mode ids count (`prepare`, `return`, `dust`, `fire`, `stock`, any letter case); `/?mode=heat` is ignored, a friend's challenge link wins over it, and it never starts a round by itself. Visitors from abroad get `/en/?mode=…`.
- **The forecast app** can answer through `forecastStatusUrl` with `{ "rainWarning": true|false }` within 1.5 s; its answer beats the manual switch both ways. If the call fails, the manual switch is used.
- **The hazard pages** (`/flood`, `/pm25`, `/fire`, v1.6.0, and `/ready`, v1.7.0) are another way in: plain pages with that hazard's lessons and a ▶ button to `/?mode=<id>`.

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
- **Result screen layout** (v1.5.2): the card preview takes at most 58 % of the screen and the main action (share, or challenge back) sticks to the bottom, so it is always on the first screen. The share sheet lists the channels before the card. On a challenge link the gecko steps aside so the challenge and its button come first. The recommended mode card shows a ▶ play mark.
- **The ending** (v1.5.3): the result gecko answers the title, "บ้านรอดไหม?", for the mode and score (`cheer<Level><Mode>`, [KNOWLEDGE §24](KNOWLEDGE.md#24-the-story-the-ending-answers-the-title-v153)). Since v1.6.0 the shared card carries the same line (see *Sharing design*), so an ending never says "below".
- **End of the round by score** (v1.3.0): 10/10 gets a bigger fanfare, a second confetti burst and a stamp; 8–9 the fanfare and confetti; lower scores a soft chime. A small gecko on the result screen says a line that fits (`cheerPerfect`/`cheerHigh`/`cheerMid`/`cheerLow`), always warm.
- **Combo, for feel only:** three or more right in a row show "🔥 3 ข้อติด!" near the top of the room and play a rising run. No points.
- **More sound:** a splash when water reaches the floor, a tick for each of the last five seconds, a blip when sound is switched on.
- **Safety book (สมุดบ้านรอด):** every lesson answered correctly is kept on the device; the start-screen chip and the result screen show the count (79 playable lessons since v1.7.0, grouped in 8 topics). Locked lessons show as grey tiles, so there is something to find in random houses. The book is grouped by **topic** (🦠 health, ⚡ power & gas, 💧 water & food, 🐍 snakes & sharp things, 🏠 home, car & belongings, 🎒 plans & go-bag, and since v1.5.0 😷 dust and smoke and 🔥 fire safety) with a progress bar each and a 🏅 badge for a full set; it links to `/learn`, where every answer is readable without playing.
- **Topic in the news** (v1.4.0): `config.featuredTopic` adds a card under the daily line: "📰 เรื่องที่ควรรู้ช่วงนี้ · 🦠 โรคหลังน้ำท่วม" with "read all" (→ `/learn#t-health`) and "book n/8". Since v1.6.0 it ends by itself after `featuredTopicUntil` (now 15 Nov 2026); without a news topic, the recommended mode's own topic is featured (dust → 😷, fire → 🔥).
- **Motion:** gentle hops and sparkles, no flashing. `prefers-reduced-motion` turns animations into instant state changes.
- **Copy voice:** casual, warm, native Thai, like a helpful neighbour. Short sentences, particles used naturally (นะ, จ้า, เลย). No jargon, no blame. English mirrors the tone (toggle at top right).

## Accessibility

- **Tap areas:** at least 64 scene units. That measures **47.5 px** on a 375×548 screen (iPhone SE in Safari) and 48.7 px at 360×560. On a 320×460 phone the room tabs hide, so items measure **44.1 px** ([KNOWN_ISSUES F21](KNOWN_ISSUES.md#after-v122-13-oct-2026)).
- **Controls:** every button, link and expander is at least 44 px. The smoke test checks this on the game, result, checklist, help and about screens, and on `/learn` and the hazard pages.
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
| Challenge back (share sheet with the versus card) | [11-challenge-back.png](screens/11-challenge-back.png) |
| Safety book (by topic) | [12-book.png](screens/12-book.png) |
| PM2.5 dust (v1.5.0) | [13-dust.png](screens/13-dust.png) |
| House fire (v1.5.0) | [14-fire.png](screens/14-fire.png) |
| Hazard page (v1.6.0) | [15-hazard-page.png](screens/15-hazard-page.png) |
| Power cut: the kitchen at 6 hours without power, the fridge gone bad (v1.7.0) | [16-stock.png](screens/16-stock.png) |
| The home check: the list for 3 people, 33 % ready (v1.8.0) | [17-kit.png](screens/17-kit.png) |
| The family plan card, filled in (v1.8.0) | [18-plan-card.png](screens/18-plan-card.png) |

`npm run smoke -- --screens docs/screens` refreshes 01–12 and 15. The others (13, 14, 16, 17, 18) were captured once, by one-off probes in their releases, and are not refreshed by that run.

The share assets, rendered by the same canvas code as the game:

- result cards: [`public/share/sample-result-prepare.png`](../public/share/sample-result-prepare.png), [`…-return.png`](../public/share/sample-result-return.png)
- checklists: [`public/share/checklist-prepare.png`](../public/share/checklist-prepare.png), [`…-return.png`](../public/share/checklist-return.png)
- link previews: `public/og/*.png`

## Sharing design

- **Result card** (1080×1350 PNG, drawn on a canvas in the browser):
  - logo, mode chip, house date, the gecko's face matching the rank, the headline and big score
  - **the ending** (v1.6.0): the line that answers "บ้านรอดไหม?", the same one the result gecko says, in a white speech bubble left of the gecko (x 30–360, centred at y 462, the tail pointing at the gecko). The text is 38 px and shrinks to 28 px to fit at most 4 lines; emoji are left out on the card, because canvas fonts can draw them as empty boxes. The card's `alt` text ends with the same line.
  - rank pill, a ✓/!/? row (shapes as well as colours), "บ้านหลังเดียวกัน ท้าเลย!" (or, after a challenge, "เพื่อน 3/10 · เรา 8/10 · บ้านหลังเดียวกัน"), **the challenge link for this house** (v1.3.0), the disclaimer
  - a "เต็มสิบไม่หัก!" / "Perfect 10!" stamp for 10/10
  - bright and warm, readable at chat-thumbnail size
- **Share text** pastes anywhere: `เตรียมบ้านทัน 8/10 🏠 (บ้านวันที่ 14 ต.ค. 69) · ได้ฉายา "…" · เล่นต่อเนื่อง 3 วัน 🔥 · ✅✅💡✅💧✅ · … 👉 link · #บ้านรอดไหม` (the streak part only from two days on)
- **Challenge back** (v1.3.0): after a friend's challenge, the first button replies with both scores and the card: *"เพื่อนได้ 3/10 เราได้ 8/10 ในบ้านหลังเดียวกัน 🏠 ตาเธอแล้ว ลองแก้มือดู! 👉 link"*. During the round the clock shows the score to beat.
- **One tap:**
  - Web Share API with the PNG attached (iOS Safari, Android Chrome).
  - Otherwise a sheet with LINE (`line.me/R/share`), Facebook (`sharer.php`), X (`x.com/intent/tweet`), copy link, and save image.
  - In LINE, Facebook and TikTok in-app browsers, downloads usually fail. The card is shown as an `<img>` with *"กดค้างที่รูป แล้วเลือกบันทึกรูปภาพ"*, and LINE also gets an *open in browser* link (`openExternalBrowser=1`).
- **Challenge link:** `/c/p8?h=20261007` encodes the mode, the score to beat and the house seed. The friend sees a banner ("เพื่อนเตรียมบ้านทัน 8/10") and plays the identical house. The result compares scores and invites a challenge back.
- **English:** the same cards, text and links exist in English. In English the share text ends `#FloodSafety`, challenge links are `/en/c/p8?h=…`, and the wordmark on cards and checklists is "Baan Rod Mai?" (`strings.json → logoA/logoB`, shrunk to fit by `logo()` in `cards.js`).
- **Link previews:** each `/c/{p|r|d|f|s}{0–10}` URL is its own static HTML page. Each has Open Graph tags and a pre-rendered 1200×630 PNG showing the score, so LINE and Facebook show "เพื่อนเตรียมบ้านทัน 8/10" in the preview. See [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered) for why these are pre-rendered rather than rendered per request.
- **Family-group checklists:** five 1080×1920 images, *เตรียมบ้านก่อนน้ำมา 10 ข้อ*, *ก่อนกลับเข้าบ้าน 10 ข้อ*, since v1.5.0 *ห้องปลอดฝุ่น 10 ข้อ* and *บ้านปลอดภัยจากไฟ 10 ข้อ*, and since v1.7.0 *ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ*. They have big text, an icon per item, the helpline numbers and "ส่งต่อด้วยความห่วงใย ♥". They are available in-game and at `/checklist/prepare`, `/checklist/return`, `/checklist/dust`, `/checklist/fire` and `/checklist/stock`, which have their own previews for people who never play. The hazard pages show the same lists as text.

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
│   │   ├── main.js         boot (pickStart → state.start), screens (mode grid --cols ≤ 4), game loop, HUD (story hours in a power cut), result, sharing UI
│   │   ├── modes.js        mode registry: codes, threats, props, seasons; switchOn, modeLink, recommend (pure, unit-tested)
│   │   ├── house.js        seeded house generation; a power-cut house always gets an item with lostAfter (pure, unit-tested)
│   │   ├── round.js        timer, water / smoke / haze / dark (darkLevel, hoursOut, lostAfter), choices, score (pure, unit-tested)
│   │   ├── run.js          v1 single round / v2 combo structure
│   │   ├── scene.js        inline SVG rooms, sprites, tap areas, water, smoke, haze, the dark (_dark), badges (wet, smoked, spoiled)
│   │   ├── cards.js        canvas: result card (with the ending bubble), checklists, link previews; a theme per mode (THEMES, stock since v1.7.0)
│   │   ├── svgdraw.js      tiny SVG→canvas renderer (no image decoding)
│   │   ├── share.js        Web Share + LINE/FB/X/copy/save, challenge links
│   │   ├── collection.js   safety book: playable lessons, merge learned ids (pure, unit-tested)
│   │   ├── kit.js          the home check and the plan card: sheets, kit and plan cards, sharing (loaded on open, v1.8.0)
│   │   ├── kitplan.js      the household's list, score and missing things from kit.json (pure, unit-tested)
│   │   ├── mascot.js       น้องจก (SVG, faces, props)
│   │   ├── audio.js fx.js icons.js ui.js content.js progress.js analytics.js rng.js util.js
│   ├── content/            ← EDITABLE: items, rooms, strings, config, sources, checklists, helplines, kit (home check + plan card), carousel
│   ├── art/                rooms/*.svg (front, living, kitchen) + sprites.svg
│   ├── fonts/              Kanit Thai + Latin subsets (OFL)
│   ├── og/  share/  icons/ pre-rendered images (npm run images); og/en/ holds the English previews
│   ├── en/                 generated English start page, learn and hazard pages, c/ and checklist/ (npm run build)
│   ├── c/  checklist/      generated link-preview pages (npm run build)
│   ├── learn.html llms.txt sitemap.xml robots.txt   generated SEO / AI-search files (npm run build)
│   ├── flood.html pm25.html fire.html ready.html   generated hazard pages (slugs: config.json → hazards)
│   ├── posts.html          generated carousel page for whoever posts (noindex); images in share/carousel/
│   ├── sw.js  js/version.js   generated service worker (offline) and version guard
│   ├── _headers _routes.json manifest.webmanifest
├── functions/api/e.js      Pages Function: anonymous event counter → Analytics Engine
├── tools/                  build.mjs (validate + generate), render-images.mjs, sw.template.js, probe.mjs, check-docs.mjs
├── tests/                  run.mjs (rules), smoke.mjs (browser)
├── docs/                   this documentation + screens/
├── HANDOFF.md  CHANGELOG.md  README.md  LICENSE  AGENTS.md  CLAUDE.md
└── wrangler.toml  package.json  .node-version
```

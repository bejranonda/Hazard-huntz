# Game design: บ้านรอดไหม?

> **A 60-second house, two moments of truth.** Before the flood you race the rising water to save what matters. After the flood you spot what can still hurt you. Every tap teaches one real action with its source, almost always a Thai agency, and every result is built to be forwarded to the family LINE group.
>
> Since v1.5.0 the same house also faces PM2.5 dust and house fire, and since v1.7.0 a night without power (ไฟดับทั้งคืน บ้านเราอยู่ได้ไหม?): five modes in all.
>
> Since v1.8.0 two tools outside the round turn the lessons into the family's own: **บ้านเราพร้อมแค่ไหน?** (a home-kit check) and **แผนบ้านรอดของบ้านเรา** (a family plan card).
>
> **Since v1.9.0 the app is tools first and the game is optional.** The start screen opens on what to do when something happens (a short sourced guide for each of nine hazards, four of them with no game), what to keep at home, and the family plan; the 60-second game sits below them as the easier way to remember ([KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)).
>
> **Since v1.10.0 three calculators** work out what to do from the household's answers: how long the fridge keeps in a power cut, what today's dust reading means for everyone at home, and how many days the pills last ([below](#calculators-the-fridge-dust-today-and-the-pills-v1100)). Since v1.10.1 they ask one question at a time and answer with a word first, in plain words.

## Design pillars

1. **Useful first.** Since v1.9.0 that starts on the start screen: what to do, what to keep and who does what come before the game, and no advice is behind a round. Every target is a real action with an official source behind it (see [01-safety-content.md](01-safety-content.md)); the few that rest on a foreign agency only are flagged ⚠️ and say so. Every player leaves with the full lesson, including the items they missed.
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
| Water curve | Slow start (since v1.9.1 nothing is under water before 20 s; the first item at 21.9 s at the earliest), floor fully covered at **36 s** (27 s before v1.9.1), counter height at about 60 s. Keyframes are in `config.json` ([KNOWLEDGE §30.8](KNOWLEDGE.md#308-the-floods-pace)). |
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
| Hazards | Kitchen: the fridge everyone keeps opening, minced pork left after the night, a full freezer, cans with no opener, too little stored water, the food store. Living room: grandma's medicine that must stay cold, a candle left burning, a torch with flat batteries, a battery radio, a power bank on one bar, the TV and computer still plugged in. Front: a generator under the window. |
| Decoys | A closed rice bin, a battery wall clock, books, a potted plant, dishes in the sink. |
| Gecko | Carries a torch. "ไฟดับแล้ว! ดูตู้เย็นก่อนเลย" / "มืดแล้ว ไฟฉายอยู่ไหนนะ" |
| Sources | 3 lessons ✅ (Thai agencies, cross-checked with Ready.gov); 10 ⚠️, most on international guidance only (US CDC, Ready.gov, US Fire Administration). The lesson says so ([KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)). |
| Guardrail | No fear about the dark: the room stays readable, the gecko stays cheerful, and nothing about injuries. Food and medicine advice is general and names its source. |


## Outside the round: the home check and the plan card (v1.8.0)

**The idea:** after a round about someone else's house, check your own. Both open in a sheet over the start screen, keep everything on the device, and end in a card to forward. Details and sources: [KNOWLEDGE §28](KNOWLEDGE.md#28-the-home-check-and-the-family-plan-card-v180).

| Element | เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน? (`/kit`, `/?open=kit`) | แผนครอบครัวของบ้านเรา (`/plan`, `/?open=plan`) |
|---|---|---|
| Asks | What the household needs "ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน" (floods named since v1.8.1): how many people (1–10, a − / + stepper) and who lives there (small children, older or bedridden people, daily medicine, pets; one column under about 360 px) | Six short fields: the shelter near home, the family meeting place, who to contact if separated, who helps whom (×2), medicine and must-haves |
| Shows | The household's list: 9 things for every home plus up to 6 by answer, with amounts for this household ("27 ลิตร (3 ลิตร × 3 คน × 3 วัน)", a torch each), the agencies per line, and a ⚠️ on lines under review with one footnote under the list (v1.9.1; "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on each such line before). Ticks fill a meter: "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)" | Each field with an example and, for most, a sourced hint ("ยาประจำตัวอย่างน้อย 7 วัน"); the warning not to type ID-card numbers |
| Card (1080 × 1350) | A score ring, the gecko with a torch (its face follows the score), "มีแล้ว 3 จาก 9 อย่าง", up to 3 things still missing, "บ้านคุณพร้อมแค่ไหน? เช็กฟรี" and `/?open=kit` | All six fields, with a dotted line for an empty one so a printed copy can be filled in by hand (v1.8.1), the date, the free helplines 1784 · 199 · 1669 · 1555 · 1130 · 1129, "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน" and `/?open=plan` |
| Ways in | The start screen's hub "🎒 เช็กของจำเป็น" (then "บ้านเราพร้อม 70%", updated as soon as a tick changes it since v1.9.1; a quick button "บ้านพร้อมไหม?" until v1.8.1), `/kit` (v1.9.0), the result screen of the flood and power-cut modes, `/ready`, `/flood`, `/learn`, the link, and the installed app's shortcut (v1.8.1) | The start screen's hub "📝 แผนครอบครัว" (v1.9.0), `/plan` (v1.9.0), the check's list, `/ready`, `/flood`, `/learn`, the link, and the installed app's shortcut (v1.8.1) |
| Kept | `brm:kit` on this device | `brm:plan` on this device |
| Guardrail | No fear and no shame: the score counts things the house has, and the card lists what to get next | Nothing typed leaves the phone except in the picture the family shares; short fields, no names asked |

- **The quick buttons** sit two per row with the icon beside the label, so the Thai labels don't break mid-word. Since v1.9.0 they hold only the helplines and the water-level link: the checklists and the home check moved up into the hub (below).
- **Why a score:** a percentage is something to compare in a family group ("บ้านเราพร้อมแล้ว 56% ถ้าน้ำท่วมหรือไฟดับ 3 วัน 🎒 แล้วบ้านคุณล่ะ?"), like the game's X/10, and the missing things on the card are the next step. The score counts things, not amounts.
- **Which results offer the check (v1.8.1):** the 🎒 button "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน" (v1.9.1; "เช็กว่าบ้านเราพร้อมแค่ไหน" before) appears on a result screen when the mode's hazard lists `kit` in `config.json → hazards.<hazard>.tools`: Prepare, Return and the power cut, whose lessons are about what a household keeps at home. Dust and fire don't list it, so their results don't offer it. The same list puts the two links on the hazard's page (`/flood`, `/ready`). A new hazard decides it in data, not in code.
- **Back where it says (v1.8.1):** the plan card's share sheet goes back with "← แก้แผน" / "← Edit the plan" to the form, still filled in; the plan form opened from the check goes back with "← กลับไปที่รายการ" to the list.
- **One name per tool (v1.9.1):** the check is **เช็กของจำเป็น** / "Check your supplies" (its sheet "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?" / "Check your supplies: how ready is our home?"), the plan **แผนครอบครัว** / "Our family plan" (the card "การ์ดแผนครอบครัว"). Before, each had three or four names. The English card still asks "How ready is your home? Check for free".
- **"เสร็จแล้ว"** (v1.9.1) sits next to "← กลับไปที่รายการ" in the check's share sheet, so the visitor can finish there.

## Tools first: the start screen and the guides (v1.9.0)

**The idea:** nobody knows which hazard comes next, so the app answers "what do we do?" for any of them in a minute of reading, and keeps the game as the easier way to remember, never a gate. Details, sources and measurements: [KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190).

```
 START (v1.9.0)                     GUIDE PICKER (sheet)               A GUIDE (sheet)
┌────────────────────────┐        ┌────────────────────────┐        ┌────────────────────────┐
│              [EN] [🔊] │        │ 📋 ต้องทำอะไร เมื่อเกิดภัย  │        │ 🏚️ แผ่นดินไหว ทำอะไร 10 ข้อ │
│       บ้านรอดไหม?        │        │ เลือกเรื่องที่อยากรู้ …       │        │ ก่อนเกิด                 │
│ เตรียมบ้านให้พร้อมทุกภัย …  │        │ ┌ช่วงนี้┐                  │        │ ① ยึดเครื่องใช้หนักๆ …     │
│┌⛰️ ช่วงนี้: น้ำป่า ดินถล่ม ›┐│        │ [⛰️ ] [🌊 ] [🧹 ]        │        │ ขณะเกิด                  │
│└────────────────────────┘│        │ [⛈️ ] [🏚️ ] [🔥 ]        │        │ ⑥ ริมทะเล … ⚠️            │
│┌📋 ต้องทำอะไร เมื่อเกิดภัย ›┐│        │ [🔦 ] [🌡️ ] [😷 ]        │        │ หลังเกิด                 │
│└────────────────────────┘│        │ [        ปิด        ]   │        │ ⑦ … ⑩                   │
│┌🎒 เช็กของจำเป็น┐┌📝 แผนครอบครัว┐│        └────────────────────────┘        │ ที่มา: ปภ. · กรมทรัพยากรธรณี │
│└──────────────┘└────────────┘│                                          │ [▶ เล่นเกมเรื่องนี้] (game only) │
│ 🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน │                                          │ [📖 อ่านเหตุผลและที่มา]      │
│ bubble ……………… 🦎          │                                          │ ส่งต่อเป็นรูป: LINE … [รูป]  │
│┌[แนะนำช่วงนี้] 🏠 ก่อนน้ำมา ▶┐│                                          │ [🖨️ พิมพ์] [← เรื่องอื่น] [ปิด] │
│ [🧹][😷][🔥][🔦]          │                                          └────────────────────────┘
│ [☎️ เบอร์ช่วยเหลือ][🌧️ ระดับน้ำ]│
└────────────────────────┘
```

| Element | What it does |
|---|---|
| **Alert card** (optional) | "ช่วงนี้: {guide} · ดูว่าต้องทำอะไร ›" while `config.json → alert` is on (an owner-set guide with an end date); opens that guide |
| **Hub** | "📋 ต้องทำอะไร เมื่อเกิดภัย" (the guide picker), "🎒 เช็กของจำเป็น" (the home check; shows "บ้านเราพร้อม 64%" once checked), "📝 แผนครอบครัว" (the plan card). All three on the first screen at 320 × 460 and 360 × 640. Since v1.10.0 two more tiles, "🥛 ไฟดับ: ตู้เย็น" and "😷 ฝุ่นวันนี้", make a 2 × 2 grid with the check and the plan ([below](#calculators-the-fridge-dust-today-and-the-pills-v1100)) |
| **"🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน"** | The label above the gecko and the mode cards, which work as before |
| **Guide picker** | The nine guides as tiles, in `config.json → guides` order (since v1.9.1: 🌊 น้ำท่วม: ก่อนน้ำมา, 🧹 น้ำท่วม: หลังน้ำลด, ⛰️ น้ำป่า ดินถล่ม, ⛈️ พายุ ฟ้าผ่า, 🏚️ แผ่นดินไหว, 🔥 ไฟไหม้, 🔦 ไฟดับ, 🌡️ อากาศร้อนจัด, 😷 ฝุ่น PM2.5), the alert's first with "ช่วงนี้" |
| **A guide** (v1.9.1 layout) | The title; phase jump chips; "☎️ โทรฟรี" 1784 · 199 · 1669 (tap to dial; since v1.11.0 the guide's own numbers, each with whom it reaches under it, "1130 / ไฟดับ กทม. นนทบุรี สมุทรปราการ", and the power-cut guide first offers "🥛 ไฟดับอยู่ตอนนี้? ดูว่าของในตู้เย็นอะไรต้องทิ้ง"); 10 lines, grouped "ก่อนเกิด / ขณะเกิด / หลังเกิด" where they have phases (the heat guide names its own: เตรียมไว้ก่อน / วันที่ร้อนจัด / ถ้ามีคนเป็นลมแดด), ⚠️ on lines under review; the agencies, small, and one ⚠️ footnote; ▶ the game when there is one; 📖 the hazard page with every line's sources; "เตรียมบ้านต่อ": 🎒 เช็กของจำเป็น, 📝 แผนครอบครัว; "ส่งต่อให้คนที่บ้าน": four share buttons and the picture as a thumbnail; 🖨️ print; "← เรื่องอื่น" and "เสร็จแล้ว". ✕ at the top and the phone's back button close it ([KNOWLEDGE §30.2](KNOWLEDGE.md#302-sheets-the-back-button-and-sharing)) |
| **A friend's challenge** | Hides the alert, the hub and the game label: the challenge is why they came |

- **Guides with a game and without.** Prepare, Return, dust, fire and the power cut keep their 10-item checklists as their guides, and ▶ starts the round. Flash floods and landslides, storms and lightning, earthquakes and extreme heat have guides only: every line carries its own sources and a phase, and their hazard pages lead with the guide.
- **The result screen's "📋 เช็กลิสต์ 10 ข้อ"** opens that mode's guide; "← เรื่องอื่น" leads to the rest. The old checklist tabs are gone. Since v1.11.0 the button carries the guide's real title ("📋 เตรียมบ้านก่อนน้ำมา 10 ข้อ") in a "เตรียมบ้านต่อ" row right under share and challenge, with the hazard's tools and the check link ([KNOWLEDGE §33.12](KNOWLEDGE.md#3312-the-result-screens-next-steps)).
- **Print:** a guide or the home check's list prints as a plain A4 list with tick boxes, for the fridge door or an older relative; the button is hidden in in-app browsers, which can't print.
- **Guardrails:** the guides follow the same content rules as the lessons: sourced, no deaths or injuries, no blame, calm wording ("รีบอพยพทันที" is an action, not a threat). What sources disagree on is left out.

## Calculators: the fridge, dust today and the pills (v1.10.0)

**The idea:** the owner liked the home check's "put in values and it works out what to prepare and how much", and asked for more like it. Three tools now work that way, each from numbers an agency gives, each in a sheet over the start screen, keeping its answers on the device and ending in a text to send. Details, sources and checks: [KNOWLEDGE §32](KNOWLEDGE.md#32-calculators-the-fridge-dust-today-the-pills-v1100).

**Food by food, and for everyone at home (v1.11.0).** The fridge now answers the owner's "ของอะไรในตู้เย็นได้นานแค่ไหน": the fridge's 4 hours decide when, and each food's row of FoodSafety.gov's or USDA FSIS's charts decides what, so the card lists what will have to go (or must go now) and what keeps, and the freezer lists its packs once its time is up. Medicine is never "throw it out" (insulin 28 days at 15–30 °C; other cold medicine "check the label"), breast milk has its own cards, an unanswered freezer counts as half full, and "💡 ไฟมาแล้ว" keeps the answer. Dust today shows the at-risk lines without any tick, under the lines for everyone, with no line twice. Details: [KNOWLEDGE §33](KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110).

**In plain words (v1.10.1).** The owner couldn't read the first fridge tool ("I cannot understand, please review and validate the UI and UX, try to improve and use general simple language"): it counted before it was asked, had two ways to set the time, three facts on every line and the source under every row. Both sheets now follow [GUIDELINES rule 82](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit): one question at a time, by a tap; nothing started before it; the answer as a word first, large, then one line; no jargon up front; the sources once, at the bottom ([KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)).

```
 FRIDGE (sheet, v1.11.0), after "3 ชม."  DUST TODAY (sheet, v1.11.0), orange
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ 🥛 ไฟดับ: ของในตู้เย็นยังกินได้ไหม? │      │ 🌫️ ฝุ่นวันนี้ บ้านเราต้องทำอะไร?  │
│ ไฟดับมานานเท่าไรแล้ว?            │      │ ค่าฝุ่นตอนนี้เป็นสีอะไร?          │
│ [เพิ่งดับ][1 ชม.][2 ชม.]          │      │ [ฟ้า][เขียว][เหลือง][ส้ม][แดง]  │
│ [3 ชม.][4 ชม.][6 ชม.]           │      │ [ยังไม่รู้สี? 🌐 … (Air4Thai)]   │
│ [12 ชม.][1 วัน][2 วัน]           │      │ ▸ 🔢 รู้ตัวเลข? ใส่ตัวเลขแทน      │
│ ไม่ตรงกับปุ่มไหน ให้เลือกเวลาที่นานกว่า │      │ ┌ ● สีส้ม · เริ่มมีผลต่อสุขภาพ ┐ │
│ ▸ 🕘 จำได้ว่าไฟดับตอนกี่โมง?        │      │ │ ทุกคนในบ้าน                │ │
│ ⏱️ ไฟดับมาแล้ว 3 ชม. … [💡 ไฟมาแล้ว] │      │ │ · ใส่หน้ากากกันฝุ่น PM2.5 … │ │
│ [💊 มียา… เช่น อินซูลิน] [🤱 นมแม่]  │      │ │ · ออกกำลังหนักๆ … ให้สั้นลง │ │
│ คำตอบ                          │      │ │ สำหรับเด็กเล็ก ผู้สูงอายุ …   │ │
│ ┃🥛 ของในตู้เย็น ⏳ ใกล้ครบ 4 ชม.   │      │ │ ทำตามข้อด้านบน และ          │ │
│ ┃เหลืออีกราว 1 ชม. ถ้าไม่เปิดตู้     │      │ │ · เลี่ยงการออกกำลังหนักๆ …  │ │
│ ┃❌ ถ้าเกิน 4 ชม. ต้องทิ้ง          │      │ │ เพิ่มเติม…โรคประจำตัว       │ │
│ ┃ 🥩 … 🌭 … 🍛 … 🍚 … 🥚 … (9)    │      │ └─────────────────────────┘ │
│ ┃✅ ไม่ต้องทิ้งเพราะไฟดับ           │      │ ที่มา: กรมควบคุมมลพิษ …        │
│ ┃ 🥕 … 🍞 … 🧀 … 🍯 … (4)         │      │ 📤 ส่งให้คนที่บ้าน                │
│ ┃ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง  │      │ [📋 ห้องปลอดฝุ่น 10 ข้อ] [ปิด]    │
│ ┃❄️ ของในช่องแช่แข็ง ✅ ยังแข็งอยู่    │      └──────────────────────────────┘
│ ┃ช่องแช่แข็งมีของ (ไม่แน่ใจ…) [ครึ่ง][เต็ม] │
│ จำไว้ 🚪 … 🚫 … 🌡️ … 🥫 …          │
│ ⚠️ เวลาและรายการมาจากหน่วยงานสหรัฐฯ … │
│ 📤 ส่งให้คนที่บ้าน  [🎒] [ปิด]        │
└──────────────────────────────┘
```

| Element | ไฟดับ: ตู้เย็น (`/fridge`, `/?open=fridge`) | ฝุ่นวันนี้ (`/air`, `/?open=air`) | ยาพอกี่วัน? (in the home check) |
|---|---|---|---|
| Asks | "ไฟดับมานานเท่าไรแล้ว?": one of 9 buttons, เพิ่งดับ to 2 วัน (`fridge.quick`), or since v1.11.0 the clock time it went off; in the freezer's card, half full (the default since v1.11.0) or full; ticks for cold medicine (such as insulin) and, since v1.11.0, stored breast milk. Nothing is counted before a tap | "ค่าฝุ่นตอนนี้เป็นสีอะไร?": five colours first, with "ยังไม่รู้สี? 🌐 … (Air4Thai)" under them; or, behind "🔢 รู้ตัวเลข? ใส่ตัวเลขแทน", the kind of number (PM2.5 or Thailand's AQI) and the number. Until v1.11.0 also who at home needs extra care; since then nobody is asked | Pills left, pills a day |
| Shows | A card per part: a status word ("ยังกินได้" / "ใกล้ครบ 4 ชม." / "เกิน 4 ชม.แล้ว"), then one line (the time left "about", or what to do); a coloured left edge; since v1.11.0, food by food under the fridge (9 to throw out, 4 that keep) and pack by pack under the freezer, insulin, other medicine ("🔎 … ดูฉลากก่อนใช้", never "ทิ้ง") and breast milk; "จำไว้" in four lines; the sources once | The colour and level ("สีส้ม · เริ่มมีผลต่อสุขภาพ") with its band; what everyone at home does; since v1.11.0 always what young children, older people, pregnant women and people with a long-term illness do as well, only the lines not already given; the agencies, with the DOH's two lines named | "⏳ พออีก 4 วัน ต้องมีเพิ่ม 5 เม็ด จะพอ 7 วัน" or "✅ พออีก 7 วัน ครบ 7 วันแล้ว" |
| Numbers from | The US CDC and Ready.gov; since v1.11.0 also FoodSafety.gov, USDA FSIS, the US FDA (insulin) and the UK FSA, with Siriraj Hospital on insulin (⚠️, said once on screen) | The PCD's notice in the Royal Gazette (2023); the DOH for two lines | The home check's 7 days (`moph-7days`, ⚠️) |
| Kept | `brm:fridge`: when the power went off and the button tapped (since v1.11.0 also when it came back, and the breast-milk tick), so the count goes on after closing; the hub tile says "⏱️ ไฟดับมาเกิน 5 ชม.แล้ว", and after the power is back "💡 ไฟมาแล้ว ดูว่าต้องทิ้งอะไร" | `brm:air`: the unit (until v1.11.0 also the ticks), never the reading | Nothing |
| Ways in | The hub's 🥛 tile, `/fridge`, the power-cut and storm guides' next steps (since v1.11.0 also the power-cut guide's first button), the power-cut result, `/ready`, `/storm`, a shortcut | The hub's 🌫️ tile ("ดูสีฝุ่น รู้ว่าต้องทำอะไร"; 😷 until v1.11.0), `/air`, the dust guide's next steps, the dust result, `/pm25`, a shortcut | The home check's list, when 💊 is ticked |

- **The hub** is now the main guide button and a 2 × 2 grid (🎒 📝 / 🥛 🌫️), with "🔒 ฟรี ไม่ต้องสมัคร ไม่ขอข้อมูลส่วนตัว" under it and "ก+" at the top for larger text (v1.11.0). The first three tools stay on the first screen at 320 × 460 and 360 × 640; the calculators' row follows ([KNOWN_ISSUES #77](KNOWN_ISSUES.md#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones)).
- **Rounding:** each status comes from the exact time, so it never looks safer than the source; times on screen read "about" (ราว), to the minute, and a time left of 3 hours or more in whole hours, while the time off keeps its minutes (v1.10.1; v1.10.0's time off up and time left down read "59 นาที" just after a tap).
- **The unit question:** behind "รู้ตัวเลข?", the dust tool asks whether the number is µg/m³ or Thailand's AQI, because the same number is a different colour (AQI 152 orange, 152 µg/m³ red), and sends people with a foreign app to the PM2.5 number. The colour, first, needs no unit.
- **Plain words:** the dust advice is in everyday words with the notice's meaning and strength kept: ให้น้อยลง (reduce), ให้สั้นลง (limit), เลี่ยง (avoid), งด (stop) stay four different words.
- **After the answer:** in both tools the answer scrolls into view after a tap (or a number); "📤 ส่งให้คนที่บ้าน" sends the result as text (LINE, the phone's share sheet, copy) with the tool's link; the fridge's 🎒 opens the home check, and the dust tool's "😷 วิธีป้องกันฝุ่นในบ้าน 10 ข้อ" ("📋 ห้องปลอดฝุ่น 10 ข้อ" since v1.11.0) the dust guide. Since v1.11.0 the fridge's text starts with the clock time the power went off ("ไฟดับตั้งแต่ราว 21:10 น. (3 ชม.แล้ว)") and lists what to throw out and keep, because it is read later. When a sheet opens, its title takes the focus, so no button looks chosen.
- **Guardrails:** no number of our own, a foreign figure flagged on screen, no promise that food is safe ("ราว"), no medical advice in the pills (arithmetic only), and nothing typed or read leaves the phone. Since v1.11.0: never "throw it out" for medicine, a verdict per food only from a named chart row (น้ำปลา left out, "ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง" under every list), and the at-risk advice never behind a tick ([GUIDELINES rules 83–86](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

## Playing a round

- **Tap a target:** the timer pauses and a bottom sheet shows 3 choices. Since v1.9.2 each wrong choice gives the reason a real person would give for that mistake ("ปล่อยไว้ในลิ้นชักเหมือนเดิม เสียก็ไปขอทำใหม่ได้"), so the right one can't be spotted by its length: it is the longest in 17 of 82 sets in Thai. The answers are lettered ก ข ค (A B C in English), shuffled for each house; until v1.9.1 each had an icon for its kind of action, and the right one was often the odd icon out ([KNOWLEDGE §31.1](KNOWLEDGE.md#311-wrong-answers-that-dont-give-the-right-one-away)).
- **Correct:** +100, a squish and sparkle sound, the gecko cheers. The item changes state: the breaker flips to OFF, sandbags line up, the TV lifts, the car drives away. A **tip card** shows the ≤ 80-character tip, a **ทำไม?** expander and the agency link.
- **Wrong:** −4 s, a soft "boop" and the gecko's worried face. A gentle correction shows the safer choice, why the chosen one is risky, and the same tip card. The item is marked 💡 *learned*, not failed.
- **Decoy:** −2 s on the first tap only. The gecko explains why it is fine, and the item gets a grey dash (v1.9.1; a grey tick before, which read as a win). The idle hint rings only targets, never decoys.
- **HUD:** "done/total" counts only targets the player answered; what the water, smoke or dark took is shown apart with its mark ("0/6 💧5", 💨 in fire, 🌑 in the power cut, the same marks as the share text's grid), and a room tab whose things were lost shows the mark, not ✓ (v1.9.1).
- **End:** when every target is resolved or time is up. Missed targets get a dashed outline and "?" badge, and **every** target appears in the lesson list with its tip and source: since v1.9.1 mistakes first (wrong, lost, missed, then right). When something was lost, the stats say "💧 โดนน้ำก่อน 6 อย่าง" instead of the time left. A lost challenge says "อีกนิดเดียว!" only when 1–2 points short, otherwise "รอบหน้าเอาใหม่!".
- **The phone's back button** (v1.9.2): in a round it pauses the game (the pause sheet), and Back again resumes it; on the result it goes to the start screen; on a choice or any other sheet it closes the sheet; only on the start screen does it leave the site ([KNOWLEDGE §31.2](KNOWLEDGE.md#312-the-back-button-one-history-manager)).
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

- Since v1.9.0 the mode cards sit below the hub and "🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน"; on 320 × 460 and 360 × 640 the recommended card is below the first screen, by design ([KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)).
- One button per mode, built from the registry (`config.json → modes`). The recommended one is a big card on top with a "แนะนำช่วงนี้" badge; the others are compact cards (icon over name) in one row, four of them since v1.7.0. Their names shrink with the screen (`clamp(12px, 3.9vw, 16px)`), so every Thai name stays on one line at 320 px; English names wrap to two lines. The gecko's line, prop and the featured topic change to match.
- **What is recommended** comes from one pure function, `recommend()` in `modes.js` (v1.6.0; [KNOWLEDGE §25.2](KNOWLEDGE.md#252-what-the-start-screen-recommends)), in this order:
  1. a `?mode=` link (`/?mode=dust`): that mode, with its own topic featured
  2. a rain warning: Prepare. That is `config.json → rainWarningActive: true` until its end date `rainWarningUntil` (now 30 Nov 2026), or the forecast app's live answer when there is one
  3. the mode in season (`modes[].months`, Bangkok month): dust December–March, fire April. The power cut has no months, so it is never picked here.
  4. otherwise Return
- **`?mode=` links** are for posts and campaigns. Only the five mode ids count (`prepare`, `return`, `dust`, `fire`, `stock`, any letter case); `/?mode=heat` is ignored, a friend's challenge link wins over it, and it never starts a round by itself. Visitors from abroad get `/en/?mode=…`.
- **The forecast app** can answer through `forecastStatusUrl` with `{ "rainWarning": true|false }` within 1.5 s; its answer beats the manual switch both ways. If the call fails, the manual switch is used.
- **The hazard pages** (`/flood`, `/pm25`, `/fire`, v1.6.0, and `/ready`, v1.7.0) are another way in: plain pages that since v1.9.1 open with the checklist and the free helplines, then a ▶ button to `/?mode=<id>` and the hazard's lessons.

## Feel

- **Art:** flat, warm illustration with chunky outlines. Mud browns with bright accents (sun yellow, sky blue, coral, teal). Hopeful skies: rain clouds before, sunshine after. Everything is hand-made SVG (about 40 KB), crisp on any screen.
- **Mascot:** **น้องจก**, an original gecko in yellow rubber boots. A rain hood before the flood, a torch after (and a mask, a fire helmet and a torch in the dust, fire and power-cut modes). Since v1.9.2 the pictures of the guides with no game give it a prop too: a yellow hard hat (landslide, earthquake), the rain hood (storm) or a straw sun hat (heat), from `config.json → guides[].prop`. Five faces: happy, cheer, oops, wow, think.
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
- Every target is a focusable SVG `role="button"` with a Thai or English label, operable with Enter or Space. Sheets trap focus and support Esc; since v1.9.1 a sticky 44 px ✕ and the phone's back button close them too, and since v1.9.2 Back in a round pauses it rather than leaving the site.
- On screens up to 640 px tall the choice sheet is more compact (v1.9.2), so a choice's three answers fit without scrolling in Thai at 320 × 568, 360 × 640 and 390 × 844; in English 20 of 82 still scroll a little at 320 × 568 ([KNOWN_ISSUES #73](KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones)). Every answer stays 52 px tall or more there.
- Thai words never break mid-word: the words in `config.json → keepTogether` are kept on one line in the app, on the pages and on the cards (v1.9.1, [KNOWLEDGE §30.1](KNOWLEDGE.md#301-thai-words-that-must-not-break-keeptogether)). Text is 15–19 px with Thai-friendly line height.
- No flashing effects. Rain streaks drift slowly and stop under reduced motion.

## Wireframes

Low-fidelity layouts below, drawn for v1.0 (the start screen of v1.9.0, with the hub above the game, is in the section above and in [20-start-tools.png](screens/20-start-tools.png); since v1.9.2 the choice sheet's answers carry ก ข ค / A B C instead of the action icons drawn here, and their wrong answers are longer). Real screenshots from the built game, captured by `npm run smoke -- --screens docs/screens`, are in [`docs/screens/`](screens/).

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
| A sample kit card (v1.8.1) | [19-kit-card.png](screens/19-kit-card.png) |
| The start screen, tools first: the alert card and the hub above the game (v1.9.0) | [20-start-tools.png](screens/20-start-tools.png) |
| The guide picker, the alert's guide first (v1.9.0) | [21-guide-picker.png](screens/21-guide-picker.png) |
| The earthquake guide, by phase (v1.9.0) | [22-guide-quake.png](screens/22-guide-quake.png) |

`npm run smoke -- --screens docs/screens` refreshes 01–12 and 15. The others (13, 14, 16–22) were captured once, by one-off probes in their releases, and are not refreshed by that run. That run was repeated for v1.9.0 (19 Oct 2026), so `01-start.png` shows the start screen with the hub and `09-checklist.png` a guide sheet (text first, no tabs).

The share assets, rendered by the same canvas code as the game:

- result cards: [`public/share/sample-result-prepare.png`](../public/share/sample-result-prepare.png), [`…-return.png`](../public/share/sample-result-return.png)
- checklists: [`public/share/checklist-prepare.png`](../public/share/checklist-prepare.png), [`…-return.png`](../public/share/checklist-return.png)
- link previews: `public/og/*.png`

## Sharing design

- **Result card** (1080×1350 PNG, drawn on a canvas in the browser):
  - logo, mode chip, house date, the gecko (300 × 316, its face matching the rank) and the big score (200 px). On the themes with a sun or moon at the top right (Return, dust, the power cut), the English wordmark shrinks to stay clear of it (v1.8.1). Since v1.9.2 there is no separate headline: the wordmark, the mode chip, the score and the rank say it
  - **the ending** (v1.6.0): the line that answers "บ้านรอดไหม?", the same one the result gecko says, in a white speech bubble. Since v1.9.2 the bubble is under the gecko, 960 px wide, with its tail pointing up, and the text is centred at 52 px, shrinking to 38 px to fit two lines, three at 38 px if it must (it was 38 px in a 330 px bubble beside the gecko, about 9 px in a chat). No line starts with closing punctuation such as "!" (v1.8.1); emoji are left out on the card, because canvas fonts can draw them as empty boxes. The card's `alt` text ends with the same line
  - rank pill, a ✓/!/? row (shapes as well as colours), "บ้านหลังเดียวกัน ท้าเลย!" (or, after a challenge, "เพื่อน 3/10 · เรา 8/10 · บ้านหลังเดียวกัน"; 50 px, down to 34), **the challenge link for this house** (v1.3.0; 46 px, down to 30, weight 600 since v1.9.2), the disclaimer
  - a "เต็มสิบไม่หัก!" / "Perfect 10!" stamp for 10/10
  - bright and warm, readable at chat-thumbnail size: looked at 270 px wide for v1.9.2, where the gecko's line and the link can be read ([KNOWLEDGE §31.3](KNOWLEDGE.md#313-the-result-card-at-chat-size))
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
│   │   ├── main.js         boot (pickStart → state.start; ?open=guide, /checklist/<id>, ?open=<tool>), start screen (the alert card and the hub, renderStart; one TOOLS map and openTool for the four tools, v1.10.0), the guide picker and a guide (openGuides, guideSections, openChecklist), screens (mode grid --cols ≤ 4), game loop, HUD (story hours in a power cut), result, sharing UI
│   │   ├── modes.js        mode registry: codes, threats, props, seasons; switchOn, modeLink, recommend, activeAlert (the owner's alert, v1.9.0); setGuides, propFor (a guide's prop, v1.9.2) (pure, unit-tested)
│   │   ├── house.js        seeded house generation; a power-cut house always gets an item with lostAfter (pure, unit-tested)
│   │   ├── round.js        timer, water / smoke / haze / dark (darkLevel, hoursOut, lostAfter), choices, score (pure, unit-tested)
│   │   ├── run.js          v1 single round / v2 combo structure
│   │   ├── scene.js        inline SVG rooms, sprites, tap areas, water, smoke (redrawn by geometry, v1.9.1), haze, the dark (_dark), badges (wet, smoked, spoiled; a dash for a tapped decoy), room tabs with the lost mark
│   │   ├── cards.js        canvas: result card (the ending bubble under the gecko, endingBubble, v1.9.2), checklists (a plain layout for guides without sprites, v1.9.0), link previews; a theme per mode and guide (THEMES: stock since v1.7.0; landslide, storm, quake, heat since v1.9.0); drawCalls, the numbers with their names on a guide's picture and the plan card (v1.11.0)
│   │   ├── svgdraw.js      tiny SVG→canvas renderer (no image decoding)
│   │   ├── share.js        Web Share + LINE/FB/X/copy/save, challenge links; openExternal keeps the game's tab (v1.9.1)
│   │   ├── collection.js   safety book: playable lessons, merge learned ids (pure, unit-tested)
│   │   ├── kit.js          the home check and the plan card: sheets, kit and plan cards, sharing, print (loaded on open, v1.8.0); the cards link /kit and /plan (v1.9.0); the calculators (v1.10.0): openFridge, openAir, the pills, textShare (a result sent as text); food by food, the time box and "ไฟมาแล้ว" with an end, and copy-as-text for the plan and the missing list (shareImage's copy, v1.11.0)
│   │   ├── kitplan.js      the household's list, score and missing things from kit.json; fridgePlan, medDays, airLevel, airAdvice (v1.10.0); fridgeFoods, overAs and the half-full default, the at-risk lines for everyone (v1.11.0) (pure, unit-tested)
│   │   ├── mascot.js       น้องจก (SVG, faces, props: hood, torch, mask, firehat, and helmet and sunhat since v1.9.2)
│   │   ├── ui.js           screens, the bottom sheet (its ✕, v1.9.1), the back button's history entries for the game and result screens and sheets (settleHistory, setScreenBack, v1.9.2), toasts; canPrint and printList (an A4 list for a guide or the kit, v1.9.0)
│   │   ├── util.js         $, esc, store, dates, inAppBrowser; keepTogether: setKeepTogether, keptSpans, keepWordsIn, observeKeptWords (v1.9.1)
│   │   ├── content.js      loads the content, t/L, the language (brm:langPick, v1.9.1), agencyName, langPath
│   │   ├── audio.js fx.js icons.js (spriteIcon; the answers' action icons were removed in v1.9.2) progress.js analytics.js rng.js
│   ├── content/            ← EDITABLE: items, rooms, strings, config (modes, guides, alert, hazards), sources, checklists (one per guide), helplines, kit (home check, plan card, the fridge and dust today), carousel
│   ├── art/                rooms/*.svg (front, living, kitchen) + sprites.svg
│   ├── fonts/              Kanit Thai + Latin subsets (OFL)
│   ├── og/  share/  icons/ pre-rendered images (npm run images); og/en/ holds the English previews
│   ├── en/                 generated English start page, learn and hazard pages, c/ and checklist/ (npm run build)
│   ├── c/  checklist/      generated link-preview pages (npm run build)
│   ├── learn.html llms.txt sitemap.xml robots.txt   generated SEO / AI-search files (npm run build)
│   ├── flood.html pm25.html fire.html ready.html   generated hazard pages (slugs: config.json → hazards)
│   ├── landslide.html storm.html quake.html heat.html   generated guide-only hazard pages (v1.9.0)
│   ├── kit.html plan.html  generated pages for the home check and the plan card, with their own previews (v1.9.0)
│   ├── fridge.html air.html   generated pages for the calculators, with their own previews (v1.10.0)
│   ├── posts.html          generated carousel page for whoever posts (noindex); images in share/carousel/
│   ├── 404.html            generated "not found" page, Thai + English, noindex (v1.9.1)
│   ├── sw.js  js/version.js   generated service worker (offline) and version guard
│   ├── _headers _routes.json manifest.webmanifest
├── functions/api/e.js      Pages Function: anonymous event counter → Analytics Engine
├── tools/                  build.mjs (validate + generate), render-images.mjs, sw.template.js, probe.mjs, check-docs.mjs
├── tests/                  run.mjs (rules), smoke.mjs (browser)
├── docs/                   this documentation + screens/
├── HANDOFF.md  CHANGELOG.md  README.md  LICENSE  AGENTS.md  CLAUDE.md
└── wrangler.toml  package.json  .node-version
```

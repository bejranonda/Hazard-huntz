# Launch kit

**The one message:** *"เล่น 60 วิ รู้วิธีจริง แล้วส่งต่อให้คนที่บ้าน"*: play for a minute, learn the real action, pass it on to family. The game is the hook; the forwarded checklist image and the challenge link do the spreading.

**Since v1.9.0, tools first:** *"รู้ว่าต้องทำอะไร เตรียมอะไร แล้วส่งต่อให้คนที่บ้าน"*. The app opens on what to do for any hazard (nine short guides), what to keep (the home check) and the family plan; the game is the optional way to remember. When something is in the news, post that hazard's guide ([the 5-minute playbook](#when-something-happens-the-5-minute-playbook)).

What the research says about Thai audiences:

- LINE has about 56M monthly users in Thailand, TikTok about 57M adults and Facebook about 52M.
- 78% of web traffic is on mobile, and 74% of mobiles run Android.
- Older family members mostly *forward* bright, warm pictures. They do it early in the morning (about 04:00–06:30) and before bed.
- In this flood, coping humour spread fastest (*น้ำรอการระบาย*).
- AI-generated flood images, mocking victims or rescuers, and politics all drew backlash.

**Who receives it (v1.11.0, [07-audience.md](07-audience.md)).** The person who posts or forwards is often not the one who needs it. Seven personas: the morning forwarder (60–72, forwards pictures, dislikes links), the family organiser (28–50, sends one picture to the parents' group), the community relay (อสม., village heads, district LINE admins, who ask "who says so, and can I print it?"), the grandparent carer or older person living alone (who may never open a link, and gets paper or a picture on someone else's screen), the household in the water's path (needs the next hour's list, nothing to answer), the condo and office worker (dust weeks, quakes, power cuts), and the migrant worker or foreign resident (pictures that work without Thai). So: **post the picture first, with the link under it;** name the agency and the helpline in the caption; keep it warm and short; and give partners an A4 version to print. About one in three Thais over 60 isn't online at all, and a forwarded picture never shows in any count: treat every share figure as a floor. The research corrects one figure used below: there are about **1.07M** อสม. (DHSS, 2023), not 1.04M.

---

## 1. Phased plan

| Phase | When | Game setting | Focus |
|---|---|---|---|
| 0. Soft launch | Day −1 → 0 | `rainWarningActive: true` | Real-phone QA ([06-test-checklist.md](06-test-checklist.md)). Check the domain and images (done 6 Oct 2026), check previews in LINE and Facebook. Send to 20–30 friends and fix the copy. |
| 1. Prepare first | Now → the next rain wave | `rainWarningActive: true` with `rainWarningUntil` set to the last day of the warning (Prepare is the default) | Posts lead with ก่อนน้ำมา. Push the *เตรียมบ้านก่อนน้ำมา 10 ข้อ* image. Run a daily "บ้านวันนี้" challenge. |
| 2. Return as water recedes | When ปภ. reports water receding in most affected provinces, or your forecast shows 3+ dry days | Set `rainWarningActive: false`, or let `rainWarningUntil` end it (Return is the default in the flood months). Both modes stay available. | Lead with หลังน้ำลด. Push *ก่อนกลับเข้าบ้าน 10 ข้อ*. Target shelters, evacuees and volunteers cleaning houses. |
| 3. Sustain | 2–6 weeks | Daily house | A weekly "บ้านแห่งสัปดาห์" challenge. Share what players learned, e.g. "73% เลือกเรียกช่างไฟ" from the [metrics](05-metrics.md). Thank volunteers. |

You don't have to pick one region: the "แนะนำช่วงนี้" badge only changes which button comes first. Areas still under water can tap หลังน้ำลด at any time.

## 2. Ready-to-post copy (Thai)

### Facebook: Prepare launch (with the result-card image or a gameplay clip)

> ฝนจะมาอีกระลอก บ้านเราพร้อมหรือยัง? 🏠🌧️
>
> ลองเล่น "บ้านรอดไหม?" เกม 60 วินาที ช่วยกันเตรียมบ้านก่อนน้ำมา
> ✅ เอกสารสำคัญต้องเก็บยังไง
> ✅ เบรกเกอร์ต้องปลดตอนไหน และตอนไหน "ห้ามแตะเด็ดขาด"
> ✅ รถควรไปจอดที่ไหน (ไม่ใช่บนสะพานนะ!)
> ทุกข้ออ้างอิงคำแนะนำจาก ปภ. กฟน. กฟภ. กรมควบคุมโรค กรมอนามัย
>
> เล่นจบได้ฉายาด้วย ใครได้ "บ้านนี้เตรียมพร้อม" มาอวดกันในเมนต์ 😆
> วันนี้ทุกคนได้บ้านหลังเดียวกัน ท้าคนที่บ้านมาแข่งเลย
>
> 👉 [ลิงก์]
> #บ้านรอดไหม

### Facebook: Return phase

> น้ำลดแล้ว อย่าเพิ่งรีบเข้าบ้านนะ 🧹⚡
> ปลั๊กที่เคยจมน้ำ งูในรองเท้า กลิ่นแก๊สในครัว… อันตรายหลังน้ำลดซ่อนอยู่หลายจุด
>
> "บ้านรอดไหม?" โหมดหลังน้ำลด ลองตรวจบ้านใน 50 วินาที
> รู้ก่อนว่าอะไรห้ามแตะ อะไรต้องเรียกช่าง อะไรต้องทิ้ง
> ข้อมูลจาก กฟภ. กฟน. กรมควบคุมโรค กรมอนามัย อย. กรมการขนส่งทางบก
>
> ใครกำลังจะกลับเข้าบ้าน ส่งให้เขาลองก่อนนะ ❤️
> 👉 [ลิงก์]
> #บ้านรอดไหม

### Facebook: checklist only (for people who will never play)

> เก็บไว้ แล้วส่งต่อให้คนที่บ้าน 📋
> "เตรียมบ้านก่อนน้ำมา 10 ข้อ" พร้อมเบอร์ช่วยเหลือ 1784 · 1669 · 1555 · 1130 · 1129
> (ข้อมูลจากหน่วยงานรัฐ ตรวจสอบเมื่อ ต.ค. 2569)
> อยากลองฝึกจริง 60 วิ 👉 [ลิงก์]/checklist/prepare
> *(attach `public/share/checklist-prepare.png`)*

### LINE family groups / OpenChat (short, warm, image first)

1. **Checklist forward** (attach the image):
   > ส่งต่อด้วยความห่วงใย 💛 เช็กลิสต์เตรียมบ้านก่อนน้ำมา 10 ข้อ จากคำแนะนำหน่วยงานรัฐ เก็บไว้นะ
   > ใครอยากลองฝึก เล่นเกม 60 วิได้ที่ 👉 [ลิงก์]
2. **Family challenge** (the game writes this; just paste):
   > เราได้ 8/10 ในบ้านวันนี้ 🏠 ลองเล่นบ้านหลังเดียวกันดูหน่อย ใครได้เยอะกว่าเลี้ยงข้าว 😆 👉 [challenge link]
3. **Going home after the flood** (attach the Return checklist):
   > ใครจะกลับเข้าบ้านหลังน้ำลด อ่านก่อนนะ 🙏 ปลั๊กเปียกห้ามแตะ รถจมน้ำห้ามสตาร์ท ได้กลิ่นแก๊สห้ามกดสวิตช์ เบอร์ช่วยเหลืออยู่ท้ายรูป
   > ฝึกตรวจบ้าน 50 วิ 👉 [ลิงก์]/checklist/return
4. **OpenChat admins:** pin the checklist image, with this note:
   > ทีมงานอาสาทำเกมสั้นจากคำแนะนำหน่วยงานรัฐ ไม่มีโฆษณา ไม่เก็บข้อมูล ส่งต่อได้เลย

### TikTok (15–25 s screen recordings with the gecko; light, upbeat sound, not sad music)

| # | Hook (text on screen, first 2 s) | Video | Caption |
|---|---|---|---|
| 1 | "น้ำจะเข้าบ้านใน 60 วิ คุณจะทันไหม?" | Prepare gameplay with the rising water. Show the breaker flip to "น้ำเข้าบ้านแล้ว ห้ามแตะ". | ทันไหม? ยกทีวี ปลดเบรกเกอร์ เก็บเอกสาร ⏱️ เล่นบ้านเดียวกับเรา ลิงก์ในไบโอ #บ้านรอดไหม |
| 2 | "เชือก หรือ งู? 🐍" | The rope decoy ("เชือกจ้า ไม่ใช่งู 😅"), then the real snake in the shoe. | หลังน้ำลด อย่าใช้มือล้วงรองเท้านะ ใช้ไม้เขี่ยก่อน #บ้านรอดไหม |
| 3 | "3 อย่างที่ห้ามทำหลังน้ำลด" | Wet socket, flooded car, gas smell. Each tap shows the tip card. End on the score card. | ข้อ 2 คนทำผิดเยอะสุด! คุณได้กี่คะแนน? เมนต์มาเลย #บ้านรอดไหม |
| 4 | "ได้ 10/10 ไหมล่ะ" (stitch/duet) | A face-cam reaction while playing the daily house. | ท้าเล่นบ้านวันนี้ ใครได้ "เซียนกู้บ้าน" บ้าง? #บ้านรอดไหม |

**Hashtags:** lead with **#บ้านรอดไหม**. Use flood trend tags sparingly so it doesn't read as trend-jacking.

**Posting times:**

- LINE groups: 06:00–07:30 and 20:00–21:30.
- Facebook: 07:00, 12:00, 19:30.
- TikTok: 18:00–22:00.

### English posts (for readers outside Thailand, link to `/en/`)

> **Can your home survive a flood? Find out in 60 seconds.** 🏠💧
> Baan Rod Mai? is a free game that teaches real flood-safety steps from Thai agencies (prepare the house before the water comes, and spot the dangers when you move back). No sign-up, no cookies.
> 👉 https://baanrodmai.autobahn.bot/en/ #FloodSafety #Thailand

Notes for English posts:

- Say plainly that the advice and the hotlines (1784, 1669, 1555, 1130, 1129) are Thai. Tell people elsewhere to follow their local authorities.
- Good channels: expat and migrant-worker groups in Thailand, Thailand-focused travel and Facebook groups, X and LinkedIn for disaster-risk and education people, and the Autobahn Bot / BKK FloodWatch audience (see [ROADMAP L9](ROADMAP.md#l9-link-floodwatch-and-the-game-to-each-other)).
- Share `/en/` links (not `/`) so the preview and the page are English from the first tap. For one hazard, link `/en/flood`, `/en/pm25`, `/en/fire` or `/en/ready`.
- Have a native English reader check any new English copy first ([KNOWN_ISSUES #11](KNOWN_ISSUES.md#11-thai-and-english-copy-need-a-second-native-reader)).

### When diseases after floods are in the news (v1.4.0)

> **น้ำลดแล้ว ระวังโรคที่มากับน้ำ** 🦠
> ท้องเสีย ตาแดง ไข้ฉี่หนู ไข้เลือดออก รู้วิธีป้องกันครบไหม? อ่านสรุปจากกรมควบคุมโรค 8 ข้อ หรือเล่นเกม 60 วิ เก็บให้ครบหมวด 🏅
> 👉 https://baanrodmai.autobahn.bot/learn#t-health
> #บ้านรอดไหม #น้ำท่วม

- Link `/learn#t-health` when people want the answers now; link `/` (or `/?mode=return`, which opens on หลังน้ำลด) when the aim is to play and share.
- Keep `config.featuredTopic` on `"health"` only while the news lasts. It ends by itself after `featuredTopicUntil` (now 15 Nov 2026); move the date if the news lasts longer, or set `null` sooner.

### Posting the carousels (v1.6.1)

Each hazard has a ready-made set of images: a cover, one page per lesson, the checklists and the game's address. Open **https://baanrodmai.autobahn.bot/posts** on the phone you post from.

1. Touch and hold each image, in order, and save it (or save them all from a computer).
2. Copy the caption under the set with **คัดลอกข้อความโพสต์**. It already has the hazard page's link, the play link and hashtags.
3. Post them as one album (Facebook), one carousel (Instagram) or one album in a LINE OpenChat, in the same order.

| When | Set | Note |
|---|---|---|
| Early December, then every 2–3 weeks while Air4Thai shows orange or red | `pm25` | Pin it to the page for the season |
| A rain warning, or the week before the monsoon (May) | `flood` | Pair with the FloodWatch link |
| March–April, or after a house fire in the news | `fire` | Keep it about prevention; no photos of real fires |
| Any time of year: a planned power cut in the area, a storm warning, or a quiet week (v1.7.0) | `ready` | 5 of its 8 lessons are still under review (⚠️) and their pages say "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน"; the caption says some advice is international. Post it as it is, or wait for the Thai review ([KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)) |

Rules: post the images as they are (the sources are printed on them); don't crop off the page numbers or the address; if a lesson's text changes, wait for the re-rendered set ([KNOWN_ISSUES #54](KNOWN_ISSUES.md#54-carousel-images-are-committed-and-thai-only)).

### When the dust season starts (v1.5.0, from December)

Nothing needs switching off. The switches end by themselves: the rain warning after `rainWarningUntil` (now 30 Nov 2026) and the news topic after `featuredTopicUntil` (now 15 Nov 2026), so from 1 December the start screen recommends ฝุ่น PM2.5 and features 😷 by itself. Whenever you turn a switch on, give it an end date (the build warns if you don't). To feature the dust topic during a bad week, set `featuredTopic: "air"` with `featuredTopicUntil`.

Links for dust posts:

- **To read,** link `/pm25` (`/en/pm25` in English). It has its own preview (title, description and the dust checklist image), all 12 dust lessons and a ▶ play button.
- **To play,** link `/?mode=dust`: the game opens with dust as the big card. Its preview is the main game's ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)), so put it after the `/pm25` link, or use it where the post already carries a picture.
- Also share `/checklist/dust` and a `/c/d…` challenge.
- **Dust today (v1.10.0):** link `/air`: people tap the colour their app shows (or, since v1.10.1 behind "รู้ตัวเลข?", put in the number), and see what everyone at home and the people at risk should do, by the PCD's colours. It is the most useful dust link on a hazy day ([the drafts](#the-fridge-and-dust-today-v1100)).

> ฝุ่นมาอีกแล้ว 😷 บ้านเราพร้อมสู้ฝุ่นหรือยัง?
>
> เล่น "บ้านรอดไหม?" โหมดฝุ่น PM2.5 แค่ 60 วินาที
> ✅ ปิดหน้าต่าง อุดรอยรั่ว เช็ดถูด้วยผ้าหมาดๆ แทนการกวาด
> ✅ ใส่ N95 ให้แนบหน้า ครอบจมูกถึงใต้คาง
> ✅ เด็ก ผู้สูงอายุ คนท้อง คนมีโรคประจำตัว วันฝุ่นแดงให้อยู่ในบ้าน
> อ้างอิงคำแนะนำจากกรมอนามัย
>
> เช็กค่าฝุ่นวันนี้ในแอป Air4Thai แล้วส่งต่อให้คนที่บ้านนะ 💙
>
> อ่านครบทุกข้อ 👉 https://baanrodmai.autobahn.bot/pm25
> ลองเล่นโหมดฝุ่น 👉 https://baanrodmai.autobahn.bot/?mode=dust

### Fire season (v1.5.0, April, or after a fire in the news)

From April the start screen recommends ไฟไหม้ by itself. After a fire in the news, set `featuredTopic: "fire"` with `featuredTopicUntil` a week or two ahead. Keep posts about prevention and escape; never use photos of a real fire or its victims. Link `/fire` (`/en/fire`) to read, with its own preview, and `/?mode=fire` to play, as for dust.

> ไฟไหม้เริ่มจากเรื่องเล็กๆ ในบ้าน 🔥
>
> เล่น "บ้านรอดไหม?" โหมดไฟไหม้ 60 วินาที
> ✅ ปลั๊กพ่วงต้องมี มอก. และไม่เสียบต่อกันเป็นทอดๆ
> ✅ ไม่ชาร์จมือถือบนที่นอนหรือโซฟา
> ✅ เกิดไฟไหม้ ผ้าชุบน้ำปิดจมูก หมอบต่ำ ออกไปแล้วโทร 199
> อ้างอิงคำแนะนำจาก ปภ. และ กฟน.
>
> เก็บเช็กลิสต์ "บ้านปลอดภัยจากไฟ 10 ข้อ" ไว้ แล้วส่งต่อให้คนที่บ้านนะ 💙
>
> อ่านครบทุกข้อ 👉 https://baanrodmai.autobahn.bot/fire
> ลองเล่นโหมดไฟไหม้ 👉 https://baanrodmai.autobahn.bot/?mode=fire

### Power cuts and home stock (v1.7.0, any time of year)

The power-cut mode (ไฟดับ) is year-round: the start screen never recommends it by itself, so posts are how people find it. Good moments: a planned power cut announced for the area, a storm warning, after a long cut in the news, or any quiet week between seasons. A post about stocking water and food also fits next to the flood posts.

Links for power-cut posts:

- **To read,** link `/ready` (`/en/ready` in English). It has its own preview (title, description and the power-cut checklist image), all 13 lessons, the checklist and ▶ play buttons.
- **To play,** link `/?mode=stock`: the game opens with the power cut as the big card and the 💧 water-and-food topic. Its preview is the main game's ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)), so put it after the `/ready` link.
- Also share `/checklist/stock` ("ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ") and a `/c/s…` challenge, and the `ready` carousel set from `/posts`.
- **During a power cut (v1.10.0):** link `/fridge`, which counts the hours and says how long the fridge, the freezer and cold medicine keep, with the US hours named ([the drafts](#the-fridge-and-dust-today-v1100)).

**Be open about the sources.** 10 of the 13 lessons are ⚠️: most rest on international guidance (the US CDC, Ready.gov, the US Fire Administration) until a Thai review ([KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)). Name the source next to a foreign number, as below, and never present it as a Thai agency's advice.

> ไฟดับทั้งคืน บ้านเราอยู่ได้ไหม? 🔦
>
> เล่น "บ้านรอดไหม?" โหมดไฟดับ เกม 55 วินาที (ในเกมคือ 12 ชั่วโมงที่ไม่มีไฟ)
> ✅ น้ำดื่มสำรองอย่างน้อย 3 ลิตร ต่อคน ต่อวัน ให้พอ 3 วัน
> ✅ ไฟฉายให้ทุกคนในบ้าน เก็บถ่านสำรองไว้ด้วยกัน
> ✅ เครื่องปั่นไฟตั้งนอกบ้านในที่โล่งเท่านั้น
> ✅ ไฟดับ ปิดตู้เย็นไว้ ของสดอยู่ได้ราว 4 ชั่วโมง (คำแนะนำของ CDC สหรัฐฯ)
> อ้างอิงคำแนะนำจาก กรมประชาสัมพันธ์ ปภ. กรมควบคุมโรค และหน่วยงานต่างประเทศ (ข้อที่มาจากต่างประเทศ มีป้ายบอกไว้ในเกม)
>
> เก็บเช็กลิสต์ "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" ไว้ แล้วส่งต่อให้คนที่บ้านนะ 💙
>
> อ่านครบทุกข้อ 👉 https://baanrodmai.autobahn.bot/ready
> ลองเล่นโหมดไฟดับ 👉 https://baanrodmai.autobahn.bot/?mode=stock
> #บ้านรอดไหม #ไฟดับ

**LINE family groups** (attach `public/share/checklist-stock.png`):

> ส่งต่อด้วยความห่วงใย 💛 เช็กลิสต์ "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" น้ำ อาหาร ไฟฉาย วิทยุ ยาประจำตัว เก็บไว้นะ
> ลองเล่นเกม 60 วิได้ที่ 👉 https://baanrodmai.autobahn.bot/?mode=stock

Rules for these posts: no photos of real blackouts, storms or damage; no blame on the electricity authorities or anyone else for a power cut; keep it about getting ready, not about how bad a cut could be.

### The home check and the plan card (v1.8.0, any time of year)

Two tools that end in a picture a family forwards: **"เช็กของจำเป็น"** (`/kit`; its sheet asks "บ้านเราพร้อมแค่ไหน?") works out what this household needs for a flood, a power cut or 3 days at home and how ready it is, and **"แผนครอบครัว"** (`/plan`) makes a card ("การ์ดแผนครอบครัว") with the family's meeting place, contact and who helps whom. Good moments: next to a power-cut or flood post, before a long holiday, at the start of the rains, or when a family group is already talking about stocking up.

- **Links:** since v1.9.0 link **`/kit`** and **`/plan`** (`/en/kit`, `/en/plan`): each has its own preview (the check's or the plan's title and pill) and a button into the tool. `/?open=kit` and `/?open=plan` still open the tool straight away, but their preview is the main game's ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)). The posts below use the new addresses.
- **Names (v1.9.1):** call the tools what the app calls them, **เช็กของจำเป็น** and **แผนครอบครัว** (the card: "การ์ดแผนครอบครัว"), in English "Check your supplies" and "Our family plan". Until v1.9.1 they were also called บ้านเราพร้อมแค่ไหน?, เครื่องเช็กบ้าน, แผนบ้านรอด and การ์ดแผนบ้านรอด; the posts in this file were updated. "บ้านเราพร้อมแค่ไหน?" stays as the question the check answers.
- **Pictures:** use [17-kit.png](screens/17-kit.png), or a kit card or plan card you make yourself **with the form's example text only**. Never post a real family's plan card: it shows where they meet and who to call.
- **Numbers:** the posts below name only the 3 days the check is built on (กรมประชาสัมพันธ์'s 72 hours; ปภ. and กรมอนามัย say 3 days or more). Leave the amounts to the check, which shows each one with its source, and don't add an interval, a 7-day target or an eating order: no agency gives them ([KNOWLEDGE §28.10](KNOWLEDGE.md#2810-what-was-left-out-and-why)).
- **Privacy is part of the message:** the answers and the plan stay on the phone and are never sent. Say so; it is what makes an older relative willing to type a meeting place.

These are Thai drafts for the owner's language check ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).

**Facebook: the home check** (with `17-kit.png` or a sample kit card):

> บ้านเราพร้อมแค่ไหน ถ้าไฟดับหรือต้องอยู่ในบ้าน 3 วัน? 🎒
>
> ตอบแค่ 2 ข้อ: บ้านเรามีกี่คน และมีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำ หรือสัตว์เลี้ยงไหม
> แล้วได้รายการของบ้านเราเอง พร้อมจำนวนที่ควรมี เช่น น้ำดื่มกี่ลิตร ไฟฉายกี่อัน
> ติ๊กของที่มีแล้ว ดูว่าพร้อมกี่เปอร์เซ็นต์ แล้วส่งให้คนในบ้านช่วยกันเติมของที่ยังขาด
> ทุกข้อบอกที่มา (กรมประชาสัมพันธ์ ปภ. กรมอนามัย และบางข้อจากหน่วยงานต่างประเทศ มีป้ายบอกไว้)
>
> 🔒 คำตอบอยู่ในมือถือของคุณเท่านั้น ไม่ส่งไปที่ไหน
>
> เช็กของจำเป็น ฟรี 1 นาที 👉 https://baanrodmai.autobahn.bot/kit
> #บ้านรอดไหม #ไฟดับ #ของตุน

**Facebook: the plan card** (with a sample plan card):

> ถ้าน้ำมา ไฟดับ หรือต้องออกจากบ้านกะทันหัน บ้านเรานัดเจอกันที่ไหน? 📝
>
> ทำ "การ์ดแผนครอบครัว" ของบ้านเรา กรอกสั้นๆ 6 ช่อง:
> ศูนย์พักพิงใกล้บ้าน · จุดนัดพบของครอบครัว · ถ้าพลัดกันจะติดต่อใคร · ใครช่วยใคร · ยาที่ต้องเอาไปด้วย
> กดสร้าง ได้การ์ดพร้อมเบอร์ช่วยเหลือ เซฟไว้ในมือถือทุกคนในบ้าน
>
> 🔒 ข้อความอยู่ในเครื่องของคุณเท่านั้น ไม่ส่งไปที่ไหน และไม่ต้องใส่เลขบัตรประชาชน
>
> ทำการ์ดของบ้านเรา 👉 https://baanrodmai.autobahn.bot/plan
> #บ้านรอดไหม

**LINE family groups** (short, warm, one link each):

> ส่งต่อด้วยความห่วงใย 💛 ลองเช็กกันไหมว่าบ้านเราพร้อมแค่ไหน ถ้าไฟดับ 3 วัน ตอบ 2 ข้อ ได้รายการของบ้านเราเลย 👉 https://baanrodmai.autobahn.bot/kit

> แล้วมาทำการ์ดแผนครอบครัวเก็บไว้ในมือถือทุกคนนะ จะนัดเจอกันที่ไหน ใครดูแลคุณยาย 👉 https://baanrodmai.autobahn.bot/plan

Rules for these posts: never shame a low score ("ยังขาดอีกนิด" is the tone); no lists of what to buy from a shop or a brand; no photos of empty shelves or panic buying.

### The fridge and dust today (v1.10.0)

Two calculators that answer a question of the moment, each with a page and a preview of its own ([KNOWLEDGE §32](KNOWLEDGE.md#32-calculators-the-fridge-dust-today-the-pills-v1100); food by food since v1.11.0, [§33](KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110)). They are worth a post when the moment comes, and not much before. Since v1.11.0 the fridge tool is also the post for **the morning after a power cut**: it says, food by food, what to throw out and what to keep, and its answer stays when the power is back.

- **`/fridge`: "ไฟดับ: ของในตู้เย็นยังกินได้ไหม?"** Post it **during or right after a power cut** (a storm, a planned cut announced for the area, a long cut in the news) and **before the next storm season**, next to the storm guide (`/checklist/storm`) and the power cut's `/ready`. People tap how long the power has been off ("เพิ่งดับ", "3 ชม."… since v1.10.1) and the phone keeps the count, so the link is useful the moment the power goes. Its preview is `og/fridge.png` (the power-cut look). **Name the source next to the hours:** they are the US CDC's and Ready.gov's (since v1.11.0 the food lists FoodSafety.gov's and USDA's, insulin's the US FDA's), and no Thai agency gives them yet ([KNOWN_ISSUES #74](KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only), [#79](KNOWN_ISSUES.md#79-the-fridges-food-lists-rest-on-us-charts)); never present them as Thai advice, and never promise that food is safe ("ราว 4 ชั่วโมง", not "ปลอดภัยแน่นอน"). Whether to post it before a Thai source is found is the owner's call.
- **`/air`: "ฝุ่นวันนี้ บ้านเราต้องทำอะไร?"** Post it **from December** with the dust posts, and on any day the haze is in the news. Its preview is `og/air.png` (the gecko in its mask). The colours are the PCD's notice (the 24-hour average, µg/m³): ฟ้า 0–15.0 · เขียว 15.1–25.0 · เหลือง 25.1–37.5 · ส้ม 37.6–75.0 · แดง 75.1 ขึ้นไป. Quote them only with "ค่าเฉลี่ย 24 ชั่วโมง" and the PCD's name, and say that the tool reads the colour or the number people put in; it doesn't measure the air. Don't use 🟢 🟡 🟠 in the text: they are Unicode 12 and show as empty boxes on older phones ([GUIDELINES rule 64](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **The pills** ("ยาพอกี่วัน?") sit inside the home check (`/kit`), under the daily-medicine line; mention them in a home-check post for families with an older relative on daily medicine.
- **Privacy is part of the message, again:** the time, the reading and who is at home stay on the phone.

These are Thai drafts for the owner's language check ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)). Since v1.10.1 they quote the tools' plain words; a post that quotes a tool should use its words as they are on screen ([KNOWLEDGE §32.10](KNOWLEDGE.md#3210-the-plain-words-pass-v1101)).

**Facebook: the fridge** (during a power cut, or before the storm season; with a screenshot of the tool or the preview):

> ไฟดับ! ของในตู้เย็นยังกินได้ไหม? 🥛
>
> แตะว่าไฟดับมานานเท่าไร (ไฟเพิ่งดับ ก็แตะ "เพิ่งดับ" แอปจะนับเวลาต่อให้)
> แล้วดูว่าของในตู้เย็น ช่องแช่แข็ง และยาที่ต้องแช่เย็น เหลือเวลาอีกราวกี่ชั่วโมง
> ✅ เปิดตู้เย็นให้น้อยที่สุด ความเย็นจะอยู่ได้นานขึ้น
> ✅ ห้ามชิมเพื่อดูว่าอาหารเสียไหม ไม่แน่ใจให้ทิ้ง
> ตู้เย็นที่ไม่เปิดประตู เก็บอาหารได้ราว 4 ชั่วโมง ตามคำแนะนำของ CDC สหรัฐฯ (ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานไทย ในเครื่องมือมีป้ายบอกไว้)
>
> 🔒 เวลาที่นับอยู่ในมือถือของคุณเท่านั้น ไม่ส่งไปที่ไหน
>
> เช็กตู้เย็นบ้านเรา 👉 https://baanrodmai.autobahn.bot/fridge
> #บ้านรอดไหม #ไฟดับ

**LINE family groups:**

> ไฟดับอยู่ไหม? 💛 แตะว่าไฟดับมานานเท่าไร แล้วดูว่าของในตู้เย็นยังกินได้อีกราวกี่ชั่วโมง 👉 https://baanrodmai.autobahn.bot/fridge

**Facebook: the fridge, food by food** (v1.11.0; the morning after a power cut, or with a screenshot of the lists at "6 ชม."). Quote the tool's own lines, and keep "ไม่แน่ใจให้ทิ้ง":

> ไฟมาแล้ว ของในตู้เย็นอะไรต้องทิ้ง อะไรเก็บได้? 🥛
>
> ตู้เย็นที่ไม่เปิดประตู เก็บของสดได้ราว 4 ชั่วโมง ถ้าไฟดับนานกว่านั้น
> ❌ ทิ้ง: เนื้อสัตว์ ปลา กุ้ง · ลูกชิ้น ไส้กรอก · กับข้าวที่เหลือ · ข้าวสุก เส้นสด · ไข่ · นม โยเกิร์ต · นมผงที่ชงแล้ว · ผักผลไม้ที่หั่นแล้ว · ขนมครีม สังขยา
> ✅ เก็บได้ ถ้าไม่ขึ้นรา ไม่มีกลิ่น สี หรือเนื้อผิดปกติ: ผักผลไม้ทั้งลูก · ขนมปัง · เนย ชีสแข็ง · ซีอิ๊ว ซอส แยม
> ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง และห้ามชิมเพื่อดูว่าเสียไหม
> (ตามแนวทางของหน่วยงานสหรัฐฯ ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานรัฐของไทย)
>
> แตะว่าไฟดับมานานเท่าไร แล้วดูทีละอย่าง 👉 https://baanrodmai.autobahn.bot/fridge
> #บ้านรอดไหม #ไฟดับ

**LINE family groups: medicine** (v1.11.0; for families with someone on insulin; post it with the picture of the tool, not alone):

> ไฟดับ ยาที่ต้องแช่เย็น อย่าเพิ่งทิ้ง 💛 อินซูลินเก็บนอกตู้เย็นได้ถึง 28 วัน ถ้าไม่ร้อนเกิน 30°C ไม่โดนแดด และห้ามแช่แข็ง (องค์การอาหารและยาสหรัฐฯ) ยาอื่นให้ดูฉลาก ถ้าไม่แน่ใจถามเภสัชกร เช็กได้ที่ 👉 https://baanrodmai.autobahn.bot/fridge

Rules for the two new drafts: post them only after the Thai reviews of the food list and the medicine lines, or with the US source named as above ([ROADMAP L10](ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)); never write "ทิ้งยา" or any number for insulin above 30 °C; don't add น้ำปลา, กะทิ or anything else the tool leaves out; and never show a real person's medicine or a spoiled fridge.

**Facebook: dust today** (from December, or a hazy day; with the preview or a screenshot of the colours):

> ฝุ่นวันนี้ บ้านเราต้องทำอะไร? 😷
>
> แตะสีค่าฝุ่นที่เห็นในแอป (หรือใส่ตัวเลข PM2.5 หรือ AQI จากแอปของไทย)
> แล้วได้คำแนะนำสำหรับทุกคนในบ้าน และสำหรับเด็กเล็ก ผู้สูงอายุ คนท้อง คนมีโรคประจำตัว
>
> สีตามประกาศกรมควบคุมมลพิษ (PM2.5 ค่าเฉลี่ย 24 ชั่วโมง มคก./ลบ.ม.)
> ฟ้า 0–15.0 · เขียว 15.1–25.0 · เหลือง 25.1–37.5 · ส้ม 37.6–75.0 · แดง 75.1 ขึ้นไป
> ✅ สีส้ม: ใส่หน้ากากกันฝุ่น PM2.5 ทุกครั้งที่ออกนอกบ้าน
> ✅ สีแดง: งดทำกิจกรรมนอกบ้าน
>
> 🔒 คำตอบอยู่ในมือถือของคุณเท่านั้น ไม่ส่งไปที่ไหน
>
> เช็กฝุ่นวันนี้ 👉 https://baanrodmai.autobahn.bot/air
> #บ้านรอดไหม #ฝุ่นPM25

**LINE family groups:**

> ฝุ่นวันนี้สีอะไร? 😷 แตะสีที่เห็นในแอป แล้วดูว่าคุณตา คุณยาย เด็กๆ ในบ้านต้องทำอะไร 👉 https://baanrodmai.autobahn.bot/air

Rules for these posts: no photos of real haze victims, hospital scenes or spoiled food; no blame on the electricity authorities or anyone else for a cut or for the dust; the tool's numbers only, each with its agency, and nothing of your own (no "safe for 6 hours if…", no brand of mask or purifier); for the fridge, the US source named every time.

### Masks, all tools and six more tools (v1.12.0–v1.13.0)

Each has a page and a preview of its own ([KNOWLEDGE §34](KNOWLEDGE.md#34-masks-all-tools-and-six-more-tools-v1111v1130)). Post each when its moment comes; quote the tool's words as they are on screen, each number with its agency, and nothing of your own.

- **`/tools` ("🧰 เครื่องมือทั้งหมด")** is the one link to pin: in a LINE OpenChat's notes, a Facebook page's pinned post, a community's LINE OA menu. It carries every tool, DDPM's steps to turn on emergency alerts, and the agencies' own pages.
- **`/safe` ("💬 ส่งข่าวว่าปลอดภัย")**: before the storm season, and **at once** when an alert is out (a storm, a flash flood, a quake felt in Bangkok). It is the tool most likely to be used on a bad day; try it on an Android and an iPhone first ([06 row 83](06-test-checklist.md)).
- **`/bag` and `/info`**: any weekend, for "prepare with your parents" posts; the card is the one to suggest for an older relative on daily medicine.
- **`/tank` ("🚰 ล้างถังพักน้ำ")**: as the water goes down, with the after-the-flood guide (`/checklist/return`); name the MWA and the DDC with the dose.
- **`/hot` ("🌡️ ร้อนวันนี้")**: in the hot season (March to May), on days the TMD announces "อันตราย"; **only after a person has opened the TMD's heat-index page** ([KNOWN_ISSUES #90](KNOWN_ISSUES.md#90-heat-today-rests-on-news-reports-quoting-the-agencies)).
- **`/water`**: during a long power cut or a water cut, and with the home-check posts.
- **`/mask`**: from December with the dust posts, after a flood with the clean-up, and when a factory fire is in the news (its answer is "move away", not a mask). Only after a doctor's read of the children's, pregnancy and heart or lung lines ([#87](KNOWN_ISSUES.md#87-the-mask-tools-lines-for-children-pregnancy-and-heart-or-lung-disease-need-a-doctors-read)).

These are Thai drafts for the owner's language check ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)).

**LINE family groups: "I'm safe"** (when an alert is out):

> ทุกคนปลอดภัยดีไหม? 💛 กดสถานะของตัวเอง แล้วส่งข้อความเดียวกลับมาในกลุ่มนี้ได้เลย 👉 https://baanrodmai.autobahn.bot/safe
> (ถ้าต้องการความช่วยเหลือ โทร 1784 หรือ 1669 ก่อนนะ)

**Facebook: the bag and the card** (a weekend; with the preview or a screenshot of the bag's list):

> วันหยุดนี้ ชวนพ่อแม่จัดกระเป๋าฉุกเฉินกันไหม? 🧳
>
> กระเป๋าใบเดียวที่หยิบไปได้ทันทีเมื่อต้องออกจากบ้าน: น้ำและอาหารแห้ง ไฟฉาย ชุดปฐมพยาบาล สำเนาเอกสารในถุงกันน้ำ ยาประจำตัว…
> ติ๊กของที่มีแล้ว แอปบอกว่ายังขาดอะไร และส่งรายการให้คนในบ้านได้
> 🆔 คนที่ทานยาประจำ ทำ "บัตรข้อมูลฉุกเฉิน" ไว้ด้วย: ยา โรคประจำตัว แพ้ยา เบอร์ญาติ เก็บเป็นรูปในมือถือ
>
> 🔒 สิ่งที่พิมพ์และติ๊ก อยู่ในมือถือของคุณเท่านั้น
>
> จัดกระเป๋า 👉 https://baanrodmai.autobahn.bot/bag
> ทำบัตร 👉 https://baanrodmai.autobahn.bot/info
> #บ้านรอดไหม #กระเป๋าฉุกเฉิน

**Facebook: the tank** (as the water goes down):

> น้ำลดแล้ว ถังพักน้ำที่น้ำท่วมถึง ต้องล้างก่อนใช้ 🚰
>
> ใส่ขนาดถังและชนิดคลอรีน แอปบอกว่าต้องใช้เท่าไร พร้อมขั้นตอนทีละข้อ
> เช่น ถัง 1,000 ลิตร ใช้คลอรีนน้ำ 5% ราว 100 มล. (ตาม กปน. และกรมควบคุมโรค)
> ⚠️ ห้ามลงไปในถัง อาจขาดอากาศหายใจ · ใส่ถุงมือยาง · ห้ามผสมกับน้ำยาล้างห้องน้ำ
>
> คำนวณคลอรีน 👉 https://baanrodmai.autobahn.bot/tank
> #บ้านรอดไหม #หลังน้ำลด

Rules for these posts: as above; no photos of real damage or of people hurt; "I'm safe" asks people to send it to the family themselves, never to post where they are in public.

### When something happens: the 5-minute playbook

Hazards don't keep to a calendar: a quake abroad, a storm warning, a heatwave or a flash flood can be the topic of the day without notice. Every hazard has a "what to do" guide, a picture and a page, so the answer takes minutes, not a release ([KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)).

| Guide id | Topic | Its picture link (preview = the guide) | Its page |
|---|---|---|---|
| `prepare` | 🌊 น้ำท่วม: ก่อนน้ำมา | `/checklist/prepare` | `/flood` |
| `return` | 🧹 น้ำท่วม: หลังน้ำลด | `/checklist/return` | `/flood` |
| `landslide` | ⛰️ น้ำป่า ดินถล่ม | `/checklist/landslide` | `/landslide` |
| `storm` | ⛈️ พายุ ลมแรง ฟ้าผ่า | `/checklist/storm` | `/storm` |
| `quake` | 🏚️ แผ่นดินไหว | `/checklist/quake` | `/quake` |
| `fire` | 🔥 ไฟไหม้ | `/checklist/fire` | `/fire` |
| `stock` | 🔦 ไฟดับ | `/checklist/stock` | `/ready` |
| `heat` | 🌡️ อากาศร้อนจัด | `/checklist/heat` | `/heat` |
| `dust` | 😷 ฝุ่น PM2.5 | `/checklist/dust` | `/pm25` |

1. **Put the guide on the start screen.** In `public/content/config.json` (on GitHub: the pencil, then *Commit*), set the alert with an end date, a Bangkok date, that day included, usually the last day of the agency's warning:

   ```json
   "alert": { "guide": "quake", "until": "2026-11-02" },
   ```

   Commit to `main`. Cloudflare rebuilds and the card "ช่วงนี้: แผ่นดินไหว · ดูว่าต้องทำอะไร" is live in a minute or two, at the top of the start screen and first in the picker. If the build fails (an id that isn't in the table, a date that isn't real), the site stays as it was; fix the line. Check the build's `start` line, which ends with "· alert quake until …".
2. **Get the picture and the caption.** On your phone, open https://baanrodmai.autobahn.bot/posts, scroll to "รูป "ต้องทำอะไร" ทุกภัย", press and hold the guide's picture to save it, and tap **คัดลอกข้อความโพสต์** under it. The caption already links `/checklist/<id>`.
3. **Post.** Attach the picture and paste the caption, or write your own line first. Link `/checklist/<id>` (its preview is the guide's picture and title) or the hazard page (`/quake`: every line with its sources). Don't link `/?open=guide` when the preview matters: it previews as the main game ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)). If the news names an agency warning, quote it as reported, with the outlet and date.
4. **Clear the alert after.** The card disappears by itself after `until`, but every build warns until you set it back: `"alert": { "guide": null, "until": null }`, or a new date if the warning is extended ([KNOWN_ISSUES #64](KNOWN_ISSUES.md#64-the-alert-must-be-cleared-or-renewed-by-hand)). One alert at a time: for a second topic, post its `/checklist/<id>` link without the alert.

**Now (19 Oct 2026):** `landslide` until `2026-10-25`, for ปภ.'s warning of heavy rain, flash floods and mudslides on 18–25 Oct (Thairath, 18 Oct 2026). On 26 Oct set it back to `null` or to the next topic.

**Rules for these posts:** the picture and the guide carry the advice, so add no numbers or tips of your own; the guides' ⚠️ lines say on the page that they are under review (the four new guides rest on news reports quoting the agencies until a Thai review, [KNOWN_ISSUES #60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)); no photos of real damage, no death tolls, no blame; for a quake abroad, say where it happened and keep the post about getting ready at home. **A power cut or a hazy day?** Add the calculator to the guide: `/fridge` with the storm or power-cut guide, `/air` with the dust guide ([above](#the-fridge-and-dust-today-v1100)). **No guide for it yet?** Post the closest one or the home check (`/kit`), and ask for a new guide ([ROADMAP S2](ROADMAP.md#s2-when-something-is-in-the-news-the-alert-and-the-guide-posts)).

### Your own post: the tools-first relaunch (v1.9.0, draft)

**A draft for the owner's language check** ([ROADMAP L5](ROADMAP.md#l5-second-native-reader-for-the-thai-copy)), in the owner's voice, announcing that the app is now tools first. It follows the v1.8.1 post's lessons below: free, no app, no sign-up, **not a government site**, every line sourced, nothing typed leaves the phone, neutral politeness (no ครับ or ค่ะ, so the owner adds their own). It names no numbers, so it can't drift from the guides. Both links preview as the main page, whose preview since v1.9.0 reads "เตรียมบ้านให้พร้อมทุกภัย / ต้องทำอะไร เตรียมอะไร"; attach [20-start-tools.png](screens/20-start-tools.png) or a guide's picture from `/posts`.

**Facebook (personal post):**

> ช่วงนี้เห็นคนตื่นตัวเรื่องรับมือภัยพิบัติกันเยอะ ทั้งน้ำท่วม น้ำป่า พายุ แผ่นดินไหว อากาศร้อน
> แต่เรื่องไหนจะมาเมื่อไร ไม่มีใครรู้ เลยปรับเว็บ "บ้านรอดไหม?" ที่เคยทำไว้ ให้ใช้ได้กับทุกภัย 🦎
>
> เปิดมาเจอเครื่องมือก่อนเลย
> 📋 ต้องทำอะไร เมื่อเกิดภัย: เลือกเรื่องที่อยากรู้ อ่านสั้นๆ ว่าต้องทำอะไร แล้วส่งเป็นรูปให้คนที่บ้านได้
> 🎒 เช็กของจำเป็น: บอกว่าบ้านมีกี่คน มีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำ หรือสัตว์เลี้ยงไหม แล้วได้รายการของที่บ้านเราควรมี
> 📝 แผนครอบครัว: จุดนัดพบ ใครติดต่อใคร ใครช่วยใคร ทำเป็นการ์ดเซฟไว้ในมือถือทุกคน
> 🎮 ส่วนเกมยังอยู่ ใครอยากจำง่ายๆ ก็เล่นได้ ไม่เล่นก็ใช้ทุกอย่างได้ครบ
>
> ✅ ใช้ฟรี ไม่ต้องโหลดแอป ไม่ต้องสมัคร
> ✅ ไม่ใช่เว็บของหน่วยงานรัฐ แต่ทุกข้อบอกที่มา ส่วนใหญ่จากหน่วยงานไทย ข้อที่ยังรอตรวจทานก็ติดป้ายไว้
> 🔒 สิ่งที่กรอกอยู่ในมือถือเราเท่านั้น ไม่ส่งไปที่ไหน
>
> ดูว่าต้องทำอะไร 👉 https://baanrodmai.autobahn.bot/?open=guide
> หน้าแรก 👉 https://baanrodmai.autobahn.bot
>
> ฝากลองใช้ดูหน่อยนะ อยากให้เพิ่มเรื่องไหน บอกกันได้เลย 🙏
> #บ้านรอดไหม #เตรียมพร้อมรับมือภัยพิบัติ

**LINE family group** (short, one link):

> ลองเปิดดูกันนะ เว็บที่เราทำเอง ใช้ฟรี ไม่ต้องสมัคร มีว่าต้องทำอะไรถ้าเกิดน้ำท่วม น้ำป่า พายุ แผ่นดินไหว อากาศร้อน และเช็กของจำเป็นในบ้านได้ด้วย
> 👉 https://baanrodmai.autobahn.bot

Before posting: read it aloud in your own words; if a topic is in the news that day, name it in the first line and link its `/checklist/<id>` too (the playbook above).

### Your own post: "ช่วงนี้เห็นคนตื่นตัว…" (v1.8.1, during the rain warning of 18–25 Oct 2026)

Written in the owner's voice, for the owner's own Facebook, LINE family groups and X/Threads. It rides two things people are talking about on 19 Oct 2026: the "ถุงยังชีพ 72 ชั่วโมง" posts going round (the owner saw one; the term is the title of กรมประชาสัมพันธ์'s checklist), and ปภ.'s heavy-rain warning, reported by Thairath on 18 Oct 2026 as "ปภ. ประสาน 35 จังหวัดและ กทม. เตรียมรับมือฝนตกหนัก เสี่ยงน้ำท่วม 18-25 ต.ค.". We could not measure how big the conversation is; no social-media data was available.

How these were checked:

- **Every claim against the app.** Free; no app to install; no sign-up. The check asks how many people live in the home and who (small children, older or bedridden people, daily medicine, pets), lists what to keep with amounts for that household, and turns ticks into a percentage and a card. The plan card holds the meeting place, contact, who helps whom and medicine, with 1784, 199, 1669, 1555, 1130 and 1129. What people type and tick stays on the phone. Every tip names its source, and tips still under review are marked.
- **A reader test, simulated, not real people.** The drafts were read as three readers: an aunt of 62 in a LINE family group, a 28-year-old scrolling Facebook and X, and a reader who checks every claim. The fixes it led to:
  - Say plainly that the site is free, made by the owner, and **not a government site**. Next to "ปภ." it read as an official tool, and an unknown `.bot` link with "answer 2 questions" looks like a quiz scam to an older reader.
  - Quote the ปภ. warning as reported (35 provinces and Bangkok), not "ปภ. warns of floods".
  - "มีเบอร์ฉุกเฉินให้ครบ" became the actual numbers.
  - "ตุนของ" became "เตรียมถุงยังชีพ", because ตุน can read as hoarding (กักตุน).
  - "ทำทิ้งไว้" became "เคยทำไว้", because "ทิ้ง" sounded abandoned.
  - "กี่ %" became "กี่เปอร์เซ็นต์", and "เท่าไหร่" became "เท่าไร".
- **No numbers beyond the app's own.** The posts name no amounts. The check shows each amount with its source, so the posts can't drift from it.
- **Neutral politeness.** The text uses no ครับ or ค่ะ, so the owner can add their own; "ฝากลองดูหน่อยนะ 🙏" keeps it warm for elders.

Before posting:

- **The rain line goes stale after 25 Oct.** Send the LINE version by about 20–21 Oct, and after the 25th drop the ปภ. sentence (the rest still stands).
- **Since v1.9.1 these posts link `/kit`,** which has a preview of its own (they linked `/?open=kit`, which previews as the main game, [KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)), and call the tools by their one name, เช็กของจำเป็น and การ์ดแผนครอบครัว. The rain sentence also has a tools-first successor ([the relaunch post](#your-own-post-the-tools-first-relaunch-v190-draft)).
- **Attach a picture** anyway: [19-kit-card.png](screens/19-kit-card.png), a sample kit card for an example household, says more in a feed than a preview.
- **Check that counting works** before a big push, so `kit_open` → `kit_share` after the post can be seen ([05-metrics](05-metrics.md)).

**Facebook (personal post, with `19-kit-card.png`):**

> ช่วงนี้เห็นคนตื่นตัวเรื่องรับมือภัยพิบัติกันเยอะ ทั้งแชร์วิธีเตรียมถุงยังชีพ 72 ชั่วโมง และ ปภ. ก็เพิ่งประสาน 35 จังหวัดและ กทม. ให้เตรียมรับมือฝนตกหนัก เสี่ยงน้ำท่วม 18–25 ต.ค. นี้
> เลยอยากชวนไปลองเว็บที่เคยทำไว้ก่อนหน้านี้ ใช้ฟรี ไม่ต้องโหลดแอป ไม่ต้องสมัคร 🦎
>
> "บ้านรอดไหม?" มี 2 อย่างที่อยากให้ลองเป็นพิเศษ
> 🎒 เช็กของจำเป็น: บอกว่าบ้านมีกี่คน มีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำ หรือสัตว์เลี้ยงไหม แล้วจะได้รายการของจำเป็น พร้อมจำนวนที่คำนวณตามบ้านเรา เช่น น้ำดื่มกี่ลิตร ไฟฉายกี่อัน ติ๊กของที่มีแล้ว จะรู้ว่าพร้อมกี่เปอร์เซ็นต์
> 📝 การ์ดแผนครอบครัว: กรอกจุดนัดพบ คนที่ต้องโทรหา ใครดูแลใคร ยาประจำตัว แล้วได้การ์ดไว้ส่งให้ทุกคนในบ้านเซฟ ในการ์ดมีเบอร์ 1784 · 199 · 1669 ด้วย
> 🎮 และเกม 60 วินาที หาจุดเสี่ยงในบ้าน: ก่อนน้ำมา หลังน้ำลด ฝุ่น PM2.5 ไฟไหม้ ไฟดับ
>
> ✅ ไม่ใช่เว็บของหน่วยงานรัฐ แต่ทุกข้อบอกที่มาว่ามาจากไหน ข้อที่ยังรอตรวจทานก็ติดป้ายไว้
> 🔒 สิ่งที่กรอกและติ๊กอยู่ในมือถือเราเท่านั้น ไม่ส่งไปที่ไหน
>
> เช็กของจำเป็น 👉 https://baanrodmai.autobahn.bot/kit
> เล่นเกม 👉 https://baanrodmai.autobahn.bot
>
> ฝากลองดูหน่อยนะ เจออะไรแปลก ๆ หรืออยากให้เพิ่มเรื่องไหน บอกกันได้เลย 🙏
> #บ้านรอดไหม #เตรียมพร้อมรับมือภัยพิบัติ #ถุงยังชีพ

**LINE family group** (send it yourself; one link; by about 20–21 Oct):

> ปภ. ประสาน 35 จังหวัดและ กทม. ให้เตรียมรับมือฝนตกหนัก เสี่ยงน้ำท่วม ถึง 25 ต.ค. นี้ 🌧️
> ลองเช็กกันหน่อยว่าบ้านเรามีของจำเป็นครบหรือยัง
> เป็นเว็บที่เราทำเองนะ ใช้ฟรี บอกจำนวนคนในบ้าน กับว่ามีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำไหม แล้วจะรู้ว่าควรมีน้ำ อาหาร ยา และอื่นๆ เท่าไร
> 👉 https://baanrodmai.autobahn.bot/kit
> ไม่ต้องโหลดแอป ไม่ต้องสมัคร ที่ติ๊กไว้อยู่ในมือถือเราเท่านั้น
> เช็กเสร็จแล้วส่งการ์ดกลับมาในกลุ่มด้วยนะ ว่าบ้านใครพร้อมกี่เปอร์เซ็นต์ 😊

**X / Threads:**

> ช่วงนี้คนแชร์เรื่องเตรียมถุงยังชีพ 72 ชม. กันเยอะ เลยปัดฝุ่นเว็บฟรีที่เคยทำไว้ 🦎
> ใส่จำนวนคนในบ้าน + ติ๊กว่ามีใครบ้าง → ได้รายการของจำเป็น พร้อมจำนวนตามบ้านเรา
> ไม่ต้องสมัคร ที่กรอกอยู่ในเครื่องเรา
> 👉 https://baanrodmai.autobahn.bot/kit
> #เตรียมพร้อมรับมือภัยพิบัติ

**Facebook album or Instagram carousel:** use the flood set from `/posts` (its caption is ready there). Its link `/flood` has its own preview and, since v1.8.1, links the check and the plan card.

## 3. Outreach (who to send it to, and the ask)

Give every partner the same **ready-to-forward kit**:

- the checklist images for the hazard (flood: Prepare and Return; dust; fire; power cut; since v1.9.0 also flash floods and landslides, storms, earthquakes and extreme heat, all on `/posts`)
- a result card
- the two-line message above
- the link
- this sentence: *"ทีมอาสาทำ ไม่มีโฆษณา ไม่เก็บข้อมูลส่วนตัว อ้างอิงหน่วยงานรัฐ"*

| Who | Why | Ask |
|---|---|---|
| **Community pages:** village, condo and moo-baan pages; juristic offices (นิติบุคคล) | Trusted, hyper-local, many older followers | Pin the checklist image; share the daily house in the evening |
| **District offices** (Bangkok's 50 สำนักงานเขต) and **อบต. / เทศบาล** | They run LINE groups and shelters | Post the checklist in their LINE OA or groups; print A4 checklists for shelters |
| **อสม.** (about 1.07M village health volunteers, [07-audience](07-audience.md#32-อสม-village-health-volunteers)) through provincial health offices | Already forward health info in LINE groups | Forward the Return checklist (leptospirosis, food, fever) |
| **Schools and education offices** | Teachers' LINE groups reach parents fast | "Play with your parents" homework, using the challenge link |
| **Volunteer and rescue foundations, relief drives** | Hand out relief bags | Print the checklist (add a QR code to your link) to go in relief bags |
| **Weather and flood info pages** | Fastest reach in this flood | Offer it as a free public-good tool; let them post with their own commentary |
| **Agencies** (ปภ., กรมควบคุมโรค, กรมอนามัย, กฟน., กฟภ. PR teams) | Credibility; an expert voice raises trust | Ask for a quick content review and a re-share; credit them |
| **Creators:** home/DIY, parenting, pets, caring for elderly parents | Natural fit with specific items (pets, grandma's plan) | Play on camera; no paid placement needed |
| **Shelters (ศูนย์พักพิง)** | Families waiting with phones and time | A poster with the link and QR at the help desk; kids play with parents |

## 4. Tone and safety rules for anyone posting

- **Lead with usefulness.** Never joke about a specific flooded community or a sad event. Humour belongs only to the game's own moments (the gecko, the rope).
- **No AI-generated flood photos** and no real damage photos. Use the game's illustrations and screenshots.
- **No politics, no blame,** no royal or religious references. Thank rescuers and volunteers.
- **Be transparent.** If someone questions a tip:
  1. Check it against the source in `sources.json`.
  2. Fix the JSON.
  3. Push (the build re-checks everything).
  4. Post a short note starting **"UPDATE:"**. Never edit silently.
- **Keep links to official help visible:** 1784 · 1669 · 1555 · 1130 · 1129. Mental health: 1323.

## 5. Relaunch every rainy season

The game is evergreen: content is in JSON, dates are generic and the daily house changes itself. Run this loop each year:

| When | What |
|---|---|
| **April–May (pre-monsoon)** | **Content refresh:** re-check every source and hotline, then update `sources.json` dates and the help-list note. Bump `config.houseVersion` so daily houses reshuffle. Re-render images (`npm run images`). |
| **May (season opener)** | **"เช็กบ้านก่อนหน้าฝน"**: Prepare default. Release one new room (ห้องน้ำ → ห้องนอน → โรงรถ) as the news hook. The content for these rooms is already in `items.json`. |
| **August–October (central and north peak)** | Prepare default during warnings; Return as water recedes (same switch as this year). |
| **November–December (southern monsoon)** | A push to southern pages and provinces. PEA 1129 covers the south, so put it first in posts. Link `/?mode=prepare` (or `/flood`): the rain switch ends on 30 Nov and the season calendar has no southern floods, so from December the plain `/` recommends dust ([KNOWN_ISSUES #47](KNOWN_ISSUES.md#47-the-season-calendar-is-editorial)). |
| **Off-season** | The checklist pages stay up and are useful year-round. Share the yearly "what Thais learned" stats. |
| **TODO (v1.11.0): a regional posting calendar** | One table of which guide to post where and when, by region: the South's floods in November–December, the North in August–September, the Central region and Bangkok's edges in September–October (the audience research's flood months), and the app's own season calendar for dust (December–March) and fire (April), so that southern pages get the flood guide while Bangkok gets dust ([07-audience §8](07-audience.md#8-design-and-content-implications-in-priority-order), [KNOWN_ISSUES #84](KNOWN_ISSUES.md#84-ideas-from-the-audience-research-not-built-yet)). Not written yet. |

When your forecast app is ready, set `forecastStatusUrl` and the recommended mode will follow live rain warnings with no manual switching.

## 6. Launch-day checklist

- [x] Domain live (https://baanrodmai.autobahn.bot); `config.json → siteUrl` set; `npm run images` re-rendered with the domain and committed (6 Oct 2026)
- [ ] Sitemap (44 addresses since v1.13.0) submitted in Google Search Console and Bing Webmaster Tools, and the sixteen hazard pages and `/kit`, `/plan`, `/fridge`, `/air`, `/mask`, `/tools`, `/hot`, `/water`, `/tank`, `/info`, `/safe`, `/bag` (with their twins) submitted for indexing; `/`, `/learn` and `/pm25` JSON-LD pass the Rich Results Test (since v1.9.2 with a publisher)
- [ ] `forecastAppUrl` set (the "เช็กระดับน้ำล่วงหน้า" button appears)
- [ ] Preview checked in Facebook Sharing Debugger and in a LINE chat for `/`, `/c/p8?h=…`, `/checklist/prepare`
- [ ] Hazard pages `/flood`, `/pm25`, `/fire` and `/ready` (and `/en/…`) open, their ▶ button opens the right mode, and their previews show their own title and checklist image in Facebook and LINE; the same for the guide pages `/landslide`, `/storm`, `/quake`, `/heat` and for `/kit`, `/plan` and a `/checklist/<id>` of a new guide
- [ ] Switch end dates set: the build's `start` line shows the mode and topic you expect today, with no warning about a missing or past end date
- [ ] Web Analytics enabled; `EVENTS` binding present; Fail open on
- [ ] Real-phone pass of [06-test-checklist.md](06-test-checklist.md) in LINE, Facebook and TikTok in-app browsers
- [ ] A content reviewer has looked at the ⚠️ flags in [01-safety-content.md](01-safety-content.md), including the 10 power-cut lessons before the `ready` set is posted widely, and the home check's ⚠️ lines before the check is promoted ([KNOWN_ISSUES #57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance))
- [ ] `/kit` and `/plan` (and their buttons into the tools) tried on a phone, inside LINE and in the phone's browser (rows 46–48 of [06-test-checklist.md](06-test-checklist.md)); a guide closes with the phone's back button, and sharing a result to LINE keeps it (rows 55–56, v1.9.1); Back inside a round pauses it, and a result card can be read in the chat (rows 61–62, v1.9.2)
- [ ] The start screen's hub, the alert card, the guide picker inside LINE and print from Chrome or Safari tried on a phone (rows 51–54)
- [ ] The alert set for what is in the news, or cleared: the build's `start` line shows it, with no warning about a past end date
- [ ] Posts scheduled for the 06:00 / 12:00 / 20:00 slots; partner kit sent

# Launch kit

**The one message:** *"เล่น 60 วิ รู้วิธีจริง แล้วส่งต่อให้คนที่บ้าน"*: play for a minute, learn the real action, pass it on to family. The game is the hook; the forwarded checklist image and the challenge link do the spreading.

**Since v1.9.0, tools first:** *"รู้ว่าต้องทำอะไร เตรียมอะไร แล้วส่งต่อให้คนที่บ้าน"*. The app opens on what to do for any hazard (nine short guides), what to keep (the home check) and the family plan; the game is the optional way to remember. When something is in the news, post that hazard's guide ([the 5-minute playbook](#when-something-happens-the-5-minute-playbook)).

What the research says about Thai audiences:

- LINE has about 56M monthly users in Thailand, TikTok about 57M adults and Facebook about 52M.
- 78% of web traffic is on mobile, and 74% of mobiles run Android.
- Older family members mostly *forward* bright, warm pictures. They do it early in the morning (about 04:00–06:30) and before bed.
- In this flood, coping humour spread fastest (*น้ำรอการระบาย*).
- AI-generated flood images, mocking victims or rescuers, and politics all drew backlash.

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

Two tools that end in a picture a family forwards: **"บ้านเราพร้อมแค่ไหน?"** (`/?open=kit`) works out what this household needs for a flood, a power cut or 3 days at home and how ready it is, and **"แผนบ้านรอดของบ้านเรา"** (`/?open=plan`) makes a card with the family's meeting place, contact and who helps whom. Good moments: next to a power-cut or flood post, before a long holiday, at the start of the rains, or when a family group is already talking about stocking up.

- **Links:** since v1.9.0 link **`/kit`** and **`/plan`** (`/en/kit`, `/en/plan`): each has its own preview (the check's or the plan's title and pill) and a button into the tool. `/?open=kit` and `/?open=plan` still open the tool straight away, but their preview is the main game's ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)). The posts below use the new addresses.
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
> เช็กฟรี 1 นาที 👉 https://baanrodmai.autobahn.bot/kit
> #บ้านรอดไหม #ไฟดับ #ของตุน

**Facebook: the plan card** (with a sample plan card):

> ถ้าน้ำมา ไฟดับ หรือต้องออกจากบ้านกะทันหัน บ้านเรานัดเจอกันที่ไหน? 📝
>
> ทำ "การ์ดแผนบ้านรอด" ของบ้านเรา กรอกสั้นๆ 6 ช่อง:
> ศูนย์พักพิงใกล้บ้าน · จุดนัดพบของครอบครัว · ถ้าพลัดกันจะติดต่อใคร · ใครช่วยใคร · ยาที่ต้องเอาไปด้วย
> กดสร้าง ได้การ์ดพร้อมเบอร์ช่วยเหลือ เซฟไว้ในมือถือทุกคนในบ้าน
>
> 🔒 ข้อความอยู่ในเครื่องของคุณเท่านั้น ไม่ส่งไปที่ไหน และไม่ต้องใส่เลขบัตรประชาชน
>
> ทำการ์ดของบ้านเรา 👉 https://baanrodmai.autobahn.bot/plan
> #บ้านรอดไหม

**LINE family groups** (short, warm, one link each):

> ส่งต่อด้วยความห่วงใย 💛 ลองเช็กกันไหมว่าบ้านเราพร้อมแค่ไหน ถ้าไฟดับ 3 วัน ตอบ 2 ข้อ ได้รายการของบ้านเราเลย 👉 https://baanrodmai.autobahn.bot/kit

> แล้วมาทำการ์ดแผนบ้านรอดเก็บไว้ในมือถือทุกคนนะ จะนัดเจอกันที่ไหน ใครดูแลคุณยาย 👉 https://baanrodmai.autobahn.bot/plan

Rules for these posts: never shame a low score ("ยังขาดอีกนิด" is the tone); no lists of what to buy from a shop or a brand; no photos of empty shelves or panic buying.

### When something happens: the 5-minute playbook

Hazards don't keep to a calendar: a quake abroad, a storm warning, a heatwave or a flash flood can be the topic of the day without notice. Every hazard has a "what to do" guide, a picture and a page, so the answer takes minutes, not a release ([KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)).

| Guide id | Topic | Its picture link (preview = the guide) | Its page |
|---|---|---|---|
| `prepare` | 🌊 น้ำกำลังมา | `/checklist/prepare` | `/flood` |
| `landslide` | ⛰️ น้ำป่า ดินถล่ม | `/checklist/landslide` | `/landslide` |
| `storm` | ⛈️ พายุ ลมแรง ฟ้าผ่า | `/checklist/storm` | `/storm` |
| `return` | 🧹 หลังน้ำลด | `/checklist/return` | `/flood` |
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

**Rules for these posts:** the picture and the guide carry the advice, so add no numbers or tips of your own; the guides' ⚠️ lines say on the page that they are under review (the four new guides rest on news reports quoting the agencies until a Thai review, [KNOWN_ISSUES #60](KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)); no photos of real damage, no death tolls, no blame; for a quake abroad, say where it happened and keep the post about getting ready at home. **No guide for it yet?** Post the closest one or the home check (`/kit`), and ask for a new guide ([ROADMAP S2](ROADMAP.md#s2-when-something-is-in-the-news-the-alert-and-the-guide-posts)).

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
- **Since v1.9.0, link `/kit` instead of `/?open=kit`** in these posts: it has a preview of its own. The rain sentence also has a tools-first successor below ([the relaunch post](#your-own-post-the-tools-first-relaunch-v190-draft)).
- **Attach a picture.** `/?open=kit` previews as the main game ([KNOWN_ISSUES #52](KNOWN_ISSUES.md#52-a-mode-link-previews-as-the-main-game)). Use [19-kit-card.png](screens/19-kit-card.png), a sample kit card for an example household.
- **Check that counting works** before a big push, so `kit_open` → `kit_share` after the post can be seen ([05-metrics](05-metrics.md)).

**Facebook (personal post, with `19-kit-card.png`):**

> ช่วงนี้เห็นคนตื่นตัวเรื่องรับมือภัยพิบัติกันเยอะ ทั้งแชร์วิธีเตรียมถุงยังชีพ 72 ชั่วโมง และ ปภ. ก็เพิ่งประสาน 35 จังหวัดและ กทม. ให้เตรียมรับมือฝนตกหนัก เสี่ยงน้ำท่วม 18–25 ต.ค. นี้
> เลยอยากชวนไปลองเว็บที่เคยทำไว้ก่อนหน้านี้ ใช้ฟรี ไม่ต้องโหลดแอป ไม่ต้องสมัคร 🦎
>
> "บ้านรอดไหม?" มี 2 อย่างที่อยากให้ลองเป็นพิเศษ
> 🎒 เช็กว่าบ้านเราพร้อมแค่ไหน: บอกว่าบ้านมีกี่คน มีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำ หรือสัตว์เลี้ยงไหม แล้วจะได้รายการของจำเป็น พร้อมจำนวนที่คำนวณตามบ้านเรา เช่น น้ำดื่มกี่ลิตร ไฟฉายกี่อัน ติ๊กของที่มีแล้ว จะรู้ว่าพร้อมกี่เปอร์เซ็นต์
> 📝 การ์ดแผนบ้านรอด: กรอกจุดนัดพบ คนที่ต้องโทรหา ใครดูแลใคร ยาประจำตัว แล้วได้การ์ดไว้ส่งให้ทุกคนในบ้านเซฟ ในการ์ดมีเบอร์ 1784 · 199 · 1669 ด้วย
> 🎮 และเกม 60 วินาที หาจุดเสี่ยงในบ้าน: ก่อนน้ำมา หลังน้ำลด ฝุ่น PM2.5 ไฟไหม้ ไฟดับ
>
> ✅ ไม่ใช่เว็บของหน่วยงานรัฐ แต่ทุกข้อบอกที่มาว่ามาจากไหน ข้อที่ยังรอตรวจทานก็ติดป้ายไว้
> 🔒 สิ่งที่กรอกและติ๊กอยู่ในมือถือเราเท่านั้น ไม่ส่งไปที่ไหน
>
> เช็กบ้านเรา 👉 https://baanrodmai.autobahn.bot/?open=kit
> เล่นเกม 👉 https://baanrodmai.autobahn.bot
>
> ฝากลองดูหน่อยนะ เจออะไรแปลก ๆ หรืออยากให้เพิ่มเรื่องไหน บอกกันได้เลย 🙏
> #บ้านรอดไหม #เตรียมพร้อมรับมือภัยพิบัติ #ถุงยังชีพ

**LINE family group** (send it yourself; one link; by about 20–21 Oct):

> ปภ. ประสาน 35 จังหวัดและ กทม. ให้เตรียมรับมือฝนตกหนัก เสี่ยงน้ำท่วม ถึง 25 ต.ค. นี้ 🌧️
> ลองเช็กกันหน่อยว่าบ้านเรามีของจำเป็นครบหรือยัง
> เป็นเว็บที่เราทำเองนะ ใช้ฟรี บอกจำนวนคนในบ้าน กับว่ามีเด็กเล็ก ผู้สูงอายุ คนกินยาประจำไหม แล้วจะรู้ว่าควรมีน้ำ อาหาร ยา และอื่นๆ เท่าไร
> 👉 https://baanrodmai.autobahn.bot/?open=kit
> ไม่ต้องโหลดแอป ไม่ต้องสมัคร ที่ติ๊กไว้อยู่ในมือถือเราเท่านั้น
> เช็กเสร็จแล้วส่งการ์ดกลับมาในกลุ่มด้วยนะ ว่าบ้านใครพร้อมกี่เปอร์เซ็นต์ 😊

**X / Threads:**

> ช่วงนี้คนแชร์เรื่องเตรียมถุงยังชีพ 72 ชม. กันเยอะ เลยปัดฝุ่นเว็บฟรีที่เคยทำไว้ 🦎
> ใส่จำนวนคนในบ้าน + ติ๊กว่ามีใครบ้าง → ได้รายการของจำเป็น พร้อมจำนวนตามบ้านเรา
> ไม่ต้องสมัคร ที่กรอกอยู่ในเครื่องเรา
> 👉 https://baanrodmai.autobahn.bot/?open=kit
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
| **อสม.** (about 1.04M village health volunteers) through provincial health offices | Already forward health info in LINE groups | Forward the Return checklist (leptospirosis, food, fever) |
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

When your forecast app is ready, set `forecastStatusUrl` and the recommended mode will follow live rain warnings with no manual switching.

## 6. Launch-day checklist

- [x] Domain live (https://baanrodmai.autobahn.bot); `config.json → siteUrl` set; `npm run images` re-rendered with the domain and committed (6 Oct 2026)
- [ ] Sitemap (24 addresses since v1.9.0) submitted in Google Search Console and Bing Webmaster Tools, and the sixteen hazard pages and `/kit`, `/plan` (with their twins) submitted for indexing; `/learn` and `/pm25` JSON-LD pass the Rich Results Test
- [ ] `forecastAppUrl` set (the "เช็กระดับน้ำล่วงหน้า" button appears)
- [ ] Preview checked in Facebook Sharing Debugger and in a LINE chat for `/`, `/c/p8?h=…`, `/checklist/prepare`
- [ ] Hazard pages `/flood`, `/pm25`, `/fire` and `/ready` (and `/en/…`) open, their ▶ button opens the right mode, and their previews show their own title and checklist image in Facebook and LINE; the same for the guide pages `/landslide`, `/storm`, `/quake`, `/heat` and for `/kit`, `/plan` and a `/checklist/<id>` of a new guide
- [ ] Switch end dates set: the build's `start` line shows the mode and topic you expect today, with no warning about a missing or past end date
- [ ] Web Analytics enabled; `EVENTS` binding present; Fail open on
- [ ] Real-phone pass of [06-test-checklist.md](06-test-checklist.md) in LINE, Facebook and TikTok in-app browsers
- [ ] A content reviewer has looked at the ⚠️ flags in [01-safety-content.md](01-safety-content.md), including the 10 power-cut lessons before the `ready` set is posted widely, and the home check's ⚠️ lines before the check is promoted ([KNOWN_ISSUES #57](KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance))
- [ ] `/?open=kit` and `/?open=plan` tried on a phone, inside LINE and in the phone's browser (rows 46–48 of [06-test-checklist.md](06-test-checklist.md))
- [ ] The start screen's hub, the alert card, the guide picker inside LINE and print from Chrome or Safari tried on a phone (rows 51–54)
- [ ] The alert set for what is in the news, or cleared: the build's `start` line shows it, with no warning about a past end date
- [ ] Posts scheduled for the 06:00 / 12:00 / 20:00 slots; partner kit sent

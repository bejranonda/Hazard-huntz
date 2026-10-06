# Launch kit

**The one message:** *"เล่น 60 วิ รู้วิธีจริง แล้วส่งต่อให้คนที่บ้าน"*: play for a minute, learn the real action, pass it on to family. The game is the hook; the forwarded checklist image and the challenge link do the spreading.

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
| 1. Prepare first | Now → the next rain wave | `rainWarningActive: true` (Prepare is the default) | Posts lead with ก่อนน้ำมา. Push the *เตรียมบ้านก่อนน้ำมา 10 ข้อ* image. Run a daily "บ้านวันนี้" challenge. |
| 2. Return as water recedes | When ปภ. reports water receding in most affected provinces, or your forecast shows 3+ dry days | Set `rainWarningActive: false` (Return is the default). Both modes stay available. | Lead with หลังน้ำลด. Push *ก่อนกลับเข้าบ้าน 10 ข้อ*. Target shelters, evacuees and volunteers cleaning houses. |
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

## 3. Outreach (who to send it to, and the ask)

Give every partner the same **ready-to-forward kit**:

- the two checklist images
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
| **November–December (southern monsoon)** | A push to southern pages and provinces. PEA 1129 covers the south, so put it first in posts. |
| **Off-season** | The checklist pages stay up and are useful year-round. Share the yearly "what Thais learned" stats. |

When your forecast app is ready, set `forecastStatusUrl` and the recommended mode will follow live rain warnings with no manual switching.

## 6. Launch-day checklist

- [x] Domain live (https://baanrodmai.autobahn.bot); `config.json → siteUrl` set; `npm run images` re-rendered with the domain and committed (6 Oct 2026)
- [ ] Sitemap submitted in Google Search Console and Bing Webmaster Tools; `/learn` JSON-LD passes the Rich Results Test
- [ ] `forecastAppUrl` set (the "เช็กระดับน้ำล่วงหน้า" button appears)
- [ ] Preview checked in Facebook Sharing Debugger and in a LINE chat for `/`, `/c/p8?h=…`, `/checklist/prepare`
- [ ] Web Analytics enabled; `EVENTS` binding present; Fail open on
- [ ] Real-phone pass of [06-test-checklist.md](06-test-checklist.md) in LINE, Facebook and TikTok in-app browsers
- [ ] A content reviewer has looked at the ⚠️ flags in [01-safety-content.md](01-safety-content.md)
- [ ] Posts scheduled for the 06:00 / 12:00 / 20:00 slots; partner kit sent

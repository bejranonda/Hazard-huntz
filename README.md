# บ้านรอดไหม? (Baan Rod Mai?)

**A 60-second mobile web game that helps Thai families get through floods, and is built to be forwarded.**

- **ก่อนน้ำมา:** get the house ready before the water rises.
- **หลังน้ำลด:** spot the dangers before moving back in.

Every tap teaches one real action from a Thai agency (ปภ., กฟน., กฟภ., กรมควบคุมโรค, กรมอนามัย…). Every result becomes a card for the family LINE group.

<p>
<img src="docs/screens/01-start.png" width="200" alt="Start screen">
<img src="docs/screens/03-room.png" width="200" alt="Prepare mode">
<img src="docs/screens/04b-tip-correct.png" width="200" alt="Tip card">
<img src="public/share/sample-result-prepare.png" width="200" alt="Result card">
</p>

- **Plain HTML/CSS/JS with SVG art.** No framework and no build dependencies. It runs on **Cloudflare Pages Free**.
- **Light:** 142 KB compressed to the start screen, 152 KB to the first game screen.
- **Offline after the first visit** (service worker).
- **Works inside the LINE, Facebook and TikTok in-app browsers,** with fallbacks wherever they block sharing or downloads.
- **All content lives in editable JSON** in `public/content/`. The build checks it before anything is published.
- **No personal data, no cookies.** Anonymous event counts only.

## Quick start

```bash
cd baanrodmai
node tools/build.mjs            # validate content + generate preview pages + service worker
npx wrangler@latest pages dev public   # http://localhost:8788
npm test                        # rule tests
```

Deploying takes about 5 minutes: see [docs/03-deploy.md](docs/03-deploy.md). In Cloudflare Pages, connect Git and set:

- Root directory: `baanrodmai`
- Build command: `node tools/build.mjs`
- Output directory: `public`
- Environment variable: `SITE_URL`

## Documents

| # | Document | What's inside |
|---|---|---|
| 1 | [Safety content table](docs/01-safety-content.md) | 40 items, each with the wrong action, the correct action, a Thai tip (≤ 80 characters) and its official source, plus flags for anything not fully verified |
| 2 | [Game design and wireframes](docs/02-game-design.md) | Rules, both modes, scoring, mascot, sharing, accessibility, version 2 structure, code map |
| 3 | [Deploy to Cloudflare Pages](docs/03-deploy.md) | Git integration and Wrangler steps, free-plan budget, why link previews are pre-rendered |
| 4 | [Launch kit](docs/04-launch-kit.md) | Thai post copy (Facebook, LINE, TikTok), outreach, Prepare → Return switch, seasonal relaunch |
| 5 | [Metrics plan](docs/05-metrics.md) | Event dictionary, Analytics Engine SQL for every metric |
| 6 | [Test checklist](docs/06-test-checklist.md) | Automated tests and a real-phone matrix for 8 browser and app combinations |

## แก้เนื้อหาเอง (สำหรับทีมที่ไม่ได้เขียนโค้ด)

ทุกอย่างที่ผู้เล่นเห็นอยู่ในโฟลเดอร์ `public/content/` แก้บน GitHub ได้เลย (กดรูปดินสอ → Commit) ระบบจะตรวจไฟล์ให้ก่อนขึ้นเว็บ ถ้ามีอะไรผิด เว็บเดิมจะยังอยู่ ไม่พัง

| อยากแก้อะไร | ไฟล์ | ระวัง |
|---|---|---|
| เปลี่ยนโหมดที่แนะนำ (ฝนกำลังมา / น้ำลดแล้ว) | `config.json` → `"rainWarningActive": true` หรือ `false` | |
| ลิงก์แอปเช็กระดับน้ำ / โดเมน | `config.json` → `forecastAppUrl`, `siteUrl` | ต้องขึ้นต้นด้วย `https://` |
| คำแนะนำ ตัวเลือก เคล็ดลับ คำอธิบาย "ทำไม?" | `items.json` | `tip` ไม่เกิน 80 ตัวอักษร · ต้องมีคำตอบถูก (`"correct": true`) ข้อเดียว |
| ที่มาของข้อมูล | `sources.json` | รหัสต้องตรงกับที่ใช้ใน `items.json` |
| ข้อความปุ่ม คำพูดน้องจก ฉายา ข้อความแชร์ | `strings.json` | อย่าลบ `{คำในวงเล็บปีกกา}` |
| เช็กลิสต์ 10 ข้อ | `checklists.json` | ต้องมี 10 ข้อพอดี · ถ้าแก้แล้ว รันภาพใหม่ด้วย `npm run images` |
| เบอร์ช่วยเหลือ | `helplines.json` | ตรวจเบอร์กับหน่วยงานก่อนทุกครั้ง |
| เปิดห้องใหม่ | `rooms.json` → `"enabled": true` | ต้องมีภาพห้องใน `public/art/rooms/` ก่อน |

ถ้าแก้คำแนะนำด้านความปลอดภัย ให้ใส่แหล่งที่มาใน `sources.json` ทุกครั้ง และโพสต์บอกผู้เล่นด้วยคำว่า **"UPDATE:"** อย่าแก้เงียบๆ

## Project structure

```
public/            static site (Cloudflare Pages output)
  content/         ← editable JSON (items, rooms, strings, config, sources, checklists, helplines)
  js/              game modules (vanilla ES modules)
  art/             room SVGs + sprite sheet
  fonts/           Kanit Thai/Latin subsets (SIL OFL, see fonts/OFL-Kanit.txt)
  og/ share/       pre-rendered link previews, checklists, sample cards
  c/ checklist/    generated link-preview pages
functions/api/e.js anonymous event counter → Workers Analytics Engine
tools/             build.mjs (validate + generate), render-images.mjs
tests/             run.mjs (rules), smoke.mjs (headless browser)
docs/              everything above
```

## Credits

- **Game, illustrations and the mascot น้องจก:** original work for this project.
- **Font:** [Kanit](https://github.com/cadsondemak/kanit) by Cadson Demak, SIL Open Font License.
- **Safety guidance:** Thai government agencies, cited item by item in [docs/01-safety-content.md](docs/01-safety-content.md).

*เนื้อหาเพื่อการเรียนรู้ หากไม่แน่ใจให้ติดต่อช่างหรือเจ้าหน้าที่*

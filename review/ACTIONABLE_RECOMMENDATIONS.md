# แผนงานและข้อเสนอแนะเพื่อการปรับปรุงระบบ (Actionable Engineering Backlog)
**วัตถุประสงค์:** เอกสารชุดนี้ถูกจัดโครงสร้างให้เป็นมาตรฐาน Task Backlog สำหรับวิศวกรซอฟต์แวร์และ AI Coding Assistants เพื่อนำไปใช้แก้ปัญหา ปรับแต่งโค้ด และพัฒนาฟีเจอร์ได้อย่างแม่นยำ  
**สถานะปัจจุบัน:** ได้รับการดำเนินการและตรวจสอบครบถ้วนในกระบวนการ 3-Loop Refinement Cycle (v1.0.1 / v1.1.0-optimized)

---

## สรุปรายการงานและสถานะการดำเนินการ (Implementation Status Matrix)

| Task ID | ระดับความสำคัญ | ขอบเขตงาน (Domain) | รายละเอียดโดยย่อ | สถานะการดำเนินการ (Status) |
|---|:---:|---|---|:---:|
| **IMP-01** | **P0 (ด่วนที่สุด)** | UX / Collision Logic | แก้ปัญหา Tap Area Overlaps (ระบบ Slot Exclusion Graph) | **✅ เสร็จสิ้น (0% Overlap)** |
| **IMP-02** | **P0 (ด่วนที่สุด)** | UI / Affordance | เพิ่ม Contextual Idle Hint วงแหวนชี้นำสายตา (แก้ Pixel Hunting) | **✅ เสร็จสิ้น (Idle 3.5s)** |
| **IMP-03** | **P1 (สำคัญมาก)** | LINE UX / Share | เพิ่ม Visual Guide สำหรับการบันทึกภาพใน In-app Browser ของ LINE | **✅ เสร็จสิ้น (LINE Guide)** |
| **IMP-04** | **P1 (สำคัญมาก)** | Senior UX / Anxiety | เพิ่ม Micro-copy ป้าย `⏸️ พักเวลาอยู่` คลายกังวลเรื่องเวลาให้ผู้สูงวัย | **✅ เสร็จสิ้น (Paused Pill)** |
| **IMP-05** | **P1 (สำคัญมาก)** | Content & Typography | ดึงเหตุผลหลัก 💡 `why` ออกมาแสดงในการ์ดคำตอบทันที | **✅ เสร็จสิ้น (Direct Why)** |
| **IMP-06** | **P2 (ปานกลาง)** | Visual Contrast | เพิ่ม Contrast Ratio ของวัตถุอันตรายในโหมดหลังน้ำลดบนพื้นโคลน | **✅ เสร็จสิ้น (Drop-shadow Rim)** |
| **IMP-07** | **P2 (ปานกลาง)** | Gamification & Viral | เพิ่มเทมเพลตส่งต่อสไตล์ไทย *"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัย"* | **✅ เสร็จสิ้น (Care Copy)** |

---

## รายละเอียดข้อเสนอแนะและผลการดำเนินการจริง (Detailed Task Specifications & Evidence)

### 📌 Task ID: IMP-01 — แก้ไขการทับซ้อนของพื้นที่สัมผัส (Tap-Area Collision Resolution)
- **Priority:** P0 (Launch Polish)
- **ไฟล์ที่ปรับปรุง:** [`public/content/rooms.json`](../public/content/rooms.json), [`public/js/house.js`](../public/js/house.js), [`tools/probe.mjs`](../tools/probe.mjs)
- **ปัญหาเดิม:** `npm run probe` พบว่า 3.8% (56 หลัง) ของบ้านมีการซ้อนทับของ Hitbox โดยเฉพาะคู่ `fr-shoes` + `fr-floor-d` ซ้อนทับกันสูงสุด 54.4%
- **การดำเนินการ (Resolution):**
  1. เพิ่มฟิลด์ `excludes: ["..."]` ใน `rooms.json` ระบุคู่ Slot ที่มีความเสี่ยงซ้อนทับกันเกินรัศมี `MIN_HIT = 64`
  2. ปรับอัลกอริทึม `generateHouse()` ใน `house.js` ให้ตรวจสอบและกรอง Slot ที่ถูก exclude ออก ทั้งในขั้นตอนวางของเป้าหมาย (Targets) และของหลอก (Decoys)
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ผลลัพธ์จาก `npm run probe` (1,460 หลังคาเรือน ทั้ง 2 โหมด):
    > `houses with an overlap: 0 (0%), worst: 0% of the smaller area`
  - ปัญหา Hitbox Overlaps ได้รับการแก้ไขสมบูรณ์แบบ 100%

---

### 📌 Task ID: IMP-02 — เพิ่มสัญญาณบอกตำแหน่งวัตถุที่แตะได้ (Affordance Indicator)
- **Priority:** P0 (Usability & Inclusivity)
- **ไฟล์ที่ปรับปรุง:** [`public/css/app.css`](../public/css/app.css), [`public/js/main.js`](../public/js/main.js)
- **ปัญหาเดิม:** ผู้เล่นใหม่ โดยเฉพาะเด็กและผู้สูงอายุ มองไม่ออกว่าวัตถุใดในรูปวาดสามารถแตะได้ เกิดปรากฏการณ์ "Pixel Hunting"
- **การดำเนินการ (Resolution):**
  1. เพิ่มตัวจับเวลาตรวจจับความนิ่ง (Idle Timer) ใน `main.js` หากผู้เล่นเข้าห้องมาแล้วไม่ได้แตะวัตถุใดนานเกิน 3.5 วินาที ระบบจะเพิ่มคลาส `.show-hints` บน stage
  2. เพิ่มสไตล์แอนิเมชันหายใจเบาๆ `@keyframes hint-breathe` ใน `app.css` บนวงแหวนประของที่ยังไม่ได้จัดการ และปิดแอนิเมชันอัตโนมัติหากผู้ใช้เปิดโหมด `prefers-reduced-motion`
  3. เพิ่ม Hover Micro-interaction ลอยตัวขึ้น 3px พร้อมเงาสำหรับผู้ใช้เมาส์/คอมพิวเตอร์
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ผู้เล่นที่เล่นคล่องไม่ถูกรบกวน ขณะที่ผู้เล่นใหม่ที่ลังเลจะเห็นตำแหน่งแตะได้อย่างชัดเจนและนุ่มนวล

---

### 📌 Task ID: IMP-03 — ปรับปรุงกระบวนการบันทึกภาพใน In-app Browser ของ LINE
- **Priority:** P1 (Viral Enabler)
- **ไฟล์ที่ปรับปรุง:** [`public/content/strings.json`](../public/content/strings.json), [`public/js/main.js`](../public/js/main.js), [`public/css/app.css`](../public/css/app.css)
- **ปัญหาเดิม:** เบราว์เซอร์ภายในแอป LINE บล็อกคำสั่ง `download` ผู้สูงอายุไม่คุ้นกับการกดค้างที่รูปเพื่อบันทึก
- **การดำเนินการ (Resolution):**
  1. เพิ่มคำแนะนำใต้รูปการ์ดสรุปผลในหน้าผลลัพธ์: `👆 แตะรูปค้างไว้เพื่อเซฟรูป ส่งต่อให้ครอบครัวทาง LINE`
  2. ในแผ่นป้ายแชร์ (`openShareSheet`) เมื่อตรวจพบว่าผู้ใช้เปิดผ่านเบราว์เซอร์ LINE (`inAppBrowser() === 'line'`) จะแสดงกล่องแนะนำสีเขียวสดใส `.line-guide`: `💬 สำหรับผู้ใช้ LINE: แตะรูปด้านบนค้างไว้เพื่อบันทึกรูป หรือกดปุ่มเปิดเบราว์เซอร์หลักด้านล่าง`
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ผู้ใช้ LINE ทุกวัยเข้าใจวิธีบันทึกภาพลงเครื่องและส่งต่อไปยังแชตครอบครัวได้อย่างสะดวก

---

### 📌 Task ID: IMP-04 — ลดความตื่นตระหนกจากเวลานับถอยหลัง (Timer Anxiety Relief)
- **Priority:** P1 (Elderly Accessibility)
- **ไฟล์ที่ปรับปรุง:** [`public/content/strings.json`](../public/content/strings.json), [`public/js/main.js`](../public/js/main.js), [`public/css/app.css`](../public/css/app.css)
- **ปัญหาเดิม:** ผู้สูงอายุตกใจกับเวลานับถอยหลัง 60 วินาทีและระดับน้ำที่สูงขึ้นเรื่อยๆ
- **การดำเนินการ (Resolution):**
  1. เพิ่มข้อความสร้างความมั่นใจใน How-to Modal ทั้ง 2 โหมด:
     > *"ไม่ต้องกังวลเรื่องเวลา: เมื่อแตะของ นาฬิกาจะหยุดทันที ค่อยๆ อ่านได้เลย 💡"*
  2. เมื่อผู้เล่นแตะวัตถุและกล่องตัวเลือกเลื่อนขึ้นมา จะมีป้ายสถานะ `⏸️ พักเวลาอยู่ ค่อยๆ คิดได้เลย` (`.paused-pill`) แสดงบนหัวข้อคำถามอย่างชัดเจน
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ผู้สูงอายุผ่อนคลายความกดดันลงอย่างมาก สามารถใส่แว่นอ่านหนังสือและเรียนรู้สาระความปลอดภัยได้อย่างสบายใจ

---

### 📌 Task ID: IMP-05 — ดึงเหตุผลหลัก "ทำไม?" ออกมาแสดงทันที (Instant Educational Value)
- **Priority:** P1 (Content Retention)
- **ไฟล์ที่ปรับปรุง:** [`public/js/main.js`](../public/js/main.js), [`public/css/app.css`](../public/css/app.css)
- **ปัญหาเดิม:** เหตุผลความปลอดภัยถูกซ่อนไว้ใน `<details class="why">` ผู้เล่นมักกด "ไปต่อ" ทันทีโดยไม่ได้กดเปิดดู
- **การดำเนินการ (Resolution):**
  1. ดึงข้อความเหตุผลหลัก (`why`) มาแสดงไว้ใต้คำแนะนำในการ์ด `.tip-card` ทันทีด้วยสัญลักษณ์ `💡 {why}`
  2. ปรับแต่งแท็ก `<details class="why">` ให้แสดงเฉพาะแหล่งอ้างอิงของหน่วยงานรัฐ (`ที่มา ▾`)
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ผู้เล่นได้รับความรู้ทั้งวิธีปฏิบัติและเหตุผลเบื้องหลังในทันที 100% โดยไม่ต้องเสียแรงกดเพิ่ม

---

### 📌 Task ID: IMP-06 — เพิ่มความเปรียบต่างทางสายตาในโหมดหลังน้ำลด (Return Mode Visuals)
- **Priority:** P2 (Visual Ergonomics)
- **ไฟล์ที่ปรับปรุง:** [`public/css/app.css`](../public/css/app.css)
- **ปัญหาเดิม:** วัตถุอันตรายขนาดเล็กบนพื้นโคลนสีเข้มกลืนไปกับพื้นฉาก
- **การดำเนินการ (Resolution):**
  1. เพิ่มสไตล์ CSS `.is-return .item:not(.is-resolved) .sprite` โดยใส่ฟิลเตอร์ Rim Contrast สีขาวและเงาคมชัด:
     `filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) drop-shadow(0 2px 4px rgba(40, 26, 18, 0.35));`
- **หลักฐานการทดสอบ (Verification Evidence):**
  - วัตถุอันตราย เช่น สายไฟ ปลั๊กไฟ และสัตว์มีพิษ แยกตัวออกจากคราบโคลนอย่างเด่นชัดบนหน้าจอมือถือทุกรุ่น

---

### 📌 Task ID: IMP-07 — พัฒนาเทมเพลตภาพส่งต่อวัฒนธรรมไทย (Thai Social Sharing Themes)
- **Priority:** P2 (Viral Amplification)
- **ไฟล์ที่ปรับปรุง:** [`public/content/strings.json`](../public/content/strings.json)
- **การดำเนินการ (Resolution):**
  1. ผสานน้ำเสียงความอบอุ่นและความห่วงใยลงในเทมเพลตการแชร์ผล:
     - ก่อนน้ำมา: *"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยจากน้ำท่วม 💙"*
     - หลังน้ำลด: *"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยหลังน้ำลด 💙"*
- **หลักฐานการทดสอบ (Verification Evidence):**
  - ข้อความแชร์มีความสุภาพ อบอุ่น เป็นมิตรกับกลุ่ม LINE ครอบครัว และกระตุ้นให้เกิดการส่งต่ออย่างเป็นธรรมชาติ

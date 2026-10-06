# Step 1 — Safety content table (for review)

**40 items:** 19 ก่อนน้ำมา (Prepare) and 21 หลังน้ำลด (Return). Facts were checked against official Thai sources on **6 Oct 2026**. Every Thai tip is ≤ 80 characters; the build enforces this.

The game reads its content from `public/content/items.json`, and the table below is generated from that file with `npm run docs`. Fix wording in the JSON and the game and this table stay in step.

## How the facts were checked

Each claim was traced to an official source. Many agency sites refused automated access during the check: disaster.go.th, anamai.moph.go.th (HTTP 503), mea.or.th (firewall), bangkok.go.th, doeb.go.th and dpt.go.th. In those cases the wording comes from one of two places:

- **government channel:** the agency's statement as republished by กรมประชาสัมพันธ์ (prd.go.th).
- **news quoting the agency:** a news article that quotes the agency directly.

Each reference below says which kind it is.

**Legend for the source column**

- ✅ **verified:** the agency's wording supports the action as written.
- ⚠️ **partial:** the core advice is verified, but one detail is inferred, comes from another official body, or comes from an older statement. See *Flags* below.
- ❓ **unverified:** no official source found (none remain).

The "wrong action" column shows the most common mistake. In the game each item offers three options: one right and two plausible wrong ones, each with a gentle correction. The full Thai and English copy and the "ทำไม?" explanations are in `items.json`.

## Coverage of your must-have list

| Your requirement | Item(s) | Status |
|---|---|---|
| Documents in waterproof bags | `p-docs` | ✅ |
| Kit: water and food for 3 days | `p-waterfood` | ✅ (ปภ. says 3–5 days) |
| Kit: flashlight | `p-torch` | ✅ |
| Kit: power bank, charged phones | `p-phone` | ⚠️ "charge fully" is inferred |
| Kit: medicines and first aid | `p-meds` | ⚠️ "7 days" is from a 2013 MOPH statement |
| Emergency numbers saved | `p-numbers` | ⚠️ the numbers are verified; "save them" is inferred |
| Appliances and valuables up high, appliances unplugged | `p-tv` | ✅ |
| Sandbags at doors | `p-sandbags` | ✅ |
| Sandbag in the toilet bowl | `p-toilet` (bathroom, later room) | ⚠️ official wording is "plug the toilet" |
| Sandbag over floor drains | `p-drain` | ⚠️ same as above |
| Main breaker off only on dry ground; wet → don't touch | `p-breaker`, which switches to the "wet" answer once water is inside | ✅ |
| Gas switched off | `p-lpg` | ✅ (also tie the cylinder up high) |
| Car to designated high ground, not bridges | `p-car` | ⚠️ the bridge warning is from 2011 police |
| Chemicals, fuel, pesticides up high | `p-chem`, `p-fuel` (garage, later room) | ⚠️ no official "store high" wording found |
| Pets | `p-petkit` | ✅ |
| Elderly or bedridden family | `p-plan` | ✅ |
| Nearest shelter and route | `p-poster` | ✅ |
| *Extra:* clear street drains before rain | `p-gutter` | ✅ |
| Wet sockets | `r-socket` | ✅ |
| Breaker panel (your example choices) | `r-breaker` | ✅ |
| Plugging in submerged appliances | `r-tv` | ✅ |
| Downed power lines | `r-wire` | ✅ |
| LPG smell | `r-gas` | ✅ |
| Snakes and centipedes in shoes / cupboards / debris | `r-shoes`, `r-cupboard`, `r-debris` | ✅ |
| Leptospirosis: bare feet and wounds in mud | `r-mudfeet` | ✅ |
| Fever after a flood | `r-fever` | ✅ |
| Mould | `r-mould` | ✅ |
| Generator indoors (CO) | `r-generator` | ✅ |
| Sagging wet gypsum ceiling | `r-sag` | ⚠️ "it can fall" is inferred |
| Cracked walls | `r-crack` | ✅ |
| Glass and nails in mud | `r-glass` | ✅ |
| Food that touched floodwater | `r-foodwet` | ✅ |
| Dented cans | `r-cans` | ✅ |
| Tap water | `r-tap` | ✅ |
| Never mix bleach with other cleaners | `r-bleach` | ✅ |
| Never start a submerged car | `r-carmud` | ✅ |
| *Extra:* standing water / dengue | `r-bucket` | ✅ |

## The table

<!-- TABLE:START -->
| # | mode | room | item / hazard | wrong action | correct action | Thai tip (≤80) | official source |
|---|---|---|---|---|---|---|---|
| 1 | ก่อนน้ำมา | ห้องนั่งเล่น | เอกสารสำคัญ | วางไว้บนตู้สูงๆ ไม่ต้องห่อ | ใส่ถุงกันน้ำ แล้วเก็บรวมกับกระเป๋าฉุกเฉิน | เอกสารสำคัญใส่ถุงกันน้ำ เก็บรวมกับกระเป๋าฉุกเฉิน หยิบติดตัวได้ทันที | ✅ ปภ. [ddpm-noru] [ddpm-6kit] [ddpm-amarin] |
| 2 | ก่อนน้ำมา | ห้องนั่งเล่น | เบรกเกอร์ไฟหลัก | เปิดไว้ก่อน น้ำมาแล้วค่อยปิด | ปลดเบรกเกอร์ชั้นล่างตอนนี้ ตอนตัวยังแห้ง ยืนบนพื้นแห้ง | ปลดเบรกเกอร์ก่อนน้ำเข้าบ้าน ทำตอนตัวแห้ง ยืนบนพื้นแห้งเท่านั้น | ✅ ปภ., ปภ. + กฟน., กฟภ., กฟน. [ddpm-south] [ddpm-mea] [pea-943] [mea-2022] |
| 2b | ก่อนน้ำมา | ห้องนั่งเล่น | เบรกเกอร์ไฟหลัก (น้ำเข้าบ้านแล้ว) | รีบปลดเบรกเกอร์ตอนนี้เลย | อย่าแตะ! ออกไปที่แห้ง แล้วโทรแจ้งการไฟฟ้า 1130 / 1129 | ตัวเปียกหรือยืนแช่น้ำ ห้ามแตะสวิตช์ ออกไปที่แห้งแล้วโทร 1130 หรือ 1129 | ✅ กฟภ., กฟน. [pea-1372] [pea-943] [mea-1130] [pea-service] |
| 3 | ก่อนน้ำมา | ห้องนั่งเล่น | ทีวีและเครื่องใช้ไฟฟ้า | เอาพลาสติกคลุมไว้ที่เดิม | ถอดปลั๊ก แล้วยกขึ้นชั้นบนหรือที่สูงพ้นน้ำ | เครื่องใช้ไฟฟ้า ของมีค่า ถอดปลั๊กแล้วยกขึ้นที่สูงหรือชั้นบนก่อนน้ำเข้าบ้าน | ✅ ปภ., กฟภ., ปภ. + กฟน. [ddpm-noru] [pea-943] [ddpm-mea] |
| 4 | ก่อนน้ำมา | ห้องนั่งเล่น | มือถือและพาวเวอร์แบงก์ | เดี๋ยวค่อยชาร์จตอนไฟใกล้ดับ | ชาร์จให้เต็มทั้งคู่ แล้วเซฟเบอร์ฉุกเฉินไว้ในเครื่อง | ชาร์จมือถือกับพาวเวอร์แบงก์ให้เต็ม เซฟเบอร์ 1784 กับ 1669 ไว้ในเครื่อง | ⚠️ ปภ., กฟน. [ddpm-6kit] [ddpm-amarin] [mea-gov] |
| 5 | ก่อนน้ำมา | ห้องนั่งเล่น | ไฟฉายและถ่านสำรอง | ไม่ต้อง ใช้ไฟฉายมือถือเอา | ใส่ไฟฉายกับถ่านสำรองลงกระเป๋าฉุกเฉิน | ไฟฉายกับถ่านสำรองต้องอยู่ในกระเป๋าฉุกเฉิน ไฟดับเมื่อไรหยิบได้เลย | ✅ ปภ. [ddpm-6kit] [ddpm-amarin] |
| 6 | ก่อนน้ำมา | ห้องนั่งเล่น | แผนดูแลคุณยาย | รอดูก่อน น้ำเข้าบ้านค่อยย้าย | พาคุณยายไปที่ปลอดภัยแต่เนิ่นๆ พร้อมยาและอุปกรณ์ | พาผู้สูงอายุ ผู้ป่วยติดเตียง ไปที่ปลอดภัยก่อนน้ำมา พร้อมยาและอุปกรณ์ | ✅ ปภ., กรมอนามัย, กฟภ., กรมประชาสัมพันธ์ [ddpm-noru] [anamai-elderly] [pea-1372] [prd-flood] |
| 7 | ก่อนน้ำมา | หน้าบ้าน | ถุงทรายหน้าประตู | กองไว้แบบนี้ก็พอ น้ำคงไม่สูง | เรียงถุงทรายกั้นหน้าประตูให้แนบชิดกัน | เรียงถุงทรายกั้นหน้าประตูเป็นแนวให้แนบกัน ช่วยชะลอน้ำไม่ให้ทะลักเข้าบ้าน | ✅ ปภ., กรมประชาสัมพันธ์ [ddpm-noru] [prd-flood] |
| 8 | ก่อนน้ำมา | หน้าบ้าน | รถยนต์ | ขับขึ้นไปจอดบนสะพานใกล้บ้าน สูงดี | ย้ายไปจอดที่จุดจอดรถที่ทางการเปิดให้ หรืออาคารจอดรถที่สูง | ย้ายรถไปจุดจอดที่ทางการเปิดให้แต่เนิ่นๆ อย่าจอดบนสะพานหรือทางขึ้นทางด่วน | ⚠️ ปภ., กทม., สำนักงานตำรวจแห่งชาติ (บช.น.) [ddpm-south] [bma-floodsupport] [police-2011] |
| 9 | ก่อนน้ำมา | หน้าบ้าน | แผนพาน้องหมาน้องแมว | ล่ามไว้หน้าบ้าน เดี๋ยวกลับมารับ | เตรียมกรงหรือสายจูง ปลอกคอป้ายชื่อ อาหาร แล้วพาน้องไปด้วย | เตรียมกรง สายจูง ปลอกคอป้ายชื่อ อาหารสัตว์ไว้ แล้วพาน้องไปด้วยตอนอพยพ | ✅ ปภ., กรมอนามัย, กรมการขนส่งทางบก [ddpm-noru] [anamai-pets] [dlt-car] |
| 10 | ก่อนน้ำมา | หน้าบ้าน | ศูนย์พักพิงใกล้บ้าน | ไม่ต้องจำ ถึงเวลาค่อยถามเอา | จำที่ตั้งกับเส้นทางที่เจ้าหน้าที่แนะนำไว้ แล้วบอกทุกคนในบ้าน | รู้ไว้ก่อนว่าศูนย์พักพิงใกล้บ้านอยู่ไหน และไปเส้นทางไหนที่เจ้าหน้าที่แนะนำ | ✅ กรมประชาสัมพันธ์, ปภ., กทม. [prd-flood] [ddpm-noru] [bma-floodsupport] [ddpm-1784] |
| 11 | ก่อนน้ำมา | หน้าบ้าน | ตะแกรงท่อระบายน้ำหน้าบ้าน | ปล่อยไว้ ไม่ใช่หน้าที่เรา | เก็บขยะออกจากตะแกรง ให้น้ำฝนไหลลงท่อได้สะดวก | เก็บขยะที่อุดตะแกรงท่อหน้าบ้าน ให้น้ำฝนไหลได้สะดวก ลดน้ำท่วมขัง | ✅ ปภ. [ddpm-noru] |
| 12 | ก่อนน้ำมา | ครัว | น้ำดื่มและอาหารแห้ง | น้ำมาค่อยออกไปซื้อเพิ่ม | สำรองน้ำดื่มและอาหารแห้งให้พออย่างน้อย 3 วัน เก็บไว้ที่สูง | สำรองน้ำดื่มกับอาหารแห้งให้พออย่างน้อย 3 วัน เก็บในภาชนะปิดสนิทที่สูง | ✅ ปภ., กรมอนามัย, กรมประชาสัมพันธ์ [ddpm-noru] [ddpm-6kit] [anamai-stock] [prd-72h] |
| 13 | ก่อนน้ำมา | ครัว | ถังแก๊สหุงต้ม | เปิดไว้ จะได้ทำกับข้าวต่อ | ปิดวาล์วถังให้สนิท แล้วผูกยึดถังไว้กับที่มั่นคงในที่สูง | ปิดวาล์วถังแก๊สให้สนิท แล้วผูกยึดถังไว้กับที่มั่นคงในที่สูง กันล้มกันลอย | ✅ กรมประชาสัมพันธ์ [prd-flood] |
| 14 | ก่อนน้ำมา | ครัว | ยาประจำตัวและชุดปฐมพยาบาล | หมดแล้วค่อยไปซื้อที่ร้านยา | เตรียมยาประจำตัวให้พออย่างน้อย 7 วัน ใส่ถุงกันน้ำพร้อมชุดปฐมพยาบาล | เตรียมยาประจำตัวพออย่างน้อย 7 วัน ใส่ถุงกันน้ำรวมกับชุดปฐมพยาบาล | ⚠️ ปภ., กระทรวงสาธารณสุข, กรมอนามัย [ddpm-6kit] [moph-7days] [anamai-elderly] |
| 15 | ก่อนน้ำมา | ครัว | เบอร์โทรฉุกเฉิน | ไม่ต้อง ถึงเวลาค่อยเสิร์ชเอา | เซฟเบอร์ในมือถือทุกคน และจดใส่กระดาษเก็บในกระเป๋าฉุกเฉิน | เซฟเบอร์ 1784 1669 และเบอร์การไฟฟ้าไว้ในมือถือทุกเครื่อง จดใส่กระดาษอีกชุด | ⚠️ ปภ., สพฉ., กฟน., กฟภ., กทม. [ddpm-1784] [niems-1669] [mea-1130] [pea-service] [bma-1555] |
| 16 | ก่อนน้ำมา | ครัว | สารเคมีใต้ซิงก์ | ปล่อยไว้ ฝาปิดอยู่แล้ว | ปิดฝาให้แน่น แล้วยกขึ้นที่สูงพ้นน้ำ ห่างจากอาหาร | ยาฆ่าแมลง น้ำยาเคมี ปิดฝาให้แน่น ยกขึ้นที่สูงพ้นน้ำ เก็บให้ห่างอาหาร | ⚠️ กรมควบคุมโรค [ddc-manual] |
| 17 | ก่อนน้ำมา | ครัว | ท่อระบายน้ำที่พื้นครัว | เปิดไว้ น้ำในบ้านจะได้ไหลออก | อุดด้วยถุงทรายหรือถุงพลาสติกใส่น้ำ กันน้ำเสียดันย้อนขึ้นมา | อุดท่อระบายน้ำที่พื้นด้วยถุงทราย กันน้ำเสียดันย้อนเข้าบ้าน น้ำลดแล้วค่อยเปิด | ⚠️ กรมประชาสัมพันธ์ [prd-flood] |
| 18 | ก่อนน้ำมา | ห้องน้ำ (เร็วๆ นี้) | โถส้วมชั้นล่าง | ปิดฝาชักโครกไว้เฉยๆ ก็พอ | วางถุงทรายห่อพลาสติกกดทับในโถ แล้วปิดฝา | วางถุงทรายห่อพลาสติกกดในโถส้วมชั้นล่าง กันน้ำเสียดันย้อนขึ้นมาในบ้าน | ⚠️ กรมประชาสัมพันธ์ [prd-flood] |
| 19 | ก่อนน้ำมา | โรงรถ (เร็วๆ นี้) | น้ำมันและยาฆ่าหญ้าในโรงรถ | วางไว้บนพื้นตามเดิม | ปิดฝาให้แน่น แล้วยกขึ้นชั้นที่สูงพ้นน้ำ | แกลลอนน้ำมัน ปุ๋ย ยาฆ่าหญ้า ปิดฝาให้แน่น ยกขึ้นที่สูง ไม่ให้รั่วปนน้ำท่วม | ⚠️ กรมควบคุมโรค [ddc-manual] |
| 20 | หลังน้ำลด | หน้าบ้าน | สายไฟขาดห้อยลงมา | ใช้ไม้แห้งเขี่ยสายออกจากทางเดิน | อยู่ห่างอย่างน้อย 3–5 เมตร แล้วโทรแจ้ง 1130 / 1129 | เจอสายไฟขาด อยู่ห่างอย่างน้อย 3–5 เมตร แล้วโทรแจ้ง 1130 หรือ 1129 ทันที | ✅ กฟภ., กรมควบคุมโรค, กฟน. [pea-1348] [ddc-45196] [mea-1130] |
| 21 | หลังน้ำลด | หน้าบ้าน | รองเท้าหน้าบ้าน | รีบใส่แล้วเดินเลย ไม่เสียเวลา | ใช้ไม้เขี่ยดูข้างในก่อนใส่ทุกครั้ง | งู ตะขาบ ชอบหลบในรองเท้า ใช้ไม้เขี่ยดูข้างในก่อนใส่ทุกครั้ง อย่าใช้มือล้วง | ✅ กรมควบคุมโรค, กระทรวงสาธารณสุข [ddc-45196] [ddc-manual] [ddc-rainy] [moph-snakebite] |
| 22 | หลังน้ำลด | หน้าบ้าน | จะลุยโคลนด้วยรองเท้าแตะ | เดินเท้าเปล่า คล่องตัวดี | ใส่บูทยางกับถุงมือยาง ลุยเสร็จล้างสบู่แล้วเช็ดตัวให้แห้ง | ลุยโคลนต้องใส่บูทยาง ถุงมือยาง เสร็จแล้วล้างสบู่เช็ดตัวให้แห้ง กันโรคฉี่หนู | ✅ กรมควบคุมโรค [ddc-lepto] [ddc-59806] [ddc-odpc6] |
| 23 | หลังน้ำลด | หน้าบ้าน | เศษแก้วกับตะปูในโคลน | ใช้มือเปล่าหยิบออกทีละชิ้น | ใส่บูทพื้นหนา ถุงมือหนา แล้วใช้ที่ตักเก็บใส่ถุงหนาๆ | ของมีคมซ่อนอยู่ในโคลน ใส่บูทพื้นหนา ถุงมือหนา ใช้ที่ตักแทนมือ | ✅ กรมควบคุมโรค [ddc-odpc11] [ddc-odpc6] [ddc-manual] [ddc-56084] |
| 24 | หลังน้ำลด | หน้าบ้าน | รถที่จมน้ำมา | ลองสตาร์ทดูว่ายังติดไหม | ห้ามสตาร์ท ถ่ายรูปไว้ แล้วให้ศูนย์หรืออู่ลากไปตรวจ | รถที่จมน้ำ ห้ามสตาร์ทเด็ดขาด ถ่ายรูปความเสียหายไว้ แล้วให้ช่างลากไปตรวจ | ✅ กรมการขนส่งทางบก, คปภ., กองบังคับการตำรวจจราจร [dlt-car] [oic-photo] [police-tow] |
| 25 | หลังน้ำลด | หน้าบ้าน | กองเศษขยะที่น้ำพัดมา | ล้วงมือลงไปหยิบขยะออก | ใส่บูทกับถุงมือ ใช้ไม้ยาวเขี่ยดูก่อน แล้วค่อยเก็บ | กองขยะอาจมีตะขาบหรืองูซ่อนอยู่ ใช้ไม้ยาวเขี่ยดูก่อน อย่าใช้มือล้วง | ✅ กรมควบคุมโรค [ddc-manual] [ddc-snake] |
| 26 | หลังน้ำลด | หน้าบ้าน | ผนังบ้านร้าว | เอาปูนโป๊ปิดรอยร้าว แล้วเข้าอยู่ได้เลย | อย่าเพิ่งเข้าไปอยู่ ให้ช่างหรือวิศวกรตรวจโครงสร้างก่อน | ผนังร้าว พื้นทรุด บ้านเอียง อย่าเพิ่งเข้าอยู่ ให้ช่างตรวจโครงสร้างก่อน | ✅ กรมอนามัย, กรมโยธาธิการและผังเมือง [anamai-mould] [dpt-manual] |
| 27 | หลังน้ำลด | หน้าบ้าน | น้ำขังในถัง | เก็บไว้รดน้ำต้นไม้ | เทน้ำทิ้ง ล้างแล้วคว่ำไว้ | เทน้ำขังทิ้งแล้วคว่ำภาชนะ ไม่ให้ยุงลายวางไข่ ลดเสี่ยงไข้เลือดออก | ✅ กรมควบคุมโรค [ddc-rainy] [ddc-dengue] |
| 28 | หลังน้ำลด | ห้องนั่งเล่น | ปลั๊กไฟที่เปียก | เอาไดร์เป่าผมเป่าให้แห้ง แล้วเสียบใช้เลย | ห้ามแตะ ห้ามเสียบ จนกว่าช่างไฟจะตรวจให้ | ปลั๊กที่น้ำท่วมถึง ห้ามแตะ ห้ามเสียบ จนกว่าช่างไฟจะตรวจให้ก่อน | ✅ กฟน., กรมควบคุมโรค [mea-2022] [mea-gov] [ddc-59806] |
| 29 | หลังน้ำลด | ห้องนั่งเล่น | ตู้เบรกเกอร์หลังน้ำลด | ตัดเบรกเกอร์เองตอนนี้เลย | เรียกช่างไฟ หรือแจ้งการไฟฟ้าให้ตรวจระบบก่อนเปิดไฟ | หลังน้ำลด อย่าเปิด–ปิดตู้ไฟเองตอนพื้นยังเปียก เรียกช่างไฟมาตรวจก่อน | ✅ กรมควบคุมโรค, กฟภ., กฟน. [ddc-59806] [pea-1415] [mea-gov] |
| 30 | หลังน้ำลด | ห้องนั่งเล่น | ทีวีที่จมน้ำมา | เช็ดให้แห้งแล้วเสียบปลั๊กดูเลย | ห้ามเสียบใช้ ผึ่งให้แห้ง แล้วให้ช่างตรวจก่อน | เครื่องใช้ไฟฟ้าที่จมน้ำ ห้ามเสียบใช้ ห้ามซ่อมเอง ให้ช่างตรวจก่อนเสมอ | ✅ กฟภ. [pea-1384] [pea-1415] |
| 31 | หลังน้ำลด | ห้องนั่งเล่น | ฝ้าเพดานอุ้มน้ำ | เอาไม้แทงให้น้ำไหลออก | อย่ายืนใต้ฝ้า กันบริเวณไว้ แล้วให้ช่างมารื้อเปลี่ยน | ฝ้าอุ้มน้ำจนย้อย อาจหล่นลงมาทั้งแผ่น อย่ายืนข้างใต้ กันพื้นที่ไว้ให้ช่างรื้อ | ⚠️ กรมโยธาธิการและผังเมือง, กรมควบคุมโรค [dpt-manual] [ddc-59806] |
| 32 | หลังน้ำลด | ห้องนั่งเล่น | เชื้อราบนผนัง | ปิดห้องเปิดแอร์ ให้แห้งไวๆ | ใส่หน้ากาก N95 ถุงมือยาง เปิดประตูหน้าต่าง แล้วค่อยเช็ด | เจอเชื้อรา ใส่หน้ากาก N95 ถุงมือยาง เปิดหน้าต่าง ห้ามเปิดพัดลมตอนเช็ด | ✅ กรมควบคุมโรค, กรมอนามัย [ddc-manual] [anamai-mould] |
| 33 | หลังน้ำลด | ห้องนั่งเล่น | เครื่องปั่นไฟในบ้าน | แง้มหน้าต่างนิดหน่อยก็พอ | ปิดเครื่อง แล้วย้ายไปตั้งนอกบ้านในที่โล่ง อากาศถ่ายเทดี | เครื่องปั่นไฟห้ามใช้ในบ้านหรือที่อับ ไอเสียมีก๊าซพิษไม่มีกลิ่น ตั้งไว้ข้างนอก | ✅ กรมควบคุมโรค [ddc-manual] |
| 34 | หลังน้ำลด | ห้องนั่งเล่น | มีไข้หลังลุยน้ำ | ซื้อยาแก้ปวดกินเอง เดี๋ยวก็หาย | รีบไปหาหมอ แล้วบอกว่าเคยลุยน้ำหรือโคลนมา | ไข้สูง ปวดน่อง หลังลุยน้ำ รีบไปหาหมอ บอกว่าลุยน้ำมา อย่าซื้อยากินเอง | ✅ กรมควบคุมโรค [ddc-lepto] [ddc-59806] [ddc-dengue] |
| 35 | หลังน้ำลด | ครัว | กลิ่นแก๊สในครัว | เปิดไฟดูว่ารั่วตรงไหน | ห้ามกดสวิตช์ ห้ามจุดไฟ เปิดหน้าต่าง ปิดวาล์ว แล้วออกไปโทรแจ้งข้างนอก | ได้กลิ่นแก๊ส ห้ามกดสวิตช์ ห้ามจุดไฟ เปิดหน้าต่าง ปิดวาล์ว แล้วออกไปโทรแจ้ง | ✅ ปภ., กรมควบคุมโรค [ddpm-gas] [ddc-manual] |
| 36 | หลังน้ำลด | ครัว | อาหารที่โดนน้ำท่วม | ล้างน้ำให้สะอาดแล้วกินต่อได้ | ทิ้งทั้งหมด แม้จะอยู่ในถุงหรือกล่อง | อาหารที่โดนน้ำท่วม ทิ้งไปอย่าเสียดาย แม้จะอยู่ในถุงหรือกล่องก็ตาม | ✅ กรมควบคุมโรค, กรมอนามัย [ddc-59984] [anamai-kitchen] |
| 37 | หลังน้ำลด | ครัว | กระป๋องบุบ บวม เป็นสนิม | เคาะให้กลับเป็นรูปเดิมแล้วเก็บไว้ | ทิ้งกระป๋องที่บุบ บวม รั่ว หรือเป็นสนิม | กระป๋องบุบ บวม รั่ว หรือเป็นสนิม ทิ้งไปเลย ไม่ควรกิน | ✅ อย., กรมอนามัย [fda-cans] [anamai-cans] |
| 38 | หลังน้ำลด | ครัว | น้ำประปาหลังน้ำลด | ดื่มจากก๊อกได้เลย น้ำประปาสะอาดอยู่แล้ว | เปิดน้ำทิ้งจนใส แล้วต้มให้เดือดก่อนดื่ม หรือดื่มน้ำขวดที่ได้มาตรฐาน | หลังน้ำลด เปิดน้ำทิ้งจนใส ต้มให้เดือดก่อนดื่ม หรือดื่มน้ำขวดที่ได้มาตรฐาน | ✅ กรมอนามัย, กปน., กปภ. [anamai-water] [mwa-safe] [pwa-repair] [mwa-tank] |
| 39 | หลังน้ำลด | ครัว | น้ำยาฟอกขาว + น้ำยาล้างห้องน้ำ | ผสมกันในถัง จะได้แรงๆ | ใช้ทีละอย่าง ห้ามผสมกัน เปิดประตูหน้าต่างระหว่างใช้ | ห้ามผสมน้ำยาฟอกขาวกับน้ำยาล้างห้องน้ำ เกิดก๊าซพิษ ใช้ทีละอย่าง เปิดหน้าต่าง | ✅ อย., กรมควบคุมโรค [fda-bleach] [ddc-manual] |
| 40 | หลังน้ำลด | ครัว | ตู้ใต้ซิงก์ | ล้วงมือเข้าไปหยิบของออกมาเลย | ถอยห่าง ส่องไฟฉาย ใช้ไม้ยาวเปิดดู ถ้าเป็นงูให้แจ้งเจ้าหน้าที่ | ตู้มืดๆ อาจมีงูหรือตะขาบหลบ ส่องไฟฉาย ใช้ไม้ยาวเปิดดูก่อน อย่าล้วงมือ | ✅ กรมควบคุมโรค [ddc-45196] [ddc-manual] [ddc-snake] |
<!-- TABLE:END -->

## Flags: please review these

Items marked ⚠️, with the reason:

<!-- NOTES:START -->
- ✅ **เบรกเกอร์ไฟหลัก** (`p-breaker`): The 'only while dry, on dry ground' condition combines MEA (stand on dry ground, rubber shoes) and PEA (never operate switches while wet).
- ⚠️ **มือถือและพาวเวอร์แบงก์** (`p-phone`): Phone + power bank are on DDPM kit lists; 'charge fully' and 'save numbers' are practical inferences, not official wording.
- ✅ **ถุงทรายหน้าประตู** (`p-sandbags`): How full to fill the bags varies by source (½ in a US guide, ⅓ from a BMA district engineer, unconfirmed), so the game gives no fill ratio.
- ⚠️ **รถยนต์** (`p-car`): The bridge/expressway warning comes from a 2011 Metropolitan Police request; no 2024–2026 restatement was found.
- ⚠️ **ยาประจำตัวและชุดปฐมพยาบาล** (`p-meds`): The 7-day figure comes from a 2013 Ministry of Public Health statement (news report); DDPM gives no day count for medicine.
- ⚠️ **เบอร์โทรฉุกเฉิน** (`p-numbers`): All five numbers verified (1555 via PRD, 1 Oct 2026). 'Save them in every phone' is a practical inference, not official wording.
- ⚠️ **สารเคมีใต้ซิงก์** (`p-chem`): No official Thai source found that says 'store chemicals high before a flood'; the advice is inferred from DDC's after-flood chemical guidance. Please confirm with an agency.
- ⚠️ **ท่อระบายน้ำที่พื้นครัว** (`p-drain`): Official wording says 'plug toilets/drains'; the sandbag or water-bag method itself is common practice, not official wording.
- ⚠️ **โถส้วมชั้นล่าง** (`p-toilet`): Official wording: 'plug the toilet'. Using a sandbag in the bowl is the widely shared method, not official wording.
- ⚠️ **น้ำมันและยาฆ่าหญ้าในโรงรถ** (`p-fuel`): Same gap as p-chem: 'store high before flooding' is inferred, not official wording. Garage room not in the MVP.
- ✅ **ผนังบ้านร้าว** (`r-crack`): DPT manual read from a third-party copy (dpt.go.th unreachable). DPT has run free inspections (hotline 1531 reported in Dec 2025; not used in game copy).
- ⚠️ **ฝ้าเพดานอุ้มน้ำ** (`r-sag`): DPT confirms flooded gypsum must be removed/replaced; 'it can fall, don't stand under it' is an inference, not official wording.
- ✅ **กลิ่นแก๊สในครัว** (`r-gas`): DDPM wording via a Thai PBS report (2022); DOEB pages were unreachable. Fire/rescue 199 is cited only by news, so it is not used in game copy.
- ✅ **ตู้ใต้ซิงก์** (`r-cupboard`): DDC names dark corners and hidden spots rather than cupboards specifically.
<!-- NOTES:END -->

General flags:

1. **Recheck the agency's own page before launch.** Several agency sites blocked automated access (listed above). Their wording here is taken from PRD reposts or news quotes. Before launch, compare against the agencies' own infographics, or ask a contact at ปภ., กรมควบคุมโรค or กรมอนามัย to skim the table.
2. **Numbers that disagree between sources were kept out of the game copy:**
   - Sandbag fill: ½ (a US guide) vs ⅓ (a BMA district engineer, unconfirmed).
   - Bleach dilution for mould: 1:10 vs 3–5 tbsp per gallon.
   - Boiling time: 1 vs 1–3 vs 3–5 minutes.
   - Downed-line distance: PEA's 3–5 m is used. Other figures in circulation are 1–1.5 m (walking past standing poles) and 2–3 m (unattributed).
3. **Agencies outside your list:** some facts come from bodies you didn't name, because the listed five don't cover them:
   - Vehicles: กรมการขนส่งทางบก, คปภ., ตำรวจจราจร.
   - Structure: กรมโยธาธิการและผังเมือง.
   - Bleach and cans: อย.
   - Tap water: กปน., กปภ.
   - Tying up the gas cylinder: กรมประชาสัมพันธ์.
4. **Hotlines:**
   - Verified: **1784, 1555, 1669, 1130, 1129**.
   - Added: **1323**, the mental-health line (verified on dmh.go.th), to the help list.
   - Not used: **192**, which appears to be wrong (the national disaster warning centre is part of ปภ., so use 1784). **199** (fire/rescue) appears only in news, so it is not in the game.
5. **Kept out on purpose, either for the content guardrails or because no official wording was found:**
   - Electric-shock rescue steps: they depict an injured person.
   - Wading-depth thresholds: close to drowning, and unverified.
   - "Wait for the official all-clear before going home": not found.
   - "Photograph your documents": not found.
6. **Sources conflict on soaked mattresses.** กรมอนามัย says clean and sun-dry bedding; a 2011 กรมวิทยาศาสตร์การแพทย์ statement says throw soaked mattresses away. This is not in the game; it needs your decision before the bedroom room ships.

## Content ready for the later rooms

These are in the table now. Each needs only art once its room ships:

- **ห้องน้ำ:** `p-toilet`. Candidates:
  - emergency toilet kit (กรมอนามัย: black bag plus 2 tbsp lime or ash, verified)
  - keep feet clean and dry (กรมควบคุมโรค)
- **ห้องนอน:** candidates:
  - valuables upstairs (ปภ.)
  - check clothes before wearing (กรมควบคุมโรค)
  - stress after the flood, 1323 (กรมสุขภาพจิต)
  - soaked mattress (see flag 6)
- **โรงรถ:** `p-fuel`. Candidates:
  - a submerged motorbike (same DLT advice as cars)
  - bagging flooded chemical containers (กรมควบคุมโรค manual)

## References

<!-- REFS:START -->
- **[bma-1555]** กทม. — แจ้งเหตุผ่าน Traffy Fondue หรือ สายด่วน กทม. 1555 (2026-10-01) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/546911>
- **[bma-floodsupport]** กทม. — BMA Flood Support — ศูนย์พักพิง จุดจอดรถ รถรับ-ส่ง แยกตาม 50 เขต · _agency site_  
  <https://floodsupport.bangkok.go.th/>
- **[mwa-safe]** กปน. — น้ำประปาของ กปน. ยังคงสะอาด ปลอดภัย ได้มาตรฐาน WHO ในทุกสถานการณ์ (2026-10-04) · _agency site_  
  <https://www.mwa.co.th/mwa-flood-3-10-2/>
- **[mwa-tank]** กปน. — น้ำลดแล้ว มาล้างบ่อพักน้ำกันเถอะ · _agency site_  
  <https://www.mwa.co.th/wp-content/uploads/2022/12/cleantank.pdf>
- **[pwa-repair]** กปภ. — หลังน้ำลด ตรวจสอบความเสียหายของระบบประปาภายในบ้านและซ่อมแซมก่อนใช้น้ำ (2019-09-03) · _agency site_  
  <https://www.pwa.co.th/news/view/76258>
- **[mea-1130]** กฟน. — MEA Call Center 1130 ตลอด 24 ชั่วโมง (กรุงเทพฯ นนทบุรี สมุทรปราการ) (2026-09-27) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/545235>
- **[mea-2022]** กฟน. — กฟน. แนะก่อนน้ำท่วม ปลดเมนเบรกเกอร์ ยืนที่แห้งและสวมรองเท้ายาง; ห้ามใช้ปลั๊ก/สวิตช์ที่น้ำท่วมถึงจนกว่าผู้เชี่ยวชาญตรวจ (2022-09-17) · _news quoting the agency_  
  <https://www.dailynews.co.th/news/1481017/>
- **[mea-gov]** กฟน. — ให้ช่างผู้ชำนาญตรวจระบบไฟฟ้า เครื่องใช้ไฟฟ้า ปลั๊ก สวิตช์ ที่เคยถูกน้ำท่วมก่อนนำกลับมาใช้ (2026-09-29) · _news quoting the agency_  
  <https://www.amarintv.com/news/politic/558914>
- **[pea-1348]** กฟภ. — PEA แนะนำพบคนถูกไฟฟ้าดูดต้องทำอย่างไร — สายไฟขาดให้อยู่ห่างอย่างน้อย 3–5 เมตร แจ้ง 1129 (2025-11-15) · _agency site_  
  <https://www.pea.co.th/news/corporate-news/1348>
- **[pea-1372]** กฟภ. — PEA แจ้งดับไฟบางพื้นที่เนื่องจากน้ำท่วมสูง — ขณะตัวเปียกหรือยืนแช่น้ำ ห้ามเปิด–ปิดสวิตช์ไฟฟ้า (2025-11-22) · _agency site_  
  <https://www.pea.co.th/news/corporate-news/1372>
- **[pea-1384]** กฟภ. — PEA เตือนความปลอดภัยไฟฟ้าช่วงน้ำท่วม — ห้ามนำเครื่องใช้ไฟฟ้าที่เปียกน้ำกลับมาใช้ และห้ามซ่อมเอง (2025-11-24) · _agency site_  
  <https://www.pea.co.th/news/corporate-news/1384>
- **[pea-1415]** กฟภ. — PEA แนะนำประชาชนเตรียมตัวเข้าบ้านหลังน้ำลด (2025-11-27) · _agency site_  
  <https://www.pea.co.th/news/corporate-news/1415>
- **[pea-943]** กฟภ. — PEA แนะนำการใช้ไฟฟ้า ในกรณีที่มีน้ำท่วมหรือน้ำท่วมขัง (2025-05-29) · _agency site_  
  <https://www.pea.co.th/news/corporate-news/943>
- **[pea-service]** กฟภ. — ธุรกิจและบริการของ PEA — 74 จังหวัด ยกเว้นกรุงเทพฯ นนทบุรี สมุทรปราการ; PEA Contact Center 1129 · _agency site_  
  <https://www.pea.co.th/about-pea/pea-service>
- **[dlt-car]** กรมการขนส่งทางบก — ห่วงใยผู้ประสบภัยน้ำท่วม — ห้ามสตาร์ทรถที่จมน้ำเด็ดขาด น้ำลดแล้วยกรถเข้าศูนย์/อู่ตรวจละเอียด เคลื่อนย้ายสัตว์เลี้ยงและพาหนะขึ้นที่สูง (2026-09-27) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/545262>
- **[ddc-45196]** กรมควบคุมโรค — เตือนพื้นที่น้ำท่วม ระวังสัตว์มีพิษกัดต่อย ไฟฟ้าช็อต — สำรวจเสื้อผ้าและรองเท้าก่อนสวมใส่ (2024-08-06) · _agency site_  
  <https://ddc.moph.go.th/brc/news.php?deptcode=&news=45196>
- **[ddc-56084]** กรมควบคุมโรค — เตือนโรคและภัยสุขภาพที่มากับน้ำท่วม — ล้างแผลให้สะอาด ปิดแผลด้วยพลาสเตอร์กันน้ำ (2025-10-09) · _agency site_  
  <https://www.ddc.moph.go.th/brc/news.php?news=56084&deptcode=brc&news_views=1281>
- **[ddc-59806]** กรมควบคุมโรค — ฝนตกหนัก น้ำเพิ่มสูง กรมควบคุมโรค แนะป้องกัน 'ไข้ฉี่หนู – เมลิออยโดสิส' และห้ามเปิด–ปิดระบบไฟฟ้าด้วยตนเอง (2026-08-24) · _agency site_  
  <https://ddc.moph.go.th/brc/news.php?news=59806&deptcode=brc>
- **[ddc-59984]** กรมควบคุมโรค — น้ำลดไม่ได้แปลว่าความเสี่ยงลดลงทันที — ไม่กินอาหารที่สัมผัสน้ำท่วม (2026-09-03) · _agency site_  
  <https://www.ddc.moph.go.th/brc/news.php?news=59984&deptcode=brc&news_views=175>
- **[ddc-dengue]** กรมควบคุมโรค — สถานการณ์โรคไข้เลือดออก — ห้ามใช้ยากลุ่ม NSAIDs เช่น แอสไพริน ไอบูโพรเฟน (2024-09-06) · _agency site_  
  <https://ddc.moph.go.th/uploads/ckeditor2//files/แจ้งเตือนโรคไข้เลือดออก_edit2024.09.06.pdf>
- **[ddc-lepto]** กรมควบคุมโรค — โรคเลปโตสไปโรสิส (Leptospirosis) — กองระบาดวิทยา (2024-09-06) · _agency site_  
  <https://ddc.moph.go.th/uploads/ckeditor2//files/แจ้งเตือนโรค Leptospirosis 9.9.2024.pdf>
- **[ddc-manual]** กรมควบคุมโรค — คู่มือความปลอดภัยในการดูแลบ้านหลังน้ำลด (กองโรคจากการประกอบอาชีพและสิ่งแวดล้อม) (2025-11) · _agency site_  
  <https://ddc.moph.go.th/uploads/publish/1761920260602112057.pdf>
- **[ddc-odpc11]** กรมควบคุมโรค — สคร.11 — ระวังบาดแผลจากของมีคม เศษแก้ว ที่อาจติดเชื้อแทรกซ้อน (2025-11-04) · _agency site_  
  <https://www.ddc.moph.go.th/odpc11/news.php?news=56610&deptcode=odpc11&news_views=165>
- **[ddc-odpc6]** กรมควบคุมโรค — สคร.6 — ทำความสะอาดร่างกายและเช็ดให้แห้ง เก็บกวาดวัตถุแหลมคม ตะปู (2025-09-03) · _agency site_  
  <https://www.ddc.moph.go.th/odpc6/news.php?news=55330&deptcode=odpc6&news_views=1018>
- **[ddc-rainy]** กรมควบคุมโรค — ประกาศเตือนป้องกันโรคและภัยสุขภาพช่วงฤดูฝน — งูพิษกัดรีบไปโรงพยาบาล ห้ามขันชะเนาะ; ล้างคว่ำภาชนะกันยุงลาย (2021-05-22) · _agency site_  
  <https://ddc.moph.go.th/brc/news.php?news=18659&deptcode=brc&news_views=1>
- **[ddc-snake]** กรมควบคุมโรค — ป้องกันงูพิษ (อินโฟกราฟิก กองป้องกันการบาดเจ็บ) — ไฟฉาย ไม้ รองเท้าหุ้มส้น (2024-07-16) · _agency site_  
  <https://www.ddc.moph.go.th/dip/journal_detail.php?publish=15881&deptcode=dip>
- **[prd-72h]** กรมประชาสัมพันธ์ — เช็กลิสต์ถุงยังชีพ เพื่อการเอาตัวรอดใน 72 ชั่วโมงแรก (น้ำดื่มอย่างน้อย 3 ลิตร/คน/วัน) (2026-08-19) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/35/iid/533126>
- **[prd-flood]** กรมประชาสัมพันธ์ — รับมือน้ำท่วมอย่างตั้งสติ — กระสอบทรายที่ประตู อุดชักโครก/ท่อน้ำทิ้งชั้นล่าง ปิดวาล์วและผูกยึดถังแก๊ส เส้นทางไปศูนย์พักพิง (2026-08-22) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/31/iid/534015>
- **[dpt-manual]** กรมโยธาธิการและผังเมือง — เตรียมบ้านให้พร้อมอยู่ คู่มือตรวจสอบและซ่อมแซมบ้านหลังน้ำลด · _agency site_  
  <https://data.yotathai.org/d/aa44yb.pdf>  
  เอกสารทางการ อ่านจากสำเนาบนเว็บไซต์ภายนอก เพราะ dpt.go.th เข้าไม่ได้ระหว่างตรวจ
- **[dmh-1323]** กรมสุขภาพจิต — 1323 สายด่วนสุขภาพจิต ปรึกษาฟรีตลอด 24 ชั่วโมง · _agency site_  
  <https://dmh.go.th/>
- **[anamai-cans]** กรมอนามัย — กรมอนามัย แนะผู้ประสบภัยน้ำท่วม กินอาหารสะอาด — กระป๋องไม่ปูดบวม ไม่เป็นสนิม (2021-09-02) · _news quoting the agency_  
  <https://mgronline.com/qol/detail/9640000086929>
- **[anamai-elderly]** กรมอนามัย — 10 วิธีดูแลผู้สูงอายุ 'ติดบ้าน ติดเตียง' ในช่วงน้ำท่วม — เตรียมยาที่ใช้ประจำและอุปกรณ์ช่วยพยุงตัว · _agency site_  
  <https://multimedia.anamai.moph.go.th/infographics/info854_flood_59/>  
  หน้าเว็บตอบกลับ 503 ระหว่างตรวจ ยืนยันจากข้อความดัชนีค้นหา
- **[anamai-kitchen]** กรมอนามัย — ล้างครัว หลังน้ำลด (อินโฟกราฟิก) — อาหารที่ถูกน้ำท่วมให้ทิ้ง · _agency site_  
  <https://multimedia.anamai.moph.go.th/infographics/info742_flood_16/>  
  หน้าเว็บตอบกลับ 503 ระหว่างตรวจ ยืนยันจากข้อความดัชนีค้นหา
- **[anamai-mould]** กรมอนามัย — กรมอนามัย แนะกำจัดเชื้อราหลังน้ำลด — เปิดประตูหน้าต่าง ห้ามเปิดพัดลม/แอร์ขณะทำความสะอาด สำรวจโครงสร้างก่อนเข้าบ้าน (2022-10-28) · _news quoting the agency_  
  <https://mgronline.com/qol/detail/9650000103126>
- **[anamai-pets]** กรมอนามัย — สุขอนามัยของสัตว์เลี้ยงในศูนย์พักพิงช่วงน้ำท่วม — วัคซีนพิษสุนัขบ้า กรง/สายจูง ปลอกคอและป้ายชื่อ (2026-10-06) · _agency site_  
  <https://anamai.moph.go.th/th/news-anamai/45265>
- **[anamai-stock]** กรมอนามัย — สำรองอาหารแห้ง/อาหารกระป๋อง อย่างน้อย 3–5 วัน เก็บในภาชนะปิดสนิท (2025-11-17) · _news quoting the agency_  
  <https://www.thansettakij.com/health-wellness/health/644224>
- **[anamai-water]** กรมอนามัย — น้ำท่วม–น้ำลด เรื่อง 'น้ำ' อย่ามองข้าม — น้ำประปาควรต้มให้เดือดก่อนบริโภค เลือกน้ำบรรจุขวดที่ได้มาตรฐาน (2026-09-27) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/545269>
- **[tmd-warn]** กรมอุตุนิยมวิทยา — ประกาศเตือนภัยลักษณะอากาศ (สายด่วน 1182) · _agency site_ · not cited yet  
  <https://www.tmd.go.th/warning-and-events/warning-storm>
- **[moph-7days]** กระทรวงสาธารณสุข — ผู้มีโรคประจำตัวเตรียมยาไว้อย่างน้อย 7 วัน เตรียมน้ำและอาหารอย่างน้อย 3 วัน (2013-09-26) · _news quoting the agency_  
  <https://mgronline.com/qol/detail/9560000121611>
- **[moph-snakebite]** กระทรวงสาธารณสุข — ถูกงูกัด ห้ามกรีด ดูด หรือพอกยา รีบไปโรงพยาบาลหรือโทร 1669 (2019-05-29) · _news quoting the agency_  
  <https://www.thaipbs.or.th/news/content/280457>
- **[police-tow]** กองบังคับการตำรวจจราจร — รถจมน้ำ อย่าฝืนขับ! รถยกช่วยเหลือฟรี สายด่วนจราจร 1197 (2026-09-27) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/545362>
- **[oic-photo]** คปภ. — ถ่ายภาพรถทั้งภายนอก ภายใน ห้องเครื่อง และรอยคราบน้ำ เป็นหลักฐานเคลมประกัน (2026-09-27) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/33/iid/545410>
- **[ddpm-1784]** ปภ. — สายด่วนนิรภัย 1784 (ฟรี ตลอด 24 ชั่วโมง) · _news quoting the agency_  
  <https://www.bangkokbiznews.com/news/news-update/1237412>
- **[ddpm-6kit]** ปภ. — ปภ. แนะเตรียม 'ถุงยังชีพฉุกเฉิน' 6 สิ่งต้องมี · _news quoting the agency_  
  <https://www.bangkokbiznews.com/news/news-update/1183355>
- **[ddpm-amarin]** ปภ. — ปภ. แนะเตรียมของจำเป็น: อุปกรณ์ชาร์จไฟและแบตสำรอง ไฟฉาย เอกสารในถุงกันน้ำ อาหารและยาอย่างน้อย 3–4 วัน (2025-04-01) · _news quoting the agency_  
  <https://www.amarintv.com/news/social/510554>
- **[ddpm-gas]** ปภ. — วิธีป้องกัน-รับมือ ถังก๊าซรั่ว — ปิดวาล์ว เปิดประตูหน้าต่าง ห้ามเปิด-ปิดอุปกรณ์ไฟฟ้า ห้ามใช้พัดลม (2022-08-30) · _news quoting the agency_  
  <https://www.thaipbs.or.th/news/content/318924>
- **[ddpm-noru]** ปภ. — ปภ. แนะข้อปฏิบัติเตรียมรับมือ (พายุโนรู) — เก็บเอกสารในถุงกันน้ำ ขนของขึ้นที่สูง วางกระสอบทราย ช่วยเด็กและคนชราก่อน อพยพสัตว์เลี้ยง กำจัดขยะอุดท่อ (2022-09-28) · _news quoting the agency_  
  <https://www.bangkokbiznews.com/health/social/1029444>
- **[ddpm-south]** ปภ. — ปภ. แนะประชาชนพื้นที่ภาคใต้รับมือป้องกันน้ำท่วมอย่างปลอดภัย — สับคัทเอาท์ตัดไฟ อพยพสัตว์เลี้ยง ย้ายพาหนะไปที่ปลอดภัย (2024-11-29) · _news quoting the agency_  
  <https://www.thansettakij.com/news/general-news/613204>
- **[ddpm-mea]** ปภ. + กฟน. — ปภ. - MEA แนะวิธีเอาตัวรอดอย่างปลอดภัยในฤดูฝน — งดเสียบปลั๊กในบริเวณน้ำท่วม ปลดเบรกเกอร์ (2025-07-11) · _news quoting the agency_  
  <https://mgronline.com/qol/detail/9680000065431>
- **[niems-1669]** สพฉ. — เจ็บป่วยฉุกเฉิน โทร 1669 (ระบุในประกาศรับมือน้ำท่วมของกรมประชาสัมพันธ์) · _government channel (PRD)_  
  <https://www.prd.go.th/th/content/category/detail/id/31/iid/534015>
- **[thaiwater]** สสน. — คลังข้อมูลน้ำแห่งชาติ ThaiWater — ระดับน้ำ ฝน เรดาร์ · _agency site_ · not cited yet  
  <https://www.thaiwater.net/>
- **[police-2011]** สำนักงานตำรวจแห่งชาติ (บช.น.) — ขอความร่วมมือไม่นำรถมาจอดทางขึ้นลงทางด่วนและบนสะพาน เพราะกีดขวางการลำเลียงผู้ป่วย (2011-10-23) · _news quoting the agency_  
  <https://mgronline.com/crime/detail/9540000135203>
- **[fda-bleach]** อย. — อย. เตือน อย่านำน้ำยาซักผ้าขาวผสมน้ำยาล้างห้องน้ำ ทำให้เกิดก๊าซพิษ (2023-03-28) · _agency site_  
  <https://hazard.fda.moph.go.th/our-service/detergent/>
- **[fda-cans]** อย. — 4 เรื่องน่ารู้ของอาหารกระป๋อง — กระป๋องบุบ โป่งพอง เป็นสนิม ไม่ควรบริโภค (2020-03-09) · _agency site_  
  <https://dis.fda.moph.go.th/darabank/motion-05>
<!-- REFS:END -->

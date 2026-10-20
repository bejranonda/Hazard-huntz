# Changelog

This project uses [semantic versioning](https://semver.org/). Each release is tagged `vX.Y.Z` on `main` once its Cloudflare deploy has been checked.

## [Unreleased]

## [1.13.0] — 2026-10-21

**Six more tools: heat today, water, the tank, the emergency card, "I'm safe" and the bag.** The second half of the owner's "Continue to make all features step by step till all accomplished" (20 Oct 2026), after v1.12.0's masks and all-tools page, and of "Try to research to answer your questions yourself too": the open questions (which heat levels, which chlorine doses, what to tell 1669, what a bag holds) were researched, not asked ([ROADMAP N26](docs/ROADMAP.md#n26-six-more-tools-v1130)). Each tool asks one thing at a time by a tap, answers with a status word first, says its sources once and keeps what is typed or counted on the phone ([GUIDELINES rule 82](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). No item, room, slot or band changed: **houses and challenge links are the same.**

### Added

- **🌡️ ร้อนวันนี้ ต้องทำอะไร?** (`/hot`, `/?open=hot`): tap the heat-index level announced today (เฝ้าระวัง 27.0–32.9 · เตือนภัย 33.0–41.9 · อันตราย 42.0–51.9 · อันตรายมาก 52.0 °C ขึ้นไป) and see what everyone does and what the people at risk do (older people, young children, pregnant women, a long-term illness, outdoor workers, obesity, heavy drinkers). "🆘 อาการฮีทสโตรก · ช่วยเหลือเบื้องต้น" opens by itself from "danger": the signs, "ยังมีเหงื่อออกอยู่ ก็เป็นฮีทสโตรกได้" (the DMS), and call 1669, shade, lie down with the feet raised, loosen clothes, cold wet cloths at the neck, armpits and groin and a fan. It computes nothing ([#78](docs/KNOWN_ISSUES.md#78-a-heat-index-calculator-is-not-built)); "ยังไม่รู้ระดับ? 🌐 ดูประกาศกรมอุตุฯ" links the TMD. The heat guide's next step is now this tool. Sources: news reports quoting the BMA, the DOH and the DMS ([#90](docs/KNOWN_ISSUES.md#90-heat-today-rests-on-news-reports-quoting-the-agencies)).
- **💧 น้ำดื่มที่มี พอกี่วัน?** (`/water`): how many people (from the home check if answered), then + and − on 600 ml and 1.5-litre bottles, 6-litre jugs, 18.9-litre water-cooler bottles and other litres → "พอดื่มราว 2 วัน", the total, and how much more for 3 days at 3 litres a person a day (the PRD's figures, the same as the home check's).
- **🚰 ล้างถังพักน้ำหลังน้ำท่วม** (`/tank`): the tank's size (500 to 2,000 litres, or typed) and the chlorine → "ใช้ คลอรีนน้ำ 5% ราว 100 มล." (5 % liquid 100 ml, 10 % 50 ml, powder 60–65 % about 8 g per 1,000 litres: the MWA, 5 mg per litre, and the DDC's November 2025 manual agree), the six steps (never climb in: you could run out of air), both soak times ([#92](docs/KNOWN_ISSUES.md#92-the-tanks-soak-time-overnight-or-3-hours)), and rubber gloves, never mix with toilet cleaner, the water isn't for drinking.
- **🆔 บัตรข้อมูลฉุกเฉิน** (`/info`): name, long-term conditions, medicines and doses, allergies, hospital and HN, two contacts → a picture made on the phone (the plan card's layout) to keep in the wallet or as a lock screen, a copy as text, and cards for up to six people. Below: why (the Pharmacy Council's medicine list), where to keep it, and "☎️ โทร 1669 บอกอะไรบ้าง" (NIEMS: what happened, where with a landmark, the patient, any danger, your name and number).
- **💬 ส่งข่าวว่าปลอดภัย** (`/safe`): ✅ ปลอดภัยดี อยู่บ้าน · 🏃 ย้ายไปที่ปลอดภัยแล้ว · 🆘 ต้องการความช่วยเหลือ, an optional place (the plan's meeting places are buttons) and note → one message with the time, sent by the person through LINE, SMS or a copy. "Need help" shows 1784 and 1669 to call first and DDPM's LINE 1784. Nothing is sent or kept by the app.
- **🧳 กระเป๋าฉุกเฉิน** (`/bag`): the 12 things every bag holds (DDPM's six-item kit and its longer list; a whistle, cash and relatives' numbers from the Department of Mineral Resources), plus rows for the people the home check knows about (daily medicine and the medicine list, a baby, an older person, a pet); ticks kept on the phone, "จัดแล้ว 3 จาก 14", a print-out and a text of what is still missing.
- **Joined up:** the home check offers the water and bag tools; the plan form the emergency card and "I'm safe"; the bag the emergency card. The hub's season tiles are now: the flood season the bag and the fridge, after a flood the tank and masks, dust dust today and masks, the hot season heat today and dust today, the power cut the fridge and water. Each hazard page and guide lists the tools that fit it (`hazards.<h>.tools`). `/tools` lists 11 tools.
- **The sentences that describe the app** were rewritten once, in both languages, for v1.12.0's and v1.13.0's tools: the meta description, the About text, the manifest (and a "เครื่องมือทั้งหมด" shortcut), `llmsSummary` and `package.json` ([GUIDELINES rule 59](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **12 link previews** (`og/<tool>.png` and `og/en/<tool>.png`) and **13 sources** (145 in all): `bma-heat-posttoday-2569`, `doh-heatlevels-2569`, `doh-heatsigns-2569`, `dms-heatstroke-2566`, `bma-heataid-2569`, `ddc-tank-2568`, `dss-bleach-2568`, `pharm-medbook-2561`, `niems-call-2557`, `fema-older-2566`, `redcross-contact-2569`, `dmr-bag-2568`, `readygov-water-2564`. Lines resting on foreign guidance are ⚠️ ([#91](docs/KNOWN_ISSUES.md#91-six-tools-rest-partly-on-foreign-guidance)).

### Fixed

- **The English tools said "1 people"** (and "1 days"), live since v1.8.0 for a household of one ([F130](docs/KNOWN_ISSUES.md#in-v1130-21-oct-2026)).

### Checks

Build clean (start screen 294 KB, first game 309 KB); 44 unit tests (one new: the six tools' logic); SMOKE_N smoke checks on 18 Oct 2026, and on 5 Dec 2026 and 10 Apr 2027 (14 new: each tool, its controls at 44 px, its page, the English counts, nothing typed ever sent); a visitor walk of the six tools at 320 × 568 (Thai) and 360 × 640 (Thai and English), no errors and no sideways scroll, which found the "1 people" bug, a capital letter mid-sentence, a repeated heading in heat today and a line break in "เบื้องต้น", all fixed; axe clean on the six sheets and their pages; an independent cross-check (a scratch script with its own rules written from the sources, not `kitplan.js`) of water for 1–10 people and 216 mixes of bottles and other litres, the tank at 12 sizes and three chlorines, masks at every colour for every person and every other situation, the four heat bands, the bag's rows and the message's place: **2,263 agree, 0 disagree**. Not run: real phones.

## [1.12.0] — 2026-10-21

**"Do I need a mask, and which one?", every tool on one page, and the agencies' own pages.** The owner asked (20 Oct 2026) "When and where we need to wear the mask, and which type then? … can be develop also as a tool?", after asking for research into more tools and for the app to be "a tool portal too", and then: "Continue to make all features step by step till all accomplished", attractive, easy to use and worth recommending. Four researchers had worked in parallel (masks; calculators with sourced numbers; official Thai tools to link; preparedness apps abroad), and a fifth fetched the exact texts. This release builds the first half; v1.13.0 the rest ([ROADMAP N25](docs/ROADMAP.md#n25-masks-all-tools-and-the-agencies-own-pages-v1120)). No item, room, slot or band changed: **houses and challenge links are the same.**

### Added

- **😷 ใส่หน้ากากไหม แบบไหน?** (`/mask`, `/?open=mask`), one tap at a time: what for (dust or smoke from burning · cleaning up after a flood · a cough, fever or a crowded place · a factory fire nearby · a fire at home); for dust, today's colour and who (an adult or a child over 5 · a child of 2 to 5 · a child under 2 · over 60 · pregnant · heart or lung disease); for a clean-up, what (mould · dried mud · broken ceiling boards or tiles). The answer is a status word and its lines, then "😷 วิธีใส่ให้แนบ เมื่อไรต้องเปลี่ยน ซื้อแบบไหน".
  - **When** comes from the same lines as dust today (`mask: true`): everyone from orange, the PCD's at-risk people from yellow; "not yet" says from which colour. **Which kind** from the DOH (6 Feb 2025): an N95 first; older people, pregnant women and people with a long-term illness may use a 3-layer surgical mask; children of 2 to 5 a surgical mask that fits (⚠️); never exercise in an N95; take it off and go indoors if breathing gets hard. A child under 2 wears none (the DDC, ⚠️). Heart or lung disease: "follow your doctor's advice" (the PCD).
  - **A fire at home is "หนีออกจากบ้าน"**, with DDPM's cloth over the nose, crawling low, feeling the door, no lift, 199, and the fire guide: no mask, no card. **A factory fire nearby is "ออกห่างก่อน หน้ากากกันไม่ได้"** (the DOH after the Ming Dih fire; masks can't filter the fumes: a Chulalongkorn academic and Health Canada, ⚠️). **Clean-up** follows the DDC's November 2025 manual (mould and possible asbestos an N95, dried mud a surgical mask and a vacuum, children kept out). **Illness** follows the DDC (13 Aug 2026).
  - **How to wear it:** over the nose and under the chin; press the wire (Ramathibodi Hospital's poster); cup it and breathe out hard; change it when loose, harder to breathe, torn, dirty or wet; never share it or wash it to reuse; a Thai label (the OCPB); an N95's standard (NIOSH, EN149, GB2626); cloth isn't enough on high-dust days. **No number of masks:** no agency gives one, and the tool says so.
  - Dust today has "😷 ใส่หน้ากากแบบไหน? เด็ก ผู้สูงอายุ คนท้อง", which opens the mask tool on today's colour. `/mask` lists every line with its sources; the dust and flood pages link it.
- **🧰 เครื่องมือทั้งหมด** (`/tools`, `/?open=tools`, and a full-width button under the hub's tiles): the guides, the tools by "เตรียมไว้ก่อน" and "ใช้ตอนเกิดเหตุ", **📲 เปิดรับข้อความเตือนภัยในมือถือ** (DDPM's Cell Broadcast steps for iPhone and Android, iOS 18+ and Android 11+, about 8 seconds even on silent, real messages come from DDPM with no link, ⚠️ because menus differ by phone), and **13 agencies' own pages**: LINE ALERT, the TMD's warnings, ThaiWater, GISTDA's flood map and PM2.5 by subdistrict, Air4Thai, the TMD's latest earthquakes, MEA's and PEA's planned power cuts, DDPM's 1784 on LINE, DDPM's relief schemes (with "apply in ทางรัฐ or at your council or district office · don't tap links in an SMS or LINE offering a 'house survey' or money", the Royal Thai Police, 6 Oct 2026), the OIC's insurance line and the Anti-Fake News Center. Each guide shows the ones that fit it under "🔗 ดูข้อมูลจากหน่วยงาน", and each hazard page lists them.
- **The hub follows the season:** after the three main buttons, two tool tiles chosen by the recommended mode (`config.json → hub.season`: dust → dust today and masks; the flood season → the fridge and masks), and the fridge stays first while a power cut is being counted.
- **One list of tools** (`config.json → tools`: id, icon, group), read by the app, the build and `/tools`.
- **`npm run links`** (`tools/links.mjs`): opens every agency link and says what answered, a bot check (BLK) or an error; run monthly, then update `checked` (the build warns after 120 days).
- **A test that keeps emoji at Unicode 11 or older** in every content file (three new icons were newer and were replaced before release).
- **11 sources** (132 in all): `doh-maskchoice-2568`, `doh-chemfire-2564`, `chula-chemmask-2564`, `ddc-resp-2569`, `ocpb-mask-2569`, `rama-n95-2558`, `cb-ddpm-2569`, `cb-test-2569`, `cb-menu-2569`, `police-fakelink-2569`, `ddpm-relief-2569`; `ddc-manual` now quotes its mask, mud, asbestos and children lines, and `ddpm-app-2569` the app's spelling. One new event, `link_click`, in both allowlists.

### Not yet

The sentences that describe the whole app (the meta description, the manifest, `llmsSummary`, `package.json`) are rewritten once, in v1.13.0, when the rest of the tools ship ([GUIDELINES rule 59](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).

### Checks

Build clean (start screen 276 KB, first game 290 KB); 43 unit tests; 183 smoke checks on 18 Oct 2026, and on 5 Dec 2026 and 10 Apr 2027; a visitor walk at 320 × 568, 360 × 640 (Thai, English, ก+) with no errors and no sideways scroll; `npm run links`: 11 of 13 answered (Air4Thai 503, the certificate of [#86](docs/KNOWN_ISSUES.md#86-air4thais-server-sends-the-wrong-certificate-chain); PEA's page a bot check). Not run: real phones.

## [1.11.1] — 2026-10-20

**Dust today no longer puts a mask on a baby.** The owner asked (20 Oct 2026) "When and where we need to wear the mask, and which type then?", and the research for it found that dust today's at-risk lines ("ใส่หน้ากากกันฝุ่น PM2.5 ทุกครั้งที่ออกนอกบ้าน" at yellow and orange) cover the group "เด็กไม่เกิน 5 ขวบ", babies included. The lines follow the PCD's notice, which has no infant exception, but the DDC spokesperson (InfoQuest, 27 Jan 2025) says "เด็กเล็กที่อายุน้อยกว่า 2 ปี ไม่แนะนำให้ใส่หน้ากากทุกชนิด", and Health Canada agrees (respirators "shouldn't be used by children under 2"). No item, room, slot or band changed: **houses and challenge links are the same** ([ROADMAP N24](docs/ROADMAP.md#n24-masks-and-children-under-2-v1111)).

### Fixed

- **Every dust level that says "wear a mask" now also says** "👶 เด็กต่ำกว่า 2 ขวบ ไม่ควรใส่หน้ากากทุกชนิด ให้อยู่ในห้องที่กันฝุ่นได้ และอย่าพาไปที่ฝุ่นเยอะ ⚠️" (กรมควบคุมโรค · กรมอนามัย · สำนักงานสาธารณสุขแคนาดา), in the tool, its shared text and `/air` ([F129](docs/KNOWN_ISSUES.md#in-v1111-20-oct-2026)). It is ⚠️ `partial`: the same news article also lists muslin masks as suiting under-2s, so a paediatrician confirms ([ROADMAP L10](docs/ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)). The lines that mention a mask carry `mask: true` in `kit.json → air`, and the build fails if one doesn't, or if the under-2 line (`air.baby`) is missing or cites a number its sources don't have.

### Added

- Two sources (121 in all): `ddc-mask-2568` (InfoQuest quoting the MOPH and DDC spokespeople, 27 Jan 2025, read word for word) and `hc-respirator-2569` (the Public Health Agency of Canada, page date 6 Oct 2026, `international`).
- [KNOWN_ISSUES #86](docs/KNOWN_ISSUES.md#86-air4thais-server-sends-the-wrong-certificate-chain): Air4Thai's server sends the wrong intermediate certificates, so `curl` refuses it; Chromium opens it; an Android in-app browser may warn. The app links it from dust today and the dust mode; a phone test decides.

### Checks

Build clean; 40 unit tests (the dust test now checks the under-2 line at every level); 165 smoke checks on 18 Oct 2026 (two new); `npm run check:docs`. Not run: real phones.

## [1.11.0] — 2026-10-20

**Food by food in a power cut, and the whole app for its real readers.** On 20 Oct 2026 the owner wrote: "# fridge — จริงแล้วควรคำนวณว่า ของอะไรในตู้เย็นได้นานแค่ไหน # usability — Please analyse the usability and practical use of the app, the try to improve and revise the whole app. # target and main users — Please research who can be potential users who get from line and social media in Thailand." ("Fridge: really, it should work out how long each thing in the fridge keeps"), with the usual process: UI/UX suggestions validated for consistency, a test as visitors, the output validated and cross-validated, frank suggestions, the integration, every doc updated and a commit. Four research agents worked in parallel: the fridge's sources food by food; the Thai audience on LINE and social media (now [docs/07-audience.md](docs/07-audience.md), 50 sources); visitor audit A, an older relative in LINE's in-app browser at 360 × 640 and 320 × 568 with the text at 1.3× (28 findings, one blocker); and visitor audit B, a parent preparing at the weekend, an English reader and a consistency check at 390, 360 and 768 px (29 findings, nine major). Their findings became one decision list, built in batches ([ROADMAP N23](docs/ROADMAP.md#n23-food-by-food-and-the-app-for-its-real-readers-v1110), [KNOWLEDGE §33](docs/KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110), [APPROACH §32](docs/APPROACH_AND_METHOD.md#32-four-researchers-in-parallel-then-one-decision-list-v1110)). The audit's one blocker was ours: since v1.10.0 the fridge tool said "Ready.gov แนะให้ทิ้ง" for any cold medicine after a day, insulin included, which the US FDA says keeps 28 days at 15–30 °C (F96). The same "discard" was in the game's power-cut lesson `s-medcold` since v1.7.0; found while documenting, it was reworded in this release (F128), so **an "UPDATE:" post is due**. No item, room, slot or `houseVersion` changed, and no hour, dust band or dust line: **houses and challenge links are the same,** and the game's advice is the same except that one lesson.

### Added

- **The fridge, food by food** ([KNOWLEDGE §33.2–33.4](docs/KNOWLEDGE.md#332-the-fridge-food-by-food-the-model-and-the-content)). The fridge's 4 hours decide when, and each food's row of FoodSafety.gov's and USDA FSIS's charts decides what; the charts' "above 4 °C for more than 2 hours" needs a thermometer, so it isn't shown, and the two times are never added. Under the fridge's card, before 4 hours, "❌ ถ้าเกิน 4 ชม. ต้องทิ้ง" over 9 foods (🥩 เนื้อสัตว์ ปลา กุ้ง ทั้งดิบและสุก · 🌭 ลูกชิ้น ไส้กรอก หมูยอ แฮม · 🍛 กับข้าวที่เหลือ แกง ต้ม ผัด เต้าหู้ · 🍚 ข้าวสุก ข้าวเหนียว เส้นสด ขนมจีน · 🥚 ไข่ ทั้งดิบและต้ม · 🥛 นมสด นมที่เปิดแล้ว นมเปรี้ยว โยเกิร์ต น้ำเต้าหู้ · 🍼 นมผงที่ชงแล้ว · 🥭 ผักผลไม้ที่หั่นแล้ว ผักสลัดถุง · 🍰 เค้กครีม ขนมไส้ครีม สังขยา) and "✅ ไม่ต้องทิ้งเพราะไฟดับ" over 4 (🥕 ผักผลไม้ทั้งลูกที่ยังไม่หั่น ผักสมุนไพรสด · 🍞 ขนมปัง เค้กที่ไม่มีครีม · 🧀 เนย มาการีน ชีสแข็ง ชีสแผ่น · 🍯 ซีอิ๊ว ซอสมะเขือเทศ แยม เนยถั่ว); from 4 hours "❌ ทิ้ง" and "✅ เก็บได้ ถ้าไม่ขึ้นรา ไม่มีกลิ่น สี หรือเนื้อผิดปกติ" (FSIS); always "ของที่ไม่อยู่ในรายการ ไม่แน่ใจให้ทิ้ง". In the hour before 4 hours, the CDC's tip: "มีกระติกกับน้ำแข็ง? ย้ายของสดไปใส่ แล้วเติมน้ำแข็งให้เย็นตลอด". Once the freezer's time is up, "ดูทีละห่อตามรายการด้านล่าง" and 4 packs: meat, fish and prawns, and frozen ready meals, dumplings and buns refreeze if they still have ice crystals and go if fully thawed; ice cream goes once it starts to melt; bread refreezes either way. A new line under "จำไว้": "🌡️ ห้องร้อนหรือเปิดตู้บ่อย ของจะอยู่ได้สั้นกว่าเวลาข้างบน" (the UK FSA, which gives no number, so the tool gives none). **Left out on purpose:** น้ำปลา (the chart's "Fish sauces, oyster sauce: Discard" row; Thai fish sauce is a cupboard condiment, and the opposite has no source), opened fruit juice and coconut (the US sources disagree), mayonnaise (its rule needs a thermometer), oyster sauce (sourced, not on the short list), and น้ำพริก, กะปิ, กะทิ, ซอสพริก, Thai coconut desserts and ice (in no source). **Flagged for the Thai reviewer:** eggs (US: throw out; Thai shops often sell eggs unrefrigerated, an observation with no source) and ลูกชิ้น and หมูยอ under the "lunchmeats, hot dogs, sausage" row ([KNOWN_ISSUES #79](docs/KNOWN_ISSUES.md#79-the-fridges-food-lists-rest-on-us-charts)). Content `kit.json → fridge.foods` (13, each with a `short` name for the shared text) and `fridge.frozen` (4); logic `fridgeFoods()` in `kitplan.js`.
- **Insulin, other cold medicine and breast milk** ([KNOWLEDGE §33.5](docs/KNOWLEDGE.md#335-medicine-and-breast-milk)). The tick reads "💊 มียาที่ต้องเก็บในตู้เย็น เช่น อินซูลิน" and adds two cards: 💉 อินซูลิน, "✅ ยังใช้ได้ · เก็บนอกตู้เย็นได้ถึง 28 วัน ถ้าไม่ร้อนเกิน 30°C ไม่โดนแดด และห้ามแช่แข็ง", with "ห้องร้อนเกิน 30°C ยาจะค่อยๆ เสื่อม แต่ถ้ายังไม่มียาใหม่ ใช้ต่อได้ แล้วรีบหามาเปลี่ยน" (the US FDA; Siriraj Hospital's leaflet agrees; no source gives a number above 30 °C, [#80](docs/KNOWN_ISSUES.md#80-insulin-above-30-c-has-no-number)); and 💊 ยาอื่นที่ต้องเก็บในตู้เย็น, Ready.gov's day, then "🔎 เกิน 1 วันแล้ว ดูฉลากก่อนใช้" and "ฉลากไม่ได้บอกว่าเก็บนอกตู้เย็นได้ ถามเภสัชกรก่อนใช้ ยาที่ขาดไม่ได้ อย่าเพิ่งทิ้ง ใช้ไปก่อนจนกว่าจะได้ยาใหม่" (the FDA). A second tick, "🤱 มีนมแม่แช่ไว้", adds breast milk in the fridge (the fridge's 4 hours, then "นมที่ไม่เย็นแล้ว ไม่แน่ใจให้ทิ้ง") and in the freezer (its time, then "ดูทีละถุง: ยังมีเกล็ดน้ำแข็ง แช่แข็งต่อได้ · ละลายหมดแต่ยังเย็น ใส่ตู้เย็น ใช้ภายในวันถัดไป หรือทิ้ง · ห้ามแช่แข็งซ้ำนมที่ละลายแล้ว", and always "อุดช่องว่างในช่องแช่แข็งด้วยกระดาษหนังสือพิมพ์หรือขวดน้ำแช่แข็ง จะเย็นนานขึ้น"; the CDC).
- **"🕘 จำได้ว่าไฟดับตอนกี่โมง?"**, a time box under the fridge's buttons ("ใช้เวลานี้": that time today, or yesterday if it is still to come), and the hint "ไม่ตรงกับปุ่มไหน ให้เลือกเวลาที่นานกว่า".
- **"↺ เริ่มนับใหม่"**: after "💡 ไฟมาแล้ว", which now keeps the answer (F98), this clears it.
- **Named helplines, and the numbers that fit each guide** ([KNOWLEDGE §33.9](docs/KNOWLEDGE.md#339-named-helplines-and-the-numbers-that-fit-each-guide)): `helplines.json → short` (1784 ภัยพิบัติ · 199 ไฟไหม้ · 1669 เจ็บป่วย · 1555 กทม. · 1130 ไฟดับ กทม. นนทบุรี สมุทรปราการ · 1129 ไฟดับ จังหวัดอื่น · 1323 สุขภาพจิต; in English disasters, fire, ambulance, Bangkok, "power: Bangkok area", "power: other provinces", mental health) and `config.json → guides[].calls` (the power cut 1130 · 1129 · 1669, a fire 199 · 1669 · 1784…), shown as named chips on the guide, in its print footer, on its picture and on the hazard pages' call row; the plan card shows all six main numbers with names.
- **"🥛 ไฟดับอยู่ตอนนี้? ดูว่าของในตู้เย็นอะไรต้องทิ้ง"** at the top of the power-cut guide (`config.json → guides[].now`).
- **"📋 คัดลอกแผนเป็นข้อความ"** (the plan's fields and the named helplines) and **"🛒 คัดลอกรายการที่ยังขาด"** (every missing line of the home check with its amount, "ของที่บ้านเรายังขาด (บ้านเรา 5 คน)"): text on the clipboard only, never in a URL, an event or a request.
- **"ก+" / "A+"**, beside EN and 🔊: the start screen and every sheet at 115 % (CSS `zoom`), not the game's room, whose tap areas are measured; kept on the device (`brm:big`) and counted as `big_text` (label `on` / `off`, in both allowlists). At 360 px it lays out like a 313 px screen ([KNOWN_ISSUES #81](docs/KNOWN_ISSUES.md#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)).
- **A trust line** under the tools: "🔒 ฟรี ไม่ต้องสมัคร ไม่ขอข้อมูลส่วนตัว" / "🔒 Free, no sign-up, no personal data asked".
- **"เตรียมบ้านต่อ" on the result,** right under share and challenge: the guide by its real title, the hazard's tools and the check link (F120).
- **Seven sources** (119 in all): `foodsafety-outage` (FoodSafety.gov, US HHS, reviewed 8 Aug 2024), `fsis-outage` (USDA FSIS, 7 Aug 2013), `uk-fsa-powercut` (the UK FSA, 26 Jul 2023), `fda-insulin` (the US FDA, 28 Sep 2026), `fda-drugs-disaster` (the US FDA, 1 Sep 2026), `siriraj-insulin` (Siriraj Hospital's nursing leaflet, checked พ.ศ. 2561, `academic`) and `cdc-emergency-feeding` (the US CDC, 12 Aug 2026); `cdc-food-outage`'s note extended (the cooler, its throw-out list). Their English names in `seo.en.agencies`.
- **[docs/07-audience.md](docs/07-audience.md):** who receives the app through LINE and social media in Thailand (platform reach, older adults, how disaster information spreads, devices, who is most at risk, seven personas, the sharer and the receiver, implications in order, signals to watch, gaps), 50 sources.

### Changed

- **The freezer's default is half full,** 24 h, the shorter time; its question reads "ช่องแช่แข็งมีของ (ไม่แน่ใจ เลือกครึ่งช่อง)" (F97). Its status word "ยังเก็บได้" is now "ยังแข็งอยู่".
- **The fridge sheet, top to bottom:** the title; "แตะว่าไฟดับมานานเท่าไร แล้วดูว่าของแต่ละอย่างยังกินได้ไหม"; the 9 buttons and the hint; the time box; the count ("⏱️ ไฟเพิ่งดับ …" in the first minute); the ticks, now above the answer; "คำตอบ"; "จำไว้"; the sources once ("⚠️ เวลาและรายการมาจากหน่วยงานสหรัฐฯ (CDC, FoodSafety.gov, USDA, FDA) เรื่องอินซูลินตรงกับโรงพยาบาลศิริราช ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานรัฐของไทย"); privacy; share; 🎒; close. The answer is long now, so a tap scrolls its start to the top (`block: 'start'`). `brm:fridge` = `{start, end, picked, freezer, med, milk}`.
- **The start screen's fridge tile:** "อะไรต้องทิ้ง อะไรเก็บได้" (was "ยังกินได้อีกกี่ชั่วโมง"); for a day after "💡 ไฟมาแล้ว", "💡 ไฟมาแล้ว ดูว่าต้องทิ้งอะไร".
- **`/fridge`** shows food by food (the two lists under the fridge, the four packs under the freezer, insulin, other medicine and breast milk), with the title "ไฟดับ ของในตู้เย็นอะไรต้องทิ้ง อะไรเก็บได้? เช็กทีละอย่าง · บ้านรอดไหม?", a new description and intro (and English twins); `og/fridge.png` and `og/en/fridge.png` re-rendered ("แตะว่าไฟดับมานานเท่าไร รู้ทีละอย่างว่าอะไรต้องทิ้ง").
- **Dust today:** the at-risk and long-term-illness lines are always shown, with no household ticks and no line twice (F101); the Air4Thai link under the colours (F102); the intro "ดูสีค่าฝุ่นตอนนี้ แล้วแตะสีเดียวกันด้านล่าง รู้ทันทีว่าทุกคนในบ้านควรทำอะไร"; the number box is a text box with the number keyboard (F103); the Thai shared text says มคก./ลบ.ม. (F104); 🌫️ for the tool, and "📋 ห้องปลอดฝุ่น 10 ข้อ" for its guide button (F105); the tile's line "ดูสีฝุ่น รู้ว่าต้องทำอะไร" / "Tap the colour, see what to do"; `/air`'s title, intro and button colour-first, and `og/air.png` and `og/en/air.png` re-rendered ("แตะสีฝุ่นที่เห็น ได้คำแนะนำสำหรับทุกคนในบ้าน"). `brm:air` keeps only the kind of number. No band edge or line changed.
- **The guides:** named chips (F106); the flood and dust guides' check links (F109); ⚡ ⛽ 🏃 instead of ⚠️ as three lines' icons (F108); the fire guide offers the plan (`hazards.fire.tools`, F110); the "ขณะเกิด" chip no longer looks chosen (F111). The nine `share/checklist-*.png` were re-rendered with the named numbers.
- **Sharing:** the plan's share text (F112), the plan card's footer (F113), the home check's card (F114), "คัดลอกข้อความ" everywhere (F115), the hold-to-save hint at the top of both image share sheets; the pills with none left (F116).
- **The alert says until when:** "ช่วงนี้ถึง 25 ต.ค.: น้ำป่า ดินถล่ม · ดูว่าต้องทำอะไร" (F117).
- **Thai pages are Thai only** (F121): the English line under every Thai line is gone; `/en/` pages and `hreflang` serve English, `/learn` keeps one English pointer line and the 404 page stays bilingual. `/flood` at 360 px is 26,209 px tall (32,360 before).
- **Reading sizes** (F124): the plan's hints, the privacy lines, the calculators' labels, the helplines' "what" and the fridge's notes 15 px; the sources 14 px.
- **English:** the front room is "Front of the house" (was "Front yard"); the home check's name on the result and the hazard links is the tool's, "Check your supplies: how ready is our home?" (F125).
- **Content:** `kit.json` (`fridge.foods`, `frozen`, four new parts, `tip` / `tipAt`, `overAs`, `if: milk`, `say.check`, the freezer's order; `ui` 122 texts per language, 28 added and 3 removed), `strings.json` (5 new keys per language: `trustLine`, `bigBtn`, `bigText`, `hubFridgeBack`, `guideNowFridge`, 286 in all), `helplines.json` (`short`), `config.json` (`guides[].calls`, `now`, `hazards.fire.tools`), `checklists.json` (three icons), `rooms.json`, `sources.json`, `items.json` (`s-medcold`'s `why`, one feedback, sources and `verifyNote`; F128). `npm run docs` regenerated [docs/01](docs/01-safety-content.md)'s reference list and `s-medcold`'s flag.
- **Code:** `kitplan.js` (`fridgePlan` with `milk`, `overAs` and the half-full default; `fridgeFoods`; `airAdvice` for everyone with `riskSame`), `kit.js` (`openFridge`, `openAir`, `shareImage` with `copy`, the plan and home-check copies, `drawPlanCard` with named numbers, `medNone`), `main.js` (ก+, the alert's date, `hubFridgeBack`, `guideCalls()`, the guide's `now` button and check link, the result's next steps, 🌫️), `cards.js` (`drawCalls`), `app.css`, `tools/build.mjs` (the checks below, the alert's date, Thai-only pages, `inline-block` links, `callsOf()`, `/fridge` food by food), `tools/render.html`, `analytics.js` and `functions/api/e.js` (`big_text`).
- **Build checks** ([KNOWLEDGE §33.7](docs/KNOWLEDGE.md#337-build-checks)): every number in a fridge part's texts must be in its sources' title or note (it caught the frozen breast milk's 48 and 24 h missing from the CDC note, so the FAQ's words were added); `overAs` only `check`; `if` only `med` or `milk`; `tipAt` `soon` or `always`; the fridge and freezer parts must exist; foods `discard` or `keep`, sourced, both kinds present, unique ids; packs `refreeze` or `discard`; a guide's `calls` 1–4 numbers from `helplines.json`; a guide's `now` a tool with its `guideNow<Tool>` string; every helpline a `short` name in both languages.
- **Events:** one new anonymous event, `big_text` (label `on` / `off`), in both allowlists ([05-metrics](docs/05-metrics.md#larger-text-and-the-real-readers-v1110)); the two copy-as-text buttons count as `plan_share` and `kit_share` with the new label `copylist`, never the text. The power-cut guide's fridge button sends `tool_open` with the label `guide`.
- **Images:** re-rendered with `npm run images` and committed: the nine `share/checklist-*.png`, `og/fridge.png`, `og/en/fridge.png`, `og/air.png`, `og/en/air.png`. `public/icons/icon.svg` came back from the render with an empty `<g>` and was restored, as render noise ([LESSONS E10](docs/LESSONS_LEARNED.md#e-process-documentation-and-git)).
- Version 1.11.0 in `package.json`, `package-lock.json` and `config.json`.

### Fixed

Found by visitor audit 3, with the auditors' ids ([KNOWN_ISSUES "In v1.11.0"](docs/KNOWN_ISSUES.md#in-v1110-20-oct-2026)):

- **The fridge tool could make someone throw away insulin** (audit A's blocker): v1.10.0–v1.10.1 said "Ready.gov แนะให้ทิ้ง" for any cold medicine after a day. Now insulin has its own card and other medicine says "check the label", never "throw it out" (F96, [GUIDELINES rule 83](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS B16](docs/LESSONS_LEARNED.md#b-safety-content-and-research)). The game's lesson `s-medcold` said the same and was reworded too (F128, below).
- **The fridge:** an unanswered freezer counted as full, 48 h (F97; A3, B1); "💡 ไฟมาแล้ว" cleared the answer when it was needed most (F98; A2); no rule for a time between two buttons, and no way to give the clock time (F99; B2, A19); the shared text said "ไฟดับมาแล้ว 3 ชม.", wrong by the time it was read (F100; B20, A16).
- **Dust today:** the advice for people at risk was hidden behind ticks, and repeated lines when shown (F101; A5, B22); the Air4Thai link was below the answer (F102; A11, B21); "15,1" came out as 151, red, instead of 15.1, green (F103; B18); µg/m³ in the Thai text (F104; B16); one icon for the tool and the guide, and a guide button that wasn't the guide's title (F105; B26, B13).
- **The guides:** bare numbers, the same three for every hazard (F106; A4); the power-cut guide didn't lead to the fridge tool (F107; A9); ⚠️ as a line's own icon (F108; A10); no check link on the flood and dust guides (F109; A13); nothing for the home after the fire guide (F110; B11); the "ขณะเกิด" chip looked chosen (F111; A23).
- **Sharing:** the plan's share text promised a plan it didn't carry (F112; A6, B4); the plan card's undefined "กระเป๋าฉุกเฉิน" (F113; B9); the home check's card over three missing things when ten were (F114; B6); "คัดลอกลิงก์" copied a message (F115; A26, B27); "พออีก 0 วัน" (F116; B19).
- **The start screen and the result:** the alert didn't say until when (F117; A8); nothing said the app is free and asks for nothing (F118; A21); the hub's buttons ran off the screen at a larger text size (F119; A20); what to do next was at y ≈ 2849 of a 3024 px result at 360 px, now y ≈ 874 (F120; B7).
- **Static pages:** every Thai line doubled in English, `/flood` about 50 screens long (F121; A7, B15); links split kept Thai words into columns and lost their spaces, "รับมือพายุลมแรงฟ้าผ่า10 ข้อ", in 45 links (F122; B3, A14, [GUIDELINES rule 88](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)); an empty "ที่มา: ·" on `/plan` (F123; B14).
- **Small print** at 13–14 px (F124; A12); **English** "Front yard" and the home check's name (F125; B25).

Found in our own testing and review, never live:

- **The named chips pushed the first line of `/en/ready` and `/en/storm` below the first screen at 320 × 460;** fixed by shorter English names and compact chips (F126).
- **The power-cut guide's new button first took the class `guide-now`,** the guide picker's badge; renamed `guide-now-btn` (F127, [GUIDELINES rule 89](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS C24](docs/LESSONS_LEARNED.md#c-engineering-and-platform)).

Found while documenting the release, live since v1.7.0:

- **The game's cold-medicine lesson said what the tool had said** (F128): `s-medcold`'s `why` ended with Ready.gov's "ถ้าไฟดับเกินหนึ่งวัน ให้ทิ้งยาที่ต้องแช่เย็น เว้นแต่ฉลากยาบอกเป็นอย่างอื่น", and the feedback on the wrong answer "ใช้ต่อไปเรื่อยๆ ไม่ต้องดูฉลาก…" repeated it. The feedback now reads "ดูฉลากยาก่อน ถ้าไม่ได้บอกว่าเก็บนอกตู้เย็นได้ ให้ถามเภสัชกรว่ายังใช้ได้ไหม" / "Check the label first; if it doesn't say it keeps out of the fridge, ask a pharmacist."; the `why` keeps Ready.gov's plan-ahead advice and adds the US FDA's ("…ให้ดูฉลากหรือถามเภสัชกรว่ายังใช้ได้ไหม ยาที่ขาดไม่ได้ เช่น อินซูลิน ใช้ต่อได้จนกว่าจะได้ยาใหม่" / "…check its label or ask a pharmacist whether it can still be used; a medicine needed to sustain life, such as insulin, may be used until a new supply is found."); sources `readygov-outage` and `fda-drugs-disaster`; the `verifyNote` says why. Text only: the right answer, the tip, the name and the slot are the same, so houses and challenge links are too. `/learn` and `/ready` carry the new text. **It corrects published advice, so post an "UPDATE:"** wherever the power-cut set was shared ([GUIDELINES §2.4](docs/GUIDELINES.md#24-changing-advice-that-is-already-public), [KNOWN_ISSUES F128](docs/KNOWN_ISSUES.md#in-v1110-20-oct-2026)).

### Tests

- **40 rule tests** (+1): "power cut, food by food: the fridge's 4 hours decide when, each food's chart row decides what (v1.11.0)" (nothing goes before 4 h; at 4 h the 9 foods go and the 4 keep; a half-full freezer holds 24 h, a full one 48; ice cream goes even with ice crystals, bread refreezes either way; น้ำปลา, น้ำผลไม้, มะพร้าว and มายองเนส stay out; every food and pack sourced, `partial`, in both languages). The fridge test now expects the half-full default, insulin `ok`, other medicine `check`, breast milk following the fridge and the freezer, the FDA's words in the insulin sources, and no medicine status that says ทิ้ง; the dust test expects the at-risk lines with no tick and no line twice, at every level.
- **163 smoke checks** (+4): new, "fridge, food by food: before 4 hours, what will have to go after 4 hours and what keeps"; "fridge: after a day, other cold medicine says "check the label" (🔎), never "throw it out"; the half-full freezer lists each pack"; "fridge: "💡 ไฟมาแล้ว" keeps the answer (what to throw out now) and offers to start again"; "fridge: after the power is back, the start screen says what to do next"; "dust: "don't know the colour?" and the Air4Thai link sit right under the colours (v1.11.0)". Rewritten: "fridge: "3 ชม." → … a half-full freezer (the safer default) about 21 hours"; "fridge: "6 ชม.", half a freezer, cold medicine → the fridge foods listed to throw out and to keep; the freezer about 18 h; insulin still usable; a day for other medicine in about 18 h"; "/fridge and /en/fridge: … food by food …"; Thailand's AQI 137 at orange; "dust: picking yellow clears the number; the at-risk lines show without ticking anyone, and no line is given twice (v1.11.0)"; "dust: the kind of number is kept on the device, the reading is not". Removed: "dust: who is at home starts from the home check".
- **Three failures on the way,** two of them in the tests' timing: the long answer's smooth scroll, which the test now waits for ([LESSONS D25](docs/LESSONS_LEARNED.md#d-testing-and-verification)); and the first 5 Dec 2026 run, which crashed before its summary with "page.goto: net::ERR_ABORTED at /?open=fridge" at the second visit to the fridge, because closing the sheet takes its history entry back a task later (`settleHistory` → `history.go(-1)`) and the test's next `page.goto` started in that gap; the test now waits for `!history.state?.brm` first. No app change; the same family as v1.10.1's Back test ([LESSONS D23](docs/LESSONS_LEARNED.md#d-testing-and-verification), extended). The third was real: the chips at 320 × 460 (F126).

### Checked

- Build: no warnings after `npm run docs`; **119 sources**; start screen **264 KB** compressed (254 in v1.10.1), first game screen **279 KB** (269); 44 files precached. About half of the 10 KB is `sources.json` (25.2 → 30.5 KB with `gzip -9`: the seven new sources' quoted notes, which every visitor downloads, [KNOWN_ISSUES #62](docs/KNOWN_ISSUES.md#62-source-notes-are-downloaded-by-every-visitor)); `kit.js` and `kitplan.js` are about 2.4 KB of it.
- `npm test`: 40 passed, 0 failed. `npm run smoke`: 163 passed, 0 failed on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027 (`SMOKE_DATE`), all on the final code and tests.
- A visitor walk in headless Chromium with LINE's user agent at 360 × 640 and 320 × 568 (Thai), 390 × 844 (English) and 768 × 1024 (Thai): the start screen, ก+, the fridge at 6 h with ก+, the power-cut guide (the named chips, the fridge button opening the tool), dust today at orange, the plan's share and copy, a round's result, `/flood`. No sideways scrolling, no control under 44 px, no page errors.
- axe-core: on the start screen only the wordmark's coral half, as before ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)); nothing on the fridge at 24 h with medicine and breast milk, dust today at orange, the power-cut guide, `/fridge` or `/ready`.
- **The independent cross-check,** a scratch script with its own verdict for each food written from the charts and its own hours, not `kitplan.js`: 18 times from 0 to 72 h (both sides of 4, 24 and 48 h) × 2 freezer sizes × every part, food and pack: **1,368 agree, 0 disagree** ([LESSONS D24](docs/LESSONS_LEARNED.md#d-testing-and-verification)).
- Measured: `/flood` at 360 px 32,360 → 26,209 px tall and at 320 px 36,476 → 29,239 px; the result's next steps at y ≈ 874 at 360 px (the 🎒 was at y ≈ 2849 of 3024); with ก+ the start screen at 360 px lays out like 313 px.

### Not run

- Real phones: LINE on Android 10–11 and on a current phone; ก+ inside LINE and on iOS; the time box; copying to the clipboard inside LINE ([06-test-checklist](docs/06-test-checklist.md) rows 67–75).
- `npm run probe`: no item, slot or water change, so houses and challenge links are unchanged.
- A review by a Thai pharmacist, a nurse or the DOH's breastfeeding centre, or a Thai food-safety source for the food lists ([ROADMAP L10](docs/ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons)).

## [1.10.1] — 2026-10-19

**The calculators in plain words.** On 19 Oct 2026 the owner sent a screenshot of the v1.10.0 fridge tool: "ไฟดับมานานแค่ไหนแล้ว? 1 นาที" between − and + buttons, "นับจากราว 22:38 น. ระบบนับต่อให้เองแม้ปิดหน้านี้", a "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้" button, and rows such as "✅ ยังเก็บได้อีกราว 3 ชม. 59 นาที ถ้าไม่เปิดประตูตู้ · ถึงราว 02:38 น. 20 ต.ค.", each followed by "ที่มา: ศูนย์ควบคุมและป้องกันโรคสหรัฐฯ (CDC) · ⚠️". The owner wrote: "I cannot understand, please review and validate the UI and UX, try to improve and use general simple language." Read as a first-time visitor, the tool had five problems: (1) it was counting, at "1 นาที", before the person had said anything; (2) there were two ways to set the time (− / + and "ไฟเพิ่งดับ") and nothing said which to use; (3) every answer line packed three facts (the time left, a condition, a clock time with a date); (4) a long agency name was repeated under every row; (5) words such as "ช่องธรรมดา" and "ระบบนับต่อให้เองแม้ปิดหน้านี้" came first, and the freezer question sat below the answers it changed. Every automated check had passed: the tool was correct, but not clear. This release asks one question at a time, gives the answer as a word first and one line after, and says the sources once. The dust tool and the pills got the same pass ([ROADMAP N22](docs/ROADMAP.md#n22-calculators-in-plain-words-v1101), [KNOWLEDGE §32.10](docs/KNOWLEDGE.md#3210-the-plain-words-pass-v1101), [APPROACH §31](docs/APPROACH_AND_METHOD.md#31-a-plain-words-pass-after-the-owner-couldnt-read-a-tool-v1101)). No hour, band edge, source or `verify` changed, and no item, slot or `houseVersion`: **houses, challenge links and the game's advice are the same.**

### Changed

- **The fridge tool takes one tap.** "ไฟดับมานานเท่าไรแล้ว?" ("How long has the power been off?") is answered with one of 9 buttons: เพิ่งดับ, 1 ชม., 2 ชม., 3 ชม., 4 ชม., 6 ชม., 12 ชม., 1 วัน, 2 วัน (`kit.json → fridge.quick` = 0, 1, 2, 3, 4, 6, 12, 24 and 48 hours). The − / + stepper and "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้" are gone. Nothing is counted or stored until a time is tapped; until then the answer area says "👆 แตะเวลาด้านบน แล้วคำตอบจะขึ้นตรงนี้". After a tap the button stays highlighted (`picked` is stored with the start in `brm:fridge`), a line says "⏱️ ไฟดับมาแล้ว 3 ชม. แอปจะนับเวลาต่อให้ ปิดแล้วเปิดใหม่ได้", "💡 ไฟมาแล้ว" clears it (toast "ล้างเวลาแล้ว"), and the answer scrolls into view. The count still goes on after the app is closed, as before.
- **The fridge's answer is one card per part,** under "คำตอบ": the part's name, a short status word in large type, then one line. The fridge: ✅ "ยังกินได้" / ⏳ "ใกล้ครบ 4 ชม." / ❌ "เกิน 4 ชม.แล้ว", with "เหลืออีกราว 1 ชม. ถ้าไม่เปิดตู้" or, when it is over, "ทิ้งเนื้อสัตว์ ปลา ไข่ นม และอาหารที่เหลือ". The freezer: ✅ "ยังเก็บได้" / ⏳ "ใกล้ครบเวลา" / ❌ "เกิน 48 ชม.แล้ว" (24 for a half-full one), with "เหลืออีกราว 45 ชม. ถ้าไม่เปิดช่องแช่แข็ง" or "ห้ามชิมเพื่อดู ไม่แน่ใจให้ทิ้ง"; its question, "ช่องแช่แข็งมีของ [เต็มช่อง] [ครึ่งช่อง]", is now inside the freezer card, side by side. Cold medicine (after ticking "💊 มียาที่ต้องเก็บในตู้เย็น"): ✅ "ยังไม่ถึง 1 วัน" / ⏳ "ใกล้ครบ 1 วัน" / ❌ "เกิน 1 วันแล้ว", with "อีกราว 18 ชม. จะครบ 1 วัน" and a small note with Ready.gov's advice. Each card's left edge is coloured by its status (blue, orange, red). The clock time and the date are gone from the cards, and "(ช่องธรรมดา)" from the fridge's name.
- **The sources are said once.** "จำไว้" ("Remember") has the three lines that always hold, in shorter words ("เปิดตู้เย็นให้น้อยที่สุด ความเย็นจะอยู่ได้นานขึ้น", "ห้ามชิมเพื่อดูว่าอาหารเสียไหม ไม่แน่ใจให้ทิ้ง", "กระป๋องที่บุบ บวม รั่ว หรือเป็นสนิม ให้ทิ้ง"), with no source under each. At the bottom, once: "⚠️ ตัวเลขชั่วโมงมาจาก CDC และ Ready.gov ของสหรัฐฯ ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานไทย" and "ที่มา: …" with every agency of the tool. `/fridge` still lists every part and line with its own sources.
- **Times read "about", to the nearest minute; a time left of 3 hours or more reads in whole hours** ("เหลืออีกราว 45 ชม."), while the time off keeps its minutes, so it never reads "4 ชม." beside "เกิน 4 ชม.แล้ว", so a time just tapped no longer reads "59 นาที" or "44 ชม. 59 นาที". The ✅ ⏳ ❌ status always comes from the exact time, never from a rounded one. This **replaces** v1.10.0's "time off rounds up, time left rounds down": the safe direction now lives in the status ([GUIDELINES rule 78](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [LESSONS B13](docs/LESSONS_LEARNED.md#b-safety-content-and-research)).
- **Dust today asks for the colour first.** "ค่าฝุ่นตอนนี้เป็นสีอะไร?" ("What colour is the dust now?") with the five colour buttons first, bigger (64 px tall, 26 px dots). The number moved behind "🔢 รู้ตัวเลข? ใส่ตัวเลขแทน" (closed by default), with "ตัวเลขนี้เป็นแบบไหน?" (ตัวเลข PM2.5 (มคก./ลบ.ม.) / ตัวเลข AQI (แอปของไทย)) and the note "ใช้ตัวเลขจากแอปของไทย เช่น Air4Thai แอปต่างประเทศใช้ AQI คนละแบบ ให้ใส่ตัวเลข PM2.5 แทน สีตามเกณฑ์ใช้ค่าเฉลี่ย 24 ชั่วโมง". Then who is at home, with shorter labels ("ผู้สูงอายุ", "คนมีโรคประจำตัว เช่น หัวใจ ปอด"), then the answer, headed "สีส้ม · เริ่มมีผลต่อสุขภาพ".
- **The dust advice in everyday words, with the same meaning** (each line keeps its source, and the DOH's two lines are still named). For example "ลดเวลาทำกิจกรรมหรือออกกำลังกายกลางแจ้งที่ใช้แรงมาก" → "ออกกำลังหนักๆ นอกบ้านให้น้อยลง"; "จำกัดเวลา…" → "ออกกำลังหนักๆ นอกบ้านให้สั้นลง"; "เลี่ยง…" → "เลี่ยงการออกกำลังหนักๆ นอกบ้าน"; "ใส่หน้ากากป้องกัน PM2.5 ทุกครั้งที่ออกนอกอาคาร" → "ใส่หน้ากากกันฝุ่น PM2.5 ทุกครั้งที่ออกนอกบ้าน"; "งดกิจกรรมกลางแจ้ง" → "งดทำกิจกรรมนอกบ้าน"; "อยู่ในห้องปลอดฝุ่น" (DOH) → "อยู่ในห้องที่กันฝุ่นได้"; "พื้นที่ปลอดภัยจากมลพิษทางอากาศ" → "ห้องที่กันฝุ่นได้"; "รีบไปพบแพทย์" → "รีบไปหาหมอ". The level names are shorter: "เริ่มมีผลกระทบต่อสุขภาพ" → "เริ่มมีผลต่อสุขภาพ", "มีผลกระทบต่อสุขภาพ" → "มีผลต่อสุขภาพ". The English is plain too ("Do less hard exercise or work outdoors", "Stay in a room that keeps the dust out", "If you feel unwell, see a doctor soon"). **Decision:** plain words are allowed when the meaning, the strength of the advice and the source stay the same; the four strength words of the notice stay apart (ให้น้อยลง / ให้สั้นลง / เลี่ยง / งด: reduce / limit / avoid / stop) ([GUIDELINES rule 82](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Two rewordings are close but not identical and wait for the Thai read: "นอกบ้าน" for both "กลางแจ้ง" and "นอกอาคาร", and "หมอ" for "แพทย์" ([ROADMAP L5](docs/ROADMAP.md#l5-second-native-reader-for-the-thai-copy)). A third, the fridge's "ห้ามชิม" / "Never taste" softened to "อย่าชิม" / "Don't taste", was put back before release: the CDC says "never", and plain words must keep the strength.
- **The pills:** "⏳ พออีก 4 วัน ต้องมีเพิ่ม 5 เม็ด จะพอ 7 วัน" and "✅ พออีก 7 วัน ครบ 7 วันแล้ว" (English "Lasts 4 more days; 5 more pills make 7 days").
- **The start screen:** the dust tile's second line is "ค่าฝุ่นนี้ ต้องทำอะไร" (was "ค่าเท่านี้ บ้านเราทำอะไร").
- **Both sheets:** the title takes the focus when the tool opens, so no button looks chosen by its focus ring.
- **Content shape** (`kit.json → fridge.parts`): `say {ok, soon, over}` (the status words; `{h}` is the part's hours), `cond` (the condition, fridge and freezer), `ok` (its own line, cold medicine only), `note` (cold medicine) and `over` (the action only). The fridge's and freezer's old `ok` is now `cond`, and the medicine's old `left` is now its `ok`. Removed: the `ui` keys `fridgeLess`, `fridgeMore`, `fridgeNow`, `fridgeSince`, `fridgeUntil`, `fridgeAt` and `airOr`. New `ui` keys: `fridgeJust`, `fridgeDay`, `fridgeDays`, `fridgeCounting`, `fridgePick`, `fridgeCleared`, `airColourQ`, `airNumber`; `fridgeLeft` is "เหลืออีกราว {left} {cond}" (97 `ui` texts per language). The build now checks `say.ok`, `say.soon` and `say.over` in both languages, and that each part has `cond` or `ok`. The `/fridge` page reads the same words.
- **Code:** `kit.js` (`openFridge`: the time buttons, the cards, `tick()` that updates only the words every 20 s; `span()`; `openAir`: the colours first, the number in a `<details>`), `app.css` (`.fr-times` and `.guide-grid` three across, `.fr-card`, `.fr-say`, `.fr-seg`, the bigger swatches), `tools/build.mjs` (the checks above; the `/fridge` page from `cond` and `note`), `strings.json → hubAirSub`.
- Version 1.10.1 in `package.json`, `package-lock.json` and `config.json`.

### Fixed

Reported by the owner from the live v1.10.0 ([KNOWN_ISSUES "In v1.10.1"](docs/KNOWN_ISSUES.md#in-v1101-19-oct-2026)):

- **The fridge tool was hard to understand** (F93): fixed by the one-tap question, the cards and the sources said once, above.
- **Nine buttons left one alone on a wider screen** (F95, found while checking the above): the fridge's times came out 4 + 4 + 1 on a 400 px phone, with "2 วัน" alone, and the guide picker's tiles the same on a tablet (since v1.9.0). Both are now 3 × 3 at every width (the guides keep two columns on a 320 px phone).
- **A time just set read a minute off:** the time left rounded down while the clock had already moved on, so it read "59 นาที", "3 ชม. 59 นาที" or "44 ชม. 59 นาที", and the time off rounded up, so a count just started read "1 นาที" (F94): fixed by reading both to the nearest minute (the time left in whole hours from 3 hours), with the status from the exact time.

### Tests

- 39 rule tests (unchanged).
- **The Back test waits for the sheet's history entry** before pressing Back. The entry comes a task after the sheet opens (`settleHistory` in `ui.js`); on a busy CI runner the test's Back came first and left the app, so the first push of v1.10.1 failed CI's smoke job (it passed in the sandbox). Reproduced by holding the app's zero-delay timers back, which fails it every time without the wait ([LESSONS D23](docs/LESSONS_LEARNED.md#d-testing-and-verification)). No app change: a person can't press Back that fast.
- **159 smoke checks** (+2): "fridge: nothing is counted until a time is tapped (no "1 นาที" out of nowhere); 9 times to tap" and "dust: the five colours come first, on the first screen; the number is behind "รู้ตัวเลข?"". The fridge checks were rewritten for the taps: "3 ชม." gives the fridge ⏳ nearly at 4 hours with about 1 hour left and a full freezer about 45 hours, and the tapped button stays chosen; the answer is on screen after the tap (360 × 640); "6 ชม." with half a freezer and cold medicine gives the fridge food out (meat, fish, eggs, milk, leftovers), the freezer about 18 h and a day for the medicine in about 18 h; the start, `picked`, the freezer and the medicine tick are kept on the device; the start tile says "⏱️ ไฟดับมาเกิน 6 ชม.แล้ว". The dust checks open "รู้ตัวเลข?" before typing a number.

### Checked

- Build: no warnings; start screen **254 KB** compressed (253 in v1.10.0), first game screen **269 KB** (268); still 44 files precached.
- `npm test`: 39 passed, 0 failed. `npm run smoke`: 159 passed, 0 failed on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027 (`SMOKE_DATE`).
- A visitor walk in headless Chromium at 320 × 568 (Thai), 360 × 640 (Thai), 390 × 844 (English), 768 × 1024 (Thai) and 1024 × 1366 (English): no sideways scrolling, no control under 44 px, no page or console errors.
- axe-core: nothing on the fridge sheet, the dust sheet, `/air` or `/fridge`; on the start screen only the wordmark's coral half, as before ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- The independent cross-check again agreed on 35 of 35 dust readings and 8 of 8 fridge times.
- A grid probe at 320, 360, 400, 412, 768 and 1024 px, Thai and English: the fridge's times 3 + 3 + 3 everywhere (at least 91 × 48 px), the guide picker 3 + 3 + 3 from 360 px (two columns at 320), no text cut off.
- **Not run:** real phones (the taps, the counting line and "💡 ไฟมาแล้ว" inside LINE, the colour-first dust tool and its number box: [06-test-checklist](docs/06-test-checklist.md) rows 64–65); `npm run probe` (no item, slot or water change).

## [1.10.0] — 2026-10-19

**Calculators: you answer, it works out what to do.** On 19 Oct 2026 the owner sent a screenshot of the home check (how many people, who is at home, and the amounts it works out) and wrote: "ชอบแบบนี้ ใส่ค่า แล้วคำนวณให้เลยว่าต้องเตรียมของยังไง เท่าไหร่ มีแบบนี้อีกไหม ดีๆ เอาแนวคิดนี้ไปใช้ทำ Features อื่นได้อีกไหม" ("I like this: put in values and it works out what to prepare and how much. Are there more good ones like this? Can this idea be used for other features?"). The owner asked for suggestions on the UI and UX, consistency across the app, a test as visitors on phones and tablets, a cross-check that the output is right, frank advice, the integration, and the docs brought up to date. Until now only the home check calculated, and the plan card is a form. This release adds three calculators built the same way, each computing only from numbers in its sources, and joins them to the start screen, the guides, the hazard pages and the results ([ROADMAP N21](docs/ROADMAP.md#n21-calculators-from-the-home-checks-idea-v1100), [KNOWLEDGE §32](docs/KNOWLEDGE.md#32-calculators-the-fridge-dust-today-the-pills-v1100), [APPROACH §30](docs/APPROACH_AND_METHOD.md#30-from-one-tool-the-owner-liked-to-three-v1100)). No item, slot, room or `houseVersion` changed, and no lesson: **houses, challenge links and the game's advice are the same.**

### Added

- **ไฟดับ: ของในตู้เย็นยังกินได้ไหม? / "Power cut: is the food in the fridge still safe?"** (`/fridge`, `/en/fridge`, `/?open=fridge`; the hub's "🥛 ไฟดับ: ตู้เย็น"; a shortcut on the installed app's icon). Asks how long the power has been off (a − / + stepper of one hour, or "⏱️ ไฟเพิ่งดับ เริ่มนับจากตอนนี้" to start counting now), how full the freezer is (full or about half) and whether there is medicine that must be kept cold. Shows, and updates every 20 s while open, how much longer each part keeps and until what time (with the date when it isn't today): the fridge 4 h if the door stays shut, the freezer 48 h full or 24 h half full, and for cold medicine, Ready.gov's "if the power is off more than a day, throw it out unless the label says otherwise". ✅ while it keeps, ⏳ in its last hour, ❌ when it is over ("throw out meat, fish, eggs, milk and leftovers"; "never taste it to check; when in doubt, throw it out"). Three lines always: open the fridge only when you must; never taste food to check; throw out dented, bulging, leaking or rusty cans (อย. and กรมอนามัย, ✅). The hours come from the US CDC and Ready.gov and are ⚠️: research again found no Thai agency advice on food in a fridge during a power cut, and the tool says so ("ตัวเลขชั่วโมงมาจาก CDC และ Ready.gov ของสหรัฐฯ ยังไม่พบคำแนะนำเรื่องนี้จากหน่วยงานไทย", [KNOWN_ISSUES #74](docs/KNOWN_ISSUES.md#74-the-fridge-hours-rest-on-us-guidance-only)). Time off rounds **up** to the minute and time left rounds **down**, so neither looks safer than it is. The start time stays on the device (`brm:fridge`, ignored after 7 days), so the count goes on after the page is closed, and while a cut is counted (up to 72 h) the hub tile says "⏱️ ไฟดับมา 5 ชม.แล้ว"; "💡 ไฟมาแล้ว: ล้างเวลา" clears it. Content `kit.json → fridge`; logic `fridgePlan()` in `kitplan.js`.
- **ฝุ่นวันนี้ บ้านเราต้องทำอะไร? / "Dust today: what should we do at home?"** (`/air`, `/en/air`, `/?open=air`; the hub's "😷 ฝุ่นวันนี้"; a shortcut). Asks what kind of number the app shows (PM2.5 in µg/m³, or Thailand's AQI) and the reading, or instead the colour (five swatches), and who at home needs extra care: children up to 5, people over 60, pregnant women, people with heart or lung disease or a long-term illness (the notice's people at risk). Who is at home starts from the home check's answers and is kept on the device (`brm:air`: the ticks and the unit, never the reading). Shows the level with its colour and band, then what everyone at home should do, what the ticked people should do (or "the same as everyone" where the notice gives nothing more), and the lines for a long-term illness; with nobody ticked, a hint names the people at risk. The answer scrolls into view after a number or a colour. The bands are the **PCD's notice in the Royal Gazette** (ประกาศกรมควบคุมมลพิษ เรื่อง ดัชนีคุณภาพอากาศของประเทศไทย พ.ศ. 2566, signed 16 May 2023, published 3 Jul 2023): the PM2.5 24-hour average, one decimal, rounded half up: blue 0–15.0, green 15.1–25.0, yellow 25.1–37.5, orange 37.6–75.0, red 75.1 and over µg/m³; AQI 0–25, 26–50, 51–100, 101–200, 201 and over. The advice per level is the notice's own Table 1; two lines come from the DOH and say so ("(กรมอนามัย)"): at orange, people with a long-term illness have their medicine and equipment ready; at red, everyone stays in a dust-free room. The two agencies differ at green, yellow and red; the PCD's notice is the main text ([KNOWN_ISSUES #76](docs/KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red)). Three new sources: `pcd-aqi-2566` (the Gazette, official, verified), `pcd-aqi-thaipbs-2566` (Thai PBS quoting the PCD Director-General) and `doh-aqi-2566` (MGR Online quoting the DOH Deputy Director-General; InfoQuest carries the same). Content `kit.json → air`; logic `airLevel()` and `airAdvice()`.
- **ยาพอกี่วัน? / "How many days will the pills last?"** In the home check, under the daily-medicine line (only when "someone on daily medicine" is ticked): pills left and pills a day give the days they last and how many more make the check's 7 days (`kit.json → items.meds.qty.days`, `moph-7days`). Arithmetic only (a part pill counts as one), one medicine at a time, nothing typed kept. `medDays()` in `kitplan.js`.

### Changed

- **The start screen:** the hub has two more tiles; with the home check and the plan they make a 2 × 2 grid under the main guide button. The first three tools stay on the first screen at 320 × 460 and 360 × 640 (smoke-checked); the new row follows ([KNOWN_ISSUES #77](docs/KNOWN_ISSUES.md#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones)).
- **Where the tools are offered:** `config.json → hazards.<h>.tools` now allows `fridge` and `air`. The power cut (`/ready`) and storms (`/storm`) offer the fridge; dust (`/pm25`) offers dust today. Their guide sheets show them as next steps, their hazard pages link them, and the result screen offers them after a power-cut or a dust round. The dust tool's "😷 วิธีป้องกันฝุ่นในบ้าน 10 ข้อ" opens the dust guide; the fridge tool's 🎒 opens the home check.
- **Pages and previews:** `/fridge` and `/air` (and `/en/`), like `/kit`: every part or level with its sources and a button into the tool; previews `og/fridge.png` (in the power-cut look) and `og/air.png` (the masked gecko) and their `og/en/` twins. The sitemap has 28 addresses (24). `llms.txt` lists every tool on one line ("Family tools that run on the device; nothing typed is sent: …"); `/learn` links all four.
- **Sending the result:** "📤 ส่งให้คนที่บ้าน" shares what the tool worked out as text (LINE, the phone's share sheet or a copy), with the tool's link.
- **Events:** two new anonymous events, `tool_open` and `tool_share` (mode `fridge` or `air`), in both allowlists (`functions/api/e.js`, `public/js/analytics.js`). No reading, time or answer about who is at home is sent ([05-metrics](docs/05-metrics.md#calculators-v1100)).
- **Texts that say what the app is** ([GUIDELINES rule 59](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)): the About text in Thai and English, including the privacy line; the default preview's description (and the meta description); `seo.en.llmsSummary`; the manifest's description and two new shortcuts (five in all); `package.json → description`. New English agency name: กรมควบคุมมลพิษ, "Pollution Control Department (PCD)".
- **Code:** `kit.js` (`openFridge`, `openAir`, the pills, `textShare`), `kitplan.js` (`fridgePlan`, `medDays`, `airLevel`, `airAdvice`), `main.js` (one `TOOLS` map for routing, the hub, the guides' next steps and the result buttons; the fridge tile's line), `app.css`, `tools/build.mjs` (`TOOL_IDS`; the checks below; the pages; the sitemap), `tools/render.html`.
- **Build checks:** every fridge hour must appear in its source's title or note; the dust levels must rise and end open, every band edge (µg/m³ to one decimal, and AQI) must appear in the sources of that level's lines, every line needs a source, and each group's `from` must be a home-check answer. Each was shown to fail with a wrong figure (the fridge at 5 h; orange at 70 µg/m³; green at AQI 10).
- Version 1.10.0 in `package.json`, `package-lock.json` and `config.json`.

### Fixed

Found in our own testing before release, never live ([KNOWN_ISSUES "In v1.10.0"](docs/KNOWN_ISSUES.md#in-v1100-19-oct-2026)):

- **The fridge's + button jumped two hours from a half hour.** It rounded the time first (`Math.round`), so 3 h 30 min + 1 became 5 h, past the hour in which the fridge's 4 hours run out. It now adds exactly one hour: 3 h 30 min → 4 h 30 min (F92, [LESSONS C23](docs/LESSONS_LEARNED.md#c-engineering-and-platform)).

### Tests

- 39 rule tests (+3): "power cut: the fridge keeps 4 h, a full freezer 48 h, a half one 24 h, cold medicine a day (v1.10.0)", "medicine: days the pills last and how many more make the home check's target (v1.10.0)" and "dust today: the PCD bands to the decimal, AQI too, and who gets which lines (v1.10.0)".
- 157 smoke checks (+19): the pills (1); the fridge (9: the hours at 3 h 30 min, the first screen, + one hour, kept on the device, 44 px, the hub's count, only counts sent, no page errors, `/fridge` and `/en/fridge`); dust today (9: who is at home from the home check, 82.4 µg/m³ red, AQI 137 orange, a colour clears the number and shows the hint, 44 px, what is kept and what isn't, only counts sent, no page errors, `/air` and `/en/air` with `/pm25` linking the tool). The hub check now expects five buttons, and `/learn` and `llms.txt` all four tools.

### Checked

- Build: no warnings; 81 items (and 30 decoys), **112 sources** (+3); 44 files precached (`kit.js`, `kitplan.js` and `kit.json` already were, so the calculators work offline after one visit, and `/fridge` and `/air` open their tool offline); start screen **253 KB** compressed and first game screen **268 KB** (243 and 258 in v1.9.2): the tools' code counts toward the start screen though it loads only when a tool opens.
- `npm test`: 39 passed, 0 failed. `npm run smoke`: 157 passed, 0 failed on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027 (`SMOKE_DATE`).
- A visitor walk in headless Chromium at 320 × 568 (Thai), 360 × 640 (Thai), 390 × 844 (English), 768 × 1024 (Thai) and 1024 × 1366 (English): the start screen, the fridge, dust today (82 µg/m³), the pills (9 left, 2 a day: "พอ 4 วัน ให้พอ 7 วัน ต้องมีอีก 5 เม็ด"), `/air` and `/fridge`. No sideways scrolling, no control under 44 px, no page or console errors.
- axe-core: nothing on the fridge sheet, the dust sheet, `/air` or `/fridge`; on the start screen only the wordmark's coral half, as before ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- **Cross-check**, with a script written apart from the app's code: 35 of 35 readings got the notice's colour (25 in µg/m³ on both sides of every band edge, such as 15.04 → blue, 15.05 → green, 37.55 → orange, 75.05 → red, and 10 AQI values), and 8 of 8 fridge times (0.5 to 48.5 h, full and half freezer, cold medicine) got the status the sources' hours give.
- **Not run:** real phones (the fridge timer after closing the app, the dust tool inside LINE, the pills fields: [06-test-checklist](docs/06-test-checklist.md) rows 64–66); `npm run probe` (no item, slot or water change, so houses and challenge links are unchanged).

## [1.9.2] — 2026-10-19

**Answers, back button, card and security.** After v1.9.1 the owner said on 19 Oct 2026: "Continue what yo suggested to make app attractive and secure practical usability", and asked for suggestions on the UI and UX, a check as visitors with cross-validation, and frank advice. What was suggested were the leftovers of the second visitor audit ([ROADMAP N19](docs/ROADMAP.md#n19-visitor-audit-2)): group D (wrong answers that are easy to spot), the result card at chat size, the back button inside a round, a tablet layout and the structured data. This release does all of them except the tablet layout, which was looked at and kept as it is, and adds security headers ([ROADMAP N20](docs/ROADMAP.md#n20-v192-answers-back-button-card-security), [KNOWLEDGE §31](docs/KNOWLEDGE.md#31-answers-back-button-card-and-security-v192), [APPROACH §29](docs/APPROACH_AND_METHOD.md#29-answers-drafted-in-parallel-read-by-one-lead-v192)). No item, slot, room or `houseVersion` changed, and no right answer, tip, reason, feedback, source, `kind` or id: **houses, challenge links and the advice are the same.**

### Fixed

The answers ([KNOWN_ISSUES "In v1.9.2"](docs/KNOWN_ISSUES.md#in-v192-19-oct-2026)):

- **The right answer was usually the longest choice, so it could be picked without reading.** Over the 82 choice sets (81 items and `p-breaker`'s `wet` set), it was strictly the longest in 71 in Thai and 73 in English (the v1.9.1 audit, counting slightly differently, reported 72 and 74). 117 wrong labels in `items.json` were rewritten, in Thai and English, across the prepare, return, dust, fire and power-cut items and `p-breaker`'s `wet` set. Each now gives the reason a real person would give for that mistake and keeps the same mistake, so its `feedback` still answers it: "ปล่อยไว้ เสียก็ไปทำใหม่ได้" became "ปล่อยไว้ในลิ้นชักเหมือนเดิม เสียก็ไปขอทำใหม่ได้". Now the right answer is the longest in 17 of 82 sets in Thai and 16 in English; by length it is the longest, in the middle or the shortest in 17 / 40 / 25 sets in Thai and 16 / 37 / 29 in English. In 14 sets one drafted rewrite was left out on purpose, so the right answer stays the longest by a hair (the longest wrong one is 0.79–0.97 of it): otherwise it would almost never be the longest, and "never pick the longest" would be the new tell. The new Thai wrong answers still need a native reader ([ROADMAP L5](docs/ROADMAP.md#l5-second-native-reader-for-the-thai-copy)) (F83).
- **The answers' icons gave the right one away too.** Each answer button drew an icon for its `kind` (a clock for `leave`, a bag for `pack`…). In 42 of the 82 sets one answer had a different icon from the other two, and it was the right one in 26 of them, mostly because the two wrong answers shared the clock ("wait", "leave it"). Each button now shows a letter in the same 36 px badge, ก ข ค in Thai and A B C in English (`strings.json → choiceLetters`); the choices are still shuffled for each house, so a letter tells nothing. `icons.js` lost `actionIcon` (only `spriteIcon` is left); `kind` stays in `items.json` as a description of the action but is no longer drawn (F90).

Small screens:

- **A choice's three answers fit on phones up to 640 px tall.** Under `max-height: 640px` the sheet may take 92 % of the screen, the item's picture is 52 px wide, the answers are 8 px apart and at least 52 px tall (padding 8 × 12 px; every tap target stays 44 px or more). Measured by filling the real sheet with every item's labels: no Thai sheet scrolls at 320 × 568, 360 × 640 or 390 × 844. English at 320 × 568: 20 of 82 sheets still scroll, by up to 78 px (`p-meds`, whose right answer is 82 characters), against 42 of 82 on the live v1.9.1; none at 360 × 640 or 390 × 844 ([KNOWN_ISSUES #73](docs/KNOWN_ISSUES.md#73-english-choice-sheets-still-scroll-on-the-smallest-phones)) (F84).

The back button:

- **Back inside a round left the site** (into the chat, when the link came from LINE), and so did Back on the result screen. `ui.js` now has one history manager: the game screen and the result screen own one history entry, and an open sheet one more (`history.state.brm` is the depth). After each change the entries are made to match what is showing, once, in the next task, so a sheet that closes and another that opens straight after share one entry. So: Back in a round pauses it (the pause sheet); Back again resumes it; Back on the result goes to the start screen; Back on the start screen leaves the site, as before (F85).

The card:

- **The result card is readable at chat size.** Shown about 270 px wide in a chat, the gecko's line was about 9 px and the printed link about 7 px. `drawResultCard` in `cards.js` now draws the gecko (300 × 316) at the top, its line in a wide bubble under it (52 px, shrinking to 38 px to fit two lines, three at 38 px if it must; centred, the tail pointing up), the score at 200 px, the rank, the dots, the call to action (50 px, down to 34) and the link (46 px, down to 30, weight 600). The separate headline is gone: the wordmark, the mode chip, the score and the rank say it. Looked at 270 px wide: the line and the link can be read. `share/sample-result-prepare.png` and `sample-result-return.png` re-rendered (F86).

Guide pictures:

- **The four guides with no game looked alike in a chat:** their pictures drew the gecko with nothing on. Now the landslide and earthquake guides give it a yellow hard hat, the storm guide the rain hood and the heat guide a straw sun hat with a red band (`config.json → guides[].prop`, a new optional field; `mascot.js` has the new `helmet` and `sunhat`; a guide with a game keeps its mode's prop). `og/checklist-{landslide,storm,quake,heat}.png`, the same four under `og/en/` and `share/checklist-{landslide,storm,quake,heat}.png` re-rendered. The previews' helpline line (about 6 px in a chat) and the `/?open=…` previews are unchanged ([KNOWN_ISSUES #68](docs/KNOWN_ISSUES.md#68-link-previews-are-small-at-chat-size)) (F87).

Security:

- **Other sites could show the app in a frame.** `public/_headers` now also sends `Content-Security-Policy: frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` and `X-Frame-Options: SAMEORIGIN` on every page: no framing by other sites (clickjacking), no plugins, no `<base>` or form target on another site. There is deliberately **no `script-src` or `default-src`**: Cloudflare injects inline scripts into the pages (the Web Analytics beacon, the zone's JavaScript detections), which such a policy would block, or allow only through hashes that change. HSTS is already sent by Cloudflare; nosniff, `Referrer-Policy` and `Permissions-Policy` stay ([GUIDELINES rule 76](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) (F88).

Search:

- **Structured data describes the app as it is.** A publisher, `Organization` (`@id` `…/#org`, the name, "Baan Rod Mai?", the address, the 512 px icon as its logo), is in the start page's `@graph`; `WebSite.publisher` points to it; the `Article` markup on `/learn` and every hazard page names it as `author` and `publisher`; the app's `applicationCategory` is `UtilitiesApplication`. The type stays `['VideoGame', 'WebApplication']`, because the game is still part of the app, and `x-default` stays `/en/`, the page for visitors whose language is neither Thai nor English, which is what `x-default` is for. `llms.txt`'s tools line also links the tools' own pages ("every line and its source: …/kit", "…/plan") (F89).

Found in our own review before release, never live:

- **The English start page's structured data put the app's English details on the publisher.** The build copies the Thai `@graph` for `/en/` and changed two of its nodes by position; the publisher was inserted at position 1, where the game node used to be, so on `/en/` the `Organization` got the English description, the `/en/` address and `subjectOf` `/en/learn`, while the game node kept the Thai ones. The build now finds the game node by its `@id` (`…/#game`); a unit test checks both start pages (F91, [LESSONS C22](docs/LESSONS_LEARNED.md#c-engineering-and-platform)).

### Changed

- **Content:** 117 wrong labels in `items.json` (Thai and English); `strings.json → choiceLetters` (ก ข ค / A B C); `config.json → guides[].prop` (`helmet` for `landslide` and `quake`, `hood` for `storm`, `sunhat` for `heat`), checked by the build. `npm run docs` regenerated [docs/01](docs/01-safety-content.md)'s table.
- **Code:** `ui.js` (the history manager: `settleHistory`, `setScreenBack`), `main.js` (Back in a round pauses it, on the result goes home; lettered answers), `icons.js` (`actionIcon` removed), `cards.js` (`drawResultCard`, the new `endingBubble`), `modes.js` (`setGuides`, `propFor`), `mascot.js` (`helmet`, `sunhat`), `content.js`, `app.css` (the choice sheet under `max-height: 640px`), `tools/build.mjs` (the publisher, `applicationCategory`, the English game node found by `@id`, the guides' `prop` check, `llms.txt`), `public/_headers`.
- **Not changed, on purpose:** the tablet layout stays a 480 px phone column ([KNOWN_ISSUES #71](docs/KNOWN_ISSUES.md#71-on-a-tablet-the-app-is-a-narrow-column), By design).
- **No new events** ([05-metrics](docs/05-metrics.md#answers-back-button-and-card-v192)).
- **Images:** re-rendered and compared by pixels; only those meant to change are committed (the two sample result cards and the twelve pictures of the four guides with no game), and files that came back with pixel noise only were restored by exact name ([LESSONS E10](docs/LESSONS_LEARNED.md#e-process-documentation-and-git)).
- Version 1.9.2 in `package.json`, `package-lock.json` and `config.json`.

### Tests

- 36 rule tests (+4): "the right answer is not given away by its length (KNOWN_ISSUES #66)" (per language the right answer is strictly the longest in 10–33 % of sets; when it is, the longest wrong one is at least 0.75 of it; every wrong label is at most 60 Thai code points or 80 English characters; on the v1.9.1 content it fails with 71 of 82), "every guide picture has a gecko accessory, games and guides alike (v1.9.2)" "security headers: no framing by other sites, no plugins, no foreign base or form target" (it also fails on a `script-src`) and "structured data: one publisher, and each start page describes the app in its own language" (F91).
- 138 smoke checks (+4): "the answers are lettered ก ข ค, with no icon that tells them apart", "back inside a round pauses it (the pause sheet), back again resumes; still on the site", "back on the result goes to the start screen, still on the site" and "no page errors (back in the game)".
- Found before the first run: a second `const home` in `tests/smoke.mjs` made the file a `SyntaxError`, so nothing in it ran; renamed ([LESSONS D20](docs/LESSONS_LEARNED.md#d-testing-and-verification)).

### Checked

- Build: no warnings; 81 items (and 30 decoys), 109 sources; 44 files precached; start screen **243 KB** compressed and first game screen **258 KB** (240 and 254 KB in v1.9.1: the longer wrong answers, the history manager and the card).
- `npm test`: 36 passed, 0 failed. `npm run smoke`: 138 passed, 0 failed on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027 (`SMOKE_DATE`).
- A scratch probe that filled the real choice sheet with every item's labels at 320 × 568, 360 × 640 and 390 × 844 (F84); the result card looked at 270 px wide (F86); the back button in a round and on the result in a scratch probe as well as the smoke checks (F85).
- A visitor walk in headless Chromium at 360 × 640 and 320 × 568 in Thai and 390 × 844 in English: a real tap on a thing to do, the lettered answers, a wrong answer's feedback, Back (the pause sheet), Back again (the round goes on), the result, Back (the start screen); no page errors or console errors. At 768 × 1024: the start screen and `/quake`, whose `Article` names the publisher as author.
- axe-core: nothing found on the choice sheet, the result screen or `/quake`; on the start screen only the wordmark's coral half, as before ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- Each new check was run against the code before its fix and failed: the letters check with icon badges ("svg svg svg"), the structured-data test on the v1.9.1 build, the answer-length test on the v1.9.1 content.
- **Not run:** real phones (the Android back gesture, iOS's swipe back and LINE's in-app browser, [06-test-checklist](docs/06-test-checklist.md) rows 61–63); the live site's headers, checked with `curl -sI` after the deploy; Google's Rich Results Test of the new publisher ([ROADMAP L8](docs/ROADMAP.md#l8-search-consoles-and-ai-search-check)); `npm run probe` (no item, slot, size or water change).

## [1.9.1] — 2026-10-19

**Visitor audit 2.** The owner asked on 19 Oct 2026: "Validate the app as visitors for overall, and look what good in UI/UX or anything to improve? You can suggest." Three audit agents walked the live v1.9.0 site at the same time (the tools journey, the game and share loop, the pages and previews), with analytics blocked; the lead re-checked every finding before fixing it (screenshots opened, code read, the share, smoke and Thai-break bugs reproduced). The owner then said "Continue all as you suggested": groups A (bugs), B (pages and tools) and C (game) are in this release; group D (content: wrong answers that are easy to spot) waits for a Thai review ([KNOWLEDGE §30](docs/KNOWLEDGE.md#30-visitor-audit-2-v191), [APPROACH §28](docs/APPROACH_AND_METHOD.md#28-visitor-audit-2-three-auditors-in-parallel-v191)). No item, room, slot or `houseVersion` changed, so **houses and challenge links are the same**. The flood's water curve did change (`config.json → round.prepare.water`), so Prepare rounds now give more time before the water, and a score from before this release and one after it aren't strictly comparable.

**What the audit found good, and kept:** the alert and the three hub buttons are on the first screen on every device tried, and the advice is 1–2 taps away; no console errors; no tap target under 44 px; axe-core clean except the wordmark's coral half; first paint 0.30–0.69 s (1.14–1.20 s on slow 4G with the CPU slowed 4×); offline after one visit works; 142 of 142 internal links answer 200; amounts follow the household; the challenge loop is clear; about 60 fps.

### Fixed

Group A, bugs ([KNOWN_ISSUES "In v1.9.1"](docs/KNOWN_ISSUES.md#in-v191-19-oct-2026)):

- **Sharing to LINE, Facebook or X sent the game's tab away,** so Back lost the result, the lessons and the challenge back. `openExternal()` in `share.js` called `window.open(href, '_blank', 'noopener')`, which by the specification always returns `null`, so the `location.href` fallback ran every time as well. It now calls `window.open(href, '_blank')`, sets `opener = null` on the new window, and falls back only when it really gets `null` (F55).
- **The phone's back button left the site:** a guide opened from LINE dropped people back in the chat. An open sheet now owns one history entry (`ui.js`), so Back closes the sheet; closing it any other way removes the entry again. A sticky top bar with a 44 px ✕ (`#sheet-x`, not on the how-to, which can't be dismissed) keeps "close" one tap away: guides were 2.3–4.8 screens long with "ปิด" only at the bottom, the About sheet 16–25 (F56).
- **Thai words broke across lines** ("กระ|จก", "แข็ง|แรง", "ไฟ|ดับ" in the home check's intro; "หน่วย|งาน", "ต้องทำ|อะไร", "ใครช่วย|ใคร" on the start screen). The browser's own Thai dictionary splits them, and `word-break: keep-all` does nothing for Thai in Chromium. A word joiner (U+2060) inside the word, tried first, made it worse. The fix is `config.json → keepTogether`, 217 Thai words that are wrapped in `<span class="nw">` (no wrapping) in the app, on the Thai pages and on the canvas pictures, plus `text-wrap: pretty` ([KNOWLEDGE §30.1](docs/KNOWLEDGE.md#301-thai-words-that-must-not-break-keeptogether)) (F57).
- **Fire mode drew no smoke on shorter screens** (360 × 640, 375 × 667, 320 × 460; 390 × 844 was fine), while the gecko said "ควันลงมาต่ำแล้ว!". The smoke layer started above the picture and was only moved in with a `transform`, and it was never repainted. `scene.js` now redraws the smoke's rectangle and edge each frame (F58).
- **The share text of a guide with no game promised a game** ("เล่นเกมฝึกจริง 60 วิ" for the earthquake guide). Those guides now use `shareTextGuide`: "อ่านครบทุกข้อ พร้อมที่มา 👉" / "Every step, with its source 👉" (F59).
- **The `/checklist/<id>` pages told search engines they were the start screen** (canonical `/`, `hreflang` to themselves). Their canonical is now the hazard's page (`/checklist/quake` → `/quake`, `/en/checklist/prepare` → `/en/flood`), with no `hreflang` (F60).
- **One visit to an English page made Thai links open in English** on that phone, because the language was stored on every visit. Only a choice is remembered now (the language button or `?lang=`), under a new key, `brm:langPick`; values stored automatically under the old `brm:lang` are ignored, and the redirect script in `index.html` reads the new key (F61).
- **A first visit downloaded the app twice** (about 560 KB instead of about 290 KB, on prepaid data): the service worker's install fetched every file with `cache: 'reload'`. It now uses `cache: 'no-cache'`, which revalidates and gets a 304 for what the page already loaded. Not measured on the live site yet (F62).

Group B, pages and tools:

- **The hazard pages lead with the list.** `/flood`, `/pm25`, `/fire` and `/ready` opened with the game buttons, and `/flood`'s 10-line checklist was about 80 screens down (y ≈ 28,833 px). Now: the H1, a jump row (`/flood`: ก่อนน้ำมา / หลังน้ำลด; a guide-only page: each phase), "☎️ โทรฟรี 1784 · 199 · 1669" as `tel:` links, the list(s), the picture links, the intro, then the game buttons, the check and tool links and the lessons. At 320 × 460 and 360 × 640 every hazard page's first line starts within 450 px, in Thai and English (F63).
- **Titles no longer contradict the preview.** The mode hazards' titles said "43 ข้อ", "12" or "13" while their preview picture said "10 ข้อ"; titles now name no count ("น้ำท่วม ทำอะไรก่อนน้ำมา และหลังน้ำลด เช็กลิสต์พร้อมที่มา · บ้านรอดไหม?"), and the intros start with the checklist and end with the game. The `/en/` title went from 83 to 59 characters. The plain pages have `og:image:alt` (F64).
- **The guide sheet** (`openChecklist()`): phase jump chips and "☎️ โทรฟรี" with three `tel:` chips at the top; the sources small and muted under the list, with agency names in English on English pages (new `agencyName()` in `content.js`, also used by the in-game tips, the About sheet and the home check); one ⚠️ footnote; "เตรียมบ้านต่อ" with 🎒 เช็กของจำเป็น / 📝 แผนครอบครัว; the heading "ส่งต่อให้คนที่บ้าน" (was "ส่งต่อเป็นรูป", which promised a picture that LINE's buttons don't send); the picture as a thumbnail (it was 580 px tall and repeated the list); "เปิดในเบราว์เซอร์" inside LINE; "← เรื่องอื่น" and "เสร็จแล้ว" side by side; the four share buttons 2 × 2 (was 3 + 1) (F65).
- **The two flood guides** sit side by side and say what they are: "น้ำท่วม: ก่อนน้ำมา" / "น้ำท่วม: หลังน้ำลด" ("Flood: before it comes" / "Flood: after it goes down"). Guide order: prepare, return, landslide, storm, quake, fire, stock, heat, dust (F66).
- **The heat guide's phases** are named for what they are (`checklists.json → heat.phaseNames`): เตรียมไว้ก่อน / วันที่ร้อนจัด / ถ้ามีคนเป็นลมแดด (Get ready / Very hot days / Heatstroke), so "call 1669" no longer sits under "หลังเกิด" (after). `phaseNames` is a new optional field, checked by the build and used by the app, print and the pages (F67).
- **One name per tool:** เช็กของจำเป็น (sheet "เช็กของจำเป็น: บ้านเราพร้อมแค่ไหน?") and แผนครอบครัว (card "การ์ดแผนครอบครัว", sheet "แผนครอบครัวของบ้านเรา"); in English "Check your supplies: how ready is our home?" and "Our family plan". Before, the same tools were also called บ้านเราพร้อมแค่ไหน?, แชร์ผลเช็กบ้าน, เครื่องเช็กบ้าน, แผนบ้านรอดของบ้านเรา and การ์ดแผนบ้านรอด. The manifest's shortcuts are renamed; `og/plan.png` and `og/en/plan.png` re-rendered (F68).
- **The home check:** one ⚠️ footnote instead of "⚠️ ข้อนี้อยู่ระหว่างตรวจทาน" on 4 of 9 rows; the start screen's 🎒 button shows the new score at once (it showed only after a reload); the share sheet has "เสร็จแล้ว" next to "← กลับไปที่รายการ" (F69).
- **The alert card is written into the page by the build** (`index.html` and every page copied from it). On slow 4G the script added it at 2.75 s and pushed the hub down 79 px (CLS 0.08). The script still hides it after its end date and on a challenge link (F70).
- **The start screen:** the hub's sub-labels are 14 px (were 12.6), "ตามจำนวนคนในบ้าน" breaks evenly, and the alert's "·" stays with the name (a no-break space) (F71).
- **A 404 page.** Unknown addresses (`/nonexistent-page`, `/c/p99`, `/en/posts`, `/og/nope.png`) got the start screen with status 200. The build now writes `public/404.html` (Thai and English, `noindex`, links to the start, "what to do" and `/learn`); Cloudflare Pages serves it with a 404 (F72).
- **Offline, a page never visited** (`/quake`, `/kit`) got the app shell from the service worker and showed the start screen; the app now opens that hazard's guide, or the tool (F73).
- **`robots.txt`'s comment and the `<noscript>` line** called the site a game and named floods only; they now say tools first (F74).

Group C, the game:

- **The flood came too fast.** On the 18 Oct 2026 house every target was under water by 26.8 s (the first at 13.6 s), and a careful player's round ended at 15.9 s of game time with 5/10 against a friend's 8; over 90 houses, 32 % of targets flooded before 20 s, and in 49 of them a target in another room flooded before 18 s. `config.json → round.prepare.water` is now `[[0, 625], [0.35, 590], [0.6, 470], [0.82, 390], [1, 300]]` (was `[[0, 612], [0.25, 580], [0.45, 470], [0.7, 390], [1, 300]]`). Over 90 houses from 1 Oct 2026: the first flood comes at 21.9 s at the earliest (median 23.2 s), no target floods before 20 s, no house has a target in another room under water before 18 s, the 18 Oct house's last target goes under at 35.8 s, and the floor is wet at 36 s (was 27 s) (F75).
- **"Done" counts only what the player did.** The HUD showed "4/6" when 2 of the 4 had been lost to the water, and a room tab showed a blue ✓ though its only item had flooded. The HUD now reads, for example, "0/6 💧5" (💧 water, 💨 smoke, 🌑 the power cut: `strings.json → lostMark`, `lostMarkFire`, `lostMarkStock`, which the share text's grid now reads too); a tab whose things were lost shows the mark, not ✓; and the result shows "💧 โดนน้ำก่อน 6 อย่าง" instead of "เหลือเวลา 44 วิ" when anything was lost (`statLost`) (F76).
- **The idle hint rings only things to do.** It also ringed the decoys, which cost 2 s each (`.show-hints .item-target`). A tapped decoy shows a grey dash, not a tick that read as a win (F77).
- **How-to step 4 tells the truth.** It said "ไม่ต้องกังวลเรื่องเวลา: เมื่อแตะของ นาฬิกาจะหยุดทันที…" in every mode; now, for example, "นาฬิกาหยุดตอนอ่านตัวเลือก แต่น้ำขึ้นระหว่างที่มองหา แตะของที่ไม่เสี่ยงเสียเวลา 2 วิ 💡", per mode (water, haze, smoke, the dark), with the 2 taken from `round.decoyPenaltySec` (F78).
- **Short screens (520 px tall or less):** the how-to's four steps and a choice's three answers fit above the fold at 320 × 460, and a sheet shows a soft shadow at the bottom while there is more below (F79).
- **The result:** the lessons list mistakes first (wrong, lost, missed, then right); "อีกนิดเดียว!" only when the player was 1–2 points short, otherwise "รอบหน้าเอาใหม่!" (`versusLoseFar`) (F80).
- **The LINE share sheet** said "แตะรูปด้านบน" (touch the picture above) for a picture below the buttons; it now says "ด้านล่าง" (F81).

Found in our own review before release:

- **Four CSS rules caught the new kept-word spans.** `.quick-btn span:first-child`, `.book-grid span`, `.stats span` and `.alert-btn span:nth-child(2)` matched any span inside, so the `<span class="nw">` added around a kept word inherited them: "ช่วยเหลือ" in the "เบอร์ช่วยเหลือ" button grew to 22 px, and a kept word in the safety book would have been placed `absolute` and one in the result's stats drawn as a pill. They now match direct children only (`.quick-btn > span:first-child`, `.book-grid li > span`, `.stats > span`, `.alert-btn > span:nth-child(2)`) ([GUIDELINES rule 72](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)) (F82).

### Changed

- **New content field and list:** `config.json → keepTogether` (217 Thai words, 2–14 letters each) and `checklists.json → <guide>.phaseNames` (optional, `heat` uses it). Both `_readme`s explain them in Thai.
- **Strings:** `shareTextGuide`, `guideJump`, `telFree`, `guideNext`, `done`, `versusLoseFar`, `lostMark`, `lostMarkFire`, `lostMarkStock`, `statLost`, `seo.<lang>.notFoundTitle` and `notFoundBody`; reworded `howto…` step 4, `guideShare`, `guidePrepare`, `guideReturn`, `alertCard`, `kitFromResult`, `lineGuideText`, `aboutPrivacy`, `og`/`ogEn.planLine1`, `ogEn.defaultTitle`, the mode hazards' `seo.<lang>.hazard<H>Title` and `Intro`, `toolKit`, `toolPlan`, `kitPageCta`, `planPageTitle`, `planPageH1`, and the tools' names in `kit.json → ui`.
- **Code:** `util.js` (`setKeepTogether`, `keptSpans`, `keepWordsIn`, `observeKeptWords`), `ui.js` (the sheet's history entry and ✕), `share.js` (`openExternal`), `scene.js` (the smoke's geometry, `updateCounts` with the lost mark, the decoy's dash), `content.js` (`agencyName`, `brm:langPick`), `main.js` (the guide sheet, the HUD, the result, the offline page path), `cards.js` (`tokens()` keeps kept words whole), `kit.js`, `tools/build.mjs` (the hazard pages' order, the static alert, the checklist canonical, `404.html`, `keepHtml`, the `keepTogether` and `phaseNames` checks), `tools/sw.template.js`, `tools/render.html` (calls `setKeepTogether`).
- **No new events.** New label values only: `help_click` from a guide's ☎️ chips (with the guide as the mode), and `kit_open` and `plan_open` with the label `guide` from a guide's "เตรียมบ้านต่อ" buttons ([05-metrics](docs/05-metrics.md#visitor-audit-2-v191)).
- **Images** (`npm run images`), committed only where the change was meant: `og/plan.png` and `og/en/plan.png` (the new name), `share/checklist-{prepare,dust,stock}.png` and seven carousel pages (`fire/06`, `pm25/01`, `pm25/07`, `ready/01`, `ready/06`, `ready/07`, `ready/09`), whose Thai now wraps between words. The icons, `og/p*.png`, `og/r*.png` and `carousel/flood/05.jpg` came back with pixel noise only (measured) and were restored ([LESSONS E10](docs/LESSONS_LEARNED.md#e-process-documentation-and-git)).
- Version 1.9.1 in `package.json`, `package-lock.json` and `config.json`; the build regenerated every page that copies the start screen.

### Tests

- 32 rule tests (+3): "flood pace: no target goes under in the first 20 s, and never all of them before 30 s" (over 120 days; the water test now reads the first keyframe from `config.json`), "Thai words in keepTogether never break across lines on the cards" (every kept word at widths 80–300; without the list it finds 7 bad wraps on "…ที่เป็นกระจก") and "config: every keepTogether word is short Thai, listed once".
- 134 smoke checks (+17), section 13: the phone's back button closes a sheet and stays in the app; ✕ stays at the top of a long sheet and closes it; a guide's "during" is one tap away, its helplines are `tel:` buttons, and its next steps lead to the home check and the plan; a guide with no game is shared without promising a game; sharing to LINE opens one new tab and this tab stays (with a `window.open` stub that returns `null` for `'noopener'`, as browsers do; with the old `share.js` the tab went to line.me); no kept word is split in a guide (36 kept words); opening `/en/` once doesn't make Thai links open in English, and the language button is remembered; the alert card is in the page before the script runs; checklist pages point at their hazard page; an unknown address gets the 404 page (the test server answers like Pages); `/quake` served offline opens the quake guide; the fire smoke is drawn at 360 × 640; the idle hint rings only things to do; nothing floods in the first 19 s and the HUD shows what the water took (💧) apart from what was done; kept Thai words look like the text around them in a guide, on the start screen and in the safety book (it fails with the v1.9.0 selectors, F82); no page errors. The hazard-page check at 320 × 460 now requires the helplines and the first line on the first screen and no game button before the list, and compares the H1 as text.

### Checked

- Build: no warnings; 129 link-preview pages; the plain pages now include `404.html`; 44 files precached; start screen **240 KB** compressed and first game screen **254 KB** (232 and 247 KB in v1.9.0; the +8 KB are the hub's text, the guide sheet and the `keepTogether` list).
- `npm test`: 32 passed, 0 failed. `npm run smoke`: 134 passed, 0 failed on 18 Oct 2026, 5 Dec 2026 and 10 Apr 2027 (`SMOKE_DATE`).
- `npm run probe`: 0 % tap-area overlaps over 3,650 houses; Prepare floor wet at 36 s, the new flood timings in [KNOWLEDGE §3](docs/KNOWLEDGE.md#water-prepare-only); fire smoke unchanged (low at 38.5 s).
- axe-core: nothing found on `/`, `/checklist/quake`, `/en/checklist/heat`, the home check's list, `/flood`, `/en/quake` and the 404 page, except the wordmark's coral half on `/` ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- Walked again as a visitor and looked at the screenshots at 320 × 460, 360 × 640, 390 × 844 (English) and 768 × 1024: the start screen, the picker, a guide's top and bottom, the home check's list and share sheet, the how-to, a choice, the HUD with 💧, the result, the 404 page and the hazard pages.
- **Not run:** real phones; the live site (after the push). Cloudflare Web Analytics now appears to be on: the live HTML carries its beacon (`static.cloudflareinsights.com`) and no `Set-Cookie` ([ROADMAP L1](docs/ROADMAP.md#l1-create-the-cloudflare-pages-project), for the owner to confirm).

## [1.9.0] — 2026-10-19

**"พร้อมทุกภัย" (ready for any disaster): tools first, the game optional.** The owner's direction on 19 Oct 2026: "We do not know which topics can hit now; prepare for all possibilities; some trends happen spontaneously. เตรียมบ้าน can be general for all catastrophes. People like to know what they should prepare or do. The game can be the option to make it more understandable or help them not read so much text. It should not force everyone to play the game; it is a tool to help them." So the start screen now opens on three tools (what to do when something happens, what to keep at home, the family plan), every hazard has a short sourced "what to do" guide, four of them for hazards the game doesn't cover (flash floods and landslides, storms and lightning, earthquakes, extreme heat), the owner can put one guide on top of the start screen while it is in the news, and the 60-second game sits below as the easier way to remember ([KNOWLEDGE §29](docs/KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)). No item, room, slot or `houseVersion` changed, so houses and challenge links are the same and no midnight release is needed.

### Added

- **The start screen's hub** (`index.html`, `app.css → .hub`, `main.js → renderStart`), under the logo and the tagline:
  - an optional **alert card** (`#alert-card`, "ช่วงนี้: น้ำป่า ดินถล่ม · ดูว่าต้องทำอะไร ›"), shown only while `config.json → alert` is on;
  - **"📋 ต้องทำอะไร เมื่อเกิดภัย"** (big, full width; "น้ำท่วม แผ่นดินไหว พายุ ไฟไหม้ และเรื่องอื่น"), which opens the guide picker;
  - **"🎒 เช็กของจำเป็น"** ("ตามจำนวนคนในบ้าน", or the saved score "บ้านเราพร้อม 64%" once the household has checked) and **"📝 แผนครอบครัว"** ("จุดนัดพบ ใครช่วยใคร"), the home check and the plan card of v1.8.0;
  - then **"🎮 หรือเล่นเกม 60 วิ จำง่ายกว่าอ่าน"**, the gecko and the game cards, as before.
  - A friend's challenge link hides the hub, the game label and the alert (`.has-challenge`), so the accept button stays on the first screen at 320 × 460.
- **A "what to do" guide for every hazard.** `config.json → guides` lists nine in display order, each with an icon and a hazard: 🌊 `prepare` (flood), ⛰️ `landslide`, ⛈️ `storm`, 🧹 `return` (flood), 🏚️ `quake`, 🔥 `fire`, 🔦 `stock` (power cut), 🌡️ `heat`, 😷 `dust`. A game mode's 10-item checklist is its guide. **Four new guides have no game** (`checklists.json`), each 10 lines with a `phase` (`before`, `during`, `after`), `sources` and `verify` (and a `verifyNote` when `partial`):
  - **น้ำป่า ดินถล่ม** / Flash floods and landslides: 7 ✅, 3 ⚠️ (checking whether the home is at risk; never crossing flowing water or mud; keeping away from the slide until officials say it is safe)
  - **พายุ ลมแรง ฟ้าผ่า** / Storms, wind and lightning: 9 ✅, 1 ⚠️ (checking the electrics after the storm)
  - **แผ่นดินไหว** / Earthquake: 9 ✅, 1 ⚠️ (the tsunami line: "ริมทะเล: ไหวหรือน้ำลดฉับพลัน รีบไปที่สูง")
  - **อากาศร้อนจัด** / Extreme heat: 10 ✅
  - Researched in parallel on 18–19 Oct 2026, Thai agencies first (ปภ., กรมทรัพยากรธรณี, กรมทรัพยากรน้ำ, กรมอุตุนิยมวิทยา, กรมอนามัย, กรมควบคุมโรค, กฟน., กฟภ., กทม.), mostly through Thai news reports quoting the agency, cross-checked with Ready.gov, WHO, the US CDC and the US National Weather Service. Each guide's sources, line by line: [KNOWLEDGE §29.3](docs/KNOWLEDGE.md#293-the-four-new-guides-and-their-sources).
  - **Left out on purpose,** because sources disagree or none was found: unplugging in lightning (ปภ. says unplug, the US NWS says don't), no mobile phones in lightning (ปภ. and กรมอุตุฯ vs the NWS), how much water to drink in the heat (กรมอนามัย's 8 glasses vs WHO's different figure), fans and windows in the heat (กรมอนามัย, WHO and the CDC disagree on thresholds), heat temperatures, pets in parked cars (no Thai source), leaving a tall building at once vs waiting until the shaking stops (the stairs line gives no timing), walking times and warning minutes, the 100 mm-a-day rain threshold, tilting trees or poles as a landslide sign (no Thai source) and tying down roof sheets (no source) ([KNOWLEDGE §29.4](docs/KNOWLEDGE.md#294-what-was-left-out-and-why)).
- **The guide picker and the guide sheet** (`openGuides()`, `openChecklist()` in `main.js`): a grid of the nine guides, three columns on most phones (two at 320 px), with the alert's first and marked "ช่วงนี้"; a guide shows its lines grouped by phase ("ก่อนเกิด", "ขณะเกิด", "หลังเกิด") with continuous numbers, ⚠️ on the lines under review, the agencies, then "▶ เล่นเกมเรื่องนี้ 60 วิ" (only when the guide has a game), "📖 อ่านเหตุผลและที่มาทีละข้อ" (the hazard page), the share buttons and the 1080 × 1920 picture, "🖨️ พิมพ์เก็บไว้", "← เรื่องอื่น" and "ปิด".
- **Deep links:** `/?open=guide` opens the picker; `/checklist/<id>` and `/en/checklist/<id>` open any of the nine guides, with new pages and preview images for `landslide`, `storm`, `quake` and `heat`.
- **The alert switch,** `config.json → alert: { guide, until }`: the owner's card at the top of the start screen, which always ends by itself. `activeAlert()` in `modes.js` (pure, unit-tested) returns the guide while today's Bangkok date is on or before `until`, and nothing without an end date. It is set to `landslide` until `2026-10-25`, matching ปภ.'s warning of 18 Oct 2026 (heavy rain, flash floods and mudslides, 18–25 Oct, as reported by Thairath). The build stops when `alert.guide` isn't a guide or `alert.until` isn't a real date, warns once the date has passed, and adds the alert to its `start` line.
- **Print (A4):** "🖨️ พิมพ์เก็บไว้" on every guide and on the home check's list (`printList()` in `ui.js`, `@media print` in `app.css`): a plain list with tick boxes, the phase headings, "⚠️ ข้อนี้ยังรอตรวจทานกับหน่วยงาน" under lines under review, the sources (the agencies for a guide; each line's for the home check), the helplines, "พิมพ์จาก … เมื่อ …" and the disclaimer. Not offered in in-app browsers (LINE, Facebook, Instagram, TikTok), which can't print (`canPrint()`).
- **Hazard pages for the four new hazards,** `/landslide`, `/storm`, `/quake` and `/heat` (and `/en/…`), from `config.json → hazards`. A hazard with no game leads with its guide: the phases as headings, every line's sources and ⚠️ under it, a link to its picture, then the intro, the home check and plan card links, the helplines and the "By hazard" row. Their previews are the guides' images.
- **`/kit` and `/plan`** (and `/en/kit`, `/en/plan`): plain pages for the home check and the plan card, each with its own preview image (`og/kit.png`, `og/plan.png`, English twins), every line with its sources (⚠️ where under review), and a button into the tool (`/?open=kit`, `/?open=plan`). The kit card and the plan card now print, and their share texts link, `/kit` and `/plan`, so a forwarded card previews as the check rather than the game. `kit` and `plan` are reserved page names in the build.
- **`/learn` lists every guide** with its phases and, for the four new guides, the sources under each line; **`llms.txt`** has a section per new guide ("What to do: …") with each line's source URLs and "(under review)" on ⚠️ lines; the **sitemap** lists 24 addresses (12 pairs: `/`, `/learn`, eight hazard pages, `/kit`, `/plan`).
- **`/posts` gains the guides:** a section "รูป "ต้องทำอะไร" ทุกภัย" with each guide's 1080 × 1920 picture and a ready caption that links `/checklist/<id>`, for posting within a minute when something is in the news (`carousel.json → guidesTitle`, `guidesIntro`, `guideCaption`).
- **36 sources** (109 in all): 27 Thai news reports quoting an agency (`secondary`), 1 TMD technical paper on tsunamis (`official`), and 8 international pages (Ready.gov ×4, the US NWS ×2, WHO, the US CDC) used to cross-check; each `note` quotes what was read and names what was not used. English agency names for กรมทรัพยากรธรณี (DMR), กรมทรัพยากรน้ำ (DWR), WHO and the NWS in `seo.en.agencies`.
- **Images** (`npm run images`): `og/checklist-{landslide,storm,quake,heat}.png` and their English twins, `share/checklist-{landslide,storm,quake,heat}.png`, `og/kit.png`, `og/plan.png` and their English twins (16 new files); `og/default.png` and `og/en/default.png` re-rendered with the new default texts. `drawChecklist()` has a layout without the small pictures (the number at the left, more room for text) and `cards.js → THEMES` has `landslide`, `storm`, `quake` and `heat`.
- **Analytics** (both allowlists, `public/js/analytics.js` and `functions/api/e.js`): `guide_open` when the picker opens, labelled `start` (the hub), `link` (`/?open=guide`) or `guide` (back from a guide); `print`, labelled `kit` or `guide` (with the guide's id as the mode). `checklist_open` now carries where the guide was opened from: `picker`, `alert`, `link` (`/checklist/<id>`) or `result` (the result screen's 📋 button); `mode_select` has the label `guide` when ▶ in a guide starts its game, and `learn_open` the guide's id when "📖" opens its hazard page ([05-metrics](docs/05-metrics.md#tools-first-v190)).
- **A third app shortcut,** "ต้องทำอะไร เมื่อเกิดภัย" → `/?open=guide&source=pwa` (`manifest.webmanifest → shortcuts`).
- **Strings:** `hubLabel`, `hubGuide`, `hubGuideSub`, `hubKit`, `hubKitSub`, `hubKitScore`, `hubPlan`, `hubPlanSub`, `gameLabel`, `guidePickTitle`, `guidePickSub`, `guideNow`, `guideBack`, `guidePlay`, `guideRead`, `guideShare`, `guidePartial`, `phaseBefore`, `phaseDuring`, `phaseAfter`, `alertCard`, `printBtn`, `printNote`, `partialItem` and `guide<Id>` for the nine guides (264 keys per language, was 233; `kitChip` and `kitChipScore` were removed with the quick button); `og`/`ogEn` `checklistTitle<Landslide|Storm|Quake|Heat>` and `kit|plan` `Line1`, `Line2`, `Pill`; `seo.<lang>.hazard<Landslide|Storm|Quake|Heat><Nav|Title|Desc|H1|Intro>`, `guideHeading`, `guidePicture`, and the `/kit` and `/plan` page texts.
- **Build checks for guides** (`tools/build.mjs`): every guide in `config.json → guides` has a known hazard, an icon, its `guide<Id>` and `checklistTitle<Id>` strings and a checklist, and every checklist is a guide; a guide with a game must share the mode's hazard; a guide with no game has exactly 10 lines, phases in the order before → during → after, at least one existing source per line, `verify` of `verified` or `partial` (with a `verifyNote`), and a warning when a Thai line is over 48 characters (about two lines on the picture). A hazard may now have a guide and no mode.

### Changed

- **The quick buttons** under the game hold only the helplines and the water-level link; the checklists and the home check moved up into the hub.
- **The per-mode checklist tabs are gone.** The result screen's "📋 เช็กลิสต์ 10 ข้อ" opens that mode's guide, and "← เรื่องอื่น" leads to the other eight.
- **The words that describe the whole app** ([GUIDELINES rule 59](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)): the tagline "เตรียมบ้านให้พร้อมทุกภัย รู้ว่าต้องทำอะไร และมีเกม 60 วิ ช่วยจำ" / "Get your home ready for any disaster: what to do, what to keep, and a 60-second game"; `og`/`ogEn` `defaultTitle`, `defaultDesc`, `defaultAlt`, `defaultLine1`, `defaultLine2` and `defaultPill` (with `og/default.png` re-rendered); the About intro (th/en); `/learn`'s title, description, heading and intro; `seo.en.llmsSummary` ("It is a tool first: …"); `manifest.webmanifest → name` ("บ้านรอดไหม? เตรียมบ้านให้พร้อมทุกภัย") and `description`; and `package.json → description`.
- **The build writes the start screen's static Thai text,** every `data-i18n` element in `index.html` whose `strings.json → th` value has no placeholder, as well as its `<title>` (from `og.defaultTitle`) and its meta description (from `og.defaultDesc`). Thai copy is no longer kept by hand in `index.html` ([GUIDELINES rule 65](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Hazard pages with a game** (`/flood`, `/pm25`, `/fire`, `/ready`) link each checklist's picture ("📲 ส่งต่อเป็นรูป: …", `/checklist/<id>`).
- `langPath()` in `content.js` keeps the language on any `/checklist/<id>`, including the guides with no game.
- `npm run images -- --only` takes several comma-separated paths (`--only og/kit,og/en/kit`).
- Version 1.9.0 in `package.json`, `package-lock.json` and `config.json`; the build regenerated every page that copies the start screen.

### Fixed

Found by walking the new screens and pages as a visitor before release ([KNOWN_ISSUES "In v1.9.0"](docs/KNOWN_ISSUES.md#in-v190-19-oct-2026)):

- **On a 320 × 460 phone, the guide-only hazard pages showed no advice on the first screen**: the first line came after the intro and links. The guide now comes first, under the H1, with the phases as its headings (F51).
- **The second line of some new link previews was cut off** at the image's edge; the texts were shortened (F52).
- **The "ขณะเกิด" (during) heading was below 4.5:1 contrast** in the guide sheet (axe-core); it is now `#9A4A05` (F53).
- **The English plan-card preview's text overlapped its pill;** fixed before the images were committed (F54).
- **Emoji newer than Unicode 11** in the new guides (🪟 🪜 🪧 🪴 🪨 🟤 🧊) were replaced, because older phones draw them as empty boxes ([GUIDELINES rule 64](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Loose ends found while writing these docs** ([KNOWN_ISSUES #65](docs/KNOWN_ISSUES.md#65-loose-ends-from-the-v190-sweep)): five older icons were also newer than Unicode 11 (🪟 🩺 🧊 in the game checklists, 🩹 🧊 in the home check; now 🚪 🏥 ❄️ ⛑️ ❄️); the index JSON-LD `about` lists all eight hazards; `npm run docs` counts the guides' citations, so docs/01 no longer marks their sources "not cited yet"; `ogEn.siteName` is "Baan Rod Mai? Home safety" and the About sheet's title "เกี่ยวกับบ้านรอดไหม?" / "About Baan Rod Mai?".

### Tests

- 29 rule tests (+2): "the alert switch: one guide on top until its end date, never without one" (the end date counts, the day after is off, no end date or no guide is off, and the shipped config names a real guide with an end date) and "guides with no game: 10 lines, before → during → after, a source on every line".
- 117 smoke checks (+21):
  - eight more hazard-page checks (`/landslide`, `/storm`, `/quake`, `/heat` and their English twins: a guide with a source on every line, its picture link, JSON-LD, the preview image, the tool links); the 320 × 460 page check now covers `/kit`, `/plan` and their twins and, on a guide-only page, measures where the first line **starts**; a check that `/kit` and `/plan` have their own preview, every line, a button into the tool and a place in the sitemap; `/posts` lists the nine guide pictures with a caption each;
  - a new section, "tools first": the three hub buttons on the first screen at 320 × 460 and 360 × 640; the alert card on the pinned day (from `activeAlert()`); the picker lists every guide in config order with the alert first; every guide opens with 10 lines, its picture, ▶ only with a game, a link to its page, sources on the guides with no game, and 44 px controls; printing a guide gives an A4 list of 10 boxes with ⚠️ on the lines under review and the app hidden; ▶ starts the guide's game; the deep links `/?open=guide`, `/checklist/quake` and `/en/checklist/heat`; an alert forced to `storm` shows its card and opens the storm guide; a challenge link hides the hub and the alert; `guide_open` and `print` are sent; no page errors.
- New doc screenshots: `docs/screens/20-start-tools.png` (the hub with the alert), `21-guide-picker.png` and `22-guide-quake.png` (the earthquake guide, by phase).

### Checked

- Build: no warnings; 81 items (+30 decoys), 109 sources, 129 link-preview pages, 81 lessons on `/learn`, `posts` 4 carousel sets and 45 images plus 9 guide pictures, 44 files precached, start screen **232 KB** compressed and first game screen **247 KB** (limit 500 KB). The +23 KB are mostly the 36 new sources' `note`s, which the start screen downloads but never shows ([KNOWN_ISSUES #62](docs/KNOWN_ISSUES.md#62-source-notes-are-downloaded-by-every-visitor)). The `start` line reads "… · alert landslide until 2026-10-25".
- `npm test`: 29 passed. `npm run smoke`: 117 passed on the pinned day, 18 Oct 2026, and 117 passed as 5 Dec 2026 (`SMOKE_DATE=2026-12-05`, where the alert card is hidden because its end date has passed).
- First-screen positions: the three tools are on the first screen at 320 × 460 (their bottoms at 324, 420 and 420 px), 360 × 640 (327, 407, 407), 390 × 844 and 768 × 1024; the recommended game card is now below the first screen at 320 × 460 and 360 × 640, by design ([KNOWN_ISSUES #61](docs/KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)).
- axe-core: nothing found on the guide picker, the guide sheets (after F53), `/quake`, `/en/heat`, `/landslide`, `/kit`, `/en/plan` and `/learn`, except the wordmark's coral half ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- `npm run probe` was not re-run: no item, slot or water setting changed. Houses and challenge links are unchanged.

## [1.8.1] — 2026-10-19

A whole-app visitor audit after v1.8.0. Every screen, sheet, card and page was walked as a visitor, in Thai and in English, at 320 × 460 and 360 × 640; each finding was fixed, measured and walked again ([APPROACH §26](docs/APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)). The release also ties the home check and the plan card into the flood pages, `/learn`, `llms.txt` and the installed app. No item, room, slot or `houseVersion` changed, so houses and challenge links are the same and no midnight release is needed.

### Fixed

- **The start screen still described three hazards.** The tagline (`strings.json → tagline`, th/en, and the static text in `index.html`, which every generated page copies) still said "จากน้ำท่วม ฝุ่น และไฟ" / "from floods, dust and fire" after the power cut (v1.7.0). It now reads "เกม 60 วิ ดูแลบ้านให้รอด จากน้ำท่วม ฝุ่น ไฟไหม้ และไฟดับ" / "A 60-second game to keep your home safe from floods, dust, fire and power cuts", and `manifest.webmanifest → description` adds "รับมือไฟดับ". The Thai `<title>` of `index.html` was hand-written and missed ไฟดับ; the build now writes it from `og.defaultTitle`. The index JSON-LD `about` says "Power cut preparedness" (was "Power outage") ([KNOWN_ISSUES F42](docs/KNOWN_ISSUES.md#in-v181-19-oct-2026)).
- **One English, British.** The power-cut lessons and the home check said "flashlight" while the rest of the game says "torch", "power cut", "litres" and "nappies". Now "torch" or "torches" everywhere: `s-candle` (the right choice, both feedbacks, tip and why), `s-torch` (name, context, right choice, feedback, tip and why), `s-radio`'s why, the home check's `torch` line ("Torches with spare batteries"), two lines of the `stock` checklist, `geckoStartStock` ("It's getting dark. Where's the torch?") and `seo.en.hazardOutageDesc`. `s-candle`'s why says "in a power cut", not "in a power outage", and the top power-cut rank (`rankStock`) is "Ready for Any Power Cut" (was "Ready for Any Blackout"). No image needed re-rendering: the English checklist previews draw only titles, the challenge previews draw no rank, and the carousels are Thai (F43).
- **The home check said "house" and "home" in one sheet.** Its English title and card said "How ready is our house?" and its buttons "home". Now "How ready is our home?" (`ui.en.title`, `cardTitle`), and the card's call to action "How ready is your home? Check for free" (`cardCta`) (F44).
- **A card line could start with "!".** `tokens()` in `cards.js` takes words from `Intl.Segmenter`, which returns "!" as a segment of its own, so the English result card could break "The house copes" | "! Nearly…". Closing punctuation (`! ? , . : ; ) ] } % … ” ’`) and Thai ๆ and ฯ now stay with the word before. A new unit test wraps every ending, in Thai and English, at widths 60–300: the old code made 180 such breaks, the new code none (F45).
- **The English wordmark ran into the sun or moon on the result card.** On the themes that draw one at the top right (return, dust and the power cut, x 890–1030), "Baan Rod Mai?" now shrinks to fit W − 440 (640 px) instead of W − 160; the Thai wordmark is drawn as before (F46).
- **The home check's questions broke Thai words at 320 px.** The four answers sat two per row and wrapped mid-word ("มีเด็ก|เล็ก"). `.kit-flags` columns are now at least 150 px wide (was 140), so under about 360 px they stack in one column (F47).
- **The plan card's share sheet said "back to the list" but went back to the plan form.** Its button now reads "← แก้แผน" / "← Edit the plan" (`kit.json → ui.backPlan`) and returns to the form with what was typed (F48).
- **A plan card with a few fields filled had a big empty gap.** The card now draws all six fields every time; an empty one gets a dotted line, so a printed copy can be filled in by hand (`drawPlanCard`, F49).

### Changed

- **The home check names floods as well as power cuts.** Its intro reads "ตอบ 2 ข้อ แล้วดูว่าบ้านเราควรมีอะไรบ้าง ถ้าน้ำท่วม ไฟดับ หรือต้องอยู่ในบ้าน 3 วัน" / "Answer 2 questions and see what your home needs for a flood, a power cut or 3 days indoors", and its share text "บ้านเราพร้อมแล้ว {pct}% ถ้าน้ำท่วมหรือไฟดับ 3 วัน 🎒 …" / "Our home is {pct}% ready for 3 days of flood or power cut 🎒 …". The same 3-day amounts come from the flood-era Thai sources (กรมประชาสัมพันธ์'s 72-hour list, ปภ.).
- **The flood hazard has the tools too:** `config.json → hazards.flood.tools: ["kit", "plan"]`. `/flood` and `/en/flood` link the home check and the plan card under the FloodWatch link.
- **The result screen's 🎒 button follows the hazard's tools,** not the `dark` threat: a result offers "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" when its mode's hazard lists `kit` in `config.json → hazards.<hazard>.tools`. Prepare, return and power-cut results show it; dust and fire don't.
- Version 1.8.1 in `package.json`, `package-lock.json` and `config.json`. The build regenerated every page that copies the start screen (the tagline and the version chip) and the pages with the changed lessons.

### Added

- **`plan_open`,** an anonymous event when the plan form opens, labelled where from (`link`, or `kit` from the home check's list), in both allowlists (`public/js/analytics.js`, `functions/api/e.js`); "← แก้แผน" back to the form doesn't send it again. Before, only shares of the plan card were counted. `kit_open` from a result now carries that result's mode. Nothing typed is ever sent, and the smoke test still checks it.
- **`/learn` and `/en/learn` link both tools** after the checklists, and **`llms.txt`** has a line for them: "Two family tools that run on the device; nothing typed is sent: Check how ready your home is (free, 1 minute): …/?open=kit · Make your family plan card: …/?open=plan".
- **App shortcuts** in `manifest.webmanifest → shortcuts`: a long-press on the installed app's icon offers "บ้านเราพร้อมแค่ไหน?" (`/?open=kit&source=pwa`) and "แผนบ้านรอดของบ้านเรา" (`/?open=plan&source=pwa`). Not tried on a real phone yet **[unverified]** ([ROADMAP L6](docs/ROADMAP.md#l6-real-phone-test-matrix)).
- `kit.json → ui.backPlan` (42 interface texts per language, was 41).

### Tests

- 27 rule tests (+1): "card text: a wrapped line never starts with closing punctuation (every ending, both languages)": "The house copes! Nearly everything is ready" at 155 px, then every `cheer…` ending in Thai and English at widths 60–300 in steps of 5.
- 96 smoke checks (+3): "a flood result offers the home check (the hazard lists it in config.json → hazards.flood.tools)", "/learn and llms.txt link the home check and the plan card", and "plan card: "← แก้แผน" goes back to the form, with what was typed". Two checks look further: a hazard page with `tools` must link them (`/flood`, `/ready` and their English twins), and the privacy check expects `plan_open` beside `kit_open`, `kit_share` and `plan_share`.
- **The smoke test's 44 px check waits for a sheet to finish sliding in** (`ae51b31`). CI failed once on a docs-only commit (`51defd8`) because the About sheet's 44 px source links measured just under 44 px mid-slide in Chrome 153. `smallControls()` now waits for `#sheet`'s animations to end, allows 0.01 px of rounding and prints two decimals ([LESSONS D13](docs/LESSONS_LEARNED.md#d-testing-and-verification)).

### Checked

- Build: 81 items (+30 decoys), 73 sources, 121 link-preview pages, 81 lessons on `/learn`, 44 files precached, start screen **209 KB** compressed and first game screen **223 KB** (limit 500 KB), no warnings.
- `npm test`: 27 passed. `npm run smoke`: 96 passed on the pinned day, 18 Oct 2026, and 96 passed as 5 Dec 2026 (`SMOKE_DATE=2026-12-05`).
- axe-core: nothing found on the start screen (except the wordmark's coral half, [KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)), the home check's questions and list, the plan form, a power-cut result, `/ready`, `/en/ready`, `/flood`, `/learn` and `/posts`.
- `npm run probe` was not re-run: no item, slot or water setting changed. Houses and challenge links are unchanged.
- **Source health, no code change.** On 19 Oct 2026 `prd.go.th` (`prd-72h`, the 3 L per person per day behind `p-waterfood`, `s-water`, `s-radio` and the home check's water and radio lines) answered `curl` with a 301 to `prd.go.th` and then a 404, and headless Chromium with a 500 block page, even for its home page. It blocks automated readers, so whether the page still exists is unknown; a search engine's index still shows it with the 3-litre line. The owner opens it in a normal browser in Thailand ([ROADMAP L10](docs/ROADMAP.md#l10-thai-review-of-the-dust-fire-and-power-cut-lessons), [KNOWN_ISSUES #55](docs/KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)).

## [1.8.0] — 2026-10-19

Two tools for the family at home, built on the power-cut and flood lessons (ROADMAP N15): **"บ้านเราพร้อมแค่ไหน?" / "How ready is our house?"**, a home-kit check that works out what this household needs and how ready it is, and **"แผนบ้านรอดของบ้านเรา" / "Our family safety plan"**, a plan card to keep on every phone. What people answer, tick and type stays on their device. No item, room, slot or `houseVersion` changed, so houses and challenge links are the same and no midnight release is needed.

### Added

- **The home check, `/?open=kit`** (`/en/?open=kit`), in a sheet over the start screen:
  - **Two questions:** how many people live here (1–10, 3 to start, a − / + stepper with 52 px buttons) and who (any of 👶 small children, 🧓 older or bedridden people, 💊 someone on daily medicine, 🐾 pets). "คำตอบอยู่ในเครื่องนี้เท่านั้น ไม่ส่งไปที่ไหน" sits under them.
  - **The household's list:** 9 things every home gets, and up to 6 more by answer (15 in all). Amounts follow the household: drinking water 3 L × people × 3 days ("27 ลิตร (3 ลิตร × 3 คน × 3 วัน)"), dry and canned food "enough for 3 days for 3 people", a flashlight each, daily medicine for at least 7 days. Each line names its agencies, and the 9 items that are ⚠️ `partial` say "ข้อนี้อยู่ระหว่างตรวจทาน".
  - **Ticks and a meter:** "พร้อมแล้ว 33% (มี 3 จาก 9 อย่าง)", and "แก้คำตอบ" to change the answers.
  - **Share:** a 1080 × 1350 card (`drawKitCard`) with a score ring, the gecko with a torch (cheering from 80 %), "มีแล้ว 3 จาก 9 อย่าง", up to 3 things still missing (everyday items before the household's own) or "ครบทุกอย่างแล้ว!", "บ้านคุณพร้อมแค่ไหน? เช็กฟรี" and the link `/?open=kit`. It uses the game's share sheet (native share, LINE, Facebook, copy, save).
- **The family plan card, `/?open=plan`** (`/en/?open=plan`): six short fields from `kit.json → plan`: the shelter or evacuation point near home, the family meeting place, who to contact if separated, who helps whom (twice), and medicine and must-haves. 40 characters each (60 for medicine), each with an example, most with a sourced hint ("ยาประจำตัวอย่างน้อย 7 วัน"), and the warning "อย่าใส่เลขบัตรประชาชนหรือข้อมูลส่วนตัวเกินจำเป็น". **สร้างการ์ดแผนบ้านรอด** draws a 1080 × 1350 card (`drawPlanCard`) with the filled fields only, the date, the free helplines 1784 · 199 · 1669 · 1555 · 1130 · 1129 (`helplines.json`, `main`), "เซฟไว้ในมือถือทุกคน และเก็บสำเนาไว้ในกระเป๋าฉุกเฉิน" and the link `/?open=plan`. Long entries shrink the rows together so all six fit.
- **Ways in:** a start-screen quick button, 🎒 "บ้านพร้อมไหม?" (`#kit-chip`), which reads "บ้านพร้อม 70%" once the household has checked; a button "🎒 เช็กว่าบ้านเราพร้อมแค่ไหน" on the result screen of the power cut (any mode whose threat is `dark`); two links on `/ready` and `/en/ready` (`config.json → hazards.outage.tools: ["kit", "plan"]`); the two deep links; and a button from the list to the plan card and back.
- **Files:** `public/content/kit.json` (the answers, the 15 items with their amounts and sources, the 6 plan fields, and 41 interface texts in each language), `public/js/kitplan.js` (pure and unit-tested: `kitPlan`, `kitScore`, `kitMissing`) and `public/js/kit.js` (the sheets, the two cards and sharing). `main.js` loads `kit.js` only when one of them opens (`import('./kit.js')`); if that fails offline, a toast says "เปิดไม่ได้ตอนนี้ ลองใหม่เมื่อต่อเน็ตนะ" (`offlineTool`).
- **A source, `readygov-plan`** (Ready.gov "Make A Plan", updated 1 Sep 2026, read on 19 Oct 2026, `international`), for the plan card's meeting place and contact. No Thai agency page on a family meeting place was found, so both fields are ⚠️. 73 sources (9 international).
- **Three anonymous events** in both allowlists (`public/js/analytics.js`, `functions/api/e.js`): `kit_open` (the label says where from), `kit_share` (the channel, with the score in % as the value) and `plan_share` (the channel). No answer, tick or typed text is ever sent.
- **Build checks for `kit.json`:** every item and every plan hint has sources that exist in `sources.json`; `verify` is `verified` or `partial`; `for` names a real answer; a plan field's `max` is 1–80; every number above 1 in an amount rule (`perPersonPerDay`, `perPerson`, `days`) appears in one of its sources' title or note; Thai and English for every label, hint, example and interface text. A hazard's `tools` may only be `kit` or `plan`, and each needs `seo.<lang>.tool<Kit|Plan>`.
- **Strings:** `kitChip`, `kitChipScore`, `kitFromResult` and `offlineTool` (233 keys per language, was 229), and `seo.<lang>.toolKit` and `toolPlan` for the hazard page.
- **Left out on purpose,** because no agency gives them: a fixed interval to re-check the kit ("every 3–6 months"), a 7-day stock target (Tokyo's alone; the check keeps 3 days, and 7 days only for daily medicine, from the MOPH), and the eating order fridge → freezer → canned.

### Changed

- **The quick buttons** under the start screen's modes are now two per row, with the icon beside the label (`min-height` 52 px, labels `clamp(12px, 3.9vw, 14px)`), so the four Thai labels stay on one line instead of breaking mid-word.
- **The About sheet's privacy text** (th/en) says the home check's answers and the plan card's text stay on the device and are never sent anywhere.
- `package.json → description` mentions power cuts, the home-kit checker and the family plan card.
- The service worker precaches 44 files (+ `kit.js`, `kitplan.js`, `kit.json`).
- **`readygov-kit`'s `note`** now quotes the page's "Additional Emergency Supplies" list (cash, prescription eyeglasses, infant formula, bottles and diapers, pet food and water), which the check's cash, glasses and baby lines rest on (read again on 19 Oct 2026).
- **`npm run docs`** counts the check's and the plan card's citations in docs/01's source list, so `readygov-plan` is no longer listed as "not cited yet".

### Fixed

- **The English checklist previews no longer say the advice is Thai.** `ogEn.checklistDesc` reads "A family checklist from government agency advice. Outside Thailand, follow your local authorities." The CDC, Ready.gov and the Tokyo Metropolitan Government are government agencies too. The Thai twin is unchanged. Page text only: the five `/en/checklist/…` pages were regenerated, no image changed ([KNOWN_ISSUES F41](docs/KNOWN_ISSUES.md#in-v180-19-oct-2026), was #56).

### Tests

- 26 rule tests (+1): "home check: amounts follow the household, special items follow the answers" (9, 27 and 90 litres of water for 1, 3 and 10 people, a flashlight each, food for 3 days; 0 and 99 people clamped to 1 and 10; each answer adds only its own items; daily medicine for 7 days; 0 % and 100 %; the card lists everyday items first).
- 93 smoke checks (+7), at 360 × 640 from `/?open=kit`: 4 people with daily medicine give 36 litres of water and list the medicine but not baby items; answers and ticks are kept in `brm:kit`; every control of the questions, the list and the plan form is 44 px or more; the check's card renders at 1080 px with LINE on the first screen; the plan card renders; the typed plan text (a meeting place and a phone number) appears in no `/api/e` body, while `kit_open`, `kit_share` and `plan_share` do; no page errors. New doc screenshots: `docs/screens/17-kit.png` (the list for 3 people at 33 %) and `docs/screens/18-plan-card.png` (a filled plan card).

### Checked

- Build: 81 items (+30 decoys), 73 sources, 121 link-preview pages, 81 lessons on `/learn`, `posts` 4 sets and 45 images, 44 files precached, start screen **208 KB** compressed and first game screen **223 KB** (limit 500 KB), no warnings. The build counts every file in `js/`, so the 8 KB include `kit.js` (about 5.5 KB compressed) and `kitplan.js` (0.8 KB), which the start screen loads only when the check opens ([KNOWN_ISSUES #59](docs/KNOWN_ISSUES.md#59-the-home-checks-code-is-counted-in-the-start-screen-budget-and-precached)).
- The plan card with all six fields at their maximum length (40 characters, 60 for medicine), in Thai and in English: every row and every character is drawn (a one-off probe in headless Chromium, 19 Oct 2026).
- `npm run probe` was not re-run: no item, slot or water setting changed. Houses and challenge links are unchanged.

## [1.7.0] — 2026-10-19

A fifth mode, **ไฟดับ (Power cut)**: stock up, keep the fridge shut, flashlights not candles. It was prompted by a Thai stockpiling infographic spreading on social media ("72 hours minimum, aim for 7 days", "eat old stock first", "when the power is out eat fridge → freezer → canned", "don't forget a manual can opener"). The infographic is not a source; the mode teaches only what agencies back up. Houses and challenge links in the other four modes are unchanged (a year of houses compared identical).

### Added

- **The power-cut mode** in the registry: `{ id: 'stock', hazard: 'outage', code: 's', threat: 'dark', prop: 'torch', emoji: '🔦', months: [], topic: 'food' }`. Thai "ไฟดับ" ("เตรียมของตุน รับมือไฟดับทั้งคืน"), English "Power cut" ("Stock up for a night without power"). It is **year-round**: never the season's default, reached by its start card, `/?mode=stock`, `/ready` and posts. Round: 55 s, 12 story hours.
- **A new threat, `dark`.** The room darkens over the round (`round.stock.dark` keyframes 0.1 → 0.38 → 0.56 → 0.66; a deep blue layer with a heavier edge, so items stay readable) and the HUD shows the story's hours, then the seconds: "ไฟดับมา 4 ชม. · 37 วิ" (`darkHours`). `Round.darkLevel` (0–1) and `Round.hoursOut` (progress × `round.stock.hours`).
  - An item with `lostAfter: <hours>` goes bad once the power has been out that long: status `flooded`, shown as "เสียก่อน" / "Went bad first", a grey clock badge, 🌑 in the share grid. Only `s-fridge` has it, `lostAfter: 4`, from the US CDC ("a closed fridge keeps food safe up to 4 hours"). With no penalties that is about 18 s into the round. The freezer never goes bad in the 12-hour round (CDC: about 48 hours full, 24 half full). So the game teaches "the fridge goes first" from sourced times, not from the infographic's eating order.
  - `house.js`: every power-cut house includes one item with `lostAfter`. The rule applies only when the mode's threat is `dark`, so other modes' houses are unchanged.
- **13 lessons** (`s-…`), 5 decoys (rice bin, battery clock, books, potted plant, dishes) and 16 new symbols in `art/sprites.svg` (12 objects and 4 "done" states such as the shut fridge and the lit flashlight; the generator reuses the flood sprite):
  - kitchen: `s-fridge` (keep the door shut), `s-leftover` (minced pork after a night without power: throw it out, never taste to check), `s-freezer` (a full freezer, about 48 h), `s-opener` (a manual can opener with the cans), `s-water` (at least 3 L per person per day for at least 3 days), `s-pantry` (everyday stockpiling: eat as usual, restock, replace what has expired)
  - living room: `s-medcold` (a plan for medicine that must stay cold, or medical devices on power), `s-candle` (flashlights, not candles; never leave one burning), `s-torch` (spare batteries, a flashlight for everyone), `s-radio` (a battery radio for official news), `s-powerbank` (charge before the power goes), `s-plugs` (unplug against a surge when the power returns)
  - front: `s-generator` (outdoors in the open, away from doors and windows)
  - 3 are ✅ verified (`s-torch`, `s-powerbank`, `s-generator`) and 10 are ⚠️ partial, each with a `verifyNote` that says why ([docs/01](docs/01-safety-content.md#flags-please-review-these)).
- **5 sources, all `international`,** each with a `note` quoting what was read on 18 Oct 2026: `cdc-food-outage` (US CDC, "Keep Food Safe After a Disaster or Emergency", 24 Nov 2025), `readygov-outage` (Ready.gov "Power Outages", updated 4 Jun 2026), `readygov-kit` (Ready.gov "Build A Kit", updated 1 Jul 2026), `tokyo-bichiku` (Tokyo Metropolitan Government, Tokyo Stockpiling Navi, "Why Stockpiling Matters") and `usfa-candle` (US Fire Administration, "Candle Fire Safety", reviewed 1 Apr 2023). Their English agency names are in `seo.en.agencies`. Thai sources already in the game carry the Thai parts: PRD's 72-hour checklist (3 L), DDPM's kits, the Department of Health's 3–5 days, the DDC's generator advice and the MOPH's 7 days of medicine.
- **Left out on purpose,** because no agency says it or sources disagree: the infographic's eating order (fridge → freezer → canned), "check every 3–6 months", and the 7-day target (Tokyo's alone; the game keeps "at least 3 days", which Thai agencies also give).
- **Checklist** `stock`: "ไฟดับ 3 วัน บ้านเราพร้อม 10 ข้อ" / "10 things for a 3-day power cut", at `/checklist/stock` and `/en/checklist/stock`.
- **A hazard page, `/ready`** (and `/en/ready`), from `config.json → hazards.outage.slug`: the 13 lessons, the checklist, the helplines and ▶ buttons to `/?mode=stock`. No "check before you go" link. Its preview is the power-cut checklist image.
- **Challenge links and previews** `/c/s0`–`/c/s10` and `/en/c/s…`, a card theme `stock` (blue-violet waves) and a blue-violet card colour (`#DCE1F5`) and gauge.
- **Strings:** every per-mode key with the `Stock` suffix (mode name and description, hero, challenge, how-to, gecko lines, result, share text, checklist tab, ranks "มือใหม่หัดตุนของ → ผู้จัดการคลังบ้าน → บ้านนี้พร้อมทุกไฟดับ", the lost-item status and toast, four endings), the `og`/`ogEn` challenge and checklist texts, `seo.<lang>.sectionStock` and `hazardOutage{Nav,Title,Desc,H1,Intro}`, and `darkHours`. 229 keys per language (was 210).
- **A carousel set for the power cut,** `share/carousel/ready/` (11 images): `s-water`, `s-pantry`, `s-opener`, `s-fridge`, `s-torch`, `s-powerbank`, `s-candle`, `s-generator`. Five of the eight are ⚠️, and their pages say "ข้อนี้อยู่ระหว่างตรวจทานกับหน่วยงาน". The build's `posts` line now lists lessons under review ("lessons under review: outage 5 ⚠️") instead of warning about each one.
- **Build checks for the new threat:** it stops when a `dark` mode has no `round.<mode>.hours`, when `lostAfter` is outside (0, hours) or used in a mode whose threat isn't `dark`, and warns when a `dark` mode has no item with `lostAfter`.

### Changed

- **The generic texts no longer say every tip comes from Thai agencies.** The About text (th/en), the default link preview's title and description (`og`/`ogEn`), the `/learn` titles and heading, `seo.en.llmsSummary`, `seo.en.intlNote`, `index.html`'s meta description and `llms.txt`'s notes now say every tip has a source, most from Thai agencies, some international and marked. The default preview image `og/default.png` (and its English twin) reads "น้ำท่วม · ฝุ่น · ไฟไหม้ · ไฟดับ" and was re-rendered.
- The index JSON-LD's `about` lists all four hazards in Thai and English; since v1.5.0 it had listed floods only.
- **The start screen** has five modes: the recommended one as the big card, the other four in one row (`--cols` up to 4; the static grid in `index.html` is `--cols: 4`). Small-card names are `clamp(12px, 3.9vw, 16px)` with 2 px side padding, so every Thai name fits on one line at 320 px; English names wrap to two lines.
- The sitemap lists 12 addresses (adds `/ready`, `/en/ready`); `llms.txt`, `/learn` and the "By hazard" row link the new page.
- `strings.json → seo.updated` is `2026-10-19`.

### Fixed

- **The left room arrow covered the item on the fridge.** The ‹ arrow (44 × 64 px, at 44 % of the stage's height) covered up to **23 %** of the tap area of `p-numbers` (Prepare) and `f-call` (fire), and 27 % of the new fridge, all on the slot `kt-fridge-note`, measured at 390 × 760 (18–20 % at 360 × 640, 6–8 % at 768 × 1024, none at 320 × 460). A tap there turned the room instead. The slot moved from y 344 to y 404, below the arrows. It keeps its id, so every house and challenge link is unchanged; the worst coverage left is 2 % (window items at the right edge). Side effects, measured with `npm run probe`: in Prepare `p-numbers` now goes under at 43.6 s instead of 55.6 s, and in fire the smoke no longer reaches `f-call` (it did at 53.7 s). The smoke test had always clicked items with `force: true`, which is why it never noticed ([KNOWN_ISSUES F38](docs/KNOWN_ISSUES.md#in-v170-19-oct-2026)).
- **The build stops after content errors** before it generates any page. It used to crash with a `TypeError` on a missing `og` string instead of listing what was missing (F40).

### Tests

- 25 rule tests (+2): the existing per-mode test now also generates a year of power-cut houses, each with an item that goes bad; a new test "power cut: fridge food goes bad at 4 story hours, the freezer never does in 12".
- 86 smoke checks (+5): a power-cut round in the loop over the non-flood modes; `/ready` and `/en/ready`; "stock: at 4 hours without power the fridge food is lost, the room is darker and the clock says so"; "the room arrows cover at most 5% of any item's tap area (every mode, 3 houses, 390x760 and 360x640)". New doc screenshot `docs/screens/16-stock.png` (the kitchen at 6 hours without power).

### Checked

- `npm run probe`: 0 % tap overlaps over 3,650 houses (5 modes × 730 days).
- The houses of the four older modes are identical to v1.6.1 over a year.
- Build: start screen **200 KB** compressed, first game screen **215 KB** (limit 500 KB), 41 files precached, 121 link-preview pages, 81 lessons on `/learn`, sitemap 12 addresses, `posts` 4 sets and 45 images (`ready` 11), no warnings.

## [1.6.1] — 2026-10-18

Posts that teach on their own: a ready-made set of images for each hazard, for Facebook albums, Instagram carousels and LINE. Nothing in the game changes; houses and challenge links stay the same.

### Added

- **Carousel posts.** Three sets of 1080 × 1350 JPEG images in `public/share/carousel/<slug>/NN.jpg` (34 images, 4.5 MB): `flood` (12), `pm25` (11) and `fire` (11). Each set is a cover, one page per lesson, the hazard's checklists and a last page with the game's address and the helplines. A lesson page shows the hazard's sprite, the correct action, why, and the agencies it comes from, and says when a lesson is still being reviewed.
  - `carousel.json → sets.<hazard>` picks at most 8 lessons per hazard; every lesson picked today is ✅ verified. The build stops on a lesson that doesn't exist, belongs to another hazard or isn't playable, and warns about one that isn't verified.
  - The lesson text always comes from `items.json`. The new `public/content/carousel.json` holds the lesson picks and the frame text (cover titles, labels, post captions) in Thai and English. The game never loads it, and it is left out of the service worker's precache.
  - `drawCarouselPage()` in `tools/carousel-draw.mjs` draws the pages with the card helpers that `cards.js` now exports as `kit`, so the posts look like the game while the drawing code stays out of the game's download (the start screen is still 188 KB). Thai lines are balanced (`balanced()`), so a title never ends on a lone word.
- **`/posts`**, a plain page for whoever posts for the game: each set's images in order (touch and hold to save) and a ready-to-paste Thai caption with the page link, the play link and hashtags, plus a copy button. It is not for search: `noindex, nofollow` in the page and an `X-Robots-Tag: noindex` header, and it isn't in the sitemap.
- **Images that can't go stale.** `npm run images` writes `share/carousel/manifest.json` with a fingerprint of everything the images show. The build compares it with the current content and warns when a lesson's text, a caption or the site address changed after the last render.
- `npm run images -- --only <path>` renders only the images under a path (for example `share/carousel`), so the other images aren't re-encoded into unrelated diffs.

### Tests

- 81 smoke checks (+2): `/posts` lists every carousel image, each image exists, one caption per set, `noindex` and not in the sitemap; its controls are 44 px or more at 320 × 460. The new doc screenshot is `docs/screens/15-hazard-page.png`.

## [1.6.0] — 2026-10-18

The start screen keeps itself current, a post can link straight to a mode, and each hazard has its own page for search. Houses, items, rooms, slots and scores are unchanged, so today's houses and old challenge links stay the same and no midnight release is needed.

### Added

- **Switches that end by themselves.** `config.json` gained `rainWarningUntil` (now `2026-11-30`) and `featuredTopicUntil` (now `2026-11-15`). They are Bangkok dates and include that day; after it, the switch is off by itself. The rain warning and the health topic were switched on by hand in mid-October with no end, so in December's dust season the start screen would still have said "ฝนจะมาอีกระลอก" and featured diseases after floods.
  - The build stops on an end date that isn't a real `YYYY-MM-DD` date. It warns when a switch is on with no end date, or when its end date has passed.
  - A new build line shows what the start screen recommends today: `start     2026-10-18: prepare (warning until 2026-11-30) · featured health until 2026-11-15`.
  - The Thai `_readme` in `config.json` explains the end dates.
- **`?mode=` links.** `/?mode=dust` (or `prepare`, `return`, `fire`) opens the start screen with that mode as the big recommended card and its topic featured, for posts and campaigns.
  - Only mode ids from the registry count, in any letter case; anything else is ignored (`/?mode=heat` does nothing).
  - A friend's challenge link wins over it, and it never starts a round by itself.
  - Visitors from abroad go to `/en/?mode=dust`; the redirect keeps the link.
- **A page per hazard:** `/flood`, `/pm25` and `/fire`, plus `/en/flood`, `/en/pm25` and `/en/fire`, generated from the content like `/learn`.
  - Each page: the top links, the heading, a ▶ play button to `/?mode=<id>` on the first screen (two on `/flood`, one per flood mode), the intro (the English pages add that the advice and helplines are Thai), the "check before you go" link (FloodWatch for floods, Air4Thai for dust, none for fire), only that hazard's lessons (43, 12 and 13), its checklists, the helplines, the play buttons again, a "อ่านตามภัย / By hazard" row of links, and the disclaimer.
  - For search: its own canonical link, `hreflang` pairs (th, en, x-default), `og:url`, and `Article` JSON-LD that cites its lessons' sources. The preview reuses the checklist image (`/og/checklist-<mode>.png`, or `/og/en/…`), so there are no new images.
  - `/learn` and `/en/learn` gained the same "By hazard" row (44 px links). `sitemap.xml` grew from 4 to 10 addresses, and `llms.txt` lists the pages.
  - The address of each page comes from `config.json → hazards` (`flood → flood`, `dust → pm25`, `fire → fire`). The build stops on a slug that isn't lowercase letters, digits or "-", is used twice, or clashes with a site path, and on a hazard without a slug or a missing `seo` string. Slugs never change once published.
  - New `seo` strings in both languages: `byHazard`, `allLessons`, `playMode` and `hazard<Flood|Dust|Fire><Nav|Title|Desc|H1|Intro>`. The page text is a draft for the language check ([ROADMAP L5](docs/ROADMAP.md#l5-second-native-reader-for-the-thai-copy)); it adds no advice or numbers, and the descriptions name no agencies, so they can't drift from the lessons.
- **The ending on the shared card.** In v1.5.3 the line that answers "บ้านรอดไหม?" was on the result screen only. The card now carries the same line in a speech bubble left of the gecko, so a forwarded picture answers the question too.
  - The text is 38 px and shrinks to 28 px to fit at most 4 lines, preferring a size that leaves no lone short word on the last line.
  - Emoji are left out on the card, because canvas fonts can draw them as empty boxes.
  - The card's `alt` text ends with the same line.
  - The sample cards `public/share/sample-result-prepare.png` and `-return.png` were re-rendered; no other image changed.
- **The safety table's counts can't drift.** `npm run docs` also writes a summary at the top of [docs/01](docs/01-safety-content.md) (68 items in 4 modes and 8 topics, 66 playable, 57 ✅ and 11 ⚠️, 67 sources), and a normal build warns when that file is out of date with the content.

### Changed

- **Two endings pointed at the screen.** "…ด้านล่าง" / "below" was fine on the result screen but wrong on a forwarded card:
  - `cheerLowReturn`: "บ้านยังไม่พร้อม ตรวจให้ครบอีกรอบ ก่อนกลับเข้าบ้านนะ" / "Not ready yet. Check it all again before moving back in"
  - `cheerMidFire`: "ยังมีจุดเสี่ยงไฟอยู่ ลองหาให้ครบอีกรอบนะ" / "Some fire risks remain. Find them all next round"
- **The smoke test plays on a fixed Bangkok day:** `SMOKE_DATE`, `2026-10-18` by default. An init script shifts only `Date`, and time keeps running. Playwright's clock API isn't used, because it also fakes the timers and `requestAnimationFrame` that the rounds run on. What the start screen should show comes from the game's own `recommend()`, so the test never reads the real calendar.
- **Code:** `modes.js` gained the pure functions `switchOn()`, `modeLink()` and `recommend()` (which returns `{ mode, topic, why }`). In `main.js`, `pickDefaultMode` became `pickStart()`, kept in `state.start`. The forecast app's live answer (`forecastStatusUrl`) still beats the manual switch, both ways.
- **One template for the plain pages.** The `/learn` template became `seoPage()` in `tools/build.mjs`. Its output was checked byte for byte against the old one (`git diff --quiet`) before anything was added.
- **Analytics, with no new event names:** `view` gets the label `link`, with the mode, and `mode_select` is labelled `link`, `default` or `other`.
- **CI** checks that every generated `public/*.html` page (the hazard pages too), `sw.js` and `js/version.js` are committed and current, and fails when a generated file under `public/` is not committed.
- `robots.txt` and the `package.json` description say "home-safety game" (floods, PM2.5 dust and house fire). `strings.json → seo.updated` is `2026-10-18`.

### Fixed

- The helpline `tel:` links on `/learn` were 28–38 px wide; they now have `min-width: 44px`, and the top links are 44 px tall.
- The play button on `/learn` was white on orange (3.0:1, below WCAG AA). The plain pages now use the game's yellow button with dark text, and the current-hazard chip has dark text; axe-core finds nothing on `/learn` and the hazard pages.
- Stale counts in the docs (the safety table's item count, the test matrix size, the playable lessons and topics, the precache list, the string keys, issue #2 still listed as open). [KNOWN_ISSUES F32–F37](docs/KNOWN_ISSUES.md#in-v160-18-oct-2026) lists everything fixed in this release.

### Checked

- Frame times with the CPU slowed 6× (360 × 640, 2× pixels): 40–46 fps in all four modes; the haze and smoke cost no more than the flood modes. Unthrottled, 60 fps. KNOWN_ISSUES #48 updated with the table.
- The smoke test also passes as another season: `SMOKE_DATE=2026-12-05` (dust, Air4Thai, the air topic) and `SMOKE_DATE=2027-04-10` (fire, no check link, the fire topic), 79/79 each.
- Build: start screen 188 KB compressed, first game screen 201 KB (limit 500 KB), 41 files precached, 97 link-preview pages.

### Tests

- 23 rule tests (+2: a switch ends on its end date and not before; what the start screen recommends on five days of the year, with the forecast app's answer and with `?mode=` links, and each mode's "check before you go" link). The endings test also forbids "ด้านล่าง" and "below".
- 79 smoke checks (+18): dust recommended on 5 Dec 2026 with the air topic and Air4Thai; `/?mode=fire` (the fire card and topic, no round, a `view · fire · link` event); `/?mode=heat` ignored; a challenge beats `?mode=`; `/en/?mode=dust`, and a visitor from London keeps the link; each of the six hazard pages (heading, canonical, `hreflang`, play links, lesson count, JSON-LD, preview image); `/learn`, the sitemap and `llms.txt` link every hazard page; every control on the hazard pages and `/learn` is 44 px or more at 320 × 460, with the play button on the first screen; `/pm25` → play → the dust card with no round started; the ending on the result screen and in the card's `alt` text.

## [1.5.3] — 2026-10-15

Second check-and-improve loop. Houses, items and scores are unchanged.

### Added

- **The ending answers the title.** The game asks "บ้านรอดไหม?" (Will the house survive?) but its last word was a generic cheer. The gecko on the result screen now says how the house came through, per mode and score: "บ้านรอดจากฝุ่น! อากาศในบ้านสะอาด ทุกคนหายใจสบาย 💙" (dust, 10/10), "บ้านรอด! ปลอดภัย พร้อมกลับเข้าอยู่แล้ว 🏠" (after the flood), and for low scores a kind line that sends people back ("…แต่ตอนนี้รู้แล้วว่าต้องทำอะไร ลองใหม่นะ"). 16 endings in Thai and English (`cheer<Level><Mode>`), falling back to the shared lines for a new mode.

### Checked (no change needed)

- axe-core on the start, how-to, round, choice, tip, result and share views in dust and fire, Thai and English: one finding, the coral half of the wordmark (2.35:1), which is a logotype and exempt ([KNOWN_ISSUES #51](docs/KNOWN_ISSUES.md#51-the-wordmarks-coral-half-is-low-contrast)).
- The language switch rebuilds every mode button, its description and the tagline.
- The gecko's speech bubble covers no item at the start of a round (48 houses, all four modes).
- No visible text is cut off (only screen-reader-only text measures as clipped, by design).

### Tests

- 21 rule tests (+1: every mode has its four endings in both languages, at most 60 characters).

## [1.5.2] — 2026-10-15

The path a Thai visitor takes (open → play → finish → share), measured on six screens (320 × 460, 360 × 640 Android in LINE, 390 × 664 iPhone in LINE, 412 × 800, 768 × 1024, 1024 × 768) and fixed where the next step was off screen. Houses, items and scores are unchanged.

### Changed

- **The share button is always on the first screen of the result.** It was below the fold on every phone and on landscape tablets (for example 738 px down on a 664 px LINE screen). The card preview is capped at 58 % of the screen and the main action (share, or "challenge back" after a friend's challenge) sticks to the bottom until its place scrolls into view. Now 598–654 px on that screen.
- **The share sheet shows LINE, Facebook, X and copy first,** then the card (capped at 40 % of the screen) and the long-press hint. Before, a second full-size card pushed every channel off the first screen on 320 px phones, in LINE on iPhone and on landscape tablets.
- **"Start" and "next" stay in reach on short phones.** In the how-to sheet and after each answer the button sticks to the bottom of the sheet; at 320 × 460 both were off screen (538 and 445–501 px).
- **A friend's challenge comes first.** On a challenge link the gecko and its seasonal line step aside (a dust challenge used to sit under "ฝนจะมาอีกระลอก"), and on short screens the tagline too, so "รับคำท้า!" is on the first screen: 303–359 px at 320 × 460 (it was 509–565).
- **The recommended card shows a ▶ play mark,** so it reads as a button to play, not a label.

### Tests

- 61 smoke checks (+3: the result's share button, LINE in the share sheet and the challenge's accept button are on the first screen at 360 × 640 or 320 × 460).

## [1.5.1] — 2026-10-15

### Fixed

- **Tapping ฝุ่น PM2.5 could open the flood house.** The owner saw it on a browser that had played an earlier version. The service worker served the page and content from the network but the code from its cache, so the new page ran the old code, and the old code turned an unknown mode into Prepare. Only the first visit after a deploy was affected. Three fixes:
  - The service worker now fetches `/js/`, `/css/`, `/content/`, `/art/` and the manifest network-first (3 s, then the cache for offline play). Fonts and images stay cached.
  - When the new service worker replaces one from before v1.5.1, it reloads the open pages once from the network.
  - The build writes `js/version.js`; if it disagrees with `config.json → version`, the page clears its caches and reloads once (never in a loop).
- Tested over an installed v1.4.0 (one automatic reload, then dust mode opens the dust house) and over v1.5.1 with a fake next release (the new code on the first visit, no reload). KNOWN_ISSUES F27.

### Tests

- 58 smoke checks (+1: content and code from different releases reload once, then the start screen works); offline play still passes.

## [1.5.0] — 2026-10-15

A home-safety game for the whole year, not only the flood season. **Two new modes, PM2.5 dust and house fire, with their own houses and challenge links (`/c/d…`, `/c/f…`).** Flood houses and old flood challenge links are unchanged (244 houses compared byte for byte), so this needs no midnight release.

### Added

- **PM2.5 dust mode (`dust`, ฝุ่น PM2.5, code `d`).** 12 lessons in the front yard, living room and kitchen, topic 😷 ฝุ่นและควัน (`air`), 5 decoys, 14 new sprites.
  - Shut and seal the window, wipe with a damp cloth instead of sweeping, check the purifier filter (every 6 months), keep medicine ready, see a doctor for a bad cough or tight chest, wet-wipe fans and air-cons, check Air4Thai before going out, skip the charcoal grill, wear a snug N95, exercise indoors, keep children (an at-risk group) in on red days, don't burn leaves.
  - A haze with drifting specks thickens over 55 seconds and the gauge moves through the Air4Thai colours (blue, green, yellow, orange, red). Nothing is lost to the haze; the clock is the pressure.
  - Sources: the Department of Health via THE STANDARD (1 Apr 2026), Thai PBS (10 Dec 2021) and PPTV (14 Dec 2022), cross-checked with WHO Europe (16 Jun 2023). The colour ranges in the 2022 article use the scale before the 2023 change, so the game teaches the colour order, not the numbers.
  - Checklist "ห้องปลอดฝุ่น 10 ข้อ" (`/checklist/dust`), and a "😷 เช็กค่าฝุ่นวันนี้ (Air4Thai)" link where flood modes show the forecast app.
- **House fire mode (`fire`, ไฟไหม้, code `f`).** 13 lessons, topic 🔥 ไฟไหม้ (`fire`), 5 decoys, 12 new sprites.
  - Chained power strips, a hot cracked cord, a phone charging on the sofa, a chirping smoke alarm, a towel (wet cloth over nose and mouth, crawl low), a pan left on the stove, the gas valve, sprays by the stove, an extinguisher buried in a cupboard, which number to call (199), smoke under a door (touch it first), burning leaves on a windy day, a cigarette end.
  - Smoke falls from the ceiling, so high things are lost first (`round.fire.smoke`, `lowY`); the gecko says "near the floor the air is cleaner".
  - Sources: DDPM via Krungthep Turakij (2020 and 2026) and MGR Online (17 Dec 2025), MEA via Thansettakij (17 Sep 2026). The US Fire Administration cross-checks cooking, and is the only source for the smoke-alarm lesson, which is flagged ⚠️ `partial`.
  - Checklist "บ้านปลอดภัยจากไฟ 10 ข้อ" (`/checklist/fire`). Helpline **199** (fire) added, so the checklist cards now list it.
- **Mode registry** (`config.json → modes`, `js/modes.js`): id, hazard, challenge letter, threat (water, smoke, haze or none), gecko prop, emoji, months, topic and link per mode. Strings follow `<base><Mode>`; `tm()` falls back to the shared key. The build checks every mode has its round settings, strings, link-preview text, `/learn` section, checklist and start button.
- **Season default.** Without a rain warning, the start screen recommends the mode in season (Bangkok month): dust in December–March, fire in April, otherwise "after the flood". The featured card falls back to that mode's topic when `featuredTopic` is `null`.
- New source kind `international` (WHO, US Fire Administration): used to cross-check Thai advice, never alone without a ⚠️.
- The gecko wears a mask in dust mode and a red helmet in fire mode, on the start screen, in rounds and on the cards.

### Changed

- **Start screen:** the season's mode is the big card; the others sit in a row of compact cards (icon over name, at least 78 × 89 px at 320 px wide).
- **Wording:** tagline, page titles, link previews, `/learn`, `llms.txt` and the app manifest now say floods, dust and fire. English hashtag `#HomeSafety`.
- **Help sheet** lists one "check before you go" link per kind (flood forecast app, Air4Thai).
- `npm run probe` prints smoke timings for fire (alarm 21.8 s, pan 50.1 s, note 53.7 s).

### Fixed

- Source links in lessons were 31–43 px wide for short agency names (ปภ., อย.); they now have a 44 px wide tap area, in the game and on `/learn`.
- A fan sprite overlapped a kitchen floor slot by 1% in 35 of 2,920 houses; now 0%.

### Tests

- 20 rule tests (every mode: a year of houses, codes round-trip, season pick), 57 smoke checks (+2: a full dust round and a full fire round, each with its haze or smoke layer and no page errors), 0% tap overlaps over 2,920 houses.
- Visitor pass: four modes × Thai/English × 320 × 460, 390 × 760, 768 × 1024, 1024 × 1366 and 1366 × 1024: no overflow, no page errors, no target under 44 px; `/c/d7`, `/c/f7`, `/checklist/dust`, `/checklist/fire`, `/learn#t-air`, `/learn#t-fire`; season default for 15 Dec, 1 Feb, 10 Apr and 15 Oct.

## [1.4.0] — 2026-10-15

Knowledge, organised. **Adds 3 Return-mode lessons, so today's Return houses and old Return challenge links change** (Prepare houses are unchanged). Shipped at night, Bangkok time.

### Added

- **EM balls in stagnant floodwater (`r-stagnant`, front yard).** The owner asked whether EM balls help; the evidence says no. A statement by 48 environmental scientists (Chula-led, 9 Nov 2011) does not recommend EM for stagnant floodwater: its microbes add no oxygen and part of it is organic matter. Do this instead, in order: drain, remove rubbish, add air. A 2026 peer-reviewed Bangkok study found EM balls alone didn't help consistently. Flagged ⚠️ because the sources are academic, not an agency.
- **Two lessons from the DDC's warning of 27 Sep 2026 on six disease groups after floods:** diarrhoea, sip ORS and eat freshly cooked food (`r-ors`, kitchen); eye infections, wash hands, don't rub, don't share towels (`r-towel`, living room). The same source now backs `r-mudfeet`, `r-bucket` and `r-fever`.
- **Six topics** for every lesson (`topic` in `items.json`, list in `config.topics`): 🦠 health after floods, ⚡ power & gas, 💧 water & food, 🐍 snakes & sharp things, 🏠 home, car & belongings, 🎒 plans & go-bag.
  - The safety book is grouped by topic, with a progress bar per topic and a 🏅 badge for a full set; finishing a set after a round shows a toast.
  - The tip card names the topic; result lessons show its emoji.
  - `/learn` and `/en/learn` start with an index by topic (`#t-health` …) made of 44 px chips, and every lesson names its topic.
  - The safety book links to `/learn` so no answer is ever locked away.
- **A topic in the news on the start screen** (`config.featuredTopic`, now `"health"`): "📰 เรื่องที่ควรรู้ช่วงนี้ · 🦠 โรคหลังน้ำท่วม", with "📄 read all 8" (→ `/learn#t-health`) and "📖 book n/8" (opens the book on that topic; "play" picks the mode with the most left to find). Set it to `null` when the news fades.
- New event `learn_open` (label: the topic, or `book`) in both allowlists.
- New source kind `academic`, labelled in the docs table as "academic statement or peer-reviewed study (not an agency)".

### Tests

- 17 rule tests (topics: every lesson has one; a full set is reported once), 55 smoke checks (+4: book grouped by topic, the featured card and its `/learn` anchor, the featured topic opens first).

### Also in 1.4.0


- The smoke test's start-screen size check now measures what visitors download (text gzipped like Cloudflare does): 167 KB of 500 KB. It used to count raw bytes (481 KB) and was about to fail on harmless text additions. KNOWN_ISSUES #40 → F24.

## [1.3.1] — 2026-10-14

### Fixed

- **No more flash of Thai for visitors from abroad.** On `/`, `/c/…` and `/checklist/…`, an inline script sends visitors from outside Thailand to the English page (`/en/…`) before anything is drawn. Thai browsers, Bangkok time, a stored choice, `?lang=` and search or preview bots (new `isBot()` in `content.js`) stay on Thai. KNOWN_ISSUES #38 → F23. Tests: 16 rule tests, 51 smoke checks (+6, five of them for who is *not* redirected).

## [1.3.0] — 2026-10-14

More fun to play, more worth sharing. **Scores, items and slots are unchanged**, so today's houses and old challenge links stay the same.

### Added

- **The card carries the challenge link.** The result card prints `baanrodmai.autobahn.bot/c/p8?h=…` (or `/en/c/…`) instead of the bare site address, so a forwarded *picture* leads to the same house. The text shrinks to fit.
- **Challenge back.** After playing a friend's challenge, the first button is "🏆 ส่งกลับไปท้าเพื่อน" / "Challenge them back". Its text names both scores ("เพื่อนได้ 3/10 เราได้ 8/10 …"), the card shows "เพื่อน 3/10 · เรา 8/10 · บ้านหลังเดียวกัน", and the share now attaches the card image. Its events use the label `challenge-back`, so the loop depth can be counted.
- **Score to beat on the clock.** During a challenge round the gauge reads "50 วิ · 🏆 เป้า 8/10" (the `challengeTarget` string was written but never used).
- **Share text names the house and the streak:** "เตรียมบ้านทัน 8/10 🏠 (บ้านวันที่ 14 ต.ค. 69)", plus " · เล่นต่อเนื่อง 3 วัน 🔥" from two days on. `challengeText` gained the hashtag.
- **Safety book (สมุดบ้านรอด).** Every lesson answered correctly is kept on the device (item ids only, `brm:learned`). A chip on the start screen ("📖 รู้แล้ว 6/38 เรื่อง") opens a sheet with learned lessons and their tips, and locked tiles for the rest. The result screen says "ใหม่! +2 เรื่อง". Only rooms that are drawn count (38 lessons today).
- **End-of-round moments by score:** 10/10 gets a bigger fanfare, a second confetti burst and a "เต็มสิบไม่หัก!" / "Perfect 10!" stamp on the screen card and shared card; 8–9 keep today's fanfare and confetti; lower scores get a soft chime. A small gecko on the result screen says a line that fits the score (warm and encouraging at every level).
- **Combo, for feel only.** Three or more right answers in a row show "🔥 3 ข้อติด!" and a rising run of notes. It never changes the score.
- **Sounds for silent moments:** a splash when water reaches the floor, a soft tick for each of the last five seconds, and a blip when sound is switched back on.
- **Streak milestones:** a toast on day 3, day 7 and every 7th day after.
- **Checklist sheet:** a Facebook button; the share text carries the checklist link once (LINE and copy used to add it twice).

### Changed

- **Replay first.** On the result screen, "play the other mode" and "🎲 random house" moved up under the share buttons, above the lessons.
- **Native share titles follow the language** ("Baan Rod Mai?" in English); they were hard-coded Thai.
- A second tap on a decoy now gets one of the gecko's decoy lines (`geckoDecoy`, unused until now) with the note.
- Sample result cards in `public/share/` re-rendered: one shows a challenge win with the perfect stamp.
- Tests: 15 rule tests (safety book, share-text placeholders), 45 smoke checks (+10).

### Also in 1.3.0 (live since 13 Oct 2026, still labelled v1.2.2 then)

#### Fixed

- **Tap areas on 320 px phones.** Under 520 px of height the room tabs are hidden (the ‹ › arrows stay) and the HUD padding shrinks, so item tap areas at 320×460 grow from 38.1 px to 44.1 px (N4, issue #2). Two new smoke checks (35).

#### Changed

- **Game events carry the language** (`th` or `en`, stored as `blob4` by `/api/e`), so plays can be split by language (issue #39).

#### Documentation

- Documentation sweep for v1.2.2: README, HANDOFF, KNOWLEDGE (new §19, the FloodWatch link), KNOWN_ISSUES (fixed rows moved to *Fixed* as F18–F20; new #38 flash of Thai on `/` and #39 no language in game events), GUIDELINES (English copy rules and rules 30–34), APPROACH_AND_METHOD (new §§16–17), ROADMAP (new L9 and P4), and docs 02–06 (English previews, 50 images, 35-row phone matrix, 147/156 KB, 38 precached files). No code changes; the app stays at 1.2.2.

## [1.2.2] — 2026-10-11

### Fixed

- **English mode still showed the Thai logo.** The big title, the result card, the checklist image and the English preview images now show **"Baan Rod Mai?"** in English (`strings.json → logoA/logoB`); Thai stays "บ้านรอดไหม?". The canvas shrinks the English wordmark to fit, and the static `/en/` page carries it too. New smoke check (33). Reported by the owner from a screenshot.

## [1.2.1] — 2026-10-11

### Changed

- **Published 11 Oct 2026** (CI green on `f31c600`; live site shows `v1.2.1`). FloodWatch is the owner's own Autobahn Bot project.
- **Forecast button is live:** `config.json → forecastAppUrl` is `https://flood.autobahn.bot/` (BKK FloodWatch, canal and river water levels across Thailand), so "เช็กระดับน้ำล่วงหน้า" / "Water levels" shows on the start screen, the result screen and the help sheet. A smoke check (32) covers it; the build no longer warns about the placeholder.

## [1.2.0] — 2026-10-11

An international (English) version, and better search and social previews in both languages.

### Added

- **English addresses:** `/en/` (the game), `/en/learn` (every lesson in English, agency names in English), `/en/c/…` challenge links and `/en/checklist/…`. The English pages are English in their static HTML (title, description, start-screen text, a hidden English `<h1>`), so crawlers and link previews see English.
- **Language choice:** `?lang=`, then the `/en` path, then the stored choice, then a first-visit guess: Thai for Thai browsers **or** Bangkok time, English otherwise. The address bar follows the language, and English players share `/en/c/…` links.
- **Search:** `hreflang` (th, en, x-default → en) on every indexable page and in `sitemap.xml` (`xhtml:link` alternates); English JSON-LD; `llms.txt` lists the English pages.
- **Social:** 25 English preview images (`public/og/en/`, from `strings.json → ogEn`), `og:locale:alternate`, `twitter:image:alt`; English share texts add `#FloodSafety`.
- **Honest scope for visitors outside Thailand:** the English help sheet, `/en/learn` and `llms.txt` say the advice and hotlines are Thai and point people to their local emergency number.
- **Checks:** the build fails if any `og` key lacks an English `ogEn` version or an agency lacks an English name; 1 new unit test (13) and 5 new smoke checks (31), including an English visitor from London.

### Changed

- **Version 1.2.0.** The smoke test now runs players as a Thai phone in Bangkok by default; CI also checks that `public/en/` is regenerated and committed.

## [1.1.0] — 2026-10-10

CI, a text clean-up and a clearer version label on top of 1.0.0. Live at https://baanrodmai.autobahn.bot (push-to-deploy checked).

### Added

- **Version on the homepage:** the start screen shows `v1.1.0` as a visible chip (13 px, bordered) under the footer links, and the About sheet shows it too. A smoke check compares it with `package.json` (26 checks).
- **One version number.** `package.json` is the source. The build stamps it into the start screen's HTML (so it shows before any script runs) and **fails** if `config.json → version` differs.

- **CI** (`.github/workflows/ci.yml`): build, rule tests, docs link check and the browser smoke test on every push to `main` and every pull request.
- **Smoke check:** the About sheet follows the EN toggle (25 checks).

### Changed

- **Version bumped** from 1.0.0 to 1.1.0 in `package.json`, `package-lock.json` and `config.json`.
- **About sheet, checklist captions and the language button** read their text from `strings.json`; the unused `install` analytics event was removed.

## [1.0.0] — 2026-10-07

The official 1.0 release of **บ้านรอดไหม? (Baan Rod Mai?)** — a 60-second flood-safety hazard hunt game for Thai families, live at [https://baanrodmai.autobahn.bot](https://baanrodmai.autobahn.bot).

### Added

- **Version indicator in UI:** added app version display (`v1.0`) on the start screen footer and in the "About" information sheet (`public/index.html`, `public/js/main.js`, `public/css/app.css`, `public/content/config.json`).
- **Home: `https://baanrodmai.autobahn.bot`.** `config.json → siteUrl` is set, and Cloudflare Pages project `baanrodmai` is live.
- **SEO and AI search,** all generated by `tools/build.mjs` from content JSON:
  - **`/learn`:** a script-free page with all 40 lessons, source citations, checklists, and helplines.
  - **`/llms.txt`**, **`/sitemap.xml`**, **`/robots.txt`**, canonical links, and JSON-LD structured data.
- **Live-site UI/UX review, persona validation, and 3-loop iterative optimization** in `review/`:
  - Executed 3 full refinement loops ([review/ITERATION_LOG.md](review/ITERATION_LOG.md)), raising overall score from 8.8/10 to **9.74/10 (Optimal)** across all heuristics and personas.
  - **Loop 1 (Collisions & Affordance):** Resolved hitbox overlaps over 1,460 houses from 3.8% down to **0% (0 overlaps)** via `slot.excludes` graph. Added 3.5s idle affordance breathing ring (`.show-hints`) and desktop hover states. Surfaced educational 💡 `why` rationale directly in the verdict sheet.
  - **Loop 2 (Senior Accessibility & LINE UX):** Resolved timer anxiety for older players with reassuring modal copy and prominent `⏸️ พักเวลาอยู่ ค่อยๆ คิดได้เลย` badge in choice sheets. Added LINE In-App Browser save guides (`.line-guide`). Enhanced Return mode hazard drop-shadows.
  - **Loop 3 (Cultural Polish & Optimal Verification):** Infused warm Thai care copy (*"ส่งต่อด้วยความห่วงใย เพื่อบ้านปลอดภัยจากน้ำท่วม 💙"*) into result forwarding templates.
- **Guidance for AI assistants:** [AGENTS.md](AGENTS.md), [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md), [docs/ROADMAP.md](docs/ROADMAP.md).
- **Two modes in one illustrated house:** ก่อนน้ำมา (60 s, rising water) and หลังน้ำลด (50 s, daylight bar), across three rooms (หน้าบ้าน, ห้องนั่งเล่น, ครัว).
- **Safety content:** 40 items: 19 Prepare and 21 Return, of which 38 are playable now, from 54 dated Thai agency sources.
- **Replay & Sharing:** daily house, streak, challenge links, offline PWA caching, and high-res share cards.
  - 15 decoys, from 54 dated sources.
  - 31 items fully verified and 9 flagged ⚠️ partial, each with a written reason.
  - The help numbers 1784, 1669, 1555, 1130, 1129 and 1323.
- **Rules:**
  - Low items flood first, judged by the sprite's centre.
  - The breaker's correct answer changes once the floor is wet.
  - +50 bonus for critical items handled before water enters.
  - A wrong answer costs 4 s; each decoy costs 2 s the first time.
  - The clock pauses while the player reads.
  - Scores are out of 10, with flattering rank titles.
- **Replay:**
  - a daily house that is the same for everyone (Bangkok date)
  - a streak
  - random practice houses
  - challenge links (`/c/p8?h=…`) that rebuild a friend's exact house
- **น้องจก,** the gecko mascot: five faces, a rain hood and a torch, and short lines of dialogue. Sounds are synthesised with Web Audio, and Android also gets haptics.
- **Sharing:**
  - a 1080×1350 result card and two 1080×1920 checklists
  - native share with a file, then LINE / Facebook / X / copy / save as fallbacks
  - long-press saving and an "open in browser" link inside in-app browsers
  - 25 pre-rendered link-preview pages and images
- **Offline play** after the first visit, through a service worker that refreshes content from the network first.
- **Anonymous metrics:** events go through `POST /api/e` to Workers Analytics Engine, alongside Cloudflare Web Analytics. There are no cookies and no personal data.
- **Build:** content validation that fails the deploy on mistakes, link-preview generation, a service-worker version from a content hash, and a 500 KB budget check (142 KB used).
- **Tests:** 12 rule tests and 24 headless-browser checks, with Android, iPhone, LINE and Facebook user agents, offline mode and reduced motion.
- **Documents:** the safety table, game design and wireframes, deploy steps, the Thai launch kit, the metrics plan, the test checklist, the handoff, the knowledge base, known issues, guidelines, and approach and method.
- **Tools:** `npm run probe` measures tap-area overlaps and flood timings.

### Fixed before release (found during the handoff review)

- **Tab and HUD sizes:** on screens 640 px tall or shorter, the HUD buttons and room tabs were 40 px. They are 44 px again.
- **"ทำไม?" expander:** in the result lessons it was 35×40 px. It is now at least 44×44 px.
- **Source links:**
  - In the lessons and the tip card they are padded to a 44 px tap height without moving the text.
  - The About list now uses full-width rows of at least 44 px.
- **Screenshot names:** `npm run smoke -- --screens` now writes the screenshot names the docs use.

### Changed

- **Moved repository.** The game moved from the `baanrodmai/` folder of a `bejranonda/carrier-vector-1988` feature branch to the root of this repository. Its first two commits were kept, and the Cloudflare "Root directory" setting is now empty. The original branch was never merged and no longer carries the game.

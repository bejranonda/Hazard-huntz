# 07. Who receives the app: Thai audiences on LINE and social media

> Researched on 20 Oct 2026 for the owner's request "Please research who can be potential users who get from line and social media in Thailand" (v1.11.0). It is desk research, not a user study: every figure has a source [S#] in the table at the end, and figures read only in a search snippet, a secondary write-up or a page that refused automated readers are marked **[unverified]**. What v1.11.0 did with it is in [KNOWLEDGE §33](KNOWLEDGE.md#33-food-by-food-in-a-power-cut-and-the-whole-app-for-its-real-readers-v1110); what is left is in [ROADMAP N23](ROADMAP.md#n23-food-by-food-and-the-app-for-its-real-readers-v1110).


Audience research for the owner, 20 Oct 2026. Every figure has a source number [S#] that points to the sources table at the end, with the publisher, date and URL. Two status labels are used:

- **Confirmed** means the figure was read on the source page during this research.
- **[unverified]** means the figure was seen only in a search snippet, a secondary write-up, or a page that refused automated readers.

Thai government sites (nso.go.th, anamai, prd) mostly refused automated readers. In those cases a news report quoting the agency is used and named. The exception is one NSO e-book table, which did open.

What the repo already assumes was read first: README, docs/04-launch-kit.md, docs/05-metrics.md, and KNOWLEDGE §14–15 and §17. Section 0 lists what this research confirms, corrects or adds.

---

## Summary

1. **LINE is the one channel almost every Thai adult online shares.** It has 56M monthly users, which is 78% of the population and 83% of internet users [S1]. This is LINE's own figure, and it has not grown since Oct 2024. 92% of online Thais who use the internet to communicate do it through chat apps such as LINE [S6]. Facebook (51.5M ad reach) and TikTok (56.6M adults in ad reach) are where news is *found*. LINE is where it is *passed on*. TikTok is now a news source for 49% of Thais in the Reuters online sample [S7].
2. **About one in three Thais aged 60+ is not online at all.** In 2024, 62.8% of the 14.09M people aged 60+ used the internet, and 84.2% used a mobile phone [S9]. That leaves about 5.2M older people who cannot open a link, my calculation from the same table. For them the app reaches them only as a picture shown or forwarded by a relative, or as paper from an อสม. or a village leader.
3. **Older people who are online forward pictures, not links.** A small UTCC study found that 33.7% of older users' LINE messages were flowers and greetings. They check the source before forwarding. They avoid sad or frightening content. They *dislike links* because a link is effort [S12]. Their top online purposes are chatting (61.6%) and following news (50.7%, higher than any younger generation) [S6].
4. **Disaster information actually moves through local LINE groups and crisis rooms.** In Ang Thong, officials and villagers use LINE groups as the *primary* real-time flood channel. The same study notes that older people without digital access are still missed [S20]. LINE's own figures show OpenChat crisis rooms peaking at 2.9M views a day in the Bangkok floods, 3.4M in the earthquake and 1.3M in the Hat Yai floods [S3]. Official SMS for the 28 Mar 2025 quake went out 82 minutes late [S22]. The new Cell Broadcast did not reach some older phones [S23].
5. **The people most at risk are older people, the grandparents raising children, and households in flood belts.**
   - 12.9% of older people live alone, and 22.6% with only a spouse [S10].
   - 25% of Thai children, about 3M, live with neither parent, and 71% of them live with grandparents [S38].
   - Floods hit 2.7M people in the south in Nov 2025 [S30] and about 1.1M households in the centre and Bangkok in Sep–Oct 2026 [S31].
   - The person who *forwards* the app (an adult child in a city) is often not the person who *needs* it (a parent or grandparent elsewhere).
6. **Phones and data are adequate but not generous.**
   - 74% of mobile web traffic is Android, and about 12% of Android traffic runs Android 11 or older [S26][S27].
   - 71% of AIS subscribers are prepaid, paying about 148 baht a month [S28].
   - Most links open inside LINE's or Facebook's in-app browser [S29].

---

## 0. What this changes in the repo's current assumptions

| Repo assumption (KNOWLEDGE §14, 04-launch-kit) | What the evidence says now | Status |
|---|---|---|
| "LINE about 56M, TikTok about 57M, Facebook about 52M" | These figures are right, but they measure different things. LINE's is its own monthly-user figure, flat from Oct 2024 to Oct 2025. TikTok's 56.6M is ad reach among adults aged 18+, and it fell 2.46M from Jul to Oct 2025. DataReportal says the figures are not comparable [S1]. | Confirmed |
| "LINE OpenChat about 17M monthly users" | OpenChat had **24M** monthly users as of 30 Sep 2026, after it moved to LINE's third tab [S3]. | Confirmed via secondary report of LINE's figures |
| "A study of 711 LINE messages from users aged 55+" | The 711 messages were collected Aug–Dec 2017 through 20 volunteers from their older relatives, with 22 older informants. It is a small qualitative thesis. It also found two things the repo doesn't use: **older users dislike links** and **avoid forwarding frightening or sad content** [S12]. | Confirmed |
| "96% of Baby Boomers (58+) go online by phone" | This figure is correct for the Boomers who answered ETDA's *online* survey, who were 13.22% of 46,348 respondents [S6]. It says nothing about the 37% of people aged 60+ who are offline [S9]. | Confirmed |
| Older people forward around 04:00–06:30 and before bed | This comes from the same 2017 study [S12]. No newer source was found. | Confirmed, but old and small |
| อสม. "about 1.04M" | The number is about **1.07M** (DHSS, 2023). 1,061,195 อสม. had registered on the SMART อสม. app [S16]. | Confirmed |

---

## 1. Platform reach in Thailand

### 1.1 Headline numbers (DataReportal *Digital 2026: Thailand*, data late 2025, published 8 Nov 2025 [S1])

| Measure | Figure | Note |
|---|---|---|
| Population (UN basis) | 71.6M | The registration basis (DOPA) is 65.95M at end-2024 [S36]. Use the DOPA figure when quoting Thai official shares. |
| Median age | 40.6 | 16.0% are aged 65+, and 14.1% are aged 55–64. |
| Internet users | 67.8M (94.7%) | |
| Social-media user identities | 56.6M (79.1% of population; 96.3% of adults) | "Identities" are not people. |
| **LINE** | **56M monthly active users** (78.2% of population, 82.6% of internet users) | 46% female, 54% male. Unchanged from Oct 2024 to Oct 2025. |
| Facebook | 51.5M ad reach (87.9% of adults) | +4.7% year on year. |
| TikTok | 56.6M adults (18+) ad reach | −2.46M from Jul to Oct 2025. |
| YouTube | 47.2M | |
| Messenger | 36.5M | |
| Instagram | 20.6M | |
| X | 13.3M | 58% male. |
| LinkedIn | 6.5M | |
| Median mobile download (Ookla) | 124.33 Mbps | This is a national median. It hides rural and in-event conditions. |

**LINE's own figures.**
- **Users and Official Accounts:** LINE Thailand reports 56M users and more than 12 billion conversations with Official Accounts in 2025. The figures were reported by Marketing Oops on 11 Aug 2026 and are not third-party verified [S2].
- **OpenChat:** OpenChat reached 24M monthly users as of 30 Sep 2026. There are more than 100,000 active rooms, and a standard room is capped at 5,000 members. Daily views of *crisis rooms* peaked at about 30M (COVID-19), 3.4M (earthquake), 2.9M (Bangkok floods) and 1.3M (Hat Yai floods) [S3]. LINE gave no breakdown by age, region or device.
- **Government OAs:** In Dec 2024 LINE grouped nine government and public OAs. One of them is **LINE ALERT (@linealert)**, run with ปภ., กรมอุตุนิยมวิทยา and the BMA's environment department. It carries disaster updates, a risk-area check, emergency numbers and self-protection guidance [S4].
- **Safety Check rehearsal:** LINE and the Ministry of Digital Economy and Society ran a nationwide **LINE Safety Check** rehearsal on 26 Jun 2026 [S5]. The article's date is unclear.

**What Thais use the internet for** (ETDA *Thailand Internet User Behavior 2022*, an online survey of 46,348 people, Apr–Jul 2022; this is the latest edition found) [S6]:
- 92.21% of those who use the internet to communicate do it by chatting in apps "such as LINE, Facebook Messenger". 56.69% make internet or video calls.
- Average use is 7 h 4 min a day. Baby Boomers (58+) use it 3 h 21 min a day.
- The top problems are slow connections (64.65%), intrusive ads (40.47%), patchy coverage (34.60%), dropped connections (18.44%) and "not sure the information is reliable (fake news)" (17.62%).

**News habits** (Reuters Institute *Digital News Report 2025*, Thailand page, 17 Jun 2025; an online, more urban and educated sample) [S7]:
- 88% access news online every week.
- The most important platforms for news are Facebook, YouTube, LINE and TikTok.
- TikTok is used for news by 49%, up 10 points, the highest of any country in the report.
- 63% of people aged 18–34 rely on social media as their main news source.
- 43% prefer to *watch* news online, against 32% who prefer to read.
- 37% share news.
- Trust in news is 55%: 47% among people under 35 and 58% among older people.

### 1.2 Messaging vs feed

- **Feed platforms (Facebook, TikTok, X, YouTube) are where a hazard becomes news.** In the Sep 2026 Bangkok floods, Wisesight counted 167,607 posts and about 40M engagements from 16 to 26 Sep [S8].
  - Facebook carried 70.5% of the posts and about 20M engagements.
  - TikTok carried only 4.5% of the posts but about 14M engagements.
  - A weather page's warning was shared 49,047 times.
  - The 1784 hotline was the most-mentioned help channel, with 420 posts.
- **LINE (groups, OAs, OpenChat) is where it is passed on to family and the community.** LINE is not in Wisesight's listening data, which covers public platforms. The OpenChat crisis-room figures [S3] and the Ang Thong study [S20] are the evidence for its role.
- **Consequence:** a post on Facebook or TikTok earns attention. The *picture* that leaves that post and goes into a LINE group is what reaches a parent.

---

## 2. Older adults

### 2.1 How many, and how they live

- **Number and age.** NSO's 2024 Survey of Older Persons, as reported in Naewna on 6 Sep 2026 [S10], puts the 60+ share of the population at about 20%, up from 6.8% in 1994.
  - 8,321,036 are aged 60–69 (59.3%), 4,180,852 are aged 70–79 (29.8%), and 1,525,523 are aged 80+ (10.9%).
  - The sum, about 14.0M, is my calculation. It agrees with NSO's ICT table, which counts 14.09M people aged 60+ [S9].
- **Living arrangements** (same survey) [S10]: 12.9% live alone, up from 3.6% in 1994, and 22.6% live with only a spouse.
- **Grandparents raising grandchildren.** UNICEF/NSO MICS 2022 found that 25% of children under 18, about 3M, live with neither parent. 71% of those children live with grandparents [S38]. A pilot study cites "over 400,000" skipped-generation families, about 2% of families, 76% of them rural [S39] **[unverified: secondary citation]**.

### 2.2 Phones and the internet

- **Use by age (NSO Table 12.3, ICT statistics 2024, read on NSO's e-book page [S9]).** Percentages are my calculation from the table's counts.

  | Age | Use a mobile phone | Use the internet |
  |---|---|---|
  | 6–14 | 97.1% | 97.0% |
  | 15–24 | 99.2% | 99.1% |
  | 25–39 | 99.0% | 98.7% |
  | 40–59 | 97.9% | 94.8% |
  | **60+** | **84.2%** | **62.8%** |
  | All aged 6+ | 95.3% | 89.6% |

  By region, internet use is 96.1% in Bangkok, 91.6% in the Central region, 90.2% in the South, 87.7% in the Northeast and **83.2% in the North**.
  - A Thairath lifestyle article gives 69.3% of people aged 60+ online in 2024 and says 95% of "Silver Age" people own smartphones. It names no source and its page refused readers, so it is **[unverified]**. Use the NSO 62.8%.
- **Online older Thais are phone-first and chat-first** (ETDA 2022, Boomers 58+ [S6]):
  - 96.00% use a mobile phone, 8.55% a smart TV and 7.69% a tablet.
  - Their purposes are chatting (61.59%), following news (50.68%, the highest of any generation), entertainment (44.95%), government services (21.74%) and health services (10.92%).
  - Their problems are slow connections (62.31%), ads (33.19%), patchy coverage (31.95%), unsure reliability (15.06%) and dropped connections (14.87%).
- **LINE dominates.** In a survey of 1,237 older Thai internet users, 85.7% used LINE. It was the top platform in every education, income and marital group [S13].
  - 75.3% used their own smartphone, and 41.8% were online under an hour a day.
  - 56.9% had a chronic disease.
  - The highest-scoring problem item was "hard to know which [health information] to follow".

### 2.3 How older people use LINE

- **The UTCC thesis** (reported in Thansettakij on 18 Sep 2018; 711 messages from Aug–Dec 2017, 22 older informants [S12]):
  - Messages were **flowers and daily greetings 33.66%**, care and missing-you messages 25.14%, and politics and sports 0.08%.
  - Many wake about **04:00–06:30** and check LINE at once, then again at breaks, noon and bed.
  - They prefer **bright, warm colours** and avoid black and "inauspicious" colours.
  - They are **cautious about forwarding**: they check the source, and if unsure they read without forwarding.
  - They **avoid sending negative, sad, frightening or angry content**.
  - They prefer **pictures, videos and text**, and **dislike links because opening them takes effort**.
- **A Nonthaburi study** (repo citation, 2023, not re-opened [S14]) found that older users forward news and pictures rather than chat, driven by easy forwarding and a credible look.
- **A newer Nonthaburi study** (400 older adults, published 29 Apr 2026 [S15]) found two groups:
  - a "Smartphone-Control" group that uses phones for tasks and transactions;
  - a "Smartphone-Dependent" group that uses them against loneliness.
  - Living alone or without a caregiver pushed people to rely on the phone. Heavy users **changed font size and device settings** to cope.

### 2.4 Reading on small screens and sight

- **Font size test.** In a controlled test of reading Thai on a tablet, 18 older Thai readers (aged 61–74) read **18-point text significantly faster than 14 or 16 point**. Typeface did not change speed [S17]. Comprehension and preference favoured the *looped (serif)* Thai face (TH Sarabun) over the loopless Kanit. The DOI is 10.1145/3315002.3317568 (W4A 2019).
  - The study is small (18 older Thai readers).
  - The details were read in a review summary, not the paper. The preference percentage is **[unverified]**.
- **Visual impairment.** Local studies report visual impairment in 18.3% of adults aged 50+ in Saraburi, mainly refractive error and cataract (search result, **[unverified]**). No national figure for 2024 was found.
- **Disability.** Thailand has more than 2.28M registered persons with disabilities, 3.45% of the population: mobility 52.26%, hearing 19.27%, visual 7.54% (NHRC, quoted in Matichon on 6 Nov 2025 [S40]). The NHRC says people with disabilities are the hardest hit in disasters. Visually and hearing-impaired people may not perceive a quake or flash flood in time, and warnings aren't designed for them. About 1.37M (60.6%) of registered disabled people are aged 60+ (DEP, 31 Oct 2025, seen in a document snippet, **[unverified]**).

### 2.5 Trust, misinformation and scams

- **Health is the second-largest fake-news category.** Of 38,361 items submitted for verification from Nov 2019 to Mar 2025, government policy was 47.36%, **health 36.71%** and disaster 4.76% (Anti-Fake News Center, DE ministry, Thansettakij, 7 Apr 2025 [S18]).
- **Disaster rumours follow disasters.** In the week of 18–24 Apr 2025 the AFNC's top fake item was "earthquakes will hit six ASEAN countries at once on 21 April". Number 3 was "Bangkok will get another quake as strong as 28 March this year" [S19].
- **Older groups lose the most money to scams.** From Nov 2023 to Oct 2024, people aged 50–64 and 65+ together accounted for 41,901 scam cases and 7,769 million baht, mostly from investment scams. Facebook was the top channel across all ages, with 26,804 cases (DE ministry's AOC, Thansettakij, 14 Nov 2024 [S21]).
  - Public campaigns tell people not to tap unknown links.
  - So an unknown `.bot` link is a real barrier for this group. The repo's own simulated reader test found the same (04-launch-kit, line 384).
- **Older people may forward health claims without finishing them.** A Mahidol researcher said that on LINE "they often do not finish reading before passing [information] on" (Khaosod English, 18 Jun 2019, seen only in a search snippet, **[unverified]**).
- **The Cofact fact-check chatbot is small.** Cofact runs on LINE (@cofact), and its examples are mostly health claims. At one year it had 136,668 community members and 5,335 chatbot users (Thai Post, seen in a search snippet, **[unverified]**).

---

## 3. How disaster and health information actually spreads

### 3.1 Local LINE groups and village leaders

- **Ang Thong** (Chao Phraya riverside; 18 key informants from 15 agencies; published Jun 2025 [S20]):
  - Official announcements still go through memos and meetings, but "residents and community representatives often rely on LINE group messaging as a primary tool for receiving and sharing information".
  - LINE groups between officials and residents "proved an efficient tool for real-time alerts and coordination".
  - Yet "vulnerable groups like the elderly and those without digital access still face challenges in receiving timely information".
  - The study recommends trained LINE-group roles, a list of key risk communicators, and **VHVs (อสม.) as core intermediaries**. It notes that it did not interview older people themselves.
- **Mae Sai, Chiang Rai, Sep 2024** (a municipal PR officer, Khaosod English, 11 Sep 2024 [S24]):
  - Warnings from the Meteorological Department were relayed to residents **through village headmen**.
  - Some residents stayed put because "the warnings were unclear".
  - The TMD's "technical language lacks simplicity" for ordinary people. He asked for a colour code.
- **Mae Sot, Tak.** A Global Water Partnership project introduced LINE to 20 community groups because the old bulletin-board warning system no longer worked (GWP, seen in a search snippet, **[unverified]**).

### 3.2 อสม. (village health volunteers)

- **Size and app use.** There are about 1.07M อสม. In Jun 2023, 1,061,195 had registered on the **SMART อสม.** app, and 974,970 were reporting their work through it. The app passes Ministry of Public Health news straight to อสม. and had been used to screen 6,247,448 older adults (DHSS, The Bangkok Insight, 22 Jun 2023 [S16]).
- **Disaster role.** In 2026 อสม. and อสส. pinned the locations and needs of vulnerable people in the **"พ้นภัย"** app. The work covered 7,255 of 7,423 subdistricts (97.74%) and supports disaster planning and backup power for patients (DHSS Director-General, Hfocus, 10 Aug 2026 [S25]).
- **What this means.** อสม. already hold the list of bedridden and older people in each subdistrict and already relay ministry messages. They are the best "last metre" to the offline third of older people, but only with printable, credible material.

### 3.3 Official alerts are improving, but they reach new phones first

- **28 Mar 2025 earthquake.** The quake struck at 13:20, and the first SMS went out at **14:42**. The SMS system could send to only about 200,000 numbers per batch (Pattaya Mail, 30 Mar 2025 [S22]).
- **Cell Broadcast tests, May 2025.** Tests ran at three levels, the last on 13 May 2025 across five provinces with more than 11M people (Chiang Mai, Ayutthaya, Udon Thani, Nakhon Si Thammarat, Bangkok).
  - **Some users did not receive the alert because of incompatible devices or outdated operating systems.** True and dtac customers were told to update to **Android 11+ or iOS 18+**.
  - Alerts support five languages, which the article doesn't name (The Story Thailand, 13 May 2025 [S23]).
- **Consequence.** People on older phones, who are disproportionately older and poorer, may miss the official alert. A relative's LINE message becomes their warning.

### 3.4 During events: Facebook pages, crisis rooms, rescue groups

- **Hat Yai, Nov 2025.** Residents trapped near the railway station posted Facebook videos asking for help, saying no agency had come yet (Thairath English, 25 Nov 2025 [S32]).
  - Reuters reported that the Matchima rescue group's Facebook page received thousands of pleas, including from households with older and disabled people. This was seen only in reposts, **[unverified]**.
  - LINE's Hat Yai OpenChat crisis rooms peaked at about 1.3M views a day [S3].
- **Bangkok and the Central region, Sep 2026.** Weather pages outpaced official warnings in shares, and coping humour spread fastest [S8]. LINE's Bangkok-flood OpenChat rooms peaked at about 2.9M views a day [S3].
- **The 2011 floods** affected more than 13M people in 66 provinces, with THB 1.43 trillion in damage and losses (World Bank/RTG rapid assessment, seen in a search snippet; the page refused readers, **[unverified]**). The repo's own research notes that the short รู้สู้! Flood videos beat the long official documents (KNOWLEDGE §14).

### 3.5 Young people and TikTok

- **TikTok news.** TikTok is a news source for 49% of the Reuters sample, and 63% of people aged 18–34 rely on social media as their main news source [S7].
- **TikTok engagement.** In the Sep 2026 floods TikTok had 4.5% of posts but about 35% of engagements (14M of 40M) [S8].
- **TikTok is the place to find younger sharers.** They see a clip, then send the picture to the family LINE group.

### 3.6 Schools, parents and workplaces

- No national figure was found for school or parent LINE groups. Thai studies describe teachers using LINE for homework notices and parent contact, and LINE OAs used for child health advice (search results, small local studies, **[unverified]**).
- The repo's launch kit already plans to use schools ("play with your parents"). The evidence supports school and parent groups as a channel, but cannot size it.

### 3.7 Who forwards, who reads, who acts

| Role | Who, on the evidence | Evidence |
|---|---|---|
| Finds it | Under-40s on Facebook and TikTok; weather and news pages | [S7][S8] |
| Forwards to family | Adult children (the family-group admin); older people forward *pictures* that look credible and kind | [S12][S14] |
| Forwards to the community | อสม., village headmen, อบต. and district officials in LINE groups; OpenChat crisis rooms | [S16][S20][S24][S3] |
| Reads | Older people on LINE (reading pictures, not links); the offline third only through a relative or paper | [S9][S12] |
| Acts | The household member on the spot. In skipped-generation homes this is a grandparent, often with a child | [S10][S38] |

---

## 4. Devices and connection realities

- **Platform and OS** (StatCounter, Sep 2026; web traffic, not people [S26]):
  - Mobile is 78.38% of web traffic, desktop 18.31% and tablet 3.31%.
  - Android is 73.96% of mobile traffic, iOS 26.01%.
  - By vendor: Apple 26.0%, Samsung 22.65%, Oppo 19.5%, Vivo 13.11%, Xiaomi 8.15%, Realme 3.47%.
- **Android versions** (StatCounter, Sep 2026 [S27]): 16 = 40.65%, 15 = 18.55%, 14 = 11.56%, 13 = 9.79%, 12 = 7.59%, 11 = 6.15%.
  - The remaining 5.71% is older versions, my calculation from the gap to 100%.
  - So about **11.9% of Android web traffic runs Android 11 or older**.
  - Older and offline-leaning users browse less, so this probably *under*-counts old phones among the app's receivers.
- **Prepaid and spending** (AIS, Singtel Investor Day 2025 deck, filed on SGX [S28]):
  - AIS had 46.0M subscribers with a postpaid-to-prepaid mix of **29% : 71%** (1H25).
  - In 2Q25 there were 32.7M prepaid and 13.3M postpaid subscribers.
  - ARPU was about **148 baht a month for prepaid** and 442 baht for postpaid.
  - Mobile penetration is 142%, so many people have more than one SIM.
- **Data price.** Thailand's average was **US$0.41 per GB** (rank 34 of 237; world average US$2.59), from 2023 data (Cable.co.uk league, now at bestbroadbanddeals.co.uk [S35]). Data is cheap, but prepaid users on daily or capped packs still notice heavy pages and images.
- **In-app browsers.** LINE opens links in its **in-app browser** by default. A link opens in the phone's browser only if its URL carries `?openExternalBrowser=1`. LINE for Android can use a Chrome custom tab with `openInAppBrowser=0` (LINE Developers [S29]). The repo already uses `openExternalBrowser` in `public/js/share.js` for some share paths. Facebook's and TikTok's in-app browsers are the other common places links open; the repo's own audit (KNOWLEDGE §11) documents their limits.
- **Connection during events.** Slow connections are the top problem for all users (64.65%) and for Boomers (62.31%), and patchy coverage is third (about 32–35%) [S6]. During a flood, power and signal are worse still. The Hat Yai pleas were about phones running out of battery as well as water (Malay Mail via search snippet, **[unverified]**).
- **Text size and accessibility settings.** No Thai survey gives the share of phones with enlarged text. Qualitative evidence says heavy older users do enlarge it [S15].

---

## 5. Who is most at risk, and might benefit most

| Group | Size and evidence | Hazards in the app |
|---|---|---|
| **Flood belts.** North and Northeast in Aug–Sep, South in Nov–Dec, Central and Bangkok outskirts in Sep–Oct | **Aug–Sep 2024:** 16 Aug–16 Sep 2024, 28 provinces, **133,082 households**, 42 deaths (DDPM via The Standard, 16 Sep 2024 [S33]); Chiang Rai and Mae Sai worst [S24].<br>**Nov 2025:** 17–26 Nov 2025, 9 southern provinces, **986,018 households, 2,734,318 people**, 18 deaths; Songkhla alone 836,206 people (DDPM via Infoquest, 26 Nov 2025 [S30]).<br>**Sep–Oct 2026:** 29 Sep 2026, 29 provinces with **940,300 households (2.60M people)**, plus all **50 Bangkok districts (329,000 households)**, 22 deaths (DDPM via Thai PBS [S31]). The peak reported on 1 Oct 2026 was 30 provinces and 1,177,404 households (search snippet, **[unverified]**). | Before the water, after the water, flash floods and landslides, power cuts, the fridge calculator |
| **PM2.5 regions.** North in Feb–Apr, Bangkok in Dec–Feb, and the Northeast | **Patients:** 12.37M PM2.5-linked patients in 2024 and 10.23M in 2025 up to 18 Nov. The top provinces were Nakhon Ratchasima, Nakhon Si Thammarat, Chiang Mai, Khon Kaen and Ubon Ratchathani. The source institute isn't named (Thairath English, 1 Dec 2025 [S34]).<br>**Bangkok:** more than 350 schools closed on 24 Jan 2025, and about 100,000 of more than 10M residents signed up to work from home (Al Jazeera [S41]).<br>**Chiang Mai:** 787 hotspots and 218 µg/m³ near CMU on 30 Mar 2026 (Chiang Mai CityLife [S42]). | Dust guide, dust today |
| **Extreme heat** | 63 heat deaths in 2024, average age 62, 51% with underlying disease, 54% in the Northeast, 70% in April; outdoor work and alcohol were the main factors (DDC via PPTV, 20 Mar 2025 [S43]). | Heat guide |
| **Older people living alone or with a spouse only** | 12.9% and 22.6% of about 14M people aged 60+ [S10]. | All guides, the plan card, daily medicine in the home check |
| **Skipped-generation homes** | 25% of children live with neither parent, and 71% of them live with grandparents [S38]. | Plan card (who helps whom), young children in the home check |
| **Households with young children** | Births were 462,240 in 2024, the first year under 500,000 since 1949 (DOPA via Khaosod English [S36]). About 416,000 were reported for 2025 (search, **[unverified]**). The group is small, and shrinking. | Kit (nappies, milk), dust (children up to 5) |
| **Chronic illness and bedridden relatives** | 56.9% of online older users report a chronic disease [S13]. About 1.5% of older people are bedridden (academic estimate, **[unverified]**). อสม. now map them in "พ้นภัย" [S25]. | Daily medicine and pills, backup power for devices, plan card |
| **People with disabilities** | More than 2.28M people (3.45%); mobility 52%, hearing 19%, visual 7.5% [S40]. | Everything; warnings must not rely on one sense |
| **Migrant workers** | 3,342,990 legally employed, 2,422,004 of them from Cambodia, Laos, Myanmar and Vietnam (Ministry of Labour, Khaosod English, 10 Jan 2025 [S37]); 500,000–700,000 more undocumented (2025 window). Many speak Thai well but read it less well, and Facebook is central (Nation Thailand; a small study of 18 Ranong fishworkers; both **[unverified]**). | Every guide, if pictures carry the advice; none of the English helps them |
| **Foreign visitors and residents** | 32,974,321 foreign arrivals in 2025, Malaysia first with 4.52M (Ministry of Tourism, via Bernama, **[unverified]**). Malaysian tourists were stranded in Hat Yai in Nov 2025 [S32]. In Nov 2022 there were 109,866 general work-permit holders (DOE via thailand.go.th, **[unverified]**). | The English version |
| **Bangkok condo dwellers** | No reliable stock figure was found. Their exposure is PM2.5 (Dec–Feb), the Mar 2025 quake in high-rises, and power and water cuts in tall buildings. The quake rumours that followed [S19] show the demand. | Quake guide, dust today, power cut, fridge |

---

## 6. Personas (by role)

Each persona gives the age band, the device, how the link reaches them, what they want in the first 10 seconds, what would make them forward it, and what blocks them.

### P1. The morning forwarder (ผู้ส่งต่อยามเช้า)
- **Age:** 60–72, and more often a woman (57.9% of people aged 60+ are women, per a search snippet of NSO's 2024 report, **[unverified]**).
- **Device:** a mid-range Android (Oppo, Vivo, Samsung A) or a hand-me-down iPhone, font enlarged, prepaid.
- **How it reaches her:** a *picture* forwarded into a family or friends' LINE group, rarely a link. She is awake about 04:00–06:30 [S12].
- **First 10 seconds:** "Is this real, and is it for us?" The picture alone must answer it: big letters, the agency's name, the helpline, a kind tone.
- **Would forward if:** it looks credible and kind, is useful for grandchildren, is bright and warm, and is short [S12][S14].
- **Blocked by:** having to tap a link at all [S12]; small text; frightening wording [S12]; English words or acronyms; an unknown `.bot` address that looks like a scam [S21]; a page that asks questions before showing anything.

### P2. The family organiser (ลูกหลานผู้จัดการครอบครัว)
- **Age:** 28–50, works in Bangkok or a regional city, parents elsewhere.
- **Device:** iPhone or Samsung.
- **How it reaches them:** news first on Facebook, TikTok or X during an alert, or a post in the workplace or school LINE group. They are the admin of the family group.
- **First 10 seconds:** "What should Mum and Dad do in *their* house, now?" The guide for the hazard in the news, and a picture they can send without explaining.
- **Would forward if:** it saves them the explaining (one picture says it all); there is one tap to "send to family"; it shows the agency's name; it is free with no sign-up.
- **Blocked by:** the game coming first; a check that only sizes *their own* household when the at-risk home is the parents'; a picture unreadable on the parents' phone; the shared link opening something other than what the preview promised.

### P3. The community relay (อสม., ผู้ใหญ่บ้าน, admin of an อบต./district LINE group)
- **Age:** 40–65.
- **Device:** Android, with SMART อสม. installed [S16].
- **How it reaches them:** the provincial health office, the อบต. or district LINE OA, a partner kit, or a district official's group.
- **First 10 seconds:** "Who says so, and can I print it?" The sources (ปภ., กรมควบคุมโรค, กรมอนามัย), the date, an A4 version, and the after-flood health guide.
- **Would forward if:** it matches their role (vulnerable households, medicines, older and bedridden people [S25]); it is printable for people without phones; it can be pinned in the village group; it is plainly not an official site, so they are not seen as impersonating the state.
- **Blocked by:** print and download hidden in the in-app browser; no QR code on paper; a design that looks like a game for children; advice that doesn't fit the local hazard; fear of spreading something wrong (health is the AFNC's second-largest category [S18]).

### P4. The grandparent carer or older person living alone (the receiver at most risk)
- **Age:** 65–85, rural North or Northeast, often with a grandchild of school age [S38].
- **Device:** maybe no internet (37% of people aged 60+ [S9]); an old Android used for calls and LINE calls; possibly too old for Cell Broadcast [S23].
- **How it reaches them:** paper from an อสม.; a grandchild showing a picture; a phone call from the adult child; a picture in LINE.
- **First 10 seconds:** almost no reading. Three to five actions with pictures, the helpline number very large, and what to take for their medicine.
- **Would forward if:** they rarely forward. They *act*, or keep the paper on the wall.
- **Blocked by:** reading on a small screen; sight; no data; anything that needs typing (the plan card); a link.

### P5. The household in the water's path (in-event)
- **Age and place:** any age, in the South (Nov–Dec), the North (Aug–Sep), or the Central region and Bangkok's edges (Sep–Oct) [S30][S31][S33].
- **Device:** whatever phone they have, battery and signal failing [S6].
- **How it reaches them:** an OpenChat crisis room [S3]; the village or community LINE group [S20]; a Facebook rescue or weather page [S8][S32].
- **First 10 seconds:** "What do I do in the next hour?" The *before the water* list (the breaker, documents, medicine, 1784), with nothing to load and nothing to answer.
- **Would forward if:** it is a picture they can paste into the crisis room without explaining.
- **Blocked by:** a heavy or slow page; the game; a page that needs the network after the first visit; a hub instead of the guide.

### P6. The urban condo and office worker
- **Age and place:** 22–40, Bangkok and vicinity.
- **Device:** iPhone more likely (26% of Thai mobile traffic is Apple [S26]).
- **How it reaches them:** a TikTok clip, an X thread, the office LINE group, during a PM2.5 week (Dec–Feb), after a quake, or in a power cut.
- **First 10 seconds:** "Dust today: what do I do?", or "after a quake: stay in the building or leave?"
- **Would forward if:** it gives a quick answer that also helps their parents (dust advice for older people and children); the challenge game, *if* they play.
- **Blocked by:** looking like a kids' game; slowness; nothing specific to high-rise living (the quake guide deliberately leaves out when to leave a tall building, because the sources disagree); links that don't open in the right language.

### P7. The migrant worker or foreign resident
- **Who:** two groups.
  - Migrant workers aged 20–45 from Myanmar, Cambodia or Laos, who speak Thai, read it less well and live on Facebook [S37] (reading and Facebook claims **[unverified]**).
  - English-reading expats and tourists, for example Malaysians in Hat Yai [S32].
- **How it reaches them:** migrants through an employer, a foreman, an NGO or a Burmese-language Facebook page; English readers through expat Facebook groups, a hotel, or an English post linking `/en/`.
- **First 10 seconds:** pictures that work without Thai; for English readers, "is this for where I am, and what number do I call?"
- **Would forward if:** it comes in their own language (migrants); it is an English picture to share with others stranded (tourists).
- **Blocked by:** Thai-only text; an English version, for migrant workers; Thai-language hotlines; no Burmese, Khmer or Lao.

---

## 7. The sharer and the receiver

| | The sharer (P2, P3, P6; P1 for pictures) | The receiver (P1, P4, P5, P7) |
|---|---|---|
| Arrives from | A news or weather post, TikTok, a work or school group, a partner kit | A forwarded **picture** (most often) or a forwarded link |
| Wants | Something to *send* that does the explaining | Something to *do*, without reading much |
| Reads | The preview, the guide, the source | The picture; with a link, only what is on top |
| Risk | Gives up if the app needs explaining | Never taps; distrusts the link; can't read small text |
| **First screen it needs** | The guide for the hazard in the news (the alert card), with **"ส่งให้คนที่บ้าน"** as the first button. It sends the picture and the link, with a warm one-line caption | Exactly what the preview named, opened and large, with one obvious action (call 1784, save the picture), and a one-line trust strip: *ฟรี · ไม่ใช่เว็บไซต์ของรัฐ · ไม่เก็บข้อมูล · ที่มา: ปภ. ต.ค. 2569*. The hub comes only after Back. |

The repo already gets much of this right. `/checklist/<id>` opens the guide, its preview is the guide's picture, and the picture carries the helplines (KNOWLEDGE §29; LESSONS A1). What this research adds is that **the picture is the product for most receivers, the link is secondary, and a third of older people receive it only on paper or on someone else's screen**.

---

## 8. Design and content implications, in priority order

1. **Make every forwardable picture complete, warm and readable at chat size.**
   - **Evidence:** older users dislike links [S12]; 37% of people aged 60+ are offline [S9]; previews are small (repo KNOWN_ISSUES #68).
   - **Do this:** each guide, kit, plan and calculator picture should state the actions, the helpline and the source *on the picture*, with no "tap to read more". The domain belongs in large type and the tone stays positive ("ทำแบบนี้ บ้านปลอดภัย"), never frightening [S12].
   - **Check it:** view each picture at 360 px in a LINE chat. Can the guide's first line be read without opening it?

2. **Land the receiver on exactly what the preview named, with a trust strip.**
   - **Evidence:** scam fear and losses among older groups [S21]; "hard to know which to follow" [S13]; 15% of Boomers unsure what is reliable [S6]; the repo's simulated aunt read a `.bot` link as a quiz scam (04-launch-kit, line 384).
   - **Do this:** every deep link (`/checklist/<id>`, `/kit`, `/fridge`, `/air`) should open that content first. The guide pages already do. Add one line in plain Thai: free, made by a private person, not a government site, collects nothing, sources named and dated. Never ask anything before showing the answer (GUIDELINES rule 82).

3. **Make the text bigger, and honour the phone's text size.**
   - **Evidence:** 18-point text was read fastest by older Thai readers [S17]; older users enlarge fonts [S15]; 7.5% of registered disabled people have visual disabilities [S40].
   - **Today:** the app sets every size in `px`. 20 CSS rules are at 12–13 px and 46 at 14–15 px. Body text is 17 px (`public/css/app.css`, counted on 20 Oct 2026).
   - **Do this:**
     - Keep guide lines and calculator answers at about 18–20 px or more.
     - Keep anything a receiver must read at 14 px or more.
     - Move to `rem` so a phone's larger-text setting scales the page.
     - Add one remembered "ก ก ตัวใหญ่" toggle (localStorage) for in-app browsers that ignore system text size.
   - **Not verified:** how each in-app browser (LINE iOS and Android, Facebook) applies system text size to `px` pages. Test it on real phones.

4. **Test a looped Thai face for long body text.**
   - **Evidence:** older Thai readers understood looped (serif) Thai better and preferred it [S17]. The study is small, so test before changing anything.
   - **Do this:** headings can stay in Kanit. Try a looped face (Sarabun or Noto Sans Thai Looped, subset) for guide lines, the kit and the sources in the next visitor audit, read by a real 65-year-old. Watch the 500 KB budget.

5. **Treat paper and the "last metre" as a channel for the offline third.**
   - **Evidence:** 62.8% of people aged 60+ are online [S9]; older people miss LINE alerts [S20]; อสม. are the intermediaries and already map vulnerable homes [S16][S25].
   - **Do this:**
     - Offer an "อสม. / ผู้ใหญ่บ้าน" print pack: A4, one guide per page, a QR code, the date and the sources. This ties in with the QR idea in ROADMAP P5.
     - Make print reachable from inside LINE. Print is hidden in in-app browsers today, so offer an "open in Chrome/Safari to print" link via `openExternalBrowser=1` [S29], or a ready A4 PNG.

6. **Offline and low-data first, especially during an event.**
   - **Evidence:** slow connections are the top problem (62–65%) and coverage gaps third [S6]; floods affecting about a million households at once [S30][S31]; 71% of subscribers on prepaid [S28].
   - **Do this:**
     - Pre-cache all nine guides and the helplines on the first visit, so a person who opened one guide has all of them when the signal goes.
     - Keep the first load small (254 KB today).
     - Keep forwarded images modest in size; LINE re-compresses them anyway.

7. **Design for the in-app browser as the main browser, on old phones.**
   - **Evidence:** links open in LINE's in-app browser by default [S29]; about 12% of Android traffic is Android 11 or older [S27]; Cell Broadcast failed on older OS versions [S23].
   - **Do this:** run the real-phone pass (ROADMAP L-tasks) on an Android 10 or 11 phone inside LINE and Facebook, as well as a current one. Keep every fallback the repo has for share, save and print.

8. **Give the sharer a one-tap "send to Mum and Dad", and let the home check describe *their* home.**
   - **Evidence:** the sharer is often not the at-risk person: adult children migrate, 25% of children live with neither parent, 71% of those with grandparents [S38]; 12.9% of older people live alone [S10].
   - **Do this:**
     - Each guide and calculator ends with "ส่งให้พ่อแม่/คนที่บ้าน", which sends the picture plus a warm neutral caption.
     - Consider letting the home check hold a second household on the device ("บ้านพ่อแม่"), so the organiser can size water and medicine for the parents' home and send that card. This is new, and it needs no data to leave the phone.

9. **Put the right guide on top for the season and the region.**
   - **Evidence, by season:**
     - South: Nov–Dec [S30].
     - North and Northeast: Aug–Sep flash floods and landslides [S33].
     - Central and Bangkok: Sep–Oct [S31].
     - North: PM2.5 in Feb–Apr [S42]. Bangkok: PM2.5 in Dec–Feb [S41].
     - Heat: Mar–May, peaking in April and in the Northeast [S43].
   - **Do this:** the alert card and the season calendar exist (`config.json → alert`, KNOWN_ISSUES #47). Add a regional posting calendar to 04-launch-kit, so southern pages get the flood guide in November while Bangkok gets dust.

10. **Write in plain words and name actions, not agencies' jargon.**
    - **Evidence:** the Mae Sai officer said the TMD's language is too technical and asked for colours [S24]; the owner couldn't read the fridge tool (LESSONS A8).
    - **Do this:** extend the v1.10.1 plain-words pass to all 90 guide lines. Spell out an acronym once (ปภ. = กรมป้องกันและบรรเทาสาธารณภัย) on pictures meant for older readers. Use levels and colours where the source defines them.

11. **Be a companion to the official channels, never a look-alike.**
    - **Evidence:** LINE ALERT exists, with ปภ. and TMD [S4]; Cell Broadcast now exists [S23]; health and disaster rumours are common [S18][S19].
    - **Do this:** point to 1784 and the official channels, and say "follow the official warning". Never use agency logos or LINE ALERT styling. Date every picture. When a rumour is in the news (for example, "another quake on date X"), post the guide, not a rebuttal of the rumour.

12. **Accessibility beyond sight.**
    - **Evidence:** 2.28M registered disabled people (mobility 52%, hearing 19%, visual 7.5%) and the NHRC's warning that disasters hit them hardest [S40].
    - **Do this:**
      - Give every picture-only element real alt text, the guide's lines in text.
      - Never rely on colour alone (the dust tool already names colours in words).
      - Make no step audio-only.
      - Keep tap targets at 44 px or more (already a rule).
      - Make the plan card's "who helps whom" mention people with disabilities explicitly, if a source backs it.

13. **Be clear about who the English version is for, and consider Burmese.**
    - **Evidence:** English serves tourists (32.97M arrivals in 2025, Malaysians first, stranded in Hat Yai, **[unverified]** / [S32]), expats and NGOs. It does not serve the 3.34M migrant workers [S37], who speak Thai, read it less well, and use Facebook (**[unverified]**). Cell Broadcast already carries five languages [S23].
    - **Do this:** keep English honest about Thai sources and numbers (already done). Post English links in the south's tourist season. A Burmese picture set of the top three guides (before the water, after the water, house fire), with a native translator and the same sources, would reach more at-risk people than English does. Then consider Khmer and Lao.

14. **Keep the tone warm and the game optional.**
    - **Evidence:** coping humour spread fastest [S8]; older forwarders avoid frightening content [S12]; under-35s get news from TikTok [S7].
    - **Do this:** humour stays aimed at the situation. TikTok clips should link to a guide (`/checklist/<id>`) and use the game only as the hook. The game stays below the tools (v1.9.0), since it serves P6 and younger people, not P1 or P4.

---

## 9. What the app should not assume

- **That the receiver will tap the link.** Many won't [S12], and a third of older people can't [S9].
- **That the person reading is the person at risk.** The sharer is often an adult child elsewhere [S38][S10].
- **That "family" means parents and children under one roof.** 12.9% of older people live alone, 22.6% only with a spouse [S10], and a quarter of children live with neither parent [S38].
- **That links open in Chrome or Safari.** They open in LINE or Facebook, where print, download and installing the app may not work [S29].
- **That the phone is new or up to date.** About 12% of Android traffic runs Android 11 or older [S27]; the official alert itself can fail on old OS versions [S23].
- **That data and battery are plentiful.** 71% are prepaid at about 148 baht a month [S28]; connections are the top complaint [S6]; floods cut power.
- **That the official alert arrived first.** The SMS for the 2025 quake came 82 minutes late [S22].
- **That people trust a new site.** Scams target the same age group [S21], and health is a top fake-news category [S18]. Trust has to be shown, not assumed.
- **That people know the acronyms or technical terms.** They don't [S24].
- **That people will type.** Older users prefer pictures and taps [S12]; the plan card's free text is a barrier for P1 and P4.
- **That the English version serves foreigners in Thailand in general.** Migrant workers need Burmese, Khmer or Lao, not English [S37].
- **That frightening content spreads.** Older forwarders avoid it [S12]; coping humour spread fastest [S8].
- **That platform figures are people.** LINE's 56M, TikTok's 56.6M and Facebook's 51.5M are different measures [S1]. Social-media "identities" are not people.
- **That a visitor comes back.** The app has no cookies, so return visits can't be counted. Design for one visit, and offline after it.

---

## 10. Signals the owner could watch (anonymous counts only)

These use what is already collected (`/api/e` events, Cloudflare Web Analytics) or add only coarse, on-device buckets that carry no identifier. Anything marked *new* needs a decision from the owner and an entry in both allowlists (05-metrics, "Limits and privacy").

| Question | Signal | Where it comes from |
|---|---|---|
| Are older forwarders reaching it? | Hour of day (Bangkok time) of `view` and `checklist_open`. A peak around 04:00–07:00 and 20:00–22:00 matches the older LINE pattern [S12] | Already stored (the event timestamp) |
| Do pictures travel further than links? | Per guide: `view` with label `checklist` (people who opened a forwarded guide link) ÷ `checklist_save` (pictures sent). Also the share-channel split (`save` and `native` against `line`) | Already collected |
| Is the game still needed as a hook? | `checklist_open` by label (`link`, `alert`, `picker`) against `round_start` per day | Already collected (05-metrics, "Tools first") |
| Which channel brought them? | Web Analytics referrers (line.me, facebook.com, tiktok.com, t.co). Chat apps often send no referrer, so a large "direct" share is expected **[unverified]** | Web Analytics |
| Which *kind* of partner works? | *New:* an allowlisted `?src=` code (`osm`, `school`, `oa`, `openchat`, `condo`, `fb`, `tiktok`), read on the device and sent as a label on `view`. It counts channel types, never people | One label on `view` |
| Is it opened inside LINE or Facebook? | *New:* a coarse in-app bucket (`line`, `fb`, `tiktok`, `ig`, `other`) worked out on the device, sending only the bucket, never the user-agent string. Owner's call, since the guidelines say no user agent is stored | One label on `view` |
| How many visitors need bigger text? | *New:* the use of a "ตัวใหญ่" toggle if added (implication 3). Or a coarse bucket of the root font size (normal / large), sampled | Event, if added |
| Is paper used? | `print` by guide; views of a print-pack page, if added | Already collected / Web Analytics |
| Do people use it with no signal? | *New:* a flag on `view` when the page was served offline by the service worker, sent later in the batch | One label on `view` |
| Who reads the English? | Web Analytics' country split for paths under `/en/` (MY, GB, US, MM…), and `blob4` = `en` | Web Analytics / already collected |
| Does it follow real events? | `checklist_open` per guide per day, and `help_click` (1784, 1669), against ปภ.'s daily reports (South in Nov–Dec, North in Aug–Sep, Bangkok in Sep–Oct) | Already collected |
| Is it reaching the sharer's family? | `kit_share` and `plan_share` ÷ their `*_open` events; `tool_share` ÷ `tool_open` | Already collected |

**Caveats:**
- A picture forwarded inside LINE is copied by LINE and never touches the app's server, so the furthest reach (P1 to P4) is **invisible** in any count. Treat every share figure as a floor.
- Never combine buckets into anything that could single out a device. Sample if the volume grows.

---

## 11. Gaps: what could not be confirmed

- **No age breakdown of LINE's 56M** was found. LINE does not publish one, and the latest is from 2019 (search only).
- **No current national figure** for grandparent-only households, bedridden older people, school LINE groups, or the share of phones with enlarged text.
- **NSO's older-persons and ICT PDFs refused automated readers.** The figures come from NSO's e-book table [S9] and a Naewna column quoting the survey [S10].
- **Some figures were read only in snippets or secondary reports:** the Reuters Hat Yai detail, the 2011 flood totals, the tourist arrivals, the migrant language habits, and Cofact's figures. All are marked **[unverified]**.
- **The PM2.5 patient counts** [S34] come from an unnamed "public data institute".
- **The 2017–2018 UTCC study** [S12] is small and old. A fresh check of how older people forward today (for example, a reader test with five real aunts and uncles) would be worth more than any further desk research.

---

## Sources

"Read" is how the figure was checked: **page** means it was read on the source page; **PDF** means it was read in the downloaded PDF's text; **secondary** means it came through another outlet's report; **[unverified]** means it was seen only in a snippet or a page that refused readers.

| # | What it supports | Publisher | Date | URL | Read |
|---|---|---|---|---|---|
| S1 | Population, internet, social media, LINE 56M, Facebook, TikTok, YouTube, IG, X, Messenger, speeds | DataReportal (Kepios), *Digital 2026: Thailand* | 8 Nov 2025 (late-2025 data) | https://datareportal.com/reports/digital-2026-thailand | page |
| S2 | LINE 56M users, 12B OA conversations in 2025 (LINE's own figures) | Relevant Audience, summarising Marketing Oops | 12 Aug 2026 | https://www.relevantaudience.com/digital-marketing-en/line-thailand-business-solutions-2026/ | page (secondary) |
| S3 | OpenChat 24M monthly users; crisis-room daily views (COVID 30M, quake 3.4M, Bangkok floods 2.9M, Hat Yai 1.3M) | Relevant Audience, citing Brand Inside (11 Oct 2026) and Thumbsup (7 Oct 2026); LINE's figures at OpenChat Day | 12 Oct 2026 | https://www.relevantaudience.com/social-media-marketing/line-openchat-thailand-24-million-monthly-users-third-tab/ | page (secondary) |
| S4 | Nine government LINE OAs incl. LINE ALERT (@linealert) with ปภ., TMD, BMA | Thansettakij | 17 Dec 2024 | https://www.thansettakij.com/technology/614722 | page |
| S5 | LINE Safety Check national rehearsal, 26 Jun 2026; LINE ALERT OA | Bangkok Biznews | date unclear (about Jun 2026) | https://www.bangkokbiznews.com/tech/ai/1239786 | page |
| S6 | ETDA IUB 2022: Boomers 3 h 21 min a day, 96.00% by phone, purposes, problems; chat apps 92.21%; 46,348 respondents | ETDA (สพธอ.), *Thailand Internet User Behavior 2022* | Aug 2022 | https://www.etda.or.th/getattachment/78750426-4a58-4c36-85d3-d1c11c3db1f3/IUB-65-Final.pdf.aspx | PDF, pp. 40, 45, 57, 84 |
| S7 | Online news 88%, TikTok news 49%, 18–34 social media as main source 63%, trust 55%, share 37%, watch 43% vs read 32% | Reuters Institute, *Digital News Report 2025*: Thailand (J. & D. Kheokao) | 17 Jun 2025 | https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/thailand | page |
| S8 | Sep 2026 flood listening: 167,607 posts, 40M engagements, Facebook 70.5% of posts, TikTok 4.5% of posts and 14M engagements, 49,047 shares, 1784 most mentioned | Marketeer Online (Wisesight Zocial Eye data) | 27 Sep 2026 | https://marketeeronline.co/archives/489229 | page |
| S9 | Table 12.3: population 6+ by internet and mobile use, age group and region, 2024 (60+ 14,092.6k; 84.2% mobile; 62.8% internet) | NSO (สำนักงานสถิติแห่งชาติ), Quarterly Bulletin of Statistics 4/2568, e-book p. 145 | 2025 (2024 data) | https://www.nso.go.th/public/e-book/Bulletin-of-Statistics/bulletin-4-68/145/ | page (percentages are my calculation) |
| S10 | NSO Survey of Older Persons 2024: about 20% aged 60+, age groups, 12.9% living alone, 22.6% with spouse only | Naewna (column by นพ.พินิจ กุลละวณิชย์, quoting NSO) | 6 Sep 2026 | https://www.naewna.com/n/?p=44712 | page (secondary to NSO) |
| S11 | (not used; the NSO older-persons PDF returned 403) | NSO | 2024 | https://nso.go.th/nsoweb/storage/survey_detail/2024/20241003145311_65007.pdf | refused |
| S12 | UTCC thesis on older people's LINE messages: 33.66% greetings, 04:00–06:30, warm colours, cautious forwarding, avoid frightening content, dislike links | Thansettakij | 18 Sep 2018 (data Aug–Dec 2017) | https://www.thansettakij.com/business/319116 | page |
| S13 | 1,237 older internet users: LINE 85.7%, own smartphone 75.3%, under 1 h a day 41.8%, chronic disease 56.9%, "hard to know which to follow" | Kheokao et al., *TLA Research Journal* 12(1) | 28 Jun 2019 | https://so06.tci-thaijo.org/index.php/tla_research/article/view/155427 | page (abstract) |
| S14 | Nonthaburi study: older users forward rather than chat; easy forwarding and a credible look | AJPU journal (cited in repo KNOWLEDGE §14) | 2023 | https://so01.tci-thaijo.org/index.php/AJPU/article/download/264606/173756/1016575 | from the repo, not re-opened |
| S15 | 400 older adults in Nonthaburi: control and dependent groups; font-size adjustment; living alone | Supapong & Ngamsnit, *J. Humanities and Social Sciences, Rajapruk University* 12(1) | 29 Apr 2026 | https://so03.tci-thaijo.org/index.php/rpu/article/view/301428 | page (abstract) |
| S16 | อสม. about 1.07M; 1,061,195 registered on SMART อสม.; 974,970 reporting; 6,247,448 older adults screened | The Bangkok Insight (DHSS, กรม สบส.) | 22 Jun 2023 | https://www.thebangkokinsight.com/news/digital-economy/1125238/ | page |
| S17 | Font size and typeface for older Thai readers: 18 pt fastest, looped (serif) better understood and preferred (n = 18 older Thai readers) | Chatrangsan & Petrie, W4A 2019, DOI 10.1145/3315002.3317568 (via review summary) | 2019 | https://a11y-paradise.onrender.com/reviews/69bae1fa94e049b39eff57fb | page (summary); preference % **[unverified]** |
| S18 | AFNC Nov 2019–Mar 2025: 1.17B messages screened; submitted items: policy 47.36%, health 36.71%, disaster 4.76% | Thansettakij (DE ministry, ศูนย์ต่อต้านข่าวปลอม) | 7 Apr 2025 | https://www.thansettakij.com/technology/624364 | page |
| S19 | Top fake news 18–24 Apr 2025: simultaneous ASEAN quakes; Bangkok to get another quake in 2025 | Infoquest (DE ministry) | 26 Apr 2025 | https://www.infoquest.co.th/?p=490271 | page |
| S20 | Ang Thong: LINE groups as the primary real-time flood channel; older people without digital access still missed; อสม. as intermediaries | Thesngamthoun, Lamprom & Jotaworn (RMUTT), *Procedia of Multidisciplinary Research* 3(6) | 3 Jun 2025 | https://so09.tci-thaijo.org/index.php/PMR/article/download/6687/4117/34125 | PDF |
| S21 | Scams Nov 2023–Oct 2024: ages 50–64 and 65+ 41,901 cases, 7,769M baht; Facebook 26,804 cases | Thansettakij (DE ministry AOC) | 14 Nov 2024 | https://www.thansettakij.com/technology/611915 | page |
| S22 | Quake 28 Mar 2025 at 13:20; first SMS at 14:42; 200,000 numbers per batch | Pattaya Mail | 30 Mar 2025 | https://www.pattayamail.com/thailandnews/prime-minister-criticizes-delayed-sms-alerts-for-earthquake-urges-faster-coordination-495813 | page |
| S23 | Cell Broadcast tests; 5 provinces, more than 11M people; some phones missed it (old devices or OS); Android 11+ / iOS 18+; 5 languages | The Story Thailand (DDPM, True) | 13 May 2025 | https://www.thestorythailand.com/en/?p=153271 | page |
| S24 | Mae Sai 2024: warnings relayed via village headmen; unclear warnings; TMD language too technical; asked for a colour code | Khaosod English (Pravit Rojanaphruk) | 11 Sep 2024 | https://www.khaosodenglish.com/news/2024/09/11/not-enough-help-unclear-flood-warnings-made-said-a-mae-sai-official/ | page |
| S25 | อสม. pin vulnerable people in "พ้นภัย"; 7,255 of 7,423 subdistricts (97.74%) | Hfocus (DHSS Director-General) | 10 Aug 2026 | https://www.hfocus.org/content/2026/08/39069 | page |
| S26 | Mobile 78.38% / desktop 18.31% / tablet 3.31%; Android 73.96% / iOS 26.01%; vendors | StatCounter Global Stats | Sep 2026 | https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/thailand · https://gs.statcounter.com/os-market-share/mobile/thailand · https://gs.statcounter.com/vendor-market-share/mobile/thailand | page |
| S27 | Android versions: 16 40.65% … 11 6.15% | StatCounter Global Stats | Sep 2026 | https://gs.statcounter.com/android-version-market-share/mobile-tablet/thailand | page |
| S28 | AIS: 46.0M subscribers; postpaid : prepaid 29% : 71%; 2Q25 prepaid 32.7M; ARPU prepaid 148, postpaid 442 baht; penetration 142% | AIS slides in Singtel Investor Day 2025 (SGX filing) | 2025 (1H25 / 2Q25) | https://links.sgx.com/1.0.0/corporate-announcements/Z7RTQL1CSBGWZKC7/857396_Singtel%20Investor%20Day%202025%20-%20AIS.pdf | PDF |
| S29 | LINE in-app browser by default; `openExternalBrowser=1`; `openInAppBrowser=0` (Android) | LINE Developers docs | current | https://developers.line.biz/en/docs/line-login/using-line-url-scheme/ | page |
| S30 | Southern floods 17–26 Nov 2025: 9 provinces, 986,018 households, 2,734,318 people, 18 deaths; Songkhla 836,206 | Infoquest (DDPM) | 26 Nov 2025 | https://www.infoquest.co.th/?p=549026 | page |
| S31 | Floods on 29 Sep 2026: 29 provinces, 940,300 households, 2,602,309 people; Bangkok 50 districts, 329,000 households; 22 deaths | Thai PBS (DDPM) | 29 Sep 2026 | https://thaipbs.or.th/news/content/558837 | page; the 1 Oct peak (1,177,404 households) from a search snippet **[unverified]** |
| S32 | Hat Yai Nov 2025: Facebook video pleas, no agency yet | Thairath English | 25 Nov 2025 | https://en.thairath.co.th/news/local/2897777 | page; Reuters "thousands" via reposts **[unverified]** |
| S33 | Floods 16 Aug–16 Sep 2024: 28 provinces, 133,082 households, 42 deaths | The Standard (DDPM) | 16 Sep 2024 | https://thestandard.co/?p=984099 | page |
| S34 | PM2.5-linked patients 2021–2025 (12.37M in 2024; 10.23M to 18 Nov 2025); top provinces | Thairath English (unnamed "public data institute") | 1 Dec 2025 | https://en.thairath.co.th/scoop/infographic/2899219 | page; source institute not named |
| S35 | Mobile data price, Thailand US$0.41 per GB, rank 34 of 237 (2023 data); world US$2.59 | BestBroadbandDeals.co.uk (formerly Cable.co.uk), D. Howdle | 2023 data | https://bestbroadbanddeals.co.uk/mobiles/worldwide-data-pricing/ | page |
| S36 | Population 65,951,210 at end-2024; 462,240 births in 2024 | Khaosod English (DOPA) | 17 Jan 2025 | https://www.khaosodenglish.com/news/2025/01/17/thailands-population-drops-below-66-million-as-births-hit-75-year-low/ | page |
| S37 | 3,342,990 legal migrant workers, 2,422,004 from Cambodia, Laos, Myanmar and Vietnam | Khaosod English (Ministry of Labour notice) | 10 Jan 2025 | https://www.khaosodenglish.com/news/2025/01/10/thailand-emphasizes-feb-13-deadline-for-migrant-work-permits/ | page |
| S38 | MICS 2022: 25% of children (about 3M) live with neither parent; 71% of them with grandparents | UNICEF Thailand (NSO/UNICEF MICS 2022) | 10 Jul 2023 | https://www.unicef.org/thailand/press-releases/national-survey-shows-progress-breastfeeding-adolescent-births-and-violence-worrying | page |
| S39 | "Over 400,000 skipped-generation families, about 2%" | PMC article (2024 pilot study) | 2024 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10863458 | **[unverified]** (snippet) |
| S40 | More than 2.28M persons with disabilities (3.45%); mobility 52.26%, hearing 19.27%, visual 7.54%; hardest hit in disasters | Matichon (NHRC, กสม.) | 6 Nov 2025 | https://www.matichon.co.th/politics/news_5444124 | page; "1.37M (60.6%) aged 60+" from a DEP document snippet **[unverified]** |
| S41 | Bangkok PM2.5: more than 350 schools closed; about 100,000 of more than 10M signed up to work from home | Al Jazeera | 24 Jan 2025 | https://www.aljazeera.com/news/2025/1/24/more-than-250-schools-close-in-bangkok-as-air-pollution-soars | page |
| S42 | Chiang Mai 30 Mar 2026: 787 hotspots; 218 µg/m³ near CMU | Chiang Mai CityLife | 30 Mar 2026 | https://www.chiangmaicitylife.com/citynews/general/chiang-mai-tops-global-air-pollution-rankings-for-third-consecutive-day-as-hot-spots-surge/ | page |
| S43 | Heat deaths 2024: 63; average age 62; 51% underlying disease; 54% Northeast; 70% April | PPTV (DDC Division of Epidemiology) | 20 Mar 2025 | https://www.pptvhd36.com/health/news/6710 | page |
| S44 | 32,974,321 foreign arrivals in 2025; Malaysia 4.52M | Bernama (Ministry of Tourism and Sports) | Jan 2026 | https://www.bernama.com/en/news.php?id=2509419 | **[unverified]** (snippet) |
| S45 | 2011 floods: more than 13M affected, 66 provinces, THB 1.43T | World Bank / RTG rapid assessment (PreventionWeb) | Jan 2012 | https://www.preventionweb.net/quick/69697 | **[unverified]** (403; snippet) |
| S46 | Thairath: 60+ internet use 69.3% in 2024, 95% smartphones (no source named) | Thairath 45plus | 2025 | https://www.thairath.co.th/lifestyle/lifestyle45plus/2903927 | **[unverified]** (403; conflicts with S9) |
| S47 | Mahidol researcher: older people "often do not finish reading before passing on" | Khaosod English | 18 Jun 2019 | https://www.khaosodenglish.com/featured/2019/06/18/thai-elderly-vulnerable-to-fake-news-medicine-scams-researcher/ | **[unverified]** (403; snippet) |
| S48 | Cofact: 136,668 members, 5,335 chatbot users at year one | Thai Post | about 2021 | https://www.thaipost.net/main/detail/105148 | **[unverified]** (snippet) |
| S49 | Mae Sot: LINE introduced to 20 community flood groups | Global Water Partnership | n.d. | https://gwpo-gwp.org/stories-of-change/asia-caucasus-stories-of-change/mobilising-communities-to-manage-floods-in-north-western-thailand/ | **[unverified]** (snippet) |
| S50 | Migrant workers speak Thai better than they read it; 79% smartphone ownership (ILO 2020); Facebook central | Nation Thailand; Cultural Anthropology Fieldsights | 2024; 2021 | https://www.nationthailand.com/news/general/40038362 · https://culanth.org/fieldsights/looking-for-clues-covid-19-and-facebook-fieldwork-with-cross-border-burmese-migrants | **[unverified]** (snippets) |
| R1 | The app's own CSS sizes and fonts (Kanit; 20 rules at 12–13 px, 46 at 14–15 px; body 17 px; `px` units) | this repository, `public/css/*.css` | 20 Oct 2026 | /home/user/hazard-huntz/public/css/ | read in the repo |

# 09. With a server of our own: what changes, and what must not

> The owner, 21 Oct 2026: "Record all research findings. research beyond, by considering that in the future we will deploy in a server." This builds on [docs/08-open-data.md](08-open-data.md), which assumed the static site of today (Cloudflare Pages Free with one tiny function). Nothing here is built. The full record, with every measurement, quote and URL, is [research/server-2026-10-21.md](research/server-2026-10-21.md); the method is [APPROACH §36](APPROACH_AND_METHOD.md#36-a-server-desk-research-and-live-measurement-in-parallel-research-21-oct-2026).

How it was done: two researchers in parallel on 20 Oct 2026 (UTC; 21 Oct in Bangkok). One read laws, prices and platform documents (the PDPA's text, the Royal Gazette, AWS's price files, Cloudflare's limits, MDN's compatibility data, LINE's API reference, Apple's and WebKit's pages). The other measured, live, what a server-side collector would face: 13 sources fetched with an honest User-Agent (`baanrodmai-research/0.1 (+https://baanrodmai.autobahn.bot)`, at most 6 calls a host, no 429 met), parsed in Node 22, matched against the 7,425 subdistricts, from a cloud host in the US East (Cloudflare's `cf-ray …-IAD`). The lead re-checked the deciding claims against the saved files (the LINE regions, the PDPA's s.28 and s.37(4), the 90-day rule, Cloudflare's cron limit, AWS's Bangkok price, MDN's WebView data, the CAP counts, the Air4Thai chain).

Marks as in docs/08: ✅ live or read on the page; **[unverified]** seen only in a snippet, or inferred.

---

## Summary

1. **A server's best job is to publish files, not to know people.** It fetches on a schedule, slims, checks and publishes small files by province and by subdistrict code; phones read the files and match their own place on the phone, as docs/08 designed. Done this way, a server changes almost nothing about privacy or the law, and its load doesn't grow with visitors.
2. **What it unlocks:** the feeds a phone can't read (no CORS: TMD's warnings and quakes, FIRMS, FloodWatch); keys kept off the phone (TMD, GISTDA, FIRMS); history ("higher than yesterday"); a fixed Air4Thai (section 3); and, only if it is hosted in Thailand, a few Thai-only hosts (RID's hourly site, DWR's early-warning posts).
3. **It is small.** All 13 sources at sensible cadences: about **70 MB a day downloaded (26 GB a year)** and **53 MB a day archived gzipped (19 GB a year)**, half of it FloodWatch's full 2.6 MB file every 10 minutes; about **15 s of CPU a day**. A slim FloodWatch file (37 KB gzipped) or running on FloodWatch's own server halves it.
4. **But not 10 ms.** One collection cycle costs 84 ms (every 10 min) and 109 ms (hourly) of CPU in a fresh process; ThaiWater's rain file alone 71 ms. Workers Free and Pages Functions (10 ms) can't; **Workers Paid (US$5 a month) can** (a cron at an hourly or longer interval gets 15 minutes of CPU), and so can any small server. This corrects docs/08 §3.
5. **TMD's warning polygons are the provinces.** Of 7,425 subdistrict centres, 1,380 fell inside the 150 polygons of the warning in force and 1,395 were in its 18 listed provinces; 1,379 were in both, and every difference was a coastline. So the server should relay the **province codes** and the phone compare them with its own subdistrict's; there is no precision to gain from polygons. Precision below the province comes from sources keyed by subdistrict: HII's flash-flood report, ONWR's area warning, ThaiWater's gauges (797 of 803 carry codes that match).
6. **Nearest isn't near.** For 55 % of subdistricts the nearest Air4Thai station is more than 25 km away (median 27.9 km, worst 177.5 km). Show the distance, and use GISTDA's PM2.5 by subdistrict where no station is close.
7. **Old readings are common.** At 03:45 Bangkok time, 15 % of Air4Thai stations, 18 % of ThaiWater's level gauges and **50 % of FloodWatch's gauges** (mostly RID's) were more than 3 hours old. Every row needs its own age.
8. **Web Push can't reach most readers.** It is not supported in the in-app browsers LINE and Facebook use (MDN: Android WebView and iOS WKWebView `false`), and on an iPhone only after "Add to Home Screen". **LINE OA** reaches them but costs money (300 free messages a month) and targets only **8 Thai regions**. DDPM's **Cell Broadcast** (nationwide since 2025, no app) and **LINE ALERT** already warn; the app stays "what to do".
9. **The law starts with the first per-person record.** A push subscription, a LINE user id, a position or an IP log brings the PDPA's consent, notice with a retention period, 72-hour breach duty and, if hosted abroad, cross-border rules; fines have been issued (7 M baht in 2024; 14.5 M baht across five cases in 2025). A 2021 notification asks web services to keep traffic logs 90 days; whether it covers this app needs a Thai lawyer.
10. **Recommended:** run the collector as one more job on the owner's FloodWatch server (or Workers Paid), publishing static files to Cloudflare; no accounts, no push, no positions; a Thai host only if ONWR's or RID's Thai-only data becomes essential; a lawyer before anything per-person (section 10).

---

## 1. What docs/08 assumed, and what changes

| | Static only (docs/08) | With a server |
|---|---|---|
| Feeds without CORS (TMD CAP and quakes, FIRMS, FloodWatch) | needs "a job" somewhere | the server is the job |
| Keyed APIs (TMD, GISTDA, FIRMS) | can't (a key in the browser is public) | keys live on the server, sent in headers |
| Big files (ThaiWater rain 4.9 MB, FloodWatch 2.6 MB) | the phone downloads a province's part, or nothing | the server slims them to a few KB per province |
| Air4Thai's broken certificate chain | works only where the browser repairs it | the server adds the missing public intermediates (section 3) |
| History and trends | none | the server keeps a dated archive |
| Thai-only hosts (RID hourly, DWR) | no | only if the server is in Thailand |
| Matching to the user's place | on the phone, from lists or codes | **still on the phone**; the server publishes by code |
| Warnings to the user's phone | none | possible, at a privacy and money cost (section 6) |
| The day everyone opens it | static files, free and unlimited | the same, if the server only writes files (section 4) |

## 2. Measured: what a collector faces

One round per source, 20 Oct 2026, 20:41–20:59 UTC, from US East through a proxy (TLS handshakes to Thai hosts 0.75–1.8 s). Parse times in Node 22 on a 2.1 GHz vCPU; "cold" is a fresh process, as a cron pays.

| Source | Raw bytes | gzip on the wire | CPU cold (parse, slim, write) | Validators | 304 on a repeat? |
|---|---|---|---|---|---|
| TMD CAP list `www.tmd.go.th/api/xml/CAP` | 20,196 | 2,455 | 10.3 ms | `max-age=60` only | no (and `lastBuildDate` is the time of the call) |
| TMD CAP item (with polygons) | 123,300 | 56,802 | 24.1 ms | ETag, Last-Modified | ✅ 304 |
| TMD earthquake RSS | 7,356 | 1,246 | 7.7 ms | ETag, Last-Modified | ✅ 304 |
| Air4Thai (with the fix) | 134,417 | 16,803 | 5.1 ms | none | no |
| GISTDA PM2.5 by province | 12,449 | 3,480 | 3.9 ms | a weak ETag that changes every call | no (it recomputes its 24 h average on each request: 26 of 77 rows differed in the last digits 6 s apart) |
| ThaiWater levels | 1,393,259 | 239,986 | 21.7 ms | none | no |
| ThaiWater rain | 4,885,323 | 623,257 | 60.5 ms (+15 MB heap) | none | no |
| HII flash-flood report | 1,051 | no gzip | 4.1 ms | ETag, Last-Modified | ✅ 304 |
| FloodWatch `/api/stations` | 2,643,258 | 263,059 | 47.1 ms | `max-age=60, stale-while-revalidate=300` | no |
| NASA FIRMS SE Asia 24 h | 1,225,132 | **no gzip** | 25.9 ms | ETag, Last-Modified | ignored (200 with the same ETag) |
| USGS M4.5+ day | 16,461 | 2,592 | 6.5 ms | `max-age=60` | only within its 60 s |
| BMKG latest quake | 582 | 370 | 5.9 ms | ETag, Last-Modified | ✅ 304 |

**Per day,** at 10 minutes for warnings, quakes and FloodWatch, hourly for dust, ThaiWater and HII, 3-hourly for FIRMS, and only new CAP items: **70.4 MB downloaded, 52.9 MB archived (gzip-9)**; without FloodWatch's full file, 32.4 MB and 16.6 MB. A slim FloodWatch file (228,883 bytes, 36,950 gzipped) instead adds 5.3 MB a day. **CPU:** a 10-minute cycle 83.6 ms cold (33.4 warm), an hourly cycle 109.2 ms (69.1), FIRMS 29.6 ms; about 15 s a day.

**What it means:** any small server, or Workers Paid, carries this easily; Workers Free and Pages Functions (10 ms a run) don't. Conditional requests save little: the big files send no validators, so detect a change by hashing the normalised content (GISTDA's values rounded to 0.1), and always ask for gzip.

## 3. Air4Thai: the chain, diagnosed, and a fix only a server can apply

On 20 Oct at 20:43 UTC the server sent a Let's Encrypt leaf (`CN=air4thai.net`, valid 30 Sep–29 Dec 2026, with `air4thai.pcd.go.th` among its names) **issued by Let's Encrypt YR1**, followed by an old, unrelated Sectigo chain (Sectigo RSA DV → USERTrust RSA → AAA Certificate Services). The YR1 intermediate is missing, so verification fails ("unable to verify the first certificate"); nothing is expired and the names match. A browser that fetches missing intermediates itself (from the certificate's AIA link) may still open it, which is why Chromium sometimes did ([#86](KNOWN_ISSUES.md#86-air4thais-server-sends-the-wrong-certificate-chain)).

- **The `air4thai.com` mirror is the same server,** with the same certificate and chain and a byte-identical body; it only adds CORS `*`. It is no workaround.
- **A legitimate fix, tested:** add Let's Encrypt's own `int-yr1.pem` and the "Root YR" cross-signed by ISRG Root X1 (both from letsencrypt.org/certificates) as untrusted intermediates, and verify to the system's roots. curl and Node then verified strictly and read 173 stations. Ship all of Let's Encrypt's current intermediates, alert when verification fails, and fall back to GISTDA. Never turn verification off.
- **The real fix is the PCD's:** install the full chain on its server. A short note to the PCD would help every reader of Air4Thai.
- Whether a Cloudflare Worker can be given extra intermediates is **[unverified]**; if not, a Worker can't read Air4Thai and a server can.

## 4. How it should be built

```
 sources (TMD, PCD, GISTDA, HII, FloodWatch, NASA, USGS, BMKG)
        │  scheduled fetch: honest User-Agent, gzip, never faster than the source,
        │  429 = back off, keys in headers, raw response archived (UTC, hash)
        ▼
 collector ── checks ── slim ── by province (77 files) / by subdistrict code
        │                         each row: value, source, observed time (UTC), age
        ▼
 static files on Cloudflare (Pages or R2), long cache, no cookies
        │  e.g. /live/province/TH10.json, /live/warnings.json
        ▼
 the phone: knows its own subdistrict code (picked, or nearest centre from GPS
            on a tap, kept in localStorage); downloads its province's file;
            matches on the phone; shows source, time, "ไม่อัปเดต"; falls back
            to the manual tools. Sends nothing about where it is.
```

**Rules for the server** ([GUIDELINES rule 99](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)):

- **It writes files; it holds no accounts, no positions, no push subscriptions, and keeps no request logs beyond what the host needs.** Anything per-person waits for section 10.
- **The phone never waits for it.** Every tool works without the live files; a missing or stale file shows its age and the manual tool.
- **Province codes, not polygons,** for TMD's warnings (summary, point 5); subdistrict codes where a source has them.
- **Per-row age.** Drop rows older than about three times their cadence; say "ไม่อัปเดต" after 3 hours, as FloodWatch does.
- **Each source's time rule in code, with a saved response as a test:** GISTDA's "Z" is Bangkok time; HII's times have no offset; **the CAP RSS item `pubDate` is 7 hours early** (UTC labelled +07:00; take times from the CAP item itself); TMD's quake titles use Buddhist years; HII's flash-flood file has no time inside (record `Last-Modified`).
- **GISTDA echoes the key** inside its `links`: drop `links` before storing and never pass a raw response on.
- **Caching:** Cloudflare doesn't cache JSON by default; publish files as static assets (free and unlimited) or add a Cache Rule, send `Cache-Control: public, max-age=…, stale-while-revalidate=…`, and never `Set-Cookie`.
- **Credit every source on screen and in the file** (TMD public domain; Open-Meteo, EMSC, JRC CC BY 4.0; HDX CC BY-IGO; USGS public domain; BMKG required credit).
- **Name failures by kind:** DNS (ONWR's name server fails at some resolvers), TLS (Air4Thai), a bot check (DDPM, data.go.th: never solve it), a timeout from abroad (RID hourly, DWR), a gone domain (`ndwc.go.th` has no DNS record).

## 5. Where to run it

| Option | Price (read 20 Oct 2026) | Thai-only hosts? | CPU and limits | Who runs it | Verdict |
|---|---|---|---|---|---|
| **(a) The owner's FloodWatch server** | already paid | no (it is outside Thailand; FloodWatch reaches a few Thai-only hosts by a route of its own, which this app should not copy) | a full server; already fetches HII levels, rain and dams every 10–15 min | the owner, already | **Cheapest for phase 1:** one more small job and one more file |
| **(b) Cloudflare Workers Paid** | US$5 a month minimum; 10 M requests and 30 M CPU-ms included ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)) | no: a cron runs "on underutilized machines", with no choice of country ([cron triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)) | a cron at an interval of 1 h or more gets **15 min of CPU**, under 1 h 30 s; 10,000 subrequests; 128 MB ([limits](https://developers.cloudflare.com/workers/platform/limits/)) | no server to patch | **Good for phase 1 and 2** if FloodWatch can't; fixes doc 08's "10 ms is too little" |
| (b′) Workers Free | free | no | a cron gets **10 ms** of CPU, 50 subrequests, 5 crons | — | Too small for anything but tiny feeds |
| **(c) A small VM in Bangkok** | AWS `ap-southeast-7` (Thailand, GA 7 Jan 2025): `t4g.nano` (0.5 GiB) **US$0.0048/h ≈ $3.50 a month**, plus US$0.005/h for a public IPv4 (≈ $3.65); disk not priced. Google Cloud Bangkok `asia-southeast3` opened 21 Jan 2026 (price not checked). Azure has no Thai region. | **yes, for most:** FloodWatch found RID's hourly site, DWR's early-warning posts and ONWR's services answer only from a Thai address; BMA's servers drop even some Thai addresses, so BMA stays unknown | a full server | the owner (updates, security, backups) | Only if a Thai-only source becomes essential (e.g. ONWR's per-subdistrict warning) |
| (c′) A small VM in Singapore or Europe | AWS Singapore `t4g.nano` $0.0053/h; Frankfurt $0.0048/h; Hetzner from €5.99 a month | no | a full server | the owner | No advantage over (a) |
| (c″) A Thai VPS | e.g. US$5.94 a month for 1 GB (data-centre city not stated); NIPA Cloud sells yearly packages | probably yes [unverified] | a full server | the owner | As (c) |
| (d) A home server through Cloudflare Tunnel | Tunnel's outbound-only connection is free ([2021 announcement](https://blog.cloudflare.com/tunnel-for-everyone/)) | yes, if the home is in Thailand | whatever the machine is | the owner | Not for a service people rely on in a disaster (power and internet at home fail first) |

**Why the location of the server barely matters legally, if it keeps no personal data:** the PDPA's cross-border rule (s.28) is about personal data; a server that only fetches agency data and publishes files sends none.

## 6. Push and messages

### 6a. Web Push

| Fact | Evidence |
|---|---|
| Works in Chrome and Samsung Internet on Android, Firefox for Android | MDN browser-compat-data 8.1.6 (data of 15 Oct 2026): `PushManager` Chrome Android 42, Samsung Internet 4.0, Firefox Android 48 |
| **Doesn't work in in-app browsers** | the same data: Android WebView `false`, iOS WKWebView `false`. LINE's LIFF browser lists push and service workers as unsupported; LINE's in-app browser wasn't tested on a phone [inferred] |
| On an iPhone, only after "Add to Home Screen" (iOS 16.4+), and only when the person taps to allow | [WebKit, 16 Feb 2023](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/); MDN: "Notifications are supported in web apps saved to the home screen" |
| Every push must show a notification, or Safari revokes the permission; payloads over 4 KB are refused | Apple's "Sending web push notifications in web apps and browsers" |
| A subscription is an `endpoint` URL plus two keys; the endpoint works like a bearer token | [MDN PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription), [RFC 8030](https://datatracker.ietf.org/doc/html/rfc8030) §8.3 |
| `TTL`, `Topic` (a newer message replaces an older one with the same topic) and `Urgency` exist | RFC 8030 |

**What it means:** most readers arrive from a LINE chat, inside LINE's browser, where push can't be offered. Push reaches only people who have installed the app (Android) or added it to the Home Screen (iPhone). Measure installs first (the `install` count could come back as an anonymous event) before building a push service.

**If it is built:** store `{endpoint, keys, province}` only (no position, no subdistrict unless the person picks it), ask only on a tap, delete on HTTP 404 or 410 and on unsubscribe, state the retention period, use a `TTL` no longer than the warning and one `Topic` per warning. The record is personal data under the PDPA (section 7). Fan-out costs one encrypted request per subscriber: 100,000 subscribers is 100,000 subrequests, beyond Workers Free (50 per run) and needing Queues on Workers Paid (my arithmetic, not measured).

### 6b. LINE Official Account

| Fact | Evidence |
|---|---|
| LINE Notify ended on 31 Mar 2025; LINE points to the Messaging API | [notify-bot.line.me/closing-announce](https://notify-bot.line.me/closing-announce) |
| Thai prices: free plan **300 messages a month**; Basic 1,280 baht for 15,000 (then 0.10 baht each); Pro 1,780 baht for 35,000 (then 0.06 baht); VAT 7 % extra | [lineforbusiness.com/th, broadcast message](https://lineforbusiness.com/th/service/line-oa-features/broadcast-message) |
| A message counts once per person it reaches; only replies are free | [Messaging API pricing](https://developers.line.biz/en/docs/messaging-api/pricing/) |
| **Area targeting has 8 Thai regions only** (`th_01` Bangkok … `th_08` Western), from attributes "approximately 3 days old"; a targeted send needs a reach of at least 100 | [Messaging API reference](https://developers.line.biz/en/reference/messaging-api/), narrowcast `area` |
| Targeting a province needs the person to tap their province, and the server to store LINE user id → province (personal data) | reasoning from the reference |

**What it means:** one national message to 100,000 friends on Pro is about 1,780 + 65,000 × 0.06 = 5,680 baht plus VAT (arithmetic). A LINE account is where the audience is, but it is a budget line and a personal-data store.

### 6c. The official warning channels already exist

- **Cell Broadcast:** DDPM, the NBTC and the mobile operators tested it on 2, 7 and 13 May 2025 at building, district and province scale, in Thai and English, with no app needed ([PRD, 24 Apr 2025](https://thailand.prd.go.th/en/content/category/detail/id/52/iid/384120)); True reports it nationwide in 2025, with DDPM authorised to send ([True, 22 Sep 2025](https://www.true.th/blog/en/cell-broadcast-service/)).
- **LINE ALERT** (`@LINEALERT`): DDPM and TMD with LINE Thailand, for earthquakes, storms, floods and fires ([Thai PBS, 20 Jun 2023](https://www.thaipbs.or.th/news/content/328937)); whether it pushes by GPS is [unverified].

The app's place stays the same with a server: **what to do**, with a link to these channels; never a second siren.

## 7. The law, once the server keeps anything about a person

Nothing below applies while the server only fetches agency data and publishes files. It applies the moment the server keeps a push subscription, a LINE user id, a position, a subdistrict tied to a person, or an IP log. Read from an unofficial English translation of the PDPA (B.E. 2562, 2019) and law-firm summaries; **a Thai lawyer should confirm before anything per-person is built.**

| Rule | Where | What it asks |
|---|---|---|
| Personal data | PDPA s.6 | "any information relating to a Person, which enables the identification of such Person, whether directly or indirectly" (a home position, or an area stored with a device endpoint or LINE id, should be treated as such) |
| Applies from abroad | s.5 ¶2 | to a controller outside Thailand "offering … services to the data subjects who are in the Kingdom", paid or not |
| Consent is the default | s.19 | before or at collection; withdrawal "as easy as" giving it. Other bases: s.24(2) danger to life, body or health; s.24(5) legitimate interests |
| A notice | s.23 | purpose, **what is kept and for how long**, recipients, contact, rights |
| Only what is needed | s.22 | "limited to the extent necessary" |
| Erase when done | s.37(3) | at the end of the retention period, or when consent is withdrawn |
| Breach | s.37(4) | tell the PDPC "without delay and, where feasible, within 72 hours"; tell people too if the risk is high |
| Cross-border | s.28 (and the rules of 25 Dec 2023, in force 24 Mar 2024) | the destination must have adequate protection, or another basis (e.g. informed consent); no adequacy list yet [per DLA Piper] |
| A representative in Thailand | s.37(5), s.38 | for a controller abroad, unless no sensitive data and no "large amount" |
| A DPO | s.41 and the 2023 notification | for regular monitoring at large scale ("100,000 data subjects or more") |
| Fines | ss.82–84 | up to 1, 3 or 5 million baht by breach; the first fine (31 Jul 2024) was 7 M baht in total; on 1 Aug 2025, 14.5 M baht across five cases ([DFDL](https://www.dfdl.com/insights/legal-and-tax-updates/thailand-first-administrative-fine-for-pdpa-violation/), [GALA](https://blog.galalaw.com/post/102lr0u/thailands-pdpc-signals-tougher-enforcement-with-multi-million-baht-fines)) |

**A Thai rule that pulls the other way:** the Digital Economy ministry's 2021 notification on computer traffic data (Royal Gazette เล่ม 138 ตอนพิเศษ 188 ง, 13 Aug 2564) asks service providers, listing "ผู้ให้บริการเว็บเซอร์วิส (Web Services)" and digital services for health and lifestyle, to keep traffic data "ไม่น้อยกว่าเก้าสิบวัน" (at least 90 days), and ข้อ 8 asks for identity checks of users. Whether a free, anonymous preparedness site is in scope is **[unverified]**: ask a Thai lawyer before the server keeps logs or accounts. If the owner is established in the EU, the GDPR may apply too (Art. 3(1)).

## 8. Terms and limits that bind a server

| Source | Limit or term | Evidence |
|---|---|---|
| Open-Meteo | free: under 10,000 calls a day, 5,000 an hour, 600 a minute; **non-commercial means no subscriptions or advertising**; CC BY 4.0; limits per IP, or per Cloudflare user when called from Workers; paid plans 1 M–50 M calls a month (prices not seen) | [terms](https://open-meteo.com/en/terms), [pricing](https://open-meteo.com/en/pricing) |
| TMD | two APIs: TMDAPI (uid and key, 17 APIs, registration); the NWP API (OAuth after registering with personal details and a purpose): **60 requests a minute, 100,000 datapoints an hour**, 429 over it; no reuse licence seen | [data.tmd.go.th/api/index1.php](https://data.tmd.go.th/api/index1.php), [NWP getting started](https://data.tmd.go.th/nwpapi/doc/main/getting_start.html) |
| GISTDA | "Open Data Common"; key from its API gateway; no limits stated. **It echoes the key inside the `links` of its responses** (seen by FloodWatch, not documented): send the key in a header, drop `links` before storing, never pass a raw response to phones | [GISTDA catalogue](https://opendata.gistda.or.th/en/dataset/disasters-01) |
| NASA FIRMS | MAP_KEY: 5,000 transactions per 10 min | [map_key](https://firms.modaps.eosdis.nasa.gov/api/map_key/) |
| BMKG | credit BMKG; **60 requests a minute per IP** | [data.bmkg.go.id/gempabumi](https://data.bmkg.go.id/gempabumi/) |
| EMSC | CC BY 4.0; up to 20,000 events a request | [seismicportal.eu](https://www.seismicportal.eu/fdsn-wsevent.html) |
| USGS | US public domain; credit "U.S. Geological Survey" | [USGS copyrights](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits) |
| HDX COD-AB | CC BY-IGO; credit the Royal Thai Survey Department and OCHA (one ADM2 Thai name is wrong: ป้อมปราบศัตรูพ่าย) | [HDX](https://data.humdata.org/dataset/cod-ab-tha) |
| Nominatim | at most 1 request a second; cache results; **no autocomplete, no systematic queries**; run your own for more | [policy](https://operations.osmfoundation.org/policies/nominatim/) |
| OpenStreetMap | a published database derived from OSM (e.g. shelters or hospitals per subdistrict, over 100 features) must stay under the ODbL and be offered on request; credit "OpenStreetMap" | [ODbL FAQ](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ), [substantial](https://osmfoundation.org/wiki/License/Community_Guidelines/Substantial_-_Guideline) |
| FloodWatch | free, no key, "keep requests reasonable"; `max-age=60` | its README |
| HII (ThaiWater) | not formally public; 429 to busy addresses | FloodWatch's records |

## 9. Hosts that failed: what kind of failure

Re-tested once each on 20 Oct 2026, 20:53–20:56 UTC, with DNS look-ups.

| Host | What happened | Reading |
|---|---|---|
| `api.waterrisk.onwr.go.th` (ONWR's area warning by subdistrict) | the proxy got a 502; Google's DNS answered SERVFAIL (ONWR's name server didn't respond); Cloudflare's DNS resolved it to `ghs.googlehosted.com` | **DNS, not a geo-block.** FloodWatch's server read it in October. A server with a resolver that answers would probably reach it [unverified] |
| `data.dmr.go.th` | TLS completed, then no HTTP reply in 45 s | up, but hanging from abroad (or overloaded); the DMR's ArcGIS server answers |
| `www.disaster.go.th` | 403, Cloudflare "Just a moment…" | a bot check, not a geo-block; never solve it |
| `www.ndwc.go.th` | NXDOMAIN at Google and Cloudflare | **the domain no longer exists**; drop it |
| `data.go.th` | 403, "Access Denied" (Cloudflare) | a firewall block (country or bot score unknown) |
| `hyd-app.rid.go.th` | the tunnel closed after 8 s, no TLS reply | looks geo-filtered; FloodWatch saw it time out from abroad and open from a Thai address |
| `ews.dwr.go.th` | the tunnel closed after 13 s | looks geo-filtered; as above |

One call proves little: the same "closed after 8 s" once hit `air4thai.com`, which answered seconds later.

## 10. Recommendation

1. **Phase 0, before anything else: decide where the collector runs.**
   - **(a) One more job on FloodWatch's server (recommended):** it already fetches HII levels, rain and dams; it would add TMD's warnings and quakes, the PCD, GISTDA, FIRMS and BMKG, and publish small files with CORS for this site (or push them to this site's Cloudflare account). No new machine.
   - **(b) Cloudflare Workers Paid (US$5 a month)** with a cron and R2 or KV, if FloodWatch shouldn't carry it; check first whether a Worker can verify Air4Thai (section 3).
   - **(c) A small VM in Bangkok** (about US$7 a month with its IPv4 address on AWS) only if ONWR's per-subdistrict warning or RID's and DWR's Thai-only data become essential.
2. **Phase 1 ("บ้านเราวันนี้" by province, [ROADMAP N28](ROADMAP.md#n28-home-today-and-home-risk-proposed)) needs no per-person data:** TMD's warning by province code, dust (Air4Thai with the fix; GISTDA by subdistrict where the nearest station is far), the TMD forecast's maximum (with the TMD key), quakes, fire hotspots per province. Count the card's opens anonymously.
3. **Phase 2 adds subdistrict precision from sources keyed by code:** HII's flash-flood report, ThaiWater's gauges, FloodWatch's gauges with each row's age, and ONWR's area warning if it can be reached.
4. **Push and LINE only after measuring.** Count installs first (most readers are inside LINE's browser, where push can't work). If the owner wants alerts, link LINE ALERT and Cell Broadcast; a LINE OA of our own is a budget line (about 5,700 baht plus VAT for one message to 100,000 friends) and a personal-data store.
5. **Before the server keeps anything about a person:** a Thai lawyer on the PDPA (consent, notice, retention, breach, cross-border, a representative) and on the 2021 traffic-data notification; then a privacy notice in the app, retention in code, and a deletion path.

## 11. What needs the owner

1. **Where the collector runs:** FloodWatch's server, Workers Paid, or a Bangkok VM (section 10.1).
2. **Keys** (from docs/08): TMD (phase 1), GISTDA (phase 3); FIRMS optional.
3. **A note to the PCD** about Air4Thai's missing intermediate certificate (section 3).
4. **A Thai lawyer** before any push, account or LINE OA (section 7).
5. **A budget decision** if a LINE Official Account is ever wanted (section 6b).

## 12. Not verified

- PDPC's own pages (pdpc.or.th refused the research host); no official list says a position or an IP is personal data; the cross-border rules' official titles and any adequacy list after March 2024; the 2025 fines from law-firm reports only.
- Whether the 2021 traffic-data notification covers this app; whether the owner is established in the EU (GDPR).
- Prices: Google Cloud Bangkok, Huawei and Alibaba in Thailand, NIPA Cloud, AWS disks, Open-Meteo's commercial plans.
- Web Push inside LINE's in-app browser on a real phone (inferred from MDN's WebView data); geolocation inside LINE.
- LINE OA's verification requirements; whether LINE ALERT pushes by GPS; the exact date Cell Broadcast went fully live, from DDPM itself.
- GISTDA's terms and limits (its gateway reset the connection); whether its key echo is documented.
- Whether a Thai data-centre address passes BMA's firewall; whether ONWR answers with a working resolver; whether a Cloudflare Worker can verify Air4Thai.
- The CPU cost of encrypting Web Push messages at scale.

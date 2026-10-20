# 08. Open data for "around my home": what the app could read, and how

> Researched on 21 Oct 2026 (Bangkok) for the owner's questions "Can we display the status of PM2.5 in our app by using the GPS coordinates of user?", "ถ้าจะให้ app นี้ เป็น app ที่คนเปิดมาดูบ่อย ควรเป็นยังไง" (with the risks: ร้อนจัด แผ่นดินไหว ฝุ่น น้ำ มลภาวะ ภัยธรรมชาติ), "if you know the coordinate from user, we can tell the risk in any dimension?" and "Please learn flood2026-research how to read the current open API around the world, and research for searching our own needs." Nothing here is built yet: it is the evidence for the two features proposed in [ROADMAP N28](ROADMAP.md#n28-home-today-and-home-risk-proposed).

How it was done ([APPROACH §35](APPROACH_AND_METHOD.md#35-open-data-learn-from-the-sister-project-then-test-every-source-live-research-21-oct-2026)):

- **The sister project first.** BKK FloodWatch ([flood.autobahn.bot](https://flood.autobahn.bot), the owner's own project, private repository `flood2026-research`) has read Thai agency APIs every 10 minutes since September 2026. One researcher read how it accepts, fetches and stores a source (section 1).
- **Then every candidate live.** A second researcher made 113 calls to Thai and global sources on 20 Oct 2026, about 18:50–19:30 UTC, sending `Origin: https://baanrodmai.autobahn.bot` to see the CORS header. The lead re-checked the strongest ones on 21 Oct 2026 (about 02:00–03:00 Bangkok).
- **The host matters.** The calls went out through a cloud session's proxy outside Thailand. A source marked ⛔ refused or timed out from there, which isn't proof that it refuses a phone in Thailand.

**The full record** (every one of the 113 calls with its URL, status, size and CORS reply; each source's coverage, licence and verdict; FloodWatch's source list and pitfalls; the corrections) is [research/open-data-2026-10-21.md](research/open-data-2026-10-21.md). **What changes with a server of our own** (measured costs, the law, hosting, push) is [09-server.md](09-server.md), researched the same night; where it corrects this page, the line says so.

Status marks, as FloodWatch uses them:

- ✅ a live call answered as described (date and host above)
- ⚠️ answered with a catch
- 🔑 needs a key or an account
- ⛔ not reachable from the research host
- **[unverified]** seen only in documentation or a search snippet

---

## Summary

1. **Most of "the situation around my home" is published and machine-readable.** Official warnings, dust, rain, river levels, flash-flood potential, dam storage, earthquakes and fire hotspots all have a feed that answered on 20–21 Oct 2026 (section 2).
2. **The location can stay on the phone.** Every "today" source can be read as a national or provincial list, so the phone picks what is near it. The two that answer only to a point (GISTDA's PM2.5 by point, FloodWatch's `/api/point`) aren't needed.
3. **The place's own risk (flood history, faults, landslides) can be built ahead of time for each of Thailand's 7,425 subdistricts.** It would ship as one static file keyed by the Interior Ministry (DOPA) code, which the boundary file, GISTDA and the DMR all share (section 3).
4. **The best river source is the owner's own FloodWatch.** Its `/api/stations` returns 1,647 gauges in 77 provinces, each already judged against its own bank or BMA's thresholds: 975 normal, 146 watch, 84 warning, 31 critical and 411 unknown at 02:23 on 21 Oct. It sends no CORS header, so FloodWatch would need to publish a small file for this app, or the app would need a relay.
5. **TMD's official warnings come as a CAP feed marked "public domain".** It carries province codes, and its alert that night was "ฝนตกหนัก" (heavy rain). Like TMD's earthquake RSS and the FIRMS fire file, it sends no CORS header, so a scheduled job has to fetch it. Its polygons turned out to be the provinces' own outlines (1,379 of the 1,380 subdistricts inside them were in its 18 listed provinces, [docs/09](09-server.md#summary)), so the province codes are what to use.
6. **Nothing is fetched on a visitor's request.** A job runs every 1–3 hours and writes one small file, and phones read that file. FloodWatch's rule is "never faster than the source updates" (section 1).
7. **The free platform limits shape this.** A Pages Function gets 10 ms of CPU, too little to parse ThaiWater's 4.9 MB rain file. KV allows 1,000 writes a day, and Open-Meteo counts its free limit per IP. The research host itself was refused with "Daily API request limit exceeded". *(Corrected by [docs/09](09-server.md#2-measured-what-a-collector-faces): a full collection cycle needs 84–109 ms of CPU, so Workers Free and Pages Functions can't run it, but Workers Paid (US$5 a month, 15 min of CPU for an hourly cron) or any small server can.)*
8. **Timestamps lie in different ways.** GISTDA's "Z" is Bangkok time. HII's times have no offset and are Bangkok time. RID and DWR use Buddhist-era years. A "day" of rain runs 07:00–07:00. Every source needs its own rule, written down (section 4).
9. **Some are not usable as they stand.** WAQI's demo token answered for Bangkok with Shanghai's data. GloFAS at a river point landed on a side cell (1.25 m³/s against about 1,430 observed). The ReliefWeb, OpenAQ, Flood Hub and GFM APIs need approval or keys. DDPM's site shows a bot check. No open official tsunami-zone map was found.
10. **Five things need the owner** (section 5):
    - a GISTDA key
    - a TMD key
    - a FIRMS key (optional)
    - DMR's licence for its hazard layers
    - a decision on how FloodWatch serves this app

---

## 1. How FloodWatch reads open data, and what to reuse

Read from FloodWatch's own documents and code on 21 Oct 2026. Details that belong to that private repository (its file paths, its egress) are left out.

**How a source gets accepted.**
- **The evidence rule.** Every endpoint, field or number in the docs needs a live call (date and host), observed data, or a citation; anything else is marked as unverified. Endpoints are never invented, and sample output comes from running code.
- **Status marks for each source:** live, documentation only, partial, no machine access, key needed, and *refuted* (the endpoint doesn't exist or returns an error, so don't use it). A refuted endpoint is listed, so nobody tries it again.
- **Onboarding is five steps:**
  1. Add a row with the source's datum, units, timezone, licence and polling interval.
  2. Read the terms, or ask.
  3. Write an adapter: fetch, archive the raw response, parse, check quality, record health.
  4. Keep two or three archived responses as test fixtures, with tests for missing-value codes and timezones.
  5. Backfill history, then record the source's quirks.
- **An input is tested before it is used, and dropped when it adds nothing.** GloFAS discharge, daily gauge rain and Google Flood Hub (hit rate 0.20) were all dropped after testing.

**How fetching works.**
- **Schedule:** one worker loop, never faster than the source updates: HII levels every 10 min, rain 15 min, Open-Meteo hourly, dams every 6 h. Browsers call only FloodWatch's own API, never an agency.
- **An honest User-Agent** that names the site.
- **Requests:** a 10 s connect timeout, 3 attempts with 1–2–4 s backoff. A host that refuses connections is skipped for 10 min.
- **API keys in headers**, never in URLs, because URLs are logged and archived.
- **A 429 is an answer, not an outage.** Bulk history stops at the first one. Each source has its own failure counter, and its interval doubles after 3 failures.
- **The raw response is archived before parsing**, with its hash, URL, status and UTC fetch time.
- **Times are stored in UTC**, and local times are parsed explicitly as +07:00.
- **Quality checks flag, never delete:** missing-value codes such as 999999, levels far above the bank, readings in the future.
- **Freshness is shown:** "ไม่อัปเดต" after 3 h.
- **Probe a cheap timestamp first** and download only a finished layer, never part of one.
- **Geo-blocks are not evaded.** No browser spoofing, no proxy rotation, no bot-challenge solving.
- **Agencies' levels are never mixed.** BMA and HII differ by 0.3–0.6 m at the same place. Each gauge is compared only with its own bank, or BMA's own warning and critical levels.

**What carries over to this app, and what doesn't.**
- **Carries over:** the evidence rule and status marks, the honest User-Agent, one fetch per source cadence, UTC with each source's own timezone rule written down, "show the time and say when it's old", no evasion, never mixing agencies, and keys only on a server.
- **Doesn't fit:** a Python worker and a database on a server. This app is static on Cloudflare Pages with one Pages Function. Its version of "browsers call only our own API" is: phones read one small file this app publishes, or a source that allows it (CORS `*`), and never with the user's location (section 3).
- **One thing not to copy:** FloodWatch reaches a few Thai-only hosts by a route of its own. This app has no reason to, and every source it needs answered from outside Thailand.

## 2. The sources

### 2a. Today: "บ้านเราวันนี้"

| What | Source · provider | Endpoint (as tested) | Auth | CORS | Live result | Fits the phone? |
|---|---|---|---|---|---|---|
| **Official warnings** | TMD CAP feed | `https://www.tmd.go.th/api/xml/CAP` (Thai), `/en/api/xml/CAP`; each item links a CAP XML | none | none | ✅ 21 Oct 02:xx: one alert, "ฝนตกหนัก". The researcher saw severity Severe, urgency Immediate, expiry 2026-10-21 06:00 +07 and 18 province codes (TH-20…). `<copyright>public domain` | Via a job: province codes |
| Warning text | TMD API `WeatherWarningNews/v2` | `data.tmd.go.th/api/WeatherWarningNews/v2/?uid=…&ukey=…&format=json` | 🔑 own key (we tested the public demo key) | only `wxmap.tmd.go.th` | ✅ "ฝนตกหนักถึงหนักมาก… ฉบับที่ 8", in effect until 25 Oct, text by region | Via a job |
| **Dust and pollution** | Air4Thai (PCD) | `air4thai.pcd.go.th/services/getNewAQI_JSON.php`; mirror `air4thai.com/forweb/getAQI_JSON.php` | none | mirror `*` | ⚠️ 173 stations with PM2.5, PM10, O₃, CO, NO₂, SO₂ and coordinates; 170 of 170 colours match dust today's bands. TLS chain broken ([#86](KNOWN_ISSUES.md#86-air4thais-server-sends-the-wrong-certificate-chain); diagnosed in [docs/09 §3](09-server.md#3-air4thai-the-chain-diagnosed-and-a-fix-only-a-server-can-apply): Let's Encrypt's YR1 intermediate is missing, and the mirror is the same server): Chromium opened it on 21 Oct, the second researcher's Chromium failed on 20 Oct | List (nearest on the phone), best via a job |
| Dust by area | GISTDA PM2.5 | `pm25.gistda.or.th/rest/getPm25byProvince` (77 rows, 3.5 KB compressed); `getPm25byAmphoe?pv_idn=`; `getPm25byTambon?ap_idn=` | none | `*` | ✅ Rayong 27.6 µg/m³, 24-h average 16.0. ⚠️ its "Z" times are Bangkok time | List or a code: the phone can read it directly |
| **Heat** | TMD 7-day forecast | `data.tmd.go.th/api/WeatherForecast7Days/V2/` | 🔑 own key | only `wxmap` | ✅ 80 provinces: maximum and minimum temperature, rain %, wind. No heat index | Via a job |
| Heat (model) | Open-Meteo | `api.open-meteo.com/v1/forecast` (`apparent_temperature_max`, `wet_bulb_temperature_2m`) | none (non-commercial) | `*` | ⚠️ answered on 21 Oct 02:xx; the second researcher got 429 "Daily API request limit exceeded" from the same shared IP | Build time per province, labelled as a model |
| **Rain so far** | ThaiWater (HII) | `api-v3.thaiwater.net/api/v1/thaiwater30/public/rain_24h[?province_code=]` | none | reflects the origin | ✅ 4,786 stations by subdistrict (4.9 MB; Bangkok alone 135 stations, 142 KB). ⚠️ times are Bangkok time with no offset | Province file: the phone can read it |
| **River near home** | **FloodWatch** | `flood.autobahn.bot/api/stations` | none ("keep requests reasonable") | none | ✅ 1,647 gauges, 77 provinces, 273 KB compressed, `max-age=60`. Each gauge has `status`, `freeboard_m`, `change24`, `bank_chance24/48`, `status_basis` (`bank` or `bma_thresholds`) | Via a slim file FloodWatch could publish |
| River (raw) | ThaiWater | `…/public/waterlevel_load[?province_code=]` | none | reflects the origin | ✅ 803 stations; `situation_level` 1–5 (22 at 5 that night), `storage_percent` of the bank | Province file |
| **Flash-flood potential** | HII FEWS | `fews2.hii.or.th/model-output/data_portal/flashflood/flashflood_report.txt` | none | `*` | ✅ 510 bytes: one subdistrict that night (ต.ทางพูน, นครศรีธรรมราช, FFPI 4.61, 85.66 mm forecast for the next day) | The phone can read it directly |
| Dams | ThaiWater | `…/thaiwater30/analyst/dam` | none | reflects the origin | ✅ 169 KB: storage, inflow, release | Via a job |
| **Earthquakes** | TMD | `earthquake.tmd.go.th/feed/rss_inside.xml`, `rss_tmd.xml`; API `DailySeismicEvent/v1` (🔑) | none | none | ✅ "แผ่นดินไหว ตอนเหนือของหมู่เกาะสุมาตรา … ขนาด 5.4 … 23:29 น." | Via a job |
| Earthquakes (backup) | USGS · EMSC · BMKG | `earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`; `seismicportal.eu/fdsnws/event/1/query?…&minlat=5&maxlat=21&minlon=92&maxlon=106`; `data.bmkg.go.id/DataMKG/TEWS/autogempa.json` | none | `*` | ✅ BMKG named the same M5.4, 74 km deep, "dirasakan" (felt) | The phone can read them directly (fixed region) |
| **Fire hotspots** | NASA FIRMS public file | `firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_SouthEast_Asia_24h.csv` | none | none | ✅ 1.1 MB, 13,873 rows for Southeast Asia, 49 inside Thailand's bounding box (20 Oct) | Via a job: count per province |
| Big regional events | GDACS | `gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;DR;WF&country=Thailand&…` | none | `*` | ✅ 4 Thai events since 2025. Its terms say it is "not meant to substitute … official" warnings | A banner at most |

### 2b. The place: "บ้านเราเสี่ยงอะไร"

| What | Source | Endpoint | Auth | Live result | Licence | Use |
|---|---|---|---|---|---|---|
| **Which subdistrict** | HDX COD-AB Thailand (Royal Thai Survey Department via OCHA) | `data.humdata.org/api/3/action/package_show?id=cod-ab-tha`; xlsx 1.85 MB | none | ✅ an `admin3` sheet of 7,425 subdistricts with `adm3_pcode` (TH100101), Thai and English names, centre lat/lon | CC BY-IGO | Ship the centres; the phone finds the nearest one, then asks "is this your ตำบล?" |
| **Flood history** | GISTDA "flood-freq" | `api-gateway.gistda.or.th/api/2.0/resources/features/flood-freq?pv_idn=&ap_idn=&tb_idn=` (also a point query) | 🔑 own key | ⚠️ the researcher's one call, with the example key GISTDA's catalogue publishes, returned polygons with `freq` and `y_2011`…`y_2024`. Not repeated; we need our own key | "Open Data Common" (catalogue) | Build time, per subdistrict code |
| **Near an active fault** | DMR ArcGIS `HAZARD/T_ACTIVEFAULT` | `gisportal.dmr.go.th/arcgis/rest/services/HAZARD/T_ACTIVEFAULT/MapServer/0/query` | none | ✅ count 1,329: subdistricts within 20 km of an active fault, with `TB_CODE` | **Not stated** | Build time, once the licence is confirmed |
| Fault lines, shaking zones | DMR `ZONE_ACTIVEFAULT`, `EQ_ZONE` | same server | none | ✅ (the researcher: 640 lines, 427 zones) | Not stated | Build time |
| **Landslide-risk villages** | DMR `HAZARD/VILLLAGE_RISK` (the misspelling is the service's own) | same server | none | ✅ count 11,475 villages (mapped 2556) | Not stated | Build time: a count per subdistrict |
| Landslide susceptibility, safe points | DMR `LANDSLIDE_SUSCEPTIBILITY`, `SAFE_LANDSLIDE_AREA` | same server | none | ✅ listed. The flash-flood subdistrict classes (`FLASHFLOOD_TAMBON`, 1,084 subdistricts) are on the DMR's other server, `gis.dmr.go.th` (folder `DMR_Hazard`), not on `gisportal` | Not stated | Build time |
| Elevation | Open-Meteo elevation | `api.open-meteo.com/v1/elevation?latitude=…&longitude=…` | none | ✅ Bangkok 4 m, Phuket 6 m, Chiang Mai 313 m | CC BY 4.0, non-commercial | Build time; context only, never a flood verdict |
| River-flood hazard | JRC global flood maps | `jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/FLOODS/GlobalMaps/floodMapGL_rp100y.zip` | none | ✅ 49 MB | CC BY 4.0 | Build time, secondary to GISTDA's history |
| Tsunami zone | none open found | the DDPM and NDWC sites weren't reachable; plans cover 6 provinces, 27 districts and 108 subdistricts [unverified] | — | — | — | A flag only once an official list is found |
| Power-cut hotline | a fixed table | MEA (1130) for Bangkok, Nonthaburi and Samut Prakan; PEA (1129) everywhere else (`helplines.json`, [#82](KNOWN_ISSUES.md#82-power-bangkok-area-stands-for-meas-three-provinces)) | — | — | — | Now |

### 2c. Not usable as they stand

- **WAQI** (`api.waqi.info`, demo token): answered "Bangkok" with Shanghai's data. Its terms forbid redistributing cached data.
- **OpenAQ v3** (401, needs a key) and **ReliefWeb v2** (403, needs an approved app name; v1 returns 410).
- **Copernicus EMS:** none of its 268 activations are in Thailand.
- **PTWC** feeds cover the Pacific only. The Indian Ocean is IOTWMS [unverified].
- **Google Flood Hub API** (waitlist, 403) and **GFM** (401): FloodWatch found Flood Hub's hit rate was 0.20.
- **GloFAS through Open-Meteo:** the test point on the Chao Phraya at Nakhon Sawan (15.70, 100.12) landed on a side cell, 1.25 m³/s. The main channel was 2,237.7 m³/s, 57 % above RID's observed 1,429.
- **Open-Meteo air quality (CAMS)** read 16.6 µg/m³ in Bangkok against GISTDA's 12.0: a model, not a measurement.
- **FloodWatch `/api/point` and GISTDA `getPm25byLocation`** need the user's coordinates, so they are out.
- **⛔ from the research host:**
  - `disaster.go.th` (a bot check)
  - `ndwc.go.th` (502; on 20 Oct at 20:53 UTC the domain had no DNS record at all, [docs/09 §9](09-server.md#9-hosts-that-failed-what-kind-of-failure))
  - `data.go.th` (403)
  - ONWR waterrisk (timeout; re-tested, a DNS failure at some resolvers rather than a geo-block, and it publishes the official area warning per subdistrict: worth reaching from a server, [docs/09 §9](09-server.md#9-hosts-that-failed-what-kind-of-failure))
  - `overpass-api.de` and Geofabrik (connection reset); the Overpass mirrors at `maps.mail.ru` and `overpass.private.coffee` answered for small areas
  - NASA LHASA (502, 404)
  - `data.dmr.go.th` (timeout; the ArcGIS server answered)

## 3. How it could work without the location leaving the phone

Each source is read in one of three ways.

| Way | When | Sources |
|---|---|---|
| **1. The phone reads the source directly** | It sends CORS `*` or reflects our origin, and it is a list or takes only a code | GISTDA PM2.5 by province or district, ThaiWater by province, HII flash-flood report, USGS, EMSC, BMKG |
| **2. A scheduled job builds one small file** (every 1–3 h) | No CORS, a key, or a big file to cut down | TMD CAP and earthquake RSS, TMD forecast (key), Air4Thai (TLS), FIRMS (count per province), FloodWatch's gauges (slimmed) |
| **3. Built at release time**, one row per subdistrict | It changes rarely, or needs a point query or a key | GISTDA flood history, DMR fault, landslide and shaking layers, elevation, JRC |

**Where the job runs:**
- **(a) FloodWatch publishes it (recommended).** It is the owner's own server and already fetches HII, dams and rain every 10 minutes. One more small file with CORS for `baanrodmai.autobahn.bot` is the least new machinery.
- **(b) A Cloudflare Worker on a cron, writing to KV.** 1–3-hourly writes are far under 1,000 a day, but the 10 ms CPU limit forbids parsing the multi-megabyte files. *(Corrected: that is Workers Free; Workers Paid gives an hourly cron 15 min of CPU, [docs/09 §5](09-server.md#5-where-to-run-it).)*
- **(c) A GitHub Actions schedule**, which can be late or skipped and shares Open-Meteo's per-IP limit with other users.

**What the phone does:**
1. It finds its subdistrict: the nearest centre from GPS (asked only on a tap), or a picker (province → district → subdistrict). The picker always works, including in LINE's browser, where location access is [unverified].
2. It reads the files and shows each line with its source and its time. A line whose data is older than its cadence says so, and every line still leads to the manual tool (dust today, heat today and so on).
3. It sends nothing. The subdistrict code stays in `localStorage`. Events count only that the card was opened.

**Limits to plan around:**
- **Cloudflare free plan:** a Pages Function gets 10 ms of CPU; 100,000 requests a day; KV 1,000 writes a day.
- **Open-Meteo:** free for non-commercial use, counted per IP. FloodWatch shares 3,000 weighted calls a day across its research.
- **HII** answers bulk use with 429.
- **FloodWatch** caches `/api/stations` for 60 s.
- **The `autobahn.bot` zone:** Bot Fight Mode must stay off, because FloodWatch found it blocked LINE's and Facebook's link previews. Its JavaScript detections set the cookie in [#93](KNOWN_ISSUES.md#93-cloudflares-bot-detection-sets-a-cookie).

## 4. Pitfalls any reader of these feeds must handle

- **Times:**
  - GISTDA PM2.5's `…Z` is Bangkok time (a reply sent at 19:20 UTC said `2026-10-21T01:00Z`).
  - TMD's CAP list gives each item a `pubDate` 7 h early (UTC labelled +0700); take times from the CAP item itself ([docs/09](09-server.md#4-how-it-should-be-built)).
  - HII's times are Bangkok time with no offset.
  - FloodWatch's are true UTC.
  - TMD's earthquake RSS gives Thai time in words.
  - RID and DWR use Buddhist-era years, and RID's "24.00" is the next day's 00:00.
  - A rain "day" runs 07:00–07:00 Bangkok time.
- **Missing values:**
  - 999999 (HII)
  - −1 (Air4Thai, a pollutant not measured)
  - −99 (BMA)
  - "-" or "*" (RID)
  - −999.9 (GSMaP)
  - an error inside an HTTP 200 (HII)
  - old values repeated under new dates (several feeds)
- **Old readings:** Air4Thai had stations still showing 30 Sep and 9 Oct on 21 Oct. Use a reading only if it is within about three times its cadence.
- **Units and meanings:** Air4Thai's PM2.5 in `AQILast` is the 24-hour average its colours are judged on (the PCD, through a search result; 170 of 170 colours match). GISTDA gives both an hourly value and a 24-hour average. ThaiWater's `situation_level` runs 1–5. FloodWatch's `status` is its own heuristic against each gauge's bank, which its own pages label as such.
- **Never mix agencies:** BMA and HII levels for the same place differ by 0.3–0.6 m.
- **"No record" is not "safe":** a subdistrict that GISTDA never saw flooded may still flood, and a fault list covers only mapped faults.
- **Models are not measurements:** Open-Meteo's heat and CAMS dust, GloFAS and JRC are labelled as models, or left out.

## 5. What needs a person

1. **A GISTDA API key** (free; GISTDA's API gateway), for flood history at build time.
2. **A TMD API key** (free; `data.tmd.go.th`), for the 7-day forecast and the warning text. The public demo key is for trying it out, not for production.
3. **DMR's licence** for its ArcGIS hazard layers. Their `copyrightText` is empty and `data.dmr.go.th` timed out; ask กองธรณีวิทยาสิ่งแวดล้อม.
4. **How FloodWatch serves this app:** a slim gauges file with CORS for this origin (recommended), or a relay.
5. **Optional:**
   - a NASA FIRMS key (the public file needs none)
   - the Google Flood Hub waitlist
   - asking HII whether its API may be used this way. FloodWatch notes it is "not formally public; ask HII".
6. **Always:** credit each source on screen ("ข้อมูลจาก กรมอุตุนิยมวิทยา · 08:00 น."), and point to DDPM's Cell Broadcast and LINE ALERT for official warnings. This app is a summary with what to do, not a warning system.

## 6. Recommendation

1. **Phase 1: "บ้านเราวันนี้", a card by province.**
   - TMD CAP warnings, dust (Air4Thai, falling back to GISTDA by province), heat (TMD's maximum temperature against its 35 and 40 °C words, [unverified] until confirmed), earthquakes near Thailand, and fire hotspots per province.
   - Each line leads into the tool or guide that already exists.
   - Needs: the TMD key and a job (FloodWatch or a Worker cron).
2. **Phase 2: the river and rain near home and "บ้านพ่อแม่", up to three places.**
   - FloodWatch's gauges, ThaiWater rain by province, HII flash-flood subdistricts.
3. **Phase 3: "บ้านเราเสี่ยงอะไร", the place profile per subdistrict.**
   - GISTDA flood years, DMR fault and landslide counts, elevation, the power hotline.
   - Needs: the GISTDA key and DMR's licence.
4. **Measure before growing.** Count opens of the card per day (an event with no location). If people don't come back, stop at phase 1.

## Sources

Live calls (✅) are listed in the tables with the date. Other pages read:

| Page | URL |
|---|---|
| TMD CAP feed | https://www.tmd.go.th/api/xml/CAP |
| WMO alerting authorities: TMD | https://alertingauthority.wmo.int/authorities.php?recId=164 |
| TMD API service | https://www.tmd.go.th/media/docinfo/info_บรการขอมลอตนยมวทยาและแผนดนไหวผาน-api.pdf |
| GDACS terms | https://www.gdacs.org/About/termofuse.aspx |
| Open-Meteo terms | https://open-meteo.com/en/terms |
| GISTDA open data: flood recurrence | https://opendata.gistda.or.th/en/dataset/disasters-01 |
| DMR hazard services | https://gisportal.dmr.go.th/arcgis/rest/services/HAZARD?f=json |
| DMR active-fault dataset | https://data.dmr.go.th/en/dataset/zone-acttivefault |
| HDX COD-AB Thailand | https://data.humdata.org/dataset/cod-ab-tha |
| JRC flood maps licence | https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/FLOODS/GlobalMaps/copyright.txt |
| NASA FIRMS | https://firms.modaps.eosdis.nasa.gov/api/map_key/ |
| WAQI terms | https://aqicn.org/api/tos/ |
| ReliefWeb app names | https://apidoc.reliefweb.int/parameters#appname |
| Google Flood Hub API | https://developers.google.com/flood-forecasting |
| Cloudflare Workers pricing | https://developers.cloudflare.com/workers/platform/pricing/ |
| Cloudflare KV limits | https://developers.cloudflare.com/kv/platform/limits |
| Yahoo! 防災速報 (22M users, 3 places) | https://www.lycorp.co.jp/news/archive/Y/ja/ja20210701_A.pdf |
| LINE Notify ended 31 Mar 2025 | https://www.sanook.com/hitech/1604975/ |
| Web Push on iOS 16.4 (home screen only) | https://developer.apple.com/forums/thread/732594 |

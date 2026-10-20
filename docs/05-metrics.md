# Metrics plan

Two privacy-safe sources, with **no cookies and no personal data**:

1. **Cloudflare Web Analytics:** page views, referrers (LINE / Facebook / TikTok), devices and Core Web Vitals. Turn it on in Pages → Metrics; it is cookieless.
2. **Game events → Workers Analytics Engine.** The game batches anonymous events and sends them to `POST /api/e` (`functions/api/e.js`) when the page is hidden. Each event becomes one data point:
   - `blob1` event name, `blob2` mode, `blob3` label, `blob4` language (`th` or `en`), `double1` value
   - **no** IP, user agent, ID or location is stored

## Event dictionary

| Event | When | mode | label | value |
|---|---|---|---|---|
| `view` | Page opened | – (the linked mode for `link`) | `direct` / `challenge` / `checklist` (a `/checklist/<id>` link; any of the nine guides since v1.9.0) / `link` (a `?mode=` link such as `/?mode=dust`, v1.6.0) | – |
| `mode_select` | Mode button tapped, or ▶ in a guide | prepare / return / dust / fire / stock (v1.7.0) | `default` (the recommended mode) / `link` (the mode a `?mode=` link asked for, v1.6.0) / `other` / `guide` (▶ "เล่นเกมเรื่องนี้" in a guide, v1.9.0) | – |
| `round_start` | Round begins | mode | `daily` / `challenge` / `random` | – |
| `round_end` | Round finished (all found or time up) | mode | same as above | score 0–10 |
| `share_open` | Share or challenge button tapped | mode | `result` / `challenge` / `challenge-back` (reply after playing a friend's challenge, v1.3.0) | – |
| `share_click` | Share channel used | mode | `native` / `line` / `facebook` / `x` / `copy` / `save` / `challenge-native` / `challenge-back-native` | – |
| `challenge_open` | Opened a challenge link | mode | – | friend's score |
| `challenge_play` | Accepted the challenge | mode | – | friend's score |
| `checklist_open` | A guide opened (the checklist sheet before v1.9.0) | the guide's id: prepare / return / dust / fire / stock, and since v1.9.0 landslide / storm / quake / heat | since v1.9.0: `picker` (from the guide picker) / `alert` (the start screen's alert card) / `link` (`/checklist/<id>` or `?open=checklist-<id>`) / `result` (the result screen's 📋); empty before | – |
| `checklist_save` | A guide's picture shared or saved | the guide's id | `native` / `line` / `facebook` / `copy` / `save` | – |
| `guide_open` (v1.9.0) | The guide picker opened | – | `start` (the hub's "📋 ต้องทำอะไร เมื่อเกิดภัย") / `link` (`/?open=guide`, also the app's shortcut) / `guide` ("← เรื่องอื่น" from a guide) | – |
| `print` (v1.9.0) | "🖨️ พิมพ์เก็บไว้" tapped (never in in-app browsers, which hide it) | the guide's id, or – for the home check | `guide` / `kit` | – |
| `help_click` | Helpline tapped (tel:) | mode or –; since v1.9.1 the guide's id for a guide's ☎️ chips | the number, e.g. `1784` | – |
| `forecast_click` | "เช็กระดับน้ำ" tapped | mode or – | `start` / `result` / `help` | – |
| `lang` | Language toggled | – | `th` / `en` | – |
| `learn_open` | `/learn` opened from the featured card or the safety book (v1.4.0), or a hazard page from a guide's "📖" (v1.9.0) | – | the topic (e.g. `health`), `book`, or the guide's id (e.g. `quake`) | – |
| `kit_open` | The home check opened (v1.8.0) | – | `start` (the quick button; since v1.9.0 the hub's "🎒 เช็กของจำเป็น") / `result` (a result screen: the power cut, and since v1.8.1 Prepare and Return too) / `link` (`/?open=kit`, also from `/ready`, and since v1.8.1 `/flood`, `/learn`, `llms.txt` and the app's shortcut) / `plan` (back from the plan form) / `guide` (a guide's "เตรียมบ้านต่อ", v1.9.1) / `fridge` (the fridge tool's "🎒 เช็กของจำเป็นสำหรับไฟดับ", v1.10.0) | – |
| `kit_share` | A channel tapped in the home check's share sheet (v1.8.0) | – | `native` / `line` / `facebook` / `copy` / `save` / `copylist` ("🛒 คัดลอกรายการที่ยังขาด", v1.11.0) | the score, 0–100 (%) |
| `plan_open` | The plan form opened (v1.8.1) | – | `start` (the hub's "📝 แผนครอบครัว", v1.9.0) / `link` (`/?open=plan`, from a post, a hazard page, `/kit` or `/plan`, `/learn`, `llms.txt` or the app's shortcut) / `kit` (from the home check's list) / `guide` (a guide's "เตรียมบ้านต่อ", v1.9.1) | – |
| `plan_share` | A channel tapped in the plan card's share sheet (v1.8.0) | – | `native` / `line` / `facebook` / `copy` / `save` / `copylist` ("📋 คัดลอกแผนเป็นข้อความ", v1.11.0) | 0 |
| `tool_open` (v1.10.0) | A calculator opened: the fridge in a power cut or dust today; since v1.12.0 the mask tool and the all-tools page | `fridge` / `air` / `mask` / `tools` | `start` (the hub's tile) / `link` (`/?open=fridge` or `/?open=air`, from a post, a page, `/learn`, `llms.txt` or the app's shortcut) / `result` (after a power-cut or dust round; since v1.11.0 from the "เตรียมบ้านต่อ" row) / `guide` (a guide's "เตรียมบ้านต่อ", and since v1.11.0 the power-cut guide's "🥛 ไฟดับอยู่ตอนนี้?") | – |
| `tool_share` (v1.10.0) | A channel tapped under "📤 ส่งให้คนที่บ้าน" in a calculator | `fridge` / `air` | `native` / `line` / `copy` | – |
| `big_text` (v1.11.0) | "ก+" / "A+" tapped (larger text on the start screen and the sheets) | – | `on` / `off` (the state after the tap) | – |
| `link_click` (v1.12.0) | An agency link tapped (the all-tools page or a guide), or the emergency-alert steps opened | the guide's id, when tapped in a guide | the link's id (`linealert`, `tmdwarn`, `thaiwater`, `relief`…; `kit.json → links`) or `alerts` | – |

## The numbers you asked for

| Metric | Definition | Target (first 2 weeks) |
|---|---|---|
| **Completion rate per mode** | `round_end ÷ round_start`, per mode | ≥ 75% (it's 60 s and pauses while reading) |
| **Share clicks** | `share_click` by channel; **share rate** = `share_click ÷ round_end` | ≥ 15% of finished rounds |
| **Challenge-link plays** | `challenge_open` (arrivals) and `challenge_play` (accepted); **accept rate** = play ÷ open | ≥ 40% accept |
| **Viral loop** | `challenge_open ÷ share_click` (all channels; every shared result carries a challenge link): arrivals per share | > 1 means each share brings back more than one person |
| **Checklist downloads** | `checklist_save` by label, plus Web Analytics views of `/share/checklist-*.png` and `/checklist/*` | Track the trend |
| **Help-channel clicks** | `help_click` by number | Track; a spike in 1784 or 1669 can signal a real need |
| **Forecast-app clicks** | `forecast_click` by placement | Track (your app's own analytics show conversion) |
| **Learning signal** | Average `round_end` score per mode over time | Rising averages in the daily house mean the lessons stick |

## Querying (Analytics Engine SQL API)

1. Create an API token with **Account → Account Analytics → Read**.
2. POST SQL to the API:

```bash
ACCOUNT=your_account_id
TOKEN=your_api_token
q() { curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/analytics_engine/sql" \
        -H "Authorization: Bearer $TOKEN" --data "$1"; }
```

`SUM(_sample_interval)` counts correctly even when Cloudflare samples, or when you lower `config.analytics.sampleRate`. The queries stick to the basic SQL subset Analytics Engine documents (`SUM`, `GROUP BY`, `toStartOfInterval`). Ratios are computed from the grouped rows.

**Completion rate per mode (last 7 days)**: completion = `round_end` ÷ `round_start` for each mode
```sql
SELECT blob2 AS mode, blob1 AS event, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE timestamp > NOW() - INTERVAL '7' DAY AND blob1 IN ('round_start','round_end')
GROUP BY mode, event
```

**Share clicks by channel per day**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, blob3 AS channel, SUM(_sample_interval) AS clicks
FROM baanrodmai_events
WHERE blob1 = 'share_click' AND timestamp > NOW() - INTERVAL '14' DAY
GROUP BY day, channel ORDER BY day, clicks DESC
```

**Challenge funnel**
```sql
SELECT blob1 AS step, blob2 AS mode, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('share_open','challenge_open','challenge_play') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY step, mode
```

**Checklist saves, help numbers and forecast clicks**
```sql
SELECT blob1 AS event, blob3 AS label, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('checklist_save','help_click','forecast_click') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY event, label ORDER BY n DESC
```

**Average score per mode per day (learning signal)**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, blob2 AS mode,
       SUM(_sample_interval * double1) / SUM(_sample_interval) AS avg_score,
       SUM(_sample_interval) AS rounds
FROM baanrodmai_events
WHERE blob1 = 'round_end' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY day, mode ORDER BY day
```

**Does the recommended-mode badge work?** (`picked` is `default`, `link` or `other`)
```sql
SELECT blob2 AS mode, blob3 AS picked, SUM(_sample_interval) AS n
FROM baanrodmai_events WHERE blob1 = 'mode_select' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY mode, picked
```

## Campaign links (v1.6.0)

A `?mode=` link (`/?mode=dust`, from a post, FloodWatch or a hazard page's ▶ button) sends `view` with the label `link` and the mode. If the visitor then taps the card the link opened, `mode_select` has the label `link`; a different card is `other`, as on any visit. `round_start` doesn't say how the visitor arrived.

**From link arrivals to plays, per mode:** plays ÷ arrivals = the `mode_select` row ÷ the `view` row for the same mode.
```sql
SELECT blob2 AS mode, blob1 AS step, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob3 = 'link' AND blob1 IN ('view','mode_select') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY mode, step
```

- The query string isn't in Web Analytics ([KNOWN_ISSUES #22](KNOWN_ISSUES.md#22-web-analytics-blind-spots)), so these events are the only count of `?mode=` arrivals.
- The hazard pages (`/flood`, `/pm25`, `/fire`, `/ready`) run no script and send no events. Their visits should show as page views in Web Analytics by path once it is switched on **[unverified]**; their ▶ buttons then arrive as `link` views.
- **[unverified]** on real data; no players yet.

## The power cut (v1.7.0)

The power-cut mode sends the same events with the mode `stock`; no event was added. Two things differ from the other modes:

- **It is never the default.** Its `months` is empty, so `mode_select` for `stock` is `link` (from `/?mode=stock` or a `/ready` ▶ button) or `other` (a tap on its small card), never `default`. The badge query above shows how many find it by themselves.
- **The fridge going bad isn't an event.** A lost item shows only in the score (`round_end`'s value) and on the player's screen. The learning signal for this mode is its average `round_end` score, as for the others.

**How people reach the power cut, by week:**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '7' DAY) AS week, blob3 AS picked, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 = 'mode_select' AND blob2 = 'stock' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY week, picked ORDER BY week
```

**[unverified]** on real data; no players yet.

## The home check and the plan card (v1.8.0)

Four events, and nothing else (`plan_open` since v1.8.1): no answer, tick, household size or typed text is ever sent ([KNOWLEDGE §28.5](KNOWLEDGE.md#285-what-stays-on-the-device)). So the numbers can say how often the tools are opened and shared, and how ready the households that share are, but never what any household has or wrote.

- **Opening the plan form sends `plan_open` (v1.8.1).** A `/?open=plan` arrival is a `direct` view plus `plan_open` with the label `link`; from the home check's list it is labelled `kit`. "← แก้แผน" in the card's share sheet goes back to the form without sending it again; going from the plan to the check and back still sends one event each way. Before v1.8.1 the plan sent nothing until it was shared. A `/?open=kit` arrival is a `direct` view plus `kit_open` with the label `link`.
- **The app's shortcuts (v1.8.1) count as links.** They open `/?open=kit&source=pwa` and `/?open=plan&source=pwa`; the game doesn't read `source`, and Web Analytics doesn't record the query ([KNOWN_ISSUES #22](KNOWN_ISSUES.md#22-web-analytics-blind-spots)), so a shortcut can't be told from a shared link.
- **`result` no longer means the power cut only.** Since v1.8.1 the Prepare and Return results offer the check too, so `kit_open` from a result carries that mode (`prepare`, `return`, `stock`); split the `result` row by mode.
- **`kit_share` is sent per channel tapped,** with the score at that moment, so one household that taps LINE and then Save counts twice. Treat it as share actions, not households.
- **Scores come only from people who share.** The average of `kit_share`'s value is not how ready Thai homes are; it is how ready the households that chose to share were.

**Where the home check is opened from, and how often it is shared:**
```sql
SELECT blob1 AS event, blob3 AS label, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('kit_open','kit_share','plan_open','plan_share') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY event, label ORDER BY event, n DESC
```

**The score on shared kit cards, per week:**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '7' DAY) AS week,
       SUM(_sample_interval * double1) / SUM(_sample_interval) AS avg_pct,
       SUM(_sample_interval) AS shares
FROM baanrodmai_events
WHERE blob1 = 'kit_share' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY week ORDER BY week
```

Share rate of the check = `kit_share` ÷ `kit_open`; from the results = the `result` row of `kit_open` ÷ `round_end` for `prepare`, `return` and `stock` together (since v1.8.1; before, `stock` only). Plan cards made per plan form opened ≈ `plan_share` ÷ `plan_open`, both counted per action, not per household. **[unverified]** on real data; no players yet.

## Tools first (v1.9.0)

The start screen leads with the tools and the guides; the game is below them ([KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)). Two new events, `guide_open` and `print`, and a label on `checklist_open` that says where a guide was opened from. Nothing about a household is sent.

- **Which guides are read, and from where:** `checklist_open` by mode (the guide) and label. `alert` shows what the alert card brings; `link` what posts with `/checklist/<id>` bring; `picker` what people choose themselves.
- **Does anyone still play?** Compare `round_start` per day before and after the release (19 Oct 2026); the game card is below the first screen on small phones now ([KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones)). `mode_select` with label `guide` counts rounds started from a guide's ▶.
- **Do guides reach families?** `checklist_save` (the guide's picture shared or saved) ÷ `checklist_open`, per guide. `print` counts paper copies (only outside in-app browsers).
- **Hazard pages and `/kit`, `/plan`** run no script: their visits show in Web Analytics by path once it is on **[unverified]**; their buttons arrive as `kit_open`, `plan_open` (label `link`) or a `/checklist/<id>` view.
- **An alert's effect:** the `alert` row of `checklist_open` per day, between the day the alert was set and its end date.

**Which guides are opened, and from where (last 7 days):**
```sql
SELECT blob2 AS guide, blob3 AS opened_from, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 = 'checklist_open' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY guide, opened_from ORDER BY n DESC
```

**The tools against the game, per day:**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, blob1 AS event, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('guide_open','checklist_open','kit_open','plan_open','round_start','print') AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY day, event ORDER BY day
```

Share rate of a guide = its `checklist_save` row ÷ its `checklist_open` row (both counted per action, not per person). **[unverified]** on real data; no players yet.

## Visitor audit 2 (v1.9.1)

**No new events.** v1.9.1 added no event and changed no allowlist ([KNOWLEDGE §30](KNOWLEDGE.md#30-visitor-audit-2-v191)). What changes in the numbers:

- **New label values.** A guide's ☎️ chips send `help_click` with the guide's id as the mode (the hazard pages' ☎️ row runs no script, so it isn't counted); a guide's "เตรียมบ้านต่อ" buttons send `kit_open` or `plan_open` with the label `guide`. A page never visited, opened offline (`/quake`, `/kit`), now opens its guide or tool: `checklist_open`, `kit_open` or `plan_open` with the label `link`.
- **Fewer accidental English visitors.** Since only a chosen language is remembered (`brm:langPick`), phones that had picked up English from one look at `/en/` are Thai again, so the `en` share of events (`blob4`) may drop after 19 Oct 2026 without fewer English players.
- **Sharing returns to the game.** Sharing to LINE, Facebook or X no longer sends the game's tab away, so what happens after `share_click` (a second share, `round_start` again, `checklist_open` from the result) can rise; compare a week before and after.
- **Prepare scores.** The flood's water curve changed, so `round_end` scores for `prepare` are not strictly comparable before and after 19 Oct 2026; split any trend at that date.
- **Web Analytics** looks on since the audit (its beacon is in the live HTML), so page views by path (the hazard pages, `/kit`, `/plan`, the 404 page) should appear there; the owner confirms it ([ROADMAP L1](ROADMAP.md#l1-create-the-cloudflare-pages-project)). **[unverified]** until the dashboard shows data.

## Answers, back button and card (v1.9.2)

**No new events.** v1.9.2 added no event and changed no allowlist ([KNOWLEDGE §31](KNOWLEDGE.md#31-answers-back-button-card-and-security-v192)). What changes in the numbers:

- **Scores may drop.** Until v1.9.1 the right answer could often be picked by its length or by its odd icon ([KNOWN_ISSUES #66](KNOWN_ISSUES.md#66-the-right-answer-was-usually-the-longest-choice)). Now it can't, so `round_end` scores in every mode may fall after 19 Oct 2026. Split the learning signal (average score per mode) at that date: a lower average after it means guessing stopped working, not that people learn less.
- **Fewer abandoned rounds.** Back inside a round used to leave the site; now it pauses the round. `round_end ÷ round_start` (completion) may rise; compare a week before and after.
- **More after the result.** Back on the result now goes to the start screen instead of leaving, so `mode_select`, `guide_open`, `kit_open` and `plan_open` after a round may rise.
- **Tablets.** The app stays a phone column on a tablet, by design ([KNOWN_ISSUES #71](KNOWN_ISSUES.md#71-on-a-tablet-the-app-is-a-narrow-column)). Web Analytics' device split shows whether tablets matter; if they do, revisit it. **[unverified]** until the dashboard shows data.

## Calculators (v1.10.0)

Two new events, `tool_open` and `tool_share`, for the fridge in a power cut and dust today ([KNOWLEDGE §32.5](KNOWLEDGE.md#325-integration)). The mode is the tool (`fridge` or `air`); the label is where it was opened from, or the share channel; there is **no value**. No reading, no time without power, no freezer answer, no tick of who is at home and no count of people is ever sent; two smoke checks read every `/api/e` body for the reading (82.4) and the time to prove it. The pills calculator in the home check sends nothing of its own.

- **Which tool, from where:** `tool_open` by mode and label. `start` is the hub's tile, `link` a `/?open=fridge` or `/?open=air` link (a post, a button on `/fridge`, `/air`, `/ready`, `/storm` or `/pm25`, `/learn`, `llms.txt` or the app's shortcut), `result` the button after a power-cut or dust round, `guide` a guide's "เตรียมบ้านต่อ".
- **Is it sent to the family?** `tool_share` ÷ `tool_open`, per tool. Each channel tapped counts once (`native`, `line`, `copy`), so one person who taps LINE and then Copy counts twice: share actions, not people.
- **When people need them.** `tool_open` for `fridge` per day should rise with power cuts and storms, and `air` from December. Compare with the news of the day: these are the moments to post `/fridge` and `/air` ([04-launch-kit](04-launch-kit.md#the-fridge-and-dust-today-v1100)).
- **From the fridge to the home check.** The fridge's "🎒 เช็กของจำเป็นสำหรับไฟดับ" sends `kit_open` with the label `fridge`.
- **The new tiles' place.** On the smallest phones the two tiles are below the first screen ([KNOWN_ISSUES #77](KNOWN_ISSUES.md#77-the-fridge-and-dust-tiles-are-below-the-first-screen-on-the-smallest-phones)); if `start` is near zero while `link` works, that is expected.
- **Pages without script.** `/fridge` and `/air` show in Web Analytics by path once it is confirmed on **[unverified]**; their button arrives as `tool_open` with the label `link`.

**Which calculator is opened, from where, and how often it is shared (last 7 days):**
```sql
SELECT blob1 AS event, blob2 AS tool, blob3 AS label, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('tool_open','tool_share') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY event, tool, label ORDER BY event, tool, n DESC
```

**The calculators per day, beside the other tools:**
```sql
SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, blob1 AS event, blob2 AS mode, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('tool_open','kit_open','plan_open','guide_open') AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY day, event, mode ORDER BY day
```

Share rate of a calculator = its `tool_share` rows ÷ its `tool_open` rows, both counted per action, not per person. **[unverified]** on real data; no players yet.

## Larger text and the real readers (v1.11.0)

One new event, `big_text`, in both allowlists (`functions/api/e.js`, `public/js/analytics.js`): the label is `on` or `off`, the state after the tap; nothing else ([KNOWLEDGE §33.11](KNOWLEDGE.md#3311-the-start-screen-the-alerts-date-the-trust-line-and-ก)). The choice itself stays on the device (`brm:big`), and so does everything v1.11.0 added to the tools: the time the power came back and the breast-milk tick (`brm:fridge`); `brm:air` now keeps only the kind of number. "📋 คัดลอกแผนเป็นข้อความ" and "🛒 คัดลอกรายการที่ยังขาด" put text on the clipboard only; a tap on either counts as `plan_share` or `kit_share` with the new label `copylist`, never the text.

- **How many visitors want larger text?** `big_text` with `on`, against `view` per day. A visitor who turns it on and off counts twice, so read it as taps, not people. If it is common, that is the case for text sizes that follow the phone's own setting ([KNOWN_ISSUES #81](KNOWN_ISSUES.md#81-larger-text-ก-covers-the-start-screen-and-the-sheets-only-and-sizes-ignore-the-phones-text-setting)).
- **The power-cut guide's new button** arrives as `tool_open` · `fridge` · `guide`, together with the guides' "เตรียมบ้านต่อ"; there is no separate label for it.

```sql
SELECT blob3 AS state, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 = 'big_text' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY state
```

**[unverified]** on real data; no players yet.

**Signals for the audience research** ([07-audience §10](07-audience.md#10-signals-the-owner-could-watch-anonymous-counts-only)). Ideas, not built, unless marked "already collected". Each new one needs **the owner's decision** and an entry in both allowlists:

| Question | Signal | Status |
|---|---|---|
| Are older forwarders reaching it? | The hour of day (Bangkok time) of `view` and `checklist_open`; a peak around 04:00–07:00 and 20:00–22:00 matches the older LINE pattern | Already collected (the timestamp) |
| Do pictures travel further than links? | Per guide, `view` with the label `checklist` ÷ `checklist_save`; the share-channel split (`save`, `native` against `line`) | Already collected |
| Is the game still needed as a hook? | `checklist_open` by label against `round_start` per day | Already collected ([Tools first](#tools-first-v190)) |
| Which channel brought them? | Web Analytics referrers (line.me, facebook.com, tiktok.com, t.co); chat apps often send none, so a large "direct" share is expected **[unverified]** | Web Analytics |
| Which kind of partner works? | An allowlisted `?src=` code (`osm`, `school`, `oa`, `openchat`, `condo`, `fb`, `tiktok`), read on the device and sent as a label on `view`: channel types, never people | **New: owner decision** |
| Is it opened inside LINE or Facebook? | A coarse in-app bucket (`line`, `fb`, `tiktok`, `ig`, `other`) worked out on the device, sending only the bucket, never the user agent; the guidelines say no user agent is stored | **New: owner decision** |
| How many visitors need bigger text? | `big_text` (above) | Collected since v1.11.0 |
| Is paper used? | `print` by guide; views of a print-pack page, if one is added | Already collected / a new page |
| Do people use it with no signal? | A flag on `view` when the page was served offline by the service worker, sent later in the batch | **New: owner decision** |
| Who reads the English? | Web Analytics' country split for `/en/` paths, and `blob4` = `en` | Already collected |
| Does it follow real events? | `checklist_open` per guide per day, and `help_click` (1784, 1669), against ปภ.'s daily reports | Already collected |
| Is it reaching the sharer's family? | `kit_share` and `plan_share` ÷ their `*_open` events; `tool_share` ÷ `tool_open` | Already collected |

A picture forwarded inside LINE is copied by LINE and never reaches the server, so the furthest reach is invisible to every count: treat each share figure as a floor. Never combine buckets into anything that could single out a device.

## Masks and all tools (v1.12.0)

One new event, `link_click`, in both allowlists: a tap on an agency's own page (LINE ALERT, the TMD's warnings, ThaiWater…) from the all-tools page or a guide, with the link's id as the label (and the guide as the mode), or `alerts` when the emergency-alert steps are opened. The mask tool counts as `tool_open` and `tool_share` with mode `mask`, the all-tools page as `tool_open` with mode `tools`; what was answered (the situation, the colour, who) is never sent.

- **Do people use the links?** `link_click` by label, against `tool_open` with mode `tools`. Few taps on a link that is on the page every day means it can go; many on `relief` after a flood means the relief note is read.
- **Who comes for masks?** `tool_open` with mode `mask` by label: `air` (from dust today), `start` (the hub's seasonal tile), `tools`, `link`.

## Six more tools (v1.13.0)

No new event. Heat today, water, the tank, the emergency card, "I'm safe" and the bag count as `tool_open` with modes `hot`, `water`, `tank`, `info`, `safe` and `bag` (label: where it was opened from: `start`, `tools`, `link`, a guide, or the tool that offered it, such as `kit` or `plan`), and as `tool_share` when a text, a card or a message is sent (label: `line`, `sms`, `copy`, `native`…); the bag's print-out is `print` with label `bag`. **What is tapped, counted or typed is never sent:** not the heat level, the bottles, the tank's size, anything on the card, the place in "I'm safe" or the ticks. The smoke test reads every `/api/e` body to hold that.

- **Which tools earn their tile?** `tool_open` by mode and label `start`, against the season tiles of the day (`config.json → hub.season`). A tool opened mostly from `link` is a posting tool; one opened from nothing at all is a candidate to move down the all-tools page.
- **Is "I'm safe" used in an emergency?** `tool_share` with mode `safe` by day, against the alert dates (`config.json → alert`). A spike after a storm or a quake says the button is found when it matters.
- **Do the tools lead into each other?** `tool_open` with label `kit` (water, the bag) and `plan` (the card, "I'm safe").


## Thai and English split

- **Web Analytics** (page views) can be split by path: addresses starting with `/en/` are English, the rest are Thai. This works today.
- **Game events** carry the language as `blob4` (`th` or `en`) from 13 Oct 2026 on; earlier rows have no `blob4`. Example: `SELECT blob4 AS lang, SUM(_sample_interval) AS n FROM baanrodmai_events WHERE blob1 = 'round_end' GROUP BY lang`. This query has not been run on real data yet ([KNOWN_ISSUES #12](KNOWN_ISSUES.md#12-analytics-sql-and-the-fail-open-default-are-unchecked-on-a-live-account)).
- **Referrals** from `flood.autobahn.bot` (BKK FloodWatch) appear in Web Analytics once the owner links back ([ROADMAP L9](ROADMAP.md#l9-link-floodwatch-and-the-game-to-each-other)).

## How far a challenge travels (v1.3.0)

`share_open` with label `challenge-back` counts replies: someone opened a friend's link, played, and sent a challenge back. The ratio of `challenge-back` to `challenge_play` says how often a challenge turns into a reply. **[unverified]** on real data; no players yet.

```sql
SELECT blob3 AS label, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 = 'share_open' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY label
```

## Reporting rhythm

- **Daily during launch:** completion, share rate, the challenge funnel, help clicks. Paste the five queries into a Google Sheet, or run them from a small script.
- **Weekly:** score trends per mode and the top share channels. Use them to decide which posts to boost: if LINE dominates `share_click`, invest in LINE OpenChat partners.
- **Public "what we learned" post:** aggregate only (e.g. *"สัปดาห์นี้ 7 ใน 10 คนเลือกเรียกช่างไฟ"*). Never individual data.

## Limits and privacy

- **Free plan:** 100,000 data points written per day and 10,000 queries per day. Data is kept for 3 months.
- **Quota math:** one session sends about 4–8 events in a single request. If you approach the limit, set `config.analytics.sampleRate` to `0.5` or `0.2`; the queries above stay correct.
- **Events are anonymous counts.** There is nothing to ask consent for under PDPA. Scores, streaks, the home check's answers, the plan card's text and the calculators' answers (when the power went off and, since v1.11.0, when it came back, the freezer, the medicine and breast-milk ticks, the kind of dust number; never the dust reading; until v1.11.0 also who is at home) and the larger-text choice stay in the player's own browser (`localStorage`).
- **A new event goes into both allowlists** (`public/js/analytics.js` and `functions/api/e.js`) in the same commit; an event missing from the Function's list is dropped without an error. `plan_open` (v1.8.1) was added to both, and so were `guide_open` and `print` (v1.9.0), `tool_open` and `tool_share` (v1.10.0) and `big_text` (v1.11.0).

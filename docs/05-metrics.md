# Metrics plan

Two privacy-safe sources, with **no cookies and no personal data**:

1. **Cloudflare Web Analytics:** page views, referrers (LINE / Facebook / TikTok), devices and Core Web Vitals. Turn it on in Pages → Metrics; it is cookieless.
2. **Game events → Workers Analytics Engine.** The game batches anonymous events and sends them to `POST /api/e` (`functions/api/e.js`) when the page is hidden. Each event becomes one data point:
   - `blob1` event name, `blob2` mode, `blob3` label, `blob4` language (`th` or `en`), `double1` value
   - **no** IP, user agent, ID or location is stored

## Event dictionary

| Event | When | mode | label | value |
|---|---|---|---|---|
| `view` | Page opened | – (the linked mode for `link`) | `direct` / `challenge` / `checklist` / `link` (a `?mode=` link such as `/?mode=dust`, v1.6.0) | – |
| `mode_select` | Mode button tapped | prepare / return / dust / fire / stock (v1.7.0) | `default` (the recommended mode) / `link` (the mode a `?mode=` link asked for, v1.6.0) / `other` | – |
| `round_start` | Round begins | mode | `daily` / `challenge` / `random` | – |
| `round_end` | Round finished (all found or time up) | mode | same as above | score 0–10 |
| `share_open` | Share or challenge button tapped | mode | `result` / `challenge` / `challenge-back` (reply after playing a friend's challenge, v1.3.0) | – |
| `share_click` | Share channel used | mode | `native` / `line` / `facebook` / `x` / `copy` / `save` / `challenge-native` / `challenge-back-native` | – |
| `challenge_open` | Opened a challenge link | mode | – | friend's score |
| `challenge_play` | Accepted the challenge | mode | – | friend's score |
| `checklist_open` | Checklist sheet opened | prepare / return / dust / fire / stock | – | – |
| `checklist_save` | Checklist shared or saved | prepare / return / dust / fire / stock | `native` / `line` / `facebook` / `copy` / `save` | – |
| `help_click` | Helpline tapped (tel:) | mode or – | the number, e.g. `1784` | – |
| `forecast_click` | "เช็กระดับน้ำ" tapped | mode or – | `start` / `result` / `help` | – |
| `lang` | Language toggled | – | `th` / `en` | – |
| `learn_open` | `/learn` opened from the featured card or the safety book (v1.4.0) | – | the topic (e.g. `health`) or `book` | – |
| `kit_open` | The home check opened (v1.8.0) | – | `start` (quick button) / `result` (power-cut result) / `link` (`/?open=kit`, also from `/ready`) / `plan` (back from the plan card) | – |
| `kit_share` | A channel tapped in the home check's share sheet (v1.8.0) | – | `native` / `line` / `facebook` / `copy` / `save` | the score, 0–100 (%) |
| `plan_share` | A channel tapped in the plan card's share sheet (v1.8.0) | – | `native` / `line` / `facebook` / `copy` / `save` | 0 |

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

Three events, and nothing else: no answer, tick, household size or typed text is ever sent ([KNOWLEDGE §28.5](KNOWLEDGE.md#285-what-stays-on-the-device)). So the numbers can say how often the tools are opened and shared, and how ready the households that share are, but never what any household has or wrote.

- **Opening the plan card sends no event.** `/?open=plan` shows as a `view` labelled `direct`, and a made-and-shared card as `plan_share`. A `/?open=kit` arrival is a `direct` view plus `kit_open` with the label `link`.
- **`kit_share` is sent per channel tapped,** with the score at that moment, so one household that taps LINE and then Save counts twice. Treat it as share actions, not households.
- **Scores come only from people who share.** The average of `kit_share`'s value is not how ready Thai homes are; it is how ready the households that chose to share were.

**Where the home check is opened from, and how often it is shared:**
```sql
SELECT blob1 AS event, blob3 AS label, SUM(_sample_interval) AS n
FROM baanrodmai_events
WHERE blob1 IN ('kit_open','kit_share','plan_share') AND timestamp > NOW() - INTERVAL '7' DAY
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

Share rate of the check = `kit_share` ÷ `kit_open`; from the power cut = the `result` row of `kit_open` ÷ `round_end` for `stock`. **[unverified]** on real data; no players yet.

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
- **Events are anonymous counts.** There is nothing to ask consent for under PDPA. Scores, streaks, the home check's answers and the plan card's text stay in the player's own browser (`localStorage`).

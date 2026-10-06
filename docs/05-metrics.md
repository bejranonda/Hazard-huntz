# Metrics plan

Two privacy-safe sources, with **no cookies and no personal data**:

1. **Cloudflare Web Analytics:** page views, referrers (LINE / Facebook / TikTok), devices and Core Web Vitals. Turn it on in Pages → Metrics; it is cookieless.
2. **Game events → Workers Analytics Engine.** The game batches anonymous events and sends them to `POST /api/e` (`functions/api/e.js`) when the page is hidden. Each event becomes one data point:
   - `blob1` event name, `blob2` mode, `blob3` label, `double1` value
   - **no** IP, user agent, ID or location is stored

## Event dictionary

| Event | When | mode | label | value |
|---|---|---|---|---|
| `view` | Page opened | – | `direct` / `challenge` / `checklist` | – |
| `mode_select` | Mode button tapped | prepare / return | `default` / `other` | – |
| `round_start` | Round begins | mode | `daily` / `challenge` / `random` | – |
| `round_end` | Round finished (all found or time up) | mode | same as above | score 0–10 |
| `share_open` | Share or challenge button tapped | mode | `result` / `challenge` | – |
| `share_click` | Share channel used | mode | `native` / `line` / `facebook` / `x` / `copy` / `save` / `challenge-native` | – |
| `challenge_open` | Opened a challenge link | mode | – | friend's score |
| `challenge_play` | Accepted the challenge | mode | – | friend's score |
| `checklist_open` | Checklist sheet opened | prepare / return | – | – |
| `checklist_save` | Checklist shared or saved | prepare / return | `native` / `line` / `copy` / `save` | – |
| `help_click` | Helpline tapped (tel:) | mode or – | the number, e.g. `1784` | – |
| `forecast_click` | "เช็กระดับน้ำ" tapped | mode or – | `start` / `result` / `help` | – |
| `lang` | Language toggled | – | `th` / `en` | – |

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

**Does the recommended-mode badge work?**
```sql
SELECT blob2 AS mode, blob3 AS picked, SUM(_sample_interval) AS n
FROM baanrodmai_events WHERE blob1 = 'mode_select' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY mode, picked
```

## Reporting rhythm

- **Daily during launch:** completion, share rate, the challenge funnel, help clicks. Paste the five queries into a Google Sheet, or run them from a small script.
- **Weekly:** score trends per mode and the top share channels. Use them to decide which posts to boost: if LINE dominates `share_click`, invest in LINE OpenChat partners.
- **Public "what we learned" post:** aggregate only (e.g. *"สัปดาห์นี้ 7 ใน 10 คนเลือกเรียกช่างไฟ"*). Never individual data.

## Limits and privacy

- **Free plan:** 100,000 data points written per day and 10,000 queries per day. Data is kept for 3 months.
- **Quota math:** one session sends about 4–8 events in a single request. If you approach the limit, set `config.analytics.sampleRate` to `0.5` or `0.2`; the queries above stay correct.
- **Events are anonymous counts.** There is nothing to ask consent for under PDPA. Scores and streaks stay in the player's own browser (`localStorage`).

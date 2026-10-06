# Deploying to Cloudflare Pages (free plan)

The game is a static site in `public/`, plus one tiny Pages Function (`functions/api/e.js`) for anonymous event counts. It has no framework and needs no npm packages to deploy.

## Before you start: two placeholders

| Placeholder | Where | What to put |
|---|---|---|
| `[DOMAIN]` | `public/content/config.json → siteUrl`, **or** the `SITE_URL` environment variable (preferred) | e.g. `https://baanrodmai.pages.dev` or your custom domain. Used in share links, link-preview tags and the images. |
| `[FORECAST_APP_URL]` | `public/content/config.json → forecastAppUrl` | Your water-level forecast app. The "เช็กระดับน้ำล่วงหน้า" buttons stay hidden until this is a real `https://` link. |

Optional: `forecastStatusUrl` can point at a JSON endpoint on your forecast app returning `{"rainWarning": true}`. The start screen then recommends the right mode automatically; if the call fails or times out, `rainWarningActive` is used.

## Option A: Git integration (recommended: every content edit deploys itself)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repository **bejranonda/carrier-vector-1988** and the branch to publish (e.g. `master` after merging, or `ccr-b279fcc9-aqphnj` to preview).
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | None |
   | **Root directory (advanced)** | `baanrodmai` |
   | Build command | `node tools/build.mjs` |
   | Build output directory | `public` |
   | Environment variable | `SITE_URL` = `https://<project>.pages.dev` (or your domain) |

   - Node 22 is pinned by `baanrodmai/.node-version`.
   - `wrangler.toml` in the root directory is read automatically. It sets the output directory and the Analytics Engine binding.
   - When `wrangler.toml` is present, those fields are managed from the file, not the dashboard.
4. **Save and Deploy.**
   - The build validates every content file. A typo in a JSON file fails the build, and **the previous version stays live**.
   - It then regenerates the link-preview pages and the service worker.
5. After the first deploy, open your Pages project:
   - **Metrics → Web Analytics → Enable.** This turns on cookieless page-view analytics; the beacon is injected automatically on the next deploy.
   - **Settings → Bindings:** check that `EVENTS` (Analytics Engine, dataset `baanrodmai_events`) is listed. Add it here if you removed it from `wrangler.toml`.
   - **Settings → Runtime → Fail open.** If the free Functions quota (100,000 requests/day, shared with Workers) is ever used up, the site keeps serving and only the event counter stops.
   - **Custom domains → Set up a domain** (optional), then update `SITE_URL` and redeploy.
6. **Bake your domain into the images.** On your computer: `cd baanrodmai && npm install && SITE_URL=https://your.domain npm run images`. Commit the updated `public/og`, `public/share` and `public/icons`.
   - The images show `#บ้านรอดไหม` until you do this.
   - Rendering needs Chromium (`npx playwright install chromium`, or set `CHROME_PATH`).

From now on:

- **Editing content** (fixing a tip, switching the default mode): edit the JSON in `baanrodmai/public/content/` on GitHub and commit. Cloudflare rebuilds and publishes in about a minute.
- **Switching the recommended mode:** set `"rainWarningActive": false` in `config.json` when the water recedes, and back to `true` before the next rain wave.
- **Rollback:** Pages → Deployments → pick an earlier one → *Rollback*.

## Option B: Wrangler direct upload (from your computer)

```bash
cd baanrodmai
npm install                                   # playwright-core, only for images/tests
npx wrangler@latest login
npx wrangler@latest pages project create baanrodmai --production-branch=main
SITE_URL=https://baanrodmai.pages.dev node tools/build.mjs
npx wrangler@latest pages deploy public --project-name=baanrodmai
```

- Run the deploy **from the `baanrodmai/` folder**. Wrangler uploads `functions/` only when it is next to where the command runs, and reads `wrangler.toml` from there.
- Dashboard drag-and-drop uploads do **not** include Functions. Use Wrangler or Git.
- A project created with direct upload cannot later be switched to Git integration, and vice versa. Pick one.
- `npm run deploy` runs the build and the deploy in one go.

## Local preview

```bash
cd baanrodmai
node tools/build.mjs
npx wrangler@latest pages dev public    # serves the site + /api/e on http://localhost:8788
npm test                                # game-rule unit tests (no browser)
npm run smoke                           # browser test in headless Chromium
```

Any static server also works (`npx serve public`), apart from the `/c/p8` pretty URLs, which Pages resolves to `/c/p8.html`.

## How the free plan is used

| Piece | Free-plan cost |
|---|---|
| Pages, images, link-preview pages `/c/*` and `/checklist/*` | **Static: unlimited and free.** `_routes.json` keeps every path except `/api/*` from invoking a Function. |
| `/api/e` event counter | 1 Function request per page session (events are batched and sent with `sendBeacon` when the page is hidden). Shares the 100,000 requests/day quota. |
| Workers Analytics Engine | 100,000 data points/day written free. Each event is one data point. |
| Cloudflare Web Analytics | Free, cookieless. |

If the game goes very viral, lower `config.json → analytics.sampleRate` (e.g. `0.2` records 20% of sessions). The SQL in [05-metrics.md](05-metrics.md) multiplies counts back up via `_sample_interval`. The game itself never depends on the Function.

## Why the link-preview images are pre-rendered

You asked for a dynamic OG image rendered by a Pages Function. I built the same visible result in a way that suits the free plan better:

- Every challenge link has its own **static** HTML page (`/c/p0` … `/c/p10`, `/c/r0` … `/c/r10`) with Open Graph tags.
- Each page points at a matching **pre-rendered** 1200×630 PNG drawn by the game's own card renderer.
- Crawlers from LINE, Facebook and X never run JavaScript, and they get the score in the preview either way.
- The `?h=20261007` house key stays in the shared URL, and the pages omit `og:url`, so clicking the preview opens the friend's exact house.

The reasons:

1. **CPU limit.** Workers Free allows **10 ms CPU** per request. Rendering a PNG with Thai text (satori/resvg) takes far longer, and the needed WASM is several MB.
2. **Quota.** A viral challenge link served by a Function counts against the **100,000/day** Functions quota. Past that it would fail (or, with fail-open, lose its preview). Static pages are unlimited.
3. **The set is tiny and fixed:** 2 modes × 11 scores, plus default and checklists. Pre-rendering costs nothing and the previews are cached and instant.

If you later move to Workers Paid and want per-player text (for example a nickname, which would need a privacy review), a Function can rewrite the same tags with `HTMLRewriter`.

## Refreshing link previews after a change

- **Facebook** caches previews per URL: paste the link into the [Sharing Debugger](https://developers.facebook.com/tools/debug/) and press *Scrape Again*.
- **LINE** caches per URL too, with no official refresh tool. Share a fresh variant (e.g. add `&v=2`) to force a new preview.
- **X** uses the same Open Graph tags (`twitter:card = summary_large_image`).

## What runs where

```
Browser ──GET──▶ Cloudflare Pages static assets (HTML/CSS/JS/JSON/SVG/PNG) ── free, cached at the edge
   │                └─ _headers: long cache for fonts/images, no-cache for content + sw.js
   ├── service worker (sw.js): offline after the first visit (Android browsers, desktop, iOS Safari;
   │                             not inside iOS in-app browsers, where it simply works online)
   └──POST /api/e (sendBeacon) ──▶ Pages Function ──▶ Workers Analytics Engine (EVENTS)
```

# Deploying to Cloudflare Pages (free plan)

The game is a static site in `public/`, plus one tiny Pages Function (`functions/api/e.js`) for anonymous event counts. It has no framework and needs no npm packages to deploy.

## Before you start: two placeholders

| Placeholder | Where | What to put |
|---|---|---|
| `[DOMAIN]` | `public/content/config.json → siteUrl` (**set to `https://baanrodmai.autobahn.bot`**), or the `SITE_URL` environment variable when the project is *not* managed by `wrangler.toml` | e.g. `https://baanrodmai.pages.dev` or your custom domain. Used in share links, link-preview tags, the SEO files and the images. |
| `[FORECAST_APP_URL]` | `public/content/config.json → forecastAppUrl` (**set to `https://flood.autobahn.bot/`**, BKK FloodWatch) | Your water-level app. The "เช็กระดับน้ำล่วงหน้า" buttons stay hidden until this is a real `https://` link. |

Optional: `forecastStatusUrl` can point at a JSON endpoint on your forecast app returning `{"rainWarning": true}`. The start screen then recommends the right mode automatically; if the call fails or times out, `rainWarningActive` is used until its end date `rainWarningUntil`.

## The live setup

| | |
|---|---|
| Address | `https://baanrodmai.autobahn.bot`. DNS: a proxied `CNAME baanrodmai → baanrodmai.pages.dev` in the `autobahn.bot` zone. |
| Pages project | `baanrodmai`, Git integration with `bejranonda/Hazard-huntz`, production branch `main`, previews for every branch |
| Build | `node tools/build.mjs` → `public`, root directory empty |
| Site address | `config.json → siteUrl`. Because `wrangler.toml` manages the project, a `SITE_URL` set in the dashboard or API is cleared on the next build, so the address lives in `config.json`. |
| Bindings | `EVENTS` → `baanrodmai_events` (from `wrangler.toml`; needs Analytics Engine enabled once on the account), fail open |
| API token (`.env`, never committed) | Needs **Account → Cloudflare Pages → Edit** and **Zone → DNS → Edit** on `autobahn.bot`. Add **Account Analytics → Read** for the metrics SQL. |
| Account prerequisite | **Analytics Engine enabled once**: Workers → Analytics Engine → *Create dataset* `baanrodmai_events`, binding `EVENTS`. Without it the build and file upload succeed but the deploy fails with "You need to enable Analytics Engine" and the site stays down (522). |
| Not yet done | Search-console submission. Web Analytics looks on: on 19 Oct 2026 the live HTML carried its beacon (`static.cloudflareinsights.com`), with no cookie; the owner confirms it in the dashboard. Pushes to `main` deploy by themselves (verified 10 Oct 2026) |
| Zone settings seen on 19 Oct 2026 | Every page also loads `/cdn-cgi/challenge-platform/scripts/jsd` (about 12 KB), the zone's "JavaScript detections" (Security → Bots). It isn't the app's; the owner may switch it off if nothing needs it |

Search and AI search:

- `node tools/build.mjs` writes `/learn` (every lesson as plain HTML), `/robots.txt`, `/sitemap.xml` and `/llms.txt`, plus the canonical link and JSON-LD in each page's OG block.
- Since v1.6.0 it also writes one page per hazard: `public/flood.html`, `public/pm25.html`, `public/fire.html` and, since v1.7.0, `public/ready.html`, each with its twin under `public/en/`. Pages serves them as `/flood`, `/pm25`, `/fire`, `/ready` and `/en/…`, and redirects `/pm25.html` to `/pm25` with a 308. They are generated (never edit them by hand), listed in the sitemap, and their names come from `config.json → hazards`; never change a name once it is published.
- Since v1.6.1 it writes `public/posts.html` (`/posts`): the carousel images with their captions, for whoever posts for the game (four sets since v1.7.0: `flood`, `pm25`, `fire`, `ready`). It has `noindex` in the page and in `_headers`, and isn't in the sitemap. The images themselves come from `npm run images` and are committed, like the link previews; the build warns when they are older than the lesson text.
- Since v1.9.1 it writes `public/404.html` (Thai and English, `noindex`). With a top-level `404.html`, Pages answers unknown addresses with it and status 404; without one it served the start screen with a 200 for any address. Check after a deploy: `curl -s -o /dev/null -w '%{http_code}' https://baanrodmai.autobahn.bot/no-such-page` prints 404. The `/checklist/<id>` pages point their canonical at the hazard page (`/quake`) since v1.9.1.
- `_headers` adds `X-Robots-Tag: noindex` on `*.pages.dev`, so only the custom domain is indexed.
- Since v1.9.2 `_headers` also sends security headers on every path: `Content-Security-Policy: frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` and `X-Frame-Options: SAMEORIGIN`, next to `nosniff`, `Referrer-Policy` and `Permissions-Policy`. There is no `script-src`: Cloudflare injects the Web Analytics beacon and the zone's JavaScript detections as inline scripts, and a script policy would block them. HSTS comes from Cloudflare. After a deploy that touches `_headers`, check with `curl -sI https://baanrodmai.autobahn.bot/` ([KNOWLEDGE §31.5](KNOWLEDGE.md#315-security-headers)).
- After the first deploy, submit `https://baanrodmai.autobahn.bot/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Bing's index also feeds Copilot and other AI search tools.
- Leave Cloudflare's "Block AI bots" and managed robots.txt **off** for this hostname. The game is public safety content and should be readable by AI assistants.

The home check and the plan card (v1.8.0):

- **No new pages, no new settings.** `/?open=kit` and `/?open=plan` (and `/en/?open=…`) are the app shell with a query, like `?mode=` links: Pages serves `index.html`, the game opens the sheet, and the link preview is the main game's. They are not in the sitemap. `/ready` and `/en/ready` link both (`config.json → hazards.outage.tools`), and since v1.8.1 so do `/flood` and `/en/flood` (`hazards.flood.tools`), `/learn`, `/en/learn` and `llms.txt`.
- **New static files:** `public/content/kit.json`, `public/js/kit.js` and `public/js/kitplan.js`, served and cached like the rest of `/content/` and `/js/`, and precached by the service worker (44 files).
- **The Function only counts.** `/api/e` accepts four more event names (`kit_open`, `kit_share`, `plan_share` and, since v1.8.1, `plan_open`); the allowlist in `functions/api/e.js` must match `public/js/analytics.js`, so a new event goes into both in the same commit. No answer or typed text is ever sent, so nothing about a household is stored on Cloudflare.
- **App shortcuts (v1.8.1).** Since v1.9.0 there are three: "ต้องทำอะไร เมื่อเกิดภัย" → `/?open=guide&source=pwa` sits between the two below. `public/manifest.webmanifest` lists two `shortcuts`, shown on a long-press of the installed app's icon where the browser supports them: "บ้านเราพร้อมแค่ไหน?" → `/?open=kit&source=pwa` and "แผนบ้านรอดของบ้านเรา" → `/?open=plan&source=pwa`, each with `/icons/icon-192.png`. They are static: nothing to set in Cloudflare. The service worker fetches the manifest network-first, like the code ([KNOWLEDGE §7](KNOWLEDGE.md#7-offline-the-service-worker)), but a phone may keep an installed app's old shortcuts until the browser updates the installed app, which it does on its own schedule **[unverified]**. Not yet tried on a real phone ([ROADMAP L6](ROADMAP.md#l6-real-phone-test-matrix)).

Tools first and the guides (v1.9.0):

- **New pages, all static and generated** (never edit them by hand): the guide-only hazard pages `public/landslide.html`, `storm.html`, `quake.html` and `heat.html` (served as `/landslide`, `/storm`, `/quake`, `/heat`, with `/en/…` twins), `public/kit.html` and `public/plan.html` (`/kit`, `/plan`, `/en/…`), and `public/checklist/{landslide,storm,quake,heat}.html` with their English twins. Pages serves them like the other pages. The sitemap lists 24 addresses. `kit` and `plan` are reserved names, so no hazard slug can take them; the new slugs, like the old ones, never change once published.
- **New images, committed** (from `npm run images`): `og/checklist-{landslide,storm,quake,heat}.png`, `og/en/checklist-…`, `share/checklist-{landslide,storm,quake,heat}.png`, `og/kit.png`, `og/plan.png` and their `og/en/` twins; `og/default.png` and `og/en/default.png` were re-rendered with the new default texts. To re-render only some, pass comma-separated paths: `SITE_URL=https://baanrodmai.autobahn.bot npm run images -- --only og/kit,og/en/kit,og/plan,og/en/plan`.
- **The alert switch is a content edit, like the rain warning.** In `public/content/config.json`, set `"alert": { "guide": "quake", "until": "YYYY-MM-DD" }` (a guide id from `guides`, and the last day it should show, a Bangkok date, that day included) and commit; Cloudflare rebuilds and the card is live in about a minute or two. The build stops if the guide isn't one of the nine or the date isn't real (the previous version stays live), and its `start` line ends with "· alert quake until …". After the date the card disappears by itself, and every build warns until you set `"alert": { "guide": null, "until": null }` or a new date. The full routine is in [04-launch-kit](04-launch-kit.md#when-something-happens-the-5-minute-playbook).
- **The Function** accepts two more events, `guide_open` and `print` (both allowlists, `functions/api/e.js` and `public/js/analytics.js`).
- **The start screen's Thai text** in `public/index.html` is now written by the build from `strings.json`, so `index.html` changes in the same commit as a string edit; that is expected.

The calculators (v1.10.0):

- **New pages, static and generated** (never edit them by hand): `public/fridge.html` and `public/air.html` (served as `/fridge` and `/air`) and their `/en/` twins. The sitemap lists 28 addresses. `fridge` and `air` are reserved names, so no hazard slug can take them.
- **New images, committed** (from `npm run images`): `og/fridge.png`, `og/air.png` and their `og/en/` twins. To re-render only these: `SITE_URL=https://baanrodmai.autobahn.bot npm run images -- --only og/fridge,og/en/fridge,og/air,og/en/air`.
- **No new static files to serve:** the calculators live in `kit.js`, `kitplan.js` and `kit.json`, which were already precached (still 44 files), so they work offline after one visit.
- **The Function** accepts two more events, `tool_open` and `tool_share` (both allowlists, `functions/api/e.js` and `public/js/analytics.js`). Neither carries a value; no reading, time or answer reaches Cloudflare.
- **Two more app shortcuts** in `public/manifest.webmanifest` (five in all): the fridge → `/?open=fridge&source=pwa` and dust today → `/?open=air&source=pwa`. Static, nothing to set in Cloudflare; an installed app may keep its old shortcuts until the browser updates it **[unverified]**.

## Option A: Git integration (recommended: every content edit deploys itself)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repository **bejranonda/Hazard-huntz**, with `main` as the production branch. Other branches get their own preview URLs.
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | None |
   | Root directory (advanced) | *(leave empty: the game is at the repository root)* |
   | Build command | `node tools/build.mjs` |
   | Build output directory | `public` |
   | Environment variable | `SITE_URL` = `https://<project>.pages.dev` (or your domain) |

   - Node 22 is pinned by `.node-version`.
   - `wrangler.toml` at the repository root is read automatically. It sets the output directory and the Analytics Engine binding.
   - When `wrangler.toml` is present, those fields are managed from the file, not the dashboard.
4. **Save and Deploy.**
   - The build validates every content file. A typo in a JSON file fails the build, and **the previous version stays live**.
   - It then regenerates the link-preview pages and the service worker.
5. After the first deploy, open your Pages project:
   - **Metrics → Web Analytics → Enable.** This turns on cookieless page-view analytics; the beacon is injected automatically on the next deploy.
   - **Settings → Bindings:** check that `EVENTS` (Analytics Engine, dataset `baanrodmai_events`) is listed. Add it here if you removed it from `wrangler.toml`.
   - **Settings → Runtime → Fail open.** If the free Functions quota (100,000 requests/day, shared with Workers) is ever used up, the site keeps serving and only the event counter stops.
   - **Custom domains → Set up a domain** (optional), then update `SITE_URL` and redeploy.
6. **Bake your domain into the images.** On your computer: `npm install && SITE_URL=https://your.domain npm run images`. Commit the updated `public/og`, `public/share` and `public/icons`.
   - The images show `#บ้านรอดไหม` until you do this.
   - Rendering needs Chromium (`npx playwright@1.63.0 install chromium`, matching `package-lock.json`, or set `CHROME_PATH`).

From now on:

- **Editing content** (fixing a tip, switching the default mode): edit the JSON in `public/content/` on GitHub and commit. Cloudflare rebuilds and publishes in about a minute.
- **Putting a guide on the start screen (v1.9.0):** set `"alert": { "guide": "<id>", "until": "YYYY-MM-DD" }` (see above), and clear it after.
- **Switching the recommended mode:** set `"rainWarningActive": true` with an end date, `"rainWarningUntil": "YYYY-MM-DD"` (a Bangkok date, that day included), before a rain wave. It turns itself off after that day; set it to `false` earlier if the water recedes sooner. The same goes for `featuredTopic` and `featuredTopicUntil`. The build's `start` line shows what the start screen recommends today, and it warns about a switch with no end date.
- **Rollback:** Pages → Deployments → pick an earlier one → *Rollback*.

## Option B: Wrangler direct upload (from your computer)

```bash
npm install                                   # playwright-core, only for images/tests
npx wrangler@latest login
npx wrangler@latest pages project create baanrodmai --production-branch=main
SITE_URL=https://baanrodmai.pages.dev node tools/build.mjs
npx wrangler@latest pages deploy public --project-name=baanrodmai
```

- Run the deploy **from the repository root**. Wrangler uploads `functions/` only when it is next to where the command runs, and reads `wrangler.toml` from there.
- Dashboard drag-and-drop uploads do **not** include Functions. Use Wrangler or Git.
- A project created with direct upload cannot later be switched to Git integration, and vice versa. Pick one.
- `npm run deploy` runs the build and the deploy in one go.

## Local preview

```bash
node tools/build.mjs
npx wrangler@latest pages dev public    # serves the site + /api/e on http://localhost:8788
npm test                                # game-rule unit tests (no browser)
npm run smoke                           # browser test in headless Chromium
```

Any static server also works (`npx serve public`), apart from the `/c/p8` pretty URLs, which Pages resolves to `/c/p8.html`.

## How the free plan is used

| Piece | Free-plan cost |
|---|---|
| Pages, images, link-preview pages `/c/*` and `/checklist/*`, `/learn`, the hazard pages, `/kit`, `/plan`, `/fridge`, `/air` and `/posts`, and their English twins under `/en/` | **Static: unlimited and free.** `_routes.json` keeps every path except `/api/*` from invoking a Function. |
| `/api/e` event counter | 1 Function request per page session (events are batched and sent with `sendBeacon` when the page is hidden). Shares the 100,000 requests/day quota. |
| Workers Analytics Engine | 100,000 data points/day written free. Each event is one data point. |
| Cloudflare Web Analytics | Free, cookieless. |

If the game goes very viral, lower `config.json → analytics.sampleRate` (e.g. `0.2` records 20% of sessions). The SQL in [05-metrics.md](05-metrics.md) multiplies counts back up via `_sample_interval`. The game itself never depends on the Function.

## Why the link-preview images are pre-rendered

You asked for a dynamic OG image rendered by a Pages Function. I built the same visible result in a way that suits the free plan better:

- Every challenge link has its own **static** HTML page (`/c/p0` … `/c/p10`, `/c/r0` … `/c/r10`, since v1.5.0 `/c/d…` and `/c/f…`, and since v1.7.0 `/c/s0` … `/c/s10`) with Open Graph tags. Each checklist has one too (`/checklist/prepare` … `/checklist/stock`, and since v1.9.0 every guide: `/checklist/landslide`, `storm`, `quake`, `heat`).
- Each page points at a matching **pre-rendered** 1200×630 PNG drawn by the game's own card renderer.
- Crawlers from LINE, Facebook and X never run JavaScript, and they get the score in the preview either way.
- The `?h=20261007` house key stays in the shared URL, and the pages omit `og:url`, so clicking the preview opens the friend's exact house.

The reasons:

1. **CPU limit.** Workers Free allows **10 ms CPU** per request. Rendering a PNG with Thai text (satori/resvg) takes far longer, and the needed WASM is several MB.
2. **Quota.** A viral challenge link served by a Function counts against the **100,000/day** Functions quota. Past that it would fail (or, with fail-open, lose its preview). Static pages are unlimited.
3. **The set is small and fixed:** 5 modes × 11 scores, plus the default and five checklists, in two languages: 122 images (61 Thai, 61 English) and 121 generated pages (v1.7.0). v1.9.0 added four guides' previews and `/kit` and `/plan`'s, in both languages (12 more previews), and 8 checklist pages: 129 generated pages. v1.10.0 added `/fridge` and `/air`'s previews in both languages (4 more). Pre-rendering costs nothing and the previews are cached and instant.

If you later move to Workers Paid and want per-player text (for example a nickname, which would need a privacy review), a Function can rewrite the same tags with `HTMLRewriter`.

## Refreshing link previews after a change

- **Facebook** caches previews per URL: paste the link into the [Sharing Debugger](https://developers.facebook.com/tools/debug/) and press *Scrape Again*.
- **LINE** caches per URL too, with no official refresh tool. Share a fresh variant (e.g. add `&v=2`) to force a new preview.
- **X** uses the same Open Graph tags (`twitter:card = summary_large_image`).

## What runs where

```
Browser ──GET──▶ Cloudflare Pages static assets (HTML/CSS/JS/JSON/SVG/PNG) ── free, cached at the edge
   │                └─ _headers: long cache for fonts/images, no-cache for content + sw.js, security headers (v1.9.2)
   ├── service worker (sw.js): offline after the first visit (Android browsers, desktop, iOS Safari;
   │                             not inside iOS in-app browsers, where it simply works online)
   └──POST /api/e (sendBeacon) ──▶ Pages Function ──▶ Workers Analytics Engine (EVENTS)
```

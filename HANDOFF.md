# Handoff: บ้านรอดไหม? (Baan Rod Mai?)

| | |
|---|---|
| **Repository** | [bejranonda/Hazard-huntz](https://github.com/bejranonda/Hazard-huntz) (production branch `main`) |
| **Version** | 1.0.0 |
| **Date** | 6 Oct 2026 |
| **State** | Code complete and tested in headless browsers. **Live at https://baanrodmai.autobahn.bot** (6 Oct 2026). **Not yet tested on real phones.** |
| **Next** | [docs/ROADMAP.md](docs/ROADMAP.md): launch tasks first, then N1–N4 |
| **For AI assistants** | Start with [AGENTS.md](AGENTS.md); lessons are in [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md) |

## 1. In one minute

**What it is.** A 60-second mobile web game in Thai, with an English toggle. Players fix up an illustrated house before a flood (ก่อนน้ำมา) or spot the dangers after it (หลังน้ำลด). Every tap teaches one action from a Thai agency, and every result becomes a card, a challenge link and a checklist to forward to family.

**What's done:**

- **Game:** two modes over three rooms (หน้าบ้าน, ห้องนั่งเล่น, ครัว).
- **Content:** 40 safety items (31 verified, 9 flagged ⚠️ partial) and 15 decoys, from 54 dated sources.
- **Sharing:** result cards, checklists, challenge links and link previews.
- **Platform:** offline play, anonymous metrics, Cloudflare-ready build and deploy.
- **Docs:** the six deliverables plus the maintainer reference.

**Checks.** The build passes, with its content validation and size budget. The start screen is 142 KB compressed against a 500 KB limit. All **12 rule tests** and **24 browser checks** pass.

**What's not done:**

- real-phone testing
- your domain and forecast-app link
- a human review of the ⚠️ items
- three more rooms
- version 2's combined run

Details are in sections 2 and 8.

**Where it came from.** It was built on 6 Oct 2026 in a feature branch of `bejranonda/carrier-vector-1988`, in the folder `baanrodmai/`. The same day it moved here to the repository root, keeping its two original commits. That branch was never merged and had no pull request. It has since been pointed back at `master` (`7a9c196`), so `carrier-vector-1988` no longer contains any game code or game commits.

## 2. Before launch: what only you can do

Work through these in order. Each links to the details.

- [x] **Create the Cloudflare Pages project** (done 6 Oct 2026; only Web Analytics is left to switch on) from this repository: root directory empty, build command `node tools/build.mjs`, output `public`. See [docs/03-deploy.md](docs/03-deploy.md).
- [ ] **Set `SITE_URL`** in the Pages project (for example `https://baanrodmai.pages.dev` or your own domain) and redeploy. ([KNOWN_ISSUES #6](docs/KNOWN_ISSUES.md#6-placeholders-domain-and-forecast_app_url-are-unset))
- [x] **Re-render the images with the domain** and commit them. Done on 6 Oct 2026 for `https://baanrodmai.autobahn.bot` ([Fixed F5](docs/KNOWN_ISSUES.md#after-v100-going-live-6-oct-2026)).

  ```bash
  npm install
  SITE_URL=https://your.domain npm run images
  ```
- [ ] **Set `config.json → forecastAppUrl`** to your forecast app. Optionally also set `forecastStatusUrl`; its endpoint needs CORS ([#13](docs/KNOWN_ISSUES.md#13-forecaststatusurl-needs-cors-and-a-fast-answer)).
- [ ] **Configure the Pages project:**
  - Metrics → **Web Analytics → Enable**
  - Settings → Bindings: check that **`EVENTS`** (Analytics Engine) is listed
  - Settings → Runtime → **Fail open**
- [ ] **Review the 9 ⚠️ items** in [docs/01-safety-content.md](docs/01-safety-content.md#flags-please-review-these), ideally with an agency contact. Do the same for the sources that came from reposts because the agency sites blocked automated checks ([#8](docs/KNOWN_ISSUES.md#8-9-safety-items-are-only-partially-verified), [#9](docs/KNOWN_ISSUES.md#9-agency-websites-blocked-automated-checks)).
- [ ] **Have a second native speaker read the Thai copy,** ideally an older family member from the forwarding audience ([#11](docs/KNOWN_ISSUES.md#11-thai-copy-needs-a-second-native-reader)).
- [ ] **Run the real-phone matrix** in [docs/06-test-checklist.md](docs/06-test-checklist.md): at least one cheap Android and one iPhone, inside LINE, Facebook and TikTok ([#3](docs/KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers)).
- [ ] **Soft launch** to 20–30 people, then follow the phases in [docs/04-launch-kit.md](docs/04-launch-kit.md).
- [ ] *(Optional)* **Confirm the license.** It is MIT, the same as your other repository; change it in `LICENSE` and `package.json` if you prefer.

## 3. How to run it

Requirements: Node 18 or later (Cloudflare uses 22). For `npm run images` and `npm run smoke`, you also need Chromium. `package-lock.json` pins `playwright-core` 1.63.0. Either run `npx playwright@1.63.0 install chromium`, or set `CHROME_PATH` to an existing Chrome or Chromium (in Claude Code cloud sessions: `/opt/pw-browsers/chromium`).

```bash
node tools/build.mjs                    # validate content + generate pages and the service worker
npx wrangler@latest pages dev public    # local site + /api/e at http://localhost:8788
npm test                                # 12 rule tests (Node only, well under a second)
npm install                             # once: playwright-core for the next three
npm run smoke                           # 24 browser checks; add  -- --screens docs/screens  to refresh screenshots
npm run images                          # re-render previews, checklists, sample cards, icons (set SITE_URL)
npm run probe                           # tap-area overlaps + flood timings (Node only)
npm run docs                            # regenerate the safety table in docs/01 from items.json
npm run check:docs                      # check every relative link and anchor in the Markdown
```

## 4. How it fits together

```
 public/content/*.json ──(tools/build.mjs: validate, generate /c/*, /checklist/*, sw.js)──▶ Cloudflare Pages (static)
                                                                                                │
 Browser ── index.html ── js/main.js (boot, screens, loop) ─────────────────────────────────────┘
               │  content.js   loads the 7 JSON files, i18n
               │  house.js     seed (mode|houseKey|vN) → targets + decoys in room slots   [pure]
               │  round.js     clock, rising water, choices, score                       [pure]
               │  scene.js     inlines room SVGs + sprites, tap areas, water, badges
               │  cards.js     canvas result card / checklists / previews (svgdraw.js)
               │  share.js     Web Share → LINE / Facebook / X / copy / long-press save
               │  analytics.js batches anonymous events ──sendBeacon──▶ functions/api/e.js ──▶ Analytics Engine
               └─ sw.js        offline after the first visit (not inside iOS in-app browsers)
```

Rules, formulas and the content model are in [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md). The file-by-file map is in [docs/02-game-design.md](docs/02-game-design.md#code-map).

## 5. Where to find things

| I want to… | Go to |
|---|---|
| Fix a tip, choice or explanation | `public/content/items.json`, then `npm run docs`. Follow [GUIDELINES §2](docs/GUIDELINES.md#2-safety-content). |
| Change which mode is recommended | `public/content/config.json → rainWarningActive` |
| Change texts, rank titles or share texts | `public/content/strings.json`. A few texts are still in `main.js` ([#5](docs/KNOWN_ISSUES.md#5-some-ui-text-is-hard-coded-in-mainjs-and-one-event-is-unused)). |
| Change round length, points or the water curve | `public/content/config.json → round` |
| Edit a checklist or the help numbers | `checklists.json` / `helplines.json`, then `npm run images` |
| Move or add slots | `public/content/rooms.json`, then `npm run probe` |
| Change the art | `public/art/rooms/*.svg`, `public/art/sprites.svg` ([GUIDELINES §4](docs/GUIDELINES.md#4-art)) |
| Understand a rule or number | [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md) |
| See what's broken or limited | [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) |
| Post about the game | [docs/04-launch-kit.md](docs/04-launch-kit.md) |
| Read the numbers | [docs/05-metrics.md](docs/05-metrics.md) |
| Know what to do next | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Avoid past mistakes | [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md) |
| Brief an AI assistant | [AGENTS.md](AGENTS.md) (Claude Code loads it through [CLAUDE.md](CLAUDE.md)) |

## 6. Operating the live game

- **The rains come and go.** Set `rainWarningActive` to `true` before a rain wave (Prepare is recommended first) and to `false` as the water recedes (Return first). Both modes are always playable.
- **Correcting advice:**
  1. Edit the JSON with its source.
  2. Wait for the deploy, which takes about a minute.
  3. Post **"UPDATE:"** wherever the game was shared. Never correct advice quietly.
  4. Ship structural edits (adding, removing or disabling items, or moving slots) around midnight Bangkok time, because they reshuffle today's house ([#24](docs/KNOWN_ISSUES.md#24-some-content-edits-reshuffle-todays-house-and-old-challenge-links)).
- **If it goes viral:**
  - Static pages and images are unlimited on the free plan.
  - Only the event counter uses the Functions quota (100,000 requests a day). Lower `config.analytics.sampleRate` to `0.5` or `0.2`; the metrics SQL stays correct.
  - With **Fail open**, the game keeps working even if the quota runs out.
- **Link previews look stale:** use Facebook's Sharing Debugger → *Scrape Again*. For LINE, share a `?v=2` variant.
- **Something broke after a deploy:** Cloudflare → Pages project → Deployments → an earlier one → *Rollback*.
- **Each season (April–May):**
  1. Re-check sources and hotlines.
  2. Bump `houseVersion`.
  3. Re-render the images.
  4. Re-run the tests.

  See [docs/04-launch-kit.md §5](docs/04-launch-kit.md#5-relaunch-every-rainy-season).

## 7. Known issues to keep in mind

The full list, with measurements, is in [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md). The ones that matter most:

| # | Issue | Status |
|---|---|---|
| 3 | Not yet tested on real phones or real in-app browsers | **Launch blocker** |
| 6 | `[DOMAIN]` and `[FORECAST_APP_URL]` are unset | **Launch blocker** |
| 8 | 9 safety items are only partially verified | **Review before launch** |
| 1 | Neighbouring tap areas overlap in 32% of houses (worst: 45% of an item) | Open, medium |
| 2 | Item tap areas are 38–43 px on 320 px-wide phones (≥ 47 px on 360 px and up) | Open, low |
| 16–18 | iOS in-app browsers: no offline play. Android in-app browsers: no Web Share. In-app browsers: no downloads. | Platform; fallbacks are in place |

## 8. Suggested next steps

All planned work is in [docs/ROADMAP.md](docs/ROADMAP.md) as task cards, each with steps, the person needed and a "done when". In short:

1. **Launch** (section 2, ROADMAP L1–L7): the domain, images, forecast link, ⚠️ review, real-phone matrix and soft launch.
2. **v1.1, polish:**
   - Fix the overlapping tap areas by moving slots, and add a unit test that fails above about 10% overlap ([#1](docs/KNOWN_ISSUES.md#1-neighbouring-tap-areas-can-overlap)).
   - Move the hard-coded texts into `strings.json` ([#5](docs/KNOWN_ISSUES.md#5-some-ui-text-is-hard-coded-in-mainjs-and-one-event-is-unused)).
   - Add a GitHub Actions workflow for the build and tests ([#4](docs/KNOWN_ISSUES.md#4-no-ci-on-github)).
   - Use the first two weeks of metrics to find the most-missed lessons and improve their art or wording.
3. **v1.2, more house:** draw the bathroom, bedroom and garage ([#14](docs/KNOWN_ISSUES.md#14-bathroom-bedroom-and-garage-are-not-drawn)), and settle the mattress conflict first ([#10](docs/KNOWN_ISSUES.md#10-sources-conflict-on-soaked-mattresses)).
4. **v2, the combined run:** the before/after card and a third start button ([#15](docs/KNOWN_ISSUES.md#15-version-2-the-combined-prepare--return-run)).

**Lessons in brief** (full list in [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md)):

- **Measure the whole requirement.** The 44 px rule passed for items but failed for four other controls until every control was measured.
- **Headless tests aren't phones.** Real in-app browsers are still unverified.
- **Agency sites block bots.** Their wording came from PRD reposts and news, so a person must do the final check.
- **Some content edits reshuffle houses.** Adding, removing or moving items changes today's house and old challenge links, so ship those at midnight.
- **Write down an action only after it succeeded,** and prefer additive git operations. History rewrites happen only on the owner's explicit request.

## 9. What changed in this handoff (6 Oct 2026)

- **Moved** from `carrier-vector-1988/baanrodmai/` to this repository's root. The two original commits were re-rooted with their authors, dates and messages kept.
  - All paths, commands and deploy settings in the docs now use the root directory.
  - `package.json` gained repository links.
  - A `.gitignore` and an MIT `LICENSE` were added.
- **Fixed** four accessibility problems found by measuring every control ([KNOWN_ISSUES → Fixed](docs/KNOWN_ISSUES.md#fixed)):
  - the HUD and tabs at 40 px on short screens
  - the "ทำไม?" expander at 35×40 px
  - source links 21–38 px tall
  - screenshot names that didn't match the docs
- **Added tests and tools:**
  - three smoke checks, bringing the total to 24, measuring all controls on the game, result, checklist, help and about screens
  - `npm run probe` for tap-area overlaps and flood timings
  - refreshed screenshots
- **Added documents:** this file, [CHANGELOG.md](CHANGELOG.md), [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md), [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md), [docs/GUIDELINES.md](docs/GUIDELINES.md), [docs/APPROACH_AND_METHOD.md](docs/APPROACH_AND_METHOD.md) and [CLAUDE.md](CLAUDE.md).
- **Cleaned up `carrier-vector-1988`.**
  - There was no pull request for the game, so there was nothing to close.
  - A removal commit (`8c08c06`) came first. Then, at the owner's request, the branch `ccr-b279fcc9-aqphnj` was force-pushed back to `master` (`7a9c196`), so it is no longer ahead and holds no game commits.
  - Deleting the branch needs the GitHub UI, because the session's git proxy refuses branch deletion. This is optional.
  - That repository's own pull requests (#1 and #2, the flight-sim releases) were not touched.
- **Added guidance for AI assistants** (same day, later):
  - [AGENTS.md](AGENTS.md), which [CLAUDE.md](CLAUDE.md) imports
  - [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md)
  - [docs/ROADMAP.md](docs/ROADMAP.md)
  - `npm run check:docs`, a link and anchor checker
  - corrected Playwright install notes (1.63.0, or `CHROME_PATH`)

## 10. Access, accounts and secrets

- **The repository contains no secrets,** and the game needs none to run.
- **You will need:**
  - a **Cloudflare account** for the Pages project
  - optionally, a **custom domain**
  - for the metrics SQL, a Cloudflare **API token** with *Account → Account Analytics → Read*. Keep it out of git; `.gitignore` covers `.dev.vars` and `.env*`.
- **Third-party material:**
  - the Kanit font subsets, under the SIL OFL (`public/fonts/OFL-Kanit.txt`)
  - agency guidance, summarised and linked, never copied as images

*เนื้อหาเพื่อการเรียนรู้ หากไม่แน่ใจให้ติดต่อช่างหรือเจ้าหน้าที่*

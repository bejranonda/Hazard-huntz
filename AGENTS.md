# AGENTS.md: guide for AI assistants

This file is for any AI coding assistant working on this repository. Claude Code loads it through `CLAUDE.md`.

## 1. The project in brief

- **บ้านรอดไหม? (Baan Rod Mai?)** is a 60-second Thai home-safety game for phones, built around the hazards of the Thai year.
  - **Four modes:** ก่อนน้ำมา (prepare the house for a flood), หลังน้ำลด (spot the dangers when moving back), ฝุ่น PM2.5 (shut out the dust) and ไฟไหม้ (house fire). Modes live in a registry (`config.json → modes`, `public/js/modes.js`); see [GUIDELINES §10](docs/GUIDELINES.md#10-adding-a-hazard-mode).
  - **Built to spread:** it is meant to be forwarded in LINE family groups.
- **Stack:** plain HTML, CSS and ES modules with hand-made SVG.
  - Static hosting on Cloudflare Pages Free, plus one tiny Pages Function for anonymous counts.
  - No framework and no runtime npm packages.
- **State (18 Oct 2026):** v1.6.1, in Thai (`/`) and English (`/en/`), with a page per hazard (`/flood`, `/pm25`, `/fire`) `?mode=` links that open the game on one mode, and image sets for social posts (`/posts`). The code is complete and passes every automated check, and it is **live at https://baanrodmai.autobahn.bot** (Cloudflare Pages project `baanrodmai`). It is **not tested on real phones** and not yet launched.
  - The remaining launch work needs the owner: Web Analytics, search-console submission, a safety review and a phone test.
  - See [HANDOFF.md](HANDOFF.md).
- **Branches:** `main` is production. Pushes to `main` deploy by themselves (verified 10 Oct 2026, live in about two minutes). Check the live site after a push.

## 2. Read in this order

1. [HANDOFF.md](HANDOFF.md): where things stand and what the owner still has to do.
2. [docs/ROADMAP.md](docs/ROADMAP.md): **what to do next**, as task cards with steps and a "done when".
3. [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md): mistakes already made and how to avoid repeating them.
4. [docs/GUIDELINES.md](docs/GUIDELINES.md): the rules for content, Thai copy, art, code, testing and git.
5. [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md): known problems and limits. Don't "rediscover" them; update them.
6. [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md): reference for every rule, number and content field, and the research behind them.

## 3. Commands

| Command | What it does | When |
|---|---|---|
| `node tools/build.mjs` | Validates every content file, then generates the preview, lesson and hazard pages and `sw.js`, checks the 500 KB budget, and prints what the start screen recommends today (`start`) | Every change |
| `npm test` | 23 rule tests, Node only, well under a second | Every change |
| `npm run smoke` | 81 checks in headless Chromium, on a pinned Bangkok day (18 Oct 2026 by default). Needs `npm install` and Chromium (see §7). | UI, CSS, sharing or service-worker changes |
| `SMOKE_DATE=YYYY-MM-DD npm run smoke` | The same checks on another day, to test another season (for example `2026-12-05` for dust, `2027-04-10` for fire) | Changes to seasons, switches or what the start screen recommends |
| `npm run smoke -- --screens docs/screens` | Same, and refreshes the doc screenshots. **Look at them.** | Visual changes |
| `npm run probe` | Measures tap-area overlaps over two years of houses in every mode, plus flood and smoke timings | Slot, size or water-curve changes |
| `npm run docs` | Regenerates the summary and the safety table in `docs/01` from `items.json` (a normal build warns when it is out of date) | Any `items.json` / `sources.json` change |
| `npm run check:docs` | Checks every relative link and anchor in the Markdown | Any doc change |
| `SITE_URL=… npm run images` | Re-renders the previews, checklists, cards, carousel posts and icons; `-- --only share/carousel` renders one folder only | Copy, rank, checklist, lesson-text or domain changes (the build warns when the carousel is stale) |
| `npx wrangler@latest pages dev public` | Local site with `/api/e` | Manual testing |

## 4. Definition of done

A change is done when **all** of these are true:

1. `node tools/build.mjs` passes with no new warnings you can't explain.
2. `npm test` passes. UI work also passes `npm run smoke`. New items, slot or water changes also get `npm run probe`, with its numbers compared to [KNOWN_ISSUES](docs/KNOWN_ISSUES.md).
3. The docs are updated **in the same commit**:
   - `CHANGELOG.md` (under *Unreleased*)
   - the item's status in `docs/ROADMAP.md`
   - the entry in `docs/KNOWN_ISSUES.md` (move it to *Fixed* with the evidence)
   - `HANDOFF.md`, if the project's state changed
   - `npm run docs`, if safety content changed
4. `npm run check:docs` passes.
5. The report gives **the real output** of every check, and says plainly which checks were not run.
6. The commit message starts with `feat:`, `fix:`, `content:`, `docs:`, `test:` or `chore:`.
7. Push only to the branch you were given. Don't open pull requests unless asked.

## 5. Hard rules

These are short versions of [GUIDELINES §1](docs/GUIDELINES.md#1-non-negotiables).

- **Never invent safety advice, numbers or sources.**
  - Every correct action needs a source in `public/content/sources.json`.
  - Set `verify` honestly (`verified` / `partial` with a `verifyNote`).
  - Leave out numbers that sources disagree on.
- **Content guardrails:**
  - no drowning, deaths, injuries or photos of real damage
  - no blaming agencies or politicians
  - no political, royal or religious references
  - humour aimed only at the situation
- **Privacy:** no personal data, no cookies, no new third-party scripts. Events stay anonymous.
- **Tap targets:** every one is at least 44 px. The smoke test measures items and controls.
- **Weight:** the start screen stays under 500 KB compressed (188 KB today).
- **Two languages:** every `th` string needs an `en` twin (and every `og` an `ogEn`). Don't hard-code the brand name; use `logoA`/`logoB`. Check `/en/` as well as `/` before calling a change done.
- **Tips:** at most 80 characters, in both Thai and English. Exactly one correct choice per item.
- **Text location:** player-facing text belongs in `public/content/*.json`, not in JS. Every new `og` key needs an English `ogEn` twin (the build fails otherwise); re-render with `npm run images` and commit only the images you meant to change.
- **Search and AI search:** `/learn`, the hazard pages, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, the canonical link and the JSON-LD are all generated from the content JSON. Don't hand-write lesson text anywhere else, or it will drift from `items.json`.
- **Cloudflare token:** it is in `.env` (git-ignored). Load it with `set -a; . ./.env; set +a` and never print it. `wrangler.toml` manages the Pages project, so the site address comes from `config.json → siteUrl`, not a dashboard variable.
- **Generated files** are never edited by hand: `public/sw.js`, `public/js/version.js`, `public/c/*.html`, `public/checklist/*.html`, the English pages (`public/en/`), the SEO files (`public/learn.html`, `robots.txt`, `sitemap.xml`, `llms.txt`), the hazard pages (`public/<slug>.html` and `public/en/<slug>.html`: `flood`, `pm25`, `fire`), `public/posts.html`, and the OG block in `index.html`. The carousel images (`public/share/carousel/`) and their `manifest.json` come from `npm run images`. Bump `strings.json → seo.updated` when the lessons change. Never change a hazard slug (`config.json → hazards`) once published.
- **Hand-set switches get an end date.** `rainWarningActive` needs `rainWarningUntil` and `featuredTopic` needs `featuredTopicUntil` (Bangkok dates, that day included). Tests never read the calendar: pin the date and derive the expectation from `recommend()` ([GUIDELINES rules 51–52](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Changes that reshuffle houses.** Adding, removing or disabling items, or moving slots, changes today's house and old challenge links. Say so in the commit, and ship such changes around midnight Bangkok time.
- **Correcting published advice** requires an "UPDATE:" post. Note it for the owner.

## 6. How the owner works

The owner is the GitHub user `bejranonda`. What we know of their preferences, from the original brief and later requests:

- **Assumptions over questions.** Ask only what is essential (the brief allowed at most three questions). Otherwise state your assumptions and proceed. Values only the owner has are kept as placeholders until supplied (`[DOMAIN]` and `[FORECAST_APP_URL]` were filled on 6 and 11 Oct 2026).
- **Thorough research.** "Research deep." Cite sources, and flag anything you cannot verify ("Verify every number").
- **Finished work.** Build it, test it, document it, and commit when asked. The owner asks for README, handoff and knowledge docs to be kept current.
- **The audience is Thai social-media users.** Optimise for in-app browsers, older relatives who forward pictures, and warm, respectful Thai.

## 7. Environment notes

These were learned in Claude Code cloud sessions and similar sandboxes.

- **Chromium.**
  - `package-lock.json` pins `playwright-core` **1.63.0**, which expects its own Chromium build (1243).
  - The cloud image instead ships **Chromium 141 at `/opt/pw-browsers/chromium`**. Always run `CHROME_PATH=/opt/pw-browsers/chromium npm run smoke` (and the same for `images`).
  - Don't download browsers in that sandbox. Elsewhere, `npx playwright@1.63.0 install chromium` works.
- **Network.**
  - The npm registry works. Downloads from GitHub's raw file host were refused (HTTP 403), so get assets from npm packages instead; the Kanit fonts came from `@fontsource/kanit`.
  - Thai agency sites refuse automated access: disaster.go.th, anamai.moph.go.th, mea.or.th, bangkok.go.th, doeb.go.th, dpt.go.th. Use the PRD repost or a news report quoting the agency, record its `kind`, and leave the final check to a person.
- **Research budget.** Web search is shared and ran out halfway through the first research pass. Plan the searches and run independent ones in parallel. Then confirm facts by fetching primary pages (Cloudflare docs, MDN's compatibility data on GitHub) and mark anything not confirmed **[unverified]**.
- **Git.**
  - Use additive commits by default.
  - Rewriting history was blocked until the owner asked for it explicitly. It then worked with `--force-with-lease` and the expected SHA.
  - The session's git proxy refuses branch deletion and tag pushes, so the owner deletes branches and creates `vX.Y.Z` tags (as GitHub Releases) in the GitHub UI.
  - Never work around a denial.
  - The session's remote URL is lowercase (`hazard-huntz`), so `git push` prints "This repository moved". It is harmless.
- **Scratch work.** Keep one-off probes and screenshots in the session scratchpad. Commit a tool only when it is reusable, like `tools/probe.mjs`.

## 8. What to do next

1. **If the owner gave a launch input** (domain, forecast URL, review results or phone-test results), do the matching **L** task in [docs/ROADMAP.md](docs/ROADMAP.md) first.
2. **Otherwise** take the top **AI-ready** task under *Later*:
   - **P7:** heat and summer storms (the next hazard mode; follow [GUIDELINES §10](docs/GUIDELINES.md#10-adding-a-hazard-mode))
   - **P8:** earthquake and tsunami
   - **P5:** share-loop ideas (weekly house, QR code, family round-up, themed house)
   - **P6:** lessons for the remaining disease groups (skin, respiratory)
3. **When you finish,** update the task card's status, and add any new lesson to [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md).

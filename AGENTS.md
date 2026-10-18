# AGENTS.md: guide for AI assistants

This file is for any AI coding assistant working on this repository. Claude Code loads it through `CLAUDE.md`.

## 1. The project in brief

- **บ้านรอดไหม? (Baan Rod Mai?)** is a Thai home-preparedness app for phones, **tools first since v1.9.0**: what to do when something happens, what to keep at home and a family plan, for any disaster, with a 60-second home-safety game as the optional way to remember. The owner's direction (19 Oct 2026): prepare for all possibilities; the game "should not force everyone to play"; "it is a tool to help them".
  - **Nine "what to do" guides (v1.9.0):** `config.json → guides` (order, icon, hazard) and `checklists.json`. The five game modes' checklists are their guides; four guides have no game: น้ำป่า ดินถล่ม (`landslide`), พายุ ลมแรง ฟ้าผ่า (`storm`), แผ่นดินไหว (`quake`), อากาศร้อนจัด (`heat`), 10 lines each by phase with a source and `verify` on every line. An owner-set alert (`config.json → alert: { guide, until }`) puts one on top of the start screen until its end date. See [KNOWLEDGE §29](docs/KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190).
  - **Five modes:** ก่อนน้ำมา (prepare the house for a flood), หลังน้ำลด (spot the dangers when moving back), ฝุ่น PM2.5 (shut out the dust), ไฟไหม้ (house fire) and ไฟดับ (getting through a power cut, year-round, v1.7.0). Modes live in a registry (`config.json → modes`, `public/js/modes.js`); see [GUIDELINES §10](docs/GUIDELINES.md#10-adding-a-hazard-mode).
  - **Two tools outside the round (v1.8.0):** บ้านเราพร้อมแค่ไหน? (`/?open=kit`, a home-kit check with amounts for the household) and แผนบ้านรอดของบ้านเรา (`/?open=plan`, a family plan card); since v1.9.0 they are on the start screen's hub and have pages of their own, `/kit` and `/plan`. Their content is `public/content/kit.json`; what people answer and type stays on the device. The hazards that offer them are set in `config.json → hazards.<hazard>.tools` (flood and power cut since v1.8.1), which puts the links on the hazard's page and the 🎒 button on its modes' results. See [KNOWLEDGE §28](docs/KNOWLEDGE.md#28-the-home-check-and-the-family-plan-card-v180).
  - **Built to spread:** it is meant to be forwarded in LINE family groups.
- **Stack:** plain HTML, CSS and ES modules with hand-made SVG.
  - Static hosting on Cloudflare Pages Free, plus one tiny Pages Function for anonymous counts.
  - No framework and no runtime npm packages.
- **State (19 Oct 2026):** v1.9.0, in Thai (`/`) and English (`/en/`). The start screen leads with the alert card and three tools (what to do, check your supplies, the family plan), then the game. A page per hazard (`/flood`, `/pm25`, `/fire`, `/ready`, and the guide-only `/landslide`, `/storm`, `/quake`, `/heat`), `/checklist/<id>` for every guide, `/kit` and `/plan`, `?mode=` links that open the game on one mode, image sets for social posts (`/posts`), and the home check and family plan card (`/?open=kit`, `/?open=plan`, also as shortcuts on the installed app's icon). v1.8.1 came from a whole-app visitor audit in both languages on the smallest phones ([APPROACH §26](docs/APPROACH_AND_METHOD.md#26-the-visitor-audit-loop-v181)). Most lessons come from Thai agencies; 10 of the 13 power-cut lessons rest partly or wholly on international guidance and are flagged ⚠️ until a Thai review ([KNOWN_ISSUES #55](docs/KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)), and so do 9 of the home check's 15 lines ([#57](docs/KNOWN_ISSUES.md#57-the-home-check-and-plan-card-rest-partly-on-international-guidance)); the four new guides' Thai sources were read through news reports quoting the agencies (5 of 40 lines ⚠️, [#60](docs/KNOWN_ISSUES.md#60-the-four-new-guides-rest-on-news-reports-quoting-the-agencies)). The code is complete and passes every automated check, and it is **live at https://baanrodmai.autobahn.bot** (Cloudflare Pages project `baanrodmai`). It is **not tested on real phones** and not yet launched.
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
| `npm test` | 29 rule tests, Node only, well under a second | Every change |
| `npm run smoke` | 117 checks in headless Chromium, on a pinned Bangkok day (18 Oct 2026 by default). Needs `npm install` and Chromium (see §7). | UI, CSS, sharing or service-worker changes |
| `SMOKE_DATE=YYYY-MM-DD npm run smoke` | The same checks on another day, to test another season (for example `2026-12-05` for dust, `2027-04-10` for fire) | Changes to seasons, switches or what the start screen recommends |
| `npm run smoke -- --screens docs/screens` | Same, and refreshes the doc screenshots 01–12 and 15 (13, 14 and 16–22 were one-off captures). **Look at them.** | Visual changes |
| `npm run probe` | Measures tap-area overlaps over two years of houses in every mode, plus flood and smoke timings | Slot, size or water-curve changes |
| `npm run docs` | Regenerates the summary and the safety table in `docs/01` from `items.json` (a normal build warns when it is out of date) | Any `items.json` / `sources.json` change |
| `npm run check:docs` | Checks every relative link and anchor in the Markdown | Any doc change |
| `SITE_URL=… npm run images` | Re-renders the previews, checklists, cards, carousel posts and icons; `-- --only share/carousel` renders one folder only, and `--only a,b` several paths (v1.9.0) | Copy, rank, checklist, lesson-text or domain changes (the build warns when the carousel is stale) |
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
  - Every correct action needs a source in `public/content/sources.json`, and so does every line of the home check (`kit.json`), where each number in an amount must appear in a cited source's title or note (the build checks it).
  - Set `verify` honestly (`verified` / `partial` with a `verifyNote`).
  - Leave out numbers that sources disagree on.
  - Advice only a foreign agency gives ships ⚠️ `partial`, says so, and is never described as Thai advice; a viral post is a prompt, not a source ([GUIDELINES rule 55](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Content guardrails:**
  - no drowning, deaths, injuries or photos of real damage
  - no blaming agencies or politicians
  - no political, royal or religious references
  - humour aimed only at the situation
- **Privacy:** no personal data, no cookies, no new third-party scripts. Events stay anonymous. What players answer or type (the home check, the plan card) stays in `localStorage` and never goes into an event, a URL or a request ([GUIDELINES rule 56](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Tap targets:** every one is at least 44 px, and nothing that floats over the room (the ‹ › arrows) may cover more than 5 % of an item. The smoke test measures items, controls and that overlap; a click with `force: true` can't see it ([GUIDELINES rule 54](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Weight:** the start screen stays under 500 KB compressed (232 KB today, counting the home check's code, which loads only when it opens, and about 14 KB of source notes it never shows: [ROADMAP N18](docs/ROADMAP.md#n18-keep-source-notes-out-of-what-the-game-loads)).
- **Two languages:** every `th` string needs an `en` twin (and every `og` an `ogEn`). Don't hard-code the brand name; use `logoA`/`logoB`. Check `/en/` as well as `/` before calling a change done.
  - The English is **British English**: "torch", "power cut", "litres", "nappies". Quote American sources as written in their `note`, but write the game's text in its own English ([GUIDELINES rule 58](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
  - **When a mode, a guide or a tool is added,** rewrite every sentence that says what the app is about, in both languages: the tagline (`strings.json`; since v1.9.0 the build writes the start screen's static Thai text into `index.html`, so never edit it there, [rule 65](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)), `index.html`'s `<title>` and meta description, the manifest's description, the default preview, the About text, `/learn`'s texts, `seo.en.llmsSummary`, the JSON-LD `about` and `package.json → description` ([GUIDELINES rule 59](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
  - **Card text** never starts a line with closing punctuation; `tokens()` in `cards.js` keeps it on the word before, and a unit test checks every ending ([GUIDELINES rule 60](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Tools first (v1.9.0).** Every hazard gets a short sourced guide before, or instead of, a game mode, and the game is never required to get the advice. A guide with no game has exactly 10 lines in phase order (before → during → after), a source on every line, and `verify` (`partial` with a `verifyNote`); leave out what sources disagree on and record it ([GUIDELINES rules 61–62](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [§10 step 0](docs/GUIDELINES.md#10-adding-a-hazard-mode)).
- **Emoji** in player-facing text are Unicode 11 or older; newer ones are empty boxes on older phones ([GUIDELINES rule 64](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Tips:** at most 80 characters, in both Thai and English. Exactly one correct choice per item.
- **Text location:** player-facing text belongs in `public/content/*.json`, not in JS. Every new `og` key needs an English `ogEn` twin (the build fails otherwise); re-render with `npm run images` and commit only the images you meant to change.
- **Search and AI search:** `/learn`, the hazard pages, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, the canonical link and the JSON-LD are all generated from the content JSON. Don't hand-write lesson text anywhere else, or it will drift from `items.json`.
- **Cloudflare token:** it is in `.env` (git-ignored). Load it with `set -a; . ./.env; set +a` and never print it. `wrangler.toml` manages the Pages project, so the site address comes from `config.json → siteUrl`, not a dashboard variable.
- **Generated files** are never edited by hand: `public/sw.js`, `public/js/version.js`, `public/c/*.html`, `public/checklist/*.html`, the English pages (`public/en/`), the SEO files (`public/learn.html`, `robots.txt`, `sitemap.xml`, `llms.txt`), the hazard pages (`public/<slug>.html` and `public/en/<slug>.html`: `flood`, `pm25`, `fire`, `ready`, `landslide`, `storm`, `quake`, `heat`), `public/kit.html`, `public/plan.html` and their `en/` twins, `public/posts.html`, and in `index.html` the OG block, the `<title>`, the meta description and the static Thai text of every `data-i18n` element. The carousel images (`public/share/carousel/`) and their `manifest.json` come from `npm run images`. Bump `strings.json → seo.updated` when the lessons change. Never change a hazard slug (`config.json → hazards`) once published.
- **Hand-set switches get an end date.** `rainWarningActive` needs `rainWarningUntil`, `featuredTopic` needs `featuredTopicUntil`, and the alert `{ guide, until }` shows only with its `until` (Bangkok dates, that day included); clear the alert after its date, or the build warns ([GUIDELINES rule 63](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)). Tests never read the calendar: pin the date and derive the expectation from `recommend()` ([GUIDELINES rules 51–52](docs/GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit)).
- **Changes that reshuffle houses.** Adding, removing or disabling items, or adding, removing or retagging slots, changes today's house and old challenge links. Say so in the commit, and ship such changes around midnight Bangkok time. Moving a slot's `x`/`y` with the same id and tags changes no house, but changes when water or smoke reaches it (re-run `npm run probe`).
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
  - On 19 Oct 2026 prd.go.th refused automated readers too (a 301 and then a 404 to `curl`, a 500 block page to headless Chromium, even for its home page). A PRD page you can't open is not proof that it is gone: record what you saw and ask the owner to open it ([KNOWN_ISSUES #55](docs/KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance)).
- **Research budget.** Web search is shared and ran out halfway through the first research pass. Plan the searches and run independent ones in parallel. Then confirm facts by fetching primary pages (Cloudflare docs, MDN's compatibility data on GitHub) and mark anything not confirmed **[unverified]**.
- **Git.**
  - Use additive commits by default.
  - Rewriting history was blocked until the owner asked for it explicitly. It then worked with `--force-with-lease` and the expected SHA.
  - The session's git proxy refuses branch deletion and tag pushes, so the owner deletes branches and creates `vX.Y.Z` tags (as GitHub Releases) in the GitHub UI.
  - Never work around a denial.
  - The session's remote URL is lowercase (`hazard-huntz`), so `git push` prints "This repository moved". It is harmless.
- **Scratch work.** Keep one-off probes and screenshots in the session scratchpad, and run probes from there: one run from the repository root put `v16/names-360.png` into the v1.7.0 commit ([LESSONS E8](docs/LESSONS_LEARNED.md#e-process-documentation-and-git)). Read `git status --short` before committing and stage files by name; CI can't catch a stray file once it is committed. Commit a tool only when it is reusable, like `tools/probe.mjs`.

## 8. What to do next

1. **If the owner gave a launch input** (domain, forecast URL, review results or phone-test results), do the matching **L** task in [docs/ROADMAP.md](docs/ROADMAP.md) first.
2. **Otherwise** take the top **AI-ready** task. (N15, the home check and family plan card, shipped in v1.8.0, N16, the visitor audit, in v1.8.1, and N17, tools first and a guide for every hazard, in v1.9.0; their owner reviews are in L5, L6 and L10.)
   - **N18:** keep the source notes out of what the game loads (−14 KB on the start screen)
   - **P7:** heat and summer storms: the guides exist (v1.9.0); a game mode is next, built from what the guides' sources back ([GUIDELINES §10](docs/GUIDELINES.md#10-adding-a-hazard-mode))
   - **P8:** earthquake and tsunami: the guide exists (its tsunami line ⚠️); a game mode is next
   - **A new hazard in the news** gets a guide first, not a mode ([ROADMAP S2](docs/ROADMAP.md#s2-when-something-is-in-the-news-the-alert-and-the-guide-posts))
   - **P5:** share-loop ideas (weekly house, QR code, family round-up, themed house)
   - **P6:** lessons for the remaining disease groups (skin, respiratory)
3. **When you finish,** update the task card's status, and add any new lesson to [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md).

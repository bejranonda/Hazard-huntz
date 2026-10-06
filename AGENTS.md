# AGENTS.md: guide for AI assistants

This file is for any AI coding assistant working on this repository. Claude Code loads it through `CLAUDE.md`.

## 1. The project in brief

- **บ้านรอดไหม? (Baan Rod Mai?)** is a 60-second Thai flood-safety game for phones.
  - **Two modes:** ก่อนน้ำมา (prepare the house) and หลังน้ำลด (spot the dangers when moving back).
  - **Built to spread:** it is meant to be forwarded in LINE family groups.
- **Stack:** plain HTML, CSS and ES modules with hand-made SVG.
  - Static hosting on Cloudflare Pages Free, plus one tiny Pages Function for anonymous counts.
  - No framework and no runtime npm packages.
- **State (6 Oct 2026):** v1.0.0. The code is complete and passes every automated check, but it is **not deployed and not tested on real phones**.
  - The remaining launch work needs the owner: a domain, the forecast-app link, a safety review and a phone test.
  - See [HANDOFF.md](HANDOFF.md).
- **Branches:** `main` is production. Once the Cloudflare project exists, every push to `main` deploys.

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
| `node tools/build.mjs` | Validates every content file, then generates the preview pages and `sw.js`, and checks the 500 KB budget | Every change |
| `npm test` | 12 rule tests, Node only, well under a second | Every change |
| `npm run smoke` | 24 checks in headless Chromium. Needs `npm install` and Chromium (see §7). | UI, CSS, sharing or service-worker changes |
| `npm run smoke -- --screens docs/screens` | Same, and refreshes the doc screenshots. **Look at them.** | Visual changes |
| `npm run probe` | Measures tap-area overlaps over two years of houses, and flood timings | Slot, size or water-curve changes |
| `npm run docs` | Regenerates the safety table in `docs/01` from `items.json` | Any `items.json` / `sources.json` change |
| `npm run check:docs` | Checks every relative link and anchor in the Markdown | Any doc change |
| `SITE_URL=… npm run images` | Re-renders the previews, checklists, cards and icons | Copy, rank, checklist or domain changes |
| `npx wrangler@latest pages dev public` | Local site with `/api/e` | Manual testing |

## 4. Definition of done

A change is done when **all** of these are true:

1. `node tools/build.mjs` passes with no new warnings you can't explain.
2. `npm test` passes. UI work also passes `npm run smoke`. Slot or water changes also get `npm run probe`, with its numbers compared to [KNOWN_ISSUES](docs/KNOWN_ISSUES.md).
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
- **Weight:** the start screen stays under 500 KB compressed (142 KB today).
- **Tips:** at most 80 characters, in both Thai and English. Exactly one correct choice per item.
- **Text location:** player-facing text belongs in `public/content/*.json`, not in JS.
- **Generated files** are never edited by hand: `public/sw.js`, `public/c/*.html`, `public/checklist/*.html`, and the OG block in `index.html`.
- **Changes that reshuffle houses.** Adding, removing or disabling items, or moving slots, changes today's house and old challenge links. Say so in the commit, and ship such changes around midnight Bangkok time.
- **Correcting published advice** requires an "UPDATE:" post. Note it for the owner.

## 6. How the owner works

The owner is the GitHub user `bejranonda`. What we know of their preferences, from the original brief and later requests:

- **Assumptions over questions.** Ask only what is essential (the brief allowed at most three questions). Otherwise state your assumptions and proceed. The two values only the owner has are kept as placeholders, `[DOMAIN]` and `[FORECAST_APP_URL]`.
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
  - The session's git proxy refuses branch deletion, so the owner deletes branches in the GitHub UI.
  - Never work around a denial.
  - The session's remote URL is lowercase (`hazard-huntz`), so `git push` prints "This repository moved". It is harmless.
- **Scratch work.** Keep one-off probes and screenshots in the session scratchpad. Commit a tool only when it is reusable, like `tools/probe.mjs`.

## 8. What to do next

1. **If the owner gave a launch input** (domain, forecast URL, review results or phone-test results), do the matching **L** task in [docs/ROADMAP.md](docs/ROADMAP.md) first.
2. **Otherwise** take the top **AI-ready** task under *Next*:
   - **N1:** fix overlapping tap areas
   - **N2:** move the hard-coded text into JSON
   - **N3:** add CI
   - **N4:** bigger tap areas on 320 px phones
3. **When you finish,** update the task card's status, and add any new lesson to [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md).

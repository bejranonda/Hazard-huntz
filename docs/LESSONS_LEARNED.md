# Lessons learned

What building v1.0.0 taught us, recorded so that the next person or AI assistant doesn't learn it twice. The work was the research, the build and the move to this repository, all done on 6 Oct 2026. Each lesson gives:

- what happened
- what to do from now on
- where the rule is enforced or written down

These are the lessons. The rules themselves live in [GUIDELINES.md](GUIDELINES.md), the open problems in [KNOWN_ISSUES.md](KNOWN_ISSUES.md), and the planned work in [ROADMAP.md](ROADMAP.md). When you learn something new, add it here in the same format.

**Contents:**

- [A. Product and audience](#a-product-and-audience)
- [B. Safety content and research](#b-safety-content-and-research)
- [C. Engineering and platform](#c-engineering-and-platform)
- [D. Testing and verification](#d-testing-and-verification)
- [E. Process, documentation and git](#e-process-documentation-and-git)
- [F. Working in an AI sandbox](#f-working-in-an-ai-sandbox)

---

## A. Product and audience

**A1. Design for the people who forward, not only the people who play.**

- *What happened:* The research showed that older relatives mostly forward bright greeting-style pictures (about 04:00–06:30 and before bed). Many of them will never open a game.
- *Do this:* make every shareable object useful on its own: big text, the help numbers, and no need to tap the link. The 1080×1920 checklists and the result card are designed this way.
- *Encoded in:* `cards.js`, `checklists.json`, [04-launch-kit.md](04-launch-kit.md), [KNOWLEDGE §14](KNOWLEDGE.md#14-audience-and-virality-research).

**A2. Comparison needs a shared puzzle.**

- *What happened:* Wordle spread because everyone got the same puzzle and could share a spoiler-free grid.
- *Do this:* keep the daily house identical for everyone (seeded by the Bangkok date). Challenge links rebuild the exact house; never randomise per player.
- *Encoded in:* `rng.js`, `house.js`, `util.js → bangkokDateKey`, unit tests.

**A3. Shame stops sharing.**

- *What happened:* a share is self-presentation. A low score with a mocking title doesn't get forwarded.
- *Do this:* make rank titles flattering at every level, call mistakes "learned" (orange !) rather than "failed", and give gentle feedback that explains the risk.
- *Encoded in:* `strings.json → rankPrepare/rankReturn`, `round.js` statuses, [GUIDELINES §3](GUIDELINES.md#3-thai-copy-and-tone).

**A4. Humour about the situation spreads; suffering as content backfires.**

- *What happened:* during the Sep 2026 floods, coping humour spread fastest. AI-generated flood images and mockery of victims or rescuers drew backlash, and politics was heated.
- *Do this:* aim the humour at mud, the rope that isn't a snake, and the gecko. Use no real or AI disaster images and no politics.
- *Encoded in:* [GUIDELINES §1](GUIDELINES.md#1-non-negotiables) and [§3](GUIDELINES.md#3-thai-copy-and-tone).

**A5. Corrections must be public.**

- *What happened:* a weather page lost trust by quietly editing a forecast.
- *Do this:* any change to safety advice gets an "UPDATE:" post. Sources are dated and shown in the game.
- *Encoded in:* [GUIDELINES §2.4](GUIDELINES.md#24-changing-advice-that-is-already-public).

## B. Safety content and research

**B1. Agency websites often refuse automated access.**

- *What happened:* disaster.go.th, anamai.moph.go.th, mea.or.th, bangkok.go.th, doeb.go.th and dpt.go.th all blocked automated checks.
- *Do this:* use the agency's statement as republished by กรมประชาสัมพันธ์, or a news report quoting the agency directly. Record which one in `sources.json → kind`, and leave the final check on the agency's own page to a person.
- *Encoded in:* `sources.json`, [KNOWN_ISSUES #9](KNOWN_ISSUES.md#9-agency-websites-blocked-automated-checks).

**B2. When sources disagree on a number, the number stays out.**

- *What happened:* sources gave different figures for sandbag fill (½ vs ⅓), bleach dilution, boiling time and soaked mattresses.
- *Do this:* never pick one figure. Leave it out of the game and write the conflict under *Flags* in [01-safety-content.md](01-safety-content.md).
- *Encoded in:* [GUIDELINES §2.2](GUIDELINES.md#22-numbers).

**B3. Check every hotline on its own.**

- *What happened:* 192 looked wrong (use 1784), and 199 was cited only by news reports. 1555 was verified through PRD, and 1323 (mental health) was added.
- *Do this:* re-check every number each season.
- *Encoded in:* `helplines.json` (with sources), and the build checks the number format.

**B4. Grade certainty instead of hiding it.**

- *What happened:* 9 items were official at their core but had one inferred or dated detail.
- *Do this:* mark them `partial` with a `verifyNote`, and treat the review as a launch task. Never ship `unverified`.
- *Encoded in:* the build's validation, [KNOWN_ISSUES #8](KNOWN_ISSUES.md#8-9-safety-items-are-only-partially-verified).

**B5. One source of truth for the game and the review table.**

- *What happened:* reviewers read the table, and players read the game.
- *Do this:* generate the table from `items.json` (`npm run docs`), so a correction can't drift between the two.
- *Encoded in:* `tools/build.mjs --docs`.

**B6. Guardrails beat completeness.**

- *What happened:* some sources cover electric-shock rescue steps and safe wading depths.
- *Do this:* keep them out anyway. The first shows an injured person, and the second is too close to drowning.
- *Encoded in:* [GUIDELINES §2.3](GUIDELINES.md#23-wrong-answers-and-feedback).

## C. Engineering and platform

**C1. The free plan's limits decide the architecture.**

- *What happened:* the brief asked for preview images drawn by a Pages Function. On the free plan that would get 10 ms of CPU per request and 100,000 requests a day, so a viral link would fail.
- *Do this:*
  - build static-first
  - keep Functions on `/api/*` only
  - pre-render the small, fixed set of previews (25 images)
- *Encoded in:* `_routes.json`, `tools/build.mjs`, [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered).

**C2. In-app browsers are the main place people play.**

- *What happened:* each platform lacks something different:
  - Android WebView (LINE and Facebook on Android) has no `navigator.share`
  - iOS WKWebView (every iOS in-app browser) runs no service worker
  - downloads fail in most in-app browsers
  - `blob:` image URLs failed there
- *Do this:* design the fallback first:
  - our own share sheet
  - an image to press and hold, using a `data:` URL
  - LINE's `openExternalBrowser=1`
  - the game still works online when offline support is unavailable
- *Encoded in:* `share.js`, `util.js → inAppBrowser`, smoke checks with LINE and Facebook user agents.

**C3. Thai text needs its own handling.**

- *What happened:* Thai has no spaces between words, so wrapping on spaces breaks lines badly. Drawing an SVG `<img>` onto a canvas can taint it in some browsers and renders fonts and `use` badly.
- *Do this:*
  - wrap lines with `Intl.Segmenter('th')`
  - draw cards with the small `svgdraw.js` renderer
  - self-host Kanit subsets with the OFL file
- *Encoded in:* `cards.js`, `svgdraw.js`, `public/fonts/`.

**C4. A seeded house depends on the content.**

- *What happened:* the house comes from the seed and the current content. Adding, removing or disabling an item, or moving a slot, reshuffles today's house and breaks old challenge links.
- *Do this:* ship structural edits around midnight Bangkok time, and bump `houseVersion` only at the seasonal relaunch.
- *Encoded in:* [KNOWN_ISSUES #24](KNOWN_ISSUES.md#24-some-content-edits-reshuffle-todays-house-and-old-challenge-links), [GUIDELINES §2.4](GUIDELINES.md#24-changing-advice-that-is-already-public).

**C5. Game rules must match what the player sees.**

- *What happened:* the first flood rule used the bottom edge of each item. In the perspective art that felt wrong.
- *Do this:* an item floods when the drawn waterline reaches the sprite's centre. "Floor wet" is a separate threshold (`floorWetY`).
- *Encoded in:* `round.js`, unit tests.

**C6. Paint order is document order.**

- *What happened:* the lamp was drawn behind the wall, and the ground covered the steps. One class name with two meanings turned the whole result screen blue.
- *Do this:* after any art or CSS change, look at a screenshot. Give each class name one meaning only.
- *Encoded in:* [GUIDELINES §8](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (rules 4 and 7).

## D. Testing and verification

**D1. Measure the whole requirement, not the part you were thinking of.**

- *What happened:* the 44 px rule was tested only for items in the art, and they passed. At handoff, measuring *every* control found four problems:
  - the HUD and tabs at 40 px on short screens
  - "ทำไม?" at 35×40 px
  - source links 21–38 px tall
  - screenshot names that didn't match the docs
- *Do this:* turn each numeric requirement into an automated measurement of everything it covers.
- *Encoded in:* `tests/smoke.mjs → smallControls`, [APPROACH §7](APPROACH_AND_METHOD.md#7-measuring-instead-of-assuming).

**D2. Look at the screenshots.**

- *What happened:* several bugs were only visible in screenshots: the lamp behind the wall, the speech bubble covering items, the blue result screen, and a date overlapping the card's pill.
- *Do this:* refresh the screenshots with `npm run smoke -- --screens docs/screens` and actually look at them.
- *Encoded in:* [GUIDELINES §6](GUIDELINES.md#6-testing).

**D3. Headless browsers are not real phones.**

- *What happened:* user-agent tests in headless Chromium caught the logic of the fallbacks. They can't show real share sheets, long-press menus, link previews, notches or iOS audio.
- *Do this:* keep the real-phone matrix as a launch blocker until someone has run it.
- *Encoded in:* [06-test-checklist.md](06-test-checklist.md), [KNOWN_ISSUES #3](KNOWN_ISSUES.md#3-not-yet-tested-on-real-phones-or-real-in-app-browsers).

**D4. Measure numbers; don't guess them.**

- *What happened:* measuring found that 32% of houses have overlapping tap areas (worst case 45%), that phones 320 px wide get 38–43 px tap areas, and when each item floods.
- *Do this:* write a short probe and record the numbers in the docs. Turn a probe you'll reuse into a tool.
- *Encoded in:* `tools/probe.mjs` (`npm run probe`).

**D5. Check every claim in the docs against the code or a source while writing it.**

- *What happened:* first drafts of the handoff docs had errors that were fixed only by reading the code and data: what a unit test covered, the safety summaries for cans and tap water, and the Playwright version.
- *Do this:* treat a doc sentence like code. Open the file it describes before writing it.
- *Encoded in:* [GUIDELINES §8](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (rule 18).

**D6. Check a fresh clone before you push.**

- *What happened:* the build rewrites tracked files, and code can depend on untracked ones.
- *Do this:* in a fresh clone, `node tools/build.mjs` must leave `git status` clean, and the tests must pass.
- *Encoded in:* [GUIDELINES §7](GUIDELINES.md#7-git-and-releases).

**D7. `min-height` does nothing on an inline link.**

- *What happened:* the new `/learn` footer link reused the `.link` class (`min-height: 44px`) but measured 41 px. An `<a>` is inline, and the existing `.link` elements were all buttons.
- *Do this:* give link-styled anchors `display: inline-block`, and let the smoke test measure them.
- *Encoded in:* `public/css/app.css → a.link`, `tests/smoke.mjs → smallControls`.

**D8. Desktop browsers have Web Share too.**

- *What happened:* desktop Chrome on Windows has `navigator.share`, so the smoke test's Share tap opened the OS dialog and the in-page sheet never appeared. The cloud Chromium has no Web Share, so the problem never showed there.
- *Do this:* before calling a test failure a regression, run the same test on untouched `HEAD`. Remove platform APIs that change the code path the test asserts on.
- *Encoded in:* `tests/smoke.mjs → newPage()`.

## E. Process, documentation and git

**E1. Describe an action only after it has succeeded.**

- *What happened:* HANDOFF.md said the old branch "was reset to master" before the reset ran. The reset was then blocked, and a follow-up commit (`62346c1`) had to correct the docs.
- *Do this:* act, verify (for example with `git ls-remote` or the GitHub API), and only then write it down.
- *Encoded in:* [GUIDELINES §8](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (rule 16).

**E2. Prefer additive git operations; rewrite history only when the owner asks.**

- *What happened:* cleaning the game out of `carrier-vector-1988` took three attempts.
  1. Resetting the branch and force-pushing was denied by the permission system.
  2. A normal commit that deleted the folder (`8c08c06`) removed the files, but the branch was still "3 commits ahead of master", and GitHub kept offering "Compare & pull request".
  3. The owner asked again explicitly. Deleting the branch was refused by the session's git proxy (the remote hung up). A `--force-with-lease` push that pointed the branch at `master` (`7a9c196`) worked.
- *Do this:*
  - Use removal commits and reverts by default.
  - Rewrite history only on the owner's explicit request, with `--force-with-lease=<branch>:<expected sha>`, and check the result with `git ls-remote`.
  - In the sandbox, branch deletion goes through the GitHub web UI, done by the owner.
  - "Clean up" to an owner means GitHub no longer shows the branch as ahead, not just that the files are gone.
- *Encoded in:* [GUIDELINES §7](GUIDELINES.md#7-git-and-releases), [AGENTS.md §7](../AGENTS.md#7-environment-notes).

**E3. Moving code between repositories can keep its history.**

- *What happened:* the game moved from `carrier-vector-1988/baanrodmai/` to this repository's root, keeping its two commits.
- *Do this:* re-root the commits with `git commit-tree`, keeping the authors, dates and messages. Then add the changes on top.
- *Encoded in:* [APPROACH §12](APPROACH_AND_METHOD.md#12-moving-the-project-between-repositories).

**E4. Anchors break silently.**

- *What happened:* the docs cross-link about 190 places, many to headings, and renaming a heading breaks links without any error.
- *Do this:* run `npm run check:docs` after every doc edit.
- *Encoded in:* `tools/check-docs.mjs`, [GUIDELINES §8](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) (rule 19).

**E5. Keep one place per kind of fact.**

| Kind | Place |
|---|---|
| Rules | [GUIDELINES.md](GUIDELINES.md) |
| Numbers and facts | [KNOWLEDGE.md](KNOWLEDGE.md) |
| Problems | [KNOWN_ISSUES.md](KNOWN_ISSUES.md) |
| Planned work | [ROADMAP.md](ROADMAP.md) |
| Current state | [HANDOFF.md](../HANDOFF.md) |
| History | [CHANGELOG.md](../CHANGELOG.md) |
| Lessons | this file |

- *Do this:* link to a fact rather than copying it, and update every affected file in the same commit.
- *Encoded in:* [AGENTS.md §4](../AGENTS.md#4-definition-of-done).

**E6. State assumptions instead of asking many questions.**

- *What happened:* the brief allowed up to three questions. None were needed. The two values only the owner knows became placeholders (`[DOMAIN]`, `[FORECAST_APP_URL]`), and every other choice was written down.
- *Do this:* the same, and keep the placeholders until the owner provides the values.
- *Encoded in:* [AGENTS.md §6](../AGENTS.md#6-how-the-owner-works).

**E7. Deviate from the spec in the open.**

- *What happened:* pre-rendering the previews instead of drawing them in a Function was a deliberate change from the brief.
- *Do this:* name any deviation, say why, and say where the reasoning is documented.
- *Encoded in:* [03-deploy.md](03-deploy.md#why-the-link-preview-images-are-pre-rendered), [APPROACH §6](APPROACH_AND_METHOD.md#6-designing-for-sharing).

## F. Working in an AI sandbox

**F1. Point the tests at the installed Chromium.**

- *What happened:* `playwright-core` is locked at 1.63.0, which expects Chromium build 1243. The cloud image ships Chromium 141 at `/opt/pw-browsers/chromium`.
- *Do this:* run `CHROME_PATH=/opt/pw-browsers/chromium npm run smoke`. Don't download browsers there.
- *Encoded in:* [AGENTS.md §7](../AGENTS.md#7-environment-notes), [KNOWN_ISSUES #29](KNOWN_ISSUES.md#29-rendering-images-needs-a-matching-chromium).

**F2. Get assets from npm when GitHub downloads are blocked.**

- *What happened:* downloading the Kanit font from GitHub's raw file host was blocked, while the npm registry worked.
- *Do this:* use `npm pack @fontsource/kanit` and copy the Thai and Latin WOFF2 subsets.
- *Encoded in:* `public/fonts/` and its `OFL-Kanit.txt`.

**F3. Budget the web searches.**

- *What happened:* the shared search budget ran out partway through the research.
- *Do this:* plan the searches, run independent research in parallel (for example, by agency, platform and audience), confirm by fetching primary pages, and mark the rest **[unverified]**.
- *Encoded in:* [APPROACH §4](APPROACH_AND_METHOD.md#4-verifying-safety-facts).

**F4. Never work around a permission denial.**

- *What happened:* the sandbox denied reading the proxy's status page, and at first denied rewriting git history.
- *Do this:*
  - Take a safer route that is a different action, such as another source or an additive commit.
  - Otherwise stop and tell the owner what is needed.
  - Retry the denied action only after the owner explicitly asks for that outcome (see E2).
- *Encoded in:* [CLAUDE.md](../CLAUDE.md), [AGENTS.md §7](../AGENTS.md#7-environment-notes).

**F6. Cloudflare Pages must be able to see the repository.**

- *What happened:* creating the Git-connected Pages project through the API failed with code 8000012 ("linked to a repository that no longer exists") while the repository was private and the Cloudflare GitHub app could not see it. It worked once the owner made the repository public. Before that, the API token also lacked **Cloudflare Pages → Edit**.
- *Do this:* check the token with `wrangler pages project list` first. If creating the project fails with 8000012, ask the owner to give the Cloudflare GitHub app access to the repository. Don't fall back to direct upload, because a project can't switch between the two later.
- *Encoded in:* [03-deploy.md](03-deploy.md#the-live-setup).

**F7. On the owner's Windows machine the token lives in `.env`.**

- *What happened:* wrangler read `CLOUDFLARE_API_TOKEN` from `.env` by itself, but plain `curl` calls had no token and failed with "Invalid format for Authorization header".
- *Do this:* load it with `set -a; . ./.env; set +a` in the same shell command, and never print it. `.env` is git-ignored.
- *Encoded in:* this lesson.

**F5. Ignore the "repository moved" notice.**

- *What happened:* the session's remote URL is lowercase (`hazard-huntz`), while the repository is named `Hazard-huntz`, so every push prints this notice.
- *Do this:* nothing. It is harmless.
- *Encoded in:* [AGENTS.md §7](../AGENTS.md#7-environment-notes).

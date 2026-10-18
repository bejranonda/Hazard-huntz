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
- *Encoded in:* `strings.json → rankPrepare/rankReturn`, `round.js` statuses, [GUIDELINES §3](GUIDELINES.md#3-thai-and-english-copy-and-tone).

**A4. Humour about the situation spreads; suffering as content backfires.**

- *What happened:* during the Sep 2026 floods, coping humour spread fastest. AI-generated flood images and mockery of victims or rescuers drew backlash, and politics was heated.
- *Do this:* aim the humour at mud, the rope that isn't a snake, and the gecko. Use no real or AI disaster images and no politics.
- *Encoded in:* [GUIDELINES §1](GUIDELINES.md#1-non-negotiables) and [§3](GUIDELINES.md#3-thai-and-english-copy-and-tone).

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
- *Encoded in:* the build's validation, [KNOWN_ISSUES #8](KNOWN_ISSUES.md#8-21-safety-items-are-only-partially-verified).

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
  - pre-render the small, fixed set of previews (50 images: 25 Thai and 25 English)
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
- *Also:* the first deploy failed at the Function step with "You need to enable Analytics Engine" (the static files had uploaded fine). Creating the dataset `baanrodmai_events` with binding `EVENTS` in Workers → Analytics Engine fixed it. Right after the first successful deploy the domain still answered 522 for under a minute; retest before debugging.
- *Encoded in:* [03-deploy.md](03-deploy.md#the-live-setup).

**F7. On the owner's Windows machine the token lives in `.env`.**

- *What happened:* wrangler read `CLOUDFLARE_API_TOKEN` from `.env` by itself, but plain `curl` calls had no token and failed with "Invalid format for Authorization header".
- *Do this:* load it with `set -a; . ./.env; set +a` in the same shell command, and never print it. `.env` is git-ignored.
- *Encoded in:* this lesson.

**F6b. A green push is not a live site.**

- *What happened:* v1.1.0 was pushed with green CI, but the live site still served an old build because Cloudflare couldn't see the repository, until the owner granted access.
- *Do this:* after every push, check the live site for something that changed (here the version chip), not only the CI result.
- *Encoded in:* [AGENTS.md §1](../AGENTS.md#1-the-project-in-brief), [HANDOFF.md](../HANDOFF.md).

**C7. Don't let "international" take Thai away from Thai players.**

- *What happened:* a plain browser-language rule would switch many Thai players to English, because many Thais use English phone settings.
- *Do this:* default to Thai if any browser language is Thai **or** the clock is on Bangkok time; use English only otherwise. An explicit `/en/` link, `?lang=` or the toggle always wins.
- *Encoded in:* `content.js → guessLang`, the unit test "international: …", the smoke test's Thai/Bangkok default context.

**F8. Re-rendering images on a different Chromium changes every PNG.**

- *What happened:* rendering the new English previews also re-drew all Thai images with tiny pixel differences, because the sandbox's Chromium differs from the one used before.
- *Do this:* after `npm run images`, restore the images you didn't mean to change (`git checkout -- <paths>`), so commits only carry real changes.
- *Encoded in:* this lesson.

**C8. A language switch must reach every place the brand name is drawn.**

- *What happened:* v1.2.0 translated the page text and previews, but the big title, the result card and the preview images still drew the Thai wordmark; the owner spotted it in English mode.
- *Do this:* when adding a language, search for every hard-coded visible string (HTML, canvas drawing, tools) and check a screenshot of each screen in that language, including the cards and images.
- *Encoded in:* `strings.json → logoA/logoB`, `cards.js → logo`, the smoke check "English start screen shows the English wordmark".

**C9. Test the default path of the new audience, and time the first paint.**

- *What happened:* an English browser opening `/` sees the Thai page for about 0.9 s before the script switches to English and rewrites the address to `/en/`. It was found only by timing the wordmark text after load, not by any functional check.
- *Do this:* when a page changes language after load, measure what is on screen over time. Fix it at the server (redirect or separate HTML), not by hiding content.
- *Fixed in v1.3.1:* an inline script sends visitors from abroad to `/en/` before anything is drawn ([KNOWN_ISSUES F23](KNOWN_ISSUES.md#fixed)). Search bots are excluded, so the Thai page stays indexed.

**C11. Grow the content and the way to find it together.**

- *What happened:* v1.4.0 added three lessons on request (EM balls, diarrhoea, eye infections) and the owner asked to organise the knowledge for a better journey. A flat list of 43 lessons is hard to browse, and a collection that locks health answers would be wrong during a disease warning.
- *Do this:* give every lesson a topic, show progress per topic (fun), and keep every answer one tap away on `/learn` (safety). Put the topic in the news on the start screen, and take it down when the news fades (since v1.6.0 with an end date, so it goes by itself; see C16).
- *Encoded in:* `config.topics`, `config.featuredTopic`, GUIDELINES rules 39–42, smoke checks for the topic book and the featured card.

**C12. A placement can bring back a fixed bug.**

- *What happened:* the EM-ball puddle first went into the unused `drain-out` slot. The overlap probe jumped from 0% to 9% of houses (worst 22%), because that slot sits close to three floor slots. Moving it to `floor-big` brought it back to 0%.
- *Do this:* run `npm run probe` after any new item or slot, not only after slot edits.
- *Encoded in:* the definition of done in AGENTS.md (probe for slot or item changes).

**C10. Passing checks don't mean a screen looks right; look at it as a visitor.**

- *What happened:* in v1.3.0 all 45 smoke checks passed while the combo text ran off the right edge of the room and the challenge-target chip covered the gecko's speech bubble on a 320 px phone. A one-off visitor probe (Thai and English, a perfect round, a challenge win, the smallest phone) and its screenshots found both.
- *Do this:* after UI work, play the new paths as a visitor in both languages and on the smallest phone, and look at every screenshot. Turn what you find into a rule or a check.
- *Encoded in:* [GUIDELINES §8, rules 36–37](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); smoke checks for the target in the gauge and the replay order.

**F5. Ignore the "repository moved" notice.**

- *What happened:* the session's remote URL is lowercase (`hazard-huntz`), while the repository is named `Hazard-huntz`, so every push prints this notice.
- *Do this:* nothing. It is harmless.
- *Encoded in:* [AGENTS.md §7](../AGENTS.md#7-environment-notes).

**C13. Make the second thing generic before adding the third.**

- *What happened:* v1.5.0 added dust and fire to a game written for two flood modes. An inventory found about 30 places that assumed "prepare or return": three would crash on a new mode, several silently fell back to `prepare` (challenge links, cards, rounds), and five route patterns hard-coded `p|r`.
- *Do this:* first refactor to a registry with only the existing modes and prove nothing changed (244 flood houses compared byte for byte, all tests green), then add the new modes as data. Let the build fail on any missing per-mode string, round setting, checklist or start button.
- *Encoded in:* `config.json → modes`, `public/js/modes.js`, the per-mode checks in `tools/build.mjs`, [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode).

**B7. News articles keep old numbers after the rules change.**

- *What happened:* a 2022 PPTV article quoting the Department of Health gives the PM2.5 colour ranges from before Thailand's 2023 change; a 2026 article uses the new thresholds (37.5 and 75 µg/m³).
- *Do this:* when two sources disagree on a number, teach what they share (the colour order, "red: at-risk groups stay in") and leave the number out. Note the disagreement in the source's `note`.
- *Encoded in:* `doh-mask-2565` note, [GUIDELINES rule 45](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES #46](KNOWN_ISSUES.md#46-dust-and-fire-advice-is-quoted-through-news-reports).

**B8. Some international pages can't be read by a fetch; find the plain-HTML twin.**

- *What happened:* NFPA's fire-safety pages render only with JavaScript, so the fetch returned just a title. The US Fire Administration publishes the same advice as plain HTML with a "last reviewed" date.
- *Do this:* don't cite a page you couldn't read. Look for another official body with the same advice, and record when you read it.
- *Encoded in:* `usfa-cooking-2569`, `usfa-alarm-2569`, [KNOWLEDGE §22.5](KNOWLEDGE.md#225-house-fire-sources-and-what-each-lesson-rests-on).

**C14. An effect that passes every check can still be invisible.**

- *What happened:* the first dust haze (tan at 55% opacity) was applied correctly, as the DOM showed, but on beige walls it looked like nothing had happened. Only the screenshots showed it.
- *Do this:* for any new visual effect, screenshot each room at the start, middle and end, and compare. Give a full-screen tint some texture (here, drifting specks) so it reads as the thing it shows.
- *Encoded in:* [GUIDELINES rule 46](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

**C15. Test a deploy over the version people already have.**

- *What happened:* every check passed on a fresh browser, but the owner, whose browser had played v1.4.0, tapped the new dust mode and got the flood house. The service worker refreshed the page and content but kept the old code, and old code met new content. Fresh-profile tests can never see this.
- *Do this:* before a release that changes code and content together, install the previous release in a test browser, switch the server to the new build, and play the new feature on the first visit. Keep code and content on the same caching rule, and give the code a version it can check.
- *Encoded in:* `tools/sw.template.js` (network-first code), `js/version.js` and `refreshStaleApp()` in `main.js`, a smoke check, [GUIDELINES rule 48](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

**D9. "It's on the page" is not "it's on the screen".**

- *What happened:* for five versions every smoke check passed while the result's share button, the main goal of the game, sat below the fold on every phone (738 px down on a 664 px LINE screen). The checks asked whether the button existed and was 44 px, never where it was.
- *Do this:* for each step of the funnel, measure the next button's position against the screen height on small and in-app sizes (320 × 460, 360 × 640, 390 × 664), and add a check for the ones that matter.
- *Encoded in:* three smoke checks (share button, LINE in the share sheet, challenge accept), [GUIDELINES rule 49](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWLEDGE §23](KNOWLEDGE.md#23-the-visitor-funnel-measured-v152).

**C16. A manual switch needs an end date.**

- *What happened:* in mid-October the rain warning (`rainWarningActive`) and the news topic (`featuredTopic: "health"`) were switched on by hand. Neither had an end. Nobody would have noticed in December: the start screen would still have said "ฝนจะมาอีกระลอก", put the flood mode first and featured diseases after floods, in the middle of the dust season. No check would have caught it: the tests read the same config, and nothing compared the switches with the date.
- *Do this:* give every hand-set switch the last day it should show (`rainWarningUntil`, `featuredTopicUntil`, a Bangkok date, that day included), so a forgotten switch ends by itself. Let the build warn about a switch with no end date or a past one, and print what visitors see today.
- *Encoded in:* `switchOn()` and `recommend()` in `modes.js`, the build's checks and its `start` line, a unit test for the last day and the day after, [GUIDELINES rule 51](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES #44](KNOWN_ISSUES.md#44-the-featured-topic-is-switched-by-hand).

**D10. A test that reads the calendar fails by itself.**

- *What happened:* the smoke test ran on the real date with the live config. It expected the FloodWatch link, which is right only while a flood mode is recommended, and checked whatever `config.featuredTopic` said. Once the rain switch ended or the topic was switched off, it would have failed (and waited 30 s for a missing card) with nothing wrong in the game: only the calendar or the config had moved on. Faking the clock with Playwright's clock API was not an option, because it also fakes the timers and `requestAnimationFrame` that the rounds run on.
- *Do this:* pin the date a test runs on, and take the expected result from the same pure function the game uses, so the test and the game can't disagree about the rules. Shift only `Date` in the page (time keeps running). To check another season, run the test again with another date. Keep real-date problems (an expired switch) in the build, which runs on the real date.
- *Encoded in:* `SMOKE_DATE` and `pinDate()` in `tests/smoke.mjs`, `recommend()` in `modes.js`, [GUIDELINES rule 52](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES #53](KNOWN_ISSUES.md#53-the-smoke-test-runs-on-a-pinned-date).

**C17. What the game never uses doesn't belong in what it loads.**

- *What happened:* the carousel's frame text first went into `strings.json` and its drawing code into `cards.js`, both downloaded by every visitor before the start screen. The build's budget line went from 188 to 191 KB for words and code no player ever uses.
- *Do this:* read the budget line after every change. Put text for posts, tools or pages outside the game in its own file that the game doesn't fetch and the service worker doesn't precache, and put tool-only code in `tools/`.
- *Encoded in:* `public/content/carousel.json` (left out of the precache in `tools/build.mjs`), `tools/carousel-draw.mjs`, [GUIDELINES rule 53](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

**B9. A viral infographic is a prompt, not a source.**

- *What happened:* the owner shared a Thai stockpiling infographic that was spreading on social media ("72 hours minimum, aim for 7 days", "eat old stock first", "when the power is out eat fridge → freezer → canned", "a manual can opener"). It named no agency. Checked claim by claim: the 3 days matched Thai agencies (PRD, ปภ., กรมอนามัย); the can opener, the fridge and freezer times and "replace what's expired" were found only at foreign agencies (Ready.gov, the US CDC, Tokyo); the 7 days were Tokyo's alone; and no agency gave the eating order or a 3–6-month check. The generic texts also turned out to say "every tip comes from Thai agencies", which these lessons would have made plainly false.
- *Do this:* keep what an agency backs, flag what only a foreign agency backs (⚠️, with the reason in `verifyNote` and on the carousel image), and drop the rest, however widely it is shared. Where the post's idea is right but has no source (an eating order), teach the sourced fact that leads to it (the fridge is lost at 4 hours, the freezer lasts 48). Then re-read every sentence that describes the game as a whole.
- *Encoded in:* the power-cut lessons and their `verifyNote`s, [KNOWLEDGE §27.2–27.3](KNOWLEDGE.md#273-what-was-left-out-and-why), [GUIDELINES rule 55](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES #55](KNOWN_ISSUES.md#55-the-power-cut-lessons-rest-largely-on-international-guidance).

**D11. A forced click can't see what covers the button.**

- *What happened:* from v1.0 the ‹ room arrow covered part of the item on the fridge: up to 23 % of `p-numbers` and later `f-call`, and 27 % of the new fridge in v1.7.0, at 390 × 760. A player who tapped that part turned the room instead. Every smoke check passed in every release from v1.0 to v1.6.1, because the test clicked items with Playwright's `force: true`, which skips the check that the element would receive the click. The tap-size checks measured each item, never what lay on top of it. It was found while building the power-cut mode, whose fridge uses the same slot.
- *Do this:* treat `force: true` as a known blind spot. For tap targets under floating controls, measure the overlap (the boxes of the overlay and of the item's hit area) or click without `force`, in every mode and room on the small screens people use. When the fix is moving a slot, keep its id so houses don't change, and re-run the probe, because a new height changes when water or smoke arrives.
- *Encoded in:* the smoke check "the room arrows cover at most 5% of any item's tap area (every mode, 3 houses, 390x760 and 360x640)", [GUIDELINES rule 54](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit), [KNOWN_ISSUES F38](KNOWN_ISSUES.md#in-v170-19-oct-2026).

**E8. A probe run from the repository root ends up in a commit.**

- *What happened:* while building v1.7.0, a one-off layout probe was run from the repository root. It saved a screenshot of the start screen's mode names to `v16/names-360.png`, inside the repository, and `git add -A` committed it with the release (`32a2834`). It held no personal data; a removal commit took it out (`189a47c`). CI didn't notice and couldn't have: its "generated but not committed" step fails only on untracked files under `public/`, and once a stray file is committed it is tracked anyway.
- *Do this:* run one-off probes from the session scratchpad and write their output there, never under the repository. Before every commit, read `git status --short` and stage files by name, not with `git add -A`. Commit a probe only when it is reusable, as `tools/probe.mjs`.
- *Encoded in:* [AGENTS.md §7](../AGENTS.md#7-environment-notes) (scratch work), [CLAUDE.md](../CLAUDE.md), [GUIDELINES §7](GUIDELINES.md#7-git-and-releases) (before committing).

**D12. Test a card with the longest text it accepts.**

- *What happened:* the first version of the family plan card (v1.8.0) left out its sixth row when the entries were long. The picture still looked finished, so nothing told the family that a field, here their medicine, was missing from the card they would save on every phone. Short test entries never showed it.
- *Do this:* when a card draws text people type, fit it by shrinking the whole block together (here in steps of 6 %, never below 64 %, one line per value below 80 %) rather than dropping or silently cutting the last part. Then fill every field to its `maxlength`, in Thai and in English, and count what was drawn (a probe can wrap `CanvasRenderingContext2D.fillText` and compare the drawn lines with the input).
- *Encoded in:* `drawPlanCard()` in `public/js/kit.js`, [KNOWLEDGE §28.7](KNOWLEDGE.md#287-the-two-cards-1080--1350). The longest-input check was a one-off probe on 19 Oct 2026 (every row and character drawn); it is not in the smoke test yet.

**D13. Measure a sheet after it has finished sliding in.**

- *What happened:* on 19 Oct 2026 CI's smoke job failed once on a docs-only commit (`51defd8`): "checklist, help and about controls >= 44 px (สายด่วนนิรภัย 17: 44 px)". The About sheet's source links are laid out at exactly 44 px (`min-height: 44px`). The check measured them right after the sheet appeared, while its 0.22 s slide-in (`translateY`) was still running, and CI's Chrome 153 returned a height just under 44. The same code passed before and after; Chromium 141 in the cloud session never showed it over 15 openings.
- *Do this:* measure sizes once animations on the element being checked have ended, and allow only floating-point rounding (0.01 px), not a pixel. Print sizes with two decimals so a real 43.5 px control isn't shown as "44 px". A one-off red run on unchanged code is a timing bug to find, not a flake to re-run.
- *Encoded in:* `smallControls()` in `tests/smoke.mjs` (waits for `#sheet`'s animations, then flags anything under 43.99 px).

**E9. A sweep finds only what it searches for.**

- *What happened:* v1.5.0 wrote the start screen's tagline, "เกม 60 วิ ดูแลบ้านให้รอด จากน้ำท่วม ฝุ่น และไฟ" / "… from floods, dust and fire", and the manifest's description for three hazards. v1.7.0 added the power cut and, following [B9](#b-safety-content-and-research), re-read the texts that describe the whole game, but it searched them for "Thai agencies", the claim the new lessons made untrue, not for what the game covers. v1.8.0 added the home check. The tagline, which every visitor sees first and every generated page copies, and the manifest's description still described three hazards until the v1.8.1 visitor audit read them ([KNOWN_ISSUES F42](KNOWN_ISSUES.md#in-v181-19-oct-2026)).
- *Do this:* when a mode or a tool is added, list every place that says what the game is about and read each one in both languages: the tagline (`strings.json` and the static copy in `index.html`), `index.html`'s `<title>` and meta description, the manifest's name and description, the default preview texts and image, the About text, `/learn`'s title, description, heading and intro, `seo.en.llmsSummary` and the `llms.txt` lines, the JSON-LD `about` in `tools/build.mjs`, and `package.json → description`. Search for the old hazard list ("ฝุ่น และไฟ", "dust and fire") as well as for the new words, and look at the start screen as a visitor.
- *Encoded in:* [GUIDELINES rule 59](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) and step 9 of [GUIDELINES §10](GUIDELINES.md#10-adding-a-hazard-mode).

**B10. Copy written from a source takes on the source's English.**

- *What happened:* the game's English is British: the flood lessons say "torch" (`p-torch`), "power cut" and "litres", and the home check "nappies". The power-cut lessons (v1.7.0) rest mostly on American pages, which say "Use flashlights, not candles, if you have a power outage" (US Fire Administration) and "Have flashlights for every household member" (Ready.gov), and their English followed those words: "flashlight" in `s-candle`, `s-torch` and `s-radio`, "power outage" in `s-candle`'s why, "flashlight" in the gecko's line, the checklist, the hazard page's description and the home check (v1.8.0), and the rank "Ready for Any Blackout". In the 🎒 topic list on `/en/learn`, "Torch and spare batteries" sat next to "A flashlight with flat batteries". The home check also said "house" in its title and "home" on its buttons. No check looks at word choice, and the English has had no native reader yet ([KNOWN_ISSUES #11](KNOWN_ISSUES.md#11-thai-and-english-copy-need-a-second-native-reader)); the v1.8.1 visitor audit, reading `/en/` screen by screen, found it ([F43, F44](KNOWN_ISSUES.md#in-v181-19-oct-2026)).
- *Do this:* quote a source in its own words in `sources.json → note`, then write the lesson in the game's English. Before a release, search the English text for the other variety's words ("flashlight", "outage", "blackout", "diaper", "liter", "color", "-ize") and for two names of one thing in a tool, and read the new English next to the old, for example the topic lists on `/en/learn`.
- *Encoded in:* [GUIDELINES rule 58](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) and [§3](GUIDELINES.md#3-thai-and-english-copy-and-tone).

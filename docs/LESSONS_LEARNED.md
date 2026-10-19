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
- *Again in v1.9.0, caught before the commit:* a probe was started by its absolute path (`node /…/scratchpad/probe/x.mjs`) while the shell stood in the repository, and its relative output path (`v19/…png`) landed in the repository root. `git status --short` before staging showed it; it was moved out. Give probes absolute output paths, not relative ones.
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

**A6. The product people need is the list, not the game.**

- *What happened:* for eight releases the start screen led with the game, and the checklists, the home check and the plan card were buttons beside it. On 19 Oct 2026 the owner reframed it: nobody knows which hazard comes next, trends start suddenly, people want to know what to prepare and what to do, and the game should help them remember, not stand between them and the answer ("It should not force everyone to play the game; it is a tool to help them"). An earthquake, a storm or a heatwave in the news had nothing in the app to send, because each hazard waited for a game mode, which takes art, slots and a probe.
- *Do this:* start from what a visitor needs in the next minute: what to do, what to keep, who does what, for any hazard. Ship that as a short sourced guide first; build a game for a hazard only when it adds memory, not access. Keep the tools on the first screen and accept that the game moves down. When a new topic is in the news, the answer is a guide and an alert, not a new mode.
- *Encoded in:* the start screen's hub and `config.json → guides` and `alert` ([KNOWLEDGE §29](KNOWLEDGE.md#29-tools-first-a-guide-for-every-hazard-v190)), [GUIDELINES rules 61–63](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) and [§10](GUIDELINES.md#10-adding-a-hazard-mode) step 0, [KNOWN_ISSUES #61](KNOWN_ISSUES.md#61-the-game-card-is-below-the-first-screen-on-small-phones).

**B11. Sources disagree more than you expect, once you read them side by side.**

- *What happened:* researching the four new guides (v1.9.0), advice that "everyone knows" split the sources. In lightning, ปภ. says unplug everything and stop using phones; the US National Weather Service says don't unplug during a storm (you could be struck) and that mobile phones are fine indoors. After an earthquake, ปภ.'s 2025 statement says leave a tall building at once and กรมอนามัย ties it to strong shaking, while ปภ.'s 2019 statement and กรมทรัพยากรธรณี say leave after the shaking stops. In the heat, กรมอนามัย, WHO and the US CDC give different water amounts and different rules for fans and windows. Each looked settled when only one source was open.
- *Do this:* give every line at least two sources where you can, and read them against each other before writing the line. When they disagree, keep the part they share (storm #8: "don't use what is plugged in", which all of them say), leave the rest out, and write down why in the source's `note` and the guide's record of what was left out, so the next person doesn't add it back. Never pick the foreign or the Thai figure because it is shorter or newer.
- *Encoded in:* the `note`s of `ddpm-storm-2561`, `nws-lightning-indoors`, `doh-quake-2566`, `doh-elders-water-2565`, `who-heat`, `readygov-heat` and `cdc-heat-about`; [KNOWLEDGE §29.4](KNOWLEDGE.md#294-what-was-left-out-and-why); [GUIDELINES rule 62](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit) and [§2.2](GUIDELINES.md#22-numbers).

**D14. Measure where a line starts, not the bottom of what carries it.**

- *What happened:* the smoke check that a guide-only hazard page shows advice on the first screen at 320 × 460 (v1.9.0) first measured `getBoundingClientRect().bottom` of the first list item. On those pages each line carries its sources under it, one 44 px link per source, so the item's bottom sat far below the line's own text, and the check reported the first line off the first screen on pages where the line itself started on it. Whether the visitor sees advice depends on where the line begins, not on how long its sources run.
- *Do this:* decide what "visible" means for the visitor (here, the first line of advice starts on the first screen), and measure that point: the element's top plus one line (48 px). When an element can grow with content (sources, notes, translations), measuring its bottom tests the content's length, not the layout.
- *Encoded in:* the smoke check "hazard pages, /kit, /plan and /learn on 320x460: controls >= 44 px, the play button (or a guide's first line) on the first screen" in `tests/smoke.mjs` (`top + 48` on a guide-only page), [KNOWN_ISSUES F51](KNOWN_ISSUES.md#in-v190-19-oct-2026).

**D15. A remembered choice changes the page the next test opens.**

- *What happened:* the smoke check that an alert set to `storm` shows its card and opens the storm guide (v1.9.0) failed twice ("false false") with correct code. The page it opened before was `/en/checklist/heat`, the game remembers the visitor's language, so the start screen came up in English, and the check looked for the Thai name "พายุ ฟ้าผ่า".
- *Do this:* a test that follows a visitor through several pages in one browser carries what the visitor chose (language, ticks, answers, the safety book) from page to page, as a real visitor's browser does. Either start that check in a fresh context, or expect what that visitor would see (here, the card in either language), and say which in a comment. Test the visitor's path, not an imagined fresh page.
- *Encoded in:* the check "an alert set to "storm" shows its card, and the card opens the storm guide" in `tests/smoke.mjs` (accepts `guideStorm` in Thai or English, with the comment "the page before was English, and the language choice is remembered").
- *Since v1.9.1* an English page is no longer remembered, only a choice made with the language button or `?lang=` ([KNOWN_ISSUES F61](KNOWN_ISSUES.md#in-v191-19-oct-2026)): the visitor's own browser had the same problem as the test, and Thai links opened in English after one look at `/en/`.

**D16. A test stub kinder than the browser hides the bug.**

- *What happened:* from v1.0 to v1.9.0, sharing to LINE, Facebook or X sent the game's own tab away as well as opening the share page, so Back lost the result and the challenge back. `openExternal()` asked for `window.open(href, '_blank', 'noopener')` and fell back to `location.href` on `null`; by the HTML specification that call always returns `null`. No smoke check followed a share to LINE and then looked at the game's tab, and nothing in the tests returned `null` from `window.open` the way browsers do with `'noopener'`; the easy stub to write, one that returns a window, would have hidden the bug too. The v1.9.1 audit found it by sharing the way a person does ([KNOWN_ISSUES F55](KNOWN_ISSUES.md#in-v191-19-oct-2026)).
- *Do this:* make a stub return what the real API returns, read from the specification or a real browser, including the awkward cases (`null`, a rejected promise, a missing feature). Then prove the new check: run it against the code before the fix and watch it fail. The share check, with a stub that returns `null` for `'noopener'`, sent the tab to line.me with the old `share.js` and kept it with the new one.
- *Encoded in:* [GUIDELINES rules 66 and 74](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the smoke check "sharing to LINE opens one new tab; this tab stays" in `tests/smoke.mjs`.

**D17. Measure the house people are playing this week.**

- *What happened:* the flood's water curve had not changed since v1.0, and the probe's table of when each item could flood looked fair. The v1.9.1 audit played the daily house of 18 Oct 2026, the one visitors were actually getting, and a careful player who read every tip lost the round at 15.9 s of game time with 5/10, every target under water by 26.8 s. Over 90 houses, it was the harshest; 32 % of all targets flooded before 20 s ([KNOWN_ISSUES F75](KNOWN_ISSUES.md#in-v191-19-oct-2026)).
- *Do this:* play today's house and this week's houses as a careful first-time player, not only a typical house or a table of per-item timings, and measure the spread over a few months of houses (first flood, how many targets go under before a player could reach their room). A range per item can look fair while one combination of slots is not.
- *Encoded in:* the unit test "flood pace: no target goes under in the first 20 s, and never all of them before 30 s" (120 days), [KNOWLEDGE §30.8](KNOWLEDGE.md#308-the-floods-pace).

**C18. A span added for typography inherits every "any span inside" rule.**

- *What happened:* v1.9.1 wraps Thai words that must not break in `<span class="nw">` (C19). Four old CSS rules matched any descendant span: `.quick-btn span:first-child` (the button's icon, 22 px), `.book-grid span` (a badge, `position: absolute`), `.stats span` (a pill) and `.alert-btn span:nth-child(2)`. The kept word "ช่วยเหลือ" in the "เบอร์ช่วยเหลือ" button came out at 22 px. The text was right, so a text check passed; it was found in our own review before release ([KNOWN_ISSUES F82](KNOWN_ISSUES.md#in-v191-19-oct-2026)).
- *Do this:* style an element by its class or as a direct child (`.quick-btn > span:first-child`), never "any span inside". When code adds wrapper elements to existing text, compare their computed style with the text around them (font size, position, display, padding, border), on every screen where the text appears.
- *Encoded in:* [GUIDELINES rule 72](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the smoke check "kept Thai words look like the text around them (guide, start screen, safety book)", which fails with the v1.9.0 selectors.

**C19. Invisible characters inside Thai text change what the dictionary sees.**

- *What happened:* Thai words broke across lines ("กระ|จก", "ไฟ|ดับ"), because the browser's line breaker uses a dictionary that splits some compounds, and `word-break: keep-all` has no effect on Thai in Chromium. The first fix put a word joiner (U+2060) inside the broken words. It fixed one break and made two: the joiner splits the run of letters the dictionary reads, so it moved the break next to the word ("ขอ|งกรมอุตุฯ", "บ้า|นที่เสี่ยง"), and it would have put invisible characters into text people copy and search ([KNOWN_ISSUES F57](KNOWN_ISSUES.md#in-v191-19-oct-2026)).
- *Do this:* leave Thai text as it is and use markup: a `white-space: nowrap` span around the word. In a flex or grid container, wrap the whole line once, or each piece becomes a flex item and a gap opens. Check the result with a wrap dump of every line at 320 and 360 px, not one screenshot.
- *Encoded in:* `config.json → keepTogether`, `util.js → keepWordsIn`, the build's `keepHtml`, `cards.js → tokens()`; [GUIDELINES rule 68](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); [KNOWLEDGE §30.1](KNOWLEDGE.md#301-thai-words-that-must-not-break-keeptogether).

**C20. An SVG layer moved in from outside the picture may never be painted.**

- *What happened:* the fire mode's smoke was a tall rectangle that started above the room's viewBox and was moved down with a `transform` as the round went on. On 360 × 640, 375 × 667 and 320 × 460 it was never drawn, while the gecko said "ควันลงมาต่ำแล้ว!"; at 390 × 844, where most screenshots were taken, it was fine. Reproduced in headless Chromium ([KNOWN_ISSUES F58](KNOWN_ISSUES.md#in-v191-19-oct-2026)).
- *Do this:* change the geometry (the rectangle's `height`, the path's `d`) rather than only translating a shape that starts outside the visible area, and look at every threat layer at the smaller phone sizes, mid-round.
- *Encoded in:* `scene.js → setThreat()`; [GUIDELINES rule 73](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the smoke check "fire: the smoke is drawn on a 360x640 screen".

**E10. Image re-renders produce pixel noise: compare pixels, commit only what you meant.**

- *What happened:* v1.9.1 re-rendered the pictures after the Thai line-break fix. `npm run images` rewrote many more files than the fix touched: the icons, the challenge previews `og/p*.png` and `og/r*.png` and one carousel page came back with different bytes but no visible change. Measured pixel by pixel, they were noise; the files whose Thai now wraps between words (three checklist pictures, seven carousel pages) and the renamed plan previews were real changes.
- *Do this:* after a render, compare old and new images by pixels (count the changed pixels and look at where they are), commit only the images that changed on purpose, and restore the rest with `git checkout -- <path>`, **by exact names**: restoring the noisy `og/p*.png` with a glob also restored `og/plan.png`, whose new text was a real change, and only the docs review caught it before the commit. This extends [F8](#f-working-in-an-ai-sandbox): noise comes not only from a different Chromium.
- *Encoded in:* [GUIDELINES §7](GUIDELINES.md#7-git-and-releases), release checklist step 3.

**E11. Audit the live site with several auditors at once, then check every claim before fixing.**

- *What happened:* for v1.9.1 three audit agents walked the live site in parallel, each with its own journey (the tools; the game and the share loop; the pages and previews), with analytics blocked so they wouldn't count as visitors. Between them they found the share bug, the back button, the fire smoke, the Thai breaks, the flood's pace and the pages' order, more than one walk had found. Not every claim held: one reported Cloudflare's beacon as a third-party script against the privacy rules; it was the owner's own Web Analytics, which the rules allow.
- *Do this:* split an audit by journey so auditors don't repeat each other, give each the same rules (sizes, languages, what counts as a finding, where to save screenshots), and have one lead re-check every finding before it becomes work: open the screenshot, read the code, reproduce the bug. Group the fixes for the owner (bugs, pages, game, content) and leave content that needs a native speaker for that review.
- *Encoded in:* [APPROACH §28](APPROACH_AND_METHOD.md#28-visitor-audit-2-three-auditors-in-parallel-v191), [ROADMAP N19](ROADMAP.md#n19-visitor-audit-2).

**D18. Fixing a tell can create the opposite tell: measure the distribution, not only the old symptom.**

- *What happened:* the right answer was the longest choice in 71 of 82 sets in Thai, so it could be picked without reading. Rewriting every wrong answer to be longer would have made the right one almost never the longest, and "never pick the longest" would have worked just as well. v1.9.2 counted where the right answer ranks by length (longest, middle, shortest) and left one drafted rewrite out in 14 sets, so that it is still the longest now and then, by a hair: Thai 17 / 40 / 25, English 16 / 37 / 29 ([KNOWN_ISSUES F83](KNOWN_ISSUES.md#in-v192-19-oct-2026)).
- *Also:* length wasn't the only tell. Each answer drew an icon for its kind of action, and the right one was the odd icon out in 26 of the 42 sets that had one, mostly because the wrong answers shared the clock of "leave it". The buttons now show ก ข ค ([F90](KNOWN_ISSUES.md#in-v192-19-oct-2026)).
- *Do this:* when a fix removes a pattern a player (or a test, or a search engine) can exploit, measure the whole distribution after the fix and ask what the new pattern is. Look at everything drawn on the choice, not only its words. Test a range, not a single limit.
- *Encoded in:* the unit test "the right answer is not given away by its length (KNOWN_ISSUES #66)" (the longest in 10–33 % of sets, never by a wide margin); [GUIDELINES rule 75](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit).

**B12. Copy drafted by agents needs a read against each item's own facts.**

- *What happened:* three agents drafted the new wrong answers from one brief, and most drafts were good. One wasn't: `p-phone`'s draft said the battery was "still half full", while the item's context says 15 %. Read alone, the draft sounded fine; read next to the question the player sees, it contradicted it. Other drafts proposed shortening three right answers (`r-gas`, `r-tap`, `r-cupboard`), which would have reworded sourced advice; and one agent dropped its own draft for `s-plugs` ("leave them plugged in but switched off") because it was half right against Ready.gov's "turn off or disconnect" ([KNOWLEDGE §31.1](KNOWLEDGE.md#311-wrong-answers-that-dont-give-the-right-one-away)).
- *Do this:* have one person (the lead) read every draft beside its item's `context` and `feedback`, and the right answer's source; reject any change to a right answer; ask each drafter to flag a draft it isn't sure of rather than ship it.
- *Encoded in:* [APPROACH §29](APPROACH_AND_METHOD.md#29-answers-drafted-in-parallel-read-by-one-lead-v192), [GUIDELINES §2.3 and rule 75](GUIDELINES.md#23-wrong-answers-and-feedback).

**D19. A probe that edits the page must survive the app's own changes to it.**

- *What happened:* to see whether the longer answers fit, a scratch probe wrote every item's labels into the real choice sheet and measured it. Its first run said 6 Thai sheets needed scrolling; the truth was 1. The app's keep-together observer (`observeKeptWords`, v1.9.1) had wrapped kept Thai words of the earlier labels in spans, so the probe's later writes left old text behind and the sheets looked taller than they were.
- *Do this:* know what the app does to the page by itself (observers, timers, re-renders) before a probe changes it. Rebuild the element for each case, or let the app open it as a visitor would, and look at one result by eye before trusting a count.
- *Encoded in:* [KNOWLEDGE §31.7](KNOWLEDGE.md#317-choice-sheets-on-short-screens).

**D20. Run a new test file once before trusting its result.**

- *What happened:* v1.9.2 added smoke checks for the back button and the lettered answers. A second `const home` in `tests/smoke.mjs` made the whole file a `SyntaxError`, so not one check ran, old or new. The first run showed it, and the name was changed.
- *Do this:* after adding checks, run the file once and read the count it prints: it should be the old count plus the new checks (134 + 4 = 138 in v1.9.2). A file that doesn't parse runs nothing, and a check that never ran proves nothing; in CI or a script that hides the output, look for the count, not only the exit.
- *Encoded in:* [06-test-checklist](06-test-checklist.md#automated-run-before-every-release) (each run ends with its own count).

**C21. Read what the host adds to the page before writing a script policy.**

- *What happened:* v1.9.2 added security headers. A full Content Security Policy with `script-src 'self'` looks like the safe choice, but Cloudflare injects inline scripts into the pages it serves (the Web Analytics beacon and the zone's JavaScript detections), which such a policy would block, or allow only through hashes that Cloudflare can change at any time. So the policy covers framing, plugins, `<base>` and forms, and leaves scripts alone ([KNOWN_ISSUES F88](KNOWN_ISSUES.md#in-v192-19-oct-2026)).
- *Do this:* look at the live HTML (and its headers) before writing a header that limits what the page may load, and check the live headers again after the deploy. Prefer a smaller policy that can't break the site to a full one that breaks what the host adds.
- *Encoded in:* [GUIDELINES rule 76](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the unit test "security headers: …", which fails on a `script-src`.

**C22. Edit a shared structure by id, not by position.**

- *What happened:* the build makes the English start page's JSON-LD by copying the Thai `@graph` and changing two nodes by their place in the list (`[0]` the website, `[1]` the game). v1.9.2 inserted the publisher at `[1]`, so on `/en/` the publisher got the game's English description and addresses, and the game kept the Thai ones. Nothing failed: the JSON was valid and the page looked the same. It was found in our own review of the built pages, before release ([KNOWN_ISSUES F91](KNOWN_ISSUES.md#in-v192-19-oct-2026)).
- *Do this:* when code changes an item in a list it didn't just build (graph nodes, config entries, table rows), find it by its id (`@id`, `id`), not its index; and after inserting into a shared structure, search for every place that reads it by position. Check generated output, not only that it parses.
- *Encoded in:* `tools/build.mjs` (the English game node found by `@id`); the unit test "structured data: one publisher, and each start page describes the app in its own language".

**A7. A number without its unit is two different answers.**

- *What happened:* dust today (v1.10.0) takes a reading from whatever app a family uses. Some apps show PM2.5 in µg/m³, others an AQI number, and the same figure lands in different colours: on Thailand's scale AQI 152 is orange and 152 µg/m³ is red. A tool that guessed the unit would have been wrong for half its users, in either direction, and the US AQI that many weather apps show is a third scale.
- *Do this:* ask which kind of number it is, in words people see in their app ("PM2.5 (มคก./ลบ.ม.)" / "AQI ของไทย"), remember the answer, and name the scale on the result. Say what the bands are defined on (here the 24-hour average), send people with a foreign scale to the figure that has no ambiguity (PM2.5), and offer a way in that needs no number at all (the colour the app shows).
- *Encoded in:* `kit.json → air.units`, `openAir()` in `kit.js`; [GUIDELINES rule 79](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); [KNOWN_ISSUES #75](KNOWN_ISSUES.md#75-the-dust-colours-are-for-the-24-hour-average-apps-often-show-hourly-readings).

**B13. For anything about safety, round so that the answer never looks safer.**

- *What happened:* the fridge tool (v1.10.0) shows how long the power has been off and how long the food has left. Rounded to the nearest minute both ways, a fridge with 29 min 40 s left would read "30 min", and a cut of 3 h 30 min 20 s would read "3 h 30 min": each a little kinder than the truth, and always on the same side.
- *Do this:* round every safety figure towards caution: time that has passed rounds up, time that is left rounds down, a pill split in two counts as a whole one needed, a reading on a band edge goes to the band the source's own rounding rule gives (the PCD notice: one decimal, half up). Write the direction next to the code, and test the edges (15.04 and 15.05 µg/m³; 3 h 30 min 20 s).
- *Encoded in:* `span()` in `kit.js`, `medDays()` and `airLevel()` in `kitplan.js`; [GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); the unit tests of v1.10.0.

**B14. Two official sources can disagree: decide which is the main text, and say whose each line is.**

- *What happened:* for dust today, the PCD's notice in the Royal Gazette and the DOH's statement of the same year give the same five PM2.5 bands but different advice: at yellow the PCD tells everyone to spend less time on hard outdoor activity, the DOH to avoid outdoor activity; at red the PCD sends people with a chronic illness to a safe room, the DOH everyone. Both are Thai agencies and both are current, so "leave it out" (B2) would have left the tool with nothing to say ([KNOWN_ISSUES #76](KNOWN_ISSUES.md#76-the-pcd-and-the-doh-advise-differently-at-green-yellow-and-red)).
- *Do this:* pick a main text for a reason you can write down (the legal notice, the one Air4Thai follows, which separates the general public from people at risk); add the other agency's lines only where they add something, and name the agency on each such line, on screen and on the page; record the difference and the choice where a reviewer will find it. Numbers that differ still stay out (B2); wording that differs gets an owner.
- *Encoded in:* `kit.json → air.levels` (the DOH's two lines cite `doh-aqi-2566` and show "(กรมอนามัย)"); [GUIDELINES rule 81](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); [KNOWLEDGE §32.3](KNOWLEDGE.md#323-dust-today).

**C23. `Math.round` on a half hour jumps a whole step.**

- *What happened:* the fridge tool's + button (v1.10.0) first rounded the time off to the nearest hour and added one. From 3 h 30 min, `Math.round(3.5) + 1` gave 5 h, so one tap skipped the hour in which the fridge's 4 hours run out, and the half hour already counted was lost. It was found in testing, never live ([KNOWN_ISSUES F92](KNOWN_ISSUES.md#in-v1100-19-oct-2026)).
- *Do this:* a control that steps a value adds exactly its step to the value shown (3 h 30 min → 4 h 30 min), and clamps at the ends. Rounding is for display, and in the safe direction (B13), never inside the value. Test a stepper from a value between steps, not only from a whole one.
- *Encoded in:* `shift()` in `openFridge()` (`kit.js`); the smoke check "fridge: + adds an hour (4 h 30 min): …", which starts at 3 h 30 min.

**D21. Cross-check a calculator with an independent computation, not with its own function.**

- *What happened:* the unit tests of v1.10.0 call `airLevel()` and `fridgePlan()` and compare them with expected values, but a test written from the same reading of the source as the code shares its mistakes. So a scratch script was written apart from `kitplan.js`, from the sources alone (its own table of bands, its own rounding, its own hours), and compared with the app's answers: 35 of 35 dust readings (25 in µg/m³ on both sides of every edge, such as 15.04, 15.05, 37.55 and 75.05, and 10 AQI values) and 8 of 8 fridge times (0.5 to 48.5 h) agreed.
- *Do this:* for anything that turns numbers into advice, write the check from the source, not from the code: another table, another rounding, ideally another person or agent. Choose inputs on both sides of every edge and at the rounding points, and count the agreements. Keep the cases that matter as unit tests.
- *Encoded in:* the unit test "dust today: the PCD bands to the decimal, AQI too, and who gets which lines (v1.10.0)" (the edges, to the decimal); [GUIDELINES rule 78](GUIDELINES.md#8-rules-that-come-from-bugs-we-already-hit); [KNOWLEDGE §32.7](KNOWLEDGE.md#327-checks-tests-a-visitor-walk-and-an-independent-cross-check). The script itself was a one-off.

**D22. A screenshot taken during an animation looks like a broken overlay.**

- *What happened:* in the visitor walk of v1.10.0 one screenshot showed a calculator's sheet half see-through over the start screen, as if the overlay were broken. It had been taken while the sheet was still sliding and fading in (`sheet-in`, 0.22 s); taken after the animation, the same sheet was fine. The same timing had already made a size check fail once (D13).
- *Do this:* before judging a screenshot, wait for the element's animations to end (`element.getAnimations()`, then their `finished`), or turn motion off for the capture (`prefers-reduced-motion`). If a screenshot looks broken, take it again after the animation before calling it a bug.
- *Encoded in:* this lesson and [D13](#d-testing-and-verification); the walk's captures in [KNOWLEDGE §32.7](KNOWLEDGE.md#327-checks-tests-a-visitor-walk-and-an-independent-cross-check).

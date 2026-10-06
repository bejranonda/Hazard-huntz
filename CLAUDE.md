# CLAUDE.md

บ้านรอดไหม? is a 60-second Thai flood-safety web game. It is plain ES modules and SVG on Cloudflare Pages, with no framework and no runtime dependencies.

**Read before changing anything:**

- [HANDOFF.md](HANDOFF.md): current state and what is pending
- [docs/GUIDELINES.md](docs/GUIDELINES.md): rules for content, copy, art, code and git
- [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md): what is broken or limited on purpose

Rules, numbers and the content model are in [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md).

## Checks

- **Every change:** run `node tools/build.mjs` and `npm test`. Both must pass.
- **UI, CSS or sharing changes:** also run `npm run smoke`. It needs Chromium (set `CHROME_PATH`).
- **Report the real output.** Don't describe results from memory.

## Hard rules

- **Never invent safety advice, numbers or sources.**
  - Every correct action needs a source in `public/content/sources.json`.
  - Set `verify` honestly.
  - Leave out numbers that sources disagree on.
- **Content guardrails:** no drowning, deaths, injuries or real damage photos; no blame of agencies or politicians; no political, royal or religious references; humour only at the situation.
- **Privacy:** no personal data, no cookies, no new third-party scripts.
- **Tap targets:** at least 44 px. The smoke test measures this.
- **Weight:** the start screen stays under 500 KB.
- **Tips:** at most 80 characters in both Thai and English.
- **Content stays in `public/content/*.json`.** Don't hard-code new player-facing text in JS.
- **Don't hand-edit generated files:**
  - `public/sw.js` (edit `tools/sw.template.js` instead)
  - `public/c/*.html`
  - `public/checklist/*.html`
  - the `<!--OG:START-->` block in `index.html`
- **Shared links break easily.** Adding, removing or disabling items, or moving slots, reshuffles houses and breaks existing challenge links. Say so when you do it.

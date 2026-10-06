# CLAUDE.md

@AGENTS.md

All guidance for AI assistants lives in [AGENTS.md](AGENTS.md), which is imported above so that every tool reads the same rules. If the import didn't load, read AGENTS.md before doing anything else.

## Claude Code specifics

- **Cloud sessions:**
  - Run browser checks with `CHROME_PATH=/opt/pw-browsers/chromium`, and don't run `playwright install`.
  - GitHub work goes through the GitHub MCP tools, since there is no `gh` command.
- **Use the session scratchpad** for one-off probes and screenshots. Commit a script only when it is reusable.
- **If the permission system denies an action,** don't try another route to the same result. Finish the rest of the work and tell the owner what is needed. For example, a history rewrite was denied, so a removal commit was used instead. The rewrite was done later, only when the owner asked for it explicitly.

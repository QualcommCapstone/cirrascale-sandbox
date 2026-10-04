# CLAUDE.md

Read **[AGENTS.md](./AGENTS.md)** first — it's the entry point and links the
platform reference (`docs/cirrascale-platform.md`) and the `cirrascale-inference`
skill.

Quick reminders:

- All LLM calls go through `lib/cirrascale.mjs` (`complete()` / `stream()`).
- `CIRRASCALE_API_KEY` is read from env via `--env-file=.env`; never hardcode or log it.
- The platform is a **completions** API (`prompt` → `choices[0].text`), not chat.
- Zero dependencies by default. Keep `lib/planner.mjs` in sync with the planner app.

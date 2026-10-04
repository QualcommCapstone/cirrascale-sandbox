# AGENTS.md — cirrascale-sandbox

> **Start here.** Entry point for any agent or human taking over this repo.

## What this is

**cirrascale-sandbox** is a dependency-light **playground** for the **Qualcomm AI
Inference Suite** (hosted by **Cirrascale**). Plain Node ESM scripts, native
`fetch`, no framework. Use it to try things against the API before porting them
into the main platform, **cirrascale-planner**.

## Read these

1. `docs/cirrascale-platform.md` — the LLM platform: endpoint, auth, models,
   request/response shape, gotchas. **Source of truth for anything LLM.**
2. `.claude/skills/cirrascale-inference/` — the skill for making model calls.
3. `examples/prompts.md` — copy-paste commands to try.

## Layout

```
lib/cirrascale.mjs     Shared client: complete() + stream() (only caller of the endpoint)
lib/planner.mjs        buildPlannerPrompt() — prompt construction (sync with the app)
lib/scrape.mjs         Zero-dep URL -> text scraper
scripts/complete.mjs   Basic completion
scripts/stream.mjs     Streaming tokens
scripts/plan.mjs       Prompt -> structured plan (terminal version of the app)
scripts/scrape-and-plan.mjs   Scrape a page, then plan grounded in it
examples/prompts.md    Things to try
docs/*                 Steering docs
```

## Golden rules

- All inference goes through `lib/cirrascale.mjs`.
- `CIRRASCALE_API_KEY` comes from env (`--env-file=.env`); never hardcode or log it.
- Zero dependencies unless an experiment genuinely needs one — say why.
- Keep `lib/planner.mjs` in sync with `src/lib/planner.ts` in the planner app.

## Run it

```bash
cp .env.example .env            # add CIRRASCALE_API_KEY (free: aisuite.cirrascale.com)
npm run complete -- "Say hello."
npm run plan -- "Plan a weekend in Lisbon"
npm run scrape-and-plan -- https://example.com "Turn this into an action plan"
```

No `npm install` needed — Node 20+ only (native fetch, `--env-file`).

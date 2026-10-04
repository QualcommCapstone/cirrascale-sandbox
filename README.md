# cirrascale-sandbox

A dependency-light **playground** for the **Qualcomm AI Inference Suite**
(Qualcomm Cloud AI 100 Ultra) hosted by **Cirrascale**. Plain Node ESM scripts,
native `fetch`, no framework.

Sibling / main platform:
[`cirrascale-planner`](https://github.com/RishithMody/cirrascale-planner).

## Requirements

- Node 20+ (uses native `fetch` and `--env-file`). No `npm install` needed.
- A free-to-try key from **https://aisuite.cirrascale.com**.

## Setup

```bash
cp .env.example .env     # add CIRRASCALE_API_KEY
```

## Try it

```bash
npm run complete -- "Explain edge inference in two sentences."
npm run stream   -- "Write a haiku about Qualcomm chips."
npm run plan     -- "Organize a 3-day hackathon for 100 people"
npm run scrape-and-plan -- https://example.com "Turn this page into an action plan"
```

See [`examples/prompts.md`](./examples/prompts.md) for more.

## What's inside

| Path                           | Purpose                                      |
| ------------------------------ | -------------------------------------------- |
| `lib/cirrascale.mjs`           | Shared client — `complete()` and `stream()`. |
| `lib/planner.mjs`              | Prompt builder (mirrors the planner app).    |
| `lib/scrape.mjs`               | Zero-dep URL → text scraper.                 |
| `scripts/*.mjs`                | Runnable experiments.                        |
| `docs/cirrascale-platform.md`  | Full platform reference.                     |

## For agents / contributors

Start with **[AGENTS.md](./AGENTS.md)**. The `cirrascale-inference` skill in
`.claude/skills/` documents how to call the model.

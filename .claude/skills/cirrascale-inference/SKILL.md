---
name: cirrascale-inference
description: >-
  Call the Qualcomm AI Inference Suite (hosted by Cirrascale) from this Node
  sandbox. Use whenever you need to run an LLM completion, stream tokens, scrape
  a page to ground a prompt, add a new experiment script, or debug an inference
  request/response. Covers the completions endpoint, auth, request/response
  shape, model list, and the shared client in lib/.
---

# Cirrascale / Qualcomm AI Inference Suite (sandbox)

The LLM backend for this playground. A **text-completions** API (single `prompt`
string → `choices[0].text`), not an OpenAI chat API.

## When to use this skill

- Writing or editing any experiment that calls the model.
- Trying streaming, model comparisons, or scrape-then-plan flows.
- Debugging auth / request / response issues.

## The contract

```
POST https://aisuite.cirrascale.com/apis/v2/completions
Headers: Content-Type: application/json
         Authorization: Bearer <CIRRASCALE_API_KEY>
Body:    { "prompt": "...", "model": "Llama-3.1-8B", "stream": false, "max_tokens": 512 }
Reply:   { "choices": [{ "text": "..." }] }
```

Models: `Llama-3.1-8B` (default), `Llama-3.1-70B`, `Qwen2.5-7B-Instruct`.

## Rules for this repo

1. **Use the shared client** `lib/cirrascale.mjs` (`complete()` / `stream()`).
   Don't re-implement the fetch in each script.
2. **Build prompts** with `buildPlannerPrompt()` in `lib/planner.mjs` for planning
   tasks; keep it in sync with the planner app.
3. **Key via env only.** Run scripts with `node --env-file=.env scripts/x.mjs`
   (or the npm scripts). Never hardcode or log the key.
4. **Zero-dependency by default.** This sandbox uses native `fetch`. Only add a
   dependency if an experiment truly needs it, and note why.

## Run

```bash
cp .env.example .env            # add CIRRASCALE_API_KEY
npm run complete -- "Hello in one sentence."
npm run plan -- "Plan a 5k training schedule"
```

## Full reference

See `docs/cirrascale-platform.md`.

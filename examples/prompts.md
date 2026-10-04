# Example prompts to try

Run these against the sandbox once your `.env` has `CIRRASCALE_API_KEY`.

## Basic completion

```bash
npm run complete -- "Explain edge AI inference in two sentences."
```

## Streaming

```bash
npm run stream -- "Write a short limerick about Qualcomm chips."
```

## Prompt -> plan

```bash
npm run plan -- "Organize a 3-day hackathon for 100 people"
npm run plan -- "Migrate a small Next.js app from Vercel to self-hosted"
```

## Scrape a page, then plan from it

```bash
npm run scrape-and-plan -- https://example.com "Turn this page into an action plan"
```

> `npm run <script> -- <args>` forwards args after `--` to the script.
> Scripts load `.env` via Node's built-in `--env-file`.

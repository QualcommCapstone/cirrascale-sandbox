#!/usr/bin/env node
/**
 * Scrape a web page, then build a plan grounded in its content.
 * Demonstrates "use any necessary scraper" + planner together.
 *
 *   node --env-file=.env scripts/scrape-and-plan.mjs <url> "<your goal>"
 *
 * Example:
 *   node --env-file=.env scripts/scrape-and-plan.mjs \
 *     https://example.com "Summarize this page into an action plan"
 */
import { complete } from "../lib/cirrascale.mjs";
import { buildPlannerPrompt } from "../lib/planner.mjs";
import { scrapeText } from "../lib/scrape.mjs";

const [url, ...goalParts] = process.argv.slice(2);
const goal = goalParts.join(" ");

if (!url || !goal) {
  console.error('Usage: node --env-file=.env scripts/scrape-and-plan.mjs <url> "<goal>"');
  process.exit(1);
}

console.error(`Scraping ${url} ...`);
const context = await scrapeText(url);
console.error(`Got ${context.length} chars of context. Planning ...\n`);

const plan = await complete(buildPlannerPrompt(goal, context), { maxTokens: 1024 });
console.log(plan);

#!/usr/bin/env node
/**
 * Prompt -> structured plan, in the terminal. Mirrors what the main platform
 * (cirrascale-planner) does, minus the web UI.
 *
 *   node --env-file=.env scripts/plan.mjs "Launch a newsletter in 30 days"
 */
import { complete } from "../lib/cirrascale.mjs";
import { buildPlannerPrompt } from "../lib/planner.mjs";

const goal = process.argv.slice(2).join(" ");
if (!goal) {
  console.error('Usage: node --env-file=.env scripts/plan.mjs "<your goal>"');
  process.exit(1);
}

const plan = await complete(buildPlannerPrompt(goal), { maxTokens: 1024 });
console.log(plan);

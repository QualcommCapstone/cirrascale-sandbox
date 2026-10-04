#!/usr/bin/env node
/**
 * Basic completion. Pass a prompt as CLI args.
 *
 *   node --env-file=.env scripts/complete.mjs "Explain quantum tunneling in one sentence."
 */
import { complete } from "../lib/cirrascale.mjs";

const prompt = process.argv.slice(2).join(" ") || "Say hello in one short sentence.";

const text = await complete(prompt, { maxTokens: 256 });
console.log(text);

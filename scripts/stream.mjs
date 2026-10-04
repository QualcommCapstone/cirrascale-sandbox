#!/usr/bin/env node
/**
 * Streaming completion — prints tokens as they arrive.
 *
 *   node --env-file=.env scripts/stream.mjs "Write a haiku about edge inference."
 *
 * Note: streaming chunk format may need tweaking — see stream() in lib/cirrascale.mjs.
 */
import { stream } from "../lib/cirrascale.mjs";

const prompt = process.argv.slice(2).join(" ") || "Write a haiku about edge inference.";

process.stdout.write("> ");
await stream(prompt, {
  maxTokens: 256,
  onChunk: (piece) => process.stdout.write(piece),
});
process.stdout.write("\n");

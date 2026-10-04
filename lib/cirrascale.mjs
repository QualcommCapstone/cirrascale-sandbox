/**
 * Cirrascale / Qualcomm AI Inference Suite client (plain Node ESM, zero deps).
 *
 * Completions API:
 *   POST {BASE_URL}/completions
 *   Authorization: Bearer <CIRRASCALE_API_KEY>
 *   body: { prompt, model, stream, max_tokens }  ->  { choices: [{ text }] }
 *
 * See docs/cirrascale-platform.md for the full reference.
 */

export const DEFAULT_BASE_URL = "https://aisuite.cirrascale.com/apis/v2";
export const DEFAULT_MODEL = "Llama-3.1-8B";

export const KNOWN_MODELS = [
  "Llama-3.1-8B",
  "Llama-3.1-70B",
  "Qwen2.5-7B-Instruct",
];

function config() {
  const apiKey = process.env.CIRRASCALE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "CIRRASCALE_API_KEY is not set. Copy .env.example to .env and add your key, " +
        "then run with:  node --env-file=.env scripts/<name>.mjs"
    );
  }
  return {
    apiKey,
    baseUrl: process.env.CIRRASCALE_BASE_URL ?? DEFAULT_BASE_URL,
    model: process.env.CIRRASCALE_MODEL ?? DEFAULT_MODEL,
  };
}

/** Non-streaming completion. Returns the generated text. */
export async function complete(prompt, { model, maxTokens = 512 } = {}) {
  const cfg = config();
  const res = await fetch(`${cfg.baseUrl}/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      model: model ?? cfg.model,
      stream: false,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Cirrascale request failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Unexpected response shape (no choices[0].text): " + JSON.stringify(data));
  }
  return text.trim();
}

/**
 * Streaming completion. Calls `onChunk(text)` as pieces arrive and resolves with
 * the full text. The endpoint streams Server-Sent-Events-style `data:` lines;
 * exact chunk shape can vary, so we defensively pull text from a few spots.
 * VERIFY against the live API and adjust the parsing if needed.
 */
export async function stream(prompt, { model, maxTokens = 512, onChunk } = {}) {
  const cfg = config();
  const res = await fetch(`${cfg.baseUrl}/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      model: model ?? cfg.model,
      stream: true,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Cirrascale stream failed (${res.status}): ${detail}`);
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const piece = json?.choices?.[0]?.text ?? json?.choices?.[0]?.delta?.content ?? "";
        if (piece) {
          full += piece;
          onChunk?.(piece);
        }
      } catch {
        // Not JSON (keepalive / partial) — ignore.
      }
    }
  }
  return full.trim();
}

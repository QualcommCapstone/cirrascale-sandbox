/**
 * Tiny zero-dependency web scraper: fetch a URL and reduce it to plain text.
 * Good enough to feed as grounding context to the planner. Not a real parser —
 * swap in cheerio/readability if you need robustness.
 */

export async function scrapeText(url, { maxChars = 6000 } = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": "cirrascale-sandbox-scraper/0.1" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  const html = await res.text();

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ") // strip tags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, maxChars);
}

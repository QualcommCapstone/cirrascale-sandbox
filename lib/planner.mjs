/**
 * Planner prompt construction (shared by scripts/plan.mjs and scrape-and-plan.mjs).
 * Mirrors src/lib/planner.ts in the cirrascale-planner app — keep them in sync.
 */

const SYSTEM_ROLE = `You are a precise planning assistant. Given a goal, you produce a
clear, actionable, step-by-step plan. Rules:
- Output GitHub-flavored Markdown only. No preamble, no sign-off.
- Start with a one-line "## Goal" restating the objective.
- Then "## Plan" as a numbered list of concrete steps.
- Each step is a short imperative sentence; add sub-bullets for detail when useful.
- End with "## Risks & notes" (2-4 bullets) covering blockers or assumptions.
- Be specific and realistic. Do not invent facts you were not given.`;

const GUARDRAILS = `\n\nReturn ONLY the Markdown plan described above.`;

export function buildPlannerPrompt(goal, context) {
  const grounding = context && context.trim()
    ? `\n\nReference material to ground the plan (may be partial):\n"""\n${context.trim().slice(0, 6000)}\n"""`
    : "";
  return `${SYSTEM_ROLE}${grounding}\n\n## User goal\n${goal.trim()}${GUARDRAILS}\n\n`;
}

/**
 * Clean a raw completion into a single plan. Completion models (e.g.
 * Llama-3.1-8B) loop — repeating the plan and echoing prompt text. Keep only the
 * first "## Goal" block and strip any echoed guardrail line.
 */
export function extractPlan(raw) {
  let out = raw.trim();
  const first = out.indexOf("## Goal");
  if (first !== -1) {
    const second = out.indexOf("## Goal", first + 1);
    if (second !== -1) out = out.slice(0, second).trim();
  }
  return out.replace(/Return ONLY the Markdown plan[\s\S]*$/i, "").trim();
}

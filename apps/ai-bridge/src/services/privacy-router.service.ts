import { SENSITIVE_KEYWORDS } from "../config/sensitive-keywords.js";

export type LLMRoute = "ollama" | "gemini";

/**
 * Determines which LLM backend should handle a given prompt.
 *
 * Rules:
 *   - Any prompt containing a sensitive keyword → Ollama (local, private)
 *   - All other prompts → Gemini (cloud, scrubbed)
 *
 * This is intentionally conservative: when in doubt, route locally.
 */
export function resolveRoute(prompt: string): LLMRoute {
	const lower = prompt.toLowerCase();
	const isSensitive = SENSITIVE_KEYWORDS.some((keyword) =>
		lower.includes(keyword),
	);
	return isSensitive ? "ollama" : "gemini";
}

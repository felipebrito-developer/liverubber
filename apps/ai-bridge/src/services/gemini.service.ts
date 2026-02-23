import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { scrubPII } from "@liverubber/security";
import type { StreamTextResult } from "ai";
import { streamText } from "ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-exp";

if (!GEMINI_API_KEY) {
	console.warn(
		"[ai-bridge] GEMINI_API_KEY is not set. Gemini routes will fail.",
	);
}

const googleProvider = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY ?? "",
});

/**
 * Streams a response from Gemini Flash.
 *
 * ⚠️  PRIVACY GUARANTEE: prompt is always PII-scrubbed before leaving
 * the device. This is enforced here — callers do NOT need to pre-scrub.
 *
 * @param prompt - The user's prompt (will be scrubbed automatically)
 * @param system - Optional system prompt
 */
export function streamGeminiResponse(
	prompt: string,
	system?: string,
): StreamTextResult<Record<string, never>, string> {
	const scrubbed = scrubPII(prompt);

	return streamText({
		model: googleProvider(GEMINI_MODEL),
		system:
			system ??
			"You are a helpful AI assistant for a personal productivity app called LiveRubber. Be concise and practical.",
		prompt: scrubbed,
	});
}

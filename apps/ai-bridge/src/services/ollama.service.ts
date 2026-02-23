import { createOpenAI } from "@ai-sdk/openai";
import type { StreamTextResult } from "ai";
import { streamText } from "ai";

const OLLAMA_BASE_URL =
	process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "deepseek-r1:8b";

/**
 * Ollama provider — uses Vercel AI SDK's OpenAI-compatible client
 * pointed at the local Ollama API endpoint.
 *
 * Ollama must be running on the host with CUDA support:
 *   OLLAMA_NUM_GPU_LAYERS=-1 ollama serve
 */
const ollamaProvider = createOpenAI({
	baseURL: OLLAMA_BASE_URL,
	// Ollama doesn't require a real key but the SDK requires a non-empty string
	apiKey: "ollama",
});

/**
 * Streams a response from the local Ollama model.
 * No data leaves the device — fully private.
 *
 * @param prompt - The user's prompt (may contain sensitive content)
 * @param system - Optional system prompt to guide the model's behavior
 */
export function streamOllamaResponse(
	prompt: string,
	system?: string,
): StreamTextResult<Record<string, never>, string> {
	return streamText({
		model: ollamaProvider(OLLAMA_MODEL),
		system:
			system ??
			"You are a helpful AI assistant for a personal productivity app called LiveRubber. Be concise and practical.",
		prompt,
	});
}

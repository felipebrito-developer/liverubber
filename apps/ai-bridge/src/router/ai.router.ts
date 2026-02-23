import { Hono } from "hono";
import { stream } from "hono/streaming";
import { streamGeminiResponse } from "../services/gemini.service.js";
import { streamOllamaResponse } from "../services/ollama.service.js";
import { resolveRoute } from "../services/privacy-router.service.js";

export const aiRouter = new Hono();

interface ChatRequestBody {
	prompt: string;
	system?: string;
}

/**
 * POST /ai/chat
 *
 * Accepts a prompt and streams an AI response back.
 * Routes to Ollama or Gemini based on content sensitivity.
 *
 * Request body:
 *   { prompt: string, system?: string }
 *
 * Response:
 *   text/plain stream (Server-Sent Events compatible)
 *
 * Headers included in response:
 *   X-LLM-Route: "ollama" | "gemini"
 */
aiRouter.post("/chat", async (c) => {
	let body: ChatRequestBody;

	try {
		body = await c.req.json<ChatRequestBody>();
	} catch {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const { prompt, system } = body;

	if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
		return c.json(
			{ error: "prompt is required and must be a non-empty string" },
			400,
		);
	}

	const route = resolveRoute(prompt);

	console.log(`[ai-bridge] route=${route} prompt_length=${prompt.length}`);

	// Set routing header so clients can inspect which model was used
	c.header("X-LLM-Route", route);
	c.header("Content-Type", "text/plain; charset=utf-8");
	c.header("Transfer-Encoding", "chunked");

	const result =
		route === "ollama"
			? streamOllamaResponse(prompt, system)
			: streamGeminiResponse(prompt, system);

	return stream(c, async (s) => {
		try {
			for await (const chunk of result.textStream) {
				await s.write(chunk);
			}
		} catch (err) {
			console.error(`[ai-bridge] stream error (route=${route}):`, err);
			await s.write("\n[Error: stream interrupted]");
		}
	});
});

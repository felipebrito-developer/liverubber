import { Hono } from "hono";
import { aiRouter } from "./router/ai.router.js";

const app = new Hono();

const PORT = Number(process.env.AI_BRIDGE_PORT ?? 3001);

// Mount AI router
app.route("/ai", aiRouter);

// Health check
app.get("/health", (c) => c.json({ status: "ok", service: "ai-bridge" }));

// 404 fallback
app.notFound((c) => c.json({ error: "Not found" }, 404));

// Global error handler
app.onError((err, c) => {
	console.error("[ai-bridge] unhandled error:", err);
	return c.json({ error: "Internal server error" }, 500);
});

export default {
	port: PORT,
	fetch: app.fetch,
};

console.log(`[ai-bridge] Listening on http://localhost:${PORT}`);

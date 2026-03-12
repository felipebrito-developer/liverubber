import { Router } from "express";

export const apiRouter = Router();

// Define API routes here
apiRouter.get("/health", (_req, res) => {
	res.json({ status: "ok", service: "liverubber-service" });
});

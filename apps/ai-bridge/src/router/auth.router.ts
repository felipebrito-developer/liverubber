import { Hono } from "hono";

export const authRouter = new Hono();

// POST /auth/login
authRouter.post("/login", async (c) => {
	const body = await c.req.json();

	// Mock validation
	if (!body.email || !body.password) {
		return c.json({ error: "Email and password are required" }, 400);
	}

	// Return mock successful response
	return c.json({
		token: "mock-jwt-token",
		user: {
			id: "u1",
			email: body.email,
			name: "User One",
		},
	});
});

// POST /auth/register
authRouter.post("/register", async (c) => {
	const body = await c.req.json();

	if (!body.email || !body.password || !body.name) {
		return c.json({ error: "Email, password, and name are required" }, 400);
	}

	return c.json(
		{
			token: "mock-jwt-token",
			user: {
				id: "u1",
				email: body.email,
				name: body.name,
			},
		},
		201,
	);
});

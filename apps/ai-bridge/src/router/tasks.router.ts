import { Hono } from "hono";
import { getMcpClient } from "../services/mcp.client.js";

export const tasksRouter = new Hono();

interface DBTask {
	task_id: number;
	title: string;
	description?: string;
	status?: string;
	priority?: string;
	due_date?: string;
}

// Helper to map DB representation to the Mobile App representation
function mapTask(dbTask: DBTask) {
	return {
		id: String(dbTask.task_id),
		title: dbTask.title,
		description: dbTask.description || "",
		status: dbTask.status || "todo",
		priority: dbTask.priority || "medium",
		dueDate: dbTask.due_date,
		createdAt: new Date().toISOString(), // Mocked as DB doesn't have it yet
		updatedAt: new Date().toISOString(), // Mocked as DB doesn't have it yet
	};
}

// GET /tasks
tasksRouter.get("/", async (c) => {
	try {
		const client = await getMcpClient();
		const result = await client.callTool({
			name: "list_tasks",
			arguments: {},
		});

		if (result.isError) {
			return c.json(
				{ error: String((result.content as Array<{ text: string }>)[0].text) },
				500,
			);
		}

		const dbTasks: DBTask[] = JSON.parse(
			(result.content as Array<{ text: string }>)[0].text,
		);
		return c.json(dbTasks.map(mapTask));
	} catch (error: unknown) {
		console.error("Error listing tasks via MCP:", error);
		return c.json({ error: "Failed to fetch tasks" }, 500);
	}
});

// GET /tasks/:id
tasksRouter.get("/:id", async (c) => {
	try {
		const id = Number(c.req.param("id"));
		const client = await getMcpClient();
		const result = await client.callTool({
			name: "list_tasks",
			arguments: {},
		});

		if (result.isError) {
			return c.json(
				{ error: String((result.content as Array<{ text: string }>)[0].text) },
				500,
			);
		}

		const dbTasks: DBTask[] = JSON.parse(
			(result.content as Array<{ text: string }>)[0].text,
		);
		const dbTask = dbTasks.find((t) => t.task_id === id);

		if (!dbTask) return c.json({ error: "Task not found" }, 404);
		return c.json(mapTask(dbTask));
	} catch (_: unknown) {
		return c.json({ error: "Failed to fetch task" }, 500);
	}
});

// POST /tasks
tasksRouter.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const client = await getMcpClient();
		const result = await client.callTool({
			name: "create_task",
			arguments: {
				title: body.title,
				description: body.description,
				status: body.status || "todo",
			},
		});

		if (result.isError) {
			return c.json(
				{ error: String((result.content as Array<{ text: string }>)[0].text) },
				500,
			);
		}

		const dbTask: DBTask = JSON.parse(
			(result.content as Array<{ text: string }>)[0].text,
		);
		return c.json(mapTask(dbTask), 201);
	} catch (_error: unknown) {
		return c.json({ error: "Failed to create task" }, 500);
	}
});

// PUT /tasks/:id
tasksRouter.put("/:id", async (c) => {
	try {
		const id = Number(c.req.param("id"));
		const body = await c.req.json();
		const client = await getMcpClient();

		const result = await client.callTool({
			name: "update_task",
			arguments: {
				task_id: id,
				title: body.title,
				description: body.description,
				status: body.status,
			},
		});

		if (result.isError) {
			return c.json(
				{ error: String((result.content as Array<{ text: string }>)[0].text) },
				500,
			);
		}

		const dbTask: DBTask = JSON.parse(
			(result.content as Array<{ text: string }>)[0].text,
		);
		return c.json(mapTask(dbTask));
	} catch (_: unknown) {
		return c.json({ error: "Failed to update task" }, 500);
	}
});

// DELETE /tasks/:id
tasksRouter.delete("/:id", async (c) => {
	try {
		const id = Number(c.req.param("id"));
		const client = await getMcpClient();
		const result = await client.callTool({
			name: "delete_task",
			arguments: { task_id: id },
		});

		if (result.isError) {
			return c.json(
				{ error: String((result.content as Array<{ text: string }>)[0].text) },
				500,
			);
		}

		return c.body(null, 204);
	} catch (_: unknown) {
		return c.json({ error: "Failed to delete task" }, 500);
	}
});

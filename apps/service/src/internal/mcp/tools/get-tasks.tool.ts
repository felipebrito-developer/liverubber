import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getDB } from "../../db/index.js";

const GetTasksInputSchema = z.object({
	status: z
		.enum(["pending", "in_progress", "completed", "cancelled"])
		.optional()
		.describe("Filter tasks by status"),
	priority: z
		.enum(["low", "medium", "high", "urgent"])
		.optional()
		.describe("Filter tasks by priority"),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.default(20)
		.describe("Maximum number of tasks to return"),
});

interface TaskRow {
	task_id: number;
	goal_id: number | null;
	parent_task_id: number | null;
	title: string;
	description: string;
	status: string | null;
	due_date: string | null;
	priority: string | null;
}

/**
 * Registers the `get_tasks` MCP tool on the given server.
 *
 * Tool contract:
 *   - Name: `get_tasks`
 *   - Returns: JSON array of task rows from the SQLite `task` table
 */
export function registerGetTasksTool(server: McpServer): void {
	server.tool(
		"get_tasks",
		"Retrieve tasks from the local SQLite database. Supports filtering by status and priority.",
		GetTasksInputSchema.shape,
		async (input: z.infer<typeof GetTasksInputSchema>) => {
			const db = getDB();

			const conditions: string[] = [];
			const params: (string | number)[] = [];

			if (input.status) {
				conditions.push("status = ?");
				params.push(input.status);
			}

			if (input.priority) {
				conditions.push("priority = ?");
				params.push(input.priority);
			}

			const where =
				conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

			const query = `SELECT * FROM task ${where} LIMIT ?`;
			params.push(input.limit);

			const tasks = db.prepare(query).all(...params) as TaskRow[];

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(tasks, null, 2),
					},
				],
			};
		},
	);
}

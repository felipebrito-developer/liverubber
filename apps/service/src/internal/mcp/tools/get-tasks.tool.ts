import type { TaskDefinition } from "@liverubber/shared/@types/task/task.type";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

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

/**
 * Stub repository — replace with real SQLite repository once implemented.
 * Returns a few representative tasks to exercise the tool contract.
 */
function fetchTasksStub(
	filters: z.infer<typeof GetTasksInputSchema>,
): TaskDefinition[] {
	const tasks: TaskDefinition[] = [
		{
			id: "task-001",
			title: "Set up MCP server",
			description: "Initialize MCP layer for LiveRubber backend",
			priority: "high",
			status: "in_progress",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tags: ["backend", "architecture"],
		},
		{
			id: "task-002",
			title: "Implement AI bridge",
			description: "Privacy-aware LLM routing microservice",
			priority: "high",
			status: "pending",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tags: ["ai", "architecture"],
		},
		{
			id: "task-003",
			title: "Review nutrition plan",
			priority: "medium",
			status: "pending",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	];

	let results = tasks;

	if (filters.status) {
		results = results.filter((t) => t.status === filters.status);
	}

	if (filters.priority) {
		results = results.filter((t) => t.priority === filters.priority);
	}

	return results.slice(0, filters.limit);
}

/**
 * Registers the `get_tasks` MCP tool on the given server.
 *
 * Tool contract:
 *   - Name: `get_tasks`
 *   - Returns: JSON array of TaskDefinition objects
 */
export function registerGetTasksTool(server: McpServer): void {
	server.tool(
		"get_tasks",
		"Retrieve tasks from the local database. Supports filtering by status and priority.",
		GetTasksInputSchema.shape,
		async (input: z.infer<typeof GetTasksInputSchema>) => {
			const tasks = fetchTasksStub(input);

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

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getDB } from "../../db/index.js";

const QueryGoalsInputSchema = z.object({
	status: z
		.enum(["active", "paused", "completed", "abandoned"])
		.optional()
		.describe("Filter goals by status"),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.default(20)
		.describe("Maximum number of goals to return"),
});

interface GoalRow {
	goal_id: string;
	meaning_id: string | null;
	name: string;
	description: string;
	status: string;
	due_date: string | null;
	progress: number;
	cover_image_id: string | null;
}

/**
 * Registers the `query_goals` MCP tool on the given server.
 *
 * Tool contract:
 *   - Name: `query_goals`
 *   - Returns: JSON array of goal rows from the SQLite `goal` table
 */
export function registerQueryGoalsTool(server: McpServer): void {
	server.tool(
		"query_goals",
		"Retrieve goals from the local SQLite database. Supports filtering by status.",
		QueryGoalsInputSchema.shape,
		async (input: z.infer<typeof QueryGoalsInputSchema>) => {
			const db = getDB();

			const conditions: string[] = [];
			const params: (string | number)[] = [];

			if (input.status) {
				conditions.push("status = ?");
				params.push(input.status);
			}

			const where =
				conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

			const query = `SELECT * FROM goal ${where} LIMIT ?`;
			params.push(input.limit);

			const goals = db.prepare(query).all(...params) as GoalRow[];

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(goals, null, 2),
					},
				],
			};
		},
	);
}

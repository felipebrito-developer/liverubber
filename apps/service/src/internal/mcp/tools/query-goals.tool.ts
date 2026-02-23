import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Stub domain type — extend shared types once goal entity is defined
interface GoalDefinition {
	id: string;
	title: string;
	description?: string;
	status: "active" | "paused" | "completed" | "abandoned";
	targetDate?: string;
	createdAt: string;
	updatedAt: string;
}

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

/** Stub — replace with real SQLite repository. */
function fetchGoalsStub(
	filters: z.infer<typeof QueryGoalsInputSchema>,
): GoalDefinition[] {
	const goals: GoalDefinition[] = [
		{
			id: "goal-001",
			title: "Read 12 books this year",
			status: "active",
			targetDate: "2026-12-31",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: "goal-002",
			title: "Run a 5K",
			description: "Complete a 5K race without stopping",
			status: "paused",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	];

	let results = goals;

	if (filters.status) {
		results = results.filter((g) => g.status === filters.status);
	}

	return results.slice(0, filters.limit);
}

/**
 * Registers the `query_goals` MCP tool on the given server.
 *
 * Tool contract:
 *   - Name: `query_goals`
 *   - Returns: JSON array of GoalDefinition objects
 */
export function registerQueryGoalsTool(server: McpServer): void {
	server.tool(
		"query_goals",
		"Retrieve goals from the local database. Supports filtering by status.",
		QueryGoalsInputSchema.shape,
		async (input: z.infer<typeof QueryGoalsInputSchema>) => {
			const goals = fetchGoalsStub(input);

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

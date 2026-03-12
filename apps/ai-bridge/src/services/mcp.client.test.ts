import { expect, test } from "bun:test";
import { getMcpClient } from "./mcp.client";

// Ensure tests use an in-memory database for the spawned service
process.env.NODE_ENV = "test";

test("MCP Client can connect and call list_tasks", async () => {
	const client = await getMcpClient();

	// First, let's create a task to ensure the DB has one
	const createResult = await client.callTool({
		name: "create_task",
		arguments: {
			title: "Integration Test Task",
			description: "Testing via MCP Client",
			status: "todo",
		},
	});

	if (createResult.isError) {
		console.log("Error details:", createResult);
	}
	expect(createResult.isError).toBeFalsy();
	const createdText = (createResult.content as any)[0].text;
	expect(typeof createdText).toBe("string");
	const createdTask = JSON.parse(createdText as string);
	expect(createdTask.title).toBe("Integration Test Task");

	// Now list tasks
	const listResult = await client.callTool({
		name: "list_tasks",
		arguments: {},
	});

	expect(listResult.isError).toBeFalsy();
	const listText = (listResult.content as any)[0].text;
	expect(typeof listText).toBe("string");
	const tasks = JSON.parse(listText as string);

	expect(Array.isArray(tasks)).toBe(true);
	expect(
		tasks.some((t: { task_id: string }) => t.task_id === createdTask.task_id),
	).toBe(true);
});

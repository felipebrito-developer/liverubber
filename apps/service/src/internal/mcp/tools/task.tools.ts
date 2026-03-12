import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TaskRepository } from "../../db/repositories/task/task.repository.js";

export function registerTaskTools(server: McpServer): void {
	// List tasks
	server.tool(
		"list_tasks",
		"Retrieve all tasks from the local database.",
		{},
		async () => {
			const tasks = TaskRepository.getTasks();
			return {
				content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
			};
		},
	);

	// Create task
	server.tool(
		"create_task",
		"Create a new task.",
		{
			title: z.string().describe("Title of the task"),
			description: z.string().describe("Detailed description of the task"),
			goal_id: z.string().optional().describe("Associated goal ID"),
			parent_task_id: z
				.string()
				.optional()
				.describe("Parent task ID if subtask"),
			status: z
				.enum(["todo", "in_progress", "done"])
				.optional()
				.describe("Task status"),
			priority: z.string().optional().describe("Priority level"),
			due_date: z.string().optional().describe("Due date in ISO format"),
		},
		async (input) => {
			const task = TaskRepository.createTask({
				title: input.title,
				description: input.description,
				goal_id: input.goal_id,
				parent_task_id: input.parent_task_id,
				status: input.status,
				priority: input.priority,
				due_date: input.due_date,
			});
			return {
				content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
			};
		},
	);

	// Update task
	server.tool(
		"update_task",
		"Update an existing task.",
		{
			task_id: z.string().describe("ID of the task to update"),
			title: z.string().optional(),
			description: z.string().optional(),
			goal_id: z.string().optional(),
			parent_task_id: z.string().optional(),
			status: z.enum(["todo", "in_progress", "done"]).optional(),
			priority: z.string().optional(),
			due_date: z.string().optional(),
		},
		async (input) => {
			const { task_id, ...updates } = input;
			const task = TaskRepository.updateTask(task_id, updates);
			if (!task) {
				return {
					content: [
						{ type: "text", text: `Task with ID ${task_id} not found.` },
					],
					isError: true,
				};
			}
			return {
				content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
			};
		},
	);

	// Delete task
	server.tool(
		"delete_task",
		"Delete a task by ID.",
		{
			task_id: z.string().describe("ID of the task to delete"),
		},
		async (input) => {
			TaskRepository.deleteTask(input.task_id);
			return {
				content: [
					{ type: "text", text: `Task ${input.task_id} deleted successfully.` },
				],
			};
		},
	);
}

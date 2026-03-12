import { expect, test } from "bun:test";
import { GoalRepository } from "../goal/goal.repository";
import { MeaningRepository } from "../meaning/meaning.repository";
import { TaskRepository } from "./task.repository";

// Ensure tests use an in-memory database
process.env.NODE_ENV = "test";

test("TaskRepository CRUD Operations", () => {
	// We create a Meaning and Goal first since Task references Goal (though optional, it's good practice)
	const meaning = MeaningRepository.createMeaning({
		name: "Test Meaning",
		description: "Test Meaning description",
	});

	const goal = GoalRepository.createGoal({
		meaning_id: meaning.id,
		name: "Test Goal",
		description: "Test Goal description",
	});

	// Create
	const task = TaskRepository.createTask({
		title: "Test task",
		description: "Test description",
		goal_id: goal.id,
		due_date: "2026-12-31T23:59:59Z",
	});

	expect(task.id).toBeDefined();
	expect(task.title).toBe("Test task");
	expect(task.status).toBe("todo");

	// Read one
	const fetchedTask = TaskRepository.getTaskById(task.id);
	expect(fetchedTask).not.toBeNull();
	if (fetchedTask) {
		expect(fetchedTask.title).toBe("Test task");
	}

	// Read all
	const all = TaskRepository.getTasks();
	expect(all.length).toBeGreaterThan(0);
	expect(all.find((t) => t.id === task.id)).toBeDefined();

	// Update
	const updatedTask = TaskRepository.updateTask(task.id, {
		status: "in_progress",
		priority: "high",
	});
	expect(updatedTask).not.toBeNull();
	if (updatedTask) {
		expect(updatedTask.status).toBe("in_progress");
		expect(updatedTask.priority).toBe("high");
		expect(updatedTask.title).toBe("Test task"); // unaffected fields should remain
	}

	// Delete
	const success = TaskRepository.deleteTask(task.id);
	expect(success).toBe(true);

	const fetchAfterDelete = TaskRepository.getTaskById(task.id);
	expect(fetchAfterDelete).toBeNull();
});

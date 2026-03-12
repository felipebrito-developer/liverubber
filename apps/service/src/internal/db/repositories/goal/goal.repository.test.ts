import { expect, test } from "bun:test";
import { MeaningRepository } from "../meaning/meaning.repository";
import { GoalRepository } from "./goal.repository";

process.env.NODE_ENV = "test";

test("GoalRepository CRUD Operations", () => {
	const meaning = MeaningRepository.createMeaning({
		name: "Goal Test Meaning",
		description: "Test description",
	});

	const goal = GoalRepository.createGoal({
		name: "Test Goal",
		description: "Test description",
		meaning_id: meaning.id,
	});

	expect(goal.id).toBeDefined();
	expect(goal.name).toBe("Test Goal");

	const fetched = GoalRepository.getGoalById(goal.id);
	expect(fetched).not.toBeNull();

	const updated = GoalRepository.updateGoal(goal.id, {
		status: "completed",
	});
	expect(updated?.status).toBe("completed");

	const success = GoalRepository.deleteGoal(goal.id);
	expect(success).toBe(true);
});

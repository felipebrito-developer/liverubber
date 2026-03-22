import type { Goal, NewGoal } from "@liverubber/shared";
import { atom } from "jotai";
import { goalsRepository } from "../db/repositories/goals";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const goalsAtom = atom<Goal[]>([]);
export const isGoalsLoadedAtom = atom(false);

export const loadGoalsAction = atom(null, async (_get, set) => {
	const data = await goalsRepository.getAll();
	const goals = data.map((row: any) => ({
		...row.goal,
		meaning: row.meaning ? {
			...row.meaning,
			category: row.category,
		} : undefined,
	}));
	set(goalsAtom, goals as Goal[]);
	set(isGoalsLoadedAtom, true);
});

export const createGoalAction = atom(
	null,
	async (_get, set, payload: Omit<NewGoal, "id">) => {
		const id = uuidv4();
		await goalsRepository.create({ ...payload, id } as NewGoal);
		set(loadGoalsAction);
	},
);

export const updateGoalAction = atom(
	null,
	async (_get, set, { id, data }: { id: string; data: Partial<NewGoal> }) => {
		await goalsRepository.update(id, data);
		set(loadGoalsAction);
	},
);

export const deleteGoalAction = atom(null, async (_get, set, id: string) => {
	await goalsRepository.delete(id);
	set(loadGoalsAction);
});

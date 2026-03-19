import type { Habit, NewHabit, NewReward, Reward } from "@liverubber/shared";
import { atom } from "jotai";
import { habitsRepository } from "../db/repositories/habits";
import { rewardsRepository } from "../db/repositories/rewards";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const habitsAtom = atom<Habit[]>([]);
export const rewardsAtom = atom<Reward[]>([]);

export const loadHabitsAndRewardsAction = atom(null, async (_get, set) => {
	const habits = await habitsRepository.getAll();
	const rewards = await rewardsRepository.getAll();
	set(habitsAtom, habits as Habit[]);
	set(rewardsAtom, rewards as Reward[]);
});

export const createHabitAction = atom(
	null,
	async (_get, set, payload: Omit<NewHabit, "id">) => {
		const id = uuidv4();
		await habitsRepository.create({ ...payload, id } as NewHabit);
		set(loadHabitsAndRewardsAction);
	},
);

export const updateHabitAction = atom(
	null,
	async (_get, set, { id, data }: { id: string; data: Partial<NewHabit> }) => {
		await habitsRepository.update(id, data);
		set(loadHabitsAndRewardsAction);
	},
);

export const deleteHabitAction = atom(null, async (_get, set, id: string) => {
	await habitsRepository.delete(id);
	set(loadHabitsAndRewardsAction);
});

export const createRewardAction = atom(
	null,
	async (_get, set, payload: Omit<NewReward, "id">) => {
		const id = uuidv4();
		await rewardsRepository.create({ ...payload, id } as NewReward);
		set(loadHabitsAndRewardsAction);
	},
);

export const updateRewardAction = atom(
	null,
	async (_get, set, { id, data }: { id: string; data: Partial<NewReward> }) => {
		await rewardsRepository.update(id, data);
		set(loadHabitsAndRewardsAction);
	},
);

export const deleteRewardAction = atom(null, async (_get, set, id: string) => {
	await rewardsRepository.delete(id);
	set(loadHabitsAndRewardsAction);
});

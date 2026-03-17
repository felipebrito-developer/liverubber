import type { NewTask, Task, TaskStatus } from "@liverubber/shared";
export type { NewTask, Task, TaskStatus };

import { atom } from "jotai";
import { tasksRepository } from "../db/repositories/tasks";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const tasksAtom = atom<Task[]>([]);
export const isTasksLoadedAtom = atom(false);

export const loadTasksAction = atom(null, async (_get, set) => {
	const data = await tasksRepository.getAll();
	set(tasksAtom, data as Task[]);
	set(isTasksLoadedAtom, true);
});

export const createTaskAction = atom(
	null,
	async (_get, set, payload: Omit<NewTask, "id">) => {
		const id = uuidv4();
		await tasksRepository.create({ ...payload, id } as NewTask);
		set(loadTasksAction);
	},
);

export const updateTaskAction = atom(
	null,
	async (_get, set, { id, data }: { id: string; data: Partial<NewTask> }) => {
		await tasksRepository.update(id, data);
		set(loadTasksAction);
	},
);

export const deleteTaskAction = atom(null, async (_get, set, id: string) => {
	await tasksRepository.delete(id);
	set(loadTasksAction);
});

export type TaskFilter = "all" | string;
export const taskFilterAtom = atom<TaskFilter>("all");
export const selectedTaskIdAtom = atom<string | null>(null);

import { atom } from "jotai";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: TaskStatus;
	createdAt: string;
	updatedAt: string;
}

/** Active task filter */
export type TaskFilter = "all" | TaskStatus;

export const taskFilterAtom = atom<TaskFilter>("all");

/** Selected task ID for detail view */
export const selectedTaskIdAtom = atom<string | null>(null);

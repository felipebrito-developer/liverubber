import type { Entity, Priority, Status } from "../base/entity.type";

export type TaskTag = string;

export type TaskPriority = Priority;

export type TaskStatus = Status;

/**
 * Core interface precisely matching the SQL `task` table natively.
 */
export interface TaskDefinition extends Entity {
	goalId: string | null;
	parentTaskId: string | null;
	title: string;
	description: string;
	status: Status;
	dueDate: string | null;
	priority: Priority;
}

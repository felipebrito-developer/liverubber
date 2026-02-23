import type { Entity, Priority, Status } from "../base/entity.type";

export type TaskTag = string;

export type TaskPriority = Priority;

export type TaskStatus = Status;

export interface TaskDefinition extends Entity {
	title: string;
	description?: string;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate?: string; // ISO 8601 date-time string
	tags?: TaskTag[];
}

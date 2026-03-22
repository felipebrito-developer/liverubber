import type { z } from "zod";
import type { insertTaskSchema, selectTaskSchema } from "../../db/schema/tasks";
import type { Priority, Status } from "../base/entity.type";

export type TaskTag = string;

export type TaskPriority = Priority;

export type TaskStatus = Status;

import type { TagType } from "../tag/tag.type";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Task = z.infer<typeof selectTaskSchema> & {
	tags?: TagType[];
};
export type NewTask = z.infer<typeof insertTaskSchema> & {
	tagIds?: string[];
};

/** @deprecated Use Task instead */
export type TaskDefinition = Task;

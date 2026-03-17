import {
	type AnySQLiteColumn,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { goal } from "./goals";

export const task = sqliteTable("task", {
	id: text("id").primaryKey().notNull(),
	goalId: text("goal_id").references(() => goal.id),
	parentTaskId: text("parent_task_id").references(
		(): AnySQLiteColumn => task.id,
	),
	title: text("title").notNull(),
	description: text("description").notNull(),
	status: text("status"),
	dueDate: text("due_date"),
	priority: text("priority"),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertTaskSchema = createInsertSchema(task);
export const selectTaskSchema = createSelectSchema(task);

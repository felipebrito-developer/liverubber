import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { activity } from "./core";
import { habit } from "./habits_events";
import { task } from "./tasks";

export const activityLog = sqliteTable("activity_log", {
	id: text("id").primaryKey().notNull(),
	activityId: text("activity_id")
		.notNull()
		.references(() => activity.id),
	taskId: text("task_id").references(() => task.id),
	habitId: text("habit_id").references(() => habit.id),
	completedAt: text("completed_at").notNull(),
	amountAchieved: real("amount_achieved").notNull(),
	moodRating: integer("mood_rating").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertActivityLogSchema = createInsertSchema(activityLog);
export const selectActivityLogSchema = createSelectSchema(activityLog);

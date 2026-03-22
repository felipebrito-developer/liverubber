import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categoryType = sqliteTable("category_type", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	categoryColor: text("category_color").notNull(),
	description: text("description").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const frequencyType = sqliteTable("frequency_type", {
	id: text("id").primaryKey().notNull(),
	type: text("type").notNull(),
	name: text("name").notNull(),
	frequencyPeriod: text("frequency_period").notNull(),
	amount: integer("amount").notNull(),
	repeat: integer("repeat", { mode: "boolean" }).notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const tagType = sqliteTable("tag_type", {
	id: text("id").primaryKey().notNull(),
	colorHex: text("color_hex").notNull(),
	name: text("name").notNull().unique(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const activity = sqliteTable("activity", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	iconName: text("icon_name").notNull(),
	tagId: text("tag_id")
		.notNull()
		.references(() => tagType.id),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertCategoryTypeSchema = createInsertSchema(categoryType);
export const selectCategoryTypeSchema = createSelectSchema(categoryType);

export const insertFrequencyTypeSchema = createInsertSchema(frequencyType);
export const selectFrequencyTypeSchema = createSelectSchema(frequencyType);

export const insertTagTypeSchema = createInsertSchema(tagType);
export const selectTagTypeSchema = createSelectSchema(tagType);

export const insertActivitySchema = createInsertSchema(activity);
export const selectActivitySchema = createSelectSchema(activity);

export const taskTag = sqliteTable("task_tag", {
	taskId: text("task_id")
		.notNull()
		.references(() => (require("./tasks").task.id)),
	tagId: text("tag_id")
		.notNull()
		.references(() => tagType.id),
});

export const habitTag = sqliteTable("habit_tag", {
	habitId: text("habit_id")
		.notNull()
		.references(() => (require("./habits_events").habit.id)),
	tagId: text("tag_id")
		.notNull()
		.references(() => tagType.id),
});

export const insertTaskTagSchema = createInsertSchema(taskTag);
export const selectTaskTagSchema = createSelectSchema(taskTag);

export const insertHabitTagSchema = createInsertSchema(habitTag);
export const selectHabitTagSchema = createSelectSchema(habitTag);

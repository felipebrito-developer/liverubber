import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { categoryType, frequencyType } from "./core";
import { meaning } from "./meanings";

export const habit = sqliteTable("habit", {
	id: text("id").primaryKey().notNull(),
	meaningId: text("meaning_id").references(() => meaning.id),
	frequencyId: text("frequency_id").references(() => frequencyType.id),
	name: text("name").notNull(),
	startDate: text("start_date"),
	lastUpdate: text("last_update"),
	streakCount: integer("streak_count").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const event = sqliteTable("event", {
	id: text("id").primaryKey().notNull(),
	categoryId: text("category_id")
		.notNull()
		.references(() => categoryType.id),
	frequencyId: text("frequency_id")
		.notNull()
		.unique()
		.references(() => frequencyType.id),
	title: text("title").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date"),
	location: text("location"),
	link: text("link"),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertHabitSchema = createInsertSchema(habit);
export const selectHabitSchema = createSelectSchema(habit);

export const insertEventSchema = createInsertSchema(event);
export const selectEventSchema = createSelectSchema(event);

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const reward = sqliteTable("reward", {
	id: text("id").primaryKey().notNull(),
	description: text("description").notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertRewardSchema = createInsertSchema(reward);
export const selectRewardSchema = createSelectSchema(reward);

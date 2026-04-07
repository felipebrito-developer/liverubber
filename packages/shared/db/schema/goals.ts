import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { asset } from "./assets";
import { categoryType } from "./core";
import { meaning } from "./meanings";
import { reward } from "./rewards";

export const goal = sqliteTable("goal", {
	id: text("id").primaryKey().notNull(),
	categoryId: text("category_id").references(() => categoryType.id),
	meaningId: text("meaning_id").references(() => meaning.id),
	name: text("name").notNull(),
	description: text("description").notNull(),
	status: text("status").notNull(),
	dueDate: text("due_date"),
	progress: integer("progress").notNull(),
	coverImageId: text("cover_image_id").references(() => asset.id),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const goalAssets = sqliteTable("goal_assets", {
	goalId: text("goal_id")
		.notNull()
		.references(() => goal.id),
	assetId: text("asset_id")
		.notNull()
		.references(() => asset.id),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const milestone = sqliteTable("milestone", {
	id: text("id").primaryKey().notNull(),
	goalId: text("goal_id").references(() => goal.id),
	rewardId: text("reward_id")
		.notNull()
		.references(() => reward.id),
	name: text("name").notNull(),
	description: text("description"),
	type: text("type").notNull(),
	isCompleted: integer("is_completed", { mode: "boolean" }).notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertGoalSchema = createInsertSchema(goal);
export const selectGoalSchema = createSelectSchema(goal);

export const insertGoalAssetsSchema = createInsertSchema(goalAssets);
export const selectGoalAssetsSchema = createSelectSchema(goalAssets);

export const insertMilestoneSchema = createInsertSchema(milestone);
export const selectMilestoneSchema = createSelectSchema(milestone);

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { asset } from "./assets";
import { categoryType } from "./core";

export const meaning = sqliteTable("meaning", {
	id: text("id").primaryKey().notNull(),
	categoryId: text("category_id").references(() => categoryType.id),
	name: text("name").notNull(),
	description: text("description").notNull(),
	externalLink: text("external_link"),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const meaningAssets = sqliteTable("meaning_assets", {
	meaningId: text("meaning_id")
		.notNull()
		.references(() => meaning.id),
	assetId: text("asset_id")
		.notNull()
		.references(() => asset.id),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertMeaningSchema = createInsertSchema(meaning);
export const selectMeaningSchema = createSelectSchema(meaning);

export const insertMeaningAssetsSchema = createInsertSchema(meaningAssets);
export const selectMeaningAssetsSchema = createSelectSchema(meaningAssets);

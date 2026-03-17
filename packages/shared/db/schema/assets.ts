import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const asset = sqliteTable("asset", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	filePath: text("file_path").notNull(),
	mediaType: text("media_type").notNull(),
	createdAt: text("created_at"), // Using text for datetime in SQLite
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertAssetSchema = createInsertSchema(asset);
export const selectAssetSchema = createSelectSchema(asset);

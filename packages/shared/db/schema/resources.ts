import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { categoryType } from "./core";

export const resourceType = sqliteTable("resource_type", {
	id: text("id").primaryKey().notNull(),
	categoryId: text("category_id").references(() => categoryType.id),
	amountType: text("amount_type").notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const resourceStore = sqliteTable("resource_store", {
	id: text("id").primaryKey().notNull(),
	resourceTypeId: text("resource_type_id")
		.notNull()
		.references(() => resourceType.id),
	amount: real("amount").notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const resourcesAssignments = sqliteTable("resources_assignments", {
	id: text("id").primaryKey().notNull(),
	resourceId: text("resource_id")
		.notNull()
		.references(() => resourceStore.id),
	entityRelatedId: text("entity_related_id").notNull(),
	relationType: text("relation_type").notNull(),
	amount: real("amount"),
	isCompleted: integer("is_completed", { mode: "boolean" }).notNull(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const resourceLog = sqliteTable("resource_log", {
	id: text("id").primaryKey().notNull(),
	resourceId: text("resource_id")
		.notNull()
		.references(() => resourceStore.id),
	amountChange: real("amount_change").notNull(),
	changeType: text("change_type").notNull(),
	logDate: text("log_date"),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	isSynced: integer("is_synced", { mode: "boolean" }).default(false),
	lastSyncedAt: text("last_synced_at"),
});

export const insertResourceTypeSchema = createInsertSchema(resourceType);
export const selectResourceTypeSchema = createSelectSchema(resourceType);

export const insertResourceStoreSchema = createInsertSchema(resourceStore);
export const selectResourceStoreSchema = createSelectSchema(resourceStore);

export const insertResourcesAssignmentsSchema =
	createInsertSchema(resourcesAssignments);
export const selectResourcesAssignmentsSchema =
	createSelectSchema(resourcesAssignments);

export const insertResourceLogSchema = createInsertSchema(resourceLog);
export const selectResourceLogSchema = createSelectSchema(resourceLog);

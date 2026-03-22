import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const resourcesRepository = {
	async getAllStores() {
		return await db
			.select({
				id: schema.resourceStore.id,
				amount: schema.resourceStore.amount,
				resourceTypeId: schema.resourceStore.resourceTypeId,
				name: schema.resourceType.name,
				categoryId: schema.resourceType.categoryId,
				createdAt: schema.resourceStore.createdAt,
				updatedAt: schema.resourceStore.updatedAt,
			})
			.from(schema.resourceStore)
			.leftJoin(
				schema.resourceType,
				eq(schema.resourceStore.resourceTypeId, schema.resourceType.id),
			);
	},
	async getAllTypes() {
		return await db.select().from(schema.resourceType);
	},
	async createType(data: typeof schema.resourceType.$inferInsert) {
		return await db.insert(schema.resourceType).values(data).returning();
	},
	async createStore(data: typeof schema.resourceStore.$inferInsert) {
		return await db.insert(schema.resourceStore).values(data).returning();
	},
	async updateStore(
		id: string,
		data: Partial<typeof schema.resourceStore.$inferInsert>,
	) {
		return await db
			.update(schema.resourceStore)
			.set(data)
			.where(eq(schema.resourceStore.id, id))
			.returning();
	},
	async deleteStore(id: string) {
		return await db
			.delete(schema.resourceStore)
			.where(eq(schema.resourceStore.id, id))
			.returning();
	},
	async updateType(
		id: string,
		data: Partial<typeof schema.resourceType.$inferInsert>,
	) {
		return await db
			.update(schema.resourceType)
			.set(data)
			.where(eq(schema.resourceType.id, id))
			.returning();
	},
};

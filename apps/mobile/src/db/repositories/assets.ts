import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const assetsRepository = {
	async getAll() {
		return await db.select().from(schema.asset);
	},
	async create(data: typeof schema.asset.$inferInsert) {
		return await db.insert(schema.asset).values(data).returning();
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.asset)
			.where(eq(schema.asset.id, id));
		return results[0];
	},
	async delete(id: string) {
		return await db
			.delete(schema.asset)
			.where(eq(schema.asset.id, id))
			.returning();
	},
};

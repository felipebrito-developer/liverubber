import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const meaningsRepository = {
	async getAll() {
		return await db
			.select({
				meaning: schema.meaning,
				category: schema.categoryType,
			})
			.from(schema.meaning)
			.leftJoin(
				schema.categoryType,
				eq(schema.meaning.categoryId, schema.categoryType.id),
			);
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.meaning)
			.where(eq(schema.meaning.id, id));
		return results[0];
	},
	async create(data: typeof schema.meaning.$inferInsert) {
		return await db.insert(schema.meaning).values(data).returning();
	},
	async update(id: string, data: Partial<typeof schema.meaning.$inferInsert>) {
		return await db
			.update(schema.meaning)
			.set(data)
			.where(eq(schema.meaning.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.meaning)
			.where(eq(schema.meaning.id, id))
			.returning();
	},
};

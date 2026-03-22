import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const goalsRepository = {
	async getAll() {
		return await db
			.select({
				goal: schema.goal,
				meaning: schema.meaning,
				category: schema.categoryType,
			})
			.from(schema.goal)
			.leftJoin(schema.meaning, eq(schema.goal.meaningId, schema.meaning.id))
			.leftJoin(
				schema.categoryType,
				eq(schema.meaning.categoryId, schema.categoryType.id),
			);
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.goal)
			.where(eq(schema.goal.id, id));
		return results[0];
	},
	async create(data: typeof schema.goal.$inferInsert) {
		return await db.insert(schema.goal).values(data).returning();
	},
	async update(id: string, data: Partial<typeof schema.goal.$inferInsert>) {
		return await db
			.update(schema.goal)
			.set(data)
			.where(eq(schema.goal.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.goal)
			.where(eq(schema.goal.id, id))
			.returning();
	},
};

import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const habitsRepository = {
	async getAll() {
		return await db.select().from(schema.habit);
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.habit)
			.where(eq(schema.habit.id, id));
		return results[0];
	},
	async create(data: typeof schema.habit.$inferInsert) {
		return await db.insert(schema.habit).values(data).returning();
	},
	async update(id: string, data: Partial<typeof schema.habit.$inferInsert>) {
		return await db
			.update(schema.habit)
			.set(data)
			.where(eq(schema.habit.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.habit)
			.where(eq(schema.habit.id, id))
			.returning();
	},
};

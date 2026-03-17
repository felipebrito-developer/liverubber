import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const tasksRepository = {
	async getAll() {
		return await db.select().from(schema.task);
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.task)
			.where(eq(schema.task.id, id));
		return results[0];
	},
	async create(data: typeof schema.task.$inferInsert) {
		return await db.insert(schema.task).values(data).returning();
	},
	async update(id: string, data: Partial<typeof schema.task.$inferInsert>) {
		return await db
			.update(schema.task)
			.set(data)
			.where(eq(schema.task.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.task)
			.where(eq(schema.task.id, id))
			.returning();
	},
};

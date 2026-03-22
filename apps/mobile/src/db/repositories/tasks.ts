import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const tasksRepository = {
	async getAll() {
		const rows = await db
			.select({
				task: schema.task,
				tag: schema.tagType,
			})
			.from(schema.task)
			.leftJoin(schema.taskTag, eq(schema.task.id, schema.taskTag.taskId))
			.leftJoin(schema.tagType, eq(schema.taskTag.tagId, schema.tagType.id));

		// Aggregate rows by task id
		const tasksMap = new Map<string, any>();
		for (const row of rows) {
			const taskId = row.task.id;
			if (!tasksMap.has(taskId)) {
				tasksMap.set(taskId, { ...row.task, tags: [] });
			}
			if (row.tag) {
				tasksMap.get(taskId).tags.push(row.tag);
			}
		}
		return Array.from(tasksMap.values());
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.task)
			.where(eq(schema.task.id, id));
		return results[0];
	},
	async create(data: typeof schema.task.$inferInsert, tagIds: string[] = []) {
		const result = await db.insert(schema.task).values(data).returning();
		const taskId = result[0].id;

		if (tagIds.length > 0) {
			await db.insert(schema.taskTag).values(
				tagIds.map((tagId) => ({
					taskId,
					tagId,
				})),
			);
		}
		return result;
	},
	async update(id: string, data: Partial<typeof schema.task.$inferInsert>, tagIds?: string[]) {
		const result = await db
			.update(schema.task)
			.set(data)
			.where(eq(schema.task.id, id))
			.returning();

		if (tagIds) {
			// Simple sync: delete all and re-insert
			await db.delete(schema.taskTag).where(eq(schema.taskTag.taskId, id));
			if (tagIds.length > 0) {
				await db.insert(schema.taskTag).values(
					tagIds.map((tagId) => ({
						taskId: id,
						tagId,
					})),
				);
			}
		}
		return result;
	},
	async delete(id: string) {
		// Dependencies will be handled by DB or manually
		await db.delete(schema.taskTag).where(eq(schema.taskTag.taskId, id));
		return await db
			.delete(schema.task)
			.where(eq(schema.task.id, id))
			.returning();
	},
};

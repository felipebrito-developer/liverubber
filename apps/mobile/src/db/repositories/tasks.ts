import { type AnyType, schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const tasksRepository = {
	async getAll() {
		const rows = await db
			.select({
				task: schema.task,
				tag: schema.tagType,
				resourceName: schema.resourceType.name,
			})
			.from(schema.task)
			.leftJoin(schema.taskTag, eq(schema.task.id, schema.taskTag.taskId))
			.leftJoin(schema.tagType, eq(schema.taskTag.tagId, schema.tagType.id))
			.leftJoin(
				schema.resourcesAssignments,
				eq(schema.task.id, schema.resourcesAssignments.entityRelatedId),
			)
			.leftJoin(
				schema.resourceStore,
				eq(schema.resourcesAssignments.resourceId, schema.resourceStore.id),
			)
			.leftJoin(
				schema.resourceType,
				eq(schema.resourceStore.resourceTypeId, schema.resourceType.id),
			);

		// Aggregate rows by task id
		const tasksMap = new Map<string, AnyType>();
		for (const row of rows) {
			const taskId = row.task.id;
			if (!tasksMap.has(taskId)) {
				tasksMap.set(taskId, { ...row.task, tags: [], resources: [] });
			}
			const task = tasksMap.get(taskId);
			const tag = row.tag;
			if (tag && !task.tags.some((t: { id: string }) => t.id === tag.id)) {
				task.tags.push(tag);
			}
			if (row.resourceName && !task.resources.includes(row.resourceName)) {
				task.resources.push(row.resourceName);
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
	async update(
		id: string,
		data: Partial<typeof schema.task.$inferInsert>,
		tagIds?: string[],
	) {
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

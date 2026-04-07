import { type AnyType, schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const habitsRepository = {
	async getAll() {
		const rows = await db
			.select({
				habit: schema.habit,
				resourceName: schema.resourceType.name,
			})
			.from(schema.habit)
			.leftJoin(
				schema.resourcesAssignments,
				eq(schema.habit.id, schema.resourcesAssignments.entityRelatedId),
			)
			.leftJoin(
				schema.resourceStore,
				eq(schema.resourcesAssignments.resourceId, schema.resourceStore.id),
			)
			.leftJoin(
				schema.resourceType,
				eq(schema.resourceStore.resourceTypeId, schema.resourceType.id),
			);

		// Aggregate rows by habit id
		const habitsMap = new Map<string, AnyType>();
		for (const row of rows) {
			const habitId = row.habit.id;
			if (!habitsMap.has(habitId)) {
				habitsMap.set(habitId, { ...row.habit, resources: [] });
			}
			const habit = habitsMap.get(habitId);
			if (
				habit &&
				row.resourceName &&
				!habit.resources.includes(row.resourceName)
			) {
				habit.resources.push(row.resourceName);
			}
		}
		return Array.from(habitsMap.values());
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

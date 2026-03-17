import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const rewardsRepository = {
	async getAll() {
		return await db.select().from(schema.reward);
	},
	async create(data: typeof schema.reward.$inferInsert) {
		return await db.insert(schema.reward).values(data).returning();
	},
	async update(id: string, data: Partial<typeof schema.reward.$inferInsert>) {
		return await db
			.update(schema.reward)
			.set(data)
			.where(eq(schema.reward.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.reward)
			.where(eq(schema.reward.id, id))
			.returning();
	},
};

export const milestonesRepository = {
	async getAll() {
		return await db.select().from(schema.milestone);
	},
	async create(data: typeof schema.milestone.$inferInsert) {
		return await db.insert(schema.milestone).values(data).returning();
	},
	async update(
		id: string,
		data: Partial<typeof schema.milestone.$inferInsert>,
	) {
		return await db
			.update(schema.milestone)
			.set(data)
			.where(eq(schema.milestone.id, id))
			.returning();
	},
	async delete(id: string) {
		return await db
			.delete(schema.milestone)
			.where(eq(schema.milestone.id, id))
			.returning();
	},
};

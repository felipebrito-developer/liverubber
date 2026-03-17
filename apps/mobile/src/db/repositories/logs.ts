import { schema } from "@liverubber/shared";
import { db } from "../client";

export const logsRepository = {
	async getAllActivityLogs() {
		return await db.select().from(schema.activityLog);
	},
	async logActivity(data: typeof schema.activityLog.$inferInsert) {
		return await db.insert(schema.activityLog).values(data).returning();
	},
	async getAllResourceLogs() {
		return await db.select().from(schema.resourceLog);
	},
	async logResourceChange(data: typeof schema.resourceLog.$inferInsert) {
		return await db.insert(schema.resourceLog).values(data).returning();
	},
};

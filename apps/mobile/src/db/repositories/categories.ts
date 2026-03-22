import { schema } from "@liverubber/shared";
import { eq } from "drizzle-orm";
import { db } from "../client";

export const categoriesRepository = {
	async getAll() {
		return await db.select().from(schema.categoryType);
	},
	async getById(id: string) {
		const results = await db
			.select()
			.from(schema.categoryType)
			.where(eq(schema.categoryType.id, id));
		return results[0];
	},
};

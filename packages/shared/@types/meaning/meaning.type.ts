import type { z } from "zod";
import type {
	insertMeaningSchema,
	selectMeaningSchema,
} from "../../db/schema/meanings";

import type { CategoryType } from "../category/category.type";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Meaning = z.infer<typeof selectMeaningSchema> & {
	category?: CategoryType;
};
export type NewMeaning = z.infer<typeof insertMeaningSchema>;

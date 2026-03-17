import type { z } from "zod";
import type {
	insertMeaningSchema,
	selectMeaningSchema,
} from "../../db/schema/meanings";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Meaning = z.infer<typeof selectMeaningSchema>;
export type NewMeaning = z.infer<typeof insertMeaningSchema>;

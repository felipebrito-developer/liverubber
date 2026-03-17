import type { z } from "zod";
import type {
	insertMilestoneSchema,
	selectMilestoneSchema,
} from "../../db/schema/goals";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Milestone = z.infer<typeof selectMilestoneSchema>;
export type NewMilestone = z.infer<typeof insertMilestoneSchema>;

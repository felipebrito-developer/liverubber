import type { z } from "zod";
import type {
	insertGoalSchema,
	selectGoalAssetsSchema,
	selectGoalSchema,
} from "../../db/schema/goals";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Goal = z.infer<typeof selectGoalSchema>;
export type NewGoal = z.infer<typeof insertGoalSchema>;

export type GoalAsset = z.infer<typeof selectGoalAssetsSchema>;

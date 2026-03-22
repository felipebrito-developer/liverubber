import type { z } from "zod";
import type {
	insertGoalSchema,
	selectGoalAssetsSchema,
	selectGoalSchema,
} from "../../db/schema/goals";

import type { Meaning } from "../meaning/meaning.type";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Goal = z.infer<typeof selectGoalSchema> & {
	meaning?: Meaning;
};
export type NewGoal = z.infer<typeof insertGoalSchema>;

export type GoalAsset = z.infer<typeof selectGoalAssetsSchema>;

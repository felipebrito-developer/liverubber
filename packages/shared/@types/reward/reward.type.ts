import type { z } from "zod";
import type {
	insertRewardSchema,
	selectRewardSchema,
} from "../../db/schema/rewards";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Reward = z.infer<typeof selectRewardSchema>;
export type NewReward = z.infer<typeof insertRewardSchema>;

import type { z } from "zod";
import type {
	insertActivitySchema,
	selectActivitySchema,
} from "../../db/schema/core";
import type {
	insertActivityLogSchema,
	selectActivityLogSchema,
} from "../../db/schema/logs";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Activity = z.infer<typeof selectActivitySchema>;
export type NewActivity = z.infer<typeof insertActivitySchema>;

export type ActivityLog = z.infer<typeof selectActivityLogSchema>;
export type NewActivityLog = z.infer<typeof insertActivityLogSchema>;

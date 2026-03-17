import type { z } from "zod";
import type {
	insertHabitSchema,
	selectHabitSchema,
} from "../../db/schema/habits_events";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Habit = z.infer<typeof selectHabitSchema>;
export type NewHabit = z.infer<typeof insertHabitSchema>;

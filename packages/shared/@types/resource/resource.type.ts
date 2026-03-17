import type { z } from "zod";
import type {
	insertResourceLogSchema,
	insertResourceStoreSchema,
	insertResourceTypeSchema,
	selectResourceLogSchema,
	selectResourceStoreSchema,
	selectResourceTypeSchema,
} from "../../db/schema/resources";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type ResourceType = z.infer<typeof selectResourceTypeSchema>;
export type NewResourceType = z.infer<typeof insertResourceTypeSchema>;

export type ResourceStore = z.infer<typeof selectResourceStoreSchema>;
export type NewResourceStore = z.infer<typeof insertResourceStoreSchema>;

export type ResourceLog = z.infer<typeof selectResourceLogSchema>;
export type NewResourceLog = z.infer<typeof insertResourceLogSchema>;

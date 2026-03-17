import type { z } from "zod";
import type {
	insertAssetSchema,
	selectAssetSchema,
} from "../../db/schema/assets";

/**
 * Core types inferred from Zod schemas for consistency with DB.
 */
export type Asset = z.infer<typeof selectAssetSchema>;
export type NewAsset = z.infer<typeof insertAssetSchema>;

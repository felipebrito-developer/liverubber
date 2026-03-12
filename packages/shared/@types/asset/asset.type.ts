import type { Entity } from "../base/entity.type";

export interface Asset extends Entity {
	name: string;
	filePath: string;
	mediaType: string;
}

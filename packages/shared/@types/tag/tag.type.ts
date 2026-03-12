import type { Entity } from "../base/entity.type";

export interface TagType extends Entity {
	colorHex: string;
	name: string;
}

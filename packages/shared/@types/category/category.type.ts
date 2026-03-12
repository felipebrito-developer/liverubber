import type { Entity } from "../base/entity.type";

export interface CategoryType extends Entity {
	name: string;
	categoryColor: string;
	description: string;
}

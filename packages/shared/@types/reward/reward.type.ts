import type { Entity } from "../base/entity.type";

export interface Reward extends Entity {
	description: string;
	name: string;
	type: string;
}

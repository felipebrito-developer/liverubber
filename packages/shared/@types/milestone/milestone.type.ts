import type { Entity } from "../base/entity.type";

export interface Milestone extends Entity {
	goalId: string | null;
	rewardId: string;
	name: string;
	description: string | null;
	type: string;
	isCompleted: boolean;
}

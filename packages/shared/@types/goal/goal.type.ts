import type { Entity, Status } from "../base/entity.type";

export interface Goal extends Entity {
	meaningId: string | null;
	name: string;
	description: string;
	status: Status;
	dueDate: string | null;
	progress: number;
	coverImageId: string | null;
}

export interface GoalAsset {
	goalId: string;
	assetId: string;
}

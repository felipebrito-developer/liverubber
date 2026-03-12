import type { Entity } from "../base/entity.type";

export interface ResourceType extends Entity {
	amountType: string;
	name: string;
	description: string;
}

export interface ResourceStore extends Entity {
	resourceTypeId: string;
	amount: number;
}

export interface ResourceAssignment extends Entity {
	resourceId: string;
	entityRelatedId: string;
	relationType: string;
	amount: number;
	isCompleted: boolean;
}

export interface ResourceLog extends Entity {
	resourceId: string;
	amountChange: number;
	changeType: string;
	logDate: string | null;
}

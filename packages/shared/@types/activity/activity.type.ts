import type { Entity } from "../base/entity.type";

export interface Activity extends Entity {
	title: string;
	description: string;
	iconName: string;
	tagId: string;
}

export interface ActivityLog extends Entity {
	activityId: string;
	taskId: string | null;
	habitId: string | null;
	completedAt: string;
	amountAchieved: number;
	moodRating: number;
}

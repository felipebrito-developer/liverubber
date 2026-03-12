export type Status =
	| "todo"
	| "pending"
	| "in_progress"
	| "completed"
	| "cancelled"
	| "archived"
	| "paused"
	| "active";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Entity {
	id: string;
	createdAt: string;
	updatedAt: string;
}

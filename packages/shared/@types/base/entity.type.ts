export type Status = "pending" | "in_progress" | "completed" | "cancelled";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Entity {
	id: string;
	createdAt: string;
	updatedAt: string;
}

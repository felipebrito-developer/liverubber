import type { Entity } from "../base/entity.type";

export interface Habit extends Entity {
	meaningId: string | null;
	frequencyId: string | null;
	name: string;
	startDate: string | null;
	lastUpdate: string | null;
	streakCount: number;
}

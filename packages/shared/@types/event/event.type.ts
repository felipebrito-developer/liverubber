import type { Entity } from "../base/entity.type";

export interface Event extends Entity {
	categoryId: string;
	frequencyId: string;
	title: string;
	startDate: string;
	endDate: string | null;
	location: string | null;
	link: string | null;
}

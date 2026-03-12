import type { Entity } from "../base/entity.type";

export interface FrequencyType extends Entity {
	type: string;
	name: string;
	frequencyPeriod: string;
	amount: number;
	repeat: boolean;
}

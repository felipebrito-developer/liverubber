import type { Entity } from "../base/entity.type";

export interface Meaning extends Entity {
	categoryId: string | null;
	name: string;
	description: string;
	externalLink: string | null;
}

export interface MeaningAsset {
	meaningId: string;
	assetId: string;
}

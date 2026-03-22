import type { Meaning, NewMeaning } from "@liverubber/shared";
import { atom } from "jotai";
import { meaningsRepository } from "../db/repositories/meanings";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const meaningsAtom = atom<Meaning[]>([]);
export const isMeaningsLoadedAtom = atom(false);

export const loadMeaningsAction = atom(null, async (_get, set) => {
	const data = await meaningsRepository.getAll();
	const meanings = data.map((row: any) => ({
		...row.meaning,
		category: row.category,
	}));
	set(meaningsAtom, meanings as Meaning[]);
	set(isMeaningsLoadedAtom, true);
});

export const createMeaningAction = atom(
	null,
	async (_get, set, payload: Omit<NewMeaning, "id">) => {
		const id = uuidv4();
		await meaningsRepository.create({ ...payload, id } as NewMeaning);
		set(loadMeaningsAction);
	},
);

export const updateMeaningAction = atom(
	null,
	async (
		_get,
		set,
		{ id, data }: { id: string; data: Partial<NewMeaning> },
	) => {
		await meaningsRepository.update(id, data);
		set(loadMeaningsAction);
	},
);

export const deleteMeaningAction = atom(null, async (_get, set, id: string) => {
	await meaningsRepository.delete(id);
	set(loadMeaningsAction);
});

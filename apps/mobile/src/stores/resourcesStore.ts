import type {
	NewResourceLog,
	ResourceLog,
	ResourceStore,
} from "@liverubber/shared";
import { atom } from "jotai";
import { logsRepository } from "../db/repositories/logs";
import { resourcesRepository } from "../db/repositories/resources";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type UIResourceStore = ResourceStore & { name: string | null };

export const resourceStoresAtom = atom<UIResourceStore[]>([]);
export const resourceLogsAtom = atom<ResourceLog[]>([]);

export const loadResourcesAction = atom(null, async (_get, set) => {
	const stores = await resourcesRepository.getAllStores();
	const logs = await logsRepository.getAllResourceLogs();
	set(resourceStoresAtom, stores as UIResourceStore[]);
	set(resourceLogsAtom, logs as ResourceLog[]);
});

export const logResourceChangeAction = atom(
	null,
	async (_get, set, payload: Omit<NewResourceLog, "id">) => {
		const id = uuidv4();
		await logsRepository.logResourceChange({
			...payload,
			id,
		} as NewResourceLog);
		set(loadResourcesAction);
	},
);

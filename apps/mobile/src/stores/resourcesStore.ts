import type {
	NewResourceLog,
	NewResourceStore,
	NewResourceType,
	ResourceLog,
	ResourceStore,
	ResourceType,
} from "@liverubber/shared";
import { atom } from "jotai";
import { logsRepository } from "../db/repositories/logs";
import { resourcesRepository } from "../db/repositories/resources";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type UIResourceStore = ResourceStore & { name: string | null };

export const resourceStoresAtom = atom<UIResourceStore[]>([]);
export const resourceTypesAtom = atom<ResourceType[]>([]);
export const resourceLogsAtom = atom<ResourceLog[]>([]);

export const loadResourcesAction = atom(null, async (_get, set) => {
	const stores = await resourcesRepository.getAllStores();
	const types = await resourcesRepository.getAllTypes();
	const logs = await logsRepository.getAllResourceLogs();
	set(resourceStoresAtom, stores as UIResourceStore[]);
	set(resourceTypesAtom, types as ResourceType[]);
	set(resourceLogsAtom, logs as ResourceLog[]);
});

export const createResourceTypeAction = atom(
	null,
	async (_get, set, payload: Omit<NewResourceType, "id">) => {
		const id = uuidv4();
		await resourcesRepository.createType({ ...payload, id } as NewResourceType);
		set(loadResourcesAction);
	},
);

export const createResourceStoreAction = atom(
	null,
	async (_get, set, payload: Omit<NewResourceStore, "id">) => {
		const id = uuidv4();
		await resourcesRepository.createStore({
			...payload,
			id,
		} as NewResourceStore);
		set(loadResourcesAction);
	},
);

export const createResourceAction = atom(
	null,
	async (
		_get,
		set,
		{ name, initialAmount }: { name: string; initialAmount: number },
	) => {
		const typeId = uuidv4();
		const storeId = uuidv4();

		// 1. Create Type
		await resourcesRepository.createType({
			id: typeId,
			name,
			amountType: "numerical",
			description: `Store for ${name}`,
		} as NewResourceType);

		// 2. Create Store
		await resourcesRepository.createStore({
			id: storeId,
			resourceTypeId: typeId,
			amount: initialAmount,
		} as NewResourceStore);

		set(loadResourcesAction);
	},
);

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

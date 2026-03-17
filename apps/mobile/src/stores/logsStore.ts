import type { ActivityLog, NewActivityLog } from "@liverubber/shared";
import { atom } from "jotai";
import { logsRepository } from "@/db/repositories/logs";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const activityLogsAtom = atom<ActivityLog[]>([]);
export const isLogsLoadedAtom = atom(false);

export const loadLogsAction = atom(null, async (_get, set) => {
	const logs = await logsRepository.getAllActivityLogs();
	set(activityLogsAtom, logs as ActivityLog[]);
	set(isLogsLoadedAtom, true);
});

export const logActivityAction = atom(
	null,
	async (get, set, log: Omit<NewActivityLog, "id">) => {
		const id = uuidv4();
		const result = await logsRepository.logActivity({
			...log,
			id,
		} as NewActivityLog);
		const newLog = result[0];
		if (!newLog) return;

		const current = get(activityLogsAtom);
		set(activityLogsAtom, [newLog as ActivityLog, ...current]);
	},
);

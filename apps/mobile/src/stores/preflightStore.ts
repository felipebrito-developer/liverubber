import { atom } from "jotai";

export interface PreflightItem {
	id: string;
	title: string;
	resources: string[];
	type: "task" | "habit" | "fitness";
	onConfirm?: () => void;
}

/** The current item being evaluated in the Logistical Gate */
export const activePreflightAtom = atom<PreflightItem | null>(null);

/** Action to initiate preflight for an item */
export const startPreflightAction = atom(
	null,
	(_get, set, item: PreflightItem) => {
		set(activePreflightAtom, item);
	},
);

/** Action to clear preflight */
export const clearPreflightAction = atom(null, (_get, set) => {
	set(activePreflightAtom, null);
});

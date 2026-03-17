import type { AuthUser } from "@liverubber/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

export type { AuthUser };

const AUTH_STORAGE_KEY = "@liverubber_auth_user";

/** Currently authenticated user */
export const userAtom = atom<AuthUser | null>(null);

/** Derived: is the user authenticated? */
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

/** Loading state for auth operations */
export const authLoadingAtom = atom(false);

/** Auth error message */
export const authErrorAtom = atom<string | null>(null);

/** Action to load session from storage */
export const loadSessionAction = atom(null, async (_get, set) => {
	try {
		const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
		if (stored) {
			set(userAtom, JSON.parse(stored));
		}
	} catch (err) {
		console.error("Failed to load auth session", err);
	}
});

/** Action to save session to storage */
export const saveSessionAction = atom(
	null,
	async (_get, set, user: AuthUser) => {
		try {
			await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
			set(userAtom, user);
		} catch (err) {
			console.error("Failed to save auth session", err);
		}
	},
);

/** Action to logout */
export const logoutAction = atom(null, async (_get, set) => {
	try {
		await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
		set(userAtom, null);
	} catch (err) {
		console.error("Failed to clear auth session", err);
	}
});

import type { AuthUser } from "@liverubber/shared";
import { atom } from "jotai";

export type { AuthUser };

/** Currently authenticated user, null when logged out */
export const userAtom = atom<AuthUser | null>(null);

/** Derived: is the user authenticated? */
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

/** Loading state for auth operations */
export const authLoadingAtom = atom(false);

/** Auth error message */
export const authErrorAtom = atom<string | null>(null);

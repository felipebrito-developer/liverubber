import type { CategoryType } from "@liverubber/shared";
import { atom } from "jotai";
import { categoriesRepository } from "../db/repositories/categories";

export const categoriesAtom = atom<CategoryType[]>([]);
export const isCategoriesLoadedAtom = atom(false);

export const loadCategoriesAction = atom(null, async (_get, set) => {
	const data = await categoriesRepository.getAll();
	set(categoriesAtom, data as CategoryType[]);
	set(isCategoriesLoadedAtom, true);
});

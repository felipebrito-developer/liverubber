import { atom } from "jotai";
import { type TagType } from "@liverubber/shared";
import { db } from "../db/client";

export const tagsAtom = atom<TagType[]>([]);
export const isTagsLoadedAtom = atom(false);

export const loadTagsAction = atom(null, async (_get, set) => {
	const data = await db.query.tagType.findMany();
	set(tagsAtom, data as TagType[]);
	set(isTagsLoadedAtom, true);
});

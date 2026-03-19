import type { Meaning } from "@liverubber/shared";
import { v4 as uuidv4 } from "uuid";
import { getDB } from "../../db";

interface MeaningRow {
	id: string;
	category_id: string | null;
	name: string;
	description: string;
	external_link: string | null;
	created_at: string | null;
	updated_at: string | null;
	is_synced: number | null;
	last_synced_at: string | null;
}

const mapMeaning = (row: MeaningRow): Meaning => ({
	id: row.id,
	categoryId: row.category_id,
	name: row.name,
	description: row.description,
	externalLink: row.external_link,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
	isSynced: row.is_synced === 1,
	lastSyncedAt: row.last_synced_at,
});

export interface MeaningInsert {
	category_id?: string | null;
	name: string;
	description: string;
	external_link?: string | null;
}

export interface MeaningUpdate {
	category_id?: string | null;
	name?: string;
	description?: string;
	external_link?: string | null;
}

export const MeaningRepository = {
	getMeanings(): Meaning[] {
		const db = getDB();
		const stmt = db.query("SELECT * FROM meaning ORDER BY created_at DESC");
		const rows = stmt.all() as MeaningRow[];
		return rows.map(mapMeaning);
	},

	getMeaningById(id: string): Meaning | null {
		const db = getDB();
		const stmt = db.query("SELECT * FROM meaning WHERE id = ?");
		const row = stmt.get(id) as MeaningRow | undefined;
		return row ? mapMeaning(row) : null;
	},

	createMeaning(data: MeaningInsert): Meaning {
		const db = getDB();
		const stmt = db.query(`
			INSERT INTO meaning (id, category_id, name, description, external_link, created_at, updated_at, is_synced)
			VALUES ($id, $category_id, $name, $description, $external_link, $now, $now, 1)
			RETURNING *
		`);
		const now = new Date().toISOString();
		const row = stmt.get({
			$id: uuidv4(),
			$category_id: data.category_id ?? null,
			$name: data.name,
			$description: data.description,
			$external_link: data.external_link ?? null,
			$now: now,
		}) as MeaningRow;
		return mapMeaning(row);
	},

	updateMeaning(id: string, data: MeaningUpdate): Meaning | null {
		const db = getDB();
		const current = db.query("SELECT * FROM meaning WHERE id = ?").get(id) as
			| MeaningRow
			| undefined;
		if (!current) return null;

		const stmt = db.query(`
			UPDATE meaning
			SET 
				category_id = $category_id,
				name = $name,
				description = $description,
				external_link = $external_link,
				updated_at = $updated_at
			WHERE id = $id
			RETURNING *
		`);

		const toUpdate = {
			$id: id,
			$category_id:
				data.category_id !== undefined ? data.category_id : current.category_id,
			$name: data.name !== undefined ? data.name : current.name,
			$description:
				data.description !== undefined ? data.description : current.description,
			$external_link:
				data.external_link !== undefined
					? data.external_link
					: current.external_link,
			$updated_at: new Date().toISOString(),
		};

		const row = stmt.get(toUpdate) as MeaningRow;
		return mapMeaning(row);
	},

	deleteMeaning(id: string): boolean {
		const db = getDB();
		const stmt = db.query("DELETE FROM meaning WHERE id = ?");
		const info = stmt.run(id);
		return info.changes > 0;
	},
};

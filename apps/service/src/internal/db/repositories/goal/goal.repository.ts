import type { Goal } from "@liverubber/shared";
import { v4 as uuidv4 } from "uuid";
import { getDB } from "../../db";

interface GoalRow {
	id: string;
	category_id: string | null;
	meaning_id: string | null;
	name: string;
	description: string;
	status: string;
	due_date: string | null;
	progress: number;
	cover_image_id: string | null;
	created_at: string | null;
	updated_at: string | null;
	is_synced: number | null;
	last_synced_at: string | null;
}

const mapGoal = (row: GoalRow): Goal => ({
	id: row.id,
	categoryId: row.category_id,
	meaningId: row.meaning_id,
	name: row.name,
	description: row.description,
	status: row.status as Goal["status"],
	dueDate: row.due_date,
	progress: row.progress,
	coverImageId: row.cover_image_id,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
	isSynced: row.is_synced === 1,
	lastSyncedAt: row.last_synced_at,
});

export interface GoalInsert {
	category_id?: string | null;
	meaning_id?: string | null;
	name: string;
	description: string;
	status?: "active" | "completed" | "archived" | "paused";
	due_date?: string | null;
	progress?: number;
	cover_image_id?: string | null;
}

export interface GoalUpdate {
	category_id?: string | null;
	meaning_id?: string | null;
	name?: string;
	description?: string;
	status?: "active" | "completed" | "archived" | "paused";
	due_date?: string | null;
	progress?: number;
	cover_image_id?: string | null;
}

export const GoalRepository = {
	getGoals(): Goal[] {
		const db = getDB();
		const stmt = db.query("SELECT * FROM goal ORDER BY created_at DESC");
		const rows = stmt.all() as GoalRow[];
		return rows.map(mapGoal);
	},

	getGoalById(id: string): Goal | null {
		const db = getDB();
		const stmt = db.query("SELECT * FROM goal WHERE id = ?");
		const row = stmt.get(id) as GoalRow | undefined;
		return row ? mapGoal(row) : null;
	},

	createGoal(data: GoalInsert): Goal {
		const db = getDB();
		const stmt = db.query(`
			INSERT INTO goal (id, category_id, meaning_id, name, description, status, due_date, progress, cover_image_id, created_at, updated_at, is_synced)
			VALUES ($id, $category_id, $meaning_id, $name, $description, $status, $due_date, $progress, $cover_image_id, $now, $now, 1)
			RETURNING *
		`);
		const now = new Date().toISOString();
		const row = stmt.get({
			$id: uuidv4(),
			$category_id: data.category_id ?? null,
			$meaning_id: data.meaning_id ?? null,
			$name: data.name,
			$description: data.description,
			$status: data.status ?? "active",
			$due_date: data.due_date ?? null,
			$progress: data.progress ?? 0,
			$cover_image_id: data.cover_image_id ?? null,
			$now: now,
		}) as GoalRow;
		return mapGoal(row);
	},

	updateGoal(id: string, data: GoalUpdate): Goal | null {
		const db = getDB();
		const current = db.query("SELECT * FROM goal WHERE id = ?").get(id) as
			| GoalRow
			| undefined;
		if (!current) return null;

		const stmt = db.query(`
			UPDATE goal
			SET 
				category_id = $category_id,
				meaning_id = $meaning_id,
				name = $name,
				description = $description,
				status = $status,
				due_date = $due_date,
				progress = $progress,
				cover_image_id = $cover_image_id,
				updated_at = $updated_at
			WHERE id = $id
			RETURNING *
		`);

		const toUpdate = {
			$id: id,
			$category_id:
				data.category_id !== undefined ? data.category_id : current.category_id,
			$meaning_id:
				data.meaning_id !== undefined ? data.meaning_id : current.meaning_id,
			$name: data.name !== undefined ? data.name : current.name,
			$description:
				data.description !== undefined ? data.description : current.description,
			$status: data.status !== undefined ? data.status : current.status,
			$due_date: data.due_date !== undefined ? data.due_date : current.due_date,
			$progress: data.progress !== undefined ? data.progress : current.progress,
			$cover_image_id:
				data.cover_image_id !== undefined
					? data.cover_image_id
					: current.cover_image_id,
			$updated_at: new Date().toISOString(),
		};

		const row = stmt.get(toUpdate) as GoalRow;
		return mapGoal(row);
	},

	deleteGoal(id: string): boolean {
		const db = getDB();
		const stmt = db.query("DELETE FROM goal WHERE id = ?");
		const info = stmt.run(id);
		return info.changes > 0;
	},
};

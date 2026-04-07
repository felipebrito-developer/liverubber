import type { TaskDefinition } from "@liverubber/shared";
import { v4 as uuidv4 } from "uuid";
import { getDB } from "../../db";

interface TaskRow {
	id: string;
	goal_id: string | null;
	parent_task_id: string | null;
	title: string;
	description: string;
	status: string | null;
	due_date: string | null;
	priority: string | null;
	is_for_today: number | null;
	created_at: string | null;
	updated_at: string | null;
	is_synced: number | null;
	last_synced_at: string | null;
}

const mapTask = (row: TaskRow): TaskDefinition => ({
	id: row.id,
	goalId: row.goal_id,
	parentTaskId: row.parent_task_id,
	title: row.title,
	description: row.description,
	status: row.status as TaskDefinition["status"],
	dueDate: row.due_date,
	priority: row.priority as TaskDefinition["priority"],
	isForToday: row.is_for_today === 1,
	createdAt: row.created_at,
	updatedAt: row.updated_at,
	isSynced: row.is_synced === 1,
	lastSyncedAt: row.last_synced_at,
});

export interface TaskInsert {
	goal_id?: string | null;
	parent_task_id?: string | null;
	title: string;
	description: string;
	status?: "todo" | "in_progress" | "done";
	due_date?: string | null;
	priority?: string | null;
	is_for_today?: boolean;
}

export interface TaskUpdate {
	goal_id?: string | null;
	parent_task_id?: string | null;
	title?: string;
	description?: string;
	status?: "todo" | "in_progress" | "done";
	due_date?: string | null;
	priority?: string | null;
	is_for_today?: boolean;
}

export const TaskRepository = {
	getTasks(): TaskDefinition[] {
		const db = getDB();
		const stmt = db.query("SELECT * FROM task ORDER BY created_at DESC");
		const rows = stmt.all() as TaskRow[];
		return rows.map(mapTask);
	},

	getTaskById(id: string): TaskDefinition | null {
		const db = getDB();
		const stmt = db.query("SELECT * FROM task WHERE id = ?");
		const row = stmt.get(id) as TaskRow | undefined;
		return row ? mapTask(row) : null;
	},

	createTask(data: TaskInsert): TaskDefinition {
		const db = getDB();
		const stmt = db.query(`
			INSERT INTO task (id, goal_id, parent_task_id, title, description, status, due_date, priority, is_for_today, created_at, updated_at, is_synced)
			VALUES ($id, $goal_id, $parent_task_id, $title, $description, $status, $due_date, $priority, $is_for_today, $now, $now, 1)
			RETURNING *
		`);
		const now = new Date().toISOString();
		const row = stmt.get({
			$id: uuidv4(),
			$goal_id: data.goal_id ?? null,
			$parent_task_id: data.parent_task_id ?? null,
			$title: data.title,
			$description: data.description,
			$status: data.status ?? "todo",
			$due_date: data.due_date ?? null,
			$priority: data.priority ?? null,
			$is_for_today: data.is_for_today ? 1 : 0,
			$now: now,
		}) as TaskRow;
		return mapTask(row);
	},

	updateTask(id: string, data: TaskUpdate): TaskDefinition | null {
		const db = getDB();
		const current = db.query("SELECT * FROM task WHERE id = ?").get(id) as
			| TaskRow
			| undefined;
		if (!current) return null;

		const stmt = db.query(`
			UPDATE task
			SET 
				goal_id = $goal_id,
				parent_task_id = $parent_task_id,
				title = $title,
				description = $description,
				status = $status,
				due_date = $due_date,
				priority = $priority,
				is_for_today = $is_for_today,
				updated_at = $updated_at
			WHERE id = $id
			RETURNING *
		`);

		const toUpdate = {
			$id: id,
			$goal_id: data.goal_id !== undefined ? data.goal_id : current.goal_id,
			$parent_task_id:
				data.parent_task_id !== undefined
					? data.parent_task_id
					: current.parent_task_id,
			$title: data.title !== undefined ? data.title : current.title,
			$description:
				data.description !== undefined ? data.description : current.description,
			$status: data.status !== undefined ? data.status : current.status,
			$due_date: data.due_date !== undefined ? data.due_date : current.due_date,
			$priority: data.priority !== undefined ? data.priority : current.priority,
			$is_for_today:
				data.is_for_today !== undefined
					? (data.is_for_today ? 1 : 0)
					: current.is_for_today,
			$updated_at: new Date().toISOString(),
		};

		const row = stmt.get(toUpdate) as TaskRow;
		return mapTask(row);
	},

	deleteTask(id: string): boolean {
		const db = getDB();
		const stmt = db.query("DELETE FROM task WHERE id = ?");
		const info = stmt.run(id);
		return info.changes > 0;
	},
};

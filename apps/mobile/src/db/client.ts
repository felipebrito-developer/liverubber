import {
	INITIAL_CATEGORIES,
	INITIAL_FREQUENCIES,
	INITIAL_GOALS,
	INITIAL_HABITS,
	INITIAL_MEANINGS,
	INITIAL_TAGS,
	INITIAL_TASKS,
	schema,
} from "@liverubber/shared";
import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";

// Initialize the SQLite database
const sqliteDB = open({
	name: "liverubber.db",
});

// Create the Drizzle ORM client with schema for type safety and relations
export const db = drizzle(sqliteDB, { schema });

const INITIALIZATION_SQL = `
CREATE TABLE IF NOT EXISTS asset (
  id VARCHAR PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  file_path TEXT NOT NULL,
  media_type VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME
);

CREATE TABLE IF NOT EXISTS category_type (
  id VARCHAR PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  category_color VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME
);

CREATE TABLE IF NOT EXISTS frequency_type (
  id VARCHAR PRIMARY KEY NOT NULL,
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  frequency_period VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  repeat BOOLEAN NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME
);

CREATE TABLE IF NOT EXISTS tag_type (
  id VARCHAR PRIMARY KEY NOT NULL,
  color_hex VARCHAR NOT NULL,
  name VARCHAR NOT NULL UNIQUE,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME
);

CREATE TABLE IF NOT EXISTS meaning (
  id VARCHAR PRIMARY KEY NOT NULL,
  category_id VARCHAR,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  external_link VARCHAR,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(category_id) REFERENCES category_type(id)
);

CREATE TABLE IF NOT EXISTS meaning_assets (
  meaning_id VARCHAR NOT NULL,
  asset_id VARCHAR NOT NULL,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  PRIMARY KEY (meaning_id, asset_id),
  FOREIGN KEY(meaning_id) REFERENCES meaning(id),
  FOREIGN KEY(asset_id) REFERENCES asset(id)
);

CREATE TABLE IF NOT EXISTS goal (
  id VARCHAR PRIMARY KEY NOT NULL,
  category_id VARCHAR,
  meaning_id VARCHAR,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR NOT NULL,
  due_date DATETIME,
  progress INTEGER NOT NULL,
  cover_image_id VARCHAR,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(category_id) REFERENCES category_type(id),
  FOREIGN KEY(meaning_id) REFERENCES meaning(id),
  FOREIGN KEY(cover_image_id) REFERENCES asset(id)
);

CREATE TABLE IF NOT EXISTS goal_assets (
  goal_id VARCHAR NOT NULL,
  asset_id VARCHAR NOT NULL,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  PRIMARY KEY (goal_id, asset_id),
  FOREIGN KEY(goal_id) REFERENCES goal(id),
  FOREIGN KEY(asset_id) REFERENCES asset(id)
);

CREATE TABLE IF NOT EXISTS habit (
  id VARCHAR PRIMARY KEY NOT NULL,
  category_id VARCHAR,
  meaning_id VARCHAR,
  frequency_id VARCHAR,
  name VARCHAR NOT NULL,
  description TEXT,
  start_date DATETIME,
  last_update DATETIME,
  streak_count INTEGER NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(category_id) REFERENCES category_type(id),
  FOREIGN KEY(meaning_id) REFERENCES meaning(id),
  FOREIGN KEY(frequency_id) REFERENCES frequency_type(id)
);

CREATE TABLE IF NOT EXISTS task (
  id VARCHAR PRIMARY KEY NOT NULL,
  goal_id VARCHAR,
  parent_task_id VARCHAR,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR,
  due_date DATE,
  priority VARCHAR,
  is_for_today INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(goal_id) REFERENCES goal(id),
  FOREIGN KEY(parent_task_id) REFERENCES task(id)
);

CREATE TABLE IF NOT EXISTS event (
  id VARCHAR PRIMARY KEY NOT NULL,
  category_id VARCHAR NOT NULL,
  frequency_id VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  location VARCHAR,
  link VARCHAR,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(category_id) REFERENCES category_type(id),
  FOREIGN KEY(frequency_id) REFERENCES frequency_type(id)
);

CREATE TABLE IF NOT EXISTS reward (
  id VARCHAR PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME
);

CREATE TABLE IF NOT EXISTS milestone (
  id VARCHAR PRIMARY KEY NOT NULL,
  goal_id VARCHAR,
  reward_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL,
  is_completed BOOLEAN NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(goal_id) REFERENCES goal(id),
  FOREIGN KEY(reward_id) REFERENCES reward(id)
);

CREATE TABLE IF NOT EXISTS resource_type (
  id VARCHAR PRIMARY KEY NOT NULL,
  category_id VARCHAR,
  amount_type VARCHAR NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(category_id) REFERENCES category_type(id)
);

CREATE TABLE IF NOT EXISTS resource_store (
  id VARCHAR PRIMARY KEY NOT NULL,
  resource_type_id VARCHAR NOT NULL,
  amount FLOAT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(resource_type_id) REFERENCES resource_type(id)
);

CREATE TABLE IF NOT EXISTS resources_assignments (
  id VARCHAR PRIMARY KEY NOT NULL,
  resource_id VARCHAR NOT NULL,
  entity_related_id VARCHAR NOT NULL,
  relation_type VARCHAR NOT NULL,
  amount FLOAT,
  is_completed BOOLEAN NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(resource_id) REFERENCES resource_store(id)
);

CREATE TABLE IF NOT EXISTS activity (
  id VARCHAR PRIMARY KEY NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR NOT NULL,
  tag_id VARCHAR NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(tag_id) REFERENCES tag_type(id)
);

CREATE TABLE IF NOT EXISTS activity_log (
  id VARCHAR PRIMARY KEY NOT NULL,
  activity_id VARCHAR NOT NULL,
  task_id VARCHAR,
  habit_id VARCHAR,
  completed_at DATETIME NOT NULL,
  amount_achieved FLOAT NOT NULL,
  mood_rating INTEGER NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(activity_id) REFERENCES activity(id),
  FOREIGN KEY(task_id) REFERENCES task(id),
  FOREIGN KEY(habit_id) REFERENCES habit(id)
);

CREATE TABLE IF NOT EXISTS resource_log (
  id VARCHAR PRIMARY KEY NOT NULL,
  resource_id VARCHAR NOT NULL,
  amount_change FLOAT NOT NULL,
  change_type VARCHAR NOT NULL,
  log_date DATETIME,
  created_at DATETIME,
  updated_at DATETIME,
  is_synced INTEGER DEFAULT 0,
  last_synced_at DATETIME,
  FOREIGN KEY(resource_id) REFERENCES resource_store(id)
);

CREATE TABLE IF NOT EXISTS task_tag (
  task_id VARCHAR NOT NULL,
  tag_id VARCHAR NOT NULL,
  PRIMARY KEY (task_id, tag_id),
  FOREIGN KEY(task_id) REFERENCES task(id),
  FOREIGN KEY(tag_id) REFERENCES tag_type(id)
);

CREATE TABLE IF NOT EXISTS habit_tag (
  habit_id VARCHAR NOT NULL,
  tag_id VARCHAR NOT NULL,
  PRIMARY KEY (habit_id, tag_id),
  FOREIGN KEY(habit_id) REFERENCES habit(id),
  FOREIGN KEY(tag_id) REFERENCES tag_type(id)
);
`;

/**
 * Executes the DDL statements to set up the DB locally on first launch.
 */
export async function initializeDatabase() {
	try {
		const ddlStatements = INITIALIZATION_SQL.split(";")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		for (const ddl of ddlStatements) {
			await sqliteDB.execute(ddl);
		}

		// Run safety migrations for existing tables
		await runMigrations();

		// Seed initial data after tables are ready
		await seedDatabase();

		console.log("Local SQLite initialized and seeded successfully");
	} catch (err) {
		console.error("Local SQLite initialization failed", err);
	}
}

/**
 * Defensive migrations to ensure existing tables match the new schema.
 */
async function runMigrations() {
	const migrations = [
		{
			table: "habit",
			column: "category_id",
			ddl: "ALTER TABLE habit ADD COLUMN category_id VARCHAR;",
		},
		{
			table: "habit",
			column: "description",
			ddl: "ALTER TABLE habit ADD COLUMN description TEXT;",
		},
		{
			table: "goal",
			column: "category_id",
			ddl: "ALTER TABLE goal ADD COLUMN category_id VARCHAR;",
		},
		{
			table: "task",
			column: "is_for_today",
			ddl: "ALTER TABLE task ADD COLUMN is_for_today INTEGER DEFAULT 0;",
		},
	];

	for (const m of migrations) {
		try {
			// Check if column exists using table_info pragma
			const info = await sqliteDB.execute(`PRAGMA table_info(${m.table});`);
			// Handle different op-sqlite response formats for rows
			const rows = info.rows as unknown as { name: string }[] | undefined;
			const columnExists = rows?.some((col) => col.name === m.column);

			if (!columnExists) {
				await sqliteDB.execute(m.ddl);
				console.log(`Migration applied: Added ${m.column} to ${m.table}`);
			}
		} catch (e) {
			console.warn(`Migration skipped or failed for ${m.column}:`, e);
		}
	}
}

/**
 * Seeds the database with default values from the shared package.
 */
async function seedDatabase() {
	const now = new Date().toISOString();

	try {
		// 1. Categories
		await db
			.insert(schema.categoryType)
			.values(
				INITIAL_CATEGORIES.map((c) => ({
					...c,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 2. Frequencies
		await db
			.insert(schema.frequencyType)
			.values(
				INITIAL_FREQUENCIES.map((f) => ({
					...f,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 3. Tags
		await db
			.insert(schema.tagType)
			.values(
				INITIAL_TAGS.map((t) => ({
					...t,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 4. Meanings
		await db
			.insert(schema.meaning)
			.values(
				INITIAL_MEANINGS.map((m) => ({
					...m,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 5. Goals
		await db
			.insert(schema.goal)
			.values(
				INITIAL_GOALS.map((g) => ({
					...g,
					progress: 0,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 6. Habits
		await db
			.insert(schema.habit)
			.values(
				INITIAL_HABITS.map((h) => ({
					...h,
					streakCount: 0,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		// 7. Tasks
		await db
			.insert(schema.task)
			.values(
				INITIAL_TASKS.map((t) => ({
					...t,
					createdAt: now,
					updatedAt: now,
				})),
			)
			.onConflictDoNothing();

		console.log("Seed data injected successfully");
	} catch (err) {
		console.error("Seeding failed", err);
	}
}

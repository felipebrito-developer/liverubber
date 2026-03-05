import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

// DB file lives at the service root in data/ so it is gitignore-able
const DB_PATH = resolve(import.meta.dir, "../../../../data/liverubber.db");
const SCHEMA_PATH = join(import.meta.dir, "schema.sql");

let _db: Database | null = null;

/**
 * Returns the singleton SQLite database instance.
 * Creates the database file and applies the schema on first call.
 */
export function getDB(): Database {
	if (_db) return _db;

	_db = new Database(DB_PATH, { create: true });

	// Enable WAL mode for better concurrent read performance
	_db.exec("PRAGMA journal_mode = WAL;");
	_db.exec("PRAGMA foreign_keys = ON;");

	// Apply schema (idempotent — uses CREATE TABLE IF NOT EXISTS)
	const schema = readFileSync(SCHEMA_PATH, "utf-8");
	_db.exec(schema);

	console.error(`[DB] SQLite database ready at: ${DB_PATH}`);

	return _db;
}

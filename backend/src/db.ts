import path from 'path';
import sqlite3 from 'sqlite3';

export function createDatabase(dbPathFromEnv?: string) {
	const sqlite = sqlite3.verbose();
	const dbPath = dbPathFromEnv || path.join(__dirname, '..', 'data.db');
	const db = new sqlite.Database(dbPath, (err?: Error | null) => {
		if (err) {
			console.error('Failed to open database:', err.message);
			process.exit(1);
		}
		console.log(`SQLite DB opened at ${dbPath}`);
	});

	db.serialize(() => {
		db.run(
			`CREATE TABLE IF NOT EXISTS orders (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				product TEXT NOT NULL,
				qty INTEGER NOT NULL,
				price REAL NOT NULL
			)`
		);
	});

	//For testing purposes to clear all data
	//db.run(`DELETE FROM orders`);

	return db;
}

export type Database = sqlite3.Database;



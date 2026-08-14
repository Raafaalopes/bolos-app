import { db } from "./database";

export function initDatabase() {
  db.execSync(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL,
            price_cents INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
    `);
}

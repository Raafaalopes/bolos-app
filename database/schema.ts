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

  db.execSync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS pricing_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      multiplier REAL NOT NULL,
      labor_cost_cents INTEGER NOT NULL,
      packaging_cost_cents INTEGER NOT NULL,
      additional_cost_cents INTEGER NOT NULL
      );
    `);

  db.execSync(`
      INSERT OR IGNORE INTO pricing_settings (id, multiplier, labor_cost_cents, packaging_cost_cents, additional_cost_cents)
      VALUES (1, 3.0, 3000, 500, 0);
    `);
}

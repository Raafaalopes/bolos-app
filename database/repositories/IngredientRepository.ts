import { Ingredient, NewIngredient } from "../../models/Ingredients";
import { db } from "../database";

export const IngredientRepository = {
  create(ingredient: NewIngredient): number {
    const result = db.runSync(
      `INSERT INTO ingredients (name, brand, quantity, unit, price_cents)
            VALUES (?, ?, ?, ?, ?);`,
      [
        ingredient.name,
        ingredient.brand,
        ingredient.quantity,
        ingredient.unit,
        ingredient.priceCents,
      ],
    );
    return result.lastInsertRowId;
  },

  getAll(): Ingredient[] {
    const rows = db.getAllSync<any>(
      `SELECT id, name, brand, quantity, unit, price_cents, created_at
        FROM ingredients
        ORDER BY created_at DESC;`,
    );
    return rows.map(mapRowToIngredient);
  },

  getById(id: number): Ingredient | null {
    const row = db.getFirstSync<any>(
      `SELECT id, name, brand, quantity, unit, price_cents, created_at
        FROM ingredients
        WHERE id = ?;`,
      [id],
    );
    return row ? mapRowToIngredient(row) : null;
  },

  update(id: number, ingredient: NewIngredient): void {
    db.runSync(
      `UPDATE ingredients
        SET name = ?, brand = ?, quantity = ?, unit = ?, price_cents = ?
        WHERE id = ?;`,
      [
        ingredient.name,
        ingredient.brand,
        ingredient.quantity,
        ingredient.unit,
        ingredient.priceCents,
        id,
      ],
    );
  },

  remove(id: number): void {
    db.runSync(`DELETE FROM ingredients WHERE id = ?;`, [id]);
  },
};

function mapRowToIngredient(row: any): Ingredient {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    quantity: row.quantity,
    unit: row.unit,
    priceCents: row.price_cents,
    createdAt: row.created_at,
  };
}

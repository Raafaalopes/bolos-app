import { NewRecipe, Recipe } from "../../models/Recipe";
import { db } from "../database";

export const RecipeRepository = {
  create(recipe: NewRecipe): number {
    const result = db.runSync(
      `INSERT INTO recipes (name, description) VALUES (?, ?);`,
      [recipe.name, recipe.description],
    );
    return result.lastInsertRowId;
  },

  getAll(): Recipe[] {
    const rows = db.getAllSync<any>(
      `SELECT id, name, description, final_price_cents, created_at
            FROM recipes
            ORDER BY created_at DESC;`,
    );
    return rows.map(mapRowToRecipe);
  },

  getById(id: number): Recipe | null {
    const row = db.getFirstSync<any>(
      `SELECT id, name, description, final_price_cents, created_at
            FROM recipes
            WHERE id = ?;`,
      [id],
    );
    return row ? mapRowToRecipe(row) : null;
  },

  update(id: number, recipe: NewRecipe): void {
    db.runSync(`UPDATE recipes SET name = ?, description = ? WHERE id = ?;`, [
      recipe.name,
      recipe.description,
      id,
    ]);
  },

  updateFinalPrice(id: number, finalPriceCents: number | null): void {
    db.runSync(`UPDATE recipes SET final_price_cents = ? WHERE id = ?;`, [
      finalPriceCents,
      id,
    ]);
  },

  remove(id: number): void {
    db.runSync(`DELETE FROM recipes WHERE id = ?;`, [id]);
  },
};

function mapRowToRecipe(row: any): Recipe {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    finalPriceCents: row.final_price_cents,
    createdAt: row.created_at,
  };
}

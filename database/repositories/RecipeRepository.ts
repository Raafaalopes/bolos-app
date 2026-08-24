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
      `SELECT id, name, description, created_at
            FROM recipes
            ORDER BY created_at DESC;`,
    );
    return rows.map(mapRowToRecipe);
  },

  getById(id: number): Recipe | null {
    const row = db.getFirstSync<any>(
      `SELECT id, name, description, created_at
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

  remove(id: number): void {
    db.runSync(`DELETE FROM recipes WHERE id = ?;`, [id]);
  },
};

function mapRowToRecipe(row: any): Recipe {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
  };
}

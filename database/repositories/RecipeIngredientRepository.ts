import { db } from "../database";
import {
  NewRecipeIngredient,
  RecipeIngredientWithDetails,
} from "../../models/RecipeIngredient";

export const RecipeIngredientRepository = {
  create(data: NewRecipeIngredient): number {
    const result = db.runSync(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
       VALUES (?, ?, ?);`,
      [data.recipeId, data.ingredientId, data.quantity],
    );
    return result.lastInsertRowId;
  },

  getByRecipeId(recipeId: number): RecipeIngredientWithDetails[] {
    const rows = db.getAllSync<any>(
      `SELECT
         ri.id,
         ri.recipe_id,
         ri.ingredient_id,
         ri.quantity,
         ri.created_at,
         i.name AS ingredient_name,
         i.brand AS ingredient_brand,
         i.unit AS ingredient_unit,
         i.price_cents AS ingredient_price_cents,
         i.quantity AS ingredient_purchase_quantity
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ?
       ORDER BY ri.id ASC;`,
      [recipeId],
    );
    return rows.map(mapRowToRecipeIngredient);
  },

  remove(id: number): void {
    db.runSync(`DELETE FROM recipe_ingredients WHERE id = ?;`, [id]);
  },
};

function mapRowToRecipeIngredient(row: any): RecipeIngredientWithDetails {
  return {
    id: row.id,
    recipeId: row.recipe_id,
    ingredientId: row.ingredient_id,
    quantity: row.quantity,
    createdAt: row.created_at,
    ingredientName: row.ingredient_name,
    ingredientBrand: row.ingredient_brand,
    ingredientUnit: row.ingredient_unit,
    ingredientPriceCents: row.ingredient_price_cents,
    ingredientPurchaseQuantity: row.ingredient_purchase_quantity,
  };
}

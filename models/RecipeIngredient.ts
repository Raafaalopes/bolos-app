import { Unit } from "./Ingredients";

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  createdAt: string;
}

export type NewRecipeIngredient = Omit<RecipeIngredient, "id" | "createdAt">;

export interface RecipeIngredientWithDetails extends RecipeIngredient {
  ingredientName: string;
  ingredientBrand: string | null;
  ingredientUnit: Unit;
  ingredientPriceCents: number;
  ingredientPurchaseQuantity: number;
}

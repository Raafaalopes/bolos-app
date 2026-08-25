import { RecipeIngredientWithDetails } from "../models/RecipeIngredient";

export interface RecipeIngredientCost {
  recipeIngredientId: number;
  ingredientName: string;
  ingredientBrand: string | null;
  costCents: number;
}

export interface RecipeCost {
  items: RecipeIngredientCost[];
  totalCents: number;
}

export function calculateRecipeCost(
  recipeIngredients: RecipeIngredientWithDetails[],
): RecipeCost {
  const items: RecipeIngredientCost[] = recipeIngredients.map((item) => {
    const pricePerBaseUnit =
      item.ingredientPriceCents / item.ingredientPurchaseQuantity;
    const costCents = Math.round(item.quantity * pricePerBaseUnit);

    return {
      recipeIngredientId: item.id,
      ingredientName: item.ingredientName,
      ingredientBrand: item.ingredientBrand,
      costCents,
    };
  });

  const totalCents = items.reduce((sum, item) => sum + item.costCents, 0);

  return { items, totalCents };
}

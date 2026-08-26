import { PricingSettingsRepository } from "../database/repositories/PricingSettingsRepository";
import { RecipeIngredientRepository } from "../database/repositories/RecipeIngredientRepository";
import { calculateSuggestedPrice } from "./PricingService";
import { calculateRecipeCost } from "./RecipeCostService";

export interface RecipePricingSummary {
  ingredientsCostCents: number;
  suggestedPriceCents: number;
}

export function getRecipePricingSummary(
  recipeId: number,
): RecipePricingSummary {
  const items = RecipeIngredientRepository.getByRecipeId(recipeId);
  const cost = calculateRecipeCost(items);
  const settings = PricingSettingsRepository.get();
  const pricing = calculateSuggestedPrice(cost.totalCents, settings);

  return {
    ingredientsCostCents: cost.totalCents,
    suggestedPriceCents: pricing.suggestedPriceCents,
  };
}

import { PricingSettings } from "../models/PricingSettings";

export interface RecipePricing {
  ingredientsCostCents: number;
  multipliedIngredientsCostCents: number;
  laborCostCents: number;
  packagingCostCents: number;
  additionalCostCents: number;
  suggestedPriceCents: number;
}

export function calculateSuggestedPrice(
  ingredientsCostCents: number,
  settings: PricingSettings,
): RecipePricing {
  const multipliedIngredientsCostCents = Math.round(
    ingredientsCostCents * settings.multiplier,
  );

  const suggestedPriceCents =
    multipliedIngredientsCostCents +
    settings.laborCostCents +
    settings.packagingCostCents +
    settings.additionalCostCents;

  return {
    ingredientsCostCents,
    multipliedIngredientsCostCents,
    laborCostCents: settings.laborCostCents,
    packagingCostCents: settings.packagingCostCents,
    additionalCostCents: settings.additionalCostCents,
    suggestedPriceCents,
  };
}

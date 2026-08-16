export type Unit = "g" | "ml" | "unit";

export interface Ingredient {
  id: number;
  name: string;
  brand: string | null;
  quantity: number;
  unit: Unit;
  priceCents: number;
  createdAt: string;
}

export type NewIngredient = Omit<Ingredient, "id" | "createdAt">;

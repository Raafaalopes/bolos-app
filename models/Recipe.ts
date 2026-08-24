export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export type NewRecipe = Omit<Recipe, "id" | "createdAt">;

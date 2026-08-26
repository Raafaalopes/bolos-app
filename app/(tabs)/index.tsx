import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RecipeRepository } from "../../database/repositories/RecipeRepository";
import { getRecipePricingSummary } from "../../services/RecipePricingSummary";
import { RecentRecipeCard } from "../../components/RecentRecipeCard";

interface RecentRecipe {
  id: number;
  name: string;
  costCents: number;
  displayPriceCents: number;
}

export default function HomeScreen() {
  const [recipeCount, setRecipeCount] = useState(0);
  const [recentRecipes, setRecentRecipes] = useState<RecentRecipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      const recipes = RecipeRepository.getAll();
      setRecipeCount(recipes.length);

      const recent = recipes.slice(0, 5).map((recipe) => {
        const summary = getRecipePricingSummary(recipe.id);
        return {
          id: recipe.id,
          name: recipe.name,
          costCents: summary.ingredientsCostCents,
          displayPriceCents:
            recipe.finalPriceCents ?? summary.suggestedPriceCents,
        };
      });
      setRecentRecipes(recent);
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recentRecipes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>Olá, mãe!</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>MEUS BOLOS</Text>
              <Text style={styles.summaryCount}>
                {recipeCount} receita {recipeCount === 1 ? "" : "s"} cadastrada{" "}
                {recipeCount === 1 ? "" : "s"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.newRecipeButton}
              onPress={() => router.push("/new-recipe")}
            >
              <Text style={styles.newRecipeButtonText}>Nova receita</Text>
            </TouchableOpacity>

            {recentRecipes.length > 0 && (
              <Text style={styles.sectionTitle}>Últimos bolos</Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <RecentRecipeCard
            name={item.name}
            costCents={item.costCents}
            displayPriceCents={item.displayPriceCents}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  summaryCard: {
    backgroundColor: "#fce4ec",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#c2185b",
    letterSpacing: 1,
  },
  summaryCount: { fontSize: 16, marginTop: 6 },
  newRecipeButton: {
    backgroundColor: "#e91e63",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  newRecipeButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
});

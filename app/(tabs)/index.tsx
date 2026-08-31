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
import { ScreenContainer } from "../../components/ScreenContainer";
import { Button } from "../../components/Button";
import { colors, radius, spacing, typography } from "../../constants/theme";

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
    <ScreenContainer>
      <FlatList
        data={recentRecipes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>Olá, mãe!</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>MEUS BOLOS</Text>
              <Text style={styles.summaryCount}>
                {recipeCount} receita {recipeCount === 1 ? "" : "s"} cadastrada{" "}
                {recipeCount === 1 ? "" : "s"}
              </Text>
            </View>

            <View style={styles.newRecipeButton}>
              <Button
                label="Nova receita"
                onPress={() => router.push("/new-recipe")}
              />
            </View>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  greeting: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.label,
    color: colors.accent,
    letterSpacing: 1,
  },
  summaryCount: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  newRecipeButton: { marginBottom: spacing.xl },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

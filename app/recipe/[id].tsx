import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  router,
  useLocalSearchParams,
  useFocusEffect,
  Stack,
} from "expo-router";
import { RecipeRepository } from "../../database/repositories/RecipeRepository";
import { RecipeIngredientRepository } from "../../database/repositories/RecipeIngredientRepository";
import { Recipe } from "../../models/Recipe";
import { RecipeIngredientWithDetails } from "../../models/RecipeIngredient";
import { toDisplayUnit } from "../../utils/unit";
import { formatCentsToCurrency } from "../../utils/currency";
import { calculateRecipeCost } from "../../services/RecipeCostService";
import { PricingSettingsRepository } from "../../database/repositories/PricingSettingsRepository";
import { calculateSuggestedPrice } from "../../services/PricingService";
import { FinalPriceEditor } from "../../components/FinalPriceEditor";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../../constants/theme";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [items, setItems] = useState<RecipeIngredientWithDetails[]>([]);

  useFocusEffect(
    useCallback(() => {
      setRecipe(RecipeRepository.getById(recipeId));
      setItems(RecipeIngredientRepository.getByRecipeId(recipeId));
    }, [recipeId]),
  );

  const recipeCost = calculateRecipeCost(items);
  const pricingSettings = PricingSettingsRepository.get();
  const pricing = calculateSuggestedPrice(
    recipeCost.totalCents,
    pricingSettings,
  );

  function handleRemove(item: RecipeIngredientWithDetails) {
    Alert.alert(
      "Remover ingrediente",
      `Remover "${item.ingredientName}" desta receita?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            RecipeIngredientRepository.remove(item.id);
            setItems(RecipeIngredientRepository.getByRecipeId(recipeId));
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: recipe?.name ?? "Receita",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push(`/new-recipe?id=${recipeId}`)}
            >
              <Feather name="edit-2" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            {recipe?.description ? (
              <Text style={styles.description}>{recipe.description}</Text>
            ) : null}

            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Custo dos ingredientes</Text>
              <Text style={styles.rowValue}>
                {formatCentsToCurrency(recipeCost.totalCents)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>Preço sugerido</Text>
              <Text style={styles.rowValue}>
                {formatCentsToCurrency(pricing.suggestedPriceCents)}
              </Text>
            </View>

            <View style={styles.divider} />

            <FinalPriceEditor
              finalPriceCents={recipe?.finalPriceCents ?? null}
              onSave={(cents) => {
                RecipeRepository.updateFinalPrice(recipeId, cents);
                setRecipe(RecipeRepository.getById(recipeId));
              }}
            />

            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>
        }
        renderItem={({ item }) => {
          const { quantity, unit } = toDisplayUnit(
            item.quantity,
            item.ingredientUnit,
          );

          return (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.ingredientName}
                  {item.ingredientBrand ? ` - ${item.ingredientBrand}` : ""}
                </Text>
                <Text style={styles.itemDetails}>
                  {quantity} {unit}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item)}
              >
                <Feather name="x" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum ingrediente adicionado ainda.{"\n"}Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(`/add-recipe-ingredient?recipeId=${recipeId}`)
        }
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 100 },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md - 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm + 2,
  },
  itemInfo: { flex: 1, marginRight: spacing.sm + 2 },
  itemName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemDetails: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  removeButton: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.lg,
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg + 6,
    width: 56,
    height: 56,
    borderRadius: radius.lg + 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});

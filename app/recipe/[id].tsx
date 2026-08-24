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
    <View style={styles.container}>
      <Stack.Screen options={{ title: recipe?.name ?? "Receita" }} />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{recipe?.name}</Text>
          {recipe?.description ? (
            <Text style={styles.description}>{recipe.description}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/new-recipe?id=${recipeId}`)}
        >
          <Text style={styles.editLink}>Editar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
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
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum ingrediente adicionado ainda. Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(`/add-recipe-ingredient?recipeId=${recipeId}`)
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerInfo: { flex: 1, marginRight: 10 },
  title: { fontSize: 20, fontWeight: "700" },
  description: { fontSize: 14, color: "#666", marginTop: 4 },
  editLink: { color: "#e91e63", fontWeight: "600" },
  list: { padding: 20, paddingBottom: 100 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemDetails: { fontSize: 14, color: "#666", marginTop: 4 },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffe5e5",
  },
  removeButtonText: { color: "#d32f2f", fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e91e63",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "700", lineHeight: 30 },
});

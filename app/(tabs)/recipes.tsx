import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Recipe } from "../../models/Recipe";
import { router, useFocusEffect } from "expo-router";
import { RecipeRepository } from "../../database/repositories/RecipeRepository";
import { RecipeCard } from "../../components/RecipeCard";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/ScreenContainer";
import { colors, radius, spacing, typography } from "../../constants/theme";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      setRecipes(RecipeRepository.getAll());
    }, []),
  );

  function handleDelete(recipe: Recipe) {
    Alert.alert("Excluir receita", `Deseja excluir "${recipe.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          RecipeRepository.remove(recipe.id);
          setRecipes(RecipeRepository.getAll());
        },
      },
    ]);
  }
  return (
    <ScreenContainer>
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma receita cadastrada ainda.{"\n"}Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-recipe")}
      >
        <Feather name="plus" size={26} color={"#FFFFFF"} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 100 },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl + spacing.md,
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

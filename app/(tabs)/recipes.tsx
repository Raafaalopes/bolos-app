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
    <View style={styles.container}>
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
            Nenhuma receita cadastrada ainda. Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-recipe")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 20, paddingBottom: 100 },
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

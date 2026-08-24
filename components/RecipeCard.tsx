import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Recipe } from "../models/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onPress, onDelete }: RecipeCardProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.info} onPress={onPress}>
        <Text style={styles.name}>{recipe.name}</Text>
        {recipe.description ? (
          <Text style={styles.details}>{recipe.description}</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  info: { flex: 1, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  details: { fontSize: 14, color: "#666", marginTop: 4 },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffe5e5",
  },
  deleteButtonText: { color: "#d32f2f", fontWeight: "600" },
});

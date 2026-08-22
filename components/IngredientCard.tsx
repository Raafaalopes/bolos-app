import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ingredient } from "../models/Ingredients";
import { formatCentsToCurrency } from "../utils/currency";

interface IngredientCardProps {
  ingredient: Ingredient;
  onDelete: () => void;
}

export function IngredientCard({ ingredient, onDelete }: IngredientCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>
          {ingredient.name}
          {ingredient.brand ? ` - ${ingredient.brand}` : ""}
        </Text>
        <Text style={styles.details}>
          {ingredient.quantity} {ingredient.unit} -{" "}
          {formatCentsToCurrency(ingredient.priceCents)}
        </Text>
      </View>
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

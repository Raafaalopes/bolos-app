import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DisplayUnit, toBaseUnit } from "../../utils/unit";
import { parseCurrencyToCents } from "../../utils/currency";
import { IngredientRepository } from "../../database/repositories/IngredientRepository";
import { LabeledInput } from "../../components/LabeledInput";
import { UnitSelector } from "../../components/UnitSelector";
import { Ingredient } from "../../models/Ingredients";
import { router, useFocusEffect } from "expo-router";
import { IngredientCard } from "../../components/IngredientCard";

export default function IngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useFocusEffect(
    useCallback(() => {
      setIngredients(IngredientRepository.getAll());
    }, []),
  );

  function handleDelete(ingredient: Ingredient) {
    Alert.alert("Excluir ingrediente", `Deseja excluir "${ingredient.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          IngredientRepository.remove(ingredient.id);
          setIngredients(IngredientRepository.getAll());
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <IngredientCard
            ingredient={item}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum ingrediente cadastrado ainda. Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-ingredient")}
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

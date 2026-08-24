import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LabeledInput } from "../components/LabeledInput";
import { UnitSelector } from "../components/UnitSelector";
import {
  DisplayUnit,
  toBaseUnit,
  getCompatibleDisplayUnits,
} from "../utils/unit";
import { Ingredient } from "../models/Ingredients";
import { IngredientRepository } from "../database/repositories/IngredientRepository";
import { RecipeIngredientRepository } from "../database/repositories/RecipeIngredientRepository";

export default function AddRecipeIngredientScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [ingredients] = useState<Ingredient[]>(() =>
    IngredientRepository.getAll(),
  );
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<DisplayUnit>("g");

  function handleSelect(ingredient: Ingredient) {
    setSelected(ingredient);
    const compatible = getCompatibleDisplayUnits(ingredient.unit);
    setUnit(compatible[0]);
  }

  function handleSave() {
    if (!selected) return;

    const quantityNumber = parseFloat(quantity.replace(",", "."));
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert("Ops", "Informe uma quantidade válida.");
      return;
    }

    const { quantity: baseQuantity } = toBaseUnit(quantityNumber, unit);

    RecipeIngredientRepository.create({
      recipeId: Number(recipeId),
      ingredientId: selected.id,
      quantity: baseQuantity,
    });

    router.back();
  }

  if (!selected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Escolha um ingrediente</Text>
        <FlatList
          data={ingredients}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.ingredientRow}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.ingredientName}>
                {item.name}
                {item.brand ? ` - ${item.brand}` : ""}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum ingrediente cadastrado ainda. Cadastre um na aba
              Ingredientes primeiro.
            </Text>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selected.name}
        {selected.brand ? ` - ${selected.brand}` : ""}
      </Text>

      <TouchableOpacity onPress={() => setSelected(null)}>
        <Text style={styles.changeLink}>Trocar ingrediente</Text>
      </TouchableOpacity>

      <LabeledInput
        label="Quantidade usada nessa receita"
        placeholder="Ex: 200"
        keyboardType="decimal-pad"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Unidade</Text>
      <UnitSelector
        value={unit}
        onChange={setUnit}
        options={getCompatibleDisplayUnits(selected.unit)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Adicionar à receita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  list: { paddingBottom: 20 },
  ingredientRow: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  ingredientName: { fontSize: 16, fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 15,
  },
  changeLink: { color: "#e91e63", fontWeight: "600", marginBottom: 20 },
  saveButton: {
    backgroundColor: "#e91e63",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

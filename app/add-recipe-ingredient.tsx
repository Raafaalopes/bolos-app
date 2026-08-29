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
import { ScreenContainer } from "../components/ScreenContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../constants/theme";
import { Button } from "../components/Button";

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
      <ScreenContainer>
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
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum ingrediente cadastrado ainda.{"\n"}Cadastre um na aba
              Ingredientes primeiro.
            </Text>
          }
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.changeLink}
          onPress={() => setSelected(null)}
        >
          <Feather name="chevron-left" size={18} color={colors.accent} />
          <Text style={styles.changeLinkText}>Trocar ingrediente</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {selected.name}
          {selected.brand ? ` - ${selected.brand}` : ""}
        </Text>

        <LabeledInput
          label="Quantidade usada nessa receita"
          placeholder="Ex: 200"
          keyboardType="decimal-pad"
          value={quantity}
          onChangeText={setQuantity}
        />

        <UnitSelector
          value={unit}
          onChange={setUnit}
          options={getCompatibleDisplayUnits(selected.unit)}
        />

        <Button label="Adicionar à receita" onPress={handleSave} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  list: { padding: spacing.lg },
  ingredientRow: {
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
  ingredientName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
    lineHeight: 22,
  },
  changeLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  changeLinkText: {
    ...typography.label,
    color: colors.accent,
    marginLeft: spacing.xs,
  },
});

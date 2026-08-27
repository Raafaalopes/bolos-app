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
import { ScreenContainer } from "../../components/ScreenContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../../constants/theme";

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
    <ScreenContainer>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <IngredientCard
            ingredient={item}
            onPress={() => router.push(`/new-ingredient?id=${item.id}`)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum ingrediente cadastrado ainda.{"\n"}Toque em "+" para começar.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-ingredient")}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
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

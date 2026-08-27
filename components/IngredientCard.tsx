import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ingredient } from "../models/Ingredients";
import { formatCentsToCurrency } from "../utils/currency";
import { toDisplayUnit } from "../utils/unit";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../constants/theme";

interface IngredientCardProps {
  ingredient: Ingredient;
  onPress: () => void;
  onDelete: () => void;
}

export function IngredientCard({
  ingredient,
  onPress,
  onDelete,
}: IngredientCardProps) {
  const { quantity, unit } = toDisplayUnit(
    ingredient.quantity,
    ingredient.unit,
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.info} onPress={onPress}>
        <Text style={styles.name}>
          {ingredient.name}
          {ingredient.brand ? ` - ${ingredient.brand}` : ""}
        </Text>
        <Text style={styles.details}>
          {quantity}
          {unit} - {formatCentsToCurrency(ingredient.priceCents)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Feather name="trash-2" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  info: { flex: 1, marginRight: spacing.sm + 2 },
  name: { ...typography.body, fontWeight: "600", color: colors.textPrimary },
  details: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },
});

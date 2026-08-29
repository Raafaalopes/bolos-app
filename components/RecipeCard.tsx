import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Recipe } from "../models/Recipe";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../constants/theme";

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

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatCentsToCurrency } from "../utils/currency";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../constants/theme";

interface RecentRecipeCardProps {
  name: string;
  costCents: number;
  displayPriceCents: number;
  onPress: () => void;
}

export function RecentRecipeCard({
  name,
  costCents,
  displayPriceCents,
  onPress,
}: RecentRecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.label}>
          Custo: {formatCentsToCurrency(costCents)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>
          {formatCentsToCurrency(displayPriceCents)}
        </Text>
        <Feather name="chevron-right" size={18} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
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
  info: { flex: 1 },
  name: { ...typography.body, fontWeight: "600", color: colors.textPrimary },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  price: { ...typography.body, fontWeight: "700", color: colors.accent },
});

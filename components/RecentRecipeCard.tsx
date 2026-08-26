import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatCentsToCurrency } from "../utils/currency";

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
      <Text style={styles.name}>{name}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>
          Custo: {formatCentsToCurrency(costCents)}
        </Text>
        <Text style={styles.price}>
          {formatCentsToCurrency(displayPriceCents)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#666" },
  price: { fontSize: 16, fontWeight: "700", color: "#2e7d32" },
});

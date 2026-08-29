import { useState } from "react";
import { formatCentsToCurrency, parseCurrencyToCents } from "../utils/currency";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LabeledInput } from "./LabeledInput";
import { Button } from "./Button";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "../constants/theme";

interface FinalPriceEditorProps {
  finalPriceCents: number | null;
  onSave: (cents: number) => void;
}

export function FinalPriceEditor({
  finalPriceCents,
  onSave,
}: FinalPriceEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    finalPriceCents
      ? formatCentsToCurrency(finalPriceCents).replace("R$", "").trim()
      : "",
  );

  function handleConfirm() {
    onSave(parseCurrencyToCents(value));
    setEditing(false);
  }

  if (editing) {
    return (
      <View style={styles.editingContainer}>
        <LabeledInput
          label="Preço final (R$)"
          placeholder="Ex: 95,00"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={setValue}
          autoFocus
        />
        <Button label="Confirmar" onPress={handleConfirm} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.display} onPress={() => setEditing(true)}>
      <Text style={styles.rowLabel}>Preço final</Text>
      <View style={styles.row}>
        <Text
          style={finalPriceCents ? styles.priceValue : styles.placeholderValue}
        >
          {finalPriceCents
            ? formatCentsToCurrency(finalPriceCents)
            : "Toque para definir"}
        </Text>
        <Feather name="edit-2" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  display: { marginTop: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  priceValue: { ...typography.title, fontSize: 24, color: colors.accent },
  placeholderValue: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  editingContainer: { marginTop: spacing.sm },
});

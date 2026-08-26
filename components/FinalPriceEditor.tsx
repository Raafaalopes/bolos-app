import { useState } from "react";
import { formatCentsToCurrency, parseCurrencyToCents } from "../utils/currency";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LabeledInput } from "./LabeledInput";

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
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.display} onPress={() => setEditing(true)}>
      <Text style={styles.finalPriceLabel}>
        Preço final:{" "}
        {finalPriceCents
          ? formatCentsToCurrency(finalPriceCents)
          : "toque para definir"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  display: { marginTop: 8 },
  finalPriceLabel: { fontSize: 17, fontWeight: "700", color: "#1565c0" },
  editingContainer: { marginTop: 8 },
  confirmButton: {
    backgroundColor: "#1565c0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "700" },
});

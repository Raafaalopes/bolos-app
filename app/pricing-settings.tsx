import { useEffect, useState } from "react";
import { PricingSettingsRepository } from "../database/repositories/PricingSettingsRepository";
import { formatCentsToCurrency, parseCurrencyToCents } from "../utils/currency";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LabeledInput } from "../components/LabeledInput";

export default function PricingSettingsScreen() {
  const [multiplier, setMultiplier] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [packagingCost, setPackagingCost] = useState("");
  const [additionalCost, setAdditionalCost] = useState("");

  useEffect(() => {
    const settings = PricingSettingsRepository.get();
    setMultiplier(String(settings.multiplier).replace(".", ","));
    setLaborCost(
      formatCentsToCurrency(settings.laborCostCents).replace("R$", "").trim(),
    );
    setPackagingCost(
      formatCentsToCurrency(settings.packagingCostCents)
        .replace("R$", "")
        .trim(),
    );
    setAdditionalCost(
      formatCentsToCurrency(settings.additionalCostCents)
        .replace("R$", "")
        .trim(),
    );
  }, []);

  function handleSave() {
    const multiplierNumber = parseFloat(multiplier.replace(",", "."));

    if (isNaN(multiplierNumber) || multiplierNumber <= 0) {
      Alert.alert("Ops", "Informe um multiplicador válido.");
      return;
    }

    PricingSettingsRepository.update({
      multiplier: multiplierNumber,
      laborCostCents: parseCurrencyToCents(laborCost),
      packagingCostCents: parseCurrencyToCents(packagingCost),
      additionalCostCents: parseCurrencyToCents(additionalCost),
    });

    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LabeledInput
        label="Multiplicador dos ingredientes"
        placeholder="Ex: 3"
        keyboardType="decimal-pad"
        value={multiplier}
        onChangeText={setMultiplier}
      />

      <LabeledInput
        label="Mão de obra (R$)"
        placeholder="Ex: 30,00"
        keyboardType="decimal-pad"
        value={laborCost}
        onChangeText={setLaborCost}
      />

      <LabeledInput
        label="Embalagem (R$)"
        placeholder="Ex: 5,00"
        keyboardType="decimal-pad"
        value={packagingCost}
        onChangeText={setPackagingCost}
      />

      <LabeledInput
        label="Custos adicionais (R$)"
        placeholder="Ex: 0,00"
        keyboardType="decimal-pad"
        value={additionalCost}
        onChangeText={setAdditionalCost}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  saveButton: {
    backgroundColor: "#e91e63",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

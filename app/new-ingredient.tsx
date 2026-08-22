import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LabeledInput } from "../components/LabeledInput";
import { UnitSelector } from "../components/UnitSelector";
import { DisplayUnit, toBaseUnit } from "../utils/unit";
import { parseCurrencyToCents } from "../utils/currency";
import { IngredientRepository } from "../database/repositories/IngredientRepository";

export default function NewIngredientScreen() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<DisplayUnit>("g");
  const [price, setPrice] = useState("");

  function handleSave() {
    const quantityNumber = parseFloat(quantity.replace(",", "."));

    if (!name.trim()) {
      Alert.alert("Ops", "Informe o nome do ingrediente.");
      return;
    }
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert("Ops", "Informe uma quantidade válida.");
      return;
    }

    const { quantity: baseQuantity, unit: baseUnit } = toBaseUnit(
      quantityNumber,
      unit,
    );
    const priceCents = parseCurrencyToCents(price);

    IngredientRepository.create({
      name: name.trim(),
      brand: brand.trim() || null,
      quantity: baseQuantity,
      unit: baseUnit,
      priceCents,
    });

    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LabeledInput
        label="Nome"
        placeholder="Ex: Leite condensado"
        value={name}
        onChangeText={setName}
      />

      <LabeledInput
        label="Marca (opcional)"
        placeholder="Ex: Moça"
        value={brand}
        onChangeText={setBrand}
      />

      <LabeledInput
        label="Quantidade comprada"
        placeholder="Ex: 395"
        keyboardType="decimal-pad"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Unidade</Text>
      <UnitSelector value={unit} onChange={setUnit} />

      <LabeledInput
        label="Preço pago (R$)"
        placeholder="Ex: 7,99"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar ingrediente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  saveButton: {
    backgroundColor: "#e91e63",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LabeledInput } from "../components/LabeledInput";
import { UnitSelector } from "../components/UnitSelector";
import { DisplayUnit, toBaseUnit, toDisplayUnit } from "../utils/unit";
import { formatCentsToCurrency, parseCurrencyToCents } from "../utils/currency";
import { IngredientRepository } from "../database/repositories/IngredientRepository";

export default function NewIngredientScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<DisplayUnit>("g");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!id) return;

    const ingredient = IngredientRepository.getById(Number(id));
    if (!ingredient) return;

    const { quantity: displayQuantity, unit: displayUnit } = toDisplayUnit(
      ingredient.quantity,
      ingredient.unit,
    );

    setName(ingredient.name);
    setBrand(ingredient.brand ?? "");
    setQuantity(String(displayQuantity));
    setUnit(displayUnit);
    setPrice(
      formatCentsToCurrency(ingredient.priceCents).replace("R$", "").trim(),
    );
  }, [id]);

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

    if (isEditing) {
      IngredientRepository.update(Number(id), {
        name: name.trim(),
        brand: brand.trim() || null,
        quantity: baseQuantity,
        unit: baseUnit,
        priceCents,
      });
    } else {
      IngredientRepository.create({
        name: name.trim(),
        brand: brand.trim() || null,
        quantity: baseQuantity,
        unit: baseUnit,
        priceCents,
      });
    }

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
        <Text style={styles.saveButtonText}>
          {isEditing ? "Salvar alterações" : "Salvar ingrediente"}
        </Text>
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

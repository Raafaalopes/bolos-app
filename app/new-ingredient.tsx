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
import { Button } from "../components/Button";
import { colors, spacing } from "../constants/theme";

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

      <UnitSelector value={unit} onChange={setUnit} />

      <LabeledInput
        label="Preço pago (R$)"
        placeholder="Ex: 7,99"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
      />

      <Button
        label={isEditing ? "Salvar alterações" : "Salvar ingrediente"}
        onPress={handleSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
});

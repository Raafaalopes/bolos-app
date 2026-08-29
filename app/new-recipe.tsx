import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { RecipeRepository } from "../database/repositories/RecipeRepository";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LabeledInput } from "../components/LabeledInput";
import { Button } from "../components/Button";
import { colors, spacing } from "../constants/theme";

export default function NewRecipeScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;

    const recipe = RecipeRepository.getById(Number(id));
    if (!recipe) return;

    setName(recipe.name);
    setDescription(recipe.description ?? "");
  }, [id]);

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Ops", "Informe o nome da receita.");
      return;
    }

    if (isEditing) {
      RecipeRepository.update(Number(id), {
        name: name.trim(),
        description: description.trim() || null,
      });
    } else {
      RecipeRepository.create({
        name: name.trim(),
        description: description.trim() || null,
      });
    }

    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LabeledInput
        label="Nome da receita"
        placeholder="Ex: Bolo de Morango"
        value={name}
        onChangeText={setName}
      />

      <LabeledInput
        label="Descrição (opcional)"
        placeholder="Ex: Bolo com recheio de morango e chantilly"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button
        label={isEditing ? "Salvar alterações" : "Salvar receita"}
        onPress={handleSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
});

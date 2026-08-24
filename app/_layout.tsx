import { Stack } from "expo-router";
import { initDatabase } from "../database/schema";

initDatabase();

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="new-ingredient"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Novo ingrediente",
        }}
      />
      <Stack.Screen
        name="new-recipe"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Nova receita",
        }}
      />
      <Stack.Screen
        name="add-recipe-ingredient"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Adicionar ingrediente",
        }}
      />
      <Stack.Screen name="recipe/[id]" options={{ headerShown: true }} />
    </Stack>
  );
}

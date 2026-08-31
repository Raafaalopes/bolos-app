import { Stack } from "expo-router";
import { initDatabase } from "../database/schema";
import { colors } from "../constants/theme";

initDatabase();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
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
      <Stack.Screen
        name="pricing-settings"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Configurações de preço",
        }}
      />
    </Stack>
  );
}

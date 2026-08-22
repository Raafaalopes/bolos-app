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
    </Stack>
  );
}

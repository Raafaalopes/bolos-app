import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="ingredients" options={{ title: "Ingredientes" }} />
      <Tabs.Screen name="recipes" options={{ title: "Receitas" }} />
      <Tabs.Screen name="budgets" options={{ title: "Orçamentos" }} />
    </Tabs>
  );
}

import { Stack } from "expo-router";
import { initDatabase } from "../database/schema";

initDatabase();

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

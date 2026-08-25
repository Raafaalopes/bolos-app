import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/pricing-settings")}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Olá, mãe! ❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "600" },
  settingsButton: { position: "absolute", top: 60, right: 20, padding: 8 },
  settingsIcon: { fontSize: 24 },
});

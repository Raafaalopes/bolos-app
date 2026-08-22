import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DISPLAY_UNITS, DisplayUnit } from "../utils/unit";

interface UnitSelectorProps {
  value: DisplayUnit;
  onChange: (unit: DisplayUnit) => void;
}

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  return (
    <View style={styles.container}>
      {DISPLAY_UNITS.map((option) => {
        const selected = option.value == value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[styles.optionText, selected && styles.optionTextSelected]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, marginBottom: 16 },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  optionSelected: { backgroundColor: "#e91e63", borderColor: "$e91e63" },
  optionText: { fontSize: 15, color: "#333" },
  optionTextSelected: { color: "#fff", fontWeight: "600" },
});

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DISPLAY_UNITS, DisplayUnit } from "../utils/unit";
import { colors, radius, spacing } from "../constants/theme";

interface UnitSelectorProps {
  value: DisplayUnit;
  onChange: (unit: DisplayUnit) => void;
  options?: DisplayUnit[];
}

export function UnitSelector({ value, onChange, options }: UnitSelectorProps) {
  const availableOptions = DISPLAY_UNITS.filter((option) =>
    options ? options.includes(option.value) : true,
  );

  return (
    <View style={styles.container}>
      {availableOptions.map((option) => {
        const selected = option.value === value;
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
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  optionText: { fontSize: 15, color: colors.textSecondary },
  optionTextSelected: { color: colors.accent, fontWeight: "600" },
});

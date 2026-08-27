import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, variantStyles[variant].container]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color} />
      ) : (
        <Text style={[styles.label, variantStyles[variant].text]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md - 2,
    alignItems: "center",
  },
  label: { ...typography.label, fontSize: 16 },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.accent },
    text: { color: "#FFFFFF" },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: { color: colors.textPrimary },
  },
  danger: {
    container: { backgroundColor: colors.dangerSoft },
    text: { color: colors.danger },
  },
} as const;

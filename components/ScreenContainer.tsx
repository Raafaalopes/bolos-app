import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "../constants/theme";

export function ScreenContainer({ style, ...rest }: ViewProps) {
  return <View style={[styles.container, style]} {...rest} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});

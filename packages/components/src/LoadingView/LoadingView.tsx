import { ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@repo/theme";
import { View } from "react-native";

export function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.actionPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomActionBarProps extends ViewProps {
  children: ReactNode;
  safeArea?: boolean;
}

export function BottomActionBar({ children, safeArea = true, style, ...rest }: BottomActionBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border },
        safeArea && { paddingBottom: spacing.m + insets.bottom },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
    borderTopWidth: 1,
  },
});

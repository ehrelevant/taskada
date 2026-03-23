import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

export interface BottomActionBarProps extends ViewProps {
  children: ReactNode;
  safeArea?: boolean;
}

export function BottomActionBar({ children, safeArea = true, style, ...rest }: BottomActionBarProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border },
        safeArea && styles.safeArea,
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
  safeArea: {
    paddingBottom: spacing.l,
  },
});

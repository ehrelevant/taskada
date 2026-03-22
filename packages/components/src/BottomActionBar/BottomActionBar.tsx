import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

interface BottomActionBarProps extends ViewProps {
  children: ReactNode;
}

export function BottomActionBar({ children, style, ...rest }: BottomActionBarProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.m,
    borderTopWidth: 1,
  },
});

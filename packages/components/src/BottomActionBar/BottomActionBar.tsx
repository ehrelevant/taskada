import { colors, spacing } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface BottomActionBarProps extends ViewProps {
  children: ReactNode;
}

export function BottomActionBar({ children, style, ...rest }: BottomActionBarProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
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
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

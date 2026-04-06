import { radius, spacing, useTheme } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

export interface SectionProps extends ViewProps {
  title?: string;
  label?: string;
  variant?: 'default' | 'card';
  children: ReactNode;
}

export function Section({ title, label, variant = 'default', children, style, ...rest }: SectionProps) {
  const { colors } = useTheme();

  const containerStyle =
    variant === 'card'
      ? [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]
      : [styles.default, style];

  return (
    <View style={containerStyle} {...rest}>
      {title && (
        <Typography variant="h6" style={styles.title}>
          {title}
        </Typography>
      )}
      {label && (
        <Typography variant="subtitle2" color="textSecondary" style={styles.label}>
          {label}
        </Typography>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    marginBottom: spacing.m,
  },
  card: {
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
  },
  title: {
    marginBottom: spacing.s,
  },
  label: {
    marginBottom: spacing.xs,
  },
});

import { ReactNode } from 'react';
import { spacing } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

interface EmptyStateProps extends ViewProps {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ message, icon, action, style, ...rest }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography variant="body1" color="textSecondary" style={styles.message}>
        {message}
      </Typography>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.m,
  },
  message: {
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: spacing.l,
  },
});

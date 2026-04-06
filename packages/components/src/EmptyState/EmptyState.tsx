import { ActivityIndicator, StyleSheet, View, ViewProps } from 'react-native';
import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';

import { Typography } from '../Typography';

export interface EmptyStateProps extends ViewProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
  loading?: boolean;
  loadingSize?: 'small' | 'large';
  loadingMessage?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  loading = false,
  loadingSize = 'large',
  loadingMessage,
  style,
  ...rest
}: EmptyStateProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={[styles.container, style]} {...rest}>
        <ActivityIndicator size={loadingSize} color={colors.actionPrimary} />
        {loadingMessage && (
          <Typography variant="body1" color="textSecondary" style={styles.loadingMessage}>
            {loadingMessage}
          </Typography>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {title && (
        <Typography variant="h5" style={styles.title}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography variant="body1" color="textSecondary" style={styles.message}>
          {message}
        </Typography>
      )}
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.m,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: spacing.l,
  },
  loadingMessage: {
    marginTop: spacing.m,
  },
});

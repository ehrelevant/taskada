import { radius, spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

export interface StatusBadgeProps extends ViewProps {
  status: StatusType;
  label: string;
}

export function StatusBadge({ status, label, style, ...rest }: StatusBadgeProps) {
  const { colors } = useTheme();
  const statusColors: Record<StatusType, { background: string; text: string }> = {
    success: { background: colors.success.light, text: colors.success.base },
    warning: { background: colors.warning.light, text: colors.warning.base },
    error: { background: colors.error.light, text: colors.error.base },
    info: { background: colors.info.light, text: colors.info.base },
    pending: { background: colors.pending.light, text: colors.pending.base },
    default: { background: colors.actionSecondary, text: colors.textPrimary },
  };
  const colorScheme = statusColors[status] || statusColors.default;

  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.background }, style]} {...rest}>
      <Typography variant="caption" color={colorScheme.text}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
});

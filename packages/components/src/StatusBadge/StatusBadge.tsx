import { colors, spacing } from '@repo/theme';
import { StyleSheet, View } from 'react-native';

import { Typography } from '../Typography';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

type Props = {
  status: StatusType;
  label: string;
};

const statusColors: Record<StatusType, { background: string; text: string }> = {
  success: { background: colors.success.light, text: colors.success.base },
  warning: { background: colors.warning.light, text: colors.warning.base },
  error: { background: colors.error.light, text: colors.error.base },
  info: { background: colors.info.light, text: colors.info.base },
  pending: { background: colors.pending.light, text: colors.pending.base },
  default: { background: colors.actionSecondary, text: colors.textPrimary },
};

export function StatusBadge({ status, label }: Props) {
  const colorScheme = statusColors[status] || statusColors.default;

  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.background }]}>
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
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});

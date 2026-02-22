import { colors, spacing } from '@repo/theme';
import { StyleSheet, View } from 'react-native';

import { Typography } from '../Typography';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

type Props = {
  status: StatusType;
  label: string;
};

const statusColors: Record<StatusType, { background: string; text: string }> = {
  success: { background: colors.success + '20', text: colors.success },
  warning: { background: colors.warning + '20', text: colors.warning },
  error: { background: colors.error + '20', text: colors.error },
  info: { background: colors.info + '20', text: colors.info },
  pending: { background: colors.pending + '20', text: colors.pending },
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

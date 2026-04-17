import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
    },
    scrollContent: {
      flexGrow: 1,
      gap: spacing.m,
      padding: spacing.m,
    },
    heroCard: {
      backgroundColor: colors.home.heroStart,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    summaryCard: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      gap: spacing.s,
    },
    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
    },
    summaryUserInfo: {
      flex: 1,
    },
    costValue: {
      color: colors.actionPrimary,
      fontWeight: '700',
    },
    costRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    actionButtonsContainer: {
      gap: spacing.s,
    },
  });

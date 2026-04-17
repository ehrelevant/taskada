import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    reportButton: {
      padding: spacing.xs,
    },
    content: {
      gap: spacing.m,
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    sectionCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    sectionHeading: {
      marginBottom: spacing.s,
    },
    providerCardShell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.s,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    costRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });

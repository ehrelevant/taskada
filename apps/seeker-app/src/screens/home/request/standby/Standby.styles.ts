import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    heroShell: {
      flex: 1,
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.l,
    },
    heroCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    livePill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      marginBottom: spacing.xs,
    },
    title: {
      marginBottom: spacing.xxs,
    },
    subtitle: {
      opacity: 0.94,
      marginBottom: spacing.s,
    },
    statusRows: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      marginBottom: spacing.s,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    spinnerCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      paddingVertical: spacing.l,
      paddingHorizontal: spacing.m,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinnerText: {
      marginTop: spacing.s,
      textAlign: 'center',
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    bottomSection: {
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      paddingTop: spacing.m,
      paddingHorizontal: spacing.pageHorizontal,
      paddingBottom: spacing.l,
      backgroundColor: colors.canvas.base,
    },
  });

import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    scrollContent: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xxxl,
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.xs,
    },
    heroPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    header: {
      backgroundColor: colors.card.base,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
    },
    form: {
      backgroundColor: colors.card.base,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      gap: spacing.m,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.m,
    },
    halfInput: {
      flex: 1,
    },
    footer: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
    },
  });

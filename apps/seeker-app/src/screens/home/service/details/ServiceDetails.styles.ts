import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
    },
    heroSummary: {
      flex: 1,
      minWidth: 0,
    },
    providerName: {
      marginBottom: spacing.xs,
    },
    heroHint: {
      marginTop: spacing.s,
      opacity: 0.92,
    },
    ratingRow: {
      marginTop: spacing.m,
    },
    priceCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    priceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.xxs,
    },
    priceAmount: {
      marginBottom: spacing.xs,
    },
    requestButton: {
      marginTop: spacing.m,
    },
    reviewsSection: {
      borderRadius: 20,
    },
    reviewHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.s,
      marginBottom: spacing.s,
    },
    reviewHintPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    reviewsContent: {
      gap: spacing.s,
      borderRadius: 16,
    },
    emptyReviewCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
  });

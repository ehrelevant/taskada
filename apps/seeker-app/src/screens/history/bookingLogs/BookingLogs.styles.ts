import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xxxl,
      gap: spacing.m,
    },
    iconButton: {
      padding: spacing.xs,
    },
    heroCard: {
      borderRadius: radius.xxl,
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
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    serviceCard: {
      marginBottom: 0,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    providerSection: {
      alignItems: 'center',
    },
    providerName: {
      marginTop: spacing.s,
    },
    ratingRow: {
      marginTop: spacing.s,
    },
    tapHint: {
      marginTop: spacing.m,
      fontStyle: 'italic',
    },
    reviewLabel: {
      marginBottom: spacing.s,
    },
    commentLabel: {
      marginBottom: spacing.s,
      marginTop: spacing.m,
    },
    ratingContainer: {
      alignItems: 'flex-start',
    },
    commentInput: {
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      minHeight: 100,
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 20,
    },
    submitButton: {
      marginTop: spacing.m,
    },
    footerButtons: {
      gap: spacing.s,
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
    },
  });

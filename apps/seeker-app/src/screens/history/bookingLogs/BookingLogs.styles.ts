import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
    },
    serviceCard: {
      marginBottom: spacing.l,
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
      backgroundColor: colors.background,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.border,
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
    },
  });

import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.xs,
    },
    formCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
      gap: spacing.s,
    },
    errorText: {
      marginTop: spacing.xs,
    },
    footer: {
      alignItems: 'center',
      marginTop: spacing.s,
    },
    signInLink: {
      color: colors.actionPrimary,
      textDecorationLine: 'underline',
    },
  });

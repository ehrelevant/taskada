import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      marginBottom: spacing.m,
    },
    formCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    input: {
      marginBottom: spacing.m,
    },
    error: {
      marginBottom: spacing.m,
      textAlign: 'center',
    },
    footer: {
      marginTop: spacing.xl,
      alignItems: 'center',
    },
    link: {
      color: colors.actionPrimary,
      fontWeight: '600',
    },
  });

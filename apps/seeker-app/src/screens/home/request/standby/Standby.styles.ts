import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    heroShell: {
      flex: 1,
    },
    heroCard: {
      flex: 1,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    spinnerCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    spinnerText: {
      marginTop: spacing.s,
      textAlign: 'center',
    },
  });

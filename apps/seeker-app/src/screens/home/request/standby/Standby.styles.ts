import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    heroCard: {
      flex: 0,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    spinnerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    },
    spinnerText: {
      marginTop: spacing.s,
      textAlign: 'center',
    },
  });

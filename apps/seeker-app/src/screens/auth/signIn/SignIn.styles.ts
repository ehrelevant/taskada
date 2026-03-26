import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    title: {
      marginBottom: spacing.s,
    },
    subtitle: {
      marginBottom: spacing.xxl,
    },
    input: {
      marginBottom: spacing.m,
    },
    error: {
      marginBottom: spacing.m,
    },
    button: {
      marginTop: spacing.s,
    },
    footer: {
      marginTop: spacing.xxl,
      alignItems: 'center',
    },
    link: {
      color: colors.actionPrimary,
      fontWeight: '600',
    },
  });

import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.m,
    },
    spinnerContainer: {
      marginVertical: spacing.xl,
    },
    bottomSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.m,
    },
  });

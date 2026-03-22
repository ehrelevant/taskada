import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.m,
      justifyContent: 'space-between',
    },
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
    cancelButton: {
      marginTop: spacing.s,
    },
    connectingText: {
      marginTop: spacing.m,
      color: colors.textSecondary,
    },
    errorText: {
      marginBottom: spacing.m,
    },
    errorMessage: {
      textAlign: 'center',
      marginBottom: spacing.l,
    },
    button: {
      marginTop: spacing.m,
    },
  });

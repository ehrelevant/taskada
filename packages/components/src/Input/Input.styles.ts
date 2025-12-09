import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export function createStyles(error?: string, isFocused?: boolean) {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.s,
      fontWeight: fontWeight.medium,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      minHeight: 48,
      borderWidth: 1,
      borderColor: error ? colors.error : isFocused ? colors.borderFocus : colors.border,
      borderRadius: radius.m,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.m,
    },
    input: {
      flex: 1,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.m,
      color: colors.textPrimary,
    },
    leftIcon: {
      marginRight: spacing.s,
    },
    rightIcon: {
      marginLeft: spacing.s,
    },
    errorText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
    helperText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
  });
}

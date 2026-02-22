import { colors, fontFamily, fontSize, fontWeight, radius, spacing, touchTarget } from '@repo/theme';
import { FlexStyle, StyleSheet } from 'react-native';

export function createStyles(
  variant: 'primary' | 'secondary' | 'outline' | 'text' | 'danger',
  size: 'small' | 'medium' | 'large',
  isDisabled: boolean,
) {
  // Base styles
  const baseButtonStyles = {
    borderRadius: radius.m,
    justifyContent: 'center' as FlexStyle['justifyContent'],
    alignItems: 'center' as FlexStyle['alignItems'],
    flexDirection: 'row' as FlexStyle['flexDirection'],
  };

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.m,
      minHeight: 32,
    },
    medium: {
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.l,
      minHeight: touchTarget.minimum,
    },
    large: {
      paddingVertical: spacing.m,
      paddingHorizontal: spacing.xl,
      minHeight: 56,
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: isDisabled ? colors.actionDisabled : colors.primary.base,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: isDisabled ? colors.actionDisabled : colors.secondary.base,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: colors.transparent,
      borderWidth: 1,
      borderColor: isDisabled ? colors.actionDisabled : colors.primary.base,
    },
    text: {
      backgroundColor: colors.transparent,
      borderWidth: 0,
    },
    danger: {
      backgroundColor: isDisabled ? colors.actionDisabled : colors.error.base,
      borderWidth: 0,
    },
  };

  // Text styles
  const textBaseStyles = {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    textAlign: 'center' as const,
  };

  const textSizeStyles = {
    small: {
      fontSize: fontSize.s,
    },
    medium: {
      fontSize: fontSize.m,
    },
    large: {
      fontSize: fontSize.l,
    },
  };

  const textVariantStyles = {
    primary: {
      color: colors.textInverse,
    },
    secondary: {
      color: colors.textInverse,
    },
    outline: {
      color: isDisabled ? colors.textDisabled : colors.primary.base,
    },
    text: {
      color: isDisabled ? colors.textDisabled : colors.primary.base,
    },
    danger: {
      color: colors.textInverse,
    },
  };

  return StyleSheet.create({
    button: {
      ...baseButtonStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: isDisabled ? 0.7 : 1,
    },
    text: {
      ...textBaseStyles,
      ...textSizeStyles[size],
      ...textVariantStyles[variant],
    },
    icon: {
      marginRight: spacing.xs,
    },
    rightIcon: {
      marginLeft: spacing.xs,
    },
    loadingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginLeft: spacing.xs,
      color: colors.textInverse,
      fontSize: fontSize.s,
    },
    fullWidth: {
      width: '100%',
    },
  });
}

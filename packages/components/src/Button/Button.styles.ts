import { colors, fontFamily, fontSize, fontWeight, radius, spacing } from '@repo/theme';
import { FlexStyle, StyleSheet } from 'react-native';

export function createStyles(
  variant: 'primary' | 'secondary' | 'outline' | 'text',
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
      minHeight: 44,
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
      backgroundColor: isDisabled ? colors.actionDisabled : colors.actionPrimary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: isDisabled ? colors.actionDisabled : colors.actionSecondary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: colors.transparent,
      borderWidth: 1,
      borderColor: isDisabled ? colors.actionDisabled : colors.actionPrimary,
    },
    text: {
      backgroundColor: colors.transparent,
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
      color: isDisabled ? colors.textDisabled : colors.actionPrimary,
    },
    text: {
      color: isDisabled ? colors.textDisabled : colors.actionPrimary,
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
  });
}

import { colors, fontFamily, fontSize, fontWeight, lineHeight } from '@repo/theme';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type VariantType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

export interface TypographyProps extends TextProps {
  variant?: VariantType;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

function getVariantStyles(variant: VariantType) {
  const styles = {
    h1: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.xxxl,
    },
    h2: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.xxl,
    },
    h3: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.xl,
    },
    h4: {
      fontSize: fontSize.l,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.l,
    },
    h5: {
      fontSize: fontSize.m,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.m,
    },
    h6: {
      fontSize: fontSize.s,
      fontWeight: fontWeight.bold,
      fontFamily: fontFamily.bold,
      lineHeight: lineHeight.s,
    },
    subtitle1: {
      fontSize: fontSize.l,
      fontWeight: fontWeight.medium,
      fontFamily: fontFamily.medium,
      lineHeight: lineHeight.l,
    },
    subtitle2: {
      fontSize: fontSize.m,
      fontWeight: fontWeight.medium,
      fontFamily: fontFamily.medium,
      lineHeight: lineHeight.m,
    },
    body1: {
      fontSize: fontSize.m,
      fontWeight: fontWeight.regular,
      fontFamily: fontFamily.regular,
      lineHeight: lineHeight.m,
    },
    body2: {
      fontSize: fontSize.s,
      fontWeight: fontWeight.regular,
      fontFamily: fontFamily.regular,
      lineHeight: lineHeight.s,
    },
    button: {
      fontSize: fontSize.m,
      fontWeight: fontWeight.medium,
      fontFamily: fontFamily.medium,
      lineHeight: lineHeight.m,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
    caption: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.regular,
      fontFamily: fontFamily.regular,
      lineHeight: lineHeight.xs,
    },
    overline: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      fontFamily: fontFamily.medium,
      lineHeight: lineHeight.xs,
      textTransform: 'uppercase' as TextStyle['textTransform'],
      letterSpacing: 1.5,
    },
  };

  return styles[variant];
}

export function Typography({
  variant = 'body1',
  color,
  align = 'left',
  weight,
  style,
  children,
  ...rest
}: TypographyProps) {
  const styles = StyleSheet.create({
    text: {
      ...getVariantStyles(variant),
      color: color || colors.textPrimary,
      textAlign: align,
      ...(weight && { fontWeight: fontWeight[weight] }),
    },
  });

  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
}

import { radius, spacing, useTheme } from '@repo/theme';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface CardProps {
  elevation?: 'none' | 'xs' | 's' | 'm' | 'l';
  padding?: 'none' | 'xs' | 's' | 'm' | 'l' | 'xl';
  bordered?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const PADDING_MAP = {
  none: 0,
  xs: spacing.xs,
  s: spacing.s,
  m: spacing.m,
  l: spacing.l,
  xl: spacing.xl,
};

export function Card({ children, elevation = 's', padding = 'm', bordered = false, onPress, style }: CardProps) {
  const { colors, shadows } = useTheme();

  const cardStyle = [
    styles.container,
    { backgroundColor: colors.surface },
    !bordered && shadows[elevation],
    bordered && { borderWidth: 1, borderColor: colors.border },
    { padding: PADDING_MAP[padding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} style={cardStyle} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.m,
    overflow: 'hidden',
  },
});

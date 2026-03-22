import { radius, spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  elevation?: 'none' | 'xs' | 's' | 'm' | 'l';
  padding?: 'none' | 'xs' | 's' | 'm' | 'l' | 'xl';
}

export function Card({ children, elevation = 's', padding = 'm', style, ...rest }: CardProps) {
  const { colors, shadows } = useTheme();
  const paddingValues = {
    none: 0,
    xs: spacing.xs,
    s: spacing.s,
    m: spacing.m,
    l: spacing.l,
    xl: spacing.xl,
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        shadows[elevation],
        { padding: paddingValues[padding] },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.m,
    overflow: 'hidden',
  },
});

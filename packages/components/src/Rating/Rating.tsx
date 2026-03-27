import { spacing, useTheme } from '@repo/theme';
import { Star } from 'lucide-react-native';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

export interface RatingProps extends ViewProps {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  valueColor?: string;
  reviewCountColor?: string;
}

export function Rating({
  value,
  size = 14,
  showValue = true,
  reviewCount,
  valueColor = 'textPrimary',
  reviewCountColor = 'textSecondary',
  style,
  ...rest
}: RatingProps) {
  const { colors } = useTheme();
  const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <View style={[styles.container, style]} {...rest}>
      <Star size={size} color={colors.warning.base} fill={colors.warning.base} />
      {showValue && (
        <Typography variant="body2" color={valueColor} weight="medium">
          {formattedValue}
        </Typography>
      )}
      {reviewCount !== undefined && (
        <Typography variant="caption" color={reviewCountColor}>
          ({reviewCount})
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

import { colors } from '@repo/theme';
import { Star } from 'lucide-react-native';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Typography } from '../Typography';

export interface RatingProps {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  style?: StyleProp<ViewStyle>;
}

export function Rating({ value, size = 14, showValue = true, reviewCount, style }: RatingProps) {
  const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }, style]}>
      <Star size={size} color={colors.warning} fill={colors.warning} />
      {showValue && (
        <Typography variant="body2" color="textPrimary" weight="medium">
          {formattedValue}
        </Typography>
      )}
      {reviewCount !== undefined && (
        <Typography variant="caption" color="textSecondary">
          ({reviewCount})
        </Typography>
      )}
    </View>
  );
}

import { spacing, useTheme } from '@repo/theme';
import { Star } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

export interface StarRatingInputProps extends ViewProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  maxStars?: number;
  disabled?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  size = 32,
  maxStars = 5,
  disabled = false,
  style,
  ...rest
}: StarRatingInputProps) {
  const { colors } = useTheme();

  const handlePress = (starValue: number) => {
    if (!disabled) {
      onChange(starValue);
    }
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => handlePress(starValue)}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
          >
            <Star
              size={size}
              color={colors.warning.base}
              fill={isFilled ? colors.warning.base : 'transparent'}
              strokeWidth={isFilled ? 0 : 2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
});

import { colors } from '@repo/theme';
import { Star } from 'lucide-react-native';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useState } from 'react';

export interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  maxStars?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function StarRatingInput({
  value,
  onChange,
  size = 32,
  maxStars = 5,
  disabled = false,
  style,
}: StarRatingInputProps) {
  const [hoveredValue, setHoveredValue] = useState(0);

  const handlePress = (starValue: number) => {
    if (!disabled) {
      onChange(starValue);
    }
  };

  const handleHoverIn = (starValue: number) => {
    if (!disabled) {
      setHoveredValue(starValue);
    }
  };

  const handleHoverOut = () => {
    setHoveredValue(0);
  };

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }, style]}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoveredValue || value);

        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => handlePress(starValue)}
            onPressIn={() => handleHoverIn(starValue)}
            onPressOut={handleHoverOut}
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

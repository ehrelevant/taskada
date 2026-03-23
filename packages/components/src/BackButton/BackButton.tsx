import { ChevronLeft } from 'lucide-react-native';
import { spacing, useTheme } from '@repo/theme';
import { TouchableOpacity } from 'react-native';

export interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

export function BackButton({ onPress, color, size = 24 }: BackButtonProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: spacing.s, bottom: spacing.s, left: spacing.s, right: spacing.s }}
    >
      <ChevronLeft size={size} color={resolvedColor} />
    </TouchableOpacity>
  );
}

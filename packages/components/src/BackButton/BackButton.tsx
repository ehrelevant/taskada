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
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: spacing.xs, bottom: spacing.xs, left: spacing.xs, right: spacing.xs }}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={size} color={resolvedColor} />
    </TouchableOpacity>
  );
}

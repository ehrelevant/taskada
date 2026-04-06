import { spacing, useTheme } from '@repo/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { Header } from './Header';

export interface StackHeaderProps {
  title: string;
  canGoBack: boolean;
  onBack?: () => void;
}

export function StackHeader({ title, canGoBack, onBack }: StackHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.canvas.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.card.stroke,
        paddingHorizontal: spacing.pageHorizontal,
        paddingTop: insets.top + spacing.s,
        paddingBottom: spacing.s,
      }}
    >
      <Header
        title={title}
        size="small"
        align="center"
        balancedSides
        sideSlotWidth={44}
        onBack={canGoBack && onBack ? onBack : undefined}
        style={{ paddingVertical: spacing.xs }}
      />
    </View>
  );
}

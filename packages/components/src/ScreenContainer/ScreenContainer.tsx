import { ReactNode } from 'react';
import { RefreshControlProps, ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@repo/theme';

type PaddingSize = 'none' | 's' | 'm' | 'l';

export interface ScreenContainerProps extends ViewProps {
  children: ReactNode;
  scrollable?: boolean;
  useSafeArea?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padding?: PaddingSize;
  verticalPadding?: PaddingSize;
  stickyFooter?: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
}

const PADDING_MAP: Record<PaddingSize, number> = {
  none: 0,
  s: spacing.s,
  m: spacing.m,
  l: spacing.l,
};

export function ScreenContainer({
  children,
  scrollable = false,
  useSafeArea = true,
  edges,
  padding = 'm',
  verticalPadding,
  stickyFooter,
  refreshControl,
  keyboardShouldPersistTaps = 'handled',
  style,
  ...rest
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const horizontalPadding = PADDING_MAP[padding];
  const vertical = verticalPadding !== undefined ? PADDING_MAP[verticalPadding] : horizontalPadding;

  const containerStyles = [
    styles.container,
    { backgroundColor: colors.background, paddingHorizontal: horizontalPadding, paddingVertical: vertical },
    style,
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      );
    }

    return <View style={styles.content}>{children}</View>;
  };

  const renderBody = () => {
    if (stickyFooter) {
      return (
        <>
          <View style={styles.mainContent}>{renderContent()}</View>
          <View
            style={[
              styles.stickyFooter,
              { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border },
            ]}
          >
            {stickyFooter}
          </View>
        </>
      );
    }

    return renderContent();
  };

  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyles} edges={edges} {...rest}>
        {renderBody()}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyles} {...rest}>
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  stickyFooter: {
    padding: spacing.m,
    borderTopWidth: 1,
  },
});

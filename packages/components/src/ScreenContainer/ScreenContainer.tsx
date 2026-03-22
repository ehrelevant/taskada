import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { spacing, useTheme } from '@repo/theme';

interface ScreenContainerProps extends ViewProps {
  children: ReactNode;
  scrollable?: boolean;
  useSafeArea?: boolean;
  backgroundColor?: string;
  padding?: 'none' | 's' | 'm' | 'l';
  verticalPadding?: 'none' | 's' | 'm' | 'l';
}

export function ScreenContainer({
  children,
  scrollable = false,
  useSafeArea = true,
  backgroundColor,
  padding = 'm',
  verticalPadding,
  style,
  ...rest
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const resolvedBackgroundColor = backgroundColor ?? colors.background;
  const paddingValues = {
    none: 0,
    s: spacing.s,
    m: spacing.m,
    l: spacing.l,
  };

  const horizontalPadding = paddingValues[padding];
  const vertical = verticalPadding !== undefined ? paddingValues[verticalPadding] : horizontalPadding;

  const containerStyles = [
    styles.container,
    { backgroundColor: resolvedBackgroundColor, paddingHorizontal: horizontalPadding, paddingVertical: vertical },
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView style={containerStyles} {...rest}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyles} {...rest}>
      {content}
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
});

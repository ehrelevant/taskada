import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';
import { ReactNode } from 'react';
import { RefreshControlProps, ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@repo/theme';

type PaddingSize = 'none' | 's' | 'm' | 'l';

export interface ScreenContainerProps extends ViewProps {
  children: ReactNode;
  scrollable?: boolean;
  useSafeArea?: boolean;
  keyboardAware?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padding?: PaddingSize;
  contentPadding?: PaddingSize;
  stickyFooter?: ReactNode;
  bottomOffset?: KeyboardAwareScrollViewProps['bottomOffset'];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
  contentStyle?: ViewProps['style'];
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
  keyboardAware = false,
  edges,
  padding = 'none',
  contentPadding = 'none',
  stickyFooter,
  bottomOffset = 50,
  refreshControl,
  keyboardShouldPersistTaps = 'handled',
  style,
  contentStyle,
  ...rest
}: ScreenContainerProps) {
  const { colors } = useTheme();

  const containerStyles = [
    styles.container,
    { backgroundColor: colors.background, padding: PADDING_MAP[padding] },
    style,
  ];

  const contentStyles = [styles.content, { padding: PADDING_MAP[contentPadding] }, contentStyle];

  const renderContent = () => {
    if (keyboardAware) {
      return (
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={[{ padding: PADDING_MAP[contentPadding] }, contentStyle]}
          showsVerticalScrollIndicator={false}
          bottomOffset={bottomOffset}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </KeyboardAwareScrollView>
      );
    }

    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[{ padding: PADDING_MAP[contentPadding] }, contentStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      );
    }

    return <View style={contentStyles}>{children}</View>;
  };

  const renderBody = () => {
    if (stickyFooter) {
      return (
        <>
          <View style={styles.mainContent}>{renderContent()}</View>
          {stickyFooter}
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
});

import { colors, spacing } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

interface HeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  size?: 'large' | 'medium' | 'small';
}

export function Header({
  title,
  subtitle,
  leftContent,
  centerContent,
  rightContent,
  size = 'medium',
  style,
  ...rest
}: HeaderProps) {
  const titleVariant = size === 'large' ? 'h3' : size === 'small' ? 'h5' : 'h4';
  const subtitleVariant = size === 'large' ? 'body1' : 'body2';

  const renderCenter = () => {
    if (centerContent) {
      return <View style={styles.centerContent}>{centerContent}</View>;
    }

    if (title) {
      return (
        <View style={styles.textContainer}>
          <Typography variant={titleVariant} weight="bold" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant={subtitleVariant} color="textSecondary" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      {leftContent && <View style={styles.leftContent}>{leftContent}</View>}
      {renderCenter()}
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  leftContent: {
    marginRight: spacing.s,
  },
  textContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  rightContent: {
    marginLeft: spacing.m,
  },
});

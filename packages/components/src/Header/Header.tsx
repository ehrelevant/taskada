import { colors, spacing } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

interface HeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  rightContent?: ReactNode;
  size?: 'large' | 'medium' | 'small';
}

export function Header({
  title,
  subtitle,
  align = 'left',
  rightContent,
  size = 'medium',
  style,
  ...rest
}: HeaderProps) {
  const titleVariant = size === 'large' ? 'h3' : size === 'small' ? 'h5' : 'h4';
  const subtitleVariant = size === 'large' ? 'body1' : 'body2';

  return (
    <View style={[styles.container, styles[align], style]} {...rest}>
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
  left: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  textContainer: {
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

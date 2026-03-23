import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { X } from 'lucide-react-native';

import { BackButton } from '../BackButton';
import { Typography } from '../Typography';

export interface HeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: 'large' | 'medium' | 'small';
  onBack?: () => void;
  onClose?: () => void;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  bottomBorder?: boolean;
}

export function Header({
  title,
  subtitle,
  align = 'left',
  size = 'medium',
  onBack,
  onClose,
  leftContent,
  centerContent,
  rightContent,
  bottomBorder = false,
  style,
  ...rest
}: HeaderProps) {
  const { colors } = useTheme();
  const titleVariant = size === 'large' ? 'h3' : size === 'small' ? 'h5' : 'h4';
  const subtitleVariant = size === 'large' ? 'body1' : 'body2';

  const resolvedLeftContent = onBack ? <BackButton onPress={onBack} /> : leftContent;

  const resolvedRightContent = onClose ? (
    <TouchableOpacity
      onPress={onClose}
      hitSlop={{ top: spacing.s, bottom: spacing.s, left: spacing.s, right: spacing.s }}
    >
      <X size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  ) : (
    rightContent
  );

  const renderCenter = () => {
    if (centerContent) {
      return <View style={styles.centerContent}>{centerContent}</View>;
    }

    if (title) {
      return (
        <View style={styles.textContainer}>
          <Typography variant={titleVariant} weight="bold" align={align}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant={subtitleVariant} color="textSecondary" align={align} style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      );
    }

    return null;
  };

  const borderStyle = bottomBorder ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined;

  return (
    <View style={[styles.container, borderStyle, style]} {...rest}>
      {resolvedLeftContent && <View style={styles.leftContent}>{resolvedLeftContent}</View>}
      {renderCenter()}
      {resolvedRightContent && <View style={styles.rightContent}>{resolvedRightContent}</View>}
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
  subtitle: {
    marginTop: spacing.xxs,
  },
  rightContent: {
    marginLeft: spacing.m,
  },
});

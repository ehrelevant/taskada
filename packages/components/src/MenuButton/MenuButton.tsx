import { ChevronRight } from 'lucide-react-native';
import { radius, spacing, useTheme } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { Typography } from '../Typography';

export interface MenuButtonProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'danger';
}

export function MenuButton({ title, subtitle, icon, rightIcon, variant = 'default', style, ...rest }: MenuButtonProps) {
  const { colors } = useTheme();
  const textColor = variant === 'danger' ? colors.error.base : colors.textPrimary;
  const resolvedRightIcon = rightIcon ?? <ChevronRight size={20} color={colors.textDisabled} />;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
      {...rest}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Typography variant="body1" style={[styles.title, { color: textColor }]}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </View>
      <View style={styles.rightIconContainer}>{resolvedRightIcon}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderRadius: radius.s,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {},
  rightIconContainer: {
    marginLeft: spacing.s,
  },
});

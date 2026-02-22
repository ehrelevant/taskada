import { colors, spacing } from '@repo/theme';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { Typography } from '../Typography';

interface MenuButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
}

export function MenuButton({ title, icon, variant = 'default', style, ...rest }: MenuButtonProps) {
  const textColor = variant === 'danger' ? colors.error.base : colors.textPrimary;

  return (
    <TouchableOpacity style={[styles.container, style]} {...rest}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography variant="body1" style={[styles.title, { color: textColor }]}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: spacing.m,
  },
  title: {
    flex: 1,
  },
});

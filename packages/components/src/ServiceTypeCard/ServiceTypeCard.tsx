import { memo } from 'react';
import { radius, SERVICE_TYPE_ICONS, spacing, useTheme } from '@repo/theme';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { Typography } from '../Typography';

export interface ServiceTypeCardProps extends TouchableOpacityProps {
  name: string;
}

export const ServiceTypeCard = memo(function ServiceTypeCard({ name, style, ...rest }: ServiceTypeCardProps) {
  const { colors } = useTheme();
  const IconComponent = SERVICE_TYPE_ICONS[name as keyof typeof SERVICE_TYPE_ICONS];

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.background }, style]} {...rest}>
      <View style={[styles.iconCircle, { backgroundColor: colors.backgroundSecondary }]}>
        {IconComponent ? (
          <IconComponent size={48} color={colors.textPrimary} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.border }]} />
        )}
      </View>
      <Typography variant="body2" color="textPrimary" align="center" weight="bold">
        {name}
      </Typography>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 108,
    padding: spacing.s,
    alignItems: 'center',
    borderRadius: radius.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
});

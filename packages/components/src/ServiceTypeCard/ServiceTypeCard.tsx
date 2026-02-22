import { colors, palette, radius, spacing } from '@repo/theme';
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { memo } from 'react';

import { Typography } from '../Typography';

export interface ServiceTypeCardProps extends TouchableOpacityProps {
  name: string;
  iconUrl?: string | null;
}

export const ServiceTypeCard = memo(function ServiceTypeCard({ name, iconUrl, style, ...rest }: ServiceTypeCardProps) {
  return (
    <TouchableOpacity
      style={[
        {
          width: 100,
          padding: spacing.s,
          alignItems: 'center',
          borderRadius: radius.m,
          backgroundColor: colors.background,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.backgroundSecondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.xs,
        }}
      >
        {iconUrl ? (
          <Image source={{ uri: iconUrl }} style={{ width: 32, height: 32 }} resizeMode="contain" />
        ) : (
          <View style={{ width: 32, height: 32, backgroundColor: palette.gray300, borderRadius: 16 }} />
        )}
      </View>
      <Typography variant="caption" color="textPrimary" align="center" weight="bold">
        {name}
      </Typography>
    </TouchableOpacity>
  );
});

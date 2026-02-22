import { colors, palette, radius, spacing } from '@repo/theme';
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { memo } from 'react';

import { Avatar } from '../Avatar';
import { Rating } from '../Rating';
import { Typography } from '../Typography';

export interface FeaturedServiceCardProps extends TouchableOpacityProps {
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  rating: number;
  reviewCount: number;
  serviceId: string;
}

export const FeaturedServiceCard = memo(function FeaturedServiceCard({
  serviceTypeName,
  providerName,
  providerAvatar,
  rating,
  reviewCount,
  serviceId: _serviceId,
  style,
  ...rest
}: FeaturedServiceCardProps) {
  return (
    <TouchableOpacity
      style={[
        {
          width: '100%',
          borderRadius: radius.m,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
          overflow: 'hidden',
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ height: 100, backgroundColor: colors.backgroundSecondary }}>
        {providerAvatar ? (
          <Image source={{ uri: providerAvatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: '100%', backgroundColor: palette.gray300 }} />
        )}
      </View>
      <View style={{ padding: spacing.s }}>
        <Typography variant="overline" color="textSecondary">
          {serviceTypeName}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Avatar source={providerAvatar ? { uri: providerAvatar } : null} size={24} name={providerName} />
          <Typography variant="body1" color="textPrimary" weight="medium" style={{ marginLeft: spacing.xs }}>
            {providerName}
          </Typography>
        </View>
        <View style={{ marginTop: spacing.xs }}>
          <Rating value={rating} reviewCount={reviewCount} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

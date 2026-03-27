import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { memo } from 'react';
import { radius, spacing, useTheme } from '@repo/theme';

import { Avatar } from '../Avatar';
import { Rating } from '../Rating';
import { Typography } from '../Typography';

export interface FeaturedServiceCardProps {
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  rating: number;
  reviewCount: number;
  onPress?: () => void;
}

export const FeaturedServiceCard = memo(function FeaturedServiceCard({
  serviceTypeName,
  providerName,
  providerAvatar,
  rating,
  reviewCount,
  onPress,
}: FeaturedServiceCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.container, { borderColor: colors.border }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.banner, { backgroundColor: colors.backgroundSecondary }]}>
        {providerAvatar ? (
          <Image source={{ uri: providerAvatar }} style={styles.bannerImage} resizeMode="cover" />
        ) : null}
      </View>
      <View style={styles.content}>
        <Typography variant="overline" color="textSecondary">
          {serviceTypeName}
        </Typography>
        <View style={styles.providerRow}>
          <Avatar source={providerAvatar ? { uri: providerAvatar } : null} size={24} name={providerName} />
          <Typography variant="body1" color="textPrimary" weight="medium" style={styles.providerName}>
            {providerName}
          </Typography>
        </View>
        <View style={styles.ratingRow}>
          <Rating value={rating} reviewCount={reviewCount} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.m,
    borderWidth: 1,
    overflow: 'hidden',
  },
  banner: {
    height: 100,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.s,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
  },
  providerName: {
    marginLeft: spacing.xs,
  },
  ratingRow: {
    marginTop: spacing.xs,
  },
});

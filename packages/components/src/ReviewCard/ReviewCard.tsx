import { colors, spacing } from '@repo/theme';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Avatar } from '../Avatar';
import { Rating } from '../Rating';
import { Typography } from '../Typography';

export interface ReviewCardProps {
  reviewerName: string;
  rating: number | null;
  comment?: string | null;
  date: string | Date;
  style?: StyleProp<ViewStyle>;
}

export function ReviewCard({ reviewerName, rating, comment, date, style }: ReviewCardProps) {
  const formattedDate = typeof date === 'string' ? date : date.toLocaleDateString();

  return (
    <View
      style={[
        {
          paddingVertical: spacing.s,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Avatar name={reviewerName} size={36} />
        <View style={{ flex: 1, marginLeft: spacing.s }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textPrimary" weight="medium">
              {reviewerName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formattedDate}
            </Typography>
          </View>
          {rating !== null && <Rating value={rating} size={12} style={{ marginTop: 2 }} />}
          {comment && (
            <Typography variant="body2" color="textSecondary" style={{ marginTop: spacing.xs }}>
              {comment}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

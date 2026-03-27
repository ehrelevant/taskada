import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Avatar } from '../Avatar';
import { Rating } from '../Rating';
import { Typography } from '../Typography';

export interface ReviewCardProps extends ViewProps {
  reviewerName: string;
  reviewerAvatar?: string | null;
  rating: number | null;
  comment?: string | null;
  date: string | Date;
}

export function ReviewCard({ reviewerName, reviewerAvatar, rating, comment, date, style, ...rest }: ReviewCardProps) {
  const { colors } = useTheme();
  const formattedDate = typeof date === 'string' ? date : date.toLocaleDateString();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }, style]} {...rest}>
      <View style={styles.row}>
        <Avatar source={reviewerAvatar ? { uri: reviewerAvatar } : null} name={reviewerName} size={36} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="body2" color="textPrimary" weight="medium">
              {reviewerName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formattedDate}
            </Typography>
          </View>
          {rating !== null && <Rating value={rating} size={12} style={styles.rating} />}
          {comment && (
            <Typography variant="body2" color="textSecondary" style={styles.comment}>
              {comment}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    marginTop: spacing.xxs,
  },
  comment: {
    marginTop: spacing.xs,
  },
});

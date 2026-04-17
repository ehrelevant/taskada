import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Header,
  Rating,
  ReviewCard,
  ScreenContainer,
  StarRatingInput,
  StatusBadge,
  Typography,
} from '@repo/components';
import { CalendarClock, CircleDollarSign, FileText, Flag } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingLogs.styles';
import { useBookingLogs } from './BookingLogs.hooks';

const STATUS_MAP: Record<string, 'success' | 'error' | 'warning' | 'info' | 'pending' | 'default'> = {
  completed: 'success',
  cancelled: 'error',
  in_progress: 'info',
  pending: 'pending',
};

export function BookingLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const {
    transaction,
    isLoading,
    reviews,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    currentUserId,
    handleGoBack,
    handleViewServiceDetails,
    handleViewRequestDetails,
    handleViewChatLogs,
    handleSubmitReview,
    handleReport,
    formatDateTime,
  } = useBookingLogs();

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading..." />
      </ScreenContainer>
    );
  }

  const providerName = transaction?.provider
    ? `${transaction.provider.firstName} ${transaction.provider.lastName}`
    : 'Unknown Provider';

  const userReview = reviews.find((review: { reviewerUserId: string }) => review.reviewerUserId === currentUserId);
  const hasReviewed = !!userReview;
  const isCompleted = transaction?.status === 'completed';

  return (
    <ScreenContainer
      scrollable
      edges={['top', 'left', 'right']}
      stickyFooter={
        <View style={styles.footerButtons}>
          <Button title="View Request Details" onPress={handleViewRequestDetails} />
          <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} />
        </View>
      }
    >
      <Header
        title="Booking Details"
        size="small"
        onBack={handleGoBack}
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Booking ummary
          </Typography>
          <Typography variant="body2" color="textInverse">
            Review finalized details, related request info, and conversation logs.
          </Typography>
        </View>

        <Card elevation="m" padding="l" style={styles.serviceCard} onPress={handleViewServiceDetails}>
          <View style={styles.providerSection}>
            <Avatar
              source={transaction?.provider?.avatarUrl ? { uri: transaction.provider.avatarUrl } : null}
              size={80}
              name={providerName}
            />
            <Typography variant="h6" style={styles.providerName}>
              {providerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {transaction?.serviceType?.name}
            </Typography>
            {transaction?.serviceRating && (
              <View style={styles.ratingRow}>
                <Rating
                  value={transaction.serviceRating.avgRating}
                  reviewCount={transaction.serviceRating.reviewCount}
                />
              </View>
            )}
          </View>
          <Typography variant="caption" color="actionPrimary" align="center" style={styles.tapHint}>
            Tap to view service details
          </Typography>
        </Card>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <CircleDollarSign size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Cost
            </Typography>
          </View>
          <Typography variant="h5" color="actionPrimary">
            ₱{transaction?.cost?.toFixed(2) || '0.00'}
          </Typography>
        </Card>

        {transaction?.specifications && (
          <Card elevation="s" padding="m" style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <FileText size={15} color={colors.textSecondary} />
              <Typography variant="subtitle2" style={styles.sectionLabel}>
                Specifications
              </Typography>
            </View>
            <View style={styles.specificationsBox}>
              <Typography variant="body1" style={styles.specificationsText}>
                {transaction.specifications}
              </Typography>
            </View>
          </Card>
        )}

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <CalendarClock size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Booking Date and Time
            </Typography>
          </View>
          <Typography variant="body1">{transaction?.createdAt ? formatDateTime(transaction.createdAt) : 'N/A'}</Typography>
        </Card>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <Typography variant="subtitle2" style={styles.sectionHeading}>
            Status
          </Typography>
          <StatusBadge
            status={STATUS_MAP[transaction?.status || ''] || 'default'}
            label={transaction?.status?.toUpperCase() || 'UNKNOWN'}
          />
        </Card>

        {isCompleted && (
          <Card elevation="s" padding="m" style={styles.sectionCard}>
            <Typography variant="subtitle2" style={styles.sectionHeading}>
              {hasReviewed ? 'Your Review' : 'Leave a Review'}
            </Typography>
            {hasReviewed && userReview ? (
              <ReviewCard
                reviewerName={userReview.reviewerName}
                rating={userReview.rating || 0}
                comment={userReview.comment || ''}
                date={userReview.createdAt}
              />
            ) : (
              <Card elevation="s" padding="m">
                <Typography variant="body2" color="textSecondary" style={styles.reviewLabel}>
                  Rate your experience:
                </Typography>
                <View style={styles.ratingContainer}>
                  <StarRatingInput value={rating} onChange={setRating} size={32} />
                </View>

                <Typography variant="body2" color="textSecondary" style={styles.commentLabel}>
                  Comments (optional):
                </Typography>
                <TextInput
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience with this service..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Button
                  title={isSubmitting ? 'Submitting...' : 'Submit Review'}
                  onPress={handleSubmitReview}
                  disabled={rating === 0 || isSubmitting}
                  isLoading={isSubmitting}
                  style={styles.submitButton}
                />
              </Card>
            )}
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

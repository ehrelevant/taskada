import { Avatar, Button, Card, EmptyState, Header, Rating, ReviewCard, ScreenContainer, Section, StarRatingInput, StatusBadge, Typography } from '@repo/components';
import { BadgeCheck, Flag } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingLogs.styles';
import { useBookingLogs } from './BookingLogs.hooks';

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
      padding="none"
      stickyFooter={
        <View style={styles.footerButtons}>
          <Button title="View Request Details" onPress={handleViewRequestDetails} />
          <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} />
        </View>
      }
    >
      <Header
        title="Transaction Details"
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
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              transaction record
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse">
            Booking summary
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Review booking details, chat history, and service outcome.
          </Typography>
        </View>

        <TouchableOpacity onPress={handleViewServiceDetails} activeOpacity={0.8}>
          <Card elevation="m" padding="l" style={styles.serviceCard}>
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
        </TouchableOpacity>

        <Section label="Booking Details">
          <Section label="Service Cost">
            <Typography variant="h5" color="actionPrimary">
              ${transaction?.cost?.toFixed(2) || '0.00'}
            </Typography>
          </Section>

          {transaction?.specifications && (
            <Section label="Specifications" variant="card">
              <Typography variant="body1">{transaction.specifications}</Typography>
            </Section>
          )}

          <Section label="Booking Date and Time">
            <Typography variant="body1">
              {transaction?.createdAt ? formatDateTime(transaction.createdAt) : 'N/A'}
            </Typography>
          </Section>

          <Section label="Status">
            <StatusBadge status="info" label={transaction?.status?.toUpperCase() || 'UNKNOWN'} />
          </Section>
        </Section>

        {isCompleted && (
          <Section label={hasReviewed ? 'Your Review' : 'Leave a Review'}>
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
          </Section>
        )}
      </View>
    </ScreenContainer>
  );
}

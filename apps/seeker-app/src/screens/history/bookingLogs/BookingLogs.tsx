import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Header, Rating, ReviewCard, StarRatingInput, Typography } from '@repo/components';
import { ChevronLeft, Flag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@repo/theme';

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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const providerName = transaction?.provider
    ? `${transaction.provider.firstName} ${transaction.provider.lastName}`
    : 'Unknown Provider';

  const userReview = reviews.find((review: { reviewerUserId: string }) => review.reviewerUserId === currentUserId);
  const hasReviewed = !!userReview;
  const isCompleted = transaction?.status === 'completed';

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Transaction Details"
        size="small"
        leftContent={
          <TouchableOpacity onPress={handleGoBack}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={handleViewServiceDetails} activeOpacity={0.8}>
          <Card elevation="m" padding="l" style={styles.serviceCard}>
            <View style={styles.providerSection}>
              <Avatar
                source={transaction?.provider?.avatarUrl ? { uri: transaction.provider.avatarUrl } : null}
                size={80}
                name={providerName}
              />
              <Typography variant="h6" style={{ marginTop: spacing.s }}>
                {providerName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {transaction?.serviceType?.name}
              </Typography>
              {transaction?.serviceRating && (
                <View style={{ marginTop: spacing.s }}>
                  <Rating
                    value={transaction.serviceRating.avgRating}
                    reviewCount={transaction.serviceRating.reviewCount}
                  />
                </View>
              )}
            </View>
            <Typography variant="caption" color="actionPrimary" style={styles.tapHint}>
              Tap to view service details
            </Typography>
          </Card>
        </TouchableOpacity>

        <View style={styles.section}>
          <Typography variant="h6" style={styles.sectionTitle}>
            Booking Details
          </Typography>

          <View style={styles.detailRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Service Cost
            </Typography>
            <Typography variant="h5" style={styles.costValue}>
              ${transaction?.cost?.toFixed(2) || '0.00'}
            </Typography>
          </View>

          {transaction?.specifications && (
            <View style={styles.detailRow}>
              <Typography variant="subtitle2" color="textSecondary">
                Specifications
              </Typography>
              <View style={styles.specificationsBox}>
                <Typography variant="body1" style={styles.specificationsText}>
                  {transaction.specifications}
                </Typography>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Booking Date and Time
            </Typography>
            <Typography variant="body1">
              {transaction?.createdAt ? formatDateTime(transaction.createdAt) : 'N/A'}
            </Typography>
          </View>

          <View style={styles.detailRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <View style={styles.statusBadge}>
              <Typography variant="body1" style={styles.statusText}>
                {transaction?.status?.toUpperCase()}
              </Typography>
            </View>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.section}>
            <Typography variant="h6" style={styles.sectionTitle}>
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
              <Card elevation="s" padding="m" style={styles.reviewCard}>
                <Typography variant="body2" color="textSecondary" style={styles.reviewLabel}>
                  Rate your experience:
                </Typography>
                <View style={styles.ratingContainer}>
                  <StarRatingInput value={rating} onChange={setRating} size={32} />
                </View>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={[styles.reviewLabel, { marginTop: spacing.m }]}
                >
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
                  style={{ marginTop: spacing.m }}
                />
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="View Request Details" onPress={handleViewRequestDetails} />
        <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} style={styles.secondaryButton} />
      </View>
    </SafeAreaView>
  );
}

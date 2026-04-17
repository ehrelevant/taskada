import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Avatar, Button, Card, EmptyState, Rating, ReviewCard, ScreenContainer, StarRatingInput, StatusBadge, Typography } from '@repo/components';
import { CalendarClock, CircleDollarSign, FileText, MapPin } from 'lucide-react-native';
import { TextInput, View } from 'react-native';
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
    booking,
    isLoading,
    latitude,
    longitude,
    reviews,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    currentUserId,
    handleViewServiceDetails,
    handleViewRequestDetails,
    handleViewChatLogs,
    handleSubmitReview,
    formatDateTime,
  } = useBookingLogs();

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading..." />
      </ScreenContainer>
    );
  }

  const providerName = booking?.provider
    ? `${booking.provider.firstName} ${booking.provider.lastName}`
    : 'Unknown Provider';

  const userReview = reviews.find((review: { reviewerUserId: string }) => review.reviewerUserId === currentUserId);
  const hasReviewed = !!userReview;
  const isCompleted = booking?.status === 'completed';

  return (
    <ScreenContainer
      scrollable
      edges={['left', 'right']}
      stickyFooter={
        <View style={styles.footerButtons}>
          <Button title="View Request Details" onPress={handleViewRequestDetails} />
          <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} />
        </View>
      }
    >
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Booking Summary
          </Typography>
          <Typography variant="body2" color="textInverse">
            Review finalized details, related request info, and conversation logs.
          </Typography>
        </View>

        <Card elevation="m" padding="l" style={styles.serviceCard} onPress={handleViewServiceDetails}>
          <View style={styles.providerSection}>
            <Avatar
              source={booking?.provider?.avatarUrl ? { uri: booking.provider.avatarUrl } : null}
              size={80}
              name={providerName}
            />
            <Typography variant="h6" style={styles.providerName}>
              {providerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {booking?.serviceType?.name}
            </Typography>
            {booking?.serviceRating && (
              <View style={styles.ratingRow}>
                <Rating
                  value={booking.serviceRating.avgRating}
                  reviewCount={booking.serviceRating.reviewCount}
                />
              </View>
            )}
          </View>
        </Card>

        {booking?.address && (
          <Card elevation="s" padding="m" style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <MapPin size={15} color={colors.textSecondary} />
              <Typography variant="subtitle2" style={styles.sectionLabel}>
                Service Location
              </Typography>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} title="Service Location" />
              </MapView>
            </View>
            <View style={styles.addressContainer}>
              <Typography variant="body2" style={styles.addressText}>
                {booking.address.label || 'Location not specified'}
              </Typography>
            </View>
          </Card>
        )}

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <CircleDollarSign size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Cost
            </Typography>
          </View>
          <Typography variant="h5" color="actionPrimary">
            ₱{booking?.cost?.toFixed(2) || '0.00'}
          </Typography>
        </Card>

        {booking?.specifications && (
          <Card elevation="s" padding="m" style={styles.sectionCard}>
            <View style={styles.sectionLabelRow}>
              <FileText size={15} color={colors.textSecondary} />
              <Typography variant="subtitle2" style={styles.sectionLabel}>
                Specifications
              </Typography>
            </View>
            <View style={styles.specificationsBox}>
              <Typography variant="body1" style={styles.specificationsText}>
                {booking.specifications}
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
          <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>
        </Card>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <Typography variant="subtitle2" style={styles.sectionHeading}>
            Status
          </Typography>
          <StatusBadge
            status={STATUS_MAP[booking?.status || ''] || 'default'}
            label={booking?.status?.toUpperCase() || 'UNKNOWN'}
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

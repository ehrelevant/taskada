import { Avatar, Button, EmptyState, Rating, ReviewCard, ScreenContainer, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './ServiceDetails.styles';
import { useServiceDetails } from './ServiceDetails.hooks';

export function ServiceDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { details, reviews, loading, error, returnTo, handleRequestService } = useServiceDetails();

  if (loading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading service..." />
      </ScreenContainer>
    );
  }

  if (error || !details) {
    return (
      <ScreenContainer>
        <EmptyState message={error || 'Service not found'} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.providerSection}>
        <Avatar
          source={details.providerAvatar ? { uri: details.providerAvatar } : null}
          size={96}
          name={details.providerName}
          borderColor={colors.secondary.base}
          borderWidth={3}
        />
        <Typography variant="h2" style={styles.providerName}>
          {details.providerName}
        </Typography>
        <Typography variant="overline" color="textSecondary" style={styles.serviceType}>
          {details.serviceTypeName}
        </Typography>
        <View style={styles.ratingRow}>
          <Rating value={details.avgRating} reviewCount={details.reviewCount} size={16} />
        </View>
      </View>

      <View style={styles.priceRow}>
        <Typography variant="h1" color={colors.actionSecondary}>
          ${details.initialCost.toFixed(2)}
        </Typography>
        <Button
          title={returnTo === 'RequestForm' ? 'Select' : 'Request'}
          onPress={handleRequestService}
          style={styles.requestButton}
        />
      </View>

      <View style={styles.reviewsSection}>
        <Typography variant="h3">Reviews ({details.reviewCount})</Typography>
        <View style={styles.reviewsContent}>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No reviews yet
            </Typography>
          ) : (
            reviews.map(review => (
              <ReviewCard
                key={review.id}
                reviewerName={review.reviewerName}
                reviewerAvatar={review.reviewerAvatar}
                rating={review.rating}
                comment={review.comment}
                date={review.createdAt}
              />
            ))
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

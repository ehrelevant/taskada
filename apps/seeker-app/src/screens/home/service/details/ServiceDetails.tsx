import { Avatar, Button, EmptyState, Rating, ReviewCard, ScreenContainer, Typography } from '@repo/components';
import { BadgeCheck, CircleDollarSign, MessageSquareText } from 'lucide-react-native';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './ServiceDetails.styles';
import { useServiceDetails } from './ServiceDetails.hooks';

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `PHP ${amount.toLocaleString()}`;
  }
}

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
    <ScreenContainer scrollable padding="none">
      <View style={styles.heroShell}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Avatar
              source={details.providerAvatar ? { uri: details.providerAvatar } : null}
              size={92}
              name={details.providerName}
              borderColor={colors.home.heroAccent}
              borderWidth={3}
            />
            <View style={styles.heroSummary}>
              <View style={styles.verifiedPill}>
                <BadgeCheck size={14} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  verified provider
                </Typography>
              </View>
              <Typography variant="h3" color="textInverse" numberOfLines={2} style={styles.providerName}>
                {details.providerName}
              </Typography>
              <Typography variant="overline" color={colors.home.chipText} style={styles.serviceType}>
                {details.serviceTypeName}
              </Typography>
              <Typography variant="caption" color="textInverse" style={styles.heroHint}>
                Available for booking and live chat.
              </Typography>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <Rating
              value={details.avgRating}
              reviewCount={details.reviewCount}
              size={16}
              valueColor="textInverse"
              reviewCountColor={colors.home.chipText}
            />
          </View>
        </View>
      </View>

      <View style={styles.priceCard}>
        <View style={styles.priceHeader}>
          <CircleDollarSign size={18} color={colors.actionPrimary} />
          <Typography variant="caption" color="textSecondary">
            Starting price
          </Typography>
        </View>
        <Typography variant="h2" color="actionPrimary" style={styles.priceAmount}>
          {formatCurrency(details.initialCost)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Final cost may vary based on scope and materials.
        </Typography>

        <Button
          title={returnTo === 'RequestForm' ? 'Select' : 'Request'}
          onPress={handleRequestService}
          style={styles.requestButton}
        />
      </View>

      <View style={styles.reviewsSection}>
        <View style={styles.reviewHeadingRow}>
          <Typography variant="h4">Reviews ({details.reviewCount})</Typography>
          <View style={styles.reviewHintPill}>
            <MessageSquareText size={13} color={colors.textSecondary} />
            <Typography variant="caption" color="textSecondary">
              community feedback
            </Typography>
          </View>
        </View>
        <View style={styles.reviewsContent}>
          {reviews.length === 0 ? (
            <View style={styles.emptyReviewCard}>
              <Typography variant="body2" color="textSecondary">
                No reviews yet
              </Typography>
            </View>
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

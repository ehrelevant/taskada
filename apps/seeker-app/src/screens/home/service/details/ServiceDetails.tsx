import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Avatar, Button, Rating, ReviewCard, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';

import { styles } from './ServiceDetails.styles';
import { useServiceDetails } from './ServiceDetails.hooks';

export function ServiceDetailsScreen() {
  const { details, reviews, loading, error, returnTo, handleRequestService } = useServiceDetails();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body1" color="error">
          {error || 'Service not found'}
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.providerSection}>
        <Avatar
          source={details.providerAvatar ? { uri: details.providerAvatar } : null}
          size={80}
          name={details.providerName}
        />
        <Typography variant="h6" style={{ marginTop: spacing.s }}>
          {details.providerName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {details.serviceTypeName}
        </Typography>
        <View style={{ marginTop: spacing.s }}>
          <Rating value={details.avgRating} reviewCount={details.reviewCount} />
        </View>
      </View>

      <View style={styles.section}>
        <Typography variant="h6">About this service</Typography>
        <Typography variant="body1" color="textSecondary" style={{ marginTop: spacing.s }}>
          ${details.initialCost.toFixed(2)}
        </Typography>
        <Button
          title={returnTo === 'RequestForm' ? 'Select This Service' : 'Request Provider'}
          onPress={handleRequestService}
          style={{ marginTop: spacing.m }}
        />
      </View>

      <View style={styles.section}>
        <Typography variant="h6">Reviews ({details.reviewCount})</Typography>
        {reviews.length === 0 ? (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: spacing.s }}>
            No reviews yet
          </Typography>
        ) : (
          <View style={{ marginTop: spacing.s }}>
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                reviewerName={review.reviewerName}
                reviewerAvatar={review.reviewerAvatar}
                rating={review.rating}
                comment={review.comment}
                date={review.createdAt}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

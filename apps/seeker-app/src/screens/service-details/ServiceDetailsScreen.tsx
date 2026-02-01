import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Rating, ReviewCard, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { getServiceDetails, getServiceReviews, type Review, type ServiceDetails } from '@lib/helpers';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

type ServiceDetailsRouteProp = RouteProp<{ ServiceDetails: { serviceId: string } }, 'ServiceDetails'>;

export function ServiceDetailsScreen() {
  const route = useRoute<ServiceDetailsRouteProp>();
  const { serviceId } = route.params;

  const [details, setDetails] = useState<ServiceDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [detailsData, reviewsData] = await Promise.all([
          getServiceDetails(serviceId),
          getServiceReviews(serviceId),
        ]);
        setDetails(detailsData);
        setReviews(reviewsData);
      } catch {
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [serviceId]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  providerSection: {
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

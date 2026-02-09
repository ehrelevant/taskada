import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { apiFetch, Review } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Avatar, Button, Card, Rating, ReviewCard, StarRatingInput, Typography } from '@repo/components';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';

type TransactionDetailsRouteProp = RouteProp<TransactionHistoryStackParamList, 'TransactionDetails'>;
type TransactionDetailsNavigationProp = NativeStackNavigationProp<
  TransactionHistoryStackParamList,
  'TransactionDetails'
>;

interface TransactionData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  serviceId: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
}

interface ReviewWithUser extends Review {
  reviewerUserId: string;
}

export function TransactionDetailsScreen() {
  const route = useRoute<TransactionDetailsRouteProp>();
  const navigation = useNavigation<TransactionDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
        } else {
          throw new Error('Failed to fetch transaction');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        Alert.alert('Error', 'Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [bookingId]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!transaction?.serviceId) return;

      try {
        setIsLoadingReviews(true);
        const response = await apiFetch(`/services/${transaction.serviceId}/reviews`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [transaction?.serviceId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleViewServiceDetails = () => {
    if (transaction?.serviceId) {
      // Navigate through parent navigator to reach HomeStack
      navigation.getParent()?.navigate('HomeStack', {
        screen: 'ServiceDetails',
        params: { serviceId: transaction.serviceId },
      });
    }
  };

  const handleViewRequestDetails = () => {
    navigation.navigate('RequestDetailsSummary', { bookingId });
  };

  const handleViewChatLogs = () => {
    if (transaction?.provider) {
      navigation.navigate('ChatLogs', {
        bookingId,
        otherUser: {
          id: transaction.provider.id,
          firstName: transaction.provider.firstName,
          lastName: transaction.provider.lastName,
          avatarUrl: transaction.provider.avatarUrl,
        },
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!transaction?.serviceId || rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch('/reviews', 'POST', {
        body: JSON.stringify({
          serviceId: transaction.serviceId,
          bookingId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      // Navigate to ServiceDetailsScreen to see the review
      navigation.getParent()?.navigate('HomeStack', {
        screen: 'ServiceDetails',
        params: { serviceId: transaction.serviceId },
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  // Check if user has already reviewed this service
  const userReview = reviews.find(review => review.reviewerUserId === currentUserId);
  const hasReviewed = !!userReview;
  const isCompleted = transaction?.status === 'completed';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h6">Transaction Details</Typography>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Service Provider Card */}
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

        {/* Booking Details Section */}
        <View style={styles.section}>
          <Typography variant="h6" style={styles.sectionTitle}>
            Booking Details
          </Typography>

          {/* Service Cost */}
          <View style={styles.detailRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Service Cost
            </Typography>
            <Typography variant="h5" style={styles.costValue}>
              ₱{transaction?.cost?.toFixed(2) || '0.00'}
            </Typography>
          </View>

          {/* Specifications */}
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

          {/* Booking Date and Time */}
          <View style={styles.detailRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Booking Date and Time
            </Typography>
            <Typography variant="body1">
              {transaction?.createdAt ? formatDateTime(transaction.createdAt) : 'N/A'}
            </Typography>
          </View>

          {/* Status */}
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

        {/* Review Section - Only show for completed bookings */}
        {isCompleted && (
          <View style={styles.section}>
            <Typography variant="h6" style={styles.sectionTitle}>
              {hasReviewed ? 'Your Review' : 'Leave a Review'}
            </Typography>

            {isLoadingReviews ? (
              <ActivityIndicator size="small" color={colors.actionPrimary} />
            ) : hasReviewed && userReview ? (
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

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="View Request Details" onPress={handleViewRequestDetails} />
        <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} style={styles.secondaryButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  serviceCard: {
    marginBottom: spacing.l,
  },
  providerSection: {
    alignItems: 'center',
  },
  tapHint: {
    marginTop: spacing.m,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  detailRow: {
    marginBottom: spacing.m,
  },
  costValue: {
    color: colors.actionPrimary,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  specificationsBox: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    marginTop: spacing.xs,
  },
  specificationsText: {
    lineHeight: 22,
  },
  statusBadge: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  statusText: {
    fontWeight: '600',
    color: colors.actionPrimary,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  secondaryButton: {
    marginTop: spacing.s,
  },
  reviewCard: {
    backgroundColor: colors.surface,
  },
  reviewLabel: {
    marginBottom: spacing.s,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 100,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});

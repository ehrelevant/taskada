import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Avatar, Button, Rating, StarRatingInput, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { HomeStackParamList } from '@navigation/HomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react-native';

type BookingCompleteRouteProp = RouteProp<HomeStackParamList, 'BookingComplete'>;
type BookingCompleteNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BookingComplete'>;

interface BookingData {
  id: string;
  serviceId: string;
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
}

export function BookingCompleteScreen() {
  const route = useRoute<BookingCompleteRouteProp>();
  const navigation = useNavigation<BookingCompleteNavigationProp>();
  const { bookingId, providerInfo, serviceTypeName, cost } = route.params;
  const _cost = cost;

  const providerName = `${providerInfo.firstName} ${providerInfo.lastName}`;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  // Fetch booking details to get service rating
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setBookingData(data);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setIsLoadingRating(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleViewDetails = () => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!bookingData) {
      Alert.alert('Error', 'Booking data not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = bookingData.serviceId;

      // Submit review
      const response = await apiFetch('/reviews', 'POST', {
        body: JSON.stringify({
          serviceId,
          bookingId,
          rating,
          comment: reviewText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      Alert.alert('Success', 'Thank you for your review!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Exit Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome} style={styles.exitButton}>
          <X size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Title */}
          <View style={styles.titleContainer}>
            <Typography variant="h4" style={styles.title}>
              Complete!
            </Typography>
          </View>

          {/* Provider Card */}
          <View style={styles.section}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Provider
            </Typography>
            <View style={styles.providerCard}>
              <View style={styles.providerImageContainer}>
                {providerInfo.avatarUrl ? (
                  <Avatar source={{ uri: providerInfo.avatarUrl }} size={80} name={providerName} />
                ) : (
                  <Avatar source={null} size={80} name={providerName} />
                )}
              </View>
              <View style={styles.providerInfo}>
                <Typography variant="h6" style={styles.providerName}>
                  {providerName}
                </Typography>
                <Typography variant="overline" color="textSecondary" style={styles.serviceType}>
                  {serviceTypeName}
                </Typography>
                <View style={styles.ratingContainer}>
                  {isLoadingRating ? (
                    <ActivityIndicator size="small" color={colors.actionPrimary} />
                  ) : (
                    <Rating
                      value={bookingData?.serviceRating?.avgRating ?? 0}
                      reviewCount={bookingData?.serviceRating?.reviewCount ?? 0}
                      size={16}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* View Booking Details Button */}
          <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
            <Typography variant="body1" style={styles.detailsButtonText}>
              View Booking Details
            </Typography>
          </TouchableOpacity>

          {/* Spacer to push review form to bottom */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Review Form */}
        <View style={styles.reviewFormContainer}>
          <Typography variant="subtitle1" style={styles.reviewFormTitle}>
            Rate Your Experience
          </Typography>

          {/* Star Rating */}
          <View style={styles.ratingInputContainer}>
            <StarRatingInput value={rating} onChange={setRating} size={36} />
          </View>

          {/* Review Text Input */}
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={3}
            placeholder="Write your review here..."
            placeholderTextColor={colors.textDisabled}
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Review'}
            onPress={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  exitButton: {
    padding: spacing.s,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.m,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    color: colors.actionPrimary,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  providerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImageContainer: {
    marginRight: spacing.m,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    marginBottom: spacing.xs,
  },
  serviceType: {
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  detailsButton: {
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  detailsButtonText: {
    color: colors.actionPrimary,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  reviewFormContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.m,
    paddingBottom: Platform.OS === 'ios' ? spacing.l : spacing.m,
  },
  reviewFormTitle: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  ratingInputContainer: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  reviewInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 80,
    marginBottom: spacing.m,
    color: colors.textPrimary,
    fontSize: 16,
  },
});

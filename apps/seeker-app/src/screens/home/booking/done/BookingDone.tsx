import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Button, Header, Rating, StarRatingInput, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Flag, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const {
    providerInfo,
    serviceTypeName,
    rating,
    setRating,
    reviewText,
    setReviewText,
    isSubmitting,
    bookingData,
    isLoadingRating,
    handleGoHome,
    handleViewDetails,
    handleSubmitReview,
    handleReport,
  } = useBookingDone();

  const providerName = `${providerInfo.firstName} ${providerInfo.lastName}`;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftContent={
          <TouchableOpacity onPress={handleGoHome}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Typography variant="h4" style={styles.title}>
              Complete!
            </Typography>
          </View>

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

          <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
            <Typography variant="body1" style={styles.detailsButtonText}>
              View Booking Details
            </Typography>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.reviewFormContainer}>
          <Typography variant="subtitle1" style={styles.reviewFormTitle}>
            Rate Your Experience
          </Typography>

          <View style={styles.ratingInputContainer}>
            <StarRatingInput value={rating} onChange={setRating} size={36} />
          </View>

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

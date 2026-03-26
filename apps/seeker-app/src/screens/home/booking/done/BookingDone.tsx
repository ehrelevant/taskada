import {
  Avatar,
  Button,
  Header,
  Rating,
  ScreenContainer,
  Section,
  StarRatingInput,
  Typography,
} from '@repo/components';
import { CheckCircle, Flag, X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
    <ScreenContainer padding="none" useSafeArea={false}>
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
          <View style={styles.heroSection}>
            <CheckCircle size={48} color={colors.actionSecondary} />
            <Typography variant="h1" align="center" style={styles.title}>
              Complete!
            </Typography>
          </View>

          <Section label="Service Provider">
            <View style={styles.providerCard}>
              <Avatar
                source={providerInfo.avatarUrl ? { uri: providerInfo.avatarUrl } : null}
                size={80}
                name={providerName}
              />
              <View style={styles.providerInfo}>
                <Typography variant="h6" style={styles.providerName}>
                  {providerName}
                </Typography>
                <Typography variant="overline" color="textSecondary">
                  {serviceTypeName}
                </Typography>
                <View style={styles.ratingContainer}>
                  {isLoadingRating ? (
                    <Typography variant="caption" color="textDisabled">
                      Loading...
                    </Typography>
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
          </Section>

          <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
            <Typography variant="body1" color="actionPrimary" weight="medium">
              View Booking Details
            </Typography>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.reviewFormContainer}>
          <Typography variant="subtitle1" align="center" style={styles.reviewFormTitle}>
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
    </ScreenContainer>
  );
}

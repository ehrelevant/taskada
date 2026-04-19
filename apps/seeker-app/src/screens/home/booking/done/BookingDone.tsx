import { Avatar, Button, Card, Rating, ScreenContainer, StarRatingInput, Typography } from '@repo/components';
import { CheckCircle } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { TextInput, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const {
    otherUser,
    serviceTypeName,
    rating,
    setRating,
    reviewText,
    setReviewText,
    isSubmitting,
    bookingData,
    isLoadingRating,
    handleGoHome,
    handleSubmitReview,
  } = useBookingDone();

  const providerName = `${otherUser.firstName} ${otherUser.lastName}`;

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.heroSection}>
          <CheckCircle size={48} color={colors.actionSecondary} />
          <Typography variant="h2" align="center" color="textInverse" style={styles.title}>
            Complete!
          </Typography>
          <Typography variant="body2" color="textInverse" align="center">
            Your service booking has been completed successfully.
          </Typography>
        </View>

        <Card elevation="s" padding="m" style={styles.summaryCard}>
          <Avatar source={otherUser.avatarUrl ? { uri: otherUser.avatarUrl } : null} size={80} name={providerName} />
          <View style={styles.providerInfo}>
            <Typography variant="h3" style={styles.providerName}>
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
        </Card>

        <View style={styles.actionButtonsContainer}>
          <Button title="Go Home" onPress={handleGoHome} />
        </View>

        <Card elevation="s" padding="m" style={styles.reviewFormContainer}>
          <Typography variant="subtitle1" align="center" style={styles.sectionHeading}>
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
        </Card>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}

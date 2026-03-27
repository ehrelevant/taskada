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
import { BadgeCheck, CheckCircle, CircleDollarSign, Flag, Sparkles, X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

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

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const {
    providerInfo,
    serviceTypeName,
    cost,
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
          <TouchableOpacity onPress={handleGoHome} style={styles.iconButton}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.heroSection}>
            <CheckCircle size={48} color={colors.actionSecondary} />
            <Typography variant="h2" align="center" color="textInverse" style={styles.title}>
              Complete!
            </Typography>
            <Typography variant="body2" color="textInverse" align="center" style={styles.heroSubtitle}>
              Your service booking has been completed successfully.
            </Typography>

            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <BadgeCheck size={13} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  booking closed
                </Typography>
              </View>
              <View style={styles.heroBadge}>
                <Sparkles size={13} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  review helps others
                </Typography>
              </View>
            </View>
          </View>

          <Section label="Service Provider">
            <View style={styles.providerCardShell}>
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

            <View style={styles.costPill}>
              <CircleDollarSign size={14} color={colors.actionPrimary} />
              <Typography variant="caption" color="textSecondary">
                Final cost
              </Typography>
              <Typography variant="subtitle2" color="actionPrimary" style={styles.costValue}>
                {formatCurrency(cost)}
              </Typography>
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

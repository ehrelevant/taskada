import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { CircleDollarSign, Flag, Sparkles } from 'lucide-react-native';
import { Header, ScreenContainer, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingServing.styles';
import { useBookingServing } from './BookingServing.hooks';

export function BookingServingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, isLoading, isPaid, isUpdatingStatus, handlePaidPress, handleViewDetails, handleReport } =
    useBookingServing();

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centeredContent}>
          <View style={styles.header}>
            <Typography variant="h3" style={styles.headerTitle}>
              Currently Serving!
            </Typography>
          </View>

          <View style={styles.instructionContainer}>
            <Typography variant="body2" style={styles.instructionText}>
              Please click the Paid button below if the seeker gave cash payment to you.
            </Typography>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePaidPress}
              disabled={isPaid || isUpdatingStatus}
              style={[
                styles.circularButton,
                isPaid && styles.doneButton,
                (isPaid || isUpdatingStatus) && styles.disabledButton,
              ]}
            >
              {isUpdatingStatus ? (
                <ActivityIndicator size="large" color={colors.textInverse} />
              ) : (
                <Typography variant="h2" style={styles.buttonText}>
                  {isPaid ? 'DONE' : 'PAID'}
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Typography variant="subtitle2" color="textSecondary">
                Service Type
              </Typography>
              <Typography variant="body1" weight="medium">
                {bookingDetails?.serviceType?.name || 'Service'}
              </Typography>
            </View>
            <View style={styles.infoItem}>
              <Typography variant="subtitle2" color="textSecondary">
                Service Cost
              </Typography>
              <View style={styles.costRow}>
                <CircleDollarSign size={15} color={colors.actionPrimary} />
                <Typography variant="h6" style={styles.costValue}>
                  ₱{bookingDetails?.cost?.toFixed(2) || '0.00'}
                </Typography>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
            <Typography variant="body1" style={styles.detailsButtonText}>
              View Booking Details
            </Typography>
            <Sparkles size={14} color={colors.actionPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

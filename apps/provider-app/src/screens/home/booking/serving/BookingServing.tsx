import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { ScreenContainer, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingServing.styles';
import { useBookingServing } from './BookingServing.hooks';

export function BookingServingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, serviceTypeName, isLoading, isPaid, isUpdatingStatus, handlePaidPress } = useBookingServing();

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
    <ScreenContainer edges={['left', 'right', 'bottom']}>
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
              <Typography variant="subtitle1" color="actionPrimary">
                {serviceTypeName}
              </Typography>
            </View>
            <View style={styles.infoItem}>
              <Typography variant="subtitle2" color="textSecondary">
                Service Cost
              </Typography>
              <Typography variant="subtitle1" color="actionPrimary">
                ₱{bookingDetails?.cost?.toFixed(2) || '0.00'}
              </Typography>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

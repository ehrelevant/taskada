import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { CircleDollarSign, Flag, Sparkles } from 'lucide-react-native';
import { Header, ScreenContainer, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, isLoading, handleReturn, handleViewDetails, handleReport } = useBookingDone();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right', 'bottom']}>
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
      <Header
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContent}>
          <View style={styles.header}>
            <Typography variant="h3" color="textInverse" align="center">
              Well Done, Provider!
            </Typography>
            <Typography variant="body1" color="textInverse" align="center">
              You successfully completed this service. You may go back to the requests list.
            </Typography>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleReturn} style={styles.circularButton}>
              <Typography variant="h4" style={styles.buttonText}>
                Return
              </Typography>
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
                {bookingDetails?.service?.serviceType?.name || 'Service'}
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

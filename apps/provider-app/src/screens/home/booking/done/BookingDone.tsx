import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { BadgeCheck, CircleDollarSign, Flag, Sparkles } from 'lucide-react-native';
import { Header, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, isLoading, handleReturn, handleViewDetails, handleReport } = useBookingDone();

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

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.heroPill}>
              <BadgeCheck size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                booking completed
              </Typography>
            </View>
            <Typography variant="h4" style={styles.headerTitle}>
              Well Done, Provider!
            </Typography>
          </View>

          <View style={styles.messageContainer}>
            <Typography variant="body1" style={styles.messageText}>
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
    </SafeAreaView>
  );
}

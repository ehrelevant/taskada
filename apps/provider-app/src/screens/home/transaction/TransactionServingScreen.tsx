import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { chatSocket } from '@lib/chatSocket';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@repo/components';
import { useEffect, useState } from 'react';

type TransactionServingRouteProp = RouteProp<RequestsStackParamList, 'TransactionServing'>;
type TransactionServingNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'TransactionServing'>;

interface BookingDetails {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
}

export function TransactionServingScreen() {
  const route = useRoute<TransactionServingRouteProp>();
  const navigation = useNavigation<TransactionServingNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setBookingDetails(data);
        } else {
          throw new Error('Failed to fetch booking details');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert('Error', 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePaidPress = async () => {
    if (isUpdatingStatus) return;

    setIsUpdatingStatus(true);

    try {
      // Update booking status to 'completed'
      const response = await apiFetch(`/bookings/${bookingId}`, 'PATCH', {
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setIsPaid(true);

      // Emit booking completed event via websocket
      chatSocket.notifyBookingCompleted(bookingId);

      // Navigate to TransactionDone screen
      navigation.navigate('TransactionDone', { bookingId });
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('BookingDetails', {
      bookingId,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centeredContent}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h5" style={styles.headerTitle}>
              Currently Serving!
            </Typography>
          </View>

          {/* Instruction Text */}
          <View style={styles.instructionContainer}>
            <Typography variant="body1" style={styles.instructionText}>
              Please click the Paid button below if the seeker gave cash payment to you.
            </Typography>
          </View>

          {/* Large Circular PAID/DONE Button */}
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
                <Typography variant="h4" style={styles.buttonText}>
                  {isPaid ? 'DONE' : 'PAID'}
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section - Service Info */}
        <View style={styles.bottomSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Typography variant="subtitle2" color="textSecondary">
                Service Type
              </Typography>
              <Typography variant="body1" weight="medium">
                {bookingDetails?.provider?.firstName || 'Service'}
              </Typography>
            </View>
            <View style={styles.infoItem}>
              <Typography variant="subtitle2" color="textSecondary">
                Service Cost
              </Typography>
              <Typography variant="h6" style={styles.costValue}>
                ₱{bookingDetails?.cost?.toFixed(2) || '0.00'}
              </Typography>
            </View>
          </View>

          {/* View Booking Details Button */}
          <TouchableOpacity onPress={handleViewDetails} style={styles.detailsButton}>
            <Typography variant="body1" style={styles.detailsButtonText}>
              View Booking Details
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: spacing.m,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  headerTitle: {
    textAlign: 'center',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  instructionText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  circularButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButton: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    marginTop: spacing.l,
    paddingTop: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  costValue: {
    color: colors.actionPrimary,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  detailsButton: {
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsButtonText: {
    color: colors.actionPrimary,
    fontWeight: '600',
  },
});

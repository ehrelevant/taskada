import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@repo/components';
import { useEffect, useState } from 'react';

type TransactionDoneRouteProp = RouteProp<RequestsStackParamList, 'TransactionDone'>;
type TransactionDoneNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'TransactionDone'>;

interface BookingDetails {
  id: string;
  status: string;
  cost: number;
  serviceId: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  service: {
    id: string;
    serviceType: {
      name: string;
    } | null;
  } | null;
}

export function TransactionDoneScreen() {
  const route = useRoute<TransactionDoneRouteProp>();
  const navigation = useNavigation<TransactionDoneNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleReturn = () => {
    navigation.navigate('RequestList');
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
            <Typography variant="h4" style={styles.headerTitle}>
              Well Done, Provider!
            </Typography>
          </View>

          {/* Success Message */}
          <View style={styles.messageContainer}>
            <Typography variant="body1" style={styles.messageText}>
              You successfully completed this service. You may go back to the requests list.
            </Typography>
          </View>

          {/* Large Circular Return Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleReturn} style={styles.circularButton}>
              <Typography variant="h4" style={styles.buttonText}>
                Return
              </Typography>
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
                {bookingDetails?.service?.serviceType?.name || 'Service'}
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
    color: colors.actionPrimary,
    fontWeight: '700',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 24,
    color: colors.textSecondary,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
  circularButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.success,
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
  buttonText: {
    color: colors.textInverse,
    fontWeight: '700',
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

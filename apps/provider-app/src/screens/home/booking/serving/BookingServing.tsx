import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@repo/components';
import { useEffect, useState } from 'react';

import { styles } from './BookingServing.styles';

type BookingServingRouteProp = RouteProp<RequestsStackParamList, 'BookingServing'>;
type BookingServingNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'BookingServing'>;

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

export function BookingServingScreen() {
  const route = useRoute<BookingServingRouteProp>();
  const navigation = useNavigation<BookingServingNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
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
      const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'PATCH', {
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setIsPaid(true);

      providerClient.notifyBookingCompleted(bookingId);

      navigation.replace('BookingDone', { bookingId });
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
          <View style={styles.header}>
            <Typography variant="h5" style={styles.headerTitle}>
              Currently Serving!
            </Typography>
          </View>

          <View style={styles.instructionContainer}>
            <Typography variant="body1" style={styles.instructionText}>
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
                <Typography variant="h4" style={styles.buttonText}>
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

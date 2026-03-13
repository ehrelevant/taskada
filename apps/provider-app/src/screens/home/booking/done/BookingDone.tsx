import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@repo/components';
import { useEffect, useState } from 'react';

import { styles } from './BookingDone.styles';

type BookingDoneRouteProp = RouteProp<RequestsStackParamList, 'BookingDone'>;
type BookingDoneNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'BookingDone'>;

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

export function BookingDoneScreen() {
  const route = useRoute<BookingDoneRouteProp>();
  const navigation = useNavigation<BookingDoneNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <View style={styles.header}>
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

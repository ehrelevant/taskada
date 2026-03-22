import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

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
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
}

interface UseBookingServingReturn {
  bookingDetails: BookingDetails | null;
  isLoading: boolean;
  isPaid: boolean;
  isUpdatingStatus: boolean;
  handlePaidPress: () => Promise<void>;
  handleViewDetails: () => void;
  handleReport: () => void;
}

export function useBookingServing(): UseBookingServingReturn {
  const route = useRoute<BookingServingRouteProp>();
  const navigation = useNavigation<BookingServingNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
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
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handlePaidPress = useCallback(async () => {
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
  }, [bookingId, isUpdatingStatus, navigation]);

  const handleViewDetails = useCallback(() => {
    navigation.navigate('BookingDetails', {
      bookingId,
    });
  }, [bookingId, navigation]);

  const handleReport = useCallback(() => {
    if (bookingDetails?.seeker) {
      navigation.navigate('Report', {
        bookingId,
        reportedUser: bookingDetails.seeker,
      });
    }
  }, [bookingId, navigation, bookingDetails?.seeker]);

  return {
    bookingDetails,
    isLoading,
    isPaid,
    isUpdatingStatus,
    handlePaidPress,
    handleViewDetails,
    handleReport,
  };
}

import { BookingStackParamList } from '@navigation/BookingStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type BookingDoneRouteProp = RouteProp<BookingStackParamList, 'BookingDone'>;
type BookingDoneNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingDone'>;

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
  seeker: {
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

export function useBookingDone() {
  const route = useRoute<BookingDoneRouteProp>();
  const navigation = useNavigation<BookingDoneNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handleReturn = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);

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
    handleReturn,
    handleViewDetails,
    handleReport,
  };
}

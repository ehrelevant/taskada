import { Alert } from 'react-native';
import { HistoryStackParamList } from '@navigation/HistoryStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type BookingDetailsRouteProp = RouteProp<HistoryStackParamList, 'BookingLogs'>;
type BookingDetailsNavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'BookingLogs'>;

export interface BookingData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  serviceId: string;
  seekerUserId: string;
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
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
}

export function useBookingLogs() {
  const route = useRoute<BookingDetailsRouteProp>();
  const navigation = useNavigation<BookingDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooking = useCallback(async () => {
    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      } else {
        throw new Error('Failed to fetch booking');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewRequestDetails = useCallback(() => {
    navigation.navigate('RequestLogs', { bookingId });
  }, [bookingId, navigation]);

  const handleViewChatLogs = useCallback(() => {
    if (booking?.provider) {
      navigation.navigate('ChatLogs', {
        bookingId,
        otherUser: {
          id: booking.provider.id,
          firstName: booking.provider.firstName,
          lastName: booking.provider.lastName,
          avatarUrl: booking.provider.avatarUrl,
        },
      });
    }
  }, [booking, bookingId, navigation]);

  const handleReport = useCallback(() => {
    if (booking?.seeker) {
      navigation.navigate('Report', {
        bookingId,
        reportedUser: booking.seeker,
      });
    }
  }, [booking, bookingId, navigation]);

  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  const formatDateTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return {
    booking,
    isLoading,
    latitude,
    longitude,
    formatDateTime,
    handleGoBack,
    handleViewRequestDetails,
    handleViewChatLogs,
    handleReport,
  };
}

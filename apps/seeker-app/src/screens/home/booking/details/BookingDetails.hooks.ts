import { Alert } from 'react-native';
import { BookingStackParamList } from '@navigation/BookingStack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

type BookingDetailsRouteProp = RouteProp<BookingStackParamList, 'BookingDetails'>;

interface BookingData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  serviceId: string;
  provider: {
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
}

export function useBookingDetails() {
  const route = useRoute<BookingDetailsRouteProp>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooking = useCallback(async () => {
    try {
      const response = await seekerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
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

  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    booking,
    isLoading,
    latitude,
    longitude,
    formatDateTime,
  };
}

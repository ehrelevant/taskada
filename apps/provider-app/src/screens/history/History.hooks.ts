import { HistoryStackParamList } from '@navigation/HistoryStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { palette } from '@repo/theme';
import { providerClient } from '@lib/providerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

type HistoryNavigationProp = NativeStackNavigationProp<HistoryStackParamList>;

export interface BookingHistoryItem {
  id: string;
  status: 'completed' | 'cancelled';
  cost: number;
  createdAt: string;
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
}

export function useHistory() {
  const navigation = useNavigation<HistoryNavigationProp>();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookingHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await providerClient.apiFetch('/bookings/provider/history', 'GET');

      if (!response.ok) {
        throw new Error('Failed to load booking history');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load booking history:', err);
      setError('Failed to load booking history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookingHistory();
  }, [loadBookingHistory]);

  const formatDateTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getStatusColor = useCallback((status: string) => {
    return status === 'completed' ? palette.success : palette.error;
  }, []);

  const handleViewDetails = useCallback(
    (bookingId: string) => {
      navigation.navigate('BookingDetails', { bookingId });
    },
    [navigation],
  );

  return {
    bookings,
    isLoading,
    error,
    formatDateTime,
    getStatusColor,
    handleViewDetails,
    loadBookingHistory,
  };
}

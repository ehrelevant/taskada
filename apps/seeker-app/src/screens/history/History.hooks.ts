import { HistoryStackParamList } from '@navigation/HistoryStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

interface BookingHistoryItem {
  id: string;
  status: 'completed' | 'cancelled';
  cost: number;
  createdAt: string;
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

type TransactionHistoryNavigationProp = NativeStackNavigationProp<HistoryStackParamList>;

export function useHistory() {
  const navigation = useNavigation<TransactionHistoryNavigationProp>();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookingHistory();
  }, []);

  const loadBookingHistory = async () => {
    try {
      setIsLoading(true);
      const response = await seekerClient.apiFetch('/bookings/history', 'GET');

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
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'palette.success' : 'palette.error';
  };

  const handleViewDetails = useCallback(
    (bookingId: string) => {
      navigation.navigate('TransactionDetails', { bookingId });
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
  };
}

import { BookingStackParamList } from '@navigation/BookingStack';
import { HistoryStackParamList } from '@navigation/HistoryStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type RequestDetailsRouteProp = RouteProp<HistoryStackParamList & BookingStackParamList, 'RequestLogs'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<HistoryStackParamList & BookingStackParamList, 'RequestLogs'>;

interface RequestDetailsData {
  id: string;
  serviceTypeId: string;
  serviceTypeName: string;
  serviceTypeIcon: string | null;
  description: string | null;
  createdAt: string;
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
  images: string[];
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    phoneNumber: string;
  } | null;
}

export function useRequestLogs() {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [request, setRequest] = useState<RequestDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequestDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await seekerClient.apiFetch(`/bookings/${bookingId}/request-details`, 'GET');

      if (!response.ok) {
        throw new Error('Failed to load request details');
      }

      const data = await response.json();
      setRequest(data);
    } catch (err) {
      console.error('Failed to load request details:', err);
      setError('Failed to load request details');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadRequestDetails();
  }, [loadRequestDetails]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    request,
    isLoading,
    error,
    handleGoBack,
    loadRequestDetails,
  };
}

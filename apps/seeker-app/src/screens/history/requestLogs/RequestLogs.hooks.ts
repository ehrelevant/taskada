import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type RequestDetailsRouteProp = RouteProp<TransactionHistoryStackParamList, 'RequestDetailsSummary'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<
  TransactionHistoryStackParamList,
  'RequestDetailsSummary'
>;

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

export function useRequestLogsScreen() {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [request, setRequest] = useState<RequestDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequestDetails();
  }, [bookingId]);

  const loadRequestDetails = async () => {
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
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    request,
    isLoading,
    error,
    handleGoBack,
  };
}

import { HistoryStackParamList } from '@navigation/HistoryStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type RequestDetailsRouteProp = RouteProp<HistoryStackParamList, 'RequestDetailsSummary'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<
  HistoryStackParamList,
  'RequestDetailsSummary'
>;

export interface RequestDetailsData {
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

interface UseRequestLogsReturn {
  request: RequestDetailsData | null;
  isLoading: boolean;
  error: string | null;
  handleGoBack: () => void;
  loadRequestDetails: () => Promise<void>;
}

export function useRequestLogs(): UseRequestLogsReturn {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [request, setRequest] = useState<RequestDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequestDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/request-details`, 'GET');

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

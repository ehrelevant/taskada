import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Review, ServiceDetails } from '@repo/types';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type ServiceDetailsRouteProp = RouteProp<
  { ServiceDetails: { serviceId: string; returnTo?: 'RequestForm' } },
  'ServiceDetails'
>;

export function useServiceDetailsScreen() {
  const route = useRoute<ServiceDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { serviceId, returnTo } = route.params;

  const [details, setDetails] = useState<ServiceDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [detailsData, reviewsData] = await Promise.all([
          seekerClient.getServiceDetails(serviceId),
          seekerClient.getServiceReviews(serviceId),
        ]);
        setDetails(detailsData);
        setReviews(reviewsData);
      } catch {
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [serviceId]);

  useEffect(() => {
    if (returnTo === 'RequestForm' && details) {
      navigation.setOptions({
        headerRight: () => null,
      });
    }
  }, [returnTo, details, navigation]);

  const handleRequestService = useCallback(() => {
    if (details) {
      navigation.navigate('RequestForm', {
        serviceTypeId: details.serviceTypeId,
        serviceId,
      });
    }
  }, [details, navigation, serviceId]);

  return {
    details,
    reviews,
    loading,
    error,
    returnTo,
    handleRequestService,
  };
}

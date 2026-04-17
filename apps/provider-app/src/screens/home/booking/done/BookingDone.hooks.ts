import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
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
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  } | null;
}

export function useBookingDone() {
  const route = useRoute<BookingDoneRouteProp>();
  const navigation = useNavigation<BookingDoneNavigationProp>();
  const { bookingId } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [serviceTypeName, setServiceTypeName] = useState('Service');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookingDetails = useCallback(async () => {
    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data);

        let resolvedServiceTypeName = data.serviceType?.name ?? data.service?.serviceType?.name;
        if ((!resolvedServiceTypeName || resolvedServiceTypeName.trim().length === 0) && data.serviceId) {
          const serviceResponse = await providerClient.apiFetch(`/services/${data.serviceId}`, 'GET');
          if (serviceResponse.ok) {
            const serviceData = await serviceResponse.json();
            resolvedServiceTypeName = serviceData.serviceTypeName;
          }
        }

        if (typeof resolvedServiceTypeName === 'string' && resolvedServiceTypeName.trim().length > 0) {
          setServiceTypeName(resolvedServiceTypeName);
        }
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

  const navigateToRequestsList = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('RequestsStack', {
      screen: 'RequestList',
    });
  }, [navigation]);

  const navigateToHistoryRoot = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('HistoryStack', {
      screen: 'History',
    });
  }, [navigation]);

  const handleReturn = useCallback(() => {
    navigateToRequestsList();
  }, [navigateToRequestsList]);

  const handleViewHistory = useCallback(() => {
    navigateToHistoryRoot();
  }, [navigateToHistoryRoot]);

  const handleViewDetails = useCallback(() => {
    navigation.navigate('BookingDetails', {
      bookingId,
    });
  }, [bookingId, navigation]);

  return {
    bookingDetails,
    serviceTypeName,
    isLoading,
    handleReturn,
    handleViewHistory,
    handleViewDetails,
  };
}

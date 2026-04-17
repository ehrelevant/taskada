import { Alert, BackHandler } from 'react-native';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type BookingServingRouteProp = RouteProp<BookingStackParamList, 'BookingServing'>;
type BookingServingNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingServing'>;

interface BookingDetails {
  id: string;
  serviceId: string;
  status: string;
  cost: number;
  specifications: string | null;
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
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  } | null;
  service: {
    id: string;
    serviceType: {
      id: string;
      name: string;
      iconUrl: string | null;
    } | null;
  } | null;
}

export function useBookingServing() {
  const route = useRoute<BookingServingRouteProp>();
  const navigation = useNavigation<BookingServingNavigationProp>();
  const { bookingId, otherUser } = route.params;

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [serviceTypeName, setServiceTypeName] = useState('Service');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const navigateToRequestsList = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('RequestsStack', {
      screen: 'RequestList',
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        navigateToRequestsList();
        return true;
      });

      return () => {
        subscription.remove();
      };
    }, [navigateToRequestsList]),
  );

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
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handlePaidPress = useCallback(async () => {
    if (isUpdatingStatus) return;

    setIsUpdatingStatus(true);

    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'PATCH', {
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setIsPaid(true);

      providerClient.notifyBookingCompleted(bookingId);

      navigation.replace('BookingDone', {
        bookingId,
        otherUser: bookingDetails?.seeker ?? otherUser,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [bookingDetails?.seeker, bookingId, isUpdatingStatus, navigation, otherUser]);

  return {
    bookingDetails,
    serviceTypeName,
    isLoading,
    isPaid,
    isUpdatingStatus,
    handlePaidPress,
  };
}

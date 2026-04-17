import * as Location from 'expo-location';
import { Alert, BackHandler } from 'react-native';
import { authClient } from '@lib/authClient';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type BookingTransitRouteProp = RouteProp<BookingStackParamList, 'BookingTransit'>;
type BookingTransitNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingTransit'>;

type SeekerUser = BookingStackParamList['BookingTransit']['otherUser'];

export function useBookingTransit() {
  const route = useRoute<BookingTransitRouteProp>();
  const navigation = useNavigation<BookingTransitNavigationProp>();
  const { bookingId, seekerLocation, address, otherUser } = route.params;

  const [providerLocation, setProviderLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isArriving, setIsArriving] = useState(false);
  const [seekerUser, setSeekerUser] = useState<SeekerUser | null>(null);
  const [serviceTypeName, setServiceTypeName] = useState<string>('Service');

  const [seekerLongitude, seekerLatitude] = seekerLocation.coordinates;

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

  useEffect(() => {
    const fetchSeekerInfo = async () => {
      try {
        const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          if (data.seeker) {
            setSeekerUser(data.seeker);
          }

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
        }
      } catch (error) {
        console.error('Failed to fetch seeker info:', error);
      }
    };
    fetchSeekerInfo();
  }, [bookingId]);

  const getCurrentLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    setProviderLocation(currentLocation.coords);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const setupSocket = async () => {
      const session = await authClient.getSession();
      const userId = session.data?.user?.id;
      if (!userId || !bookingId) return;

      await providerClient.connectChat(authClient.getCookie(), userId, 'provider');
      providerClient.joinBooking(bookingId);
    };

    setupSocket();

    return () => {
      if (bookingId) {
        providerClient.leaveBooking(bookingId);
        providerClient.removeAllListeners();
        providerClient.disconnectChat();
      }
    };
  }, [bookingId]);

  const handleArrived = useCallback(async () => {
    if (isArriving) return;

    setIsArriving(true);

    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}`, 'PATCH', {
        body: JSON.stringify({ status: 'serving' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      providerClient.notifyArrival(bookingId);

      navigation.replace('BookingServing', {
        bookingId,
        otherUser: seekerUser ?? otherUser,
      });
    } catch (error) {
      console.error('Error handling arrival:', error);
      Alert.alert('Error', 'Failed to confirm arrival. Please try again.');
    } finally {
      setIsArriving(false);
    }
  }, [bookingId, isArriving, navigation, otherUser, seekerUser]);

  const getInitialRegion = useCallback(() => {
    if (providerLocation) {
      const midLatitude = (providerLocation.latitude + seekerLatitude) / 2;
      const midLongitude = (providerLocation.longitude + seekerLongitude) / 2;
      const latitudeDelta = Math.abs(providerLocation.latitude - seekerLatitude) * 1.5 + 0.01;
      const longitudeDelta = Math.abs(providerLocation.longitude - seekerLongitude) * 1.5 + 0.01;

      return {
        latitude: midLatitude,
        longitude: midLongitude,
        latitudeDelta: Math.max(latitudeDelta, 0.02),
        longitudeDelta: Math.max(longitudeDelta, 0.02),
      };
    }

    return {
      latitude: seekerLatitude,
      longitude: seekerLongitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [providerLocation, seekerLatitude, seekerLongitude]);

  return {
    providerLocation,
    isArriving,
    seekerLatitude,
    seekerLongitude,
    address,
    serviceTypeName,
    seekerUser,
    getInitialRegion,
    handleArrived,
  };
}

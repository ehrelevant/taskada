import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { authClient } from '@lib/authClient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type BookingTransitRouteProp = RouteProp<RequestsStackParamList, 'BookingTransit'>;
type BookingTransitNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'BookingTransit'>;

interface UseBookingTransitReturn {
  providerLocation: Location.LocationObjectCoords | null;
  locationError: string | null;
  isArriving: boolean;
  seekerLatitude: number;
  seekerLongitude: number;
  address: { label: string | null; coordinates: [number, number] } | undefined;
  getInitialRegion: () => {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  handleArrived: () => Promise<void>;
}

export function useBookingTransit(): UseBookingTransitReturn {
  const route = useRoute<BookingTransitRouteProp>();
  const navigation = useNavigation<BookingTransitNavigationProp>();
  const { bookingId, seekerLocation, address } = route.params;

  const [providerLocation, setProviderLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isArriving, setIsArriving] = useState(false);

  const [seekerLongitude, seekerLatitude] = seekerLocation.coordinates;

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setProviderLocation(currentLocation.coords);
    } catch {
      setLocationError('Failed to get location');
    }
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
      });
    } catch (error) {
      console.error('Error handling arrival:', error);
      Alert.alert('Error', 'Failed to confirm arrival. Please try again.');
    } finally {
      setIsArriving(false);
    }
  }, [bookingId, isArriving, navigation]);

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
    locationError,
    isArriving,
    seekerLatitude,
    seekerLongitude,
    address,
    getInitialRegion,
    handleArrived,
  };
}

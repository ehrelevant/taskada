import { authClient } from '@lib/authClient';
import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type BookingTransitRouteProp = RouteProp<HomeStackParamList, 'BookingTransit'>;
type BookingTransitNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BookingTransit'>;

export function useBookingTransit() {
  const route = useRoute<BookingTransitRouteProp>();
  const navigation = useNavigation<BookingTransitNavigationProp>();
  const { providerInfo, proposal, bookingId } = route.params;

  const { cost, specifications, serviceTypeName } = proposal;

  const providerName = `${providerInfo.firstName} ${providerInfo.lastName}`;
  const [hasProviderArrived, setHasProviderArrived] = useState(false);

  useEffect(() => {
    const setupSocket = async () => {
      const session = await authClient.getSession();
      const userId = session.data?.user?.id;
      if (!userId || !bookingId) return;

      await seekerClient.connectChat(authClient.getCookie(), userId, 'seeker');
      seekerClient.joinBooking(bookingId);

      seekerClient.onProviderArrived(data => {
        if (data.bookingId === bookingId) {
          setHasProviderArrived(true);
        }
      });

      seekerClient.onBookingCompleted(data => {
        if (data.bookingId === bookingId) {
          navigation.replace('BookingComplete', {
            bookingId,
            providerInfo,
            serviceTypeName,
            cost,
          });
        }
      });
    };

    setupSocket();

    return () => {
      if (bookingId) {
        seekerClient.leaveBooking(bookingId);
        seekerClient.removeAllListeners();
        seekerClient.disconnectChat();
      }
    };
  }, [bookingId, cost, navigation, providerInfo, serviceTypeName]);

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: providerInfo,
    });
  }, [bookingId, navigation, providerInfo]);

  return {
    providerName,
    providerInfo,
    serviceTypeName,
    cost,
    specifications,
    hasProviderArrived,
    handleReport,
  };
}

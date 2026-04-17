import { authClient } from '@lib/authClient';
import { BackHandler } from 'react-native';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

type BookingServingRouteProp = RouteProp<BookingStackParamList, 'BookingServing'>;
type BookingServingNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingServing'>;

export function useBookingServing() {
  const route = useRoute<BookingServingRouteProp>();
  const navigation = useNavigation<BookingServingNavigationProp>();
  const { otherUser, proposal, bookingId, requestId } = route.params;

  const { cost, specifications, serviceTypeName } = proposal;
  const providerName = `${otherUser.firstName} ${otherUser.lastName}`;

  const navigateToHome = useCallback(() => {
    const tabsNavigation = navigation.getParent<BottomTabNavigationProp<DashboardTabsParamList>>();
    tabsNavigation?.navigate('HomeStack', {
      screen: 'Home',
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        navigateToHome();
        return true;
      });

      return () => {
        subscription.remove();
      };
    }, [navigateToHome]),
  );

  useEffect(() => {
    const setupSocket = async () => {
      const session = await authClient.getSession();
      const userId = session.data?.user?.id;
      if (!userId || !bookingId) return;

      await seekerClient.connectChat(authClient.getCookie(), userId, 'seeker');
      seekerClient.joinBooking(bookingId);

      seekerClient.onBookingCompleted(data => {
        if (data.bookingId === bookingId) {
          navigation.replace('BookingDone', {
            bookingId,
            otherUser,
            serviceTypeName,
            cost,
            requestId,
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
  }, [bookingId, cost, navigation, otherUser, requestId, serviceTypeName]);

  return {
    providerName,
    otherUser,
    serviceTypeName,
    cost,
    specifications,
  };
}

import { BackHandler } from 'react-native';
import { BookingStackParamList } from '@navigation/BookingStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabsParamList } from '@navigation/DashboardTabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

type ViewProposalRouteProp = RouteProp<BookingStackParamList, 'BookingProposal'>;
type ViewProposalNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingProposal'>;

export function useBookingProposal() {
  const route = useRoute<ViewProposalRouteProp>();
  const navigation = useNavigation<ViewProposalNavigationProp>();
  const { bookingId, otherUser, proposal, requestId } = route.params;

  const { cost, specifications, serviceTypeName, address } = proposal;

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

  const handleAccept = useCallback(() => {
    seekerClient.acceptProposal(bookingId);
    navigation.replace('BookingTransit', {
      bookingId,
      otherUser,
      proposal,
      requestId,
    });
  }, [bookingId, navigation, proposal, otherUser, requestId]);

  const handleDecline = useCallback(() => {
    seekerClient.declineProposal(bookingId);
    navigateToHome();
  }, [bookingId, navigateToHome]);

  const coordinates = address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  return {
    cost,
    specifications,
    serviceTypeName,
    address,
    longitude,
    latitude,
    handleAccept,
    handleDecline,
  };
}

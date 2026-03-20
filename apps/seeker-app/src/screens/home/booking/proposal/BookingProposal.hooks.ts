import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type ViewProposalRouteProp = RouteProp<HomeStackParamList, 'ViewProposal'>;
type ViewProposalNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ViewProposal'>;

export function useBookingProposal() {
  const route = useRoute<ViewProposalRouteProp>();
  const navigation = useNavigation<ViewProposalNavigationProp>();
  const { bookingId, providerInfo, proposal, requestId } = route.params;

  const { cost, specifications, serviceTypeName, address } = proposal;

  const handleAccept = useCallback(() => {
    seekerClient.acceptProposal(bookingId);
    navigation.replace('BookingTransit', {
      bookingId,
      providerInfo,
      proposal,
    });
  }, [bookingId, navigation, proposal, providerInfo]);

  const handleDecline = useCallback(() => {
    seekerClient.declineProposal(bookingId);
    navigation.navigate('Chat', {
      bookingId,
      providerInfo,
      requestId,
    });
  }, [bookingId, navigation, providerInfo, requestId]);

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

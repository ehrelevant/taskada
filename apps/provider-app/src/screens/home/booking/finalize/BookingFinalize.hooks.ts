import { Alert } from 'react-native';
import { authClient } from '@lib/authClient';
import { BookingStackParamList } from '@navigation/BookingStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

type FinalizeDetailsRouteProp = RouteProp<BookingStackParamList, 'BookingFinalize'>;
type FinalizeDetailsNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingFinalize'>;

export function useBookingFinalize() {
  const route = useRoute<FinalizeDetailsRouteProp>();
  const navigation = useNavigation<FinalizeDetailsNavigationProp>();
  const { bookingId, seekerLocation, otherUser, requestId } = route.params;

  const [serviceCost, setServiceCost] = useState('');
  const [serviceSpecifications, setServiceSpecifications] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);

  const [longitude, latitude] = seekerLocation.coordinates;

  useEffect(() => {
    if (!showWaitingModal) return;

    const setupSocket = async () => {
      const session = await authClient.getSession();
      const userId = session.data?.user?.id;
      if (!userId) return;

      await providerClient.connectChat(authClient.getCookie(), userId, 'provider');
      providerClient.joinBooking(bookingId);

      providerClient.onProposalDeclined(data => {
        if (data.bookingId === bookingId) {
          setShowWaitingModal(false);
          Alert.alert(
            'Proposal Declined',
            'The seeker has declined your service proposal. You can discuss further in chat.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.replace('BookingChat', {
                    bookingId,
                    otherUser,
                    requestId,
                    address: seekerLocation,
                  });
                },
              },
            ],
          );
        }
      });

      providerClient.onProposalAccepted(data => {
        if (data.bookingId === bookingId) {
          setShowWaitingModal(false);
          navigation.replace('BookingTransit', {
            bookingId,
            seekerLocation: data.seekerLocation,
            address: seekerLocation,
          });
        }
      });
    };

    setupSocket();

    return () => {
      providerClient.leaveBooking(bookingId);
      providerClient.removeAllListeners();
      providerClient.disconnectChat();
    };
  }, [showWaitingModal, bookingId, otherUser, requestId, seekerLocation, navigation]);

  const handleSubmit = useCallback(async () => {
    if (!serviceCost.trim() || !serviceSpecifications.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/proposal`, 'PATCH', {
        body: JSON.stringify({
          cost: parseFloat(serviceCost),
          specifications: serviceSpecifications,
        }),
      });

      if (response.ok) {
        setShowWaitingModal(true);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to submit proposal:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          bookingId,
          cost: parseFloat(serviceCost),
        });
      }
    } catch (error) {
      console.error('Error submitting proposal:', {
        error,
        bookingId,
        cost: parseFloat(serviceCost),
        specifications: serviceSpecifications,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingId, serviceCost, serviceSpecifications]);

  const formatCurrency = useCallback((value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    return numericValue;
  }, []);

  const handleCostChange = useCallback(
    (text: string) => {
      const formatted = formatCurrency(text);
      setServiceCost(formatted);
    },
    [formatCurrency],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: otherUser,
    });
  }, [bookingId, navigation, otherUser]);

  return {
    serviceCost,
    setServiceCost,
    serviceSpecifications,
    setServiceSpecifications,
    isSubmitting,
    showWaitingModal,
    latitude,
    longitude,
    seekerLocation,
    handleSubmit,
    handleCostChange,
    handleGoBack,
    handleReport,
  };
}

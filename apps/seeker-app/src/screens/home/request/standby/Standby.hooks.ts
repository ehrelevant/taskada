import { Alert } from 'react-native';
import { authClient } from '@lib/authClient';
import { BookingStackParamList } from '@navigation/BookingStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type StandbyRouteProp = RouteProp<BookingStackParamList, 'Standby'>;
type StandbyNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'Standby'>;

export function useStandby() {
  const route = useRoute<StandbyRouteProp>();
  const navigation = useNavigation<StandbyNavigationProp>();
  const { requestId } = route.params;

  const [isConnecting, setIsConnecting] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupSocket = async () => {
      try {
        const session = await authClient.getSession();

        if (!session.data?.user?.id) {
          setError('User not authenticated');
          return;
        }

        const userId = session.data.user.id;

        await seekerClient.connectMatching(authClient.getCookie(), userId, 'seeker');
        await seekerClient.watchRequest(requestId);

        if (isMounted) {
          setIsConnecting(false);
        }

        const handleRequestCancelled = (data: { requestId: string }) => {
          if (data.requestId === requestId) {
            Alert.alert('Request Cancelled', 'Your request has been cancelled.', [
              { text: 'OK', onPress: () => navigation.getParent()?.goBack() },
            ]);
          }
        };

        const handleRequestSettling = (data: {
          requestId: string;
          bookingId: string;
          provider: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
        }) => {
          if (data.requestId === requestId) {
            navigation.replace('Chat', {
              bookingId: data.bookingId,
              providerInfo: {
                id: data.provider.id,
                firstName: data.provider.firstName,
                lastName: data.provider.lastName,
                avatarUrl: data.provider.avatarUrl,
              },
              requestId,
            });
          }
        };

        const handleMatchingError = (err: { message: string }) => {
          console.error('Socket error:', err);
          setError(err.message);
        };

        seekerClient.onRequestCancelled(handleRequestCancelled);
        seekerClient.onRequestSettling(handleRequestSettling);
        seekerClient.onMatchingError(handleMatchingError);

        return () => {
          seekerClient.offRequestCancelled(handleRequestCancelled);
          seekerClient.offRequestSettling(handleRequestSettling);
          seekerClient.offMatchingError(handleMatchingError);
        };
      } catch (err) {
        console.error('Failed to setup socket:', err);
        if (isMounted) {
          setError('Failed to connect to server');
          setIsConnecting(false);
        }
      }
    };

    let unregisterHandlers: (() => void) | undefined;
    setupSocket().then(cleanup => {
      unregisterHandlers = cleanup;
    });

    return () => {
      isMounted = false;
      unregisterHandlers?.();
      seekerClient.unwatchRequest(requestId);
    };
  }, [requestId, navigation]);

  const handleCancelRequest = useCallback(async () => {
    Alert.alert('Cancel Request', 'Are you sure you want to cancel this request?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          setIsCancelling(true);
          try {
            if (seekerClient.isMatchingConnected()) {
              await seekerClient.cancelRequest(requestId);
            } else {
              await seekerClient.apiFetch(`/requests/${requestId}`, 'DELETE');
            }

            Alert.alert('Cancelled', 'Your request has been cancelled.', [
              { text: 'OK', onPress: () => navigation.getParent()?.goBack() },
            ]);
          } catch (err) {
            console.error('Failed to cancel request:', err);
            Alert.alert('Error', 'Failed to cancel request. Please try again.');
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  }, [navigation, requestId]);

  return {
    isConnecting,
    isCancelling,
    error,
    handleCancelRequest,
  };
}

import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { HomeStackParamList } from '@navigation/HomeStack';
import { matchingSocket } from '@lib/websocket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

type StandbyRouteProp = RouteProp<HomeStackParamList, 'Standby'>;
type StandbyNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Standby'>;

export function StandbyScreen() {
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

        // Connect to WebSocket
        await matchingSocket.connect(userId, 'seeker');

        // Start watching the request
        await matchingSocket.watchRequest(requestId);

        if (isMounted) {
          setIsConnecting(false);
        }

        // Set up event listeners
        matchingSocket.onRequestCancelled(data => {
          if (data.requestId === requestId) {
            Alert.alert('Request Cancelled', 'Your request has been cancelled.');
            navigation.navigate('Home');
          }
        });

        matchingSocket.onRequestSettling(data => {
          if (data.requestId === requestId) {
            // Navigate to chat screen immediately when provider creates booking
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
        });

        matchingSocket.onError(err => {
          console.error('Socket error:', err);
          setError(err.message);
        });
      } catch (err) {
        console.error('Failed to setup socket:', err);
        if (isMounted) {
          setError('Failed to connect to server');
          setIsConnecting(false);
        }
      }
    };

    /*
    // NOTE: Old implementation, commented in case it is still needed.
    // Possibly use this as a fallback if WebSocket connection fails?
    // Poll for request status changes
    const checkRequestStatus = async () => {
      try {
        const response = await apiFetch(`/requests/${requestId}`, 'GET');
        if (response.ok) {
          const request = await response.json();
          if (request.status === 'settling') {
            // Request is being settled, fetch booking info
            const bookingsResponse = await apiFetch(`/bookings?requestId=${requestId}`, 'GET');
            if (bookingsResponse.ok) {
              const bookings = await bookingsResponse.json();
              if (bookings.length > 0) {
                const booking = bookings[0];
                // Navigate to chat
                navigation.navigate('Chat', {
                  bookingId: booking.id,
                  providerInfo: {
                    id: booking.provider.id,
                    firstName: booking.provider.firstName,
                    lastName: booking.provider.lastName,
                    avatarUrl: booking.provider.avatarUrl,
                  },
                  requestId,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to check request status:', err);
      }
    };

    // Start polling every 5 seconds
    statusCheckInterval = setInterval(checkRequestStatus, 5000);
    */

    setupSocket();

    return () => {
      isMounted = false;
      matchingSocket.unwatchRequest(requestId);
      // Don't disconnect here, let other screens handle lifecycle
    };
  }, [requestId, navigation]);

  const handleCancelRequest = async () => {
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
            // Try WebSocket first
            if (matchingSocket.isConnected()) {
              await matchingSocket.cancelRequest(requestId);
            } else {
              // Fallback to REST API
              await apiFetch(`/requests/${requestId}`, 'DELETE');
            }

            Alert.alert('Cancelled', 'Your request has been cancelled.');
            navigation.navigate('Home');
          } catch (err) {
            console.error('Failed to cancel request:', err);
            Alert.alert('Error', 'Failed to cancel request. Please try again.');
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  };

  if (isConnecting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
        <Typography variant="body1" style={styles.connectingText}>
          Connecting to service providers...
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Typography variant="h5" color="error" style={styles.errorText}>
          Error
        </Typography>
        <Typography variant="body1" color="textSecondary" style={styles.errorMessage}>
          {error}
        </Typography>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.button} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h4">Reaching out to service providers.</Typography>
        <Typography variant="h4">This may take awhile.</Typography>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title={isCancelling ? 'Cancelling...' : 'Cancel Request'}
          variant="outline"
          onPress={handleCancelRequest}
          isLoading={isCancelling}
          disabled={isCancelling}
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  spinnerContainer: {
    marginVertical: spacing.xl,
  },
  serviceInfo: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  addressContainer: {
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
  },
  addressText: {
    marginTop: spacing.xs,
  },
  cancelButton: {
    marginTop: spacing.s,
  },
  connectingText: {
    marginTop: spacing.m,
    color: colors.textSecondary,
  },
  errorText: {
    marginBottom: spacing.m,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  button: {
    marginTop: spacing.m,
  },
});

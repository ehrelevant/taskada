import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { FlatList, StyleSheet, View } from 'react-native';
import { matchingSocket } from '@lib/websocket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider } from '@repo/database';
import { RequestListing } from '@lib/components/RequestListing';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

interface IncomingRequest {
  id: string;
  serviceType: {
    name: string;
    iconUrl: string | null;
  };
  address: {
    label: string | null;
    coordinates: [number, number];
  };
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    phoneNumber: string;
  };
  description: string | null;
  images: string[];
  createdAt: string;
}

type RequestsNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'RequestList'>;

export function RequestListScreen() {
  const navigation = useNavigation<RequestsNavigationProp>();
  const [isAccepting, setIsAccepting] = useState(false);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load initial provider state
  useEffect(() => {
    let isMounted = true;

    const loadProviderState = async () => {
      try {
        const response = await apiFetch(`/providers`, 'GET');
        const providerData: Provider = await response.json();

        if (isMounted) {
          setIsAccepting(providerData.isAccepting);

          // If already accepting, connect WebSocket
          if (providerData.isAccepting) {
            connectWebSocket();
          }
        }
      } catch (error) {
        console.error('Failed to load provider state:', error);
      }
    };

    loadProviderState();

    return () => {
      isMounted = false;
      matchingSocket.disconnect();
    };
  }, []);

  const connectWebSocket = async () => {
    setIsConnecting(true);
    try {
      const session = await authClient.getSession();

      if (!session.data?.user?.id) {
        console.error('User not authenticated');
        return;
      }

      const userId = session.data.user.id;

      // Connect to WebSocket
      await matchingSocket.connect(userId, 'provider');

      // Get provider's enabled services to join rooms
      const servicesResponse = await apiFetch('/services/my-services', 'GET');
      const services = await servicesResponse.json();

      type ServiceWithType = {
        id: string;
        isEnabled: boolean;
        serviceType: { id: string };
      };

      const enabledServices = (services as ServiceWithType[]).filter(s => s.isEnabled);

      // Extract unique service type IDs and service IDs from enabled services
      const serviceTypeIds: string[] = [...new Set(enabledServices.map(s => s.serviceType.id))];
      const serviceIds: string[] = enabledServices.map(s => s.id);

      console.log('Service Type IDs:', serviceTypeIds);
      console.log('Service IDs:', serviceIds);

      if (serviceTypeIds.length > 0) {
        await matchingSocket.joinProviderRooms(serviceTypeIds);
      }

      // Fetch existing pending requests before setting up listeners
      if (serviceTypeIds.length > 0 || serviceIds.length > 0) {
        const pendingResponse = await apiFetch(
          `/requests/pending?serviceTypeIds=${serviceTypeIds.join(',')}&serviceIds=${serviceIds.join(',')}`,
          'GET',
        );

        if (pendingResponse.ok) {
          const pendingRequests = (await pendingResponse.json()) as IncomingRequest[];
          console.log('Fetched pending requests:', pendingRequests.length);
          setRequests(pendingRequests);
        }
      }

      // Set up event listeners
      matchingSocket.onNewRequest((request: unknown) => {
        const typedRequest = request as IncomingRequest;
        setRequests(prev => {
          // Check if request already exists
          if (prev.find(r => r.id === typedRequest.id)) {
            return prev;
          }
          return [typedRequest, ...prev];
        });
      });

      matchingSocket.onRequestRemoved((data: { requestId: string }) => {
        setRequests(prev => prev.filter(r => r.id !== data.requestId));
      });

      matchingSocket.onError(error => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWebSocket = async () => {
    try {
      // Get provider's services to leave rooms
      const servicesResponse = await apiFetch('/services/my-services', 'GET');
      const services = await servicesResponse.json();

      const serviceTypeIds: string[] = [
        ...new Set((services as { serviceType: { id: string } }[]).map(s => s.serviceType.id)),
      ];

      if (serviceTypeIds.length > 0) {
        await matchingSocket.leaveProviderRooms(serviceTypeIds);
      }

      matchingSocket.disconnect();
    } catch (error) {
      console.error('Failed to disconnect WebSocket:', error);
    }
  };

  const enableRequests = async () => {
    try {
      const response = await apiFetch(`/providers/enable`, 'PUT');
      const { isAccepting: newIsAccepting }: Provider = await response.json();
      setIsAccepting(newIsAccepting);

      if (newIsAccepting) {
        await connectWebSocket();
      }
    } catch (error) {
      console.error('Failed to enable requests:', error);
    }
  };

  const disableRequests = async () => {
    try {
      const response = await apiFetch(`/providers/disable`, 'PUT');
      const { isAccepting: newIsAccepting }: Provider = await response.json();
      setIsAccepting(newIsAccepting);

      if (!newIsAccepting) {
        await disconnectWebSocket();
        setRequests([]);
      }
    } catch (error) {
      console.error('Failed to disable requests:', error);
    }
  };

  const handleViewDetails = (request: IncomingRequest) => {
    navigation.navigate('RequestDetails', { requestId: request.id });
  };

  if (isAccepting) {
    return (
      <View style={styles.screen}>
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.requestsListContainer}
          renderItem={({ item }) => (
            <RequestListing
              title={item.serviceType.name}
              address={item.address.label || 'Unknown address'}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body1" color="textSecondary" style={styles.emptyText}>
                No requests yet. Waiting for seekers...
              </Typography>
            </View>
          }
        />

        <View style={styles.bottomButtonContainer}>
          <Button
            title="Stop Receiving Requests"
            variant="outline"
            onPress={disableRequests}
            isLoading={isConnecting}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <View style={styles.textContainer}>
          <Typography variant="h4">To start receiving requests, press</Typography>
          <Typography variant="h4">&quot;Start Receiving Requests&quot;</Typography>
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button title="Start Receiving Requests" onPress={enableRequests} isLoading={isConnecting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: '100%',
    height: 100,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    borderTopColor: colors.border,
    borderTopWidth: 2,
    backgroundColor: colors.backgroundSecondary,
  },
  requestsListContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    textAlign: 'center',
  },
});

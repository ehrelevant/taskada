import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { BottomActionBar, Button, EmptyState, Header, ScreenContainer } from '@repo/components';
import { FlatList, View } from 'react-native';
import { matchingSocket } from '@lib/websocket';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider } from '@repo/database';
import { RequestListing } from '@lib/components/RequestListing';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { styles } from './RequestListScreen.styles';

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
      <ScreenContainer padding="none" useSafeArea={false} style={styles.container}>
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RequestListing
              title={item.serviceType.name}
              address={item.address.label || 'Unknown address'}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          ListEmptyComponent={<EmptyState message="No requests yet. Waiting for seekers..." />}
        />

        <BottomActionBar>
          <Button
            title="Stop Receiving Requests"
            variant="outline"
            onPress={disableRequests}
            isLoading={isConnecting}
          />
        </BottomActionBar>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none" useSafeArea={false} style={styles.centeredContainer}>
      <View style={styles.centeredContent}>
        <Header
          title="Ready to Work?"
          subtitle="Start receiving service requests from nearby seekers"
          align="center"
          size="large"
        />
      </View>

      <BottomActionBar>
        <Button title="Start Receiving Requests" onPress={enableRequests} isLoading={isConnecting} />
      </BottomActionBar>
    </ScreenContainer>
  );
}

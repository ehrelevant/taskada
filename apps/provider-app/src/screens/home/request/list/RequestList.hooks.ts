import { authClient } from '@lib/authClient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider } from '@repo/database';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export interface IncomingRequest {
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

export function useRequestList() {
  const navigation = useNavigation<RequestsNavigationProp>();
  const [isAccepting, setIsAccepting] = useState(false);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWebSocket = useCallback(async () => {
    setIsConnecting(true);
    try {
      const session = await authClient.getSession();

      if (!session.data?.user?.id) {
        console.error('User not authenticated');
        return;
      }

      const userId = session.data.user.id;

      await providerClient.connectMatching(authClient.getCookie(), userId, 'provider');

      const servicesResponse = await providerClient.apiFetch('/services/my-services', 'GET');
      const services = await servicesResponse.json();

      type ServiceWithType = {
        id: string;
        isEnabled: boolean;
        serviceType: { id: string };
      };

      const enabledServices = (services as ServiceWithType[]).filter(s => s.isEnabled);

      const serviceTypeIds: string[] = [...new Set(enabledServices.map(s => s.serviceType.id))];
      const serviceIds: string[] = enabledServices.map(s => s.id);

      console.log('Service Type IDs:', serviceTypeIds);
      console.log('Service IDs:', serviceIds);

      if (serviceTypeIds.length > 0) {
        await providerClient.joinProviderRooms(serviceTypeIds);
      }

      if (serviceTypeIds.length > 0 || serviceIds.length > 0) {
        const pendingResponse = await providerClient.apiFetch(
          `/requests/pending?serviceTypeIds=${serviceTypeIds.join(',')}&serviceIds=${serviceIds.join(',')}`,
          'GET',
        );

        if (pendingResponse.ok) {
          const pendingRequests = (await pendingResponse.json()) as IncomingRequest[];
          console.log('Fetched pending requests:', pendingRequests.length);
          setRequests(pendingRequests);
        }
      }

      providerClient.onNewRequest((request: unknown) => {
        const typedRequest = request as IncomingRequest;
        setRequests(prev => {
          if (prev.find(r => r.id === typedRequest.id)) {
            return prev;
          }
          return [typedRequest, ...prev];
        });
      });

      providerClient.onRequestRemoved((data: { requestId: string }) => {
        setRequests(prev => prev.filter(r => r.id !== data.requestId));
      });

      providerClient.onMatchingError(error => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWebSocket = useCallback(async () => {
    try {
      const servicesResponse = await providerClient.apiFetch('/services/my-services', 'GET');
      const services = await servicesResponse.json();

      const serviceTypeIds: string[] = [
        ...new Set((services as { serviceType: { id: string } }[]).map(s => s.serviceType.id)),
      ];

      if (serviceTypeIds.length > 0) {
        await providerClient.leaveProviderRooms(serviceTypeIds);
      }
      providerClient.disconnectMatching();
    } catch (error) {
      console.error('Failed to disconnect WebSocket:', error);
    }
  }, []);

  const enableRequests = useCallback(async () => {
    try {
      const response = await providerClient.apiFetch(`/providers/enable`, 'PUT');
      const { isAccepting: newIsAccepting }: Provider = await response.json();
      setIsAccepting(newIsAccepting);

      if (newIsAccepting) {
        await connectWebSocket();
      }
    } catch (error) {
      console.error('Failed to enable requests:', error);
    }
  }, [connectWebSocket]);

  const disableRequests = useCallback(async () => {
    try {
      const response = await providerClient.apiFetch(`/providers/disable`, 'PUT');
      const { isAccepting: newIsAccepting }: Provider = await response.json();
      setIsAccepting(newIsAccepting);

      if (!newIsAccepting) {
        await disconnectWebSocket();
        setRequests([]);
      }
    } catch (error) {
      console.error('Failed to disable requests:', error);
    }
  }, [disconnectWebSocket]);

  const handleViewDetails = useCallback(
    (request: IncomingRequest) => {
      navigation.navigate('RequestDetails', { requestId: request.id });
    },
    [navigation],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProviderState = async () => {
      try {
        const response = await providerClient.apiFetch(`/providers`, 'GET');
        const providerData: Provider = await response.json();

        if (isMounted) {
          setIsAccepting(providerData.isAccepting);

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
      providerClient.disconnectMatching();
    };
  }, [connectWebSocket]);

  return {
    isAccepting,
    requests,
    isConnecting,
    enableRequests,
    disableRequests,
    handleViewDetails,
  };
}

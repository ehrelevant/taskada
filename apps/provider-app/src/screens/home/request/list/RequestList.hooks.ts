import { AppState } from 'react-native';
import { authClient } from '@lib/authClient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Provider } from '@repo/database';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNewRequest = useCallback((request: unknown) => {
    const typedRequest = request as IncomingRequest;
    setRequests(prev => {
      if (prev.find(r => r.id === typedRequest.id)) {
        return prev;
      }
      return [typedRequest, ...prev];
    });
  }, []);

  const handleRequestRemoved = useCallback((data: { requestId: string }) => {
    setRequests(prev => prev.filter(r => r.id !== data.requestId));
  }, []);

  const handleMatchingError = useCallback((error: { message: string }) => {
    console.error('Socket error:', error);
  }, []);

  const fetchPendingRequests = useCallback(async () => {
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

    if (serviceTypeIds.length > 0) {
      await providerClient.joinProviderRooms(serviceTypeIds);
    }

    if (serviceTypeIds.length === 0 && serviceIds.length === 0) {
      setRequests([]);
      return;
    }

    const pendingResponse = await providerClient.apiFetch(
      `/requests/pending?serviceTypeIds=${serviceTypeIds.join(',')}&serviceIds=${serviceIds.join(',')}`,
      'GET',
    );

    if (!pendingResponse.ok) {
      return;
    }

    const pendingRequests = (await pendingResponse.json()) as IncomingRequest[];
    setRequests(pendingRequests);
  }, []);

  const connectWebSocket = useCallback(async () => {
    setIsConnecting(true);
    try {
      await fetchPendingRequests();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchPendingRequests]);

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
    providerClient.onNewRequest(handleNewRequest);
    providerClient.onRequestRemoved(handleRequestRemoved);
    providerClient.onMatchingError(handleMatchingError);

    return () => {
      providerClient.offNewRequest(handleNewRequest);
      providerClient.offRequestRemoved(handleRequestRemoved);
      providerClient.offMatchingError(handleMatchingError);
    };
  }, [handleMatchingError, handleNewRequest, handleRequestRemoved]);

  useEffect(() => {
    let isMounted = true;

    const loadProviderState = async () => {
      try {
        const response = await providerClient.apiFetch(`/providers`, 'GET');

        if (response.status === 404) {
          return;
        }

        if (!response.ok) {
          console.error('Failed to load provider state:', response.status);
          return;
        }

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
    };
  }, [connectWebSocket]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (!providerClient.isMatchingConnected()) {
        const session = await authClient.getSession();
        if (session.data?.user?.id) {
          await providerClient.connectMatching(authClient.getCookie(), session.data.user.id, 'provider');
        }
      }

      await fetchPendingRequests();
    } catch (error) {
      console.error('Failed to refresh requests:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPendingRequests]);

  useFocusEffect(
    useCallback(() => {
      if (!isAccepting) {
        return;
      }

      void handleRefresh();
    }, [handleRefresh, isAccepting]),
  );

  useEffect(() => {
    if (!isAccepting) {
      return;
    }

    const intervalId = setInterval(() => {
      void handleRefresh();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [handleRefresh, isAccepting]);

  useEffect(() => {
    if (!isAccepting) {
      return;
    }

    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        void handleRefresh();
      }
    });

    return () => appStateSubscription.remove();
  }, [handleRefresh, isAccepting]);

  return {
    isAccepting,
    requests,
    isConnecting,
    isRefreshing,
    enableRequests,
    disableRequests,
    handleRefresh,
    handleViewDetails,
  };
}

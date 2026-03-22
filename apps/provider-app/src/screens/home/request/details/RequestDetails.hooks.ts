import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

export interface RequestDetails {
  id: string;
  serviceId: string | null;
  serviceTypeId: string;
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    phoneNumber: string;
  };
  address: {
    label: string | null;
    coordinates: [number, number];
  };
  description: string | null;
  images: string[];
}

type RequestDetailsRouteProp = RouteProp<RequestsStackParamList, 'RequestDetails'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'RequestDetails'>;

export function useRequestDetails() {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { requestId } = route.params;

  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadRequestDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await providerClient.apiFetch(`/requests/${requestId}`, 'GET');

      if (!response.ok) {
        if (response.status === 404) {
          setError('This request no longer exists. It may have been cancelled by the seeker.');
        } else {
          throw new Error('Failed to load request details');
        }
        return;
      }

      const data = await response.json();
      console.log(data);
      setRequest(data);
    } catch (err) {
      console.error('Failed to load request details:', err);
      setError('Failed to load request details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSettleRequest = useCallback(async () => {
    if (!request) {
      return;
    }

    let serviceId: string;

    if (request.serviceId) {
      serviceId = request.serviceId;
    } else {
      try {
        const servicesResponse = await providerClient.apiFetch(
          `/services/my-services?serviceTypeId=${request.serviceTypeId}`,
          'GET',
        );
        if (!servicesResponse.ok) {
          throw new Error('Failed to load your services');
        }
        const services = await servicesResponse.json();
        if (services.length === 0) {
          setError('You do not have a service matching this request type');
          return;
        }
        serviceId = services[0].id;
      } catch (err) {
        console.error('Failed to get matching service:', err);
        setError('Failed to find matching service. Please try again.');
        return;
      }
    }

    setIsCreatingBooking(true);

    try {
      const bookingResponse = await providerClient.apiFetch('/bookings', 'POST', {
        body: JSON.stringify({
          requestId: request.id,
          serviceId: serviceId,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();

      const statusResponse = await providerClient.apiFetch(`/requests/${request.id}/status`, 'PATCH', {
        body: JSON.stringify({ status: 'settling' }),
      });

      if (!statusResponse.ok) {
        console.warn('Failed to update request status, but booking was created');
      }

      navigation.getParent()?.navigate('BookingFlow', {
        screen: 'Chat',
        params: {
          bookingId: booking.id,
          otherUser: {
            id: request.seeker.id,
            firstName: request.seeker.firstName,
            lastName: request.seeker.lastName,
            avatarUrl: request.seeker.avatarUrl,
          },
          requestId: request.id,
          address: request.address,
        },
      });
    } catch (err) {
      console.error('Failed to settle request:', err);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsCreatingBooking(false);
    }
  }, [request, navigation]);

  useEffect(() => {
    loadRequestDetails();
  }, [loadRequestDetails]);

  return {
    request,
    isLoading,
    error,
    isCreatingBooking,
    selectedImage,
    setSelectedImage,
    handleGoBack,
    handleSettleRequest,
  };
}

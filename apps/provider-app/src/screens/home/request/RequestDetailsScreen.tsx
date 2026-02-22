import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Avatar, Button, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

type RequestDetailsRouteProp = RouteProp<RequestsStackParamList, 'RequestDetails'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'RequestDetails'>;

interface RequestDetails {
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

export function RequestDetailsScreen() {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { requestId } = route.params;

  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  useEffect(() => {
    loadRequestDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const loadRequestDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(`/requests/${requestId}`, 'GET');

      if (!response.ok) {
        if (response.status === 404) {
          setError('This request no longer exists. It may have been cancelled by the seeker.');
        } else {
          throw new Error('Failed to load request details');
        }
        return;
      }

      const data = await response.json();
      setRequest(data);
    } catch (err) {
      console.error('Failed to load request details:', err);
      setError('Failed to load request details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSettleRequest = async () => {
    if (!request) {
      return;
    }

    // Determine which service to use
    let serviceId: string;

    if (request.serviceId) {
      // Request is for a specific service
      serviceId = request.serviceId;
    } else {
      // Request is for a service type - need to find provider's matching service
      // Since providers only have one service per type, fetch it
      try {
        const servicesResponse = await apiFetch(`/services/my-services?serviceTypeId=${request.serviceTypeId}`, 'GET');
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
      // 1. Create booking
      const bookingResponse = await apiFetch('/bookings', 'POST', {
        body: JSON.stringify({
          requestId: request.id,
          serviceId: serviceId,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // 2. Update request status to 'settling'
      const statusResponse = await apiFetch(`/requests/${request.id}/status`, 'PATCH', {
        body: JSON.stringify({ status: 'settling' }),
      });

      if (!statusResponse.ok) {
        console.warn('Failed to update request status, but booking was created');
      }

      // 3. Navigate to chat screen
      navigation.replace('Chat', {
        bookingId: booking.id,
        otherUser: {
          id: request.seeker.id,
          firstName: request.seeker.firstName,
          lastName: request.seeker.lastName,
          avatarUrl: request.seeker.avatarUrl,
        },
        requestId: request.id,
        address: request.address,
      });
    } catch (err) {
      console.error('Failed to settle request:', err);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
        <Typography variant="body1" color="textSecondary" style={styles.loadingText}>
          Loading request details...
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="h5" color="error" style={styles.errorTitle}>
          Request Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" style={styles.errorMessage}>
          {error}
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} style={styles.button} />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body1" color="textSecondary">
          Request not found
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} style={styles.button} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Service Type Header */}
      <View style={styles.headerContainer}>
        <Typography variant="h1" style={styles.serviceTypeName}>
          {request.serviceType.name}
        </Typography>
      </View>

      {/* Seeker Information */}
      <View style={styles.sectionCard}>
        <Typography variant="subtitle2" style={styles.sectionLabel}>
          Seeker Information
        </Typography>
        <View style={styles.seekerInfo}>
          <Avatar
            source={request.seeker.avatarUrl ? { uri: request.seeker.avatarUrl } : null}
            name={`${request.seeker.firstName} ${request.seeker.lastName}`}
            size={56}
          />
          <View style={styles.seekerDetails}>
            <Typography variant="h2" weight="bold">
              {request.seeker.firstName} {request.seeker.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {request.seeker.phoneNumber}
            </Typography>
          </View>
        </View>
      </View>

      {/* Location */}
      <View style={styles.sectionCard}>
        <Typography variant="subtitle2" style={styles.sectionLabel}>
          Location
        </Typography>
        {request.address.coordinates &&
          request.address.coordinates[0] !== 0 &&
          request.address.coordinates[1] !== 0 && (
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: request.address.coordinates[1],
                  longitude: request.address.coordinates[0],
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{ latitude: request.address.coordinates[1], longitude: request.address.coordinates[0] }}
                />
              </MapView>
            </View>
          )}
        <View style={styles.addressContainer}>
          <Typography variant="body1">{request.address.label || 'Address not specified'}</Typography>
        </View>
      </View>

      {/* Description */}
      {request.description && (
        <View style={styles.sectionCard}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Description
          </Typography>
          <View style={styles.descriptionBox}>
            <Typography variant="body1" style={styles.description}>
              {request.description}
            </Typography>
          </View>
        </View>
      )}

      {/* Images */}
      {request.images && request.images.length > 0 && (
        <View style={styles.sectionCard}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Photos ({request.images.length})
          </Typography>
          <View style={styles.imagesContainer}>
            {request.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Settle Request Via Chat"
          onPress={handleSettleRequest}
          isLoading={isCreatingBooking}
          disabled={isCreatingBooking}
          style={styles.button}
        />
        <Button title="Go Back" variant="outline" onPress={handleGoBack} style={styles.button} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  serviceTypeName: {
    marginBottom: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  seekerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seekerDetails: {
    flex: 1,
    marginLeft: spacing.m,
  },
  description: {
    lineHeight: 22,
  },
  descriptionBox: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  mapContainer: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.s,
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    padding: spacing.s,
  },
  buttonContainer: {
    marginTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  button: {
    marginTop: spacing.s,
  },
  loadingText: {
    marginTop: spacing.m,
  },
  errorTitle: {
    marginBottom: spacing.m,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
});

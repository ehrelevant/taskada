import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

type BookingTransitRouteProp = RouteProp<RequestsStackParamList, 'BookingTransit'>;

export function BookingTransitScreen() {
  const route = useRoute<BookingTransitRouteProp>();
  const { bookingId, seekerLocation, address } = route.params;

  const [providerLocation, setProviderLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Parse seeker coordinates (stored as [lng, lat] in database, MapView expects {latitude, longitude})
  const [seekerLongitude, seekerLatitude] = seekerLocation.coordinates;

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setProviderLocation(currentLocation.coords);
      } catch {
        setLocationError('Failed to get location');
      }
    };

    getCurrentLocation();
  }, []);

  const handleArrived = () => {
    // TODO: Implement arrival logic
    console.log('Provider arrived at destination:', { bookingId });
  };

  // Calculate initial region to show both markers
  const getInitialRegion = () => {
    if (providerLocation) {
      const midLatitude = (providerLocation.latitude + seekerLatitude) / 2;
      const midLongitude = (providerLocation.longitude + seekerLongitude) / 2;
      const latitudeDelta = Math.abs(providerLocation.latitude - seekerLatitude) * 1.5 + 0.01;
      const longitudeDelta = Math.abs(providerLocation.longitude - seekerLongitude) * 1.5 + 0.01;

      return {
        latitude: midLatitude,
        longitude: midLongitude,
        latitudeDelta: Math.max(latitudeDelta, 0.02),
        longitudeDelta: Math.max(longitudeDelta, 0.02),
      };
    }

    return {
      latitude: seekerLatitude,
      longitude: seekerLongitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h6">Navigate to Seeker</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={getInitialRegion()}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              {/* Provider Location Marker */}
              {providerLocation && (
                <Marker
                  coordinate={{
                    latitude: providerLocation.latitude,
                    longitude: providerLocation.longitude,
                  }}
                  title="Your Location"
                  pinColor="blue"
                />
              )}

              {/* Seeker Location Marker */}
              <Marker
                coordinate={{
                  latitude: seekerLatitude,
                  longitude: seekerLongitude,
                }}
                title="Seeker Location"
                pinColor="red"
              />
            </MapView>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Location Address
          </Typography>
          <Typography variant="body1" style={styles.addressText}>
            {address?.label || 'Location not specified'}
          </Typography>
        </View>

        {/* Location Error */}
        {locationError && (
          <View style={styles.errorSection}>
            <Typography variant="body2" style={styles.errorText}>
              {locationError}
            </Typography>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <Button title="Press this Button if you have arrived" onPress={handleArrived} style={styles.arriveButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    padding: spacing.m,
  },
  mapSection: {
    marginBottom: spacing.l,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  addressText: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    lineHeight: 22,
  },
  errorSection: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorText: {
    color: '#CC0000',
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  arriveButton: {
    width: '100%',
  },
});

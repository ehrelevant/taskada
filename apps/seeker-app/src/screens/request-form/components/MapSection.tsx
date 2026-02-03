import * as Location from 'expo-location';
import MapView, { Marker, type MarkerDragStartEndEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, palette } from '@repo/theme';
import { reverseGeocode } from '@lib/helpers';
import { useCallback, useEffect, useState } from 'react';

interface MapSectionProps {
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export function MapSection({ onLocationUpdate, initialLat, initialLng }: MapSectionProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [_address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
      onLocationUpdate(lat, lng, addr);
    },
    [onLocationUpdate],
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        if (initialLat !== undefined && initialLng !== undefined) {
          setLocation({ lat: initialLat, lng: initialLng });
          fetchAddress(initialLat, initialLng);
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const { latitude, longitude } = currentLocation.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
      } catch (error) {
        console.error('Failed to get location:', error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, [initialLat, initialLng, fetchAddress]);

  const handleMarkerDragEnd = async (e: MarkerDragStartEndEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ lat: latitude, lng: longitude });
    await fetchAddress(latitude, longitude);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: location.lat, longitude: location.lng }}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: palette.gray200,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray200,
  },
  errorContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray200,
  },
  map: {
    flex: 1,
  },
});

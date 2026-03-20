import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@repo/theme';

import { MapSectionProps } from './MapSection.hooks';
import { styles } from './MapSection.styles';
import { useMapSection } from './MapSection.hooks';

export function MapSection({ onLocationUpdate, initialLat, initialLng }: MapSectionProps) {
  const { location, loading, handleMarkerDragEnd } = useMapSection({
    onLocationUpdate,
    initialLat,
    initialLng,
  });

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

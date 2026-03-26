import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { EmptyState, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './MapSection.styles';
import { MapSectionProps } from './MapSection.hooks';
import { useMapSection } from './MapSection.hooks';

export function MapSection({ onLocationUpdate, initialLat, initialLng }: MapSectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { location, loading, handleMarkerDragEnd } = useMapSection({
    onLocationUpdate,
    initialLat,
    initialLng,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <EmptyState loading />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="body2" color="error">
          Unable to get your location. Please enable location permissions and try again.
        </Typography>
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

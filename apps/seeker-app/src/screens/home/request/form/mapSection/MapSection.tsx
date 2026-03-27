import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { EmptyState, Typography } from '@repo/components';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './MapSection.styles';
import { MapSectionProps } from './MapSection.hooks';
import { useMapSection } from './MapSection.hooks';

export function MapSection({ onLocationUpdate, initialLat, initialLng, forwardedCoords }: MapSectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { location, loading, mapRef, handleRegionChangeComplete } = useMapSection({
    onLocationUpdate,
    initialLat,
    initialLng,
    forwardedCoords,
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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
      <View style={styles.centerPin} pointerEvents="none">
        <MapPin size={42} color={colors.border} fill={colors.actionPrimary} />
      </View>
    </View>
  );
}

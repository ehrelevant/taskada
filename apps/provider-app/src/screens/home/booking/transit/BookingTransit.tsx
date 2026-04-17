import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenContainer, Typography } from '@repo/components';
import { MapPin } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingTransit.styles';
import { useBookingTransit } from './BookingTransit.hooks';

export function BookingTransitScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
    providerLocation,
    isArriving,
    seekerLatitude,
    seekerLongitude,
    address,
    serviceTypeName,
    getInitialRegion,
    handleArrived,
  } = useBookingTransit();

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Navigate to seeker location
          </Typography>
          <Typography variant="body2" color="textInverse">
            Keep this screen open for map guidance and update the booking once you arrive.
          </Typography>
        </View>

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
              {providerLocation && (
                <Marker
                  coordinate={{
                    latitude: providerLocation.latitude,
                    longitude: providerLocation.longitude,
                  }}
                  title="Your Location"
                  pinColor="lightblue"
                />
              )}

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

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <MapPin size={14} color={colors.actionPrimary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Location Address
            </Typography>
          </View>
          <Typography variant="body1" style={styles.addressText}>
            {address?.label || 'Location not specified'}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Type
          </Typography>
          <Typography variant="body1" style={styles.addressText}>
            {serviceTypeName}
          </Typography>
        </View>

        <Button title="Mark as Arrived" onPress={handleArrived} isLoading={isArriving} disabled={isArriving} />
      </ScrollView>
    </ScreenContainer>
  );
}

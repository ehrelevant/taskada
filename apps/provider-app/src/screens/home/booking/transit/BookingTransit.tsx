import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Header, ScreenContainer, Typography } from '@repo/components';
import { Flag, MapPin } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
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
    seekerUser,
    getInitialRegion,
    handleArrived,
    handleReport,
  } = useBookingTransit();

  return (
    <ScreenContainer>
      <Header
        title="Navigate to Seeker"
        size="small"
        rightContent={
          seekerUser ? (
            <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
              <Flag size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : undefined
        }
      />

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
                  pinColor="blue"
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

        <Button title="Mark as Arrived" onPress={handleArrived} isLoading={isArriving} disabled={isArriving} />
      </ScrollView>
    </ScreenContainer>
  );
}

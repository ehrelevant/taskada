import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Header, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Flag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { styles } from './BookingTransit.styles';
import { useBookingTransit } from './BookingTransit.hooks';

export function BookingTransitScreen() {
  const {
    providerLocation,
    locationError,
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
    <SafeAreaView style={styles.container}>
      <Header
        title="Navigate to Seeker"
        size="small"
        rightContent={
          seekerUser ? (
            <TouchableOpacity onPress={handleReport}>
              <Flag size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Location Address
          </Typography>
          <Typography variant="body1" style={styles.addressText}>
            {address?.label || 'Location not specified'}
          </Typography>
        </View>

        {locationError && (
          <View style={styles.errorSection}>
            <Typography variant="body2" style={styles.errorText}>
              {locationError}
            </Typography>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Press this Button if you have arrived"
          onPress={handleArrived}
          isLoading={isArriving}
          disabled={isArriving}
          style={styles.arriveButton}
        />
      </View>
    </SafeAreaView>
  );
}

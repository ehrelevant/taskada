import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Button, Header, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDetails.styles';
import { useBookingDetails } from './BookingDetails.hooks';

export function BookingDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { booking, isLoading, latitude, longitude, formatDateTime, handleGoBack } = useBookingDetails();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Booking Details" size="small" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {booking?.address && (
          <View style={styles.mapSection}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Location
            </Typography>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} title="Service Location" />
              </MapView>
            </View>
            <View style={styles.addressContainer}>
              <Typography variant="body2" style={styles.addressText}>
                {booking.address.label || 'Location not specified'}
              </Typography>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Cost
          </Typography>
          <Typography variant="h5" style={styles.costValue}>
            ₱{booking?.cost?.toFixed(2) || '0.00'}
          </Typography>
        </View>

        {booking?.specifications && (
          <View style={styles.section}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Specifications
            </Typography>
            <View style={styles.specificationsBox}>
              <Typography variant="body1" style={styles.specificationsText}>
                {booking.specifications}
              </Typography>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Booking Date and Time
          </Typography>
          <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Status
          </Typography>
          <View style={styles.statusBadge}>
            <Typography variant="body1" style={styles.statusText}>
              {booking?.status?.toUpperCase()}
            </Typography>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    </SafeAreaView>
  );
}

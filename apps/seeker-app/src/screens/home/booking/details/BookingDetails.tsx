import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@repo/components';

import { styles } from './BookingDetails.styles';
import { useBookingDetailsScreen } from './BookingDetails.hooks';

export function BookingDetailsScreen() {
  const { booking, isLoading, handleGoBack, formatDateTime } = useBookingDetailsScreen();

  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="$actionPrimary" />
          <Typography variant="body1" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color="$textPrimary" />
        </TouchableOpacity>
        <Typography variant="h6">Booking Details</Typography>
        <View style={styles.headerSpacer} />
      </View>

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
            ${booking?.cost?.toFixed(2) || '0.00'}
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
    </SafeAreaView>
  );
}

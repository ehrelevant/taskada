import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, View } from 'react-native';
import { Button, ScreenContainer, Typography } from '@repo/components';
import { CalendarClock, CircleDollarSign, FileText, MapPin } from 'lucide-react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDetails.styles';
import { useBookingDetails } from './BookingDetails.hooks';

export function BookingDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { booking, isLoading, latitude, longitude, formatDateTime, handleGoBack } = useBookingDetails();

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading...
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']} contentPadding="m" contentStyle={styles.content}>
      {/* TODO: Add a header to this */}

      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Full service details
        </Typography>
        <Typography variant="body2" color="textInverse">
          Review location, price, and scope before closing out this booking.
        </Typography>
      </View>

      {booking?.address && (
        <View style={styles.mapSection}>
          <View style={styles.sectionLabelRow}>
            <MapPin size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Location
            </Typography>
          </View>
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
        <View style={styles.sectionLabelRow}>
          <CircleDollarSign size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Cost
          </Typography>
        </View>
        <Typography variant="h5" style={styles.costValue}>
          ₱{booking?.cost?.toFixed(2) || '0.00'}
        </Typography>
      </View>

      {booking?.specifications && (
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <FileText size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Specifications
            </Typography>
          </View>
          <View style={styles.specificationsBox}>
            <Typography variant="body1" style={styles.specificationsText}>
              {booking.specifications}
            </Typography>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <CalendarClock size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Booking Date and Time
          </Typography>
        </View>
        <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>
      </View>

      <Button title="Go Back" onPress={handleGoBack} />
    </ScreenContainer>
  );
}

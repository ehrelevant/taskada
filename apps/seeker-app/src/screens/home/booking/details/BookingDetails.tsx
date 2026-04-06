import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Card, EmptyState, Header, ScreenContainer, StatusBadge, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './BookingDetails.styles';
import { useBookingDetails } from './BookingDetails.hooks';

export function BookingDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { booking, isLoading, handleGoBack, formatDateTime } = useBookingDetails();

  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']} contentPadding="m">
      <Header title="Booking Details" size="small" onBack={handleGoBack} />

      <View style={styles.content}>
        {booking?.address && (
          <View style={styles.mapSection}>
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
              <Typography variant="body2">{booking.address.label || 'Location not specified'}</Typography>
            </View>
          </View>
        )}

        <Card elevation="s" padding="m" style={styles.detailsCard}>
          <Typography variant="h5" color="textSecondary" style={styles.cardLabel}>
            Service Cost
          </Typography>
          <Typography variant="h2" color={colors.actionSecondary}>
            ${booking?.cost?.toFixed(2) || '0.00'}
          </Typography>

          <View style={styles.divider} />

          <Typography variant="h5" color="textSecondary" style={styles.cardLabel}>
            Booking Date
          </Typography>
          <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>

          <View style={styles.divider} />

          <Typography variant="h5" color="textSecondary" style={styles.cardLabel}>
            Status
          </Typography>
          <StatusBadge status="info" label={booking?.status?.toUpperCase() || 'UNKNOWN'} />
        </Card>

        {booking?.specifications && (
          <Card elevation="s" padding="m" style={styles.detailsCard}>
            <Typography variant="h5" color="textSecondary" style={styles.cardLabel}>
              Specifications
            </Typography>
            <Typography variant="body1">{booking.specifications}</Typography>
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CalendarClock, CircleDollarSign, FileText, MapPin } from 'lucide-react-native';
import { Card, EmptyState, ScreenContainer, StatusBadge, Typography } from '@repo/components';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './BookingDetails.styles';
import { useBookingDetails } from './BookingDetails.hooks';

const STATUS_MAP: Record<string, 'success' | 'error' | 'warning' | 'info' | 'pending' | 'default'> = {
  completed: 'success',
  cancelled: 'error',
  in_progress: 'info',
  pending: 'pending',
};

export function BookingDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { booking, isLoading, latitude, longitude, formatDateTime } = useBookingDetails();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <EmptyState loading loadingMessage="Loading booking details..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']} contentPadding="m" contentStyle={styles.content}>
      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Full service details
        </Typography>
        <Typography variant="body2" color="textInverse">
          Review location, price, and scope before closing out this booking.
        </Typography>
      </View>

      {booking?.address && (
        <Card elevation="s" padding="m" style={styles.sectionCard}>
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
        </Card>
      )}

      <Card elevation="s" padding="m" style={styles.sectionCard}>
        <View style={styles.sectionLabelRow}>
          <CircleDollarSign size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Cost
          </Typography>
        </View>
        <Typography variant="h5" style={styles.costValue}>
          ₱{booking?.cost?.toFixed(2) || '0.00'}
        </Typography>
      </Card>

      {booking?.specifications && (
        <Card elevation="s" padding="m" style={styles.sectionCard}>
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
        </Card>
      )}

      <Card elevation="s" padding="m" style={styles.sectionCard}>
        <View style={styles.sectionLabelRow}>
          <CalendarClock size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Booking Date and Time
          </Typography>
        </View>
        <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>
      </Card>

      <Card elevation="s" padding="m" style={styles.sectionCard}>
        <Typography variant="subtitle2" style={styles.sectionLabel}>
          Status
        </Typography>
        <StatusBadge
          status={STATUS_MAP[booking?.status || ''] || 'default'}
          label={booking?.status?.toUpperCase() || 'UNKNOWN'}
        />
      </Card>
    </ScreenContainer>
  );
}

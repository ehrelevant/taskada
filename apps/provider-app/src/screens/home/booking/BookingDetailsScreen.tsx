import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

type BookingDetailsRouteProp = RouteProp<RequestsStackParamList, 'BookingDetails'>;
type BookingDetailsNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'BookingDetails'>;

interface BookingData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
}

export function BookingDetailsScreen() {
  const route = useRoute<BookingDetailsRouteProp>();
  const navigation = useNavigation<BookingDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          throw new Error('Failed to fetch booking');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        Alert.alert('Error', 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Parse coordinates (stored as [lng, lat] in database, MapView expects {latitude, longitude})
  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

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
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h6">Booking Details</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Section */}
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

        {/* Service Cost */}
        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Cost
          </Typography>
          <Typography variant="h5" style={styles.costValue}>
            ₱{booking?.cost?.toFixed(2) || '0.00'}
          </Typography>
        </View>

        {/* Specifications */}
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

        {/* Booking Date */}
        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Booking Date
          </Typography>
          <Typography variant="body1">
            {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
          </Typography>
        </View>

        {/* Status */}
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

      {/* Back Button */}
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    padding: spacing.m,
  },
  mapSection: {
    marginBottom: spacing.l,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    marginTop: spacing.s,
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontWeight: '600',
    color: colors.actionPrimary,
  },
  costValue: {
    color: colors.actionPrimary,
    fontWeight: '700',
  },
  specificationsBox: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  specificationsText: {
    lineHeight: 22,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});

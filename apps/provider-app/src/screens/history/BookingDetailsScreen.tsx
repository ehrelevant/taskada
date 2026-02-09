import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';

type BookingDetailsRouteProp = RouteProp<TransactionHistoryStackParamList, 'BookingDetails'>;
type BookingDetailsNavigationProp = NativeStackNavigationProp<TransactionHistoryStackParamList, 'BookingDetails'>;

interface BookingData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  serviceId: string;
  seekerUserId: string;
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
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
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

  const handleViewRequestDetails = () => {
    navigation.navigate('RequestDetailsSummary', { bookingId });
  };

  const handleViewChatLogs = () => {
    if (booking?.provider) {
      navigation.navigate('ChatLogs', {
        bookingId,
        otherUser: {
          id: booking.provider.id,
          firstName: booking.provider.firstName,
          lastName: booking.provider.lastName,
          avatarUrl: booking.provider.avatarUrl,
        },
      });
    }
  };

  // Parse coordinates (stored as [lng, lat] in database, MapView expects {latitude, longitude})
  const coordinates = booking?.address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h6">Booking Details</Typography>
        <View style={styles.headerSpacer} />
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

        {/* Booking Date and Time */}
        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Booking Date and Time
          </Typography>
          <Typography variant="body1">{booking?.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</Typography>
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

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="View Request Details" onPress={handleViewRequestDetails} />
        <Button title="View Chat Logs" variant="outline" onPress={handleViewChatLogs} style={styles.secondaryButton} />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
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
  secondaryButton: {
    marginTop: spacing.s,
  },
});

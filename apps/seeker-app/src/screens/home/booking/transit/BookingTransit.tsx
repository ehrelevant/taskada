import { Avatar, Rating, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { styles } from './BookingTransit.styles';
import { useBookingTransitScreen } from './BookingTransit.hooks';

export function BookingTransitScreen() {
  const { providerName, providerInfo, serviceTypeName, cost, specifications, hasProviderArrived } =
    useBookingTransitScreen();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h6">{hasProviderArrived ? 'Provider Arrived' : 'Provider En Route'}</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusSection}>
          {hasProviderArrived && (
            <View style={styles.arrivalBadge}>
              <Typography variant="body2" style={styles.arrivalBadgeText}>
                Provider has arrived
              </Typography>
            </View>
          )}
          <Typography variant="h5" style={styles.statusTitle}>
            {hasProviderArrived
              ? 'Your service provider has arrived and is currently serving!'
              : 'Your service provider is on their way'}
          </Typography>
          <Typography variant="body1" color="textSecondary" style={styles.statusSubtitle}>
            {hasProviderArrived
              ? 'The provider is ready to serve you. Please prepare for the service.'
              : 'Please wait while your provider arrives at your location'}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Provider
          </Typography>
          <View style={styles.providerCard}>
            <View style={styles.providerImageContainer}>
              {providerInfo.avatarUrl ? (
                <Avatar source={{ uri: providerInfo.avatarUrl }} size={80} name={providerName} />
              ) : (
                <Avatar source={null} size={80} name={providerName} />
              )}
            </View>
            <View style={styles.providerInfo}>
              <Typography variant="h6" style={styles.providerName}>
                {providerName}
              </Typography>
              <Typography variant="overline" color="textSecondary" style={styles.serviceType}>
                {serviceTypeName}
              </Typography>
              <View style={styles.ratingContainer}>
                <Rating value={4.5} reviewCount={24} size={16} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Details
          </Typography>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Typography variant="body1" color="textSecondary">
                Service Type
              </Typography>
              <Typography variant="body1" weight="medium">
                {serviceTypeName}
              </Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Typography variant="body1" color="textSecondary">
                Cost
              </Typography>
              <Typography variant="h6" style={styles.costValue}>
                ${cost.toFixed(2)}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Specifications
          </Typography>
          <View style={styles.specificationsBox}>
            <Typography variant="body1" style={styles.specificationsText}>
              {specifications}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

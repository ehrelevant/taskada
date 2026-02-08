import { Avatar, Rating, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { HomeStackParamList } from '@navigation/HomeStack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';

type BookingTransitRouteProp = RouteProp<HomeStackParamList, 'BookingTransit'>;

export function BookingTransitScreen() {
  const route = useRoute<BookingTransitRouteProp>();
  const { providerInfo, proposal } = route.params;

  const { cost, specifications, serviceTypeName } = proposal;

  const providerName = `${providerInfo.firstName} ${providerInfo.lastName}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h6">Provider En Route</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Message */}
        <View style={styles.statusSection}>
          <Typography variant="h5" style={styles.statusTitle}>
            Your service provider is on their way
          </Typography>
          <Typography variant="body1" color="textSecondary" style={styles.statusSubtitle}>
            Please wait while your provider arrives at your location
          </Typography>
        </View>

        {/* Provider Card */}
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

        {/* Service Details */}
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
                ₱{cost.toFixed(2)}
              </Typography>
            </View>
          </View>
        </View>

        {/* Specifications */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  statusSection: {
    marginBottom: spacing.l,
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  statusTitle: {
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  statusSubtitle: {
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  providerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImageContainer: {
    marginRight: spacing.m,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    marginBottom: spacing.xs,
  },
  serviceType: {
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.s,
  },
  costValue: {
    fontWeight: '700',
    color: colors.actionPrimary,
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
});

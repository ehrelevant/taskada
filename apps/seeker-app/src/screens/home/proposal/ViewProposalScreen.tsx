import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Typography } from '@repo/components';
import { chatSocket } from '@lib/chatSocket';
import { colors, spacing } from '@repo/theme';
import { HomeStackParamList } from '@navigation/HomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';

type ViewProposalRouteProp = RouteProp<HomeStackParamList, 'ViewProposal'>;
type ViewProposalNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ViewProposal'>;

export function ViewProposalScreen() {
  const route = useRoute<ViewProposalRouteProp>();
  const navigation = useNavigation<ViewProposalNavigationProp>();
  const { bookingId, providerInfo, proposal, requestId } = route.params;

  const { cost, specifications, serviceTypeName, address } = proposal;

  // Parse coordinates (stored as [lng, lat] in database, MapView expects {latitude, longitude})
  const coordinates = address?.coordinates;
  const [longitude, latitude] = coordinates || [0, 0];

  const handleAccept = () => {
    // For now, this doesn't do anything as per requirements
    // The user stays on this screen
    console.log('Accepting proposal:', { bookingId });
  };

  const handleDecline = () => {
    // Send decline event via WebSocket
    chatSocket.declineProposal(bookingId);
    // Navigate back to chat
    navigation.navigate('Chat', {
      bookingId,
      providerInfo,
      requestId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h6">Service Proposal</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Section */}
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
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Location
          </Typography>
          <Typography variant="body1" style={styles.addressText}>
            📍 {address?.label || 'Location not specified'}
          </Typography>
        </View>

        {/* Service Type and Cost Row */}
        <View style={styles.rowSection}>
          <View style={styles.rowItem}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Service Type
            </Typography>
            <Typography variant="body1" style={styles.rowValue}>
              {serviceTypeName}
            </Typography>
          </View>
          <View style={styles.rowItem}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Cost
            </Typography>
            <Typography variant="h6" style={styles.costValue}>
              ₱{cost.toFixed(2)}
            </Typography>
          </View>
        </View>

        {/* Specifications Section */}
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

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Accept Service Specifications" onPress={handleAccept} style={styles.acceptButton} />
        <Button title="Decline and Chat Again" variant="outline" onPress={handleDecline} style={styles.declineButton} />
      </View>
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
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  addressText: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowSection: {
    flexDirection: 'row',
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  rowItem: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowValue: {
    fontWeight: '600',
  },
  costValue: {
    fontWeight: '700',
    color: colors.actionPrimary,
  },
  specificationsBox: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
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
    gap: spacing.m,
  },
  acceptButton: {
    width: '100%',
  },
  declineButton: {
    width: '100%',
  },
});

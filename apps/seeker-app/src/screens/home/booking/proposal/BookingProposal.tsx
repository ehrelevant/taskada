import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Flag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { styles } from './BookingProposal.styles';
import { useBookingProposal } from './BookingProposal.hooks';

export function BookingProposalScreen() {
  const {
    cost,
    specifications,
    serviceTypeName,
    address,
    longitude,
    latitude,
    handleAccept,
    handleDecline,
    handleReport,
  } = useBookingProposal();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h6">Service Proposal</Typography>
        <TouchableOpacity onPress={handleReport} style={{ padding: 8 }}>
          <Flag size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.section}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Service Location
          </Typography>
          <Typography variant="body1" style={styles.addressText}>
            📍 {address?.label || 'Location not specified'}
          </Typography>
        </View>

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

      <View style={styles.buttonContainer}>
        <Button title="Accept Service Specifications" onPress={handleAccept} style={styles.acceptButton} />
        <Button title="Decline and Chat Again" variant="outline" onPress={handleDecline} style={styles.declineButton} />
      </View>
    </SafeAreaView>
  );
}

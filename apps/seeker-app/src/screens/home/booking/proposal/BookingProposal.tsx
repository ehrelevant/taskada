import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Header, ScreenContainer, Section, Typography } from '@repo/components';
import { Flag } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingProposal.styles';
import { useBookingProposal } from './BookingProposal.hooks';

export function BookingProposalScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
    <ScreenContainer
      scrollable
      padding="none"
      stickyFooter={
        <View style={styles.buttonContainer}>
          <Button title="Accept Service Specifications" onPress={handleAccept} />
          <Button title="Decline and Chat Again" variant="outline" onPress={handleDecline} />
        </View>
      }
    >
      <Header
        title="Service Proposal"
        size="small"
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
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

        <Section label="Service Location" variant="card">
          <Typography variant="body1">📍 {address?.label || 'Location not specified'}</Typography>
        </Section>

        <View style={styles.rowSection}>
          <Section label="Service Type" variant="card" style={styles.rowItem}>
            <Typography variant="body1" weight="medium">
              {serviceTypeName}
            </Typography>
          </Section>
          <Section label="Cost" variant="card" style={styles.rowItem}>
            <Typography variant="h2" color="actionSecondary">
              ₱{cost.toFixed(2)}
            </Typography>
          </Section>
        </View>

        <Section label="Service Specifications" variant="card" style={styles.specificationsCard}>
          <Typography variant="body1">{specifications}</Typography>
        </Section>
      </View>
    </ScreenContainer>
  );
}

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BadgeCheck, CircleDollarSign, FileText, Flag, MapPin } from 'lucide-react-native';
import { Button, Header, ScreenContainer, Section, Typography } from '@repo/components';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingProposal.styles';
import { useBookingProposal } from './BookingProposal.hooks';

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `PHP ${amount.toLocaleString()}`;
  }
}

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
          <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              proposal received
            </Typography>
          </View>

          <Typography variant="h3" color="textInverse" style={styles.heroTitle}>
            Review the service proposal
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Confirm the details below before accepting and moving to transit.
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
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationLabelRow}>
            <MapPin size={16} color={colors.actionPrimary} />
            <Typography variant="caption" color="textSecondary">
              Service location
            </Typography>
          </View>
          <Typography variant="body1">{address?.label || 'Location not specified'}</Typography>
        </View>

        <View style={styles.rowSection}>
          <View style={styles.rowItem}>
            <Typography variant="caption" color="textSecondary">
              Service type
            </Typography>
            <Typography variant="body1" weight="medium" style={styles.rowValue}>
              {serviceTypeName}
            </Typography>
          </View>
          <View style={styles.rowItem}>
            <View style={styles.costLabelRow}>
              <CircleDollarSign size={14} color={colors.actionPrimary} />
              <Typography variant="caption" color="textSecondary">
                Proposed cost
              </Typography>
            </View>
            <Typography variant="h3" color="actionPrimary" style={styles.rowValue}>
              {formatCurrency(cost)}
            </Typography>
          </View>
        </View>

        <Section label="Service Specifications" variant="card" style={styles.specificationsCard}>
          <View style={styles.specLabelRow}>
            <FileText size={16} color={colors.textSecondary} />
            <Typography variant="caption" color="textSecondary">
              Scope details
            </Typography>
          </View>
          <Typography variant="body1">{specifications}</Typography>
        </Section>
      </View>
    </ScreenContainer>
  );
}

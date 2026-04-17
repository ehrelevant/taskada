import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Card, Header, ScreenContainer, Typography } from '@repo/components';
import { CircleDollarSign, Flag, MapPin } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
    <ScreenContainer edges={['left', 'right']}>
      <Header
        title="Service Proposal"
        size="small"
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Review the service proposal
          </Typography>
          <Typography variant="body2" color="textInverse">
            Confirm the details below before accepting and moving to transit.
          </Typography>
        </View>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <MapPin size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary">
              Service location
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
            <Typography variant="body2" color="textSecondary">
              Service location address
            </Typography>
            <Typography variant="body1">{address?.label || 'Location not specified'}</Typography>
          </View>
        </Card>

        <View style={styles.rowSection}>
          <Card elevation="s" padding="m" style={styles.rowItemCard}>
            <Typography variant="body2" color="textSecondary">
              Service type
            </Typography>
            <Typography variant="h6" color="actionPrimary">
              {serviceTypeName}
            </Typography>
          </Card>

          <Card elevation="s" padding="m" style={styles.rowItemCard}>
            <View style={styles.costLabelRow}>
              <CircleDollarSign size={16} color={colors.actionPrimary} />
              <Typography variant="body2" color="textSecondary">
                Proposed cost
              </Typography>
            </View>
            <Typography variant="h6" color="actionPrimary">
              {formatCurrency(cost)}
            </Typography>
          </Card>
        </View>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <Typography variant="subtitle2" color="textSecondary">
              Service specifications
            </Typography>
          </View>
          <Typography variant="body1">{specifications}</Typography>
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Accept Service Specifications" onPress={handleAccept} />
          <Button title="Decline and Chat Again" variant="outline" onPress={handleDecline} />
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}

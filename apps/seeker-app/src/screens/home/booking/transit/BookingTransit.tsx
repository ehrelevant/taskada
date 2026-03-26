import { Avatar, Header, ScreenContainer, Section, StatusBadge, Typography } from '@repo/components';
import { Flag } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingTransit.styles';
import { useBookingTransit } from './BookingTransit.hooks';

export function BookingTransitScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { providerName, providerInfo, serviceTypeName, cost, specifications, hasProviderArrived, handleReport } =
    useBookingTransit();

  return (
    <ScreenContainer scrollable padding="none">
      <Header
        title={hasProviderArrived ? 'Provider Arrived' : 'Provider En Route'}
        size="small"
        rightContent={
          <TouchableOpacity onPress={handleReport}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.statusSection}>
          {hasProviderArrived && <StatusBadge status="success" label="Provider has arrived" />}
          <Typography variant="h2" align="center" style={styles.statusTitle}>
            {hasProviderArrived
              ? 'Your service provider has arrived and is currently serving!'
              : 'Your service provider is on their way'}
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            {hasProviderArrived
              ? 'The provider is ready to serve you. Please prepare for the service.'
              : 'Please wait while your provider arrives at your location'}
          </Typography>
        </View>

        <Section label="Service Provider">
          <View style={styles.providerCard}>
            <Avatar
              source={providerInfo.avatarUrl ? { uri: providerInfo.avatarUrl } : null}
              size={80}
              name={providerName}
            />
            <View style={styles.providerInfo}>
              <Typography variant="h6" style={styles.providerName}>
                {providerName}
              </Typography>
              <Typography variant="overline" color="textSecondary">
                {serviceTypeName}
              </Typography>
            </View>
          </View>
        </Section>

        <Section label="Service Details" variant="card">
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
            <Typography variant="h4" color="actionSecondary">
              ${cost.toFixed(2)}
            </Typography>
          </View>
        </Section>

        <Section label="Service Specifications" variant="card" style={styles.specificationsCard}>
          <Typography variant="body1">{specifications}</Typography>
        </Section>
      </View>
    </ScreenContainer>
  );
}

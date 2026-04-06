import { Avatar, Header, ScreenContainer, Section, Typography } from '@repo/components';
import { Flag } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingTransit.styles';
import { useBookingTransit } from './BookingTransit.hooks';

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

export function BookingTransitScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { providerName, providerInfo, serviceTypeName, cost, specifications, hasProviderArrived, handleReport } =
    useBookingTransit();

  return (
    <ScreenContainer scrollable edges={['top', 'left', 'right']}>
      <Header
        title={hasProviderArrived ? 'Provider Arrived' : 'Provider En Route'}
        size="small"
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            {hasProviderArrived
              ? 'Your service provider has arrived and is currently serving!'
              : 'Your service provider is on their way'}
          </Typography>
          <Typography variant="body2" color="textInverse">
            {hasProviderArrived
              ? 'The provider is ready to serve you. Please prepare for the service.'
              : 'Please wait while your provider arrives at your location'}
          </Typography>
        </View>

        <Section label="Service Provider" variant="card">
          <View style={styles.providerCardShell}>
            <Avatar
              source={providerInfo.avatarUrl ? { uri: providerInfo.avatarUrl } : null}
              size={80}
              name={providerName}
            />
            <View>
              <Typography variant="h3">{providerName}</Typography>
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
            <View style={styles.costRow}>
              <Typography variant="h4" color="actionPrimary">
                {formatCurrency(cost)}
              </Typography>
            </View>
          </View>
        </Section>

        <Section label="Service Specifications" variant="card" style={styles.specificationsCard}>
          <Typography variant="body1">{specifications}</Typography>
        </Section>
      </View>
    </ScreenContainer>
  );
}

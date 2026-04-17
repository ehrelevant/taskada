import { Avatar, Card, ScreenContainer, Typography } from '@repo/components';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingServing.styles';
import { useBookingServing } from './BookingServing.hooks';

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

export function BookingServingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { providerName, otherUser, serviceTypeName, cost, specifications } = useBookingServing();

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Provider is currently serving
          </Typography>
          <Typography variant="body2" color="textInverse">
            Your provider has arrived and the service is currently in progress.
          </Typography>
        </View>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionHeading}>
            Service Provider
          </Typography>
          <View style={styles.providerCardShell}>
            <Avatar source={otherUser.avatarUrl ? { uri: otherUser.avatarUrl } : null} size={72} name={providerName} />
            <View>
              <Typography variant="h3">{providerName}</Typography>
              <Typography variant="overline" color="textSecondary">
                {serviceTypeName}
              </Typography>
            </View>
          </View>
        </Card>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionHeading}>
            Service Details
          </Typography>
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
            <Typography variant="h5" color="actionPrimary">
              {formatCurrency(cost)}
            </Typography>
          </View>
        </Card>

        <Card elevation="s" padding="m" style={styles.sectionCard}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionHeading}>
            Service Specifications
          </Typography>
          <Typography variant="body1">{specifications}</Typography>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

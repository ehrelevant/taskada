import { Avatar, Button, Card, EmptyState, ScreenContainer, Typography } from '@repo/components';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, serviceTypeName, isLoading, handleReturn } = useBookingDone();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right', 'bottom']}>
        <EmptyState loading loadingMessage="Loading completion details..." />
      </ScreenContainer>
    );
  }

  const seekerName = bookingDetails?.seeker
    ? `${bookingDetails.seeker.firstName} ${bookingDetails.seeker.lastName}`
    : 'Seeker';

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse" align="center">
            Well done, provider!
          </Typography>
          <Typography variant="body2" color="textInverse" align="center">
            This service has been completed successfully.
          </Typography>
        </View>

        <Card elevation="s" padding="m" style={styles.summaryCard}>
          <Avatar
            source={bookingDetails?.seeker?.avatarUrl ? { uri: bookingDetails.seeker.avatarUrl } : null}
            name={seekerName}
            size={80}
          />
          <View style={styles.summaryUserInfo}>
            <Typography variant="h3">{seekerName}</Typography>
            <Typography variant="overline" color="textSecondary">
              {serviceTypeName}
            </Typography>
          </View>
        </Card>

        <View style={styles.actionButtonsContainer}>
          <Button title="Return to Requests" onPress={handleReturn} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

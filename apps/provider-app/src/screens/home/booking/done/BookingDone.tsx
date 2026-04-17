import { Avatar, Button, Card, EmptyState, Header, ScreenContainer, Typography } from '@repo/components';
import { CircleDollarSign, Flag } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingDone.styles';
import { useBookingDone } from './BookingDone.hooks';

export function BookingDoneScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookingDetails, isLoading, handleReturn, handleViewDetails, handleReport } = useBookingDone();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <EmptyState loading loadingMessage="Loading completion details..." />
      </ScreenContainer>
    );
  }

  const seekerName = bookingDetails?.seeker
    ? `${bookingDetails.seeker.firstName} ${bookingDetails.seeker.lastName}`
    : 'Seeker';

  return (
    <ScreenContainer edges={['left', 'right']}>
      <Header
        title="Booking Complete"
        size="small"
        onBack={handleReturn}
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

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
          <View style={styles.summaryHeader}>
            <Avatar
              source={bookingDetails?.seeker?.avatarUrl ? { uri: bookingDetails.seeker.avatarUrl } : null}
              name={seekerName}
              size={56}
            />
            <View style={styles.summaryUserInfo}>
              <Typography variant="h6">{seekerName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {bookingDetails?.service?.serviceType?.name || 'Service'}
              </Typography>
            </View>
          </View>

          <View style={styles.costRow}>
            <CircleDollarSign size={15} color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary">
              Final cost
            </Typography>
            <Typography variant="h6" style={styles.costValue}>
              ₱{bookingDetails?.cost?.toFixed(2) || '0.00'}
            </Typography>
          </View>
        </Card>

        <View style={styles.actionButtonsContainer}>
          <Button title="Return to Requests" onPress={handleReturn} />
          <Button title="View Booking Details" variant="outline" onPress={handleViewDetails} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

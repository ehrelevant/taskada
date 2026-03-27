import { ActivityIndicator, FlatList, View } from 'react-native';
import { Avatar, Button, Card, ScreenContainer, Typography } from '@repo/components';
import { BadgeCheck, CalendarClock, CircleDollarSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { BookingHistoryItem, useHistory } from './History.hooks';
import { createStyles } from './History.styles';

export function HistoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { bookings, isLoading, error, formatDateTime, getStatusColor, handleViewDetails } = useHistory();

  const renderBookingCard = ({ item }: { item: BookingHistoryItem }) => {
    const seekerName = item.seeker ? `${item.seeker.firstName} ${item.seeker.lastName}` : 'Unknown Seeker';

    return (
      <Card elevation="s" padding="m" style={styles.card}>
        <View style={styles.providerHeader}>
          <Avatar source={item.seeker?.avatarUrl ? { uri: item.seeker.avatarUrl } : null} name={seekerName} size={50} />
          <View style={styles.providerInfo}>
            <Typography variant="subtitle1" weight="medium">
              {seekerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.serviceType.name}
            </Typography>
          </View>
          <View style={styles.costContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CircleDollarSign size={14} color={colors.actionPrimary} />
              <Typography variant="h6" weight="bold" color="actionPrimary">
                ₱{item.cost?.toFixed(2) || '0.00'}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.statusDateRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Typography variant="caption" color="textInverse" style={styles.statusText}>
              {item.status.toUpperCase()}
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <CalendarClock size={14} color={colors.textSecondary} />
            <Typography variant="body2" color="textSecondary">
              {formatDateTime(item.createdAt)}
            </Typography>
          </View>
        </View>

        <Button
          title="View Details"
          variant="outline"
          onPress={() => handleViewDetails(item.id)}
          style={styles.detailsButton}
        />
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading transaction history...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <ScreenContainer padding="none" style={styles.container}>
        <View style={styles.loadingContainer}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none" style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <View style={styles.heroPill}>
              <BadgeCheck size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                booking history
              </Typography>
            </View>
            <Typography variant="h3" color="textInverse">
              Completed and cancelled jobs
            </Typography>
            <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
              Review past transactions, costs, and service outcomes.
            </Typography>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="textSecondary">
              No completed or cancelled bookings yet
            </Typography>
          </View>
        }
      />
    </ScreenContainer>
  );
}

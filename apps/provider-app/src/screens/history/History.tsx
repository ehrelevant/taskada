import { ActivityIndicator, FlatList, View } from 'react-native';
import { Avatar, Button, Card, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingHistoryItem, useTransactionHistory } from './History.hooks';
import { styles } from './History.styles';

export function TransactionHistoryListScreen() {
  const { bookings, isLoading, error, formatDateTime, getStatusColor, handleViewDetails } = useTransactionHistory();

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
            <Typography variant="h6" weight="bold" color="actionPrimary">
              ₱{item.cost?.toFixed(2) || '0.00'}
            </Typography>
          </View>
        </View>

        <View style={styles.statusDateRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Typography variant="caption" color="textInverse" style={styles.statusText}>
              {item.status.toUpperCase()}
            </Typography>
          </View>
          <Typography variant="body2" color="textSecondary">
            {formatDateTime(item.createdAt)}
          </Typography>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="textSecondary">
              No completed or cancelled bookings yet
            </Typography>
          </View>
        }
      />
    </View>
  );
}

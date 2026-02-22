import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Avatar, Button, Card, Typography } from '@repo/components';
import { colors, palette, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

type TransactionHistoryNavigationProp = NativeStackNavigationProp<TransactionHistoryStackParamList>;

interface BookingHistoryItem {
  id: string;
  status: 'completed' | 'cancelled';
  cost: number;
  createdAt: string;
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
}

export function TransactionHistoryListScreen() {
  const navigation = useNavigation<TransactionHistoryNavigationProp>();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookingHistory();
  }, []);

  const loadBookingHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch('/bookings/provider/history', 'GET');

      if (!response.ok) {
        throw new Error('Failed to load booking history');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load booking history:', err);
      setError('Failed to load booking history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? palette.success : palette.error;
  };

  const handleViewDetails = (bookingId: string) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  const renderBookingCard = ({ item }: { item: BookingHistoryItem }) => {
    const seekerName = item.seeker ? `${item.seeker.firstName} ${item.seeker.lastName}` : 'Unknown Seeker';

    return (
      <Card elevation="s" padding="m" style={styles.card}>
        {/* Seeker Info Header */}
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

        {/* Status and Date Row */}
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

        {/* View Details Button */}
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
      {/* Booking List */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
  },
  listContent: {
    padding: spacing.m,
  },
  card: {
    marginBottom: spacing.m,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  providerInfo: {
    flex: 1,
    marginLeft: spacing.m,
  },
  costContainer: {
    alignItems: 'flex-end',
  },
  statusDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: '600',
  },
  detailsButton: {
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});

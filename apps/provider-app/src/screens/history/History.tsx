import { Avatar, Card, EmptyState, ScreenContainer, StatusBadge, Typography } from '@repo/components';
import { CalendarClock } from 'lucide-react-native';
import { FlatList, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './History.styles';
import { useHistory } from './History.hooks';

const STATUS_MAP: Record<string, 'success' | 'error' | 'warning' | 'info' | 'pending' | 'default'> = {
  completed: 'success',
  cancelled: 'error',
  in_progress: 'info',
  pending: 'pending',
};

export function HistoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bookings, isLoading, error, formatDateTime, handleViewDetails } = useHistory();

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `PHP ${amount.toLocaleString()}`;
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer edges={['top', 'left', 'right']}>
        <EmptyState loading loadingMessage="Loading transaction history..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer edges={['top', 'left', 'right']}>
        <EmptyState message={error} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <FlatList
        data={bookings}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <Typography variant="h3" color="textInverse">
              History
            </Typography>
            <Typography variant="body2" color="textInverse">
              Review past transactions, costs, and service outcomes.
            </Typography>
          </View>
        }
        renderItem={({ item }) => {
          const seekerName = item.seeker ? `${item.seeker.firstName} ${item.seeker.lastName}` : 'Unknown Seeker';

          return (
            <Card elevation="s" padding="m" style={styles.card} onPress={() => handleViewDetails(item.id)}>
              <View style={styles.cardContent}>
                <View style={styles.providerHeader}>
                  <Avatar
                    source={item.seeker?.avatarUrl ? { uri: item.seeker.avatarUrl } : null}
                    name={seekerName}
                    size={44}
                  />
                  <View style={styles.providerInfo}>
                    <Typography variant="h5">{seekerName}</Typography>
                    <Typography variant="overline" color="textSecondary">
                      {item.serviceType.name.toUpperCase()}
                    </Typography>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <StatusBadge status={STATUS_MAP[item.status] || 'default'} label={item.status.toUpperCase()} />
                  <View style={styles.costDate}>
                    <View style={styles.metaRow}>
                      <Typography variant="h5" color={colors.actionPrimary}>
                        {formatCurrency(item.cost || 0)}
                      </Typography>
                    </View>
                    <View style={styles.metaRow}>
                      <CalendarClock size={13} color={colors.textSecondary} />
                      <Typography variant="caption" color="textSecondary">
                        {formatDateTime(item.createdAt)}
                      </Typography>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState message="No completed bookings yet." />}
      />
    </ScreenContainer>
  );
}

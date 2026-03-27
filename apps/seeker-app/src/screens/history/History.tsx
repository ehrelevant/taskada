import { Avatar, Card, EmptyState, ScreenContainer, StatusBadge, Typography } from '@repo/components';
import { BadgeCheck, CalendarClock, CircleDollarSign } from 'lucide-react-native';
import { FlatList, TouchableOpacity, View } from 'react-native';
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
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading transaction history..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState message={error} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none">
      <FlatList
        data={bookings}
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
              Review your past services, costs, and booking outcomes.
            </Typography>
          </View>
        }
        renderItem={({ item }) => {
          const providerName = item.provider
            ? `${item.provider.firstName} ${item.provider.lastName}`
            : 'Unknown Provider';

          return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleViewDetails(item.id)}>
              <Card elevation="s" padding="m" style={styles.card}>
                <View style={styles.providerHeader}>
                  <Avatar
                    source={item.provider?.avatarUrl ? { uri: item.provider.avatarUrl } : null}
                    name={providerName}
                    size={44}
                  />
                  <View style={styles.providerInfo}>
                    <Typography variant="h5">{providerName}</Typography>
                    <Typography variant="overline" color="textSecondary">
                      {item.serviceType.name.toUpperCase()}
                    </Typography>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <StatusBadge status={STATUS_MAP[item.status] || 'default'} label={item.status.toUpperCase()} />
                  <View style={styles.costDate}>
                    <View style={styles.metaRow}>
                      <CircleDollarSign size={14} color={colors.actionPrimary} />
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
              </Card>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState message="No completed or cancelled bookings yet" />}
      />
    </ScreenContainer>
  );
}

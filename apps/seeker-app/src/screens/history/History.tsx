import { Avatar, Card, EmptyState, ScreenContainer, StatusBadge, Typography } from '@repo/components';
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
                    <Typography variant="h5" color={colors.actionSecondary}>
                      ${item.cost?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDateTime(item.createdAt)}
                    </Typography>
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

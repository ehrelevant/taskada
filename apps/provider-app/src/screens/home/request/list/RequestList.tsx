import { Avatar, BottomActionBar, Button, EmptyState, ScreenContainer, Typography } from '@repo/components';
import { Clock3, MapPin, Radio, Sparkles } from 'lucide-react-native';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestList.styles';
import { IncomingRequest, useRequestList } from './RequestList.hooks';

function formatRelativeTime(createdAt: string): string {
  const createdTime = new Date(createdAt).getTime();
  const elapsedMs = Date.now() - createdTime;

  if (Number.isNaN(createdTime) || elapsedMs < 0) {
    return 'just now';
  }

  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RequestListScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { isAccepting, requests, isConnecting, enableRequests, disableRequests, handleViewDetails } = useRequestList();

  const renderRequestCard = ({ item }: { item: IncomingRequest }) => {
    const seekerName = `${item.seeker.firstName} ${item.seeker.lastName}`.trim();
    const postedAt = formatRelativeTime(item.createdAt);

    return (
      <TouchableOpacity style={styles.requestCard} onPress={() => handleViewDetails(item)} activeOpacity={0.85}>
        <View style={styles.requestTopRow}>
          <Typography variant="overline" color={colors.home.chipText}>
            {item.serviceType.name}
          </Typography>
          <View style={styles.timePill}>
            <Clock3 size={12} color={colors.textSecondary} />
            <Typography variant="caption" color="textSecondary">
              {postedAt}
            </Typography>
          </View>
        </View>

        <View style={styles.requestSeekerRow}>
          <Avatar
            source={item.seeker.avatarUrl ? { uri: item.seeker.avatarUrl } : null}
            name={seekerName || 'Seeker'}
            size={36}
          />
          <View style={styles.requestSeekerText}>
            <Typography variant="subtitle2" weight="semiBold" numberOfLines={1}>
              {seekerName || 'Unknown seeker'}
            </Typography>
            <View style={styles.addressRow}>
              <MapPin size={12} color={colors.textSecondary} />
              <Typography variant="caption" color="textSecondary" numberOfLines={1}>
                {item.address.label || 'Unknown address'}
              </Typography>
            </View>
          </View>
        </View>

        {item.description ? (
          <Typography variant="body2" color="textSecondary" numberOfLines={2} style={styles.requestDescription}>
            {item.description}
          </Typography>
        ) : null}

        <View style={styles.requestBottomRow}>
          <Typography variant="caption" color="textSecondary">
            {item.images.length > 0 ? `${item.images.length} attachment(s)` : 'No attachments'}
          </Typography>
          <Typography variant="caption" color="actionPrimary">
            View details
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  if (isAccepting) {
    return (
      <ScreenContainer padding="none" useSafeArea={false} style={styles.container}>
        <View style={styles.liveHeader}>
          <View style={styles.liveTitleRow}>
            <View style={styles.liveDot} />
            <Typography variant="h4" color="textInverse">
              Live Requests
            </Typography>
          </View>
          <Typography variant="body2" color="textInverse">
            You are visible to seekers in your enabled services.
          </Typography>
          <View style={styles.liveStatsRow}>
            <View style={styles.liveStatPill}>
              <Sparkles size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                {requests.length} pending
              </Typography>
            </View>
            <View style={styles.liveStatPill}>
              <Radio size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                actively listening
              </Typography>
            </View>
          </View>
        </View>

        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={renderRequestCard}
          contentContainerStyle={styles.requestListContent}
          ListEmptyComponent={<EmptyState message="No requests yet. Waiting for seekers..." />}
        />

        <BottomActionBar style={styles.bottomBar}>
          <Button
            title="Stop Receiving Requests"
            variant="outline"
            onPress={disableRequests}
            isLoading={isConnecting}
          />
        </BottomActionBar>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none" useSafeArea={false} style={styles.centeredContainer}>
        <View style={styles.idleHero}>
          <View style={styles.idleBadge}>
            <Radio size={16} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              currently offline
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse" style={styles.idleTitle}>
            Ready to start accepting jobs?
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.idleSubtitle}>
            Go live and receive nearby service requests from seekers that match your enabled offerings.
          </Typography>
        </View>

        <View style={styles.idleChecklist}>
          <View style={styles.idleChecklistItem}>
            <Sparkles size={16} color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary">
              Requests appear here in real time.
            </Typography>
          </View>
          <View style={styles.idleChecklistItem}>
            <MapPin size={16} color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary">
              Review address and seeker notes before accepting.
            </Typography>
          </View>
          <View style={styles.idleChecklistItem}>
            <Clock3 size={16} color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary">
              Pause anytime when you need a break.
            </Typography>
          </View>
        </View>

      <BottomActionBar style={styles.bottomBar}>
        <Button title="Start Receiving Requests" onPress={enableRequests} isLoading={isConnecting} />
      </BottomActionBar>
    </ScreenContainer>
  );
}

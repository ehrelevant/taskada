import { BottomActionBar, Button, EmptyState, Header, ScreenContainer } from '@repo/components';
import { FlatList, View } from 'react-native';
import { RequestListing } from '@repo/components';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestList.styles';
import { useRequestList } from './RequestList.hooks';

export function RequestListScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { isAccepting, requests, isConnecting, enableRequests, disableRequests, handleViewDetails } = useRequestList();

  if (isAccepting) {
    return (
      <ScreenContainer padding="none" useSafeArea={false} style={styles.container}>
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RequestListing
              title={item.serviceType.name}
              address={item.address.label || 'Unknown address'}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          ListEmptyComponent={<EmptyState message="No requests yet. Waiting for seekers..." />}
        />

        <BottomActionBar>
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
      <View style={styles.centeredContent}>
        <Header
          title="Ready to Work?"
          subtitle="Start receiving requests from nearby seekers"
          align="center"
          size="large"
        />
      </View>

      <BottomActionBar>
        <Button title="Start Receiving Requests" onPress={enableRequests} isLoading={isConnecting} />
      </BottomActionBar>
    </ScreenContainer>
  );
}

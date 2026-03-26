import { ActivityIndicator, View } from 'react-native';
import { Button, EmptyState, ScreenContainer, Typography } from '@repo/components';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@repo/theme';

import { createStyles } from './Standby.styles';
import { useStandby } from './Standby.hooks';

export function StandbyScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { isConnecting, isCancelling, error, handleCancelRequest } = useStandby();
  const navigation = useNavigation();

  if (isConnecting) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Connecting to service providers..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Error"
          message={error}
          action={<Button title="Go Back" onPress={() => navigation.goBack()} />}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="m">
      <View style={styles.content}>
        <Typography variant="h4">Reaching out to service providers.</Typography>
        <Typography variant="h4">This may take awhile.</Typography>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title={isCancelling ? 'Cancelling...' : 'Cancel Request'}
          variant="outline"
          onPress={handleCancelRequest}
          isLoading={isCancelling}
          disabled={isCancelling}
        />
      </View>
    </ScreenContainer>
  );
}

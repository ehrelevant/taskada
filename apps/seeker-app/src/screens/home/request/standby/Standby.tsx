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
      <ScreenContainer contentPadding="m">
        <EmptyState loading loadingMessage="Connecting to service providers..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer contentPadding="m">
        <EmptyState
          title="Error"
          message={error}
          action={<Button title="Go Back" onPress={() => navigation.goBack()} />}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'left', 'right']} contentPadding="m" contentStyle={styles.content}>
      <View style={styles.heroShell}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Looking for the right provider
          </Typography>
          <Typography variant="body2" color="textInverse">
            We are notifying nearby verified providers that match your request details.
          </Typography>

          <View style={styles.spinnerCard}>
            <ActivityIndicator size="large" color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary" style={styles.spinnerText}>
              Waiting for provider response...
            </Typography>
          </View>
        </View>
      </View>

      <Button
        title={isCancelling ? 'Cancelling...' : 'Cancel Request'}
        variant="outline"
        onPress={handleCancelRequest}
        isLoading={isCancelling}
        disabled={isCancelling}
      />
    </ScreenContainer>
  );
}

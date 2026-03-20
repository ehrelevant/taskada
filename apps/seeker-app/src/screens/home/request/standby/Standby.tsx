import { ActivityIndicator, View } from 'react-native';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { useNavigation } from '@react-navigation/native';

import { styles } from './Standby.styles';
import { useStandbyScreen } from './Standby.hooks';

export function StandbyScreen() {
  const { isConnecting, isCancelling, error, handleCancelRequest } = useStandbyScreen();
  const navigation = useNavigation();

  if (isConnecting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
        <Typography variant="body1" style={styles.connectingText}>
          Connecting to service providers...
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Typography variant="h5" color="error" style={styles.errorText}>
          Error
        </Typography>
        <Typography variant="body1" color="textSecondary" style={styles.errorMessage}>
          {error}
        </Typography>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.button} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
}

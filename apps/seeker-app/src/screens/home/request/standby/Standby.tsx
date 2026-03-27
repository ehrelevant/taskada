import { ActivityIndicator, View } from 'react-native';
import { Button, EmptyState, ScreenContainer, Typography } from '@repo/components';
import { Clock3, Radio, ShieldCheck, Sparkles } from 'lucide-react-native';
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
    <ScreenContainer padding="none">
      <View style={styles.heroShell}>
        <View style={styles.heroCard}>
          <View style={styles.livePill}>
            <Radio size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              request is live
            </Typography>
          </View>

          <Typography variant="h3" color="textInverse" style={styles.title}>
            Looking for the right provider
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.subtitle}>
            We are notifying nearby verified providers that match your request details.
          </Typography>

          <View style={styles.statusRows}>
            <View style={styles.statusPill}>
              <ShieldCheck size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                verified matches only
              </Typography>
            </View>
            <View style={styles.statusPill}>
              <Clock3 size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                updates in real time
              </Typography>
            </View>
          </View>

          <View style={styles.spinnerCard}>
            <ActivityIndicator size="large" color={colors.actionPrimary} />
            <Typography variant="body2" color="textSecondary" style={styles.spinnerText}>
              Waiting for provider response...
            </Typography>
          </View>

          <View style={styles.tipRow}>
            <Sparkles size={14} color={colors.textSecondary} />
            <Typography variant="caption" color="textSecondary">
              Keep this screen open to receive instant updates.
            </Typography>
          </View>
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

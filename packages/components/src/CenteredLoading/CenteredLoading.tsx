import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@repo/theme';

import { Typography } from '../Typography';

type Props = {
  message?: string;
  size?: 'small' | 'large';
};

export function CenteredLoading({ message = 'Loading...', size = 'large' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.actionPrimary} />
      {message && (
        <Typography variant="body1" color="textSecondary" style={styles.message}>
          {message}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.m,
  },
});

import { spacing } from '@repo/theme';
import { StyleSheet, View } from 'react-native';

import { Button } from '../Button';
import { Typography } from '../Typography';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function CenteredError({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Typography variant="h4" color="error" style={styles.icon}>
        !
      </Typography>
      <Typography variant="body1" color="error" align="center">
        {message}
      </Typography>
      {onRetry && <Button title="Try Again" variant="outline" onPress={onRetry} style={styles.button} />}
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
  icon: {
    marginBottom: spacing.m,
  },
  button: {
    marginTop: spacing.l,
    minWidth: 150,
  },
});

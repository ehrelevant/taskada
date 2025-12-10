import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { StyleSheet, View } from 'react-native';

export function HomeScreen() {
  const { data: session } = authClient.useSession();

  if (session === null) {
    return (
      <View style={styles.container} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography variant="h4" style={{ textAlign: 'center' }}>
          To start receiving requests, press <Typography weight="bold">&quot;Start Receiving Requests&quot;</Typography>.
        </Typography>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Start Receiving Requests" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%'
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { StyleSheet, View } from 'react-native';

export function HomeScreen() {
  const enableRequests = async () => {
    const response = await apiFetch(`/providers/enable`, 'PUT');
    console.log(await response.json());
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography variant="h4" style={{ textAlign: 'center' }}>
          To start receiving requests, press <Typography weight="bold">&quot;Start Receiving Requests&quot;</Typography>.
        </Typography>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Start Receiving Requests" onPress={enableRequests} />
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

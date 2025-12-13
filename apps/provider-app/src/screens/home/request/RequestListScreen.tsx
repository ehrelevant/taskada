import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { Image, StyleSheet, View } from 'react-native';
import { Provider } from '@repo/database';
import { useEffect, useState } from 'react';

export function RequestListScreen() {
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await apiFetch(`/providers`, 'GET');
      const providerData: Provider = await response.json();

      setIsAccepting(providerData.isAccepting);
    })();
  }, []);

  const enableRequests = async () => {
    const response = await apiFetch(`/providers/enable`, 'PUT');
    const { isAccepting: newIsAccepting }: Provider = await response.json();
    setIsAccepting(newIsAccepting);
  };

  const disableRequests = async () => {
    const response = await apiFetch(`/providers/disable`, 'PUT');
    const { isAccepting: newIsAccepting }: Provider = await response.json();
    setIsAccepting(newIsAccepting);
  };

  return (isAccepting) ? (
    <View style={styles.screen}>
      <View style={styles.bottomButtonContainer}>
        <Button title="Stop Receiving Requests" variant="outline" onPress={disableRequests} />
      </View>
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.center}>
        <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Typography variant="h4" style={{ textAlign: 'center' }}>
            To start receiving requests, press <Typography weight="bold">&quot;Start Receiving Requests&quot;</Typography>.
          </Typography>
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button title="Start Receiving Requests" onPress={enableRequests} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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

  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: '100%',
    height: 100,
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
  },
});
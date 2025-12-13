import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
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
      <View style={styles.requestsListContainer}>

      </View>

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
  screen: {
    flex: 1,
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
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%'
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    borderTopColor: colors.border,
    borderTopWidth: 2
  },
  requestsListContainer: {
    flex: 1,
  }
});
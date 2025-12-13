import { apiFetch } from '@lib/helpers';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Provider } from '@repo/database';
import { RequestListing } from '@lib/components/RequestListing';
import { useEffect, useState } from 'react';

const SAMPLE_REQUESTS = [
  {
    id: '1',
    title: 'Plumbing',
    distance: 'XXXm',
    address: 'UP Alumni Engineers Centennial Hall, P. Velasquez St., University of the Philippines Diliman, 1101 Diliman, Quezon City, Philippines',
  },
  {
    id: '2',
    title: 'Car Mechanic',
    distance: 'XXXm',
    address: 'UP Alumni Engineers Centennial Hall, P. Velasquez St., University of the Philippines Diliman, 1101 Diliman, Quezon City, Philippines',
  },
  {
    id: '3',
    title: 'Baby Sitting',
    distance: 'XXXm',
    address: 'UP Alumni Engineers Centennial Hall, P. Velasquez St., University of the Philippines Diliman, 1101 Diliman, Quezon City, Philippines',
  },
  {
    id: '4',
    title: 'Cleaning',
    distance: 'XXXm',
    address: 'UP Alumni Engineers Centennial Hall, P. Velasquez St., University of the Philippines Diliman, 1101 Diliman, Quezon City, Philippines',
  },
];

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

  const requests = SAMPLE_REQUESTS;

  return (isAccepting) ? (
    <View style={styles.screen}>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.requestsListContainer}
        renderItem={({ item }) => (
          <RequestListing
            title={item.title}
            distance={item.distance}
            address={item.address}
            onViewDetails={() => {
              // TODO: Navigate to details of request
              console.log(`View details for ${item.title ?? item.id} request`);
            }}
          />
        )}
      />

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
    borderTopWidth: 2,
    backgroundColor: colors.backgroundSecondary,
  },
  requestsListContainer: {
    paddingBottom: 60,
  }
});
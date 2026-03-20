import { ActivityIndicator, FlatList, View } from 'react-native';
import type { ServiceType } from '@repo/types';
import { ServiceTypeCard, Typography } from '@repo/components';

import { styles } from './ServiceTypes.styles';
import { useServiceTypesScreen } from './ServiceTypes.hooks';

export function ServiceTypesListScreen() {
  const { serviceTypes, loading, error } = useServiceTypesScreen();

  const renderItem = ({ item }: { item: ServiceType }) => (
    <ServiceTypeCard name={item.name} iconUrl={item.iconUrl} onPress={() => undefined} />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="$actionPrimary" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={serviceTypes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

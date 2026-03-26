import { EmptyState, ScreenContainer, ServiceTypeCard } from '@repo/components';
import { FlatList } from 'react-native';
import type { ServiceType } from '@repo/types';

import { createStyles } from './ServiceTypes.styles';
import { useServiceTypes } from './ServiceTypes.hooks';

export function ServiceTypesListScreen() {
  const styles = createStyles();
  const { serviceTypes, loading, error, handleServiceTypePress } = useServiceTypes();

  const renderItem = ({ item }: { item: ServiceType }) => (
    <ServiceTypeCard name={item.name} onPress={() => handleServiceTypePress(item.id)} />
  );

  if (loading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading services..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState message={error} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none">
      <FlatList
        data={serviceTypes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </ScreenContainer>
  );
}

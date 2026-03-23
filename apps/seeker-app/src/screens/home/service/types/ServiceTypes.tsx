import { ActivityIndicator, FlatList, View } from 'react-native';
import type { ServiceType } from '@repo/types';
import { ServiceTypeCard, Typography } from '@repo/components';

import { useTheme } from '@repo/theme';

import { createStyles } from './ServiceTypes.styles';
import { useServiceTypes } from './ServiceTypes.hooks';

export function ServiceTypesListScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { serviceTypes, loading, error, handleServiceTypePress } = useServiceTypes();

  const renderItem = ({ item }: { item: ServiceType }) => (
    <ServiceTypeCard name={item.name} onPress={() => handleServiceTypePress(item.id)} />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
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

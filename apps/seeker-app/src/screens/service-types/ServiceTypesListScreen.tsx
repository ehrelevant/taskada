import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@repo/theme';
import { getServiceTypes, type ServiceType } from '@lib/helpers';
import { ServiceTypeCard, Typography } from '@repo/components';
import { useEffect, useState } from 'react';

export function ServiceTypesListScreen() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServiceTypes() {
      try {
        const types = await getServiceTypes();
        setServiceTypes(types);
      } catch {
        setError('Failed to load service types');
      } finally {
        setLoading(false);
      }
    }

    loadServiceTypes();
  }, []);

  const renderItem = ({ item }: { item: ServiceType }) => (
    <ServiceTypeCard name={item.name} iconUrl={item.iconUrl} onPress={() => {}} /> // eslint-disable-line @typescript-eslint/no-empty-function
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.m,
  },
  columnWrapper: {
    justifyContent: 'center',
    gap: spacing.s,
  },
});

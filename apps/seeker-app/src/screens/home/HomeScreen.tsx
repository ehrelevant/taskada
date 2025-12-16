import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { authClient } from '@lib/authClient';
import { Card, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';

// Mock data for services
const SERVICES = [
  { id: '1', name: 'Carpentry', icon: 'hammer' },
  { id: '2', name: 'Plumbing', icon: 'wrench' },
  { id: '3', name: 'House Cleaning', icon: 'broom' },
  { id: '4', name: 'Laundry', icon: 'tshirt' },
  { id: '5', name: 'Electrician', icon: 'lightning-bolt' },
];

export function HomeScreen() {
  const { data: session } = authClient.useSession();

  const renderItem = ({ item }: { item: typeof SERVICES[number] }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => Alert.alert('Coming Soon', `Searching for ${item.name}`)}
    >
      <Card elevation="s" style={styles.card}>
        {/* Placeholder for Icon */}
        <View style={styles.iconPlaceholder} />
        <Typography variant="body2" weight="medium" align="center">{item.name}</Typography>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h5">Hello, {session?.user?.name?.split(' ')[0]}!</Typography>
        <Typography variant="body2" color={colors.textSecondary}>What help do you need today?</Typography>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
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
  listContent: {
    padding: spacing.m,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    marginBottom: spacing.m,
  },
  card: {
    alignItems: 'center',
    padding: spacing.m,
    height: 100,
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    marginBottom: spacing.s,
  }
});
import { Alert, FlatList, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Card, Typography } from '@repo/components';
import { colors, palette, shadows, spacing } from '@repo/theme';
import { Pencil, Plus, Trash2, Wrench } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import { AddServiceModal, type ProviderService } from './AddServiceModal';

export function ServiceListScreen() {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderService | null>(null);

  const fetchServices = async () => {
    try {
      const res = await apiFetch('/services/my-services', 'GET');
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: ProviderService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (service: ProviderService) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to remove ${service.serviceType.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
             setServices(prev => prev.filter(s => s.id !== service.id));

             try {
                const res = await apiFetch(`/services/${service.id}`, 'DELETE');
                if (!res.ok) throw new Error();
             } catch {
                Alert.alert('Error', 'Failed to delete service');
                fetchServices(); // Revert logic by refreshing
             }
          }
        }
      ]
    );
  };

  const toggleService = async (id: string, currentStatus: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !currentStatus } : s))
    );

    try {
      const res = await apiFetch(`/services/${id}`, 'PATCH', { body: JSON.stringify({ isEnabled: !currentStatus }) });
      if (!res.ok) throw new Error('API Error');
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isEnabled: currentStatus } : s))
      );
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingService(null);
  };

  const renderItem = ({ item }: { item: ProviderService }) => (
    <Card style={styles.card} padding="m">
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Wrench color={colors.actionPrimary} size={24} />
        </View>
        <View style={styles.cardContent}>
          <Typography variant="h5">{item.serviceType.name}</Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            Starts at Php {item.initialCost}
          </Typography>
        </View>

        {/* Edit Actions */}
        <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
                <Pencil size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconButton}>
                <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Typography
          variant="caption"
          color={item.isEnabled ? colors.success : colors.textDisabled}
        >
          {item.isEnabled ? 'Active' : 'Disabled'}
        </Typography>
        <Switch
          trackColor={{ false: palette.gray300, true: colors.actionPrimary }}
          thumbColor={colors.white}
          value={item.isEnabled}
          onValueChange={() => toggleService(item.id, item.isEnabled)}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          fetchServices();
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Typography color={colors.textSecondary}>
              No services added yet. Tap + to start.
            </Typography>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
            setEditingService(null);
            setIsModalOpen(true);
        }}
        activeOpacity={0.8}
      >
        <Plus color={colors.white} size={32} />
      </TouchableOpacity>

      <AddServiceModal
        visible={isModalOpen}
        serviceToEdit={editingService}
        onClose={handleCloseModal}
        onSuccess={fetchServices}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  listContent: {
    padding: spacing.m,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  cardContent: {
    flex: 1,
  },
  headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
  },
  iconButton: {
      padding: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.s,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.l,
    right: spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.m,
  },
});
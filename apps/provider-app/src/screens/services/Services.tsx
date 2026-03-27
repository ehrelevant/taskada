import { BadgeCheck, CircleDollarSign, Pencil, Plus, Trash2, Wrench } from 'lucide-react-native';
import { Card, Typography } from '@repo/components';
import { FlatList, Switch, TouchableOpacity, View } from 'react-native';
import type { ProviderService } from '@repo/types';
import { useTheme } from '@repo/theme';

import { createStyles } from './Services.styles';
import { useServices } from './Services.hooks';

import { AddServiceModal } from './addModal/AddServiceModal';

export function ServicesScreen() {
  const { colors, shadows } = useTheme();
  const styles = createStyles(colors, shadows);

  const {
    services,
    isRefreshing,
    isModalOpen,
    editingService,
    fetchServices,
    handleEdit,
    handleDelete,
    toggleService,
    handleCloseModal,
    handleOpenModal,
  } = useServices();

  const renderItem = ({ item }: { item: ProviderService }) => (
    <Card style={styles.card} padding="m">
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Wrench color={colors.actionPrimary} size={24} />
        </View>
        <View style={styles.cardContent}>
          <Typography variant="h5">{item.serviceType.name}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <CircleDollarSign size={14} color={colors.actionPrimary} />
            <Typography variant="body2" color={colors.textSecondary}>
              Starts at PHP {item.initialCost.toLocaleString()}
            </Typography>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
            <Pencil size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconButton}>
            <Trash2 size={20} color={colors.error.base} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Typography variant="caption" color={item.isEnabled ? colors.success.base : colors.textDisabled}>
          {item.isEnabled ? 'Active' : 'Disabled'}
        </Typography>
        <Switch
          trackColor={{ false: colors.border, true: colors.actionPrimary }}
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={fetchServices}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <View style={styles.heroPill}>
              <BadgeCheck size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                provider services
              </Typography>
            </View>
            <Typography variant="h3" color="textInverse">
              Manage what you offer
            </Typography>
            <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
              Keep pricing and availability updated so seekers can discover you faster.
            </Typography>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Typography color={colors.textSecondary}>No services added yet. Tap + to start.</Typography>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleOpenModal} activeOpacity={0.8}>
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

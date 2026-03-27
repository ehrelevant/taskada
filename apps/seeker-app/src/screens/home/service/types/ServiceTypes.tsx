import { Compass, Search } from 'lucide-react-native';
import { EmptyState, ScreenContainer, Typography } from '@repo/components';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SERVICE_TYPE_ICONS, useTheme } from '@repo/theme';
import type { ServiceType } from '@repo/types';

import { createStyles } from './ServiceTypes.styles';
import { useServiceTypes } from './ServiceTypes.hooks';

export function ServiceTypesListScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { serviceTypes, loading, error, handleServiceTypePress } = useServiceTypes();

  const renderItem = ({ item }: { item: ServiceType }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleServiceTypePress(item.id)} activeOpacity={0.85}>
      <View style={styles.serviceCardIconShell}>
        {(() => {
          const IconComponent = SERVICE_TYPE_ICONS[item.name as keyof typeof SERVICE_TYPE_ICONS];
          if (!IconComponent) {
            return <View style={styles.serviceCardIconFallback} />;
          }

          return <IconComponent size={28} color={colors.actionPrimary} />;
        })()}
      </View>
      <Typography variant="subtitle2" weight="semiBold" align="center" numberOfLines={2}>
        {item.name}
      </Typography>
      <Typography variant="caption" color="textSecondary" align="center" numberOfLines={2}>
        {item.description || 'Tap to create a request in this category'}
      </Typography>
    </TouchableOpacity>
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
      <View style={styles.heroShell}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Compass size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              {serviceTypes.length} service categories
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse" style={styles.heroTitle}>
            Choose the service you need
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Pick a category to open a request and connect with nearby verified providers.
          </Typography>
        </View>
      </View>

      <View style={styles.listHeaderRow}>
        <Typography variant="h4">All Categories</Typography>
        <View style={styles.listHint}>
          <Search size={12} color={colors.textSecondary} />
          <Typography variant="caption" color="textSecondary">
            Tap any card
          </Typography>
        </View>
      </View>

      <FlatList
        data={serviceTypes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

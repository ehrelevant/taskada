import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Avatar, FeaturedServiceCard, Rating, SearchBar, ServiceTypeCard, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import type { FeaturedService, SearchResult, ServiceType } from '@repo/types';
import { useCallback, useMemo } from 'react';

import { styles } from './Home.styles';
import { useHomeScreen } from './Home.hooks';

export function HomeScreen() {
  const {
    session,
    profile,
    serviceTypes,
    featuredServices,
    searchQuery,
    searchResults,
    showSearchResults,
    loading,
    searchLoading,
    performSearch,
    clearSearch,
    navigateToService,
    handleServiceTypePress,
    navigateToServiceTypesList,
    serviceTypeKeyExtractor,
    featuredServiceKeyExtractor,
    searchResultKeyExtractor,
  } = useHomeScreen();

  const renderSearchResultItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => navigateToService(item.serviceId)}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="body2" weight="medium">
            {item.serviceTypeName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            by {item.providerName}
          </Typography>
        </View>
        <Rating value={item.avgRating} size={12} />
      </TouchableOpacity>
    ),
    [navigateToService],
  );

  const renderServiceTypeItem = useCallback(
    ({ item }: { item: ServiceType }) => (
      <ServiceTypeCard name={item.name} iconUrl={item.iconUrl} onPress={() => handleServiceTypePress(item.id)} />
    ),
    [handleServiceTypePress],
  );

  const renderFeaturedServiceItem = useCallback(
    ({ item }: { item: FeaturedService }) => (
      <FeaturedServiceCard
        serviceTypeName={item.serviceTypeName}
        providerName={item.providerName}
        providerAvatar={item.providerAvatar}
        rating={item.avgRating}
        reviewCount={item.reviewCount}
        serviceId={item.serviceId}
        onPress={() => navigateToService(item.serviceId)}
      />
    ),
    [navigateToService],
  );

  const serviceTypeListHeader = useMemo(
    () => (
      <View style={styles.sectionHeader}>
        <Typography variant="h6">Services</Typography>
        <TouchableOpacity onPress={navigateToServiceTypesList}>
          <Typography variant="body2" color="actionPrimary">
            View All
          </Typography>
        </TouchableOpacity>
      </View>
    ),
    [navigateToServiceTypesList],
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Avatar
            source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
            name={session?.user?.name + ' ' + session?.user?.lastName || 'User'}
            size={48}
          />
          <View style={{ marginLeft: spacing.s }}>
            <Typography variant="body1" color="textSecondary">
              Hello,
            </Typography>
            <Typography variant="h4">
              {session?.user?.name?.split(' ') + ' ' + session?.user?.lastName || 'User'}
            </Typography>
          </View>
        </View>
        <Typography variant="body1" color="textSecondary" style={{ marginTop: spacing.xs }}>
          What help do you need today?
        </Typography>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={performSearch}
          onClear={clearSearch}
          placeholder="Search services or providers..."
        />
        {showSearchResults && (
          <View style={styles.searchResults}>
            {searchLoading ? (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color={colors.actionPrimary} />
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={searchResultKeyExtractor}
                renderItem={renderSearchResultItem}
                keyboardShouldPersistTaps="handled"
                maxToRenderPerBatch={8}
                windowSize={5}
                initialNumToRender={5}
                removeClippedSubviews={true}
              />
            ) : (
              <View style={styles.noResults}>
                <Typography variant="body2" color="textSecondary">
                  No services found
                </Typography>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={serviceTypes}
        keyExtractor={serviceTypeKeyExtractor}
        numColumns={4}
        columnWrapperStyle={styles.serviceTypeGrid}
        contentContainerStyle={styles.serviceTypesContent}
        ListHeaderComponent={serviceTypeListHeader}
        renderItem={renderServiceTypeItem}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * Math.floor(index / 4),
          index,
        })}
        maxToRenderPerBatch={8}
        windowSize={6}
        initialNumToRender={12}
        removeClippedSubviews={true}
      />

      <View style={styles.section}>
        <Typography variant="h6" style={{ marginBottom: spacing.s }}>
          Featured Services
        </Typography>
        {featuredServices.length > 0 ? (
          <FlatList
            data={featuredServices}
            contentContainerStyle={{ gap: spacing.m, width: '100%' }}
            keyExtractor={featuredServiceKeyExtractor}
            renderItem={renderFeaturedServiceItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            maxToRenderPerBatch={4}
            windowSize={3}
            initialNumToRender={4}
            removeClippedSubviews={true}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No featured services available
          </Typography>
        )}
      </View>
    </View>
  );
}

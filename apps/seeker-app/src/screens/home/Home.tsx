import {
  Avatar,
  EmptyState,
  FeaturedServiceCard,
  Rating,
  ScreenContainer,
  SearchBar,
  SectionHeader,
  ServiceTypeCard,
  Typography,
} from '@repo/components';
import type { FeaturedService, SearchResult, ServiceType } from '@repo/types';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useTheme } from '@repo/theme';

import { createStyles } from './Home.styles';
import { useHome } from './Home.hooks';

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
  } = useHome();

  const renderSearchResultItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => navigateToService(item.serviceId)}
        activeOpacity={0.7}
      >
        <View style={styles.searchResultContent}>
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
    [navigateToService, styles.searchResultItem, styles.searchResultContent],
  );

  const renderServiceTypeItem = useCallback(
    ({ item }: { item: ServiceType }) => (
      <ServiceTypeCard name={item.name} onPress={() => handleServiceTypePress(item.id)} />
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
        onPress={() => navigateToService(item.serviceId)}
      />
    ),
    [navigateToService],
  );

  const serviceTypeListHeader = useMemo(
    () => <SectionHeader title="Services" onViewAllPress={navigateToServiceTypesList} />,
    [navigateToServiceTypesList],
  );

  if (loading) {
    return (
      <ScreenContainer useSafeArea={false} padding="none">
        <EmptyState loading />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padding="none">
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Avatar
            source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
            name={`${session?.user?.name ?? ''} ${session?.user?.lastName ?? ''}`.trim() || 'User'}
            size={56}
            borderColor={colors.secondary.base}
            borderWidth={3}
          />
          <View style={styles.greetingText}>
            <Typography variant="h2" color="textSecondary">
              Good morning,
            </Typography>
            <Typography variant="h1">
              {`${session?.user?.name ?? ''} ${session?.user?.lastName ?? ''}`.trim() || 'User'}
            </Typography>
          </View>
        </View>
        <Typography variant="body1" color="textSecondary" style={styles.subtitle}>
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
                <EmptyState loading loadingSize="small" />
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
              <EmptyState message="No services found" />
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

      <View style={styles.featuredSection}>
        <SectionHeader title="Featured Services" />
        {featuredServices.length > 0 ? (
          <FlatList
            data={featuredServices}
            contentContainerStyle={styles.featuredList}
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
          <EmptyState message="No featured services available" />
        )}
      </View>
    </ScreenContainer>
  );
}

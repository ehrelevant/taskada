import { Avatar, Button, EmptyState, Rating, ScreenContainer, SearchBar, Typography } from '@repo/components';
import { ChevronRight, Compass, ShieldCheck, Sparkles } from 'lucide-react-native';
import type { FeaturedService, SearchResult, ServiceType } from '@repo/types';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SERVICE_TYPE_ICONS, useTheme } from '@repo/theme';
import { useCallback, useMemo } from 'react';

import { createStyles } from './Home.styles';
import { useHome } from './Home.hooks';

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `PHP ${amount.toLocaleString()}`;
  }
}

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
    featuredServiceKeyExtractor,
    searchResultKeyExtractor,
  } = useHome();

  const fullName = useMemo(
    () => `${session?.user?.name ?? ''} ${session?.user?.lastName ?? ''}`.trim() || 'User',
    [session?.user?.lastName, session?.user?.name],
  );

  const firstName = useMemo(() => session?.user?.name?.trim() || 'there', [session?.user?.name]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }, []);

  const highlightedServiceTypes = useMemo(() => serviceTypes.slice(0, 6), [serviceTypes]);
  const highlightedFeatured = useMemo(() => featuredServices.slice(0, 8), [featuredServices]);

  const handlePrimaryQuickAction = useCallback(() => {
    const firstServiceType = serviceTypes[0];
    if (firstServiceType) {
      handleServiceTypePress(firstServiceType.id);
      return;
    }

    navigateToServiceTypesList();
  }, [handleServiceTypePress, navigateToServiceTypesList, serviceTypes]);

  const renderSearchResultItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => navigateToService(item.serviceId)}
        activeOpacity={0.7}
      >
        <Avatar
          source={item.providerAvatar ? { uri: item.providerAvatar } : null}
          name={item.providerName}
          size={34}
        />
        <View style={styles.searchResultContent}>
          <Typography variant="body2" weight="semiBold" numberOfLines={1}>
            {item.serviceName}
          </Typography>
          <Typography variant="caption" color="textSecondary" numberOfLines={1}>
            {item.serviceTypeName} by {item.providerName}
          </Typography>
        </View>
        <View style={styles.searchResultMeta}>
          <Rating value={item.avgRating} size={12} />
          <Typography variant="caption" color="textSecondary" style={styles.searchPrice}>
            {formatCurrency(item.initialCost)}
          </Typography>
        </View>
      </TouchableOpacity>
    ),
    [
      navigateToService,
      styles.searchPrice,
      styles.searchResultContent,
      styles.searchResultItem,
      styles.searchResultMeta,
    ],
  );

  const renderFeaturedServiceItem = useCallback(
    ({ item }: { item: FeaturedService }) => (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => navigateToService(item.serviceId)}
        activeOpacity={0.85}
      >
        <Typography variant="overline" color={colors.home.chipText}>
          {item.serviceTypeName}
        </Typography>
        <Typography variant="subtitle1" numberOfLines={1} style={styles.featuredTitle}>
          {item.serviceName}
        </Typography>
        <View style={styles.featuredProviderRow}>
          <Avatar
            source={item.providerAvatar ? { uri: item.providerAvatar } : null}
            name={item.providerName}
            size={28}
          />
          <Typography variant="body2" weight="medium" numberOfLines={1} style={styles.featuredProviderName}>
            {item.providerName}
          </Typography>
        </View>
        <View style={styles.featuredMetaRow}>
          <Rating value={item.avgRating} reviewCount={item.reviewCount} size={12} />
          <Typography variant="subtitle2" color="actionPrimary">
            {formatCurrency(item.initialCost)}
          </Typography>
        </View>
      </TouchableOpacity>
    ),
    [
      colors.home.chipText,
      navigateToService,
      styles.featuredCard,
      styles.featuredMetaRow,
      styles.featuredProviderName,
      styles.featuredProviderRow,
      styles.featuredTitle,
    ],
  );

  const renderServiceTypeTile = useCallback(
    (item: ServiceType) => {
      const IconComponent = SERVICE_TYPE_ICONS[item.name as keyof typeof SERVICE_TYPE_ICONS];

      return (
        <TouchableOpacity
          key={item.id}
          style={styles.serviceTypeTile}
          activeOpacity={0.85}
          onPress={() => handleServiceTypePress(item.id)}
        >
          <View style={styles.serviceTypeIconShell}>
            {IconComponent ? (
              <IconComponent size={30} color={colors.actionPrimary} />
            ) : (
              <View style={styles.serviceTypeFallback} />
            )}
          </View>
          <Typography variant="body2" weight="semiBold" align="center" numberOfLines={2}>
            {item.name}
          </Typography>
        </TouchableOpacity>
      );
    },
    [
      colors.actionPrimary,
      handleServiceTypePress,
      styles.serviceTypeFallback,
      styles.serviceTypeIconShell,
      styles.serviceTypeTile,
    ],
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
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={performSearch}
          onClear={clearSearch}
          placeholder="Search service, provider, or task"
          containerStyle={styles.searchBar}
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
              <View style={styles.searchEmpty}>
                <EmptyState message="No services found" />
              </View>
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.heroCard}>
            <View style={styles.profileRow}>
              <View style={styles.profileLeft}>
                <Avatar
                  source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
                  name={fullName}
                  size={56}
                  borderColor={colors.home.heroAccent}
                  borderWidth={3}
                />
                <View style={styles.profileCopy}>
                  <Typography variant="caption" color={colors.home.chipText}>
                    {greeting}
                  </Typography>
                  <Typography variant="h3" color="textInverse" numberOfLines={1}>
                    {firstName}
                  </Typography>
                </View>
              </View>
              <TouchableOpacity style={styles.heroBrowsePill} onPress={navigateToServiceTypesList} activeOpacity={0.8}>
                <Compass size={16} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  Browse
                </Typography>
              </TouchableOpacity>
            </View>

            <Typography variant="subtitle1" color="textInverse" style={styles.heroTitle}>
              What should we fix for you today?
            </Typography>

            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Sparkles size={14} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  {serviceTypes.length} categories
                </Typography>
              </View>
              <View style={styles.heroBadge}>
                <ShieldCheck size={14} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  Trusted providers
                </Typography>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Typography variant="h4">Start Fast</Typography>
          <TouchableOpacity onPress={navigateToServiceTypesList} style={styles.sectionAction} activeOpacity={0.8}>
            <Typography variant="caption" color="actionPrimary">
              Explore all
            </Typography>
            <ChevronRight size={14} color={colors.actionPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionGrid}>
          <TouchableOpacity style={styles.quickActionCardPrimary} onPress={handlePrimaryQuickAction} activeOpacity={0.85}>
            <Typography variant="overline" color="textInverse">
              Quick Request
            </Typography>
            <Typography variant="subtitle2" color="textInverse" style={styles.quickActionTitle}>
              Request your next service in minutes
            </Typography>
            <View style={styles.quickActionFooter}>
              <Typography variant="caption" color="textInverse">
                Start now
              </Typography>
              <ChevronRight size={16} color={colors.textInverse} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCardSecondary}
            onPress={navigateToServiceTypesList}
            activeOpacity={0.85}
          >
            <Typography variant="overline" color="textSecondary">
              Discover
            </Typography>
            <Typography variant="subtitle2" style={styles.quickActionTitle}>
              Browse every category and compare providers
            </Typography>
            <View style={styles.quickActionFooter}>
              <Typography variant="caption" color="actionPrimary">
                View categories
              </Typography>
              <ChevronRight size={16} color={colors.actionPrimary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Typography variant="h4">Popular Categories</Typography>
        </View>

        <View style={styles.serviceGrid}>{highlightedServiceTypes.map(renderServiceTypeTile)}</View>

        {serviceTypes.length > highlightedServiceTypes.length && (
          <Button
            title={`See all ${serviceTypes.length} service categories`}
            variant="primary"
            size="medium"
            fullWidth
            rightIcon={<ChevronRight size={18} color={colors.textInverse} />}
            onPress={navigateToServiceTypesList}
          />
        )}

        <View style={styles.sectionRow}>
          <Typography variant="h4">Featured Right Now</Typography>
        </View>

        {featuredServices.length > 0 ? (
          <FlatList
            data={highlightedFeatured}
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
          <View style={styles.inlineEmptyState}>
            <EmptyState message="No featured services available" />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

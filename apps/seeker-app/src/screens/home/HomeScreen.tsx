import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { authClient } from '@lib/authClient';
import { Avatar, FeaturedServiceCard, Rating, SearchBar, ServiceTypeCard, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { type FeaturedService, getFeaturedServices, getServiceTypes, type SearchResult, type ServiceType, searchServices } from '@lib/helpers';
import { HomeStackParamList } from '@navigation/HomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data: session } = authClient.useSession();

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [typesData, featuredData] = await Promise.all([getServiceTypes(), getFeaturedServices(10)]);
        setServiceTypes(typesData);
        setFeaturedServices(featuredData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const performSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchServices(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  const navigateToService = (serviceId: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
    navigation.navigate('ServiceDetails', { serviceId });
  };

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
            source={session?.user?.image ? { uri: session.user.image } : null}
            name={session?.user?.name + ' ' + session?.user?.lastName || 'User'}
            size={48}
          />
          <View style={{ marginLeft: spacing.s }}>
            <Typography variant="body1" color="textSecondary">
              Hello,
            </Typography>
            <Typography variant="h4">{session?.user?.name?.split(' ') + ' ' + session?.user?.lastName || 'User'}</Typography>
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
                keyExtractor={item => item.serviceId}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.searchResultItem} onPress={() => navigateToService(item.serviceId)}>
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
                )}
                keyboardShouldPersistTaps="handled"
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
        keyExtractor={item => item.id}
        numColumns={4}
        columnWrapperStyle={styles.serviceTypeGrid}
        contentContainerStyle={styles.serviceTypesContent}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Typography variant="h6">Services</Typography>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceTypesList')}>
              <Typography variant="body2" color="actionPrimary">
                View All
              </Typography>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <ServiceTypeCard
            name={item.name}
            iconUrl={item.iconUrl}
            onPress={() => {
              navigation.navigate('ServiceTypesList');
            }}
          />
        )}
      />

      <View style={styles.section}>
        <Typography variant="h6" style={{ marginBottom: spacing.s }}>
          Featured Services
        </Typography>
        {featuredServices.length > 0 ? (
          <FlatList
            data={featuredServices}
            keyExtractor={item => item.serviceId}
            renderItem={({ item }) => (
              <FeaturedServiceCard
                serviceTypeName={item.serviceTypeName}
                providerName={item.providerName}
                providerAvatar={item.providerAvatar}
                rating={item.avgRating}
                reviewCount={item.reviewCount}
                serviceId={item.serviceId}
                onPress={() => navigateToService(item.serviceId)}
                style={{ marginRight: spacing.s }}
              />
            )}
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

const radius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.l,
    paddingBottom: spacing.s,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  searchResults: {
    position: 'absolute',
    top: 60,
    left: spacing.m,
    right: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 300,
    zIndex: 1000,
  },
  searchLoading: {
    padding: spacing.m,
    alignItems: 'center',
  },
  noResults: {
    padding: spacing.m,
    alignItems: 'center',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceTypeGrid: {
    justifyContent: 'center',
    gap: spacing.m,
  },
  serviceTypesContent: {
    width: '100%',
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.s,
  },
  section: {
    padding: spacing.m,
  },
});

import { authClient } from '@lib/authClient';
import type { FeaturedService, SearchResult, ServiceType } from '@repo/types';
import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

interface UserProfile {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export function useHome() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data: session } = authClient.useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (session) {
      seekerClient
        .apiFetch('/users/profile', 'GET')
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(console.error);
    }
  }, [session]);

  useEffect(() => {
    async function loadData() {
      try {
        const [typesData, featuredData] = await Promise.all([
          seekerClient.getServiceTypes(),
          seekerClient.getFeaturedServices(10),
        ]);
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
      const results = await seekerClient.searchServices(query);
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

  const navigateToService = useCallback(
    (serviceId: string) => {
      setShowSearchResults(false);
      setSearchQuery('');
      setSearchResults([]);
      navigation.navigate('ServiceDetails', { serviceId });
    },
    [navigation],
  );

  const handleServiceTypePress = useCallback(
    (serviceTypeId: string) => {
      navigation.navigate('RequestForm', { serviceTypeId });
    },
    [navigation],
  );

  const navigateToServiceTypesList = useCallback(() => {
    navigation.navigate('ServiceTypesList');
  }, [navigation]);

  const serviceTypeKeyExtractor = useCallback((item: ServiceType) => item.id, []);
  const featuredServiceKeyExtractor = useCallback((item: FeaturedService) => item.serviceId, []);
  const searchResultKeyExtractor = useCallback((item: SearchResult) => item.serviceId, []);

  return {
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
  };
}

import * as ImagePicker from 'expo-image-picker';
import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type RequestFormData, requestFormSchema } from '@repo/shared';
import type { RouteProp } from '@react-navigation/native';
import type { SearchResult } from '@repo/types';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';

export function useRequestForm() {
  const route = useRoute<RouteProp<HomeStackParamList, 'RequestForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'RequestForm'>>();
  const { serviceTypeId: initialServiceTypeId, serviceId: initialServiceId } = route.params || {};

  const [showServiceSearch, setShowServiceSearch] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<SearchResult | null>(null);
  const [serviceSearchResults, setServiceSearchResults] = useState<SearchResult[]>([]);
  const [serviceSearchLoading, setServiceSearchLoading] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const initialLoadAttempted = useRef(false);

  const methods = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      serviceTypeId: initialServiceTypeId || '',
      serviceId: initialServiceId || undefined,
      description: '',
      latitude: 0,
      longitude: 0,
      addressLabel: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedServiceId = watch('serviceId');

  useEffect(() => {
    if (initialLoadAttempted.current) return;
    initialLoadAttempted.current = true;

    if (initialServiceId) {
      loadInitialService(initialServiceId);
    }
  }, []);

  const loadInitialService = async (serviceId: string) => {
    try {
      const results = await seekerClient.searchServices('', undefined);
      const found = results.find(s => s.serviceId === serviceId);
      if (found) {
        setSelectedService(found);
      }
    } catch (error) {
      console.error('Failed to load initial service:', error);
    }
  };

  const watchedServiceLoadAttempted = useRef<string | null>(null);

  useEffect(() => {
    if (watchedServiceId && watchedServiceId !== watchedServiceLoadAttempted.current) {
      watchedServiceLoadAttempted.current = watchedServiceId;
      loadInitialService(watchedServiceId);
    }
  }, [watchedServiceId]);

  const handleLocationUpdate = useCallback(
    (lat: number, lng: number, address: string) => {
      setValue('latitude', lat);
      setValue('longitude', lng);
      setValue('addressLabel', address);
    },
    [setValue],
  );

  const searchServicesForSelection = useCallback(
    async (query: string) => {
      setServiceSearchQuery(query);
      if (!query.trim()) {
        setServiceSearchResults([]);
        return;
      }

      setServiceSearchLoading(true);
      try {
        const results = await seekerClient.searchServices(query, initialServiceTypeId);
        setServiceSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setServiceSearchLoading(false);
      }
    },
    [initialServiceTypeId],
  );

  const handleServiceSelect = useCallback(
    (service: SearchResult) => {
      setSelectedService(service);
      setValue('serviceId', service.serviceId);
      setShowServiceSearch(false);
      setServiceSearchResults([]);
      setServiceSearchQuery('');
    },
    [setValue],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedService(null);
    setValue('serviceId', undefined);
  }, [setValue]);

  const pickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(a => a.uri);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
    }
  }, [images]);

  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
    },
    [images],
  );

  const onSubmit = useCallback(
    async (data: RequestFormData) => {
      try {
        setLoading(true);

        const newRequest = await seekerClient.createRequest(data);

        if (images.length > 0) {
          await seekerClient.uploadRequestImages(newRequest.id, images);
        }

        navigation.getParent()?.navigate('BookingStack', {
          screen: 'Standby',
          params: { requestId: newRequest.id },
        });
      } catch (error) {
        console.error('Failed to create request:', error);
      } finally {
        setLoading(false);
      }
    },
    [images, navigation],
  );

  return {
    methods,
    errors,
    isSubmitting,
    loading,
    showServiceSearch,
    setShowServiceSearch,
    images,
    selectedService,
    serviceSearchResults,
    serviceSearchLoading,
    serviceSearchQuery,
    selectedImage,
    setSelectedImage,
    handleLocationUpdate,
    searchServicesForSelection,
    handleServiceSelect,
    handleClearSelection,
    pickImages,
    removeImage,
    handleSubmit: handleSubmit(onSubmit),
  };
}

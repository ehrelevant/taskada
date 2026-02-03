import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Input, Typography } from '@repo/components';
import { Camera, X } from 'lucide-react-native';
import { colors, radius, spacing } from '@repo/theme';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { createRequest, type SearchResult, searchServices } from '@lib/helpers';
import { HomeStackParamList } from '@navigation/HomeStack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type RequestFormData, requestFormSchema } from '@lib/validators';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';

import { MapSection } from './components/MapSection';
import { ServiceSelection } from './components/ServiceSelection';

type RequestFormRouteProp = RouteProp<HomeStackParamList, 'RequestForm'>;

export function RequestFormScreen() {
  const route = useRoute<RequestFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'RequestForm'>>();
  const { serviceTypeId: initialServiceTypeId, serviceId: initialServiceId } = route.params || {};

  const [showServiceSearch, setShowServiceSearch] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<SearchResult | null>(null);
  const [serviceSearchResults, setServiceSearchResults] = useState<SearchResult[]>([]);
  const [serviceSearchLoading, setServiceSearchLoading] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const initialLoadAttempted = useRef(false);

  const methods = useForm<RequestFormData>({
    resolver: valibotResolver(requestFormSchema),
    defaultValues: {
      serviceTypeId: initialServiceTypeId || '',
      serviceId: initialServiceId || undefined,
      description: '',
      latitude: 0,
      longitude: 0,
      addressLabel: '',
      imageUrls: [],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialService = async (serviceId: string) => {
    try {
      const results = await searchServices('', undefined);
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

  const searchServicesForSelection = async (query: string) => {
    setServiceSearchQuery(query);
    if (!query.trim()) {
      setServiceSearchResults([]);
      return;
    }

    setServiceSearchLoading(true);
    try {
      const results = await searchServices(query, initialServiceTypeId);
      setServiceSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setServiceSearchLoading(false);
    }
  };

  const handleServiceSelect = (service: SearchResult) => {
    setSelectedService(service);
    setValue('serviceId', service.serviceId);
    setShowServiceSearch(false);
    setServiceSearchResults([]);
    setServiceSearchQuery('');
  };

  const handleClearSelection = () => {
    setSelectedService(null);
    setValue('serviceId', undefined);
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(a => a.uri);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setValue('imageUrls', updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue('imageUrls', updatedImages);
  };

  const onSubmit = async (data: RequestFormData) => {
    try {
      setLoading(true);
      await createRequest(data);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
      <FormProvider {...methods}>
        <View style={styles.container}>
          <MapSection onLocationUpdate={handleLocationUpdate} />

          <View style={styles.formSection}>
            <Controller
              control={methods.control}
              name="addressLabel"
              render={({
                field: { onChange, value },
              }: {
                field: { onChange: (val: string) => void; value: string };
              }) => (
                <Input
                  label="Address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.addressLabel?.message}
                  placeholder="Enter your address"
                  containerStyle={styles.input}
                />
              )}
            />

            <ServiceSelection
              onOpenSearch={() => setShowServiceSearch(true)}
              selectedService={selectedService}
              onClearSelection={handleClearSelection}
            />

            <Controller
              control={methods.control}
              name="description"
              render={({
                field: { onChange, value },
              }: {
                field: { onChange: (val: string) => void; value: string };
              }) => (
                <Input
                  label="Service Description *"
                  value={value}
                  onChangeText={onChange}
                  error={errors.description?.message}
                  placeholder="Describe what you need..."
                  multiline
                  numberOfLines={4}
                  containerStyle={styles.input}
                />
              )}
            />

            <View style={styles.imageSection}>
              <Typography variant="body2" color="textSecondary">
                Images (optional)
              </Typography>
              <FlatList
                horizontal
                data={images}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item }} style={styles.image} />
                    <TouchableOpacity style={styles.removeImage} onPress={() => removeImage(index)}>
                      <X size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}
                ListFooterComponent={
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
                    <Camera size={24} color={colors.actionPrimary} />
                    <Typography variant="caption" color="actionPrimary" style={{ marginTop: 4 }}>
                      Add
                    </Typography>
                  </TouchableOpacity>
                }
                contentContainerStyle={styles.imageList}
              />
            </View>

            <Button
              title="Request a Booking"
              onPress={handleSubmit(onSubmit)}
              isLoading={loading || isSubmitting}
              disabled={loading || isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </FormProvider>

      <Modal animationType="slide" visible={showServiceSearch}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Typography variant="h6">Select a Service</Typography>
            <TouchableOpacity onPress={() => setShowServiceSearch(false)}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalInner}>
            <Input
              value={serviceSearchQuery}
              onChangeText={searchServicesForSelection}
              placeholder="Search for services..."
              autoFocus
            />

            {serviceSearchLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={colors.actionPrimary} />
              </View>
            ) : (
              <FlatList
                data={serviceSearchResults}
                keyExtractor={item => item.serviceId}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.serviceResult} onPress={() => handleServiceSelect(item)}>
                    <View style={styles.serviceResultContent}>
                      <Typography variant="body1" weight="medium">
                        {item.serviceTypeName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {item.providerName}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  serviceSearchQuery.trim() ? (
                    <Typography variant="body2" color="textSecondary" style={styles.noResults}>
                      No services found
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary" style={styles.hintText}>
                      Search to find specific services
                    </Typography>
                  )
                }
                contentContainerStyle={styles.modalList}
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formSection: {
    flex: 1,
    padding: spacing.m,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    marginTop: spacing.s,
  },
  input: {
    marginBottom: spacing.s,
  },
  imageSection: {
    marginVertical: spacing.s,
  },
  imageList: {
    marginTop: spacing.s,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.s,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.s,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  submitButton: {
    marginTop: spacing.l,
  },
  modalContainer: {
    flex: 1,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
  },
  modalInner: {
    flex: 1,
    padding: spacing.s,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalList: {
    padding: spacing.m,
  },
  serviceResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceResultContent: {
    flex: 1,
  },
  noResults: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  hintText: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

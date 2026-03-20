import { ActivityIndicator, FlatList, Image, Modal, TouchableOpacity, View } from 'react-native';
import { Button, ImageViewer, Input, Typography } from '@repo/components';
import { Camera, X } from 'lucide-react-native';
import { colors } from '@repo/theme';
import { Controller, FormProvider } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { styles } from './RequestForm.styles';
import { useRequestForm } from './RequestForm.hooks';

import { MapSection } from './mapSection/MapSection';
import { ServiceSelection } from './serviceSelection/ServiceSelection';

export function RequestFormScreen() {
  const {
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
    handleSubmit,
  } = useRequestForm();

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
                    <TouchableOpacity onPress={() => setSelectedImage(item)} activeOpacity={0.8}>
                      <Image source={{ uri: item }} style={styles.image} />
                    </TouchableOpacity>
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
              onPress={handleSubmit}
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

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </KeyboardAwareScrollView>
  );
}

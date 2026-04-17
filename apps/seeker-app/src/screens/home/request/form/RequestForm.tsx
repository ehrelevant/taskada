import { ActivityIndicator, FlatList, Image, Modal, TouchableOpacity, View } from 'react-native';
import { Button, ImageViewer, Input, Rating, ScreenContainer, Typography } from '@repo/components';
import { Controller, FormProvider } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestForm.styles';
import { useRequestForm } from './RequestForm.hooks';

import { MapSection } from './mapSection/MapSection';
import { ServiceSelection } from './serviceSelection/ServiceSelection';

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

export function RequestFormScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
    handleAddressChange,
    forwardedCoords,
    searchServicesForSelection,
    handleServiceSelect,
    handleClearSelection,
    pickImages,
    removeImage,
    handleSubmit,
  } = useRequestForm();

  return (
    <ScreenContainer keyboardAware edges={['left', 'right']} contentPadding="m">
      <FormProvider {...methods}>
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <Typography variant="h3" color="textInverse">
              Tell us what you need
            </Typography>
            <Typography variant="body2" color="textInverse">
              Share location, choose a service, and add details so providers can respond faster.
            </Typography>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Location</Typography>
              <Typography variant="caption" color="textSecondary">
                Drag the map marker
              </Typography>
            </View>

            <View style={styles.mapContainer}>
              <MapSection onLocationUpdate={handleLocationUpdate} forwardedCoords={forwardedCoords} />
            </View>

            <Controller
              control={methods.control}
              name="addressLabel"
              render={({ field: { value } }: { field: { value: string } }) => (
                <Input
                  label="Address"
                  value={value}
                  onChangeText={handleAddressChange}
                  error={errors.addressLabel?.message}
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={5}
                  style={{ minHeight: 80 }}
                />
              )}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Service Details</Typography>
            </View>

            {/* TODO: Add service type selection */}

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
                  placeholder="Describe what you need done, preferred timing, and important notes."
                  multiline
                  numberOfLines={5}
                  style={{ minHeight: 80 }}
                />
              )}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Attachments</Typography>
              <Typography variant="caption" color="textSecondary">
                Optional Photos
              </Typography>
            </View>

            <View>
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
                    <ImagePlus size={24} color={colors.actionPrimary} />
                    <Typography variant="caption" color="actionPrimary">
                      Add
                    </Typography>
                  </TouchableOpacity>
                }
                contentContainerStyle={styles.imageList}
              />
            </View>
          </View>

          <View style={styles.submitSection}>
            <Button
              title="Request a Booking"
              onPress={handleSubmit}
              isLoading={loading || isSubmitting}
              disabled={loading || isSubmitting}
            />

            <Typography variant="caption" color="textSecondary" align="center">
              Submitting will notify matching providers and move you to standby.
            </Typography>
          </View>
        </View>
      </FormProvider>

      <Modal animationType="slide" visible={showServiceSearch}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeroCard}>
            <View style={styles.modalHeaderTopRow}>
              <Typography variant="h3" color="textInverse">
                Select a Service
              </Typography>
              <TouchableOpacity onPress={() => setShowServiceSearch(false)}>
                <X size={24} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            <Typography variant="body2" color="textInverse">
              Search by service type and choose the best provider for your request.
            </Typography>
          </View>

          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowServiceSearch(false)}>
              <Typography variant="body2" color="actionPrimary">
                Close
              </Typography>
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
                      <Typography variant="body1" weight="semiBold" numberOfLines={1}>
                        {item.serviceTypeName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" numberOfLines={1}>
                        {item.providerName}
                      </Typography>
                      <View style={styles.serviceResultMeta}>
                        <Rating value={item.avgRating} size={12} />
                        <Typography variant="caption" color="actionPrimary">
                          {formatCurrency(item.initialCost)}
                        </Typography>
                      </View>
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
        </SafeAreaView>
      </Modal>

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </ScreenContainer>
  );
}

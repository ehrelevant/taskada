import { ActivityIndicator, FlatList, Image, Modal, TouchableOpacity, View } from 'react-native';
import { Button, ImageViewer, Input, Rating, Typography } from '@repo/components';
import { Controller, FormProvider } from 'react-hook-form';
import { ImagePlus, LocateFixed, Search, ShieldCheck, Sparkles, X } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
          <View style={styles.heroCard}>
            <View style={styles.heroPill}>
              <Sparkles size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                smart request flow
              </Typography>
            </View>
            <Typography variant="h3" color="textInverse" style={styles.heroTitle}>
              Tell us what you need
            </Typography>
            <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
              Share location, choose a service, and add details so providers can respond faster.
            </Typography>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <ShieldCheck size={14} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  verified providers
                </Typography>
              </View>
              <View style={styles.heroBadge}>
                <LocateFixed size={14} color={colors.home.chipText} />
                <Typography variant="caption" color={colors.home.chipText}>
                  precise location pin
                </Typography>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Location</Typography>
              <Typography variant="caption" color="textSecondary">
                Drag the map marker
              </Typography>
            </View>

            <View style={styles.mapContainer}>
              <MapSection onLocationUpdate={handleLocationUpdate} />
            </View>

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
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Service Details</Typography>
              <View style={styles.sectionHintPill}>
                <Search size={12} color={colors.textSecondary} />
                <Typography variant="caption" color="textSecondary">
                  optional provider selection
                </Typography>
              </View>
            </View>

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
                  placeholder="Describe what you need done, preferred timing, and important notes"
                  multiline
                  numberOfLines={5}
                  containerStyle={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Typography variant="h5">Attachments</Typography>
              <Typography variant="caption" color="textSecondary">
                optional photos
              </Typography>
            </View>

            <View style={styles.imageSection}>
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
                    <Typography variant="caption" color="actionPrimary" style={styles.addImageLabel}>
                      Add
                    </Typography>
                  </TouchableOpacity>
                }
                contentContainerStyle={styles.imageList}
              />
            </View>
          </View>

          <Button
            title="Request a Booking"
            onPress={handleSubmit}
            isLoading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            style={styles.submitButton}
          />

          <Typography variant="caption" color="textSecondary" align="center" style={styles.footerNote}>
            Submitting will notify matching providers and move you to standby.
          </Typography>
        </View>
      </FormProvider>

      <Modal animationType="slide" visible={showServiceSearch}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Typography variant="h6">Select a Service</Typography>
              <Typography variant="caption" color="textSecondary" style={styles.modalSubtext}>
                Search by service type or provider
              </Typography>
            </View>
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

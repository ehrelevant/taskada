import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Modal, TextInput, View } from 'react-native';
import { Button, ScreenContainer, Typography } from '@repo/components';
import { CircleDollarSign, FileText, MapPin } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '@repo/theme';

import { createStyles } from './BookingFinalize.styles';
import { useBookingFinalize } from './BookingFinalize.hooks';

export function BookingFinalizeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
    serviceCost,
    serviceSpecifications,
    setServiceSpecifications,
    isSubmitting,
    showWaitingModal,
    latitude,
    longitude,
    seekerLocation,
    handleSubmit,
    handleCostChange,
  } = useBookingFinalize();

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            Finalize this service proposal
          </Typography>
          <Typography variant="body2" color="textInverse">
            Share clear cost and specifications so the seeker can approve quickly.
          </Typography>
        </View>

        <View style={styles.mapSection}>
          <Typography variant="subtitle1" style={styles.sectionTitle}>
            Service Location
          </Typography>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          </View>
          <View style={styles.locationTextContainer}>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.actionPrimary} />
              <Typography variant="body2" color="textSecondary">
                {seekerLocation.label || 'Location not specified'}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelRow}>
              <CircleDollarSign size={14} color={colors.actionPrimary} />
              <Typography variant="subtitle2" style={styles.inputLabel}>
                Service Cost (PHP) *
              </Typography>
            </View>
            <View style={styles.costInputContainer}>
              <Typography variant="h6" style={styles.currencySymbol}>
                ₱
              </Typography>
              <TextInput
                style={styles.costInput}
                value={serviceCost}
                onChangeText={handleCostChange}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputLabelRow}>
              <FileText size={14} color={colors.actionPrimary} />
              <Typography variant="subtitle2" style={styles.inputLabel}>
                Service Specifications *
              </Typography>
            </View>
            <TextInput
              style={styles.specificationsInput}
              value={serviceSpecifications}
              onChangeText={setServiceSpecifications}
              placeholder="Describe the service details, what will be done, materials needed, etc."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        <Button
          title="Submit Service Cost and Specs"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={!serviceCost.trim() || !serviceSpecifications.trim()}
        />
      </KeyboardAwareScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showWaitingModal}
        onRequestClose={() => {
          return;
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={colors.actionPrimary} style={styles.modalLoader} />
            <Typography variant="h4" color="actionPrimary" style={styles.modalTitle}>
              Waiting for Response
            </Typography>
            <Typography variant="body1" color={colors.textSecondary} style={styles.modalText}>
              Waiting for the seeker to agree with the service cost and details submitted.
            </Typography>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

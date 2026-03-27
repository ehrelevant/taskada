import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CircleDollarSign, FileText, Flag, MapPin, ShieldCheck } from 'lucide-react-native';
import { Button, Header, Typography } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    handleGoBack,
    handleReport,
  } = useBookingFinalize();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Finalize Service Details"
        size="small"
        leftContent={
          <TouchableOpacity onPress={handleGoBack} style={styles.iconButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Flag size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <View style={styles.heroPill}>
              <ShieldCheck size={14} color={colors.home.chipText} />
              <Typography variant="caption" color={colors.home.chipText}>
                final review before approval
              </Typography>
            </View>
            <Typography variant="h3" color="textInverse">
              Finalize this service proposal
            </Typography>
            <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
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
        </ScrollView>

        <View style={styles.submitContainer}>
          <Button
            title="Submit Service Cost and Specs"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={!serviceCost.trim() || !serviceSpecifications.trim()}
          />
        </View>
      </KeyboardAvoidingView>

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
            <Typography variant="h6" style={styles.modalTitle}>
              Waiting for Response
            </Typography>
            <Typography variant="body1" color={colors.textSecondary} style={styles.modalText}>
              Waiting for the seeker to agree with the service cost and details submitted
            </Typography>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

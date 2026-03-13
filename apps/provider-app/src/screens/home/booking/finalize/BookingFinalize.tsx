import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RequestsStackParamList } from '@navigation/RequestsStack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { styles } from './BookingFinalize.styles';

type FinalizeDetailsRouteProp = RouteProp<RequestsStackParamList, 'FinalizeDetails'>;
type FinalizeDetailsNavigationProp = NativeStackNavigationProp<RequestsStackParamList, 'FinalizeDetails'>;

export function FinalizeDetailsScreen() {
  const route = useRoute<FinalizeDetailsRouteProp>();
  const navigation = useNavigation<FinalizeDetailsNavigationProp>();
  const { bookingId, seekerLocation, otherUser, requestId } = route.params;

  const [serviceCost, setServiceCost] = useState('');
  const [serviceSpecifications, setServiceSpecifications] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);

  // Parse coordinates (stored as [lng, lat] in database, MapView expects {latitude, longitude})
  const [longitude, latitude] = seekerLocation.coordinates;

  // WebSocket setup for waiting modal
  useEffect(() => {
    if (!showWaitingModal) return;

    const setupSocket = async () => {
      const session = await authClient.getSession();
      const userId = session.data?.user?.id;
      if (!userId) return;

      await providerClient.connectChat(authClient.getCookie(), userId, 'provider');
      providerClient.joinBooking(bookingId);

      providerClient.onProposalDeclined(data => {
        if (data.bookingId === bookingId) {
          setShowWaitingModal(false);
          Alert.alert(
            'Proposal Declined',
            'The seeker has declined your service proposal. You can discuss further in chat.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.replace('Chat', {
                    bookingId,
                    otherUser,
                    requestId,
                    address: seekerLocation,
                  });
                },
              },
            ],
          );
        }
      });

      providerClient.onProposalAccepted(data => {
        if (data.bookingId === bookingId) {
          setShowWaitingModal(false);
          navigation.replace('BookingTransit', {
            bookingId,
            seekerLocation: data.seekerLocation,
            address: seekerLocation,
          });
        }
      });
    };

    setupSocket();

    return () => {
      providerClient.leaveBooking(bookingId);
      providerClient.removeAllListeners();
      providerClient.disconnectChat();
    };
  }, [showWaitingModal, bookingId, otherUser, requestId, seekerLocation, navigation]);

  const handleSubmit = async () => {
    if (!serviceCost.trim() || !serviceSpecifications.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/proposal`, 'PATCH', {
        body: JSON.stringify({
          cost: parseFloat(serviceCost),
          specifications: serviceSpecifications,
        }),
      });

      if (response.ok) {
        // Show waiting modal instead of navigating
        setShowWaitingModal(true);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to submit proposal:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          bookingId,
          cost: parseFloat(serviceCost),
        });
      }
    } catch (error) {
      console.error('Error submitting proposal:', {
        error,
        bookingId,
        cost: parseFloat(serviceCost),
        specifications: serviceSpecifications,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    return numericValue;
  };

  const handleCostChange = (text: string) => {
    const formatted = formatCurrency(text);
    setServiceCost(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h6">Finalize Service Details</Typography>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Map Section */}
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
              <Typography variant="body2" color="textSecondary">
                📍 {seekerLocation.label || 'Location not specified'}
              </Typography>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Typography variant="subtitle2" style={styles.inputLabel}>
                Service Cost (PHP) *
              </Typography>
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
              <Typography variant="subtitle2" style={styles.inputLabel}>
                Service Specifications *
              </Typography>
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

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Submit Service Cost and Specs"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={!serviceCost.trim() || !serviceSpecifications.trim()}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Waiting Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWaitingModal}
        onRequestClose={() => {
          // Modal cannot be closed by user - must wait for seeker response
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

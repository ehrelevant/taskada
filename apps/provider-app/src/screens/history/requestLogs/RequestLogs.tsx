import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionHistoryStackParamList } from '@navigation/TransactionHistoryStack';
import { useEffect, useState } from 'react';

import { styles } from './RequestLogs.styles';

type RequestDetailsRouteProp = RouteProp<TransactionHistoryStackParamList, 'RequestDetailsSummary'>;
type RequestDetailsNavigationProp = NativeStackNavigationProp<
  TransactionHistoryStackParamList,
  'RequestDetailsSummary'
>;

interface RequestDetailsData {
  id: string;
  serviceTypeId: string;
  serviceTypeName: string;
  serviceTypeIcon: string | null;
  description: string | null;
  createdAt: string;
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
  images: string[];
  seeker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    phoneNumber: string;
  } | null;
}

export function RequestDetailsSummaryScreen() {
  const route = useRoute<RequestDetailsRouteProp>();
  const navigation = useNavigation<RequestDetailsNavigationProp>();
  const { bookingId } = route.params;

  const [request, setRequest] = useState<RequestDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequestDetails();
  }, [bookingId]);

  const loadRequestDetails = async () => {
    try {
      setIsLoading(true);
      const response = await providerClient.apiFetch(`/bookings/${bookingId}/request-details`, 'GET');

      if (!response.ok) {
        throw new Error('Failed to load request details');
      }

      const data = await response.json();
      setRequest(data);
    } catch (err) {
      console.error('Failed to load request details:', err);
      setError('Failed to load request details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
          <Typography variant="body1" style={styles.loadingText}>
            Loading request details...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Typography variant="body1" color="error">
            {error || 'Request not found'}
          </Typography>
          <Button title="Go Back" onPress={handleGoBack} style={styles.button} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h5">Request Details</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Type */}
        <Card elevation="s" padding="m" style={styles.section}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Service Type
          </Typography>
          <View style={styles.serviceTypeRow}>
            {request.serviceTypeIcon && <Image source={{ uri: request.serviceTypeIcon }} style={styles.serviceIcon} />}
            <Typography variant="h6">{request.serviceTypeName}</Typography>
          </View>
        </Card>

        {/* Seeker Information */}
        {request.seeker && (
          <Card elevation="s" padding="m" style={styles.section}>
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
              Seeker Information
            </Typography>
            <View style={styles.seekerInfo}>
              <Avatar
                source={request.seeker.avatarUrl ? { uri: request.seeker.avatarUrl } : null}
                size={60}
                name={`${request.seeker.firstName} ${request.seeker.lastName}`}
              />
              <View style={styles.seekerDetails}>
                <Typography variant="body1" weight="medium">
                  {request.seeker.firstName} {request.seeker.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {request.seeker.phoneNumber}
                </Typography>
              </View>
            </View>
          </Card>
        )}

        {/* Location */}
        <Card elevation="s" padding="m" style={styles.section}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Location
          </Typography>
          <Typography variant="body1">{request.address?.label || 'Address not specified'}</Typography>
        </Card>

        {/* Description */}
        {request.description && (
          <Card elevation="s" padding="m" style={styles.section}>
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
              Description
            </Typography>
            <Typography variant="body1" style={styles.description}>
              {request.description}
            </Typography>
          </Card>
        )}

        {/* Images */}
        {request.images && request.images.length > 0 && (
          <Card elevation="s" padding="m" style={styles.section}>
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
              Photos ({request.images.length})
            </Typography>
            <View style={styles.imagesContainer}>
              {request.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
              ))}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Back Button */}
      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    </SafeAreaView>
  );
}

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, ImageViewer, ScreenContainer, Typography } from '@repo/components';
import { MapPin, MessageSquareText, Sparkles, UserCircle2 } from 'lucide-react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestDetails.styles';
import { useRequestDetails } from './RequestDetails.hooks';

export function RequestDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
    request,
    isLoading,
    error,
    isCreatingBooking,
    selectedImage,
    setSelectedImage,
    handleGoBack,
    handleSettleRequest,
  } = useRequestDetails();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right']} contentPadding="m" contentStyle={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
        <Typography variant="body1" color="textSecondary">
          Loading request details...
        </Typography>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer edges={['left', 'right']} contentPadding="m" contentStyle={styles.centerContent}>
        <Typography variant="h5" color="error">
          Request Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {error}
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} />
      </ScreenContainer>
    );
  }

  if (!request) {
    return (
      <ScreenContainer edges={['left', 'right']} contentPadding="m" contentStyle={styles.content}>
        <Typography variant="body1" color="textSecondary">
          Request not found
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']} contentPadding="m" contentStyle={styles.content}>
      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse" style={styles.serviceTypeName}>
          {request.serviceType.name}
        </Typography>
        <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
          Review details before opening chat and settling this request.
        </Typography>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionLabelRow}>
          <UserCircle2 size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Seeker Information
          </Typography>
        </View>
        <View style={styles.seekerInfo}>
          <Avatar
            source={request.seeker.avatarUrl ? { uri: request.seeker.avatarUrl } : null}
            name={`${request.seeker.firstName} ${request.seeker.lastName}`}
            size={56}
          />
          <View style={styles.seekerDetails}>
            <Typography variant="h2" weight="bold">
              {request.seeker.firstName} {request.seeker.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {request.seeker.phoneNumber}
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionLabelRow}>
          <MapPin size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Location
          </Typography>
        </View>
        {request.address.coordinates &&
          request.address.coordinates[0] !== 0 &&
          request.address.coordinates[1] !== 0 && (
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: request.address.coordinates[1],
                  longitude: request.address.coordinates[0],
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{ latitude: request.address.coordinates[1], longitude: request.address.coordinates[0] }}
                />
              </MapView>
            </View>
          )}
        <View style={styles.addressContainer}>
          <Typography variant="body1">{request.address.label || 'Address not specified'}</Typography>
        </View>
      </View>

      {request.description && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <MessageSquareText size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Description
            </Typography>
          </View>
          <View style={styles.descriptionBox}>
            <Typography variant="body1" style={styles.description}>
              {request.description}
            </Typography>
          </View>
        </View>
      )}

      {request.images && request.images.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <Sparkles size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Photos ({request.images.length})
            </Typography>
          </View>
          <View style={styles.imagesContainer}>
            {request.images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(image)} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <Button title="Go Back" variant="outline" onPress={handleGoBack} style={styles.actionButton} />
        <Button
          title="Start Chat"
          onPress={handleSettleRequest}
          isLoading={isCreatingBooking}
          disabled={isCreatingBooking}
          style={styles.actionButton}
        />
      </View>

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </ScreenContainer>
  );
}

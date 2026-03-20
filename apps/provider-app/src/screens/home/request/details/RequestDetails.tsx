import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, ImageViewer, Typography } from '@repo/components';
import { colors } from '@repo/theme';

import { styles } from './RequestDetails.styles';
import { useRequestDetails } from './RequestDetails.hooks';

export function RequestDetailsScreen() {
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.actionPrimary} />
        <Typography variant="body1" color="textSecondary" style={styles.loadingText}>
          Loading request details...
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="h5" color="error" style={styles.errorTitle}>
          Request Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" style={styles.errorMessage}>
          {error}
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} style={styles.button} />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body1" color="textSecondary">
          Request not found
        </Typography>
        <Button title="Go Back" onPress={handleGoBack} style={styles.button} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Typography variant="h1" style={styles.serviceTypeName}>
          {request.serviceType.name}
        </Typography>
      </View>

      <View style={styles.sectionCard}>
        <Typography variant="subtitle2" style={styles.sectionLabel}>
          Seeker Information
        </Typography>
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
        <Typography variant="subtitle2" style={styles.sectionLabel}>
          Location
        </Typography>
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
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Description
          </Typography>
          <View style={styles.descriptionBox}>
            <Typography variant="body1" style={styles.description}>
              {request.description}
            </Typography>
          </View>
        </View>
      )}

      {request.images && request.images.length > 0 && (
        <View style={styles.sectionCard}>
          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Photos ({request.images.length})
          </Typography>
          <View style={styles.imagesContainer}>
            {request.images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(image)} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Settle Request Via Chat"
          onPress={handleSettleRequest}
          isLoading={isCreatingBooking}
          disabled={isCreatingBooking}
          style={styles.button}
        />
        <Button title="Go Back" variant="outline" onPress={handleGoBack} style={styles.button} />
      </View>

      <ImageViewer
        visible={selectedImage !== null}
        imageUri={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
    </ScrollView>
  );
}

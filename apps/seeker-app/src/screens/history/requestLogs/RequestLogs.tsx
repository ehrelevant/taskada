import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Button, Card, Header, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './RequestLogs.styles';
import { useRequestLogs } from './RequestLogs.hooks';

export function RequestLogsScreen() {
  const { request, isLoading, error, handleGoBack } = useRequestLogs();

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
      <Header title="Request Details" size="small" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card elevation="s" padding="m" style={styles.section}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Service Type
          </Typography>
          <View style={styles.serviceTypeRow}>
            {request.serviceTypeIcon && <Image source={{ uri: request.serviceTypeIcon }} style={styles.serviceIcon} />}
            <Typography variant="h6">{request.serviceTypeName}</Typography>
          </View>
        </Card>

        <Card elevation="s" padding="m" style={styles.section}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Location
          </Typography>
          <Typography variant="body1">{request.address?.label || 'Address not specified'}</Typography>
        </Card>

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

      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    </SafeAreaView>
  );
}

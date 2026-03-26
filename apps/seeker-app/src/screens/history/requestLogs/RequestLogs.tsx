import { Button, Card, EmptyState, Header, ScreenContainer, Typography } from '@repo/components';
import { Image, View } from 'react-native';

import { createStyles } from './RequestLogs.styles';
import { useRequestLogs } from './RequestLogs.hooks';

export function RequestLogsScreen() {
  const styles = createStyles();
  const { request, isLoading, error, handleGoBack } = useRequestLogs();

  if (isLoading) {
    return (
      <ScreenContainer>
        <EmptyState loading loadingMessage="Loading request details..." />
      </ScreenContainer>
    );
  }

  if (error || !request) {
    return (
      <ScreenContainer>
        <EmptyState message={error || 'Request not found'} action={<Button title="Go Back" onPress={handleGoBack} />} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable padding="none" stickyFooter={<Button title="Go Back" onPress={handleGoBack} />}>
      <Header title="Request Details" size="small" />

      <View style={styles.content}>
        <Card elevation="s" padding="m" style={styles.card}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.cardLabel}>
            Service Type
          </Typography>
          <View style={styles.serviceTypeRow}>
            {request.serviceTypeIcon && <Image source={{ uri: request.serviceTypeIcon }} style={styles.serviceIcon} />}
            <Typography variant="h6">{request.serviceTypeName}</Typography>
          </View>
        </Card>

        <Card elevation="s" padding="m" style={styles.card}>
          <Typography variant="subtitle2" color="textSecondary" style={styles.cardLabel}>
            Location
          </Typography>
          <Typography variant="body1">{request.address?.label || 'Address not specified'}</Typography>
        </Card>

        {request.description && (
          <Card elevation="s" padding="m" style={styles.card}>
            <Typography variant="subtitle2" color="textSecondary" style={styles.cardLabel}>
              Description
            </Typography>
            <Typography variant="body1" style={styles.description}>
              {request.description}
            </Typography>
          </Card>
        )}

        {request.images && request.images.length > 0 && (
          <Card elevation="s" padding="m" style={styles.card}>
            <Typography variant="subtitle2" color="textSecondary" style={styles.cardLabel}>
              Photos ({request.images.length})
            </Typography>
            <View style={styles.imagesContainer}>
              {request.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
              ))}
            </View>
          </Card>
        )}
      </View>
    </ScreenContainer>
  );
}

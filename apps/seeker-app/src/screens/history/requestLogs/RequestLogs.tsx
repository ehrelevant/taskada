import { Button, Card, EmptyState, Header, ScreenContainer, Typography } from '@repo/components';
import { FileText, MapPin, Sparkles, Wrench } from 'lucide-react-native';
import { Image, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestLogs.styles';
import { useRequestLogs } from './RequestLogs.hooks';

export function RequestLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { request, isLoading, error, handleGoBack } = useRequestLogs();

  if (isLoading) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <EmptyState loading loadingMessage="Loading request details..." />
      </ScreenContainer>
    );
  }

  if (error || !request) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <EmptyState message={error || 'Request not found'} action={<Button title="Go Back" onPress={handleGoBack} />} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']} contentPadding="m" contentStyle={styles.content}>
      <Header title="Request Details" size="small" onBack={handleGoBack} />

      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Original request details
        </Typography>
        <Typography variant="body2" color="textInverse">
          Review the request context that led to this booking.
        </Typography>
      </View>

      <Card elevation="s" padding="m" style={styles.card}>
        <View style={styles.sectionLabelRow}>
          <Wrench size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" color="textSecondary">
            Service Type
          </Typography>
        </View>
        <View style={styles.serviceTypeRow}>
          {request.serviceTypeIcon && <Image source={{ uri: request.serviceTypeIcon }} style={styles.serviceIcon} />}
          <Typography variant="h6">{request.serviceTypeName}</Typography>
        </View>
      </Card>

      <Card elevation="s" padding="m" style={styles.card}>
        <View style={styles.sectionLabelRow}>
          <MapPin size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" color="textSecondary">
            Location
          </Typography>
        </View>
        <Typography variant="body1">{request.address?.label || 'Address not specified'}</Typography>
      </Card>

      {request.description && (
        <Card elevation="s" padding="m" style={styles.card}>
          <View style={styles.sectionLabelRow}>
            <FileText size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary">
              Description
            </Typography>
          </View>
          <Typography variant="body1" style={styles.description}>
            {request.description}
          </Typography>
        </Card>
      )}

      {request.images && request.images.length > 0 && (
        <Card elevation="s" padding="m" style={styles.card}>
          <View style={styles.sectionLabelRow}>
            <Sparkles size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary">
              Photos ({request.images.length})
            </Typography>
          </View>
          <View style={styles.imagesContainer}>
            {request.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ))}
          </View>
        </Card>
      )}

      <Button title="Go Back" onPress={handleGoBack} style={styles.footerButton} />
    </ScreenContainer>
  );
}

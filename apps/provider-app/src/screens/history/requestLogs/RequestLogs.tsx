import { Avatar, Button, Card, EmptyState, Header, ScreenContainer, Typography } from '@repo/components';
import { FileText, MapPin, Sparkles, UserCircle2, Wrench } from 'lucide-react-native';
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
    <ScreenContainer scrollable edges={['left', 'right']} contentPadding="m" contentStyle={styles.content}>
      <Header title="Request Details" size="small" />

      <Card elevation="s" padding="m" style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Wrench size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Service Type
          </Typography>
        </View>
        <View style={styles.serviceTypeRow}>
          {request.serviceTypeIcon && <Image source={{ uri: request.serviceTypeIcon }} style={styles.serviceIcon} />}
          <Typography variant="h6">{request.serviceTypeName}</Typography>
        </View>
      </Card>

      {request.seeker && (
        <Card elevation="s" padding="m" style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <UserCircle2 size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
              Seeker Information
            </Typography>
          </View>
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

      <Card elevation="s" padding="m" style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <MapPin size={15} color={colors.textSecondary} />
          <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
            Location
          </Typography>
        </View>
        <Typography variant="body1">{request.address?.label || 'Address not specified'}</Typography>
      </Card>

      {request.description && (
        <Card elevation="s" padding="m" style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <FileText size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
              Description
            </Typography>
          </View>
          <Typography variant="body1" style={styles.description}>
            {request.description}
          </Typography>
        </Card>
      )}

      {request.images && request.images.length > 0 && (
        <Card elevation="s" padding="m" style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Sparkles size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" color="textSecondary" style={styles.sectionLabel}>
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

      <Button title="Go Back" onPress={handleGoBack} />
    </ScreenContainer>
  );
}

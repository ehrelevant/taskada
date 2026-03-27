import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Header, Typography } from '@repo/components';
import { FileText, MapPin, Sparkles, UserCircle2, Wrench } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { createStyles } from './RequestLogs.styles';
import { useRequestLogs } from './RequestLogs.hooks';

export function RequestLogsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    </SafeAreaView>
  );
}

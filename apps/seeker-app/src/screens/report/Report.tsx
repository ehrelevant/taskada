import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Button, Header, Typography } from '@repo/components';
import { CheckCircle2, ChevronLeft, ImagePlus, X } from 'lucide-react-native';
import { colors, spacing } from '@repo/theme';
import { Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import { REPORT_REASONS, useReport } from './Report.hooks';
import { styles } from './Report.styles';

export function ReportScreen() {
  const {
    reportedUser,
    selectedReason,
    selectedImages,
    hasAlreadyReported,
    isChecking,
    isSubmitting,
    control,
    errors,
    checkExistingReport,
    handlePickImage,
    handleRemoveImage,
    handleSubmit,
    handleGoBack,
  } = useReport();

  useEffect(() => {
    checkExistingReport();
  }, [checkExistingReport]);

  if (isChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Report User"
          size="small"
          leftContent={
            <TouchableOpacity onPress={handleGoBack}>
              <ChevronLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          }
        />
        <View style={styles.alreadyReportedContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  if (hasAlreadyReported) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Report User"
          size="small"
          leftContent={
            <TouchableOpacity onPress={handleGoBack}>
              <ChevronLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          }
        />
        <View style={styles.alreadyReportedContainer}>
          <CheckCircle2 size={48} color={colors.success.base} />
          <Typography variant="h6" style={{ marginTop: spacing.m }}>
            Report Already Submitted
          </Typography>
          <Typography variant="body1" color="textSecondary" style={{ marginTop: spacing.s, textAlign: 'center' }}>
            You have already submitted a report for this booking. Our team will review it.
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${reportedUser.firstName} ${reportedUser.lastName}`;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Report User"
        size="small"
        leftContent={
          <TouchableOpacity onPress={handleGoBack}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.userCard}>
            <Avatar
              source={reportedUser.avatarUrl ? { uri: reportedUser.avatarUrl } : null}
              name={fullName}
              size={56}
            />
            <View style={styles.userInfo}>
              <Typography variant="h6">{fullName}</Typography>
              <Typography variant="body2" color="textSecondary">
                User you are reporting
              </Typography>
            </View>
          </View>

          <Typography variant="subtitle2" style={styles.sectionLabel}>
            Reason for Reporting *
          </Typography>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <View style={styles.reasonsContainer}>
                {REPORT_REASONS.map(reason => (
                  <TouchableOpacity
                    key={reason.value}
                    style={[styles.reasonChip, value === reason.value && styles.reasonChipSelected]}
                    onPress={() => onChange(value === reason.value ? undefined : reason.value)}
                  >
                    <Typography
                      variant="body1"
                      style={styles.reasonChipText}
                      color={value === reason.value ? 'actionPrimary' : 'textPrimary'}
                    >
                      {reason.label}
                    </Typography>
                    {value === reason.value && <CheckCircle2 size={20} color={colors.actionPrimary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.reason && (
            <Typography variant="caption" color="error" style={{ marginTop: spacing.xs }}>
              {errors.reason.message}
            </Typography>
          )}

          <View style={{ marginTop: spacing.l }}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Description {selectedReason === 'other' ? '*' : '(Optional)'}
            </Typography>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.descriptionInput}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Provide details about the issue..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.description && (
              <Typography variant="caption" color="error" style={{ marginTop: spacing.xs }}>
                {errors.description.message}
              </Typography>
            )}
          </View>

          <View style={styles.imageSection}>
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Evidence (Optional)
            </Typography>
            <TouchableOpacity
              style={[styles.imagePickerButton, selectedImages.length >= 4 && styles.imagePickerDisabled]}
              onPress={handlePickImage}
              disabled={selectedImages.length >= 4}
            >
              <ImagePlus size={20} color={selectedImages.length >= 4 ? colors.textDisabled : colors.actionPrimary} />
              <Typography variant="body2" color={selectedImages.length >= 4 ? 'textDisabled' : 'actionPrimary'}>
                {selectedImages.length >= 4 ? 'Maximum 4 images' : 'Add Photos'}
              </Typography>
            </TouchableOpacity>
            {selectedImages.length > 0 && (
              <ScrollView horizontal style={styles.selectedImagesContainer} showsHorizontalScrollIndicator={false}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.selectedImageWrapper}>
                    <Avatar source={{ uri }} size={80} name="" />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                      <X size={14} color={colors.textInverse} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>

        <View style={styles.submitContainer}>
          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

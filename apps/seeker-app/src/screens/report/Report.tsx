import { AlertTriangle, CheckCircle2, ImagePlus, ShieldAlert, X } from 'lucide-react-native';
import { Avatar, Button, EmptyState, Header, ScreenContainer, Typography } from '@repo/components';
import { Controller } from 'react-hook-form';
import { Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useEffect } from 'react';
import { useTheme } from '@repo/theme';

import { createStyles } from './Report.styles';
import { REPORT_REASONS, useReport } from './Report.hooks';

export function ReportScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
      <ScreenContainer edges={['left', 'right']}>
        <Header title="Report User" size="small" onBack={handleGoBack} />
        <EmptyState loading loadingMessage="Checking..." />
      </ScreenContainer>
    );
  }

  if (hasAlreadyReported) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <Header title="Report User" size="small" onBack={handleGoBack} />
        <View style={styles.alreadyReportedContainer}>
          <CheckCircle2 size={48} color={colors.success.base} />
          <Typography variant="h6" style={styles.alreadyReportedTitle}>
            Report Already Submitted
          </Typography>
          <Typography variant="body1" color="textSecondary" style={styles.alreadyReportedSubtitle}>
            You have already submitted a report for this booking. Our team will review it.
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  const fullName = `${reportedUser.firstName} ${reportedUser.lastName}`;

  return (
    <ScreenContainer edges={['left', 'right']}>
      <Header title="Report User" size="small" onBack={handleGoBack} />

      <KeyboardAwareScrollView
        style={styles.keyboardView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse">
            File a report
          </Typography>
          <Typography variant="body2" color="textInverse">
            Share clear details and evidence so moderators can review faster.
          </Typography>
        </View>

        <View style={styles.userCard}>
          <Avatar source={reportedUser.avatarUrl ? { uri: reportedUser.avatarUrl } : null} name={fullName} size={56} />
          <View style={styles.userInfo}>
            <Typography variant="h6">{fullName}</Typography>
            <Typography variant="body2" color="textSecondary">
              User you are reporting
            </Typography>
          </View>
        </View>

        <View style={styles.sectionCard}>
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
                      color={value === reason.value ? 'textInverse' : 'textPrimary'}
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
            <Typography variant="caption" color="error" style={styles.errorText}>
              {errors.reason.message}
            </Typography>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <ShieldAlert size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Description {selectedReason === 'other' ? '*' : '(Optional)'}
            </Typography>
          </View>
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
            <Typography variant="caption" color="error" style={styles.errorText}>
              {errors.description.message}
            </Typography>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <AlertTriangle size={15} color={colors.textSecondary} />
            <Typography variant="subtitle2" style={styles.sectionLabel}>
              Evidence (Optional)
            </Typography>
          </View>
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
                  <Image source={{ uri }} width={80} height={80}/>
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                    <X size={14} color={colors.textInverse} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <Button
          title={isSubmitting ? 'Submitting...' : 'Submit Report'}
          onPress={handleSubmit}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}

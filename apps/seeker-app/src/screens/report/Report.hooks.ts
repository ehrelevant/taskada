import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import type { HistoryStackParamList } from '@navigation/HistoryStack';
import type { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportReason } from '@repo/types';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type ReportRouteProp = RouteProp<HomeStackParamList & HistoryStackParamList, 'Report'>;
type ReportNavigationProp = NativeStackNavigationProp<HomeStackParamList & HistoryStackParamList, 'Report'>;

interface ReportedUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface ReasonOption {
  value: ReportReason;
  label: string;
}

export const REPORT_REASONS: ReasonOption[] = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'fraudulent_payment', label: 'Fraudulent Payment' },
  { value: 'unfair_cancellation', label: 'Unfair Cancellation' },
  { value: 'no_show', label: 'No-Show' },
  { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
  { value: 'poor_service', label: 'Poor Service' },
  { value: 'other', label: 'Other' },
];

const reportSchema = z
  .object({
    reason: z.enum(
      [
        'harassment',
        'fraudulent_payment',
        'unfair_cancellation',
        'no_show',
        'inappropriate_behavior',
        'poor_service',
        'other',
      ],
      { required_error: 'Please select a reason for reporting' },
    ),
    description: z.string().optional(),
  })
  .refine(data => data.reason !== 'other' || (data.description && data.description.trim().length > 0), {
    message: 'Please provide a description when selecting "Other"',
    path: ['description'],
  });

type ReportFormData = z.infer<typeof reportSchema>;

export function useReport() {
  const route = useRoute<ReportRouteProp>();
  const navigation = useNavigation<ReportNavigationProp>();
  const { bookingId, reportedUser } = route.params as {
    bookingId: string;
    reportedUser: ReportedUser;
  };

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hasAlreadyReported, setHasAlreadyReported] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: undefined,
      description: '',
    },
  });

  const selectedReason = watch('reason');

  const checkExistingReport = useCallback(async () => {
    try {
      const exists = await seekerClient.checkReportExists(bookingId);
      setHasAlreadyReported(exists);
    } catch {
      // If check fails, allow the user to try submitting
    } finally {
      setIsChecking(false);
    }
  }, [bookingId]);

  const handlePickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload evidence.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4 - selectedImages.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  }, [selectedImages.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const onSubmit = useCallback(
    async (data: ReportFormData) => {
      try {
        const report = await seekerClient.createReport({
          reportedUserId: reportedUser.id,
          bookingId,
          reason: data.reason,
          description: data.description?.trim() || undefined,
        });

        if (selectedImages.length > 0) {
          await seekerClient.uploadReportImages(report.id, selectedImages);
        }

        Alert.alert('Report Submitted', 'Your report has been submitted successfully. We will review it shortly.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to submit report. Please try again.';
        Alert.alert('Error', message);
      }
    },
    [selectedImages, reportedUser.id, bookingId, navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
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
    handleSubmit: handleSubmit(onSubmit),
    handleGoBack,
  };
}

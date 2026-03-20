import * as ImagePicker from 'expo-image-picker';
import { authClient } from '@lib/authClient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useLoading } from '@repo/shared';
import { useNavigation } from '@react-navigation/native';

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useProfile() {
  const { setLoading } = useLoading();
  const navigation = useNavigation<NativeStackScreenProps<OptionsStackParamList, 'Profile'>['navigation']>();
  const { data: userSession, refetch } = authClient.useSession();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
  });

  const [originalProfileData, setOriginalProfileData] = useState<ProfileData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userSession?.user) {
      seekerClient
        .apiFetch('/users/profile', 'GET')
        .then(res => res.json())
        .then(data => {
          const profileData = {
            firstName: data.firstName || '',
            middleName: data.middleName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            avatarUrl: data.avatarUrl || '',
          };
          setProfileData(profileData);
          setOriginalProfileData(profileData);
        })
        .catch(console.error);
    }
  }, [userSession]);

  useEffect(() => {
    const changed = Boolean(
      profileData.firstName !== originalProfileData.firstName ||
        profileData.middleName !== originalProfileData.middleName ||
        profileData.lastName !== originalProfileData.lastName ||
        profileData.phoneNumber !== originalProfileData.phoneNumber ||
        profileData.avatarUrl !== originalProfileData.avatarUrl ||
        passwordData.oldPassword ||
        passwordData.newPassword ||
        passwordData.confirmPassword,
    );
    setHasChanges(changed);
  }, [profileData, passwordData, originalProfileData]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const uploaded = await seekerClient.uploadAvatar(result.assets[0].uri);
        setProfileData(prev => ({ ...prev, avatarUrl: uploaded.avatarUrl }));
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setErrors({ submit: 'Failed to upload avatar. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleRemoveAvatar = useCallback(async () => {
    if (!profileData.avatarUrl) return;

    setLoading(true);
    try {
      await seekerClient.deleteAvatar();
      setProfileData(prev => ({ ...prev, avatarUrl: '' }));
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      setErrors({ submit: 'Failed to remove avatar. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [profileData.avatarUrl]);

  const validateProfile = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (passwordData.oldPassword || passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.oldPassword) {
        newErrors.oldPassword = 'Current password is required';
      }
      if (!passwordData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (!passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profileData, passwordData]);

  const handleSave = useCallback(async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const profileUpdateData = {
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        avatarUrl: profileData.avatarUrl,
      };

      await seekerClient.apiFetch('/users/profile', 'PUT', {
        body: JSON.stringify(profileUpdateData),
      });

      if (passwordData.oldPassword && passwordData.newPassword) {
        await seekerClient.apiFetch('/users/password', 'PUT', {
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        });
      }

      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});

      refetch();

      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [navigation, passwordData, profileData, refetch, validateProfile]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setProfileData(originalProfileData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    }
    navigation.goBack();
  }, [hasChanges, navigation, originalProfileData]);

  return {
    userSession,
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    showPasswords,
    setShowPasswords,
    errors,
    hasChanges,
    pickImage,
    handleRemoveAvatar,
    handleSave,
    handleCancel,
  };
}

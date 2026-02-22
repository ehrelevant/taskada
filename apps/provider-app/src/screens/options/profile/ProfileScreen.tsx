import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { Button, Input, Typography } from '@repo/components';
import { Camera, Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@repo/theme';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useLoading } from '@contexts/LoadingContext';

type ProfileScreenProps = NativeStackScreenProps<OptionsStackParamList, 'Profile'>;

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

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { setLoading } = useLoading();
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
      const { user } = userSession;
      const data = {
        firstName: user.name || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        avatarUrl: user.image || '',
      };
      setProfileData(data);
      setOriginalProfileData(data);
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileData(prev => ({ ...prev, avatarUrl: result.assets[0].uri }));
    }
  };

  const validateProfile = () => {
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
  };

  const handleSave = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      // Update profile information
      const profileUpdateData = {
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        avatarUrl: profileData.avatarUrl,
      };

      await apiFetch('/users/profile', 'PUT', {
        body: JSON.stringify(profileUpdateData),
      });

      // Update password if provided
      if (passwordData.oldPassword && passwordData.newPassword) {
        await apiFetch('/users/password', 'PUT', {
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        });
      }

      // Clear password fields after successful update
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});

      // Refresh user session data
      refetch();

      // Go back to options screen
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // Reset to original data
      setProfileData(originalProfileData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    }
    navigation.goBack();
  };

  if (!userSession) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={[styles.section, styles.avatarSection]}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profileData.avatarUrl ? { uri: profileData.avatarUrl } : require('@lib/assets/default-profile.jpg')
              }
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Camera size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Typography variant="h3" style={styles.sectionTitle}>
            Profile Picture
          </Typography>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Personal Information
          </Typography>

          <Input
            label="First Name"
            value={profileData.firstName}
            onChangeText={text => setProfileData(prev => ({ ...prev, firstName: text }))}
            error={errors.firstName}
          />

          <Input
            label="Middle Name"
            value={profileData.middleName}
            onChangeText={text => setProfileData(prev => ({ ...prev, middleName: text }))}
          />

          <Input
            label="Last Name"
            value={profileData.lastName}
            onChangeText={text => setProfileData(prev => ({ ...prev, lastName: text }))}
            error={errors.lastName}
          />

          <Input
            label="Phone Number"
            value={profileData.phoneNumber}
            onChangeText={text => setProfileData(prev => ({ ...prev, phoneNumber: text }))}
            error={errors.phoneNumber}
          />
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Account Information
          </Typography>

          <Input label="Email" value={profileData.email} editable={false} inputContainerStyle={styles.readonlyInput} />
        </View>

        {/* Password Change Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Change Password
          </Typography>

          <Input
            label="Current Password"
            value={passwordData.oldPassword}
            onChangeText={text => setPasswordData(prev => ({ ...prev, oldPassword: text }))}
            secureTextEntry={!showPasswords.oldPassword}
            error={errors.oldPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPasswords(prev => ({ ...prev, oldPassword: !prev.oldPassword }))}>
                {showPasswords.oldPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            }
          />

          <Input
            label="New Password"
            value={passwordData.newPassword}
            onChangeText={text => setPasswordData(prev => ({ ...prev, newPassword: text }))}
            secureTextEntry={!showPasswords.newPassword}
            error={errors.newPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}>
                {showPasswords.newPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            }
          />

          <Input
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChangeText={text => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
            secureTextEntry={!showPasswords.confirmPassword}
            error={errors.confirmPassword}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            }
          />
        </View>

        {/* Error Message */}
        {errors.submit && <Typography style={styles.errorText}>{errors.submit}</Typography>}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            variant="primary"
            onPress={handleSave}
            disabled={!hasChanges}
            style={styles.saveButton}
          />
          <Button title="Cancel" variant="outline" onPress={handleCancel} style={styles.cancelButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    color: colors.textPrimary,
  },
  avatarSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.actionPrimary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readonlyInput: {
    backgroundColor: colors.backgroundSecondary,
    color: colors.textDisabled,
  },
  buttonContainer: {
    marginVertical: 30,
    gap: 10,
  },
  saveButton: {
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 20,
  },
  errorText: {
    color: colors.error.base,
    textAlign: 'center',
    marginVertical: 10,
  },
});

import { Avatar, Button, Input, Typography } from '@repo/components';
import { Camera, Eye, EyeOff, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './Profile.styles';
import { useProfileScreen } from './Profile.hooks';

type ProfileScreenProps = NativeStackScreenProps<OptionsStackParamList, 'Profile'>;

export function ProfileScreen(props: ProfileScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
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
  } = useProfileScreen(props);

  if (!userSession) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, styles.avatarSection]}>
          <View style={styles.avatarContainer}>
            <Avatar source={profileData?.avatarUrl ? { uri: profileData.avatarUrl } : null} size={100} />
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Camera size={20} color={colors.white} />
            </TouchableOpacity>
            {profileData.avatarUrl ? (
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveAvatar}>
                <X size={16} color={colors.white} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Typography variant="h3" style={styles.sectionTitle}>
            Profile Picture
          </Typography>
        </View>

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

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Account Information
          </Typography>

          <Input label="Email" value={profileData.email} editable={false} inputContainerStyle={styles.readonlyInput} />
        </View>

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

        {errors.submit && <Typography style={styles.errorText}>{errors.submit}</Typography>}

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

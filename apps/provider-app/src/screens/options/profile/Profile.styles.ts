import { StyleSheet } from 'react-native';
import { ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    removeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.error.base,
      width: 28,
      height: 28,
      borderRadius: 14,
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

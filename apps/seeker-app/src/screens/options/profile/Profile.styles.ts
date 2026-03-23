import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: spacing.m,
    },
    section: {
      marginVertical: spacing.m,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      color: colors.textPrimary,
    },
    avatarSection: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: spacing.m,
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
      marginVertical: spacing.l,
      gap: spacing.s,
    },
    saveButton: {
      marginBottom: spacing.s,
    },
    cancelButton: {
      marginBottom: spacing.m,
    },
    errorText: {
      color: colors.error.base,
      textAlign: 'center',
      marginVertical: 10,
    },
  });

import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    avatarSection: {
      alignItems: 'center',
      marginVertical: spacing.m,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.secondary.base,
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
    sectionCard: {
      marginBottom: spacing.l,
      borderRadius: 16,
    },
    sectionTitle: {
      marginBottom: spacing.m,
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

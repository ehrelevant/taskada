import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    avatarSection: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      flexDirection: 'column',
      alignItems: 'center',
      padding: spacing.heroInset,
      marginBottom: spacing.m,
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
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      gap: spacing.s,
    },
    readonlyInput: {
      backgroundColor: colors.card.muted,
      color: colors.textDisabled,
    },
    buttonContainer: {
      gap: spacing.s,
    },
    errorText: {
      color: colors.error.base,
      textAlign: 'center',
      marginVertical: 10,
    },
  });

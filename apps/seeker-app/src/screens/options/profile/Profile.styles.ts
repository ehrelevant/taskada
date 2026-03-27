import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    avatarSection: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      alignItems: 'center',
      marginBottom: spacing.m,
      padding: spacing.heroInset,
    },
    profilePill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
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
    },
    sectionTitle: {
      marginBottom: spacing.m,
      color: colors.textSecondary,
    },
    readonlyInput: {
      backgroundColor: colors.card.muted,
      color: colors.textDisabled,
    },
    buttonContainer: {
      marginVertical: spacing.l,
      gap: spacing.s,
    },
    saveButton: {
      marginBottom: spacing.s,
      backgroundColor: colors.actionPrimary,
    },
    cancelButton: {
      marginBottom: spacing.m,
      backgroundColor: colors.card.base,
      borderColor: colors.card.stroke,
    },
    errorText: {
      color: colors.error.base,
      textAlign: 'center',
      marginVertical: 10,
    },
  });

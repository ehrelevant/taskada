import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: spacing.pageHorizontal,
    },
    content: {
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xxxl,
      gap: spacing.m,
    },
    section: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      color: colors.textSecondary,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    avatarSection: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      flexDirection: 'column',
      alignItems: 'center',
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
      backgroundColor: colors.card.muted,
      color: colors.textDisabled,
    },
    buttonContainer: {
      gap: spacing.s,
      marginBottom: spacing.xl,
    },
    saveButton: {
      backgroundColor: colors.actionPrimary,
    },
    cancelButton: {
      backgroundColor: colors.card.base,
      borderColor: colors.card.stroke,
    },
    errorText: {
      color: colors.error.base,
      textAlign: 'center',
      marginVertical: 10,
    },
  });

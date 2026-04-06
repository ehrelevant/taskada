import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      gap: spacing.m,
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.xs,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    userInfo: {
      marginLeft: spacing.m,
      flex: 1,
    },
    sectionLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
    },
    sectionCard: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
    },
    reasonsContainer: {
      gap: spacing.s,
    },
    reasonChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1.5,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
    },
    reasonChipSelected: {
      borderColor: colors.actionPrimary,
      backgroundColor: 'rgba(27, 51, 79, 0.06)',
    },
    reasonChipText: {
      flex: 1,
    },
    descriptionInput: {
      backgroundColor: colors.card.muted,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      minHeight: 120,
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    imageSection: {
      marginTop: spacing.l,
    },
    imagePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1.5,
      borderColor: colors.card.stroke,
      borderStyle: 'dashed',
      backgroundColor: colors.card.muted,
      gap: spacing.s,
    },
    imagePickerDisabled: {
      opacity: 0.5,
    },
    selectedImagesContainer: {
      marginTop: spacing.s,
    },
    selectedImageWrapper: {
      marginRight: spacing.s,
      position: 'relative',
    },
    removeImageButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: colors.error.base,
      borderRadius: radius.m,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      marginTop: spacing.s,
    },
    alreadyReportedContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    alreadyReportedTitle: {
      marginTop: spacing.m,
    },
    alreadyReportedMessage: {
      marginTop: spacing.s,
      textAlign: 'center',
    },
  });

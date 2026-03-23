import { Platform, StyleSheet } from 'react-native';
import { radius, spacing, ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.m,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    title: {
      color: colors.actionPrimary,
      fontWeight: '700',
    },
    section: {
      marginBottom: spacing.l,
    },
    sectionLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
    },
    providerCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.m,
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerImageContainer: {
      marginRight: spacing.m,
    },
    providerInfo: {
      flex: 1,
    },
    providerName: {
      marginBottom: spacing.xs,
    },
    serviceType: {
      marginBottom: spacing.xs,
    },
    ratingContainer: {
      marginTop: spacing.xs,
    },
    detailsButton: {
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.m,
    },
    detailsButtonText: {
      color: colors.actionPrimary,
      fontWeight: '600',
    },
    spacer: {
      flex: 1,
    },
    reviewFormContainer: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      padding: spacing.m,
      paddingBottom: Platform.OS === 'ios' ? spacing.l : spacing.m,
    },
    reviewFormTitle: {
      marginBottom: spacing.m,
      textAlign: 'center',
    },
    ratingInputContainer: {
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    reviewInput: {
      backgroundColor: colors.background,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.m,
      minHeight: 80,
      marginBottom: spacing.m,
      color: colors.textPrimary,
      fontSize: 16,
    },
  });

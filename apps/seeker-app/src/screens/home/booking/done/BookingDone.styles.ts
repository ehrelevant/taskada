import { Platform, StyleSheet } from 'react-native';
import { radius, spacing, ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.m,
      gap: spacing.xl,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: spacing.l,
      backgroundColor: colors.secondary.light,
      borderRadius: 16,
      gap: spacing.s,
    },
    title: {
      fontWeight: '700',
    },
    providerCard: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerInfo: {
      flex: 1,
      marginLeft: spacing.m,
    },
    providerName: {
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
    },
    reviewFormContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: spacing.l,
      paddingBottom: Platform.OS === 'ios' ? spacing.l : spacing.l,
    },
    reviewFormTitle: {
      marginBottom: spacing.m,
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

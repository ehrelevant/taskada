import { Platform, StyleSheet } from 'react-native';
import { radius, spacing, ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.m,
      gap: spacing.m,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: spacing.heroInset,
      paddingHorizontal: spacing.m,
      backgroundColor: colors.home.heroStart,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      borderRadius: radius.xxl,
      gap: spacing.s,
    },
    title: {
      fontWeight: '700',
    },
    sectionCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      gap: spacing.s,
    },
    sectionHeading: {
      marginBottom: spacing.xs,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    providerInfo: {
      flex: 1,
    },
    providerName: {
      marginBottom: spacing.xs,
    },
    ratingContainer: {
      marginTop: spacing.xs,
    },
    actionButtonsContainer: {
      gap: spacing.s,
    },
    reviewFormContainer: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.l,
    },
    ratingInputContainer: {
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    reviewInput: {
      backgroundColor: colors.canvas.base,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      minHeight: 80,
      marginBottom: spacing.m,
      color: colors.textPrimary,
      fontSize: 16,
    },
  });

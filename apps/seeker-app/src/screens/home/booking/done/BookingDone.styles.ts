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
    providerCardShell: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
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
    costPill: {
      marginTop: spacing.s,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    costValue: {
      marginLeft: spacing.xxs,
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

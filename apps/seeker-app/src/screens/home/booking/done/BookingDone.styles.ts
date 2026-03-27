import { Platform, StyleSheet } from 'react-native';
import { radius, spacing, ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xl,
      gap: spacing.m,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: spacing.heroInset,
      paddingHorizontal: spacing.m,
      backgroundColor: colors.home.heroStart,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      borderRadius: 28,
      gap: spacing.s,
    },
    title: {
      fontWeight: '700',
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    heroBadgeRow: {
      flexDirection: 'row',
      gap: spacing.s,
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: spacing.s,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
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
    detailsButton: {
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.card.base,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    reviewFormContainer: {
      backgroundColor: colors.card.base,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: spacing.l,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.l,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
    },
    reviewFormTitle: {
      marginBottom: spacing.m,
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

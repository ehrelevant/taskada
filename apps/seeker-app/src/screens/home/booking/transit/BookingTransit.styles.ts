import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.m,
    },
    statusSection: {
      marginBottom: spacing.l,
      alignItems: 'center',
      paddingVertical: spacing.m,
    },
    statusTitle: {
      textAlign: 'center',
      marginBottom: spacing.s,
    },
    statusSubtitle: {
      textAlign: 'center',
    },
    arrivalBadge: {
      backgroundColor: colors.success.base,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderRadius: 20,
      marginBottom: spacing.m,
    },
    arrivalBadgeText: {
      color: colors.textInverse,
      fontWeight: '600',
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
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.m,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.s,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.s,
    },
    costValue: {
      fontWeight: '700',
      color: colors.actionPrimary,
    },
    specificationsBox: {
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 120,
    },
    specificationsText: {
      lineHeight: 22,
    },
  });

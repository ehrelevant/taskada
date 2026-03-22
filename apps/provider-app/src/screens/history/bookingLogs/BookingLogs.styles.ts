import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.m,
    },
    scrollContent: {
      padding: spacing.m,
      paddingBottom: spacing.xl,
    },
    mapSection: {
      marginBottom: spacing.l,
    },
    mapContainer: {
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    map: {
      flex: 1,
    },
    addressContainer: {
      marginTop: spacing.s,
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addressText: {
      lineHeight: 22,
    },
    section: {
      marginBottom: spacing.l,
    },
    sectionLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
    },
    statusBadge: {
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontWeight: '600',
      color: colors.actionPrimary,
    },
    costValue: {
      color: colors.actionPrimary,
      fontWeight: '700',
    },
    specificationsBox: {
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 120,
    },
    specificationsText: {
      lineHeight: 22,
    },
    buttonContainer: {
      padding: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    secondaryButton: {
      marginTop: spacing.s,
    },
  });

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
    mapSection: {
      marginBottom: spacing.l,
    },
    mapContainer: {
      height: 300,
      borderRadius: radius.m,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    map: {
      flex: 1,
    },
    section: {
      marginBottom: spacing.l,
    },
    sectionLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
    },
    addressText: {
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.border,
      lineHeight: 22,
    },
    errorSection: {
      marginBottom: spacing.l,
      padding: spacing.m,
      backgroundColor: colors.error.light,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: 'rgba(244, 67, 54, 0.25)',
    },
    errorText: {
      color: colors.error.base,
    },
    buttonContainer: {
      padding: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    arriveButton: {
      width: '100%',
    },
  });

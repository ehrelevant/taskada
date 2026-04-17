import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.xs,
    },
    label: {
      marginBottom: spacing.s,
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderStyle: 'dashed',
      backgroundColor: colors.interactive.secondaryBg,
    },
    searchButtonDisabled: {
      opacity: 0.55,
    },
    searchButtonText: {
      marginLeft: spacing.s,
    },
    serviceCard: {
      padding: spacing.s,
      borderRadius: radius.m,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    serviceTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    serviceInfo: {
      flex: 1,
      gap: spacing.s,
    },
    providerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xxs,
    },
    providerName: {
      marginLeft: spacing.xs,
      flex: 1,
    },
    priceText: {
      marginTop: spacing.xxs,
      fontWeight: '600',
    },
    clearButton: {
      padding: spacing.xs,
    },
    autoMatchHint: {
      marginTop: spacing.s,
      padding: spacing.s,
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });

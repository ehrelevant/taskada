import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    providerSection: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.l,
      backgroundColor: colors.surface,
    },
    providerName: {
      marginTop: spacing.m,
    },
    serviceType: {
      marginTop: spacing.s,
    },
    ratingRow: {
      marginTop: spacing.s,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.m,
      marginTop: spacing.m,
      backgroundColor: colors.surface,
    },
    requestButton: {
      minWidth: 120,
    },
    reviewsSection: {
      marginTop: spacing.xl,
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.xl,
    },
    reviewsContent: {
      marginTop: spacing.m,
    },
  });

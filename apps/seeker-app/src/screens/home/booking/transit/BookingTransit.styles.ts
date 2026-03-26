import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
      gap: spacing.xl,
    },
    statusSection: {
      alignItems: 'center',
      paddingVertical: spacing.l,
      paddingHorizontal: spacing.l,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      gap: spacing.s,
    },
    statusTitle: {
      marginTop: spacing.s,
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
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.s,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },
    specificationsCard: {
      padding: spacing.l,
    },
  });

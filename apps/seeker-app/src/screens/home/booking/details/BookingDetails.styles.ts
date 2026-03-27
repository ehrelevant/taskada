import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
      gap: spacing.l,
    },
    mapSection: {
      marginBottom: spacing.xs,
    },
    mapContainer: {
      height: 200,
      borderRadius: radius.m,
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
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailsCard: {
      gap: spacing.xs,
    },
    cardLabel: {
      fontWeight: '400',
      fontSize: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.s,
    },
  });

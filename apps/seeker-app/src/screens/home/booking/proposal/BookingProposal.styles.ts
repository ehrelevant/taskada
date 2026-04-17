import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    scrollContent: {
      padding: spacing.m,
      gap: spacing.m,
    },
    sectionCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.s,
    },
    mapContainer: {
      height: 200,
      borderRadius: radius.m,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
    },
    map: {
      flex: 1,
    },
    locationCard: {
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      gap: spacing.xs,
      marginTop: spacing.s,
    },
    rowSection: {
      flexDirection: 'row',
      gap: spacing.s,
    },
    rowItemCard: {
      flex: 1,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    costLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    buttonContainer: {
      gap: spacing.s,
    },
  });

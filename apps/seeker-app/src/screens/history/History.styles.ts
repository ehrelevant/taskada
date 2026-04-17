import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      gap: spacing.m,
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    card: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    cardContent: {
      gap: spacing.m,
    },
    providerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerInfo: {
      flex: 1,
      marginLeft: spacing.m,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    costDate: {
      alignItems: 'flex-end',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });

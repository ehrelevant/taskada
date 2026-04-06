import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      gap: spacing.s,
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      marginBottom: spacing.m,
    },
    card: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
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
    },
  });

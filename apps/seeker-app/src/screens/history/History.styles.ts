import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      padding: spacing.m,
    },
    card: {
      marginBottom: spacing.m,
    },
    providerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.m,
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
  });

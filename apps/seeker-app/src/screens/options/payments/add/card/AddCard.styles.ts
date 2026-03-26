import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      padding: spacing.m,
    },
    header: {
      marginBottom: spacing.l,
    },
    form: {
      gap: spacing.m,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.m,
    },
    halfInput: {
      flex: 1,
    },
  });

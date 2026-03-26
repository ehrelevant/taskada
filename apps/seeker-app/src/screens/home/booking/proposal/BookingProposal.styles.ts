import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
      gap: spacing.xl,
    },
    mapContainer: {
      height: 200,
      borderRadius: radius.m,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    map: {
      flex: 1,
    },
    rowSection: {
      flexDirection: 'row',
      gap: spacing.m,
    },
    rowItem: {
      flex: 1,
    },
    specificationsCard: {
      padding: spacing.l,
    },
    buttonContainer: {
      gap: spacing.s,
    },
  });

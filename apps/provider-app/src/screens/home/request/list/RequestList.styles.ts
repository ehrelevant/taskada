import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredContainer: {
      justifyContent: 'center',
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
  });

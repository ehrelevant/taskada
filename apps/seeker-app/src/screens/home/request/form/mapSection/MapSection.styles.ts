import { StyleSheet } from 'react-native';
import { ThemeColors } from '@repo/theme';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: 300,
      backgroundColor: colors.backgroundSecondary,
    },
    loadingContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    errorContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    map: {
      flex: 1,
    },
  });

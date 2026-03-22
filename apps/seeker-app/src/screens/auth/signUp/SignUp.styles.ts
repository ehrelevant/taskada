import { StyleSheet } from 'react-native';
import { ThemeColors } from '@repo/theme';

export const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
    },
  });

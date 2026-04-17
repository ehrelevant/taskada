import { radius, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: 300,
      backgroundColor: colors.card.muted,
      borderRadius: radius.m,
    },
    loadingContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card.muted,
      borderRadius: radius.m,
    },
    errorContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card.muted,
      borderRadius: radius.m,
    },
    map: {
      flex: 1,
    },
    centerPin: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -18,
      marginTop: -36,
    },
  });

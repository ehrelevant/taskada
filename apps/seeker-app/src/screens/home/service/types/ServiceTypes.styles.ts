import { spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    listContent: {
      padding: spacing.m,
    },
    columnWrapper: {
      justifyContent: 'center',
      gap: spacing.s,
    },
  });

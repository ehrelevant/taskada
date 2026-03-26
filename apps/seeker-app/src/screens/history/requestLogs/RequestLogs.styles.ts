import { radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    content: {
      padding: spacing.m,
    },
    card: {
      marginBottom: spacing.m,
    },
    cardLabel: {
      marginBottom: spacing.s,
    },
    serviceTypeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    serviceIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.s,
      marginRight: spacing.m,
    },
    description: {
      lineHeight: 22,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: radius.s,
    },
  });

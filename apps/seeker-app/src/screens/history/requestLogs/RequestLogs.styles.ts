import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.s,
      padding: spacing.m,
    },
    card: {
      marginBottom: 0,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    cardLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
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
    footerButton: {
      marginTop: spacing.s,
    },
  });

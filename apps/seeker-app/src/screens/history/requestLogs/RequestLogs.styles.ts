import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.s,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    card: {
      marginBottom: 0,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
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
    footerButton: {
      marginTop: spacing.s,
    },
  });

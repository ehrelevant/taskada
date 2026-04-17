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
    section: {
      marginBottom: 0,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
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
    seekerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekerDetails: {
      marginLeft: spacing.m,
      flex: 1,
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
    button: {
      marginTop: spacing.s,
    },
  });

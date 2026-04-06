import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    content: {
      gap: spacing.m,
    },
    profileSection: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      alignItems: 'center',
      paddingVertical: spacing.heroInset,
      paddingHorizontal: spacing.m,
    },
    userName: {
      marginTop: spacing.m,
      marginBottom: spacing.xs,
    },
    userSubtitle: {
      opacity: 0.94,
    },
    menuSection: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    sectionHeader: {
      marginTop: spacing.m,
      marginBottom: spacing.s,
    },
    firstSectionHeader: {
      marginTop: 0,
    },
    menuButton: {
      marginBottom: spacing.s,
    },
    footer: {
      marginTop: spacing.s,
    },
    footerCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    footerCaption: {
      marginTop: spacing.xxs,
      marginBottom: spacing.s,
    },
  });

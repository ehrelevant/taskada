import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      backgroundColor: colors.backgroundSecondary,
    },
    userName: {
      marginTop: spacing.m,
      marginBottom: spacing.xs,
    },
    menuSection: {
      marginTop: spacing.l,
      paddingHorizontal: spacing.m,
    },
    sectionHeader: {
      marginTop: spacing.xl,
      marginBottom: spacing.s,
    },
    menuButton: {
      marginBottom: spacing.s,
    },
    footer: {
      marginTop: spacing.xxl,
      marginBottom: spacing.l,
      paddingHorizontal: spacing.m,
    },
    signOutButton: {
      borderColor: colors.error.base,
    },
  });

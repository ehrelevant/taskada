import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.m,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      marginTop: spacing.s,
    },
    walletGrid: {
      flexDirection: 'row',
      gap: spacing.m,
      marginBottom: spacing.l,
    },
    walletTouch: {
      flex: 1,
    },
    walletCard: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      gap: spacing.s,
      height: 100,
    },
    walletCardSelected: {
      borderColor: colors.actionPrimary,
      backgroundColor: colors.surfaceSecondary,
    },
    placeholderLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.actionPrimary,
      borderRadius: 10,
      padding: 2,
    },
    footer: {
      padding: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
  });

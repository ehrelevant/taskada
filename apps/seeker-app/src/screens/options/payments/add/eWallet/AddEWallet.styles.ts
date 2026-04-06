import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      marginTop: spacing.s,
      color: colors.textSecondary,
    },
    sectionCard: {
      backgroundColor: colors.card.base,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
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
      backgroundColor: colors.card.muted,
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
  });

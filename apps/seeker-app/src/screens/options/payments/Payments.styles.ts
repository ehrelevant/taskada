import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    sectionTitle: {
      color: colors.textSecondary,
    },
    savedMethodsContainer: {
      gap: spacing.m,
      marginBottom: spacing.xl,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    methodInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionsContainer: {
      gap: spacing.m,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardIconBg: {
      backgroundColor: colors.secondary.light,
    },
    walletIconBg: {
      backgroundColor: colors.secondary.light,
    },
    plusIcon: {
      marginLeft: 'auto',
    },
  });

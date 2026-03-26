import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionTitle: {
      marginBottom: spacing.m,
    },
    savedMethodsContainer: {
      gap: spacing.m,
      marginBottom: spacing.xl,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
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
      backgroundColor: colors.surfaceSecondary,
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
      borderRadius: 16,
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

import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      padding: spacing.m,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      marginTop: spacing.s,
      marginLeft: spacing.xs,
    },
    savedMethodsContainer: {
      gap: spacing.s,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    emptyState: {
      padding: spacing.l,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: spacing.m,
      marginBottom: spacing.l,
    },
    actionsContainer: {
      gap: spacing.s,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.m,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

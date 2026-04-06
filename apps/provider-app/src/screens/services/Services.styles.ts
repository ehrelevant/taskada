import { radius, spacing, ThemeColors, ThemeShadows } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors, shadows: ThemeShadows) =>
  StyleSheet.create({
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.xs,
    },
    listContent: {
      gap: spacing.s,
      padding: spacing.m,
    },
    card: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: radius.xl,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.m,
    },
    cardContent: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
    },
    iconButton: {
      padding: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      paddingTop: spacing.s,
      marginTop: spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.l,
    },
    fab: {
      position: 'absolute',
      bottom: spacing.l,
      right: spacing.l,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.actionPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.m,
    },
  });

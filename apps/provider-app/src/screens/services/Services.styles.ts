import { radius, spacing, ThemeColors, ThemeShadows } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors, shadows: ThemeShadows) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    listContent: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: 120,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      marginBottom: spacing.m,
      gap: spacing.xs,
    },
    heroPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    card: {
      marginBottom: spacing.m,
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
      marginTop: spacing.sectionGap,
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

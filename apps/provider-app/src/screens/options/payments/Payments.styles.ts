import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    scrollContent: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xxxl,
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
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
    sectionTitle: {
      marginBottom: spacing.m,
      marginTop: spacing.s,
      color: colors.textSecondary,
    },
    savedMethodsContainer: {
      gap: spacing.s,
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
    emptyState: {
      padding: spacing.l,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card.base,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    actionsContainer: {
      gap: spacing.s,
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
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

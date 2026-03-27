import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    heroShell: {
      paddingTop: spacing.pageTop,
      paddingHorizontal: spacing.pageHorizontal,
      paddingBottom: spacing.s,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      marginBottom: spacing.s,
    },
    heroTitle: {
      marginBottom: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    listHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.pageHorizontal,
      marginTop: spacing.m,
      marginBottom: spacing.s,
    },
    listHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    listContent: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingBottom: spacing.xxxl,
      gap: spacing.gridGap,
    },
    columnWrapper: {
      gap: spacing.gridGap,
    },
    serviceCard: {
      width: '48.5%',
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.m,
      minHeight: 156,
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: spacing.s,
    },
    serviceCardIconShell: {
      width: 56,
      height: 56,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.chipBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    serviceCardIconFallback: {
      width: 24,
      height: 24,
      borderRadius: 8,
      backgroundColor: colors.border,
    },
  });

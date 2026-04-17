import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    headerContainer: {
      gap: spacing.s,
    },
    liveHeader: {
      padding: spacing.heroInset,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      gap: spacing.s,
    },
    liveTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
    },
    liveDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.success.base,
    },
    liveStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      marginTop: spacing.xs,
    },
    liveStatPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.home.chipBg,
    },
    requestListContent: {
      gap: spacing.s,
    },
    requestCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
      gap: spacing.s,
    },
    requestTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.s,
    },
    timePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      borderRadius: 999,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xxs,
    },
    requestSeekerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
    },
    requestSeekerText: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xxs,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    requestDescription: {
      marginTop: spacing.xxs,
    },
    requestBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      gap: spacing.m,
    },
    idleHero: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    idleBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    idleTitle: {
      marginTop: spacing.xs,
    },
    idleChecklist: {
      gap: spacing.s,
      flexGrow: 1,
    },
    idleChecklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: 16,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
  });

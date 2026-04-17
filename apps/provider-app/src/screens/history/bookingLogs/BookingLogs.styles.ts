import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
    },
    content: {
      gap: spacing.s,
      padding: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
    },
    mapSection: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
    },
    sectionCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    mapContainer: {
      height: 200,
      borderRadius: radius.m,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    map: {
      flex: 1,
    },
    addressContainer: {
      marginTop: spacing.s,
      padding: spacing.m,
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    addressText: {
      lineHeight: 22,
    },
    sectionLabel: {
      color: colors.textSecondary,
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.s,
    },
    costValue: {
      color: colors.actionPrimary,
      fontWeight: '700',
    },
    specificationsBox: {
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      minHeight: 120,
    },
    specificationsText: {
      lineHeight: 22,
    },
    footerButtons: {
      gap: spacing.s,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      padding: spacing.m,
    },
  });

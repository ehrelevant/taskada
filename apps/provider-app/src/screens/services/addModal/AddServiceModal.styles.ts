import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.card.base,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      padding: spacing.l,
      maxHeight: '85%',
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.card.stroke,
    },
    titleWrap: {
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    titlePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      marginBottom: spacing.s,
    },
    title: {
      textAlign: 'center',
    },
    scrollContent: {
      paddingBottom: spacing.m,
    },
    fieldContainer: {
      marginBottom: spacing.m,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
    },
    label: {
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    typeList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
    },
    chip: {
      paddingHorizontal: spacing.m,
      paddingVertical: 8,
      borderRadius: radius.round,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    chipSelected: {
      backgroundColor: colors.actionPrimary,
      borderColor: colors.actionPrimary,
    },
    chipDisabled: {
      backgroundColor: colors.card.muted,
      borderColor: colors.card.stroke,
      opacity: 0.5,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.m,
      paddingTop: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
    },
    button: {
      flex: 1,
    },
  });

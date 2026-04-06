import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlayContent: {
      backgroundColor: colors.card.base,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      padding: spacing.m,
      gap: spacing.m,
    },
    titleWrap: {
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
    fieldContainer: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
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
      flex: 1,
      flexGrow: 0,
      flexDirection: 'row',
      gap: spacing.s,
    },
    button: {
      flex: 1,
    },
  });

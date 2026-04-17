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
    heroCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.m,
      gap: spacing.xs,
    },
    title: {
      textAlign: 'left',
    },
    fieldContainer: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
    },
    typeSelectorButton: {
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.s,
    },
    typeSelectorButtonDisabled: {
      opacity: 0.65,
    },
    typeSelectorButtonOpen: {
      borderWidth: 1,
      borderColor: colors.actionPrimary,
      backgroundColor: colors.interactive.secondaryBg,
    },
    typeSelectorText: {
      flex: 1,
    },
    pickerContainer: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    pickerContent: {
      gap: spacing.m,
    },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.s,
    },
    typeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: radius.m,
      backgroundColor: colors.card.base,
      padding: spacing.m,
      marginBottom: spacing.s,
    },
    typeOptionSelected: {
      borderColor: colors.actionPrimary,
      backgroundColor: colors.interactive.secondaryBg,
    },
    pickerList: {
      paddingTop: spacing.xs,
      paddingBottom: spacing.xxxl,
    },
    noResults: {
      textAlign: 'center',
      marginTop: spacing.xl,
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

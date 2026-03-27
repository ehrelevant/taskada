import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    iconButton: {
      padding: spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.m,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xl,
      gap: spacing.m,
    },
    centeredContent: {
      backgroundColor: colors.home.heroStart,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      padding: spacing.heroInset,
    },
    header: {
      alignItems: 'flex-start',
      marginBottom: spacing.s,
    },
    heroPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      marginBottom: spacing.s,
    },
    headerTitle: {
      color: colors.textInverse,
    },
    instructionContainer: {
      marginBottom: spacing.l,
    },
    instructionText: {
      color: colors.textInverse,
      lineHeight: 24,
      opacity: 0.94,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    circularButton: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.actionPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    doneButton: {
      backgroundColor: colors.success.base,
    },
    disabledButton: {
      opacity: 0.8,
    },
    buttonText: {
      color: colors.textInverse,
      fontWeight: '700',
    },
    spacer: {
      flex: 1,
    },
    bottomSection: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.l,
      gap: spacing.m,
    },
    infoItem: {
      flex: 1,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    costValue: {
      color: colors.actionPrimary,
      fontWeight: '700',
      marginTop: spacing.xs,
    },
    costRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    detailsButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.xs,
      padding: spacing.m,
      backgroundColor: colors.card.base,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    detailsButtonText: {
      color: colors.actionPrimary,
      fontWeight: '600',
    },
  });

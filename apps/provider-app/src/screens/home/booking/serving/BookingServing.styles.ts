import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      padding: spacing.m,
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 400,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    headerTitle: {
      textAlign: 'center',
    },
    instructionContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.m,
    },
    instructionText: {
      textAlign: 'center',
      lineHeight: 24,
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
      marginTop: spacing.l,
      paddingTop: spacing.l,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.l,
      gap: spacing.m,
    },
    infoItem: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
    },
    costValue: {
      color: colors.actionPrimary,
      fontWeight: '700',
      marginTop: spacing.xs,
    },
    detailsButton: {
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailsButtonText: {
      color: colors.actionPrimary,
      fontWeight: '600',
    },
  });

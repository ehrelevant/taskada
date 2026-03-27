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
    keyboardView: {
      flex: 1,
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
    mapSection: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
    },
    sectionTitle: {
      marginBottom: spacing.m,
      color: colors.textSecondary,
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
    locationTextContainer: {
      marginTop: spacing.s,
      padding: spacing.m,
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    formSection: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      gap: spacing.m,
    },
    inputContainer: {
      gap: spacing.s,
    },
    inputLabel: {
      fontWeight: '600',
    },
    inputLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    costInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      paddingHorizontal: spacing.m,
    },
    currencySymbol: {
      marginRight: spacing.s,
      color: colors.textPrimary,
    },
    costInput: {
      flex: 1,
      paddingVertical: spacing.m,
      fontSize: 18,
      color: colors.textPrimary,
    },
    specificationsInput: {
      backgroundColor: colors.card.muted,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      padding: spacing.m,
      minHeight: 120,
      color: colors.textPrimary,
      fontSize: 16,
    },
    submitContainer: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
      padding: spacing.xl,
      width: '80%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    modalLoader: {
      marginBottom: spacing.m,
    },
    modalTitle: {
      marginBottom: spacing.s,
      textAlign: 'center',
    },
    modalText: {
      textAlign: 'center',
    },
  });

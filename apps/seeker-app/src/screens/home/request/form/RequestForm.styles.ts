import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacing.m,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
    },
    sectionCard: {
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      padding: spacing.m,
      gap: spacing.s,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.s,
    },
    serviceTypeSelectorButton: {
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
    serviceTypeSelectorButtonOpen: {
      borderColor: colors.actionPrimary,
      backgroundColor: colors.interactive.secondaryBg,
    },
    serviceTypeSelectorPlaceholder: {
      flex: 1,
    },
    serviceTypeLoading: {
      paddingVertical: spacing.xs,
    },
    serviceTypeErrorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.muted,
      padding: spacing.s,
      gap: spacing.s,
    },
    serviceTypeHint: {
      marginTop: spacing.xs,
    },
    serviceTypeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: radius.m,
      backgroundColor: colors.card.base,
      padding: spacing.m,
    },
    serviceTypeOptionSelected: {
      borderColor: colors.actionPrimary,
      backgroundColor: colors.interactive.secondaryBg,
    },
    mapContainer: {
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      overflow: 'hidden',
    },
    imageList: {
      gap: spacing.s,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: 84,
      height: 84,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    removeImage: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: colors.overlay.medium,
      borderRadius: radius.round,
      padding: 4,
    },
    addImageButton: {
      width: 84,
      height: 84,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.actionPrimary,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.interactive.secondaryBg,
    },
    submitSection: {
      gap: spacing.s,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    modalContent: {
      gap: spacing.m,
    },
    modalHeroCard: {
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.m,
      gap: spacing.xs,
    },
    modalHeaderTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalInner: {
      flex: 1,
    },
    modalLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalList: {
      paddingTop: spacing.s,
      paddingBottom: spacing.xxxl,
      gap: spacing.s,
    },
    serviceResult: {
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: radius.m,
      backgroundColor: colors.card.base,
      padding: spacing.m,
      marginBottom: spacing.s,
    },
    serviceResultContent: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xxs,
    },
    serviceResultMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xxs,
    },
    noResults: {
      textAlign: 'center',
      marginTop: spacing.xl,
    },
    hintText: {
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });

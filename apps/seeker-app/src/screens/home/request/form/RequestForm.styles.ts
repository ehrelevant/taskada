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
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.m,
      paddingTop: spacing.l,
      paddingBottom: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.card.stroke,
      backgroundColor: colors.card.base,
    },
    modalSubtext: {
      marginTop: spacing.xxs,
    },
    modalInner: {
      flex: 1,
      padding: spacing.m,
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

import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: colors.canvas.base,
    },
    container: {
      flex: 1,
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
      marginBottom: spacing.s,
    },
    heroTitle: {
      marginBottom: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    heroBadgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      marginTop: spacing.m,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
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
    sectionHintPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      borderRadius: radius.round,
      backgroundColor: colors.card.muted,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    mapContainer: {
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    input: {
      marginBottom: spacing.xs,
    },
    imageSection: {
      marginTop: spacing.xs,
    },
    imageList: {
      gap: spacing.s,
      paddingRight: spacing.m,
    },
    imageContainer: {
      position: 'relative',
      marginRight: spacing.s,
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
    addImageLabel: {
      marginTop: spacing.xxs,
    },
    submitButton: {
      marginTop: spacing.s,
    },
    footerNote: {
      marginTop: spacing.xxs,
      paddingHorizontal: spacing.s,
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

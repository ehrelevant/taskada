import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
      paddingVertical: spacing.s,
    },
    contentContainer: {
      paddingHorizontal: spacing.pageHorizontal,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      marginBottom: spacing.m,
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
    serviceTypeName: {
      marginBottom: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    sectionCard: {
      backgroundColor: colors.card.base,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      marginBottom: spacing.m,
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.s,
    },
    sectionLabel: {
      color: colors.textSecondary,
    },
    seekerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekerDetails: {
      flex: 1,
      marginLeft: spacing.m,
    },
    description: {
      lineHeight: 22,
    },
    descriptionBox: {
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: radius.s,
    },
    mapContainer: {
      height: 150,
      borderRadius: radius.s,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.card.stroke,
      marginBottom: spacing.s,
    },
    map: {
      flex: 1,
    },
    addressContainer: {
      padding: spacing.s,
    },
    buttonContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      padding: spacing.m,
    },
    button: {
      marginTop: spacing.s,
    },
    loadingText: {
      marginTop: spacing.m,
    },
    errorTitle: {
      marginBottom: spacing.m,
    },
    errorMessage: {
      textAlign: 'center',
      marginBottom: spacing.l,
    },
  });

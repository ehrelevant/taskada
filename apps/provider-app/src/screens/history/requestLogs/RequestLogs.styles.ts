import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    loadingText: {
      marginTop: spacing.m,
    },
    scrollContent: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.pageTop,
      paddingBottom: spacing.xxxl,
      gap: spacing.m,
    },
    section: {
      marginBottom: 0,
      borderWidth: 1,
      borderColor: colors.card.stroke,
      backgroundColor: colors.card.base,
      borderRadius: radius.l,
    },
    sectionLabel: {
      marginBottom: spacing.s,
      color: colors.textSecondary,
    },
    serviceTypeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    serviceIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.s,
      marginRight: spacing.m,
    },
    seekerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekerDetails: {
      marginLeft: spacing.m,
      flex: 1,
    },
    description: {
      lineHeight: 22,
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
    buttonContainer: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
    },
    button: {
      marginTop: spacing.m,
    },
  });

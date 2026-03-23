import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: spacing.m,
      paddingBottom: spacing.xl,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    headerContainer: {
      flex: 1,
      alignItems: 'center',
    },
    serviceTypeName: {
      marginBottom: spacing.xs,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.m,
    },
    sectionLabel: {
      marginBottom: spacing.s,
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
      backgroundColor: colors.background,
      padding: spacing.m,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.border,
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
      borderColor: colors.border,
      marginBottom: spacing.s,
    },
    map: {
      flex: 1,
    },
    addressContainer: {
      padding: spacing.s,
    },
    buttonContainer: {
      marginTop: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.m,
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

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
      padding: spacing.l,
    },
    loadingText: {
      marginTop: spacing.m,
    },
    scrollContent: {
      padding: spacing.m,
      paddingBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.m,
    },
    sectionLabel: {
      marginBottom: spacing.s,
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
      padding: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    button: {
      marginTop: spacing.m,
    },
  });

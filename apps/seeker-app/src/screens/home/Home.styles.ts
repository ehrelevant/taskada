import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.l,
      paddingHorizontal: spacing.l,
      backgroundColor: colors.backgroundSecondary,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    greetingText: {
      marginLeft: spacing.m,
      flex: 1,
    },
    subtitle: {
      marginTop: spacing.s,
    },
    searchContainer: {
      paddingHorizontal: spacing.m,
      marginTop: -spacing.l,
      zIndex: 10,
    },
    searchResults: {
      position: 'absolute',
      top: 60,
      left: spacing.m,
      right: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: radius.l,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
      maxHeight: 300,
      zIndex: 1000,
    },
    searchLoading: {
      padding: spacing.m,
      alignItems: 'center',
    },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchResultContent: {
      flex: 1,
    },
    serviceTypeGrid: {
      justifyContent: 'center',
      gap: spacing.s,
    },
    serviceTypesContent: {
      width: '100%',
      paddingHorizontal: spacing.m,
      paddingTop: spacing.s,
      paddingBottom: spacing.m,
    },
    featuredSection: {
      marginTop: spacing.l,
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.xl,
    },
    featuredList: {
      gap: spacing.m,
      width: '100%',
      paddingTop: spacing.s,
    },
  });

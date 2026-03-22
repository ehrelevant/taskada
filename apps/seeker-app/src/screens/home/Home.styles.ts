import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    header: {
      padding: spacing.l,
      paddingBottom: spacing.s,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchContainer: {
      padding: spacing.m,
      backgroundColor: colors.background,
    },
    searchResults: {
      position: 'absolute',
      top: 60,
      left: spacing.m,
      right: spacing.m,
      backgroundColor: colors.surface,
      borderRadius: radius.m,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      maxHeight: 300,
      zIndex: 1000,
    },
    searchLoading: {
      padding: spacing.m,
      alignItems: 'center',
    },
    noResults: {
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
    serviceTypeGrid: {
      justifyContent: 'center',
      gap: spacing.s,
    },
    serviceTypesContent: {
      width: '100%',
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.s,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: spacing.s,
    },
    section: {
      padding: spacing.m,
    },
  });

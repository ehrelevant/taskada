import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.m,
    },
    listContent: {
      padding: spacing.m,
    },
    card: {
      marginBottom: spacing.m,
    },
    providerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    providerInfo: {
      flex: 1,
      marginLeft: spacing.m,
    },
    costContainer: {
      alignItems: 'flex-end',
    },
    statusDateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    statusBadge: {
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
      borderRadius: 4,
    },
    statusText: {
      fontWeight: '600',
    },
    detailsButton: {
      marginTop: spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
  });

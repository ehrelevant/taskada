import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  userName: {
    marginTop: spacing.m,
    marginBottom: spacing.xs,
  },
  menuSection: {
    marginTop: spacing.m,
  },
  sectionTitle: {
    marginTop: spacing.l,
    marginBottom: spacing.s,
    marginLeft: spacing.xs,
  },
  menuButton: {
    marginBottom: spacing.s,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
  signOutButton: {
    borderColor: colors.error,
  },
});

import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  providerSection: {
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
});

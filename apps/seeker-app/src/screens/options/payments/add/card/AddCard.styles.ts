import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
  },
  header: {
    marginBottom: spacing.l,
  },
  form: {
    gap: spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});

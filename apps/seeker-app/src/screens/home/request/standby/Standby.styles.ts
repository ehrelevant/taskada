import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  spinnerContainer: {
    marginVertical: spacing.xl,
  },
  serviceInfo: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  addressContainer: {
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
  },
  addressText: {
    marginTop: spacing.xs,
  },
  cancelButton: {
    marginTop: spacing.s,
  },
  connectingText: {
    marginTop: spacing.m,
    color: colors.textSecondary,
  },
  errorText: {
    marginBottom: spacing.m,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  button: {
    marginTop: spacing.m,
  },
});

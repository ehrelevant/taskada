import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.m,
  },
  error: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.s,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  link: {
    color: colors.actionPrimary,
    fontWeight: '600',
  },
});

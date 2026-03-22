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
  mapSection: {
    marginBottom: spacing.l,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  addressText: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    lineHeight: 22,
  },
  errorSection: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.error.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error.base + '40',
  },
  errorText: {
    color: colors.error.base,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  arriveButton: {
    width: '100%',
  },
});

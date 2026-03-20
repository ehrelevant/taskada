import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    padding: spacing.m,
  },
  mapSection: {
    marginBottom: spacing.l,
  },
  mapContainer: {
    height: 200,
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
  },
  rowSection: {
    flexDirection: 'row',
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  rowItem: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowValue: {
    fontWeight: '600',
  },
  costValue: {
    fontWeight: '700',
    color: colors.actionPrimary,
  },
  specificationsBox: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  specificationsText: {
    lineHeight: 22,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.m,
  },
  acceptButton: {
    width: '100%',
  },
  declineButton: {
    width: '100%',
  },
});

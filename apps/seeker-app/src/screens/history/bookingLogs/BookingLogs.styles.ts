import { colors, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  serviceCard: {
    marginBottom: spacing.l,
  },
  providerSection: {
    alignItems: 'center',
  },
  tapHint: {
    marginTop: spacing.m,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  detailRow: {
    marginBottom: spacing.m,
  },
  costValue: {
    color: colors.actionPrimary,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  specificationsBox: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    marginTop: spacing.xs,
  },
  specificationsText: {
    lineHeight: 22,
  },
  statusBadge: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  statusText: {
    fontWeight: '600',
    color: colors.actionPrimary,
  },
  buttonContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  secondaryButton: {
    marginTop: spacing.s,
  },
  reviewCard: {
    backgroundColor: colors.surface,
  },
  reviewLabel: {
    marginBottom: spacing.s,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 100,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});

import { colors, spacing } from '@repo/theme';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.m,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  title: {
    color: colors.actionPrimary,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
  },
  providerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImageContainer: {
    marginRight: spacing.m,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    marginBottom: spacing.xs,
  },
  serviceType: {
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  detailsButton: {
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
  },
  detailsButtonText: {
    color: colors.actionPrimary,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  reviewFormContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.m,
    paddingBottom: Platform.OS === 'ios' ? spacing.l : spacing.m,
  },
  reviewFormTitle: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  ratingInputContainer: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  reviewInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 80,
    marginBottom: spacing.m,
    color: colors.textPrimary,
    fontSize: 16,
  },
});

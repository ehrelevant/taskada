import { colors, shadows, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  listContent: {
    padding: spacing.m,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  cardContent: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  iconButton: {
    padding: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.s,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.l,
    right: spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.actionPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.m,
  },
});

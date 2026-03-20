import { colors, radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  label: {
    marginBottom: spacing.s,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.actionPrimary,
    borderStyle: 'dashed',
    backgroundColor: colors.backgroundSecondary,
  },
  searchButtonText: {
    marginLeft: spacing.s,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: radius.m,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.s,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: spacing.s,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  providerName: {
    marginLeft: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  autoMatchHint: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.s,
  },
});

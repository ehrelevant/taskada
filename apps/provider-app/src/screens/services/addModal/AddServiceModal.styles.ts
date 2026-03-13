import { colors, radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.l,
    maxHeight: '85%',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  scrollContent: {
    paddingBottom: spacing.m,
  },
  fieldContainer: {
    marginBottom: spacing.m,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  typeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipSelected: {
    backgroundColor: colors.actionPrimary,
    borderColor: colors.actionPrimary,
  },
  chipDisabled: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.m,
    paddingTop: spacing.m,
  },
  button: {
    flex: 1,
  },
});

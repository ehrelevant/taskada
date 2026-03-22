import { colors, radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    marginBottom: spacing.l,
  },
  userInfo: {
    marginLeft: spacing.m,
    flex: 1,
  },
  sectionLabel: {
    marginBottom: spacing.s,
  },
  reasonsContainer: {
    gap: spacing.s,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  reasonChipSelected: {
    borderColor: colors.actionPrimary,
    backgroundColor: colors.actionPrimary + '10',
  },
  reasonChipText: {
    flex: 1,
  },
  descriptionInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 120,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  imageSection: {
    marginTop: spacing.l,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    gap: spacing.s,
  },
  imagePickerDisabled: {
    opacity: 0.5,
  },
  selectedImagesContainer: {
    marginTop: spacing.s,
  },
  selectedImageWrapper: {
    marginRight: spacing.s,
    position: 'relative',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: radius.s,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.error.base,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContainer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  errorText: {
    marginTop: spacing.s,
  },
  alreadyReportedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});

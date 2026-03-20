import { colors, radius, spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formSection: {
    flex: 1,
    padding: spacing.m,
  },
  sectionLabel: {
    marginBottom: spacing.s,
    marginTop: spacing.s,
  },
  input: {
    marginBottom: spacing.s,
  },
  imageSection: {
    marginVertical: spacing.s,
  },
  imageList: {
    marginTop: spacing.s,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.s,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.s,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  submitButton: {
    marginTop: spacing.l,
  },
  modalContainer: {
    flex: 1,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
  },
  modalInner: {
    flex: 1,
    padding: spacing.s,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalList: {
    padding: spacing.m,
  },
  serviceResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceResultContent: {
    flex: 1,
  },
  noResults: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  hintText: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

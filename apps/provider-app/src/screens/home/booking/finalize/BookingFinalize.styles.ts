import { colors, spacing } from '@repo/theme';
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
  },
  mapSection: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
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
  locationTextContainer: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  formSection: {
    gap: spacing.l,
  },
  inputContainer: {
    gap: spacing.s,
  },
  inputLabel: {
    fontWeight: '600',
  },
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
  },
  currencySymbol: {
    marginRight: spacing.s,
    color: colors.textPrimary,
  },
  costInput: {
    flex: 1,
    paddingVertical: spacing.m,
    fontSize: 18,
    color: colors.textPrimary,
  },
  specificationsInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    minHeight: 120,
    color: colors.textPrimary,
    fontSize: 16,
  },
  submitContainer: {
    padding: spacing.m,
    marginBottom: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.xl,
    width: '80%',
    alignItems: 'center',
  },
  modalLoader: {
    marginBottom: spacing.m,
  },
  modalTitle: {
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
});

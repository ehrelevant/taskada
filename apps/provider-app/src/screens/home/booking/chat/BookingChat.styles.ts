import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    messagesList: {
      padding: spacing.m,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: spacing.m,
      alignItems: 'flex-end',
    },
    ownMessage: {
      justifyContent: 'flex-start',
    },
    otherMessage: {
      justifyContent: 'flex-end',
    },
    messageAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: spacing.s,
    },
    messageBubble: {
      maxWidth: '70%',
      padding: spacing.m,
      borderRadius: 16,
    },
    ownBubble: {
      backgroundColor: colors.actionPrimary,
      borderBottomLeftRadius: 4,
    },
    otherBubble: {
      backgroundColor: colors.actionSecondary,
      borderBottomRightRadius: 4,
    },
    messageTime: {
      marginTop: spacing.xs,
    },
    imageContainer: {
      marginBottom: spacing.xs,
    },
    messageImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: spacing.xs,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      maxHeight: 100,
    },
    selectedImageWrapper: {
      marginRight: spacing.s,
      position: 'relative',
    },
    selectedImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    removeImageButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: colors.error.base,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePickerButton: {
      padding: spacing.s,
      marginRight: spacing.s,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      padding: spacing.m,
      gap: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    declineButton: {
      flex: 1,
    },
    finalizeButton: {
      flex: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      maxHeight: 100,
      color: colors.textPrimary,
    },
    sendButton: {
      marginLeft: spacing.m,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.actionPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.actionDisabled,
    },
  });

import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.canvas.base,
    },
    iconButton: {
      padding: spacing.xs,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerMeta: {
      marginLeft: spacing.s,
    },
    introBanner: {
      marginHorizontal: spacing.pageHorizontal,
      marginTop: spacing.s,
      marginBottom: spacing.s,
      borderRadius: radius.l,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    messagesList: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingBottom: spacing.m,
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
      borderRadius: radius.l,
      marginRight: spacing.s,
    },
    messageBubble: {
      maxWidth: '70%',
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
    },
    ownBubble: {
      backgroundColor: colors.actionPrimary,
      borderColor: colors.interactive.primaryBg,
      borderBottomLeftRadius: radius.xs,
    },
    otherBubble: {
      backgroundColor: colors.card.base,
      borderColor: colors.card.stroke,
      borderBottomRightRadius: radius.xs,
    },
    messageTime: {
      marginTop: spacing.xs,
      opacity: 0.75,
    },
    imageContainer: {
      marginBottom: spacing.xs,
    },
    messageImage: {
      width: 100,
      height: 100,
      borderRadius: radius.s,
      marginRight: spacing.xs,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.pageHorizontal,
      paddingVertical: spacing.s,
      backgroundColor: colors.card.muted,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      maxHeight: 100,
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
      top: -8,
      right: -8,
      backgroundColor: colors.error.base,
      borderRadius: radius.m,
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
      paddingHorizontal: spacing.pageHorizontal,
      paddingVertical: spacing.m,
      gap: spacing.s,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
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
      paddingHorizontal: spacing.pageHorizontal,
      paddingVertical: spacing.m,
      backgroundColor: colors.canvas.base,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.card.base,
      borderWidth: 1,
      borderColor: colors.card.stroke,
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

import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      padding: spacing.m,
    },
    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
    },
    headerCenterText: {
      marginLeft: spacing.s,
      flex: 1,
      minWidth: 0,
    },
    messagesList: {
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.m,
      gap: spacing.s,
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
      gap: spacing.s,
      marginBottom: spacing.s,
    },
    emptyStateCard: {
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: radius.m,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    ownMessage: {
      justifyContent: 'flex-end',
    },
    otherMessage: {
      justifyContent: 'flex-start',
    },
    messageAvatar: {
      width: 32,
      height: 32,
      borderRadius: radius.l,
      marginRight: spacing.s,
    },
    messageBubble: {
      maxWidth: '78%',
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      gap: spacing.xs,
    },
    ownBubble: {
      backgroundColor: colors.interactive.primaryBg,
      borderColor: colors.actionPrimary,
      borderBottomRightRadius: radius.xs,
    },
    otherBubble: {
      backgroundColor: colors.card.base,
      borderBottomLeftRadius: radius.xs,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    messageTime: {
      opacity: 0.9,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      padding: spacing.m,
      gap: spacing.s,
    },
    actionButton: {
      flex: 1,
    },
    messageImage: {
      width: 100,
      height: 100,
      borderRadius: radius.s,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      backgroundColor: colors.card.base,
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
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.canvas.base,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.card.base,
      borderRadius: 20,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      maxHeight: 100,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.card.stroke,
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

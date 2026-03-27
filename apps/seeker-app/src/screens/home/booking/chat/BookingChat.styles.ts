import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    sessionBanner: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.s,
    },
    sessionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.round,
      backgroundColor: colors.home.chipBg,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs,
    },
    messagesList: {
      padding: spacing.m,
      paddingBottom: spacing.l,
    },
    emptyStateCard: {
      borderWidth: 1,
      borderColor: colors.card.stroke,
      borderRadius: radius.m,
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      marginTop: spacing.m,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: spacing.m,
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
      borderRadius: radius.l,
    },
    ownBubble: {
      backgroundColor: colors.actionPrimary,
      borderBottomRightRadius: radius.xs,
    },
    otherBubble: {
      backgroundColor: colors.card.base,
      borderBottomLeftRadius: radius.xs,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    messageTime: {
      marginTop: spacing.xs,
      opacity: 0.9,
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
    actionButtonsContainer: {
      paddingHorizontal: spacing.pageHorizontal,
      paddingVertical: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.card.stroke,
      backgroundColor: colors.canvas.base,
    },
    cancelButton: {
      flex: 1,
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

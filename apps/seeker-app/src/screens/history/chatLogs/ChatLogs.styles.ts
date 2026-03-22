import { spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.m,
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
      justifyContent: 'flex-end',
    },
    otherMessage: {
      justifyContent: 'flex-start',
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
  });

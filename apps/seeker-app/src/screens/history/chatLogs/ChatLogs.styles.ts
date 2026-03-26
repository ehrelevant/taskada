import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      borderRadius: radius.l,
      marginRight: spacing.s,
    },
    messageBubble: {
      maxWidth: '70%',
      padding: spacing.m,
      borderRadius: radius.l,
    },
    ownBubble: {
      backgroundColor: colors.actionPrimary,
      borderBottomLeftRadius: radius.xs,
    },
    otherBubble: {
      backgroundColor: colors.actionSecondary,
      borderBottomRightRadius: radius.xs,
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
      borderRadius: radius.s,
      marginRight: spacing.xs,
    },
  });

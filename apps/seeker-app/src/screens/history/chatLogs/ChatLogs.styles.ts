import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      padding: spacing.xs,
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
    messagesList: {
      padding: spacing.m,
      gap: spacing.s,
      paddingBottom: spacing.xl,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    rowEnd: {
      justifyContent: 'flex-end',
    },
    rowStart: {
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
      borderColor: colors.card.stroke,
      borderBottomLeftRadius: radius.xs,
    },
    messageTime: {
      opacity: 0.75,
    },
    imageContainer: {
      marginBottom: spacing.xs,
    },
    messageImage: {
      width: 96,
      height: 96,
      borderRadius: radius.s,
      marginRight: spacing.xs,
    },
  });

import { radius, spacing, ThemeColors } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
    },
    centerContent: {
      flex: 1,
      gap: spacing.m,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroCard: {
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.home.heroAccent,
      backgroundColor: colors.home.heroStart,
      padding: spacing.heroInset,
    },
    serviceTypeName: {
      marginBottom: spacing.xs,
    },
    heroSubtitle: {
      opacity: 0.94,
    },
    sectionCard: {
      backgroundColor: colors.card.base,
      padding: spacing.m,
      borderRadius: radius.m,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    sectionLabel: {
      color: colors.textSecondary,
    },
    seekerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekerDetails: {
      flex: 1,
      marginLeft: spacing.m,
    },
    description: {
      lineHeight: 22,
    },
    descriptionBox: {
      backgroundColor: colors.card.muted,
      padding: spacing.m,
      borderRadius: radius.s,
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: radius.s,
    },
    mapContainer: {
      height: 150,
      borderRadius: radius.s,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.card.stroke,
    },
    map: {
      flex: 1,
    },
    addressContainer: {
      padding: spacing.s,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: spacing.s,
    },
    actionButton: {
      flex: 1,
    },
  });

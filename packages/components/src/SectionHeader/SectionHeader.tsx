import { spacing } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '../Typography';

type Props = {
  title: string;
  onViewAllPress?: () => void;
  viewAllText?: string;
};

export function SectionHeader({ title, onViewAllPress, viewAllText = 'View All' }: Props) {
  return (
    <View style={styles.container}>
      <Typography variant="h4">{title}</Typography>
      {onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress} style={styles.viewAllButton}>
          <Typography variant="body2" color="actionPrimary">
            {viewAllText}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  viewAllButton: {
    padding: spacing.xs,
  },
});

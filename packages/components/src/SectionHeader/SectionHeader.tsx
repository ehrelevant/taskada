import { spacing } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

import { Typography } from '../Typography';

export interface SectionHeaderProps extends ViewProps {
  title: string;
  onViewAllPress?: () => void;
  viewAllText?: string;
}

export function SectionHeader({ title, onViewAllPress, viewAllText = 'View All', style, ...rest }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
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
    paddingVertical: spacing.s,
  },
  viewAllButton: {
    padding: spacing.xs,
  },
});

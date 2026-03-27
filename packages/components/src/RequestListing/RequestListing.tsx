import { spacing } from '@repo/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Button } from '../Button';
import { Card } from '../Card';
import { Typography } from '../Typography';

export interface RequestListingProps extends ViewProps {
  title: string;
  distance?: string;
  address?: string;
  onViewDetails?: () => void;
  subtitle?: string;
}

export function RequestListing({
  title,
  distance,
  address,
  onViewDetails,
  subtitle,
  style,
  ...rest
}: RequestListingProps) {
  return (
    <Card style={[styles.card, style]} {...rest}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Typography variant="h5" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
          {distance && (
            <Typography variant="body2" color="textSecondary" style={styles.distance}>
              Distance: {distance}
            </Typography>
          )}
          {address && (
            <Typography variant="body1" color="textSecondary" style={styles.address}>
              {address}
            </Typography>
          )}
        </View>
      </View>

      <View style={styles.buttonWrap}>
        <Button title="View Request Details" onPress={onViewDetails} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    paddingRight: spacing.m,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xs,
  },
  distance: {
    marginTop: spacing.xs,
  },
  address: {
    marginTop: spacing.s,
  },
  buttonWrap: {
    marginTop: spacing.m,
  },
});

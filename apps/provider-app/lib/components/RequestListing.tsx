import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { shadows } from '@repo/theme';
import { StyleSheet, View } from 'react-native';

type Props = {
  title: string;
  distance?: string;
  address?: string;
  onViewDetails?: () => void;
};

export function RequestListing({ title, distance, address, onViewDetails }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Typography weight="bold" style={styles.title}>
            {title}
          </Typography>
          {distance ? <Typography style={styles.distance}>Distance: {distance}</Typography> : null}
          {address ? <Typography style={styles.address}>{address}</Typography> : null}
        </View>

        {/* TODO: Show Thumbnails */}
      </View>

      <View style={styles.buttonWrap}>
        <Button title="View Request Details" onPress={onViewDetails} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    ...shadows.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 20,
  },
  distance: {
    marginTop: 4,
    color: '#666',
  },
  address: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  buttonWrap: {
    marginTop: 12,
  },
});

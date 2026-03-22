import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Typography } from '../Typography';

type Props = {
  title: string;
  onClose?: () => void;
};

export function ModalHeader({ title, onClose }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Typography variant="h5" style={styles.title}>
        {title}
      </Typography>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.textPrimary} />
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
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
});

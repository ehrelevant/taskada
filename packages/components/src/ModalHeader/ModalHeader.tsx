import { ReactNode } from 'react';
import { spacing, useTheme } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { X } from 'lucide-react-native';

import { Typography } from '../Typography';

export interface ModalHeaderProps extends ViewProps {
  title: string;
  onClose?: () => void;
  rightContent?: ReactNode;
  align?: 'left' | 'center';
}

export function ModalHeader({ title, onClose, rightContent, align = 'left', style, ...rest }: ModalHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { borderBottomColor: colors.border }, style]} {...rest}>
      <Typography variant="h5" align={align} style={styles.title}>
        {title}
      </Typography>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
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
  rightContent: {
    marginRight: spacing.s,
  },
  closeButton: {
    padding: spacing.xs,
  },
});

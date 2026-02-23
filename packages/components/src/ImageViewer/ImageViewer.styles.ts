import { spacing } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl + spacing.l,
    right: spacing.m,
    zIndex: 1,
    padding: spacing.s,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

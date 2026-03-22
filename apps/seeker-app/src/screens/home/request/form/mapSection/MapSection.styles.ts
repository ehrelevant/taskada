import { palette } from '@repo/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: palette.gray200,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray200,
  },
  errorContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray200,
  },
  map: {
    flex: 1,
  },
});

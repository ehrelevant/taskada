import { Platform, TextStyle } from 'react-native';

export const fontFamily = {
  regular: Platform.select({ ios: 'AvenirNext-Regular', android: 'sans-serif', default: 'System' }),
  medium: Platform.select({ ios: 'AvenirNext-Medium', android: 'sans-serif-medium', default: 'System' }),
  bold: Platform.select({ ios: 'AvenirNext-DemiBold', android: 'sans-serif-condensed', default: 'System' }),
};

export const fontSize = {
  xs: 11,
  s: 13,
  m: 16,
  l: 19,
  xl: 24,
  xxl: 30,
  xxxl: 36,
  display: 44,
};

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const lineHeight = {
  xs: 16,
  s: 20,
  m: 24,
  l: 28,
  xl: 34,
  xxl: 40,
  xxxl: 46,
};

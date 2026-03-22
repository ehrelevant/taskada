import { Platform } from 'react-native';

import { colors } from './colors';

function buildShadows(shadowColor: string) {
  return {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: { elevation: 1 },
      default: {},
    }),
    s: Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: { elevation: 2 },
      default: {},
    }),
    m: Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      },
      android: { elevation: 3 },
      default: {},
    }),
    l: Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      },
      android: { elevation: 5 },
      default: {},
    }),
  };
}

export const shadows = buildShadows(colors.textPrimary);
export const shadowsDark = buildShadows('rgba(0, 0, 0, 0.5)');

export type ThemeShadows = typeof shadows;

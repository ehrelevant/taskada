export const palette = {
  // Core colors
  primary: '#1B334F',
  primaryDark: '#142638',
  primaryLight: '#2A4A6F',
  secondary: '#E29578',
  secondaryDark: '#C77A5F',
  secondaryLight: '#F0B09A',

  // Neutrals
  black: '#000000',
  gray900: '#212121',
  gray800: '#424242',
  gray700: '#616161',
  gray600: '#757575',
  gray500: '#9E9E9E',
  gray400: '#BDBDBD',
  gray300: '#E0E0E0',
  gray200: '#EEEEEE',
  gray100: '#F5F5F5',
  white: '#FFFFFF',

  // Feedback colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  pending: '#FF9800',

  // Transparent
  transparent: 'transparent',
};

export const colors = {
  // Primary
  primary: {
    base: palette.primary,
    light: palette.primaryLight,
    dark: palette.primaryDark,
    text: palette.white,
  },

  // Secondary
  secondary: {
    base: palette.secondary,
    light: palette.secondaryLight,
    dark: palette.secondaryDark,
    text: palette.gray900,
  },

  // UI elements
  background: palette.white,
  backgroundSecondary: palette.gray100,
  surface: palette.white,
  surfaceSecondary: palette.gray100,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray700,
  textDisabled: palette.gray500,
  textInverse: palette.white,

  // Actions
  actionPrimary: palette.primary,
  actionSecondary: palette.secondary,
  actionDisabled: palette.gray400,

  // Feedback - Enhanced with state variations
  success: {
    base: palette.success,
    light: '#E8F5E9',
    dark: '#388E3C',
    text: palette.white,
  },
  warning: {
    base: palette.warning,
    light: '#FFF8E1',
    dark: '#FFA000',
    text: palette.gray900,
  },
  error: {
    base: palette.error,
    light: '#FFEBEE',
    dark: '#D32F2F',
    text: palette.white,
  },
  info: {
    base: palette.info,
    light: '#E3F2FD',
    dark: '#1976D2',
    text: palette.white,
  },
  pending: {
    base: palette.pending,
    light: '#FFF3E0',
    dark: '#F57C00',
    text: palette.gray900,
  },

  // Borders
  border: palette.gray300,
  borderFocus: palette.primary,

  // Transparent
  transparent: palette.transparent,

  // Others
  black: palette.black,
  white: palette.white,
};

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

export const paletteDark = {
  // Core colors (slightly brighter for dark backgrounds)
  primary: '#4A7BA7',
  primaryDark: '#2A4A6F',
  primaryLight: '#6B9FCC',
  secondary: '#F0B09A',
  secondaryDark: '#E29578',
  secondaryLight: '#F5C8B4',

  // Neutrals (inverted)
  black: '#FFFFFF',
  gray900: '#E0E0E0',
  gray800: '#C0C0C0',
  gray700: '#A0A0A0',
  gray600: '#888888',
  gray500: '#707070',
  gray400: '#555555',
  gray300: '#3A3A3A',
  gray200: '#2A2A2A',
  gray100: '#1E1E1E',
  white: '#121212',

  // Feedback colors (lighter variants for dark mode)
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  pending: '#FFA726',

  // Transparent
  transparent: 'transparent',
};

function buildColors(p: typeof palette) {
  return {
    // Primary
    primary: {
      base: p.primary,
      light: p.primaryLight,
      dark: p.primaryDark,
      text: p.white,
    },

    // Secondary
    secondary: {
      base: p.secondary,
      light: p.secondaryLight,
      dark: p.secondaryDark,
      text: p.gray900,
    },

    // UI elements
    background: p.white,
    backgroundSecondary: p.gray100,
    surface: p.white,
    surfaceSecondary: p.gray100,

    // Text
    textPrimary: p.gray900,
    textSecondary: p.gray700,
    textDisabled: p.gray500,
    textInverse: p.white,

    // Actions
    actionPrimary: p.primary,
    actionSecondary: p.secondary,
    actionDisabled: p.gray400,

    // Feedback
    success: {
      base: p.success,
      light: p === palette ? '#E8F5E9' : '#1B3A1B',
      dark: p === palette ? '#388E3C' : '#81C784',
      text: p.white,
    },
    warning: {
      base: p.warning,
      light: p === palette ? '#FFF8E1' : '#3A3520',
      dark: p === palette ? '#FFA000' : '#FFD54F',
      text: p.gray900,
    },
    error: {
      base: p.error,
      light: p === palette ? '#FFEBEE' : '#3A1B1B',
      dark: p === palette ? '#D32F2F' : '#EF9A9A',
      text: p.white,
    },
    info: {
      base: p.info,
      light: p === palette ? '#E3F2FD' : '#1B2A3A',
      dark: p === palette ? '#1976D2' : '#90CAF9',
      text: p.white,
    },
    pending: {
      base: p.pending,
      light: p === palette ? '#FFF3E0' : '#3A2A1B',
      dark: p === palette ? '#F57C00' : '#FFB74D',
      text: p.gray900,
    },

    // Borders
    border: p.gray300,
    borderFocus: p.primary,

    // Transparent
    transparent: p.transparent,

    // Others
    black: p.black,
    white: p.white,
  };
}

export const colors = buildColors(palette);
export const colorsDark = buildColors(paletteDark);

export type ThemeColors = typeof colors;

export const palette = {
  // Core colors
  primary: '#0F4A6C',
  primaryDark: '#0B334A',
  primaryLight: '#2D6F96',
  secondary: '#D97445',
  secondaryDark: '#B95D31',
  secondaryLight: '#EEA57F',
  accent: '#18A0B6',

  // Neutrals
  black: '#000000',
  gray900: '#122033',
  gray800: '#223247',
  gray700: '#3B4A5C',
  gray600: '#5D6875',
  gray500: '#808995',
  gray400: '#AEB4BD',
  gray300: '#D5DAE0',
  gray200: '#E8EBEF',
  gray100: '#F3F5F8',
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
  primary: '#5DA7D0',
  primaryDark: '#3E7FA8',
  primaryLight: '#84C0E1',
  secondary: '#F0A27E',
  secondaryDark: '#D98357',
  secondaryLight: '#F7BF9F',
  accent: '#42C8DE',

  // Neutrals (inverted)
  black: '#F8FAFC',
  gray900: '#E4E8EE',
  gray800: '#C8CFD9',
  gray700: '#AAB3C1',
  gray600: '#8B95A5',
  gray500: '#747D8D',
  gray400: '#596273',
  gray300: '#3E4757',
  gray200: '#252E3C',
  gray100: '#171F2B',
  white: '#0F141A',

  // Feedback colors (lighter variants for dark mode)
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  pending: '#FFA726',

  // Transparent
  transparent: 'transparent',
};

function buildColors(p: typeof palette, mode: 'light' | 'dark') {
  return {
    brand: {
      ocean: p.primary,
      ember: p.secondary,
      breeze: p.accent,
      ink: mode === 'light' ? '#11253A' : '#E6EEF8',
    },

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
    canvas: {
      base: p.white,
      raised: mode === 'light' ? '#FFFFFF' : '#172231',
      inset: mode === 'light' ? '#F3F5F8' : '#101926',
    },
    card: {
      base: mode === 'light' ? '#FFFFFF' : '#1A2636',
      elevated: mode === 'light' ? '#FFFFFF' : '#223247',
      muted: mode === 'light' ? '#F6F8FB' : '#151F2D',
      stroke: mode === 'light' ? '#D5DAE0' : '#314056',
    },

    // Text
    textPrimary: p.gray900,
    textSecondary: p.gray700,
    textDisabled: p.gray500,
    textInverse: mode === 'light' ? p.white : p.black,

    // Actions
    actionPrimary: p.primary,
    actionSecondary: p.secondary,
    actionDisabled: p.gray400,
    interactive: {
      primaryBg: p.primary,
      primaryText: p.white,
      secondaryBg: mode === 'light' ? '#E7F6FA' : '#173242',
      secondaryText: mode === 'light' ? '#0B4C62' : '#8CE3F2',
      quietBg: mode === 'light' ? '#F3F5F8' : '#1A2636',
      quietText: p.gray800,
    },

    // Feedback
    success: {
      base: p.success,
      light: mode === 'light' ? '#E8F5E9' : '#1B3A1B',
      dark: mode === 'light' ? '#388E3C' : '#81C784',
      text: p.white,
    },
    warning: {
      base: p.warning,
      light: mode === 'light' ? '#FFF8E1' : '#3A3520',
      dark: mode === 'light' ? '#FFA000' : '#FFD54F',
      text: p.gray900,
    },
    error: {
      base: p.error,
      light: mode === 'light' ? '#FFEBEE' : '#3A1B1B',
      dark: mode === 'light' ? '#D32F2F' : '#EF9A9A',
      text: p.white,
    },
    info: {
      base: p.info,
      light: mode === 'light' ? '#E3F2FD' : '#1B2A3A',
      dark: mode === 'light' ? '#1976D2' : '#90CAF9',
      text: p.white,
    },
    pending: {
      base: p.pending,
      light: mode === 'light' ? '#FFF3E0' : '#3A2A1B',
      dark: mode === 'light' ? '#F57C00' : '#FFB74D',
      text: p.gray900,
    },

    // Borders
    border: p.gray300,
    borderFocus: p.accent,

    // Home-specific semantic tones
    home: {
      heroStart: mode === 'light' ? '#0F4A6C' : '#1D3B56',
      heroEnd: mode === 'light' ? '#2B6F95' : '#25547A',
      heroAccent: mode === 'light' ? '#18A0B6' : '#42C8DE',
      chipBg: mode === 'light' ? '#E9F6FB' : '#1A3447',
      chipText: mode === 'light' ? '#0E4C67' : '#A7DEEA',
    },

    // Overlay
    overlay: {
      light: 'rgba(0, 0, 0, 0.25)',
      medium: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },

    // Transparent
    transparent: p.transparent,

    // Others
    black: p.black,
    white: p.white,
  };
}

export const colors = buildColors(palette, 'light');
export const colorsDark = buildColors(paletteDark, 'dark');

export type ThemeColors = typeof colors;
